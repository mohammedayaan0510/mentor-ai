import { 
  UserActivityRecord, 
  TopicStats, 
  CategoryStats, 
  OverallAnalytics, 
  ProgressionState,
  ActivityLog,
  UserProfile
} from '../types';

export const TOPIC_CATEGORY_MAP: { [topic: string]: string } = {
  // Data Structures & Algorithms
  'Arrays': 'Data Structures & Algorithms',
  'Strings': 'Data Structures & Algorithms',
  'Linked Lists': 'Data Structures & Algorithms',
  'Stacks': 'Data Structures & Algorithms',
  'Queues': 'Data Structures & Algorithms',
  'Trees': 'Data Structures & Algorithms',
  'Graphs': 'Data Structures & Algorithms',
  'Dynamic Programming': 'Data Structures & Algorithms',
  'Hash Maps': 'Data Structures & Algorithms',
  'Recursion': 'Data Structures & Algorithms',
  'Sorting': 'Data Structures & Algorithms',
  'Searching': 'Data Structures & Algorithms',
  'Binary Search': 'Data Structures & Algorithms',
  'Greedy': 'Data Structures & Algorithms',
  'Two Pointers': 'Data Structures & Algorithms',
  'Sliding Window': 'Data Structures & Algorithms',

  // Core Programming & Syntax
  'Variables': 'Core Programming & Syntax',
  'Loops': 'Core Programming & Syntax',
  'Functions': 'Core Programming & Syntax',
  'Pointers': 'Core Programming & Syntax',
  'OOP': 'Core Programming & Syntax',
  'File Handling': 'Core Programming & Syntax',
  'Concurrency': 'Core Programming & Syntax',

  // Web Development & Systems
  'HTML/CSS': 'Web Development & Systems',
  'JS & DOM': 'Web Development & Systems',
  'React': 'Web Development & Systems',
  'Express & APIs': 'Web Development & Systems',
  'Databases': 'Web Development & Systems',

  // AI & Machine Learning
  'Linear Algebra & Stats': 'AI & Machine Learning',
  'Regressions': 'AI & Machine Learning',
  'Neural Networks': 'AI & Machine Learning',
  'NLP': 'AI & Machine Learning',
  'LLMs': 'AI & Machine Learning'
};

export const CATEGORIES = [
  'Data Structures & Algorithms',
  'Core Programming & Syntax',
  'Web Development & Systems',
  'AI & Machine Learning'
];

export const ALL_KNOWN_TOPICS = Object.keys(TOPIC_CATEGORY_MAP);

const STORAGE_KEY = 'mentor_ai_central_activities_v1';

/**
 * Calculates real topic mastery score (0 to 100)
 */
export function calculateMastery(stats: Omit<TopicStats, 'mastery' | 'progressionState'>): number {
  if (stats.attempts === 0) return 0;

  const accuracy = (stats.successes / stats.attempts) * 100;
  // Volume factor requires at least 4 attempts to scale to full mastery credit
  const volumeFactor = Math.min(1.0, stats.attempts / 4);

  // Difficulty weights
  const difficultyBonus = (stats.easySolved * 8) + (stats.mediumSolved * 16) + (stats.hardSolved * 28);

  // Base raw score computation
  let rawMastery = (accuracy * 0.55 * volumeFactor) + Math.min(45, difficultyBonus);

  // Recency decay check (if > 7 days since last practice, drop 5% per week, max 25% decay)
  if (stats.lastAttemptTimestamp) {
    const daysSinceLast = (Date.now() - stats.lastAttemptTimestamp) / (1000 * 60 * 60 * 24);
    if (daysSinceLast > 7) {
      const weeksInactive = Math.floor((daysSinceLast - 7) / 7) + 1;
      const decay = Math.min(25, weeksInactive * 5);
      rawMastery = Math.max(0, rawMastery - decay);
    }
  }

  return Math.min(100, Math.max(0, Math.round(rawMastery)));
}

/**
 * Calculates Progression Matrix state based on real performance metrics
 */
export function calculateProgressionState(stats: Omit<TopicStats, 'progressionState'>): ProgressionState {
  if (stats.attempts === 0) {
    return 'Not Started';
  }

  const { attempts, successes, failures, accuracy, mastery } = stats;

  if (attempts >= 5 && mastery >= 85 && accuracy >= 80) {
    return 'Mastered';
  }
  if (attempts >= 3 && mastery >= 65 && accuracy >= 65) {
    return 'Strong';
  }
  if (attempts > 2 && (accuracy < 55 || (failures > successes && mastery < 50))) {
    return 'Improving';
  }
  if (attempts >= 2 && mastery >= 35) {
    return 'Practicing';
  }
  return 'Learning';
}

/**
 * Loads stored activity history from localStorage
 */
export function loadActivities(): UserActivityRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error loading activities from storage:', err);
  }
  return [];
}

/**
 * Saves activity history to localStorage
 */
export function saveActivities(activities: UserActivityRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch (err) {
    console.error('Error saving activities to storage:', err);
  }
}

/**
 * Computes central topic statistics and overall analytics from actual user activities
 */
export function computeCentralAnalytics(activities: UserActivityRecord[]): {
  topicStatsMap: { [topic: string]: TopicStats };
  analytics: OverallAnalytics;
} {
  // Initialize topic stats map for all known topics
  const topicStatsMap: { [topic: string]: TopicStats } = {};

  for (const topic of ALL_KNOWN_TOPICS) {
    topicStatsMap[topic] = {
      topic,
      category: TOPIC_CATEGORY_MAP[topic] || 'Data Structures & Algorithms',
      attempts: 0,
      successes: 0,
      failures: 0,
      accuracy: 0,
      mastery: 0,
      progressionState: 'Not Started',
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0
    };
  }

  let totalAttempts = 0;
  let totalSuccesses = 0;
  let totalFailures = 0;

  const problemAttemptSet = new Set<string>();
  const problemSolvedSet = new Set<string>();

  // Maps to track unique solved problems and resolved problem state per topic
  const topicUniqueEasySolved: { [topic: string]: Set<string> } = {};
  const topicUniqueMedSolved: { [topic: string]: Set<string> } = {};
  const topicUniqueHardSolved: { [topic: string]: Set<string> } = {};
  const alreadySolvedProblems = new Set<string>();

  // Process activities sequentially to update topic statistics
  for (const act of activities) {
    const rawTopic = act.topic || 'Arrays';
    
    // Support multi-topic attribution (e.g., "Arrays, Two Pointers")
    const subTopics = rawTopic.split(/[,&/|]+/).map(t => t.trim()).filter(Boolean);
    const targetTopics = subTopics.length > 0 ? subTopics : [rawTopic];

    const isProblem = act.type === 'problem' && Boolean(act.itemId);
    const problemId = act.itemId || '';
    const wasAlreadySolved = isProblem && alreadySolvedProblems.has(problemId);

    // If it is a duplicate success on an already solved problem, skip to prevent farming
    if (isProblem && wasAlreadySolved && act.result === 'success') {
      continue;
    }

    totalAttempts += 1;
    if (isProblem) {
      problemAttemptSet.add(problemId);
    }

    if (act.result === 'success') {
      totalSuccesses += 1;
      if (isProblem) {
        problemSolvedSet.add(problemId);
        alreadySolvedProblems.add(problemId);
      }
    } else {
      totalFailures += 1;
    }

    for (const topic of targetTopics) {
      // Ensure topic exists in stats map
      if (!topicStatsMap[topic]) {
        topicStatsMap[topic] = {
          topic,
          category: act.category || TOPIC_CATEGORY_MAP[topic] || 'Data Structures & Algorithms',
          attempts: 0,
          successes: 0,
          failures: 0,
          accuracy: 0,
          mastery: 0,
          progressionState: 'Not Started',
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0
        };
      }

      if (!topicUniqueEasySolved[topic]) topicUniqueEasySolved[topic] = new Set<string>();
      if (!topicUniqueMedSolved[topic]) topicUniqueMedSolved[topic] = new Set<string>();
      if (!topicUniqueHardSolved[topic]) topicUniqueHardSolved[topic] = new Set<string>();

      const tStats = topicStatsMap[topic];
      tStats.attempts += 1;

      if (act.timestamp && (!tStats.lastAttemptTimestamp || act.timestamp > tStats.lastAttemptTimestamp)) {
        tStats.lastAttemptTimestamp = act.timestamp;
      }

      if (act.result === 'success') {
        tStats.successes += 1;

        if (isProblem) {
          if (act.difficulty === 'Easy') topicUniqueEasySolved[topic].add(problemId);
          else if (act.difficulty === 'Medium') topicUniqueMedSolved[topic].add(problemId);
          else if (act.difficulty === 'Hard') topicUniqueHardSolved[topic].add(problemId);
        } else {
          // For non-problem successful activities, contribute to easy weight
          tStats.easySolved += 1;
        }
      } else {
        tStats.failures += 1;
      }
    }
  }

  // Recalculate accuracy, mastery, and progression state for each topic using unique problem counts
  for (const topic of Object.keys(topicStatsMap)) {
    const tStats = topicStatsMap[topic];
    if (topicUniqueEasySolved[topic]) tStats.easySolved = topicUniqueEasySolved[topic].size;
    if (topicUniqueMedSolved[topic]) tStats.mediumSolved = topicUniqueMedSolved[topic].size;
    if (topicUniqueHardSolved[topic]) tStats.hardSolved = topicUniqueHardSolved[topic].size;

    if (tStats.attempts > 0) {
      tStats.accuracy = Math.round((tStats.successes / tStats.attempts) * 100);
      tStats.mastery = calculateMastery(tStats);
      tStats.progressionState = calculateProgressionState(tStats);
    }
  }

  // Compute category statistics
  const categoryBreakdown: CategoryStats[] = CATEGORIES.map(categoryName => {
    const catTopics = ALL_KNOWN_TOPICS.filter(t => TOPIC_CATEGORY_MAP[t] === categoryName);
    let catAttempts = 0;
    let catSuccesses = 0;
    let catMasterySum = 0;
    let topicsWithProgress = 0;

    for (const t of catTopics) {
      const stats = topicStatsMap[t];
      catAttempts += stats.attempts;
      catSuccesses += stats.successes;
      catMasterySum += stats.mastery;
      if (stats.progressionState !== 'Not Started') {
        topicsWithProgress += 1;
      }
    }

    const averageMastery = catTopics.length > 0 ? Math.round(catMasterySum / catTopics.length) : 0;
    const progressPercent = catTopics.length > 0 ? Math.round((topicsWithProgress / catTopics.length) * 100) : 0;

    return {
      category: categoryName,
      topics: catTopics,
      totalAttempts: catAttempts,
      totalSuccesses: catSuccesses,
      averageMastery,
      progressPercent
    };
  });

  // Identify Strong & Weak Areas
  const topicsWithActivity = Object.values(topicStatsMap).filter(t => t.attempts > 0);

  const strongAreas = topicsWithActivity
    .filter(t => t.mastery >= 50 && t.accuracy >= 60)
    .sort((a, b) => b.mastery - a.mastery);

  const weakAreas = topicsWithActivity
    .filter(t => t.accuracy < 65 || t.mastery < 50 || t.progressionState === 'Improving')
    .sort((a, b) => a.accuracy - b.accuracy);

  // Compute Overall Progress & Mastery
  const activeTopicsCount = topicsWithActivity.length;
  const overallProgressPercent = Math.min(100, Math.round((activeTopicsCount / ALL_KNOWN_TOPICS.length) * 100));

  const totalMasterySum = Object.values(topicStatsMap).reduce((sum, t) => sum + t.mastery, 0);
  const overallMasteryPercent = Math.round(totalMasterySum / ALL_KNOWN_TOPICS.length);

  const overallAccuracyPercent = totalAttempts > 0 ? Math.round((totalSuccesses / totalAttempts) * 100) : 0;

  const analytics: OverallAnalytics = {
    overallProgressPercent,
    overallMasteryPercent,
    overallAccuracyPercent,
    totalAttempts,
    totalSuccesses,
    totalFailures,
    problemsAttemptedCount: problemAttemptSet.size,
    problemsSolvedCount: problemSolvedSet.size,
    strongAreas,
    weakAreas,
    categoryBreakdown
  };

  return { topicStatsMap, analytics };
}

/**
 * Generates sample test data for verification purposes
 */
export function generateTestData(): UserActivityRecord[] {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  return [
    {
      activityId: 'test-1',
      userId: 'user-1',
      type: 'problem',
      topic: 'Arrays',
      category: 'Data Structures & Algorithms',
      itemId: 'prob-1',
      itemTitle: 'Two Sum',
      difficulty: 'Easy',
      result: 'success',
      timestamp: now - (2 * dayMs),
      timeTakenSec: 180,
      xpEarned: 100
    },
    {
      activityId: 'test-2',
      userId: 'user-1',
      type: 'problem',
      topic: 'Arrays',
      category: 'Data Structures & Algorithms',
      itemId: 'prob-1',
      itemTitle: 'Two Sum',
      difficulty: 'Easy',
      result: 'success',
      timestamp: now - (1 * dayMs),
      timeTakenSec: 140,
      xpEarned: 100
    },
    {
      activityId: 'test-3',
      userId: 'user-1',
      type: 'problem',
      topic: 'Linked Lists',
      category: 'Data Structures & Algorithms',
      itemId: 'prob-2',
      itemTitle: 'Reverse a Linked List',
      difficulty: 'Medium',
      result: 'failed',
      timestamp: now - (1 * dayMs),
      timeTakenSec: 300,
      xpEarned: 10
    },
    {
      activityId: 'test-4',
      userId: 'user-1',
      type: 'roadmap',
      topic: 'Variables',
      category: 'Core Programming & Syntax',
      itemId: 'py-1',
      itemTitle: 'Python Basics & Types',
      result: 'success',
      timestamp: now,
      xpEarned: 100
    },
    {
      activityId: 'test-5',
      userId: 'user-1',
      type: 'interview',
      topic: 'Stacks',
      category: 'Data Structures & Algorithms',
      itemTitle: 'Google Interview Question - LRU Cache',
      difficulty: 'Medium',
      result: 'success',
      score: 85,
      timestamp: now,
      xpEarned: 150
    }
  ];
}
