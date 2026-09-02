import { PROBLEMS } from '../src/data';
import { PROBLEM_SOLUTIONS } from '../src/problemSolutionsData';

console.log(`Starting Quality Audit of Educational Solutions for ${PROBLEMS.length} problems...\n`);

let missingSolutions: string[] = [];
let missingFields: { id: string; title: string; missing: string[] }[] = [];
let missingLangs: { id: string; title: string; langs: string[] }[] = [];

PROBLEMS.forEach((problem, index) => {
  const sol = problem.solution || PROBLEM_SOLUTIONS[problem.id];
  if (!sol) {
    missingSolutions.push(problem.id);
    return;
  }

  const missing: string[] = [];
  if (!sol.approach || sol.approach.trim() === '') missing.push('approach');
  if (!sol.explanation || sol.explanation.trim() === '') missing.push('explanation');
  if (!sol.algorithm || !Array.isArray(sol.algorithm) || sol.algorithm.length === 0) missing.push('algorithm');
  if (!sol.edgeCases || !Array.isArray(sol.edgeCases) || sol.edgeCases.length === 0) missing.push('edgeCases');
  if (!sol.timeComplexity || sol.timeComplexity.trim() === '') missing.push('timeComplexity');
  if (!sol.spaceComplexity || sol.spaceComplexity.trim() === '') missing.push('spaceComplexity');

  if (missing.length > 0) {
    missingFields.push({ id: problem.id, title: problem.title, missing });
  }

  const langs: string[] = [];
  if (!sol.code?.JavaScript && !problem.solutionCode) langs.push('JavaScript');
  if (!sol.code?.TypeScript) langs.push('TypeScript');
  if (!sol.code?.Python) langs.push('Python');

  if (langs.length > 0) {
    missingLangs.push({ id: problem.id, title: problem.title, langs });
  }
});

console.log('=== AUDIT SUMMARY ===');
console.log(`Total Problems: ${PROBLEMS.length}`);
console.log(`Missing Solutions: ${missingSolutions.length}`);
if (missingSolutions.length > 0) console.log('Missing IDs:', missingSolutions);

console.log(`Problems with Missing Fields: ${missingFields.length}`);
if (missingFields.length > 0) console.log('Missing Fields Details:', JSON.stringify(missingFields, null, 2));

console.log(`Problems with Missing Languages: ${missingLangs.length}`);
if (missingLangs.length > 0) console.log('Missing Langs Details:', JSON.stringify(missingLangs, null, 2));
