import { ProblemSolution } from './types';

export const PROBLEM_SOLUTIONS: { [problemId: string]: ProblemSolution } = {
  "prob-1": {
    "approach": "One-Pass Hash Map (Complement Lookup)",
    "explanation": "Instead of checking every pair with a brute-force nested loop (O(n²)), we can trade space for time. As we iterate through the array, the number needed to reach the target is `complement = target - nums[i]`. We query a Hash Map to see if this complement was already encountered in a previous step. If found, we immediately return the stored index and the current index. Otherwise, we insert the current number and its index into the map.",
    "algorithm": [
      "Initialize an empty Hash Map to store `value -> index` pairs.",
      "Iterate through `nums` with index `i` and value `num`.",
      "Compute `complement = target - num`.",
      "If `complement` exists in the Hash Map, return `[map.get(complement), i]`.",
      "Otherwise, add `map.set(num, i)` and continue.",
      "If the loop finishes without finding a pair, return an empty array `[]`."
    ],
    "edgeCases": [
      "Negative numbers in the array or negative target (e.g., target = -8 with [-3, -5]).",
      "Array with exactly two elements that sum to the target.",
      "Duplicate values where the target is formed by two identical numbers (e.g., target = 6 with [3, 3])."
    ],
    "timeComplexity": "O(n) - Single pass through the array with O(1) average-time hash map insertions and lookups.",
    "spaceComplexity": "O(n) - In the worst case, stores up to n - 1 elements in the hash map before finding the pair.",
    "code": {
      "JavaScript": "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
      "TypeScript": "function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement)!, i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
      "Python": "def twoSum(nums: list, target: int) -> list:\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []"
    }
  },
  "prob-2": {
    "approach": "Iterative Three-Pointer Pointer Reversal",
    "explanation": "To reverse a singly linked list in-place, we reorient each node's `next` pointer toward its predecessor. We maintain three pointers: `prev` (initially null), `curr` (starting at head), and `nextTemp` (to preserve the rest of the list before severing the link). In each iteration, we save `curr.next`, redirect `curr.next = prev`, shift `prev = curr`, and advance `curr = nextTemp`. When `curr` becomes null, `prev` resides at the new head of the reversed list.",
    "algorithm": [
      "Initialize `prev` to null and `curr` to the input `head`.",
      "While `curr` is not null:",
      "  a. Store `nextTemp = curr.next` so the remaining chain is not lost.",
      "  b. Set `curr.next = prev` to reverse the current link.",
      "  c. Advance `prev = curr`.",
      "  d. Advance `curr = nextTemp`.",
      "Return `prev` as the new head of the reversed list."
    ],
    "edgeCases": [
      "Empty linked list (`head === null`): returns null safely.",
      "Single-node list (`head.next === null`): returns the same node unchanged.",
      "Two-node list: properly swaps direction without cycles or memory leaks."
    ],
    "timeComplexity": "O(n) - Visits every node in the linked list exactly once.",
    "spaceComplexity": "O(1) - Modifies pointers in-place using constant auxiliary variables.",
    "code": {
      "JavaScript": "function reverseList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr !== null) {\n    const nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}",
      "TypeScript": "function reverseList(head: any): any {\n  let prev: any = null;\n  let curr: any = head;\n  while (curr !== null) {\n    const nextTemp: any = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}",
      "Python": "def reverseList(head):\n    prev = None\n    curr = head\n    while curr is not None:\n        next_temp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_temp\n    return prev"
    }
  },
  "prob-3": {
    "approach": "LIFO Stack with Matching Bracket Hash Map",
    "explanation": "Brackets must close in the reverse order of their opening (Last-In, First-Out). A stack is ideal for this invariant. When an opening bracket `(`, `{`, or `[` is encountered, we push it onto the stack. When a closing bracket `)`, `}`, or `]` is met, we pop the most recent opener from the stack and verify that they match. If the stack is empty upon seeing a closing bracket, or if the popped opener does not match, the sequence is invalid. Finally, if any unclosed openers remain on the stack at the end, the string is invalid.",
    "algorithm": [
      "Create a matching map `{ ')': '(', '}': '{', ']': '[' }` and an empty stack.",
      "Iterate through each character `char` in the input string `s`.",
      "If `char` is a closing bracket (exists as a key in map):",
      "  a. Pop the top element from the stack (or use a dummy value if stack is empty).",
      "  b. If popped element does not equal `map[char]`, return `false`.",
      "If `char` is an opening bracket, push it onto the stack.",
      "After the loop, return `true` if and only if the stack is completely empty."
    ],
    "edgeCases": [
      "Odd-length string: cannot be validly paired (early exit possible).",
      "String starting with a closing bracket (e.g. `]`): stack underflow handled safely.",
      "Only opening brackets (e.g. `(((`): returns `false` due to non-empty stack at the end.",
      "Empty string: trivially valid (`true`)."
    ],
    "timeComplexity": "O(n) - Single pass through the string of length n with O(1) stack operations.",
    "spaceComplexity": "O(n) - In the worst case (all opening brackets), the stack holds all n characters.",
    "code": {
      "JavaScript": "function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (let i = 0; i < s.length; i++) {\n    const char = s[i];\n    if (char in map) {\n      const top = stack.length === 0 ? '#' : stack.pop();\n      if (top !== map[char]) return false;\n    } else {\n      stack.push(char);\n    }\n  }\n  return stack.length === 0;\n}",
      "TypeScript": "function isValid(s: string): boolean {\n  const stack: string[] = [];\n  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };\n  for (let i = 0; i < s.length; i++) {\n    const char = s[i];\n    if (char in map) {\n      const top = stack.length === 0 ? '#' : stack.pop()!;\n      if (top !== map[char]) return false;\n    } else {\n      stack.push(char);\n    }\n  }\n  return stack.length === 0;\n}",
      "Python": "def isValid(s: str) -> bool:\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if top != mapping[char]:\n                return False\n        else:\n            stack.append(char)\n    return len(stack) == 0"
    }
  },
  "prob-4": {
    "approach": "Depth-First Search (Inorder: Left -> Root -> Right)",
    "explanation": "Binary tree inorder traversal systematically processes the left subtree first, visits the current root value, and then processes the right subtree. For a Binary Search Tree (BST), inorder traversal produces values in non-decreasing sorted order. We can implement this recursively with a helper function or iteratively using an explicit call stack.",
    "algorithm": [
      "Initialize an empty list `result` to collect traversed node values.",
      "Define a recursive helper function `traverse(node)`:",
      "  a. If `node` is null/None, return.",
      "  b. Recursively call `traverse(node.left)`.",
      "  c. Append `node.val` to `result`.",
      "  d. Recursively call `traverse(node.right)`.",
      "Call `traverse(root)` starting at the tree root.",
      "Return the accumulated `result` array."
    ],
    "edgeCases": [
      "Empty tree (`root === null`): returns empty list `[]`.",
      "Single-node tree: returns `[root.val]`.",
      "Skewed tree (linked-list shape, only left or right children): handled without stack overflow."
    ],
    "timeComplexity": "O(n) - Visits every node in the binary tree exactly once.",
    "spaceComplexity": "O(n) - Call stack takes O(h) where h is tree height (O(n) in worst-case skewed tree, O(log n) for balanced tree).",
    "code": {
      "JavaScript": "function inorderTraversal(root) {\n  const result = [];\n  function traverse(node) {\n    if (!node) return;\n    traverse(node.left);\n    result.push(node.val);\n    traverse(node.right);\n  }\n  traverse(root);\n  return result;\n}",
      "TypeScript": "function inorderTraversal(root: any): number[] {\n  const result: number[] = [];\n  function traverse(node: any) {\n    if (!node) return;\n    traverse(node.left);\n    result.push(node.val);\n    traverse(node.right);\n  }\n  traverse(root);\n  return result;\n}",
      "Python": "def inorderTraversal(root) -> list:\n    result = []\n    def traverse(node):\n        if not node:\n            return\n        traverse(node.left)\n        result.append(node.val)\n        traverse(node.right)\n    traverse(root)\n    return result"
    }
  },
  "prob-5": {
    "approach": "Iterative Dynamic Programming (Space-Optimized O(1))",
    "explanation": "The Fibonacci sequence is defined by the recurrence relation F(n) = F(n-1) + F(n-2) with base cases F(0) = 0 and F(1) = 1. Naive recursion exhibits exponential O(2^n) time due to redundant overlapping subproblems. Because each state only depends on the previous two states, we do not need an entire memoization table; we can maintain two rolling variables `prev2` and `prev1` in O(1) auxiliary space.",
    "algorithm": [
      "If `n <= 1`, return `n` directly (base cases F(0)=0, F(1)=1).",
      "Initialize `prev2 = 0` and `prev1 = 1`.",
      "Iterate `i` from 2 up to `n`:",
      "  a. Compute `curr = prev1 + prev2`.",
      "  b. Update `prev2 = prev1`.",
      "  c. Update `prev1 = curr`.",
      "Return `prev1` after the loop terminates."
    ],
    "edgeCases": [
      "Base case n = 0: returns 0 immediately.",
      "Base case n = 1: returns 1 immediately.",
      "Larger values up to n = 30: handles integer bounds cleanly."
    ],
    "timeComplexity": "O(n) - Computes each Fibonacci number sequentially in linear time.",
    "spaceComplexity": "O(1) - Uses only two numeric accumulator variables.",
    "code": {
      "JavaScript": "function fib(n) {\n  if (n <= 1) return n;\n  let prev2 = 0, prev1 = 1;\n  for (let i = 2; i <= n; i++) {\n    const current = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = current;\n  }\n  return prev1;\n}",
      "TypeScript": "function fib(n: number): number {\n  if (n <= 1) return n;\n  let prev2 = 0;\n  let prev1 = 1;\n  for (let i = 2; i <= n; i++) {\n    const current = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = current;\n  }\n  return prev1;\n}",
      "Python": "def fib(n: int) -> int:\n    if n <= 1:\n        return n\n    prev2, prev1 = 0, 1\n    for _ in range(2, n + 1):\n        prev2, prev1 = prev1, prev2 + prev1\n    return prev1"
    }
  },
  "prob-6": {
    "approach": "Sliding Window with Dynamic Hash Set",
    "explanation": "We maintain a contiguous sliding window `[left, right]` representing a substring without duplicate characters. As the `right` pointer expands character-by-character, if `s[right]` is already in our set of seen characters, we increment `left` and remove `s[left]` from the set until the duplicate is eliminated. At each step, the window size is `right - left + 1`, and we track the maximum size observed.",
    "algorithm": [
      "Initialize `charSet = new Set()`, `left = 0`, and `maxLength = 0`.",
      "Iterate `right` from 0 to `s.length - 1`:",
      "  a. While `charSet.has(s[right])`, delete `s[left]` from `charSet` and advance `left++`.",
      "  b. Insert `s[right]` into `charSet`.",
      "  c. Update `maxLength = Math.max(maxLength, right - left + 1)`.",
      "Return `maxLength`."
    ],
    "edgeCases": [
      "Empty string `\"\"`: returns 0.",
      "Single-character string `\"a\"`: returns 1.",
      "String with all identical characters `\"bbbbb\"`: returns 1.",
      "String with all unique characters `\"abcdef\"`: returns string length 6.",
      "Strings containing whitespace and special symbols."
    ],
    "timeComplexity": "O(n) - Both left and right pointers advance at most n times, visiting each character at most twice.",
    "spaceComplexity": "O(min(n, m)) - Space bounded by the character set alphabet size m (e.g. 26 lowercase English, or 128 ASCII).",
    "code": {
      "JavaScript": "function lengthOfLongestSubstring(s) {\n  let maxLength = 0;\n  let left = 0;\n  const charSet = new Set();\n  for (let right = 0; right < s.length; right++) {\n    while (charSet.has(s[right])) {\n      charSet.delete(s[left]);\n      left++;\n    }\n    charSet.add(s[right]);\n    maxLength = Math.max(maxLength, right - left + 1);\n  }\n  return maxLength;\n}",
      "TypeScript": "function lengthOfLongestSubstring(s: string): number {\n  let maxLength = 0;\n  let left = 0;\n  const charSet = new Set<string>();\n  for (let right = 0; right < s.length; right++) {\n    while (charSet.has(s[right])) {\n      charSet.delete(s[left]);\n      left++;\n    }\n    charSet.add(s[right]);\n    maxLength = Math.max(maxLength, right - left + 1);\n  }\n  return maxLength;\n}",
      "Python": "def lengthOfLongestSubstring(s: str) -> int:\n    char_set = set()\n    left = 0\n    max_len = 0\n    for right in range(len(s)):\n        while s[right] in char_set:\n            char_set.remove(s[left])\n            left += 1\n        char_set.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len"
    }
  },
  "prob-7": {
    "approach": "Binary Search (Divide and Conquer)",
    "explanation": "On a sorted array, we can find the target in logarithmic time by repeatedly halving the search space. We compare the target with the middle element `nums[mid]`. If `nums[mid] === target`, we found the index. If `nums[mid] < target`, the target must lie in the right half (`left = mid + 1`). If `nums[mid] > target`, the target must lie in the left half (`right = mid - 1`). To prevent integer overflow when calculating midpoint, we use `mid = Math.floor(left + (right - left) / 2)`.",
    "algorithm": [
      "Initialize two pointers `left = 0` and `right = nums.length - 1`.",
      "While `left <= right`:",
      "  a. Calculate `mid = Math.floor(left + (right - left) / 2)`.",
      "  b. If `nums[mid] === target`, return `mid`.",
      "  c. If `nums[mid] < target`, set `left = mid + 1`.",
      "  d. If `nums[mid] > target`, set `right = mid - 1`.",
      "If search interval is exhausted (`left > right`), return `-1`."
    ],
    "edgeCases": [
      "Single element array matching target `[5], 5`: returns 0.",
      "Single element array not matching target `[5], 2`: returns -1.",
      "Target is smaller than first element or larger than last element.",
      "Array with negative numbers and zero."
    ],
    "timeComplexity": "O(log n) - Search space is halved at each step.",
    "spaceComplexity": "O(1) - Constant auxiliary space with iterative pointers.",
    "code": {
      "JavaScript": "function binarySearch(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n  return -1;\n}",
      "TypeScript": "function binarySearch(nums: number[], target: number): number {\n  let left = 0;\n  let right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n  return -1;\n}",
      "Python": "def binarySearch(nums: list, target: int) -> int:\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1"
    }
  },
  "prob-8": {
    "approach": "Kadane's Dynamic Programming Algorithm",
    "explanation": "Kadane's algorithm solves the Maximum Subarray problem by finding the maximum subarray ending at each index `i`. At each position `i`, we have two choices: extend the previous subarray sum (`currentSum + nums[i]`) or start a fresh subarray at `nums[i]` (`Math.max(nums[i], currentSum + nums[i])`). If the accumulated sum drops below `nums[i]`, discarding the previous prefix is optimal. We track the overall global maximum throughout.",
    "algorithm": [
      "Initialize `maxSum = nums[0]` and `currentSum = nums[0]`.",
      "Iterate from index `1` to `nums.length - 1`:",
      "  a. Update `currentSum = Math.max(nums[i], currentSum + nums[i])`.",
      "  b. Update `maxSum = Math.max(maxSum, currentSum)`.",
      "Return `maxSum`."
    ],
    "edgeCases": [
      "All negative numbers (e.g. `[-3, -2, -5]`): correctly returns the maximum single element `-2`.",
      "Array with single element `[1]`: returns 1.",
      "Alternating positive and negative numbers."
    ],
    "timeComplexity": "O(n) - Single linear pass through the array.",
    "spaceComplexity": "O(1) - Only two state variables maintained in memory.",
    "code": {
      "JavaScript": "function maxSubArray(nums) {\n  let maxSum = nums[0];\n  let currentSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}",
      "TypeScript": "function maxSubArray(nums: number[]): number {\n  let maxSum = nums[0];\n  let currentSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}",
      "Python": "def maxSubArray(nums: list) -> int:\n    max_sum = nums[0]\n    current_sum = nums[0]\n    for x in nums[1:]:\n        current_sum = max(x, current_sum + x)\n        max_sum = max(max_sum, current_sum)\n    return max_sum"
    }
  },
  "prob-9": {
    "approach": "Two Pointers from Inward Ends",
    "explanation": "A string is a palindrome if it reads the same forward and backward after converting all uppercase letters to lowercase and removing all non-alphanumeric characters. Using two pointers (`left` starting at 0, `right` at the end), we skip non-alphanumeric characters and compare lowercase equivalents. If a mismatch is found, we immediately return `false`. If pointers cross without mismatch, the string is a valid palindrome.",
    "algorithm": [
      "Clean string by converting to lowercase and stripping non-alphanumeric characters (or skip them on the fly).",
      "Set `left = 0` and `right = clean.length - 1`.",
      "While `left < right`:",
      "  a. If `clean[left] !== clean[right]`, return `false`.",
      "  b. Increment `left++` and decrement `right--`.",
      "Return `true` if all mirrored characters match."
    ],
    "edgeCases": [
      "Empty string or string with only whitespace/punctuation (e.g. `\" \"` or `\".,\"`): returns `true`.",
      "Single character string `\"a\"`: returns `true`.",
      "Mixed case with punctuation: `\"A man, a plan, a canal: Panama\"` returns `true`."
    ],
    "timeComplexity": "O(n) - Single pass over the string with two pointers.",
    "spaceComplexity": "O(n) or O(1) - O(n) for filtered string (or O(1) if skipping in-place).",
    "code": {
      "JavaScript": "function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let left = 0, right = clean.length - 1;\n  while (left < right) {\n    if (clean[left] !== clean[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}",
      "TypeScript": "function isPalindrome(s: string): boolean {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let left = 0;\n  let right = clean.length - 1;\n  while (left < right) {\n    if (clean[left] !== clean[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}",
      "Python": "def isPalindrome(s: str) -> bool:\n    clean = [c.lower() for c in s if c.isalnum()]\n    left, right = 0, len(clean) - 1\n    while left < right:\n        if clean[left] != clean[right]:\n            return False\n        left += 1\n        right -= 1\n    return True"
    }
  },
  "prob-10": {
    "approach": "Array Slicing / Triple Reversal",
    "explanation": "Rotating an array right by `k` moves the last `k % n` elements to the front. Because rotating by `n` steps yields the identical array, we first normalize `k = k % n`. We can extract the suffix of length `k` and concatenate it before the prefix of length `n - k`, or use the in-place triple reversal technique (reverse entire array, reverse first k, reverse remaining n - k).",
    "algorithm": [
      "Let `n = nums.length`.",
      "If `n === 0`, return `nums`.",
      "Normalize `k = k % n`.",
      "If `k === 0`, return `nums` unchanged.",
      "Return concatenated array: `nums.slice(n - k).concat(nums.slice(0, n - k))`."
    ],
    "edgeCases": [
      "`k === 0` or `k === nums.length`: returns identical array.",
      "`k > nums.length`: correctly reduced using modulo `k % n`.",
      "Single element array `[1]`: remains `[1]`."
    ],
    "timeComplexity": "O(n) - Slicing and concatenating takes linear time.",
    "spaceComplexity": "O(n) - Returns the rotated array.",
    "code": {
      "JavaScript": "function rotateArray(nums, k) {\n  const n = nums.length;\n  if (n === 0) return nums;\n  k = k % n;\n  if (k === 0) return nums;\n  return nums.slice(n - k).concat(nums.slice(0, n - k));\n}",
      "TypeScript": "function rotateArray(nums: number[], k: number): number[] {\n  const n = nums.length;\n  if (n === 0) return nums;\n  k = k % n;\n  if (k === 0) return nums;\n  return nums.slice(n - k).concat(nums.slice(0, n - k));\n}",
      "Python": "def rotateArray(nums: list, k: int) -> list:\n    n = len(nums)\n    if n == 0:\n        return nums\n    k = k % n\n    if k == 0:\n        return nums\n    return nums[n - k:] + nums[:n - k]"
    }
  },
  "prob-11": {
    "approach": "Hash Set Early-Exit Detection",
    "explanation": "To determine whether any element occurs at least twice, we iterate through the array while maintaining a Hash Set of encountered numbers. For each element, if it is already present in the set, we immediately return `true`. If the loop completes without finding duplicates, we return `false`. This avoids an O(n²) nested scan.",
    "algorithm": [
      "Initialize an empty Hash Set `seen`.",
      "For each number `n` in `nums`:",
      "  a. If `seen.has(n)`, return `true` immediately.",
      "  b. Otherwise, add `n` to `seen`.",
      "Return `false` if all elements are distinct."
    ],
    "edgeCases": [
      "Single element array `[42]`: always returns `false`.",
      "Array where all elements are identical `[1, 1, 1]`: returns `true` on index 1.",
      "Array with negative numbers and zero."
    ],
    "timeComplexity": "O(n) - Single pass with O(1) set operations.",
    "spaceComplexity": "O(n) - In worst case of all unique elements, stores n entries in the set.",
    "code": {
      "JavaScript": "function containsDuplicate(nums) {\n  const seen = new Set();\n  for (let i = 0; i < nums.length; i++) {\n    if (seen.has(nums[i])) return true;\n    seen.add(nums[i]);\n  }\n  return false;\n}",
      "TypeScript": "function containsDuplicate(nums: number[]): boolean {\n  const seen = new Set<number>();\n  for (let i = 0; i < nums.length; i++) {\n    if (seen.has(nums[i])) return true;\n    seen.add(nums[i]);\n  }\n  return false;\n}",
      "Python": "def containsDuplicate(nums: list) -> bool:\n    seen = set()\n    for num in nums:\n        if num in seen:\n            return True\n        seen.add(num)\n    return False"
    }
  },
  "prob-12": {
    "approach": "Two-Pointer Non-Zero Compaction",
    "explanation": "We maintain a `writeIdx` pointer tracking where the next non-zero element should be placed. As we scan through the array with a read pointer `i`, whenever `nums[i] !== 0`, we copy `nums[i]` to `nums[writeIdx]` and increment `writeIdx`. Once all non-zero elements are compacted at the beginning, we fill all indices from `writeIdx` to the end with zeros.",
    "algorithm": [
      "Clone the input array into `result` (or modify in-place).",
      "Initialize `writeIdx = 0`.",
      "Iterate `i` from 0 to `result.length - 1`:",
      "  a. If `result[i] !== 0`, set `result[writeIdx] = result[i]` and increment `writeIdx++`.",
      "While `writeIdx < result.length`:",
      "  a. Set `result[writeIdx] = 0` and increment `writeIdx++`.",
      "Return `result`."
    ],
    "edgeCases": [
      "Array containing no zeros `[4, 5, 6]`: returns original array untouched.",
      "Array containing only zeros `[0, 0, 0]`: returns all zeros.",
      "Array with zeros already at the end `[1, 2, 0, 0]`."
    ],
    "timeComplexity": "O(n) - Two linear passes across the array.",
    "spaceComplexity": "O(1) - Constant auxiliary space (or O(n) for copy).",
    "code": {
      "JavaScript": "function moveZeroes(nums) {\n  const result = [...nums];\n  let writeIdx = 0;\n  for (let i = 0; i < result.length; i++) {\n    if (result[i] !== 0) {\n      result[writeIdx] = result[i];\n      writeIdx++;\n    }\n  }\n  while (writeIdx < result.length) {\n    result[writeIdx] = 0;\n    writeIdx++;\n  }\n  return result;\n}",
      "TypeScript": "function moveZeroes(nums: number[]): number[] {\n  const result = [...nums];\n  let writeIdx = 0;\n  for (let i = 0; i < result.length; i++) {\n    if (result[i] !== 0) {\n      result[writeIdx] = result[i];\n      writeIdx++;\n    }\n  }\n  while (writeIdx < result.length) {\n    result[writeIdx] = 0;\n    writeIdx++;\n  }\n  return result;\n}",
      "Python": "def moveZeroes(nums: list) -> list:\n    res = list(nums)\n    write_idx = 0\n    for i in range(len(res)):\n        if res[i] != 0:\n            res[write_idx] = res[i]\n            write_idx += 1\n    while write_idx < len(res):\n        res[write_idx] = 0\n        write_idx += 1\n    return res"
    }
  },
  "prob-13": {
    "approach": "Prefix and Suffix Accumulator Products",
    "explanation": "To calculate the product of all elements except `nums[i]` without division, we observe that `output[i] = (product of elements before i) * (product of elements after i)`. In the first pass from left to right, we populate `answer[i]` with the prefix product. In the second pass from right to left, we maintain a running suffix product accumulator and multiply it directly into `answer[i]`.",
    "algorithm": [
      "Let `n = nums.length`. Initialize an output array `answer` of length `n` with 1s.",
      "Initialize `prefix = 1`.",
      "For `i` from 0 to `n - 1`:",
      "  a. Set `answer[i] = prefix`.",
      "  b. Multiply `prefix *= nums[i]`.",
      "Initialize `suffix = 1`.",
      "For `i` from `n - 1` down to 0:",
      "  a. Multiply `answer[i] *= suffix`.",
      "  b. Multiply `suffix *= nums[i]`.",
      "Return `answer`."
    ],
    "edgeCases": [
      "Array containing a single zero `[1, 2, 0, 4]`: all entries become 0 except the zero index.",
      "Array containing multiple zeros `[0, 1, 0]`: all entries become 0.",
      "Array containing negative numbers."
    ],
    "timeComplexity": "O(n) - Two sequential linear passes.",
    "spaceComplexity": "O(1) auxiliary space (excluding the output array).",
    "code": {
      "JavaScript": "function productExceptSelf(nums) {\n  const n = nums.length;\n  const answer = new Array(n).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < n; i++) {\n    answer[i] = prefix;\n    prefix *= nums[i];\n  }\n  let suffix = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    answer[i] *= suffix;\n    suffix *= nums[i];\n  }\n  return answer;\n}",
      "TypeScript": "function productExceptSelf(nums: number[]): number[] {\n  const n = nums.length;\n  const answer = new Array<number>(n).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < n; i++) {\n    answer[i] = prefix;\n    prefix *= nums[i];\n  }\n  let suffix = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    answer[i] *= suffix;\n    suffix *= nums[i];\n  }\n  return answer;\n}",
      "Python": "def productExceptSelf(nums: list) -> list:\n    n = len(nums)\n    answer = [1] * n\n    prefix = 1\n    for i in range(n):\n        answer[i] = prefix\n        prefix *= nums[i]\n    suffix = 1\n    for i in range(n - 1, -1, -1):\n        answer[i] *= suffix\n        suffix *= nums[i]\n    return answer"
    }
  },
  "prob-14": {
    "approach": "Boyer-Moore Voting Algorithm",
    "explanation": "Because the majority element is guaranteed to appear strictly more than `floor(n / 2)` times, pairing up different elements and canceling them out leaves the majority element as the survivor. We maintain a `candidate` and a `count`. When `count === 0`, we pick the current element as the new candidate. If the current number matches `candidate`, we increment `count`; otherwise, we decrement `count`.",
    "algorithm": [
      "Initialize `candidate = null` and `count = 0`.",
      "For each number `num` in `nums`:",
      "  a. If `count === 0`, set `candidate = num`.",
      "  b. If `num === candidate`, increment `count++`.",
      "  c. Otherwise, decrement `count--`.",
      "Return `candidate`."
    ],
    "edgeCases": [
      "Single-element array `[1]`: returns 1.",
      "Array with all elements identical `[2, 2, 2]`: count increases continuously.",
      "Majority element appearing at the very beginning and end of the array."
    ],
    "timeComplexity": "O(n) - Single pass over the array.",
    "spaceComplexity": "O(1) - Only candidate and count variables are stored.",
    "code": {
      "JavaScript": "function majorityElement(nums) {\n  let candidate = nums[0];\n  let count = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (count === 0) {\n      candidate = nums[i];\n    }\n    count += (nums[i] === candidate) ? 1 : -1;\n  }\n  return candidate;\n}",
      "TypeScript": "function majorityElement(nums: number[]): number {\n  let candidate = nums[0];\n  let count = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (count === 0) {\n      candidate = nums[i];\n    }\n    count += (nums[i] === candidate) ? 1 : -1;\n  }\n  return candidate;\n}",
      "Python": "def majorityElement(nums: list) -> int:\n    candidate = nums[0]\n    count = 0\n    for num in nums:\n        if count == 0:\n            candidate = num\n        count += 1 if num == candidate else -1\n    return candidate"
    }
  },
  "prob-15": {
    "approach": "Sort by Start Time and Greedy Interval Merge",
    "explanation": "If we sort all intervals ascending by their start time, any overlapping intervals will be adjacent. We initialize a `merged` list with the first interval. For each subsequent interval `[currStart, currEnd]`, we compare `currStart` with the end of the last merged interval `lastEnd`. If `currStart <= lastEnd`, they overlap, so we merge them by updating `lastEnd = Math.max(lastEnd, currEnd)`. If `currStart > lastEnd`, there is no overlap, and we push the new interval.",
    "algorithm": [
      "If `intervals.length <= 1`, return `intervals`.",
      "Sort `intervals` by start time: `a[0] - b[0]`.",
      "Initialize `merged = [intervals[0]]`.",
      "For `i` from 1 to `intervals.length - 1`:",
      "  a. Let `current = intervals[i]`.",
      "  b. Let `last = merged[merged.length - 1]`.",
      "  c. If `current[0] <= last[1]`, merge by `last[1] = Math.max(last[1], current[1])`.",
      "  d. Else, push `current` into `merged`.",
      "Return `merged`."
    ],
    "edgeCases": [
      "Already non-overlapping intervals `[[1,2], [3,4]]`: returns unchanged.",
      "All intervals completely nested `[[1,10], [2,3], [4,5]]`: collapses to `[[1,10]]`.",
      "Single interval `[[1,4]]`: returns `[[1,4]]`.",
      "Intervals touching at borders `[[1,4], [4,5]]`: correctly merged into `[[1,5]]`."
    ],
    "timeComplexity": "O(n log n) - Dominated by sorting n intervals.",
    "spaceComplexity": "O(n) - Output storage for merged intervals and sorting recursion.",
    "code": {
      "JavaScript": "function mergeIntervals(intervals) {\n  if (!intervals || intervals.length <= 1) return intervals;\n  intervals.sort((a, b) => a[0] - b[0]);\n  const merged = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const current = intervals[i];\n    const last = merged[merged.length - 1];\n    if (current[0] <= last[1]) {\n      last[1] = Math.max(last[1], current[1]);\n    } else {\n      merged.push(current);\n    }\n  }\n  return merged;\n}",
      "TypeScript": "function mergeIntervals(intervals: number[][]): number[][] {\n  if (!intervals || intervals.length <= 1) return intervals;\n  intervals.sort((a, b) => a[0] - b[0]);\n  const merged: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const current = intervals[i];\n    const last = merged[merged.length - 1];\n    if (current[0] <= last[1]) {\n      last[1] = Math.max(last[1], current[1]);\n    } else {\n      merged.push(current);\n    }\n  }\n  return merged;\n}",
      "Python": "def mergeIntervals(intervals: list) -> list:\n    if not intervals or len(intervals) <= 1:\n        return intervals\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for current in intervals[1:]:\n        last = merged[-1]\n        if current[0] <= last[1]:\n            last[1] = max(last[1], current[1])\n        else:\n            merged.append(current)\n    return merged"
    }
  },
  "prob-16": {
    "approach": "Gauss Arithmetic Sum Formula / XOR Accumulator",
    "explanation": "The array contains `n` distinct numbers in the range `[0, n]`. The expected sum of numbers from 0 to n is given by Gauss's formula `expectedSum = n * (n + 1) / 2`. By subtracting the actual sum of all array elements from `expectedSum`, the missing number is found in O(1) extra space. Alternatively, bitwise XORing all indices and elements isolates the missing number without risk of integer overflow.",
    "algorithm": [
      "Let `n = nums.length`.",
      "Calculate `expectedSum = (n * (n + 1)) / 2`.",
      "Calculate `actualSum = sum(nums)`.",
      "Return `expectedSum - actualSum`."
    ],
    "edgeCases": [
      "Missing number is 0: `[1, 2, 3]` -> returns 0.",
      "Missing number is n: `[0, 1, 2]` -> returns 3.",
      "Single element array `[0]` -> returns 1; `[1]` -> returns 0."
    ],
    "timeComplexity": "O(n) - Single pass to sum the array.",
    "spaceComplexity": "O(1) - Uses only numerical variables for sums.",
    "code": {
      "JavaScript": "function findMissingNumber(nums) {\n  const n = nums.length;\n  const expectedSum = (n * (n + 1)) / 2;\n  const actualSum = nums.reduce((acc, curr) => acc + curr, 0);\n  return expectedSum - actualSum;\n}",
      "TypeScript": "function findMissingNumber(nums: number[]): number {\n  const n = nums.length;\n  const expectedSum = (n * (n + 1)) / 2;\n  const actualSum = nums.reduce((acc, curr) => acc + curr, 0);\n  return expectedSum - actualSum;\n}",
      "Python": "def findMissingNumber(nums: list) -> int:\n    n = len(nums)\n    expected_sum = n * (n + 1) // 2\n    return expected_sum - sum(nums)"
    }
  },
  "prob-17": {
    "approach": "In-Place Cyclic Value-to-Index Swapping",
    "explanation": "For an array of length `n`, the first missing positive integer must lie in the range `[1, n + 1]`. We place each positive number `x` in the range `[1, n]` at index `x - 1` by cyclic swapping. If `nums[i]` is between `1` and `n` and not already at its correct target index (`nums[nums[i] - 1] !== nums[i]`), we swap them. After cycling, we make a second pass: the first index `i` where `nums[i] !== i + 1` identifies `i + 1` as the smallest missing positive.",
    "algorithm": [
      "Let `n = nums.length`.",
      "For `i` from 0 to `n - 1`:",
      "  a. While `nums[i] > 0` and `nums[i] <= n` and `nums[nums[i] - 1] !== nums[i]`:",
      "       swap `nums[i]` with `nums[nums[i] - 1]`.",
      "For `i` from 0 to `n - 1`:",
      "  a. If `nums[i] !== i + 1`, return `i + 1`.",
      "If all positions 1 to n are correct, return `n + 1`."
    ],
    "edgeCases": [
      "All negative numbers `[-1, -2, -3]`: returns 1.",
      "Consecutive 1 to n present `[1, 2, 3]`: returns 4.",
      "Duplicates present (e.g. `[1, 1]`): cyclic swap halts gracefully without infinite loop."
    ],
    "timeComplexity": "O(n) - Each number is placed in its correct position at most once during swapping.",
    "spaceComplexity": "O(1) - Performed strictly in-place.",
    "code": {
      "JavaScript": "function firstMissingPositive(nums) {\n  const n = nums.length;\n  for (let i = 0; i < n; i++) {\n    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {\n      const correctIdx = nums[i] - 1;\n      const temp = nums[i];\n      nums[i] = nums[correctIdx];\n      nums[correctIdx] = temp;\n    }\n  }\n  for (let i = 0; i < n; i++) {\n    if (nums[i] !== i + 1) {\n      return i + 1;\n    }\n  }\n  return n + 1;\n}",
      "TypeScript": "function firstMissingPositive(nums: number[]): number {\n  const n = nums.length;\n  for (let i = 0; i < n; i++) {\n    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {\n      const correctIdx = nums[i] - 1;\n      const temp = nums[i];\n      nums[i] = nums[correctIdx];\n      nums[correctIdx] = temp;\n    }\n  }\n  for (let i = 0; i < n; i++) {\n    if (nums[i] !== i + 1) {\n      return i + 1;\n    }\n  }\n  return n + 1;\n}",
      "Python": "def firstMissingPositive(nums: list) -> int:\n    n = len(nums)\n    for i in range(n):\n        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:\n            correct_idx = nums[i] - 1\n            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]\n    for i in range(n):\n        if nums[i] != i + 1:\n            return i + 1\n    return n + 1"
    }
  },
  "prob-18": {
    "approach": "Frequency Count Table / 26-Bucket Array",
    "explanation": "An anagram is formed by rearranging the letters of another string using all the original characters exactly once. If `s.length !== t.length`, they cannot be anagrams. We count the frequency of each character in `s` and decrement for each character in `t`. If all character counts balance to zero, `t` is an anagram of `s`.",
    "algorithm": [
      "If `s.length !== t.length`, return `false` immediately.",
      "Initialize a frequency map or an array of size 26 for lowercase alphabet characters.",
      "For each character in `s`, increment its count.",
      "For each character in `t`, decrement its count; if count drops below 0, return `false`.",
      "Return `true`."
    ],
    "edgeCases": [
      "Different lengths: returns `false` in O(1).",
      "Single character strings `\"a\"` and `\"a\"` -> `true`, `\"a\"` and `\"b\"` -> `false`.",
      "Strings with repeating characters."
    ],
    "timeComplexity": "O(n) - Single pass through both strings of length n.",
    "spaceComplexity": "O(1) - Constant space bounded by alphabet size (26 characters).",
    "code": {
      "JavaScript": "function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const counts = {};\n  for (let i = 0; i < s.length; i++) {\n    counts[s[i]] = (counts[s[i]] || 0) + 1;\n    counts[t[i]] = (counts[t[i]] || 0) - 1;\n  }\n  for (const key in counts) {\n    if (counts[key] !== 0) return false;\n  }\n  return true;\n}",
      "TypeScript": "function isAnagram(s: string, t: string): boolean {\n  if (s.length !== t.length) return false;\n  const counts: Record<string, number> = {};\n  for (let i = 0; i < s.length; i++) {\n    counts[s[i]] = (counts[s[i]] || 0) + 1;\n    counts[t[i]] = (counts[t[i]] || 0) - 1;\n  }\n  for (const key in counts) {\n    if (counts[key] !== 0) return false;\n  }\n  return true;\n}",
      "Python": "def isAnagram(s: str, t: str) -> bool:\n    if len(s) != len(t):\n        return False\n    counts = {}\n    for c in s:\n        counts[c] = counts.get(c, 0) + 1\n    for c in t:\n        if c not in counts or counts[c] == 0:\n            return False\n        counts[c] -= 1\n    return True"
    }
  },
  "prob-19": {
    "approach": "String Tokenization and Array Reversal",
    "explanation": "To reverse the words in a string while discarding leading, trailing, and multiple consecutive whitespace characters, we split the string by whitespace, filter out empty tokens, reverse the resulting array of words, and join them with a single space delimiter.",
    "algorithm": [
      "Trim the string and split into words by one or more whitespace characters (`\\s+`).",
      "Filter out any remaining empty strings.",
      "Reverse the order of the words list.",
      "Join the reversed words with a single space `' '`.",
      "Return the resulting string."
    ],
    "edgeCases": [
      "Leading and trailing spaces: `\"  hello world  \"` -> `\"world hello\"`.",
      "Multiple spaces between words: `\"a   good   example\"` -> `\"example good a\"`.",
      "Single word: `\"hello\"` -> `\"hello\"`."
    ],
    "timeComplexity": "O(n) - Linear time for splitting, reversing, and joining.",
    "spaceComplexity": "O(n) - Storage for the extracted words array.",
    "code": {
      "JavaScript": "function reverseWords(s) {\n  return s.trim().split(/\\s+/).reverse().join(' ');\n}",
      "TypeScript": "function reverseWords(s: string): string {\n  return s.trim().split(/\\s+/).reverse().join(' ');\n}",
      "Python": "def reverseWords(s: str) -> str:\n    return ' '.join(s.strip().split()[::-1])"
    }
  },
  "prob-20": {
    "approach": "Horizontal Prefix Scanning",
    "explanation": "We initialize the common prefix candidate with the first string `strs[0]`. We then iterate through the remaining strings. For each string `strs[i]`, while `strs[i]` does not start with `prefix`, we shorten `prefix` by removing its last character. If at any point `prefix` becomes empty `\"\"`, there is no common prefix across all strings and we return `\"\"`.",
    "algorithm": [
      "If `strs` is empty, return `\"\"`.",
      "Initialize `prefix = strs[0]`.",
      "For `i` from 1 to `strs.length - 1`:",
      "  a. While `strs[i].indexOf(prefix) !== 0`:",
      "       `prefix = prefix.substring(0, prefix.length - 1)`.",
      "       If `prefix === \"\"`, return `\"\"`.",
      "Return `prefix`."
    ],
    "edgeCases": [
      "Single string `[\"flower\"]`: returns `\"flower\"`.",
      "No common prefix `[\"dog\", \"racecar\", \"car\"]`: returns `\"\"`.",
      "Empty string in input `[\"\", \"abc\"]`: returns `\"\"`."
    ],
    "timeComplexity": "O(S) - Where S is the sum of all characters in all strings in the input array.",
    "spaceComplexity": "O(1) - Constant auxiliary memory.",
    "code": {
      "JavaScript": "function longestCommonPrefix(strs) {\n  if (!strs || strs.length === 0) return '';\n  let prefix = strs[0];\n  for (let i = 1; i < strs.length; i++) {\n    while (strs[i].indexOf(prefix) !== 0) {\n      prefix = prefix.substring(0, prefix.length - 1);\n      if (prefix === '') return '';\n    }\n  }\n  return prefix;\n}",
      "TypeScript": "function longestCommonPrefix(strs: string[]): string {\n  if (!strs || strs.length === 0) return '';\n  let prefix = strs[0];\n  for (let i = 1; i < strs.length; i++) {\n    while (strs[i].indexOf(prefix) !== 0) {\n      prefix = prefix.substring(0, prefix.length - 1);\n      if (prefix === '') return '';\n    }\n  }\n  return prefix;\n}",
      "Python": "def longestCommonPrefix(strs: list) -> str:\n    if not strs:\n        return ''\n    prefix = strs[0]\n    for s in strs[1:]:\n        while not s.startswith(prefix):\n            prefix = prefix[:-1]\n            if not prefix:\n                return ''\n    return prefix"
    }
  },
  "prob-21": {
    "approach": "Hash Map with Canonical Sorted Key",
    "explanation": "Two strings are anagrams if and only if sorting their letters produces identical results. We use a Hash Map where the key is the sorted character sequence (e.g. `\"aet\"` for `\"eat\"`, `\"tea\"`, `\"ate\"`), and the value is a list of matching strings. After bucketing all strings into the map, the values of the map constitute the grouped anagrams.",
    "algorithm": [
      "Initialize a Hash Map `map = new Map()`.",
      "For each string `str` in `strs`:",
      "  a. Create canonical key `key = str.split('').sort().join('')`.",
      "  b. If `!map.has(key)`, initialize `map.set(key, [])`.",
      "  c. Append `str` into `map.get(key)`.",
      "Return `Array.from(map.values())`."
    ],
    "edgeCases": [
      "Empty string `[\"\"]`: grouped as `[[\"\"]]`.",
      "Single character strings `[\"a\"]`: grouped as `[[\"a\"]]`.",
      "No anagram pairs: each word forms its own single-element group."
    ],
    "timeComplexity": "O(N * K log K) - Where N is number of strings and K is the maximum length of a string.",
    "spaceComplexity": "O(N * K) - Total character storage in the hash map.",
    "code": {
      "JavaScript": "function groupAnagrams(strs) {\n  const map = new Map();\n  for (let i = 0; i < strs.length; i++) {\n    const key = strs[i].split('').sort().join('');\n    if (!map.has(key)) {\n      map.set(key, []);\n    }\n    map.get(key).push(strs[i]);\n  }\n  return Array.from(map.values());\n}",
      "TypeScript": "function groupAnagrams(strs: string[]): string[][] {\n  const map = new Map<string, string[]>();\n  for (let i = 0; i < strs.length; i++) {\n    const key = strs[i].split('').sort().join('');\n    if (!map.has(key)) {\n      map.set(key, []);\n    }\n    map.get(key)!.push(strs[i]);\n  }\n  return Array.from(map.values());\n}",
      "Python": "def groupAnagrams(strs: list) -> list:\n    groups = {}\n    for s in strs:\n        key = ''.join(sorted(s))\n        if key not in groups:\n            groups[key] = []\n        groups[key].append(s)\n    return list(groups.values())"
    }
  },
  "prob-22": {
    "approach": "Consecutive Character Run-Length Compression",
    "explanation": "Run-length encoding compresses consecutive identical characters into the character followed by its repetition count. We scan through the string while keeping a running count of the current character. When the next character differs or we reach the end of the string, we append the character and its count to our result string.",
    "algorithm": [
      "If string is empty, return `\"\"`.",
      "Initialize `res = \"\"`, `count = 1`.",
      "For `i` from 0 to `s.length - 1`:",
      "  a. If `i + 1 < s.length` and `s[i] === s[i + 1]`, increment `count++`.",
      "  b. Otherwise, append `s[i] + count` to `res` and reset `count = 1`.",
      "Return `res`."
    ],
    "edgeCases": [
      "Empty string `\"\"` -> `\"\"`.",
      "Single character `\"a\"` -> `\"a1\"`.",
      "All identical characters `\"aaaa\"` -> `\"a4\"`.",
      "All distinct characters `\"abc\"` -> `\"a1b1c1\"`."
    ],
    "timeComplexity": "O(n) - Single pass through the string.",
    "spaceComplexity": "O(n) - Output string memory.",
    "code": {
      "JavaScript": "function compressString(s) {\n  if (!s || s.length === 0) return '';\n  let result = '';\n  let count = 1;\n  for (let i = 0; i < s.length; i++) {\n    if (i + 1 < s.length && s[i] === s[i + 1]) {\n      count++;\n    } else {\n      result += s[i] + count;\n      count = 1;\n    }\n  }\n  return result;\n}",
      "TypeScript": "function compressString(s: string): string {\n  if (!s || s.length === 0) return '';\n  let result = '';\n  let count = 1;\n  for (let i = 0; i < s.length; i++) {\n    if (i + 1 < s.length && s[i] === s[i + 1]) {\n      count++;\n    } else {\n      result += s[i] + count;\n      count = 1;\n    }\n  }\n  return result;\n}",
      "Python": "def compressString(s: str) -> str:\n    if not s:\n        return ''\n    res = []\n    count = 1\n    for i in range(len(s)):\n        if i + 1 < len(s) and s[i] == s[i + 1]:\n            count += 1\n        else:\n            res.append(s[i] + str(count))\n            count = 1\n    return ''.join(res)"
    }
  },
  "prob-23": {
    "approach": "Expand Around Centers",
    "explanation": "A palindrome mirrors around its center. A string of length `n` has `2n - 1` potential centers: `n` single-character centers (odd-length palindromes) and `n - 1` between-character centers (even-length palindromes). For each center, we expand outwards as long as `s[left] === s[right]`. We keep track of the start index and maximum length found across all centers.",
    "algorithm": [
      "If `s.length < 2`, return `s`.",
      "Define helper `expand(left, right)`:",
      "  a. While `left >= 0` and `right < s.length` and `s[left] === s[right]`:",
      "       `left--`, `right++`.",
      "  b. Return substring length: `right - left - 1`.",
      "Initialize `start = 0`, `maxLen = 1`.",
      "For `i` from 0 to `s.length - 1`:",
      "  a. `len1 = expand(i, i)` (odd length).",
      "  b. `len2 = expand(i, i + 1)` (even length).",
      "  c. `len = Math.max(len1, len2)`.",
      "  d. If `len > maxLen`, update `maxLen = len` and `start = i - Math.floor((len - 1) / 2)`.",
      "Return `s.substring(start, start + maxLen)`."
    ],
    "edgeCases": [
      "Single character string `\"a\"`: returns `\"a\"`.",
      "Entire string is palindrome `\"racecar\"`: returns `\"racecar\"`.",
      "No palindromes longer than 1 `\"ac\"`: returns `\"a\"` or `\"c\"`."
    ],
    "timeComplexity": "O(n²) - O(n) centers with O(n) expansion per center.",
    "spaceComplexity": "O(1) - Constant extra space.",
    "code": {
      "JavaScript": "function longestPalindrome(s) {\n  if (!s || s.length < 2) return s;\n  let start = 0, maxLen = 1;\n  function expand(left, right) {\n    while (left >= 0 && right < s.length && s[left] === s[right]) {\n      left--;\n      right++;\n    }\n    return right - left - 1;\n  }\n  for (let i = 0; i < s.length; i++) {\n    const len1 = expand(i, i);\n    const len2 = expand(i, i + 1);\n    const len = Math.max(len1, len2);\n    if (len > maxLen) {\n      maxLen = len;\n      start = i - Math.floor((len - 1) / 2);\n    }\n  }\n  return s.substring(start, start + maxLen);\n}",
      "TypeScript": "function longestPalindrome(s: string): string {\n  if (!s || s.length < 2) return s;\n  let start = 0, maxLen = 1;\n  function expand(left: number, right: number): number {\n    while (left >= 0 && right < s.length && s[left] === s[right]) {\n      left--;\n      right++;\n    }\n    return right - left - 1;\n  }\n  for (let i = 0; i < s.length; i++) {\n    const len1 = expand(i, i);\n    const len2 = expand(i, i + 1);\n    const len = Math.max(len1, len2);\n    if (len > maxLen) {\n      maxLen = len;\n      start = i - Math.floor((len - 1) / 2);\n    }\n  }\n  return s.substring(start, start + maxLen);\n}",
      "Python": "def longestPalindrome(s: str) -> str:\n    if not s or len(s) < 2:\n        return s\n    start, max_len = 0, 1\n    def expand(left: int, right: int) -> int:\n        while left >= 0 and right < len(s) and s[left] == s[right]:\n            left -= 1\n            right += 1\n        return right - left - 1\n    for i in range(len(s)):\n        len1 = expand(i, i)\n        len2 = expand(i, i + 1)\n        cur_len = max(len1, len2)\n        if cur_len > max_len:\n            max_len = cur_len\n            start = i - (cur_len - 1) // 2\n    return s[start:start + max_len]"
    }
  },
  "prob-24": {
    "approach": "Prefix Sum Frequency Hash Map",
    "explanation": "A subarray sum between indices `j + 1` and `i` equals `prefixSum[i] - prefixSum[j]`. To find subarrays that sum to `k`, we need `prefixSum[i] - prefixSum[j] = k`, which rearranges to `prefixSum[j] = prefixSum[i] - k`. As we traverse the array accumulating `prefixSum`, we add `map.get(prefixSum - k)` to our answer and then record the current `prefixSum` frequency.",
    "algorithm": [
      "Initialize `map = new Map()`, set `map.set(0, 1)` (to account for subarrays starting at index 0).",
      "Initialize `count = 0` and `prefixSum = 0`.",
      "For each number `num` in `nums`:",
      "  a. Accumulate `prefixSum += num`.",
      "  b. If `map.has(prefixSum - k)`, `count += map.get(prefixSum - k)`.",
      "  c. Update `map.set(prefixSum, (map.get(prefixSum) || 0) + 1)`.",
      "Return `count`."
    ],
    "edgeCases": [
      "Negative numbers in array (where standard sliding window fails).",
      "Entire array sums to k.",
      "k = 0 with zeros in the array (e.g. `[0,0,0], k = 0`)."
    ],
    "timeComplexity": "O(n) - Single pass through the array with O(1) hash map operations.",
    "spaceComplexity": "O(n) - In worst case stores up to n distinct prefix sums in the map.",
    "code": {
      "JavaScript": "function subarraySum(nums, k) {\n  const map = new Map();\n  map.set(0, 1);\n  let count = 0;\n  let prefixSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    prefixSum += nums[i];\n    if (map.has(prefixSum - k)) {\n      count += map.get(prefixSum - k);\n    }\n    map.set(prefixSum, (map.get(prefixSum) || 0) + 1);\n  }\n  return count;\n}",
      "TypeScript": "function subarraySum(nums: number[], k: number): number {\n  const map = new Map<number, number>();\n  map.set(0, 1);\n  let count = 0;\n  let prefixSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    prefixSum += nums[i];\n    if (map.has(prefixSum - k)) {\n      count += map.get(prefixSum - k)!;\n    }\n    map.set(prefixSum, (map.get(prefixSum) || 0) + 1);\n  }\n  return count;\n}",
      "Python": "def subarraySum(nums: list, k: int) -> int:\n    counts = {0: 1}\n    prefix_sum = 0\n    total = 0\n    for num in nums:\n        prefix_sum += num\n        if prefix_sum - k in counts:\n            total += counts[prefix_sum - k]\n        counts[prefix_sum] = counts.get(prefix_sum, 0) + 1\n    return total"
    }
  },
  "prob-25": {
    "approach": "Two-Pass Frequency Counting",
    "explanation": "In the first pass, we build a character frequency count table. In the second pass, we iterate through the characters of the string in order; the first character whose count is exactly 1 is our answer, and we return its 0-based index. If no character has frequency 1, we return -1.",
    "algorithm": [
      "Initialize an empty frequency map `counts`.",
      "First pass: for each character `c` in `s`, increment `counts[c]`.",
      "Second pass: for `i` from 0 to `s.length - 1`:",
      "  a. If `counts[s[i]] === 1`, return `i`.",
      "If no unique character is found, return `-1`."
    ],
    "edgeCases": [
      "All duplicate characters `\"aabb\"`: returns -1.",
      "Single character string `\"z\"`: returns 0.",
      "Unique character at the very end `\"aabbc\"`: returns 4."
    ],
    "timeComplexity": "O(n) - Two linear passes over the string.",
    "spaceComplexity": "O(1) - Frequency map holds at most 26 lowercase English letters.",
    "code": {
      "JavaScript": "function firstUniqChar(s) {\n  const counts = {};\n  for (let i = 0; i < s.length; i++) {\n    counts[s[i]] = (counts[s[i]] || 0) + 1;\n  }\n  for (let i = 0; i < s.length; i++) {\n    if (counts[s[i]] === 1) return i;\n  }\n  return -1;\n}",
      "TypeScript": "function firstUniqChar(s: string): number {\n  const counts: Record<string, number> = {};\n  for (let i = 0; i < s.length; i++) {\n    counts[s[i]] = (counts[s[i]] || 0) + 1;\n  }\n  for (let i = 0; i < s.length; i++) {\n    if (counts[s[i]] === 1) return i;\n  }\n  return -1;\n}",
      "Python": "def firstUniqChar(s: str) -> int:\n    counts = {}\n    for c in s:\n        counts[c] = counts.get(c, 0) + 1\n    for i, c in enumerate(s):\n        if counts[c] == 1:\n            return i\n    return -1"
    }
  },
  "prob-26": {
    "approach": "Hash Set Membership Filtering",
    "explanation": "To find the unique common elements between two integer arrays, we convert `nums1` into a Set `set1`. We then iterate through `nums2`, keeping only the elements present in `set1`, and collecting them into a result Set `resultSet` to guarantee uniqueness.",
    "algorithm": [
      "Create `set1 = new Set(nums1)`.",
      "Create an empty `resultSet = new Set()`.",
      "For each number `num` in `nums2`:",
      "  a. If `set1.has(num)`, add `num` to `resultSet`.",
      "Return `Array.from(resultSet)`."
    ],
    "edgeCases": [
      "No overlapping elements: returns `[]`.",
      "Identical arrays with duplicates `[1,1], [1,1]`: returns `[1]`.",
      "One array is a subset of the other."
    ],
    "timeComplexity": "O(n + m) - Where n and m are lengths of nums1 and nums2.",
    "spaceComplexity": "O(n + m) - Space for the sets.",
    "code": {
      "JavaScript": "function intersection(nums1, nums2) {\n  const set1 = new Set(nums1);\n  const result = new Set();\n  for (let i = 0; i < nums2.length; i++) {\n    if (set1.has(nums2[i])) {\n      result.add(nums2[i]);\n    }\n  }\n  return Array.from(result);\n}",
      "TypeScript": "function intersection(nums1: number[], nums2: number[]): number[] {\n  const set1 = new Set(nums1);\n  const result = new Set<number>();\n  for (let i = 0; i < nums2.length; i++) {\n    if (set1.has(nums2[i])) {\n      result.add(nums2[i]);\n    }\n  }\n  return Array.from(result);\n}",
      "Python": "def intersection(nums1: list, nums2: list) -> list:\n    return list(set(nums1) & set(nums2))"
    }
  },
  "prob-27": {
    "approach": "Hash Set Sequence Beginning Lookup",
    "explanation": "We insert all numbers into a Hash Set for O(1) lookups. To achieve linear O(n) runtime without sorting, we only initiate a sequence count if `num` is the *start* of a sequence (i.e. `!set.has(num - 1)`). If it is a sequence start, we check for consecutive successors `num + 1, num + 2, ...` while incrementing the sequence length.",
    "algorithm": [
      "If `nums` is empty, return 0.",
      "Insert all numbers into `set = new Set(nums)`.",
      "Initialize `longest = 0`.",
      "For each `num` in `set`:",
      "  a. If `!set.has(num - 1)` (meaning `num` is start of sequence):",
      "       `currentNum = num`, `streak = 1`.",
      "       While `set.has(currentNum + 1)`: `currentNum++`, `streak++`.",
      "       `longest = Math.max(longest, streak)`.",
      "Return `longest`."
    ],
    "edgeCases": [
      "Empty array `[]`: returns 0.",
      "Single element `[10]`: returns 1.",
      "Duplicate numbers `[1, 2, 0, 1]`: Set automatically deduplicates, returns 3."
    ],
    "timeComplexity": "O(n) - Each number is visited at most twice (once in loop, once in sequence check).",
    "spaceComplexity": "O(n) - Stores up to n elements in the Hash Set.",
    "code": {
      "JavaScript": "function longestConsecutive(nums) {\n  if (!nums || nums.length === 0) return 0;\n  const numSet = new Set(nums);\n  let longestStreak = 0;\n  for (const num of numSet) {\n    if (!numSet.has(num - 1)) {\n      let currentNum = num;\n      let currentStreak = 1;\n      while (numSet.has(currentNum + 1)) {\n        currentNum += 1;\n        currentStreak += 1;\n      }\n      longestStreak = Math.max(longestStreak, currentStreak);\n    }\n  }\n  return longestStreak;\n}",
      "TypeScript": "function longestConsecutive(nums: number[]): number {\n  if (!nums || nums.length === 0) return 0;\n  const numSet = new Set<number>(nums);\n  let longestStreak = 0;\n  for (const num of numSet) {\n    if (!numSet.has(num - 1)) {\n      let currentNum = num;\n      let currentStreak = 1;\n      while (numSet.has(currentNum + 1)) {\n        currentNum += 1;\n        currentStreak += 1;\n      }\n      longestStreak = Math.max(longestStreak, currentStreak);\n    }\n  }\n  return longestStreak;\n}",
      "Python": "def longestConsecutive(nums: list) -> int:\n    if not nums:\n        return 0\n    num_set = set(nums)\n    longest = 0\n    for num in num_set:\n        if num - 1 not in num_set:\n            curr = num\n            streak = 1\n            while curr + 1 in num_set:\n                curr += 1\n                streak += 1\n            longest = max(longest, streak)\n    return longest"
    }
  },
  "prob-28": {
    "approach": "Hash Map with Doubly Linked List Order (LRU Cache)",
    "explanation": "A Least Recently Used (LRU) Cache requires O(1) `get` and `put` operations. We simulate commands against an LRU Cache. In JavaScript/Python, a Map/OrderedDict preserves insertion order, allowing O(1) deletion and insertion to the most-recently-used position. When accessing or updating a key, we re-insert it to move it to the back. When capacity is exceeded, we evict the least recently used key from the front.",
    "algorithm": [
      "Parse the commands array `['LRUCache', 'put', 'get', ...]` and arguments `[[capacity], [k, v], [k], ...]`, returning the array of results.",
      "Maintain a Map where key insertion order represents access order.",
      "For `get(key)`: if present, delete key, re-set key/value to refresh recency, and return value. Else return -1.",
      "For `put(key, value)`: if key exists, delete it. Else if size === capacity, delete first item (`map.keys().next().value`). Set key/value."
    ],
    "edgeCases": [
      "Overwriting existing key without exceeding capacity.",
      "Getting non-existent key returns -1.",
      "Evicting oldest when multiple items accessed."
    ],
    "timeComplexity": "O(1) - Average time per get and put operation.",
    "spaceComplexity": "O(capacity) - Stores at most `capacity` entries.",
    "code": {
      "JavaScript": "function simulateLRUCache(operations, args) {\n  const results = [];\n  let cache = null;\n  for (let i = 0; i < operations.length; i++) {\n    const op = operations[i];\n    const arg = args[i];\n    if (op === 'LRUCache') {\n      const cap = arg[0];\n      const map = new Map();\n      cache = {\n        get(key) {\n          if (!map.has(key)) return -1;\n          const val = map.get(key);\n          map.delete(key);\n          map.set(key, val);\n          return val;\n        },\n        put(key, val) {\n          if (map.has(key)) {\n            map.delete(key);\n          } else if (map.size >= cap) {\n            const firstKey = map.keys().next().value;\n            map.delete(firstKey);\n          }\n          map.set(key, val);\n        }\n      };\n      results.push(null);\n    } else if (op === 'put') {\n      cache.put(arg[0], arg[1]);\n      results.push(null);\n    } else if (op === 'get') {\n      results.push(cache.get(arg[0]));\n    }\n  }\n  return results;\n}",
      "TypeScript": "function simulateLRUCache(operations: string[], args: any[][]): any[] {\n  const results: any[] = [];\n  let cache: any = null;\n  for (let i = 0; i < operations.length; i++) {\n    const op = operations[i];\n    const arg = args[i];\n    if (op === 'LRUCache') {\n      const cap = arg[0];\n      const map = new Map<number, number>();\n      cache = {\n        get(key: number) {\n          if (!map.has(key)) return -1;\n          const val = map.get(key)!;\n          map.delete(key);\n          map.set(key, val);\n          return val;\n        },\n        put(key: number, val: number) {\n          if (map.has(key)) {\n            map.delete(key);\n          } else if (map.size >= cap) {\n            const firstKey = map.keys().next().value;\n            map.delete(firstKey!);\n          }\n          map.set(key, val);\n        }\n      };\n      results.push(null);\n    } else if (op === 'put') {\n      cache.put(arg[0], arg[1]);\n      results.push(null);\n    } else if (op === 'get') {\n      results.push(cache.get(arg[0]));\n    }\n  }\n  return results;\n}",
      "Python": "def simulateLRUCache(operations: list, args: list) -> list:\n    from collections import OrderedDict\n    results = []\n    class LRUCache:\n        def __init__(self, capacity: int):\n            self.cap = capacity\n            self.cache = OrderedDict()\n        def get(self, key: int) -> int:\n            if key not in self.cache:\n                return -1\n            self.cache.move_to_end(key)\n            return self.cache[key]\n        def put(self, key: int, value: int) -> None:\n            if key in self.cache:\n                self.cache.move_to_end(key)\n            elif len(self.cache) >= self.cap:\n                self.cache.popitem(last=False)\n            self.cache[key] = value\n\n    cache = None\n    for op, arg in zip(operations, args):\n        if op == 'LRUCache':\n            cache = LRUCache(arg[0])\n            results.append(None)\n        elif op == 'put':\n            cache.put(arg[0], arg[1])\n            results.append(None)\n        elif op == 'get':\n            results.append(cache.get(arg[0]))\n    return results"
    }
  },
  "prob-29": {
    "approach": "Two Pointers from Sorted Array Ends (1-Indexed)",
    "explanation": "Because the array is already sorted in non-decreasing order, we place `left = 0` and `right = numbers.length - 1`. If `numbers[left] + numbers[right] === target`, we return their 1-indexed positions `[left + 1, right + 1]`. If the sum is too small, we increment `left++` to increase the sum. If the sum is too large, we decrement `right--` to decrease the sum.",
    "algorithm": [
      "Initialize `left = 0` and `right = numbers.length - 1`.",
      "While `left < right`:",
      "  a. Let `sum = numbers[left] + numbers[right]`.",
      "  b. If `sum === target`, return `[left + 1, right + 1]`.",
      "  c. If `sum < target`, increment `left++`.",
      "  d. If `sum > target`, decrement `right--`.",
      "Return `[]` if not found."
    ],
    "edgeCases": [
      "Negative target with negative numbers `[-5, -3, 0, 2], target = -8`.",
      "Array with exact two elements `[2, 7], target = 9` -> returns `[1, 2]`."
    ],
    "timeComplexity": "O(n) - Single pass where pointers converge inward.",
    "spaceComplexity": "O(1) - No auxiliary data structures required.",
    "code": {
      "JavaScript": "function twoSumSorted(numbers, target) {\n  let left = 0;\n  let right = numbers.length - 1;\n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n    if (sum === target) {\n      return [left + 1, right + 1];\n    } else if (sum < target) {\n      left++;\n    } else {\n      right--;\n    }\n  }\n  return [];\n}",
      "TypeScript": "function twoSumSorted(numbers: number[], target: number): number[] {\n  let left = 0;\n  let right = numbers.length - 1;\n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n    if (sum === target) {\n      return [left + 1, right + 1];\n    } else if (sum < target) {\n      left++;\n    } else {\n      right--;\n    }\n  }\n  return [];\n}",
      "Python": "def twoSumSorted(numbers: list, target: int) -> list:\n    left, right = 0, len(numbers) - 1\n    while left < right:\n        cur_sum = numbers[left] + numbers[right]\n        if cur_sum == target:\n            return [left + 1, right + 1]\n        elif cur_sum < target:\n            left += 1\n        else:\n            right -= 1\n    return []"
    }
  },
  "prob-30": {
    "approach": "Two Pointers with Greedy Shorter-Bar Inward Shift",
    "explanation": "The area between two lines at `left` and `right` is `Math.min(height[left], height[right]) * (right - left)`. The width `right - left` is at its maximum at the outer boundaries. Moving the pointer with the taller line inward could only decrease the width without potentially increasing the bottleneck height. Therefore, to discover a larger area, we must greedily move the pointer pointing to the shorter vertical line inward.",
    "algorithm": [
      "Initialize `left = 0`, `right = height.length - 1`, and `maxArea = 0`.",
      "While `left < right`:",
      "  a. Calculate `h = Math.min(height[left], height[right])`.",
      "  b. Calculate `w = right - left`.",
      "  c. Update `maxArea = Math.max(maxArea, h * w)`.",
      "  d. If `height[left] < height[right]`, increment `left++`.",
      "  e. Else, decrement `right--`.",
      "Return `maxArea`."
    ],
    "edgeCases": [
      "Two elements array `[1, 1]`: returns 1.",
      "Steep stair-step heights.",
      "All heights identical `[5, 5, 5, 5]`."
    ],
    "timeComplexity": "O(n) - Pointers meet after traversing n elements.",
    "spaceComplexity": "O(1) - Constant auxiliary space.",
    "code": {
      "JavaScript": "function maxArea(height) {\n  let left = 0;\n  let right = height.length - 1;\n  let maxWater = 0;\n  while (left < right) {\n    const h = Math.min(height[left], height[right]);\n    const w = right - left;\n    maxWater = Math.max(maxWater, h * w);\n    if (height[left] < height[right]) {\n      left++;\n    } else {\n      right--;\n    }\n  }\n  return maxWater;\n}",
      "TypeScript": "function maxArea(height: number[]): number {\n  let left = 0;\n  let right = height.length - 1;\n  let maxWater = 0;\n  while (left < right) {\n    const h = Math.min(height[left], height[right]);\n    const w = right - left;\n    maxWater = Math.max(maxWater, h * w);\n    if (height[left] < height[right]) {\n      left++;\n    } else {\n      right--;\n    }\n  }\n  return maxWater;\n}",
      "Python": "def maxArea(height: list) -> int:\n    left, right = 0, len(height) - 1\n    max_water = 0\n    while left < right:\n        h = min(height[left], height[right])\n        w = right - left\n        max_water = max(max_water, h * w)\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n    return max_water"
    }
  },
  "prob-31": {
    "approach": "Slow and Fast Two-Pointer In-Place Compaction",
    "explanation": "Because the array is sorted, duplicates are adjacent. We maintain a slow pointer `slow = 0` representing the index of the last placed unique element. A fast pointer `fast` scans the array from index 1. Whenever `nums[fast] !== nums[slow]`, we have encountered a new distinct value, so we increment `slow` and write `nums[slow] = nums[fast]`. The number of unique elements is `slow + 1`.",
    "algorithm": [
      "If `nums.length === 0`, return 0.",
      "Initialize `slow = 0`.",
      "For `fast` from 1 to `nums.length - 1`:",
      "  a. If `nums[fast] !== nums[slow]`, increment `slow++` and set `nums[slow] = nums[fast]`.",
      "Return `slow + 1`."
    ],
    "edgeCases": [
      "Array with all identical elements `[1, 1, 1]`: returns 1, array prefix `[1]`.",
      "Array already with all distinct elements `[1, 2, 3]`: returns 3.",
      "Single element array `[1]`: returns 1."
    ],
    "timeComplexity": "O(n) - Single pass through the array.",
    "spaceComplexity": "O(1) - Performed strictly in-place.",
    "code": {
      "JavaScript": "function removeDuplicates(nums) {\n  if (nums.length === 0) return 0;\n  let slow = 0;\n  for (let fast = 1; fast < nums.length; fast++) {\n    if (nums[fast] !== nums[slow]) {\n      slow++;\n      nums[slow] = nums[fast];\n    }\n  }\n  return slow + 1;\n}",
      "TypeScript": "function removeDuplicates(nums: number[]): number {\n  if (nums.length === 0) return 0;\n  let slow = 0;\n  for (let fast = 1; fast < nums.length; fast++) {\n    if (nums[fast] !== nums[slow]) {\n      slow++;\n      nums[slow] = nums[fast];\n    }\n  }\n  return slow + 1;\n}",
      "Python": "def removeDuplicates(nums: list) -> int:\n    if not nums:\n        return 0\n    slow = 0\n    for fast in range(1, len(nums)):\n        if nums[fast] != nums[slow]:\n            slow += 1\n            nums[slow] = nums[fast]\n    return slow + 1"
    }
  },
  "prob-32": {
    "approach": "Sort and Two-Pointer Target Search with Duplicate Skipping",
    "explanation": "We first sort the array. We fix the first element `nums[i]` and use two pointers `left = i + 1` and `right = nums.length - 1` to find pairs whose sum equals `-nums[i]`. Crucially, to avoid duplicate triplets in the result, we skip duplicate values for the fixed `i`, as well as duplicate values when advancing `left` and `right` after finding a valid triplet.",
    "algorithm": [
      "Sort `nums` in ascending order.",
      "Initialize `result = []`.",
      "For `i` from 0 to `nums.length - 3`:",
      "  a. If `i > 0` and `nums[i] === nums[i - 1]`, continue (skip duplicate first element).",
      "  b. If `nums[i] > 0`, break (sum cannot reach 0 since array is sorted).",
      "  c. Let `left = i + 1`, `right = nums.length - 1`.",
      "  d. While `left < right`:",
      "       Let `sum = nums[i] + nums[left] + nums[right]`.",
      "       If `sum === 0`: add `[nums[i], nums[left], nums[right]]` to `result`.",
      "         Advance `left++` and while `nums[left] === nums[left - 1] && left < right` skip.",
      "         Advance `right--` and while `nums[right] === nums[right + 1] && left < right` skip.",
      "       Else if `sum < 0`: `left++`.",
      "       Else: `right--`.",
      "Return `result`."
    ],
    "edgeCases": [
      "No triplets sum to zero `[0, 1, 1]`: returns `[]`.",
      "Multiple zeros `[0, 0, 0, 0]`: returns single unique triplet `[[0, 0, 0]]`.",
      "Large numbers with positive/negative balance."
    ],
    "timeComplexity": "O(n²) - Sorting is O(n log n), followed by n iterations of two-pointer O(n) search.",
    "spaceComplexity": "O(n) - Auxiliary space for sorting and result storage.",
    "code": {
      "JavaScript": "function threeSum(nums) {\n  const result = [];\n  if (!nums || nums.length < 3) return result;\n  nums.sort((a, b) => a - b);\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    if (nums[i] > 0) break;\n    let left = i + 1;\n    let right = nums.length - 1;\n    while (left < right) {\n      const sum = nums[i] + nums[left] + nums[right];\n      if (sum === 0) {\n        result.push([nums[i], nums[left], nums[right]]);\n        while (left < right && nums[left] === nums[left + 1]) left++;\n        while (left < right && nums[right] === nums[right - 1]) right--;\n        left++;\n        right--;\n      } else if (sum < 0) {\n        left++;\n      } else {\n        right--;\n      }\n    }\n  }\n  return result;\n}",
      "TypeScript": "function threeSum(nums: number[]): number[][] {\n  const result: number[][] = [];\n  if (!nums || nums.length < 3) return result;\n  nums.sort((a, b) => a - b);\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    if (nums[i] > 0) break;\n    let left = i + 1;\n    let right = nums.length - 1;\n    while (left < right) {\n      const sum = nums[i] + nums[left] + nums[right];\n      if (sum === 0) {\n        result.push([nums[i], nums[left], nums[right]]);\n        while (left < right && nums[left] === nums[left + 1]) left++;\n        while (left < right && nums[right] === nums[right - 1]) right--;\n        left++;\n        right--;\n      } else if (sum < 0) {\n        left++;\n      } else {\n        right--;\n      }\n    }\n  }\n  return result;\n}",
      "Python": "def threeSum(nums: list) -> list:\n    result = []\n    if not nums or len(nums) < 3:\n        return result\n    nums.sort()\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i - 1]:\n            continue\n        if nums[i] > 0:\n            break\n        left, right = i + 1, len(nums) - 1\n        while left < right:\n            cur_sum = nums[i] + nums[left] + nums[right]\n            if cur_sum == 0:\n                result.append([nums[i], nums[left], nums[right]])\n                while left < right and nums[left] == nums[left + 1]:\n                    left += 1\n                while left < right and nums[right] == nums[right - 1]:\n                    right -= 1\n                left += 1\n                right -= 1\n            elif cur_sum < 0:\n                left += 1\n            else:\n                right -= 1\n    return result"
    }
  },
  "prob-33": {
    "approach": "Dynamic Sliding Window with Shrinking Left Pointer",
    "explanation": "We maintain a sliding window `[left, right]` and a running sum `currentSum`. We expand `right` adding `nums[right]` to `currentSum`. As soon as `currentSum >= target`, we attempt to minimize the window length by recording `minLen = Math.min(minLen, right - left + 1)`, subtracting `nums[left]`, and advancing `left++` until `currentSum < target`.",
    "algorithm": [
      "Initialize `minLen = Infinity`, `left = 0`, and `currentSum = 0`.",
      "For `right` from 0 to `nums.length - 1`:",
      "  a. Add `currentSum += nums[right]`.",
      "  b. While `currentSum >= target`:",
      "       `minLen = Math.min(minLen, right - left + 1)`.",
      "       `currentSum -= nums[left]`.",
      "       `left++`.",
      "Return `minLen === Infinity ? 0 : minLen`."
    ],
    "edgeCases": [
      "Total array sum is less than target: returns 0.",
      "Single element >= target: returns 1 immediately.",
      "Entire array required to meet target."
    ],
    "timeComplexity": "O(n) - Each pointer (left and right) traverses the array at most once.",
    "spaceComplexity": "O(1) - Constant auxiliary space.",
    "code": {
      "JavaScript": "function minSubArrayLen(target, nums) {\n  let minLen = Infinity;\n  let left = 0;\n  let currentSum = 0;\n  for (let right = 0; right < nums.length; right++) {\n    currentSum += nums[right];\n    while (currentSum >= target) {\n      minLen = Math.min(minLen, right - left + 1);\n      currentSum -= nums[left];\n      left++;\n    }\n  }\n  return minLen === Infinity ? 0 : minLen;\n}",
      "TypeScript": "function minSubArrayLen(target: number, nums: number[]): number {\n  let minLen = Infinity;\n  let left = 0;\n  let currentSum = 0;\n  for (let right = 0; right < nums.length; right++) {\n    currentSum += nums[right];\n    while (currentSum >= target) {\n      minLen = Math.min(minLen, right - left + 1);\n      currentSum -= nums[left];\n      left++;\n    }\n  }\n  return minLen === Infinity ? 0 : minLen;\n}",
      "Python": "def minSubArrayLen(target: int, nums: list) -> int:\n    min_len = float('inf')\n    left = 0\n    cur_sum = 0\n    for right in range(len(nums)):\n        cur_sum += nums[right]\n        while cur_sum >= target:\n            min_len = min(min_len, right - left + 1)\n            cur_sum -= nums[left]\n            left += 1\n    return 0 if min_len == float('inf') else min_len"
    }
  },
  "prob-34": {
    "approach": "Sliding Window with Zero-Count Budget",
    "explanation": "The problem asks for the longest subarray containing at most `k` zeros (since we can flip up to `k` zeros to ones). We expand a window `[left, right]`. If `nums[right] === 0`, we increment `zeroCount`. If `zeroCount > k`, we increment `left` and decrement `zeroCount` if `nums[left]` was a zero until our zero budget is restored.",
    "algorithm": [
      "Initialize `left = 0`, `zeroCount = 0`, and `maxOnes = 0`.",
      "For `right` from 0 to `nums.length - 1`:",
      "  a. If `nums[right] === 0`, `zeroCount++`.",
      "  b. While `zeroCount > k`:",
      "       If `nums[left] === 0`, `zeroCount--`.",
      "       `left++`.",
      "  c. Update `maxOnes = Math.max(maxOnes, right - left + 1)`.",
      "Return `maxOnes`."
    ],
    "edgeCases": [
      "`k = 0`: returns the length of the longest consecutive sequence of 1s without any flips.",
      "Array contains only 0s: returns `Math.min(k, nums.length)`.",
      "`k >= nums.length`: returns `nums.length`."
    ],
    "timeComplexity": "O(n) - Each element is added and removed from the window at most once.",
    "spaceComplexity": "O(1) - Constant auxiliary space.",
    "code": {
      "JavaScript": "function longestOnes(nums, k) {\n  let left = 0;\n  let zeroCount = 0;\n  let maxLen = 0;\n  for (let right = 0; right < nums.length; right++) {\n    if (nums[right] === 0) zeroCount++;\n    while (zeroCount > k) {\n      if (nums[left] === 0) zeroCount--;\n      left++;\n    }\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}",
      "TypeScript": "function longestOnes(nums: number[], k: number): number {\n  let left = 0;\n  let zeroCount = 0;\n  let maxLen = 0;\n  for (let right = 0; right < nums.length; right++) {\n    if (nums[right] === 0) zeroCount++;\n    while (zeroCount > k) {\n      if (nums[left] === 0) zeroCount--;\n      left++;\n    }\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}",
      "Python": "def longestOnes(nums: list, k: int) -> int:\n    left = 0\n    zero_count = 0\n    max_len = 0\n    for right in range(len(nums)):\n        if nums[right] == 0:\n            zero_count += 1\n        while zero_count > k:\n            if nums[left] == 0:\n                zero_count -= 1\n            left += 1\n        max_len = max(max_len, right - left + 1)\n    return max_len"
    }
  },
  "prob-35": {
    "approach": "Fixed-Size Sliding Window of Length K",
    "explanation": "To find the maximum average of a contiguous subarray of fixed length `k`, we first compute the sum of the initial `k` elements. We then slide the window one element at a time to the right: adding the incoming element `nums[i]` and subtracting the outgoing element `nums[i - k]`. We track the maximum window sum observed and divide by `k` at the end.",
    "algorithm": [
      "Sum the first `k` elements into `windowSum`.",
      "Initialize `maxSum = windowSum`.",
      "For `i` from `k` to `nums.length - 1`:",
      "  a. Update `windowSum += nums[i] - nums[i - k]`.",
      "  b. Update `maxSum = Math.max(maxSum, windowSum)`.",
      "Return `maxSum / k`."
    ],
    "edgeCases": [
      "`k === nums.length`: returns the average of the whole array.",
      "Negative numbers in array: floating point division handles negative results.",
      "Single element array `[5], k = 1`: returns 5.0."
    ],
    "timeComplexity": "O(n) - Single linear pass calculating sliding difference in O(1) per step.",
    "spaceComplexity": "O(1) - Constant auxiliary space.",
    "code": {
      "JavaScript": "function findMaxAverage(nums, k) {\n  let windowSum = 0;\n  for (let i = 0; i < k; i++) {\n    windowSum += nums[i];\n  }\n  let maxSum = windowSum;\n  for (let i = k; i < nums.length; i++) {\n    windowSum += nums[i] - nums[i - k];\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum / k;\n}",
      "TypeScript": "function findMaxAverage(nums: number[], k: number): number {\n  let windowSum = 0;\n  for (let i = 0; i < k; i++) {\n    windowSum += nums[i];\n  }\n  let maxSum = windowSum;\n  for (let i = k; i < nums.length; i++) {\n    windowSum += nums[i] - nums[i - k];\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum / k;\n}",
      "Python": "def findMaxAverage(nums: list, k: int) -> float:\n    window_sum = sum(nums[:k])\n    max_sum = window_sum\n    for i in range(k, len(nums)):\n        window_sum += nums[i] - nums[i - k]\n        max_sum = max(max_sum, window_sum)\n    return max_sum / k"
    }
  },
  "prob-36": {
    "approach": "Monotonic Decreasing Deque of Indices",
    "explanation": "We maintain a double-ended queue (deque) storing indices of elements in decreasing order of values. As we slide the window: 1) We pop indices from the front that are outside the current window (`deque[0] <= i - k`). 2) We pop smaller elements from the back because they can never be the maximum again. 3) We push index `i`. Once `i >= k - 1`, the front of the deque is the maximum of the current window.",
    "algorithm": [
      "Initialize `deque = []` (stores indices) and `result = []`.",
      "For `i` from 0 to `nums.length - 1`:",
      "  a. If `deque.length > 0 && deque[0] <= i - k`, remove front (`deque.shift()`).",
      "  b. While `deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]`, remove back (`deque.pop()`).",
      "  c. Push `i` to back of deque.",
      "  d. If `i >= k - 1`, push `nums[deque[0]]` to `result`.",
      "Return `result`."
    ],
    "edgeCases": [
      "`k === 1`: returns the original array.",
      "`k === nums.length`: returns `[max(nums)]`.",
      "Monotonically increasing or decreasing arrays."
    ],
    "timeComplexity": "O(n) - Each element index is pushed and popped from the deque at most once.",
    "spaceComplexity": "O(k) - Deque holds at most k indices.",
    "code": {
      "JavaScript": "function maxSlidingWindow(nums, k) {\n  if (!nums || nums.length === 0) return [];\n  const deque = [];\n  const result = [];\n  for (let i = 0; i < nums.length; i++) {\n    if (deque.length > 0 && deque[0] <= i - k) {\n      deque.shift();\n    }\n    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {\n      deque.pop();\n    }\n    deque.push(i);\n    if (i >= k - 1) {\n      result.push(nums[deque[0]]);\n    }\n  }\n  return result;\n}",
      "TypeScript": "function maxSlidingWindow(nums: number[], k: number): number[] {\n  if (!nums || nums.length === 0) return [];\n  const deque: number[] = [];\n  const result: number[] = [];\n  for (let i = 0; i < nums.length; i++) {\n    if (deque.length > 0 && deque[0] <= i - k) {\n      deque.shift();\n    }\n    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {\n      deque.pop();\n    }\n    deque.push(i);\n    if (i >= k - 1) {\n      result.push(nums[deque[0]]);\n    }\n  }\n  return result;\n}",
      "Python": "def maxSlidingWindow(nums: list, k: int) -> list:\n    from collections import deque\n    if not nums:\n        return []\n    dq = deque()\n    result = []\n    for i in range(len(nums)):\n        if dq and dq[0] <= i - k:\n            dq.popleft()\n        while dq and nums[dq[-1]] <= nums[i]:\n            dq.pop()\n        dq.append(i)\n        if i >= k - 1:\n            result.append(nums[dq[0]])\n    return result"
    }
  },
  "prob-37": {
    "approach": "Dual Stack / Parallel Min-Value Stack",
    "explanation": "To achieve O(1) for `getMin()`, we maintain two stacks: the primary `stack` storing all pushed values, and a `minStack` where each entry represents the minimum value present in the stack up to that level. When pushing `x`, we push `Math.min(x, currentMin)` onto `minStack`. Popping pops from both simultaneously.",
    "algorithm": [
      "Process commands against MinStack simulation.",
      "Initialize `stack = []` and `minStack = []`.",
      "`push(val)`: push `val` to `stack`, push `minStack.length === 0 ? val : Math.min(val, minStack.top)` to `minStack`.",
      "`pop()`: pop from `stack` and `minStack`.",
      "`top()`: return top of `stack`.",
      "`getMin()`: return top of `minStack`."
    ],
    "edgeCases": [
      "Popping duplicate minimum elements.",
      "Negative values and descending sequence pushes."
    ],
    "timeComplexity": "O(1) - Constant time for all operations (push, pop, top, getMin).",
    "spaceComplexity": "O(n) - Dual stack storage proportional to number of elements.",
    "code": {
      "JavaScript": "function simulateMinStack(operations, args) {\n  const results = [];\n  let stack = [];\n  let minStack = [];\n  for (let i = 0; i < operations.length; i++) {\n    const op = operations[i];\n    const arg = args[i];\n    if (op === 'MinStack') {\n      stack = [];\n      minStack = [];\n      results.push(null);\n    } else if (op === 'push') {\n      const val = arg[0];\n      stack.push(val);\n      const curMin = minStack.length === 0 ? val : Math.min(val, minStack[minStack.length - 1]);\n      minStack.push(curMin);\n      results.push(null);\n    } else if (op === 'pop') {\n      stack.pop();\n      minStack.pop();\n      results.push(null);\n    } else if (op === 'top') {\n      results.push(stack[stack.length - 1]);\n    } else if (op === 'getMin') {\n      results.push(minStack[minStack.length - 1]);\n    }\n  }\n  return results;\n}",
      "TypeScript": "function simulateMinStack(operations: string[], args: any[][]): any[] {\n  const results: any[] = [];\n  let stack: number[] = [];\n  let minStack: number[] = [];\n  for (let i = 0; i < operations.length; i++) {\n    const op = operations[i];\n    const arg = args[i];\n    if (op === 'MinStack') {\n      stack = [];\n      minStack = [];\n      results.push(null);\n    } else if (op === 'push') {\n      const val = arg[0];\n      stack.push(val);\n      const curMin = minStack.length === 0 ? val : Math.min(val, minStack[minStack.length - 1]);\n      minStack.push(curMin);\n      results.push(null);\n    } else if (op === 'pop') {\n      stack.pop();\n      minStack.pop();\n      results.push(null);\n    } else if (op === 'top') {\n      results.push(stack[stack.length - 1]);\n    } else if (op === 'getMin') {\n      results.push(minStack[minStack.length - 1]);\n    }\n  }\n  return results;\n}",
      "Python": "def simulateMinStack(operations: list, args: list) -> list:\n    results = []\n    stack = []\n    min_stack = []\n    for op, arg in zip(operations, args):\n        if op == 'MinStack':\n            stack = []\n            min_stack = []\n            results.append(None)\n        elif op == 'push':\n            val = arg[0]\n            stack.append(val)\n            cur_min = val if not min_stack else min(val, min_stack[-1])\n            min_stack.append(cur_min)\n            results.append(None)\n        elif op == 'pop':\n            stack.pop()\n            min_stack.pop()\n            results.append(None)\n        elif op == 'top':\n            results.append(stack[-1])\n        elif op == 'getMin':\n            results.append(min_stack[-1])\n    return results"
    }
  },
  "prob-38": {
    "approach": "Stack-Based Postfix Expression Evaluator",
    "explanation": "In Reverse Polish Notation (RPN), operators follow their operands. We iterate through tokens. When a number is encountered, we push it onto the stack. When an operator (`+`, `-`, `*`, `/`) is encountered, we pop the top two numbers `b` (second operand) and `a` (first operand), apply the operation `a op b`, and push the result back onto the stack (using integer truncation toward zero for division).",
    "algorithm": [
      "Initialize an empty operand stack `stack = []`.",
      "For each `token` in `tokens`:",
      "  a. If `token` is an operator (`+`, `-`, `*`, `/`):",
      "       Pop `b = stack.pop()`, pop `a = stack.pop()`.",
      "       If `token === '+'`, push `a + b`.",
      "       If `token === '-'`, push `a - b`.",
      "       If `token === '*'`, push `a * b`.",
      "       If `token === '/'`, push `Math.trunc(a / b)`.",
      "  b. Else, parse `token` as integer and push onto `stack`.",
      "Return `stack.pop()`."
    ],
    "edgeCases": [
      "Negative division truncation: `Math.trunc(6 / -132)` gives 0.",
      "Single token `[\"18\"]`: returns 18.",
      "Chained subtractions and divisions."
    ],
    "timeComplexity": "O(n) - Linear pass through all tokens with O(1) operations.",
    "spaceComplexity": "O(n) - Stack holds at most n / 2 operands.",
    "code": {
      "JavaScript": "function evalRPN(tokens) {\n  const stack = [];\n  for (let i = 0; i < tokens.length; i++) {\n    const token = tokens[i];\n    if (token === '+' || token === '-' || token === '*' || token === '/') {\n      const b = stack.pop();\n      const a = stack.pop();\n      if (token === '+') stack.push(a + b);\n      else if (token === '-') stack.push(a - b);\n      else if (token === '*') stack.push(a * b);\n      else if (token === '/') stack.push(Math.trunc(a / b));\n    } else {\n      stack.push(Number(token));\n    }\n  }\n  return stack.pop();\n}",
      "TypeScript": "function evalRPN(tokens: string[]): number {\n  const stack: number[] = [];\n  for (let i = 0; i < tokens.length; i++) {\n    const token = tokens[i];\n    if (token === '+' || token === '-' || token === '*' || token === '/') {\n      const b = stack.pop()!;\n      const a = stack.pop()!;\n      if (token === '+') stack.push(a + b);\n      else if (token === '-') stack.push(a - b);\n      else if (token === '*') stack.push(a * b);\n      else if (token === '/') stack.push(Math.trunc(a / b));\n    } else {\n      stack.push(Number(token));\n    }\n  }\n  return stack.pop()!;\n}",
      "Python": "def evalRPN(tokens: list) -> int:\n    stack = []\n    for token in tokens:\n        if token in {'+', '-', '*', '/'}:\n            b = stack.pop()\n            a = stack.pop()\n            if token == '+':\n                stack.append(a + b)\n            elif token == '-':\n                stack.append(a - b)\n            elif token == '*':\n                stack.append(a * b)\n            elif token == '/':\n                stack.append(int(a / b))\n        else:\n            stack.append(int(token))\n    return stack.pop()"
    }
  },
  "prob-39": {
    "approach": "Monotonic Decreasing Stack of Day Indices",
    "explanation": "We maintain a monotonic stack of indices corresponding to temperatures in strictly decreasing order. As we iterate through each day `i`, if `temperatures[i]` is warmer than the temperature at the index on top of the stack `prevDay`, we pop `prevDay` and record `answer[prevDay] = i - prevDay`. We repeat until `temperatures[i]` is no longer warmer, then push `i`.",
    "algorithm": [
      "Initialize `answer = new Array(temperatures.length).fill(0)` and `stack = []`.",
      "For `i` from 0 to `temperatures.length - 1`:",
      "  a. While `stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]:`",
      "       `prevDay = stack.pop()`.",
      "       `answer[prevDay] = i - prevDay`.",
      "  b. Push `i` onto `stack`.",
      "Return `answer`."
    ],
    "edgeCases": [
      "Strictly descending temperatures `[90, 80, 70]`: returns `[0, 0, 0]`.",
      "Strictly ascending temperatures `[30, 40, 50]`: returns `[1, 1, 0]`.",
      "Single temperature `[30]`: returns `[0]`."
    ],
    "timeComplexity": "O(n) - Each day index is pushed and popped at most once.",
    "spaceComplexity": "O(n) - Stack holds at most n indices.",
    "code": {
      "JavaScript": "function dailyTemperatures(temperatures) {\n  const n = temperatures.length;\n  const answer = new Array(n).fill(0);\n  const stack = [];\n  for (let i = 0; i < n; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prevIdx = stack.pop();\n      answer[prevIdx] = i - prevIdx;\n    }\n    stack.push(i);\n  }\n  return answer;\n}",
      "TypeScript": "function dailyTemperatures(temperatures: number[]): number[] {\n  const n = temperatures.length;\n  const answer = new Array<number>(n).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < n; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prevIdx = stack.pop()!;\n      answer[prevIdx] = i - prevIdx;\n    }\n    stack.push(i);\n  }\n  return answer;\n}",
      "Python": "def dailyTemperatures(temperatures: list) -> list:\n    n = len(temperatures)\n    answer = [0] * n\n    stack = []\n    for i in range(n):\n        while stack and temperatures[i] > temperatures[stack[-1]]:\n            prev_idx = stack.pop()\n            answer[prev_idx] = i - prev_idx\n        stack.append(i)\n    return answer"
    }
  },
  "prob-40": {
    "approach": "Two Stacks (Amortized O(1) In-Stack and Out-Stack)",
    "explanation": "A queue is FIFO (First-In, First-Out) while a stack is LIFO. By using two stacks (`inStack` and `outStack`), we push incoming elements onto `inStack`. When popping or peeking, if `outStack` is empty, we transfer all elements from `inStack` to `outStack` (reversing their order to FIFO). Subsequent pops take O(1) from `outStack` until it empties again.",
    "algorithm": [
      "Maintain `inStack = []` and `outStack = []`.",
      "`push(x)`: push `x` onto `inStack`.",
      "`pop()`: call `peek()`, then return `outStack.pop()`.",
      "`peek()`: if `outStack` is empty, pop all from `inStack` and push to `outStack`. Return top of `outStack`.",
      "`empty()`: return `inStack.length === 0 && outStack.length === 0`."
    ],
    "edgeCases": [
      "Interleaved pushes and pops.",
      "Checking empty after all elements are consumed."
    ],
    "timeComplexity": "Amortized O(1) per operation - Each element is moved between stacks at most once.",
    "spaceComplexity": "O(n) - Storage across two stacks.",
    "code": {
      "JavaScript": "function simulateQueueWithStacks(operations, args) {\n  const results = [];\n  let inStack = [];\n  let outStack = [];\n  for (let i = 0; i < operations.length; i++) {\n    const op = operations[i];\n    const arg = args[i];\n    if (op === 'MyQueue') {\n      inStack = [];\n      outStack = [];\n      results.push(null);\n    } else if (op === 'push') {\n      inStack.push(arg[0]);\n      results.push(null);\n    } else if (op === 'pop') {\n      if (outStack.length === 0) {\n        while (inStack.length > 0) outStack.push(inStack.pop());\n      }\n      results.push(outStack.pop());\n    } else if (op === 'peek') {\n      if (outStack.length === 0) {\n        while (inStack.length > 0) outStack.push(inStack.pop());\n      }\n      results.push(outStack[outStack.length - 1]);\n    } else if (op === 'empty') {\n      results.push(inStack.length === 0 && outStack.length === 0);\n    }\n  }\n  return results;\n}",
      "TypeScript": "function simulateQueueWithStacks(operations: string[], args: any[][]): any[] {\n  const results: any[] = [];\n  let inStack: number[] = [];\n  let outStack: number[] = [];\n  for (let i = 0; i < operations.length; i++) {\n    const op = operations[i];\n    const arg = args[i];\n    if (op === 'MyQueue') {\n      inStack = [];\n      outStack = [];\n      results.push(null);\n    } else if (op === 'push') {\n      inStack.push(arg[0]);\n      results.push(null);\n    } else if (op === 'pop') {\n      if (outStack.length === 0) {\n        while (inStack.length > 0) outStack.push(inStack.pop()!);\n      }\n      results.push(outStack.pop());\n    } else if (op === 'peek') {\n      if (outStack.length === 0) {\n        while (inStack.length > 0) outStack.push(inStack.pop()!);\n      }\n      results.push(outStack[outStack.length - 1]);\n    } else if (op === 'empty') {\n      results.push(inStack.length === 0 && outStack.length === 0);\n    }\n  }\n  return results;\n}",
      "Python": "def simulateQueueWithStacks(operations: list, args: list) -> list:\n    results = []\n    in_stack = []\n    out_stack = []\n    for op, arg in zip(operations, args):\n        if op == 'MyQueue':\n            in_stack = []\n            out_stack = []\n            results.append(None)\n        elif op == 'push':\n            in_stack.append(arg[0])\n            results.append(None)\n        elif op == 'pop':\n            if not out_stack:\n                while in_stack:\n                    out_stack.append(in_stack.pop())\n            results.append(out_stack.pop())\n        elif op == 'peek':\n            if not out_stack:\n                while in_stack:\n                    out_stack.append(in_stack.pop())\n            results.append(out_stack[-1])\n        elif op == 'empty':\n            results.append(len(in_stack) == 0 and len(out_stack) == 0)\n    return results"
    }
  },
  "prob-41": {
    "approach": "Dummy Head Node with Two-Pointer Link Stitching",
    "explanation": "We use a `dummy` node to simplify head edge cases. A `current` pointer begins at `dummy`. While both `list1` and `list2` are non-null, we link `current.next` to the node with the smaller value and advance that list's pointer. When one list runs out, we attach the remaining non-null list directly to `current.next`.",
    "algorithm": [
      "Create a `dummy = new ListNode(0)` and let `current = dummy`.",
      "While `list1 !== null && list2 !== null`:",
      "  a. If `list1.val <= list2.val`, `current.next = list1`, `list1 = list1.next`.",
      "  b. Else `current.next = list2`, `list2 = list2.next`.",
      "  c. `current = current.next`.",
      "Attach remaining: `current.next = list1 || list2`.",
      "Return `dummy.next`."
    ],
    "edgeCases": [
      "One or both input lists are empty `null`: returns the other list immediately.",
      "Lists of different lengths `[1, 2, 4]` and `[1, 3, 4, 5, 6]`."
    ],
    "timeComplexity": "O(n + m) - Splices nodes in linear time proportional to total length.",
    "spaceComplexity": "O(1) - Rearranges existing nodes in-place.",
    "code": {
      "JavaScript": "function mergeTwoLists(list1, list2) {\n  const dummy = new ListNode(0);\n  let current = dummy;\n  while (list1 !== null && list2 !== null) {\n    if (list1.val <= list2.val) {\n      current.next = list1;\n      list1 = list1.next;\n    } else {\n      current.next = list2;\n      list2 = list2.next;\n    }\n    current = current.next;\n  }\n  current.next = list1 !== null ? list1 : list2;\n  return dummy.next;\n}",
      "TypeScript": "function mergeTwoLists(list1: any, list2: any): any {\n  const dummy = new ListNode(0);\n  let current: any = dummy;\n  while (list1 !== null && list2 !== null) {\n    if (list1.val <= list2.val) {\n      current.next = list1;\n      list1 = list1.next;\n    } else {\n      current.next = list2;\n      list2 = list2.next;\n    }\n    current = current.next;\n  }\n  current.next = list1 !== null ? list1 : list2;\n  return dummy.next;\n}",
      "Python": "def mergeTwoLists(list1, list2):\n    dummy = ListNode(0)\n    current = dummy\n    while list1 and list2:\n        if list1.val <= list2.val:\n            current.next = list1\n            list1 = list1.next\n        else:\n            current.next = list2\n            list2 = list2.next\n        current = current.next\n    current.next = list1 if list1 else list2\n    return dummy.next"
    }
  },
  "prob-42": {
    "approach": "Fast and Slow Two Pointers with Gap N",
    "explanation": "To remove the nth node from the end in a single pass, we advance `fast` pointer `n + 1` steps ahead of `slow` (using a dummy head node). When `fast` reaches `null`, `slow` is precisely before the target node to be removed. We then update `slow.next = slow.next.next` to unlink the target node.",
    "algorithm": [
      "Create `dummy = new ListNode(0, head)`.",
      "Initialize `slow = dummy` and `fast = dummy`.",
      "Advance `fast` forward by `n + 1` steps.",
      "While `fast !== null`:",
      "  a. `slow = slow.next`.",
      "  b. `fast = fast.next`.",
      "Delete node: `slow.next = slow.next.next`.",
      "Return `dummy.next`."
    ],
    "edgeCases": [
      "Removing the head node (`n === length`): dummy node handles this cleanly.",
      "Single-node list `[1], n = 1`: returns `null`.",
      "Removing the tail node (`n === 1`)."
    ],
    "timeComplexity": "O(L) - One-pass traversal over the list of length L.",
    "spaceComplexity": "O(1) - Constant auxiliary space.",
    "code": {
      "JavaScript": "function removeNthFromEnd(head, n) {\n  const dummy = new ListNode(0, head);\n  let fast = dummy;\n  let slow = dummy;\n  for (let i = 0; i <= n; i++) {\n    fast = fast.next;\n  }\n  while (fast !== null) {\n    slow = slow.next;\n    fast = fast.next;\n  }\n  slow.next = slow.next.next;\n  return dummy.next;\n}",
      "TypeScript": "function removeNthFromEnd(head: any, n: number): any {\n  const dummy = new ListNode(0, head);\n  let fast: any = dummy;\n  let slow: any = dummy;\n  for (let i = 0; i <= n; i++) {\n    fast = fast.next;\n  }\n  while (fast !== null) {\n    slow = slow.next;\n    fast = fast.next;\n  }\n  slow.next = slow.next.next;\n  return dummy.next;\n}",
      "Python": "def removeNthFromEnd(head, n: int):\n    dummy = ListNode(0, head)\n    fast = dummy\n    slow = dummy\n    for _ in range(n + 1):\n        fast = fast.next\n    while fast:\n        slow = slow.next\n        fast = fast.next\n    slow.next = slow.next.next\n    return dummy.next"
    }
  },
  "prob-43": {
    "approach": "Floyd's Tortoise and Hare Cycle Detection",
    "explanation": "We use two pointers moving at different speeds: `slow` advances 1 step at a time, and `fast` advances 2 steps at a time. If there is no cycle, `fast` reaches the end (`null`). If a cycle exists, `fast` enters the loop and reduces the distance to `slow` by 1 node per iteration until they inevitably collide (`slow === fast`).",
    "algorithm": [
      "If `head === null || head.next === null`, return `false`.",
      "Initialize `slow = head` and `fast = head.next`.",
      "While `slow !== fast`:",
      "  a. If `fast === null || fast.next === null`, return `false`.",
      "  b. Advance `slow = slow.next`.",
      "  c. Advance `fast = fast.next.next`.",
      "Return `true`."
    ],
    "edgeCases": [
      "Empty list or single node without cycle: returns `false`.",
      "Single node pointing to itself: returns `true`.",
      "Cycle encompassing the entire list."
    ],
    "timeComplexity": "O(n) - If a cycle exists, fast catches slow in at most n iterations.",
    "spaceComplexity": "O(1) - Only two pointers used without modifying list nodes.",
    "code": {
      "JavaScript": "function hasCycle(head) {\n  if (!head || !head.next) return false;\n  let slow = head;\n  let fast = head.next;\n  while (slow !== fast) {\n    if (!fast || !fast.next) return false;\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n  return true;\n}",
      "TypeScript": "function hasCycle(head: any): boolean {\n  if (!head || !head.next) return false;\n  let slow: any = head;\n  let fast: any = head.next;\n  while (slow !== fast) {\n    if (!fast || !fast.next) return false;\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n  return true;\n}",
      "Python": "def hasCycle(head) -> bool:\n    if not head or not head.next:\n        return False\n    slow = head\n    fast = head.next\n    while slow != fast:\n        if not fast or not fast.next:\n            return False\n        slow = slow.next\n        fast = fast.next.next\n    return True"
    }
  },
  "prob-44": {
    "approach": "Divide and Conquer Pairwise Merging",
    "explanation": "Instead of sequentially merging `k` lists one by one (O(k² * n)), we merge them pairwise in a divide-and-conquer strategy similar to merge sort. In round 1, we merge lists `0` with `1`, `2` with `3`, reducing `k` lists to `k/2`. Repeating for `log k` rounds yields the fully sorted linked list.",
    "algorithm": [
      "If `lists` is empty, return `null`.",
      "While `lists.length > 1`:",
      "  a. Create `mergedLists = []`.",
      "  b. For `i` from 0 to `lists.length - 1` by step 2:",
      "       `l1 = lists[i]`, `l2 = (i + 1 < lists.length) ? lists[i + 1] : null`.",
      "       `mergedLists.push(mergeTwoLists(l1, l2))`.",
      "  c. Update `lists = mergedLists`.",
      "Return `lists[0]`."
    ],
    "edgeCases": [
      "Empty outer array `[]`: returns `null`.",
      "Array with all empty sublists `[[], []]`: returns `null`.",
      "`k = 1`: returns `lists[0]` directly."
    ],
    "timeComplexity": "O(N log k) - Where N is total number of nodes across all k lists.",
    "spaceComplexity": "O(1) - In-place pointer manipulation.",
    "code": {
      "JavaScript": "function mergeKLists(lists) {\n  if (!lists || lists.length === 0) return null;\n  function mergeTwo(l1, l2) {\n    const dummy = new ListNode(0);\n    let cur = dummy;\n    while (l1 && l2) {\n      if (l1.val <= l2.val) {\n        cur.next = l1;\n        l1 = l1.next;\n      } else {\n        cur.next = l2;\n        l2 = l2.next;\n      }\n      cur = cur.next;\n    }\n    cur.next = l1 || l2;\n    return dummy.next;\n  }\n  while (lists.length > 1) {\n    const merged = [];\n    for (let i = 0; i < lists.length; i += 2) {\n      const l1 = lists[i];\n      const l2 = i + 1 < lists.length ? lists[i + 1] : null;\n      merged.push(mergeTwo(l1, l2));\n    }\n    lists = merged;\n  }\n  return lists[0];\n}",
      "TypeScript": "function mergeKLists(lists: any[]): any {\n  if (!lists || lists.length === 0) return null;\n  function mergeTwo(l1: any, l2: any): any {\n    const dummy = new ListNode(0);\n    let cur: any = dummy;\n    while (l1 && l2) {\n      if (l1.val <= l2.val) {\n        cur.next = l1;\n        l1 = l1.next;\n      } else {\n        cur.next = l2;\n        l2 = l2.next;\n      }\n      cur = cur.next;\n    }\n    cur.next = l1 || l2;\n    return dummy.next;\n  }\n  let currentLists = [...lists];\n  while (currentLists.length > 1) {\n    const merged: any[] = [];\n    for (let i = 0; i < currentLists.length; i += 2) {\n      const l1 = currentLists[i];\n      const l2 = i + 1 < currentLists.length ? currentLists[i + 1] : null;\n      merged.push(mergeTwo(l1, l2));\n    }\n    currentLists = merged;\n  }\n  return currentLists[0];\n}",
      "Python": "def mergeKLists(lists: list):\n    if not lists:\n        return None\n    def merge_two(l1, l2):\n        dummy = ListNode(0)\n        cur = dummy\n        while l1 and l2:\n            if l1.val <= l2.val:\n                cur.next = l1\n                l1 = l1.next\n            else:\n                cur.next = l2\n                l2 = l2.next\n            cur = cur.next\n        cur.next = l1 or l2\n        return dummy.next\n\n    while len(lists) > 1:\n        merged = []\n        for i in range(0, len(lists), 2):\n            l1 = lists[i]\n            l2 = lists[i + 1] if i + 1 < len(lists) else None\n            merged.append(merge_two(l1, l2))\n        lists = merged\n    return lists[0]"
    }
  },
  "prob-45": {
    "approach": "Modified Binary Search with Sorted Half Determination",
    "explanation": "In a rotated sorted array, splitting at `mid` always leaves at least one half strictly sorted. We inspect `nums[left] <= nums[mid]`. If true, the left half `[left, mid]` is sorted; if `target` lies within `[nums[left], nums[mid])`, we search left (`right = mid - 1`), else right (`left = mid + 1`). Otherwise, the right half `[mid, right]` is sorted; if `target` lies within `(nums[mid], nums[right]]`, we search right, else left.",
    "algorithm": [
      "Initialize `left = 0`, `right = nums.length - 1`.",
      "While `left <= right`:",
      "  a. Let `mid = Math.floor(left + (right - left) / 2)`.",
      "  b. If `nums[mid] === target`, return `mid`.",
      "  c. If left half is sorted (`nums[left] <= nums[mid]`):",
      "       If `nums[left] <= target && target < nums[mid]`, `right = mid - 1`.",
      "       Else `left = mid + 1`.",
      "  d. Else (right half is sorted):",
      "       If `nums[mid] < target && target <= nums[right]`, `left = mid + 1`.",
      "       Else `right = mid - 1`.",
      "Return `-1`."
    ],
    "edgeCases": [
      "Array not rotated at all `[1, 2, 3, 4, 5]`.",
      "Single element matching or not matching target `[1], 0`.",
      "Target is at the rotation pivot."
    ],
    "timeComplexity": "O(log n) - Search space is halved in every iteration.",
    "spaceComplexity": "O(1) - Constant auxiliary space.",
    "code": {
      "JavaScript": "function searchRotated(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[left] <= nums[mid]) {\n      if (nums[left] <= target && target < nums[mid]) {\n        right = mid - 1;\n      } else {\n        left = mid + 1;\n      }\n    } else {\n      if (nums[mid] < target && target <= nums[right]) {\n        left = mid + 1;\n      } else {\n        right = mid - 1;\n      }\n    }\n  }\n  return -1;\n}",
      "TypeScript": "function searchRotated(nums: number[], target: number): number {\n  let left = 0;\n  let right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[left] <= nums[mid]) {\n      if (nums[left] <= target && target < nums[mid]) {\n        right = mid - 1;\n      } else {\n        left = mid + 1;\n      }\n    } else {\n      if (nums[mid] < target && target <= nums[right]) {\n        left = mid + 1;\n      } else {\n        right = mid - 1;\n      }\n    }\n  }\n  return -1;\n}",
      "Python": "def searchRotated(nums: list, target: int) -> int:\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[left] <= nums[mid]:\n            if nums[left] <= target < nums[mid]:\n                right = mid - 1\n            else:\n                left = mid + 1\n        else:\n            if nums[mid] < target <= nums[right]:\n                left = mid + 1\n            else:\n                right = mid - 1\n    return -1"
    }
  },
  "prob-46": {
    "approach": "Two-Pass Binary Search for Leftmost and Rightmost Boundaries",
    "explanation": "To find the starting and ending position of `target` in O(log n) time, we execute binary search twice: once searching for the leftmost boundary (when `nums[mid] === target`, we record `mid` and continue searching left with `right = mid - 1`), and once searching for the rightmost boundary (when `nums[mid] === target`, we record `mid` and continue searching right with `left = mid + 1`).",
    "algorithm": [
      "Define helper `findBound(isFirst)`:",
      "  a. Initialize `left = 0`, `right = nums.length - 1`, `ans = -1`.",
      "  b. While `left <= right`:",
      "       `mid = Math.floor(left + (right - left) / 2)`.",
      "       If `nums[mid] === target`:",
      "         `ans = mid`.",
      "         If `isFirst`, `right = mid - 1`; else `left = mid + 1`.",
      "       Else if `nums[mid] < target`, `left = mid + 1`.",
      "       Else `right = mid - 1`.",
      "  c. Return `ans`.",
      "Return `[findBound(true), findBound(false)]`."
    ],
    "edgeCases": [
      "Target not in array: returns `[-1, -1]`.",
      "Target appears exactly once `[5, 7, 7, 8, 10], target = 8`: returns `[3, 3]`.",
      "All elements in array equal target `[8, 8, 8, 8], target = 8`: returns `[0, 3]`."
    ],
    "timeComplexity": "O(log n) - Two binary searches over array of length n.",
    "spaceComplexity": "O(1) - Constant auxiliary variables.",
    "code": {
      "JavaScript": "function searchRange(nums, target) {\n  function findBound(isFirst) {\n    let left = 0, right = nums.length - 1, bound = -1;\n    while (left <= right) {\n      const mid = Math.floor(left + (right - left) / 2);\n      if (nums[mid] === target) {\n        bound = mid;\n        if (isFirst) {\n          right = mid - 1;\n        } else {\n          left = mid + 1;\n        }\n      } else if (nums[mid] < target) {\n        left = mid + 1;\n      } else {\n        right = mid - 1;\n      }\n    }\n    return bound;\n  }\n  return [findBound(true), findBound(false)];\n}",
      "TypeScript": "function searchRange(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let left = 0, right = nums.length - 1, bound = -1;\n    while (left <= right) {\n      const mid = Math.floor(left + (right - left) / 2);\n      if (nums[mid] === target) {\n        bound = mid;\n        if (isFirst) {\n          right = mid - 1;\n        } else {\n          left = mid + 1;\n        }\n      } else if (nums[mid] < target) {\n        left = mid + 1;\n      } else {\n        right = mid - 1;\n      }\n    }\n    return bound;\n  }\n  return [findBound(true), findBound(false)];\n}",
      "Python": "def searchRange(nums: list, target: int) -> list:\n    def find_bound(is_first: bool) -> int:\n        left, right = 0, len(nums) - 1\n        bound = -1\n        while left <= right:\n            mid = left + (right - left) // 2\n            if nums[mid] == target:\n                bound = mid\n                if is_first:\n                    right = mid - 1\n                else:\n                    left = mid + 1\n            elif nums[mid] < target:\n                left = mid + 1\n            else:\n                right = mid - 1\n        return bound\n    return [find_bound(True), find_bound(False)]"
    }
  },
  "prob-47": {
    "approach": "Binary Search on Shorter Array Partition",
    "explanation": "We partition `nums1` and `nums2` into left and right halves such that the left half contains `(m + n + 1) / 2` elements and every element in the left partition is `<= ` every element in the right partition. By binary searching the cut point `i` in the smaller array (ensuring O(log(min(m, n)))), `j = Math.floor((m + n + 1) / 2) - i` is determined automatically. When `maxLeft1 <= minRight2` and `maxLeft2 <= minRight1`, the partition is valid.",
    "algorithm": [
      "Ensure `nums1.length <= nums2.length` (swap if needed).",
      "Let `m = nums1.length`, `n = nums2.length`.",
      "Initialize `low = 0`, `high = m`.",
      "While `low <= high`:",
      "  a. Let `i = Math.floor((low + high) / 2)` and `j = Math.floor((m + n + 1) / 2) - i`.",
      "  b. `maxLeft1 = (i === 0) ? -Infinity : nums1[i - 1]`.",
      "  c. `minRight1 = (i === m) ? Infinity : nums1[i]`.",
      "  d. `maxLeft2 = (j === 0) ? -Infinity : nums2[j - 1]`.",
      "  e. `minRight2 = (j === n) ? Infinity : nums2[j]`.",
      "  f. If `maxLeft1 <= minRight2 && maxLeft2 <= minRight1`:",
      "       If `(m + n) % 2 !== 0`, return `Math.max(maxLeft1, maxLeft2)`.",
      "       Else return `(Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2`.",
      "  g. Else if `maxLeft1 > minRight2`, `high = i - 1`.",
      "  h. Else `low = i + 1`."
    ],
    "edgeCases": [
      "One array is completely empty `[]` and `[1]`.",
      "All elements in one array smaller than all elements in the other.",
      "Even total length vs odd total length."
    ],
    "timeComplexity": "O(log(min(m, n))) - Binary search executed strictly on the smaller array.",
    "spaceComplexity": "O(1) - Partition boundaries computed with constant variables.",
    "code": {
      "JavaScript": "function findMedianSortedArrays(nums1, nums2) {\n  if (nums1.length > nums2.length) {\n    return findMedianSortedArrays(nums2, nums1);\n  }\n  const m = nums1.length;\n  const n = nums2.length;\n  let low = 0;\n  let high = m;\n  while (low <= high) {\n    const i = Math.floor((low + high) / 2);\n    const j = Math.floor((m + n + 1) / 2) - i;\n    const maxLeft1 = i === 0 ? -Infinity : nums1[i - 1];\n    const minRight1 = i === m ? Infinity : nums1[i];\n    const maxLeft2 = j === 0 ? -Infinity : nums2[j - 1];\n    const minRight2 = j === n ? Infinity : nums2[j];\n    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {\n      if ((m + n) % 2 !== 0) {\n        return Math.max(maxLeft1, maxLeft2);\n      } else {\n        return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;\n      }\n    } else if (maxLeft1 > minRight2) {\n      high = i - 1;\n    } else {\n      low = i + 1;\n    }\n  }\n  return 0;\n}",
      "TypeScript": "function findMedianSortedArrays(nums1: number[], nums2: number[]): number {\n  if (nums1.length > nums2.length) {\n    return findMedianSortedArrays(nums2, nums1);\n  }\n  const m = nums1.length;\n  const n = nums2.length;\n  let low = 0;\n  let high = m;\n  while (low <= high) {\n    const i = Math.floor((low + high) / 2);\n    const j = Math.floor((m + n + 1) / 2) - i;\n    const maxLeft1 = i === 0 ? -Infinity : nums1[i - 1];\n    const minRight1 = i === m ? Infinity : nums1[i];\n    const maxLeft2 = j === 0 ? -Infinity : nums2[j - 1];\n    const minRight2 = j === n ? Infinity : nums2[j];\n    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {\n      if ((m + n) % 2 !== 0) {\n        return Math.max(maxLeft1, maxLeft2);\n      } else {\n        return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;\n      }\n    } else if (maxLeft1 > minRight2) {\n      high = i - 1;\n    } else {\n      low = i + 1;\n    }\n  }\n  return 0;\n}",
      "Python": "def findMedianSortedArrays(nums1: list, nums2: list) -> float:\n    if len(nums1) > len(nums2):\n        nums1, nums2 = nums2, nums1\n    m, n = len(nums1), len(nums2)\n    low, high = 0, m\n    while low <= high:\n        i = (low + high) // 2\n        j = (m + n + 1) // 2 - i\n        max_left1 = float('-inf') if i == 0 else nums1[i - 1]\n        min_right1 = float('inf') if i == m else nums1[i]\n        max_left2 = float('-inf') if j == 0 else nums2[j - 1]\n        min_right2 = float('inf') if j == n else nums2[j]\n        if max_left1 <= min_right2 and max_left2 <= min_right1:\n            if (m + n) % 2 != 0:\n                return float(max(max_left1, max_left2))\n            else:\n                return (max(max_left1, max_left2) + min(min_right1, min_right2)) / 2.0\n        elif max_left1 > min_right2:\n            high = i - 1\n        else:\n            low = i + 1\n    return 0.0"
    }
  },
  "prob-48": {
    "approach": "Backtracking with Open/Close Count Pruning",
    "explanation": "We generate well-formed parentheses strings by maintaining counts of `open` and `close` parentheses added so far. We can add an opening bracket `(` as long as `open < n`. We can add a closing bracket `)` only when `close < open` (guaranteeing that every closing bracket matches an earlier opened one). When the string reaches length `2 * n`, we add it to the results.",
    "algorithm": [
      "Initialize `result = []`.",
      "Define `backtrack(current, open, close)`:",
      "  a. If `current.length === 2 * n`, push `current` to `result` and return.",
      "  b. If `open < n`, call `backtrack(current + '(', open + 1, close)`.",
      "  c. If `close < open`, call `backtrack(current + ')', open, close + 1)`.",
      "Call `backtrack('', 0, 0)`.",
      "Return `result`."
    ],
    "edgeCases": [
      "`n = 1`: returns `[\"()\"]`.",
      "`n = 3`: returns all 5 Catalan combinations.",
      "`n = 0`: returns `[\"\"]`."
    ],
    "timeComplexity": "O(4^n / sqrt(n)) - Bounded by the nth Catalan number C_n.",
    "spaceComplexity": "O(n) - Maximum recursion depth is 2 * n.",
    "code": {
      "JavaScript": "function generateParenthesis(n) {\n  const result = [];\n  function backtrack(current, open, close) {\n    if (current.length === n * 2) {\n      result.push(current);\n      return;\n    }\n    if (open < n) {\n      backtrack(current + '(', open + 1, close);\n    }\n    if (close < open) {\n      backtrack(current + ')', open, close + 1);\n    }\n  }\n  backtrack('', 0, 0);\n  return result;\n}",
      "TypeScript": "function generateParenthesis(n: number): string[] {\n  const result: string[] = [];\n  function backtrack(current: string, open: number, close: number) {\n    if (current.length === n * 2) {\n      result.push(current);\n      return;\n    }\n    if (open < n) {\n      backtrack(current + '(', open + 1, close);\n    }\n    if (close < open) {\n      backtrack(current + ')', open, close + 1);\n    }\n  }\n  backtrack('', 0, 0);\n  return result;\n}",
      "Python": "def generateParenthesis(n: int) -> list:\n    result = []\n    def backtrack(current: str, open_count: int, close_count: int):\n        if len(current) == 2 * n:\n            result.append(current)\n            return\n        if open_count < n:\n            backtrack(current + '(', open_count + 1, close_count)\n        if close_count < open_count:\n            backtrack(current + ')', open_count, close_count + 1)\n    backtrack('', 0, 0)\n    return result"
    }
  },
  "prob-49": {
    "approach": "Cascading / Backtracking Power Set Generation",
    "explanation": "To generate all 2^n subsets (the power set), we use depth-first backtracking. At each index `start`, we add the current subset snapshot to our result list. We then branch through all remaining elements from `start` to `nums.length - 1`, pushing `nums[i]`, recursing with `i + 1`, and popping `nums[i]` (backtracking).",
    "algorithm": [
      "Initialize `result = []`.",
      "Define `backtrack(start, path)`:",
      "  a. Push a copy of `path` to `result`.",
      "  b. For `i` from `start` to `nums.length - 1`:",
      "       `path.push(nums[i])`.",
      "       `backtrack(i + 1, path)`.",
      "       `path.pop()`.",
      "Call `backtrack(0, [])`.",
      "Return `result`."
    ],
    "edgeCases": [
      "Empty array `[]`: returns `[[]]`.",
      "Single element array `[0]`: returns `[[], [0]]`.",
      "Array with multiple unique numbers `[1, 2, 3]`."
    ],
    "timeComplexity": "O(n * 2^n) - There are 2^n subsets, and copying each takes up to O(n).",
    "spaceComplexity": "O(n) - Maximum depth of the recursion stack.",
    "code": {
      "JavaScript": "function subsets(nums) {\n  const result = [];\n  function backtrack(start, path) {\n    result.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return result;\n}",
      "TypeScript": "function subsets(nums: number[]): number[][] {\n  const result: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    result.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return result;\n}",
      "Python": "def subsets(nums: list) -> list:\n    result = []\n    def backtrack(start: int, path: list):\n        result.append(list(path))\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            backtrack(i + 1, path)\n            path.pop()\n    backtrack(0, [])\n    return result"
    }
  },
  "prob-50": {
    "approach": "Backtracking with Column and Diagonal Sets",
    "explanation": "To place N queens on an N x N chessboard without any two attacking each other, we place one queen per row. For a queen at `(r, c)`: column conflict is tracked by set `cols`, positive diagonal `r + c` is tracked by set `diag1`, and negative diagonal `r - c` is tracked by set `diag2`. If cell `(r, c)` is safe, we place the queen, mark sets, and recurse to `row + 1`.",
    "algorithm": [
      "Initialize `result = []`, `cols = new Set()`, `diag1 = new Set()`, `diag2 = new Set()`, and empty `board = Array(n).fill('.'.repeat(n))`.",
      "Define `backtrack(r, currentBoard)`:",
      "  a. If `r === n`, add snapshot of `currentBoard` to `result` and return.",
      "  b. For `c` from 0 to `n - 1`:",
      "       If `cols.has(c) || diag1.has(r + c) || diag2.has(r - c)`, continue.",
      "       Place queen: add to sets, set `currentBoard[r][c] = 'Q'`.",
      "       `backtrack(r + 1, currentBoard)`.",
      "       Backtrack: remove from sets, restore `currentBoard[r][c] = '.'`.",
      "Call `backtrack(0, board)`.",
      "Return `result`."
    ],
    "edgeCases": [
      "`n = 1`: returns `[[\"Q\"]]`.",
      "`n = 2` or `n = 3`: no valid solution exists, returns `[]`.",
      "`n = 4`: returns 2 distinct solution boards."
    ],
    "timeComplexity": "O(N!) - Exploration space pruned across N rows.",
    "spaceComplexity": "O(N) - Storage for recursion stack, board representation, and diagonal sets.",
    "code": {
      "JavaScript": "function solveNQueens(n) {\n  const result = [];\n  const cols = new Set();\n  const diag1 = new Set();\n  const diag2 = new Set();\n  const board = Array.from({ length: n }, () => new Array(n).fill('.'));\n  function backtrack(row) {\n    if (row === n) {\n      result.push(board.map(r => r.join('')));\n      return;\n    }\n    for (let col = 0; col < n; col++) {\n      if (cols.has(col) || diag1.has(row + col) || diag2.has(row - col)) {\n        continue;\n      }\n      cols.add(col);\n      diag1.add(row + col);\n      diag2.add(row - col);\n      board[row][col] = 'Q';\n      backtrack(row + 1);\n      board[row][col] = '.';\n      cols.delete(col);\n      diag1.delete(row + col);\n      diag2.delete(row - col);\n    }\n  }\n  backtrack(0);\n  return result;\n}",
      "TypeScript": "function solveNQueens(n: number): string[][] {\n  const result: string[][] = [];\n  const cols = new Set<number>();\n  const diag1 = new Set<number>();\n  const diag2 = new Set<number>();\n  const board: string[][] = Array.from({ length: n }, () => new Array(n).fill('.'));\n  function backtrack(row: number) {\n    if (row === n) {\n      result.push(board.map(r => r.join('')));\n      return;\n    }\n    for (let col = 0; col < n; col++) {\n      if (cols.has(col) || diag1.has(row + col) || diag2.has(row - col)) {\n        continue;\n      }\n      cols.add(col);\n      diag1.add(row + col);\n      diag2.add(row - col);\n      board[row][col] = 'Q';\n      backtrack(row + 1);\n      board[row][col] = '.';\n      cols.delete(col);\n      diag1.delete(row + col);\n      diag2.delete(row - col);\n    }\n  }\n  backtrack(0);\n  return result;\n}",
      "Python": "def solveNQueens(n: int) -> list:\n    result = []\n    cols = set()\n    diag1 = set()\n    diag2 = set()\n    board = [['.' for _ in range(n)] for _ in range(n)]\n    def backtrack(row: int):\n        if row == n:\n            result.append([''.join(r) for r in board])\n            return\n        for col in range(n):\n            if col in cols or (row + col) in diag1 or (row - col) in diag2:\n                continue\n            cols.add(col)\n            diag1.add(row + col)\n            diag2.add(row - col)\n            board[row][col] = 'Q'\n            backtrack(row + 1)\n            board[row][col] = '.'\n            cols.remove(col)\n            diag1.remove(row + col)\n            diag2.remove(row - col)\n    backtrack(0)\n    return result"
    }
  },
  "prob-51": {
    "approach": "Recursive Depth-First Search (Postorder Max Depth)",
    "explanation": "The maximum depth of a binary tree is the number of nodes along the longest path from the root down to the farthest leaf node. For any node, `maxDepth(node) = 1 + Math.max(maxDepth(node.left), maxDepth(node.right))`, with base case `maxDepth(null) = 0`.",
    "algorithm": [
      "If `root === null`, return 0.",
      "Recursively compute `leftDepth = maxDepth(root.left)`.",
      "Recursively compute `rightDepth = maxDepth(root.right)`.",
      "Return `1 + Math.max(leftDepth, rightDepth)`."
    ],
    "edgeCases": [
      "Empty tree (`root === null`): returns 0.",
      "Single root node: returns 1.",
      "Completely skewed tree: depth equals number of nodes."
    ],
    "timeComplexity": "O(n) - Visits every node in the tree once.",
    "spaceComplexity": "O(h) - Call stack takes height h (O(n) worst-case, O(log n) balanced).",
    "code": {
      "JavaScript": "function maxDepth(root) {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}",
      "TypeScript": "function maxDepth(root: any): number {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}",
      "Python": "def maxDepth(root) -> int:\n    if not root:\n        return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))"
    }
  },
  "prob-52": {
    "approach": "Recursive Subtree Inversion",
    "explanation": "Inverting a binary tree (mirroring it horizontally) swaps every node's left and right child pointers. We recursively invert the left subtree, invert the right subtree, and then swap `root.left` and `root.right`.",
    "algorithm": [
      "If `root === null`, return `null`.",
      "Temporarily save `tempLeft = invertTree(root.left)`.",
      "Set `root.left = invertTree(root.right)`.",
      "Set `root.right = tempLeft`.",
      "Return `root`."
    ],
    "edgeCases": [
      "Empty tree `null`: returns `null`.",
      "Single node: returns the node unchanged.",
      "Asymmetrical tree structure."
    ],
    "timeComplexity": "O(n) - Visits every node once.",
    "spaceComplexity": "O(h) - Recursion stack bounded by tree height.",
    "code": {
      "JavaScript": "function invertTree(root) {\n  if (!root) return null;\n  const temp = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(temp);\n  return root;\n}",
      "TypeScript": "function invertTree(root: any): any {\n  if (!root) return null;\n  const temp = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(temp);\n  return root;\n}",
      "Python": "def invertTree(root):\n    if not root:\n        return None\n    root.left, root.right = invertTree(root.right), invertTree(root.left)\n    return root"
    }
  },
  "prob-53": {
    "approach": "Recursive Range Validation `(minVal, maxVal)`",
    "explanation": "A valid Binary Search Tree (BST) requires that *every* node in the left subtree is strictly less than the root, and *every* node in the right subtree is strictly greater than the root. Simply checking immediate children is insufficient. We pass allowable bounds `(minVal, maxVal)` down the recursion: left child bounds become `(minVal, node.val)` and right child bounds become `(node.val, maxVal)`.",
    "algorithm": [
      "Define helper `validate(node, minVal, maxVal)`:",
      "  a. If `node === null`, return `true`.",
      "  b. If `minVal !== null && node.val <= minVal`, return `false`.",
      "  c. If `maxVal !== null && node.val >= maxVal`, return `false`.",
      "  d. Return `validate(node.left, minVal, node.val) && validate(node.right, node.val, maxVal)`.",
      "Return `validate(root, null, null)`."
    ],
    "edgeCases": [
      "Duplicate values `[2, 2, 2]`: invalid because BST requires strictly greater/less.",
      "Node violating ancestor constraint deeper in subtree (e.g. right child containing a value smaller than grandparent).",
      "Nodes holding `Number.MIN_SAFE_INTEGER` or `Number.MAX_SAFE_INTEGER`."
    ],
    "timeComplexity": "O(n) - Inspects each node once.",
    "spaceComplexity": "O(h) - Stack memory bounded by tree height.",
    "code": {
      "JavaScript": "function isValidBST(root) {\n  function validate(node, min, max) {\n    if (!node) return true;\n    if (min !== null && node.val <= min) return false;\n    if (max !== null && node.val >= max) return false;\n    return validate(node.left, min, node.val) && validate(node.right, node.val, max);\n  }\n  return validate(root, null, null);\n}",
      "TypeScript": "function isValidBST(root: any): boolean {\n  function validate(node: any, min: number | null, max: number | null): boolean {\n    if (!node) return true;\n    if (min !== null && node.val <= min) return false;\n    if (max !== null && node.val >= max) return false;\n    return validate(node.left, min, node.val) && validate(node.right, node.val, max);\n  }\n  return validate(root, null, null);\n}",
      "Python": "def isValidBST(root) -> bool:\n    def validate(node, min_val, max_val):\n        if not node:\n            return True\n        if min_val is not None and node.val <= min_val:\n            return False\n        if max_val is not None and node.val >= max_val:\n            return False\n        return validate(node.left, min_val, node.val) and validate(node.right, node.val, max_val)\n    return validate(root, None, None)"
    }
  },
  "prob-54": {
    "approach": "BST Value Navigation (Split Point Detection)",
    "explanation": "In a BST, all nodes in the left subtree have values smaller than the root, and all nodes in the right subtree have values larger. If both `p.val` and `q.val` are strictly less than `root.val`, the LCA must lie in the left subtree. If both are strictly greater, LCA lies in the right subtree. If `p` and `q` lie on opposite sides of `root`, or one equals `root`, then `root` is their Lowest Common Ancestor.",
    "algorithm": [
      "Let `curr = root`.",
      "While `curr !== null`:",
      "  a. If `p.val < curr.val && q.val < curr.val`, advance `curr = curr.left`.",
      "  b. Else if `p.val > curr.val && q.val > curr.val`, advance `curr = curr.right`.",
      "  c. Else return `curr`."
    ],
    "edgeCases": [
      "`p` is an ancestor of `q` (e.g. root is `p`): returns `p` directly.",
      "`p` and `q` are direct left and right children of root.",
      "Two-node tree."
    ],
    "timeComplexity": "O(h) - Height of the BST (O(log n) balanced, O(n) skewed).",
    "spaceComplexity": "O(1) - Iterative traversal with no extra memory.",
    "code": {
      "JavaScript": "function lowestCommonAncestor(root, p, q) {\n  let curr = root;\n  const pVal = typeof p === 'object' && p !== null ? p.val : p;\n  const qVal = typeof q === 'object' && q !== null ? q.val : q;\n  while (curr) {\n    if (pVal < curr.val && qVal < curr.val) {\n      curr = curr.left;\n    } else if (pVal > curr.val && qVal > curr.val) {\n      curr = curr.right;\n    } else {\n      return curr;\n    }\n  }\n  return null;\n}",
      "TypeScript": "function lowestCommonAncestor(root: any, p: any, q: any): any {\n  let curr: any = root;\n  const pVal = typeof p === 'object' && p !== null ? p.val : p;\n  const qVal = typeof q === 'object' && q !== null ? q.val : q;\n  while (curr) {\n    if (pVal < curr.val && qVal < curr.val) {\n      curr = curr.left;\n    } else if (pVal > curr.val && qVal > curr.val) {\n      curr = curr.right;\n    } else {\n      return curr;\n    }\n  }\n  return null;\n}",
      "Python": "def lowestCommonAncestor(root, p, q):\n    curr = root\n    p_val = p.val if hasattr(p, 'val') else p\n    q_val = q.val if hasattr(q, 'val') else q\n    while curr:\n        if p_val < curr.val and q_val < curr.val:\n            curr = curr.left\n        elif p_val > curr.val and q_val > curr.val:\n            curr = curr.right\n        else:\n            return curr\n    return None"
    }
  },
  "prob-55": {
    "approach": "Grid DFS Flood Fill / Connected Component Counting",
    "explanation": "We iterate through every cell `(r, c)` in the 2D grid. When we encounter an unvisited land cell `'1'`, we increment our island count and trigger a Depth-First Search (DFS) flood fill to sink the connected island (mutating connected `'1'`s into `'0'`s in 4 cardinal directions) so it is not double-counted.",
    "algorithm": [
      "If `grid` is empty, return 0.",
      "Let `rows = grid.length`, `cols = grid[0].length`, `islandCount = 0`.",
      "Define `dfs(r, c)`:",
      "  a. If `r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1'`, return.",
      "  b. Mark cell visited by setting `grid[r][c] = '0'`.",
      "  c. Recurse in 4 directions: `dfs(r+1, c)`, `dfs(r-1, c)`, `dfs(r, c+1)`, `dfs(r, c-1)`.",
      "For `r` from 0 to `rows - 1`:",
      "  For `c` from 0 to `cols - 1`:",
      "    If `grid[r][c] === '1'`, `islandCount++`, `dfs(r, c)`.",
      "Return `islandCount`."
    ],
    "edgeCases": [
      "Grid consisting entirely of water `[['0', '0'], ['0', '0']]`: returns 0.",
      "Grid consisting entirely of land: returns 1.",
      "Diagonal lands (not connected 4-directionally): counted as separate islands."
    ],
    "timeComplexity": "O(M * N) - Every cell is visited a constant number of times.",
    "spaceComplexity": "O(M * N) - Recursion call stack in the worst-case grid filled with land.",
    "code": {
      "JavaScript": "function numIslands(grid) {\n  if (!grid || grid.length === 0) return 0;\n  const rows = grid.length;\n  const cols = grid[0].length;\n  let count = 0;\n  const clone = grid.map(r => [...r]);\n  function dfs(r, c) {\n    if (r < 0 || r >= rows || c < 0 || c >= cols || clone[r][c] !== '1') {\n      return;\n    }\n    clone[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (clone[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
      "TypeScript": "function numIslands(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  const rows = grid.length;\n  const cols = grid[0].length;\n  let count = 0;\n  const clone: string[][] = grid.map(r => [...r]);\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= rows || c < 0 || c >= cols || clone[r][c] !== '1') {\n      return;\n    }\n    clone[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (clone[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
      "Python": "def numIslands(grid: list) -> int:\n    if not grid:\n        return 0\n    rows, cols = len(grid), len(grid[0])\n    clone = [list(r) for r in grid]\n    count = 0\n    def dfs(r, c):\n        if r < 0 or r >= rows or c < 0 or c >= cols or clone[r][c] != '1':\n            return\n        clone[r][c] = '0'\n        dfs(r + 1, c)\n        dfs(r - 1, c)\n        dfs(r, c + 1)\n        dfs(r, c - 1)\n    for r in range(rows):\n        for c in range(cols):\n            if clone[r][c] == '1':\n                count += 1\n                dfs(r, c)\n    return count"
    }
  },
  "prob-56": {
    "approach": "Kahn's Algorithm (Topological Sort with In-Degree Array)",
    "explanation": "We model courses as a directed graph where an edge `[u, v]` means taking prerequisite `v` allows course `u` (`v -> u`). We compute the in-degree (number of prerequisites) for each course. Courses with in-degree 0 are pushed into a queue. As we process each course from the queue, we decrement the in-degrees of its dependent courses. If a dependency drops to 0, we enqueue it. If all courses are processed (`processedCount === numCourses`), no cycle exists and all courses can be finished.",
    "algorithm": [
      "Initialize `adj = Array(numCourses).fill().map(() => [])` and `inDegree = Array(numCourses).fill(0)`.",
      "For each `[course, prereq]` in `prerequisites`:",
      "  `adj[prereq].push(course)`.",
      "  `inDegree[course]++`.",
      "Enqueue all courses with `inDegree[i] === 0`.",
      "Initialize `takenCount = 0`.",
      "While queue is not empty:",
      "  Pop `curr = queue.shift()`, `takenCount++`.",
      "  For each `nextCourse` in `adj[curr]`:",
      "    `inDegree[nextCourse]--`.",
      "    If `inDegree[nextCourse] === 0`, push to queue.",
      "Return `takenCount === numCourses`."
    ],
    "edgeCases": [
      "Direct cycle `[[1, 0], [0, 1]]`: returns `false`.",
      "No prerequisites `[]`: returns `true`.",
      "Disjoint graphs / isolated courses."
    ],
    "timeComplexity": "O(V + E) - Where V is numCourses and E is prerequisites count.",
    "spaceComplexity": "O(V + E) - Storage for adjacency graph and in-degree array.",
    "code": {
      "JavaScript": "function canFinish(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0);\n  const adj = Array.from({ length: numCourses }, () => []);\n  for (let i = 0; i < prerequisites.length; i++) {\n    const [course, prereq] = prerequisites[i];\n    adj[prereq].push(course);\n    inDegree[course]++;\n  }\n  const queue = [];\n  for (let i = 0; i < numCourses; i++) {\n    if (inDegree[i] === 0) queue.push(i);\n  }\n  let count = 0;\n  while (queue.length > 0) {\n    const node = queue.shift();\n    count++;\n    for (let i = 0; i < adj[node].length; i++) {\n      const neighbor = adj[node][i];\n      inDegree[neighbor]--;\n      if (inDegree[neighbor] === 0) {\n        queue.push(neighbor);\n      }\n    }\n  }\n  return count === numCourses;\n}",
      "TypeScript": "function canFinish(numCourses: number, prerequisites: number[][]): boolean {\n  const inDegree = new Array<number>(numCourses).fill(0);\n  const adj: number[][] = Array.from({ length: numCourses }, () => []);\n  for (let i = 0; i < prerequisites.length; i++) {\n    const [course, prereq] = prerequisites[i];\n    adj[prereq].push(course);\n    inDegree[course]++;\n  }\n  const queue: number[] = [];\n  for (let i = 0; i < numCourses; i++) {\n    if (inDegree[i] === 0) queue.push(i);\n  }\n  let count = 0;\n  while (queue.length > 0) {\n    const node = queue.shift()!;\n    count++;\n    for (let i = 0; i < adj[node].length; i++) {\n      const neighbor = adj[node][i];\n      inDegree[neighbor]--;\n      if (inDegree[neighbor] === 0) {\n        queue.push(neighbor);\n      }\n    }\n  }\n  return count === numCourses;\n}",
      "Python": "def canFinish(numCourses: int, prerequisites: list) -> bool:\n    in_degree = [0] * numCourses\n    adj = [[] for _ in range(numCourses)]\n    for course, prereq in prerequisites:\n        adj[prereq].append(course)\n        in_degree[course] += 1\n    queue = [i for i in range(numCourses) if in_degree[i] == 0]\n    count = 0\n    while queue:\n        node = queue.pop(0)\n        count += 1\n        for neighbor in adj[node]:\n            in_degree[neighbor] -= 1\n            if in_degree[neighbor] == 0:\n                queue.append(neighbor)\n    return count == numCourses"
    }
  },
  "prob-57": {
    "approach": "Greedy Farthest Reachable Index Tracking",
    "explanation": "We maintain `maxReach` representing the farthest index reachable so far. As we iterate through index `i`, if `i > maxReach`, the current position is unreachable, so we return `false`. Otherwise, from position `i` we can reach up to `i + nums[i]`, updating `maxReach = Math.max(maxReach, i + nums[i])`. If `maxReach >= nums.length - 1`, we can reach the end, returning `true`.",
    "algorithm": [
      "Initialize `maxReach = 0`.",
      "For `i` from 0 to `nums.length - 1`:",
      "  a. If `i > maxReach`, return `false` (trapped before reaching i).",
      "  b. Update `maxReach = Math.max(maxReach, i + nums[i])`.",
      "  c. If `maxReach >= nums.length - 1`, return `true`.",
      "Return `true`."
    ],
    "edgeCases": [
      "Single element array `[0]`: returns `true` (already at end).",
      "Zeros blocking progress `[3, 2, 1, 0, 4]`: returns `false`.",
      "Large jumps surpassing end index."
    ],
    "timeComplexity": "O(n) - Single pass over the array.",
    "spaceComplexity": "O(1) - Constant auxiliary space.",
    "code": {
      "JavaScript": "function canJump(nums) {\n  let maxReach = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) return false;\n    maxReach = Math.max(maxReach, i + nums[i]);\n    if (maxReach >= nums.length - 1) return true;\n  }\n  return true;\n}",
      "TypeScript": "function canJump(nums: number[]): boolean {\n  let maxReach = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) return false;\n    maxReach = Math.max(maxReach, i + nums[i]);\n    if (maxReach >= nums.length - 1) return true;\n  }\n  return true;\n}",
      "Python": "def canJump(nums: list) -> bool:\n    max_reach = 0\n    for i, jump in enumerate(nums):\n        if i > max_reach:\n            return False\n        max_reach = max(max_reach, i + jump)\n        if max_reach >= len(nums) - 1:\n            return True\n    return True"
    }
  },
  "prob-58": {
    "approach": "Bottom-Up Dynamic Programming (Space-Optimized O(1))",
    "explanation": "To reach step `n`, you could have arrived from step `n - 1` (taking 1 step) or step `n - 2` (taking 2 steps). Therefore, the number of distinct ways satisfies the recurrence `dp[n] = dp[n - 1] + dp[n - 2]` with base cases `dp[1] = 1` and `dp[2] = 2`. This mirrors the Fibonacci recurrence and can be computed in O(1) space using two rolling variables.",
    "algorithm": [
      "If `n <= 2`, return `n`.",
      "Initialize `first = 1` and `second = 2`.",
      "For `i` from 3 to `n`:",
      "  a. Let `third = first + second`.",
      "  b. Update `first = second`.",
      "  c. Update `second = third`.",
      "Return `second`."
    ],
    "edgeCases": [
      "`n = 1`: returns 1.",
      "`n = 2`: returns 2.",
      "`n = 3`: returns 3 (1+1+1, 1+2, 2+1)."
    ],
    "timeComplexity": "O(n) - Single loop computing ways iteratively.",
    "spaceComplexity": "O(1) - Constant auxiliary storage.",
    "code": {
      "JavaScript": "function climbStairs(n) {\n  if (n <= 2) return n;\n  let first = 1;\n  let second = 2;\n  for (let i = 3; i <= n; i++) {\n    const third = first + second;\n    first = second;\n    second = third;\n  }\n  return second;\n}",
      "TypeScript": "function climbStairs(n: number): number {\n  if (n <= 2) return n;\n  let first = 1;\n  let second = 2;\n  for (let i = 3; i <= n; i++) {\n    const third = first + second;\n    first = second;\n    second = third;\n  }\n  return second;\n}",
      "Python": "def climbStairs(n: int) -> int:\n    if n <= 2:\n        return n\n    first, second = 1, 2\n    for _ in range(3, n + 1):\n        first, second = second, first + second\n    return second"
    }
  },
  "prob-59": {
    "approach": "Bottom-Up Dynamic Programming (Knapsack DP)",
    "explanation": "We define `dp[i]` as the minimum number of coins needed to make amount `i`. We initialize `dp = Array(amount + 1).fill(Infinity)` and set base case `dp[0] = 0`. For each sub-amount `i` from 1 to `amount` and each coin denomination `c`: if `i - c >= 0`, `dp[i] = Math.min(dp[i], dp[i - c] + 1)`. If `dp[amount]` remains Infinity, the amount cannot be formed, returning `-1`.",
    "algorithm": [
      "Initialize `dp = new Array(amount + 1).fill(Infinity)`.",
      "Set `dp[0] = 0`.",
      "For `i` from 1 to `amount`:",
      "  For each coin `c` in `coins`:",
      "    If `i - c >= 0`:",
      "      `dp[i] = Math.min(dp[i], dp[i - c] + 1)`.",
      "Return `dp[amount] === Infinity ? -1 : dp[amount]`."
    ],
    "edgeCases": [
      "`amount === 0`: returns 0 immediately.",
      "Impossible amounts `coins = [2], amount = 3`: returns -1.",
      "Large coin denominations larger than target amount."
    ],
    "timeComplexity": "O(amount * coins.length) - Computes min coin count for each sub-amount.",
    "spaceComplexity": "O(amount) - 1D array of size amount + 1.",
    "code": {
      "JavaScript": "function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (let j = 0; j < coins.length; j++) {\n      const c = coins[j];\n      if (i - c >= 0 && dp[i - c] !== Infinity) {\n        dp[i] = Math.min(dp[i], dp[i - c] + 1);\n      }\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}",
      "TypeScript": "function coinChange(coins: number[], amount: number): number {\n  const dp = new Array<number>(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (let j = 0; j < coins.length; j++) {\n      const c = coins[j];\n      if (i - c >= 0 && dp[i - c] !== Infinity) {\n        dp[i] = Math.min(dp[i], dp[i - c] + 1);\n      }\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}",
      "Python": "def coinChange(coins: list, amount: int) -> int:\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for c in coins:\n            if i - c >= 0 and dp[i - c] != float('inf'):\n                dp[i] = min(dp[i], dp[i - c] + 1)\n    return -1 if dp[amount] == float('inf') else dp[amount]"
    }
  }
};
