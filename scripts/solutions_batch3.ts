export const solutionsBatch3 = {
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
      "JavaScript": `function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}`,
      "TypeScript": `function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}`,
      "Python": `def removeDuplicates(nums: list) -> int:
    if not nums:
        return 0
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1`
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
      "JavaScript": `function threeSum(nums) {
  const result = [];
  if (!nums || nums.length < 3) return result;
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    if (nums[i] > 0) break;
    let left = i + 1;
    let right = nums.length - 1;
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
      "TypeScript": `function threeSum(nums: number[]): number[][] {
  const result: number[][] = [];
  if (!nums || nums.length < 3) return result;
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    if (nums[i] > 0) break;
    let left = i + 1;
    let right = nums.length - 1;
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
      "Python": `def threeSum(nums: list) -> list:
    result = []
    if not nums or len(nums) < 3:
        return result
    nums.sort()
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        if nums[i] > 0:
            break
        left, right = i + 1, len(nums) - 1
        while left < right:
            cur_sum = nums[i] + nums[left] + nums[right]
            if cur_sum == 0:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif cur_sum < 0:
                left += 1
            else:
                right -= 1
    return result`
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
      "JavaScript": `function minSubArrayLen(target, nums) {
  let minLen = Infinity;
  let left = 0;
  let currentSum = 0;
  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right];
    while (currentSum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      currentSum -= nums[left];
      left++;
    }
  }
  return minLen === Infinity ? 0 : minLen;
}`,
      "TypeScript": `function minSubArrayLen(target: number, nums: number[]): number {
  let minLen = Infinity;
  let left = 0;
  let currentSum = 0;
  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right];
    while (currentSum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      currentSum -= nums[left];
      left++;
    }
  }
  return minLen === Infinity ? 0 : minLen;
}`,
      "Python": `def minSubArrayLen(target: int, nums: list) -> int:
    min_len = float('inf')
    left = 0
    cur_sum = 0
    for right in range(len(nums)):
        cur_sum += nums[right]
        while cur_sum >= target:
            min_len = min(min_len, right - left + 1)
            cur_sum -= nums[left]
            left += 1
    return 0 if min_len == float('inf') else min_len`
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
      "JavaScript": `function longestOnes(nums, k) {
  let left = 0;
  let zeroCount = 0;
  let maxLen = 0;
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
      "TypeScript": `function longestOnes(nums: number[], k: number): number {
  let left = 0;
  let zeroCount = 0;
  let maxLen = 0;
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
      "Python": `def longestOnes(nums: list, k: int) -> int:
    left = 0
    zero_count = 0
    max_len = 0
    for right in range(len(nums)):
        if nums[right] == 0:
            zero_count += 1
        while zero_count > k:
            if nums[left] == 0:
                zero_count -= 1
            left += 1
        max_len = max(max_len, right - left + 1)
    return max_len`
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
      "JavaScript": `function findMaxAverage(nums, k) {
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }
  let maxSum = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum / k;
}`,
      "TypeScript": `function findMaxAverage(nums: number[], k: number): number {
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }
  let maxSum = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum / k;
}`,
      "Python": `def findMaxAverage(nums: list, k: int) -> float:
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum / k`
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
      "JavaScript": `function maxSlidingWindow(nums, k) {
  if (!nums || nums.length === 0) return [];
  const deque = [];
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    if (deque.length > 0 && deque[0] <= i - k) {
      deque.shift();
    }
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  return result;
}`,
      "TypeScript": `function maxSlidingWindow(nums: number[], k: number): number[] {
  if (!nums || nums.length === 0) return [];
  const deque: number[] = [];
  const result: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (deque.length > 0 && deque[0] <= i - k) {
      deque.shift();
    }
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  return result;
}`,
      "Python": `def maxSlidingWindow(nums: list, k: int) -> list:
    from collections import deque
    if not nums:
        return []
    dq = deque()
    result = []
    for i in range(len(nums)):
        if dq and dq[0] <= i - k:
            dq.popleft()
        while dq and nums[dq[-1]] <= nums[i]:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result`
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
      "JavaScript": `function simulateMinStack(operations, args) {
  const results = [];
  let stack = [];
  let minStack = [];
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const arg = args[i];
    if (op === 'MinStack') {
      stack = [];
      minStack = [];
      results.push(null);
    } else if (op === 'push') {
      const val = arg[0];
      stack.push(val);
      const curMin = minStack.length === 0 ? val : Math.min(val, minStack[minStack.length - 1]);
      minStack.push(curMin);
      results.push(null);
    } else if (op === 'pop') {
      stack.pop();
      minStack.pop();
      results.push(null);
    } else if (op === 'top') {
      results.push(stack[stack.length - 1]);
    } else if (op === 'getMin') {
      results.push(minStack[minStack.length - 1]);
    }
  }
  return results;
}`,
      "TypeScript": `function simulateMinStack(operations: string[], args: any[][]): any[] {
  const results: any[] = [];
  let stack: number[] = [];
  let minStack: number[] = [];
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const arg = args[i];
    if (op === 'MinStack') {
      stack = [];
      minStack = [];
      results.push(null);
    } else if (op === 'push') {
      const val = arg[0];
      stack.push(val);
      const curMin = minStack.length === 0 ? val : Math.min(val, minStack[minStack.length - 1]);
      minStack.push(curMin);
      results.push(null);
    } else if (op === 'pop') {
      stack.pop();
      minStack.pop();
      results.push(null);
    } else if (op === 'top') {
      results.push(stack[stack.length - 1]);
    } else if (op === 'getMin') {
      results.push(minStack[minStack.length - 1]);
    }
  }
  return results;
}`,
      "Python": `def simulateMinStack(operations: list, args: list) -> list:
    results = []
    stack = []
    min_stack = []
    for op, arg in zip(operations, args):
        if op == 'MinStack':
            stack = []
            min_stack = []
            results.append(None)
        elif op == 'push':
            val = arg[0]
            stack.append(val)
            cur_min = val if not min_stack else min(val, min_stack[-1])
            min_stack.append(cur_min)
            results.append(None)
        elif op == 'pop':
            stack.pop()
            min_stack.pop()
            results.append(None)
        elif op == 'top':
            results.append(stack[-1])
        elif op == 'getMin':
            results.append(min_stack[-1])
    return results`
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
      "JavaScript": `function evalRPN(tokens) {
  const stack = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '+' || token === '-' || token === '*' || token === '/') {
      const b = stack.pop();
      const a = stack.pop();
      if (token === '+') stack.push(a + b);
      else if (token === '-') stack.push(a - b);
      else if (token === '*') stack.push(a * b);
      else if (token === '/') stack.push(Math.trunc(a / b));
    } else {
      stack.push(Number(token));
    }
  }
  return stack.pop();
}`,
      "TypeScript": `function evalRPN(tokens: string[]): number {
  const stack: number[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '+' || token === '-' || token === '*' || token === '/') {
      const b = stack.pop()!;
      const a = stack.pop()!;
      if (token === '+') stack.push(a + b);
      else if (token === '-') stack.push(a - b);
      else if (token === '*') stack.push(a * b);
      else if (token === '/') stack.push(Math.trunc(a / b));
    } else {
      stack.push(Number(token));
    }
  }
  return stack.pop()!;
}`,
      "Python": `def evalRPN(tokens: list) -> int:
    stack = []
    for token in tokens:
        if token in {'+', '-', '*', '/'}:
            b = stack.pop()
            a = stack.pop()
            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            elif token == '/':
                stack.append(int(a / b))
        else:
            stack.append(int(token))
    return stack.pop()`
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
      "JavaScript": `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prevIdx = stack.pop();
      answer[prevIdx] = i - prevIdx;
    }
    stack.push(i);
  }
  return answer;
}`,
      "TypeScript": `function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const answer = new Array<number>(n).fill(0);
  const stack: number[] = [];
  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prevIdx = stack.pop()!;
      answer[prevIdx] = i - prevIdx;
    }
    stack.push(i);
  }
  return answer;
}`,
      "Python": `def dailyTemperatures(temperatures: list) -> list:
    n = len(temperatures)
    answer = [0] * n
    stack = []
    for i in range(n):
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_idx = stack.pop()
            answer[prev_idx] = i - prev_idx
        stack.append(i)
    return answer`
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
      "JavaScript": `function simulateQueueWithStacks(operations, args) {
  const results = [];
  let inStack = [];
  let outStack = [];
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const arg = args[i];
    if (op === 'MyQueue') {
      inStack = [];
      outStack = [];
      results.push(null);
    } else if (op === 'push') {
      inStack.push(arg[0]);
      results.push(null);
    } else if (op === 'pop') {
      if (outStack.length === 0) {
        while (inStack.length > 0) outStack.push(inStack.pop());
      }
      results.push(outStack.pop());
    } else if (op === 'peek') {
      if (outStack.length === 0) {
        while (inStack.length > 0) outStack.push(inStack.pop());
      }
      results.push(outStack[outStack.length - 1]);
    } else if (op === 'empty') {
      results.push(inStack.length === 0 && outStack.length === 0);
    }
  }
  return results;
}`,
      "TypeScript": `function simulateQueueWithStacks(operations: string[], args: any[][]): any[] {
  const results: any[] = [];
  let inStack: number[] = [];
  let outStack: number[] = [];
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const arg = args[i];
    if (op === 'MyQueue') {
      inStack = [];
      outStack = [];
      results.push(null);
    } else if (op === 'push') {
      inStack.push(arg[0]);
      results.push(null);
    } else if (op === 'pop') {
      if (outStack.length === 0) {
        while (inStack.length > 0) outStack.push(inStack.pop()!);
      }
      results.push(outStack.pop());
    } else if (op === 'peek') {
      if (outStack.length === 0) {
        while (inStack.length > 0) outStack.push(inStack.pop()!);
      }
      results.push(outStack[outStack.length - 1]);
    } else if (op === 'empty') {
      results.push(inStack.length === 0 && outStack.length === 0);
    }
  }
  return results;
}`,
      "Python": `def simulateQueueWithStacks(operations: list, args: list) -> list:
    results = []
    in_stack = []
    out_stack = []
    for op, arg in zip(operations, args):
        if op == 'MyQueue':
            in_stack = []
            out_stack = []
            results.append(None)
        elif op == 'push':
            in_stack.append(arg[0])
            results.append(None)
        elif op == 'pop':
            if not out_stack:
                while in_stack:
                    out_stack.append(in_stack.pop())
            results.append(out_stack.pop())
        elif op == 'peek':
            if not out_stack:
                while in_stack:
                    out_stack.append(in_stack.pop())
            results.append(out_stack[-1])
        elif op == 'empty':
            results.append(len(in_stack) == 0 and len(out_stack) == 0)
    return results`
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
      "JavaScript": `function mergeTwoLists(list1, list2) {
  const dummy = new ListNode(0);
  let current = dummy;
  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      current.next = list1;
      list1 = list1.next;
    } else {
      current.next = list2;
      list2 = list2.next;
    }
    current = current.next;
  }
  current.next = list1 !== null ? list1 : list2;
  return dummy.next;
}`,
      "TypeScript": `function mergeTwoLists(list1: any, list2: any): any {
  const dummy = new ListNode(0);
  let current: any = dummy;
  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      current.next = list1;
      list1 = list1.next;
    } else {
      current.next = list2;
      list2 = list2.next;
    }
    current = current.next;
  }
  current.next = list1 !== null ? list1 : list2;
  return dummy.next;
}`,
      "Python": `def mergeTwoLists(list1, list2):
    dummy = ListNode(0)
    current = dummy
    while list1 and list2:
        if list1.val <= list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next
    current.next = list1 if list1 else list2
    return dummy.next`
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
      "JavaScript": `function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }
  while (fast !== null) {
    slow = slow.next;
    fast = fast.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}`,
      "TypeScript": `function removeNthFromEnd(head: any, n: number): any {
  const dummy = new ListNode(0, head);
  let fast: any = dummy;
  let slow: any = dummy;
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }
  while (fast !== null) {
    slow = slow.next;
    fast = fast.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}`,
      "Python": `def removeNthFromEnd(head, n: int):
    dummy = ListNode(0, head)
    fast = dummy
    slow = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        slow = slow.next
        fast = fast.next
    slow.next = slow.next.next
    return dummy.next`
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
      "JavaScript": `function hasCycle(head) {
  if (!head || !head.next) return false;
  let slow = head;
  let fast = head.next;
  while (slow !== fast) {
    if (!fast || !fast.next) return false;
    slow = slow.next;
    fast = fast.next.next;
  }
  return true;
}`,
      "TypeScript": `function hasCycle(head: any): boolean {
  if (!head || !head.next) return false;
  let slow: any = head;
  let fast: any = head.next;
  while (slow !== fast) {
    if (!fast || !fast.next) return false;
    slow = slow.next;
    fast = fast.next.next;
  }
  return true;
}`,
      "Python": `def hasCycle(head) -> bool:
    if not head or not head.next:
        return False
    slow = head
    fast = head.next
    while slow != fast:
        if not fast or not fast.next:
            return False
        slow = slow.next
        fast = fast.next.next
    return True`
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
      "JavaScript": `function mergeKLists(lists) {
  if (!lists || lists.length === 0) return null;
  function mergeTwo(l1, l2) {
    const dummy = new ListNode(0);
    let cur = dummy;
    while (l1 && l2) {
      if (l1.val <= l2.val) {
        cur.next = l1;
        l1 = l1.next;
      } else {
        cur.next = l2;
        l2 = l2.next;
      }
      cur = cur.next;
    }
    cur.next = l1 || l2;
    return dummy.next;
  }
  while (lists.length > 1) {
    const merged = [];
    for (let i = 0; i < lists.length; i += 2) {
      const l1 = lists[i];
      const l2 = i + 1 < lists.length ? lists[i + 1] : null;
      merged.push(mergeTwo(l1, l2));
    }
    lists = merged;
  }
  return lists[0];
}`,
      "TypeScript": `function mergeKLists(lists: any[]): any {
  if (!lists || lists.length === 0) return null;
  function mergeTwo(l1: any, l2: any): any {
    const dummy = new ListNode(0);
    let cur: any = dummy;
    while (l1 && l2) {
      if (l1.val <= l2.val) {
        cur.next = l1;
        l1 = l1.next;
      } else {
        cur.next = l2;
        l2 = l2.next;
      }
      cur = cur.next;
    }
    cur.next = l1 || l2;
    return dummy.next;
  }
  let currentLists = [...lists];
  while (currentLists.length > 1) {
    const merged: any[] = [];
    for (let i = 0; i < currentLists.length; i += 2) {
      const l1 = currentLists[i];
      const l2 = i + 1 < currentLists.length ? currentLists[i + 1] : null;
      merged.push(mergeTwo(l1, l2));
    }
    currentLists = merged;
  }
  return currentLists[0];
}`,
      "Python": `def mergeKLists(lists: list):
    if not lists:
        return None
    def merge_two(l1, l2):
        dummy = ListNode(0)
        cur = dummy
        while l1 and l2:
            if l1.val <= l2.val:
                cur.next = l1
                l1 = l1.next
            else:
                cur.next = l2
                l2 = l2.next
            cur = cur.next
        cur.next = l1 or l2
        return dummy.next

    while len(lists) > 1:
        merged = []
        for i in range(0, len(lists), 2):
            l1 = lists[i]
            l2 = lists[i + 1] if i + 1 < len(lists) else None
            merged.append(merge_two(l1, l2))
        lists = merged
    return lists[0]`
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
      "JavaScript": `function searchRotated(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}`,
      "TypeScript": `function searchRotated(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}`,
      "Python": `def searchRotated(nums: list, target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`
    }
  }
};
