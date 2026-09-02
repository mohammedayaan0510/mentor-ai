import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Compass, 
  MapPin, 
  Lock, 
  CheckCircle, 
  Clock, 
  Award, 
  ChevronRight, 
  ChevronLeft,
  X, 
  Sparkles, 
  ArrowRight,
  ArrowUp,
  Code2,
  Database,
  Globe,
  Cpu,
  BookOpen,
  Terminal,
  Search,
  Check,
  Copy,
  ExternalLink,
  MessageSquare,
  Flame,
  Layers,
  ArrowUpRight,
  Filter,
  Bookmark,
  CheckCircle2,
  Zap,
  GraduationCap
} from 'lucide-react';
import { RoadmapCategory, RoadmapTopic, TopicStats, PracticeProblem } from '../types';
import { ROADMAP_CATEGORIES, ALL_ROADMAP_TOPICS } from '../roadmap';

interface LearningRoadmapViewProps {
  onNodeCompleted?: (xpReward: number, nodeTitle: string, topic?: string) => void;
  onNavigateToPractice?: (topicName?: string) => void;
  onAskAIMentor?: (topicName: string, prompt?: string) => void;
  topicStatsMap?: { [topic: string]: TopicStats };
  problems?: PracticeProblem[];
}

const STORAGE_COMPLETED_TOPICS_KEY = 'mentor_ai_completed_roadmap_topics_v1';

export default function LearningRoadmapView({ 
  onNodeCompleted,
  onNavigateToPractice,
  onAskAIMentor,
  topicStatsMap = {},
  problems = []
}: LearningRoadmapViewProps) {
  // Active Category selection ('all' or category id)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not-started' | 'in-progress' | 'completed'>('all');
  const [selectedTopic, setSelectedTopic] = useState<RoadmapTopic | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeCodeLang, setActiveCodeLang] = useState<string>('all');

  // Load completed topics from localStorage
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COMPLETED_TOPICS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    // Default initial starter completions for realistic progress
    return ['found-1', 'ds-1'];
  });

  // Smoothly scroll to the topic notes section whenever selectedTopic is set or changes
  useEffect(() => {
    if (selectedTopic) {
      const targetId = `topic-notes-${selectedTopic.id}`;
      
      const performScroll = () => {
        const targetElement = document.getElementById(targetId) || document.getElementById('roadmap-notes-viewer');
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      // Small delay allows the newly selected notes container to mount in the DOM before scrolling
      const timeoutId = setTimeout(() => {
        requestAnimationFrame(performScroll);
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedTopic?.id]);

  // Handler to scroll back to the specific topic card in the grid
  const handleScrollToTopicCard = (topicId: string) => {
    const cardEl = document.getElementById(`roadmap-card-${topicId}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handler when Review Notes or Study Notes is clicked
  const handleOpenTopicNotes = (topic: RoadmapTopic) => {
    setSelectedTopic(topic);
  };

  // Save completed topics to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COMPLETED_TOPICS_KEY, JSON.stringify(completedTopicIds));
    } catch {
      // Ignore
    }
  }, [completedTopicIds]);

  // Handle completion toggle
  const handleToggleCompleteTopic = (topic: RoadmapTopic) => {
    const isCurrentlyCompleted = completedTopicIds.includes(topic.id);
    let newCompletedList: string[];

    if (isCurrentlyCompleted) {
      newCompletedList = completedTopicIds.filter(id => id !== topic.id);
    } else {
      newCompletedList = [...completedTopicIds, topic.id];
      // Trigger reward callback
      if (onNodeCompleted) {
        onNodeCompleted(topic.xpReward, topic.title, topic.practiceTopic || topic.category);
      }
    }
    setCompletedTopicIds(newCompletedList);
  };

  // Helper to get problem count for a practice topic
  const getPracticeProblemStats = (practiceTopicName?: string) => {
    if (!practiceTopicName) return null;
    const matchingProblems = problems.filter(
      p => p.topic.toLowerCase() === practiceTopicName.toLowerCase()
    );
    const stats = topicStatsMap[practiceTopicName];
    const solvedCount = stats ? stats.successes : 0;
    const totalCount = matchingProblems.length;

    return {
      totalCount,
      solvedCount,
      accuracy: stats ? stats.accuracy : 0,
      mastery: stats ? stats.mastery : 0,
      progressionState: stats ? stats.progressionState : 'Not Started'
    };
  };

  // Get topic status: 'Completed' | 'Practicing' | 'Learning' | 'Not Started'
  const getTopicStatus = (topic: RoadmapTopic) => {
    if (completedTopicIds.includes(topic.id)) return 'Completed';
    if (topic.practiceTopic) {
      const stats = topicStatsMap[topic.practiceTopic];
      if (stats && stats.attempts > 0) {
        return stats.successes > 0 ? 'Practicing' : 'Learning';
      }
    }
    return 'Not Started';
  };

  // Copy code helper
  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Filtered categories and topics
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ROADMAP_CATEGORIES.map(category => {
      // If category filter is active and not matching
      if (selectedCategoryId !== 'all' && category.id !== selectedCategoryId) {
        return { ...category, topics: [] };
      }

      const filteredTopics = category.topics.filter(topic => {
        // Status filter
        const status = getTopicStatus(topic);
        if (statusFilter === 'completed' && status !== 'Completed') return false;
        if (statusFilter === 'in-progress' && status !== 'Learning' && status !== 'Practicing') return false;
        if (statusFilter === 'not-started' && status !== 'Not Started') return false;

        // Search query filter
        if (!query) return true;

        const inTitle = topic.title.toLowerCase().includes(query);
        const inDesc = topic.description.toLowerCase().includes(query);
        const inCat = topic.category.toLowerCase().includes(query);
        const inConcept = topic.notes.concept.toLowerCase().includes(query);
        const inKeywords = topic.notes.keyTakeaways.some(k => k.toLowerCase().includes(query));
        const inPatterns = topic.notes.commonPatterns.some(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));

        return inTitle || inDesc || inCat || inConcept || inKeywords || inPatterns;
      });

      return {
        ...category,
        topics: filteredTopics
      };
    }).filter(category => category.topics.length > 0);
  }, [selectedCategoryId, searchQuery, statusFilter, completedTopicIds, topicStatsMap]);

  // Total stats calculation
  const totalTopicsCount = ALL_ROADMAP_TOPICS.length;
  const completedCount = completedTopicIds.length;
  const completionPercentage = Math.round((completedCount / totalTopicsCount) * 100);
  const totalEarnedXP = ALL_ROADMAP_TOPICS
    .filter(t => completedTopicIds.includes(t.id))
    .reduce((sum, t) => sum + t.xpReward, 0);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return <Terminal className="w-5 h-5 text-emerald-400" />;
      case 'Database': return <Database className="w-5 h-5 text-indigo-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-amber-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-purple-400" />;
      case 'Globe': return <Globe className="w-5 h-5 text-blue-400" />;
      default: return <BookOpen className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* 1. Header & Overview Dashboard */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 translate-y-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Interactive Engineering Curriculum</span>
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-zinc-100 tracking-tight">
              Learning Roadmaps & Core Notes
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Step-by-step programming progression from fundamentals to advanced algorithmic systems. 
              Review comprehensive conceptual notes, run code examples, and jump directly into practice problems.
            </p>
          </div>

          {/* Quick Metrics Badge Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-[#09090b] border border-white/5 rounded-xl p-3.5 min-w-[120px]">
              <span className="text-[11px] text-zinc-500 font-medium block">Roadmap Progress</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-display font-bold text-lg text-indigo-400">{completionPercentage}%</span>
                <span className="text-xs text-zinc-500 font-mono">({completedCount}/{totalTopicsCount})</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${completionPercentage}%` }} 
                />
              </div>
            </div>

            <div className="bg-[#09090b] border border-white/5 rounded-xl p-3.5 min-w-[120px]">
              <span className="text-[11px] text-zinc-500 font-medium block">Curriculum XP</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-display font-bold text-lg text-emerald-400">+{totalEarnedXP}</span>
                <span className="text-xs text-zinc-500">XP</span>
              </div>
              <span className="text-[10px] text-zinc-500 block mt-1">Earned via modules</span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-[#09090b] border border-white/5 rounded-xl p-3.5 min-w-[120px]">
              <span className="text-[11px] text-zinc-500 font-medium block">Total Topics</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-display font-bold text-lg text-zinc-200">28</span>
                <span className="text-xs text-zinc-500">Modules</span>
              </div>
              <span className="text-[10px] text-zinc-500 block mt-1">4 core tracks</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Control Panel */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
          <button
            id="roadmap-cat-all"
            onClick={() => setSelectedCategoryId('all')}
            className={`
              px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer
              ${selectedCategoryId === 'all' 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20' 
                : 'bg-[#121214] border-white/5 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }
            `}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Tracks (28)</span>
          </button>

          {ROADMAP_CATEGORIES.map(category => {
            const isSelected = selectedCategoryId === category.id;
            return (
              <button
                id={`roadmap-cat-${category.id}`}
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`
                  px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer
                  ${isSelected 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20' 
                    : 'bg-[#121214] border-white/5 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }
                `}
              >
                {getCategoryIcon(category.icon)}
                <span>{category.title} ({category.topics.length})</span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="roadmap-search-input"
              type="text"
              placeholder="Search concepts, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121214] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            id="roadmap-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#121214] border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 cursor-pointer shrink-0"
          >
            <option value="all">All Statuses</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress / Practicing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* 3. Category & Topic Sections Grid */}
      {filteredCategories.length === 0 ? (
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-12 text-center space-y-3">
          <Search className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="font-display font-bold text-zinc-300 text-base">No matching topics found</h3>
          <p className="text-zinc-500 text-xs max-w-sm mx-auto">
            Try adjusting your search query or filter selection to find relevant curriculum notes.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategoryId('all'); setStatusFilter('all'); }}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredCategories.map(category => {
            const categoryCompletedCount = category.topics.filter(t => completedTopicIds.includes(t.id)).length;
            const categoryPercent = Math.round((categoryCompletedCount / category.topics.length) * 100);

            return (
              <div key={category.id} className="space-y-4">
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#121214] border border-white/10 rounded-xl">
                      {getCategoryIcon(category.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-display font-bold text-zinc-100 text-lg">{category.title}</h2>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-white/5">
                          {category.level}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-xs mt-0.5">{category.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-zinc-400 font-mono">
                    <span>{categoryCompletedCount} / {category.topics.length} Completed</span>
                    <span className="text-indigo-400 font-bold">({categoryPercent}%)</span>
                  </div>
                </div>

                {/* Topics Grid for this Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.topics.map((topic, idx) => {
                    const isCompleted = completedTopicIds.includes(topic.id);
                    const practiceStats = getPracticeProblemStats(topic.practiceTopic);
                    const topicStatus = getTopicStatus(topic);
                    const isNotesActive = selectedTopic?.id === topic.id;

                    return (
                      <div
                        key={topic.id}
                        id={`roadmap-card-${topic.id}`}
                        className={`
                          bg-[#121214] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-zinc-700
                          ${isNotesActive
                            ? 'ring-2 ring-indigo-500/60 border-indigo-500/40 bg-indigo-950/20'
                            : isCompleted 
                            ? 'border-emerald-500/20 bg-[#121214]/60' 
                            : 'border-white/5'
                          }
                        `}
                      >
                        <div className="space-y-3">
                          {/* Top Tag Row */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                                Step {idx + 1}
                              </span>
                              <span className={`
                                text-[10px] font-semibold px-2 py-0.5 rounded-md
                                ${topic.level === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                                ${topic.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : ''}
                                ${topic.level === 'Advanced' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : ''}
                              `}>
                                {topic.level}
                              </span>
                              {isNotesActive && (
                                <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <span>Active Notes ↓</span>
                                </span>
                              )}
                            </div>

                            {/* Completion Status Pill */}
                            <span className={`
                              text-[11px] font-semibold flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
                              ${isCompleted 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : topicStatus === 'Practicing' 
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'bg-zinc-800/80 text-zinc-400 border border-white/5'
                              }
                            `}>
                              {isCompleted ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Completed</span>
                                </>
                              ) : (
                                <span>{topicStatus}</span>
                              )}
                            </span>
                          </div>

                          {/* Title & Description */}
                          <div>
                            <h3 className="font-display font-bold text-zinc-200 text-base leading-snug">
                              {topic.title}
                            </h3>
                            <p className="text-zinc-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                              {topic.description}
                            </p>
                          </div>

                          {/* Prerequisites tag if present */}
                          {topic.prerequisites && topic.prerequisites.length > 0 && (
                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                              <span className="font-medium text-zinc-400">Prereq:</span>
                              <span className="truncate">{topic.prerequisites.join(', ')}</span>
                            </div>
                          )}

                          {/* Connected Practice Problem metrics */}
                          {practiceStats && practiceStats.totalCount > 0 && (
                            <div className="bg-[#09090b] border border-white/5 rounded-xl p-3 space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>Practice Problems</span>
                                </span>
                                <span className="text-zinc-300 font-mono font-semibold">
                                  {practiceStats.solvedCount}/{practiceStats.totalCount} Solved
                                </span>
                              </div>
                              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-emerald-500 h-full rounded-full transition-all" 
                                  style={{ width: `${Math.min(100, Math.round((practiceStats.solvedCount / practiceStats.totalCount) * 100))}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Bottom Meta & Actions */}
                        <div className="mt-5 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{topic.duration}</span>
                            </span>
                            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                              <Award className="w-3.5 h-3.5" />
                              <span>+{topic.xpReward} XP</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Practice Button if mapped */}
                            {topic.practiceTopic && onNavigateToPractice && (
                              <button
                                id={`practice-topic-${topic.id}`}
                                onClick={() => onNavigateToPractice(topic.practiceTopic)}
                                title={`Practice ${topic.practiceTopic} problems`}
                                className="p-2 text-xs font-semibold bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                                <span className="hidden sm:inline">Practice</span>
                              </button>
                            )}

                            {/* Read Detailed Notes Button */}
                            <button
                              id={`open-notes-${topic.id}`}
                              onClick={() => handleOpenTopicNotes(topic)}
                              className={`
                                px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm
                                ${isNotesActive
                                  ? 'bg-indigo-500 text-white shadow-indigo-500/30'
                                  : isCompleted 
                                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200' 
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                                }
                              `}
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>{isCompleted ? 'Review Notes' : 'Study Notes'}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Detailed In-Page Notes Section for Selected Topic */}
      {selectedTopic && (() => {
        const currentTopicIndex = ALL_ROADMAP_TOPICS.findIndex(t => t.id === selectedTopic.id);
        const prevTopic = currentTopicIndex > 0 ? ALL_ROADMAP_TOPICS[currentTopicIndex - 1] : null;
        const nextTopic = currentTopicIndex >= 0 && currentTopicIndex < ALL_ROADMAP_TOPICS.length - 1 ? ALL_ROADMAP_TOPICS[currentTopicIndex + 1] : null;

        return (
          <div 
            id={`topic-notes-${selectedTopic.id}`}
            className="scroll-mt-6 md:scroll-mt-8 bg-[#121214] border border-indigo-500/30 rounded-2xl p-5 sm:p-8 space-y-8 shadow-2xl shadow-black/50 transition-all animate-fade-in relative mt-8"
          >
            {/* Notes Top Navigation & Heading Bar */}
            <div id="roadmap-notes-viewer" className="pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shrink-0 mt-1 sm:mt-0">
                  <Terminal className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-indigo-400 tracking-wider">
                      {selectedTopic.category}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className={`
                      text-[10px] font-semibold px-2 py-0.5 rounded-md
                      ${selectedTopic.level === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                      ${selectedTopic.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : ''}
                      ${selectedTopic.level === 'Advanced' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : ''}
                    `}>
                      {selectedTopic.level}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedTopic.duration}
                    </span>
                  </div>
                  <h2 
                    id={`notes-heading-${selectedTopic.id}`}
                    className="font-display font-bold text-zinc-100 text-xl sm:text-2xl mt-1 tracking-tight"
                  >
                    {selectedTopic.title}
                  </h2>
                </div>
              </div>

              {/* Header Right Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  id="scroll-to-card-btn"
                  onClick={() => handleScrollToTopicCard(selectedTopic.id)}
                  title="Scroll back to this topic card in roadmap grid"
                  className="px-3 py-2 text-xs font-semibold bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-white/5"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden sm:inline">Back to Card in Grid</span>
                </button>

                <button
                  id="close-reader-btn"
                  onClick={() => setSelectedTopic(null)}
                  className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer border border-white/5"
                  title="Close Notes"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Actions Top Bar in Notes */}
            <div className="bg-[#09090b] border border-white/5 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  id="reader-toggle-complete"
                  onClick={() => handleToggleCompleteTopic(selectedTopic)}
                  className={`
                    px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer
                    ${completedTopicIds.includes(selectedTopic.id)
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                    }
                  `}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedTopicIds.includes(selectedTopic.id) ? 'Completed (+XP Claimed)' : 'Mark as Completed (+XP)'}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedTopic.practiceTopic && onNavigateToPractice && (
                  <button
                    id="reader-practice-btn"
                    onClick={() => {
                      const topic = selectedTopic.practiceTopic;
                      onNavigateToPractice(topic);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>Practice This Topic</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {onAskAIMentor && (
                  <button
                    id="reader-ask-ai-btn"
                    onClick={() => {
                      const title = selectedTopic.title;
                      onAskAIMentor(title, `Could you provide a detailed technical walkthrough, common edge cases, and best practices for ${title}?`);
                    }}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-white/5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Ask AI Mentor</span>
                  </button>
                )}
              </div>
            </div>

            {/* 1. Concept Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                <span>Concept & Definition</span>
              </h3>
              <div className="bg-[#09090b] border border-white/5 p-4 sm:p-5 rounded-xl text-sm text-zinc-300 leading-relaxed">
                {selectedTopic.notes.concept}
              </div>
            </div>

            {/* 2. Why It Matters */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Why It Matters In Real Systems</span>
              </h3>
              <div className="bg-[#09090b] border border-white/5 p-4 sm:p-5 rounded-xl text-sm text-zinc-300 leading-relaxed">
                {selectedTopic.notes.whyItMatters}
              </div>
            </div>

            {/* 3. Core Ideas */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Core Principles & Mechanics</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedTopic.notes.coreIdeas.map((idea, i) => (
                  <div key={i} className="bg-[#09090b] border border-white/5 p-4 rounded-xl text-xs text-zinc-300 leading-relaxed flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                    <span>{idea}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Syntax & Implementation Patterns */}
            {selectedTopic.notes.syntaxImplementation.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  <span>Implementation Patterns</span>
                </h3>

                <div className="space-y-4">
                  {selectedTopic.notes.syntaxImplementation.map((impl, idx) => (
                    <div key={idx} className="bg-[#09090b] border border-white/5 rounded-xl overflow-hidden">
                      <div className="px-4 py-2 bg-zinc-900/60 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-zinc-400">{impl.language}</span>
                        <button
                          onClick={() => handleCopyCode(impl.code, idx)}
                          className="text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto text-xs font-mono text-zinc-300 leading-relaxed">
                        <code>{impl.code}</code>
                      </pre>
                      {impl.explanation && (
                        <div className="px-4 py-2.5 bg-zinc-900/30 border-t border-white/5 text-xs text-zinc-400">
                          {impl.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Concrete Walkthrough Example */}
            {selectedTopic.notes.example && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  <span>Walkthrough Example: {selectedTopic.notes.example.title}</span>
                </h3>

                <div className="bg-[#09090b] border border-white/5 rounded-xl p-4 sm:p-5 space-y-3">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {selectedTopic.notes.example.description}
                  </p>
                  <pre className="bg-[#121214] p-4 border border-white/5 rounded-xl overflow-x-auto text-xs font-mono text-zinc-300 leading-relaxed">
                    <code>{selectedTopic.notes.example.code}</code>
                  </pre>
                  <div className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 p-3.5 rounded-lg leading-relaxed">
                    <strong>Breakdown:</strong> {selectedTopic.notes.example.explanation}
                  </div>
                </div>
              </div>
            )}

            {/* 6. Common Problem Patterns */}
            {selectedTopic.notes.commonPatterns.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Common Algorithmic Patterns</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedTopic.notes.commonPatterns.map((pat, i) => (
                    <div key={i} className="bg-[#09090b] border border-white/5 p-4 rounded-xl space-y-1">
                      <h4 className="font-display font-bold text-xs text-zinc-200">{pat.name}</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">{pat.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practical Problem-Solving & Recognition Clues */}
            {selectedTopic.notes.problemSolvingClues && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Practical Problem-Solving & Pattern Recognition</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {/* 1. Look for this pattern when... */}
                  <div className="bg-[#09090b] border border-cyan-500/20 rounded-xl p-4 space-y-2">
                    <h4 className="font-mono font-bold text-xs text-cyan-300">
                      Look for this pattern when...
                    </h4>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {selectedTopic.notes.problemSolvingClues.lookFor.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 2. Typical clues in a problem... */}
                  <div className="bg-[#09090b] border border-amber-500/20 rounded-xl p-4 space-y-2">
                    <h4 className="font-mono font-bold text-xs text-amber-300">
                      Typical clues in a problem:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {selectedTopic.notes.problemSolvingClues.clues.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 3. Questions to ask yourself... */}
                  <div className="bg-[#09090b] border border-indigo-500/20 rounded-xl p-4 space-y-2">
                    <h4 className="font-mono font-bold text-xs text-indigo-300">
                      What should you ask yourself?
                    </h4>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {selectedTopic.notes.problemSolvingClues.askYourself.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Common Mistakes & Fixes */}
            {selectedTopic.notes.commonMistakes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  <span>Common Pitfalls & Fixes</span>
                </h3>

                <div className="space-y-2.5">
                  {selectedTopic.notes.commonMistakes.map((mistake, i) => (
                    <div key={i} className="bg-[#09090b] border border-rose-500/20 rounded-xl p-4 space-y-2">
                      <div className="text-xs text-rose-300 flex items-start gap-2">
                        <span className="font-bold shrink-0">Mistake:</span>
                        <span>{mistake.mistake}</span>
                      </div>
                      <div className="text-xs text-emerald-400 flex items-start gap-2 pt-1 border-t border-white/5">
                        <span className="font-bold shrink-0">Correction:</span>
                        <span>{mistake.fix}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. Complexity & When To Use */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedTopic.notes.complexity && (
                <div className="bg-[#09090b] border border-white/5 p-4 sm:p-5 rounded-xl space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                    Complexity Analysis
                  </h4>
                  <div className="space-y-1.5 text-xs text-zinc-300 font-mono">
                    <div><strong className="text-zinc-500">Time:</strong> {selectedTopic.notes.complexity.time}</div>
                    <div><strong className="text-zinc-500">Space:</strong> {selectedTopic.notes.complexity.space}</div>
                    {selectedTopic.notes.complexity.tradeoffs && (
                      <div className="text-zinc-400 font-sans text-xs pt-1">
                        <strong>Tradeoffs:</strong> {selectedTopic.notes.complexity.tradeoffs}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedTopic.notes.whenToUse.length > 0 && (
                <div className="bg-[#09090b] border border-white/5 p-4 sm:p-5 rounded-xl space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                    When To Apply This Concept
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-400">
                    {selectedTopic.notes.whenToUse.map((signal, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 9. Key Takeaways Box */}
            {selectedTopic.notes.keyTakeaways.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-950/40 to-[#09090b] border border-indigo-500/20 rounded-xl p-5 sm:p-6 space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Key Takeaways & Quick Revision</span>
                </h3>
                <div className="space-y-2">
                  {selectedTopic.notes.keyTakeaways.map((takeaway, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Bottom Sticky/Footer Bar for Navigation */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {prevTopic && (
                  <button
                    id="prev-topic-notes-btn"
                    onClick={() => handleOpenTopicNotes(prevTopic)}
                    className="px-3.5 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-white/5"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev: {prevTopic.title}</span>
                  </button>
                )}

                {nextTopic && (
                  <button
                    id="next-topic-notes-btn"
                    onClick={() => handleOpenTopicNotes(nextTopic)}
                    className="px-3.5 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-white/5"
                  >
                    <span>Next: {nextTopic.title}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  id="bottom-scroll-to-card-btn"
                  onClick={() => handleScrollToTopicCard(selectedTopic.id)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Back to Grid</span>
                </button>

                <button
                  id="mark-complete-footer-btn"
                  onClick={() => handleToggleCompleteTopic(selectedTopic)}
                  className={`
                    px-5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md
                    ${completedTopicIds.includes(selectedTopic.id)
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                    }
                  `}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedTopicIds.includes(selectedTopic.id) ? 'Mark Incomplete' : 'Complete Module'}
                  </span>
                </button>
              </div>
            </div>

          </div>
        );
      })()}

    </div>
  );
}
