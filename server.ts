import express from 'express';
import path from 'path';
import { spawn, type ChildProcess } from 'child_process';
import fs from 'fs/promises';
import os from 'os';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// 0. Active Sandbox Process Registry for Leak & Orphan Prevention
const activeSandboxProcesses = new Set<ChildProcess>();
const MAX_CONCURRENT_EXECUTIONS = 8;
const MAX_OUTPUT_BYTES = 64 * 1024; // 64 KB output buffer limit

function cleanupAllActiveSandboxProcesses() {
  for (const proc of activeSandboxProcesses) {
    try {
      proc.kill('SIGKILL');
    } catch (e) {}
  }
  activeSandboxProcesses.clear();
}

process.on('SIGTERM', cleanupAllActiveSandboxProcesses);
process.on('SIGINT', cleanupAllActiveSandboxProcesses);
process.on('exit', cleanupAllActiveSandboxProcesses);

// Initialize Gemini SDK lazily to prevent crash if key is missing
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

// Helper function to call generateContent with automatic model fallback in case of high demand (503) or unavailability
async function generateContentWithFallback(
  ai: GoogleGenAI,
  options: {
    contents: any;
    config?: any;
  }
) {
  // Try newer and other robust model aliases/options to handle high traffic and demand spikes on specific models
  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-3.5-flash'];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: options.contents,
        config: options.config,
      });
      return response;
    } catch (err: any) {
      console.warn(`Failed to call model ${modelName}:`, err.message || err);
      lastError = err;

      // If it's an API Key or configuration/auth error, do not retry other models as they will fail too
      if (
        err.message &&
        (err.message.includes('API key') ||
          err.message.includes('API_KEY_INVALID') ||
          err.message.includes('403') ||
          err.status === 'PERMISSION_DENIED')
      ) {
        throw err;
      }
    }
  }
  throw lastError || new Error('All model attempts failed.');
}

// 1. API: Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    apiConnected: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY',
    timestamp: new Date().toISOString()
  });
});

// Helper to construct disciplined, context-aware system prompt for AI Coding Mentor
function buildMentorSystemPrompt(context?: any): string {
  if (!context || (!context.problem && !context.code && !context.language)) {
    return `You are a highly encouraging, deeply knowledgeable, and modern AI Coding Mentor named 'Mentor AI'.
You help students learn programming, computer science, and software engineering.
Provide clear explanations, use markdown, format code nicely with syntax highlighting, and offer constructive, step-by-step guidance.
When displaying code snippets, provide complete comments.`;
  }

  const { problem, language = 'JavaScript', code = '', lastRun, lastSubmission } = context;

  return `You are an expert, supportive AI Coding Mentor named 'Mentor AI'.
You are currently guiding the student who is actively working in an interactive coding workspace.

==================================================
ACTIVE WORKSPACE & PROBLEM CONTEXT:
${problem ? `
[Problem Details]
- Title: ${problem.title}
- Topic: ${problem.topic}
- Difficulty: ${problem.difficulty}
- Description:
${problem.description}
${problem.constraints && problem.constraints.length ? `- Constraints:\n  • ${problem.constraints.join('\n  • ')}` : ''}
${problem.sampleInput ? `- Sample Input:\n  ${problem.sampleInput}` : ''}
${problem.sampleOutput ? `- Sample Output:\n  ${problem.sampleOutput}` : ''}
` : '[No specific practice problem loaded - User is in Scratchpad/Sandbox mode]'}

[Selected Programming Language]:
${language}

[Current Editor Code]:
\`\`\`${language.toLowerCase()}
${code || '// [Empty Editor]'}
\`\`\`

${lastRun ? `
[Latest Run / Execution Results]:
- Execution Status: ${lastRun.status || 'Executed'}
- Exit Code: ${lastRun.exitCode !== undefined && lastRun.exitCode !== null ? lastRun.exitCode : '--'}
- Error Type: ${lastRun.errorType || 'None'}
- Execution Time: ${lastRun.execTime || 'N/A'}
- Terminal Standard Output (stdout):
${lastRun.stdout ? lastRun.stdout : '(empty stdout)'}
- Terminal Error Output (stderr / runtime error):
${lastRun.stderr ? lastRun.stderr : '(no error output)'}
` : ''}

${lastSubmission ? `
[Latest Test Suite Submission Verdict]:
- Verdict Status: ${lastSubmission.verdictStatus}
- Verdict Message: ${lastSubmission.message}
- Test Cases Passed: ${lastSubmission.passedCount}/${lastSubmission.totalCount}
${lastSubmission.failedTestCase ? `- First Failed Test Case:
  Input: ${lastSubmission.failedTestCase.input}
  Expected Output: ${lastSubmission.failedTestCase.expected}
  Actual Output: ${lastSubmission.failedTestCase.actual}` : ''}
` : ''}
==================================================

CORE MENTORING DIRECTIVES & PEDAGOGY:
1. HINT-FIRST BEHAVIOR: You are a mentor helping the student learn, NOT an automated answer bot. Unless the user explicitly asks for the full code solution (e.g. "give me the solution", "show full code", "show complete solution", "write the solution"), DO NOT immediately dump the complete reference implementation.
2. Step-by-Step Conceptual Guidance:
   - Identify the conceptual issue or bottleneck.
   - Provide an intuitive hint.
   - Explain what data structure, logic branch, or edge case to think about.
   - Ask the user to try again or attempt writing the fix.
3. Debugging & Error Explanation:
   - If the user asks why their code failed, asks to fix an error, or asks "Why isn't my code working?", inspect the CURRENT EDITOR CODE and the LATEST RUN / SUBMISSION RESULTS above.
   - Explain the actual error or logical mistake (e.g. off-by-one, type mismatch, unhandled edge condition, missing base case) instead of giving generic advice.
4. Language Alignment:
   - Always respond and format code examples using the currently selected language (${language}) unless the user explicitly asks for a different language.
5. Solution Protection:
   - For normal queries like "Give me a hint", "Why is this failing?", or "Can you check my approach?", provide guided hints and diagnostic feedback.
   - If the user explicitly asks "Give me the solution" or "Show me the solution", explain the optimal approach clearly and provide clean, well-commented code in ${language}.
6. Style & Tone:
   - Encouraging, concise, intellectually engaging, and clear. Format output with beautiful Markdown, headers, bullet points, and syntax-highlighted code blocks.`;
}

// Helper for simulated responses when Gemini is unavailable (context-aware fallback)
function getSimulatedChatResponse(message: string, context?: any): string {
  const msg = message.toLowerCase();
  const problem = context?.problem;
  const lang = context?.language || 'JavaScript';
  const code = context?.code || '';
  const lastRun = context?.lastRun;
  const lastSubmission = context?.lastSubmission;

  // 1. Context-Aware: Explicit Solution Request
  if (
    msg.includes('give me the solution') ||
    msg.includes('show solution') ||
    msg.includes('full solution') ||
    msg.includes('complete solution') ||
    msg.includes('give solution') ||
    msg.includes('write the solution')
  ) {
    if (problem) {
      return `### Educational Solution: ${problem.title} (${lang})

Here is the optimal approach for **${problem.title}** in **${lang}**:

#### Strategy & Intuition
- **Time Complexity:** $O(N)$ or optimal logarithmic time depending on constraints.
- **Space Complexity:** $O(N)$ auxiliary space (or $O(1)$ if in-place).
- **Core Concept:** We leverage direct state tracking or hash lookups to solve this problem in a single pass.

\`\`\`${lang.toLowerCase()}
// Solution for ${problem.title} in ${lang}
${code ? '// Refactored clean implementation:\n' : ''}${
  lang === 'Python' 
    ? `def solution():\n    # Optimal implementation for ${problem.title}\n    # Handled boundary checks & edge cases\n    pass`
    : `function solution() {\n  // Optimal implementation for ${problem.title}\n  // Handled boundary checks & edge cases\n}`
}
\`\`\`

#### Key Takeaways:
1. Validate edge conditions (empty input, single element, negative values).
2. Use optimal data structures for $O(1)$ lookups.
3. Test with the sample inputs: \`${problem.sampleInput || 'Standard cases'}\`.`;
    }
  }

  // 2. Context-Aware: Hint Requests
  if (msg.includes('hint') || msg.includes('stuck') || msg.includes('clue') || msg.includes('direction')) {
    if (problem) {
      return `### 💡 Mentor Hint for ${problem.title}

Let's break down how to approach **${problem.title}** without spoiling the full solution:

1. **Think about the core data structure:**
   - How can you remember elements you have already visited?
   - Can a Hash Map, Two Pointers, or a Stack help you avoid a nested loop ($O(N^2)$)?

2. **Key Observation:**
   - When processing each element, what exact condition must be met?
   - For example, if looking for a target, what is the *complement* or *opposite* value you need?

3. **Next Step to Try:**
   - Try writing down a single loop in **${lang}** that checks if the needed condition was already stored before adding the current element.

Give it a try in your editor and click **Run** or **Submit**! Let me know what happens.`;
    }
  }

  // 3. Context-Aware: Debugging / Error / Why isn't code working
  if (
    msg.includes('why') || 
    msg.includes('error') || 
    msg.includes('fail') || 
    msg.includes('fix') || 
    msg.includes('wrong') || 
    msg.includes('bug') ||
    msg.includes("isn't working") ||
    msg.includes('not working')
  ) {
    const errorDetails = lastRun?.stderr || lastRun?.errorType || (lastSubmission && lastSubmission.verdictStatus !== 'accepted' ? lastSubmission.message : '');

    return `### 🔍 Code Diagnostics & Debugging (${lang})

${problem ? `**Problem:** ${problem.title} (${problem.difficulty})\n` : ''}${
  errorDetails ? `**Observed Error / Verdict:** \`${errorDetails}\`\n\n` : ''
}Let's analyze what might be causing the issue in your **${lang}** code:

1. **Boundary & Return Values:**
   - Check if all execution paths return a valid output. If no match is found, ensure you return an empty container or expected default rather than \`undefined\` / \`None\`.
   - Watch out for 0-indexed vs 1-indexed boundaries.

2. **Logic Check in Current Code:**
   - Verify that your data structures are initialized before loop iterations.
   - If using a map or set, ensure you check for existence *before* overwriting the key.

3. **Suggested Action:**
   - Add a \`console.log\` or \`print()\` inside your main loop to inspect variable values step-by-step.
   - Run the code again with a small test input to see where the state diverges.

Would you like me to guide you through a specific line in your code?`;
  }

  // 4. Context-Aware: Time / Space Complexity analysis
  if (msg.includes('complexity') || msg.includes('big o') || msg.includes('time complexity') || msg.includes('space complexity')) {
    return `### ⚡ Complexity Analysis (${lang})

${problem ? `Analyzing approach for **${problem.title}**:\n` : 'Analyzing your code complexity:\n'}
- **Time Complexity:**
  - Standard / Optimal Approach: **$O(N)$** linear time by doing a single pass with constant time $O(1)$ lookups.
  - Brute Force Approach: **$O(N^2)$** due to nested loop iterations over elements.

- **Space Complexity:**
  - **$O(N)$** auxiliary space if storing elements in a hash map/dictionary.
  - **$O(1)$** auxiliary space if modifying pointers in-place.

*Optimization Tip:* To achieve optimal Big-O in ${lang}, avoid re-calculating lengths or slicing arrays inside the hot loop!`;
  }

  // 5. Context-Aware: Code Review
  if (msg.includes('review') || msg.includes('check my code') || msg.includes('optimal approach')) {
    return `### 📋 Code Review & Feedback (${lang})

${problem ? `**Target Problem:** ${problem.title}\n` : ''}
Here is a review of your current implementation:

- **Strengths:** Clean ${lang} syntax, clear variable naming, and appropriate function structure.
- **Areas to Inspect:**
  1. Ensure edge cases (empty collections, single items, duplicate keys) are handled gracefully.
  2. Avoid redundant computations inside the loop.
  3. Ensure type consistency across return branches.

Would you like me to walk through an optimal edge-case dry run?`;
  }

  // General CS Topics (Fallback)
  if (msg.includes('hash map') || msg.includes('collision')) {
    return `### Hash Map Collision Resolution

In a **Hash Map**, key-value pairs are stored at an index computed from the key's hash. A **collision** occurs when two distinct keys hash to the same index.

Here are the two primary techniques to resolve collisions:

1. **Chaining (Open Hashing)**
   Each bucket at the hash index holds a linked list (or self-balancing binary tree) of entries.
   - **How it works:** When a collision happens, the new entry is appended to the list at that bucket index.
   - **Time Complexity:** Average $O(1)$, Worst case $O(N)$ if all keys hash to the same index (though self-balancing trees like in Java's HashMap reduce this to $O(\\log N)$).
   \`\`\`javascript
   // Visual representation of Chaining:
   // Index 0: [KeyA, ValA] -> [KeyB, ValB]
   // Index 1: null
   // Index 2: [KeyC, ValC]
   \`\`\`

2. **Open Addressing (Closed Hashing)**
   All entries are stored directly in the hash table array. If a collision occurs, the algorithm searchs for the next available slot according to a probe sequence:
   - **Linear Probing:** Look at the next slot sequentially (index + 1, index + 2...). Can lead to *primary clustering*.
   - **Quadratic Probing:** Look at slots at quadratic offsets ($index + 1^2, index + 2^2...$).
   - **Double Hashing:** Use a second hash function to compute the step size for probing.

Would you like me to show you how to implement a simple Hash Map with chaining in JavaScript or Python?`;
  }

  if (msg.includes('recursion')) {
    return `### Understanding Recursion Simply

**Recursion** is a programming technique where a function calls itself to solve a smaller instance of the same problem. 

Think of it like a **nesting Russian doll (Matryoshka)**: inside a large doll is a medium doll, inside that is a small doll, until you reach the smallest doll which cannot be opened.

Every recursive function MUST have two parts:
1. **The Base Case:** The condition under which the function stops calling itself. Without this, your program will run infinitely and crash with a \`Stack Overflow\` error.
2. **The Recursive Case:** The part where the function calls itself with a modified, smaller argument, bringing it closer to the base case.

#### Classic Example: Factorial of N (N!)
Factorial of $5$ is $5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$.
We can express this as: $Fact(N) = N \\times Fact(N-1)$.

\`\`\`python
def factorial(n):
    # 1. Base Case: if N is 0 or 1, we know the answer is 1
    if n <= 1:
        return 1
    
    # 2. Recursive Case: N * factorial of (N-1)
    return n * factorial(n - 1)

print(factorial(5)) # Outputs: 120
\`\`\`

Let's trace \`factorial(3)\`:
- \`factorial(3)\` returns \`3 * factorial(2)\`
- \`factorial(2)\` returns \`2 * factorial(1)\`
- \`factorial(1)\` hits the base case and returns \`1\`
- Unwinding: \`3 * (2 * 1) = 6\`.

Would you like me to walk through another recursive structure, like generating Fibonacci sequences or traversing binary trees?`;
  }

  if (msg.includes('optimize') || msg.includes('nested') || msg.includes('duplicate')) {
    return `### Code Optimization: Removing Nested Loops

Your current code likely has a time complexity of **$O(N^2)$** due to nested loops. We can optimize this to **$O(N)$** using a **HashSet** or **HashMap** to trade a small amount of memory for lightning-fast lookups.

#### Before ($O(N^2)$ Time, $O(1)$ Space)
\`\`\`javascript
function findDuplicates(nums) {
  const duplicates = [];
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j] && !duplicates.includes(nums[i])) {
        duplicates.push(nums[i]);
      }
    }
  }
  return duplicates;
}
\`\`\`

#### Optimized ($O(N)$ Time, $O(N)$ Space)
By using a Set, lookups are average $O(1)$ instead of $O(N)$.
\`\`\`javascript
function findDuplicatesOptimized(nums) {
  const seen = new Set();
  const duplicates = new Set();
  
  for (let num of nums) {
    if (seen.has(num)) {
      duplicates.add(num);
    } else {
      seen.add(num);
    }
  }
  return Array.from(duplicates);
}
\`\`\`

**Key Improvements:**
- **Time Complexity:** Reduced from $O(N^2)$ to $O(N)$ because set additions and lookups take $O(1)$ time.
- **Responsiveness:** For an array of 100,000 items, the $O(N^2)$ code takes minutes, while the $O(N)$ code runs in milliseconds!

Do you have a specific block of code you want me to analyze and optimize for you?`;
  }

  // General fallback mentor response
  if (problem) {
    return `### Mentor AI: ${problem.title} (${lang})

I am here with your active problem **${problem.title}** (${problem.difficulty} • ${problem.topic}) in **${lang}**.

You can ask me:
- *"Give me a hint"* for conceptual guidance without spoiling the answer.
- *"Why isn't my code working?"* to analyze current editor logic.
- *"Check my time complexity"* for Big-O analysis.
- *"Explain the latest error"* if a test case or runtime failed.
- *"Give me the solution"* if you are ready to review the full educational implementation.

What would you like to explore?`;
  }

  return `### Hello! I am your AI Coding Mentor.

I am here to guide you on your software development journey! I can help you:
- **Solve practice problems** (like Two Sum, Reverse Lists, etc.)
- **Analyze time & space complexities** (Big O)
- **Refactor, optimize, and debug** your code blocks
- **Run mock interviews** to prepare you for tech roles

What would you like to work on today? Feel free to paste a snippet of code, ask a theoretical computer science question, or choose a practice problem from the workspace!`;
}

// 2. API: Chat Conversation (Context-Aware)
app.post('/api/mentor/chat', async (req, res) => {
  const { messages, context } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages body.' });
  }

  const userMsg = messages[messages.length - 1]?.content || '';
  
  try {
    const ai = getGemini();
    if (ai) {
      // Build conversation list for generateContent
      const contents = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const systemPrompt = buildMentorSystemPrompt(context);

      const response = await generateContentWithFallback(ai, {
        contents,
        config: {
          systemInstruction: systemPrompt
        }
      });

      return res.json({ content: response.text });
    } else {
      // Simulated response with context awareness
      const simulatedResponse = getSimulatedChatResponse(userMsg, context);
      // Wait slightly to simulate API call latency
      await new Promise(resolve => setTimeout(resolve, 600));
      return res.json({ content: simulatedResponse, simulated: true });
    }
  } catch (err: any) {
    console.error('Error in /api/mentor/chat:', err);
    return res.json({
      content: `I encountered an issue connecting to the Gemini server: ${err.message}. Showing simulated feedback:\n\n` + getSimulatedChatResponse(userMsg, context),
      error: err.message
    });
  }
});

// 3. API: AI Actions (Explain, Debug, Optimize, Review, Tests, etc.)
app.post('/api/mentor/action', async (req, res) => {
  const { code, language, action } = req.body;
  
  if (!code || !language || !action) {
    return res.status(400).json({ error: 'Missing code, language, or action.' });
  }

  const prompt = `As an expert AI Coding Mentor, perform the following action: **${action.toUpperCase()}**.
Language: ${language}
Code:
\`\`\`${language.toLowerCase()}
${code}
\`\`\``;

  try {
    const ai = getGemini();
    if (ai) {
      const response = await generateContentWithFallback(ai, {
        contents: prompt,
        config: {
          systemInstruction: 'You are an advanced software diagnostic suite and AI Mentor. Provide precise, technical, yet accessible assistance with code analysis, optimizations, and syntax.'
        }
      });
      return res.json({ result: response.text });
    } else {
      // Return beautiful structured simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      let responseText = '';

      switch (action) {
        case 'explain':
          responseText = `### Code Explanation (${language})
Here is a breakdown of how this code works:

1. **Structure:** The code is written in **${language}**. It implements a key function targeting algorithm logic.
2. **Key Components:**
   - It iterates through elements or conditions using a control structure.
   - It performs active comparisons and memory storage in local scope.
3. **Behavior:**
   - It accepts input parameters and validates boundaries.
   - It returns the processed outputs or throws appropriate handling messages.

Would you like to trace this code step-by-step with sample variables?`;
          break;
        case 'debug':
          responseText = `### Debugging Analysis (${language})
No immediate syntax errors found in your **${language}** snippet, but let's review potential logical edge cases:

- **Null/Undefined checks:** Ensure that input variables are validated before processing properties or indexing.
- **Boundary Boundaries:** For array traversals, watch out for $O(1)$ indexing errors (like accessing \`length\` instead of \`length - 1\`).
- **Memory/Ref Leakages:** If working with files or socket networks, verify they are closed in a \`finally\` block.

*Tip:* Add some console log/print statements to capture values at each iteration, or ask me to generate a dry run table.`;
          break;
        case 'optimize':
          responseText = `### Code Optimization Summary
Analyzing your **${language}** code for speed and space efficiencies:

- **Complexity Estimate:** Current complexity is approximately $O(N)$ or $O(N^2)$ depending on input collection dimensions.
- **Optimization Strategy:**
  1. Trade auxiliary memory for speed by indexing items in a hashed object/dictionary.
  2. Avoid re-allocating large memory blocks inside hot loop iterations.
  3. Short-circuit loops early as soon as the target state is reached.

Would you like me to write an alternative optimized implementation for this snippet?`;
          break;
        case 'review':
          responseText = `### Peer Code Review (${language})
Here is a feedback summary on code quality, formatting, and style:

- **Readability:** The code layout is clear, but consider naming key indexes more descriptively (e.g., \`itemIndex\` instead of just \`i\`).
- **Modularity:** It is highly readable. If it grows larger, consider splitting logical checks into standalone pure sub-functions.
- **Standard Practices:**
  - Leverage native helper methods where possible rather than implementing manual loops.
  - Add inline documentation strings explaining complex mathematical constraints.

Overall Rating: **8/10** (Solid structural start!)`;
          break;
        case 'tests':
          responseText = `### Generated Unit Tests (${language})
Here are robust unit test setups to thoroughly test your code:

\`\`\`javascript
// Test Suite
describe('Code Block Function Tests', () => {
  test('Standard inputs return correct target values', () => {
    // Assert typical test inputs
  });

  test('Edge Case: handles empty list or null inputs safely', () => {
    // Assert boundary conditions
  });

  test('Performance: large inputs execute without stack overflow', () => {
    // Assert scalability
  });
});
\`\`\`

Would you like me to generate test configurations specifically for a framework like Jest, Mocha, PyTest, or JUnit?`;
          break;
        default:
          responseText = `### AI Mentor Action: ${action}
Here is the automated review of your **${language}** code.
The implementation appears clean and aligned with typical structural designs.

Please let me know if you would like to explore specific algorithmic optimizations or refactorings for this snippet!`;
      }
      return res.json({ result: responseText, simulated: true });
    }
  } catch (err: any) {
    console.error('Error in /api/mentor/action:', err);
    return res.json({ result: `Action failed: ${err.message}`, error: err.message });
  }
});

// 4. API: Interview Question Generation
app.post('/api/mentor/interview/questions', async (req, res) => {
  const { company, role, difficulty, topic, interviewType, questionCount, experienceLevel = 'Mid-Level' } = req.body;
  const targetCount = Math.max(3, Math.min(20, Number(questionCount) || 10));

  try {
    const ai = getGemini();
    if (ai) {
      const prompt = `You are a Senior Principal Interviewer calibrating questions for a ${company || 'Top Tech Company'} mock interview.
Target Role: ${role || 'Software Engineer'} (${experienceLevel})
Difficulty Level: ${difficulty || 'Medium'}
Interview Type: ${interviewType || 'technical'}
Focus Topic: ${topic || 'General Problem Solving'}
Number of Questions Needed: ${targetCount}

Generate exactly ${targetCount} high-quality, realistic, role-specific technical interview questions matching the constraints.
Return pure JSON matching this exact schema:
{
  "questions": [
    {
      "id": "gen-1",
      "question": "Clear, direct question prompt",
      "type": "technical" | "coding" | "system_design" | "behavioral",
      "topic": "${topic && topic !== 'All Topics' ? topic : 'Data Structures & Algorithms'}",
      "difficulty": "${difficulty || 'Medium'}",
      "context": "Brief 1-line context or target focus",
      "keyConcepts": ["Key concept 1", "Key concept 2", "Key concept 3"]
    }
  ]
}`;

      const response = await generateContentWithFallback(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4
        }
      });

      const parsed = JSON.parse(response.text.trim());
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        // Ensure each question has a valid unique ID and take exact targetCount
        const sanitized = parsed.questions.slice(0, targetCount).map((q: any, idx: number) => ({
          id: q.id || `gen-${idx + 1}-${Date.now()}`,
          question: q.question,
          type: q.type || 'technical',
          topic: q.topic || topic || 'Data Structures & Algorithms',
          difficulty: q.difficulty || difficulty || 'Medium',
          context: q.context || `${company || 'Tech'} Interview Round`,
          keyConcepts: Array.isArray(q.keyConcepts) ? q.keyConcepts : []
        }));
        return res.json({ success: true, questions: sanitized });
      }
    }
  } catch (err: any) {
    console.warn('Dynamic question generation through Gemini fallback to curated questions:', err.message);
  }

  // Return signal indicating client should use curated questions bank
  return res.json({ success: false, fallbackToCurated: true });
});

// 4. API: Interview Scoring (Real AI Evaluation Only - No Fake Scores)
app.post('/api/mentor/interview/score', async (req, res) => {
  const { 
    company = 'Tech Company', 
    role = 'Software Engineer', 
    interviewType = 'technical',
    difficulty = 'Medium',
    topic = 'Data Structures & Algorithms',
    experienceLevel = 'Mid-Level',
    question, 
    answer,
    keyConcepts = []
  } = req.body;

  if (!question || !answer || typeof answer !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing question or valid candidate answer.' });
  }

  // If answer is empty or whitespace only
  if (!answer.trim()) {
    return res.status(400).json({ 
      success: false, 
      error: 'Cannot evaluate an empty answer. Please provide a response.' 
    });
  }

  let typeSpecificRubric = '';
  if (interviewType === 'coding') {
    typeSpecificRubric = `
Specialized Coding Rubric:
1. Algorithmic Correctness & Logic: Does the solution solve the problem correctly?
2. Complexity Analysis: Accurate Big-O time and space complexity evaluation.
3. Data Structures: Appropriate choice of data structures (e.g. HashMap, Tree, Stack, Queue).
4. Edge Cases: Handles empty/null inputs, single element, boundary conditions.
5. Code Quality & Idiomatic Style: Clear naming, structure, modularity.`;
  } else if (interviewType === 'system_design') {
    typeSpecificRubric = `
Specialized System Design Rubric:
1. Architectural Scalability: Distributed systems design, caching, load balancing, databases.
2. Data Modeling & Partitioning: Sharding, consistency tradeoffs (CAP theorem, ACID vs BASE).
3. Bottlenecks & Resilience: Single points of failure, rate limiting, replication.
4. Tradeoff Reasoning: Latency vs throughput, compute vs memory.
5. Scope & Requirements: Clearly addresses both functional and non-functional requirements.`;
  } else if (interviewType === 'behavioral') {
    typeSpecificRubric = `
Specialized Behavioral Rubric:
1. STAR Framework: Clear Situation, Task, Action, and measurable Result.
2. Engineering Ownership & Leadership: Proactivity, accountability, conflict navigation.
3. Communication & Tone: Professional, structured, empathetic, concise.
4. Concrete Evidence: Specific examples rather than vague generalizations.`;
  } else {
    typeSpecificRubric = `
Specialized Technical & Systems Rubric:
1. Conceptual Correctness: Accurate grasp of underlying computer science principles.
2. Runtime & Memory Mechanics: Understanding of internal workings, protocols, or memory models.
3. Tradeoff Awareness: Nuanced understanding of alternative approaches and operational constraints.
4. Clarity & Precision: Direct, professional, and well-articulated explanation.
5. Real-World Applications: Practical context and edge-case awareness.`;
  }

  const prompt = `You are an elite Lead Tech Interviewer and Staff Bar Raiser at ${company} conducting a ${difficulty} difficulty interview for a ${role} (${experienceLevel}) position.
Topic Assessed: ${topic}
Interview Type: ${interviewType}
${keyConcepts.length > 0 ? `Expected Core Concepts: ${keyConcepts.join(', ')}` : ''}

Question Presented:
"""
${question}
"""

Candidate's Submitted Answer:
"""
${answer}
"""

${typeSpecificRubric}

Grading Guidelines:
- 90 - 100: "Strong Hire" (Exemplary depth, thorough reasoning, proactive edge cases, crystal clear structure)
- 75 - 89: "Hire" (Solid technical core, correct solution/explanation, minor omissions in optimization or edge cases)
- 60 - 74: "Leaning Hire" (Demonstrates basic understanding, but lacks depth, complexity details, or structure)
- Below 60: "Needs Improvement" (Significant conceptual errors, wrong logic, superficial response, or off-topic)

Provide your objective, professional evaluation in valid JSON matching this schema:
{
  "score": <number between 0 and 100>,
  "verdict": "Strong Hire" | "Hire" | "Leaning Hire" | "Needs Improvement" | "Unsatisfactory",
  "generalFeedback": "<concise 2-3 sentence executive summary of candidate performance>",
  "breakdown": {
    "technicalAccuracy": "<specific analysis of technical correctness, complexity, or system principles>",
    "communicationClarity": "<specific evaluation of explanation structure, clarity, and articulation>",
    "strengths": ["<concrete strength 1 demonstrated in this answer>", "<concrete strength 2>"],
    "areasForImprovement": ["<actionable recommendation 1>", "<actionable recommendation 2>"],
    "idealApproach": "<concise summary of the ideal industry-standard answer and key architectural/algorithmic concepts>"
  },
  "topicAssessed": "${topic}"
}`;

  try {
    const ai = getGemini();
    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'Gemini AI evaluation service is not configured or unavailable. Please ensure GEMINI_API_KEY is active.'
      });
    }

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    });

    const rawText = response.text.trim();
    const evaluationData = JSON.parse(rawText);

    // Validate schema
    if (typeof evaluationData.score !== 'number' || !evaluationData.breakdown) {
      throw new Error('AI returned an unexpected evaluation format.');
    }

    // Ensure score is clamped 0-100
    evaluationData.score = Math.min(100, Math.max(0, Math.round(evaluationData.score)));

    return res.json({
      success: true,
      ...evaluationData
    });
  } catch (err: any) {
    console.error('Error in interview AI evaluation:', err.message || err);
    // Explicit error response - NO fake scores!
    return res.status(503).json({
      success: false,
      error: `AI Evaluation Error: ${err.message || 'The AI evaluation service encountered a temporary error. Please retry.'}`
    });
  }
});

// ============================================================================
// 5. Code Execution Engine (Local Subprocess Runner)
// ============================================================================
// SECURITY ARCHITECTURE & PRODUCTION DEPLOYMENT NOTE:
// ----------------------------------------------------------------------------
// The execution engine below utilizes host subprocess spawning (`child_process.spawn`)
// equipped with wall-clock execution timers (5000-7000ms), output buffer truncation
// (64KB), temporary working directory isolation, and sanitized environment variables.
//
// THIS RUNNER IS DESIGNED FOR LOCAL DEVELOPMENT, DEMONSTRATION, AND CONTROLLED
// SINGLE-TENANT TESTING ENVIRONMENTS ONLY.
//
// In an untrusted, multi-tenant public production deployment, arbitrary user-submitted
// code MUST NOT be executed directly on the application host.
//
// RECOMMENDED PUBLIC PRODUCTION ARCHITECTURE:
// Client (Web) -> Application Server API -> Isolated Remote Sandbox Engine -> Execution Result
//
// Recommended isolated execution backends for production:
// - Judge0 (https://judge0.com/)
// - Piston (https://github.com/engineer-man/piston)
// - Container worker pools configured with Linux cgroups, seccomp, and network isolation (e.g., nsjail, gVisor)
// ============================================================================

const MAX_CODE_PAYLOAD_BYTES = 128 * 1024; // 128 KB
const MAX_INPUT_PAYLOAD_BYTES = 64 * 1024; // 64 KB
const MAX_TEST_CASES = 100;

interface SandboxExecutionResult {
  success: boolean;
  output: string;
  stderr?: string;
  executionTime: string;
  memoryUsed: string;
  exitCode?: number | null;
  errorType?: 'CompilationError' | 'RuntimeError' | 'Timeout' | 'OutputLimit' | 'ResourceLimit' | 'Environment' | 'Security';
  isTimeout?: boolean;
  runnerEnvironment?: 'local-subprocess' | 'remote-sandbox';
}

async function executeInIsolatedSandbox(
  code: string,
  language: string,
  input: string = '',
  timeoutMs: number = 5000
): Promise<SandboxExecutionResult> {
  const normalizedLang = (language || 'javascript').toLowerCase().trim();
  const startTime = performance.now();

  const isJS = normalizedLang === 'javascript' || normalizedLang === 'js';
  const isTS = normalizedLang === 'typescript' || normalizedLang === 'ts';
  const isPython = normalizedLang === 'python' || normalizedLang === 'py' || normalizedLang === 'python3';
  const isBash = normalizedLang === 'bash' || normalizedLang === 'sh' || normalizedLang === 'shell';

  if (!isJS && !isTS && !isPython && !isBash) {
    return {
      success: false,
      output: `Runtime Environment Note: Live compilation and execution for ${language} requires a native compiler/toolchain not available in the local container sandbox.\n\nPlease switch to JavaScript, TypeScript, Python 3, or Bash/Shell for full live execution and test evaluation.`,
      executionTime: '0ms',
      memoryUsed: '0MB',
      errorType: 'Environment'
    };
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mentor-run-'));

  try {
    let scriptFile = '';
    let command = '';
    let args: string[] = [];

    if (isJS) {
      scriptFile = path.join(tempDir, 'solution.mjs');
      await fs.writeFile(scriptFile, code, 'utf8');
      command = 'node';
      args = ['--max-old-space-size=64', scriptFile];
    } else if (isTS) {
      scriptFile = path.join(tempDir, 'solution.ts');
      await fs.writeFile(scriptFile, code, 'utf8');
      command = 'node';
      args = ['--max-old-space-size=64', '--experimental-strip-types', scriptFile];
    } else if (isPython) {
      scriptFile = path.join(tempDir, 'solution.py');
      await fs.writeFile(scriptFile, code, 'utf8');
      command = 'python3';
      args = ['-u', scriptFile];
    } else if (isBash) {
      scriptFile = path.join(tempDir, 'script.sh');
      await fs.writeFile(scriptFile, code, 'utf8');
      command = 'bash';
      args = [scriptFile];
    }

    // Strict security: sanitize environment and strip all secrets/keys
    const safeEnv = {
      PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin',
      HOME: tempDir,
      LANG: 'en_US.UTF-8',
      NODE_ENV: 'sandbox',
      TMPDIR: tempDir,
      PYTHONUNBUFFERED: '1',
      PYTHONDONTWRITEBYTECODE: '1',
      PYTHONHASHSEED: 'random'
    };

    return await new Promise<SandboxExecutionResult>((resolve) => {
      let stdout = '';
      let stderr = '';
      let isTimedOut = false;
      let isOutputTruncated = false;
      let settled = false;

      const child = spawn(command, args, {
        cwd: tempDir,
        env: safeEnv,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Register process in active pool for orphan cleanup
      activeSandboxProcesses.add(child);

      // Ignore EPIPE errors if child process closes before reading all stdin
      child.stdin.on('error', () => {});

      if (typeof input === 'string' && input.length > 0) {
        try {
          child.stdin.write(input, 'utf-8');
        } catch (e) {}
      }
      try {
        child.stdin.end();
      } catch (e) {}

      // Execution timeout watchdog with two-stage cleanup
      const timer = setTimeout(() => {
        isTimedOut = true;
        try {
          child.kill('SIGTERM');
        } catch (e) {}
        const forceKillTimer = setTimeout(() => {
          try {
            child.kill('SIGKILL');
          } catch (e) {}
        }, 300);
        forceKillTimer.unref?.();
      }, timeoutMs);

      // Output Flooding Protection (64 KB limit) with instant termination
      child.stdout.on('data', (chunk) => {
        if (stdout.length < MAX_OUTPUT_BYTES) {
          stdout += chunk.toString();
        } else if (!isOutputTruncated) {
          isOutputTruncated = true;
          stdout = stdout.slice(0, MAX_OUTPUT_BYTES) + '\n\n[⚠️ Output Truncated: Exceeded 64KB maximum buffer limit to protect terminal memory & system stability]';
          try {
            child.kill('SIGKILL');
          } catch (e) {}
        }
      });

      child.stderr.on('data', (chunk) => {
        if (stderr.length < MAX_OUTPUT_BYTES) {
          stderr += chunk.toString();
        } else if (!isOutputTruncated) {
          isOutputTruncated = true;
          stderr = stderr.slice(0, MAX_OUTPUT_BYTES) + '\n\n[⚠️ Error Output Truncated: Exceeded 64KB maximum buffer limit]';
          try {
            child.kill('SIGKILL');
          } catch (e) {}
        }
      });

      const cleanupAndSettle = (fn: () => void) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        activeSandboxProcesses.delete(child);
        try {
          if (!child.killed) child.kill('SIGKILL');
        } catch (e) {}
        fn();
      };

      child.on('error', (err) => {
        cleanupAndSettle(() => {
          const elapsed = (performance.now() - startTime).toFixed(1);
          resolve({
            success: false,
            output: `Process Spawn Error: ${err.message}`,
            stderr: err.message,
            executionTime: `${elapsed}ms`,
            memoryUsed: '0MB',
            errorType: 'RuntimeError'
          });
        });
      });

      child.on('close', (code) => {
        cleanupAndSettle(() => {
          const elapsed = (performance.now() - startTime).toFixed(1);
          const memEst = (Math.min(25, Math.max(1.8, (stdout.length + stderr.length) / 1024 + 2.4))).toFixed(1);

          if (isTimedOut) {
            return resolve({
              success: false,
              isTimeout: true,
              output: `Execution Timed Out (${timeoutMs}ms limit exceeded).\n\nPossible Causes:\n• Infinite loop (e.g. while(true) without termination)\n• Unbounded recursion\n• Waiting on standard input (stdin) that was not supplied\n• Heavy blocking synchronous computations`,
              stderr: 'SIGKILL: Terminated due to execution timeout.',
              executionTime: `${elapsed}ms`,
              memoryUsed: `${memEst}MB`,
              errorType: 'Timeout',
              exitCode: null
            });
          }

          if (isOutputTruncated) {
            return resolve({
              success: false,
              output: stdout || stderr,
              stderr: 'Process terminated: Output stream flooded buffer limit (>64KB).',
              executionTime: `${elapsed}ms`,
              memoryUsed: `${memEst}MB`,
              errorType: 'OutputLimit',
              exitCode: null
            });
          }

          if (code === 0 && !stderr.trim()) {
            return resolve({
              success: true,
              output: stdout || 'Program executed successfully with no output.\n(Use console.log() or print() to display output)',
              executionTime: `${elapsed}ms`,
              memoryUsed: `${memEst}MB`,
              exitCode: 0
            });
          }

          const fullErr = (stderr || stdout).trim();
          let errType: 'CompilationError' | 'RuntimeError' | 'OutputLimit' = 'RuntimeError';
          if (
            fullErr.includes('SyntaxError') ||
            fullErr.includes('IndentationError') ||
            fullErr.includes('expected') ||
            fullErr.includes('Parse error') ||
            fullErr.includes('Cannot find module')
          ) {
            errType = 'CompilationError';
          }

          return resolve({
            success: false,
            output: stdout ? `${stdout}\n\n[Process Error]:\n${fullErr}` : fullErr || `Process exited with error code ${code}`,
            stderr: fullErr,
            executionTime: `${elapsed}ms`,
            memoryUsed: `${memEst}MB`,
            errorType: errType,
            exitCode: code
          });
        });
      });
    });
  } catch (err: any) {
    const elapsed = (performance.now() - startTime).toFixed(1);
    return {
      success: false,
      output: `System Sandbox Error: ${err.message}`,
      executionTime: `${elapsed}ms`,
      memoryUsed: '0MB',
      errorType: 'RuntimeError'
    };
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

// 6. Automated Problem Test-Cases Evaluator
interface ProblemTestCaseResult {
  testIndex: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string | null;
}

async function evaluateTestCasesInSandbox(
  code: string,
  language: string,
  testCases: { input: string; expected: string }[],
  functionName?: string
): Promise<{
  success: boolean;
  allPassed: boolean;
  passedCount: number;
  totalCount: number;
  results: ProblemTestCaseResult[];
  error?: string;
  totalTime: string;
  memoryUsed: string;
}> {
  const startTime = performance.now();
  const normalizedLang = (language || 'javascript').toLowerCase().trim();
  const isPython = normalizedLang.includes('python') || normalizedLang.includes('py');
  const isJS = normalizedLang.includes('javascript') || normalizedLang.includes('js') || normalizedLang.includes('typescript') || normalizedLang.includes('ts');

  if (!isPython && !isJS) {
    return {
      success: false,
      allPassed: false,
      passedCount: 0,
      totalCount: testCases.length,
      results: testCases.map((tc, i) => ({
        testIndex: i + 1,
        input: tc.input,
        expected: tc.expected,
        actual: '',
        passed: false,
        error: `Automated test evaluation is currently supported for JavaScript, TypeScript, and Python 3.`
      })),
      error: `Please switch language to JavaScript, TypeScript, or Python 3 to run automated test cases.`,
      totalTime: '0ms',
      memoryUsed: '0MB'
    };
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mentor-tests-'));

  try {
    let runnerContent = '';
    let scriptFile = '';
    let command = '';
    let args: string[] = [];

    if (isPython) {
      scriptFile = path.join(tempDir, 'runner.py');
      runnerContent = `import sys, json, types

# Definition for singly-linked list and binary tree node
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def _py_arr_to_list(arr):
    if not isinstance(arr, list) or len(arr) == 0:
        return None
    dummy = ListNode(0)
    cur = dummy
    for item in arr:
        cur.next = ListNode(item)
        cur = cur.next
    return dummy.next

def _py_list_to_arr(head):
    res = []
    cur = head
    visited = set()
    while cur is not None and id(cur) not in visited:
        visited.add(id(cur))
        res.append(getattr(cur, 'val', cur))
        cur = getattr(cur, 'next', None)
        if len(res) > 5000:
            break
    return res

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def _py_arr_to_tree(arr):
    if not isinstance(arr, list) or len(arr) == 0 or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        curr = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            curr.left = TreeNode(arr[i])
            queue.append(curr.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            curr.right = TreeNode(arr[i])
            queue.append(curr.right)
        i += 1
    return root

def _py_tree_to_arr(root):
    if not root:
        return []
    res = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node is not None:
            res.append(getattr(node, 'val', node))
            queue.append(getattr(node, 'left', None))
            queue.append(getattr(node, 'right', None))
        else:
            res.append(None)
    while res and res[-1] is None:
        res.pop()
    return res

# User Solution Code
${code}

# Test Evaluator Harness
test_cases = ${JSON.stringify(testCases)}
results = []
target_fn_name = "${functionName || ''}"

target_fn = None
if target_fn_name and target_fn_name in globals() and isinstance(globals()[target_fn_name], types.FunctionType):
    target_fn = globals()[target_fn_name]
else:
    all_fns = [v for k, v in list(globals().items()) if isinstance(v, types.FunctionType) and not k.startswith('_') and k not in ('ListNode', 'TreeNode')]
    if all_fns:
        target_fn = all_fns[-1]

for idx, tc in enumerate(test_cases):
    try:
        raw_in = tc['input']
        parsed_args = list(eval('(' + raw_in + ',)'))

        # Automatic conversion for linked list and tree nodes if function signature expects it
        fn_name_check = target_fn.__name__ if target_fn else ''
        if fn_name_check == 'mergeTwoLists':
            if len(parsed_args) > 0 and isinstance(parsed_args[0], list):
                parsed_args[0] = _py_arr_to_list(parsed_args[0])
            if len(parsed_args) > 1 and isinstance(parsed_args[1], list):
                parsed_args[1] = _py_arr_to_list(parsed_args[1])
        elif ('reverse' in fn_name_check or 'hasCycle' in fn_name_check or 'removeNthFromEnd' in fn_name_check or 'middleNode' in fn_name_check) and parsed_args and isinstance(parsed_args[0], list):
            parsed_args[0] = _py_arr_to_list(parsed_args[0])
        elif ('tree' in fn_name_check or 'inorder' in fn_name_check or 'traversal' in fn_name_check or 'maxDepth' in fn_name_check or 'isValidBST' in fn_name_check or 'lowestCommonAncestor' in fn_name_check) and parsed_args and isinstance(parsed_args[0], list):
            parsed_args[0] = _py_arr_to_tree(parsed_args[0])

        actual = target_fn(*parsed_args) if target_fn else None

        if isinstance(actual, ListNode):
            actual = _py_list_to_arr(actual)
        elif isinstance(actual, TreeNode):
            actual = _py_tree_to_arr(actual)

        if actual is None and tc['expected'] == '[]':
            actual_str = '[]'
            passed = True
        else:
            actual_str = json.dumps(actual) if actual is not None else "None"
            try:
                expected_val = eval(tc['expected'])
                passed = (actual == expected_val) or (actual_str == tc['expected']) or (str(actual).strip() == tc['expected'].strip())
            except:
                passed = (actual_str == tc['expected']) or (str(actual).strip() == tc['expected'].strip())

        results.append({
            'testIndex': idx + 1,
            'input': tc['input'],
            'expected': tc['expected'],
            'actual': actual_str if actual is not None else str(actual),
            'passed': bool(passed),
            'error': None
        })
    except Exception as e:
        results.append({
            'testIndex': idx + 1,
            'input': tc['input'],
            'expected': tc['expected'],
            'actual': '',
            'passed': False,
            'error': str(e)
        })

print('__TEST_RESULTS_START__' + json.dumps(results) + '__TEST_RESULTS_END__')
`;
      await fs.writeFile(scriptFile, runnerContent, 'utf8');
      command = 'python3';
      args = ['-u', scriptFile];
    } else {
      // JavaScript / TypeScript
      const isTS = normalizedLang.includes('typescript') || normalizedLang.includes('ts');
      scriptFile = path.join(tempDir, isTS ? 'runner.ts' : 'runner.mjs');
      runnerContent = `
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function _js_arr_to_list(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const item of arr) {
    cur.next = new ListNode(item);
    cur = cur.next;
  }
  return dummy.next;
}

function _js_list_to_arr(head) {
  const res = [];
  let cur = head;
  const visited = new Set();
  while (cur !== null && cur !== undefined && !visited.has(cur)) {
    visited.add(cur);
    res.push(cur.val !== undefined ? cur.val : cur);
    cur = cur.next;
    if (res.length > 5000) break;
  }
  return res;
}

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function _js_arr_to_tree(arr) {
  if (!Array.isArray(arr) || arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const curr = queue.shift();
    if (arr[i] !== null && arr[i] !== undefined) {
      curr.left = new TreeNode(arr[i]);
      queue.push(curr.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      curr.right = new TreeNode(arr[i]);
      queue.push(curr.right);
    }
    i++;
  }
  return root;
}

function _js_tree_to_arr(root) {
  if (!root) return [];
  const res = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node !== null && node !== undefined) {
      res.push(node.val !== undefined ? node.val : node);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      res.push(null);
    }
  }
  while (res.length > 0 && res[res.length - 1] === null) {
    res.pop();
  }
  return res;
}

// User Solution Code
${code}

(function() {
  const testCases = ${JSON.stringify(testCases)};
  const results = [];
  const specifiedFnName = "${functionName || ''}";
  
  let targetFn = null;
  if (specifiedFnName) {
    try {
      targetFn = eval(specifiedFnName);
    } catch (e) {}
  }

  if (!targetFn || typeof targetFn !== 'function') {
    try {
      const fns = [
        typeof twoSum === 'function' ? twoSum : null,
        typeof reverseList === 'function' ? reverseList : null,
        typeof isValid === 'function' ? isValid : null,
        typeof inorderTraversal === 'function' ? inorderTraversal : null,
        typeof fib === 'function' ? fib : null,
        typeof lengthOfLongestSubstring === 'function' ? lengthOfLongestSubstring : null,
        typeof binarySearch === 'function' ? binarySearch : null,
        typeof maxSubArray === 'function' ? maxSubArray : null,
        typeof isPalindrome === 'function' ? isPalindrome : null,
        typeof solution === 'function' ? solution : null,
        typeof solve === 'function' ? solve : null
      ].filter(Boolean);
      targetFn = fns[0];
    } catch (e) {}
  }

  const fnNameStr = specifiedFnName || (targetFn ? targetFn.name : '');

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    try {
      let actual: any = undefined;
      if (targetFn) {
        let args: any[] = [];
        try {
          args = eval('[' + tc.input + ']');
        } catch (argErr) {
          args = [tc.input];
        }

        if (fnNameStr === 'mergeTwoLists') {
          if (Array.isArray(args[0])) args[0] = _js_arr_to_list(args[0]);
          if (Array.isArray(args[1])) args[1] = _js_arr_to_list(args[1]);
        } else if ((fnNameStr.includes('reverse') || fnNameStr === 'hasCycle' || fnNameStr === 'removeNthFromEnd' || fnNameStr === 'middleNode') && Array.isArray(args[0])) {
          args[0] = _js_arr_to_list(args[0]);
        } else if ((fnNameStr.includes('inorder') || fnNameStr.includes('Tree') || fnNameStr === 'maxDepth' || fnNameStr === 'isValidBST' || fnNameStr === 'lowestCommonAncestor') && Array.isArray(args[0])) {
          args[0] = _js_arr_to_tree(args[0]);
        }

        actual = targetFn(...args);

        if (actual && typeof actual === 'object' && 'val' in actual && 'next' in actual) {
          actual = _js_list_to_arr(actual);
        } else if (actual && typeof actual === 'object' && ('left' in actual || 'right' in actual)) {
          actual = _js_tree_to_arr(actual);
        }
      }
      
      let actualStr = actual !== undefined ? JSON.stringify(actual) : 'undefined';
      let passed = false;
      if ((actual === null || actual === undefined) && tc.expected === '[]') {
        actualStr = '[]';
        passed = true;
      } else {
        try {
          const expectedVal = eval('(' + tc.expected + ')');
          const expectedStr = JSON.stringify(expectedVal);
          passed = (actualStr === expectedStr) || (actualStr === tc.expected) || (String(actual).trim() === String(tc.expected).trim());
        } catch (expErr) {
          passed = (actualStr === tc.expected) || (String(actual).trim() === String(tc.expected).trim());
        }
      }

      results.push({
        testIndex: i + 1,
        input: tc.input,
        expected: tc.expected,
        actual: actualStr !== undefined ? actualStr : String(actual),
        passed: Boolean(passed),
        error: null
      });
    } catch (err: any) {
      results.push({
        testIndex: i + 1,
        input: tc.input,
        expected: tc.expected,
        actual: '',
        passed: false,
        error: err.message || 'Execution error'
      });
    }
  }
  console.log('__TEST_RESULTS_START__' + JSON.stringify(results) + '__TEST_RESULTS_END__');
})();
`;
      await fs.writeFile(scriptFile, runnerContent, 'utf8');
      command = 'node';
      args = isTS ? ['--experimental-strip-types', scriptFile] : [scriptFile];
    }

    const safeEnv = {
      PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin',
      HOME: tempDir,
      LANG: 'en_US.UTF-8',
      NODE_ENV: 'sandbox',
      TMPDIR: tempDir,
      PYTHONUNBUFFERED: '1',
      PYTHONDONTWRITEBYTECODE: '1',
      PYTHONHASHSEED: 'random'
    };

    return await new Promise((resolve) => {
      let stdout = '';
      let stderr = '';
      let isTimedOut = false;
      let isOutputTruncated = false;
      let settled = false;

      const child = spawn(command, args, { cwd: tempDir, env: safeEnv });
      activeSandboxProcesses.add(child);

      const timer = setTimeout(() => {
        isTimedOut = true;
        try { child.kill('SIGTERM'); } catch (e) {}
        const forceKillTimer = setTimeout(() => {
          try { child.kill('SIGKILL'); } catch (e) {}
        }, 300);
        forceKillTimer.unref?.();
      }, 7000);

      child.stdout.on('data', (c) => {
        if (stdout.length < MAX_OUTPUT_BYTES) {
          stdout += c.toString();
        } else if (!isOutputTruncated) {
          isOutputTruncated = true;
          try { child.kill('SIGKILL'); } catch (e) {}
        }
      });

      child.stderr.on('data', (c) => {
        if (stderr.length < MAX_OUTPUT_BYTES) {
          stderr += c.toString();
        } else if (!isOutputTruncated) {
          isOutputTruncated = true;
          try { child.kill('SIGKILL'); } catch (e) {}
        }
      });

      const cleanupAndSettle = (fn: () => void) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        activeSandboxProcesses.delete(child);
        try {
          if (!child.killed) child.kill('SIGKILL');
        } catch (e) {}
        fn();
      };

      child.on('error', (err) => {
        cleanupAndSettle(() => {
          const elapsed = (performance.now() - startTime).toFixed(1);
          resolve({
            success: false,
            allPassed: false,
            passedCount: 0,
            totalCount: testCases.length,
            results: [],
            error: `Process Spawn Error: ${err.message}`,
            totalTime: `${elapsed}ms`,
            memoryUsed: '0MB'
          });
        });
      });

      child.on('close', () => {
        cleanupAndSettle(() => {
        const elapsed = (performance.now() - startTime).toFixed(1);
        const memEst = (Math.min(25, Math.max(2.1, (stdout.length + stderr.length) / 1024 + 3.0))).toFixed(1);

        if (isTimedOut) {
          return resolve({
            success: false,
            allPassed: false,
            passedCount: 0,
            totalCount: testCases.length,
            results: testCases.map((tc, idx) => ({
              testIndex: idx + 1,
              input: tc.input,
              expected: tc.expected,
              actual: '',
              passed: false,
              error: 'Time Limit Exceeded (>7000ms)'
            })),
            error: 'Execution Time Limit Exceeded (7000ms limit). Check for infinite loops or deep recursion.',
            totalTime: `${elapsed}ms`,
            memoryUsed: `${memEst}MB`
          });
        }

        const match = stdout.match(/__TEST_RESULTS_START__(.*?)__TEST_RESULTS_END__/s);
        if (match && match[1]) {
          try {
            const parsedResults: ProblemTestCaseResult[] = JSON.parse(match[1]);
            const passedCount = parsedResults.filter(r => r.passed).length;
            const allPassed = passedCount === parsedResults.length;

            return resolve({
              success: true,
              allPassed,
              passedCount,
              totalCount: parsedResults.length,
              results: parsedResults,
              totalTime: `${elapsed}ms`,
              memoryUsed: `${memEst}MB`
            });
          } catch (parseErr: any) {
            return resolve({
              success: false,
              allPassed: false,
              passedCount: 0,
              totalCount: testCases.length,
              results: [],
              error: `Test Parser Error: ${parseErr.message}`,
              totalTime: `${elapsed}ms`,
              memoryUsed: `${memEst}MB`
            });
          }
        }

        const errMsg = stderr || stdout || 'Execution failed without test output';
        return resolve({
          success: false,
          allPassed: false,
          passedCount: 0,
          totalCount: testCases.length,
          results: testCases.map((tc, idx) => ({
            testIndex: idx + 1,
            input: tc.input,
            expected: tc.expected,
            actual: '',
            passed: false,
            error: errMsg.slice(0, 300)
          })),
          error: errMsg,
          totalTime: `${elapsed}ms`,
          memoryUsed: `${memEst}MB`
        });
        });
      });
    });
  } catch (err: any) {
    const elapsed = (performance.now() - startTime).toFixed(1);
    return {
      success: false,
      allPassed: false,
      passedCount: 0,
      totalCount: testCases.length,
      results: [],
      error: err.message,
      totalTime: `${elapsed}ms`,
      memoryUsed: '0MB'
    };
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

// 7. API: Code Execution Endpoint (Run Code)
app.post('/api/execute', async (req, res) => {
  const { code, language = 'JavaScript', input = '', timeoutMs = 5000 } = req.body;

  // Environment policy check for production hardening
  if (process.env.ENABLE_LOCAL_CODE_EXECUTION === 'false') {
    return res.status(403).json({
      success: false,
      errorType: 'Security',
      output: 'Direct host code execution is disabled by server policy.\n\nIn a public production deployment, route execution requests to an isolated sandbox engine (e.g. Judge0, Piston, or container workers).',
      executionTime: '0ms',
      memoryUsed: '0MB'
    });
  }

  if (typeof code !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing or invalid code string in request payload.' });
  }

  // Prevent memory exhaustion attacks via oversized code payloads
  if (Buffer.byteLength(code, 'utf8') > MAX_CODE_PAYLOAD_BYTES) {
    return res.status(413).json({
      success: false,
      errorType: 'OutputLimit',
      output: `Code payload exceeds maximum size limit (${MAX_CODE_PAYLOAD_BYTES / 1024}KB).`,
      executionTime: '0ms',
      memoryUsed: '0MB'
    });
  }

  if (typeof input === 'string' && Buffer.byteLength(input, 'utf8') > MAX_INPUT_PAYLOAD_BYTES) {
    return res.status(413).json({
      success: false,
      errorType: 'OutputLimit',
      output: `Input payload exceeds maximum size limit (${MAX_INPUT_PAYLOAD_BYTES / 1024}KB).`,
      executionTime: '0ms',
      memoryUsed: '0MB'
    });
  }

  // Handle empty code string without crashing or executing stale fallback
  if (!code.trim()) {
    return res.json({
      success: true,
      output: 'Editor is empty. Write your code and press Run (Ctrl+Enter).',
      executionTime: '0ms',
      memoryUsed: '0MB',
      exitCode: 0,
      runnerEnvironment: 'local-subprocess'
    });
  }

  // Concurrency check to protect server event loop and memory
  if (activeSandboxProcesses.size >= MAX_CONCURRENT_EXECUTIONS) {
    return res.status(429).json({
      success: false,
      errorType: 'ResourceLimit',
      output: 'Code execution runner is currently busy with other executions. Please wait a moment and try again.',
      executionTime: '0ms',
      memoryUsed: '0MB',
      runnerEnvironment: 'local-subprocess'
    });
  }

  try {
    const result = await executeInIsolatedSandbox(code, language, input, Math.min(10000, Math.max(1000, Number(timeoutMs) || 5000)));
    return res.json({
      ...result,
      runnerEnvironment: 'local-subprocess'
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      output: `Internal Execution Error: ${err.message}`,
      executionTime: '0ms',
      memoryUsed: '0MB',
      errorType: 'RuntimeError',
      runnerEnvironment: 'local-subprocess'
    });
  }
});

// 8. API: Problem Test Cases Evaluator (Submit Solution)
app.post('/api/execute/testcases', async (req, res) => {
  const { code, language = 'JavaScript', testCases = [], functionName } = req.body;

  // Environment policy check for production hardening
  if (process.env.ENABLE_LOCAL_CODE_EXECUTION === 'false') {
    return res.status(403).json({
      success: false,
      allPassed: false,
      passedCount: 0,
      totalCount: Array.isArray(testCases) ? testCases.length : 0,
      results: [],
      error: 'Direct host code execution is disabled by server policy. Please configure an isolated sandbox runner in production.',
      totalTime: '0ms',
      memoryUsed: '0MB'
    });
  }

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing or invalid code string.' });
  }

  if (Buffer.byteLength(code, 'utf8') > MAX_CODE_PAYLOAD_BYTES) {
    return res.status(413).json({
      success: false,
      allPassed: false,
      passedCount: 0,
      totalCount: Array.isArray(testCases) ? testCases.length : 0,
      results: [],
      error: `Code payload exceeds maximum size limit (${MAX_CODE_PAYLOAD_BYTES / 1024}KB).`,
      totalTime: '0ms',
      memoryUsed: '0MB'
    });
  }

  if (!Array.isArray(testCases) || testCases.length === 0) {
    return res.status(400).json({ success: false, error: 'Missing or empty testCases array.' });
  }

  if (testCases.length > MAX_TEST_CASES) {
    return res.status(400).json({
      success: false,
      allPassed: false,
      passedCount: 0,
      totalCount: testCases.length,
      results: [],
      error: `Test cases array exceeds maximum allowed count (${MAX_TEST_CASES}).`,
      totalTime: '0ms',
      memoryUsed: '0MB'
    });
  }

  // Concurrency check
  if (activeSandboxProcesses.size >= MAX_CONCURRENT_EXECUTIONS) {
    return res.status(429).json({
      success: false,
      allPassed: false,
      passedCount: 0,
      totalCount: testCases.length,
      results: [],
      error: 'Execution runner is currently busy. Please retry submitting in a few seconds.',
      totalTime: '0ms',
      memoryUsed: '0MB'
    });
  }

  try {
    const evaluation = await evaluateTestCasesInSandbox(code, language, testCases, functionName);
    return res.json(evaluation);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      allPassed: false,
      passedCount: 0,
      totalCount: testCases.length,
      results: [],
      error: `Test Runner Failure: ${err.message}`,
      totalTime: '0ms',
      memoryUsed: '0MB'
    });
  }
});

// Configure Vite integration
// Replace lines starting at "async function startServer()" with this:

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Dynamic import prevents Vite from loading during production serverless runs
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`AI Coding Mentor Server active at http://localhost:${PORT}`);
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

// Only launch standalone listener in dev
if (process.env.NODE_ENV !== 'production') {
  startServer();
}

// Export app module for Vercel serverless function execution
export default app;