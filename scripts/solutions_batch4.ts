export const solutionsBatch4 = {
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
      "JavaScript": `function searchRange(nums, target) {
  function findBound(isFirst) {
    let left = 0, right = nums.length - 1, bound = -1;
    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);
      if (nums[mid] === target) {
        bound = mid;
        if (isFirst) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
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
      "TypeScript": `function searchRange(nums: number[], target: number): number[] {
  function findBound(isFirst: boolean): number {
    let left = 0, right = nums.length - 1, bound = -1;
    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);
      if (nums[mid] === target) {
        bound = mid;
        if (isFirst) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
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
      "Python": `def searchRange(nums: list, target: int) -> list:
    def find_bound(is_first: bool) -> int:
        left, right = 0, len(nums) - 1
        bound = -1
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                bound = mid
                if is_first:
                    right = mid - 1
                else:
                    left = mid + 1
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return bound
    return [find_bound(True), find_bound(False)]`
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
      "JavaScript": `function findMedianSortedArrays(nums1, nums2) {
  if (nums1.length > nums2.length) {
    return findMedianSortedArrays(nums2, nums1);
  }
  const m = nums1.length;
  const n = nums2.length;
  let low = 0;
  let high = m;
  while (low <= high) {
    const i = Math.floor((low + high) / 2);
    const j = Math.floor((m + n + 1) / 2) - i;
    const maxLeft1 = i === 0 ? -Infinity : nums1[i - 1];
    const minRight1 = i === m ? Infinity : nums1[i];
    const maxLeft2 = j === 0 ? -Infinity : nums2[j - 1];
    const minRight2 = j === n ? Infinity : nums2[j];
    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
      if ((m + n) % 2 !== 0) {
        return Math.max(maxLeft1, maxLeft2);
      } else {
        return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;
      }
    } else if (maxLeft1 > minRight2) {
      high = i - 1;
    } else {
      low = i + 1;
    }
  }
  return 0;
}`,
      "TypeScript": `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  if (nums1.length > nums2.length) {
    return findMedianSortedArrays(nums2, nums1);
  }
  const m = nums1.length;
  const n = nums2.length;
  let low = 0;
  let high = m;
  while (low <= high) {
    const i = Math.floor((low + high) / 2);
    const j = Math.floor((m + n + 1) / 2) - i;
    const maxLeft1 = i === 0 ? -Infinity : nums1[i - 1];
    const minRight1 = i === m ? Infinity : nums1[i];
    const maxLeft2 = j === 0 ? -Infinity : nums2[j - 1];
    const minRight2 = j === n ? Infinity : nums2[j];
    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
      if ((m + n) % 2 !== 0) {
        return Math.max(maxLeft1, maxLeft2);
      } else {
        return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;
      }
    } else if (maxLeft1 > minRight2) {
      high = i - 1;
    } else {
      low = i + 1;
    }
  }
  return 0;
}`,
      "Python": `def findMedianSortedArrays(nums1: list, nums2: list) -> float:
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    low, high = 0, m
    while low <= high:
        i = (low + high) // 2
        j = (m + n + 1) // 2 - i
        max_left1 = float('-inf') if i == 0 else nums1[i - 1]
        min_right1 = float('inf') if i == m else nums1[i]
        max_left2 = float('-inf') if j == 0 else nums2[j - 1]
        min_right2 = float('inf') if j == n else nums2[j]
        if max_left1 <= min_right2 and max_left2 <= min_right1:
            if (m + n) % 2 != 0:
                return float(max(max_left1, max_left2))
            else:
                return (max(max_left1, max_left2) + min(min_right1, min_right2)) / 2.0
        elif max_left1 > min_right2:
            high = i - 1
        else:
            low = i + 1
    return 0.0`
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
      "JavaScript": `function generateParenthesis(n) {
  const result = [];
  function backtrack(current, open, close) {
    if (current.length === n * 2) {
      result.push(current);
      return;
    }
    if (open < n) {
      backtrack(current + '(', open + 1, close);
    }
    if (close < open) {
      backtrack(current + ')', open, close + 1);
    }
  }
  backtrack('', 0, 0);
  return result;
}`,
      "TypeScript": `function generateParenthesis(n: number): string[] {
  const result: string[] = [];
  function backtrack(current: string, open: number, close: number) {
    if (current.length === n * 2) {
      result.push(current);
      return;
    }
    if (open < n) {
      backtrack(current + '(', open + 1, close);
    }
    if (close < open) {
      backtrack(current + ')', open, close + 1);
    }
  }
  backtrack('', 0, 0);
  return result;
}`,
      "Python": `def generateParenthesis(n: int) -> list:
    result = []
    def backtrack(current: str, open_count: int, close_count: int):
        if len(current) == 2 * n:
            result.append(current)
            return
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)
    backtrack('', 0, 0)
    return result`
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
      "JavaScript": `function subsets(nums) {
  const result = [];
  function backtrack(start, path) {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return result;
}`,
      "TypeScript": `function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  function backtrack(start: number, path: number[]) {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return result;
}`,
      "Python": `def subsets(nums: list) -> list:
    result = []
    def backtrack(start: int, path: list):
        result.append(list(path))
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return result`
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
      "JavaScript": `function solveNQueens(n) {
  const result = [];
  const cols = new Set();
  const diag1 = new Set();
  const diag2 = new Set();
  const board = Array.from({ length: n }, () => new Array(n).fill('.'));
  function backtrack(row) {
    if (row === n) {
      result.push(board.map(r => r.join('')));
      return;
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row + col) || diag2.has(row - col)) {
        continue;
      }
      cols.add(col);
      diag1.add(row + col);
      diag2.add(row - col);
      board[row][col] = 'Q';
      backtrack(row + 1);
      board[row][col] = '.';
      cols.delete(col);
      diag1.delete(row + col);
      diag2.delete(row - col);
    }
  }
  backtrack(0);
  return result;
}`,
      "TypeScript": `function solveNQueens(n: number): string[][] {
  const result: string[][] = [];
  const cols = new Set<number>();
  const diag1 = new Set<number>();
  const diag2 = new Set<number>();
  const board: string[][] = Array.from({ length: n }, () => new Array(n).fill('.'));
  function backtrack(row: number) {
    if (row === n) {
      result.push(board.map(r => r.join('')));
      return;
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row + col) || diag2.has(row - col)) {
        continue;
      }
      cols.add(col);
      diag1.add(row + col);
      diag2.add(row - col);
      board[row][col] = 'Q';
      backtrack(row + 1);
      board[row][col] = '.';
      cols.delete(col);
      diag1.delete(row + col);
      diag2.delete(row - col);
    }
  }
  backtrack(0);
  return result;
}`,
      "Python": `def solveNQueens(n: int) -> list:
    result = []
    cols = set()
    diag1 = set()
    diag2 = set()
    board = [['.' for _ in range(n)] for _ in range(n)]
    def backtrack(row: int):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        for col in range(n):
            if col in cols or (row + col) in diag1 or (row - col) in diag2:
                continue
            cols.add(col)
            diag1.add(row + col)
            diag2.add(row - col)
            board[row][col] = 'Q'
            backtrack(row + 1)
            board[row][col] = '.'
            cols.remove(col)
            diag1.remove(row + col)
            diag2.remove(row - col)
    backtrack(0)
    return result`
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
      "JavaScript": `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      "TypeScript": `function maxDepth(root: any): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      "Python": `def maxDepth(root) -> int:
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`
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
      "JavaScript": `function invertTree(root) {
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`,
      "TypeScript": `function invertTree(root: any): any {
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`,
      "Python": `def invertTree(root):
    if not root:
        return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root`
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
      "JavaScript": `function isValidBST(root) {
  function validate(node, min, max) {
    if (!node) return true;
    if (min !== null && node.val <= min) return false;
    if (max !== null && node.val >= max) return false;
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  return validate(root, null, null);
}`,
      "TypeScript": `function isValidBST(root: any): boolean {
  function validate(node: any, min: number | null, max: number | null): boolean {
    if (!node) return true;
    if (min !== null && node.val <= min) return false;
    if (max !== null && node.val >= max) return false;
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  return validate(root, null, null);
}`,
      "Python": `def isValidBST(root) -> bool:
    def validate(node, min_val, max_val):
        if not node:
            return True
        if min_val is not None and node.val <= min_val:
            return False
        if max_val is not None and node.val >= max_val:
            return False
        return validate(node.left, min_val, node.val) and validate(node.right, node.val, max_val)
    return validate(root, None, None)`
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
      "JavaScript": `function lowestCommonAncestor(root, p, q) {
  let curr = root;
  const pVal = typeof p === 'object' && p !== null ? p.val : p;
  const qVal = typeof q === 'object' && q !== null ? q.val : q;
  while (curr) {
    if (pVal < curr.val && qVal < curr.val) {
      curr = curr.left;
    } else if (pVal > curr.val && qVal > curr.val) {
      curr = curr.right;
    } else {
      return curr;
    }
  }
  return null;
}`,
      "TypeScript": `function lowestCommonAncestor(root: any, p: any, q: any): any {
  let curr: any = root;
  const pVal = typeof p === 'object' && p !== null ? p.val : p;
  const qVal = typeof q === 'object' && q !== null ? q.val : q;
  while (curr) {
    if (pVal < curr.val && qVal < curr.val) {
      curr = curr.left;
    } else if (pVal > curr.val && qVal > curr.val) {
      curr = curr.right;
    } else {
      return curr;
    }
  }
  return null;
}`,
      "Python": `def lowestCommonAncestor(root, p, q):
    curr = root
    p_val = p.val if hasattr(p, 'val') else p
    q_val = q.val if hasattr(q, 'val') else q
    while curr:
        if p_val < curr.val and q_val < curr.val:
            curr = curr.left
        elif p_val > curr.val and q_val > curr.val:
            curr = curr.right
        else:
            return curr
    return None`
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
      "JavaScript": `function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  const clone = grid.map(r => [...r]);
  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || clone[r][c] !== '1') {
      return;
    }
    clone[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (clone[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
      "TypeScript": `function numIslands(grid: string[][]): number {
  if (!grid || grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  const clone: string[][] = grid.map(r => [...r]);
  function dfs(r: number, c: number) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || clone[r][c] !== '1') {
      return;
    }
    clone[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (clone[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
      "Python": `def numIslands(grid: list) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    clone = [list(r) for r in grid]
    count = 0
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or clone[r][c] != '1':
            return
        clone[r][c] = '0'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    for r in range(rows):
        for c in range(cols):
            if clone[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`
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
      "JavaScript": `function canFinish(numCourses, prerequisites) {
  const inDegree = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => []);
  for (let i = 0; i < prerequisites.length; i++) {
    const [course, prereq] = prerequisites[i];
    adj[prereq].push(course);
    inDegree[course]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  let count = 0;
  while (queue.length > 0) {
    const node = queue.shift();
    count++;
    for (let i = 0; i < adj[node].length; i++) {
      const neighbor = adj[node][i];
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }
  return count === numCourses;
}`,
      "TypeScript": `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const inDegree = new Array<number>(numCourses).fill(0);
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  for (let i = 0; i < prerequisites.length; i++) {
    const [course, prereq] = prerequisites[i];
    adj[prereq].push(course);
    inDegree[course]++;
  }
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  let count = 0;
  while (queue.length > 0) {
    const node = queue.shift()!;
    count++;
    for (let i = 0; i < adj[node].length; i++) {
      const neighbor = adj[node][i];
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }
  return count === numCourses;
}`,
      "Python": `def canFinish(numCourses: int, prerequisites: list) -> bool:
    in_degree = [0] * numCourses
    adj = [[] for _ in range(numCourses)]
    for course, prereq in prerequisites:
        adj[prereq].append(course)
        in_degree[course] += 1
    queue = [i for i in range(numCourses) if in_degree[i] == 0]
    count = 0
    while queue:
        node = queue.pop(0)
        count += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return count == numCourses`
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
      "JavaScript": `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
    if (maxReach >= nums.length - 1) return true;
  }
  return true;
}`,
      "TypeScript": `function canJump(nums: number[]): boolean {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
    if (maxReach >= nums.length - 1) return true;
  }
  return true;
}`,
      "Python": `def canJump(nums: list) -> bool:
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + jump)
        if max_reach >= len(nums) - 1:
            return True
    return True`
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
      "JavaScript": `function climbStairs(n) {
  if (n <= 2) return n;
  let first = 1;
  let second = 2;
  for (let i = 3; i <= n; i++) {
    const third = first + second;
    first = second;
    second = third;
  }
  return second;
}`,
      "TypeScript": `function climbStairs(n: number): number {
  if (n <= 2) return n;
  let first = 1;
  let second = 2;
  for (let i = 3; i <= n; i++) {
    const third = first + second;
    first = second;
    second = third;
  }
  return second;
}`,
      "Python": `def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    first, second = 1, 2
    for _ in range(3, n + 1):
        first, second = second, first + second
    return second`
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
      "JavaScript": `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (let j = 0; j < coins.length; j++) {
      const c = coins[j];
      if (i - c >= 0 && dp[i - c] !== Infinity) {
        dp[i] = Math.min(dp[i], dp[i - c] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      "TypeScript": `function coinChange(coins: number[], amount: number): number {
  const dp = new Array<number>(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (let j = 0; j < coins.length; j++) {
      const c = coins[j];
      if (i - c >= 0 && dp[i - c] !== Infinity) {
        dp[i] = Math.min(dp[i], dp[i - c] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      "Python": `def coinChange(coins: list, amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0 and dp[i - c] != float('inf'):
                dp[i] = min(dp[i], dp[i - c] + 1)
    return -1 if dp[amount] == float('inf') else dp[amount]`
    }
  }
};
