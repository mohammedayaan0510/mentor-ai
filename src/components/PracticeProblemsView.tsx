import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Award, 
  HelpCircle, 
  CheckCircle, 
  CheckCircle2,
  Clock,
  Circle,
  X, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Code2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  Copy,
  Terminal,
  FileCode,
  Layers,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { PracticeProblem, UserActivityRecord } from '../types';
import { PROBLEMS } from '../data';

interface PracticeProblemsViewProps {
  activities?: UserActivityRecord[];
  onLoadToEditor: (code: string, language: string, problemId?: string) => void;
  initialTopicFilter?: string;
  initialProblemId?: string;
  onClearInitialProblem?: () => void;
  onSolveProblem?: (problemId: string, title: string, difficulty: 'Easy' | 'Medium' | 'Hard', topic?: string) => void;
}

const ALL_DIFFICULTIES = ['All Difficulties', 'Easy', 'Medium', 'Hard'];
const ALL_STATUSES = ['All Statuses', 'Unattempted', 'Attempted', 'Solved'];
const ALL_LANGUAGES = ['All Languages', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C++'];

export default function PracticeProblemsView({ 
  activities = [], 
  onLoadToEditor, 
  initialTopicFilter,
  initialProblemId,
  onClearInitialProblem
}: PracticeProblemsViewProps) {
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState(initialTopicFilter || 'All Topics');
  const [difficulty, setDifficulty] = useState('All Difficulties');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [language, setLanguage] = useState('All Languages');

  // Dedicated Problem View Page State
  const [selectedProblem, setSelectedProblem] = useState<PracticeProblem | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('JavaScript');
  
  // Dedicated Problem Page interactive sections
  const [revealedHints, setRevealedHints] = useState<{ [index: number]: boolean }>({});
  const [isSolutionOpen, setIsSolutionOpen] = useState(false);
  const [solutionLanguageTab, setSolutionLanguageTab] = useState<'JavaScript' | 'TypeScript' | 'Python'>('JavaScript');
  const [hasCopiedSolution, setHasCopiedSolution] = useState(false);

  // Initialize preferred language from local storage
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('mentor_ai_active_language');
      if (savedLang && ['JavaScript', 'TypeScript', 'Python'].includes(savedLang)) {
        setSelectedLanguage(savedLang);
        setSolutionLanguageTab(savedLang as 'JavaScript' | 'TypeScript' | 'Python');
      }
    } catch {}
  }, []);

  // Synchronize topic filter when initialTopicFilter changes from navigation
  useEffect(() => {
    if (initialTopicFilter) {
      setTopic(initialTopicFilter);
    }
  }, [initialTopicFilter]);

  // Synchronize selected problem when initialProblemId is provided
  useEffect(() => {
    if (initialProblemId) {
      const prob = PROBLEMS.find(p => p.id === initialProblemId);
      if (prob) {
        setSelectedProblem(prob);
        setRevealedHints({});
        setIsSolutionOpen(false);
        setHasCopiedSolution(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [initialProblemId]);

  // Compute status sets from central activity records
  const solvedProblemIds = new Set(
    activities
      .filter(a => a.type === 'problem' && a.result === 'success' && a.itemId)
      .map(a => a.itemId as string)
  );

  const attemptedProblemIds = new Set(
    activities
      .filter(a => a.type === 'problem' && a.itemId)
      .map(a => a.itemId as string)
  );

  const getProblemStatus = (problemId: string): 'solved' | 'attempted' | 'unattempted' => {
    if (solvedProblemIds.has(problemId)) return 'solved';
    if (attemptedProblemIds.has(problemId)) return 'attempted';
    return 'unattempted';
  };

  // Derive unique topics dynamically from PROBLEMS database and include active topic selection
  const problemTopics = Array.from(new Set(PROBLEMS.map(p => p.topic))).sort();
  const availableTopics = Array.from(
    new Set(['All Topics', ...problemTopics, ...(topic && topic !== 'All Topics' ? [topic] : [])])
  );

  // Aggregate metrics
  const totalProblemsCount = PROBLEMS.length;
  const solvedCount = PROBLEMS.filter(p => solvedProblemIds.has(p.id)).length;
  const attemptedOnlyCount = PROBLEMS.filter(p => attemptedProblemIds.has(p.id) && !solvedProblemIds.has(p.id)).length;
  const unattemptedCount = totalProblemsCount - (solvedCount + attemptedOnlyCount);
  const solvedPercent = totalProblemsCount > 0 ? Math.round((solvedCount / totalProblemsCount) * 100) : 0;

  // Breakdown by difficulty
  const easyTotal = PROBLEMS.filter(p => p.difficulty === 'Easy').length;
  const easySolved = PROBLEMS.filter(p => p.difficulty === 'Easy' && solvedProblemIds.has(p.id)).length;
  const medTotal = PROBLEMS.filter(p => p.difficulty === 'Medium').length;
  const medSolved = PROBLEMS.filter(p => p.difficulty === 'Medium' && solvedProblemIds.has(p.id)).length;
  const hardTotal = PROBLEMS.filter(p => p.difficulty === 'Hard').length;
  const hardSolved = PROBLEMS.filter(p => p.difficulty === 'Hard' && solvedProblemIds.has(p.id)).length;

  // Filter problems logic (matches title, description, topic)
  const filteredProblems = PROBLEMS.filter(p => {
    const pStatus = getProblemStatus(p.id);
    const query = search.trim().toLowerCase();

    const matchesSearch = query === '' || 
                          p.title.toLowerCase().includes(query) || 
                          p.description.toLowerCase().includes(query) ||
                          p.topic.toLowerCase().includes(query);
    const matchesTopic = topic === 'All Topics' || p.topic === topic;
    const matchesDifficulty = difficulty === 'All Difficulties' || p.difficulty === difficulty;
    const matchesLanguage = language === 'All Languages' || p.languages.includes(language);
    const matchesStatus = statusFilter === 'All Statuses' || 
      (statusFilter === 'Solved' && pStatus === 'solved') ||
      (statusFilter === 'Attempted' && pStatus === 'attempted') ||
      (statusFilter === 'Unattempted' && pStatus === 'unattempted');
    
    return matchesSearch && matchesTopic && matchesDifficulty && matchesLanguage && matchesStatus;
  });

  const hasActiveFilters = search !== '' || topic !== 'All Topics' || difficulty !== 'All Difficulties' || statusFilter !== 'All Statuses' || language !== 'All Languages';

  const handleResetFilters = () => {
    setSearch('');
    setTopic('All Topics');
    setDifficulty('All Difficulties');
    setStatusFilter('All Statuses');
    setLanguage('All Languages');
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  const handleOpenProblemDetail = (problem: PracticeProblem) => {
    setSelectedProblem(problem);
    setRevealedHints({});
    setIsSolutionOpen(false);
    setHasCopiedSolution(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedProblem(null);
    setRevealedHints({});
    setIsSolutionOpen(false);
    if (onClearInitialProblem) {
      onClearInitialProblem();
    }
  };

  const handleToggleHint = (index: number) => {
    setRevealedHints(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleLaunchCodingWorkspace = (problem: PracticeProblem, targetLanguage?: string) => {
    const lang = targetLanguage || selectedLanguage || 'JavaScript';
    let savedCode: string | null = null;
    try {
      savedCode = localStorage.getItem(`mentor_ai_prob_${problem.id}_${lang}`);
      localStorage.setItem('mentor_ai_active_language', lang);
      localStorage.setItem('mentor_ai_active_problem_id', problem.id);
    } catch {}

    const langKey = lang === 'Python' ? 'Python' : lang === 'TypeScript' ? 'TypeScript' : 'JavaScript';
    const starter = savedCode 
      || (problem.starterCode && problem.starterCode[langKey])
      || (problem.starterCode && problem.starterCode['JavaScript'])
      || problem.solutionCode
      || `// Write your solution for ${problem.title} in ${lang} here...\n`;

    onLoadToEditor(starter, lang, problem.id);
  };

  const handleCopySolutionCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setHasCopiedSolution(true);
    setTimeout(() => setHasCopiedSolution(false), 2000);
  };

  // =========================================================================
  // VIEW 1: DEDICATED PRACTICE PROBLEM PAGE
  // =========================================================================
  if (selectedProblem) {
    const problem = selectedProblem;
    const status = getProblemStatus(problem.id);
    const solution = problem.solution;
    const currentSolCode = solution?.code?.[solutionLanguageTab] || (solutionLanguageTab === 'JavaScript' ? problem.solutionCode : '');

    return (
      <div id="practice-problem-detail-page" className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
        
        {/* Navigation & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <button
            id="back-to-problems-list-btn"
            onClick={handleBackToList}
            className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-indigo-400 transition-colors py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 w-fit cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Problem List</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Solved Status Pill */}
            {status === 'solved' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Check className="w-3.5 h-3.5" />
                Solved
              </span>
            )}
            {status === 'attempted' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Clock className="w-3.5 h-3.5" />
                Attempted
              </span>
            )}
            {status === 'unattempted' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white/5 text-zinc-400 border border-white/5">
                <Circle className="w-3 h-3 text-zinc-500" />
                Not Started
              </span>
            )}

            {/* Difficulty Pill */}
            <span className={`
              text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg
              ${problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
              ${problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
              ${problem.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : ''}
            `}>
              {problem.difficulty}
            </span>

            {/* Topic Pill */}
            <span className="text-[11px] font-mono text-zinc-300 font-bold uppercase tracking-wider bg-[#121214] px-2.5 py-1 rounded-lg border border-white/10">
              {problem.topic}
            </span>

            {/* Test cases */}
            <span className="text-[11px] font-mono text-zinc-400 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
              {problem.testCases.length} Automated Tests
            </span>
          </div>
        </div>

        {/* Problem Title & Header Card */}
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-3 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-400 font-semibold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Practice Problem #{problem.id.replace('prob-', '')}</span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-100 mt-1">
                {problem.title}
              </h1>
            </div>

            {/* Quick Action button */}
            <button
              id="top-open-coding-workspace-btn"
              onClick={() => handleLaunchCodingWorkspace(problem, selectedLanguage)}
              className="py-3 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer shrink-0"
            >
              <Code2 className="w-4 h-4" />
              <span>Open Coding Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/5 flex-wrap">
            <span className="text-[11px] font-mono text-zinc-500">Supported Languages:</span>
            {problem.languages.map((lang) => (
              <span key={lang} className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-[#0d0d0f] border border-white/5">
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Problem Description Section */}
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              <span>Problem Description</span>
            </h2>
            <div className="text-zinc-200 text-sm leading-relaxed whitespace-pre-line font-sans">
              {problem.description}
            </div>
          </div>

          {/* Input Format & Output Format (if defined) */}
          {(problem.inputFormat || problem.outputFormat) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
              {problem.inputFormat && (
                <div className="space-y-1.5 bg-[#0d0d0f] p-4 rounded-xl border border-white/5">
                  <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Input Format</span>
                  <p className="text-xs text-zinc-300 font-mono leading-relaxed">{problem.inputFormat}</p>
                </div>
              )}
              {problem.outputFormat && (
                <div className="space-y-1.5 bg-[#0d0d0f] p-4 rounded-xl border border-white/5">
                  <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">Output Format</span>
                  <p className="text-xs text-zinc-300 font-mono leading-relaxed">{problem.outputFormat}</p>
                </div>
              )}
            </div>
          )}

          {/* Constraints Section */}
          {problem.constraints && problem.constraints.length > 0 && (
            <div className="space-y-2.5 pt-4 border-t border-white/5">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">Constraints</h2>
              <ul className="space-y-1.5 font-mono text-xs text-zinc-400 list-disc list-inside bg-[#0d0d0f] p-4 rounded-xl border border-white/5">
                {problem.constraints.map((c, i) => (
                  <li key={i} className="leading-relaxed">{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Examples Section (Sample Input & Sample Output) */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">Examples & Test Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">Sample Input</span>
                <pre className="bg-[#0d0d0f] border border-white/5 p-4 rounded-xl text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {problem.sampleInput}
                </pre>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block font-bold">Sample Output</span>
                <pre className="bg-[#0d0d0f] border border-white/5 p-4 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {problem.sampleOutput}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Progressive Hints Section */}
        {problem.hints && problem.hints.length > 0 && (
          <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Progressive Hints</span>
              </h2>
              <span className="text-[11px] font-mono text-zinc-500">
                {problem.hints.length} hints available (revealing hints does not affect score)
              </span>
            </div>

            <div className="space-y-3">
              {problem.hints.map((hint, idx) => {
                const isRevealed = !!revealedHints[idx];
                return (
                  <div key={idx} className="border border-white/5 rounded-xl overflow-hidden bg-[#0d0d0f] transition-all">
                    <button
                      id={`problem-page-hint-btn-${idx}`}
                      onClick={() => handleToggleHint(idx)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between text-zinc-300 hover:text-zinc-100 font-semibold cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-xs font-mono">💡 Hint {idx + 1}</span>
                      </div>
                      <span className="text-xs font-mono text-indigo-400 hover:underline flex items-center gap-1">
                        {isRevealed ? 'Hide Hint' : '[Show Hint]'}
                        {isRevealed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                    {isRevealed && (
                      <div className="px-4 pb-4 pt-2 text-zinc-300 text-xs leading-relaxed border-t border-white/5 font-sans animate-fade-in">
                        {hint}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Educational Solution Section */}
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Official Educational Solution</span>
              </h2>
              <p className="text-zinc-500 text-xs mt-0.5">
                Comprehensive intuition, step-by-step algorithm, and time/space complexity analysis.
              </p>
            </div>
            <button
              id="view-problem-solution-toggle-btn"
              onClick={() => setIsSolutionOpen(!isSolutionOpen)}
              className="px-4 py-2 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isSolutionOpen ? 'Hide Solution' : '📖 View Solution'}</span>
              {isSolutionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isSolutionOpen && (
            <div className="pt-4 border-t border-white/5 space-y-6 animate-fade-in">
              {/* Notice */}
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-[11px] font-mono text-amber-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Note: Viewing educational solutions is for learning and will not mark this problem as solved or award XP.</span>
              </div>

              {/* Approach & Explanation */}
              {solution && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">1. Approach & Intuition</h3>
                    <div className="bg-[#0d0d0f] p-4 rounded-xl border border-white/5 space-y-2">
                      <span className="text-xs font-bold text-indigo-300 font-mono block">{solution.approach}</span>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">{solution.explanation}</p>
                    </div>
                  </div>

                  {/* Algorithm Steps */}
                  {solution.algorithm && solution.algorithm.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">2. Step-by-Step Algorithm</h3>
                      <div className="bg-[#0d0d0f] p-4 rounded-xl border border-white/5">
                        <ol className="space-y-2 text-xs text-zinc-300 list-decimal list-inside font-sans">
                          {solution.algorithm.map((step, idx) => (
                            <li key={idx} className="leading-relaxed">{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* Edge Cases */}
                  {solution.edgeCases && solution.edgeCases.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                        <span>⚠️ Important Edge Cases</span>
                      </h3>
                      <div className="bg-[#0d0d0f] p-4 rounded-xl border border-white/5">
                        <ul className="space-y-1.5 text-xs text-zinc-300 list-disc list-inside font-sans">
                          {solution.edgeCases.map((ec, idx) => (
                            <li key={idx} className="leading-relaxed">{ec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Complexity Badges */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">4. Complexity Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#0d0d0f] p-4 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">Time Complexity</span>
                        <p className="text-xs font-mono text-zinc-200">{solution.timeComplexity}</p>
                      </div>
                      <div className="bg-[#0d0d0f] p-4 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">Space Complexity</span>
                        <p className="text-xs font-mono text-zinc-200">{solution.spaceComplexity}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Reference Code in Multi-Language Tabs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">4. Reference Implementation</h3>
                  
                  {/* Language Tabs */}
                  <div className="flex items-center gap-1 bg-[#0d0d0f] p-1 rounded-xl border border-white/5">
                    {(['JavaScript', 'TypeScript', 'Python'] as const).map((langTab) => (
                      <button
                        key={langTab}
                        onClick={() => setSolutionLanguageTab(langTab)}
                        className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                          solutionLanguageTab === langTab 
                            ? 'bg-indigo-600 text-white font-bold' 
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {langTab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <pre className="bg-[#0d0d0f] p-4 rounded-xl border border-white/5 text-xs font-mono text-zinc-200 overflow-x-auto whitespace-pre leading-relaxed">
                    <code>{currentSolCode || problem.solutionCode}</code>
                  </pre>
                  <button
                    onClick={() => handleCopySolutionCode(currentSolCode || problem.solutionCode)}
                    className="absolute top-3 right-3 py-1.5 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors border border-white/10 cursor-pointer"
                    title="Copy Solution Code"
                  >
                    {hasCopiedSolution ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{hasCopiedSolution ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Primary CTA Action Bar */}
        <div className="bg-[#121214] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky bottom-4 shadow-2xl backdrop-blur-md bg-[#121214]/95 z-20">
          <div className="flex items-center gap-3">
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono text-zinc-400 block font-semibold">Choose Programming Language:</span>
              <div className="flex items-center gap-2">
                <select
                  id="problem-page-language-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-[#0d0d0f] border border-white/10 text-xs font-mono text-zinc-200 px-3 py-2 rounded-xl focus:border-indigo-500 outline-none cursor-pointer"
                >
                  <option value="JavaScript">JavaScript (Node.js)</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="Python">Python 3</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToList}
              className="px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
            >
              Back to List
            </button>
            <button
              id="bottom-open-coding-workspace-btn"
              onClick={() => handleLaunchCodingWorkspace(problem, selectedLanguage)}
              className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/30 cursor-pointer text-sm"
            >
              <Code2 className="w-4 h-4" />
              <span>💻 Open Coding Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: PRACTICE PROBLEMS ARENA / LIST VIEW
  // =========================================================================
  return (
    <div id="practice-problems-arena" className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner with Real Progress Statistics */}
      <div id="practice-problems-header" className="bg-[#121214] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display font-bold text-2xl text-zinc-100">Practice Problems</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold">
                {totalProblemsCount} challenges
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-xl">
              Build your coding skills through structured practice.
            </p>
          </div>

          {/* Real Mastery Progress Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0d0d0f]/80 p-3.5 rounded-xl border border-white/5 shrink-0">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Solved</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-bold text-lg text-emerald-400">{solvedCount}</span>
                <span className="text-xs text-zinc-500 font-mono">/ {totalProblemsCount}</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">{solvedPercent}% completed</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Attempted</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-bold text-lg text-amber-400">{attemptedOnlyCount}</span>
                <span className="text-xs text-zinc-500 font-mono">in progress</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">{unattemptedCount} remaining</span>
            </div>

            <div className="space-y-0.5 col-span-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Difficulty Breakdown</span>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Easy: {easySolved}/{easyTotal}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Med: {medSolved}/{medTotal}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Hard: {hardSolved}/{hardTotal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid containing filters sidebar + problems list */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Filters Sidebar Column */}
        <div className="lg:col-span-1 bg-[#121214] border border-white/5 p-5 rounded-2xl space-y-5 shrink-0">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-400" />
              <h2 className="font-display font-bold text-zinc-200 text-sm">Filter Arena</h2>
            </div>
            {hasActiveFilters && (
              <button
                id="reset-problem-filters-btn"
                onClick={handleResetFilters}
                className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-lg"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Search */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">Search</label>
            <div className="relative">
              <input
                id="problem-search"
                type="text"
                placeholder="Search by title, description, or topic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0d0d0f] border border-white/5 hover:border-zinc-700/85 focus:border-indigo-500/60 transition-colors text-xs text-zinc-300 py-2.5 pl-8 pr-8 rounded-xl outline-none"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3.5" />
              {search && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-2.5 p-1 text-zinc-500 hover:text-zinc-300 rounded-md transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">Solve Status</label>
            <select
              id="problem-filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#0d0d0f] border border-white/5 text-xs text-zinc-300 px-3 py-2.5 rounded-xl focus:border-indigo-500 outline-none cursor-pointer"
            >
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st} className="bg-[#121214]">{st}</option>
              ))}
            </select>
          </div>

          {/* Difficulty filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">Difficulty</label>
            <select
              id="problem-filter-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-[#0d0d0f] border border-white/5 text-xs text-zinc-300 px-3 py-2.5 rounded-xl focus:border-indigo-500 outline-none cursor-pointer"
            >
              {ALL_DIFFICULTIES.map((diff) => (
                <option key={diff} value={diff} className="bg-[#121214]">{diff}</option>
              ))}
            </select>
          </div>

          {/* Topic filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">Topic</label>
            <select
              id="problem-filter-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#0d0d0f] border border-white/5 text-xs text-zinc-300 px-3 py-2.5 rounded-xl focus:border-indigo-500 outline-none cursor-pointer"
            >
              {availableTopics.map((top) => (
                <option key={top} value={top} className="bg-[#121214]">{top}</option>
              ))}
            </select>
          </div>

          {/* Language filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">Supported Language</label>
            <select
              id="problem-filter-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-[#0d0d0f] border border-white/5 text-xs text-zinc-300 px-3 py-2.5 rounded-xl focus:border-indigo-500 outline-none cursor-pointer"
            >
              {ALL_LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-[#121214]">{lang}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Problems List main Column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs text-zinc-400 font-semibold font-mono">
              Showing {filteredProblems.length} of {totalProblemsCount} challenges
            </span>
            {hasActiveFilters && (
              <span className="text-[11px] font-mono text-indigo-400">
                Filters active
              </span>
            )}
          </div>

          {filteredProblems.length === 0 ? (
            <div id="problems-empty-state" className="bg-[#121214]/60 border border-white/5 p-12 text-center rounded-2xl flex flex-col items-center justify-center space-y-4 animate-fade-in">
              <HelpCircle className="w-10 h-10 text-zinc-600 animate-bounce" />
              <div>
                <h3 className="font-display font-semibold text-zinc-200 text-sm">
                  {search.trim() !== '' 
                    ? 'No problems found.' 
                    : statusFilter === 'Solved' 
                    ? 'No solved problems yet.'
                    : statusFilter === 'Attempted'
                    ? 'No attempted problems yet.'
                    : topic !== 'All Topics' 
                    ? `No practice problems found for ${topic}.` 
                    : 'No matching challenges found'}
                </h3>
                <p className="text-zinc-400 text-xs mt-1 max-w-sm mx-auto leading-relaxed">
                  {search.trim() !== ''
                    ? `We couldn't find any challenges matching "${search}".`
                    : statusFilter === 'Solved'
                    ? 'You haven\'t solved any problems matching your current criteria. Select a challenge and submit a working solution to mark it as solved!'
                    : statusFilter === 'Attempted'
                    ? 'You haven\'t attempted any problems matching your current criteria. Pick any problem to start practicing and track your attempts.'
                    : topic !== 'All Topics'
                    ? 'Explore our extensive algorithmic collection across other topics.'
                    : 'Try clearing or adjusting your search filters to find more problems.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {search.trim() !== '' ? (
                  <button
                    id="clear-search-btn"
                    onClick={handleClearSearch}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                ) : (
                  <button
                    id="view-all-problems-btn"
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {topic !== 'All Topics' || statusFilter !== 'All Statuses' || difficulty !== 'All Difficulties' ? 'Clear Filters' : 'View All Problems'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredProblems.map((p) => {
                const status = getProblemStatus(p.id);
                const problemNumber = p.id.replace('prob-', '');
                return (
                  <div 
                    key={p.id}
                    id={`problem-card-${p.id}`}
                    onClick={() => handleOpenProblemDetail(p)}
                    className={`
                      bg-[#121214] border p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-zinc-800/40 group cursor-pointer
                      ${status === 'solved' ? 'border-emerald-500/25 hover:border-emerald-500/40' : status === 'attempted' ? 'border-amber-500/25 hover:border-amber-500/40' : 'border-white/5 hover:border-white/15'}
                    `}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Problem Number */}
                        <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                          #{problemNumber}
                        </span>

                        {/* Status Pill */}
                        {status === 'solved' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            <Check className="w-3 h-3" />
                            Solved
                          </span>
                        )}
                        {status === 'attempted' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <Clock className="w-3 h-3" />
                            Attempted
                          </span>
                        )}
                        {status === 'unattempted' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
                            <Circle className="w-2.5 h-2.5 text-zinc-500" />
                            Unattempted
                          </span>
                        )}

                        {/* Difficulty Pill */}
                        <span className={`
                          text-[9px] font-mono font-bold px-2 py-0.5 rounded
                          ${p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                          ${p.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                          ${p.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : ''}
                        `}>
                          {p.difficulty}
                        </span>

                        {/* Topic Pill */}
                        <span className="text-[10px] font-mono text-zinc-300 font-bold uppercase tracking-wider bg-[#0d0d0f] px-2 py-0.5 rounded border border-white/5">
                          {p.topic}
                        </span>

                        {/* Test cases count */}
                        <span className="text-[10px] font-mono text-zinc-500">
                          {p.testCases.length} tests
                        </span>
                      </div>

                      <h3 
                        className="font-display font-bold text-zinc-100 text-base group-hover:text-indigo-300 transition-colors"
                      >
                        {p.title}
                      </h3>
                      <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 max-w-2xl">{p.description}</p>
                    </div>

                    <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
                      <button
                        id={`view-problem-details-${p.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProblemDetail(p);
                        }}
                        className="py-2.5 px-3.5 text-xs font-semibold rounded-xl text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                        title="View Problem Details, Examples, Hints & Solution"
                      >
                        View Problem
                      </button>
                      <button
                        id={`open-workspace-${p.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchCodingWorkspace(p);
                        }}
                        className={`
                          py-2.5 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md
                          ${status === 'solved' 
                            ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'}
                        `}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Open Coding Workspace</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
