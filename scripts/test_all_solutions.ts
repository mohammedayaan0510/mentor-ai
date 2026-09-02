import { PROBLEMS } from '../src/data';
import { PROBLEM_SOLUTIONS } from '../src/problemSolutionsData';
import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

async function runTestCase(lang: string, code: string, fnName: string, testCases: { input: string; expected: string }[]) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'audit-test-'));
  const isPython = lang === 'Python';
  const isTS = lang === 'TypeScript';
  
  let scriptFile = '';
  let command = '';
  let args: string[] = [];
  let runnerContent = '';

  if (isPython) {
    scriptFile = path.join(tempDir, 'runner.py');
    runnerContent = `import sys, json, types

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def _py_arr_to_list(arr):
    if not isinstance(arr, list) or len(arr) == 0:
        return None
    dummy = ListNode(0)
    cur = dummy
    for item in arr:
        cur.next = ListNode(item)
        cur = cur.next
    return dummy.next

def _py_list_to_arr(head):
    res = []
    cur = head
    visited = set()
    while cur is not None and id(cur) not in visited:
        visited.add(id(cur))
        res.append(getattr(cur, 'val', cur))
        cur = getattr(cur, 'next', None)
        if len(res) > 5000:
            break
    return res

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def _py_arr_to_tree(arr):
    if not isinstance(arr, list) or len(arr) == 0 or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        curr = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            curr.left = TreeNode(arr[i])
            queue.append(curr.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            curr.right = TreeNode(arr[i])
            queue.append(curr.right)
        i += 1
    return root

def _py_tree_to_arr(root):
    if not root:
        return []
    res = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node is not None:
            res.append(getattr(node, 'val', node))
            queue.append(getattr(node, 'left', None))
            queue.append(getattr(node, 'right', None))
        else:
            res.append(None)
    while res and res[-1] is None:
        res.pop()
    return res

${code}

test_cases = ${JSON.stringify(testCases)}
results = []
target_fn_name = "${fnName || ''}"

target_fn = None
if target_fn_name and target_fn_name in globals() and isinstance(globals()[target_fn_name], types.FunctionType):
    target_fn = globals()[target_fn_name]
else:
    all_fns = [v for k, v in list(globals().items()) if isinstance(v, types.FunctionType) and not k.startswith('_') and k not in ('ListNode', 'TreeNode')]
    if all_fns:
        target_fn = all_fns[-1]

for idx, tc in enumerate(test_cases):
    try:
        raw_in = tc['input']
        parsed_args = list(eval('(' + raw_in + ',)'))

        fn_name_check = target_fn.__name__ if target_fn else ''
        if fn_name_check == 'mergeTwoLists' or fn_name_check == 'mergeKLists':
            if len(parsed_args) > 0 and isinstance(parsed_args[0], list):
                parsed_args[0] = _py_arr_to_list(parsed_args[0])
            if len(parsed_args) > 1 and isinstance(parsed_args[1], list):
                parsed_args[1] = _py_arr_to_list(parsed_args[1])
        elif ('reverse' in fn_name_check or 'hasCycle' in fn_name_check or 'removeNthFromEnd' in fn_name_check or 'middleNode' in fn_name_check) and parsed_args and isinstance(parsed_args[0], list):
            parsed_args[0] = _py_arr_to_list(parsed_args[0])
        elif ('tree' in fn_name_check or 'inorder' in fn_name_check or 'traversal' in fn_name_check or 'maxDepth' in fn_name_check or 'invert' in fn_name_check or 'isValidBST' in fn_name_check or 'lowestCommonAncestor' in fn_name_check) and parsed_args and isinstance(parsed_args[0], list):
            parsed_args[0] = _py_arr_to_tree(parsed_args[0])

        actual = target_fn(*parsed_args) if target_fn else None

        if isinstance(actual, ListNode):
            actual = _py_list_to_arr(actual)
        elif isinstance(actual, TreeNode):
            actual = _py_tree_to_arr(actual)

        if actual is None and tc['expected'] == '[]':
            actual_str = '[]'
            passed = True
        else:
            actual_str = json.dumps(actual) if actual is not None else "None"
            try:
                expected_val = eval(tc['expected'])
                passed = (actual == expected_val) or (actual_str == tc['expected']) or (str(actual).strip() == tc['expected'].strip())
            except:
                passed = (actual_str == tc['expected']) or (str(actual).strip() == tc['expected'].strip())

        results.append({
            'testIndex': idx + 1,
            'passed': bool(passed),
            'actual': actual_str,
            'expected': tc['expected']
        })
    except Exception as e:
        results.append({
            'testIndex': idx + 1,
            'passed': False,
            'actual': '',
            'expected': tc['expected'],
            'error': str(e)
        })

print('__TEST_RESULTS_START__' + json.dumps(results) + '__TEST_RESULTS_END__')
`;
    await fs.writeFile(scriptFile, runnerContent, 'utf8');
    command = 'python3';
    args = ['-u', scriptFile];
  } else {
    // JS / TS
    scriptFile = path.join(tempDir, isTS ? 'runner.ts' : 'runner.mjs');
    runnerContent = `
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function _js_arr_to_list(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const item of arr) {
    cur.next = new ListNode(item);
    cur = cur.next;
  }
  return dummy.next;
}

function _js_list_to_arr(head) {
  const res = [];
  let cur = head;
  const visited = new Set();
  while (cur !== null && cur !== undefined && !visited.has(cur)) {
    visited.add(cur);
    res.push(cur.val !== undefined ? cur.val : cur);
    cur = cur.next;
    if (res.length > 5000) break;
  }
  return res;
}

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function _js_arr_to_tree(arr) {
  if (!Array.isArray(arr) || arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const curr = queue.shift();
    if (arr[i] !== null && arr[i] !== undefined) {
      curr.left = new TreeNode(arr[i]);
      queue.push(curr.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      curr.right = new TreeNode(arr[i]);
      queue.push(curr.right);
    }
    i++;
  }
  return root;
}

function _js_tree_to_arr(root) {
  if (!root) return [];
  const res = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node !== null && node !== undefined) {
      res.push(node.val !== undefined ? node.val : node);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      res.push(null);
    }
  }
  while (res.length > 0 && res[res.length - 1] === null) {
    res.pop();
  }
  return res;
}

${code}

(function() {
  const testCases = ${JSON.stringify(testCases)};
  const results = [];
  const specifiedFnName = "${fnName || ''}";
  
  let targetFn = null;
  if (specifiedFnName) {
    try {
      targetFn = eval(specifiedFnName);
    } catch (e) {}
  }

  if (!targetFn || typeof targetFn !== 'function') {
    try {
      const fns = [
        typeof twoSum === 'function' ? twoSum : null,
        typeof reverseList === 'function' ? reverseList : null,
        typeof isValid === 'function' ? isValid : null,
        typeof inorderTraversal === 'function' ? inorderTraversal : null,
        typeof fib === 'function' ? fib : null,
        typeof lengthOfLongestSubstring === 'function' ? lengthOfLongestSubstring : null,
        typeof binarySearch === 'function' ? binarySearch : null,
        typeof maxSubArray === 'function' ? maxSubArray : null,
        typeof isPalindrome === 'function' ? isPalindrome : null,
        typeof rotate === 'function' ? rotate : null,
        typeof containsDuplicate === 'function' ? containsDuplicate : null,
        typeof moveZeroes === 'function' ? moveZeroes : null,
        typeof productExceptSelf === 'function' ? productExceptSelf : null,
        typeof majorityElement === 'function' ? majorityElement : null,
        typeof merge === 'function' ? merge : null,
        typeof missingNumber === 'function' ? missingNumber : null,
        typeof firstMissingPositive === 'function' ? firstMissingPositive : null,
        typeof isAnagram === 'function' ? isAnagram : null,
        typeof reverseWords === 'function' ? reverseWords : null,
        typeof longestCommonPrefix === 'function' ? longestCommonPrefix : null,
        typeof groupAnagrams === 'function' ? groupAnagrams : null,
        typeof compress === 'function' ? compress : null,
        typeof longestPalindrome === 'function' ? longestPalindrome : null,
        typeof subarraySum === 'function' ? subarraySum : null,
        typeof firstUniqChar === 'function' ? firstUniqChar : null,
        typeof intersection === 'function' ? intersection : null,
        typeof longestConsecutive === 'function' ? longestConsecutive : null,
        typeof LRUCache === 'function' ? LRUCache : null,
        typeof twoSum2 === 'function' ? twoSum2 : null,
        typeof maxArea === 'function' ? maxArea : null,
        typeof removeDuplicates === 'function' ? removeDuplicates : null,
        typeof threeSum === 'function' ? threeSum : null,
        typeof minSubArrayLen === 'function' ? minSubArrayLen : null,
        typeof longestOnes === 'function' ? longestOnes : null,
        typeof findMaxAverage === 'function' ? findMaxAverage : null,
        typeof maxSlidingWindow === 'function' ? maxSlidingWindow : null,
        typeof MinStack === 'function' ? MinStack : null,
        typeof evalRPN === 'function' ? evalRPN : null,
        typeof dailyTemperatures === 'function' ? dailyTemperatures : null,
        typeof MyQueue === 'function' ? MyQueue : null,
        typeof mergeTwoLists === 'function' ? mergeTwoLists : null,
        typeof removeNthFromEnd === 'function' ? removeNthFromEnd : null,
        typeof hasCycle === 'function' ? hasCycle : null,
        typeof mergeKLists === 'function' ? mergeKLists : null,
        typeof search === 'function' ? search : null,
        typeof searchRange === 'function' ? searchRange : null,
        typeof findMedianSortedArrays === 'function' ? findMedianSortedArrays : null,
        typeof generateParenthesis === 'function' ? generateParenthesis : null,
        typeof subsets === 'function' ? subsets : null,
        typeof solveNQueens === 'function' ? solveNQueens : null,
        typeof maxDepth === 'function' ? maxDepth : null,
        typeof invertTree === 'function' ? invertTree : null,
        typeof isValidBST === 'function' ? isValidBST : null,
        typeof lowestCommonAncestor === 'function' ? lowestCommonAncestor : null,
        typeof numIslands === 'function' ? numIslands : null,
        typeof canFinish === 'function' ? canFinish : null,
        typeof canJump === 'function' ? canJump : null,
        typeof climbStairs === 'function' ? climbStairs : null,
        typeof coinChange === 'function' ? coinChange : null
      ].filter(Boolean);
      targetFn = fns[0];
    } catch (e) {}
  }

  const fnNameStr = specifiedFnName || (targetFn ? targetFn.name : '');

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    try {
      let actual = undefined;
      if (targetFn) {
        let args = [];
        try {
          args = eval('[' + tc.input + ']');
        } catch (argErr) {
          args = [tc.input];
        }

        if (fnNameStr === 'mergeTwoLists' || fnNameStr === 'mergeKLists') {
          if (Array.isArray(args[0])) args[0] = _js_arr_to_list(args[0]);
          if (Array.isArray(args[1])) args[1] = _js_arr_to_list(args[1]);
        } else if ((fnNameStr.includes('reverse') || fnNameStr === 'hasCycle' || fnNameStr === 'removeNthFromEnd' || fnNameStr === 'middleNode') && Array.isArray(args[0])) {
          args[0] = _js_arr_to_list(args[0]);
        } else if ((fnNameStr.includes('inorder') || fnNameStr.includes('Tree') || fnNameStr === 'maxDepth' || fnNameStr === 'isValidBST' || fnNameStr === 'lowestCommonAncestor') && Array.isArray(args[0])) {
          args[0] = _js_arr_to_tree(args[0]);
        }

        // Special handling for in-place array modifiers (rotate, moveZeroes, removeDuplicates)
        if (fnNameStr === 'rotate' || fnNameStr === 'moveZeroes') {
          targetFn(...args);
          actual = args[0];
        } else if (fnNameStr === 'removeDuplicates') {
          const k = targetFn(...args);
          actual = args[0].slice(0, k);
        } else {
          actual = targetFn(...args);
        }

        if (actual && typeof actual === 'object' && 'val' in actual && 'next' in actual) {
          actual = _js_list_to_arr(actual);
        } else if (actual && typeof actual === 'object' && ('left' in actual || 'right' in actual)) {
          actual = _js_tree_to_arr(actual);
        }
      }
      
      let actualStr = actual !== undefined ? JSON.stringify(actual) : 'undefined';
      let passed = false;
      if ((actual === null || actual === undefined) && tc.expected === '[]') {
        actualStr = '[]';
        passed = true;
      } else {
        try {
          const expectedVal = eval('(' + tc.expected + ')');
          const expectedStr = JSON.stringify(expectedVal);
          passed = (actualStr === expectedStr) || (actualStr === tc.expected) || (String(actual).trim() === String(tc.expected).trim());
        } catch (expErr) {
          passed = (actualStr === tc.expected) || (String(actual).trim() === String(tc.expected).trim());
        }
      }

      results.push({
        testIndex: i + 1,
        passed: Boolean(passed),
        actual: actualStr,
        expected: tc.expected
      });
    } catch (err) {
      results.push({
        testIndex: i + 1,
        passed: false,
        actual: '',
        expected: tc.expected,
        error: (err && err.message) || 'Execution error'
      });
    }
  }
  console.log('__TEST_RESULTS_START__' + JSON.stringify(results) + '__TEST_RESULTS_END__');
})();
`;
    await fs.writeFile(scriptFile, runnerContent, 'utf8');
    command = 'node';
    args = isTS ? ['--experimental-strip-types', scriptFile] : [scriptFile];
  }

  return await new Promise<{ passed: boolean; details: any[] }>((resolve) => {
    let stdout = '';
    let stderr = '';
    const child = spawn(command, args, { cwd: tempDir });
    child.stdout.on('data', d => stdout += d.toString());
    child.stderr.on('data', d => stderr += d.toString());
    child.on('close', async () => {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (e) {}

      const startIdx = stdout.indexOf('__TEST_RESULTS_START__');
      const endIdx = stdout.indexOf('__TEST_RESULTS_END__');
      if (startIdx !== -1 && endIdx !== -1) {
        try {
          const jsonStr = stdout.slice(startIdx + '__TEST_RESULTS_START__'.length, endIdx);
          const parsed = JSON.parse(jsonStr);
          const allPassed = parsed.every((r: any) => r.passed);
          resolve({ passed: allPassed, details: parsed });
          return;
        } catch (e) {}
      }
      resolve({ passed: false, details: [{ error: stderr || stdout || 'Unknown error' }] });
    });
  });
}

async function runAll() {
  console.log(`Running comprehensive test execution across all 59 problems...\n`);
  let passedCount = 0;
  let failedItems: any[] = [];

  for (let i = 0; i < PROBLEMS.length; i++) {
    const p = PROBLEMS[i];
    const sol = p.solution || PROBLEM_SOLUTIONS[p.id];
    const jsCode = sol.code?.JavaScript || p.solutionCode;
    const tsCode = sol.code?.TypeScript || '';
    const pyCode = sol.code?.Python || '';

    const jsRes = await runTestCase('JavaScript', jsCode, p.functionName, p.testCases);
    const tsRes = await runTestCase('TypeScript', tsCode, p.functionName, p.testCases);
    const pyRes = await runTestCase('Python', pyCode, p.functionName, p.testCases);

    const allOk = jsRes.passed && tsRes.passed && pyRes.passed;
    if (allOk) {
      passedCount++;
      console.log(`✓ [${p.id}] ${p.title} - JS: PASS, TS: PASS, PY: PASS`);
    } else {
      console.log(`✗ [${p.id}] ${p.title} - JS: ${jsRes.passed ? 'PASS' : 'FAIL'}, TS: ${tsRes.passed ? 'PASS' : 'FAIL'}, PY: ${pyRes.passed ? 'PASS' : 'FAIL'}`);
      failedItems.push({
        id: p.id,
        title: p.title,
        js: jsRes,
        ts: tsRes,
        py: pyRes
      });
    }
  }

  console.log(`\n========================================`);
  console.log(`RESULTS: ${passedCount} / ${PROBLEMS.length} problems fully passed all languages.`);
  if (failedItems.length > 0) {
    console.log(`Failed items count: ${failedItems.length}`);
    console.log(JSON.stringify(failedItems, null, 2));
  }
}

runAll();
