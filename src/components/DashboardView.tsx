import React from 'react';
import { 
  Flame, 
  Award, 
  BookOpen, 
  MessageSquare, 
  Code, 
  Compass, 
  Cpu, 
  TrendingUp, 
  ArrowRight, 
  Play, 
  Activity, 
  Zap, 
  Terminal, 
  Clock,
  CalendarCheck,
  CheckCircle2,
  Lock,
  Target,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { ViewType, UserProfile, ActivityLog, Badge, TopicStats, OverallAnalytics } from '../types';
import { getLevelInfo, calculateStreak } from '../utils/gamification';

interface DashboardViewProps {
  user: UserProfile;
  recentActivity: ActivityLog[];
  setView: (view: ViewType) => void;
  setPracticeFilter?: (topic: string) => void;
  setEditorInitialMode?: (mode: string) => void;
  activityDates?: string[];
  badges?: Badge[];
  onDailyCheckIn?: () => void;
  topicStatsMap?: { [topic: string]: TopicStats };
  analytics?: OverallAnalytics;
}

export default function DashboardView({ 
  user, 
  recentActivity, 
  setView, 
  setPracticeFilter, 
  setEditorInitialMode,
  activityDates = [],
  badges = [],
  onDailyCheckIn,
  topicStatsMap,
  analytics
}: DashboardViewProps) {
  const levelInfo = getLevelInfo(user.xp);
  const streakInfo = calculateStreak(activityDates);

  // Navigation grid definitions
  const modules = [
    {
      id: 'chat',
      title: 'AI Chat Mentor',
      description: 'Interact with Mentor AI in a conversational sandbox. Upload code files or ask computer science questions.',
      icon: MessageSquare,
      color: 'from-indigo-600/10 to-indigo-500/5 border-indigo-500/25 text-indigo-400 hover:border-indigo-500/50 hover:shadow-indigo-500/5',
      actionText: 'Start Chatting'
    },
    {
      id: 'practice',
      title: 'Practice Problems',
      description: 'Sharpen your skills on interactive LeetCode-style algorithms categorized by complexity and data structures.',
      icon: BookOpen,
      color: 'from-teal-600/10 to-teal-500/5 border-teal-500/25 text-teal-400 hover:border-teal-500/50 hover:shadow-teal-500/5',
      actionText: 'Solve Problems'
    },
    {
      id: 'editor',
      title: 'Interactive Code Workspace',
      description: 'A robust coding environment with built-in instant compilers, code explainers, syntax auditors, and formatters.',
      icon: Code,
      color: 'from-purple-600/10 to-purple-500/5 border-purple-500/25 text-purple-400 hover:border-purple-500/50 hover:shadow-purple-500/5',
      actionText: 'Open Workspace'
    },
    {
      id: 'roadmaps',
      title: 'Learning Roadmaps',
      description: 'Structured educational pathways for Python, DSA, Web Dev, and Machine Learning with clear checkpoints.',
      icon: Compass,
      color: 'from-amber-600/10 to-amber-500/5 border-amber-500/25 text-amber-400 hover:border-amber-500/50 hover:shadow-amber-500/5',
      actionText: 'View Roadmaps'
    },
    {
      id: 'interview',
      title: 'Mock Interview Simulator',
      description: 'Test your readiness under pressure. Select a company and role to answer technical engineering prompts.',
      icon: Cpu,
      color: 'from-cyan-600/10 to-cyan-500/5 border-cyan-500/25 text-cyan-400 hover:border-cyan-500/50 hover:shadow-cyan-500/5',
      actionText: 'Begin Simulation'
    },
    {
      id: 'progress',
      title: 'Analytics & Progress',
      description: 'Detailed metrics of your skill matrices, solved categories, activity calendars, and gamified reward badges.',
      icon: TrendingUp,
      color: 'from-rose-600/10 to-rose-500/5 border-rose-500/25 text-rose-400 hover:border-rose-500/50 hover:shadow-rose-500/5',
      actionText: 'View Progress'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner section */}
      <div className="relative overflow-hidden bg-[#121214] border border-white/5 rounded-3xl p-6 md:p-8">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400 animate-pulse" />
                <span className="text-xs font-semibold text-indigo-300">Level {levelInfo.level}: {levelInfo.title}</span>
              </div>
              {onDailyCheckIn && (
                <button
                  id="dashboard-daily-checkin-btn"
                  onClick={onDailyCheckIn}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-semibold text-xs rounded-full transition-all cursor-pointer shadow-sm"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Daily Check-In (+50 XP)</span>
                </button>
              )}
            </div>

            <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-zinc-100 tracking-tight leading-tight">
              Ready to level up your <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-zinc-400 bg-clip-text text-transparent">
                coding mastery today?
              </span>
            </h2>

            {/* Level progress bar */}
            <div className="max-w-md pt-1 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400 font-semibold">{levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP</span>
                <span className="text-indigo-400 font-bold">{levelInfo.progressPercent}% to Lvl {levelInfo.level + 1}</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, levelInfo.progressPercent))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Core real metrics display */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#09090b]/40 border border-white/5 p-4 rounded-2xl w-full md:w-auto md:min-w-md">
            <div className="text-center p-2.5 border-r border-white/5">
              <div className="flex items-center justify-center gap-1 text-orange-400 font-bold text-lg mb-0.5 font-mono">
                <Flame className="w-4 h-4 fill-orange-500/20 text-orange-500" />
                <span>{streakInfo.currentStreak}d</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Streak</span>
            </div>
            <div className="text-center p-2.5 border-r border-white/5">
              <div className="flex items-center justify-center gap-1 text-indigo-400 font-bold text-lg mb-0.5 font-mono">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>{user.xp}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Total XP</span>
            </div>
            <div className="text-center p-2.5 border-r border-white/5">
              <div className="flex items-center justify-center gap-1 text-purple-400 font-bold text-lg mb-0.5 font-mono">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>{analytics ? analytics.overallMasteryPercent : 0}%</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Mastery</span>
            </div>
            <div className="text-center p-2.5">
              <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold text-lg mb-0.5 font-mono">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>{user.solvedCount}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Solved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Modules & Sidebar Widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Module Cards Grid */}
        <div className="xl:col-span-2 space-y-6">
          <h3 className="font-display font-semibold text-lg text-zinc-200 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <span>Interactive Learning Modules</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <div 
                  key={m.id}
                  className={`
                    group relative overflow-hidden bg-gradient-to-br ${m.color} border p-5 rounded-2xl flex flex-col justify-between h-48 transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                  `}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-[#0d0d0f] border border-white/5 rounded-xl">
                        <Icon className="w-5 h-5" />
                      </div>
                      <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <h4 className="font-display font-bold text-zinc-200 mt-2">{m.title}</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">{m.description}</p>
                  </div>

                  <button
                    id={`dashboard-btn-to-${m.id}`}
                    onClick={() => setView(m.id as ViewType)}
                    className="w-full mt-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {m.actionText} →
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Daily Challenge Card */}
          <div className="bg-[#121214] border border-white/5 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-6 translate-x-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono font-bold bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Daily Challenge
              </span>
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>14 hrs left</span>
              </span>
            </div>

            <h4 className="font-display font-bold text-zinc-200 text-base mb-1">
              Two Sum (Optimized)
            </h4>
            <p className="text-zinc-400 text-xs mb-4">
              Given an array of integers, solve in O(N) time using Hash Maps. Easy topic, high yields!
            </p>

            <button
              id="dashboard-start-daily-challenge"
              onClick={() => {
                if (setPracticeFilter) setPracticeFilter('Arrays');
                setView('practice');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Solving (+100 XP)</span>
            </button>
          </div>

          {/* Skill Diagnostic / Focus Recommendations Card */}
          <div className="bg-[#121214] border border-white/5 p-5 rounded-2xl space-y-3">
            <h4 className="font-display font-semibold text-sm text-zinc-300 flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Skill Focus & Diagnostics</span>
            </h4>

            {analytics && analytics.weakAreas.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] text-zinc-400">
                  Recommended practice based on your lowest mastery accuracy:
                </p>
                {analytics.weakAreas.slice(0, 2).map(wk => (
                  <div key={wk.topic} className="p-3 bg-[#0d0d0f] border border-amber-500/20 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-zinc-200 block">{wk.topic}</span>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">{wk.mastery}% Mastery • {wk.accuracy}% Acc</span>
                    </div>
                    <button
                      id={`dashboard-focus-${wk.topic}`}
                      onClick={() => {
                        if (setPracticeFilter) setPracticeFilter(wk.topic);
                        setView('practice');
                      }}
                      className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Practice
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-[#0d0d0f]/50 border border-white/5 rounded-xl text-[11px] text-zinc-400 space-y-1">
                <p className="font-semibold text-zinc-300">No weak areas identified yet!</p>
                <p className="text-zinc-500">Practice algorithms or take mock interviews to generate diagnostic feedback.</p>
              </div>
            )}
          </div>

          {/* Recent Activity List */}
          <div className="bg-[#121214] border border-white/5 p-5 rounded-2xl">
            <h4 className="font-display font-semibold text-sm text-zinc-300 flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Recent Milestones</span>
            </h4>

            {recentActivity.length === 0 ? (
              <div className="text-center py-6 px-3 bg-[#0d0d0f]/50 border border-white/5 rounded-xl space-y-2">
                <CheckCircle2 className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400 font-medium">No completed milestones yet</p>
                <p className="text-[11px] text-zinc-500 leading-normal">
                  Solve practice problems, complete mock interviews, or pass roadmap modules to earn milestones!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-zinc-300 mt-0.5
                      ${act.type === 'solved' ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' : ''}
                      ${act.type === 'chat' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : ''}
                      ${act.type === 'roadmap' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : ''}
                      ${act.type === 'interview' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : ''}
                      ${act.type === 'code' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : ''}
                    `}>
                      <Zap className="w-4 h-4 text-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <h5 className="text-xs font-bold text-zinc-200 truncate">{act.title}</h5>
                        <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-400/5 px-1.5 py-0.5 rounded shrink-0">
                          +{act.xpEarned} XP
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{act.description}</p>
                      <span className="text-[9px] text-zinc-500 block mt-1">{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
