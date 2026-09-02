import { RoadmapTopic } from '../types';

export const FOUNDATIONS_TOPICS: RoadmapTopic[] = [
  {
    id: 'found-1',
    title: 'Programming Basics & Runtime Execution',
    category: 'Foundations',
    description: 'How code compiles, interprets, executes in memory, and manages program state.',
    duration: '2 hours',
    xpReward: 100,
    level: 'Beginner',
    prerequisites: ['None (Starting Point)'],
    notes: {
      concept: 'Programming is the practice of formalizing computational logic into deterministic instructions a computer can execute. At runtime, high-level code is either compiled directly into machine code binaries (C, C++, Rust, Go) or interpreted through a managed runtime engine / virtual machine with Just-In-Time (JIT) compilation (Python, JavaScript V8, Java JVM).',
      whyItMatters: 'Understanding what happens when code executes—how memory is partitioned between the Call Stack and the Heap, how the CPU processes sequential instructions, and how the runtime manages garbage collection—prevents subtle bugs, memory leaks, and performance bottlenecks.',
      coreIdeas: [
        'Call Stack: Fast LIFO memory structure tracking active function invocations, local primitive variables, and execution frame returns.',
        'Heap Memory: Dynamic, flexible memory pool where dynamically sized objects, arrays, and complex reference structures reside.',
        'Compilation vs Interpretation: Ahead-of-time (AOT) compilers validate types and generate native binaries; JIT engines profile and optimize hot execution paths at runtime.',
        'Program State: The complete snapshot of all active variables, heap allocations, and call stack pointers at any single clock cycle.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Synchronous call stack execution
function multiply(a: number, b: number): number {
  return a * b; // Step 2: Stack frame executes and returns scalar
}

function calculateTotal(price: number, taxRate: number): number {
  const tax = multiply(price, taxRate); // Step 1: Pushes multiply() onto stack
  return price + tax;
}

const total = calculateTotal(100, 0.08); // Returns 108`,
          explanation: 'Each function invocation creates a stack frame that pops off immediately upon returning.'
        },
        {
          language: 'Python',
          code: `# Python script execution & heap allocation
def process_data(values: list[int]) -> int:
    total = sum(values) # List resides on heap; sum runs on stack frame
    return total

result = process_data([10, 20, 30]) # Returns 60`,
          explanation: 'Python lists are dynamically allocated heap objects managed by reference counting and garbage collection.'
        }
      ],
      example: {
        title: 'Stack Frame & Memory Allocation Lifecycle',
        description: 'Demonstrates primitive values stored by value on the stack vs objects stored by reference in heap.',
        code: `// 1. Primitive on Stack (copied by value)
let count = 42;
let newCount = count; // Independent memory slot created on stack
newCount += 1;
console.log(count);    // 42 (original remains untouched)

// 2. Reference on Heap (copied by reference pointer)
let user = { name: "Alex", score: 100 };
let alias = user;      // Copies the pointer address, not the object
alias.score = 150;
console.log(user.score); // 150 (mutated through shared heap memory address)`,
        explanation: 'Modifying an object through any alias alters the single underlying allocation on the heap.'
      },
      commonPatterns: [
        {
          name: 'Pure Functional Transformation',
          description: 'Writing deterministic routines where output depends strictly on input arguments without side effects.'
        },
        {
          name: 'Defensive Input Guarding',
          description: 'Validating types, non-null assertions, and boundary ranges before allocating memory or executing deep logic.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Unexpected state changes occurring across seemingly unrelated functions.',
          'Performance slowdowns caused by excessive garbage collection allocations inside loops.',
          'Stack overflow errors resulting from recursive calls missing base cases.'
        ],
        clues: [
          'Modifying an array or object in a helper function mutates the caller data (pass-by-reference).',
          'Deep cloning vs shallow copying requirements in state management.'
        ],
        askYourself: [
          'Is this variable stored on the stack by value, or on the heap by reference?',
          'Will mutating this argument produce unintended side effects elsewhere in the application?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Assuming objects or arrays are cloned when assigned with `=` operator.',
          fix: 'Use shallow cloning (`{...obj}` or `[...arr]`) or deep cloning (`structuredClone(obj)`) when independent state is required.'
        },
        {
          mistake: 'Exceeding the maximum call stack size through unbounded recursion.',
          fix: 'Always provide a strictly reachable base case and prefer iterative loops for large inputs.'
        }
      ],
      complexity: {
        time: 'O(1) stack allocation, O(1) primitive arithmetic and assignments',
        space: 'O(1) stack frame for local primitives, O(N) heap for dynamic collections',
        tradeoffs: 'Interpreted code enables rapid cross-platform development, whereas compiled native code provides maximal execution speed.'
      },
      whenToUse: [
        'Setting up architecture for any new software module.',
        'Debugging unintended state mutations caused by shared reference pointers.',
        'Profiling memory leaks and optimizing garbage collector pressure.'
      ],
      keyTakeaways: [
        'Stack memory is fast, limited in size, and automatically cleaned up upon frame exit.',
        'Heap memory is large, dynamically allocated, and cleaned up by garbage collection.',
        'Primitives (numbers, booleans) copy by value; objects and arrays copy by reference pointer.'
      ]
    }
  },
  {
    id: 'found-2',
    title: 'Variables, Data Types & Memory',
    category: 'Foundations',
    description: 'Primitive types, reference types, mutability, dynamic typing, and type safety.',
    duration: '2.5 hours',
    xpReward: 120,
    level: 'Beginner',
    prerequisites: ['Programming Basics & Runtime Execution'],
    notes: {
      concept: 'A variable is a named binding to a storage location in memory. Data types instruct the compiler or runtime how many bits to allocate, how to encode those bits (integers, floating-point numbers, characters, booleans, pointer addresses), and which operations are mathematically valid.',
      whyItMatters: 'Type mismatch bugs, unexpected type coercions (like `"5" + 2 = "52"`), and floating-point precision flaws represent a major source of production defects. Mastering strong typing creates self-documenting, crash-resilient code.',
      coreIdeas: [
        'Primitive Types: Immutable building blocks (numbers, strings, booleans, symbols, null, undefined).',
        'Composite Types: Dynamic collections that store multiple values (arrays, objects, dictionaries, structs).',
        'Immutability: Values that cannot be altered in-place; modifications produce a new instance.',
        'Type Coercion: Implicit conversion between distinct types performed by dynamically typed languages.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Explicit static typing
let age: number = 25;
let username: string = "alex_dev";
let isActive: boolean = true;
let scores: readonly number[] = [95, 88, 92]; // Immutable array

interface UserProfile {
  readonly id: string;
  name: string;
  email?: string; // Optional field
}`,
          explanation: 'TypeScript verifies types at compile time, eliminating runtime undefined errors.'
        },
        {
          language: 'Python',
          code: `# Dynamic typing with explicit type hints
age: int = 25
username: str = "alex_dev"
is_active: bool = True
coordinates: tuple[float, float] = (37.7749, -122.4194) # Immutable tuple`,
          explanation: 'Python uses dynamic typing at runtime with optional type hints for static analysis.'
        }
      ],
      example: {
        title: 'Safe State Immutability Pattern',
        description: 'Updating nested application state without mutating existing objects or arrays.',
        code: `const initialState = {
  user: { id: "u1", name: "Sarah" },
  skills: ["TypeScript", "Python"]
};

// Safe update: Shallow spread with overridden properties
const updatedState = {
  ...initialState,
  user: { ...initialState.user, name: "Sarah Connor" },
  skills: [...initialState.skills, "Go"] // Fresh array allocation
};

console.log(initialState.skills.length); // 2 (original untouched)
console.log(updatedState.skills.length); // 3 (updated clone)`,
        explanation: 'Spread operators shallow-clone collections, preserving original references for safe concurrency and caching.'
      },
      commonPatterns: [
        {
          name: 'Const by Default',
          description: 'Always declare variables with `const` unless reassignment is explicitly required.'
        },
        {
          name: 'Explicit Type Narrowing',
          description: 'Using `typeof val === "string"` or `if (val !== null)` before accessing properties.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Tracking cumulative totals or state that changes across loop iterations.',
          'Avoiding duplicate computations by caching values in local variables.',
          'Handling nullable return values safely.'
        ],
        clues: [
          'Variable values resetting unexpectedly when declared inside loop bodies.',
          'Floating-point equality comparisons failing unexpectedly (`0.1 + 0.2 === 0.3` is false).'
        ],
        askYourself: [
          'Does this variable need to change (let) or should it remain constant (const)?',
          'What happens if this variable is null or undefined at runtime?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Using loose equality `==` instead of strict equality `===` in JavaScript.',
          fix: 'Always use `===` to prevent unintended implicit type coercion.'
        },
        {
          mistake: 'Floating-point rounding errors (e.g. `0.1 + 0.2 !== 0.3`).',
          fix: 'Use integer cents for currencies or check `Math.abs(a - b) < Number.EPSILON` for float comparisons.'
        }
      ],
      complexity: {
        time: 'O(1) variable allocation and primitive reads/writes',
        space: 'O(1) memory per scalar variable, O(K) for composite structures with K elements'
      },
      whenToUse: [
        'Modeling domain entities, user sessions, mathematical calculations, and configurations.',
        'Selecting the most memory-efficient type for large data sets.'
      ],
      keyTakeaways: [
        'Prefer immutability (`const`, readonly) to avoid hidden side effects.',
        'Always validate nullability and handle missing default values defensively.',
        'Use strict equality (`===`) to guarantee both type and value match.'
      ]
    }
  },
  {
    id: 'found-3',
    title: 'Operators & Expressions',
    category: 'Foundations',
    description: 'Arithmetic, logical operators, short-circuit evaluation, bitwise operations, and precedence.',
    duration: '2 hours',
    xpReward: 110,
    level: 'Beginner',
    prerequisites: ['Variables, Data Types & Memory'],
    notes: {
      concept: 'Operators are special symbols that perform computations on one or more operands to evaluate a resultant value. Expressions combine variables, constants, and operators to yield output.',
      whyItMatters: 'Operator precedence and short-circuit logic govern control flow decisions and allow writing concise, expressive, and safe expressions (e.g. guarding against null dereferencing).',
      coreIdeas: [
        'Arithmetic: `+`, `-`, `*`, `/`, `%` (modulo remainder), `**` (exponentiation).',
        'Comparison: `===`, `!==`, `<`, `>`, `<=`, `>=`.',
        'Logical: `&&` (logical AND), `||` (logical OR), `!` (logical NOT), `??` (nullish coalescing).',
        'Short-Circuit Evaluation: Logical expressions stop evaluating as soon as the outcome is determined (e.g. `a && a.method()`).'
      ],
      syntaxImplementation: [
        {
          language: 'JavaScript',
          code: `// Nullish coalescing and optional chaining
const user = { profile: { name: "Aria" } };

// Short-circuit guarding
const displayName = user?.profile?.name ?? "Anonymous";
const hasValidAge = user.age && user.age >= 18;

// Bitwise parity check
const isEven = (num) => (num & 1) === 0;`,
          explanation: '`??` only falls back for `null` and `undefined`, preserving `0` and `false` values safely.'
        },
        {
          language: 'Python',
          code: `# Pythonic logical operators
user = {"name": "Aria"}

# Safe retrieval with fallback
display_name = user.get("name") or "Anonymous"
is_even = (42 & 1) == 0 # Bitwise check`,
          explanation: 'Python uses `and`, `or`, and `not` with intuitive short-circuit behavior.'
        }
      ],
      example: {
        title: 'Safe Guarding with Short-Circuiting',
        description: 'Preventing runtime exceptions when working with nullable nested objects.',
        code: `function getInitials(user) {
  // If user is null or name is missing, short circuit immediately
  if (!user || !user.name || typeof user.name !== 'string') {
    return 'NA';
  }
  
  return user.name
    .split(' ')
    .filter(part => part.length > 0)
    .map(part => part[0].toUpperCase())
    .join('');
}`,
        explanation: 'The logical OR check handles null, undefined, and non-string types safely before invoking `.split()`.'
      },
      commonPatterns: [
        {
          name: 'Default Parameter Fallbacks',
          description: 'Using `const limit = options?.limit ?? 10;` to assign sensible defaults.'
        },
        {
          name: 'Parity and Power-of-Two Bitwise Testing',
          description: '`(n & (n - 1)) === 0` tests if a positive integer is a power of 2 in O(1) time.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Checking divisibility, parity (even/odd), or cycling within array bounds using `%` modulo.',
          'Guarding against null reference errors in nested data structures.',
          'Bitwise speedups for powers of 2 or integer flag masks.'
        ],
        clues: [
          'Circular array indexing: `(index + 1) % length` wraps around seamlessly.',
          'Zero and false values being incorrectly overwritten by `||` fallbacks.'
        ],
        askYourself: [
          'Is `0` or `false` a valid value here? If so, use nullish coalescing `??` instead of `||`.',
          'Are parentheses needed to make the operator evaluation order explicit?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Using `||` instead of `??` when `0` or `false` are valid inputs.',
          fix: 'Use `??` when you only want to replace `null` or `undefined`.'
        },
        {
          mistake: 'Misunderstanding operator precedence in compound expressions (e.g. `a + b * c`).',
          fix: 'Always use explicit parentheses `(a + (b * c))` to make evaluation order unmistakable.'
        }
      ],
      complexity: {
        time: 'O(1) for all primitive and bitwise operations',
        space: 'O(1) auxiliary memory'
      },
      whenToUse: [
        'Formulating arithmetic transformations, logical guards, and bitwise flags.',
        'Extracting nested configuration fields with graceful fallbacks.'
      ],
      keyTakeaways: [
        'Short-circuiting skips unnecessary right-hand evaluations.',
        '`??` distinguishes empty values from `0` or `false`.',
        'Bitwise operators work on 32-bit integers with maximum CPU speed.'
      ]
    }
  },
  {
    id: 'found-4',
    title: 'Conditionals & Control Flow',
    category: 'Foundations',
    description: 'if/else branching, switch statements, ternary operators, and early exit guard clauses.',
    duration: '2 hours',
    xpReward: 110,
    level: 'Beginner',
    prerequisites: ['Operators & Expressions'],
    notes: {
      concept: 'Control flow structures determine which blocks of instructions execute based on evaluated boolean conditions. Branching constructs allow programs to make decisions dynamically.',
      whyItMatters: 'Clean control flow is the cornerstone of readable and maintainable software. Eliminating deeply nested `if/else` ladders with early returns reduces cognitive complexity and prevents subtle logic bugs.',
      coreIdeas: [
        'Boolean Expressions: Evaluates strictly to `true` or `false`.',
        'Guard Clauses: Returning immediately when preconditions fail, keeping the main logic at zero indentation.',
        'Switch/Case vs Lookup Table: Using exhaustive pattern matching or hash tables for multi-way branching.',
        'Ternary Operator: Compact inline expressions `condition ? valA : valB` for simple assignments.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Guard Clause pattern (Clean Code)
function calculateDiscount(user: { tier: string; yearsActive: number } | null): number {
  if (!user) return 0; // Guard 1: Null check
  if (user.yearsActive < 1) return 0; // Guard 2: Precondition

  // Main Happy Path (flat, readable)
  switch (user.tier) {
    case 'platinum': return 0.25;
    case 'gold': return 0.15;
    case 'silver': return 0.05;
    default: return 0.02;
  }
}`,
          explanation: 'Guard clauses remove deep nesting and isolate edge conditions at the top.'
        },
        {
          language: 'Python',
          code: `# Python Guard Clauses with dictionary dispatch
def get_status_code_message(code: int) -> str:
    messages = {
        200: "OK",
        201: "Created",
        400: "Bad Request",
        404: "Not Found",
        500: "Internal Server Error"
    }
    return messages.get(code, "Unknown Status")`,
          explanation: 'Dictionary lookups provide O(1) multi-way branch resolution.'
        }
      ],
      example: {
        title: 'Refactoring Nested Logic to Guard Clauses',
        description: 'Transforming a complex 4-level nested conditional into a clean linear sequence.',
        code: `// ❌ BAD: Arrow anti-pattern (nested pyramids)
function processOrderBad(order) {
  if (order) {
    if (order.items && order.items.length > 0) {
      if (order.paymentVerified) {
        return "Order Shipped";
      } else {
        return "Payment failed";
      }
    } else {
      return "Empty order";
    }
  } else {
    return "Invalid order";
  }
}

// ✅ GOOD: Guard clauses (linear flow)
function processOrderGood(order) {
  if (!order) return "Invalid order";
  if (!order.items || order.items.length === 0) return "Empty order";
  if (!order.paymentVerified) return "Payment failed";

  return "Order Shipped"; // Happy path
}`,
        explanation: 'Linear guard clauses allow developers to scan top-down without tracking mental state across nested braces.'
      },
      commonPatterns: [
        {
          name: 'Guard Clause / Early Return',
          description: 'Reject invalid inputs immediately at the top of a function.'
        },
        {
          name: 'Dictionary / Map Dispatch',
          description: 'Replacing long `if/else if/else if` chains with a key-value handler dictionary.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Multiple distinct business rules or input validation checks.',
          'Handling edge conditions before entering the primary algorithmic loop.',
          'State transitions where actions depend on discrete categorical states.'
        ],
        clues: [
          'Deeply nested if statements exceeding 2-3 levels of indentation.',
          'Duplicated cleanup code inside multiple branch blocks.'
        ],
        askYourself: [
          'Can I invert this condition and return early to flatten the nesting?',
          'Is this multi-way branching better represented as a dictionary/hash map lookup?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Forgetting `break` in `switch` statements, causing unintended case fallthrough.',
          fix: 'Always add `break` or `return` inside each switch case block.'
        },
        {
          mistake: 'Overusing nested ternary operators (e.g. `a ? b ? c : d : e`).',
          fix: 'Limit ternaries to simple single-line assignments; use standard `if/else` or helper functions for multi-step choices.'
        }
      ],
      complexity: {
        time: 'O(1) branching decision time',
        space: 'O(1) memory overhead'
      },
      whenToUse: [
        'Directing program execution based on user inputs, permissions, or system statuses.',
        'Enforcing business validation rules and edge case rejections.'
      ],
      keyTakeaways: [
        'Prefer guard clauses and early returns over deeply nested `if/else` blocks.',
        'Use object/map lookups for large multi-value branching.',
        'Keep ternary expressions simple and readable.'
      ]
    }
  },
  {
    id: 'found-5',
    title: 'Loops & Iteration',
    category: 'Foundations',
    description: 'for loops, while loops, loop invariants, nested loops, break/continue, and iteration safety.',
    duration: '3 hours',
    xpReward: 130,
    level: 'Beginner',
    prerequisites: ['Conditionals & Control Flow'],
    notes: {
      concept: 'Loops repeatedly execute a block of code as long as a specified condition remains true. Iteration allows operating over data collections, searching for elements, and computing aggregated values.',
      whyItMatters: 'Almost every algorithmic problem involves iterating over collections. Knowing how to write tight, bounded loops without off-by-one errors or infinite execution traps is fundamental to coding.',
      coreIdeas: [
        'For Loop: Best when the number of iterations is known in advance (e.g., iterating indices `0` to `n - 1`).',
        'While Loop: Best when the termination condition depends on dynamic runtime state (e.g., two pointers moving inward).',
        'Loop Invariant: A condition that is true before and after every iteration, proving correctness.',
        'Break & Continue: `break` exits the entire loop immediately; `continue` skips straight to the next iteration step.'
      ],
      syntaxImplementation: [
        {
          language: 'JavaScript',
          code: `// Standard index loop
const arr = [10, 20, 30, 40];
for (let i = 0; i < arr.length; i++) {
  if (arr[i] === 20) continue; // Skip 20
  if (arr[i] === 40) break;    // Stop at 40
}

// Modern iterable loop
for (const item of arr) {
  console.log(item);
}`,
          explanation: '`for...of` provides clean iteration over arrays, strings, and sets without manual index tracking.'
        },
        {
          language: 'Python',
          code: `# Python iteration patterns
numbers = [10, 20, 30, 40]

# Enumerate for index + value
for index, value in enumerate(numbers):
    print(f"Index {index}: {value}")

# While loop with two-pointer termination
left, right = 0, len(numbers) - 1
while left < right:
    left += 1
    right -= 1`,
          explanation: '`enumerate` avoids manual index incrementing and eliminates off-by-one errors.'
        }
      ],
      example: {
        title: 'Two-Pointer Inward Loop',
        description: 'A while loop that reverses an array in place in O(N) time and O(1) space.',
        code: `function reverseArrayInPlace<T>(arr: T[]): T[] {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    // Swap elements at left and right pointers
    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;

    // Move pointers inward toward termination
    left++;
    right--;
  }
  return arr;
}`,
        explanation: 'The loop invariant `left < right` guarantees that pointers meet in the middle without infinite looping.'
      },
      commonPatterns: [
        {
          name: 'Two-Pointer Inward Traversal',
          description: 'Starting at opposite bounds `0` and `length - 1` and moving inward until `left >= right`.'
        },
        {
          name: 'Sliding Window Loop',
          description: 'Expanding a right index pointer while conditionally advancing a left pointer inside a nested while.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Linear scanning through lists, arrays, or strings.',
          'Finding minimum, maximum, cumulative sum, or count of matching elements.',
          'Transforming elements one-by-one into a new collection.'
        ],
        clues: [
          'Need to process elements until a condition is met (use `while`).',
          'Need to visit every index from 0 to N-1 (use `for`).'
        ],
        askYourself: [
          'Does this loop guarantee termination in all possible cases?',
          'What are the exact start and end index boundary conditions (0 vs 1, `<` vs `<=`)?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Off-by-one error (e.g. `i <= arr.length` causing index out of bounds).',
          fix: 'Always use `i < arr.length` for 0-indexed arrays, or use `for (const item of arr)`.'
        },
        {
          mistake: 'Forgetting to increment or decrement the loop variable inside a `while` loop, creating an infinite loop.',
          fix: 'Ensure the terminating condition changes monotonically inside the loop body.'
        }
      ],
      complexity: {
        time: 'O(N) for single linear loops, O(N * M) for nested 2D loops',
        space: 'O(1) auxiliary space for pointer variables'
      },
      whenToUse: [
        'Processing array elements, filtering records, accumulating sums, or finding maximums.',
        'Traversing grid coordinates or running multi-pointer algorithms.'
      ],
      keyTakeaways: [
        'Prefer declarative iterators (`for...of`, `enumerate`) unless explicit index manipulation is required.',
        'Double-check boundary conditions `<` vs `<=` to avoid off-by-one bugs.',
        'Ensure `while` loop counter variables advance every iteration.'
      ]
    }
  },
  {
    id: 'found-6',
    title: 'Functions, Scope & Closures',
    category: 'Foundations',
    description: 'Parameters, return values, pass-by-value/reference, lexical scope, closures, and call stack.',
    duration: '3 hours',
    xpReward: 140,
    level: 'Beginner',
    prerequisites: ['Loops & Iteration'],
    notes: {
      concept: 'Functions are reusable, encapsulated blocks of code designed to perform a specific task. Scope defines the accessibility of variables across different parts of a program. A closure is a function that retains access to its lexical outer scope even after the outer function has finished executing.',
      whyItMatters: 'Functions promote DRY (Don\'t Repeat Yourself) modular design. Closures allow data encapsulation, private state variables, factory patterns, and powerful callback handlers.',
      coreIdeas: [
        'Parameters vs Arguments: Parameters are variable placeholders in the function definition; arguments are the real values passed at invocation.',
        'Lexical Scope: Variable resolution is determined by the physical placement of code blocks at compile time.',
        'Closures: Inner functions bundle references to their surrounding lexical state.',
        'Pure Functions: Return identical output for identical inputs with zero observable side effects.'
      ],
      syntaxImplementation: [
        {
          language: 'JavaScript',
          code: `// Closure: Private Counter Factory
function createCounter(initialValue = 0) {
  let count = initialValue; // Private variable encapsulated in closure

  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.getValue());  // 11`,
          explanation: '`count` cannot be accessed directly from the outside, ensuring clean encapsulation.'
        },
        {
          language: 'Python',
          code: `# Python Closure with nonlocal keyword
def make_multiplier(factor: int):
    def multiplier(number: int) -> int:
        return number * factor # Accesses 'factor' from enclosing scope
    return multiplier

double = make_multiplier(2)
print(double(15)) # 30`,
          explanation: 'The inner `multiplier` retains the bound `factor` parameter across subsequent invocations.'
        }
      ],
      example: {
        title: 'Memoization Decorator using Closure',
        description: 'Caches expensive computation results in a closed dictionary.',
        code: `function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>(); // Private cache in closure scope

  return function(...args: any[]) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key); // Cache hit O(1)
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  } as T;
}`,
        explanation: 'The returned function accesses the `cache` Map across calls, dramatically speeding up repeated computations.'
      },
      commonPatterns: [
        {
          name: 'Higher-Order Functions',
          description: 'Functions that accept other functions as arguments (e.g. `.map()`, `.filter()`) or return new functions.'
        },
        {
          name: 'Factory Functions & Module Pattern',
          description: 'Encapsulating internal state and exposing only deliberate public methods.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Decomposing a complex algorithm into smaller, testable sub-functions.',
          'Maintaining private state between function calls without polluting global scope.',
          'Passing custom comparison or filter callbacks to algorithms.'
        ],
        clues: [
          'Repeated logic blocks across multiple places in code (extract to a function).',
          'Needing a function that remembers configuration parameters (use closure factory).'
        ],
        askYourself: [
          'Is this function pure, or does it mutate external variables?',
          'Are there helper subproblems that can be isolated into recursive or utility functions?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Mutating arguments passed by reference unexpectedly inside a function body.',
          fix: 'Treat function inputs as read-only and return newly constructed values instead.'
        },
        {
          mistake: 'Memory leaks caused by retaining references in long-lived closures unnecessarily.',
          fix: 'Clean up event listeners and nullify large cached data structures when no longer needed.'
        }
      ],
      complexity: {
        time: 'O(1) function invocation overhead on call stack',
        space: 'O(1) per stack frame, O(K) for retained variables in closure scope'
      },
      whenToUse: [
        'Breaking large monolithic algorithms into testable, isolated sub-routines.',
        'Encapsulating private state and creating configurable utility pipelines.'
      ],
      keyTakeaways: [
        'Aim for pure functions where output depends purely on inputs.',
        'Closures enable private state and powerful higher-order abstractions.',
        'Pass-by-reference means mutating objects inside functions affects caller scope.'
      ]
    }
  },
  {
    id: 'found-7',
    title: 'Basic Problem Solving & Edge Cases',
    category: 'Foundations',
    description: 'Systematic problem deconstruction, input validation, boundary tests, integer overflow, and edge cases.',
    duration: '2.5 hours',
    xpReward: 120,
    level: 'Beginner',
    prerequisites: ['Functions, Scope & Closures'],
    notes: {
      concept: 'Problem solving in software engineering is the deliberate process of reading requirements, identifying constraints, breaking a problem into manageable subproblems, writing pseudocode, and testing against edge cases before implementation.',
      whyItMatters: 'Most interview rejections and production outages do not occur because a developer didn\'t know syntax; they occur because boundary conditions (empty arrays, negative numbers, duplicates, huge inputs) were neglected.',
      coreIdeas: [
        'Understand Constraints: Check input bounds (e.g., $N \\le 10^5$ requires an $O(N)$ or $O(N \\log N)$ solution, not $O(N^2)$).',
        'Common Edge Cases: Empty collections, single-element collections, all duplicates, negative numbers, null/undefined inputs, even vs odd lengths.',
        'Stepwise Refinement: 1. Clarify -> 2. Examples -> 3. Brute force -> 4. Optimize -> 5. Code -> 6. Test.',
        'Defensive Coding: Validating inputs before executing computationally heavy algorithms.'
      ],
      syntaxImplementation: [
        {
          language: 'TypeScript',
          code: `// Systematic Boundary Checking
function findMaxSubarraySum(nums: number[]): number {
  // Edge Case 1: Empty array guard
  if (!nums || nums.length === 0) return 0;
  
  // Edge Case 2: Single element
  if (nums.length === 1) return nums[0];

  let currentSum = nums[0];
  let maxSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}`,
          explanation: 'Explicitly handling array length 0 and 1 prevents index errors and handles all-negative inputs correctly.'
        },
        {
          language: 'Python',
          code: `# Python Defensive Input Validation
def binary_search(arr: list[int], target: int) -> int:
    if not arr:
        return -1 # Edge case: Empty list
        
    left, right = 0, len(arr) - 1
    while left <= right:
        # Prevent potential integer overflow
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
          explanation: 'Calculating `mid = left + (right - left) // 2` prevents integer overflow present in `(left + right) // 2`.'
        }
      ],
      example: {
        title: 'Edge Case Testing Matrix',
        description: 'How to systematically test an algorithm before submitting.',
        code: `// Test Suite for a Palindrome or Array function
const testCases = [
  { input: "", expected: true, label: "Empty string/collection" },
  { input: "a", expected: true, label: "Single character/element" },
  { input: "racecar", expected: true, label: "Odd length palindrome" },
  { input: "noon", expected: true, label: "Even length palindrome" },
  { input: "hello", expected: false, label: "Standard non-palindrome" },
  { input: "A man, a plan, a canal: Panama", expected: true, label: "Special chars & casing" }
];`,
        explanation: 'Testing across empty, single, even, odd, and edge inputs ensures robust correctness.'
      },
      commonPatterns: [
        {
          name: 'Input Constraint Matching',
          description: 'Evaluating $N \\le 10^3 \\rightarrow O(N^2)$ feasible; $N \\le 10^5 \\rightarrow O(N \\log N)$ required; $N \\le 10^7 \\rightarrow O(N)$ required.'
        },
        {
          name: 'Dry Run Trace Table',
          description: 'Manually stepping through variables on paper for sample input before writing code.'
        }
      ],
      problemSolvingClues: {
        lookFor: [
          'Given constraints in problem statement ($N \\le 10^5$, elements $\\ge -10^9$).',
          'Zero, negative, or duplicate values mentioned in problem description.',
          'Time limits requiring sub-quadratic performance.'
        ],
        clues: [
          'If $N \\le 20$: Backtracking / Exponential $O(2^N)$ or $O(N!)$ is expected.',
          'If $N \\le 10^3$: Quadratic $O(N^2)$ dynamic programming or nested loops will pass.',
          'If $N \\le 10^5$: Linearithmic $O(N \\log N)$ sorting or $O(N)$ linear scan is required.'
        ],
        askYourself: [
          'What happens if the input is empty or contains only 1 element?',
          'What if all elements are identical, or all elements are negative?'
        ]
      },
      commonMistakes: [
        {
          mistake: 'Coding immediately without understanding constraints or edge cases.',
          fix: 'Spend the first 2 minutes writing out sample inputs, constraints, and edge case expectations.'
        },
        {
          mistake: 'Assuming numbers will always be positive or non-null.',
          fix: 'Always test with negative values, zeros, and duplicate numbers.'
        }
      ],
      complexity: {
        time: 'O(1) validation check time',
        space: 'O(1) validation memory overhead'
      },
      whenToUse: [
        'Approaching any coding interview problem or implementing critical business logic.',
        'Auditing code for production safety against edge inputs.'
      ],
      keyTakeaways: [
        'Always verify empty, single, duplicate, negative, and extreme inputs.',
        'Use constraints to identify target Big-O complexity before writing code.',
        'Prevent integer overflow with `mid = left + (right - left) / 2`.'
      ]
    }
  }
];
