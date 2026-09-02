import { RoadmapTopic } from '../types';

export const DATA_STRUCTURES_TOPICS: RoadmapTopic[] = [
  {
    id: 'ds-1',
    title: 'Arrays & Dynamic Sizing',
    category: 'Data Structures',
    description: 'Contiguous memory layout, direct O(1) index access, amortized resizing, and cache locality.',
    duration: '3.5 hours',
    xpReward: 150,
    level: 'Beginner',
    practiceTopic: 'Arrays',
    prerequisites: ['Programming Basics & Runtime Execution'],
    notes: {
      concept: 'An Array is a linear data structure that stores elements of identical type in contiguous memory locations. Because memory addresses are sequential, any element can be accessed in O(1) constant time via index arithmetic (`Address = Base + (Index * Size)`). Dynamic arrays (like `std::vector`, Python `list`, or JS `Array`) resize automatically by allocating a new block with double capacity when full.',
      whyItMatters: 'Arrays are the most fundamental data structure in computing. Their contiguous memory layout maximizes CPU cache locality (L1/L2 cache hits), making linear array scans significantly faster than pointer-based linked nodes.',
      coreIdeas: [
        'Contiguous Memory: Elements reside side-by-side with zero pointer overhead.',
        'Random Access: Instant $O(1)$ read and write via index.',
        'Amortized Growth: Resizing takes $O(N)$ occasionally, but averaged across $N$ insertions, appending is amortized $O(1)$.',
        'Insert / Delete Cost: Shifting elements during insertions or deletions from the beginning or middle takes $O(N)$ time.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Dynamic Array operations
const nums: number[] = [10, 20, 30, 40];

// O(1) Operations
const first = nums[0]; // Direct index lookup
nums.push(50);         // Amortized O(1) append
const last = nums.pop(); // O(1) pop from end

// O(N) Operations
nums.unshift(5);       // O(N) shifts all elements right
nums.splice(2, 1);     // O(N) shifts remaining elements left`,
          explanation: 'Adding to the end is fast; adding or removing from the beginning requires moving all subsequent items.'
        },
        {
          language: 'Python',
          code: `# Python list manipulations
arr = [10, 20, 30, 40]

arr.append(50)       # Amortized O(1)
val = arr.pop()      # O(1)
arr.insert(0, 5)     # O(N) shift
del arr[1]           # O(N) shift`,
          explanation: 'Python lists double in capacity when reaching thresholds to maintain amortized O(1) appends.'
        }
      ],
      example: {
        title: 'Two Sum using Array Indexing & Hash Lookup',
        description: 'Finds two indices in an array that sum to a target value in O(N) time.',
        code: `function twoSum(nums: number[], target: number): number[] {
  const indexMap = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (indexMap.has(complement)) {
      return [indexMap.get(complement)!, i];
    }
    indexMap.set(nums[i], i);
  }
  return [];
}`,
        explanation: 'Iterating through the array once while storing seen values solves the problem in O(N) time and O(N) space.'
      },
      commonPatterns: [
        {
          name: 'Prefix Sum Array',
          description: 'Precomputing cumulative sums `prefix[i] = prefix[i-1] + nums[i]` for O(1) range queries `sum(L, R) = prefix[R] - prefix[L-1]`.'
        },
        {
          name: 'In-Place Array Partitioning',
          description: 'Using swap pointers to partition elements (e.g. moving zeros to the end or Dutch National Flag).'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Problem involves index-based access, sequential records, or fixed size sequences.',
          'Cumulative ranges or range-sum queries (think Prefix Sums).',
          'In-place modifications without allocating new memory.'
        ],
        clues: [
          '"Find pair that sums to target" -> Array + Hash Map or Two Pointers.',
          '"Range sum query in O(1)" -> Prefix Sum array.',
          '"Move elements in-place" -> Two-pointer partition swap.'
        ],
        askYourself: [
          'Is the array sorted? If so, can I use Two Pointers or Binary Search?',
          'Will shifting elements inside a loop accidentally cause O(N²) quadratic time?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Using `.shift()` or `.unshift()` in a loop, resulting in unintentional $O(N^2)$ quadratic performance.',
          fix: 'Use a two-pointer technique or a dedicated Queue/Deque data structure for FIFO operations.'
        },
        {
          mistake: 'Index out of bounds errors when accessing `arr[arr.length]` instead of `arr[arr.length - 1]`.',
          fix: 'Always ensure index $0 \\le i < \\text{length}$.'
        }
      ],
      complexity: {
        time: 'Access: O(1) | Append: Amortized O(1) | Prepend/Insert: O(N) | Delete: O(N)',
        space: 'O(N) contiguous allocation',
        tradeoffs: 'Fastest random reads and optimal CPU cache performance, but resizing and insertions inside the array require shifting elements.'
      },
      whenToUse: [
        'When frequent index-based random access is required.',
        'When collection size is known or grows primarily by appending to the end.',
        'When CPU cache locality and low memory overhead are priorities.'
      ],
      keyTakeaways: [
        'Contiguous storage provides $O(1)$ random indexing.',
        'Push and pop at the end are $O(1)$; insertions/deletions at arbitrary indices are $O(N)$.',
        'Cache locality makes arrays faster in practice than pointer-linked lists.'
      ]
    }
  },
  {
    id: 'ds-2',
    title: 'Strings & String Manipulation',
    category: 'Data Structures',
    description: 'Immutability, character encoding (ASCII/Unicode), string builders, two-pointer string reversals, and substrings.',
    duration: '3 hours',
    xpReward: 140,
    level: 'Beginner',
    practiceTopic: 'Strings',
    prerequisites: ['Arrays & Dynamic Sizing'],
    notes: {
      concept: 'A String is an ordered sequence of characters stored in memory using character encodings (such as UTF-8 or UTF-16). In many modern languages (Java, Python, JavaScript), strings are immutable—meaning every concatenation creates a brand-new string in memory.',
      whyItMatters: 'String manipulation is ubiquitous in software engineering, from JSON parsing and search engines to URL validation and coding interviews. Understanding immutability avoids hidden $O(N^2)$ concatenation costs.',
      coreIdeas: [
        'Immutability: Modifying a string creates a new instance; repeated concatenation `s += ch` inside an $N$-length loop runs in $O(N^2)$ time.',
        'Character Arrays / String Builders: Converting strings to mutable arrays allows $O(1)$ character mutations and $O(N)$ bulk joins.',
        'ASCII vs Unicode: ASCII occupies 7-8 bits (0-127); Unicode UTF-8 supports global character sets and multi-byte runes.',
        'Substrings & Slices: Extracting a slice takes $O(K)$ time where $K$ is the substring length.'
      ],
      syntaxImplementation: [
        {
          language: 'JavaScript',
          code: `// String Builder pattern via Array join
function buildRepeatedString(char, count) {
  const buffer = []; // O(1) appends
  for (let i = 0; i < count; i++) {
    buffer.push(char);
  }
  return buffer.join(''); // O(N) single allocation
}

// Substring and charCode
const str = "MentorAI";
const code = str.charCodeAt(0); // 77 ('M')
const sub = str.slice(0, 6);     // "Mentor"`,
          explanation: 'Using an array buffer avoids creating intermediate string objects in memory during loops.'
        },
        {
          language: 'Python',
          code: `# Python string operations
text = "racecar"

# O(N) Palindrome verification via slicing
is_palindrome = text == text[::-1]

# Efficient join
words = ["Learn", "Code", "Grow"]
sentence = " ".join(words) # O(N) allocation`,
          explanation: '`"".join(list)` is the idiomatic $O(N)$ string concatenation method in Python.'
        }
      ],
      example: {
        title: 'Valid Palindrome (Alphanumeric)',
        description: 'Verifies if a string is a palindrome ignoring casing and non-alphanumeric characters.',
        code: `function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;
    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;

    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}`,
        explanation: 'Two pointers moving inward check symmetric characters in O(N) time and O(1) auxiliary space.'
      },
      commonPatterns: [
        {
          name: 'Two-Pointer Inward Comparison',
          description: 'Validating palindromes or reversing string characters in place.'
        },
        {
          name: 'Character Frequency Array / Hash Map',
          description: 'Counting char frequencies `new Array(26).fill(0)` for anagram detection.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Palindromes, anagrams, substring matching, or sentence formatting.',
          'Checking character parity or matching brackets/tokens.',
          'Case-insensitive matching or filtering special characters.'
        ],
        clues: [
          '"Is anagram" -> Character count frequency array of size 26 or Hash Map.',
          '"Is palindrome" -> Two-pointer inward traversal comparing lowercase chars.',
          '"Longest common prefix" -> Character-by-character horizontal or vertical scan.'
        ],
        askYourself: [
          'Is string immutability going to make repeated concatenation O(N²)?',
          'Do I need to handle whitespace, casing, or punctuation?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Concatenating strings inside a loop (`str += ch`), turning an $O(N)$ algorithm into $O(N^2)$.',
          fix: 'Collect characters in an array and use `.join("")` at the end.'
        },
        {
          mistake: 'Forgetting that string comparison is case-sensitive.',
          fix: 'Normalize casing with `.toLowerCase()` when problem requirements state case-insensitivity.'
        }
      ],
      complexity: {
        time: 'Access: O(1) | Concatenation (Array Join): O(N) | Substring slice: O(K) | Comparison: O(N)',
        space: 'O(N) memory for string instances'
      },
      whenToUse: [
        'Parsing text, tokens, protocol headers, and search queries.',
        'Verifying palindromes, anagrams, and substring patterns.'
      ],
      keyTakeaways: [
        'Strings are immutable in JS and Python; use array buffers for multi-step construction.',
        'Two pointers solve palindrome and reversal problems in $O(N)$ time and $O(1)$ space.',
        'Character count arrays (`new Array(26)`) solve anagram problems efficiently.'
      ]
    }
  },
  {
    id: 'ds-3',
    title: 'Hash Maps & Hash Sets (O(1) Hashing)',
    category: 'Data Structures',
    description: 'Hash functions, collision resolution (chaining vs open addressing), O(1) average lookup/insert/delete, and frequency tables.',
    duration: '4 hours',
    xpReward: 160,
    level: 'Intermediate',
    practiceTopic: 'Hash Maps',
    prerequisites: ['Arrays & Dynamic Sizing'],
    notes: {
      concept: 'A Hash Map (or Hash Table) is an associative key-value data structure that maps keys to values using a mathematical Hash Function. The hash function converts a key into an integer array index. A Hash Set stores unique keys with no associated values.',
      whyItMatters: 'Hash Maps provide average $O(1)$ constant time for lookup, insertion, and deletion. They are the single most frequently utilized data structure for optimizing $O(N^2)$ brute-force solutions down to $O(N)$ linear time.',
      coreIdeas: [
        'Hash Function: Deterministic function converting keys to bucket indices uniformly.',
        'Collision Resolution: When two distinct keys hash to identical indices, systems resolve collisions via Separate Chaining (linked lists/trees in bucket) or Open Addressing (probing).',
        'Load Factor & Rehashing: Ratio of items to buckets ($N/K$). When exceeding thresholds (typically 0.75), bucket count doubles and elements are rehashed.',
        'Key Uniqueness: Sets store unique values; Maps update values on duplicate key assignment.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Hash Map and Hash Set usage
const frequencyMap = new Map<string, number>();
const uniqueTokens = new Set<string>();

// O(1) Insert / Update
frequencyMap.set("apple", (frequencyMap.get("apple") || 0) + 1);

// O(1) Lookup & Deletion
if (frequencyMap.has("apple")) {
  console.log(frequencyMap.get("apple")); // 1
}
uniqueTokens.add("id_100");
uniqueTokens.delete("id_100");`,
          explanation: 'Map supports keys of any type; Set guarantees element uniqueness with O(1) lookups.'
        },
        {
          language: 'Python',
          code: `# Python dict and collections.Counter
from collections import Counter, defaultdict

# Defaultdict avoids KeyError
counts = defaultdict(int)
for word in ["code", "run", "code"]:
    counts[word] += 1

# Instant frequency counter
freq = Counter("banana") # {'a': 3, 'n': 2, 'b': 1}`,
          explanation: '`defaultdict` and `Counter` streamline frequency mapping in Python.'
        }
      ],
      example: {
        title: 'Group Anagrams using Frequency Key Hash Map',
        description: 'Groups an array of strings into anagram clusters in O(N * K) time.',
        code: `function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();

  for (const s of strs) {
    // Generate character count key: e.g. "1#0#0#...#1"
    const count = new Array(26).fill(0);
    for (let i = 0; i < s.length; i++) {
      count[s.charCodeAt(i) - 97]++;
    }
    const key = count.join('#');

    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }

  return Array.from(map.values());
}`,
        explanation: 'Using character count signatures as hash map keys groups identical anagrams without sorting.'
      },
      commonPatterns: [
        {
          name: 'Frequency Counting Table',
          description: 'Counting occurrences of elements for majority elements, anagrams, or top K frequent items.'
        },
        {
          name: 'Complement Lookup (Two Sum Pattern)',
          description: 'Checking `map.has(target - current)` to find paired elements in a single pass.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Looking up elements in O(1) time instead of O(N) linear search.',
          'Detecting duplicate elements or checking if an item was previously visited.',
          'Counting frequencies of words, numbers, or characters.'
        ],
        clues: [
          '"Find duplicate in array" -> Hash Set for visited elements.',
          '"Contains pair with sum X" -> Hash Map storing `target - x`.',
          '"Group items by signature" -> Hash Map with canonical sorted key or char-count key.'
        ],
        askYourself: [
          'Can I trade O(N) extra space to drop time complexity from O(N²) to O(N)?',
          'Are the keys primitives (strings, numbers) or composite objects?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Using objects as keys in plain JavaScript `{}` without realizing they get coerced to `"[object Object]"`.',
          fix: 'Use `new Map()` which supports reference and object keys by pointer equality.'
        },
        {
          mistake: 'Assuming Hash Map keys maintain numerical sorting.',
          fix: 'Standard Hash Maps do not guarantee order; use sorted structures (BST/TreeMap) when ordered traversal is needed.'
        }
      ],
      complexity: {
        time: 'Average: O(1) Get / Set / Delete | Worst-case: O(N) under catastrophic hash collisions',
        space: 'O(N) to store keys, values, and bucket structures',
        tradeoffs: 'Provides instant O(1) lookups at the expense of non-ordered keys and higher memory overhead per element.'
      },
      whenToUse: [
        'Whenever you need fast O(1) lookups by key or ID.',
        'Counting frequencies or tracking visited nodes/elements.',
        'Trading memory space to reduce time complexity from $O(N^2)$ to $O(N)$.'
      ],
      keyTakeaways: [
        'Average $O(1)$ lookup, insert, and delete makes Hash Maps the #1 optimization tool.',
        'Use Sets to remove duplicates and test membership.',
        'Keep keys immutable and ensure good hash distribution.'
      ]
    }
  },
  {
    id: 'ds-4',
    title: 'Stacks (LIFO) & Applications',
    category: 'Data Structures',
    description: 'Last-In First-Out (LIFO) principle, push/pop/peek, call stack simulation, and monotonic stacks.',
    duration: '3.5 hours',
    xpReward: 150,
    level: 'Intermediate',
    practiceTopic: 'Stacks',
    prerequisites: ['Arrays & Dynamic Sizing'],
    notes: {
      concept: 'A Stack is a linear data structure that follows the Last-In, First-Out (LIFO) principle. Elements can only be added (push) and removed (pop) from the top. The most recently added element is always the first to be retrieved.',
      whyItMatters: 'Stacks power compiler syntax parsers, runtime call stacks, undo/redo buffers, browser history navigation, and advanced algorithmic patterns like monotonic stacks for next greater element queries.',
      coreIdeas: [
        'LIFO Discipline: Insertion and deletion occur strictly at the top.',
        'Core Operations: `push(val)` (O(1)), `pop()` (O(1)), `peek()` (O(1)), `isEmpty()` (O(1)).',
        'Call Stack Modeling: Stacks can convert recursive algorithms into iterative implementations.',
        'Monotonic Stack: A stack whose elements are maintained in strictly increasing or decreasing order.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Custom Stack implementation
class Stack<T> {
  private items: T[] = [];

  push(element: T): void {
    this.items.push(element); // O(1)
  }

  pop(): T | undefined {
    return this.items.pop();   // O(1)
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1]; // O(1)
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}`,
          explanation: 'Using an underlying dynamic array provides optimal O(1) push and pop performance.'
        },
        {
          language: 'Python',
          code: `# Python list as Stack
stack = []
stack.append(10)   # push O(1)
stack.append(20)
top = stack[-1]    # peek O(1)
val = stack.pop()  # pop O(1) -> 20`,
          explanation: 'Python lists have built-in append() and pop() for native O(1) stack operations.'
        }
      ],
      example: {
        title: 'Valid Parentheses Bracket Matching',
        description: 'Validates if closing brackets match their corresponding opening brackets in proper order.',
        code: `function isValidParentheses(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '['
  };

  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char); // Push opening bracket
    } else if (map[char]) {
      // Pop and verify match
      if (stack.length === 0 || stack.pop() !== map[char]) {
        return false;
      }
    }
  }

  return stack.length === 0; // Must be empty at end
}`,
        explanation: 'The stack stores open brackets; incoming closing brackets must match the most recent top open bracket.'
      },
      commonPatterns: [
        {
          name: 'Matching & Parsing Pairs',
          description: 'Checking valid brackets, HTML/XML tags, and evaluating postfix/infix mathematical expressions.'
        },
        {
          name: 'Monotonic Stack (Next Greater Element)',
          description: 'Maintaining a decreasing stack of indices to find the next larger number in O(N) time.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Nested pairs (brackets, tags, undo operations).',
          'Finding the next greater or next smaller element in an array.',
          'Reversing sequences or evaluating Reverse Polish Notation (RPN).'
        ],
        clues: [
          '"Matching parentheses / brackets" -> Standard LIFO stack.',
          '"Find the next warmer temperature / next greater element" -> Monotonic Decreasing Stack.',
          '"Evaluate mathematical expression `3 + 2 * 2`" -> Operator & operand stack.'
        ],
        askYourself: [
          'Do I need the most recently added item to match the current item (LIFO)?',
          'Can I maintain a monotonic ordering to eliminate nested loops?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Calling `.pop()` or `.peek()` on an empty stack without checking `isEmpty()`, causing undefined errors.',
          fix: 'Always guard pop and peek operations with `if (stack.length > 0)`.'
        },
        {
          mistake: 'Forgetting to check `stack.length === 0` at the end of a bracket validation algorithm.',
          fix: 'Ensure unclosed open brackets trigger failure at termination.'
        }
      ],
      complexity: {
        time: 'Push: O(1) | Pop: O(1) | Peek: O(1)',
        space: 'O(N) proportional to the number of stored elements'
      },
      whenToUse: [
        'When tracking nested structures (parentheses, syntax ASTs, function calls).',
        'When you need to undo actions or backtrack to the most recent previous state.',
        'Solving Next Greater Element or Daily Temperatures problems using monotonic stacks.'
      ],
      keyTakeaways: [
        'Last-In First-Out (LIFO) ensures the newest item is processed first.',
        'All standard operations (push, pop, peek) run in strict $O(1)$ time.',
        'Monotonic stacks reduce nested $O(N^2)$ search loops to $O(N)$ linear scans.'
      ]
    }
  },
  {
    id: 'ds-5',
    title: 'Queues (FIFO), Deques & Ring Buffers',
    category: 'Data Structures',
    description: 'First-In First-Out (FIFO) principle, circular queues, double-ended queues (Deques), and BFS exploration frontiers.',
    duration: '3 hours',
    xpReward: 140,
    level: 'Intermediate',
    practiceTopic: 'Queues',
    prerequisites: ['Arrays & Dynamic Sizing'],
    notes: {
      concept: 'A Queue is a linear data structure that adheres to the First-In, First-Out (FIFO) principle. Items are added at the rear (enqueue) and removed from the front (dequeue). A Deque (Double-Ended Queue) allows $O(1)$ insertions and removals at both the front and rear.',
      whyItMatters: 'Queues manage asynchronous task execution (message queues like RabbitMQ/Kafka, OS printer queues), buffer streaming data, and serve as the core frontier container for Breadth-First Search (BFS) in trees and graphs.',
      coreIdeas: [
        'FIFO Discipline: The first item enqueued is the first item dequeued.',
        'Queue Operations: `enqueue(val)` (O(1)), `dequeue()` (O(1)), `front()` (O(1)).',
        'Array Dequeue Trap: Using `array.shift()` is $O(N)$; true queues use circular arrays or linked lists for $O(1)$ dequeues.',
        'Deque: Supports `pushFront`, `pushBack`, `popFront`, `popBack` in $O(1)$ time.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Efficient Linked List Queue implementation
class QueueNode<T> {
  constructor(public value: T, public next: QueueNode<T> | null = null) {}
}

class Queue<T> {
  private head: QueueNode<T> | null = null;
  private tail: QueueNode<T> | null = null;
  private length = 0;

  enqueue(value: T): void {
    const node = new QueueNode(value);
    if (!this.tail) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
  }

  dequeue(): T | undefined {
    if (!this.head) return undefined;
    const value = this.head.value;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this.length--;
    return value; // O(1) true FIFO removal
  }
}`,
          explanation: 'Linked-node queue prevents O(N) array shifts upon dequeue.'
        },
        {
          language: 'Python',
          code: `# Python collections.deque for O(1) FIFO operations
from collections import deque

queue = deque()
queue.append("task_1")   # Enqueue rear O(1)
queue.append("task_2")
first = queue.popleft()  # Dequeue front O(1) -> "task_1"`,
          explanation: '`collections.deque` is implemented in C as a doubly-linked block list with O(1) operations.'
        }
      ],
      example: {
        title: 'Level-Order BFS Tree Traversal',
        description: 'Traverses a binary tree level-by-level using a FIFO Queue.',
        code: `function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!; // Dequeue front
      currentLevel.push(node.val);

      if (node.left) queue.push(node.left);   // Enqueue children
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}`,
        explanation: 'Tracking `levelSize` at each iteration ensures all nodes of a specific depth are processed together.'
      },
      commonPatterns: [
        {
          name: 'Breadth-First Search (BFS) Frontier',
          description: 'Expanding shortest path nodes in unweighted graphs level by level.'
        },
        {
          name: 'Sliding Window Maximum (Monotonic Deque)',
          description: 'Using a deque to track maximal window indices in $O(N)$ total time.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Shortest path or minimum steps in an unweighted grid/graph.',
          'Level-by-level traversal of trees or hierarchies.',
          'Maintaining a sliding window maximum/minimum in O(N) time.'
        ],
        clues: [
          '"Find minimum steps / shortest path in unweighted maze" -> BFS with Queue.',
          '"Print tree level by level" -> BFS with level-size batching.',
          '"Sliding window maximum of size K" -> Monotonic Deque.'
        ],
        askYourself: [
          'Do I need to visit neighbors in order of their distance from the start (BFS)?',
          'Am I using `array.shift()` in JavaScript which silently degrades performance to O(N²)?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Using JavaScript `array.shift()` inside a large BFS loop, degrading runtime to $O(N^2)$.',
          fix: 'Use a pointer index offset or a doubly-linked queue class for $O(1)$ front pops.'
        },
        {
          mistake: 'Forgetting to snapshot `queue.length` when processing level-by-level in BFS.',
          fix: 'Store `const size = queue.length;` before the inner level iteration loop.'
        }
      ],
      complexity: {
        time: 'Enqueue: O(1) | Dequeue: O(1) | Front/Peek: O(1)',
        space: 'O(N) proportional to items stored'
      },
      whenToUse: [
        'Finding the shortest path in unweighted graphs or grids via BFS.',
        'Buffering data streams, processing jobs sequentially, and managing rate limits.'
      ],
      keyTakeaways: [
        'First-In First-Out (FIFO) ensures fair, chronological processing.',
        'Essential for Breadth-First Search (BFS) in trees and graphs.',
        'Use double-ended queues (Deques) for sliding window extrema algorithms.'
      ]
    }
  },
  {
    id: 'ds-6',
    title: 'Linked Lists (Singly, Doubly, Cyclic)',
    category: 'Data Structures',
    description: 'Singly and doubly linked lists, dummy head sentinel node, fast and slow pointers, and in-place reversal.',
    duration: '4 hours',
    xpReward: 160,
    level: 'Intermediate',
    practiceTopic: 'Linked Lists',
    prerequisites: ['Variables, Data Types & Memory'],
    notes: {
      concept: 'A Linked List is a linear collection of data elements called Nodes, where each node contains a value and a pointer (reference) to the next node in memory. Unlike arrays, nodes are not stored contiguously in memory, allowing $O(1)$ insertions and deletions once a pointer position is reached.',
      whyItMatters: 'Linked lists test your fundamental mastery of pointer manipulation, reference reassignment, and edge case handling. They form the basis of LRU caches, memory allocators, and chained hash map buckets.',
      coreIdeas: [
        'Node Anatomy: Each node stores `val` and `next` (plus `prev` in doubly-linked lists).',
        'Non-Contiguous Memory: Nodes can reside anywhere in heap memory.',
        'Sentinel / Dummy Node: A placeholder node placed before the `head` that eliminates edge cases when modifying the first node.',
        'Fast & Slow Pointers (Floyd\'s Cycle Finding): Pointers moving at different speeds ($1x$ and $2x$) detect cycles and find middle nodes in $O(N)$ time and $O(1)$ space.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

// In-place Reversal
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;

  while (curr !== null) {
    const nextTemp = curr.next; // Save next node
    curr.next = prev;           // Reverse pointer
    prev = curr;                // Advance prev
    curr = nextTemp;            // Advance curr
  }
  return prev; // New head
}`,
          explanation: 'Iterative reversal updates pointers in place with O(1) space.'
        },
        {
          language: 'Python',
          code: `# Python Linked List Node
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Fast & Slow Pointers to find middle
def find_middle(head: ListNode) -> ListNode:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,
          explanation: 'When `fast` reaches the end, `slow` is located precisely at the middle node.'
        }
      ],
      example: {
        title: 'Merge Two Sorted Linked Lists with Dummy Head',
        description: 'Merges two sorted lists into one continuous sorted list in O(N + M) time.',
        code: `function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(-1); // Sentinel node
  let tail = dummy;

  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      tail.next = l1;
      l1 = l1.next;
    } else {
      tail.next = l2;
      l2 = l2.next;
    }
    tail = tail.next;
  }

  // Attach remaining segment
  tail.next = l1 !== null ? l1 : l2;

  return dummy.next; // Head of merged list
}`,
        explanation: 'The `dummy` node eliminates special checks for initializing the head of the new list.'
      },
      commonPatterns: [
        {
          name: 'Dummy Head Sentinel',
          description: 'Simplifies deletions and insertions at the head by providing an invariant preceding node.'
        },
        {
          name: 'Tortoise and Hare (Fast/Slow)',
          description: 'Detecting cycles (Floyd\'s algorithm) or finding middle elements in a single pass.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Node pointer reassignments, reversing sequences, or merging chains.',
          'Detecting loops or cycles without using extra memory.',
          'Removing or inserting nodes at the beginning or middle.'
        ],
        clues: [
          '"Reverse a linked list" -> 3-pointer iterative reversal (`prev`, `curr`, `nextTemp`).',
          '"Detect cycle in list" -> Fast and slow pointers (Floyd\'s algorithm).',
          '"Delete Nth node from end" -> Two pointers separated by N steps.',
          '"Remove nodes / merge lists" -> Use a Dummy Head sentinel node.'
        ],
        askYourself: [
          'Did I save `curr.next` before overwriting the pointer?',
          'Will this algorithm break if the list is empty, 1 node, or has a cycle?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Losing reference to the remaining list by overwriting `node.next` before caching the next node.',
          fix: 'Always store `const next = curr.next;` in a temporary variable before reassigning pointers.'
        },
        {
          mistake: 'Dereferencing `null` pointers (`curr.next.next` when `curr.next` is null).',
          fix: 'Always guard loop conditions with `while (curr !== null && curr.next !== null)`.'
        }
      ],
      complexity: {
        time: 'Access/Search: O(N) | Prepend: O(1) | Insert/Delete (given pointer): O(1)',
        space: 'O(N) for nodes with pointer overhead (8 bytes per pointer)'
      },
      whenToUse: [
        'When you need constant $O(1)$ insertions and deletions without array shifting.',
        'Implementing LRU Caches (doubly linked list + hash map) and custom queues.'
      ],
      keyTakeaways: [
        'No contiguous memory requirement means $O(1)$ node insertion/deletion.',
        'Always use a Dummy Sentinel node to simplify edge cases.',
        'Fast & slow pointers solve cycle detection and midpoint finding in $O(1)$ space.'
      ]
    }
  },
  {
    id: 'ds-7',
    title: 'Binary Trees & Binary Search Trees (BST)',
    category: 'Data Structures',
    description: 'Hierarchical node structures, preorder/inorder/postorder traversals, BST validation, and height balancing.',
    duration: '4.5 hours',
    xpReward: 180,
    level: 'Intermediate',
    practiceTopic: 'Trees',
    prerequisites: ['Functions, Scope & Closures', 'Linked Lists (Singly, Doubly, Cyclic)'],
    notes: {
      concept: 'A Tree is a non-linear hierarchical data structure consisting of nodes connected by edges, starting from a single Root node. A Binary Tree restricts each node to at most two children (`left` and `right`). A Binary Search Tree (BST) enforces the property that for every node, all values in its left subtree are smaller, and all values in its right subtree are larger.',
      whyItMatters: 'Trees naturally model hierarchical data (DOM trees, file systems, JSON structures) and enable $O(\\log N)$ searching, insertion, and deletion when balanced (like AVL or Red-Black trees).',
      coreIdeas: [
        'Tree Terminology: Root, Parent, Child, Leaf, Depth (distance from root), Height (longest path to leaf).',
        'Traversals: Inorder (Left, Root, Right - yields sorted order for BST), Preorder (Root, Left, Right), Postorder (Left, Right, Root), Level-Order (BFS).',
        'BST Invariant: $\\text{Left Subtree} < \\text{Root} < \\text{Right Subtree}$.',
        'Balanced vs Degenerate: A balanced BST has height $O(\\log N)$; an unbalanced skewed BST degrades to an $O(N)$ linked list.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// Inorder Traversal (Sorted order for BST)
function inorderTraversal(root: TreeNode | null, result: number[] = []): number[] {
  if (!root) return result;
  inorderTraversal(root.left, result);  // Left
  result.push(root.val);               // Root
  inorderTraversal(root.right, result); // Right
  return result;
}`,
          explanation: 'Inorder traversal processes nodes in ascending sorted order for any valid BST.'
        },
        {
          language: 'Python',
          code: `# Python Maximum Depth of Binary Tree
def max_depth(root: TreeNode | None) -> int:
    if not root:
        return 0
    left_height = max_depth(root.left)
    right_height = max_depth(root.right)
    return 1 + max(left_height, right_height)`,
          explanation: 'Recursive depth calculation computes subtree heights and bubbles maximums upward.'
        }
      ],
      example: {
        title: 'Validate Binary Search Tree',
        description: 'Verifies whether a binary tree satisfies the BST property using valid range boundaries.',
        code: `function isValidBST(root: TreeNode | null, min = -Infinity, max = Infinity): boolean {
  if (!root) return true;

  // Root must strictly respect min and max bounds
  if (root.val <= min || root.val >= max) {
    return false;
  }

  // Left subtree must be < root.val; Right subtree must be > root.val
  return (
    isValidBST(root.left, min, root.val) &&
    isValidBST(root.right, root.val, max)
  );
}`,
        explanation: 'Passing down dynamic `(min, max)` bounds ensures all nodes in subtrees respect ancestral limits.'
      },
      commonPatterns: [
        {
          name: 'DFS Subtree Aggregation',
          description: 'Recursively computing subtree values (height, sum, count) and aggregating at the parent.'
        },
        {
          name: 'Lowest Common Ancestor (LCA)',
          description: 'Finding the lowest shared ancestor node between two target nodes in $O(N)$ time.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Hierarchical parent-child relationships, subtree sums, or paths from root to leaves.',
          'Finding maximum depth, checking symmetry, or inverting a binary tree.',
          'BST range queries or kth smallest element in BST.'
        ],
        clues: [
          '"Kth smallest element in BST" -> Inorder traversal (yields ascending order).',
          '"Maximum path sum / tree diameter" -> Postorder DFS computing left and right subtree heights.',
          '"Check if tree is valid BST" -> DFS with `(min, max)` range boundaries.'
        ],
        askYourself: [
          'Can this problem be broken down into: Solve for left child, solve for right child, combine at root?',
          'What is the base case when `root === null`?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Only checking that `node.left < node.val < node.right` locally without verifying ancestral subtree bounds.',
          fix: 'Pass dynamic `(min, max)` ranges down the recursion tree.'
        },
        {
          mistake: 'Assuming a tree is balanced without rotation mechanisms (e.g. creating unbalanced trees from sorted arrays).',
          fix: 'Construct trees by picking the midpoint of sorted arrays as root recursively.'
        }
      ],
      complexity: {
        time: 'Balanced BST Search/Insert/Delete: O(log N) | Traversal: O(N) | Unbalanced: O(N)',
        space: 'O(H) call stack where H is tree height (O(log N) balanced, O(N) skewed)'
      },
      whenToUse: [
        'Maintaining dynamic datasets with fast $O(\\log N)$ lookup, range queries, and sorted order.',
        'Hierarchical representations like DOM trees, file systems, and decision trees.'
      ],
      keyTakeaways: [
        'Inorder traversal of a BST produces strictly sorted values.',
        'Balanced trees guarantee $O(\\log N)$ search, insert, and delete operations.',
        'Tree algorithms are naturally solved using recursive divide-and-conquer.'
      ]
    }
  },
  {
    id: 'ds-8',
    title: 'Graphs & Adjacency Representations',
    category: 'Data Structures',
    description: 'Vertices and edges, adjacency lists vs matrices, directed vs undirected, weighted graphs, and cycle detection.',
    duration: '4.5 hours',
    xpReward: 180,
    level: 'Advanced',
    practiceTopic: 'Graphs',
    prerequisites: ['Binary Trees & Binary Search Trees (BST)', 'Queues (FIFO), Deques & Ring Buffers'],
    notes: {
      concept: 'A Graph is a non-linear data structure consisting of a finite set of Vertices ($V$, or nodes) and Edges ($E$) that connect pairs of vertices. Graphs can be Directed (one-way relationships) or Undirected (bidirectional), and Weighted (edges carry numeric costs) or Unweighted.',
      whyItMatters: 'Graphs model real-world interconnected networks: social networks (followers), mapping systems (GPS routing), recommendation engines, dependency resolution (build systems), and network routing protocols.',
      coreIdeas: [
        'Adjacency List: A hash map or array of lists mapping each vertex to its adjacent neighbors ($O(V + E)$ space, optimal for sparse graphs).',
        'Adjacency Matrix: A 2D array of size $V \\times V$ where `matrix[u][v] = 1` indicates an edge ($O(V^2)$ space, optimal for dense graphs).',
        'Connected Components: Subsets of nodes where any two nodes are connected by paths.',
        'Cyclic vs Acyclic (DAG): A graph with no cycles is a Directed Acyclic Graph, fundamental for scheduling and dependencies.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Building an Adjacency List Graph
class Graph {
  private adjList = new Map<number, number[]>();

  addVertex(v: number): void {
    if (!this.adjList.has(v)) this.adjList.set(v, []);
  }

  addEdge(u: number, v: number, bidirectional = true): void {
    this.addVertex(u);
    this.addVertex(v);
    this.adjList.get(u)!.push(v);
    if (bidirectional) {
      this.adjList.get(v)!.push(u);
    }
  }

  getNeighbors(v: number): number[] {
    return this.adjList.get(v) || [];
  }
}`,
          explanation: 'Adjacency list is the standard graph representation for sparse networks.'
        },
        {
          language: 'Python',
          code: `# Python Adjacency List using defaultdict
from collections import defaultdict

graph = defaultdict(list)
edges = [[0, 1], [0, 2], [1, 2], [2, 3]]

for u, v in edges:
    graph[u].append(v)
    graph[v].append(u) # Bidirectional`,
          explanation: '`defaultdict(list)` builds graph adjacency structures concisely.'
        }
      ],
      example: {
        title: 'Number of Connected Island Components (Grid Graph)',
        description: 'Counts the number of distinct islands in a 2D binary grid using DFS.',
        code: `function numIslands(grid: string[][]): number {
  if (!grid || grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r: number, c: number) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') {
      return;
    }
    grid[r][c] = '0'; // Mark visited in-place

    // Visit all 4 orthogonal neighbors
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c); // Sink connected island
      }
    }
  }

  return count;
}`,
        explanation: 'DFS traverses every connected 1s cluster and marks them visited in O(R * C) time.'
      },
      commonPatterns: [
        {
          name: 'Grid as Implicit Graph',
          description: 'Treating 2D matrices as graphs where cells are vertices and adjacent cells are edges.'
        },
        {
          name: 'Visited Set / State Coloring',
          description: 'Tracking visited nodes with a `Set<number>` or 3-state array (0=unvisited, 1=visiting, 2=visited) for cycle detection.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Pairs of connections, prerequisite relationships, or 2D grid matrix traversals.',
          'Finding connected groups, reachable destinations, or shortest paths.',
          'Checking if a task ordering / schedule is possible without circular dependencies.'
        ],
        clues: [
          '"Number of islands / connected components" -> DFS/BFS flood fill with visited tracking.',
          '"Course Schedule / build dependencies" -> Topological Sort on DAG (Kahn\'s algorithm or DFS 3-color).',
          '"Shortest path in unweighted maze" -> BFS with Queue.'
        ],
        askYourself: [
          'Is the graph directed or undirected? Is it cyclic?',
          'How will I track visited nodes to avoid infinite recursion?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Forgetting to mark nodes as visited, leading to infinite recursion loops in cyclic graphs.',
          fix: 'Always add the current node to a `visited` set immediately upon entry.'
        },
        {
          mistake: 'Using an adjacency matrix $O(V^2)$ when $V = 10^5$, causing out-of-memory errors.',
          fix: 'Use an adjacency list $O(V + E)$ for sparse graph problems.'
        }
      ],
      complexity: {
        time: 'Traversal (BFS/DFS): O(V + E) with Adjacency List | O(V²) with Adjacency Matrix',
        space: 'O(V + E) for graph storage, O(V) for visited set and recursion/queue stack'
      },
      whenToUse: [
        'Modeling networks, friend relationships, flight routes, and dependency build pipelines.',
        'Solving maze pathfinding and island connectivity problems.'
      ],
      keyTakeaways: [
        'Adjacency lists ($O(V + E)$) are preferred for sparse graphs; adjacency matrices ($O(V^2)$) for dense graphs.',
        'Always track a `visited` set to prevent infinite cycles in undirected or cyclic graphs.',
        '2D grids are implicit graphs where neighbors are typically the 4 or 8 adjacent cells.'
      ]
    }
  }
];
