import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Send,
  Sparkles, 
  Download, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  RotateCcw, 
  HelpCircle, 
  Loader, 
  RefreshCw, 
  Bug, 
  Activity, 
  Eye, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Terminal,
  Settings,
  X,
  FileCode,
  Code2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Layers,
  Award,
  Zap,
  Info,
  CheckCircle2,
  MessageSquare,
  Lightbulb
} from 'lucide-react';
import { PracticeProblem, WorkspaceContext } from '../types';
import { PROBLEMS } from '../data';

interface CodeEditorViewProps {
  initialCode?: string;
  initialLanguage?: string;
  initialProblemId?: string;
  onCodeRun?: (output: string) => void;
  onRunCode?: (language: string) => void;
  onSolveProblem?: (problemId: string, title: string, difficulty: 'Easy' | 'Medium' | 'Hard', topic?: string) => void;
  onSubmissionFailed?: (problemId: string, title: string, difficulty: 'Easy' | 'Medium' | 'Hard', topic?: string) => void;
  onBackToProblems?: () => void;
  accentColor: string;
  onWorkspaceContextChange?: (ctx: WorkspaceContext) => void;
  onOpenAIChatWithContext?: () => void;
}

const LANGUAGES_SUPPORTED = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Bash',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'SQL',
  'HTML'
];

const DEFAULT_STARTER_CODES: { [key: string]: string } = {
  JavaScript: `// JavaScript Playground (Node.js runtime)\nfunction solution() {\n  const message = "Hello from AI Coding Mentor!";\n  console.log(message);\n  \n  const numbers = [1, 2, 3, 4, 5];\n  const squared = numbers.map(n => n * n);\n  console.log("Squared:", squared);\n  return squared;\n}\n\nsolution();`,
  TypeScript: `// TypeScript Playground (with native type stripping)\ninterface DataPoint {\n  id: number;\n  label: string;\n  score: number;\n}\n\nconst sample: DataPoint = {\n  id: 101,\n  label: "Algorithm Benchmark",\n  score: 98.5\n};\n\nconsole.log(\`Running \${sample.label} [ID: \${sample.id}] with score \${sample.score}%\`);`,
  Python: `# Python 3 Sandbox\ndef main():\n    languages = ["Python", "JavaScript", "TypeScript", "Rust"]\n    print("Welcome to Python 3 execution sandbox!")\n    for idx, lang in enumerate(languages, 1):\n        print(f"{idx}. {lang} ready.")\n\nif __name__ == "__main__":\n    main()`,
  Bash: `#!/usr/bin/env bash\necho "Current date & environment check:"\necho "Running in isolated sandbox container"\necho "Exit code 0"`,
  Java: `// Java Template (Switch to JS/TS/Python for live container run)\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java Developer!");\n    }\n}`,
  'C++': `// C++ Template\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "C++ Standard Solution" << endl;\n    return 0;\n}`,
  SQL: `-- SQL Query template\nSELECT id, username, email, created_at\nFROM users\nWHERE status = 'ACTIVE'\nORDER BY created_at DESC;\n`,
  HTML: `<!-- HTML Template -->\n<div class="card">\n  <h2>Mentor.ai Playground</h2>\n  <p>Interactive web development scaffold.</p>\n</div>\n`
};

interface TestCaseResult {
  testIndex: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string | null;
}

export default function CodeEditorView({ 
  initialCode, 
  initialLanguage, 
  initialProblemId,
  onCodeRun, 
  onRunCode, 
  onSolveProblem,
  onSubmissionFailed,
  onBackToProblems,
  accentColor,
  onWorkspaceContextChange,
  onOpenAIChatWithContext
}: CodeEditorViewProps) {
  // Solution viewer language tab & copy state inside workspace
  const [workspaceSolLangTab, setWorkspaceSolLangTab] = useState<'JavaScript' | 'TypeScript' | 'Python'>('JavaScript');
  const [hasCopiedWorkspaceSol, setHasCopiedWorkspaceSol] = useState(false);

  // Active problem selection
  const [selectedProblemId, setSelectedProblemId] = useState<string>(() => {
    if (initialProblemId) return initialProblemId;
    if (initialCode) return '';
    try {
      const savedProbId = localStorage.getItem('mentor_ai_active_problem_id');
      if (savedProbId && PROBLEMS.some(p => p.id === savedProbId)) {
        return savedProbId;
      }
    } catch {
      // ignore storage access errors
    }
    return '';
  });
  const activeProblem = PROBLEMS.find(p => p.id === selectedProblemId) || null;

  // Language & Code
  const [language, setLanguage] = useState<string>(() => {
    // If explicitly loaded from an external action with starter code or problem ID
    if (initialLanguage && (initialCode || initialProblemId)) {
      return initialLanguage;
    }
    try {
      const savedLang = localStorage.getItem('mentor_ai_active_language');
      if (savedLang && LANGUAGES_SUPPORTED.includes(savedLang)) {
        return savedLang;
      }
    } catch {
      // ignore storage access errors
    }
    return initialLanguage || 'JavaScript';
  });

  const [code, setCode] = useState<string>(() => {
    if (initialCode) return initialCode;

    // Determine target language and problem to restore
    const targetLang = (() => {
      if (initialLanguage && (initialCode || initialProblemId)) return initialLanguage;
      try {
        const savedLang = localStorage.getItem('mentor_ai_active_language');
        if (savedLang && LANGUAGES_SUPPORTED.includes(savedLang)) return savedLang;
      } catch {
        // ignore
      }
      return initialLanguage || 'JavaScript';
    })();

    const targetProbId = (() => {
      if (initialProblemId) return initialProblemId;
      if (initialCode) return '';
      try {
        const savedProbId = localStorage.getItem('mentor_ai_active_problem_id');
        if (savedProbId && PROBLEMS.some(p => p.id === savedProbId)) return savedProbId;
      } catch {
        // ignore
      }
      return '';
    })();

    try {
      // Problem mode restoration
      if (targetProbId) {
        const savedProblemCode = localStorage.getItem(`mentor_ai_prob_${targetProbId}_${targetLang}`);
        if (savedProblemCode !== null) return savedProblemCode;

        const prob = PROBLEMS.find(p => p.id === targetProbId);
        if (prob) {
          const langKey = targetLang === 'Python' ? 'Python' : targetLang === 'TypeScript' ? 'TypeScript' : 'JavaScript';
          if (prob.starterCode && prob.starterCode[langKey]) return prob.starterCode[langKey];
          if (prob.starterCode && prob.starterCode['JavaScript']) return prob.starterCode['JavaScript'];
          return prob.solutionCode || `// Write your solution for ${prob.title} in ${targetLang} here...\n`;
        }
      }

      // Scratchpad mode restoration (per-language)
      const savedScratch = localStorage.getItem(`mentor_ai_scratch_${targetLang}`);
      if (savedScratch !== null) {
        return savedScratch;
      }
    } catch {
      // ignore
    }

    return DEFAULT_STARTER_CODES[targetLang] || DEFAULT_STARTER_CODES['JavaScript'];
  });

  // Stdin Custom Input
  const [customInput, setCustomInput] = useState<string>(() => {
    try {
      return localStorage.getItem('mentor_ai_custom_input') || '';
    } catch {
      return '';
    }
  });
  const [lastRanInput, setLastRanInput] = useState<string | null>(null);

  // Execution & Submission State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'output' | 'tests' | 'stdin' | 'ai'>('output');

  // Output stats
  const [output, setOutput] = useState<string>('');
  const [execTime, setExecTime] = useState<string>('');
  const [memUsed, setMemUsed] = useState<string>('');
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  // Test Case Evaluation State
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [selectedTestIndex, setSelectedTestIndex] = useState<number>(0);
  const [submissionVerdict, setSubmissionVerdict] = useState<{
    status: 'idle' | 'accepted' | 'wrong_answer' | 'error' | 'timeout';
    message: string;
    passedCount: number;
    totalCount: number;
  }>({
    status: 'idle',
    message: '',
    passedCount: 0,
    totalCount: 0
  });

  // UI Panels & Modals
  const [isProblemPaneOpen, setIsProblemPaneOpen] = useState<boolean>(true);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mentor_ai_terminal_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showModelSolution, setShowModelSolution] = useState<boolean>(false);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(-1);

  // AI Diagnostics
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [workspaceAiPrompt, setWorkspaceAiPrompt] = useState<string>('');

  // Cursor & Editor Stats
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Helper to extract sanitized WorkspaceContext payload
  const getWorkspaceContextPayload = useCallback((): WorkspaceContext => {
    const currentCode = textareaRef.current ? textareaRef.current.value : code;
    return {
      problem: activeProblem ? {
        id: activeProblem.id,
        title: activeProblem.title,
        difficulty: activeProblem.difficulty,
        topic: activeProblem.topic,
        description: activeProblem.description,
        constraints: activeProblem.constraints,
        sampleInput: activeProblem.sampleInput,
        sampleOutput: activeProblem.sampleOutput,
      } : undefined,
      language,
      code: currentCode,
      lastRun: {
        status: errorType ? `Error (${errorType})` : exitCode === 0 ? 'Finished (Exit 0)' : output ? 'Finished' : 'Idle',
        stdout: output,
        stderr: errorType ? output : '',
        exitCode,
        errorType,
        execTime,
        customInput
      },
      lastSubmission: submissionVerdict.status !== 'idle' ? {
        verdictStatus: submissionVerdict.status,
        message: submissionVerdict.message,
        passedCount: testResults.filter(r => r.passed).length,
        totalCount: testResults.length,
        failedTestCase: testResults.find(r => !r.passed) ? {
          input: testResults.find(r => !r.passed)!.input,
          expected: testResults.find(r => !r.passed)!.expected,
          actual: testResults.find(r => !r.passed)!.actual,
        } : undefined
      } : undefined
    };
  }, [activeProblem, language, code, output, errorType, exitCode, execTime, customInput, submissionVerdict, testResults]);

  // Synchronize workspace context with parent application (e.g. AI Chat)
  const onWorkspaceContextChangeRef = useRef(onWorkspaceContextChange);
  useEffect(() => {
    onWorkspaceContextChangeRef.current = onWorkspaceContextChange;
  }, [onWorkspaceContextChange]);

  const lastContextKeyRef = useRef<string>('');

  useEffect(() => {
    if (!onWorkspaceContextChangeRef.current) return;
    const currentKey = `${selectedProblemId || ''}|${language}|${code}|${output}|${errorType || ''}|${exitCode ?? ''}|${execTime || ''}|${customInput}|${submissionVerdict.status}|${submissionVerdict.message}|${testResults.length}`;
    if (currentKey !== lastContextKeyRef.current) {
      lastContextKeyRef.current = currentKey;
      const payload = getWorkspaceContextPayload();
      onWorkspaceContextChangeRef.current(payload);
    }
  }, [selectedProblemId, language, code, output, errorType, exitCode, execTime, customInput, submissionVerdict.status, submissionVerdict.message, testResults.length, getWorkspaceContextPayload]);

  // Prop Tracking for explicit external loading (e.g. "Solve in Workspace" button)
  const lastLoadedProblemIdRef = useRef<string | undefined>(initialProblemId);
  const lastLoadedCodeRef = useRef<string | undefined>(initialCode);

  // Smooth scroll and focus to the coding workspace when problem or code is loaded
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (workspaceRef.current) {
        workspaceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      textareaRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [initialProblemId, initialCode]);

  // Initial mount focus and position check
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (workspaceRef.current) {
        workspaceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (document.activeElement !== textareaRef.current) {
        textareaRef.current?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (initialProblemId !== undefined && initialProblemId !== '' && initialProblemId !== lastLoadedProblemIdRef.current) {
      lastLoadedProblemIdRef.current = initialProblemId;
      setSelectedProblemId(initialProblemId);
      try {
        localStorage.setItem('mentor_ai_active_problem_id', initialProblemId);
      } catch {}

      const prob = PROBLEMS.find(p => p.id === initialProblemId);
      if (prob) {
        const targetLang = initialLanguage || language;
        if (initialLanguage && initialLanguage !== language) {
          setLanguage(initialLanguage);
          try {
            localStorage.setItem('mentor_ai_active_language', initialLanguage);
          } catch {}
        }
        try {
          const savedCode = localStorage.getItem(`mentor_ai_prob_${prob.id}_${targetLang}`);
          if (savedCode !== null) {
            setCode(savedCode);
          } else {
            loadProblemCode(prob, targetLang);
          }
        } catch {
          loadProblemCode(prob, targetLang);
        }
        setIsProblemPaneOpen(true);
      }
    }
  }, [initialProblemId, initialLanguage, language]);

  useEffect(() => {
    if (initialCode !== undefined && initialCode !== '' && initialCode !== lastLoadedCodeRef.current) {
      lastLoadedCodeRef.current = initialCode;
      setCode(initialCode);
      if (initialLanguage) {
        setLanguage(initialLanguage);
        try {
          localStorage.setItem('mentor_ai_active_language', initialLanguage);
        } catch {}
      }
    }
  }, [initialCode, initialLanguage]);

  // Helper to load problem starter code
  const loadProblemCode = (problem: PracticeProblem, targetLang: string) => {
    const langKey = targetLang === 'Python' ? 'Python' : targetLang === 'TypeScript' ? 'TypeScript' : 'JavaScript';
    if (problem.starterCode && problem.starterCode[langKey]) {
      setCode(problem.starterCode[langKey]);
    } else if (problem.starterCode && problem.starterCode['JavaScript']) {
      setCode(problem.starterCode['JavaScript']);
    } else {
      setCode(problem.solutionCode || `// Write your solution for ${problem.title} in ${targetLang} here...\n`);
    }
  };

  // Switch problem handler
  const handleSelectProblem = (probId: string) => {
    setSelectedProblemId(probId);
    try {
      localStorage.setItem('mentor_ai_active_problem_id', probId);
    } catch {}
    setSubmissionVerdict({ status: 'idle', message: '', passedCount: 0, totalCount: 0 });
    setTestResults([]);
    setOutput('');

    if (!probId) {
      // Scratchpad mode (restore per-language scratchpad)
      try {
        const savedScratch = localStorage.getItem(`mentor_ai_scratch_${language}`);
        if (savedScratch !== null) {
          setCode(savedScratch);
        } else {
          setCode(DEFAULT_STARTER_CODES[language] || DEFAULT_STARTER_CODES['JavaScript']);
        }
      } catch {
        setCode(DEFAULT_STARTER_CODES[language] || DEFAULT_STARTER_CODES['JavaScript']);
      }
      return;
    }

    const prob = PROBLEMS.find(p => p.id === probId);
    if (prob) {
      try {
        const savedCode = localStorage.getItem(`mentor_ai_prob_${prob.id}_${language}`);
        if (savedCode !== null) {
          setCode(savedCode);
        } else {
          loadProblemCode(prob, language);
        }
      } catch {
        loadProblemCode(prob, language);
      }
      setIsProblemPaneOpen(true);
      setActiveTab('tests');
    }
  };

  // Language Change Handler (Preserves existing code and restores language-specific code)
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    try {
      localStorage.setItem('mentor_ai_active_language', newLang);
    } catch {}

    if (activeProblem) {
      try {
        const savedProblemCode = localStorage.getItem(`mentor_ai_prob_${activeProblem.id}_${newLang}`);
        if (savedProblemCode !== null) {
          setCode(savedProblemCode);
        } else {
          loadProblemCode(activeProblem, newLang);
        }
      } catch {
        loadProblemCode(activeProblem, newLang);
      }
    } else {
      try {
        const saved = localStorage.getItem(`mentor_ai_scratch_${newLang}`);
        if (saved !== null) {
          setCode(saved);
        } else {
          setCode(DEFAULT_STARTER_CODES[newLang] || `// Starter workspace for ${newLang}\n\n// Write code here...\n`);
        }
      } catch {
        setCode(DEFAULT_STARTER_CODES[newLang] || `// Starter workspace for ${newLang}\n\n// Write code here...\n`);
      }
    }
  };

  // Auto-save active code and state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mentor_ai_active_language', language);
      localStorage.setItem('mentor_ai_active_problem_id', selectedProblemId);
      if (activeProblem) {
        localStorage.setItem(`mentor_ai_prob_${activeProblem.id}_${language}`, code);
      } else {
        localStorage.setItem(`mentor_ai_scratch_${language}`, code);
      }
    } catch {
      // ignore
    }
  }, [code, activeProblem, language, selectedProblemId]);

  // Auto-save stdin and terminal layout preferences
  useEffect(() => {
    try {
      localStorage.setItem('mentor_ai_custom_input', customInput);
    } catch {}
  }, [customInput]);

  useEffect(() => {
    try {
      localStorage.setItem('mentor_ai_terminal_collapsed', String(isTerminalCollapsed));
    } catch {}
  }, [isTerminalCollapsed]);

  // Synchronize scrolling between line numbers and textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Update cursor line and col
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const textBefore = textareaRef.current.value.substring(0, pos);
    const lines = textBefore.split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1
    });
  };

  // Keyboard shortcut handlers for code editor (Tab, Auto-close, Auto-indent)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = textareaRef.current;
    if (!target) return;

    // Run Code: Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleRunCode();
      return;
    }

    // Submit Solution: Ctrl+Shift+Enter or Cmd+Shift+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      if (activeProblem) {
        handleSubmitSolution();
      } else {
        handleRunCode();
      }
      return;
    }

    const { selectionStart, selectionEnd, value } = target;

    // Tab & Shift+Tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!e.shiftKey) {
        const newValue = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);
        setCode(newValue);
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = selectionStart + 2;
        }, 0);
      } else {
        // Shift+Tab un-indent
        const before = value.substring(0, selectionStart);
        const lastNewLine = before.lastIndexOf('\n');
        const lineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;
        if (value.substring(lineStart, lineStart + 2) === '  ') {
          const newValue = value.substring(0, lineStart) + value.substring(lineStart + 2);
          setCode(newValue);
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = Math.max(lineStart, selectionStart - 2);
          }, 0);
        }
      }
      return;
    }

    // Auto-indent on Enter
    if (e.key === 'Enter') {
      const before = value.substring(0, selectionStart);
      const lastLine = before.split('\n').pop() || '';
      const match = lastLine.match(/^(\s+)/);
      const indent = match ? match[1] : '';
      const extraIndent = lastLine.trim().endsWith('{') || lastLine.trim().endsWith(':') ? '  ' : '';

      if (indent || extraIndent) {
        e.preventDefault();
        const insertion = '\n' + indent + extraIndent;
        const newValue = value.substring(0, selectionStart) + insertion + value.substring(selectionEnd);
        setCode(newValue);
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = selectionStart + insertion.length;
        }, 0);
      }
      return;
    }

    // Auto-closing brackets and quotes
    const pairs: { [key: string]: string } = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`'
    };

    if (pairs[e.key] && selectionStart === selectionEnd) {
      e.preventDefault();
      const closeChar = pairs[e.key];
      const newValue = value.substring(0, selectionStart) + e.key + closeChar + value.substring(selectionEnd);
      setCode(newValue);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = selectionStart + 1;
      }, 0);
      return;
    }
  };

  // Run/Execute Code Handler
  const handleRunCode = async () => {
    if (isRunning) return;

    // Auto-expand terminal so output is immediately visible
    setIsTerminalCollapsed(false);

    // Get freshest source code directly from editor DOM ref or state
    const currentCode = textareaRef.current ? textareaRef.current.value : code;
    setCode(currentCode);
    setLastRanInput(customInput);

    setIsRunning(true);
    setActiveTab('output');
    setOutput('Executing code in secure sandbox...\n');
    setErrorType(null);
    setExitCode(null);

    const startTime = performance.now();

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentCode,
          language,
          input: customInput,
          timeoutMs: 6000
        })
      });

      const data = await response.json();
      const elapsed = (performance.now() - startTime).toFixed(1);

      if (data.success) {
        setOutput(data.output || 'Process executed successfully with no output.');
        setExecTime(data.executionTime || `${elapsed}ms`);
        setMemUsed(data.memoryUsed || '2.5MB');
        setExitCode(0);
        setErrorType(null);
      } else {
        setOutput(data.output || data.stderr || 'Execution failed with an error.');
        setExecTime(data.executionTime || `${elapsed}ms`);
        setMemUsed(data.memoryUsed || '0MB');
        setExitCode(data.exitCode !== undefined ? data.exitCode : 1);
        setErrorType(data.errorType || 'RuntimeError');
      }

      if (onRunCode) {
        onRunCode(language);
      }
    } catch (err: any) {
      setOutput(`Connection Error: Unable to reach sandbox runner. ${err.message}`);
      setErrorType('ConnectionError');
      setExitCode(1);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Solution & Evaluate Test Cases
  const handleSubmitSolution = async () => {
    if (!activeProblem || isSubmitting) return;

    // Auto-expand terminal so test cases are immediately visible
    setIsTerminalCollapsed(false);

    const currentCode = textareaRef.current ? textareaRef.current.value : code;
    setCode(currentCode);

    setIsSubmitting(true);
    setActiveTab('tests');
    setSubmissionVerdict({ status: 'idle', message: 'Evaluating test cases in isolated sandbox...', passedCount: 0, totalCount: activeProblem.testCases.length });

    const startTime = performance.now();

    try {
      const response = await fetch('/api/execute/testcases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentCode,
          language,
          testCases: activeProblem.testCases,
          functionName: activeProblem.functionName
        })
      });

      const data = await response.json();
      const elapsed = (performance.now() - startTime).toFixed(1);

      if (data.results && Array.isArray(data.results)) {
        setTestResults(data.results);
        setSelectedTestIndex(0);
      }

      if (data.allPassed) {
        setSubmissionVerdict({
          status: 'accepted',
          message: `All ${data.passedCount}/${data.totalCount} Test Cases Passed!`,
          passedCount: data.passedCount,
          totalCount: data.totalCount
        });
        setExecTime(data.totalTime || `${elapsed}ms`);
        setMemUsed(data.memoryUsed || '3.2MB');

        // Trigger central gamification XP update with exact problem ID
        if (onSolveProblem) {
          onSolveProblem(activeProblem.id, activeProblem.title, activeProblem.difficulty, activeProblem.topic);
        }
      } else {
        const isTimeout = data.error && data.error.includes('Time Limit Exceeded');
        const verdictStatus = isTimeout ? 'timeout' : (data.passedCount > 0 ? 'wrong_answer' : 'error');

        setSubmissionVerdict({
          status: verdictStatus,
          message: isTimeout 
            ? 'Time Limit Exceeded (7000ms)' 
            : `${data.passedCount}/${data.totalCount} Test Cases Passed (${data.totalCount - data.passedCount} Failed)`,
          passedCount: data.passedCount || 0,
          totalCount: data.totalCount || activeProblem.testCases.length
        });
        setExecTime(data.totalTime || `${elapsed}ms`);
        setMemUsed(data.memoryUsed || '0MB');

        if (onSubmissionFailed) {
          onSubmissionFailed(activeProblem.id, activeProblem.title, activeProblem.difficulty, activeProblem.topic);
        }
      }
    } catch (err: any) {
      setSubmissionVerdict({
        status: 'error',
        message: `Evaluation Error: ${err.message}`,
        passedCount: 0,
        totalCount: activeProblem.testCases.length
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // AI Diagnostic Actions
  const triggerAIAction = async (action: string) => {
    if (aiLoading) return;

    setIsTerminalCollapsed(false);
    const currentCode = textareaRef.current ? textareaRef.current.value : code;
    setCode(currentCode);

    setAiLoading(true);
    setActiveTab('ai');
    setAiInsight(`Analyzing code with Mentor AI Diagnostics...\nGenerating insights for ${language}...`);

    const contextPayload = getWorkspaceContextPayload();
    contextPayload.code = currentCode;

    try {
      const response = await fetch('/api/mentor/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentCode,
          language,
          action,
          problemTitle: activeProblem ? activeProblem.title : undefined,
          problemDescription: activeProblem ? activeProblem.description : undefined,
          context: contextPayload
        })
      });
      const data = await response.json();
      if (data.result) {
        setAiInsight(data.result);
      } else {
        setAiInsight('No response received from AI diagnostics service. Please retry.');
      }
    } catch (err: any) {
      setAiInsight(`Error connecting to AI Diagnostics: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Conversational Mentor Inquiries right from the Workspace
  const askMentorInWorkspace = async (customPrompt?: string) => {
    const promptText = (customPrompt || workspaceAiPrompt).trim();
    if (!promptText || aiLoading) return;

    setIsTerminalCollapsed(false);
    const currentCode = textareaRef.current ? textareaRef.current.value : code;
    setCode(currentCode);

    setAiLoading(true);
    setActiveTab('ai');
    setAiInsight(`Consulting Mentor AI with active ${language} code & workspace context...`);

    const contextPayload = getWorkspaceContextPayload();
    contextPayload.code = currentCode;

    try {
      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: promptText }],
          context: contextPayload
        })
      });
      const data = await response.json();
      if (data.content) {
        setAiInsight(data.content);
        if (!customPrompt) setWorkspaceAiPrompt('');
      } else {
        setAiInsight('No response received from Mentor AI. Please retry.');
      }
    } catch (err: any) {
      setAiInsight(`Error connecting to Mentor AI: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download code
  const downloadCode = () => {
    const extMap: { [key: string]: string } = {
      JavaScript: 'js',
      TypeScript: 'ts',
      Python: 'py',
      Bash: 'sh',
      Java: 'java',
      'C++': 'cpp',
      'C#': 'cs',
      Go: 'go',
      Rust: 'rs',
      SQL: 'sql',
      HTML: 'html'
    };
    const ext = extMap[language] || 'txt';
    const filename = activeProblem ? `${activeProblem.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${ext}` : `solution.${ext}`;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset code to default
  const handleResetCode = () => {
    if (activeProblem) {
      loadProblemCode(activeProblem, language);
    } else {
      setCode(DEFAULT_STARTER_CODES[language] || DEFAULT_STARTER_CODES['JavaScript']);
    }
    setShowResetConfirm(false);
    setSubmissionVerdict({ status: 'idle', message: '', passedCount: 0, totalCount: 0 });
    setTestResults([]);
  };

  // Calculate lines for custom line numbering
  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  return (
    <div 
      id="coding-workspace"
      ref={workspaceRef}
      className={`
        flex flex-col border border-white/5 rounded-2xl overflow-hidden bg-[#0d0d0f]/80 backdrop-blur-sm shadow-2xl w-full
        ${isFullscreen ? 'fixed inset-0 z-50 h-screen rounded-none bg-[#09090b]' : 'flex-1 h-full min-h-[520px] lg:min-h-0'}
      `}
    >
      {/* 1. TOP MAIN TOOLBAR */}
      <div className="px-4 sm:px-6 py-3 bg-[#121214] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        
        {/* Left: Problem Selector & Context */}
        <div className="flex items-center gap-3">
          {onBackToProblems && (
            <button
              id="workspace-back-to-problems-btn"
              onClick={onBackToProblems}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/5 shrink-0"
              title="Return to Practice Problem List"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Problems</span>
            </button>
          )}

          <div className="p-2 bg-[#0d0d0f] border border-white/5 rounded-xl text-indigo-400">
            <Code2 className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Problem Switcher Dropdown */}
            <select
              id="workspace-problem-select"
              value={selectedProblemId}
              onChange={(e) => handleSelectProblem(e.target.value)}
              className="bg-[#0d0d0f] border border-white/5 text-xs font-semibold text-zinc-200 px-3 py-1.5 rounded-xl focus:border-indigo-500 outline-none cursor-pointer max-w-[210px] sm:max-w-[260px] truncate"
            >
              <option value="" className="bg-[#121214]">⚡ Scratchpad Sandbox</option>
              <optgroup label="Practice Challenges" className="bg-[#121214]">
                {PROBLEMS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#121214]">
                    {p.title} ({p.difficulty})
                  </option>
                ))}
              </optgroup>
            </select>

            {activeProblem && (
              <>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                  activeProblem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  activeProblem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {activeProblem.difficulty}
                </span>

                <button
                  id="toggle-problem-pane-btn"
                  onClick={() => setIsProblemPaneOpen(!isProblemPaneOpen)}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-semibold ${
                    isProblemPaneOpen 
                      ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 shadow-sm' 
                      : 'bg-white/5 text-zinc-400 border-white/10 hover:text-zinc-200 hover:bg-white/10'
                  }`}
                  title={isProblemPaneOpen ? "Hide Problem Statement" : "Show Problem Statement"}
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isProblemPaneOpen ? 'Problem Info' : 'Show Problem'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right: Actions & Execution Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Selector */}
          <select
            id="workspace-language-select"
            value={language}
            onChange={handleLanguageChange}
            className="bg-[#0d0d0f] border border-white/5 text-xs text-zinc-300 px-3 py-1.5 rounded-xl focus:border-indigo-500 outline-none cursor-pointer"
          >
            {LANGUAGES_SUPPORTED.map((lang) => (
              <option key={lang} value={lang} className="bg-[#121214]">{lang}</option>
            ))}
          </select>

          {/* Reset Code Button */}
          <button
            id="workspace-reset-code-btn"
            onClick={() => setShowResetConfirm(true)}
            className="p-2 hover:bg-white/5 border border-white/5 rounded-xl text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Reset code template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Copy Code */}
          <button
            id="workspace-copy-code-btn"
            onClick={copyToClipboard}
            className="p-2 hover:bg-white/5 border border-white/5 rounded-xl text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Download Script */}
          <button
            id="workspace-download-btn"
            onClick={downloadCode}
            className="p-2 hover:bg-white/5 border border-white/5 rounded-xl text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Download script"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            id="workspace-fullscreen-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-white/5 border border-white/5 rounded-xl text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Quick Custom Input (stdin) Toggle */}
          <button
            id="workspace-stdin-quick-btn"
            onClick={() => {
              setActiveTab('stdin');
              setIsTerminalCollapsed(false);
            }}
            className={`px-3 py-2 border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              customInput.trim().length > 0
                ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25'
                : 'bg-zinc-800/60 hover:bg-zinc-800 border-white/10 text-zinc-400 hover:text-zinc-200'
            }`}
            title={customInput.trim().length > 0 ? `Custom stdin active (${customInput.split('\n').filter(Boolean).length} lines)` : "Configure Custom Input (stdin)"}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Input</span>
            {customInput.trim().length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            )}
          </button>

          {/* Run Code Button */}
          <button
            id="workspace-run-code-btn"
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 border border-white/10 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer shrink-0"
            title="Run Code (Ctrl+Enter)"
          >
            {isRunning ? (
              <>
                <Loader className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-indigo-400" />
                <span>Run</span>
              </>
            )}
          </button>

          {/* Submit Solution Button (When problem is active) */}
          {activeProblem && (
            <button
              id="workspace-submit-solution-btn"
              onClick={handleSubmitSolution}
              disabled={isSubmitting || isRunning}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-900 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-600/20 cursor-pointer shrink-0"
              title="Submit & Run Test Cases (Ctrl+Shift+Enter)"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN WORKSPACE VIEWPORT (SPLIT 2-COLUMN LAYOUT ON DESKTOP, CLEAN STACK ON MOBILE) */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden relative">

        {/* 2A. LEFT PROBLEM STATEMENT COLUMN (When problem active & pane open) */}
        {activeProblem && isProblemPaneOpen && (
          <div className="w-full lg:w-[380px] xl:w-[440px] 2xl:w-[480px] border-b lg:border-b-0 lg:border-r border-white/5 bg-[#121214]/60 flex flex-col shrink-0 max-h-[280px] sm:max-h-[340px] lg:max-h-none lg:h-full min-h-0 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-[#121214] border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-display font-bold text-zinc-200 text-xs truncate">{activeProblem.title}</span>
              </div>
              <button
                id="hide-problem-pane-btn"
                onClick={() => setIsProblemPaneOpen(false)}
                className="p-1 text-zinc-500 hover:text-zinc-300 rounded-md cursor-pointer transition-colors shrink-0"
                title="Hide Problem Info"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs select-text min-h-0">
              {/* Topic & Difficulty */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold text-zinc-300 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  Topic: {activeProblem.topic}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {activeProblem.testCases.length} Test Cases
                </span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                  activeProblem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  activeProblem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {activeProblem.difficulty}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Description</span>
                <div className="text-zinc-200 text-[13px] leading-relaxed whitespace-pre-line font-sans">
                  {activeProblem.description}
                </div>
              </div>

              {/* Constraints */}
              {activeProblem.constraints && activeProblem.constraints.length > 0 && (
                <div className="space-y-1.5 bg-[#0d0d0f] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Constraints:</span>
                  <ul className="space-y-1 font-mono text-[11px] text-zinc-400 list-disc list-inside">
                    {activeProblem.constraints.map((c, i) => (
                      <li key={i} className="leading-snug">{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample Input / Output */}
              <div className="space-y-2">
                <div className="bg-[#0d0d0f] p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Sample Input:</span>
                  <pre className="font-mono text-[11px] text-zinc-300 whitespace-pre-wrap">{activeProblem.sampleInput}</pre>
                </div>
                <div className="bg-[#0d0d0f] p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Sample Output:</span>
                  <pre className="font-mono text-[11px] text-emerald-400 whitespace-pre-wrap">{activeProblem.sampleOutput}</pre>
                </div>
              </div>

              {/* Hints Accordion */}
              {activeProblem.hints && activeProblem.hints.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Hints & Tips:</span>
                    <span className="text-[10px] font-mono text-zinc-500">{activeProblem.hints.length} available</span>
                  </div>
                  {activeProblem.hints.map((hint, idx) => (
                    <div key={idx} className="border border-white/5 rounded-xl overflow-hidden bg-[#0d0d0f]">
                      <button
                        id={`workspace-hint-btn-${idx}`}
                        onClick={() => setActiveHintIndex(activeHintIndex === idx ? -1 : idx)}
                        className="w-full px-3 py-2.5 text-left flex items-center justify-between text-zinc-300 hover:text-zinc-100 font-semibold cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="text-xs">Hint {idx + 1}</span>
                        </span>
                        {activeHintIndex === idx ? <ChevronUp className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
                      </button>
                      {activeHintIndex === idx && (
                        <div className="px-3 pb-3 text-zinc-300 text-[12px] leading-relaxed border-t border-white/5 pt-2 font-sans">
                          {hint}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Educational Solution Viewer */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <button
                  id="workspace-reveal-solution-btn"
                  onClick={() => setShowModelSolution(!showModelSolution)}
                  className="w-full py-2 px-3 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 hover:text-indigo-200 border border-indigo-500/20 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs font-mono"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{showModelSolution ? 'Hide Educational Solution' : '📖 View Educational Solution'}</span>
                  {showModelSolution ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showModelSolution && (
                  <div className="p-3.5 bg-[#0d0d0f] rounded-xl border border-indigo-500/25 space-y-3.5 animate-fade-in text-xs">
                    {/* Notice */}
                    <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
                      <HelpCircle className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>Viewing solutions is for learning only (no XP/streak impact).</span>
                    </div>

                    {/* Approach & Explanation */}
                    {activeProblem.solution && (
                      <>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">Approach</span>
                          <span className="text-[11px] font-bold text-zinc-200 block">{activeProblem.solution.approach}</span>
                          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans mt-1">{activeProblem.solution.explanation}</p>
                        </div>

                        {/* Algorithm steps */}
                        {activeProblem.solution.algorithm && (
                          <div className="space-y-1 pt-1 border-t border-white/5">
                            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Algorithm Steps</span>
                            <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-300 font-sans">
                              {activeProblem.solution.algorithm.map((step, idx) => (
                                <li key={idx} className="leading-snug">{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Edge Cases */}
                        {activeProblem.solution.edgeCases && activeProblem.solution.edgeCases.length > 0 && (
                          <div className="space-y-1 pt-1 border-t border-white/5">
                            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">Important Edge Cases</span>
                            <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-300 font-sans">
                              {activeProblem.solution.edgeCases.map((ec, idx) => (
                                <li key={idx} className="leading-snug">{ec}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Complexity */}
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                          <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                            <span className="text-[9px] font-mono text-indigo-400 uppercase block font-bold">Time</span>
                            <span className="text-[10px] font-mono text-zinc-300">{activeProblem.solution.timeComplexity}</span>
                          </div>
                          <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                            <span className="text-[9px] font-mono text-emerald-400 uppercase block font-bold">Space</span>
                            <span className="text-[10px] font-mono text-zinc-300">{activeProblem.solution.spaceComplexity}</span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Reference Implementation with Tabs */}
                    <div className="space-y-2 pt-1 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Reference Code</span>
                        
                        <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
                          {(['JavaScript', 'TypeScript', 'Python'] as const).map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setWorkspaceSolLangTab(tab)}
                              className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                                workspaceSolLangTab === tab 
                                  ? 'bg-indigo-600 text-white font-bold' 
                                  : 'text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="relative">
                        <pre className="font-mono text-[11px] text-zinc-300 overflow-x-auto whitespace-pre p-3 bg-black/60 rounded-xl border border-white/5 leading-relaxed max-h-56">
                          <code>
                            {activeProblem.solution?.code?.[workspaceSolLangTab] || (workspaceSolLangTab === 'JavaScript' ? activeProblem.solutionCode : '')}
                          </code>
                        </pre>
                        <button
                          onClick={() => {
                            const cText = activeProblem.solution?.code?.[workspaceSolLangTab] || activeProblem.solutionCode;
                            navigator.clipboard.writeText(cText);
                            setHasCopiedWorkspaceSol(true);
                            setTimeout(() => setHasCopiedWorkspaceSol(false), 2000);
                          }}
                          className="absolute top-2 right-2 py-1 px-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 rounded text-[10px] font-mono flex items-center gap-1 border border-white/10 cursor-pointer"
                          title="Copy Code"
                        >
                          {hasCopiedWorkspaceSol ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{hasCopiedWorkspaceSol ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Left Collapsed Strip (when active problem & pane closed on desktop) */}
        {activeProblem && !isProblemPaneOpen && (
          <div className="hidden lg:flex flex-col items-center py-4 px-2 bg-[#121214] border-r border-white/5 shrink-0">
            <button
              id="expand-problem-pane-btn"
              onClick={() => setIsProblemPaneOpen(true)}
              className="p-2 text-zinc-400 hover:text-indigo-300 hover:bg-white/5 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-2"
              title="Show Problem Details & Hints"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-mono font-semibold [writing-mode:vertical-rl] rotate-180 tracking-wider text-zinc-400">
                PROBLEM INFO
              </span>
            </button>
          </div>
        )}

        {/* 2B. CENTER: CODE EDITOR & COLLAPSIBLE TERMINAL PANEL */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full overflow-hidden bg-[#0d0d0f]/40 relative">
          
          {/* Code Editor Body with Synchronized Line Numbers */}
          <div className="flex-1 flex min-h-[140px] min-h-0 overflow-hidden relative bg-[#09090b]/90">
            {/* Line Numbers Column */}
            <div 
              ref={lineNumbersRef}
              className="w-12 bg-[#0a0a0c] border-r border-white/5 select-none py-3.5 text-right pr-3 font-mono text-[12px] text-zinc-600 shrink-0 overflow-hidden"
            >
              {lineNumbers.map((num) => (
                <div key={num} className="h-[22px] leading-[22px]">{num}</div>
              ))}
            </div>

            {/* Interactive Code Textarea */}
            <textarea
              id="workspace-code-editor"
              ref={textareaRef}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                updateCursorPosition();
              }}
              onKeyDown={handleKeyDown}
              onKeyUp={updateCursorPosition}
              onClick={updateCursorPosition}
              onScroll={handleScroll}
              className="flex-1 bg-transparent border-0 outline-none focus:ring-0 text-zinc-200 font-mono text-[13px] leading-[22px] py-3.5 px-3.5 resize-none overflow-y-auto whitespace-pre h-full w-full"
              style={{ tabSize: 2 }}
              placeholder={`// Write your ${language} solution here...`}
              spellCheck="false"
              autoCapitalize="none"
              autoComplete="off"
            />
          </div>

          {/* Editor Status Bar */}
          <div className="px-4 py-1 bg-[#121214] border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500 shrink-0 h-7">
            <div className="flex items-center gap-4">
              <span>{language}</span>
              <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
              <span>{code.length} chars</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">Ctrl+Enter: Run | Ctrl+Shift+Enter: Submit</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Sandbox Ready" />
            </div>
          </div>

          {/* 2C. COLLAPSIBLE TERMINAL / OUTPUT / TESTS / STDIN / AI PANEL */}
          <div className={`
            border-t border-white/5 bg-[#121214]/95 flex flex-col shrink-0 transition-all duration-200 overflow-hidden
            ${isTerminalCollapsed ? 'h-10' : 'h-[200px] lg:h-[220px] max-h-[45%] min-h-[120px]'}
          `}>
            
            {/* Header Tabs & Minimize/Expand Toolbar */}
            <div className="flex items-center justify-between border-b border-white/5 bg-[#121214] shrink-0 text-xs px-2 sm:px-3 h-10">
              <div className="flex items-center gap-1 overflow-x-auto">
                <button
                  id="workspace-tab-output"
                  onClick={() => {
                    setActiveTab('output');
                    if (isTerminalCollapsed) setIsTerminalCollapsed(false);
                  }}
                  className={`px-3 py-1.5 font-semibold flex items-center gap-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'output' && !isTerminalCollapsed 
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Console</span>
                  {output && !isTerminalCollapsed && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>

                {activeProblem && (
                  <button
                    id="workspace-tab-tests"
                    onClick={() => {
                      setActiveTab('tests');
                      if (isTerminalCollapsed) setIsTerminalCollapsed(false);
                    }}
                    className={`px-3 py-1.5 font-semibold flex items-center gap-1.5 rounded-lg transition-all cursor-pointer ${
                      activeTab === 'tests' && !isTerminalCollapsed 
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' 
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Test Cases</span>
                    {testResults.length > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        submissionVerdict.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {testResults.filter(r => r.passed).length}/{testResults.length}
                      </span>
                    )}
                  </button>
                )}

                <button
                  id="workspace-tab-stdin"
                  onClick={() => {
                    setActiveTab('stdin');
                    if (isTerminalCollapsed) setIsTerminalCollapsed(false);
                  }}
                  className={`px-3 py-1.5 font-semibold flex items-center gap-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'stdin' && !isTerminalCollapsed 
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Custom Input</span>
                  {customInput.trim().length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                      {customInput.split('\n').filter(Boolean).length}L
                    </span>
                  )}
                </button>

                <button
                  id="workspace-tab-ai"
                  onClick={() => {
                    setActiveTab('ai');
                    if (isTerminalCollapsed) setIsTerminalCollapsed(false);
                  }}
                  className={`px-3 py-1.5 font-semibold flex items-center gap-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'ai' && !isTerminalCollapsed 
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Diagnostics</span>
                </button>
              </div>

              {/* Minimize / Expand Toggle Button */}
              <div className="flex items-center gap-2 shrink-0">
                {isTerminalCollapsed && (
                  <span className="text-[11px] font-mono text-zinc-500 hidden md:inline">
                    Terminal Collapsed
                  </span>
                )}

                <button
                  id="workspace-toggle-terminal-btn"
                  onClick={() => setIsTerminalCollapsed(!isTerminalCollapsed)}
                  aria-expanded={!isTerminalCollapsed}
                  aria-label={isTerminalCollapsed ? "Expand terminal panel" : "Minimize terminal panel"}
                  className="px-2.5 py-1 text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-lg border border-white/5 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title={isTerminalCollapsed ? "Expand Terminal" : "Minimize Terminal"}
                >
                  {isTerminalCollapsed ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Expand</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      <span>Minimize</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tab Viewport Contents (Preserved in DOM or conditioned cleanly) */}
            {!isTerminalCollapsed && (
              <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
                
                {/* TAB 1: CONSOLE OUTPUT */}
                {activeTab === 'output' && (
                  <div className="space-y-3 font-mono h-full flex flex-col">
                    <div className="flex-1 bg-[#0d0d0f]/90 border border-white/5 p-3.5 rounded-xl overflow-y-auto flex flex-col">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 shrink-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Standard Output</span>
                          {isRunning && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono animate-pulse flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                              Running
                            </span>
                          )}
                          {!isRunning && errorType && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                              {errorType === 'Timeout' ? '⏱️ Timed Out' :
                               errorType === 'OutputLimit' ? '⚠️ Output Limit Exceeded' :
                               errorType === 'CompilationError' ? '⚙️ Compilation Error' :
                               errorType === 'ResourceLimit' ? '🛑 Resource Limit' :
                               '❌ Runtime Error'}
                            </span>
                          )}
                          {!isRunning && !errorType && exitCode === 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-mono">
                              ✓ Finished (Exit 0)
                            </span>
                          )}
                          {lastRanInput !== null && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5 font-mono">
                              {lastRanInput.trim() ? `stdin: ${lastRanInput.split('\n').filter(Boolean).length} line(s)` : 'stdin: empty'}
                            </span>
                          )}
                        </div>
                        {output && (
                          <button
                            onClick={() => setOutput('')}
                            className="text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <pre className={`flex-1 text-[12px] leading-relaxed whitespace-pre-wrap font-mono ${
                        errorType ? 'text-rose-400' : 'text-emerald-300'
                      }`}>
                        {output || 'Output terminal ready. Click "Run" or press Ctrl+Enter to execute program.'}
                      </pre>
                    </div>

                    {/* Execution Stats Footer */}
                    {execTime && (
                      <div className="grid grid-cols-3 gap-2 bg-[#0d0d0f]/60 p-2.5 border border-white/5 rounded-xl text-[11px] shrink-0">
                        <div>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Time</span>
                          <span className="font-bold text-zinc-300">{execTime}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Memory</span>
                          <span className="font-bold text-zinc-300">{memUsed}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Exit Code</span>
                          <span className={`font-bold ${exitCode === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {exitCode !== null ? exitCode : '--'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: TEST CASES (FOR PROBLEMS) */}
                {activeTab === 'tests' && activeProblem && (
                  <div className="h-full flex flex-col space-y-3">
                    {/* Submission Verdict Banner */}
                    {submissionVerdict.status !== 'idle' && (
                      <div className={`p-3 rounded-xl border flex items-center gap-2.5 shrink-0 ${
                        submissionVerdict.status === 'accepted' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
                        submissionVerdict.status === 'timeout' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                        'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      }`}>
                        {submissionVerdict.status === 'accepted' ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-xs block">
                            {submissionVerdict.status === 'accepted' ? 'Accepted!' : 'Test Verification Result'}
                          </span>
                          <span className="text-[11px] opacity-90">{submissionVerdict.message}</span>
                        </div>
                      </div>
                    )}

                    {/* Case Selector Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0">
                      {activeProblem.testCases.map((tc, idx) => {
                        const result = testResults[idx];
                        const isPassed = result ? result.passed : null;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedTestIndex(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              selectedTestIndex === idx 
                                ? 'bg-indigo-600 text-white shadow' 
                                : 'bg-[#0d0d0f] text-zinc-400 hover:text-zinc-200 border border-white/5'
                            }`}
                          >
                            <span>Case {idx + 1}</span>
                            {isPassed !== null && (
                              isPassed ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <X className="w-3 h-3 text-rose-400" />
                              )
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Test Case Detail */}
                    <div className="flex-1 bg-[#0d0d0f]/90 border border-white/5 p-3.5 rounded-xl overflow-y-auto space-y-3 font-mono text-xs">
                      {(() => {
                        const tc = activeProblem.testCases[selectedTestIndex] || activeProblem.testCases[0];
                        const result = testResults[selectedTestIndex];
                        return (
                          <>
                            <div>
                              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold mb-1">Input:</span>
                              <div className="p-2 bg-black/40 rounded-lg text-zinc-300 whitespace-pre-wrap">{tc.input}</div>
                            </div>

                            <div>
                              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold mb-1">Expected Output:</span>
                              <div className="p-2 bg-black/40 rounded-lg text-emerald-400 whitespace-pre-wrap">{tc.expected}</div>
                            </div>

                            {result && (
                              <div>
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold mb-1">Your Output:</span>
                                <div className={`p-2 bg-black/40 rounded-lg whitespace-pre-wrap ${
                                  result.passed ? 'text-emerald-400' : 'text-rose-400'
                                }`}>
                                  {result.actual || (result.error ? `Error: ${result.error}` : 'undefined')}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>

                    {/* Submit Action Footer */}
                    <button
                      id="tab-submit-testcases-btn"
                      onClick={handleSubmitSolution}
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow cursor-pointer shrink-0"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-3.5 h-3.5 animate-spin" />
                          <span>Running Test Cases...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Solution ({activeProblem.testCases.length} Tests)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* TAB 3: CUSTOM STDIN INPUT */}
                {activeTab === 'stdin' && (
                  <div className="h-full flex flex-col space-y-3 font-mono">
                    <div className="flex-1 bg-[#0d0d0f]/90 border border-white/5 p-3.5 rounded-xl flex flex-col min-h-[140px]">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Custom Input (stdin)</span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {customInput ? `${customInput.split('\n').length} line(s), ${customInput.length} chars` : 'Empty (No stdin)'}
                          </span>
                        </div>
                        {customInput && (
                          <button
                            onClick={() => setCustomInput('')}
                            className="text-[10px] text-zinc-500 hover:text-zinc-300 hover:underline cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <textarea
                        id="workspace-stdin-textarea"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder={
                          language.toLowerCase().includes('python')
                            ? "Enter custom input lines here...\ne.g.\nAlice\n18\n(or multiline data: 10\n20\n30)"
                            : language.toLowerCase().includes('javascript') || language.toLowerCase().includes('typescript')
                            ? "Enter custom input lines here...\ne.g.\nAlice\n18\n(read with fs.readFileSync(0, 'utf-8'))"
                            : "Enter custom stdin arguments or multiline data..."
                        }
                        className="flex-1 bg-transparent border-0 outline-none text-zinc-300 text-xs resize-none whitespace-pre font-mono p-1 leading-relaxed"
                      />
                    </div>
                    
                    {/* Language-Specific stdin Guide */}
                    <div className="p-3 bg-[#0d0d0f]/60 rounded-xl border border-white/5 text-[11px] text-zinc-400 font-sans space-y-1.5 shrink-0">
                      <div className="flex items-center gap-1.5 text-zinc-300 font-semibold text-xs">
                        <Info className="w-3.5 h-3.5 text-indigo-400" />
                        <span>How Standard Input works for {language}:</span>
                      </div>
                      {language.toLowerCase().includes('python') ? (
                        <div className="text-[11px] text-zinc-400 space-y-1 font-mono">
                          <div>• Single line: <code className="text-indigo-300 bg-white/5 px-1 py-0.5 rounded">name = input()</code></div>
                          <div>• Integer/Number: <code className="text-indigo-300 bg-white/5 px-1 py-0.5 rounded">age = int(input())</code></div>
                          <div>• Multiline: <code className="text-indigo-300 bg-white/5 px-1 py-0.5 rounded">import sys; lines = sys.stdin.read().splitlines()</code></div>
                        </div>
                      ) : language.toLowerCase().includes('javascript') || language.toLowerCase().includes('typescript') ? (
                        <div className="text-[11px] text-zinc-400 space-y-1 font-mono">
                          <div>• Sync read: <code className="text-indigo-300 bg-white/5 px-1 py-0.5 rounded">import fs from 'fs'; const input = fs.readFileSync(0, 'utf-8');</code></div>
                          <div>• Line split: <code className="text-indigo-300 bg-white/5 px-1 py-0.5 rounded">const lines = input.trim().split('\n');</code></div>
                        </div>
                      ) : language.toLowerCase().includes('bash') ? (
                        <div className="text-[11px] text-zinc-400 space-y-1 font-mono">
                          <div>• Read variable: <code className="text-indigo-300 bg-white/5 px-1 py-0.5 rounded">read name</code></div>
                          <div>• Loop lines: <code className="text-indigo-300 bg-white/5 px-1 py-0.5 rounded">while IFS= read -r line; do echo "$line"; done</code></div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-zinc-400 font-mono">
                          Piped to process stdin buffer directly.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: AI MENTOR DIAGNOSTICS & CONTEXT-AWARE ASSISTANT */}
                {activeTab === 'ai' && (
                  <div className="h-full flex flex-col justify-between space-y-3">
                    
                    {/* Diagnostic Insight Viewport */}
                    <div className="flex-1 bg-[#0d0d0f]/90 border border-white/5 p-3.5 rounded-xl overflow-y-auto min-h-[140px] flex flex-col">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 shrink-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">AI Mentor Diagnostics</span>
                          {activeProblem && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 font-mono">
                              🎯 Context: {activeProblem.title} ({language})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {aiInsight && !aiLoading && (
                            <>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(aiInsight);
                                }}
                                className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                                title="Copy AI Insight"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </button>
                              <button onClick={() => setAiInsight('')} className="text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer">
                                Clear
                              </button>
                            </>
                          )}
                          {onOpenAIChatWithContext && (
                            <button
                              id="workspace-open-full-chat-btn"
                              onClick={onOpenAIChatWithContext}
                              className="text-[10px] px-2 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                              title="Open Full AI Mentor Chat with this Problem & Code Context"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Full Chat</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {aiLoading ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-8 text-zinc-400 space-y-2">
                          <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
                          <span className="text-[11px] font-mono">Analyzing code & synthesizing mentor guidance...</span>
                        </div>
                      ) : (
                        <div className="flex-1 text-xs leading-relaxed text-zinc-200 whitespace-pre-wrap font-sans">
                          {aiInsight || (
                            <div className="space-y-2 py-2 text-zinc-400">
                              <p className="text-zinc-300 font-medium">
                                👋 Your AI Coding Mentor is synced with your active <strong className="text-indigo-300">{activeProblem ? activeProblem.title : language}</strong> workspace.
                              </p>
                              <p className="text-[11px] text-zinc-400 leading-relaxed">
                                Click any mentor question below, type a custom question, or use Quick AI Tools to analyze your solution.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Contextual Quick Inquiries */}
                    <div className="space-y-2 pt-1 border-t border-white/5 shrink-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                          Ask Mentor (Context-Aware)
                        </span>
                        {errorType && (
                          <span className="text-[10px] text-rose-400 font-mono">
                            ⚠️ Error output detected
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        <button
                          id="ai-quick-hint"
                          onClick={() => askMentorInWorkspace(`Give me a conceptual hint for ${activeProblem ? activeProblem.title : 'this problem'} without spoiling the complete solution.`)}
                          disabled={aiLoading}
                          className="p-1.5 px-2.5 bg-[#0d0d0f] hover:bg-zinc-800 border border-white/5 rounded-xl text-[11px] font-medium text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer text-left truncate"
                          title="Get a hint without complete code reveal"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">Give me a hint</span>
                        </button>

                        <button
                          id="ai-quick-why-not-working"
                          onClick={() => askMentorInWorkspace("Why isn't my code working? Review my logic and point out potential bugs or missed edge cases.")}
                          disabled={aiLoading}
                          className="p-1.5 px-2.5 bg-[#0d0d0f] hover:bg-zinc-800 border border-white/5 rounded-xl text-[11px] font-medium text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer text-left truncate"
                          title="Debug why code fails"
                        >
                          <Bug className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span className="truncate">Why not working?</span>
                        </button>

                        <button
                          id="ai-quick-complexity"
                          onClick={() => askMentorInWorkspace("Analyze the time and space complexity of my current code and compare it to the optimal solution.")}
                          disabled={aiLoading}
                          className="p-1.5 px-2.5 bg-[#0d0d0f] hover:bg-zinc-800 border border-white/5 rounded-xl text-[11px] font-medium text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer text-left truncate"
                          title="Check Big-O time and space complexity"
                        >
                          <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="truncate">Time & Space Big-O</span>
                        </button>

                        <button
                          id="ai-quick-explain-error"
                          onClick={() => askMentorInWorkspace(`Explain the latest terminal output/error (${errorType || (submissionVerdict.status !== 'idle' ? submissionVerdict.message : 'output')}) and guide me on how to fix it.`)}
                          disabled={aiLoading}
                          className="p-1.5 px-2.5 bg-[#0d0d0f] hover:bg-zinc-800 border border-white/5 rounded-xl text-[11px] font-medium text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer text-left truncate"
                          title="Explain latest error or test failure"
                        >
                          <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">Explain error</span>
                        </button>

                        <button
                          id="ai-quick-review-approach"
                          onClick={() => askMentorInWorkspace("Review my current code structure, logic, and idioms. What are the strengths and weak points?")}
                          disabled={aiLoading}
                          className="p-1.5 px-2.5 bg-[#0d0d0f] hover:bg-zinc-800 border border-white/5 rounded-xl text-[11px] font-medium text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer text-left truncate"
                          title="Get code review"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="truncate">Review approach</span>
                        </button>

                        <button
                          id="ai-quick-optimal-pattern"
                          onClick={() => askMentorInWorkspace(`Explain the standard algorithmic pattern and optimal data structures for ${activeProblem ? activeProblem.title : 'this problem'}.`)}
                          disabled={aiLoading}
                          className="p-1.5 px-2.5 bg-[#0d0d0f] hover:bg-zinc-800 border border-white/5 rounded-xl text-[11px] font-medium text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer text-left truncate"
                          title="Explain optimal pattern"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">Optimal pattern</span>
                        </button>
                      </div>

                      {/* Interactive Custom Question Input */}
                      <div className="flex gap-2 pt-1">
                        <input
                          id="workspace-ai-custom-prompt-input"
                          type="text"
                          value={workspaceAiPrompt}
                          onChange={(e) => setWorkspaceAiPrompt(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              askMentorInWorkspace();
                            }
                          }}
                          placeholder={`Ask Mentor anything about your ${language} code...`}
                          className="flex-1 bg-[#0d0d0f] border border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50"
                        />
                        <button
                          id="workspace-ai-submit-prompt-btn"
                          onClick={() => askMentorInWorkspace()}
                          disabled={!workspaceAiPrompt.trim() || aiLoading}
                          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                        >
                          {aiLoading ? (
                            <Loader className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                          <span>Ask</span>
                        </button>
                      </div>

                      {/* Quick AI Diagnostics Tools */}
                      <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[10px] font-mono text-zinc-400">
                        <span className="text-zinc-500 shrink-0">Static Tools:</span>
                        <button
                          id="ai-action-explain"
                          onClick={() => triggerAIAction('explain')}
                          disabled={aiLoading}
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-300 transition-colors cursor-pointer shrink-0"
                        >
                          Explain Code
                        </button>
                        <button
                          id="ai-action-debug"
                          onClick={() => triggerAIAction('debug')}
                          disabled={aiLoading}
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-300 transition-colors cursor-pointer shrink-0"
                        >
                          Audit Bugs
                        </button>
                        <button
                          id="ai-action-optimize"
                          onClick={() => triggerAIAction('optimize')}
                          disabled={aiLoading}
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-300 transition-colors cursor-pointer shrink-0"
                        >
                          Optimize Big-O
                        </button>
                        <button
                          id="ai-action-tests"
                          onClick={() => triggerAIAction('tests')}
                          disabled={aiLoading}
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-300 transition-colors cursor-pointer shrink-0"
                        >
                          Edge Cases
                        </button>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

      {/* RESET CODE CONFIRMATION MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-white/10 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-2.5 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-display font-bold text-zinc-100 text-sm">Reset Workspace Code?</h3>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              This will restore the original starter template for <strong className="text-zinc-200">{activeProblem ? activeProblem.title : language}</strong> and replace any unsaved edits.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-reset-code-btn"
                onClick={handleResetCode}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Reset to Template
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
