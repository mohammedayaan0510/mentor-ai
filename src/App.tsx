import { GoogleLogin } from '@react-oauth/google';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Key, 
  ArrowRight, 
  Mail, 
  Lock, 
  CheckCircle, 
  Info,
  Flame,
  Award,
  BookOpen,
  Bell,
  Wifi,
  WifiOff,
  User,
  LogIn,
  Github
} from 'lucide-react';
import { 
  ViewType, 
  UserProfile, 
  Message, 
  ActivityLog, 
  Badge, 
  UserActivityRecord, 
  TopicStats, 
  OverallAnalytics,
  WorkspaceContext
} from './types';
import { RECENT_ACTIVITY, BADGES } from './data';
import { 
  getTodayDateString, 
  getYesterdayDateString, 
  calculateStreak, 
  getLevelInfo, 
  checkAndUnlockMilestones 
} from './utils/gamification';
import { 
  loadActivities, 
  saveActivities, 
  computeCentralAnalytics, 
  generateTestData, 
  TOPIC_CATEGORY_MAP 
} from './utils/centralTracking';

// Import Views
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import DashboardView from './components/DashboardView';
import AIChatView from './components/AIChatView';
import CodeEditorView from './components/CodeEditorView';
import PracticeProblemsView from './components/PracticeProblemsView';
import MockInterviewView from './components/MockInterviewView';
import LearningRoadmapView from './components/LearningRoadmapView';
import ProgressDashboardView from './components/ProgressDashboardView';
import SettingsView from './components/SettingsView';

export default function App() {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isEmailLogin, setIsEmailLogin] = useState(false);

  // Central Tracking Store
  const [activities, setActivities] = useState<UserActivityRecord[]>(() => {
    return loadActivities();
  });

  // Derived Central Analytics & Progression Matrices
  const { topicStatsMap, analytics } = useMemo(() => {
    return computeCentralAnalytics(activities);
  }, [activities]);

  // User Profile with dynamic fallback
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      name: 'Guest Developer',
      email: 'guest@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
      streak: 1,
      xp: 50,
      solvedCount: 0,
      accuracy: 100
    };
  });

  // Gamification States
  const [activityDates, setActivityDates] = useState<string[]>(() => {
    const saved = localStorage.getItem('activityDates');
    if (saved) return JSON.parse(saved);
    const today = getTodayDateString();
    return [today];
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('badges');
    if (saved) return JSON.parse(saved);
    return BADGES;
  });

  const [chatCount, setChatCount] = useState<number>(() => {
    const saved = localStorage.getItem('chatCount');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [interviewsCompleted, setInterviewsCompleted] = useState<number>(() => {
    const saved = localStorage.getItem('interviewsCompleted');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [roadmapsCompleted, setRoadmapsCompleted] = useState<number>(() => {
    const saved = localStorage.getItem('roadmapsCompleted');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Sync gamification states to localStorage
  useEffect(() => {
    localStorage.setItem('activityDates', JSON.stringify(activityDates));
  }, [activityDates]);

  useEffect(() => {
    localStorage.setItem('badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('chatCount', String(chatCount));
  }, [chatCount]);

  useEffect(() => {
    localStorage.setItem('interviewsCompleted', String(interviewsCompleted));
  }, [interviewsCompleted]);

  useEffect(() => {
    localStorage.setItem('roadmapsCompleted', String(roadmapsCompleted));
  }, [roadmapsCompleted]);

  // Sync calculated metrics to user profile when analytics update
  useEffect(() => {
    const streakInfo = calculateStreak(activityDates);
    setUser(prev => {
      if (
        prev.streak === streakInfo.currentStreak &&
        prev.solvedCount === analytics.problemsSolvedCount &&
        prev.accuracy === analytics.overallAccuracyPercent
      ) {
        return prev;
      }
      return {
        ...prev,
        streak: streakInfo.currentStreak,
        solvedCount: analytics.problemsSolvedCount,
        accuracy: analytics.overallAccuracyPercent
      };
    });
  }, [analytics.problemsSolvedCount, analytics.overallAccuracyPercent, activityDates]);

  // Views Router
  const [currentView, setView] = useState<ViewType>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // View container ref for smooth positioning
  const mainScrollRef = useRef<HTMLElement>(null);

  // Dynamic Editor configs passed from other pages
  const [editorCode, setEditorCode] = useState<string>('');
  const [editorLanguage, setEditorLanguage] = useState<string>('');
  const [editorProblemId, setEditorProblemId] = useState<string>('');

  // Scroll to top on view changes
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentView]);

  // Interactive Practice filters passed from other pages
  const [practiceTopicFilter, setPracticeTopicFilter] = useState<string>('All Topics');
  const [practiceProblemId, setPracticeProblemId] = useState<string | undefined>(undefined);

  // Conversations History
  const [chatMessages, setChatMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [isChatGenerating, setIsChatGenerating] = useState(false);
  const [workspaceContext, setWorkspaceContext] = useState<WorkspaceContext | null>(null);
  const chatControllerRef = useRef<AbortController | null>(null);

  // Recent Activity Timeline logs for UI
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('recentActivity');
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Settings states
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [accentColor, setAccentColor] = useState<string>('teal');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('themeMode') as 'dark' | 'light') || 'dark';
  });

  // Custom in-app notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  
  // Offline connection tracker
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Sync to localStorages
  useEffect(() => {
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('recentActivity', JSON.stringify(recentActivity));
  }, [recentActivity]);

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    if (themeMode === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    }
  }, [themeMode]);

  // Online / offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Dispatcher for visual toast notifications
  const triggerNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Auth logins
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (emailInput.trim()) {
      const extractedName = emailInput.split('@')[0];
      const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
      
      setUser(prev => ({
        ...prev,
        name: formattedName,
        email: emailInput
      }));
    }

    setIsLoggedIn(true);
    triggerNotification('Successfully signed in. Welcome to Mentor.AI!');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    triggerNotification('Signed out successfully.', 'info');
  };

  /**
   * CENTRAL SYSTEM ENGINE: Records user activity, updates central tracking, and recomputes stats
   */
  const recordUserCentralActivity = (record: Omit<UserActivityRecord, 'activityId' | 'userId' | 'timestamp'>) => {
    const todayStr = getTodayDateString();

    // 1. Record today's activity date for streak calculation
    let updatedDates = [...activityDates];
    if (!updatedDates.includes(todayStr)) {
      updatedDates.push(todayStr);
      setActivityDates(updatedDates);
    }

    const streakInfo = calculateStreak(updatedDates);

    // 2. Build full Activity Record
    const fullRecord: UserActivityRecord = {
      ...record,
      activityId: Math.random().toString(),
      userId: user.email || 'user-1',
      timestamp: Date.now()
    };

    const newActivities = [fullRecord, ...activities];
    setActivities(newActivities);
    saveActivities(newActivities);

    // 3. Compute updated total XP
    const newTotalXp = user.xp + record.xpEarned;

    // 4. Update Recent Activity Log list for UI timeline
    const uiLog: ActivityLog = {
      id: fullRecord.activityId,
      type: record.type === 'problem' ? 'solved' : record.type,
      title: record.itemTitle,
      description: `${record.type.toUpperCase()} • ${record.topic} • ${record.result === 'success' ? 'Completed' : 'Attempted'}`,
      timestamp: 'Just now',
      xpEarned: record.xpEarned
    };
    setRecentActivity(prev => [uiLog, ...prev.slice(0, 7)]);

    // 5. Check and unlock milestone badges
    const milestoneResult = checkAndUnlockMilestones(
      {
        xp: newTotalXp,
        solvedCount: analytics.problemsSolvedCount + (record.type === 'problem' && record.result === 'success' ? 1 : 0),
        streak: streakInfo.currentStreak,
        chatCount: chatCount + (record.type === 'chat' ? 1 : 0),
        interviewsCompleted: interviewsCompleted + (record.type === 'interview' ? 1 : 0),
        roadmapsCompleted: roadmapsCompleted + (record.type === 'roadmap' ? 1 : 0)
      },
      badges
    );

    if (milestoneResult.newlyUnlocked.length > 0) {
      setBadges(milestoneResult.updatedBadges);
      if (milestoneResult.totalBonusXp > 0) {
        setUser(prev => ({ ...prev, xp: prev.xp + milestoneResult.totalBonusXp }));
      }
      milestoneResult.newlyUnlocked.forEach(b => {
        triggerNotification(`🏆 Milestone Unlocked: "${b.title}"! (+${b.description})`, 'success');
      });
    }

    setUser(prev => ({
      ...prev,
      xp: newTotalXp,
      streak: streakInfo.currentStreak
    }));
  };

  // Daily Check-in handler
  const handleDailyCheckIn = () => {
    const todayStr = getTodayDateString();
    if (activityDates.includes(todayStr)) {
      triggerNotification('Daily streak already active today! Keep coding!', 'info');
      return;
    }

    recordUserCentralActivity({
      type: 'code',
      topic: 'Variables',
      category: 'Core Programming & Syntax',
      itemTitle: 'Daily Check-In Bonus',
      result: 'success',
      xpEarned: 50
    });

    triggerNotification('Daily check-in successful! Streak active (+50 XP)!');
  };

  // Reset Progress handler
  const handleResetProgress = () => {
    setActivities([]);
    saveActivities([]);

    setUser({
      name: 'Guest Developer',
      email: 'guest@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
      streak: 0,
      xp: 0,
      solvedCount: 0,
      accuracy: 0
    });

    setActivityDates([]);
    setRecentActivity([]);

    const resetBadgesList = BADGES.map(b => 
      b.id === 'badge-1' 
        ? { ...b, unlocked: true, unlockedAt: getTodayDateString() } 
        : { ...b, unlocked: false, unlockedAt: undefined }
    );
    setBadges(resetBadgesList);

    setChatCount(0);
    setInterviewsCompleted(0);
    setRoadmapsCompleted(0);

    localStorage.removeItem('userProfile');
    localStorage.removeItem('activityDates');
    localStorage.removeItem('recentActivity');
    localStorage.removeItem('badges');
    localStorage.removeItem('chatCount');
    localStorage.removeItem('interviewsCompleted');
    localStorage.removeItem('roadmapsCompleted');

    triggerNotification('Your progress, streak, XP, activity logs, and badges have been reset to empty state.', 'info');
  };

  // Seed sample test activity data handler
  const handleSeedTestData = () => {
    const testData = generateTestData();
    setActivities(testData);
    saveActivities(testData);

    const todayStr = getTodayDateString();
    setActivityDates([todayStr, getYesterdayDateString()]);
    triggerNotification('Sample activity data seeded! Progression matrices and mastery updated.', 'success');
  };

  // Problem solved callback
  const handleSolveProblem = (problemId: string, problemTitle: string, difficulty: 'Easy' | 'Medium' | 'Hard', topic: string = 'Arrays') => {
    const xpTable = { Easy: 100, Medium: 150, Hard: 250 };
    const category = TOPIC_CATEGORY_MAP[topic] || 'Data Structures & Algorithms';

    const isAlreadySolved = activities.some(
      a => a.type === 'problem' && a.itemId === problemId && a.result === 'success'
    );

    const xp = isAlreadySolved ? 0 : (xpTable[difficulty] || 100);

    recordUserCentralActivity({
      type: 'problem',
      topic,
      category,
      itemId: problemId,
      itemTitle: `Solved "${problemTitle}"`,
      difficulty,
      result: 'success',
      xpEarned: xp
    });

    if (isAlreadySolved) {
      triggerNotification(`Problem Verified! All test cases passed. (Already solved previously)`, 'info');
    } else {
      triggerNotification(`Problem Solved! +${xp} XP gained!`, 'success');
    }
  };

  // Problem submission failed callback
  const handleProblemSubmissionFailed = (problemId: string, problemTitle: string, difficulty: 'Easy' | 'Medium' | 'Hard', topic: string = 'Arrays') => {
    const category = TOPIC_CATEGORY_MAP[topic] || 'Data Structures & Algorithms';

    recordUserCentralActivity({
      type: 'problem',
      topic,
      category,
      itemId: problemId,
      itemTitle: `Attempted "${problemTitle}"`,
      difficulty,
      result: 'failed',
      xpEarned: 0
    });
  };

  // Code editor execution callback
  const handleRunCodeInEditor = (language: string, topic: string = 'Functions') => {
    const category = TOPIC_CATEGORY_MAP[topic] || 'Core Programming & Syntax';

    recordUserCentralActivity({
      type: 'code',
      topic,
      category,
      itemTitle: `Executed ${language} Workspace Code`,
      result: 'success',
      xpEarned: 15
    });
  };

  // Roadmap node completed callback
  const handleRoadmapNodeCompleted = (xpReward: number, nodeTitle: string, topic: string = 'Variables') => {
    const category = TOPIC_CATEGORY_MAP[topic] || 'Core Programming & Syntax';

    setRoadmapsCompleted(prev => prev + 1);
    recordUserCentralActivity({
      type: 'roadmap',
      topic,
      category,
      itemTitle: `Completed Roadmap Module: ${nodeTitle}`,
      result: 'success',
      xpEarned: xpReward
    });

    triggerNotification(`Roadmap Module Completed! +${xpReward} XP gained!`);
  };

  // Mock interview completed callback
  const handleInterviewCompleted = (
    score: number, 
    company: string, 
    role: string, 
    topic: string = 'Data Structures & Algorithms',
    difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium'
  ) => {
    const category = TOPIC_CATEGORY_MAP[topic] || 'Data Structures & Algorithms';
    const xpEarned = Math.round(score * 1.5);
    const result = score >= 60 ? 'success' : 'failed';

    setInterviewsCompleted(prev => prev + 1);
    recordUserCentralActivity({
      type: 'interview',
      topic,
      category,
      itemTitle: `${company} Mock Interview (${role})`,
      difficulty,
      result,
      score,
      xpEarned
    });

    triggerNotification(`Mock Interview Evaluated (${score}/100)! +${xpEarned} XP!`);
  };

  // Send message to Express API backend
  const handleSendChatMessage = async (content: string, attachments?: any[]) => {
    if (isChatGenerating) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments
    };

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setIsChatGenerating(true);

    const controller = new AbortController();
    chatControllerRef.current = controller;

    try {
      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: updatedMessages,
          context: workspaceContext || undefined 
        }),
        signal: controller.signal
      });
      const data = await response.json();

      const assistantMsg: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: data.content || 'I could not generate a response.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, assistantMsg]);
      setChatCount(prev => prev + 1);

      recordUserCentralActivity({
        type: 'chat',
        topic: 'Functions',
        category: 'Core Programming & Syntax',
        itemTitle: `AI Mentor Consultation`,
        result: 'success',
        xpEarned: 10
      });

    } catch (err: any) {
      if (err.name === 'AbortError') return;

      const fallbackMsg: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: `Service Notice: Could not connect to Mentor AI backend (${err.message || 'Timeout'}). Please check your network connection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsChatGenerating(false);
    }
  };

  const handleRegenerateLastResponse = async () => {
    if (chatMessages.length === 0 || isChatGenerating) return;
    const lastUserMsgIndex = [...chatMessages].reverse().findIndex(m => m.role === 'user');
    if (lastUserMsgIndex !== -1) {
      const targetIndex = chatMessages.length - 1 - lastUserMsgIndex;
      const lastUserContent = chatMessages[targetIndex].content;
      const trimmedMessages = chatMessages.slice(0, targetIndex);
      setChatMessages(trimmedMessages);
      await handleSendChatMessage(lastUserContent);
    }
  };

  const handleClearChatHistory = () => {
    setChatMessages([]);
    triggerNotification('Chat conversation history cleared.', 'info');
  };

  const handleStopChatGeneration = () => {
    if (chatControllerRef.current) {
      chatControllerRef.current.abort();
      setIsChatGenerating(false);
      triggerNotification('AI generation stopped.', 'info');
    }
  };

  const handleLoadProblemToWorkspace = (code: string, language: string, problemId?: string) => {
    setEditorCode(code);
    setEditorLanguage(language);
    setEditorProblemId(problemId || '');
    setView('editor');
    triggerNotification('Problem template loaded into Workspace!');

    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    requestAnimationFrame(() => {
      const workspaceEl = document.getElementById('coding-workspace');
      if (workspaceEl) {
        workspaceEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      const editorTextarea = document.getElementById('workspace-code-editor') as HTMLTextAreaElement | null;
      if (editorTextarea) {
        editorTextarea.focus({ preventScroll: true });
      }
    });
  };

  const handleNavigateToPracticeWithTopic = (topicName?: string, problemId?: string) => {
    if (topicName) {
      setPracticeTopicFilter(topicName);
    }
    setPracticeProblemId(problemId);
    setView('practice');
  };

  const handleAskAIMentorWithTopic = (topicName: string, promptText?: string) => {
    const prompt = promptText || `Could you explain the core concepts, common patterns, and key pitfalls for ${topicName}?`;
    setView('chat');
    handleSendChatMessage(prompt);
  };

  const handleWorkspaceContextChange = useCallback((ctx: WorkspaceContext | null) => {
    setWorkspaceContext(ctx);
  }, []);

  // View switch renderer
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView 
            user={user} 
            recentActivity={recentActivity} 
            setView={setView} 
            setPracticeFilter={setPracticeTopicFilter}
            activityDates={activityDates}
            badges={badges}
            onDailyCheckIn={handleDailyCheckIn}
            topicStatsMap={topicStatsMap}
            analytics={analytics}
          />
        );
      case 'chat':
        return (
          <AIChatView 
            messages={chatMessages}
            sendMessage={handleSendChatMessage}
            regenerateLastResponse={handleRegenerateLastResponse}
            clearChat={handleClearChatHistory}
            isGenerating={isChatGenerating}
            stopGeneration={handleStopChatGeneration}
            user={user}
            workspaceContext={workspaceContext}
            onClearWorkspaceContext={() => setWorkspaceContext(null)}
            onOpenWorkspace={() => setView('editor')}
          />
        );
      case 'editor':
        return (
          <CodeEditorView 
            initialCode={editorCode} 
            initialLanguage={editorLanguage} 
            initialProblemId={editorProblemId}
            accentColor={accentColor}
            onRunCode={handleRunCodeInEditor}
            onSolveProblem={handleSolveProblem}
            onSubmissionFailed={handleProblemSubmissionFailed}
            onBackToProblems={() => setView('practice')}
            onWorkspaceContextChange={handleWorkspaceContextChange}
            onOpenAIChatWithContext={() => setView('chat')}
          />
        );
      case 'practice':
        return (
          <PracticeProblemsView 
            activities={activities}
            onLoadToEditor={handleLoadProblemToWorkspace} 
            initialTopicFilter={practiceTopicFilter}
            initialProblemId={practiceProblemId}
            onClearInitialProblem={() => setPracticeProblemId(undefined)}
            onSolveProblem={handleSolveProblem}
          />
        );
      case 'roadmaps':
        return (
          <LearningRoadmapView 
            onNodeCompleted={handleRoadmapNodeCompleted}
            onNavigateToPractice={handleNavigateToPracticeWithTopic}
            onAskAIMentor={handleAskAIMentorWithTopic}
            topicStatsMap={topicStatsMap}
            problems={activities}
          />
        );
      case 'interview':
        return (
          <MockInterviewView 
            onInterviewCompleted={handleInterviewCompleted}
            onNavigateToPractice={handleNavigateToPracticeWithTopic}
            onNavigateToRoadmap={() => setView('roadmaps')}
          />
        );
      case 'progress':
        return (
          <ProgressDashboardView 
            user={user} 
            activityDates={activityDates}
            badges={badges}
            recentActivity={recentActivity}
            activities={activities}
            onDailyCheckIn={handleDailyCheckIn}
            topicStatsMap={topicStatsMap}
            analytics={analytics}
            onNavigateToPractice={handleNavigateToPracticeWithTopic}
          />
        );
      case 'settings':
        return (
          <SettingsView
            user={user}
            setUser={setUser}
            fontSize={fontSize}
            setFontSize={setFontSize}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            onResetProgress={handleResetProgress}
            onSeedTestData={handleSeedTestData}
          />
        );
      default:
        return (
          <DashboardView 
            user={user} 
            recentActivity={recentActivity} 
            setView={setView} 
            topicStatsMap={topicStatsMap}
            analytics={analytics}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${themeMode === 'light' ? 'light-theme bg-slate-50 text-slate-900' : 'dark-theme bg-[#09090b] text-zinc-200'}`}>
      
      {/* Visual notification toasts */}
      {notification && (
        <div id="toast-notification" className="fixed top-6 right-6 z-50 animate-fade-in flex items-center gap-2 px-4 py-3 bg-[#121214] border border-white/5 rounded-xl shadow-2xl shadow-black/80">
          <CheckCircle className={`w-4 h-4 ${notification.type === 'success' ? 'text-indigo-400' : 'text-blue-400'}`} />
          <span className="text-xs font-semibold text-zinc-200">{notification.message}</span>
        </div>
      )}

      {/* Online / Offline status indicator */}
      {!isOnline && (
        <div id="offline-indicator" className="bg-rose-500/10 border-b border-rose-500/20 px-4 py-1.5 flex items-center justify-center gap-2 text-rose-400 text-[10px] font-mono uppercase tracking-widest font-bold z-50 shrink-0">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Mode. Interactive simulations will run locally.</span>
        </div>
      )}

      {/* Authentication Layout */}
      {!isLoggedIn ? (
        <div className="flex-1 flex flex-col lg:flex-row min-h-screen bg-[#09090b]">
          
          {/* Left illustration marketing pane */}
          <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-[#121214] border-r border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-24 translate-x-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-24 -translate-x-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

            {/* Top Logo */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">
                Mentor.AI
              </span>
            </div>

            {/* Center graphic */}
            <div className="space-y-6 relative z-10 max-w-lg">
              <div className="p-4 bg-[#0d0d0f]/80 border border-white/5 rounded-2xl">
                <div className="flex gap-1.5 pb-2 border-b border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <pre className="text-xs font-mono text-zinc-400 p-2 leading-relaxed">
                  <code>{`// Level up your software engineering
const mentor = new AICodingMentor();
await mentor.analyzeComplexity(userCode);
// output: "Successfully optimized to O(N) Time!"`}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h2 className="font-display font-bold text-3xl text-zinc-100 tracking-tight leading-tight">
                  Develop clean code with an <br />
                  <span className="bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">AI companion</span> at your side.
                </h2>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Join millions of students solving real-world arrays, linked list structures, and preparing for tech interviews using smart LLM grading feedback loops.
                </p>
              </div>
            </div>

            {/* Footer metrics */}
            <div className="flex gap-8 text-xs font-mono text-zinc-500 relative z-10">
              <div>
                <span className="block font-bold text-zinc-300">150+</span>
                <span>Practice Challenges</span>
              </div>
              <div>
                <span className="block font-bold text-zinc-300">10+</span>
                <span>Personalized Paths</span>
              </div>
              <div>
                <span className="block font-bold text-zinc-300">100%</span>
                <span>Gemini Core Grounding</span>
              </div>
            </div>
          </div>

          {/* Right Login setup pane */}
          <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
            {/* Mobile Header Logo */}
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">
                Mentor.AI
              </span>
            </div>

            <div className="w-full max-w-sm space-y-6">
              <div className="space-y-2 text-center lg:text-left">
                <h3 className="font-display font-bold text-2xl text-zinc-100 tracking-tight">Create your account</h3>
                <p className="text-zinc-400 text-xs">Unlock mock interview sessions, custom workspace compiling, and streaks.</p>
              </div>

              <div className="space-y-3.5">
                {/* REAL GOOGLE OAUTH BUTTON */}
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      if (!credentialResponse.credential) return;

                      try {
                        const res = await fetch('/api/auth/google', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ token: credentialResponse.credential }),
                        });

                        const data = await res.json();
                        if (data.success) {
                          setUser({
                            name: data.user.name || 'User',
                            email: data.user.email || '',
                            avatar: data.user.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
                            streak: 1,
                            xp: 50,
                            solvedCount: 0,
                            accuracy: 100
                          });
                          setIsLoggedIn(true);
                          triggerNotification(`Welcome ${data.user.name}!`);
                        } else {
                          triggerNotification('Google Sign-In failed on backend.', 'info');
                        }
                      } catch (err) {
                        triggerNotification('Connection error during Google Sign-In.', 'info');
                      }
                    }}
                    onError={() => {
                      triggerNotification('Google Sign-In was cancelled or failed.', 'info');
                    }}
                  />
                </div>

                {/* Simulated Github SSO */}
                <button
                  id="login-sso-github"
                  onClick={() => handleLogin()}
                  className="w-full py-3 px-4 bg-[#121214] hover:bg-zinc-800 border border-white/5 text-zinc-300 hover:text-zinc-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
                >
                  <Github className="w-4 h-4 shrink-0" />
                  <span>Continue with GitHub</span>
                </button>
              </div>

              {/* Or separator block */}
              <div className="flex items-center gap-3 text-zinc-600 text-[10px] font-mono uppercase tracking-widest">
                <div className="flex-1 h-px bg-white/5" />
                <span>Or use email</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              {/* Interactive Email logins block */}
              {isEmailLogin ? (
                <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <input
                        id="login-email-input"
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="ayaan@example.com"
                        className="w-full bg-[#0d0d0f] border border-white/5 hover:border-zinc-800 focus:border-indigo-500 text-xs py-2.5 pl-8 pr-3 rounded-xl outline-none"
                      />
                      <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <input
                        id="login-password-input"
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#0d0d0f] border border-white/5 hover:border-zinc-800 focus:border-indigo-500 text-xs py-2.5 pl-8 pr-3 rounded-xl outline-none"
                      />
                      <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  <button
                    id="login-email-submit"
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                </form>
              ) : (
                <button
                  id="login-toggle-email-flow"
                  onClick={() => setIsEmailLogin(true)}
                  className="w-full py-2.5 border border-white/5 hover:border-white/10 text-xs font-semibold text-zinc-400 hover:text-zinc-200 rounded-xl transition-all cursor-pointer"
                >
                  Sign in with password
                </button>
              )}

              <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
                By continuing you accept Mentor AI's <span className="underline cursor-pointer hover:text-zinc-400">Terms of Service</span> & <span className="underline cursor-pointer hover:text-zinc-400">Privacy Policy</span>.
              </p>
            </div>
          </div>

        </div>
      ) : (
        /* Authenticated Main Web App Layout */
        <div className="flex-1 flex overflow-hidden h-screen">
          
          {/* Main Desktop Navigation Sidebar */}
          <Sidebar 
            currentView={currentView} 
            setView={setView} 
            user={user} 
            logout={handleLogout} 
            accentColor={accentColor}
            isOpen={isMobileSidebarOpen}
            setIsOpen={setIsMobileSidebarOpen}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
          />

          {/* Main Content Viewport */}
          <div className="flex-1 flex flex-col overflow-hidden relative bg-[#09090b]">
            
            {/* Top Bar for Mobile & User Quick Info */}
            <div className="lg:hidden px-4 py-3 bg-[#121214] border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-display font-bold text-sm text-zinc-200">Mentor.AI</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-orange-400 font-bold text-xs bg-orange-500/10 px-2 py-1 rounded-full">
                  <Flame className="w-3.5 h-3.5 fill-orange-500/20" />
                  <span>{user.streak}d</span>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="p-2 text-zinc-400 hover:text-zinc-200 rounded-lg cursor-pointer"
                >
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* View container */}
            <main 
              ref={mainScrollRef}
              id="main-scroll-container"
              className={`flex-1 max-w-7xl mx-auto w-full transition-all ${
                currentView === 'editor' 
                  ? 'p-2 sm:p-3 lg:p-4 h-full flex flex-col min-h-0 overflow-hidden' 
                  : currentView === 'chat'
                  ? 'p-2 sm:p-4 lg:p-5 h-full flex flex-col min-h-0 overflow-hidden'
                  : 'p-4 md:p-8 overflow-y-auto'
              }`}
            >
              {renderCurrentView()}
            </main>

            {/* Mobile Bottom Navigation Bar */}
            <MobileNav 
              currentView={currentView} 
              setView={setView} 
              openSidebar={() => setIsMobileSidebarOpen(true)}
            />

          </div>

        </div>
      )}

    </div>
  );
}