import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Star, 
  CheckCircle, 
  Clock, 
  Cpu, 
  Activity, 
  ShieldAlert,
  Zap,
  Lock,
  Compass,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  Layers,
  Sparkles,
  Target,
  BarChart3,
  ArrowRight,
  Filter,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  UserProfile, 
  Badge, 
  ActivityLog, 
  TopicStats, 
  OverallAnalytics, 
  ProgressionState,
  UserActivityRecord 
} from '../types';
import { getLevelInfo, calculateStreak } from '../utils/gamification';
import { CATEGORIES, ALL_KNOWN_TOPICS } from '../utils/centralTracking';
import { PROBLEMS } from '../data';

interface ProgressDashboardViewProps {
  user: UserProfile;
  activityDates?: string[];
  badges?: Badge[];
  recentActivity?: ActivityLog[];
  activities?: UserActivityRecord[];
  onDailyCheckIn?: () => void;
  topicStatsMap?: { [topic: string]: TopicStats };
  analytics?: OverallAnalytics;
  onNavigateToPractice?: (topic?: string, problemId?: string) => void;
}

export type SimpleTopicStatus = 'Strong' | 'Improving' | 'Needs Practice' | 'Not Started';

/**
 * Classifies a topic into simple human-readable states based strictly on existing metrics
 */
export function getSimpleTopicStatus(stats: TopicStats): SimpleTopicStatus {
  if (stats.attempts === 0) return 'Not Started';
  if (stats.mastery >= 65 && stats.accuracy >= 65) return 'Strong';
  if (stats.progressionState === 'Mastered' || stats.progressionState === 'Strong') return 'Strong';
  if (stats.accuracy < 55 || stats.progressionState === 'Improving' || (stats.failures > stats.successes && stats.mastery < 50)) {
    return 'Needs Practice';
  }
  return 'Improving';
}

/**
 * Formats timestamps into readable relative strings
 */
function formatRelativeTime(timestamp?: number | string): string {
  if (!timestamp) return 'Recently';
  const time = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
  if (isNaN(time)) return typeof timestamp === 'string' ? timestamp : 'Recently';
  
  const diffMs = Date.now() - time;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 45) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function ProgressDashboardView({ 
  user, 
  activityDates = [], 
  badges = [], 
  recentActivity = [],
  activities = [],
  onDailyCheckIn,
  topicStatsMap,
  analytics,
  onNavigateToPractice
}: ProgressDashboardViewProps) {
  const levelInfo = getLevelInfo(user.xp);
  const streakInfo = calculateStreak(activityDates);
  
  // Topic filters and search state
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Helper to map badge icons
  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const cls = `w-5 h-5 ${unlocked ? 'text-indigo-400' : 'text-zinc-600'}`;
    switch (iconName) {
      case 'Flame': return <Flame className={cls} />;
      case 'CheckCircle': return <CheckCircle className={cls} />;
      case 'Award': return <Award className={cls} />;
      case 'Shield': return <Star className={cls} />;
      case 'Cpu': return <Cpu className={cls} />;
      case 'Compass': return <Compass className={cls} />;
      case 'Star': return <Star className={cls} />;
      default: return <Award className={cls} />;
    }
  };

  const getStatusBadgeStyle = (status: SimpleTopicStatus) => {
    switch (status) {
      case 'Strong':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Improving':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      case 'Needs Practice':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Not Started':
      default:
        return 'bg-zinc-800/80 text-zinc-500 border-zinc-700/40';
    }
  };

  // Convert topicStatsMap to list with classified status
  const topicsList = useMemo(() => {
    if (!topicStatsMap) return [];
    return Object.values(topicStatsMap).map(t => ({
      ...t,
      simpleStatus: getSimpleTopicStatus(t),
      solvedTotal: (t.easySolved + t.mediumSolved + t.hardSolved) > 0 
        ? (t.easySolved + t.mediumSolved + t.hardSolved) 
        : t.successes
    }));
  }, [topicStatsMap]);

  // Status counts for filter chips
  const statusCounts = useMemo(() => {
    const counts = { All: topicsList.length, Strong: 0, Improving: 0, 'Needs Practice': 0, 'Not Started': 0 };
    topicsList.forEach(t => {
      if (counts[t.simpleStatus] !== undefined) {
        counts[t.simpleStatus]++;
      }
    });
    return counts;
  }, [topicsList]);

  // Filtered topics list
  const filteredTopics = useMemo(() => {
    return topicsList.filter(t => {
      const matchCategory = selectedCategoryFilter === 'All' || t.category === selectedCategoryFilter;
      const matchStatus = selectedStatusFilter === 'All' || t.simpleStatus === selectedStatusFilter;
      const matchSearch = searchQuery.trim() === '' || 
        t.topic.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchStatus && matchSearch;
    });
  }, [topicsList, selectedCategoryFilter, selectedStatusFilter, searchQuery]);

  // Has user engaged in any activity?
  const hasUserActivity = (analytics && analytics.totalAttempts > 0) || activities.length > 0 || (user.solvedCount > 0);

  // Weak active topics for "Topics to Practice" (derived from existing analytics.weakAreas or lowest accuracy active topics)
  const weakTopics = useMemo(() => {
    if (!topicStatsMap) return [];
    const active = Object.values(topicStatsMap).filter(t => t.attempts > 0);
    return active
      .filter(t => t.accuracy < 65 || t.mastery < 50 || t.progressionState === 'Improving')
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 4);
  }, [topicStatsMap]);

  // Strong active topics
  const strongTopics = useMemo(() => {
    if (!topicStatsMap) return [];
    const active = Object.values(topicStatsMap).filter(t => t.attempts > 0);
    return active
      .filter(t => t.mastery >= 50 && t.accuracy >= 60)
      .sort((a, b) => b.mastery - a.mastery)
      .slice(0, 4);
  }, [topicStatsMap]);

  // Meaningful recent activities (from activities record or recentActivity fallback)
  const recentActivityDisplay = useMemo(() => {
    if (activities && activities.length > 0) {
      return activities.slice(0, 8).map(act => {
        let problemId = act.itemId;
        if (!problemId && act.type === 'problem') {
          const match = PROBLEMS.find(p => act.itemTitle?.includes(p.title) || p.title.toLowerCase() === act.itemTitle?.toLowerCase());
          if (match) problemId = match.id;
        }
        return {
          id: act.activityId || `${act.timestamp}-${act.itemTitle}`,
          problemId,
          title: act.itemTitle || (act.result === 'success' ? 'Solved Problem' : 'Attempted Problem'),
          result: act.result,
          type: act.type,
          topic: act.topic,
          difficulty: act.difficulty,
          category: act.category,
          xpEarned: act.xpEarned,
          timestampFormatted: formatRelativeTime(act.timestamp)
        };
      });
    }
    if (recentActivity && recentActivity.length > 0) {
      return recentActivity.slice(0, 8).map(act => {
        let problemId: string | undefined;
        const match = PROBLEMS.find(p => act.title.includes(p.title) || p.title.toLowerCase() === act.title.toLowerCase());
        if (match) problemId = match.id;
        return {
          id: act.id,
          problemId,
          title: act.title,
          result: act.title.toLowerCase().includes('attempted') ? 'failed' as const : 'success' as const,
          type: act.type,
          topic: act.description.split('•')[1]?.trim() || 'General',
          difficulty: undefined,
          category: undefined,
          xpEarned: act.xpEarned,
          timestampFormatted: act.timestamp
        };
      });
    }
    return [];
  }, [activities, recentActivity]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* 1. TOP HERO & LEVEL OVERVIEW */}
      <div id="progress-hero-banner" className="relative overflow-hidden bg-[#121214] border border-white/5 rounded-3xl p-6 md:p-8">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-xs rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-indigo-400" />
                <span>Level {levelInfo.level}: {levelInfo.title}</span>
              </span>

              {onDailyCheckIn && (
                <button
                  id="progress-daily-checkin-btn"
                  onClick={onDailyCheckIn}
                  className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-semibold text-xs rounded-full transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Claim Daily Check-In (+50 XP)</span>
                </button>
              )}
            </div>

            <h1 className="font-display font-bold text-2xl md:text-3xl text-zinc-100 tracking-tight">
              {user.name}'s Progress & Mastery
            </h1>
            
            <p className="text-zinc-400 text-xs leading-relaxed">
              Track your algorithmic skill development, topic-by-topic mastery, problem-solving accuracy, and daily consistency in real time.
            </p>

            {/* Level XP Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-300 font-semibold">{levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} Level XP</span>
                <span className="text-indigo-400 font-bold">{levelInfo.progressPercent}% to Lvl {levelInfo.level + 1}</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-300 rounded-full transition-all duration-500 shadow-sm shadow-indigo-500/30"
                  style={{ width: `${Math.min(100, Math.max(4, levelInfo.progressPercent))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          {onNavigateToPractice && (
            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                id="hero-practice-cta-btn"
                onClick={() => onNavigateToPractice()}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Practice Problems</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. EMPTY STATE ALERT (For brand new user with 0 activity) */}
      {!hasUserActivity && (
        <div id="progress-empty-state-card" className="p-6 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-[#121214] border border-indigo-500/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400 shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-zinc-100 text-sm">
                Start solving problems to build your skill profile.
              </h3>
              <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                As you practice coding problems and test implementations in the workspace, your topic mastery scores, accuracy statistics, strengths, and targeted weak areas will automatically calculate here.
              </p>
            </div>
          </div>

          {onNavigateToPractice && (
            <button
              id="empty-state-practice-btn"
              onClick={() => onNavigateToPractice()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <span>Practice Problems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 3. TOP SUMMARY KPI CARDS (Real Data Only) */}
      <div id="progress-top-summary-grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Metric 1: Problems Solved */}
        <div id="summary-card-solved" className="p-4 bg-[#121214] border border-white/5 rounded-2xl space-y-2 hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">Problems Solved</span>
            <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-zinc-100 tracking-tight">
              {analytics ? analytics.problemsSolvedCount : user.solvedCount}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
              Verified Solutions
            </span>
          </div>
        </div>

        {/* Metric 2: Problems Attempted */}
        <div id="summary-card-attempted" className="p-4 bg-[#121214] border border-white/5 rounded-2xl space-y-2 hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">Problems Attempted</span>
            <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-indigo-400 tracking-tight">
              {analytics ? analytics.problemsAttemptedCount : 0}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
              {analytics && analytics.totalAttempts > 0 ? `${analytics.totalAttempts} total submissions` : '0 submissions'}
            </span>
          </div>
        </div>

        {/* Metric 3: Overall Mastery */}
        <div id="summary-card-mastery" className="p-4 bg-[#121214] border border-white/5 rounded-2xl space-y-2 hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">Overall Mastery</span>
            <div className="p-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-purple-400 tracking-tight">
              {analytics ? analytics.overallMasteryPercent : 0}%
            </span>
            <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
              Weighted skill index
            </span>
          </div>
        </div>

        {/* Metric 4: Current Streak */}
        <div id="summary-card-streak" className="p-4 bg-[#121214] border border-white/5 rounded-2xl space-y-2 hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">Current Streak</span>
            <div className="p-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400">
              <Flame className="w-4 h-4 fill-orange-500/20" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-orange-400 tracking-tight">
              {streakInfo.currentStreak} {streakInfo.currentStreak === 1 ? 'Day' : 'Days'}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
              {streakInfo.isStreakActiveToday ? 'Active today 🔥' : 'Practice to extend'}
            </span>
          </div>
        </div>

        {/* Metric 5: Total XP */}
        <div id="summary-card-xp" className="p-4 bg-[#121214] border border-white/5 rounded-2xl space-y-2 hover:border-white/10 transition-colors col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">Total XP</span>
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-amber-400 tracking-tight">
              {user.xp} XP
            </span>
            <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
              Level {levelInfo.level} • {levelInfo.title}
            </span>
          </div>
        </div>

      </div>

      {/* 4. PERFORMANCE INSIGHTS: TOPICS TO PRACTICE (WEAK AREAS) & STRONG SKILLS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card A: Topics to Practice (Weak Areas) */}
        <div id="topics-to-practice-card" className="bg-[#121214] border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h2 className="font-display font-bold text-zinc-100 text-sm">
                Topics to Practice
              </h2>
            </div>
            <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              {weakTopics.length} Focus Areas
            </span>
          </div>

          {weakTopics.length === 0 ? (
            <div className="p-6 text-center bg-[#0d0d0f]/50 border border-white/5 rounded-xl space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-80" />
              <p className="text-xs text-zinc-300 font-medium">
                {hasUserActivity ? 'All active topics are performing well!' : 'No weak topic diagnosis recorded yet.'}
              </p>
              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
                {hasUserActivity 
                  ? 'Keep challenging yourself with higher difficulty problems to discover new areas to master.'
                  : 'Start solving problems to diagnose which algorithmic patterns need more practice.'
                }
              </p>
              {onNavigateToPractice && (
                <button
                  onClick={() => onNavigateToPractice()}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  <span>Explore Practice Problems</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {weakTopics.map(wk => (
                <div 
                  key={wk.topic} 
                  id={`weak-topic-row-${wk.topic.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onNavigateToPractice && onNavigateToPractice(wk.topic)}
                  className={`p-3.5 bg-[#0d0d0f] border border-white/5 hover:border-amber-500/30 hover:bg-zinc-800/30 rounded-xl flex items-center justify-between gap-3 transition-all ${
                    onNavigateToPractice ? 'cursor-pointer group' : ''
                  }`}
                  title={`Practice ${wk.topic} challenges`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-indigo-300 transition-colors truncate">{wk.topic}</span>
                      <span className="text-[9px] font-mono uppercase text-amber-300 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md font-semibold shrink-0">
                        Needs Practice
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 block">
                      {wk.category} • {wk.attempts} attempts • {wk.accuracy}% accuracy
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-amber-400 block">{wk.mastery}%</span>
                      <span className="text-[9px] font-mono text-zinc-500 block">Mastery</span>
                    </div>

                    {onNavigateToPractice && (
                      <button
                        id={`practice-weak-topic-${wk.topic.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToPractice(wk.topic);
                        }}
                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[10px] cursor-pointer flex items-center gap-1 transition-all shadow-sm"
                      >
                        <span>Practice</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card B: Strong Skills & High Mastery */}
        <div id="strong-skills-card" className="bg-[#121214] border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="font-display font-bold text-zinc-100 text-sm">
                Strong Skills & High Mastery
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              {strongTopics.length} Proficient Topics
            </span>
          </div>

          {strongTopics.length === 0 ? (
            <div className="p-6 text-center bg-[#0d0d0f]/50 border border-white/5 rounded-xl space-y-2">
              <Target className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400 font-medium">No strong skills recorded yet</p>
              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
                Achieve high accuracy (≥65%) across multiple problem submissions in a topic to build a Strong mastery rating.
              </p>
              {onNavigateToPractice && (
                <button
                  onClick={() => onNavigateToPractice()}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  <span>Start a Practice Challenge</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {strongTopics.map(st => (
                <div 
                  key={st.topic} 
                  id={`strong-topic-row-${st.topic.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onNavigateToPractice && onNavigateToPractice(st.topic)}
                  className={`p-3.5 bg-[#0d0d0f] border border-white/5 hover:border-emerald-500/30 hover:bg-zinc-800/30 rounded-xl flex items-center justify-between gap-3 transition-all ${
                    onNavigateToPractice ? 'cursor-pointer group' : ''
                  }`}
                  title={`Practice and reinforce ${st.topic}`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-indigo-300 transition-colors truncate">{st.topic}</span>
                      <span className="text-[9px] font-mono uppercase text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-semibold shrink-0">
                        Strong
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 block">
                      {st.category} • {st.attempts} attempts • {st.accuracy}% accuracy
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-emerald-400 block">{st.mastery}%</span>
                      <span className="text-[9px] font-mono text-zinc-500 block">Mastery</span>
                    </div>

                    {onNavigateToPractice && (
                      <button
                        id={`practice-strong-topic-${st.topic.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToPractice(st.topic);
                        }}
                        className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold rounded-lg text-[10px] cursor-pointer flex items-center gap-1 transition-colors"
                      >
                        <span>Reinforce</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 5. TOPIC MASTERY BREAKDOWN & PROGRESSION MATRIX */}
      <div id="topic-mastery-section" className="bg-[#121214] border border-white/5 p-6 rounded-2xl space-y-6">
        
        {/* Section Header with Category & Status Filters */}
        <div className="space-y-4 border-b border-white/5 pb-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-zinc-100 text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <span>Topic Mastery Breakdown</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Detailed view of problems attempted, problems solved, and mastery scores for each algorithmic category.
              </p>
            </div>

            {/* Topic Search Input */}
            <div className="relative w-full md:w-64">
              <input
                id="topic-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g., Arrays, DP)..."
                className="w-full bg-[#0d0d0f] border border-white/5 hover:border-zinc-800 focus:border-indigo-500 text-xs py-2 pl-8 pr-3 rounded-xl outline-none text-zinc-200 placeholder-zinc-500"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Status Filter Chips: All, Strong, Improving, Needs Practice, Not Started */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-mono text-zinc-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status:
            </span>
            {(['All', 'Strong', 'Improving', 'Needs Practice', 'Not Started'] as const).map(status => {
              const isSelected = selectedStatusFilter === status;
              const count = status === 'All' ? topicsList.length : statusCounts[status];
              return (
                <button
                  key={status}
                  id={`status-filter-${status.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-[#0d0d0f] text-zinc-400 border-white/5 hover:text-zinc-200 hover:border-zinc-800'
                  }`}
                >
                  <span>{status}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-zinc-500 mr-1">Category:</span>
            <button
              id="category-filter-all"
              onClick={() => setSelectedCategoryFilter('All')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                selectedCategoryFilter === 'All'
                  ? 'bg-zinc-800 text-zinc-100 border-zinc-700'
                  : 'bg-[#0d0d0f] text-zinc-400 border-white/5 hover:text-zinc-200'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                id={`category-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                  selectedCategoryFilter === cat
                    ? 'bg-zinc-800 text-zinc-100 border-zinc-700'
                    : 'bg-[#0d0d0f] text-zinc-400 border-white/5 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Topics List Grid */}
        <div className="space-y-3">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-10 bg-[#0d0d0f]/50 border border-white/5 rounded-2xl space-y-2">
              <Layers className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400 font-medium">No topics match the selected filters.</p>
              <button
                onClick={() => { setSelectedCategoryFilter('All'); setSelectedStatusFilter('All'); setSearchQuery(''); }}
                className="text-xs text-indigo-400 hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredTopics.map((topicItem) => (
              <div 
                key={topicItem.topic}
                id={`topic-row-${topicItem.topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => onNavigateToPractice && onNavigateToPractice(topicItem.topic)}
                className={`p-4 bg-[#0d0d0f]/80 border border-white/5 hover:border-indigo-500/30 hover:bg-zinc-800/30 rounded-2xl space-y-3 transition-all ${
                  onNavigateToPractice ? 'cursor-pointer group' : ''
                }`}
                title={`Practice ${topicItem.topic} challenges`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Topic Title, Category & Status Pill */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-display font-bold text-sm text-zinc-100 group-hover:text-indigo-300 transition-colors">{topicItem.topic}</span>
                      
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${getStatusBadgeStyle(topicItem.simpleStatus)}`}>
                        {topicItem.simpleStatus}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono block">{topicItem.category}</span>
                  </div>

                  {/* Right Side Metric Readouts & Practice Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-mono">
                    <div className="text-left sm:text-center">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Solved</span>
                      <span className="font-bold text-emerald-400">{topicItem.solvedTotal}</span>
                    </div>
                    <div className="text-left sm:text-center">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Attempted</span>
                      <span className="font-bold text-zinc-300">{topicItem.attempts}</span>
                    </div>
                    <div className="text-left sm:text-center">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Accuracy</span>
                      <span className="font-bold text-zinc-200">
                        {topicItem.attempts > 0 ? `${topicItem.accuracy}%` : '—'}
                      </span>
                    </div>
                    <div className="text-left sm:text-center min-w-[70px]">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Mastery</span>
                      <span className={`font-bold ${
                        topicItem.mastery >= 65 ? 'text-emerald-400' :
                        topicItem.mastery >= 35 ? 'text-indigo-400' :
                        topicItem.mastery > 0 ? 'text-amber-400' : 'text-zinc-500'
                      }`}>
                        {topicItem.mastery}%
                      </span>
                    </div>

                    {onNavigateToPractice && (
                      <button
                        id={`practice-topic-btn-${topicItem.topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToPractice(topicItem.topic);
                        }}
                        className="px-3 py-1.5 bg-[#18181b] hover:bg-indigo-600 hover:text-white text-zinc-300 border border-white/5 hover:border-indigo-500 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 ml-1 shadow-sm"
                      >
                        <span>Practice</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar Indicator */}
                <div className="space-y-1">
                  <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        topicItem.mastery >= 85 ? 'bg-purple-500' :
                        topicItem.mastery >= 65 ? 'bg-emerald-500' :
                        topicItem.mastery >= 35 ? 'bg-indigo-500' :
                        topicItem.mastery > 0 ? 'bg-amber-500' : 'bg-zinc-800'
                      }`}
                      style={{ width: `${Math.max(2, topicItem.mastery)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 6. RECENT ACTIVITY STREAM (Using real records) */}
      <div id="recent-activity-section" className="bg-[#121214] border border-white/5 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
              <Activity className="w-4 h-4" />
            </div>
            <h2 className="font-display font-bold text-zinc-100 text-sm">
              Recent Activity
            </h2>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            {recentActivityDisplay.length} Logged Events
          </span>
        </div>

        {recentActivityDisplay.length === 0 ? (
          <div className="p-8 text-center bg-[#0d0d0f]/50 border border-white/5 rounded-xl space-y-2">
            <Clock className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400 font-medium">No recent activity recorded yet.</p>
            <p className="text-[11px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
              When you solve problems or test code, your activity timeline will record your submissions and XP yields here.
            </p>
            {onNavigateToPractice && (
              <button
                onClick={() => onNavigateToPractice()}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                <span>Practice a Problem</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentActivityDisplay.map((act) => (
              <div 
                key={act.id}
                id={`recent-activity-item-${act.id}`}
                onClick={() => {
                  if (onNavigateToPractice) {
                    if (act.problemId) {
                      onNavigateToPractice(act.topic, act.problemId);
                    } else if (act.topic) {
                      onNavigateToPractice(act.topic);
                    } else {
                      onNavigateToPractice();
                    }
                  }
                }}
                className={`p-3 bg-[#0d0d0f] border border-white/5 hover:border-indigo-500/30 hover:bg-zinc-800/40 rounded-xl flex items-center justify-between gap-3 transition-all ${
                  onNavigateToPractice ? 'cursor-pointer group' : ''
                }`}
                title={act.problemId ? "Click to view problem details" : "Click to practice topic"}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Status Indicator Icon */}
                  <div className={`p-1.5 rounded-lg shrink-0 border ${
                    act.result === 'success' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {act.result === 'success' ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-indigo-300 transition-colors truncate">{act.title}</span>
                      
                      {act.difficulty && (
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md font-semibold border ${
                          act.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          act.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {act.difficulty}
                        </span>
                      )}

                      {act.topic && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-zinc-800 text-zinc-400 border border-white/5">
                          {act.topic}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-zinc-500 block">
                      {act.result === 'success' ? 'Completed successfully' : 'Attempted'} • {act.timestampFormatted}
                    </span>
                  </div>
                </div>

                {/* XP Earned & Arrow Action */}
                <div className="shrink-0 flex items-center gap-2.5 font-mono">
                  {act.xpEarned > 0 ? (
                    <span className="text-xs font-bold text-emerald-400">+{act.xpEarned} XP</span>
                  ) : (
                    <span className="text-xs text-zinc-500">0 XP</span>
                  )}
                  {onNavigateToPractice && (
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. PERFORMANCE OVER TIME & 7-DAY CODING STREAK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 7-Day Streak Calendar */}
        <div id="streak-calendar-card" className="lg:col-span-2 bg-[#121214] border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400">
                <Flame className="w-4 h-4 fill-orange-500/20" />
              </div>
              <h3 className="font-display font-bold text-zinc-200 text-sm">
                7-Day Consistency Streak
              </h3>
            </div>
            <span className="text-[10px] font-mono text-orange-400 font-bold bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
              {streakInfo.currentStreak} Day Streak
            </span>
          </div>

          {/* 7 Day Blocks */}
          <div className="grid grid-cols-7 gap-2 pt-1">
            {streakInfo.last7Days.map((dayItem, idx) => (
              <div 
                key={idx}
                className={`
                  p-2.5 rounded-xl border text-center flex flex-col items-center justify-between h-24 transition-all
                  ${dayItem.hasActivity 
                    ? 'bg-orange-500/10 border-orange-500/30 shadow-sm shadow-orange-500/5' 
                    : 'bg-[#0d0d0f]/60 border-white/5 opacity-60'
                  }
                `}
              >
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">{dayItem.dayLabel}</span>
                <div className={`
                  p-1.5 rounded-lg border my-0.5
                  ${dayItem.hasActivity ? 'bg-orange-600 text-white border-orange-400' : 'bg-zinc-800/50 text-zinc-600 border-white/5'}
                `}>
                  {dayItem.hasActivity ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Flame className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[9px] font-mono text-zinc-500">{dayItem.date.slice(5)}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed bg-[#0d0d0f]/60 border border-white/5 p-3 rounded-xl">
            💡 <strong className="text-zinc-200">Consistency Rule:</strong> Complete any practice problem, AI mentoring session, or daily check-in each day to keep your streak alive.
          </p>
        </div>

        {/* Performance Accuracy Summary Card */}
        <div id="accuracy-summary-card" className="bg-[#121214] border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-zinc-200 text-sm">
                Accuracy & Solved Ratio
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              {analytics ? analytics.overallAccuracyPercent : 0}% Accuracy
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#0d0d0f] border border-white/5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-300 font-medium">Problems Solved</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">
                {analytics ? analytics.problemsSolvedCount : user.solvedCount}
              </span>
            </div>

            <div className="p-3 bg-[#0d0d0f] border border-white/5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <span className="text-zinc-300 font-medium">Problems Attempted</span>
              </div>
              <span className="font-mono font-bold text-indigo-400">
                {analytics ? analytics.problemsAttemptedCount : 0}
              </span>
            </div>

            <div className="p-3 bg-[#0d0d0f] border border-white/5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span className="text-zinc-300 font-medium">Total Attempts</span>
              </div>
              <span className="font-mono font-bold text-amber-400">
                {analytics ? analytics.totalAttempts : 0}
              </span>
            </div>

            <div className="p-3 bg-[#0d0d0f] border border-white/5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span className="text-zinc-300 font-medium">Total XP Earned</span>
              </div>
              <span className="font-mono font-bold text-purple-400">
                {user.xp} XP
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 8. MILESTONES & ACHIEVEMENT BADGES */}
      <div id="achievements-section" className="bg-[#121214] border border-white/5 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <Star className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-zinc-200 text-sm">
              Milestones & Achievements ({badges.filter(b => b.unlocked).length} / {badges.length} Unlocked)
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {badges.map((b) => (
            <div 
              key={b.id}
              className={`
                p-3.5 border rounded-2xl flex items-start gap-3 transition-all
                ${b.unlocked 
                  ? 'bg-[#0d0d0f]/80 border-indigo-500/25 shadow-sm shadow-indigo-500/5' 
                  : 'bg-[#0d0d0f]/40 border-white/5 opacity-50 grayscale'
                }
              `}
            >
              <div className={`
                p-2.5 rounded-xl border shrink-0
                ${b.unlocked 
                  ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                  : 'bg-[#121214] border-white/5 text-zinc-600'
                }
              `}>
                {getBadgeIcon(b.icon, b.unlocked)}
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-display font-bold text-zinc-200 text-xs leading-none truncate">{b.title}</h4>
                  {!b.unlocked && <Lock className="w-3 h-3 text-zinc-500 shrink-0" />}
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">{b.description}</p>
                {b.unlocked && b.unlockedAt ? (
                  <span className="text-[9px] font-mono text-emerald-400 block pt-0.5">Unlocked {b.unlockedAt}</span>
                ) : (
                  <span className="text-[9px] font-mono text-zinc-500 block pt-0.5">Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
