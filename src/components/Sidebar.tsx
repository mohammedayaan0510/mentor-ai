import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Code, 
  BookOpen, 
  Compass, 
  Award, 
  Sparkles, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Cpu, 
  TrendingUp, 
  ShieldAlert,
  Moon,
  Sun
} from 'lucide-react';
import { ViewType, UserProfile } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  user: UserProfile;
  logout: () => void;
  accentColor: string;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  themeMode?: 'dark' | 'light';
  setThemeMode?: (mode: 'dark' | 'light') => void;
}

export default function Sidebar({ currentView, setView, user, logout, accentColor, isOpen: externalIsOpen, setIsOpen: externalSetIsOpen, themeMode, setThemeMode }: SidebarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen || setInternalIsOpen;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'practice', label: 'Practice Problems', icon: BookOpen },
    { id: 'editor', label: 'Code Editor', icon: Code },
    { id: 'roadmaps', label: 'Learning Roadmaps', icon: Compass },
    { id: 'interview', label: 'Mock Interview', icon: Cpu },
    { id: 'progress', label: 'Progress & Skill', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden h-16 bg-[#121214] border-b border-white/5 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">
            Mentor.AI
          </span>
        </div>
        <button 
          id="mobile-menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          id="sidebar-overlay"
          className="lg:hidden fixed inset-0 bg-[#09090b]/80 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#121214] border-r border-white/5 flex flex-col justify-between transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen
        ${isOpen ? 'translate-x-0 pt-16 lg:pt-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Logo (hidden on mobile header space) */}
        <div className="hidden lg:flex items-center gap-3 p-6 border-b border-white/5">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">
              Mentor.AI
            </h1>
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">Coding Companion</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                id={`sidebar-item-${item.id}`}
                key={item.id}
                onClick={() => {
                  setView(item.id as ViewType);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive 
                    ? 'bg-[#0d0d0f] text-indigo-400 border border-white/5 glow-indigo shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-white/5 bg-[#09090b]/40">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-800/20 border border-white/5 mb-3">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80'} 
              alt={user.name} 
              className="w-10 h-10 rounded-xl object-cover border border-white/5"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-zinc-200 truncate">{user.name}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Level 12 • {user.streak}🔥</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              id="sidebar-logout-btn"
              onClick={logout}
              className="flex-1 flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>

            {setThemeMode && (
              <button
                id="sidebar-theme-toggle"
                onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
                title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}
                className="p-2 rounded-xl text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 border border-white/5 transition-all duration-200 cursor-pointer"
              >
                {themeMode === 'light' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
