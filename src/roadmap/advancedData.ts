import { RoadmapTopic } from '../types';

export const ADVANCED_TOPICS: RoadmapTopic[] = [
  {
    id: 'adv-1',
    title: 'Advanced Trees, Heaps & Tries',
    category: 'Advanced & Applied',
    description: 'Min/Max Binary Heaps, Priority Queues, Prefix Trees (Tries) for text search, and balanced tree rotations.',
    duration: '4.5 hours',
    xpReward: 190,
    level: 'Advanced',
    practiceTopic: 'Trees',
    prerequisites: ['Binary Trees & Binary Search Trees (BST)', 'Queues (FIFO), Deques & Ring Buffers'],
    notes: {
      concept: 'A Binary Heap is a complete binary tree that satisfies the Heap Property: in a Min-Heap, every parent node is $\\le$ its children (root is the minimum). A Trie (Prefix Tree) is an $N$-ary search tree used for storing and retrieving strings where each node represents a character prefix.',
      whyItMatters: 'Heaps power Priority Queues, Dijkstra\'s algorithm, and Top-K streaming filters. Tries enable $O(L)$ instant prefix search, autocomplete search engines, and spell checkers where $L$ is word length independent of dictionary size $N$.',
      coreIdeas: [
        'Heap Array Storage: Children of index $i$ are at $2i + 1$ and $2i + 2$; parent is at $\\lfloor(i - 1)/2\\rfloor$.',
        'Heapify & Sift Up/Down: Insert at end and sift up in $O(\\log N)$; extract root, replace with last element and sift down in $O(\\log N)$.',
        'Trie Prefix Tree: Each node contains an array/map of child pointers and an `isEndOfWord` boolean flag.',
        'Prefix Search in O(L): Finding if any word begins with prefix "app" takes $O(L)$ steps where $L$ is prefix length.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Trie (Prefix Tree) Implementation
class TrieNode {
  children = new Map<string, TrieNode>();
  isEndOfWord = false;
}

class Trie {
  root = new TrieNode();

  insert(word: string): void {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children.has(char)) {
        curr.children.set(char, new TrieNode());
      }
      curr = curr.children.get(char)!;
    }
    curr.isEndOfWord = true; // O(L) insertion
  }

  startsWith(prefix: string): boolean {
    let curr = this.root;
    for (const char of prefix) {
      if (!curr.children.has(char)) return false;
      curr = curr.children.get(char)!;
    }
    return true; // O(L) prefix verification
  }
}`,
          explanation: 'Tries look up words and prefixes in O(L) time without scanning dictionary words.'
        },
        {
          language: 'Python',
          code: `# Python heapq for Min-Heap and Max-Heap
import heapq

# Min-Heap
min_heap = []
heapq.heappush(min_heap, 10)
heapq.heappush(min_heap, 5)
smallest = heapq.heappop(min_heap) # 5 O(log N)

# Top K Elements in O(N log K) time
nums = [3, 2, 1, 5, 6, 4]
k_largest = heapq.nlargest(2, nums) # [6, 5]`,
          explanation: 'Python `heapq` provides min-heap operations directly on native lists.'
        }
      ],
      example: {
        title: 'Kth Largest Element in an Array (Min-Heap of Size K)',
        description: 'Finds the kth largest element in an unsorted stream in O(N log K) time and O(K) space.',
        code: `// Min-Heap approach for Kth Largest
// Keeping a Min-Heap of capacity K ensures the top element is always the Kth largest
class KthLargestFinder {
  private minHeap: number[] = [];

  constructor(private k: number) {}

  add(val: number): number {
    this.minHeap.push(val);
    this.minHeap.sort((a, b) => a - b); // Or binary heap sift operations

    if (this.minHeap.length > this.k) {
      this.minHeap.shift(); // Evict smaller elements
    }
    return this.minHeap[0]; // Kth largest at root
  }
}`,
        explanation: 'A min-heap of size K stores only the top K elements; the smallest of these is the Kth largest.'
      },
      commonPatterns: [
        {
          name: 'Top K Frequent / Largest Elements',
          description: 'Maintaining a heap of size $K$ to process streaming data in $O(N \\log K)$ time.'
        },
        {
          name: 'Prefix Auto-Complete and Word Search',
          description: 'Using a Trie to find all matching dictionary words matching a prefix.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Finding Top K frequent/largest elements dynamically.',
          'Continuous stream of numbers where you need median or order statistics.',
          'Word autocomplete, spell checker, or prefix-matching dictionary.'
        ],
        clues: [
          '"Find Kth largest element" -> Min-Heap of fixed size K.',
          '"Find median in a stream" -> Two heaps (Max-Heap for lower half, Min-Heap for upper half).',
          '"Implement Trie / prefix search" -> Character-pointer N-ary Tree with `isEndOfWord` flag.'
        ],
        askYourself: [
          'If looking for Top K largest, should I use a Min-Heap of size K (so root is Kth largest)?',
          'Is the prefix search length $L$ significantly shorter than total words in the dictionary?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Pushing all $N$ elements into a heap when finding Top $K$, using $O(N \\log N)$ time and $O(N)$ space.',
          fix: 'Keep heap size capped at $K$ elements to achieve $O(N \\log K)$ time and $O(K)$ space.'
        },
        {
          mistake: 'Forgetting to set `isEndOfWord = true` in Trie, failing exact word lookups.',
          fix: 'Always mark the terminal node of an inserted word.'
        }
      ],
      complexity: {
        time: 'Heap Insert/Extract: O(log N) | Heap Peek: O(1) | Trie Insert/Search: O(L) where L is word length',
        space: 'Heap: O(N) | Trie: O(N · L · Alphabet_Size)'
      },
      whenToUse: [
        'Finding Top-K, Median in a Data Stream, or Merge K Sorted Lists.',
        'Prefix matching, autocomplete dictionary, and IP routing table lookups.'
      ],
      keyTakeaways: [
        'Heaps provide $O(1)$ access to min/max and $O(\\log N)$ insertion/extraction.',
        'Maintain a heap of size $K$ to solve Top-$K$ problems in $O(N \\log K)$.',
        'Tries search prefixes in $O(L)$ time independent of dictionary size.'
      ]
    }
  },
  {
    id: 'adv-2',
    title: 'Advanced Graph Algorithms (BFS, DFS & Dijkstra)',
    category: 'Advanced & Applied',
    description: 'Breadth-First Search shortest path, Depth-First Search cycle detection, Topological Sorting, and Dijkstra shortest path.',
    duration: '5 hours',
    xpReward: 200,
    level: 'Advanced',
    practiceTopic: 'Graphs',
    prerequisites: ['Graphs & Adjacency Representations', 'Advanced Trees, Heaps & Tries'],
    notes: {
      concept: 'Advanced graph algorithms traverse networks to solve critical pathfinding, connectivity, and dependency ordering problems. Breadth-First Search (BFS) finds shortest paths in unweighted graphs; Dijkstra\'s Algorithm finds shortest paths in non-negative weighted graphs using a Min-Heap; Topological Sort orders nodes in a Directed Acyclic Graph (DAG).',
      whyItMatters: 'Graph algorithms power GPS navigation (Google Maps), social network friend recommendations, compiler build dependency graphs (Makefile/Webpack), package managers (npm/pip), and network routing protocols (OSPF).',
      coreIdeas: [
        'BFS (Queue): Explores nodes layer-by-layer; guarantees shortest path in unweighted graphs ($O(V + E)$).',
        'DFS (Stack/Recursion): Explores as deep as possible before backtracking; ideal for connected components and cycle detection.',
        'Topological Sort (Kahn\'s In-Degree Algorithm): Orders vertices in a DAG such that for every directed edge $u \\to v$, $u$ appears before $v$.',
        'Dijkstra\'s Algorithm: Uses a Priority Queue to extract minimum tentative distance in $O((V + E) \\log V)$ time.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Topological Sort (Kahn's In-Degree BFS Algorithm)
function topologicalSort(numCourses: number, prerequisites: number[][]): number[] {
  const inDegree = new Array(numCourses).fill(0);
  const adjList = new Map<number, number[]>();

  // 1. Build adjacency list and compute in-degrees
  for (const [course, prereq] of prerequisites) {
    if (!adjList.has(prereq)) adjList.set(prereq, []);
    adjList.get(prereq)!.push(course);
    inDegree[course]++;
  }

  // 2. Enqueue all nodes with in-degree 0 (no prerequisites)
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order: number[] = [];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    order.push(curr);

    for (const neighbor of adjList.get(curr) || []) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }

  return order.length === numCourses ? order : []; // Cycle detected if order < numCourses
}`,
          explanation: 'Kahn\'s algorithm detects dependency cycles and returns valid execution order in O(V + E).'
        },
        {
          language: 'Python',
          code: `# Python Dijkstra's Shortest Path Algorithm
import heapq

def dijkstra(graph: dict[int, list[tuple[int, int]]], start: int, num_nodes: int):
    distances = {i: float('inf') for i in range(num_nodes)}
    distances[start] = 0
    min_heap = [(0, start)] # (cost, node)

    while min_heap:
        current_dist, u = heapq.heappop(min_heap)

        if current_dist > distances[u]:
            continue # Lazy deletion: stale entry

        for v, weight in graph.get(u, []):
            dist = current_dist + weight
            if dist < distances[v]:
                distances[v] = dist
                heapq.heappush(min_heap, (dist, v))

    return distances`,
          explanation: 'Dijkstra finds single-source shortest paths in O((V + E) log V) with a priority queue.'
        }
      ],
      example: {
        title: 'Word Ladder (Shortest Transformation Sequence via BFS)',
        description: 'Finds the length of shortest transformation sequence from beginWord to endWord.',
        code: `function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;

  const queue: [string, number][] = [[beginWord, 1]];
  const visited = new Set<string>([beginWord]);

  while (queue.length > 0) {
    const [word, length] = queue.shift()!;
    if (word === endWord) return length;

    // Generate all 1-letter variations
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const nextWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
        if (wordSet.has(nextWord) && !visited.has(nextWord)) {
          visited.add(nextWord);
          queue.push([nextWord, length + 1]);
        }
      }
    }
  }

  return 0;
}`,
        explanation: 'BFS explores one transformation step at a time, guaranteeing the shortest sequence.'
      },
      commonPatterns: [
        {
          name: 'Shortest Path in Unweighted Graph (BFS)',
          description: 'Layered queue exploration where the first time the target is reached is the shortest distance.'
        },
        {
          name: 'Dependency Resolution (Topological Sort)',
          description: 'Scheduling build tasks, course schedules, or spreadsheet cell evaluation.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Shortest transformation steps or minimum hops in unweighted network.',
          'Weighted graph pathfinding with positive weights.',
          'Topological ordering or circular dependency detection in prerequisites.'
        ],
        clues: [
          '"Shortest path in unweighted graph / maze" -> BFS with Queue.',
          '"Cheapest flight / shortest path with positive weights" -> Dijkstra\'s Algorithm with Min-Heap.',
          '"Course prerequisites / build order" -> Topological Sort (Kahn\'s algorithm or DFS).'
        ],
        askYourself: [
          'Are edge weights all equal (use BFS $O(V+E)$) or variable non-negative (use Dijkstra $O((V+E)\\log V)$)?',
          'Are there negative weights? (Dijkstra does not work; need Bellman-Ford).'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Using DFS to find shortest path in unweighted graphs, exploring suboptimal deep paths first.',
          fix: 'Always use BFS for shortest paths in unweighted graphs.'
        },
        {
          mistake: 'Using Dijkstra on graphs with negative edge weights.',
          fix: 'Dijkstra assumes non-negative weights; use Bellman-Ford or SPFA if negative weights exist.'
        }
      ],
      complexity: {
        time: 'BFS / DFS: O(V + E) | Dijkstra: O((V + E) log V) | Topological Sort: O(V + E)',
        space: 'O(V + E) for adjacency list, O(V) for visited set and priority queue'
      },
      whenToUse: [
        'Finding the fastest navigation route between locations.',
        'Resolving task dependencies and circular package references.',
        'Analyzing network cluster connectivity.'
      ],
      keyTakeaways: [
        'BFS guarantees shortest path in unweighted graphs in $O(V + E)$ time.',
        'Topological sort resolves task execution order in Directed Acyclic Graphs.',
        'Dijkstra with a Min-Heap computes shortest weighted paths in $O((V + E) \\log V)$.'
      ]
    }
  },
  {
    id: 'adv-3',
    title: 'Advanced Dynamic Programming & 2D Grids',
    category: 'Advanced & Applied',
    description: 'Longest Common Subsequence, Edit Distance, 2D Grid paths, Interval DP, and state compression.',
    duration: '5 hours',
    xpReward: 200,
    level: 'Advanced',
    practiceTopic: 'Dynamic Programming',
    prerequisites: ['Dynamic Programming (DP)'],
    notes: {
      concept: 'Advanced Dynamic Programming extends 1D state concepts into multi-dimensional state spaces (2D grids, pairs of strings, intervals, bitmasks). In 2D DP, state $dp[i][j]$ typically models a subproblem over prefixes $s[0..i]$ and $t[0..j]$, grid cell $(i, j)$, or subarray interval $[i, j]$.',
      whyItMatters: '2D DP solves string similarity algorithms (DNA sequence alignment, git diff, spell checking), financial portfolio optimization, and optimal matrix chain multiplications.',
      coreIdeas: [
        '2D State Definition: Formulate clearly what $dp[i][j]$ represents (e.g. edit distance between $word1[0..i-1]$ and $word2[0..j-1]$).',
        'State Transition Matrices: Transitions depend on neighbors (left $dp[i][j-1]$, top $dp[i-1][j]$, diagonal $dp[i-1][j-1]$).',
        'Base Case Initialization: Filling row 0 and column 0 correctly is critical to valid recurrence propagation.',
        'Space Optimization: A 2D table of size $N \\times M$ can often be compressed into two 1D rows ($O(M)$ space) since row $i$ only reads from row $i - 1$.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Longest Common Subsequence (LCS)
function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1]; // Match: extend diagonal
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // Skip char from either string
      }
    }
  }

  return dp[m][n];
}`,
          explanation: 'Computes length of longest shared subsequence in O(M * N) time.'
        },
        {
          language: 'Python',
          code: `# Python Unique Paths in 2D Grid with O(N) Space
def unique_paths(m: int, n: int) -> int:
    row = [1] * n # Base case: top row all 1s

    for _ in range(m - 1):
        new_row = [1] * n
        for j in range(1, n):
            new_row[j] = new_row[j - 1] + row[j] # left + top
        row = new_row

    return row[-1]`,
          explanation: 'Compressing 2D grid DP into a single 1D row reduces memory to O(N).'
        }
      ],
      example: {
        title: 'Edit Distance (Levenshtein Distance)',
        description: 'Computes minimum operations (insert, delete, replace) to convert word1 into word2.',
        code: `function minDistance(word1: string, word2: string): number {
  const m = word1.length;
  const n = word2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Base cases: converting prefix to empty string
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // No operation needed
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // Delete
          dp[i][j - 1],     // Insert
          dp[i - 1][j - 1]  // Replace
        );
      }
    }
  }

  return dp[m][n];
}`,
        explanation: 'Considers three edit choices at each cell and selects the minimum cost.'
      },
      commonPatterns: [
        {
          name: 'String Matching / Subsequence Matrix',
          description: 'Comparing prefixes of two strings (LCS, Edit Distance, Interleaving String).'
        },
        {
          name: '2D Grid Pathfinding Optimization',
          description: 'Minimum path sum or distinct paths in matrix with directional constraints.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Comparing two strings for alignment, longest common substring, or minimal edits.',
          'Finding min cost / max paths on a 2D grid with right/down movement.',
          'Decisions bounded by two moving index endpoints $[i, j]$.'
        ],
        clues: [
          '"Longest Common Subsequence" -> $dp[i][j] = 1 + dp[i-1][j-1]$ on match, else $\\max(dp[i-1][j], dp[i][j-1])$.',
          '"Edit distance word1 to word2" -> 3-way branch (insert, delete, replace).',
          '"Unique paths in grid with obstacles" -> $dp[i][j] = dp[i-1][j] + dp[i][j-1]$.'
        ],
        askYourself: [
          'Can I compress the $O(M \\times N)$ space table into a single 1D row array of size $O(N)$?',
          'How should the base cases (row 0 and column 0) be initialized?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Using 0-based indices for strings but 1-based indices for DP tables without `i - 1` adjustment.',
          fix: 'Always remember `text[i - 1]` corresponds to the character at `dp[i]`.'
        },
        {
          mistake: 'Incorrect order of iteration loops causing states to read uninitialized or future DP cells.',
          fix: 'Ensure all prerequisite dependencies (`dp[i-1][j]`, `dp[i][j-1]`, `dp[i-1][j-1]`) are computed before `dp[i][j]`.'
        }
      ],
      complexity: {
        time: 'O(M × N) where M and N are string lengths or grid dimensions',
        space: 'O(M × N) table, reducible to O(min(M, N)) with rolling rows'
      },
      whenToUse: [
        'Diffing text files, computing string similarity scores, and bioinformatics DNA alignment.',
        'Constrained navigation across grids with obstacle coordinates.'
      ],
      keyTakeaways: [
        'Formulate $dp[i][j]$ clearly around prefixes or coordinates.',
        'Initialize base case boundaries (row 0, column 0) carefully.',
        'Optimize memory from $O(M \\cdot N)$ to $O(N)$ using rolling row buffers.'
      ]
    }
  },
  {
    id: 'adv-4',
    title: 'Optimization Techniques & Bit Manipulation',
    category: 'Advanced & Applied',
    description: 'Bitwise AND, OR, XOR, binary shifts, bitmasks for subset state representation, and constant-factor speedups.',
    duration: '3.5 hours',
    xpReward: 160,
    level: 'Advanced',
    prerequisites: ['Operators & Expressions'],
    notes: {
      concept: 'Bit Manipulation operates directly on the binary bit representations (0s and 1s) of integer data types using hardware-level bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`). Bitmasks treat an integer as a compact boolean array of 32 or 64 flags, enabling set operations in $O(1)$ CPU cycles.',
      whyItMatters: 'Bit manipulation provides extreme performance optimizations, compact memory footprints for cache lines, and elegant solutions for problems like Single Number ($O(1)$ space), Subsets, and Travelling Salesperson State DP.',
      coreIdeas: [
        'XOR Invariants: $x \\oplus x = 0$, $x \\oplus 0 = x$, XOR is commutative and associative ($a \\oplus b \\oplus a = b$).',
        'Clear Lowest Set Bit: `n & (n - 1)` strips the lowest set 1-bit in $O(1)$ time (Brian Kernighan\'s algorithm).',
        'Power of Two Test: `(n > 0) && ((n & (n - 1)) === 0)` tests if $n$ is a power of 2.',
        'Bitmask Sets: Bit $i$ is 1 if element $i$ is present; set bit: `mask | (1 << i)`; toggle bit: `mask ^ (1 << i)`; test bit: `(mask & (1 << i)) !== 0`.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Bitwise Operations Cheatsheet
const num = 12; // Binary: 1100

// Test if i-th bit is set
const isBitSet = (val: number, i: number) => (val & (1 << i)) !== 0;

// Set i-th bit
const setBit = (val: number, i: number) => val | (1 << i);

// Clear i-th bit
const clearBit = (val: number, i: number) => val & ~(1 << i);

// Count total set bits (Hamming Weight)
function countSetBits(n: number): number {
  let count = 0;
  while (n > 0) {
    n = n & (n - 1); // Strips lowest set bit in O(1)
    count++;
  }
  return count;
}`,
          explanation: 'Brian Kernighan\'s algorithm iterates only as many times as there are set 1-bits.'
        },
        {
          language: 'Python',
          code: `# Python Single Number using XOR
def single_number(nums: list[int]) -> int:
    unique = 0
    for n in nums:
        unique ^= n # Pairs cancel to 0; remaining is unique
    return unique`,
          explanation: 'XOR cancels identical paired numbers in O(N) time and O(1) space.'
        }
      ],
      example: {
        title: 'Generate All Subsets Using Bitmasks',
        description: 'Generates power set by mapping binary bits 0 to 2^N - 1 to element inclusion.',
        code: `function subsetsBitmask(nums: number[]): number[][] {
  const n = nums.length;
  const totalSubsets = 1 << n; // 2^n
  const result: number[][] = [];

  for (let mask = 0; mask < totalSubsets; mask++) {
    const currentSubset: number[] = [];
    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) {
        currentSubset.push(nums[i]);
      }
    }
    result.push(currentSubset);
  }

  return result;
}`,
        explanation: 'Each binary integer from 0 to 2^N - 1 represents a unique subset configuration.'
      },
      commonPatterns: [
        {
          name: 'XOR Cancellation Trick',
          description: 'Finding missing or non-duplicate numbers in arrays in $O(N)$ time and $O(1)$ space.'
        },
        {
          name: 'Bitmask Dynamic Programming',
          description: 'Representing visited states in graphs / TSP as integer bitmasks up to $N \\le 20$.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Every number appears twice except one single number.',
          'Checking powers of two or counting set 1-bits.',
          'Representing combinations of up to 30 elements as compact integer bitmasks.'
        ],
        clues: [
          '"Find non-duplicate number in O(1) space" -> XOR accumulator (`acc ^= num`).',
          '"Is power of 2" -> `(n > 0) && (n & (n - 1)) === 0`.',
          '"Count number of 1 bits" -> Brian Kernighan\'s loop with `n & (n - 1)`.'
        ],
        askYourself: [
          'Can I use XOR cancellation instead of a Hash Set to reduce space to O(1)?',
          'Are bitwise operations properly parenthesized to prevent precedence bugs?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Forgetting that bitwise operators have lower operator precedence than comparison operators (`1 & 2 === 0` evaluates as `1 & (2 === 0)`).',
          fix: 'Always wrap bitwise expressions in parentheses: `((val & mask) !== 0)`.'
        },
        {
          mistake: 'Bit shifting by $\\ge 32$ bits in JavaScript, which operates on 32-bit signed integers.',
          fix: 'Use `BigInt` with `1n << BigInt(i)` for sets larger than 31 elements.'
        }
      ],
      complexity: {
        time: 'O(1) per bitwise hardware instruction',
        space: 'O(1) memory'
      },
      whenToUse: [
        'Tracking visited item subsets when $N \\le 30$.',
        'Finding duplicate/missing elements without hash maps.',
        'High-performance compression and cryptography pipelines.'
      ],
      keyTakeaways: [
        'XOR cancels duplicate pairs: $a \\oplus a = 0$.',
        '`n & (n - 1)` strips the lowest set bit in $O(1)$ time.',
        'Always wrap bitwise operations in parentheses due to low operator precedence.'
      ]
    }
  },
  {
    id: 'adv-5',
    title: 'Full-Stack Web Architecture & APIs',
    category: 'Advanced & Applied',
    description: 'RESTful endpoints, asynchronous Event Loop, Promises, client-server communication, and database indexing.',
    duration: '4.5 hours',
    xpReward: 180,
    level: 'Advanced',
    prerequisites: ['Programming Basics & Runtime Execution'],
    notes: {
      concept: 'Full-Stack Web Architecture encompasses the end-to-end design of client user interfaces (React/DOM), server application layers (Node.js/Express, REST/GraphQL), network communication protocols (HTTP/HTTPS, WebSockets), and persistent database storage engines (SQL/NoSQL).',
      whyItMatters: 'Software engineering in production requires connecting algorithmic business logic with resilient APIs, asynchronous non-blocking event loops, secure authentication, and optimized database queries.',
      coreIdeas: [
        'Event Loop & Non-Blocking I/O: Node.js/JavaScript executes single-threaded JavaScript while delegating file/network I/O to libuv worker threads via microtask (Promises) and macrotask queues.',
        'RESTful API Principles: Stateless request-response lifecycle with standard HTTP verbs (GET, POST, PUT, DELETE) and status codes (200, 201, 400, 401, 404, 500).',
        'Middleware Architecture: Composable pipeline functions `(req, res, next)` for authentication, rate limiting, and request validation.',
        'Database Indexing: B-Trees and Hash indexes provide $O(\\log N)$ lookups on primary and secondary keys instead of full table scans ($O(N)$).'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Express API Route with Error Middleware
import express, { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());

// Async handler with error forwarding
app.get('/api/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await database.findUserById(userId); // Non-blocking query
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ data: user });
  } catch (err) {
    next(err); // Forward to global error handler
  }
});`,
          explanation: 'Async/await with try/catch ensures unhandled database rejections reach error middlewares.'
        },
        {
          language: 'JavaScript',
          code: `// Event Loop Microtask vs Macrotask Execution Order
console.log('1. Synchronous');

setTimeout(() => {
  console.log('4. Macrotask (Timer)');
}, 0);

Promise.resolve().then(() => {
  console.log('2. Microtask (Promise)');
});

console.log('3. Synchronous');
// Output: 1 -> 3 -> 2 -> 4`,
          explanation: 'Microtasks (Promises) drain completely before the Event Loop executes macrotasks (setTimeout).'
        }
      ],
      example: {
        title: 'Resilient Fetch Client with Exponential Backoff',
        description: 'Implements client-side retry logic for handling transient API network errors.',
        code: `async function fetchWithRetry(url: string, retries = 3, delayMs = 1000): Promise<any> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    return await response.json();
  } catch (error) {
    if (retries <= 0) throw error;
    // Exponential backoff wait
    await new Promise(resolve => setTimeout(resolve, delayMs));
    return fetchWithRetry(url, retries - 1, delayMs * 2);
  }
}`,
        explanation: 'Exponential backoff prevents hammering servers during temporary outages.'
      },
      commonPatterns: [
        {
          name: 'Middleware Chain',
          description: 'Executing auth checks, rate limiters, and payload validation before business logic handlers.'
        },
        {
          name: 'Optimistic UI Updates',
          description: 'Updating client UI state immediately and rolling back if server response fails.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Asynchronous operations, API network retries, and rate limiting.',
          'Event loop execution ordering questions (microtasks vs macrotasks).',
          'Database query optimization and slow endpoint bottlenecks.'
        ],
        clues: [
          '"Order of console.log with Promises and setTimeout" -> Sync code -> Microtasks (Promise/queueMicrotask) -> Macrotasks (setTimeout/setInterval).',
          '"Handle transient network drops" -> Exponential backoff with retry counter.',
          '"Optimize slow SQL query on WHERE clause" -> Add B-Tree index on filtered column.'
        ],
        askYourself: [
          'Is any CPU-heavy work running on the main event loop thread that could block incoming requests?',
          'Are async errors passed to `next(err)` or caught by middleware?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Blocking the Node.js Event Loop with CPU-intensive synchronous loops (e.g. heavy crypto or huge array sorts).',
          fix: 'Offload heavy computations to Worker Threads or external background worker queues.'
        },
        {
          mistake: 'Failing to index database foreign keys, resulting in $O(N)$ table scans on relational joins.',
          fix: 'Create B-tree indexes on all frequently filtered or joined columns.'
        }
      ],
      complexity: {
        time: 'Indexed DB Lookup: O(log N) | Full Table Scan: O(N) | In-Memory Cache (Redis): O(1)',
        space: 'B-tree index occupies O(N) additional disk/RAM space'
      },
      whenToUse: [
        'Building client-server web applications, microservices, and mobile backends.',
        'Designing scalable, secure API architectures with database persistence.'
      ],
      keyTakeaways: [
        'Node.js is single-threaded for JS execution; never block the Event Loop.',
        'Microtasks (Promises) execute before Macrotasks (timers).',
        'Always index database columns used in WHERE clauses and JOIN foreign keys.'
      ]
    }
  },
  {
    id: 'adv-6',
    title: 'AI & Machine Learning Foundations',
    category: 'Advanced & Applied',
    description: 'Tensors and vector representations, loss functions, gradient descent, neural network layers, and Transformer self-attention.',
    duration: '5 hours',
    xpReward: 200,
    level: 'Advanced',
    prerequisites: ['Optimization Techniques & Bit Manipulation'],
    notes: {
      concept: 'Machine Learning is the paradigm where computational models learn patterns directly from empirical data rather than through handcrafted rule sets. Deep Learning uses multi-layered Artificial Neural Networks to approximate complex non-linear functions. Large Language Models (LLMs) rely on Transformer architectures utilizing Self-Attention mechanisms to process and generate sequences.',
      whyItMatters: 'AI and LLMs have revolutionized software engineering. Understanding embeddings, dot-product attention, tokenization, and context windows enables building intelligent AI-assisted workflows and grounding systems.',
      coreIdeas: [
        'Vector Embeddings: High-dimensional numerical vectors ($d \\in \\mathbb{R}^{768}$ or $\\mathbb{R}^{1536}$) that capture semantic similarity via Cosine Similarity $\\cos(\\theta) = \\frac{u \\cdot v}{\\|u\\| \\|v\\|}$.',
        'Loss Functions & Gradient Descent: Quantifying prediction error and updating model weights via backpropagation: $W_{\\text{new}} = W - \\alpha \\nabla L(W)$.',
        'Transformer Self-Attention: Mechanism allowing tokens in a sequence to dynamically weigh and attend to every other token: $\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$.',
        'Context Window & Tokens: LLMs operate on discrete subword tokens; generation is autoregressive (predicting next token probability).'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Vector Cosine Similarity Computation
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vector dimension mismatch");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator; // Output range [-1, 1]
}`,
          explanation: 'Computes semantic similarity between vector embeddings in O(D) time where D is dimensions.'
        },
        {
          language: 'Python',
          code: `# Python Dot-Product Attention in NumPy
import numpy as np

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = np.matmul(Q, K.T) / np.sqrt(d_k)
    # Softmax normalization
    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
    return np.matmul(weights, V)`,
          explanation: 'Computes scaled self-attention weights across query, key, and value matrices.'
        }
      ],
      example: {
        title: 'Retrieval-Augmented Generation (RAG) Vector Search',
        description: 'Finds the most relevant knowledge snippet for a query using cosine similarity over embeddings.',
        code: `interface DocumentChunk {
  id: string;
  text: string;
  embedding: number[];
}

function findMostRelevantChunk(queryEmbedding: number[], docs: DocumentChunk[]): DocumentChunk | null {
  if (docs.length === 0) return null;

  let bestDoc: DocumentChunk = docs[0];
  let highestSimilarity = -Infinity;

  for (const doc of docs) {
    const score = cosineSimilarity(queryEmbedding, doc.embedding);
    if (score > highestSimilarity) {
      highestSimilarity = score;
      bestDoc = doc;
    }
  }

  return bestDoc;
}`,
        explanation: 'Finds the closest semantic document chunk in vector space to provide context to an LLM prompt.'
      },
      commonPatterns: [
        {
          name: 'Vector Semantic Search / RAG',
          description: 'Embedding queries and documents into shared vector space to retrieve grounded facts for LLMs.'
        },
        {
          name: 'Prompt Structuring & Tool Calling',
          description: 'Giving LLMs structured JSON schemas and function definitions to execute deterministic tools.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Semantic search, document ranking, or retrieval augmentation (RAG).',
          'Self-attention mechanisms or token-by-token next word prediction.',
          'Cosine similarity over dense vector spaces.'
        ],
        clues: [
          '"Rank documents by similarity to query" -> Cosine similarity between embedding vectors.',
          '"Ground LLM responses with live facts" -> RAG pipeline with top-K vector search.',
          '"Token limit exceeded" -> Chunking documents into semantic passages before vector embedding.'
        ],
        askYourself: [
          'Are embeddings normalized to unit length so dot product equals cosine similarity?',
          'Is prompt context appropriately limited to stay within token budgets?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Treating LLM generation as a deterministic database lookup rather than probabilistic token sampling.',
          fix: 'Use schema validation, temperature tuning, and fallback error handling.'
        },
        {
          mistake: 'Exceeding LLM context window limits by dumping raw unbounded files into prompts.',
          fix: 'Chunk documents and retrieve only top-K relevant chunks via vector similarity search.'
        }
      ],
      complexity: {
        time: 'Vector Cosine Similarity: O(D) | Self-Attention: O(N² · D) for sequence length N',
        space: 'O(N · D) for token embedding activations'
      },
      whenToUse: [
        'Building AI coding assistants, smart search, auto-categorization, and summarization pipelines.',
        'Implementing semantic search and recommendation systems.'
      ],
      keyTakeaways: [
        'Embeddings represent semantic meaning as high-dimensional numerical vectors.',
        'Cosine similarity measures conceptual closeness between vectors.',
        'Transformers use self-attention to weigh relationships between all tokens in a sequence.'
      ]
    }
  }
];
