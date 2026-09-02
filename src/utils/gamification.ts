import { Badge } from '../types';

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function calculateStreak(activityDates: string[]): {
  currentStreak: number;
  bestStreak: number;
  isStreakActiveToday: boolean;
  last7Days: { date: string; dayLabel: string; hasActivity: boolean; isToday: boolean }[];
} {
  const dateSet = new Set(activityDates || []);
  const todayStr = getTodayDateString();
  const yesterdayStr = getYesterdayDateString();
  
  const isStreakActiveToday = dateSet.has(todayStr);

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date();

  // If today has activity, start from today. If not, check if yesterday had activity
  if (!dateSet.has(todayStr)) {
    if (dateSet.has(yesterdayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Streak broken
      currentStreak = 0;
    }
  }

  if (dateSet.has(todayStr) || dateSet.has(yesterdayStr)) {
    while (true) {
      const formattedStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      if (dateSet.has(formattedStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate best streak historically
  const sortedDates = Array.from(dateSet).sort();
  let bestStreak = 0;
  let tempStreak = 0;
  let prevTimestamp: number | null = null;

  for (const dateStr of sortedDates) {
    const parts = dateStr.split('-').map(Number);
    const ts = new Date(parts[0], parts[1] - 1, parts[2]).getTime();
    
    if (prevTimestamp === null) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((ts - prevTimestamp) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    prevTimestamp = ts;
    if (tempStreak > bestStreak) {
      bestStreak = tempStreak;
    }
  }

  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  // Last 7 Days breakdown (Mon-Sun or relative to today)
  const last7Days = [];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    last7Days.push({
      date: dateStr,
      dayLabel: dayLabels[d.getDay()],
      hasActivity: dateSet.has(dateStr),
      isToday: i === 0
    });
  }

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    isStreakActiveToday,
    last7Days
  };
}

export function getLevelInfo(totalXp: number): {
  level: number;
  title: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  const levels = [
    { level: 1, title: 'Novice Coder', req: 0 },
    { level: 2, title: 'Apprentice Developer', req: 200 },
    { level: 3, title: 'Algorithm Craftsperson', req: 500 },
    { level: 4, title: 'Code Artisan', req: 900 },
    { level: 5, title: 'Full-Stack Architect', req: 1400 },
    { level: 6, title: 'System Engineer', req: 2000 },
    { level: 7, title: 'Principal Grandmaster', req: 2800 }
  ];

  let currentLevelObj = levels[0];
  let nextLevelObj = levels[1];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXp >= levels[i].req) {
      currentLevelObj = levels[i];
      nextLevelObj = levels[i + 1] || { level: levels[i].level + 1, title: 'Principal Grandmaster', req: levels[i].req + 1000 };
      break;
    }
  }

  const xpInCurrentLevel = totalXp - currentLevelObj.req;
  const xpNeededForNext = nextLevelObj.req - currentLevelObj.req;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForNext) * 100)));

  return {
    level: currentLevelObj.level,
    title: currentLevelObj.title,
    currentLevelXp: xpInCurrentLevel,
    nextLevelXp: xpNeededForNext,
    progressPercent
  };
}

export function checkAndUnlockMilestones(
  stats: {
    xp: number;
    solvedCount: number;
    streak: number;
    chatCount: number;
    interviewsCompleted: number;
    roadmapsCompleted: number;
  },
  currentBadges: Badge[]
): {
  updatedBadges: Badge[];
  newlyUnlocked: Badge[];
  totalBonusXp: number;
} {
  const todayStr = getTodayDateString();
  const newlyUnlocked: Badge[] = [];
  let totalBonusXp = 0;

  const badgeRequirements: { [id: string]: { check: () => boolean; bonusXp: number } } = {
    'badge-1': { check: () => true, bonusXp: 50 }, // First Steps (always)
    'badge-2': { check: () => stats.solvedCount >= 1, bonusXp: 100 }, // Problem Solver
    'badge-3': { check: () => stats.streak >= 3, bonusXp: 150 }, // Daily Dev (3 days streak)
    'badge-4': { check: () => stats.solvedCount >= 3, bonusXp: 200 }, // Code Warrior (3 problems)
    'badge-5': { check: () => stats.interviewsCompleted >= 1, bonusXp: 200 }, // Star Interviewee
    'badge-6': { check: () => stats.chatCount >= 5, bonusXp: 100 }, // AI Companion (5 chat messages)
    'badge-7': { check: () => stats.streak >= 7, bonusXp: 300 }, // Streak Veteran (7 days)
    'badge-8': { check: () => stats.roadmapsCompleted >= 2, bonusXp: 200 }, // Roadmap Explorer
    'badge-9': { check: () => stats.xp >= 500, bonusXp: 250 }, // Level 3 Master
    'badge-10': { check: () => stats.solvedCount >= 5, bonusXp: 350 } // Algorithm Master
  };

  const updatedBadges = currentBadges.map(badge => {
    if (badge.unlocked) return badge;

    const rule = badgeRequirements[badge.id];
    if (rule && rule.check()) {
      const unlockedBadge = { ...badge, unlocked: true, unlockedAt: todayStr };
      newlyUnlocked.push(unlockedBadge);
      totalBonusXp += rule.bonusXp;
      return unlockedBadge;
    }

    return badge;
  });

  return { updatedBadges, newlyUnlocked, totalBonusXp };
}
