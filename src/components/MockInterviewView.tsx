import React, { useState, useEffect, useRef } from 'react';
import { 
  Building, 
  Briefcase, 
  Award, 
  Play, 
  ChevronRight, 
  Loader, 
  ArrowRight, 
  Sparkles, 
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sliders,
  History,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Shield,
  Layers,
  FileCode,
  Zap,
  Target
} from 'lucide-react';
import { 
  InterviewConfig, 
  InterviewSession, 
  InterviewQuestion, 
  QuestionEvaluation, 
  CompletedInterviewResult,
  InterviewType
} from '../types';
import { 
  COMPANIES, 
  ROLES, 
  INTERVIEW_TYPES, 
  INTERVIEW_TOPICS, 
  getCuratedQuestions 
} from '../data';
import { 
  loadInterviewHistory, 
  appendCompletedInterview, 
  clearInterviewHistory,
  saveActiveSession,
  loadActiveSession
} from '../utils/interviewStorage';

interface MockInterviewViewProps {
  onInterviewCompleted?: (
    score: number, 
    company: string, 
    role: string, 
    topic?: string, 
    difficulty?: 'Easy' | 'Medium' | 'Hard'
  ) => void;
  onNavigateToPractice?: (topic?: string) => void;
  onNavigateToRoadmap?: (roadmapId?: string) => void;
}

export default function MockInterviewView({ 
  onInterviewCompleted,
  onNavigateToPractice,
  onNavigateToRoadmap
}: MockInterviewViewProps) {
  // Navigation tabs in setup phase
  const [activeTab, setActiveTab] = useState<'setup' | 'history'>('setup');

  // Configuration state
  const [config, setConfig] = useState<InterviewConfig>({
    company: 'Google',
    role: 'Frontend Engineer',
    difficulty: 'Medium',
    interviewType: 'mixed',
    topic: 'All Topics',
    questionCount: 10,
    durationMinutes: 30,
    experienceLevel: 'Mid-Level'
  });

  // Active Session & Results state
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  // Timer state (Default 30 mins for 10 questions)
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(30 * 60);
  const [timerExpired, setTimerExpired] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Completed & History view state
  const [completedResult, setCompletedResult] = useState<CompletedInterviewResult | null>(null);
  const [historyList, setHistoryList] = useState<CompletedInterviewResult[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<CompletedInterviewResult | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [showKeyConceptsGuide, setShowKeyConceptsGuide] = useState(false);

  // Load history on mount
  useEffect(() => {
    setHistoryList(loadInterviewHistory());
  }, []);

  // Timer management
  useEffect(() => {
    if (session && !completedResult) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      timerIntervalRef.current = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            setTimerExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [session, completedResult]);

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Launch interview session
  const handleStartInterview = async () => {
    setIsGeneratingQuestions(true);
    setEvalError(null);
    setCompletedResult(null);

    const targetQCount = Math.max(3, Math.min(20, config.questionCount || 10));
    const targetDurationMinutes = config.durationMinutes || (targetQCount * 3);

    let sessionQuestions: InterviewQuestion[] = [];

    try {
      // Try to generate customized questions matching the exact configuration via server
      const response = await fetch('/api/mentor/interview/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: config.company,
          role: config.role,
          difficulty: config.difficulty,
          topic: config.topic,
          interviewType: config.interviewType,
          questionCount: targetQCount,
          experienceLevel: config.experienceLevel
        })
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        sessionQuestions = data.questions.slice(0, targetQCount);
      } else {
        sessionQuestions = getCuratedQuestions({ ...config, questionCount: targetQCount });
      }
    } catch (err) {
      console.warn('Using curated interview pool fallback:', err);
      sessionQuestions = getCuratedQuestions({ ...config, questionCount: targetQCount });
    } finally {
      setIsGeneratingQuestions(false);
    }

    if (sessionQuestions.length === 0) {
      sessionQuestions = getCuratedQuestions({ ...config, questionCount: targetQCount });
    }

    // Ensure sessionQuestions has exactly targetQCount
    if (sessionQuestions.length < targetQCount) {
      const fillQuestions = getCuratedQuestions({ ...config, questionCount: targetQCount });
      sessionQuestions = fillQuestions.slice(0, targetQCount);
    } else if (sessionQuestions.length > targetQCount) {
      sessionQuestions = sessionQuestions.slice(0, targetQCount);
    }

    const totalSeconds = targetDurationMinutes * 60;
    setTimeRemainingSeconds(totalSeconds);
    setTimerExpired(false);

    const newSession: InterviewSession = {
      id: `session-${Date.now()}`,
      config: {
        ...config,
        questionCount: targetQCount,
        durationMinutes: targetDurationMinutes
      },
      questions: sessionQuestions,
      currentQuestionIndex: 0,
      answers: {},
      evaluations: {},
      startTime: Date.now(),
      timeRemainingSeconds: totalSeconds,
      status: 'in_progress'
    };

    setSession(newSession);
    setUserAnswer('');
    saveActiveSession(newSession);
  };

  // Submit Answer for Real Gemini Evaluation
  const handleSubmitAnswer = async () => {
    if (!session || !userAnswer.trim() || isEvaluating) return;

    setIsEvaluating(true);
    setEvalError(null);

    const currentQuestion = session.questions[session.currentQuestionIndex];

    try {
      const response = await fetch('/api/mentor/interview/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: session.config.company,
          role: session.config.role,
          interviewType: currentQuestion.type || session.config.interviewType || 'technical',
          difficulty: currentQuestion.difficulty || session.config.difficulty,
          topic: currentQuestion.topic || session.config.topic || 'Data Structures & Algorithms',
          experienceLevel: session.config.experienceLevel || 'Mid-Level',
          question: currentQuestion.question,
          answer: userAnswer.trim(),
          keyConcepts: currentQuestion.keyConcepts || []
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success || typeof data.score !== 'number') {
        throw new Error(data.error || 'AI Evaluation service failed to evaluate your answer.');
      }

      // Construct verified QuestionEvaluation
      const evaluation: QuestionEvaluation = {
        score: data.score,
        verdict: data.verdict || (data.score >= 88 ? 'Strong Hire' : data.score >= 75 ? 'Hire' : data.score >= 60 ? 'Leaning Hire' : 'Needs Improvement'),
        generalFeedback: data.generalFeedback || 'Evaluation completed.',
        breakdown: {
          technicalAccuracy: data.breakdown?.technicalAccuracy || 'Technical review completed.',
          communicationClarity: data.breakdown?.communicationClarity || 'Communication review completed.',
          strengths: Array.isArray(data.breakdown?.strengths) && data.breakdown.strengths.length > 0 
            ? data.breakdown.strengths 
            : ['Answer addresses the core question requirements.'],
          areasForImprovement: Array.isArray(data.breakdown?.areasForImprovement) && data.breakdown.areasForImprovement.length > 0 
            ? data.breakdown.areasForImprovement 
            : ['Consider detailing complexity constraints and edge cases.'],
          idealApproach: data.breakdown?.idealApproach || 'Optimal solution addresses Big-O complexity, handles null/boundary edge cases, and explains tradeoff choices clearly.'
        },
        topicAssessed: data.topicAssessed || currentQuestion.topic || 'Data Structures & Algorithms',
        evaluatedAt: Date.now()
      };

      const updatedAnswers = { ...session.answers, [currentQuestion.id]: userAnswer };
      const updatedEvaluations = { ...(session.evaluations || {}), [currentQuestion.id]: evaluation };

      const updatedSession: InterviewSession = {
        ...session,
        answers: updatedAnswers,
        evaluations: updatedEvaluations,
        feedback: {
          score: evaluation.score,
          generalFeedback: evaluation.generalFeedback,
          breakdown: {
            technical: evaluation.breakdown.technicalAccuracy,
            communication: evaluation.breakdown.communicationClarity,
            improvement: evaluation.breakdown.areasForImprovement[0] || 'Focus on depth and edge cases.'
          }
        }
      };

      setSession(updatedSession);
      saveActiveSession(updatedSession);

    } catch (err: any) {
      console.error('Interview evaluation error:', err);
      setEvalError(err.message || 'Unable to contact the AI evaluation service. Your answer is preserved. Please click Retry.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Move to next question or finalize interview
  const handleNextQuestion = () => {
    if (!session) return;

    const nextIndex = session.currentQuestionIndex + 1;

    if (nextIndex < session.questions.length) {
      const updatedSession: InterviewSession = {
        ...session,
        currentQuestionIndex: nextIndex,
        feedback: undefined
      };
      setSession(updatedSession);
      setUserAnswer('');
      setEvalError(null);
      saveActiveSession(updatedSession);
    } else {
      // Completed all questions! Compute final scorecard
      finalizeInterviewSession(session);
    }
  };

  // Finalize interview and calculate mathematical score
  const finalizeInterviewSession = (activeSession: InterviewSession) => {
    const evaluations = activeSession.evaluations || {};
    const evalList = Object.values(evaluations);

    const overallScore = evalList.length > 0
      ? Math.round(evalList.reduce((acc, curr) => acc + curr.score, 0) / evalList.length)
      : 0;

    let overallVerdict: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Needs Improvement' | 'Unsatisfactory' = 'Needs Improvement';
    if (overallScore >= 88) overallVerdict = 'Strong Hire';
    else if (overallScore >= 75) overallVerdict = 'Hire';
    else if (overallScore >= 60) overallVerdict = 'Leaning Hire';

    // Collect strengths & weaknesses across questions
    const allStrengths = evalList.flatMap(e => e.breakdown?.strengths || []);
    const allWeaknesses = evalList.flatMap(e => e.breakdown?.areasForImprovement || []);
    const topicsAssessed = Array.from(new Set(activeSession.questions.map(q => q.topic || 'General CS')));

    // Deduplicate and filter
    const primaryStrengths = Array.from(new Set(allStrengths)).slice(0, 4);
    const primaryWeaknesses = Array.from(new Set(allWeaknesses)).slice(0, 4);

    const recommendations: string[] = [];
    if (overallScore < 75) {
      recommendations.push(`Review core algorithmic complexity & space-time tradeoffs in ${topicsAssessed[0] || 'Data Structures'}.`);
      recommendations.push('Structure your responses using the STAR method for behavioral and architectural questions.');
    } else {
      recommendations.push(`Continue polishing edge-case analysis in ${topicsAssessed[0] || 'System Design'}.`);
      recommendations.push('Practice communicating architectural tradeoffs during high-scale system design rounds.');
    }

    const durationTaken = Math.max(
      10, 
      (activeSession.config.durationMinutes || 15) * 60 - timeRemainingSeconds
    );

    const result: CompletedInterviewResult = {
      id: activeSession.id || `result-${Date.now()}`,
      timestamp: Date.now(),
      dateFormatted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      config: activeSession.config,
      questions: activeSession.questions,
      answers: activeSession.answers,
      evaluations,
      overallScore,
      verdict: overallVerdict,
      primaryStrengths: primaryStrengths.length > 0 ? primaryStrengths : ['Demonstrated strong commitment to technical problem solving.'],
      primaryWeaknesses: primaryWeaknesses.length > 0 ? primaryWeaknesses : ['Keep practicing with timed constraints.'],
      recommendations,
      durationSecondsTaken: durationTaken,
      topicsAssessed,
      completionStatus: 'completed'
    };

    // Save to real history
    const updatedHistory = appendCompletedInterview(result);
    setHistoryList(updatedHistory);
    setCompletedResult(result);
    setSession(null);
    saveActiveSession(null);

    // Trigger central tracking and XP award callback
    if (onInterviewCompleted && overallScore > 0) {
      const primaryTopic = topicsAssessed[0] || 'Data Structures & Algorithms';
      onInterviewCompleted(
        overallScore, 
        activeSession.config.company, 
        activeSession.config.role, 
        primaryTopic, 
        activeSession.config.difficulty
      );
    }
  };

  // Quit Session
  const handleConfirmQuit = () => {
    setSession(null);
    setShowQuitConfirm(false);
    setUserAnswer('');
    setEvalError(null);
    saveActiveSession(null);
  };

  // Clear History
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all completed interview records from history?')) {
      clearInterviewHistory();
      setHistoryList([]);
    }
  };

  // Render Verdict Badge Helper
  const renderVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'Strong Hire':
        return <span className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold rounded-lg text-[10px] tracking-wider uppercase">Strong Hire</span>;
      case 'Hire':
        return <span className="px-2.5 py-1 bg-teal-500/15 border border-teal-500/30 text-teal-400 font-bold rounded-lg text-[10px] tracking-wider uppercase">Hire</span>;
      case 'Leaning Hire':
        return <span className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold rounded-lg text-[10px] tracking-wider uppercase">Leaning Hire</span>;
      default:
        return <span className="px-2.5 py-1 bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold rounded-lg text-[10px] tracking-wider uppercase">Needs Improvement</span>;
    }
  };

  // ==========================================
  // VIEW 1: COMPLETED FINAL SCORECARD / ANALYSIS
  // ==========================================
  if (completedResult || selectedHistoryItem) {
    const resultToDisplay = completedResult || selectedHistoryItem!;
    const isHistoryReview = !!selectedHistoryItem && !completedResult;

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <button
            id="back-to-interview-setup-btn"
            onClick={() => {
              setCompletedResult(null);
              setSelectedHistoryItem(null);
            }}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHistoryReview ? 'Back to Interview Arena' : 'Start New Simulation'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500">{resultToDisplay.dateFormatted}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-[10px] font-mono text-zinc-400">{Math.round(resultToDisplay.durationSecondsTaken / 60)}m Session</span>
          </div>
        </div>

        {/* Executive Scorecard Header */}
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold text-zinc-200">{resultToDisplay.config.company}</span>
                <span className="text-zinc-600">/</span>
                <span className="text-xs text-zinc-400">{resultToDisplay.config.role}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono border border-white/5">{resultToDisplay.config.difficulty}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-zinc-100">
                Mock Interview Performance Scorecard
              </h2>
              <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                Objective evaluation calibrated against Staff Bar Raiser benchmarks. Derived from verified AI grading across {resultToDisplay.questions.length} technical interview prompts.
              </p>
            </div>

            {/* Score Radial Metric */}
            <div className="flex items-center gap-4 bg-[#0d0d0f] border border-white/5 p-5 rounded-2xl shrink-0">
              <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-[#121214] border border-white/10">
                <div className={`text-3xl font-display font-bold ${
                  resultToDisplay.overallScore >= 88 ? 'text-emerald-400' :
                  resultToDisplay.overallScore >= 75 ? 'text-teal-400' :
                  resultToDisplay.overallScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {resultToDisplay.overallScore}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Final Verdict</div>
                <div>{renderVerdictBadge(resultToDisplay.verdict)}</div>
                <div className="text-[11px] font-mono text-zinc-400">+{Math.round(resultToDisplay.overallScore * 1.5)} XP Awarded</div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-[#0d0d0f]/60 border border-white/5 p-3.5 rounded-xl">
              <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold block">Assessed Topics</span>
              <span className="text-xs font-semibold text-zinc-200 mt-1 block truncate">
                {resultToDisplay.topicsAssessed.join(', ') || 'Computer Science'}
              </span>
            </div>
            <div className="bg-[#0d0d0f]/60 border border-white/5 p-3.5 rounded-xl">
              <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold block">Questions Graded</span>
              <span className="text-xs font-semibold text-zinc-200 mt-1 block">
                {Object.keys(resultToDisplay.evaluations).length} of {resultToDisplay.questions.length} Answered
              </span>
            </div>
            <div className="bg-[#0d0d0f]/60 border border-white/5 p-3.5 rounded-xl">
              <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold block">Time Utilized</span>
              <span className="text-xs font-semibold text-zinc-200 mt-1 block font-mono">
                {formatTime(resultToDisplay.durationSecondsTaken)}
              </span>
            </div>
            <div className="bg-[#0d0d0f]/60 border border-white/5 p-3.5 rounded-xl">
              <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold block">Calibration Standard</span>
              <span className="text-xs font-semibold text-indigo-400 mt-1 block">
                {resultToDisplay.config.experienceLevel || 'Mid-Level'}
              </span>
            </div>
          </div>
        </div>

        {/* Strengths & Growth Areas Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Verified Strengths */}
          <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <h3 className="font-display font-bold text-sm text-zinc-100">Verified Technical Strengths</h3>
            </div>
            <ul className="space-y-2">
              {resultToDisplay.primaryStrengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed bg-[#0d0d0f]/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Targeted Improvement Areas */}
          <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Target className="w-4 h-4" />
              <h3 className="font-display font-bold text-sm text-zinc-100">Targeted Growth Recommendations</h3>
            </div>
            <ul className="space-y-2">
              {resultToDisplay.primaryWeaknesses.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed bg-[#0d0d0f]/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-amber-400 mt-0.5 shrink-0">→</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actionable Next Steps */}
        <div className="bg-[#121214] border border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-transparent rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-display font-bold text-sm text-zinc-100">Recommended Action Plan</h3>
            </div>
            {onNavigateToPractice && (
              <button
                onClick={() => onNavigateToPractice(resultToDisplay.topicsAssessed[0] || 'Arrays')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Practice in Arena</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="space-y-2">
            {resultToDisplay.recommendations.map((rec, idx) => (
              <p key={idx} className="text-xs text-zinc-300 leading-relaxed flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span>{rec}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Question by Question Comprehensive Review */}
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="font-display font-bold text-base text-zinc-100">Question-by-Question Deep Dive</h3>
              <p className="text-xs text-zinc-400">Expand each prompt to review your exact answer against the ideal technical solution.</p>
            </div>
            <span className="text-xs font-mono text-zinc-500">{resultToDisplay.questions.length} Items</span>
          </div>

          <div className="space-y-3">
            {resultToDisplay.questions.map((q, idx) => {
              const evalItem = resultToDisplay.evaluations[q.id];
              const candidateAnswer = resultToDisplay.answers[q.id] || '(No response recorded)';
              const isExpanded = expandedQuestionId === q.id || (expandedQuestionId === null && idx === 0);

              return (
                <div key={q.id} className="border border-white/5 rounded-xl bg-[#0d0d0f]/60 overflow-hidden transition-all">
                  <button
                    onClick={() => setExpandedQuestionId(isExpanded ? '' : q.id)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">Question {idx + 1}</span>
                        {q.topic && <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-md border border-white/5">{q.topic}</span>}
                        {q.difficulty && <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800/80 text-zinc-400 rounded-md">{q.difficulty}</span>}
                      </div>
                      <h4 className="text-xs font-bold text-zinc-200 line-clamp-1">{q.question}</h4>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {evalItem ? (
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold font-mono ${
                            evalItem.score >= 80 ? 'text-emerald-400' :
                            evalItem.score >= 60 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {evalItem.score}/100
                          </span>
                          {renderVerdictBadge(evalItem.verdict)}
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-500">Unscored</span>
                      )}
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="p-4 pt-2 border-t border-white/5 space-y-4 text-xs animate-fade-in bg-[#121214]/50">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Full Question Prompt</span>
                        <p className="text-zinc-300 leading-relaxed font-medium bg-[#0d0d0f] p-3 rounded-xl border border-white/5">
                          {q.question}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Your Submitted Answer</span>
                        <pre className="text-zinc-300 text-xs bg-[#0d0d0f] p-3 rounded-xl border border-white/5 whitespace-pre-wrap font-sans leading-relaxed">
                          {candidateAnswer}
                        </pre>
                      </div>

                      {evalItem && (
                        <div className="space-y-3 pt-2">
                          <div className="bg-[#0d0d0f] p-3.5 rounded-xl border border-white/5 space-y-1">
                            <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Interviewer Executive Feedback</span>
                            <p className="text-zinc-300 leading-relaxed">{evalItem.generalFeedback}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-[#0d0d0f] p-3 rounded-xl border border-white/5 space-y-1">
                              <span className="text-[9px] font-mono text-blue-400 uppercase font-bold">Technical Mechanics</span>
                              <p className="text-zinc-400 text-[11px] leading-relaxed">{evalItem.breakdown?.technicalAccuracy}</p>
                            </div>
                            <div className="bg-[#0d0d0f] p-3 rounded-xl border border-white/5 space-y-1">
                              <span className="text-[9px] font-mono text-teal-400 uppercase font-bold">Communication & Delivery</span>
                              <p className="text-zinc-400 text-[11px] leading-relaxed">{evalItem.breakdown?.communicationClarity}</p>
                            </div>
                          </div>

                          {evalItem.breakdown?.idealApproach && (
                            <div className="bg-gradient-to-r from-emerald-500/5 to-transparent border border-emerald-500/20 p-3.5 rounded-xl space-y-1">
                              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Ideal Architectural / Algorithmic Approach</span>
                              <p className="text-zinc-300 text-xs leading-relaxed">{evalItem.breakdown.idealApproach}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => {
              setCompletedResult(null);
              setSelectedHistoryItem(null);
              setActiveTab('setup');
            }}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Launch Another Simulation</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: ACTIVE INTERVIEW SIMULATION ARENA
  // ==========================================
  if (session) {
    const currentQuestion = session.questions[session.currentQuestionIndex];
    const hasFeedback = !!session.feedback;
    const isLastQuestion = session.currentQuestionIndex + 1 >= session.questions.length;

    const isTimerWarning = timeRemainingSeconds < 300;
    const isTimerCritical = timeRemainingSeconds < 60;

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
        {/* Top Active Bar */}
        <div className="flex items-center justify-between bg-[#121214] border border-white/5 px-5 py-3.5 rounded-2xl">
          <button
            onClick={() => setShowQuitConfirm(true)}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quit Simulation</span>
          </button>

          {/* Target Company & Role Pill */}
          <div className="flex items-center gap-2 text-xs">
            <Building className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-bold text-zinc-200">{session.config.company}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 text-xs hidden sm:inline">{session.config.role}</span>
          </div>

          {/* Countdown Timer */}
          <div className={`flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-xl border transition-all ${
            isTimerCritical 
              ? 'bg-rose-500/15 border-rose-500 text-rose-400 animate-pulse' 
              : isTimerWarning 
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' 
              : 'bg-[#0d0d0f] border-white/5 text-zinc-300'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span className="font-bold">{formatTime(timeRemainingSeconds)}</span>
          </div>
        </div>

        {/* Quit Confirmation Modal */}
        {showQuitConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#121214] border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-base font-bold text-zinc-100">Quit Interview Simulation?</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Exiting now will abandon the current interview session without saving an incomplete score or awarding XP.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowQuitConfirm(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Continue Interview
                </button>
                <button
                  onClick={handleConfirmQuit}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Quit & Discard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Timer Expiration Banner */}
        {timerExpired && !hasFeedback && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between text-amber-300 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Time has expired! Please submit your current answer to conclude grading.</span>
            </div>
          </div>
        )}

        {/* Main Interview Arena Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Progress Timeline Column */}
          <div className="lg:col-span-1 bg-[#121214] border border-white/5 p-4 rounded-2xl space-y-3">
            <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">Simulation Pipeline</span>
            <div className="space-y-2">
              {session.questions.map((q, idx) => {
                const isActive = idx === session.currentQuestionIndex;
                const isDone = idx < session.currentQuestionIndex || (isActive && hasFeedback);

                return (
                  <div
                    key={q.id}
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-xs transition-all ${
                      isActive ? 'bg-indigo-500/10 border border-indigo-500/30 text-zinc-100' :
                      isDone ? 'bg-[#0d0d0f] text-zinc-400' : 'text-zinc-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                      isActive ? 'bg-indigo-600 text-white' :
                      isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {isDone && !isActive ? '✓' : idx + 1}
                    </div>
                    <div className="truncate flex-1">
                      <span className="font-semibold block truncate">Question {idx + 1}</span>
                      <span className="text-[10px] text-zinc-500 block truncate">{q.topic || 'Algorithm'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Question & Answer Column */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-5">
              {/* Question Header */}
              <div className="space-y-3 border-b border-white/5 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                      Question {session.currentQuestionIndex + 1} of {session.questions.length}
                    </span>
                    {currentQuestion.topic && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/5">
                        {currentQuestion.topic}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase font-bold">
                    {currentQuestion.type || 'technical'}
                  </span>
                </div>

                <h3 className="font-display font-bold text-zinc-100 text-base md:text-lg leading-relaxed">
                  {currentQuestion.question}
                </h3>

                {/* Collapsible Key Concept Hints */}
                {currentQuestion.keyConcepts && currentQuestion.keyConcepts.length > 0 && (
                  <div>
                    <button
                      onClick={() => setShowKeyConceptsGuide(!showKeyConceptsGuide)}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{showKeyConceptsGuide ? 'Hide Evaluation Focus' : 'What the interviewer is looking for'}</span>
                    </button>
                    {showKeyConceptsGuide && (
                      <div className="mt-2 p-3 bg-[#0d0d0f] rounded-xl border border-white/5 text-xs text-zinc-400 space-y-1 animate-fade-in">
                        <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">Expected Key Principles:</span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {currentQuestion.keyConcepts.map((k, i) => (
                            <span key={i} className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[10px] font-mono border border-white/5">
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Answering Form Area */}
              {!hasFeedback ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                      <span>Candidate Technical Response</span>
                      <span>{userAnswer.length} characters • {userAnswer.trim().split(/\s+/).filter(Boolean).length} words</span>
                    </div>

                    <textarea
                      id="interview-candidate-answer-input"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      disabled={isEvaluating}
                      placeholder="Type your structured explanation here (e.g. mention complexity tradeoffs, logic flow, edge cases)..."
                      className="w-full h-56 bg-[#0d0d0f] border border-white/10 hover:border-zinc-700 focus:border-indigo-500 p-4 rounded-xl text-xs md:text-sm text-zinc-200 placeholder-zinc-600 outline-none resize-none leading-relaxed font-sans"
                    />
                  </div>

                  {/* Error Notification with Retry */}
                  {evalError && (
                    <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl flex items-start justify-between gap-3 text-xs text-rose-300 animate-fade-in">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{evalError}</span>
                      </div>
                      <button
                        onClick={handleSubmitAnswer}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* Submission Buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-zinc-500 italic">
                      Tip: Walk through Big-O time and space complexity explicitly.
                    </span>

                    <button
                      id="submit-interview-answer-btn"
                      onClick={handleSubmitAnswer}
                      disabled={isEvaluating || !userAnswer.trim()}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/15 cursor-pointer"
                    >
                      {isEvaluating ? (
                        <>
                          <Loader className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Evaluating Response...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                          <span>Submit For AI Grading</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Question Evaluation Card */
                <div className="space-y-6 animate-fade-in">
                  {/* Score & Verdict Banner */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 bg-[#0d0d0f] border border-white/5 p-5 rounded-2xl">
                    <div className="relative w-20 h-20 shrink-0 flex items-center justify-center rounded-full bg-[#121214] border border-white/10">
                      <div className="flex flex-col items-center">
                        <span className={`text-2xl font-display font-bold ${
                          session.feedback!.score >= 85 ? 'text-emerald-400' :
                          session.feedback!.score >= 70 ? 'text-teal-400' :
                          session.feedback!.score >= 50 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {session.feedback!.score}
                        </span>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold">Grade</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-zinc-100 text-sm">Evaluation Summary</h4>
                        {renderVerdictBadge(
                          session.feedback!.score >= 88 ? 'Strong Hire' :
                          session.feedback!.score >= 75 ? 'Hire' :
                          session.feedback!.score >= 60 ? 'Leaning Hire' : 'Needs Improvement'
                        )}
                      </div>
                      <p className="text-zinc-300 text-xs leading-relaxed">{session.feedback!.generalFeedback}</p>
                    </div>
                  </div>

                  {/* 3-Column Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-[#0d0d0f] border border-white/5 p-3.5 rounded-xl space-y-1">
                      <span className="text-[9px] font-mono text-blue-400 font-bold uppercase tracking-wider">Technical Accuracy</span>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">{session.feedback!.breakdown.technical}</p>
                    </div>
                    <div className="bg-[#0d0d0f] border border-white/5 p-3.5 rounded-xl space-y-1">
                      <span className="text-[9px] font-mono text-teal-400 font-bold uppercase tracking-wider">Communication Quality</span>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">{session.feedback!.breakdown.communication}</p>
                    </div>
                    <div className="bg-[#0d0d0f] border border-white/5 p-3.5 rounded-xl space-y-1 bg-gradient-to-b from-amber-500/5 to-transparent">
                      <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider">Actionable Improvement</span>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">{session.feedback!.breakdown.improvement}</p>
                    </div>
                  </div>

                  {/* Footer Navigation */}
                  <div className="flex justify-end pt-2">
                    <button
                      id="interview-next-question-btn"
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
                    >
                      <span>{isLastQuestion ? 'Complete Interview & View Final Scorecard' : 'Proceed to Next Question'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: SETUP & SIMULATION HISTORY SCREEN
  // ==========================================
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <h2 className="font-display font-bold text-xl md:text-2xl text-zinc-100">
            Mock Interview Simulator
          </h2>
          <p className="text-zinc-400 text-xs max-w-md">
            Simulate realistic technical, system design, and behavioral interviews with real-time AI grading.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-[#121214] border border-white/5 rounded-xl self-start sm:self-auto">
          <button
            id="tab-setup-btn"
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'setup' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Configure Simulation</span>
          </button>
          <button
            id="tab-history-btn"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History ({historyList.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'setup' ? (
        /* Configuration Form */
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Target Company */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                Target Tech Company
              </label>
              <select
                id="interview-company-select"
                value={config.company}
                onChange={(e) => setConfig({ ...config, company: e.target.value })}
                className="w-full bg-[#0d0d0f] border border-white/10 text-xs text-zinc-200 px-3.5 py-2.5 rounded-xl focus:border-indigo-500 outline-none cursor-pointer"
              >
                {COMPANIES.map((comp) => (
                  <option key={comp} value={comp} className="bg-[#121214]">{comp}</option>
                ))}
              </select>
            </div>

            {/* Target Role */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                Target Role
              </label>
              <select
                id="interview-role-select"
                value={config.role}
                onChange={(e) => setConfig({ ...config, role: e.target.value })}
                className="w-full bg-[#0d0d0f] border border-white/10 text-xs text-zinc-200 px-3.5 py-2.5 rounded-xl focus:border-indigo-500 outline-none cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-[#121214]">{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Interview Type Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
              Interview Style & Track
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {INTERVIEW_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setConfig({ ...config, interviewType: t.id as InterviewType })}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    config.interviewType === t.id
                      ? 'bg-indigo-500/15 border-indigo-500 text-zinc-100 shadow-sm'
                      : 'bg-[#0d0d0f] border-white/5 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-xs">{t.label}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Focus Topic & Experience Level Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Topic Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                Primary Focus Skill / Topic
              </label>
              <select
                id="interview-topic-select"
                value={config.topic || 'All Topics'}
                onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                className="w-full bg-[#0d0d0f] border border-white/10 text-xs text-zinc-200 px-3.5 py-2.5 rounded-xl focus:border-indigo-500 outline-none cursor-pointer"
              >
                {INTERVIEW_TOPICS.map((top) => (
                  <option key={top} value={top} className="bg-[#121214]">{top}</option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                Seniority Standard
              </label>
              <select
                id="interview-seniority-select"
                value={config.experienceLevel || 'Mid-Level'}
                onChange={(e) => setConfig({ ...config, experienceLevel: e.target.value as any })}
                className="w-full bg-[#0d0d0f] border border-white/10 text-xs text-zinc-200 px-3.5 py-2.5 rounded-xl focus:border-indigo-500 outline-none cursor-pointer"
              >
                <option value="Entry-Level" className="bg-[#121214]">Entry-Level / Junior (L3)</option>
                <option value="Mid-Level" className="bg-[#121214]">Mid-Level Engineer (L4)</option>
                <option value="Senior / Staff" className="bg-[#121214]">Senior / Staff Engineer (L5+)</option>
              </select>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  id={`interview-diff-${diff.toLowerCase()}`}
                  key={diff}
                  type="button"
                  onClick={() => setConfig({ ...config, difficulty: diff })}
                  className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    config.difficulty === diff
                      ? 'bg-indigo-500/15 border-indigo-500 text-indigo-400'
                      : 'bg-[#0d0d0f] border-white/5 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count & Simulation Length (3 – 20 Questions) */}
          <div className="space-y-3 pt-1 border-t border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                Interview Length & Question Count (3 – 20)
              </label>
              <span className="text-[11px] font-mono text-indigo-400 font-bold">
                {config.questionCount || 10} Questions • {(config.durationMinutes || (config.questionCount || 10) * 3)} Minutes
              </span>
            </div>

            {/* Presets: 5 as Quick Practice, 10 as Standard (Default), 15 & 20 as Full Interview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Quick Practice: 5 Questions */}
              <button
                id="preset-quick-practice-btn"
                type="button"
                onClick={() => setConfig({ ...config, questionCount: 5, durationMinutes: 15 })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  config.questionCount === 5
                    ? 'bg-indigo-500/15 border-indigo-500 text-zinc-100 shadow-sm'
                    : 'bg-[#0d0d0f] border-white/5 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Quick Practice</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/5">
                    5 Qs
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">15 Mins • Rapid drill</div>
              </button>

              {/* Standard: 10 Questions (DEFAULT) */}
              <button
                id="preset-standard-interview-btn"
                type="button"
                onClick={() => setConfig({ ...config, questionCount: 10, durationMinutes: 30 })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                  config.questionCount === 10
                    ? 'bg-indigo-500/15 border-indigo-500 text-zinc-100 shadow-sm'
                    : 'bg-[#0d0d0f] border-white/5 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs">Standard</span>
                    <span className="text-[8px] font-mono px-1 py-0.2 bg-indigo-500/20 text-indigo-300 rounded font-bold uppercase tracking-wider">
                      DEFAULT
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/5">
                    10 Qs
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">30 Mins • Standard loop</div>
              </button>

              {/* Full Interview: 15-20 Questions */}
              <button
                id="preset-full-interview-btn"
                type="button"
                onClick={() => setConfig({ ...config, questionCount: 15, durationMinutes: 45 })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  (config.questionCount || 10) >= 15
                    ? 'bg-indigo-500/15 border-indigo-500 text-zinc-100 shadow-sm'
                    : 'bg-[#0d0d0f] border-white/5 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Full Interview</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/5">
                    {(config.questionCount || 10) >= 15 ? `${config.questionCount} Qs` : '15–20 Qs'}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">45–60 Mins • Comprehensive</div>
              </button>
            </div>

            {/* Custom 3–20 Slider & Stepper Bar */}
            <div className="bg-[#0d0d0f] border border-white/5 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 text-[11px] font-medium">Custom Question Length:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const next = Math.max(3, (config.questionCount || 10) - 1);
                      setConfig({ ...config, questionCount: next, durationMinutes: next * 3 });
                    }}
                    disabled={(config.questionCount || 10) <= 3}
                    className="w-5 h-5 rounded-md bg-zinc-800 disabled:opacity-30 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center font-bold cursor-pointer text-xs transition-colors"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-zinc-100 px-2 py-0.5 bg-[#121214] rounded border border-white/10 text-xs min-w-[28px] text-center">
                    {config.questionCount || 10}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = Math.min(20, (config.questionCount || 10) + 1);
                      setConfig({ ...config, questionCount: next, durationMinutes: next * 3 });
                    }}
                    disabled={(config.questionCount || 10) >= 20}
                    className="w-5 h-5 rounded-md bg-zinc-800 disabled:opacity-30 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center font-bold cursor-pointer text-xs transition-colors"
                  >
                    +
                  </button>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 hidden sm:inline">
                    {(config.questionCount || 10) <= 4 ? 'Micro Drill (3–4 Qs)' :
                     (config.questionCount || 10) === 5 ? 'Quick Practice (5 Qs)' :
                     (config.questionCount || 10) < 10 ? 'Targeted Assessment (6–9 Qs)' :
                     (config.questionCount || 10) === 10 ? 'Standard Interview (10 Qs • Default)' :
                     (config.questionCount || 10) < 15 ? 'Extended Assessment (11–14 Qs)' :
                     'Full Interview (15–20 Qs)'}
                  </span>
                </div>
              </div>

              {/* Range Slider for 3 to 20 */}
              <div className="space-y-1">
                <input
                  id="interview-question-count-slider"
                  type="range"
                  min={3}
                  max={20}
                  step={1}
                  value={config.questionCount || 10}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setConfig({ ...config, questionCount: val, durationMinutes: val * 3 });
                  }}
                  className="w-full accent-indigo-500 cursor-pointer bg-zinc-800 h-1.5 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[9px] font-mono text-zinc-500 pt-0.5">
                  <span className={(config.questionCount || 10) === 3 ? 'text-indigo-400 font-bold' : ''}>3 (Min)</span>
                  <span className={(config.questionCount || 10) === 5 ? 'text-indigo-400 font-bold' : ''}>5 (Quick Practice)</span>
                  <span className={(config.questionCount || 10) === 10 ? 'text-indigo-400 font-bold' : ''}>10 (Standard • Default)</span>
                  <span className={(config.questionCount || 10) === 15 ? 'text-indigo-400 font-bold' : ''}>15 (Full)</span>
                  <span className={(config.questionCount || 10) === 20 ? 'text-indigo-400 font-bold' : ''}>20 (Full Max)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <div className="pt-2">
            <button
              id="start-mock-interview-btn"
              onClick={handleStartInterview}
              disabled={isGeneratingQuestions}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              {isGeneratingQuestions ? (
                <>
                  <Loader className="w-4 h-4 animate-spin text-white" />
                  <span>Calibrating {config.company} Questions...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-white" />
                  <span>Launch Mock Simulation ({config.company} • {config.role})</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="font-display font-bold text-sm text-zinc-100">Completed Interview Archive</h3>
              <p className="text-xs text-zinc-400">Review your past performance scorecards and verified feedback history.</p>
            </div>
            {historyList.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-xs text-zinc-500 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {historyList.length === 0 ? (
            /* Empty state */
            <div className="text-center py-12 space-y-3">
              <div className="inline-flex p-3 bg-zinc-800/40 rounded-2xl text-zinc-500 border border-white/5">
                <History className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-zinc-300">No Completed Mock Interviews Yet</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Launch your first simulation to generate objective performance feedback and track your interview readiness.
              </p>
              <button
                onClick={() => setActiveTab('setup')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Start First Simulation
              </button>
            </div>
          ) : (
            /* List of past interviews */
            <div className="space-y-3">
              {historyList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedHistoryItem(item)}
                  className="bg-[#0d0d0f] border border-white/5 hover:border-indigo-500/40 p-4 rounded-xl flex items-center justify-between transition-all cursor-pointer group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-bold text-xs text-zinc-200">{item.config.company}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs text-zinc-400">{item.config.role}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{item.config.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500">
                      <span>{item.dateFormatted}</span>
                      <span>•</span>
                      <span>{Math.round(item.durationSecondsTaken / 60)} min session</span>
                      <span>•</span>
                      <span>{item.questions.length} questions</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-base font-display font-bold ${
                        item.overallScore >= 80 ? 'text-emerald-400' :
                        item.overallScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {item.overallScore}/100
                      </div>
                      <div className="text-[9px] font-mono text-zinc-500">{item.verdict}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-200 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
