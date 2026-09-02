export const solutionsBatch1 = {
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
      "JavaScript": `function twoSum(nums, target) {
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
      "TypeScript": `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      "Python": `def twoSum(nums: list, target: int) -> list:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`
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
      "JavaScript": `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
      "TypeScript": `function reverseList(head: any): any {
  let prev: any = null;
  let curr: any = head;
  while (curr !== null) {
    const nextTemp: any = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
      "Python": `def reverseList(head):
    prev = None
    curr = head
    while curr is not None:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev`
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
      "JavaScript": `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char in map) {
      const top = stack.length === 0 ? '#' : stack.pop();
      if (top !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      "TypeScript": `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char in map) {
      const top = stack.length === 0 ? '#' : stack.pop()!;
      if (top !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      "Python": `def isValid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if top != mapping[char]:
                return False
        else:
            stack.append(char)
    return len(stack) == 0`
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
      "JavaScript": `function inorderTraversal(root) {
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
      "TypeScript": `function inorderTraversal(root: any): number[] {
  const result: number[] = [];
  function traverse(node: any) {
    if (!node) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }
  traverse(root);
  return result;
}`,
      "Python": `def inorderTraversal(root) -> list:
    result = []
    def traverse(node):
        if not node:
            return
        traverse(node.left)
        result.append(node.val)
        traverse(node.right)
    traverse(root)
    return result`
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
      "JavaScript": `function fib(n) {
  if (n <= 1) return n;
  let prev2 = 0, prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
      "TypeScript": `function fib(n: number): number {
  if (n <= 1) return n;
  let prev2 = 0;
  let prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
      "Python": `def fib(n: int) -> int:
    if n <= 1:
        return n
    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        prev2, prev1 = prev1, prev2 + prev1
    return prev1`
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
      "JavaScript": `function lengthOfLongestSubstring(s) {
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
      "TypeScript": `function lengthOfLongestSubstring(s: string): number {
  let maxLength = 0;
  let left = 0;
  const charSet = new Set<string>();
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
      "Python": `def lengthOfLongestSubstring(s: str) -> int:
    char_set = set()
    left = 0
    max_len = 0
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)
    return max_len`
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
      "JavaScript": `function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
      "TypeScript": `function binarySearch(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
      "Python": `def binarySearch(nums: list, target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
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
      "JavaScript": `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
      "TypeScript": `function maxSubArray(nums: number[]): number {
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
      "Python": `def maxSubArray(nums: list) -> int:
    max_sum = nums[0]
    current_sum = nums[0]
    for x in nums[1:]:
        current_sum = max(x, current_sum + x)
        max_sum = max(max_sum, current_sum)
    return max_sum`
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
      "JavaScript": `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
      "TypeScript": `function isPalindrome(s: string): boolean {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
      "Python": `def isPalindrome(s: str) -> bool:
    clean = [c.lower() for c in s if c.isalnum()]
    left, right = 0, len(clean) - 1
    while left < right:
        if clean[left] != clean[right]:
            return False
        left += 1
        right -= 1
    return True`
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
      "JavaScript": `function rotateArray(nums, k) {
  const n = nums.length;
  if (n === 0) return nums;
  k = k % n;
  if (k === 0) return nums;
  return nums.slice(n - k).concat(nums.slice(0, n - k));
}`,
      "TypeScript": `function rotateArray(nums: number[], k: number): number[] {
  const n = nums.length;
  if (n === 0) return nums;
  k = k % n;
  if (k === 0) return nums;
  return nums.slice(n - k).concat(nums.slice(0, n - k));
}`,
      "Python": `def rotateArray(nums: list, k: int) -> list:
    n = len(nums)
    if n == 0:
        return nums
    k = k % n
    if k == 0:
        return nums
    return nums[n - k:] + nums[:n - k]`
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
      "JavaScript": `function containsDuplicate(nums) {
  const seen = new Set();
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(nums[i])) return true;
    seen.add(nums[i]);
  }
  return false;
}`,
      "TypeScript": `function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(nums[i])) return true;
    seen.add(nums[i]);
  }
  return false;
}`,
      "Python": `def containsDuplicate(nums: list) -> bool:
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`
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
      "JavaScript": `function moveZeroes(nums) {
  const result = [...nums];
  let writeIdx = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i] !== 0) {
      result[writeIdx] = result[i];
      writeIdx++;
    }
  }
  while (writeIdx < result.length) {
    result[writeIdx] = 0;
    writeIdx++;
  }
  return result;
}`,
      "TypeScript": `function moveZeroes(nums: number[]): number[] {
  const result = [...nums];
  let writeIdx = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i] !== 0) {
      result[writeIdx] = result[i];
      writeIdx++;
    }
  }
  while (writeIdx < result.length) {
    result[writeIdx] = 0;
    writeIdx++;
  }
  return result;
}`,
      "Python": `def moveZeroes(nums: list) -> list:
    res = list(nums)
    write_idx = 0
    for i in range(len(res)):
        if res[i] != 0:
            res[write_idx] = res[i]
            write_idx += 1
    while write_idx < len(res):
        res[write_idx] = 0
        write_idx += 1
    return res`
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
      "JavaScript": `function productExceptSelf(nums) {
  const n = nums.length;
  const answer = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= suffix;
    suffix *= nums[i];
  }
  return answer;
}`,
      "TypeScript": `function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const answer = new Array<number>(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= suffix;
    suffix *= nums[i];
  }
  return answer;
}`,
      "Python": `def productExceptSelf(nums: list) -> list:
    n = len(nums)
    answer = [1] * n
    prefix = 1
    for i in range(n):
        answer[i] = prefix
        prefix *= nums[i]
    suffix = 1
    for i in range(n - 1, -1, -1):
        answer[i] *= suffix
        suffix *= nums[i]
    return answer`
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
      "JavaScript": `function majorityElement(nums) {
  let candidate = nums[0];
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    if (count === 0) {
      candidate = nums[i];
    }
    count += (nums[i] === candidate) ? 1 : -1;
  }
  return candidate;
}`,
      "TypeScript": `function majorityElement(nums: number[]): number {
  let candidate = nums[0];
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    if (count === 0) {
      candidate = nums[i];
    }
    count += (nums[i] === candidate) ? 1 : -1;
  }
  return candidate;
}`,
      "Python": `def majorityElement(nums: list) -> int:
    candidate = nums[0]
    count = 0
    for num in nums:
        if count == 0:
            candidate = num
        count += 1 if num == candidate else -1
    return candidate`
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
      "JavaScript": `function mergeIntervals(intervals) {
  if (!intervals || intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}`,
      "TypeScript": `function mergeIntervals(intervals: number[][]): number[][] {
  if (!intervals || intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}`,
      "Python": `def mergeIntervals(intervals: list) -> list:
    if not intervals or len(intervals) <= 1:
        return intervals
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current in intervals[1:]:
        last = merged[-1]
        if current[0] <= last[1]:
            last[1] = max(last[1], current[1])
        else:
            merged.append(current)
    return merged`
    }
  }
};
