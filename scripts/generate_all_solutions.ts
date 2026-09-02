import * as fs from 'fs/promises';
import * as path from 'path';

// Definition of all 59 Educational Solutions with comprehensive explanations, algorithms, edge cases, and working JS, TS, Python code.
import { solutionsBatch1 } from './solutions_batch1';
import { solutionsBatch2 } from './solutions_batch2';
import { solutionsBatch3 } from './solutions_batch3';
import { solutionsBatch4 } from './solutions_batch4';

async function main() {
  const allSolutions = {
    ...solutionsBatch1,
    ...solutionsBatch2,
    ...solutionsBatch3,
    ...solutionsBatch4
  };

  const total = Object.keys(allSolutions).length;
  console.log(`Aggregated ${total} problem solutions.`);

  const fileContent = `import { ProblemSolution } from './types';

export const PROBLEM_SOLUTIONS: { [problemId: string]: ProblemSolution } = ${JSON.stringify(allSolutions, null, 2)};
`;

  await fs.writeFile(path.join(process.cwd(), 'src', 'problemSolutionsData.ts'), fileContent, 'utf8');
  console.log('Successfully wrote src/problemSolutionsData.ts!');
}

main().catch(console.error);
