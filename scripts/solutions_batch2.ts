export const solutionsBatch2 = {
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
      "JavaScript": `function findMissingNumber(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((acc, curr) => acc + curr, 0);
  return expectedSum - actualSum;
}`,
      "TypeScript": `function findMissingNumber(nums: number[]): number {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((acc, curr) => acc + curr, 0);
  return expectedSum - actualSum;
}`,
      "Python": `def findMissingNumber(nums: list) -> int:
    n = len(nums)
    expected_sum = n * (n + 1) // 2
    return expected_sum - sum(nums)`
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
      "JavaScript": `function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const correctIdx = nums[i] - 1;
      const temp = nums[i];
      nums[i] = nums[correctIdx];
      nums[correctIdx] = temp;
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) {
      return i + 1;
    }
  }
  return n + 1;
}`,
      "TypeScript": `function firstMissingPositive(nums: number[]): number {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const correctIdx = nums[i] - 1;
      const temp = nums[i];
      nums[i] = nums[correctIdx];
      nums[correctIdx] = temp;
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) {
      return i + 1;
    }
  }
  return n + 1;
}`,
      "Python": `def firstMissingPositive(nums: list) -> int:
    n = len(nums)
    for i in range(n):
        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            correct_idx = nums[i] - 1
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    return n + 1`
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
      "JavaScript": `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const counts = {};
  for (let i = 0; i < s.length; i++) {
    counts[s[i]] = (counts[s[i]] || 0) + 1;
    counts[t[i]] = (counts[t[i]] || 0) - 1;
  }
  for (const key in counts) {
    if (counts[key] !== 0) return false;
  }
  return true;
}`,
      "TypeScript": `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const counts: Record<string, number> = {};
  for (let i = 0; i < s.length; i++) {
    counts[s[i]] = (counts[s[i]] || 0) + 1;
    counts[t[i]] = (counts[t[i]] || 0) - 1;
  }
  for (const key in counts) {
    if (counts[key] !== 0) return false;
  }
  return true;
}`,
      "Python": `def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    counts = {}
    for c in s:
        counts[c] = counts.get(c, 0) + 1
    for c in t:
        if c not in counts or counts[c] == 0:
            return False
        counts[c] -= 1
    return True`
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
      "JavaScript": `function reverseWords(s) {
  return s.trim().split(/\\s+/).reverse().join(' ');
}`,
      "TypeScript": `function reverseWords(s: string): string {
  return s.trim().split(/\\s+/).reverse().join(' ');
}`,
      "Python": `def reverseWords(s: str) -> str:
    return ' '.join(s.strip().split()[::-1])`
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
      "JavaScript": `function longestCommonPrefix(strs) {
  if (!strs || strs.length === 0) return '';
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (prefix === '') return '';
    }
  }
  return prefix;
}`,
      "TypeScript": `function longestCommonPrefix(strs: string[]): string {
  if (!strs || strs.length === 0) return '';
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (prefix === '') return '';
    }
  }
  return prefix;
}`,
      "Python": `def longestCommonPrefix(strs: list) -> str:
    if not strs:
        return ''
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ''
    return prefix`
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
      "JavaScript": `function groupAnagrams(strs) {
  const map = new Map();
  for (let i = 0; i < strs.length; i++) {
    const key = strs[i].split('').sort().join('');
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(strs[i]);
  }
  return Array.from(map.values());
}`,
      "TypeScript": `function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  for (let i = 0; i < strs.length; i++) {
    const key = strs[i].split('').sort().join('');
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(strs[i]);
  }
  return Array.from(map.values());
}`,
      "Python": `def groupAnagrams(strs: list) -> list:
    groups = {}
    for s in strs:
        key = ''.join(sorted(s))
        if key not in groups:
            groups[key] = []
        groups[key].append(s)
    return list(groups.values())`
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
      "JavaScript": `function compressString(s) {
  if (!s || s.length === 0) return '';
  let result = '';
  let count = 1;
  for (let i = 0; i < s.length; i++) {
    if (i + 1 < s.length && s[i] === s[i + 1]) {
      count++;
    } else {
      result += s[i] + count;
      count = 1;
    }
  }
  return result;
}`,
      "TypeScript": `function compressString(s: string): string {
  if (!s || s.length === 0) return '';
  let result = '';
  let count = 1;
  for (let i = 0; i < s.length; i++) {
    if (i + 1 < s.length && s[i] === s[i + 1]) {
      count++;
    } else {
      result += s[i] + count;
      count = 1;
    }
  }
  return result;
}`,
      "Python": `def compressString(s: str) -> str:
    if not s:
        return ''
    res = []
    count = 1
    for i in range(len(s)):
        if i + 1 < len(s) and s[i] == s[i + 1]:
            count += 1
        else:
            res.append(s[i] + str(count))
            count = 1
    return ''.join(res)`
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
      "JavaScript": `function longestPalindrome(s) {
  if (!s || s.length < 2) return s;
  let start = 0, maxLen = 1;
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return right - left - 1;
  }
  for (let i = 0; i < s.length; i++) {
    const len1 = expand(i, i);
    const len2 = expand(i, i + 1);
    const len = Math.max(len1, len2);
    if (len > maxLen) {
      maxLen = len;
      start = i - Math.floor((len - 1) / 2);
    }
  }
  return s.substring(start, start + maxLen);
}`,
      "TypeScript": `function longestPalindrome(s: string): string {
  if (!s || s.length < 2) return s;
  let start = 0, maxLen = 1;
  function expand(left: number, right: number): number {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return right - left - 1;
  }
  for (let i = 0; i < s.length; i++) {
    const len1 = expand(i, i);
    const len2 = expand(i, i + 1);
    const len = Math.max(len1, len2);
    if (len > maxLen) {
      maxLen = len;
      start = i - Math.floor((len - 1) / 2);
    }
  }
  return s.substring(start, start + maxLen);
}`,
      "Python": `def longestPalindrome(s: str) -> str:
    if not s or len(s) < 2:
        return s
    start, max_len = 0, 1
    def expand(left: int, right: int) -> int:
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return right - left - 1
    for i in range(len(s)):
        len1 = expand(i, i)
        len2 = expand(i, i + 1)
        cur_len = max(len1, len2)
        if cur_len > max_len:
            max_len = cur_len
            start = i - (cur_len - 1) // 2
    return s[start:start + max_len]`
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
      "JavaScript": `function subarraySum(nums, k) {
  const map = new Map();
  map.set(0, 1);
  let count = 0;
  let prefixSum = 0;
  for (let i = 0; i < nums.length; i++) {
    prefixSum += nums[i];
    if (map.has(prefixSum - k)) {
      count += map.get(prefixSum - k);
    }
    map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
  }
  return count;
}`,
      "TypeScript": `function subarraySum(nums: number[], k: number): number {
  const map = new Map<number, number>();
  map.set(0, 1);
  let count = 0;
  let prefixSum = 0;
  for (let i = 0; i < nums.length; i++) {
    prefixSum += nums[i];
    if (map.has(prefixSum - k)) {
      count += map.get(prefixSum - k)!;
    }
    map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
  }
  return count;
}`,
      "Python": `def subarraySum(nums: list, k: int) -> int:
    counts = {0: 1}
    prefix_sum = 0
    total = 0
    for num in nums:
        prefix_sum += num
        if prefix_sum - k in counts:
            total += counts[prefix_sum - k]
        counts[prefix_sum] = counts.get(prefix_sum, 0) + 1
    return total`
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
      "JavaScript": `function firstUniqChar(s) {
  const counts = {};
  for (let i = 0; i < s.length; i++) {
    counts[s[i]] = (counts[s[i]] || 0) + 1;
  }
  for (let i = 0; i < s.length; i++) {
    if (counts[s[i]] === 1) return i;
  }
  return -1;
}`,
      "TypeScript": `function firstUniqChar(s: string): number {
  const counts: Record<string, number> = {};
  for (let i = 0; i < s.length; i++) {
    counts[s[i]] = (counts[s[i]] || 0) + 1;
  }
  for (let i = 0; i < s.length; i++) {
    if (counts[s[i]] === 1) return i;
  }
  return -1;
}`,
      "Python": `def firstUniqChar(s: str) -> int:
    counts = {}
    for c in s:
        counts[c] = counts.get(c, 0) + 1
    for i, c in enumerate(s):
        if counts[c] == 1:
            return i
    return -1`
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
      "JavaScript": `function intersection(nums1, nums2) {
  const set1 = new Set(nums1);
  const result = new Set();
  for (let i = 0; i < nums2.length; i++) {
    if (set1.has(nums2[i])) {
      result.add(nums2[i]);
    }
  }
  return Array.from(result);
}`,
      "TypeScript": `function intersection(nums1: number[], nums2: number[]): number[] {
  const set1 = new Set(nums1);
  const result = new Set<number>();
  for (let i = 0; i < nums2.length; i++) {
    if (set1.has(nums2[i])) {
      result.add(nums2[i]);
    }
  }
  return Array.from(result);
}`,
      "Python": `def intersection(nums1: list, nums2: list) -> list:
    return list(set(nums1) & set(nums2))`
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
      "JavaScript": `function longestConsecutive(nums) {
  if (!nums || nums.length === 0) return 0;
  const numSet = new Set(nums);
  let longestStreak = 0;
  for (const num of numSet) {
    if (!numSet.has(num - 1)) {
      let currentNum = num;
      let currentStreak = 1;
      while (numSet.has(currentNum + 1)) {
        currentNum += 1;
        currentStreak += 1;
      }
      longestStreak = Math.max(longestStreak, currentStreak);
    }
  }
  return longestStreak;
}`,
      "TypeScript": `function longestConsecutive(nums: number[]): number {
  if (!nums || nums.length === 0) return 0;
  const numSet = new Set<number>(nums);
  let longestStreak = 0;
  for (const num of numSet) {
    if (!numSet.has(num - 1)) {
      let currentNum = num;
      let currentStreak = 1;
      while (numSet.has(currentNum + 1)) {
        currentNum += 1;
        currentStreak += 1;
      }
      longestStreak = Math.max(longestStreak, currentStreak);
    }
  }
  return longestStreak;
}`,
      "Python": `def longestConsecutive(nums: list) -> int:
    if not nums:
        return 0
    num_set = set(nums)
    longest = 0
    for num in num_set:
        if num - 1 not in num_set:
            curr = num
            streak = 1
            while curr + 1 in num_set:
                curr += 1
                streak += 1
            longest = max(longest, streak)
    return longest`
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
      "JavaScript": `function simulateLRUCache(operations, args) {
  const results = [];
  let cache = null;
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const arg = args[i];
    if (op === 'LRUCache') {
      const cap = arg[0];
      const map = new Map();
      cache = {
        get(key) {
          if (!map.has(key)) return -1;
          const val = map.get(key);
          map.delete(key);
          map.set(key, val);
          return val;
        },
        put(key, val) {
          if (map.has(key)) {
            map.delete(key);
          } else if (map.size >= cap) {
            const firstKey = map.keys().next().value;
            map.delete(firstKey);
          }
          map.set(key, val);
        }
      };
      results.push(null);
    } else if (op === 'put') {
      cache.put(arg[0], arg[1]);
      results.push(null);
    } else if (op === 'get') {
      results.push(cache.get(arg[0]));
    }
  }
  return results;
}`,
      "TypeScript": `function simulateLRUCache(operations: string[], args: any[][]): any[] {
  const results: any[] = [];
  let cache: any = null;
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const arg = args[i];
    if (op === 'LRUCache') {
      const cap = arg[0];
      const map = new Map<number, number>();
      cache = {
        get(key: number) {
          if (!map.has(key)) return -1;
          const val = map.get(key)!;
          map.delete(key);
          map.set(key, val);
          return val;
        },
        put(key: number, val: number) {
          if (map.has(key)) {
            map.delete(key);
          } else if (map.size >= cap) {
            const firstKey = map.keys().next().value;
            map.delete(firstKey!);
          }
          map.set(key, val);
        }
      };
      results.push(null);
    } else if (op === 'put') {
      cache.put(arg[0], arg[1]);
      results.push(null);
    } else if (op === 'get') {
      results.push(cache.get(arg[0]));
    }
  }
  return results;
}`,
      "Python": `def simulateLRUCache(operations: list, args: list) -> list:
    from collections import OrderedDict
    results = []
    class LRUCache:
        def __init__(self, capacity: int):
            self.cap = capacity
            self.cache = OrderedDict()
        def get(self, key: int) -> int:
            if key not in self.cache:
                return -1
            self.cache.move_to_end(key)
            return self.cache[key]
        def put(self, key: int, value: int) -> None:
            if key in self.cache:
                self.cache.move_to_end(key)
            elif len(self.cache) >= self.cap:
                self.cache.popitem(last=False)
            self.cache[key] = value

    cache = None
    for op, arg in zip(operations, args):
        if op == 'LRUCache':
            cache = LRUCache(arg[0])
            results.append(None)
        elif op == 'put':
            cache.put(arg[0], arg[1])
            results.append(None)
        elif op == 'get':
            results.append(cache.get(arg[0]))
    return results`
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
      "JavaScript": `function twoSumSorted(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [];
}`,
      "TypeScript": `function twoSumSorted(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [];
}`,
      "Python": `def twoSumSorted(numbers: list, target: int) -> list:
    left, right = 0, len(numbers) - 1
    while left < right:
        cur_sum = numbers[left] + numbers[right]
        if cur_sum == target:
            return [left + 1, right + 1]
        elif cur_sum < target:
            left += 1
        else:
            right -= 1
    return []`
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
      "JavaScript": `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;
  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const w = right - left;
    maxWater = Math.max(maxWater, h * w);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxWater;
}`,
      "TypeScript": `function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;
  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const w = right - left;
    maxWater = Math.max(maxWater, h * w);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxWater;
}`,
      "Python": `def maxArea(height: list) -> int:
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        h = min(height[left], height[right])
        w = right - left
        max_water = max(max_water, h * w)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water`
    }
  }
};
