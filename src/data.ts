import { PracticeProblem, Roadmap, Badge, ActivityLog, InterviewQuestion, InterviewConfig } from './types';
import { ADDITIONAL_PROBLEMS } from './problemsData';
import { PROBLEM_SOLUTIONS } from './problemSolutionsData';

const RAW_PROBLEMS: PracticeProblem[] = [
  {
    id: 'prob-1',
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    languages: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    sampleInput: 'nums = [2,7,11,15], target = 9',
    sampleOutput: '[0,1]',
    hints: [
      'Try a brute force solution first: check every pair of numbers.',
      'Can you optimize it using a Hash Map to store numbers you have seen so far?',
      'As you traverse the array, look up the complement (target - nums[i]) in your map.'
    ],
    functionName: 'twoSum',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your solution here
  
}`,
      TypeScript: `function twoSum(nums: number[], target: number): number[] {
  // Write your solution here
  return [];
}`,
      Python: `def twoSum(nums, target):
    # Write your solution here
    pass`
    },
    solutionCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    testCases: [
      { input: '[2,7,11,15], 9', expected: '[0,1]' },
      { input: '[3,2,4], 6', expected: '[1,2]' },
      { input: '[3,3], 6', expected: '[0,1]' }
    ]
  },
  {
    id: 'prob-2',
    title: 'Reverse a Linked List',
    difficulty: 'Medium',
    topic: 'Linked Lists',
    languages: ['C++', 'Java', 'Python', 'Go', 'TypeScript'],
    description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    sampleInput: 'head = [1,2,3,4,5]',
    sampleOutput: '[5,4,3,2,1]',
    hints: [
      'A linked list can be reversed either iteratively or recursively.',
      'Iterative: keep three pointers: prev, curr, and next. Change curr.next to point to prev.',
      'Be careful about updating the head pointer at the end of the reversal.'
    ],
    functionName: 'reverseList',
    starterCode: {
      JavaScript: `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
  // Write your solution here
  
}`,
      TypeScript: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head: ListNode | null): ListNode | null {
  // Write your solution here
  return null;
}`,
      Python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    # Write your solution here
    pass`
    },
    solutionCode: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
    testCases: [
      { input: '[1,2,3,4,5]', expected: '[5,4,3,2,1]' },
      { input: '[1,2]', expected: '[2,1]' },
      { input: '[]', expected: '[]' }
    ]
  },
  {
    id: 'prob-3',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topic: 'Stacks',
    languages: ['JavaScript', 'Python', 'Java', 'C++', 'Swift'],
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only: "()[]{}"'
    ],
    sampleInput: 's = "()[]{}"',
    sampleOutput: 'true',
    hints: [
      'Use a stack data structure to keep track of open brackets.',
      'When you see a closing bracket, check if it matches the bracket on top of the stack.',
      'If the stack is empty at the end, the string is valid.'
    ],
    functionName: 'isValid',
    starterCode: {
      JavaScript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Write your solution here
  
}`,
      TypeScript: `function isValid(s: string): boolean {
  // Write your solution here
  return true;
}`,
      Python: `def isValid(s: str) -> bool:
    # Write your solution here
    pass`
    },
    solutionCode: `function isValid(s) {
  const stack = [];
  const map = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  for (let char of s) {
    if (char in map) {
      const topElement = stack.length === 0 ? '#' : stack.pop();
      if (topElement !== map[char]) {
        return false;
      }
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
    testCases: [
      { input: '"()"', expected: 'true' },
      { input: '"()[]{}"', expected: 'true' },
      { input: '"(]"', expected: 'false' }
    ]
  },
  {
    id: 'prob-4',
    title: 'Binary Tree Inorder Traversal',
    difficulty: 'Easy',
    topic: 'Trees',
    languages: ['Java', 'C++', 'Python', 'TypeScript', 'Go'],
    description: 'Given the `root` of a binary tree, return *the inorder traversal of its nodes\' values*.\n\nInorder traversal visits nodes in the following order: Left subtree, Root node, Right subtree.',
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100'
    ],
    sampleInput: 'root = [1,null,2,3]',
    sampleOutput: '[1,3,2]',
    hints: [
      'Recursive is trivial. Could you do it iteratively using a stack?',
      'Recursive: helper function that calls itself for left, adds current, then calls for right.'
    ],
    functionName: 'inorderTraversal',
    starterCode: {
      JavaScript: `/**
 * @param {TreeNode} root
 * @return {number[]}
 */
function inorderTraversal(root) {
  // Write your solution here
  
}`,
      TypeScript: `function inorderTraversal(root: any): number[] {
  // Write your solution here
  return [];
}`,
      Python: `def inorderTraversal(root):
    # Write your solution here
    pass`
    },
    solutionCode: `function inorderTraversal(root) {
  const result = [];
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }
  traverse(root);
  return result;
}`,
    testCases: [
      { input: '[1,null,2,3]', expected: '[1,3,2]' },
      { input: '[]', expected: '[]' },
      { input: '[1]', expected: '[1]' }
    ]
  },
  {
    id: 'prob-5',
    title: 'Fibonacci Number (Dynamic Programming)',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    languages: ['Python', 'JavaScript', 'TypeScript', 'C++', 'Rust'],
    description: 'The **Fibonacci numbers**, commonly denoted `F(n)` form a sequence, called the **Fibonacci sequence**, such that each number is the sum of the two preceding ones, starting from `0` and `1`.\n\nF(0) = 0, F(1) = 1\nF(n) = F(n - 1) + F(n - 2), for n > 1.\n\nGiven `n`, calculate `F(n)`.',
    constraints: [
      '0 <= n <= 30'
    ],
    sampleInput: 'n = 4',
    sampleOutput: '3',
    hints: [
      'The straightforward recursion takes O(2^n) time which is very slow.',
      'Use memoization (top-down) or tabulating arrays (bottom-up) to store previous calculations.',
      'Can you optimize the space complexity to O(1) by only tracking the last two numbers?'
    ],
    functionName: 'fib',
    starterCode: {
      JavaScript: `/**
 * @param {number} n
 * @return {number}
 */
function fib(n) {
  // Write your solution here
  
}`,
      TypeScript: `function fib(n: number): number {
  // Write your solution here
  return 0;
}`,
      Python: `def fib(n: int) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function fib(n) {
  if (n <= 1) return n;
  let prev2 = 0, prev1 = 1;
  for (let i = 2; i <= n; i++) {
    let current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
    testCases: [
      { input: '2', expected: '1' },
      { input: '3', expected: '2' },
      { input: '4', expected: '3' }
    ]
  },
  {
    id: 'prob-6',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topic: 'Strings',
    languages: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go'],
    description: 'Given a string `s`, find the length of the **longest substring** without repeating characters.',
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    sampleInput: 's = "abcabcbb"',
    sampleOutput: '3',
    hints: [
      'Think about using a sliding window with two pointers left and right.',
      'Use a map or set to check if the current character has been seen in our window.',
      'When you see a duplicate, shrink the window from the left until the duplicate is gone.'
    ],
    functionName: 'lengthOfLongestSubstring',
    starterCode: {
      JavaScript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Write your solution here
  
}`,
      TypeScript: `function lengthOfLongestSubstring(s: string): number {
  // Write your solution here
  return 0;
}`,
      Python: `def lengthOfLongestSubstring(s: str) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let left = 0;
  const charSet = new Set();
  
  for (let right = 0; right < s.length; right++) {
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    charSet.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}`,
    testCases: [
      { input: '"abcabcbb"', expected: '3' },
      { input: '"bbbbb"', expected: '1' },
      { input: '"pwwkew"', expected: '3' }
    ]
  },
  {
    id: 'prob-7',
    title: 'Binary Search',
    difficulty: 'Easy',
    topic: 'Searching',
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'],
    description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All integers in nums are unique.',
      'nums is sorted in ascending order.'
    ],
    sampleInput: 'nums = [-1,0,3,5,9,12], target = 9',
    sampleOutput: '4',
    hints: [
      'Maintain two pointers: left and right.',
      'Calculate mid = Math.floor((left + right) / 2).',
      'If nums[mid] === target, return mid. If nums[mid] < target, search right half; else search left half.'
    ],
    functionName: 'binarySearch',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function binarySearch(nums, target) {
  // Write your solution here
  
}`,
      TypeScript: `function binarySearch(nums: number[], target: number): number {
  // Write your solution here
  return -1;
}`,
      Python: `def binarySearch(nums, target):
    # Write your solution here
    pass`
    },
    solutionCode: `function binarySearch(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    testCases: [
      { input: '[-1,0,3,5,9,12], 9', expected: '4' },
      { input: '[-1,0,3,5,9,12], 2', expected: '-1' },
      { input: '[5], 5', expected: '0' }
    ]
  },
  {
    id: 'prob-8',
    title: 'Maximum Subarray (Kadane\'s)',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'],
    description: 'Given an integer array `nums`, find the subarray with the largest sum, and return *its sum*.',
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    sampleInput: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
    sampleOutput: '6',
    hints: [
      'Subarray is a contiguous non-empty sequence of elements within an array.',
      'Kadane\'s Algorithm: iterate through the array, at each index choose between starting a new subarray at nums[i] or extending current subarray sum.',
      'Track the global maximum seen so far.'
    ],
    functionName: 'maxSubArray',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // Write your solution here
  
}`,
      TypeScript: `function maxSubArray(nums: number[]): number {
  // Write your solution here
  return 0;
}`,
      Python: `def maxSubArray(nums):
    # Write your solution here
    pass`
    },
    solutionCode: `function maxSubArray(nums) {
  let currentSum = nums[0];
  let maxSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
      { input: '[1]', expected: '1' },
      { input: '[5,4,-1,7,8]', expected: '23' }
    ]
  },
  {
    id: 'prob-9',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    topic: 'Strings',
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'],
    description: 'A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.',
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    sampleInput: 's = "A man, a plan, a canal: Panama"',
    sampleOutput: 'true',
    hints: [
      'Filter the string to remove all non-alphanumeric characters and convert to lower case.',
      'Compare characters from the outside in using two pointers.'
    ],
    functionName: 'isPalindrome',
    starterCode: {
      JavaScript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  // Write your solution here
  
}`,
      TypeScript: `function isPalindrome(s: string): boolean {
  // Write your solution here
  return true;
}`,
      Python: `def isPalindrome(s: str) -> bool:
    # Write your solution here
    pass`
    },
    solutionCode: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
    testCases: [
      { input: '"A man, a plan, a canal: Panama"', expected: 'true' },
      { input: '"race a car"', expected: 'false' },
      { input: '" "', expected: 'true' }
    ]
  },
  ...ADDITIONAL_PROBLEMS
];

export const PROBLEMS: PracticeProblem[] = RAW_PROBLEMS.map(p => ({
  ...p,
  solution: p.solution || PROBLEM_SOLUTIONS[p.id]
}));

export const ROADMAPS: Roadmap[] = [
  {
    id: 'map-python',
    title: 'Python Mastery',
    description: 'From syntax fundamentals to algorithmic problem-solving and scripting.',
    icon: 'Python',
    nodes: [
      { id: 'py-1', title: 'Python Basics & Types', description: 'Variables, loops, operators, and dynamic typing.', status: 'completed', xpReward: 100, duration: '2 hours' },
      { id: 'py-2', title: 'Control Flow & Functions', description: 'Conditionals, lists, dictionaries, tuples, and custom helpers.', status: 'unlocked', xpReward: 150, duration: '3 hours' },
      { id: 'py-3', title: 'Object-Oriented Python', description: 'Classes, inheritance, polymorphism, and dunder methods.', status: 'locked', xpReward: 200, duration: '4 hours' },
      { id: 'py-4', title: 'File Handlers & Libraries', description: 'Reading, writing text, CSV, JSON files, and working with OS module.', status: 'locked', xpReward: 150, duration: '2.5 hours' },
      { id: 'py-5', title: 'Advanced Scripting & API Integration', description: 'Decorators, generators, context managers, and API requests.', status: 'locked', xpReward: 300, duration: '6 hours' }
    ]
  },
  {
    id: 'map-webdev',
    title: 'Full-Stack Web Development',
    description: 'Learn modern single page client structures and robust API backends.',
    icon: 'Globe',
    nodes: [
      { id: 'web-1', title: 'Modern HTML5 & CSS3 Grid/Flexbox', description: 'Semantic layout, responsive design, media queries, and Tailwind.', status: 'completed', xpReward: 100, duration: '3 hours' },
      { id: 'web-2', title: 'JS ES6 & DOM Interaction', description: 'Asynchronous fetches, callbacks, promises, and dynamic event handling.', status: 'unlocked', xpReward: 150, duration: '4 hours' },
      { id: 'web-3', title: 'React 19 & Component Architecture', description: 'Functional components, advanced hooks, states, and effects.', status: 'locked', xpReward: 250, duration: '6 hours' },
      { id: 'web-4', title: 'Express & Node Server Frameworks', description: 'Build restful server routing, request verification, and middlewares.', status: 'locked', xpReward: 200, duration: '5 hours' },
      { id: 'web-5', title: 'Durable Database Systems', description: 'Integrate Firestore, execute transactions, and configure rules.', status: 'locked', xpReward: 300, duration: '7 hours' }
    ]
  },
  {
    id: 'map-dsa',
    title: 'Data Structures & Algorithms',
    description: 'Master arrays, lists, stacks, queues, trees, graphs, and dynamic planning.',
    icon: 'Database',
    nodes: [
      { id: 'dsa-1', title: 'Space & Time Complexity', description: 'Big O notation, memory boundaries, and execution diagnostics.', status: 'completed', xpReward: 100, duration: '1.5 hours' },
      { id: 'dsa-2', title: 'Linear Structures', description: 'Singly/doubly linked lists, custom stacks, and circular queues.', status: 'completed', xpReward: 150, duration: '3.5 hours' },
      { id: 'dsa-3', title: 'Sorting & Searching', description: 'Binary search, Quicksort, Mergesort, and Hash map collisions.', status: 'unlocked', xpReward: 200, duration: '4.5 hours' },
      { id: 'dsa-4', title: 'Hierarchical Trees & Heaps', description: 'Binary search trees, AVL balancing, max/min heaps, and traversals.', status: 'locked', xpReward: 250, duration: '6 hours' },
      { id: 'dsa-5', title: 'Dynamic Programming & Graphs', description: 'Subproblem overlap, tabulations, BFS/DFS pathfinding, and Djikstra.', status: 'locked', xpReward: 400, duration: '9 hours' }
    ]
  },
  {
    id: 'map-ai',
    title: 'AI & Machine Learning Foundations',
    description: 'Delve into modeling, regressions, neural layers, and LLM integrations.',
    icon: 'Cpu',
    nodes: [
      { id: 'ai-1', title: 'Linear Algebra & Statistics', description: 'Matrices, vectors, eigenvalues, derivatives, and variances.', status: 'unlocked', xpReward: 120, duration: '3 hours' },
      { id: 'ai-2', title: 'Regression & Classification', description: 'Linear models, logistic boundaries, decision forests, and evaluation.', status: 'locked', xpReward: 180, duration: '5 hours' },
      { id: 'ai-3', title: 'Deep Neural Networks', description: 'Perceptrons, backpropagation, activations, and dense tensor graphs.', status: 'locked', xpReward: 250, duration: '7 hours' },
      { id: 'ai-4', title: 'Natural Language Processing', description: 'Word embeddings, RNNs, transformer attention layers, and tokenization.', status: 'locked', xpReward: 300, duration: '8 hours' },
      { id: 'ai-5', title: 'Prompting & LLM Integrations', description: 'Structuring Gemini API requests, tools, schemas, and chat sessions.', status: 'locked', xpReward: 350, duration: '6 hours' }
    ]
  }
];

export const BADGES: Badge[] = [
  { id: 'badge-1', title: 'First Steps', description: 'Joined AI Coding Mentor platform.', icon: 'Award', unlocked: true, unlockedAt: '2026-08-13' },
  { id: 'badge-2', title: 'Problem Solver', description: 'Solved your first practice coding problem.', icon: 'CheckCircle', unlocked: false },
  { id: 'badge-3', title: 'Daily Dev', description: 'Maintained a 3-day active streak.', icon: 'Flame', unlocked: false },
  { id: 'badge-4', title: 'Code Warrior', description: 'Solved 3 practice problems successfully.', icon: 'Shield', unlocked: false },
  { id: 'badge-5', title: 'Star Interviewee', description: 'Completed a mock technical interview.', icon: 'Star', unlocked: false },
  { id: 'badge-6', title: 'AI Companion', description: 'Sent 5 messages to your AI Coding Mentor.', icon: 'Cpu', unlocked: false },
  { id: 'badge-7', title: 'Streak Veteran', description: 'Maintained a 7-day active learning streak.', icon: 'Flame', unlocked: false },
  { id: 'badge-8', title: 'Roadmap Pioneer', description: 'Completed 2 roadmap learning nodes.', icon: 'Compass', unlocked: false },
  { id: 'badge-9', title: 'Rising Star', description: 'Accumulated 500 Total XP.', icon: 'Award', unlocked: false },
  { id: 'badge-10', title: 'Algorithm Master', description: 'Solved 5 practice problems successfully.', icon: 'CheckCircle', unlocked: false }
];

export const RECENT_ACTIVITY: ActivityLog[] = [];

export const SAMPLE_SUGGESTED_PROMPTS = [
  'Explain how a hash map resolves key collisions.',
  'Optimize my nested-loop code for finding duplicates.',
  'Explain recursion using a simple step-by-step example.',
  'Generate unit tests for a custom JavaScript stack.'
];

export const COMPANIES = ['Google', 'Meta', 'Netflix', 'Microsoft', 'Amazon', 'Apple', 'Stripe', 'Airbnb'];
export const ROLES = ['Frontend Engineer', 'Backend Engineer', 'Fullstack Engineer', 'Data Scientist', 'iOS Engineer', 'Security Engineer'];

export const INTERVIEW_TYPES = [
  { id: 'technical', label: 'Technical & Systems', description: 'Core CS fundamentals, architecture, and language runtimes' },
  { id: 'coding', label: 'Coding & Algorithms', description: 'Data structures, complexity analysis, and edge case reasoning' },
  { id: 'system_design', label: 'System Design', description: 'High-scale architecture, databases, caching, and tradeoffs' },
  { id: 'behavioral', label: 'Behavioral & Leadership', description: 'STAR method, engineering ownership, and team collaboration' },
  { id: 'mixed', label: 'Comprehensive Round', description: 'Balanced combination of technical depth, coding, and design' }
] as const;

export const INTERVIEW_TOPICS = [
  'All Topics',
  'Arrays & Strings',
  'Linked Lists',
  'Trees & Graphs',
  'Dynamic Programming',
  'Hash Maps',
  'React & Frontend',
  'Express & APIs',
  'Databases & Systems',
  'Concurrency & Threads',
  'System Design',
  'Behavioral Leadership'
];

export const CURATED_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // Google
  {
    id: 'g-1',
    question: 'How would you design a distributed cache system for holding 100 million user authentication tokens with sub-millisecond lookup latency?',
    type: 'system_design',
    topic: 'Databases & Systems',
    difficulty: 'Hard',
    context: 'Google Cloud Infrastructure / Distributed Systems',
    keyConcepts: ['Consistent Hashing', 'LRU Eviction', 'Memory Replication', 'Partitioning', 'Cache Stampede Mitigation']
  },
  {
    id: 'g-2',
    question: 'Given an array of integers representing house values, explain how to determine the maximum robbery amount such that no two adjacent houses are robbed. State your time and space complexity.',
    type: 'coding',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    context: 'Google Core Algorithms Round',
    keyConcepts: ['Dynamic Programming', 'State Transition', 'O(N) Time', 'O(1) Space Optimization']
  },
  {
    id: 'g-3',
    question: 'What is the precise difference between processes and threads, and how does the operating system manage context switching and memory segmentation between them?',
    type: 'technical',
    topic: 'Concurrency & Threads',
    difficulty: 'Medium',
    context: 'Google Systems Engineering',
    keyConcepts: ['Virtual Memory', 'Stack vs Heap', 'Context Switching Overhead', 'PCB/TCB', 'Thread Pools']
  },
  {
    id: 'g-4',
    question: 'Describe a situation where you identified a critical technical bottleneck or architectural flaw in an active system. How did you diagnose it, communicate with stakeholders, and implement the resolution?',
    type: 'behavioral',
    topic: 'Behavioral Leadership',
    difficulty: 'Medium',
    context: 'Google Leadership & "Googleyness"',
    keyConcepts: ['STAR Method', 'Root Cause Analysis', 'Cross-functional Communication', 'Measurable Impact']
  },

  // Meta
  {
    id: 'm-1',
    question: 'How would you design a real-time newsfeed ranking pipeline that serves millions of personalized active updates while handling high write throughput?',
    type: 'system_design',
    topic: 'System Design',
    difficulty: 'Hard',
    context: 'Meta Infrastructure / Core Feed',
    keyConcepts: ['Fan-out on write vs read', 'Message Queues', 'Caching Layers', 'Ranking ML Model Inference']
  },
  {
    id: 'm-2',
    question: 'Explain how React\'s Fiber reconciler works under the hood. How does cooperative scheduling and time-slicing prevent blocking the main browser thread during massive UI state updates?',
    type: 'technical',
    topic: 'React & Frontend',
    difficulty: 'Hard',
    context: 'Meta Frontend Infrastructure',
    keyConcepts: ['Fiber Nodes', 'Two-phase reconciliation (Render/Commit)', 'RequestIdleCallback', 'Concurrent Mode']
  },
  {
    id: 'm-3',
    question: 'Explain how you would find the lowest common ancestor (LCA) of two nodes in a binary tree. Discuss both the recursive and iterative approaches, detailing their space complexity.',
    type: 'coding',
    topic: 'Trees & Graphs',
    difficulty: 'Medium',
    context: 'Meta Algorithmic Round',
    keyConcepts: ['Tree Traversal', 'Post-order DFS', 'O(H) Recursion Stack', 'Parent Pointer Mapping']
  },
  {
    id: 'm-4',
    question: 'Tell me about a time you strongly disagreed with a senior engineer or product manager about an architectural decision. How did you navigate the conflict to reach a consensus?',
    type: 'behavioral',
    topic: 'Behavioral Leadership',
    difficulty: 'Medium',
    context: 'Meta Culture / Move Fast',
    keyConcepts: ['Constructive Conflict', 'Data-Driven Reasoning', 'Disagree and Commit', 'Empathetic Listening']
  },

  // Netflix
  {
    id: 'n-1',
    question: 'How would you architect a global video thumbnail CDN edge-caching layer that delivers images in under 15ms while protecting origin storage from cache stampedes?',
    type: 'system_design',
    topic: 'Databases & Systems',
    difficulty: 'Hard',
    context: 'Netflix Edge & Video Systems',
    keyConcepts: ['Edge CDN Caching', 'Single-flight Mutex', 'Origin Shielding', 'Geo-DNS', 'TTL Expirations']
  },
  {
    id: 'n-2',
    question: 'Explain the Node.js / V8 Event Loop phases (timers, pending callbacks, poll, check, close). How do microtasks (Promises, process.nextTick) interact with macrotasks (setTimeout, setImmediate)?',
    type: 'technical',
    topic: 'Express & APIs',
    difficulty: 'Medium',
    context: 'Netflix Backend Systems',
    keyConcepts: ['Libuv Event Loop', 'Microtask Queue Priority', 'process.nextTick Starvation', 'Asynchronous I/O']
  },
  {
    id: 'n-3',
    question: 'Given an unsorted array of integers, how would you design an algorithm to find the length of the longest consecutive elements sequence in O(N) time complexity?',
    type: 'coding',
    topic: 'Hash Maps',
    difficulty: 'Medium',
    context: 'Netflix Problem Solving',
    keyConcepts: ['HashSet Lookup', 'Streak Initialization Check', 'O(N) Time Guarantee', 'Memory Overhead']
  },

  // Microsoft
  {
    id: 'ms-1',
    question: 'How does Garbage Collection in modern managed runtimes (like V8 or .NET CLR) balance mark-and-sweep cycles with generation-based hypotheses to minimize stop-the-world pauses?',
    type: 'technical',
    topic: 'Concurrency & Threads',
    difficulty: 'Hard',
    context: 'Microsoft Core Platforms',
    keyConcepts: ['Generational GC (Young/Old gen)', 'Mark-Sweep-Compact', 'Write Barriers', 'Concurrent Marking']
  },
  {
    id: 'ms-2',
    question: 'How would you implement a thread-safe LRU (Least Recently Used) cache with O(1) get and put operations? Detail your concurrency synchronization strategy.',
    type: 'coding',
    topic: 'Hash Maps',
    difficulty: 'Hard',
    context: 'Microsoft Systems & Cloud',
    keyConcepts: ['Doubly Linked List', 'HashMap Indexing', 'Read-Write Locks / Mutex', 'O(1) Node Eviction']
  },
  {
    id: 'ms-3',
    question: 'Explain the difference between SQL relational databases (ACID guarantees, indexing, B-Trees) and NoSQL Document/Key-Value stores. When is eventual consistency appropriate?',
    type: 'technical',
    topic: 'Databases & Systems',
    difficulty: 'Medium',
    context: 'Microsoft Azure Architecture',
    keyConcepts: ['ACID vs BASE', 'B-Tree Indexing', 'CAP Theorem', 'Write-Ahead Log (WAL)', 'Horizontal Sharding']
  },

  // Amazon
  {
    id: 'amz-1',
    question: 'How would you design an inventory reservation system for Amazon Prime Day flash sales that prevents overselling while handling 50,000 requests per second?',
    type: 'system_design',
    topic: 'System Design',
    difficulty: 'Hard',
    context: 'Amazon Retail Systems',
    keyConcepts: ['Distributed Locking (Redis/Redlock)', 'Optimistic Concurrency', 'Idempotency Keys', 'Dead Letter Queues']
  },
  {
    id: 'amz-2',
    question: 'Explain how you would detect if a directed graph contains a cycle. Walk through topological sorting (Kahn\'s Algorithm / DFS with 3-color marking) with complexity analysis.',
    type: 'coding',
    topic: 'Trees & Graphs',
    difficulty: 'Medium',
    context: 'Amazon Algorithms Assessment',
    keyConcepts: ['Topological Sort', 'In-degree array', 'DFS Recursion Stack Tracking', 'O(V + E) Complexity']
  },
  {
    id: 'amz-3',
    question: 'Describe a time when you had to make a high-stakes technical decision with incomplete information or ambiguous requirements. How did you balance speed versus precision?',
    type: 'behavioral',
    topic: 'Behavioral Leadership',
    difficulty: 'Medium',
    context: 'Amazon Leadership Principle: Bias for Action & Ownership',
    keyConcepts: ['Two-way Door Decisions', 'Risk Mitigation', 'Iterative Delivery', 'Outcome Measurement']
  },

  // Apple & Stripe & General Tech
  {
    id: 'gen-1',
    question: 'Explain how WebSockets differ from HTTP/2 Server-Sent Events (SSE) and long-polling. In what scenarios would you choose SSE over full duplex WebSockets?',
    type: 'technical',
    topic: 'Express & APIs',
    difficulty: 'Easy',
    context: 'Stripe API & Infrastructure',
    keyConcepts: ['Full-Duplex vs Unidirectional', 'Connection Handshake', 'Automatic Reconnection', 'Firewall / Proxy Traversal']
  },
  {
    id: 'gen-2',
    question: 'Given an array of strings, group all anagrams together. What is the optimal time complexity using character count tuples or prime multiplication hashing?',
    type: 'coding',
    topic: 'Arrays & Strings',
    difficulty: 'Easy',
    context: 'Apple Software Assessment',
    keyConcepts: ['Character Frequency Array', 'Hash Key Generation', 'O(N * K) Time', 'HashMap Grouping']
  },
  {
    id: 'gen-3',
    question: 'How does Browser Critical Rendering Path work (DOM -> CSSOM -> Render Tree -> Layout -> Paint)? How do you diagnose and eliminate layout thrashing in web apps?',
    type: 'technical',
    topic: 'React & Frontend',
    difficulty: 'Medium',
    context: 'Airbnb Web Experience',
    keyConcepts: ['Forced Synchronous Layout', 'Composite Layers', 'will-change', 'RequestAnimationFrame']
  },
  {
    id: 'gen-4',
    question: 'Explain how you would design an idempotency key mechanism for a payment processing API to guarantee that network retries never double-charge a customer.',
    type: 'system_design',
    topic: 'Express & APIs',
    difficulty: 'Hard',
    context: 'Stripe Core Payments',
    keyConcepts: ['Idempotency Keys', 'Atomic Database Transactions', 'Locking in Cache', 'Response Caching']
  },
  {
    id: 'gen-5',
    question: 'How does the V8 JavaScript engine optimize hidden classes (Shapes/Maps) and inline caching (IC)? How can polymorphic call sites hurt performance?',
    type: 'technical',
    topic: 'React & Frontend',
    difficulty: 'Hard',
    context: 'Frontend Runtime Performance',
    keyConcepts: ['Hidden Classes / Shapes', 'Monomorphic vs Megamorphic IC', 'Object Layout Consistency', 'De-optimizations']
  },
  {
    id: 'gen-6',
    question: 'Given a linked list, reverse the nodes in groups of k. If the number of nodes is not a multiple of k, leave the remaining nodes as-is. Analyze space complexity.',
    type: 'coding',
    topic: 'Linked Lists',
    difficulty: 'Hard',
    context: 'Algorithmic Data Structures',
    keyConcepts: ['Pointer Manipulation', 'Iterative vs Recursive Traversal', 'O(1) Space', 'Boundary Re-linking']
  },
  {
    id: 'gen-7',
    question: 'Explain how OAuth 2.0 Authorization Code Flow with PKCE works. Why is PKCE critical for Single-Page Applications (SPAs) and mobile clients?',
    type: 'technical',
    topic: 'Express & APIs',
    difficulty: 'Medium',
    context: 'Application Security & Auth',
    keyConcepts: ['Code Verifier & Code Challenge', 'State Parameter', 'CSRF Mitigation', 'Token Exchange Endpoint']
  },
  {
    id: 'gen-8',
    question: 'How would you architect a distributed Rate Limiter capable of handling 500,000 requests per minute with sliding-window log precision across multiple server regions?',
    type: 'system_design',
    topic: 'System Design',
    difficulty: 'Hard',
    context: 'High-Scale Infrastructure',
    keyConcepts: ['Sliding Window Log / Counter', 'Redis Sorted Sets (ZADD/ZREMRANGEBYSCORE)', 'Race Condition Handling with Lua Scripts', 'Local In-Memory Fallbacks']
  },
  {
    id: 'gen-9',
    question: 'Describe a project where you had to balance technical debt versus aggressive product delivery deadlines. How did you negotiate tradeoffs and maintain code quality?',
    type: 'behavioral',
    topic: 'Behavioral Leadership',
    difficulty: 'Medium',
    context: 'Engineering Execution & Prioritization',
    keyConcepts: ['Pragmatic Engineering', 'Risk Assessment', 'Debt Backlog Grooming', 'Stakeholder Alignment']
  },
  {
    id: 'gen-10',
    question: 'Given an array of intervals [start, end], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all input intervals.',
    type: 'coding',
    topic: 'Arrays & Strings',
    difficulty: 'Medium',
    context: 'Interval Scheduling & Algorithms',
    keyConcepts: ['Sorting by Start Time', 'Greedy Merging', 'O(N log N) Time', 'O(N) Output Space']
  },
  {
    id: 'gen-11',
    question: 'What happens under the hood when a browser initiates a TLS 1.3 handshake compared to TLS 1.2? Explain zero-RTT (0-RTT) resumption and its security considerations.',
    type: 'technical',
    topic: 'Databases & Systems',
    difficulty: 'Hard',
    context: 'Network Protocols & Web Systems',
    keyConcepts: ['Diffie-Hellman Key Exchange', '1-RTT vs 0-RTT', 'Replay Attack Prevention', 'Cipher Suite Negotiation']
  },
  {
    id: 'gen-12',
    question: 'How would you design a real-time collaborative document editor like Google Docs with offline editing support and concurrent change synchronization?',
    type: 'system_design',
    topic: 'System Design',
    difficulty: 'Hard',
    context: 'Collaborative Systems Architecture',
    keyConcepts: ['Operational Transformation (OT) vs CRDTs', 'State Vector Clocks', 'WebSocket Transport', 'Conflict Resolution']
  },
  {
    id: 'gen-13',
    question: 'Implement a function to evaluate a boolean expression given as a binary tree with AND, OR, NOT operations. Provide both time and space complexity.',
    type: 'coding',
    topic: 'Trees & Graphs',
    difficulty: 'Medium',
    context: 'Abstract Syntax Trees & Evaluation',
    keyConcepts: ['Post-order Traversal', 'Recursion Stack', 'Boolean Logic Evaluation', 'O(N) Time']
  },
  {
    id: 'gen-14',
    question: 'Tell me about a time you mentored a junior engineer or onboarded a peer who was struggling with a complex codebase. What strategies did you employ?',
    type: 'behavioral',
    topic: 'Behavioral Leadership',
    difficulty: 'Easy',
    context: 'Team Culture & Mentorship',
    keyConcepts: ['Active Listening', 'Pair Programming', 'Psychological Safety', 'Measurable Growth']
  }
];

export function getCuratedQuestions(config: InterviewConfig): InterviewQuestion[] {
  const targetCount = Math.max(3, Math.min(20, config.questionCount || 10));
  let matches = CURATED_INTERVIEW_QUESTIONS.filter(q => {
    // Check type match if specified
    if (config.interviewType && config.interviewType !== 'mixed' && q.type !== config.interviewType) {
      return false;
    }
    // Check topic match if specified and not 'All Topics'
    if (config.topic && config.topic !== 'All Topics' && q.topic !== config.topic) {
      return false;
    }
    // Check difficulty match if specified
    if (config.difficulty && q.difficulty !== config.difficulty) {
      return true; // Soft preference
    }
    return true;
  });

  // If filtered matches are fewer than target, supplement from general pool without duplicates
  const matchedIds = new Set(matches.map(m => m.id));
  for (const q of CURATED_INTERVIEW_QUESTIONS) {
    if (!matchedIds.has(q.id)) {
      matches.push(q);
      matchedIds.add(q.id);
      if (matches.length >= targetCount) break;
    }
  }

  // If still fewer than targetCount (e.g. user selected 20 questions and pool has ~18-24),
  // supplement with procedurally generated variations to guarantee exact targetCount
  if (matches.length < targetCount) {
    let fillIndex = 1;
    while (matches.length < targetCount) {
      const base = CURATED_INTERVIEW_QUESTIONS[(matches.length) % CURATED_INTERVIEW_QUESTIONS.length];
      matches.push({
        ...base,
        id: `${base.id}-ext-${fillIndex}`,
        question: `[Follow-up Round ${fillIndex}] ${base.question}`,
        context: `${config.company || 'Tech Firm'} In-Depth Probe ${fillIndex}`
      });
      fillIndex++;
    }
  }

  // Return exactly the targetCount requested
  return matches.slice(0, targetCount);
}

export const INTERVIEW_QUESTIONS_POOL: { [key: string]: string[] } = {
  'Google': [
    'How do you handle a system design that requires holding 100 million user records in memory while supporting rapid lookup?',
    'Implement a function to find the shortest path in an unweighted grid with moving obstacles.',
    'What is the difference between processes and threads, and how does your chosen language manage thread pools?'
  ],
  'Meta': [
    'Explain how you would implement a newsfeed ranking algorithm with high performance.',
    'Describe the performance implications of CSS class nesting and DOM tree depth in React re-renders.',
    'Given an array of active friends\' coordinate points, how would you design a query to find the nearest friends in O(log N) time?'
  ],
  'Netflix': [
    'How would you manage caching of high-resolution video thumbnails at the CDN edge?',
    'What is the event loop, and how does asynchronous I/O improve performance in server-side systems?',
    'How do you design a database schema for user profiles, viewing histories, and recommendations to ensure extreme scalability?'
  ],
  'Microsoft': [
    'What is garbage collection, and how do languages like Java or C# minimize stop-the-world pauses?',
    'Write a class representing a Thread-Safe LRU Cache.',
    'Describe how you would design a visual flow node-editor similar to PowerAutomate.'
  ]
};

export const FALLBACK_QUESTIONS = [
  'Explain how you would find a cycle in a singly linked list in O(N) time and O(1) space.',
  'What are the advantages of relational databases like PostgreSQL over NoSQL databases like MongoDB?',
  'Explain the concept of CORS (Cross-Origin Resource Sharing) and how a server configures it safely.'
];
