export type ViewType =
  | 'dashboard'
  | 'chat'
  | 'editor'
  | 'practice'
  | 'roadmaps'
  | 'interview'
  | 'progress'
  | 'settings';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  streak: number;
  xp: number;
  solvedCount: number;
  accuracy: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachments?: {
    name: string;
    type: string;
    size: string;
    url?: string;
  }[];
}

export interface WorkspaceContext {
  problem?: {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topic: string;
    description: string;
    constraints?: string[];
    sampleInput?: string;
    sampleOutput?: string;
  };
  language: string;
  code: string;
  lastRun?: {
    status: string;
    stdout?: string;
    stderr?: string;
    exitCode?: number | null;
    errorType?: string | null;
    execTime?: string | null;
    customInput?: string;
  };
  lastSubmission?: {
    verdictStatus: string;
    message: string;
    passedCount: number;
    totalCount: number;
    failedTestCase?: {
      input: string;
      expected: string;
      actual: string;
    };
  };
}

export interface ProblemSolution {
  approach: string;
  explanation: string;
  algorithm?: string[];
  edgeCases?: string[];
  timeComplexity: string;
  spaceComplexity: string;
  code?: {
    JavaScript?: string;
    TypeScript?: string;
    Python?: string;
    [lang: string]: string | undefined;
  };
}

export interface PracticeProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  languages: string[];
  description: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints: string[];
  sampleInput: string;
  sampleOutput: string;
  hints: string[];
  solutionCode: string;
  starterCode?: { [lang: string]: string };
  functionName?: string;
  testCases: {
    input: string;
    expected: string;
  }[];
  solution?: ProblemSolution;
}

export interface DetailedRoadmapNote {
  concept: string;
  whyItMatters: string;
  coreIdeas: string[];
  prerequisites?: string[];
  syntaxImplementation: {
    language: string;
    code: string;
    explanation?: string;
  }[];
  example: {
    title: string;
    description: string;
    code: string;
    explanation: string;
  };
  commonPatterns: {
    name: string;
    description: string;
  }[];
  problemSolvingClues?: {
    lookFor: string[];
    clues: string[];
    askYourself: string[];
  };
  commonMistakes: {
    mistake: string;
    fix: string;
  }[];
  complexity?: {
    time: string;
    space: string;
    tradeoffs?: string;
  };
  whenToUse: string[];
  keyTakeaways: string[];
}

export interface RoadmapTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  xpReward: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  practiceTopic?: string;
  prerequisites?: string[];
  notes: DetailedRoadmapNote;
}

export interface RoadmapCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: 'Foundations' | 'Intermediate' | 'Advanced' | 'Applied';
  topics: RoadmapTopic[];
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'unlocked' | 'completed';
  xpReward: number;
  duration: string;
  topicRefId?: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  icon: string;
  nodes: RoadmapNode[];
}

export type InterviewType = 'technical' | 'coding' | 'system_design' | 'behavioral' | 'mixed';

export interface InterviewConfig {
  company: string;
  role: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  interviewType?: InterviewType;
  topic?: string;
  questionCount?: number;
  durationMinutes?: number;
  experienceLevel?: 'Entry-Level' | 'Mid-Level' | 'Senior / Staff';
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type?: 'technical' | 'coding' | 'system_design' | 'behavioral';
  topic?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  context?: string;
  keyConcepts?: string[];
  sampleAnswer?: string;
}

export interface QuestionEvaluation {
  score: number;
  verdict: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Needs Improvement' | 'Unsatisfactory';
  generalFeedback: string;
  breakdown: {
    technicalAccuracy: string;
    communicationClarity: string;
    strengths: string[];
    areasForImprovement: string[];
    idealApproach: string;
  };
  topicAssessed: string;
  evaluatedAt?: number;
}

export interface CompletedInterviewResult {
  id: string;
  timestamp: number;
  dateFormatted: string;
  config: InterviewConfig;
  questions: InterviewQuestion[];
  answers: { [questionId: string]: string };
  evaluations: { [questionId: string]: QuestionEvaluation };
  overallScore: number;
  verdict: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Needs Improvement' | 'Unsatisfactory';
  primaryStrengths: string[];
  primaryWeaknesses: string[];
  recommendations: string[];
  durationSecondsTaken: number;
  topicsAssessed: string[];
  completionStatus: 'completed' | 'abandoned';
}

export interface InterviewSession {
  id?: string;
  config: InterviewConfig;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  answers: { [questionId: string]: string };
  evaluations?: { [questionId: string]: QuestionEvaluation };
  startTime?: number;
  timeRemainingSeconds?: number;
  isPaused?: boolean;
  status?: 'in_progress' | 'evaluating' | 'completed' | 'error';
  errorMessage?: string;
  feedback?: {
    score: number;
    generalFeedback: string;
    breakdown: {
      technical: string;
      communication: string;
      improvement: string;
    };
  };
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ActivityLog {
  id: string;
  type: 'solved' | 'chat' | 'roadmap' | 'interview' | 'code';
  title: string;
  description: string;
  timestamp: string;
  xpEarned: number;
}

export type ProgressionState = 'Not Started' | 'Learning' | 'Practicing' | 'Improving' | 'Strong' | 'Mastered';

export interface TopicStats {
  topic: string;
  category: string;
  attempts: number;
  successes: number;
  failures: number;
  accuracy: number; // 0-100
  mastery: number; // 0-100
  progressionState: ProgressionState;
  lastAttemptTimestamp?: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export interface CategoryStats {
  category: string;
  topics: string[];
  totalAttempts: number;
  totalSuccesses: number;
  averageMastery: number;
  progressPercent: number;
}

export interface UserActivityRecord {
  activityId: string;
  userId: string;
  type: 'problem' | 'code' | 'roadmap' | 'interview' | 'chat';
  topic: string;
  category: string;
  itemId?: string;
  itemTitle: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  result: 'success' | 'failed';
  score?: number; // 0-100
  timeTakenSec?: number;
  timestamp: number;
  xpEarned: number;
}

export interface OverallAnalytics {
  overallProgressPercent: number;
  overallMasteryPercent: number;
  overallAccuracyPercent: number;
  totalAttempts: number;
  totalSuccesses: number;
  totalFailures: number;
  problemsAttemptedCount: number;
  problemsSolvedCount: number;
  strongAreas: TopicStats[];
  weakAreas: TopicStats[];
  categoryBreakdown: CategoryStats[];
}
