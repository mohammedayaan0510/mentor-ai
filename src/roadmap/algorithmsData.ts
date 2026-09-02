import { RoadmapTopic } from '../types';

export const ALGORITHMS_TOPICS: RoadmapTopic[] = [
  {
    id: 'algo-1',
    title: 'Searching & Binary Search',
    category: 'Algorithms',
    description: 'Linear search, Binary search on sorted arrays, search space reduction, lower/upper bounds, and rotated array search.',
    duration: '4 hours',
    xpReward: 160,
    level: 'Intermediate',
    practiceTopic: 'Searching',
    prerequisites: ['Arrays & Dynamic Sizing'],
    notes: {
      concept: 'Binary Search is a divide-and-conquer algorithm that locates a target value within a sorted collection by repeatedly halving the active search space. By comparing the target with the middle element, it eliminates 50% of remaining candidates in each step, achieving $O(\\log N)$ time complexity.',
      whyItMatters: 'Binary search is one of the most powerful algorithms in computer science. Beyond simple array lookups, it generalizes to "Binary Search on Answer Space"—finding optimal thresholds (e.g. minimum capacity required, maximum speed feasible) across monotonic functions.',
      coreIdeas: [
        'Monotonicity / Sorted Invariant: The search space must satisfy a monotonic predicate (elements are sorted or evaluate to `[False, False, ..., True, True]`).',
        'Midpoint Calculation: Compute `mid = left + Math.floor((right - left) / 2)` to prevent 32-bit integer overflow.',
        'Search Space Halving: If `arr[mid] < target`, update `left = mid + 1`; else if `arr[mid] > target`, update `right = mid - 1`.',
        'Boundary Conditions: The loop condition `while (left <= right)` vs `while (left < right)` depends on whether `right` is an inclusive index ($N - 1$) or exclusive bound ($N$).'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Standard Exact Match Binary Search
function binarySearch(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1; // Inclusive right bound

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2); // Prevent overflow

    if (nums[mid] === target) {
      return mid; // Target found
    } else if (nums[mid] < target) {
      left = mid + 1; // Discard left half
    } else {
      right = mid - 1; // Discard right half
    }
  }

  return -1; // Target not found
}`,
          explanation: '`left <= right` guarantees all possible candidates are inspected before concluding target is absent.'
        },
        {
          language: 'Python',
          code: `# Python Lower Bound (First position >= target)
def lower_bound(nums: list[int], target: int) -> int:
    left, right = 0, len(nums)
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left`,
          explanation: 'Lower bound finds the exact insertion index for preserving sorted order.'
        }
      ],
      example: {
        title: 'Search in Rotated Sorted Array',
        description: 'Finds target index in an array sorted in ascending order then rotated at some unknown pivot.',
        code: `function searchRotatedArray(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) return mid;

    // Check which half is strictly sorted
    if (nums[left] <= nums[mid]) {
      // Left half is sorted
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1; // Target is in left range
      } else {
        left = mid + 1;  // Target is in right range
      }
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;  // Target is in right range
      } else {
        right = mid - 1; // Target is in left range
      }
    }
  }

  return -1;
}`,
        explanation: 'At least one half of a rotated sorted array is always strictly sorted, allowing binary search logic.'
      },
      commonPatterns: [
        {
          name: 'Exact Match Binary Search',
          description: 'Locating an exact element index in a sorted array in O(log N) time.'
        },
        {
          name: 'Binary Search on the Answer Space',
          description: 'Searching for the minimum or maximum feasible integer that satisfies a monotonic boolean feasibility function (e.g. Koko Eating Bananas, Capacity to Ship Packages).'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'The input array is explicitly stated to be sorted (or rotated sorted).',
          'The problem requires finding an element or boundary in $O(\\log N)$ time.',
          'Optimization problems asking for "minimum speed to finish in time" or "maximum capacity feasible".'
        ],
        clues: [
          '"Search in sorted array in O(log N)" -> Standard Binary Search.',
          '"Find first bad version / lower bound" -> Boundary binary search `left < right`.',
          '"Find minimum X such that condition is met" -> Binary Search on Answer space with a feasibility checker `isFeasible(mid)`.'
        ],
        askYourself: [
          'If value X is valid/invalid, does that guarantee all values > X (or < X) share the same property?',
          'What are the minimum possible and maximum possible bounds for the answer range?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Using `(left + right) / 2` causing integer overflow in languages with fixed 32-bit integer limits.',
          fix: 'Always use `left + (right - left) / 2`.'
        },
        {
          mistake: 'Infinite loops caused by incorrect pointer adjustments (e.g. `left = mid` without integer division rounding up).',
          fix: 'Use `left = mid + 1` and `right = mid - 1` for standard inclusive bounds.'
        }
      ],
      complexity: {
        time: 'O(log N) iterations since search space is halved every step',
        space: 'O(1) auxiliary space for iterative approach'
      },
      whenToUse: [
        'Finding an item in a sorted array or list.',
        'Finding the first or last occurrence of a duplicate in a sorted array.',
        'Optimization problems where the answer domain is monotonic (Binary Search on Answer).'
      ],
      keyTakeaways: [
        'Repeatedly halves search space in $O(\\log N)$ time.',
        'Input MUST satisfy a sorted or monotonic feasibility property.',
        'Always calculate `mid = left + (right - left) / 2` to prevent overflow.'
      ]
    }
  },
  {
    id: 'algo-2',
    title: 'Sorting Techniques & Complexity',
    category: 'Algorithms',
    description: 'Comparison vs non-comparison sorts, Quicksort, Mergesort, stability, and O(N log N) lower bound.',
    duration: '4 hours',
    xpReward: 160,
    level: 'Intermediate',
    practiceTopic: 'Sorting',
    prerequisites: ['Searching & Binary Search'],
    notes: {
      concept: 'Sorting is the process of arranging elements of a collection into a systematic order (numerical or alphabetical). Comparison-based sorting algorithms have a theoretical lower bound of $\\Omega(N \\log N)$ time complexity. Common algorithms include Merge Sort (divide-and-conquer, stable) and Quick Sort (partition-based, in-place).',
      whyItMatters: 'Sorting is a prerequisite for many optimal algorithms (binary search, two pointers, greedy interval scheduling, duplicate detection). Choosing the right sorting method balances time, space, and stability constraints.',
      coreIdeas: [
        'Merge Sort: Divides array into halves, sorts recursively, and merges sorted halves in $O(N \\log N)$ guaranteed time and $O(N)$ auxiliary space (Stable).',
        'Quick Sort: Selects a pivot, partitions elements ($< \\text{pivot}$ left, $> \\text{pivot}$ right), and recurses in average $O(N \\log N)$ time and $O(\\log N)$ space (In-Place).',
        'Stability: A sorting algorithm is stable if elements with identical keys preserve their original relative order.',
        'Non-Comparison Sorts: Counting Sort and Radix Sort achieve $O(N + K)$ linear time for bounded integer ranges.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Merge Sort Implementation
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
          explanation: 'Merge sort guarantees O(N log N) performance regardless of input distribution.'
        },
        {
          language: 'Python',
          code: `# Python In-Place QuickSort with Lomuto Partition
def quicksort(arr: list[int], low: int, high: int):
    if low < high:
        pivot_idx = partition(arr, low, high)
        quicksort(arr, low, pivot_idx - 1)
        quicksort(arr, pivot_idx + 1, high)

def partition(arr: list[int], low: int, high: int) -> int:
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
          explanation: 'Quick sort partitions arrays in place without allocating auxiliary arrays.'
        }
      ],
      example: {
        title: 'Custom Multi-Attribute Comparator Sort',
        description: 'Sorting students by score descending, then by name alphabetically if scores tie.',
        code: `interface Student { name: string; score: number; }

const students: Student[] = [
  { name: "Alice", score: 90 },
  { name: "Bob", score: 95 },
  { name: "Charlie", score: 90 }
];

students.sort((a, b) => {
  if (b.score !== a.score) {
    return b.score - a.score; // Higher score first
  }
  return a.name.localeCompare(b.name); // Alphabetical tie-breaker
});`,
        explanation: 'Custom comparator returning negative, zero, or positive values enables composite sorting.'
      },
      commonPatterns: [
        {
          name: 'Sort + Two Pointers',
          description: 'Sorting the input array first to enable linear two-pointer scanning (e.g. 3Sum, 4Sum).'
        },
        {
          name: 'Interval Sorting by Start Time',
          description: 'Sorting meeting intervals by starting times to merge overlapping intervals in $O(N \\log N)$ time.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Pre-sorting the array simplifies all downstream comparisons.',
          'Grouping intervals by start or end time.',
          'Finding kth largest elements or counting pairs with specific differences.'
        ],
        clues: [
          '"Merge overlapping intervals" -> Sort intervals by start time `intervals.sort((a, b) => a[0] - b[0])`.',
          '"3Sum / 4Sum" -> Sort array first, then fix one element and use Two Pointers for remaining.',
          '"Custom sorting order" -> Write a two-parameter comparator `(a, b) => ...`.'
        ],
        askYourself: [
          'Does this problem require a stable sort (preserving relative order of equal items)?',
          'Is the range of values small enough that Counting Sort $O(N + K)$ can beat $O(N \\log N)$?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Using JavaScript `.sort()` without a comparator on numbers (`[10, 2].sort()` yields `[10, 2]` because it sorts lexicographically).',
          fix: 'Always supply numeric comparator `(a, b) => a - b` for numbers.'
        },
        {
          mistake: 'Picking the first element as pivot in Quicksort on already-sorted arrays, triggering $O(N^2)$ worst-case time.',
          fix: 'Pick random pivots or use median-of-three pivot selection.'
        }
      ],
      complexity: {
        time: 'Merge Sort: O(N log N) always | Quick Sort: O(N log N) average, O(N²) worst | Heap Sort: O(N log N)',
        space: 'Merge Sort: O(N) space | Quick Sort: O(log N) stack | Heap Sort: O(1) space'
      },
      whenToUse: [
        'Preprocessing data to enable binary search or two pointers.',
        'Merging overlapping intervals and calculating order statistics.'
      ],
      keyTakeaways: [
        'Comparison sorts cannot beat $\\Omega(N \\log N)$ theoretical lower bound.',
        'Merge Sort is stable and guaranteed $O(N \\log N)$; Quick Sort is in-place and fast in practice.',
        'Always supply `(a, b) => a - b` when sorting numbers in JavaScript.'
      ]
    }
  },
  {
    id: 'algo-3',
    title: 'Two Pointers Technique',
    category: 'Algorithms',
    description: 'Opposite-end inward pointers, fast and slow pointers, running collision indices, and array partitioning.',
    duration: '3.5 hours',
    xpReward: 150,
    level: 'Intermediate',
    practiceTopic: 'Two Pointers',
    prerequisites: ['Arrays & Dynamic Sizing', 'Sorting Techniques & Complexity'],
    notes: {
      concept: 'The Two Pointers technique involves using two integer index variables to traverse a linear data structure (array, string, or linked list) simultaneously. Pointers can move in opposite directions towards each other (inward collision) or in the same direction at differing speeds (fast and slow).',
      whyItMatters: 'Two pointers frequently reduce $O(N^2)$ nested loop algorithms down to $O(N)$ linear time by eliminating redundant comparisons on sorted or monotonic sequences.',
      coreIdeas: [
        'Opposite-Direction Pointers: `left = 0`, `right = n - 1`; adjust pointers based on condition comparisons (e.g. sorted Two Sum, Container With Most Water).',
        'Same-Direction (Fast & Slow): `slow` writes or tracks milestones; `fast` scans forward (e.g. remove duplicates in-place, linked list cycle).',
        'Elimination Invariant: At each step, one pointer movement safely eliminates a whole class of candidate pairs that cannot possibly be optimal.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Two Pointers on Sorted Array (Two Sum II)
function twoSumSorted(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1]; // 1-indexed result
    } else if (sum < target) {
      left++; // Need larger sum
    } else {
      right--; // Need smaller sum
    }
  }

  return [];
}`,
          explanation: 'Because array is sorted, moving left increases sum; moving right decreases sum.'
        },
        {
          language: 'Python',
          code: `# Python Fast and Slow Pointers: Remove Duplicates in-place
def remove_duplicates(nums: list[int]) -> int:
    if not nums:
        return 0
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1`,
          explanation: '`fast` scans the array while `slow` writes unique values in-place.'
        }
      ],
      example: {
        title: 'Container With Most Water',
        description: 'Finds two vertical lines that together with the x-axis form a container holding the maximum water.',
        code: `function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    const width = right - left;
    const currentWater = width * Math.min(height[left], height[right]);
    maxWater = Math.max(maxWater, currentWater);

    // Greedily move the shorter boundary inward
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxWater;
}`,
        explanation: 'Moving the taller boundary inward cannot increase area (width shrinks, height is bounded by the shorter line).'
      },
      commonPatterns: [
        {
          name: 'Inward Collision on Sorted Array',
          description: 'Solving Pair Sum, Palindrome validation, and Container With Most Water.'
        },
        {
          name: 'Fast/Slow Read-Write Compaction',
          description: 'Removing duplicates or moving zeros in-place without auxiliary arrays.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'The array or string is sorted, or can be sorted beforehand in $O(N \\log N)$ time.',
          'Searching for pairs or triplets satisfying an exact sum or inequality constraint.',
          'Partitioning or modifying elements in place with $O(1)$ extra space.'
        ],
        clues: [
          '"Find two elements in sorted array that sum to target" -> Inward Two Pointers.',
          '"Remove duplicates / zeroes in-place in O(1) space" -> Fast and Slow read/write pointers.',
          '"Is palindrome / reverse array" -> Left and right meeting in middle.'
        ],
        askYourself: [
          'Does moving the left pointer monotonically increase the value, and right pointer decrease it?',
          'Will moving one pointer safely eliminate invalid candidates without missing the optimal solution?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Applying opposite-direction pointers on an unsorted array where sum monotonicity does not hold.',
          fix: 'Ensure the array is sorted first if problem logic relies on directional values.'
        },
        {
          mistake: 'Using `left <= right` when comparing distinct pairs, accidentally pairing an element with itself.',
          fix: 'Use `left < right` when elements must be distinct.'
        }
      ],
      complexity: {
        time: 'O(N) single pass across array elements (plus O(N log N) if sorting required)',
        space: 'O(1) auxiliary memory'
      },
      whenToUse: [
        'Finding pairs or triplets in sorted arrays with target sums.',
        'Comparing symmetric strings/arrays (palindromes, reversals).',
        'Filtering or modifying arrays in-place with $O(1)$ space.'
      ],
      keyTakeaways: [
        'Reduces $O(N^2)$ pair searches to $O(N)$ linear scans.',
        'Opposite-end pointers require sorted or monotonic properties.',
        'Fast & slow pointers handle in-place array transformations with $O(1)$ space.'
      ]
    }
  },
  {
    id: 'algo-4',
    title: 'Sliding Window Technique',
    category: 'Algorithms',
    description: 'Fixed-size windows, dynamic variable-size windows, expand/shrink invariants, and frequency tracking.',
    duration: '4 hours',
    xpReward: 160,
    level: 'Intermediate',
    practiceTopic: 'Sliding Window',
    prerequisites: ['Arrays & Dynamic Sizing', 'Hash Maps & Hash Sets (O(1) Hashing)'],
    notes: {
      concept: 'The Sliding Window technique is an algorithmic pattern where a continuous sub-segment ("window") of an array or string is maintained and shifted across the data. Instead of recomputing properties over the entire window from scratch ($O(K)$ per step), the window is updated incrementally in $O(1)$ time by adding the incoming element and subtracting the outgoing element.',
      whyItMatters: 'Sliding Window transforms $O(N \\cdot K)$ or $O(N^2)$ brute-force subarray/substring algorithms into optimal $O(N)$ linear-time solutions.',
      coreIdeas: [
        'Fixed Window: Window size $K$ is constant; shift right by adding `arr[i]` and removing `arr[i - K]`.',
        'Variable Window (Dynamic): Pointers `left` and `right`. Expand `right` to satisfy a condition; shrink `left` when condition is violated or to find minimal window.',
        'Incremental State: Maintain sum, maximum, or character frequency map dynamically in $O(1)$ amortized time.',
        'Two-Pointer Foundation: Sliding window is a specialized continuous subarray application of two pointers.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Fixed Window: Maximum sum of subarray of size K
function maxSubarraySumK(nums: number[], k: number): number {
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += nums[i]; // Initial window
  }

  let maxSum = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k]; // Slide window in O(1)
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}`,
          explanation: 'Subtracting leaving element and adding entering element maintains window sum in O(1).'
        },
        {
          language: 'Python',
          code: `# Variable Window: Longest Substring Without Repeating Characters
def length_of_longest_substring(s: str) -> int:
    char_index = {}
    left = 0
    max_len = 0

    for right, char in enumerate(s):
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1 # Shrink left past duplicate
        char_index[char] = right
        max_len = max(max_len, right - left + 1)

    return max_len`,
          explanation: 'Jumping `left` past the duplicate index keeps window unique in O(N) time.'
        }
      ],
      example: {
        title: 'Minimum Size Subarray Sum (Variable Window)',
        description: 'Finds the minimal length of a contiguous subarray of which the sum is >= target.',
        code: `function minSubArrayLen(target: number, nums: number[]): number {
  let left = 0;
  let currentSum = 0;
  let minLen = Infinity;

  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right]; // Expand window right

    // Shrink window from left as long as condition is satisfied
    while (currentSum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      currentSum -= nums[left];
      left++;
    }
  }

  return minLen === Infinity ? 0 : minLen;
}`,
        explanation: 'Both `left` and `right` pointers move at most N times, running in strict O(N) time.'
      },
      commonPatterns: [
        {
          name: 'Fixed-Length Subarray Computation',
          description: 'Averaging, summing, or counting matching substrings of fixed length $K$.'
        },
        {
          name: 'Variable-Length Optimization',
          description: 'Finding longest valid or shortest satisfying contiguous subarray/substring.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Problem asks for longest, shortest, or number of contiguous subarrays or substrings.',
          'Condition depends on elements inside a bounded or expandable range.',
          'Brute force checking all subarrays takes $O(N^2)$ or $O(N^3)$.'
        ],
        clues: [
          '"Longest substring without repeating characters" -> Variable window with last-seen character index map.',
          '"Minimum window substring containing target chars" -> Variable window with target frequency counter.',
          '"Max sum of contiguous subarray of length K" -> Fixed window of size K.'
        ],
        askYourself: [
          'Can I expand `right` to make the window valid, and shrink `left` when condition is violated?',
          'How do I maintain the window state in O(1) time as elements enter and leave?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Recomputing window sums from scratch inside the loop, creating an $O(N \\cdot K)$ bottleneck.',
          fix: 'Update state incrementally by adding incoming and subtracting outgoing values.'
        },
        {
          mistake: 'Moving `left` backwards or forgetting to update frequency counts during window shrinking.',
          fix: 'Always subtract `nums[left]` from tracking state when advancing `left++`.'
        }
      ],
      complexity: {
        time: 'O(N) amortized because each pointer advances at most N times',
        space: 'O(1) auxiliary space or O(K) for character frequency map'
      },
      whenToUse: [
        'Problems mentioning "contiguous subarray", "continuous substring", or "window of size K".',
        'Finding longest/shortest valid contiguous slices matching constraints.'
      ],
      keyTakeaways: [
        'Updates window state incrementally in $O(1)$ instead of recalculating.',
        'Expand with `right`, shrink with `left` when condition breaks.',
        'Guarantees $O(N)$ linear time since each element is visited at most twice.'
      ]
    }
  },
  {
    id: 'algo-5',
    title: 'Recursion & Backtracking',
    category: 'Algorithms',
    description: 'Call stack unwinding, base cases, state tree exploration, choose-explore-unchoose paradigm, and combinatorial generation.',
    duration: '4.5 hours',
    xpReward: 180,
    level: 'Intermediate',
    practiceTopic: 'Recursion',
    prerequisites: ['Functions, Scope & Closures'],
    notes: {
      concept: 'Recursion is a programming technique where a function solves a problem by calling itself with smaller subproblem inputs until reaching a termination Base Case. Backtracking is a systematic algorithmic paradigm for solving constraint satisfaction problems (combinations, permutations, puzzles) by incrementally building candidates and abandoning ("backtracking") candidates as soon as they are determined to be invalid.',
      whyItMatters: 'Recursion and Backtracking solve complex combinatorial search spaces (Sudoku, N-Queens, Subsets, Graph Traversals, Tree Traversals) where iterative loops cannot dynamically handle arbitrary branching depths.',
      coreIdeas: [
        'Base Case: The condition under which recursion terminates and returns without further self-calls.',
        'Recursive Step: Breaking current problem into one or more smaller subproblems.',
        'Choose-Explore-Unchoose: 1. Choose a decision path -> 2. Explore recursively -> 3. Unchoose (revert state) to allow exploring sibling paths.',
        'Pruning: Eliminating recursive branches early if they cannot possibly lead to valid solutions.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Backtracking: Subsets / Power Set
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];

  function backtrack(index: number, currentSubset: number[]) {
    // Collect snapshot of current subset
    result.push([...currentSubset]);

    for (let i = index; i < nums.length; i++) {
      // 1. Choose
      currentSubset.push(nums[i]);
      // 2. Explore
      backtrack(i + 1, currentSubset);
      // 3. Unchoose (Backtrack)
      currentSubset.pop();
    }
  }

  backtrack(0, []);
  return result;
}`,
          explanation: 'Pushing and popping from `currentSubset` explores the $2^N$ combinatorial search tree with O(N) space.'
        },
        {
          language: 'Python',
          code: `# Python Permutations with Backtracking
def permute(nums: list[int]) -> list[list[int]]:
    result = []
    
    def backtrack(curr: list[int], remaining: set[int]):
        if not remaining:
            result.append(list(curr))
            return
        for num in list(remaining):
            # Choose, Explore, Unchoose
            curr.append(num)
            remaining.remove(num)
            backtrack(curr, remaining)
            curr.pop()
            remaining.add(num)

    backtrack([], set(nums))
    return result`,
          explanation: 'Generates all $N!$ permutations by tracking available candidates.'
        }
      ],
      example: {
        title: 'Combination Sum',
        description: 'Finds all unique combinations in candidates where numbers sum to target.',
        code: `function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  candidates.sort((a, b) => a - b); // Sorting enables pruning

  function backtrack(startIdx: number, remain: number, path: number[]) {
    if (remain === 0) {
      result.push([...path]); // Found valid combination
      return;
    }

    for (let i = startIdx; i < candidates.length; i++) {
      if (candidates[i] > remain) break; // Pruning: remaining numbers too large

      path.push(candidates[i]); // Choose
      backtrack(i, remain - candidates[i], path); // Explore (can reuse current element)
      path.pop(); // Unchoose
    }
  }

  backtrack(0, target, []);
  return result;
}`,
        explanation: 'Pruning `if (candidates[i] > remain) break` cuts down thousands of invalid recursive calls.'
      },
      commonPatterns: [
        {
          name: 'Combinations & Subsets ($2^N$)',
          description: 'Exploring decisions whether to include or exclude each element.'
        },
        {
          name: 'Permutations ($N!$)',
          description: 'Arranging elements where order matters.'
        },
        {
          name: 'Grid & Maze Search (DFS Backtracking)',
          description: 'Exploring paths in a matrix while marking cells visited and unmarking upon return.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Generating all combinations, subsets, permutations, or valid bracket sequences.',
          'Solving grid puzzles (Sudoku, N-Queens, Word Search).',
          'Input constraints are small ($N \\le 15$ or $N \\le 20$), signaling exponential complexity.'
        ],
        clues: [
          '"Generate all subsets / power set" -> Backtrack with `index + 1` recursion ($2^N$).',
          '"Generate all permutations" -> Backtrack with used set ($N!$).',
          '"Word Search in 2D Board" -> DFS with in-place cell marking and backtracking unmarking.'
        ],
        askYourself: [
          'What is my base case? When should I collect the result and return?',
          'What state change needs to be undone ("unchoose") after returning from the recursive call?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Missing base case, resulting in `Maximum call stack size exceeded` errors.',
          fix: 'Always define and verify base case return conditions before writing recursive calls.'
        },
        {
          mistake: 'Pushing references to the mutating `path` array (`result.push(path)`) instead of snapshots (`result.push([...path])`).',
          fix: 'Always shallow-copy `[...path]` when appending to the final result list.'
        }
      ],
      complexity: {
        time: 'Subsets: O(2^N) | Permutations: O(N!) | Tree DFS: O(V + E)',
        space: 'O(N) recursion call stack depth'
      },
      whenToUse: [
        'Generating all permutations, combinations, or partitions of a dataset.',
        'Solving constraint satisfaction puzzles (Sudoku, N-Queens, Word Search).'
      ],
      keyTakeaways: [
        'Always define explicit base cases to prevent stack overflow.',
        'Follow the Choose -> Explore -> Unchoose paradigm.',
        'Prune invalid branches early to avoid combinatorial explosions.'
      ]
    }
  },
  {
    id: 'algo-6',
    title: 'Greedy Algorithms',
    category: 'Algorithms',
    description: 'Greedy-choice property, optimal substructure, local vs global optima, interval scheduling, and fractional knapsack.',
    duration: '3.5 hours',
    xpReward: 150,
    level: 'Intermediate',
    practiceTopic: 'Greedy',
    prerequisites: ['Sorting Techniques & Complexity'],
    notes: {
      concept: 'A Greedy Algorithm builds a solution piece by piece, always choosing the immediate next step that offers the most obvious and immediate benefit (local optimum) with the goal that these choices lead to a globally optimal solution. Unlike Dynamic Programming, greedy algorithms never reconsider or backtrack on past choices.',
      whyItMatters: 'When applicable, greedy algorithms are exceptionally fast (typically $O(N)$ or $O(N \\log N)$) and require very little memory compared to full dynamic programming state matrices.',
      coreIdeas: [
        'Greedy Choice Property: A globally optimal solution can be arrived at by making locally optimal choices without looking back.',
        'Optimal Substructure: An optimal solution to the problem contains optimal solutions to its subproblems.',
        'Sorting Prerequisite: Most greedy algorithms require sorting the input beforehand (e.g. by end time, profit ratio, or weight).',
        'Proof of Correctness: Greedy algorithms require proving that making a greedy choice never closes off the optimal solution ("Greedy Stays Ahead" or Exchange Arguments).'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Non-overlapping Intervals (Interval Scheduling)
function eraseOverlapIntervals(intervals: number[][]): number {
  if (intervals.length === 0) return 0;

  // Greedy Choice: Sort by earliest end time
  intervals.sort((a, b) => a[1] - b[1]);

  let nonOverlappingCount = 1;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] >= lastEnd) {
      // No overlap: keep interval
      nonOverlappingCount++;
      lastEnd = intervals[i][1];
    }
  }

  return intervals.length - nonOverlappingCount; // Removals required
}`,
          explanation: 'Sorting by earliest finish time leaves the maximal remaining time for future intervals.'
        },
        {
          language: 'Python',
          code: `# Python Jump Game I (Can Reach End)
def can_jump(nums: list[int]) -> bool:
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False # Cannot reach this index
        max_reach = max(max_reach, i + jump)
        if max_reach >= len(nums) - 1:
            return True
    return True`,
          explanation: 'Tracking maximal reachable boundary greedily determines feasibility in O(N) time.'
        }
      ],
      example: {
        title: 'Gas Station Circuit Tour',
        description: 'Determines the starting gas station index to complete a circular tour.',
        code: `function canCompleteCircuit(gas: number[], cost: number[]): number {
  let totalTank = 0;
  let currentTank = 0;
  let startingStation = 0;

  for (let i = 0; i < gas.length; i++) {
    const net = gas[i] - cost[i];
    totalTank += net;
    currentTank += net;

    // If current tank drops below 0, cannot start at or before index i
    if (currentTank < 0) {
      startingStation = i + 1; // Greedily reset start to next station
      currentTank = 0;
    }
  }

  return totalTank >= 0 ? startingStation : -1;
}`,
        explanation: 'If total gas >= total cost, a valid circuit is guaranteed to exist starting after the last deficit.'
      },
      commonPatterns: [
        {
          name: 'Interval Scheduling / Merging',
          description: 'Sorting intervals by start or end times to minimize overlaps or resource allocation.'
        },
        {
          name: 'Maximal Reach / Frontier Tracking',
          description: 'Expanding reach boundaries in single passes (e.g. Jump Game, Video Stitching).'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Maximizing or minimizing a quantity with step-by-step choices.',
          'Intervals where sorting by end time or start time establishes an invariant.',
          'Tracking the furthest reachable index in a single forward pass.'
        ],
        clues: [
          '"Maximum non-overlapping intervals" -> Sort by end time, greedily pick earliest finishing interval.',
          '"Can reach last index (Jump Game)" -> Track `max_reach` index at each step.',
          '"Assign cookies / task scheduling" -> Sort both arrays and greedily match smallest feasible.'
        ],
        askYourself: [
          'Does picking the best immediate option ever eliminate the globally optimal outcome?',
          'If choosing item A now might restrict better choices later, do I need Dynamic Programming instead?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Applying greedy logic to problems that require global trade-offs (e.g. 0/1 Knapsack, Coin Change with arbitrary denominations).',
          fix: 'Verify greedy choice property; if choosing locally optimal element closes off global optimum, use Dynamic Programming.'
        },
        {
          mistake: 'Sorting by wrong dimension (e.g. sorting intervals by start time instead of end time for scheduling).',
          fix: 'Sorting by end time guarantees maximal room for subsequent intervals.'
        }
      ],
      complexity: {
        time: 'O(N log N) dominated by initial sorting step (or O(N) if already sorted)',
        space: 'O(1) auxiliary space'
      },
      whenToUse: [
        'Interval scheduling, merging intervals, meeting room assignments.',
        'Problems with clear monotonic or local-optimal invariants (Huffman coding, Kruskal\'s MST, Dijkstra).'
      ],
      keyTakeaways: [
        'Makes the best immediate local decision at each step without backtracking.',
        'Often requires sorting the input as a prerequisite.',
        'Use DP instead of Greedy when future choices affect feasibility of past decisions.'
      ]
    }
  },
  {
    id: 'algo-7',
    title: 'Dynamic Programming (DP)',
    category: 'Algorithms',
    description: 'Overlapping subproblems, optimal substructure, top-down memoization, bottom-up tabulation, state transitions, and 1D/2D patterns.',
    duration: '5 hours',
    xpReward: 200,
    level: 'Advanced',
    practiceTopic: 'Dynamic Programming',
    prerequisites: ['Recursion & Backtracking'],
    notes: {
      concept: 'Dynamic Programming (DP) is an algorithmic optimization method for solving complex problems by breaking them down into simpler, overlapping subproblems. By storing and reusing the solutions to previously solved subproblems (memoization or tabulation), DP eliminates exponential redundant computations and achieves polynomial time.',
      whyItMatters: 'DP is the definitive technique for combinatorial optimization (shortest paths, minimum cost, maximum profit, string edit distances, knapsack problems). It transforms $O(2^N)$ brute-force recursion into $O(N)$ or $O(N^2)$ solutions.',
      coreIdeas: [
        'Overlapping Subproblems: The same small subproblems are solved repeatedly in a naive recursion tree.',
        'Optimal Substructure: The optimal solution to the overall problem can be constructed from optimal solutions of its subproblems.',
        'Top-Down with Memoization: Start at original problem, recurse downwards, and cache results in a table/map.',
        'Bottom-Up Tabulation: Start at smallest base cases, iteratively fill a DP table, and compute target state linearly.',
        'Space Optimization: If state $dp[i]$ only depends on $dp[i-1]$ and $dp[i-2]$, reduce space from $O(N)$ to $O(1)$ variables.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Climbing Stairs (Fibonacci DP pattern)
// 1. Bottom-up Tabulation O(N) Time, O(1) Space
function climbStairs(n: number): number {
  if (n <= 2) return n;

  let prev2 = 1; // Base case: step 1
  let prev1 = 2; // Base case: step 2

  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2; // State transition: dp[i] = dp[i-1] + dp[i-2]
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}`,
          explanation: 'State transition `dp[i] = dp[i-1] + dp[i-2]` computed with two rolling variables in O(1) space.'
        },
        {
          language: 'Python',
          code: `# Python Top-Down with @functools.cache
from functools import lru_cache

@lru_cache(maxsize=None)
def coin_change_memo(amount: int, coins: tuple[int, ...]) -> int:
    if amount == 0:
        return 0
    if amount < 0:
        return float('inf')

    min_coins = float('inf')
    for coin in coins:
        res = coin_change_memo(amount - coin, coins)
        if res != float('inf'):
            min_coins = min(min_coins, 1 + res)
    return min_coins`,
          explanation: '`@lru_cache` memoizes overlapping subproblems automatically in Python.'
        }
      ],
      example: {
        title: 'Coin Change (Fewest Coins for Target Amount)',
        description: 'Bottom-up 1D DP table computing minimal coins needed to make amount.',
        code: `function coinChange(coins: number[], amount: number): number {
  // dp[i] represents minimum coins needed to make amount i
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // Base case: 0 coins for amount 0

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], 1 + dp[i - coin]); // State transition
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
        explanation: 'Fills DP table iteratively from 0 up to amount in O(Amount * Coins) time.'
      },
      commonPatterns: [
        {
          name: '1D State DP (Fibonacci, House Robber, Coin Change)',
          description: 'State `dp[i]` depends on a fixed window of preceding states `dp[i-1]`, `dp[i-2]`, etc.'
        },
        {
          name: '2D Grid & String DP (Longest Common Subsequence, Edit Distance)',
          description: 'State `dp[i][j]` represents prefixes of two strings or coordinates in a grid.'
        },
        {
          name: '0/1 Knapsack Pattern',
          description: 'Deciding whether to take or leave items given a bounded capacity weight limit.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Problem asks for max/min cost, count of distinct ways, or boolean possibility.',
          'Decisions at current step depend on decisions at earlier steps.',
          'Subproblems overlap (solving the exact same smaller question multiple times).'
        ],
        clues: [
          '"Number of unique ways to climb stairs / reach target" -> `dp[i] = dp[i-1] + dp[i-2]`.',
          '"Maximum profit without picking adjacent houses" -> `dp[i] = Math.max(dp[i-1], nums[i] + dp[i-2])`.',
          '"Fewest coins to make amount" -> `dp[i] = 1 + min(dp[i - coin])`.',
          '"Edit Distance / Longest Common Subsequence" -> 2D DP matrix `dp[i][j]`.'
        ],
        askYourself: [
          'What is the state? What parameters uniquely identify a subproblem?',
          'What is the recurrence relation linking state `dp[i]` to previous states?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Jumping straight into code without formally writing down the state definition and transition recurrence.',
          fix: 'Explicitly write: 1. State definition (`dp[i] = ...`), 2. Base cases, 3. Transition equation.'
        },
        {
          mistake: 'Allocating full $O(N \\times M)$ tables when only the previous row is required.',
          fix: 'Use rolling arrays (`dp[2][M]` or single `dp[M]`) to optimize space from $O(N \\cdot M)$ to $O(M)$.'
        }
      ],
      complexity: {
        time: 'O(Number of Subproblems × Work per Subproblem) (e.g. O(N) or O(N · M))',
        space: 'O(N) or O(N · M) for DP table; often optimizable to O(1) or O(M)'
      },
      whenToUse: [
        'Finding minimum/maximum cost, shortest path, count of total paths, or decision feasibility.',
        'When choices at earlier steps influence choices at later steps with overlapping subproblems.'
      ],
      keyTakeaways: [
        'Solves problems by storing subproblem answers to avoid recalculation.',
        'Requires Overlapping Subproblems + Optimal Substructure.',
        'Always define: State definition -> Base cases -> Recurrence relation -> Space optimization.'
      ]
    }
  }
];
