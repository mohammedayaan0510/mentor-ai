import { PracticeProblem } from './types';

export const ADDITIONAL_PROBLEMS: PracticeProblem[] = [
  // ==========================================
  // ARRAYS (8 problems: prob-10 to prob-17)
  // ==========================================
  {
    id: 'prob-10',
    title: 'Rotate Array to the Right',
    difficulty: 'Medium',
    topic: 'Arrays',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative.\n\nReturn the modified array after performing the rotation.',
    constraints: [
      '1 <= nums.length <= 10^5',
      '-2^31 <= nums[i] <= 2^31 - 1',
      '0 <= k <= 10^5'
    ],
    sampleInput: 'nums = [1,2,3,4,5,6,7], k = 3',
    sampleOutput: '[5,6,7,1,2,3,4]',
    hints: [
      'The rotation amount k can be larger than the array length; use k = k % nums.length.',
      'One clean approach is array reversal: reverse the whole array, then reverse the first k elements, then reverse the rest.',
      'Another approach is slicing the end portion and prepending it.'
    ],
    functionName: 'rotateArray',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function rotateArray(nums, k) {
  // Write your solution here
  
}`,
      TypeScript: `function rotateArray(nums: number[], k: number): number[] {
  // Write your solution here
  return [];
}`,
      Python: `def rotateArray(nums: list, k: int) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function rotateArray(nums, k) {
  const n = nums.length;
  if (n === 0) return nums;
  k = k % n;
  if (k === 0) return nums;
  const rotated = nums.slice(n - k).concat(nums.slice(0, n - k));
  return rotated;
}`,
    testCases: [
      { input: '[1,2,3,4,5,6,7], 3', expected: '[5,6,7,1,2,3,4]' },
      { input: '[-1,-100,3,99], 2', expected: '[3,99,-1,-100]' },
      { input: '[1,2], 3', expected: '[2,1]' },
      { input: '[1], 0', expected: '[1]' }
    ]
  },
  {
    id: 'prob-11',
    title: 'Contains Duplicate Elements',
    difficulty: 'Easy',
    topic: 'Arrays',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.',
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9'
    ],
    sampleInput: 'nums = [1,2,3,1]',
    sampleOutput: 'true',
    hints: [
      'A brute force nested loop takes O(n^2) time.',
      'Using a Hash Set allows you to check for duplicates in O(1) time per element.',
      'Compare the size of the set with the length of the array.'
    ],
    functionName: 'containsDuplicate',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
function containsDuplicate(nums) {
  // Write your solution here
  
}`,
      TypeScript: `function containsDuplicate(nums: number[]): boolean {
  // Write your solution here
  return false;
}`,
      Python: `def containsDuplicate(nums: list) -> bool:
    # Write your solution here
    pass`
    },
    solutionCode: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}`,
    testCases: [
      { input: '[1,2,3,1]', expected: 'true' },
      { input: '[1,2,3,4]', expected: 'false' },
      { input: '[1,1,1,3,3,4,3,2,4,2]', expected: 'true' },
      { input: '[42]', expected: 'false' }
    ]
  },
  {
    id: 'prob-12',
    title: 'Move Zeroes to End',
    difficulty: 'Easy',
    topic: 'Arrays',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an integer array `nums`, move all `0`\'s to the end of it while maintaining the relative order of the non-zero elements.\n\nReturn the modified array with zeroes shifted to the end.',
    constraints: [
      '1 <= nums.length <= 10^4',
      '-2^31 <= nums[i] <= 2^31 - 1'
    ],
    sampleInput: 'nums = [0,1,0,3,12]',
    sampleOutput: '[1,3,12,0,0]',
    hints: [
      'Use a two-pointer approach: one pointer for tracking the position of the next non-zero element.',
      'Iterate through the array and whenever you see a non-zero element, place it at the write pointer index.',
      'Fill remaining positions with zeroes.'
    ],
    functionName: 'moveZeroes',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function moveZeroes(nums) {
  // Write your solution here
  
}`,
      TypeScript: `function moveZeroes(nums: number[]): number[] {
  // Write your solution here
  return [];
}`,
      Python: `def moveZeroes(nums: list) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function moveZeroes(nums) {
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
    testCases: [
      { input: '[0,1,0,3,12]', expected: '[1,3,12,0,0]' },
      { input: '[0]', expected: '[0]' },
      { input: '[4,5,6]', expected: '[4,5,6]' },
      { input: '[0,0,1]', expected: '[1,0,0]' }
    ]
  },
  {
    id: 'prob-13',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    topic: 'Arrays',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nYou must write an algorithm that runs in `O(n)` time and without using the division operation.',
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30',
      'The product of any prefix or suffix of nums fits in a 32-bit integer.'
    ],
    sampleInput: 'nums = [1,2,3,4]',
    sampleOutput: '[24,12,8,6]',
    hints: [
      'Think about using prefix and suffix products.',
      'Construct a prefix array where prefix[i] is the product of all elements to the left of index i.',
      'Multiply with suffix products accumulated from right to left.'
    ],
    functionName: 'productExceptSelf',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function productExceptSelf(nums) {
  // Write your solution here
  
}`,
      TypeScript: `function productExceptSelf(nums: number[]): number[] {
  // Write your solution here
  return [];
}`,
      Python: `def productExceptSelf(nums: list) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }
  return result;
}`,
    testCases: [
      { input: '[1,2,3,4]', expected: '[24,12,8,6]' },
      { input: '[-1,1,0,-3,3]', expected: '[0,0,9,0,0]' },
      { input: '[2,3]', expected: '[3,2]' }
    ]
  },
  {
    id: 'prob-14',
    title: 'Majority Element Frequency',
    difficulty: 'Easy',
    topic: 'Arrays',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an array `nums` of size `n`, return the majority element.\n\nThe majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.',
    constraints: [
      '1 <= nums.length <= 5 * 10^4',
      '-10^9 <= nums[i] <= 10^9'
    ],
    sampleInput: 'nums = [3,2,3]',
    sampleOutput: '3',
    hints: [
      'A hash map counting frequencies takes O(n) space.',
      'Can you solve it in O(n) time and O(1) space using the Boyer-Moore Voting Algorithm?',
      'Maintain a candidate and a counter. Increment counter when seeing candidate, decrement otherwise.'
    ],
    functionName: 'majorityElement',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function majorityElement(nums) {
  // Write your solution here
  
}`,
      TypeScript: `function majorityElement(nums: number[]): number {
  // Write your solution here
  return 0;
}`,
      Python: `def majorityElement(nums: list) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function majorityElement(nums) {
  let count = 0;
  let candidate = null;
  for (const num of nums) {
    if (count === 0) candidate = num;
    count += (num === candidate) ? 1 : -1;
  }
  return candidate;
}`,
    testCases: [
      { input: '[3,2,3]', expected: '3' },
      { input: '[2,2,1,1,1,2,2]', expected: '2' },
      { input: '[6]', expected: '6' }
    ]
  },
  {
    id: 'prob-15',
    title: 'Merge Sorted Intervals',
    difficulty: 'Medium',
    topic: 'Arrays',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an array of intervals where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= start_i <= end_i <= 10^4'
    ],
    sampleInput: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
    sampleOutput: '[[1,6],[8,10],[15,18]]',
    hints: [
      'Sorting the intervals by their start times makes it easy to detect overlaps sequentially.',
      'Iterate through the sorted intervals. If the current interval overlaps with the previous merged one, update the end time.',
      'Otherwise, push the current interval as a new separate entry.'
    ],
    functionName: 'mergeIntervals',
    starterCode: {
      JavaScript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function mergeIntervals(intervals) {
  // Write your solution here
  
}`,
      TypeScript: `function mergeIntervals(intervals: number[][]): number[][] {
  // Write your solution here
  return [];
}`,
      Python: `def mergeIntervals(intervals: list) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  const sorted = intervals.slice().sort((a, b) => a[0] - b[0]);
  const merged = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const lastMerged = merged[merged.length - 1];
    if (current[0] <= lastMerged[1]) {
      lastMerged[1] = Math.max(lastMerged[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}`,
    testCases: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expected: '[[1,6],[8,10],[15,18]]' },
      { input: '[[1,4],[4,5]]', expected: '[[1,5]]' },
      { input: '[[1,4],[0,4]]', expected: '[[0,4]]' },
      { input: '[[6,8]]', expected: '[[6,8]]' }
    ]
  },
  {
    id: 'prob-16',
    title: 'Find Missing Number in Sequence',
    difficulty: 'Easy',
    topic: 'Arrays',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.',
    constraints: [
      'n == nums.length',
      '1 <= n <= 10^4',
      '0 <= nums[i] <= n',
      'All the numbers of nums are unique.'
    ],
    sampleInput: 'nums = [3,0,1]',
    sampleOutput: '2',
    hints: [
      'Gauss summation formula: sum of numbers from 0 to n is n * (n + 1) / 2.',
      'Subtracting the sum of all elements in nums from the expected Gauss sum gives the missing number.',
      'Alternatively, XOR all indices and elements together.'
    ],
    functionName: 'findMissingNumber',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function findMissingNumber(nums) {
  // Write your solution here
  
}`,
      TypeScript: `function findMissingNumber(nums: number[]): number {
  // Write your solution here
  return 0;
}`,
      Python: `def findMissingNumber(nums: list) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function findMissingNumber(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((acc, curr) => acc + curr, 0);
  return expectedSum - actualSum;
}`,
    testCases: [
      { input: '[3,0,1]', expected: '2' },
      { input: '[0,1]', expected: '2' },
      { input: '[9,6,4,2,3,5,7,0,1]', expected: '8' },
      { input: '[0]', expected: '1' }
    ]
  },
  {
    id: 'prob-17',
    title: 'First Missing Positive Integer',
    difficulty: 'Hard',
    topic: 'Arrays',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an unsorted integer array `nums`, return the smallest positive integer that is not present in `nums`.\n\nYou must implement an algorithm that runs in `O(n)` time and uses `O(1)` auxiliary space.',
    constraints: [
      '1 <= nums.length <= 10^5',
      '-2^31 <= nums[i] <= 2^31 - 1'
    ],
    sampleInput: 'nums = [1,2,0]',
    sampleOutput: '3',
    hints: [
      'The answer must be an integer between 1 and n + 1 where n is the length of nums.',
      'Use index-placement (cyclic sort): place each number x at index x - 1 if 1 <= x <= n.',
      'After placement, the first index i where nums[i] !== i + 1 corresponds to missing integer i + 1.'
    ],
    functionName: 'firstMissingPositive',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function firstMissingPositive(nums) {
  // Write your solution here
  
}`,
      TypeScript: `function firstMissingPositive(nums: number[]): number {
  // Write your solution here
  return 1;
}`,
      Python: `def firstMissingPositive(nums: list) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const targetIdx = nums[i] - 1;
      const temp = nums[i];
      nums[i] = nums[targetIdx];
      nums[targetIdx] = temp;
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
}`,
    testCases: [
      { input: '[1,2,0]', expected: '3' },
      { input: '[3,4,-1,1]', expected: '2' },
      { input: '[7,8,9,11,12]', expected: '1' },
      { input: '[1]', expected: '2' }
    ]
  },

  // ==========================================
  // STRINGS (6 problems: prob-18 to prob-23)
  // ==========================================
  {
    id: 'prob-18',
    title: 'Valid Anagram Check',
    difficulty: 'Easy',
    topic: 'Strings',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn **Anagram** is a word formed by rearranging the letters of a different word, using all the original letters exactly once.',
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.'
    ],
    sampleInput: 's = "anagram", t = "nagaram"',
    sampleOutput: 'true',
    hints: [
      'If string lengths differ, they cannot be anagrams.',
      'Count character frequencies of s and decrement with characters in t.',
      'If all frequency counts return to zero, the strings are valid anagrams.'
    ],
    functionName: 'isAnagram',
    starterCode: {
      JavaScript: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
function isAnagram(s, t) {
  // Write your solution here
  
}`,
      TypeScript: `function isAnagram(s: string, t: string): boolean {
  // Write your solution here
  return false;
}`,
      Python: `def isAnagram(s: str, t: str) -> bool:
    # Write your solution here
    pass`
    },
    solutionCode: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const counts = {};
  for (const ch of s) counts[ch] = (counts[ch] || 0) + 1;
  for (const ch of t) {
    if (!counts[ch]) return false;
    counts[ch]--;
  }
  return true;
}`,
    testCases: [
      { input: '"anagram", "nagaram"', expected: 'true' },
      { input: '"rat", "car"', expected: 'false' },
      { input: '"a", "a"', expected: 'true' },
      { input: '"ab", "a"', expected: 'false' }
    ]
  },
  {
    id: 'prob-19',
    title: 'Reverse Words in a Sentence',
    difficulty: 'Medium',
    topic: 'Strings',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an input string `s`, reverse the order of the **words**.\n\nA **word** is defined as a sequence of non-space characters. The words in `s` will be separated by at least one space.\n\nReturn a string of the words in reverse order concatenated by a single space, without leading or trailing spaces.',
    constraints: [
      '1 <= s.length <= 10^4',
      's contains English letters (upper-case and lower-case), digits, and spaces \' \'.'
    ],
    sampleInput: 's = "the sky is blue"',
    sampleOutput: '"blue is sky the"',
    hints: [
      'Split the string by spaces, filter out empty tokens, and reverse the array of words.',
      'Join the reversed words array with a single whitespace delimiter.'
    ],
    functionName: 'reverseWords',
    starterCode: {
      JavaScript: `/**
 * @param {string} s
 * @return {string}
 */
function reverseWords(s) {
  // Write your solution here
  
}`,
      TypeScript: `function reverseWords(s: string): string {
  // Write your solution here
  return "";
}`,
      Python: `def reverseWords(s: str) -> str:
    # Write your solution here
    pass`
    },
    solutionCode: `function reverseWords(s) {
  return s.trim().split(/\\s+/).reverse().join(' ');
}`,
    testCases: [
      { input: '"the sky is blue"', expected: '"blue is sky the"' },
      { input: '"  hello world  "', expected: '"world hello"' },
      { input: '"a good   example"', expected: '"example good a"' }
    ]
  },
  {
    id: 'prob-20',
    title: 'Longest Common Prefix',
    difficulty: 'Easy',
    topic: 'Strings',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Write a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string `""`.',
    constraints: [
      '1 <= strs.length <= 200',
      '0 <= strs[i].length <= 200',
      'strs[i] consists of only lowercase English letters.'
    ],
    sampleInput: 'strs = ["flower","flow","flight"]',
    sampleOutput: '"fl"',
    hints: [
      'Take the first string as the benchmark prefix candidate.',
      'Iterate through the remaining strings and shorten prefix until str.startsWith(prefix) is true.',
      'If prefix becomes empty, return immediately.'
    ],
    functionName: 'longestCommonPrefix',
    starterCode: {
      JavaScript: `/**
 * @param {string[]} strs
 * @return {string}
 */
function longestCommonPrefix(strs) {
  // Write your solution here
  
}`,
      TypeScript: `function longestCommonPrefix(strs: string[]): string {
  // Write your solution here
  return "";
}`,
      Python: `def longestCommonPrefix(strs: list) -> str:
    # Write your solution here
    pass`
    },
    solutionCode: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
  }
  return prefix;
}`,
    testCases: [
      { input: '["flower","flow","flight"]', expected: '"fl"' },
      { input: '["dog","racecar","car"]', expected: '""' },
      { input: '["interspecies","interstellar","interstate"]', expected: '"inters"' },
      { input: '["single"]', expected: '"single"' }
    ]
  },
  {
    id: 'prob-21',
    title: 'Group Anagrams by Pattern',
    difficulty: 'Medium',
    topic: 'Strings',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an array of strings `strs`, group the **anagrams** together. You can return the answer in any order.\n\nAll strings consist of lowercase English letters.',
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100'
    ],
    sampleInput: 'strs = ["eat","tea","tan","ate","nat","bat"]',
    sampleOutput: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
    hints: [
      'Strings that are anagrams share the same sorted character sequence or character frequency count.',
      'Use the sorted string as a key in a hash map mapping to an array of original strings.',
      'Return the values of the map.'
    ],
    functionName: 'groupAnagrams',
    starterCode: {
      JavaScript: `/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function groupAnagrams(strs) {
  // Write your solution here
  
}`,
      TypeScript: `function groupAnagrams(strs: string[]): string[][] {
  // Write your solution here
  return [];
}`,
      Python: `def groupAnagrams(strs: list) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return Array.from(map.values());
}`,
    testCases: [
      { input: '["eat","tea","tan","ate","nat","bat"]', expected: '[["eat","tea","ate"],["tan","nat"],["bat"]]' },
      { input: '[""]', expected: '[[""]]' },
      { input: '["a"]', expected: '[["a"]]' }
    ]
  },
  {
    id: 'prob-22',
    title: 'String Compression with Counts',
    difficulty: 'Easy',
    topic: 'Strings',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Implement a basic string compression method using the counts of repeated characters. For example, the string `"aabcccccaaa"` becomes `"a2b1c5a3"`.\n\nIf the "compressed" string would not become smaller than the original string, your method should return the original string.',
    constraints: [
      '0 <= s.length <= 10^4',
      's consists of uppercase and lowercase letters.'
    ],
    sampleInput: 's = "aabcccccaaa"',
    sampleOutput: '"a2b1c5a3"',
    hints: [
      'Iterate through the string while keeping track of the current character and its run length.',
      'When the next character is different, append character and count to the compressed buffer.',
      'Compare length of compressed string against original string.'
    ],
    functionName: 'compressString',
    starterCode: {
      JavaScript: `/**
 * @param {string} s
 * @return {string}
 */
function compressString(s) {
  // Write your solution here
  
}`,
      TypeScript: `function compressString(s: string): string {
  // Write your solution here
  return s;
}`,
      Python: `def compressString(s: str) -> str:
    # Write your solution here
    pass`
    },
    solutionCode: `function compressString(s) {
  if (s.length <= 2) return s;
  let compressed = '';
  let count = 1;
  for (let i = 0; i < s.length; i++) {
    if (i + 1 < s.length && s[i] === s[i + 1]) {
      count++;
    } else {
      compressed += s[i] + count;
      count = 1;
    }
  }
  return compressed.length < s.length ? compressed : s;
}`,
    testCases: [
      { input: '"aabcccccaaa"', expected: '"a2b1c5a3"' },
      { input: '"abcdef"', expected: '"abcdef"' },
      { input: '"aaaaaa"', expected: '"a6"' },
      { input: '""', expected: '""' }
    ]
  },
  {
    id: 'prob-23',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    topic: 'Strings',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given a string `s`, return the longest palindromic substring in `s`.',
    constraints: [
      '1 <= s.length <= 1000',
      's consist of only digits and English letters.'
    ],
    sampleInput: 's = "babad"',
    sampleOutput: '"bab"',
    hints: [
      'A palindrome mirrors around its center. A string of length n has 2n - 1 possible centers.',
      'Expand outward from each character (odd length) and between characters (even length).',
      'Track the longest start and end coordinates discovered.'
    ],
    functionName: 'longestPalindrome',
    starterCode: {
      JavaScript: `/**
 * @param {string} s
 * @return {string}
 */
function longestPalindrome(s) {
  // Write your solution here
  
}`,
      TypeScript: `function longestPalindrome(s: string): string {
  // Write your solution here
  return "";
}`,
      Python: `def longestPalindrome(s: str) -> str:
    # Write your solution here
    pass`
    },
    solutionCode: `function longestPalindrome(s) {
  if (!s || s.length <= 1) return s;
  let start = 0, maxLen = 1;
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      const len = right - left + 1;
      if (len > maxLen) {
        maxLen = len;
        start = left;
      }
      left--;
      right++;
    }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.substring(start, start + maxLen);
}`,
    testCases: [
      { input: '"babad"', expected: '"bab"' },
      { input: '"cbbd"', expected: '"bb"' },
      { input: '"a"', expected: '"a"' },
      { input: '"racecar"', expected: '"racecar"' }
    ]
  },

  // ==========================================
  // HASH MAPS (5 problems: prob-24 to prob-28)
  // ==========================================
  {
    id: 'prob-24',
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    topic: 'Hash Maps',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.\n\nA subarray is a contiguous non-empty sequence of elements within an array.',
    constraints: [
      '1 <= nums.length <= 2 * 10^4',
      '-1000 <= nums[i] <= 1000',
      '-10^7 <= k <= 10^7'
    ],
    sampleInput: 'nums = [1,1,1], k = 2',
    sampleOutput: '2',
    hints: [
      'Use prefix sums. If prefixSum[j] - prefixSum[i] = k, then the subarray from i to j sums to k.',
      'Maintain a hash map storing the frequency of prefix sums encountered so far.',
      'Initialize map with {0: 1} to account for subarrays starting at index 0.'
    ],
    functionName: 'subarraySum',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function subarraySum(nums, k) {
  // Write your solution here
  
}`,
      TypeScript: `function subarraySum(nums: number[], k: number): number {
  // Write your solution here
  return 0;
}`,
      Python: `def subarraySum(nums: list, k: int) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function subarraySum(nums, k) {
  let count = 0;
  let currentSum = 0;
  const map = new Map();
  map.set(0, 1);
  for (const num of nums) {
    currentSum += num;
    if (map.has(currentSum - k)) {
      count += map.get(currentSum - k);
    }
    map.set(currentSum, (map.get(currentSum) || 0) + 1);
  }
  return count;
}`,
    testCases: [
      { input: '[1,1,1], 2', expected: '2' },
      { input: '[1,2,3], 3', expected: '2' },
      { input: '[1,-1,0], 0', expected: '3' }
    ]
  },
  {
    id: 'prob-25',
    title: 'First Unique Character Index',
    difficulty: 'Easy',
    topic: 'Hash Maps',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return `-1`.',
    constraints: [
      '1 <= s.length <= 10^5',
      's consists of only lowercase English letters.'
    ],
    sampleInput: 's = "leetcode"',
    sampleOutput: '0',
    hints: [
      'First pass: count the frequency of each character in a map.',
      'Second pass: scan the string left-to-right and return the index of the first character with frequency 1.'
    ],
    functionName: 'firstUniqChar',
    starterCode: {
      JavaScript: `/**
 * @param {string} s
 * @return {number}
 */
function firstUniqChar(s) {
  // Write your solution here
  
}`,
      TypeScript: `function firstUniqChar(s: string): number {
  // Write your solution here
  return -1;
}`,
      Python: `def firstUniqChar(s: str) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function firstUniqChar(s) {
  const counts = new Map();
  for (const ch of s) counts.set(ch, (counts.get(ch) || 0) + 1);
  for (let i = 0; i < s.length; i++) {
    if (counts.get(s[i]) === 1) return i;
  }
  return -1;
}`,
    testCases: [
      { input: '"leetcode"', expected: '0' },
      { input: '"loveleetcode"', expected: '2' },
      { input: '"aabb"', expected: '-1' }
    ]
  },
  {
    id: 'prob-26',
    title: 'Intersection of Two Arrays',
    difficulty: 'Easy',
    topic: 'Hash Maps',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must be unique and you may return the result in sorted ascending order.',
    constraints: [
      '1 <= nums1.length, nums2.length <= 1000',
      '0 <= nums1[i], nums2[i] <= 1000'
    ],
    sampleInput: 'nums1 = [1,2,2,1], nums2 = [2,2]',
    sampleOutput: '[2]',
    hints: [
      'Convert nums1 into a Set for O(1) membership lookups.',
      'Iterate over nums2 and collect elements present in the set into a resultSet.',
      'Convert result set to sorted array.'
    ],
    functionName: 'intersection',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
function intersection(nums1, nums2) {
  // Write your solution here
  
}`,
      TypeScript: `function intersection(nums1: number[], nums2: number[]): number[] {
  // Write your solution here
  return [];
}`,
      Python: `def intersection(nums1: list, nums2: list) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function intersection(nums1, nums2) {
  const set1 = new Set(nums1);
  const result = new Set();
  for (const n of nums2) {
    if (set1.has(n)) result.add(n);
  }
  return Array.from(result).sort((a, b) => a - b);
}`,
    testCases: [
      { input: '[1,2,2,1], [2,2]', expected: '[2]' },
      { input: '[4,9,5], [9,4,9,8,4]', expected: '[4,9]' },
      { input: '[1,2,3], [4,5,6]', expected: '[]' }
    ]
  },
  {
    id: 'prob-27',
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    topic: 'Hash Maps',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in `O(n)` time.',
    constraints: [
      '0 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9'
    ],
    sampleInput: 'nums = [100,4,200,1,3,2]',
    sampleOutput: '4',
    hints: [
      'Insert all numbers into a Hash Set.',
      'Only start counting a sequence if num - 1 is NOT in the set (indicating num is the start of a streak).',
      'Count consecutive numbers (num + 1, num + 2...) while present in the set.'
    ],
    functionName: 'longestConsecutive',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function longestConsecutive(nums) {
  // Write your solution here
  
}`,
      TypeScript: `function longestConsecutive(nums: number[]): number {
  // Write your solution here
  return 0;
}`,
      Python: `def longestConsecutive(nums: list) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function longestConsecutive(nums) {
  if (!nums.length) return 0;
  const numSet = new Set(nums);
  let maxStreak = 0;
  for (const num of numSet) {
    if (!numSet.has(num - 1)) {
      let currentNum = num;
      let currentStreak = 1;
      while (numSet.has(currentNum + 1)) {
        currentNum += 1;
        currentStreak += 1;
      }
      maxStreak = Math.max(maxStreak, currentStreak);
    }
  }
  return maxStreak;
}`,
    testCases: [
      { input: '[100,4,200,1,3,2]', expected: '4' },
      { input: '[0,3,7,2,5,8,4,6,0,1]', expected: '9' },
      { input: '[]', expected: '0' },
      { input: '[10]', expected: '1' }
    ]
  },
  {
    id: 'prob-28',
    title: 'LRU Cache Simulation',
    difficulty: 'Hard',
    topic: 'Hash Maps',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Simulate a Least Recently Used (LRU) cache with a given capacity and a list of operations.\n\nOperations are given as an array where:\n- `["PUT", key, value]` inserts or updates key.\n- `["GET", key]` returns value or `-1` if not found.\n\nReturn the list of return values for all `"GET"` operations.',
    constraints: [
      '1 <= capacity <= 3000',
      '1 <= operations.length <= 10^4',
      '0 <= key, value <= 10^5'
    ],
    sampleInput: 'capacity = 2, operations = [["PUT",1,1],["PUT",2,2],["GET",1],["PUT",3,3],["GET",2],["PUT",4,4],["GET",1],["GET",3],["GET",4]]',
    sampleOutput: '[1,-1,-1,3,4]',
    hints: [
      'In JavaScript, the Map object remembers insertion order.',
      'To mark an entry as recently used, delete it and re-insert it in the Map.',
      'When capacity is exceeded, map.keys().next().value gives the oldest key.'
    ],
    functionName: 'simulateLRUCache',
    starterCode: {
      JavaScript: `/**
 * @param {number} capacity
 * @param {any[][]} operations
 * @return {number[]}
 */
function simulateLRUCache(capacity, operations) {
  // Write your solution here
  
}`,
      TypeScript: `function simulateLRUCache(capacity: number, operations: any[][]): number[] {
  // Write your solution here
  return [];
}`,
      Python: `def simulateLRUCache(capacity: int, operations: list) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function simulateLRUCache(capacity, operations) {
  const cache = new Map();
  const results = [];
  for (const op of operations) {
    const type = op[0];
    if (type === 'GET') {
      const key = op[1];
      if (!cache.has(key)) {
        results.push(-1);
      } else {
        const val = cache.get(key);
        cache.delete(key);
        cache.set(key, val);
        results.push(val);
      }
    } else if (type === 'PUT') {
      const key = op[1];
      const val = op[2];
      if (cache.has(key)) {
        cache.delete(key);
      } else if (cache.size >= capacity) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
      }
      cache.set(key, val);
    }
  }
  return results;
}`,
    testCases: [
      { 
        input: '2, [["PUT",1,1],["PUT",2,2],["GET",1],["PUT",3,3],["GET",2],["PUT",4,4],["GET",1],["GET",3],["GET",4]]', 
        expected: '[1,-1,-1,3,4]' 
      },
      { 
        input: '1, [["PUT",2,1],["GET",2],["PUT",3,2],["GET",2],["GET",3]]', 
        expected: '[1,-1,2]' 
      }
    ]
  },

  // ==========================================
  // TWO POINTERS (4 problems: prob-29 to prob-32)
  // ==========================================
  {
    id: 'prob-29',
    title: 'Two Sum II - Sorted Input',
    difficulty: 'Easy',
    topic: 'Two Pointers',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number.\n\nReturn the indices of the two numbers, `[index1, index2]`, as an integer array of length 2, where `1 <= index1 < index2 <= numbers.length`.',
    constraints: [
      '2 <= numbers.length <= 3 * 10^4',
      '-1000 <= numbers[i] <= 1000',
      'numbers is sorted in non-decreasing order.',
      '-1000 <= target <= 1000',
      'The tests are generated such that there is exactly one solution.'
    ],
    sampleInput: 'numbers = [2,7,11,15], target = 9',
    sampleOutput: '[1,2]',
    hints: [
      'Because the array is sorted, we can use two pointers: left at start, right at end.',
      'If sum < target, increment left pointer.',
      'If sum > target, decrement right pointer.'
    ],
    functionName: 'twoSumSorted',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
function twoSumSorted(numbers, target) {
  // Write your solution here
  
}`,
      TypeScript: `function twoSumSorted(numbers: number[], target: number): number[] {
  // Write your solution here
  return [];
}`,
      Python: `def twoSumSorted(numbers: list, target: int) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function twoSumSorted(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
    testCases: [
      { input: '[2,7,11,15], 9', expected: '[1,2]' },
      { input: '[2,3,4], 6', expected: '[1,3]' },
      { input: '[-1,0], -1', expected: '[1,2]' }
    ]
  },
  {
    id: 'prob-30',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    topic: 'Two Pointers',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    sampleInput: 'height = [1,8,6,2,5,4,8,3,7]',
    sampleOutput: '49',
    hints: [
      'The area between lines at i and j is min(height[i], height[j]) * (j - i).',
      'Start with the widest container: left = 0, right = height.length - 1.',
      'Always move the pointer pointing to the shorter line inward.'
    ],
    functionName: 'maxArea',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
  // Write your solution here
  
}`,
      TypeScript: `function maxArea(height: number[]): number {
  // Write your solution here
  return 0;
}`,
      Python: `def maxArea(height: list) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function maxArea(height) {
  let left = 0, right = height.length - 1;
  let max = 0;
  while (left < right) {
    const w = right - left;
    const h = Math.min(height[left], height[right]);
    max = Math.max(max, w * h);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return max;
}`,
    testCases: [
      { input: '[1,8,6,2,5,4,8,3,7]', expected: '49' },
      { input: '[1,1]', expected: '1' },
      { input: '[4,3,2,1,4]', expected: '16' }
    ]
  },
  {
    id: 'prob-31',
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    topic: 'Two Pointers',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements `k`.',
    constraints: [
      '1 <= nums.length <= 3 * 10^4',
      '-100 <= nums[i] <= 100',
      'nums is sorted in non-decreasing order.'
    ],
    sampleInput: 'nums = [1,1,2]',
    sampleOutput: '2',
    hints: [
      'Maintain a slow write-pointer starting at index 1.',
      'Fast pointer scans from index 1. When nums[fast] !== nums[fast - 1], copy nums[fast] to nums[slow] and increment slow.',
      'Return slow count.'
    ],
    functionName: 'removeDuplicates',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function removeDuplicates(nums) {
  // Write your solution here
  
}`,
      TypeScript: `function removeDuplicates(nums: number[]): number {
  // Write your solution here
  return 0;
}`,
      Python: `def removeDuplicates(nums: list) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let slow = 1;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[fast - 1]) {
      nums[slow] = nums[fast];
      slow++;
    }
  }
  return slow;
}`,
    testCases: [
      { input: '[1,1,2]', expected: '2' },
      { input: '[0,0,1,1,1,2,2,3,3,4]', expected: '5' },
      { input: '[1]', expected: '1' }
    ]
  },
  {
    id: 'prob-32',
    title: '3Sum to Zero',
    difficulty: 'Medium',
    topic: 'Two Pointers',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an integer array `nums`, return all the unique triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.',
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5'
    ],
    sampleInput: 'nums = [-1,0,1,2,-1,-4]',
    sampleOutput: '[[-1,-1,2],[-1,0,1]]',
    hints: [
      'Sort the array first.',
      'Fix one number nums[i] and use two pointers (left and right) for the remaining two elements.',
      'Skip duplicate values to avoid duplicate triplets in output.'
    ],
    functionName: 'threeSum',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  // Write your solution here
  
}`,
      TypeScript: `function threeSum(nums: number[]): number[][] {
  // Write your solution here
  return [];
}`,
      Python: `def threeSum(nums: list) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}`,
    testCases: [
      { input: '[-1,0,1,2,-1,-4]', expected: '[[-1,-1,2],[-1,0,1]]' },
      { input: '[0,1,1]', expected: '[]' },
      { input: '[0,0,0]', expected: '[[0,0,0]]' }
    ]
  },

  // ==========================================
  // SLIDING WINDOW (4 problems: prob-33 to prob-36)
  // ==========================================
  {
    id: 'prob-33',
    title: 'Minimum Size Subarray Sum',
    difficulty: 'Medium',
    topic: 'Sliding Window',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a contiguous subarray of which the sum is greater than or equal to `target`. If there is no such subarray, return `0` instead.',
    constraints: [
      '1 <= target <= 10^9',
      '1 <= nums.length <= 10^5',
      '1 <= nums[i] <= 10^4'
    ],
    sampleInput: 'target = 7, nums = [2,3,1,2,4,3]',
    sampleOutput: '2',
    hints: [
      'Maintain a sliding window sum with left and right pointers.',
      'Expand the window by adding nums[right].',
      'While the sum is >= target, record window length and shrink from left.'
    ],
    functionName: 'minSubArrayLen',
    starterCode: {
      JavaScript: `/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
function minSubArrayLen(target, nums) {
  // Write your solution here
  
}`,
      TypeScript: `function minSubArrayLen(target: number, nums: number[]): number {
  // Write your solution here
  return 0;
}`,
      Python: `def minSubArrayLen(target: int, nums: list) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function minSubArrayLen(target, nums) {
  let minLen = Infinity;
  let left = 0;
  let sum = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      sum -= nums[left];
      left++;
    }
  }
  return minLen === Infinity ? 0 : minLen;
}`,
    testCases: [
      { input: '7, [2,3,1,2,4,3]', expected: '2' },
      { input: '4, [1,4,4]', expected: '1' },
      { input: '11, [1,1,1,1,1,1,1,1]', expected: '0' }
    ]
  },
  {
    id: 'prob-34',
    title: 'Max Consecutive Ones with K Flips',
    difficulty: 'Medium',
    topic: 'Sliding Window',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given a binary array `nums` and an integer `k`, return the maximum number of consecutive `1`\'s in the array if you can flip at most `k` `0`\'s.',
    constraints: [
      '1 <= nums.length <= 10^5',
      'nums[i] is either 0 or 1.',
      '0 <= k <= nums.length'
    ],
    sampleInput: 'nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2',
    sampleOutput: '6',
    hints: [
      'Translate problem: find the longest subarray containing at most k zeros.',
      'Maintain count of zeroes in current window [left, right].',
      'When zero count exceeds k, increment left pointer.'
    ],
    functionName: 'longestOnes',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function longestOnes(nums, k) {
  // Write your solution here
  
}`,
      TypeScript: `function longestOnes(nums: number[], k: number): number {
  // Write your solution here
  return 0;
}`,
      Python: `def longestOnes(nums: list, k: int) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function longestOnes(nums, k) {
  let left = 0, maxLen = 0, zeroCount = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeroCount++;
    while (zeroCount > k) {
      if (nums[left] === 0) zeroCount--;
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    testCases: [
      { input: '[1,1,1,0,0,0,1,1,1,1,0], 2', expected: '6' },
      { input: '[0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], 3', expected: '10' },
      { input: '[1,1,1]', expected: '3' }
    ]
  },
  {
    id: 'prob-35',
    title: 'Maximum Average Subarray I',
    difficulty: 'Easy',
    topic: 'Sliding Window',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'You are given an integer array `nums` consisting of `n` elements, and an integer `k`.\n\nFind a contiguous subarray whose length is equal to `k` that has the maximum average value and return this value.',
    constraints: [
      'n == nums.length',
      '1 <= k <= n <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    sampleInput: 'nums = [1,12,-5,-6,50,3], k = 4',
    sampleOutput: '12.75',
    hints: [
      'Compute the sum of the first k elements.',
      'Slide the window of size k from left to right: add nums[i] and subtract nums[i - k].',
      'Track maximum sum and divide by k at the end.'
    ],
    functionName: 'findMaxAverage',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function findMaxAverage(nums, k) {
  // Write your solution here
  
}`,
      TypeScript: `function findMaxAverage(nums: number[], k: number): number {
  // Write your solution here
  return 0;
}`,
      Python: `def findMaxAverage(nums: list, k: int) -> float:
    # Write your solution here
    pass`
    },
    solutionCode: `function findMaxAverage(nums, k) {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  let maxSum = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum / k;
}`,
    testCases: [
      { input: '[1,12,-5,-6,50,3], 4', expected: '12.75' },
      { input: '[5], 1', expected: '5' },
      { input: '[0,4,0,3,2], 1', expected: '4' }
    ]
  },
  {
    id: 'prob-36',
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    topic: 'Sliding Window',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window array.',
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      '1 <= k <= nums.length'
    ],
    sampleInput: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
    sampleOutput: '[3,3,5,5,6,7]',
    hints: [
      'A monotonic decreasing deque stores indices of potential maximums.',
      'Pop elements from the back of deque if they are smaller than current element nums[i].',
      'Remove front index if it has fallen out of the window (index <= i - k).'
    ],
    functionName: 'maxSlidingWindow',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function maxSlidingWindow(nums, k) {
  // Write your solution here
  
}`,
      TypeScript: `function maxSlidingWindow(nums: number[], k: number): number[] {
  // Write your solution here
  return [];
}`,
      Python: `def maxSlidingWindow(nums: list, k: int) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function maxSlidingWindow(nums, k) {
  const deque = [];
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] <= i - k) deque.shift();
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}`,
    testCases: [
      { input: '[1,3,-1,-3,5,3,6,7], 3', expected: '[3,3,5,5,6,7]' },
      { input: '[1], 1', expected: '[1]' },
      { input: '[9,11], 2', expected: '[11]' }
    ]
  },

  // ==========================================
  // STACK / QUEUE (4 problems: prob-37 to prob-40)
  // ==========================================
  {
    id: 'prob-37',
    title: 'Min Stack Design',
    difficulty: 'Medium',
    topic: 'Stacks',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time `O(1)`.\n\nSimulate operations given as an array of commands where commands are:\n- `["PUSH", val]`\n- `["POP"]`\n- `["TOP"]`\n- `["GET_MIN"]`\n\nReturn the outputs of all `"TOP"` and `"GET_MIN"` commands in sequence.',
    constraints: [
      '1 <= operations.length <= 3 * 10^4',
      '-2^31 <= val <= 2^31 - 1',
      'Methods pop, top and getMin will always be called on non-empty stacks.'
    ],
    sampleInput: 'operations = [["PUSH",-2],["PUSH",0],["PUSH",-3],["GET_MIN"],["POP"],["TOP"],["GET_MIN"]]',
    sampleOutput: '[-3,0,-2]',
    hints: [
      'Maintain two stacks: one for the values and another for the current minimums.',
      'When pushing a value x, push min(x, minStack.top) onto the minStack.',
      'When popping, pop from both stacks.'
    ],
    functionName: 'simulateMinStack',
    starterCode: {
      JavaScript: `/**
 * @param {any[][]} operations
 * @return {number[]}
 */
function simulateMinStack(operations) {
  // Write your solution here
  
}`,
      TypeScript: `function simulateMinStack(operations: any[][]): number[] {
  // Write your solution here
  return [];
}`,
      Python: `def simulateMinStack(operations: list) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function simulateMinStack(operations) {
  const stack = [];
  const minStack = [];
  const output = [];
  for (const op of operations) {
    const cmd = op[0];
    if (cmd === 'PUSH') {
      const val = op[1];
      stack.push(val);
      const min = minStack.length ? Math.min(val, minStack[minStack.length - 1]) : val;
      minStack.push(min);
    } else if (cmd === 'POP') {
      stack.pop();
      minStack.pop();
    } else if (cmd === 'TOP') {
      output.push(stack[stack.length - 1]);
    } else if (cmd === 'GET_MIN') {
      output.push(minStack[minStack.length - 1]);
    }
  }
  return output;
}`,
    testCases: [
      { input: '[["PUSH",-2],["PUSH",0],["PUSH",-3],["GET_MIN"],["POP"],["TOP"],["GET_MIN"]]', expected: '[-3,0,-2]' },
      { input: '[["PUSH",5],["TOP"],["GET_MIN"]]', expected: '[5,5]' }
    ]
  },
  {
    id: 'prob-38',
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    topic: 'Stacks',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'You are given an array of strings `tokens` that represents an arithmetic expression in a **Reverse Polish Notation** (Postfix Notation).\n\nEvaluate the expression. Return an integer that represents the value of the expression.\n\nValid operators are `+`, `-`, `*`, and `/`. Division truncates toward zero.',
    constraints: [
      '1 <= tokens.length <= 10^4',
      'tokens[i] is either an operator or an integer in the range [-200, 200].'
    ],
    sampleInput: 'tokens = ["2","1","+","3","*"]',
    sampleOutput: '9',
    hints: [
      'Use a stack to evaluate postfix expressions.',
      'When token is a number, push it onto stack.',
      'When token is an operator, pop two numbers (b then a) and compute a (op) b, pushing result back.'
    ],
    functionName: 'evalRPN',
    starterCode: {
      JavaScript: `/**
 * @param {string[]} tokens
 * @return {number}
 */
function evalRPN(tokens) {
  // Write your solution here
  
}`,
      TypeScript: `function evalRPN(tokens: string[]): number {
  // Write your solution here
  return 0;
}`,
      Python: `def evalRPN(tokens: list) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function evalRPN(tokens) {
  const stack = [];
  for (const token of tokens) {
    if (token === '+' || token === '-' || token === '*' || token === '/') {
      const b = stack.pop();
      const a = stack.pop();
      if (token === '+') stack.push(a + b);
      else if (token === '-') stack.push(a - b);
      else if (token === '*') stack.push(a * b);
      else if (token === '/') stack.push(Math.trunc(a / b));
    } else {
      stack.push(parseInt(token, 10));
    }
  }
  return stack[0];
}`,
    testCases: [
      { input: '["2","1","+","3","*"]', expected: '9' },
      { input: '["4","13","5","/","+"]', expected: '6' },
      { input: '["10","6","9","3","+","-11","*","/","*","17","+","5","+"]', expected: '22' }
    ]
  },
  {
    id: 'prob-39',
    title: 'Daily Temperatures Wait Time',
    difficulty: 'Medium',
    topic: 'Stacks',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.',
    constraints: [
      '1 <= temperatures.length <= 10^5',
      '30 <= temperatures[i] <= 100'
    ],
    sampleInput: 'temperatures = [73,74,75,71,69,72,76,73]',
    sampleOutput: '[1,1,4,2,1,1,0,0]',
    hints: [
      'A monotonic decreasing stack of indices helps find the next greater element efficiently.',
      'Iterate through the array. While current temperature is greater than temperature at stack top, pop index and compute wait time (i - prevIdx).',
      'Push current index onto stack.'
    ],
    functionName: 'dailyTemperatures',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
function dailyTemperatures(temperatures) {
  // Write your solution here
  
}`,
      TypeScript: `function dailyTemperatures(temperatures: number[]): number[] {
  // Write your solution here
  return [];
}`,
      Python: `def dailyTemperatures(temperatures: list) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = []; // store indices
  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prev = stack.pop();
      answer[prev] = i - prev;
    }
    stack.push(i);
  }
  return answer;
}`,
    testCases: [
      { input: '[73,74,75,71,69,72,76,73]', expected: '[1,1,4,2,1,1,0,0]' },
      { input: '[30,40,50,60]', expected: '[1,1,1,0]' },
      { input: '[30,60,90]', expected: '[1,1,0]' }
    ]
  },
  {
    id: 'prob-40',
    title: 'Implement Queue using Stacks',
    difficulty: 'Easy',
    topic: 'Queues',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Implement a first in first out (FIFO) queue using only two standard LIFO stacks.\n\nSimulate operations given as an array of commands where commands are:\n- `["PUSH", x]` pushes element x to back.\n- `["POP"]` removes element from front.\n- `["PEEK"]` gets front element.\n- `["EMPTY"]` returns true if empty, false otherwise.\n\nReturn outputs of all `"POP"`, `"PEEK"`, and `"EMPTY"` commands.',
    constraints: [
      '1 <= operations.length <= 100',
      '1 <= x <= 9'
    ],
    sampleInput: 'operations = [["PUSH",1],["PUSH",2],["PEEK"],["POP"],["EMPTY"]]',
    sampleOutput: '[1,1,false]',
    hints: [
      'Use an inStack for pushing and an outStack for popping/peeking.',
      'When outStack is empty, transfer all elements from inStack to outStack to reverse order.',
      'This achieves amortized O(1) time per operation.'
    ],
    functionName: 'simulateQueueWithStacks',
    starterCode: {
      JavaScript: `/**
 * @param {any[][]} operations
 * @return {any[]}
 */
function simulateQueueWithStacks(operations) {
  // Write your solution here
  
}`,
      TypeScript: `function simulateQueueWithStacks(operations: any[][]): any[] {
  // Write your solution here
  return [];
}`,
      Python: `def simulateQueueWithStacks(operations: list) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function simulateQueueWithStacks(operations) {
  const inStack = [];
  const outStack = [];
  const output = [];
  function shiftStacks() {
    if (outStack.length === 0) {
      while (inStack.length) outStack.push(inStack.pop());
    }
  }
  for (const op of operations) {
    const cmd = op[0];
    if (cmd === 'PUSH') {
      inStack.push(op[1]);
    } else if (cmd === 'POP') {
      shiftStacks();
      output.push(outStack.pop());
    } else if (cmd === 'PEEK') {
      shiftStacks();
      output.push(outStack[outStack.length - 1]);
    } else if (cmd === 'EMPTY') {
      output.push(inStack.length === 0 && outStack.length === 0);
    }
  }
  return output;
}`,
    testCases: [
      { input: '[["PUSH",1],["PUSH",2],["PEEK"],["POP"],["EMPTY"]]', expected: '[1,1,false]' },
      { input: '[["PUSH",5],["EMPTY"],["POP"]]', expected: '[false,5]' }
    ]
  },

  // ==========================================
  // LINKED LISTS (4 problems: prob-41 to prob-44)
  // ==========================================
  {
    id: 'prob-41',
    title: 'Merge Two Sorted Linked Lists',
    difficulty: 'Easy',
    topic: 'Linked Lists',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.',
    constraints: [
      'The number of nodes in both lists is in the range [0, 50].',
      '-100 <= Node.val <= 100',
      'Both list1 and list2 are sorted in non-decreasing order.'
    ],
    sampleInput: 'list1 = [1,2,4], list2 = [1,3,4]',
    sampleOutput: '[1,1,2,3,4,4]',
    hints: [
      'Use a dummy head node to simplify edge cases with the list start.',
      'Compare node values of list1 and list2, appending the smaller node to the current pointer.',
      'Attach whatever remains of list1 or list2 at the end.'
    ],
    functionName: 'mergeTwoLists',
    starterCode: {
      JavaScript: `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
function mergeTwoLists(list1, list2) {
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

function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  // Write your solution here
  return null;
}`,
      Python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def mergeTwoLists(list1, list2):
    # Write your solution here
    pass`
    },
    solutionCode: `function mergeTwoLists(list1, list2) {
  const dummy = new ListNode(0);
  let cur = dummy;
  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      cur.next = list1;
      list1 = list1.next;
    } else {
      cur.next = list2;
      list2 = list2.next;
    }
    cur = cur.next;
  }
  cur.next = list1 !== null ? list1 : list2;
  return dummy.next;
}`,
    testCases: [
      { input: '[1,2,4], [1,3,4]', expected: '[1,1,2,3,4,4]' },
      { input: '[], []', expected: '[]' },
      { input: '[], [0]', expected: '[0]' }
    ]
  },
  {
    id: 'prob-42',
    title: 'Remove Nth Node From End of List',
    difficulty: 'Medium',
    topic: 'Linked Lists',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given the `head` of a linked list, remove the `n-th` node from the end of the list and return its head in a single pass.',
    constraints: [
      'The number of nodes in the list is sz.',
      '1 <= sz <= 30',
      '0 <= Node.val <= 100',
      '1 <= n <= sz'
    ],
    sampleInput: 'head = [1,2,3,4,5], n = 2',
    sampleOutput: '[1,2,3,5]',
    hints: [
      'Use a dummy node pointing to head and two pointers: fast and slow.',
      'Advance fast pointer n + 1 steps ahead of slow.',
      'Move both pointers together until fast reaches null. Then slow.next = slow.next.next.'
    ],
    functionName: 'removeNthFromEnd',
    starterCode: {
      JavaScript: `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
function removeNthFromEnd(head, n) {
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

function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  // Write your solution here
  return null;
}`,
      Python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def removeNthFromEnd(head, n: int):
    # Write your solution here
    pass`
    },
    solutionCode: `function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }
  while (fast !== null) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}`,
    testCases: [
      { input: '[1,2,3,4,5], 2', expected: '[1,2,3,5]' },
      { input: '[1], 1', expected: '[]' },
      { input: '[1,2], 1', expected: '[1]' }
    ]
  },
  {
    id: 'prob-43',
    title: 'Linked List Cycle Detection',
    difficulty: 'Easy',
    topic: 'Linked Lists',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer. Return `true` if there is a cycle, or `false` otherwise.',
    constraints: [
      'The number of the nodes in the list is in the range [0, 10^4].',
      '-10^5 <= Node.val <= 10^5'
    ],
    sampleInput: 'head = [3,2,0,-4]',
    sampleOutput: 'false',
    hints: [
      'Floyd\'s Cycle-Finding Algorithm (Tortoise and Hare): maintain two pointers, slow (1 step) and fast (2 steps).',
      'If fast reaches null, there is no cycle.',
      'If fast and slow meet, there is a cycle.'
    ],
    functionName: 'hasCycle',
    starterCode: {
      JavaScript: `/**
 * @param {ListNode} head
 * @return {boolean}
 */
function hasCycle(head) {
  // Write your solution here
  
}`,
      TypeScript: `function hasCycle(head: any): boolean {
  // Write your solution here
  return false;
}`,
      Python: `def hasCycle(head) -> bool:
    # Write your solution here
    pass`
    },
    solutionCode: `function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    testCases: [
      { input: '[3,2,0,-4]', expected: 'false' },
      { input: '[1,2]', expected: 'false' },
      { input: '[]', expected: 'false' }
    ]
  },
  {
    id: 'prob-44',
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    topic: 'Linked Lists',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.',
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4',
      '0 <= lists[i].length <= 500',
      '-10^4 <= lists[i][j] <= 10^4'
    ],
    sampleInput: 'lists = [[1,4,5],[1,3,4],[2,6]]',
    sampleOutput: '[1,1,2,3,4,4,5,6]',
    hints: [
      'You can merge lists pairwise using Divide and Conquer in O(N log k) time.',
      'Divide the array of k lists into halves, recursively merge each half, and merge the two resulting sorted lists.'
    ],
    functionName: 'mergeKLists',
    starterCode: {
      JavaScript: `/**
 * @param {number[][]} lists
 * @return {number[]}
 */
function mergeKLists(lists) {
  // Write your solution here
  
}`,
      TypeScript: `function mergeKLists(lists: number[][]): number[] {
  // Write your solution here
  return [];
}`,
      Python: `def mergeKLists(lists: list) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function mergeKLists(lists) {
  if (!lists || !lists.length) return [];
  const flat = [];
  for (const list of lists) {
    if (Array.isArray(list)) {
      for (const val of list) flat.push(val);
    }
  }
  return flat.sort((a, b) => a - b);
}`,
    testCases: [
      { input: '[[1,4,5],[1,3,4],[2,6]]', expected: '[1,1,2,3,4,4,5,6]' },
      { input: '[]', expected: '[]' },
      { input: '[[]]', expected: '[]' }
    ]
  },

  // ==========================================
  // BINARY SEARCH (3 problems: prob-45 to prob-47)
  // ==========================================
  {
    id: 'prob-45',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    topic: 'Searching',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given the integer array `nums` sorted in ascending order (with distinct values) that has been rotated at an unknown pivot index, and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
    constraints: [
      '1 <= nums.length <= 5000',
      '-10^4 <= nums[i] <= 10^4',
      'All values of nums are unique.',
      '-10^4 <= target <= 10^4'
    ],
    sampleInput: 'nums = [4,5,6,7,0,1,2], target = 0',
    sampleOutput: '4',
    hints: [
      'At any mid index, at least one half of the array (left or right) is strictly sorted.',
      'Check if the target falls within the bounds of the sorted half.',
      'If it does, search that half; otherwise, search the other half.'
    ],
    functionName: 'searchRotated',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function searchRotated(nums, target) {
  // Write your solution here
  
}`,
      TypeScript: `function searchRotated(nums: number[], target: number): number {
  // Write your solution here
  return -1;
}`,
      Python: `def searchRotated(nums: list, target: int) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function searchRotated(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}`,
    testCases: [
      { input: '[4,5,6,7,0,1,2], 0', expected: '4' },
      { input: '[4,5,6,7,0,1,2], 3', expected: '-1' },
      { input: '[1], 0', expected: '-1' }
    ]
  },
  {
    id: 'prob-46',
    title: 'Find First and Last Position of Element',
    difficulty: 'Medium',
    topic: 'Searching',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\nIf `target` is not found in the array, return `[-1, -1]`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
    constraints: [
      '0 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9',
      'nums is a non-decreasing array.',
      '-10^9 <= target <= 10^9'
    ],
    sampleInput: 'nums = [5,7,7,8,8,10], target = 8',
    sampleOutput: '[3,4]',
    hints: [
      'Perform binary search twice: once to find the leftmost boundary, once to find the rightmost boundary.',
      'To find left boundary: when nums[mid] === target, continue searching in left half (right = mid - 1).'
    ],
    functionName: 'searchRange',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function searchRange(nums, target) {
  // Write your solution here
  
}`,
      TypeScript: `function searchRange(nums: number[], target: number): number[] {
  // Write your solution here
  return [-1, -1];
}`,
      Python: `def searchRange(nums: list, target: int) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function searchRange(nums, target) {
  function findBound(isFirst) {
    let left = 0, right = nums.length - 1, bound = -1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (nums[mid] === target) {
        bound = mid;
        if (isFirst) right = mid - 1;
        else left = mid + 1;
      } else if (nums[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return bound;
  }
  return [findBound(true), findBound(false)];
}`,
    testCases: [
      { input: '[5,7,7,8,8,10], 8', expected: '[3,4]' },
      { input: '[5,7,7,8,8,10], 6', expected: '[-1,-1]' },
      { input: '[], 0', expected: '[-1,-1]' }
    ]
  },
  {
    id: 'prob-47',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    topic: 'Searching',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the **median** of the two sorted arrays.\n\nThe overall run time complexity should be `O(log (m+n))` or `O(log(min(m, n)))`.',
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000'
    ],
    sampleInput: 'nums1 = [1,3], nums2 = [2]',
    sampleOutput: '2',
    hints: [
      'Binary search on the partition of the smaller array.',
      'Partition both arrays such that left parts contain (m + n + 1) / 2 elements.',
      'Verify that maxLeft1 <= minRight2 and maxLeft2 <= minRight1.'
    ],
    functionName: 'findMedianSortedArrays',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function findMedianSortedArrays(nums1, nums2) {
  // Write your solution here
  
}`,
      TypeScript: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  // Write your solution here
  return 0;
}`,
      Python: `def findMedianSortedArrays(nums1: list, nums2: list) -> float:
    # Write your solution here
    pass`
    },
    solutionCode: `function findMedianSortedArrays(nums1, nums2) {
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
  const m = nums1.length, n = nums2.length;
  let left = 0, right = m;
  while (left <= right) {
    const i = Math.floor((left + right) / 2);
    const j = Math.floor((m + n + 1) / 2) - i;
    const maxLeft1 = i === 0 ? -Infinity : nums1[i - 1];
    const minRight1 = i === m ? Infinity : nums1[i];
    const maxLeft2 = j === 0 ? -Infinity : nums2[j - 1];
    const minRight2 = j === n ? Infinity : nums2[j];
    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
      if ((m + n) % 2 === 1) return Math.max(maxLeft1, maxLeft2);
      return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;
    } else if (maxLeft1 > minRight2) {
      right = i - 1;
    } else {
      left = i + 1;
    }
  }
  return 0;
}`,
    testCases: [
      { input: '[1,3], [2]', expected: '2' },
      { input: '[1,2], [3,4]', expected: '2.5' },
      { input: '[0,0], [0,0]', expected: '0' }
    ]
  },

  // ==========================================
  // RECURSION / BACKTRACKING (3 problems: prob-48 to prob-50)
  // ==========================================
  {
    id: 'prob-48',
    title: 'Generate Parentheses Combinations',
    difficulty: 'Medium',
    topic: 'Recursion',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
    constraints: [
      '1 <= n <= 8'
    ],
    sampleInput: 'n = 3',
    sampleOutput: '["((()))","(()())","(())()","()(())","()()()"]',
    hints: [
      'Use backtracking keeping track of open and close parenthesis counts.',
      'You can add an open bracket if open < n.',
      'You can add a close bracket if close < open.'
    ],
    functionName: 'generateParenthesis',
    starterCode: {
      JavaScript: `/**
 * @param {number} n
 * @return {string[]}
 */
function generateParenthesis(n) {
  // Write your solution here
  
}`,
      TypeScript: `function generateParenthesis(n: number): string[] {
  // Write your solution here
  return [];
}`,
      Python: `def generateParenthesis(n: int) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function generateParenthesis(n) {
  const res = [];
  function backtrack(curr, open, close) {
    if (curr.length === 2 * n) {
      res.push(curr);
      return;
    }
    if (open < n) backtrack(curr + '(', open + 1, close);
    if (close < open) backtrack(curr + ')', open, close + 1);
  }
  backtrack('', 0, 0);
  return res;
}`,
    testCases: [
      { input: '3', expected: '["((()))","(()())","(())()","()(())","()()()"]' },
      { input: '1', expected: '["()"]' },
      { input: '2', expected: '["(())","()()"]' }
    ]
  },
  {
    id: 'prob-49',
    title: 'Subsets Power Set Generation',
    difficulty: 'Medium',
    topic: 'Recursion',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order.',
    constraints: [
      '1 <= nums.length <= 10',
      '-10 <= nums[i] <= 10',
      'All the numbers of nums are unique.'
    ],
    sampleInput: 'nums = [1,2,3]',
    sampleOutput: '[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]',
    hints: [
      'At each index, you have two choices: include nums[i] in the current subset or exclude it.',
      'Backtrack through all indices from start to nums.length.'
    ],
    functionName: 'subsets',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function subsets(nums) {
  // Write your solution here
  
}`,
      TypeScript: `function subsets(nums: number[]): number[][] {
  // Write your solution here
  return [];
}`,
      Python: `def subsets(nums: list) -> list:
    # Write your solution here
    pass`
    },
    solutionCode: `function subsets(nums) {
  const result = [];
  function backtrack(start, current) {
    result.push([...current]);
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  backtrack(0, []);
  return result;
}`,
    testCases: [
      { input: '[1,2,3]', expected: '[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]' },
      { input: '[0]', expected: '[[],[0]]' }
    ]
  },
  {
    id: 'prob-50',
    title: 'N-Queens Board Solver',
    difficulty: 'Hard',
    topic: 'Recursion',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'The **n-queens** puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other.\n\nGiven an integer `n`, return the number of distinct solutions to the n-queens puzzle.',
    constraints: [
      '1 <= n <= 9'
    ],
    sampleInput: 'n = 4',
    sampleOutput: '2',
    hints: [
      'Place queens row by row.',
      'Track occupied columns, positive diagonals (row + col), and negative diagonals (row - col) in sets.',
      'Count total completions when row reaching n.'
    ],
    functionName: 'solveNQueens',
    starterCode: {
      JavaScript: `/**
 * @param {number} n
 * @return {number}
 */
function solveNQueens(n) {
  // Write your solution here
  
}`,
      TypeScript: `function solveNQueens(n: number): number {
  // Write your solution here
  return 0;
}`,
      Python: `def solveNQueens(n: int) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function solveNQueens(n) {
  let count = 0;
  const cols = new Set();
  const diag1 = new Set(); // row - col
  const diag2 = new Set(); // row + col
  function backtrack(row) {
    if (row === n) {
      count++;
      return;
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      backtrack(row + 1);
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  }
  backtrack(0);
  return count;
}`,
    testCases: [
      { input: '4', expected: '2' },
      { input: '1', expected: '1' },
      { input: '5', expected: '10' }
    ]
  },

  // ==========================================
  // TREES (4 problems: prob-51 to prob-54)
  // ==========================================
  {
    id: 'prob-51',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    topic: 'Trees',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given the `root` of a binary tree, return its maximum depth.\n\nA binary tree\'s **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.',
    constraints: [
      'The number of nodes in the tree is in the range [0, 10^4].',
      '-100 <= Node.val <= 100'
    ],
    sampleInput: 'root = [3,9,20,null,null,15,7]',
    sampleOutput: '3',
    hints: [
      'Recursive definition: maxDepth(root) = 1 + max(maxDepth(root.left), maxDepth(root.right)).',
      'Base case: if root is null, return 0.'
    ],
    functionName: 'maxDepth',
    starterCode: {
      JavaScript: `/**
 * @param {TreeNode} root
 * @return {number}
 */
function maxDepth(root) {
  // Write your solution here
  
}`,
      TypeScript: `function maxDepth(root: any): number {
  // Write your solution here
  return 0;
}`,
      Python: `def maxDepth(root) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    testCases: [
      { input: '[3,9,20,null,null,15,7]', expected: '3' },
      { input: '[1,null,2]', expected: '2' },
      { input: '[]', expected: '0' }
    ]
  },
  {
    id: 'prob-52',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    topic: 'Trees',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given the `root` of a binary tree, invert the tree, and return its root.',
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100'
    ],
    sampleInput: 'root = [4,2,7,1,3,6,9]',
    sampleOutput: '[4,7,2,9,6,3,1]',
    hints: [
      'Swap the left child and right child of the current node.',
      'Recursively invert the left subtree and the right subtree.'
    ],
    functionName: 'invertTree',
    starterCode: {
      JavaScript: `/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
function invertTree(root) {
  // Write your solution here
  
}`,
      TypeScript: `function invertTree(root: any): any {
  // Write your solution here
  return null;
}`,
      Python: `def invertTree(root):
    # Write your solution here
    pass`
    },
    solutionCode: `function invertTree(root) {
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`,
    testCases: [
      { input: '[4,2,7,1,3,6,9]', expected: '[4,7,2,9,6,3,1]' },
      { input: '[2,1,3]', expected: '[2,3,1]' },
      { input: '[]', expected: '[]' }
    ]
  },
  {
    id: 'prob-53',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    topic: 'Trees',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).\n\nA **valid BST** is defined as follows:\n- The left subtree of a node contains only nodes with keys **less than** the node\'s key.\n- The right subtree of a node contains only nodes with keys **greater than** the node\'s key.\n- Both the left and right subtrees must also be binary search trees.',
    constraints: [
      'The number of nodes in the tree is in the range [1, 10^4].',
      '-2^31 <= Node.val <= 2^31 - 1'
    ],
    sampleInput: 'root = [2,1,3]',
    sampleOutput: 'true',
    hints: [
      'Each node must satisfy a valid range [min, max].',
      'When visiting left child, update upper bound max to node.val.',
      'When visiting right child, update lower bound min to node.val.'
    ],
    functionName: 'isValidBST',
    starterCode: {
      JavaScript: `/**
 * @param {TreeNode} root
 * @return {boolean}
 */
function isValidBST(root) {
  // Write your solution here
  
}`,
      TypeScript: `function isValidBST(root: any): boolean {
  // Write your solution here
  return true;
}`,
      Python: `def isValidBST(root) -> bool:
    # Write your solution here
    pass`
    },
    solutionCode: `function isValidBST(root) {
  function validate(node, min, max) {
    if (!node) return true;
    if (min !== null && node.val <= min) return false;
    if (max !== null && node.val >= max) return false;
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  return validate(root, null, null);
}`,
    testCases: [
      { input: '[2,1,3]', expected: 'true' },
      { input: '[5,1,4,null,null,3,6]', expected: 'false' },
      { input: '[10]', expected: 'true' }
    ]
  },
  {
    id: 'prob-54',
    title: 'Lowest Common Ancestor in BST',
    difficulty: 'Easy',
    topic: 'Trees',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given values `p` and `q`.\n\nThe Lowest Common Ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants (where we allow a node to be a descendant of itself).',
    constraints: [
      'The number of nodes in the tree is in the range [2, 10^5].',
      '-10^9 <= Node.val <= 10^9',
      'All Node.val are unique.',
      'p and q will exist in the BST and p != q.'
    ],
    sampleInput: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8',
    sampleOutput: '6',
    hints: [
      'In a BST, if both p and q values are smaller than root.val, LCA is in the left subtree.',
      'If both p and q values are larger than root.val, LCA is in the right subtree.',
      'Otherwise, current root is the split point (the LCA).'
    ],
    functionName: 'lowestCommonAncestor',
    starterCode: {
      JavaScript: `/**
 * @param {TreeNode} root
 * @param {number} p
 * @param {number} q
 * @return {number}
 */
function lowestCommonAncestor(root, p, q) {
  // Write your solution here
  
}`,
      TypeScript: `function lowestCommonAncestor(root: any, p: number, q: number): number {
  // Write your solution here
  return 0;
}`,
      Python: `def lowestCommonAncestor(root, p: int, q: int) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function lowestCommonAncestor(root, p, q) {
  let curr = root;
  while (curr) {
    if (p < curr.val && q < curr.val) curr = curr.left;
    else if (p > curr.val && q > curr.val) curr = curr.right;
    else return curr.val;
  }
  return root ? root.val : 0;
}`,
    testCases: [
      { input: '[6,2,8,0,4,7,9,null,null,3,5], 2, 8', expected: '6' },
      { input: '[6,2,8,0,4,7,9,null,null,3,5], 2, 4', expected: '2' },
      { input: '[2,1], 2, 1', expected: '2' }
    ]
  },

  // ==========================================
  // GRAPHS (2 problems: prob-55 to prob-56)
  // ==========================================
  {
    id: 'prob-55',
    title: 'Number of Connected Islands',
    difficulty: 'Medium',
    topic: 'Graphs',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'Given an `m x n` 2D binary grid `grid` which represents a map of `\'1\'`s (land) and `\'0\'`s (water), return the number of islands.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is \'0\' or \'1\'.'
    ],
    sampleInput: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
    sampleOutput: '1',
    hints: [
      'Iterate through every cell in the grid.',
      'When you encounter a \'1\', increment island count and start a DFS/BFS to sink (mark as \'0\') all connected land cells.'
    ],
    functionName: 'numIslands',
    starterCode: {
      JavaScript: `/**
 * @param {string[][]} grid
 * @return {number}
 */
function numIslands(grid) {
  // Write your solution here
  
}`,
      TypeScript: `function numIslands(grid: string[][]): number {
  // Write your solution here
  return 0;
}`,
      Python: `def numIslands(grid: list) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function numIslands(grid) {
  if (!grid || !grid.length) return 0;
  let count = 0;
  const m = grid.length, n = grid[0].length;
  function dfs(r, c) {
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
    testCases: [
      { 
        input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', 
        expected: '1' 
      },
      { 
        input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', 
        expected: '3' 
      }
    ]
  },
  {
    id: 'prob-56',
    title: 'Course Schedule Dependency Cycle',
    difficulty: 'Medium',
    topic: 'Graphs',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a_i, b_i]` indicates that you must take course `b_i` first if you want to take course `a_i`.\n\nReturn `true` if you can finish all courses, or `false` otherwise (i.e. check if the dependency graph is a Directed Acyclic Graph).',
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= 5000',
      'prerequisites[i].length == 2',
      '0 <= a_i, b_i < numCourses',
      'All the pairs prerequisites[i] are unique.'
    ],
    sampleInput: 'numCourses = 2, prerequisites = [[1,0]]',
    sampleOutput: 'true',
    hints: [
      'Build an adjacency list and calculate the in-degree of each course.',
      'Use Kahn\'s algorithm (BFS topological sort): enqueue courses with in-degree 0.',
      'If processed count equals numCourses, return true.'
    ],
    functionName: 'canFinish',
    starterCode: {
      JavaScript: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
function canFinish(numCourses, prerequisites) {
  // Write your solution here
  
}`,
      TypeScript: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  // Write your solution here
  return true;
}`,
      Python: `def canFinish(numCourses: int, prerequisites: list) -> bool:
    # Write your solution here
    pass`
    },
    solutionCode: `function canFinish(numCourses, prerequisites) {
  const inDegree = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [course, pre] of prerequisites) {
    adj[pre].push(course);
    inDegree[course]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  let visited = 0;
  while (queue.length) {
    const curr = queue.shift();
    visited++;
    for (const next of adj[curr]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }
  return visited === numCourses;
}`,
    testCases: [
      { input: '2, [[1,0]]', expected: 'true' },
      { input: '2, [[1,0],[0,1]]', expected: 'false' },
      { input: '1, []', expected: 'true' }
    ]
  },

  // ==========================================
  // GREEDY (1 problem: prob-57)
  // ==========================================
  {
    id: 'prob-57',
    title: 'Jump Game Reachability',
    difficulty: 'Medium',
    topic: 'Greedy',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'You are given an integer array `nums`. You are initially positioned at the array\'s **first index**, and each element in the array represents your maximum jump length at that position.\n\nReturn `true` if you can reach the last index, or `false` otherwise.',
    constraints: [
      '1 <= nums.length <= 10^4',
      '0 <= nums[i] <= 10^5'
    ],
    sampleInput: 'nums = [2,3,1,1,4]',
    sampleOutput: 'true',
    hints: [
      'Maintain the furthest index reachable so far.',
      'Iterate through the array: if current index i > maxReach, return false.',
      'Update maxReach = max(maxReach, i + nums[i]).'
    ],
    functionName: 'canJump',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
function canJump(nums) {
  // Write your solution here
  
}`,
      TypeScript: `function canJump(nums: number[]): boolean {
  // Write your solution here
  return false;
}`,
      Python: `def canJump(nums: list) -> bool:
    # Write your solution here
    pass`
    },
    solutionCode: `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
    if (maxReach >= nums.length - 1) return true;
  }
  return true;
}`,
    testCases: [
      { input: '[2,3,1,1,4]', expected: 'true' },
      { input: '[3,2,1,0,4]', expected: 'false' },
      { input: '[0]', expected: 'true' },
      { input: '[2,0,0]', expected: 'true' }
    ]
  },

  // ==========================================
  // DYNAMIC PROGRAMMING (2 problems: prob-58 to prob-59)
  // ==========================================
  {
    id: 'prob-58',
    title: 'Climbing Stairs Ways',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
    constraints: [
      '1 <= n <= 45'
    ],
    sampleInput: 'n = 3',
    sampleOutput: '3',
    hints: [
      'To reach step n, you could have come from step n - 1 or step n - 2.',
      'Ways(n) = Ways(n - 1) + Ways(n - 2).',
      'This is equivalent to the Fibonacci sequence with base cases Ways(1) = 1, Ways(2) = 2.'
    ],
    functionName: 'climbStairs',
    starterCode: {
      JavaScript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // Write your solution here
  
}`,
      TypeScript: `function climbStairs(n: number): number {
  // Write your solution here
  return 0;
}`,
      Python: `def climbStairs(n: int) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
    testCases: [
      { input: '2', expected: '2' },
      { input: '3', expected: '3' },
      { input: '4', expected: '5' },
      { input: '5', expected: '8' }
    ]
  },
  {
    id: 'prob-59',
    title: 'Coin Change Minimum Coins',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    languages: ['JavaScript', 'TypeScript', 'Python'],
    description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.',
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    sampleInput: 'coins = [1,2,5], amount = 11',
    sampleOutput: '3',
    hints: [
      'Define dp[i] as the minimum number of coins needed to make amount i.',
      'Initialize dp array with Infinity, and dp[0] = 0.',
      'For each amount i from 1 to amount, and each coin c: dp[i] = min(dp[i], dp[i - c] + 1).'
    ],
    functionName: 'coinChange',
    starterCode: {
      JavaScript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
  // Write your solution here
  
}`,
      TypeScript: `function coinChange(coins: number[], amount: number): number {
  // Write your solution here
  return -1;
}`,
      Python: `def coinChange(coins: list, amount: int) -> int:
    # Write your solution here
    pass`
    },
    solutionCode: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0 && dp[i - coin] !== Infinity) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    testCases: [
      { input: '[1,2,5], 11', expected: '3' },
      { input: '[2], 3', expected: '-1' },
      { input: '[1], 0', expected: '0' }
    ]
  }
];
