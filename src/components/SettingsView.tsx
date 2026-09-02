import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Key, 
  Trash2, 
  Volume2, 
  Cpu, 
  Moon, 
  Sun, 
  Eye, 
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  X
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  themeMode: 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
  onResetProgress?: () => void;
  onSeedTestData?: () => void;
}

export default function SettingsView({ 
  user, 
  setUser, 
  fontSize, 
  setFontSize, 
  accentColor, 
  setAccentColor,
  themeMode,
  setThemeMode,
  onResetProgress,
  onSeedTestData
}: SettingsViewProps) {

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(prev => ({ ...prev, name: e.target.value }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(prev => ({ ...prev, email: e.target.value }));
  };

  const accents = [
    { name: 'Indigo', value: 'indigo', bg: 'bg-indigo-600' },
    { name: 'Blue', value: 'blue', bg: 'bg-blue-500' },
    { name: 'Purple', value: 'purple', bg: 'bg-purple-500' },
    { name: 'Teal', value: 'teal', bg: 'bg-teal-500' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Banner tab */}
      <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        <h2 className="font-display font-bold text-xl text-zinc-100">Preferences & Settings</h2>
        <p className="text-zinc-400 text-xs mt-1 max-w-sm leading-relaxed">
          Manage your interface theme colors, adjust font scopes for the workspace, configure notification endpoints, and view account statuses.
        </p>
      </div>

      {/* Account Settings Panel */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-4">
        <h3 className="font-display font-bold text-sm text-zinc-200 flex items-center gap-2 border-b border-white/5 pb-3">
          <User className="w-4.5 h-4.5 text-indigo-400" />
          <span>Account Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">Full Name</label>
            <input
              id="settings-username-input"
              type="text"
              value={user.name}
              onChange={handleNameChange}
              className="w-full bg-[#0d0d0f] border border-white/5 hover:border-zinc-700/80 focus:border-indigo-500 transition-colors text-xs text-zinc-350 py-2.5 px-3 rounded-xl outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">Email Address</label>
            <input
              id="settings-email-input"
              type="email"
              value={user.email}
              onChange={handleEmailChange}
              className="w-full bg-[#0d0d0f] border border-white/5 hover:border-zinc-700/80 focus:border-indigo-500 transition-colors text-xs text-zinc-350 py-2.5 px-3 rounded-xl outline-none"
            />
          </div>
        </div>
      </div>

      {/* Custom Theme Settings Panel */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-5">
        <h3 className="font-display font-bold text-sm text-zinc-200 flex items-center gap-2 border-b border-white/5 pb-3">
          <Settings className="w-4.5 h-4.5 text-indigo-400" />
          <span>Workspace Preferences</span>
        </h3>

        {/* Visual appearance Mode */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-255 block">Appearance Mode</span>
            <span className="text-[10px] text-zinc-500 leading-none">Toggle light vs dark environment views</span>
          </div>

          <div className="flex bg-[#0d0d0f] border border-white/5 p-1 rounded-xl">
            <button
              id="settings-theme-dark"
              onClick={() => setThemeMode('dark')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${themeMode === 'dark' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
            <button
              id="settings-theme-light"
              onClick={() => setThemeMode('light')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${themeMode === 'light' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
          </div>
        </div>

        {/* Font size adjustments */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div>
            <span className="text-xs font-semibold text-zinc-255 block">Workspace Font Scale</span>
            <span className="text-[10px] text-zinc-500 leading-none">Adjust script sizes in the active editor box</span>
          </div>

          <div className="flex bg-[#0d0d0f] border border-white/5 p-1 rounded-xl">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                id={`settings-font-${size}`}
                key={size}
                onClick={() => setFontSize(size)}
                className={`
                  py-1.5 px-3 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer
                  ${fontSize === size 
                    ? 'bg-[#121214] text-indigo-400 border border-white/10 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300'
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Accent coloring selectors */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div>
            <span className="text-xs font-semibold text-zinc-255 block">Color Highlight Accent</span>
            <span className="text-[10px] text-zinc-500 leading-none">Choose color hues for highlight buttons</span>
          </div>

          <div className="flex gap-2">
            {accents.map((acc) => (
              <button
                id={`settings-accent-${acc.value}`}
                key={acc.value}
                onClick={() => setAccentColor(acc.value)}
                className={`
                  w-6 h-6 rounded-full ${acc.bg} transition-all relative flex items-center justify-center border-2 cursor-pointer
                  ${accentColor === acc.value ? 'border-zinc-200 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}
                `}
                title={`${acc.name} Accent`}
              >
                {accentColor === acc.value && (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications Controls Panel */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-4">
        <h3 className="font-display font-bold text-sm text-zinc-200 flex items-center gap-2 border-b border-white/5 pb-3">
          <Bell className="w-4.5 h-4.5 text-indigo-400" />
          <span>Notification Alerts</span>
        </h3>

        <div className="space-y-3.5 text-xs text-zinc-300">
          <div className="flex items-center justify-between">
            <span className="font-medium">Receive weekly activity summaries via email</span>
            <input type="checkbox" defaultChecked className="rounded bg-[#0d0d0f] border-white/5 text-indigo-500 focus:ring-0" />
          </div>
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <span className="font-medium">Sound effects on completing roadmaps</span>
            <input type="checkbox" defaultChecked className="rounded bg-[#0d0d0f] border-white/5 text-indigo-500 focus:ring-0" />
          </div>
        </div>
      </div>

      {/* Connection & Security Diagnostics stats */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-4">
        <h3 className="font-display font-bold text-sm text-zinc-200 flex items-center gap-2 border-b border-white/5 pb-3">
          <Key className="w-4.5 h-4.5 text-indigo-400" />
          <span>API Connection Diagnostics</span>
        </h3>

        <div className="flex items-center justify-between bg-[#0d0d0f]/60 border border-white/5 p-4 rounded-xl text-xs">
          <div className="space-y-0.5">
            <span className="text-zinc-300 font-semibold block">Gemini API Connection</span>
            <span className="text-[10px] text-zinc-500">Auto-resolved key bounds</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-bold text-[11px] font-mono">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Active Connected</span>
          </div>
        </div>
      </div>

      {/* Dangerous parameters section */}
      <div className="bg-rose-950/10 border border-rose-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="font-display font-bold text-sm text-rose-400 flex items-center gap-2">
          <Trash2 className="w-4.5 h-4.5" />
          <span>Testing & System Reset</span>
        </h3>
        
        <p className="text-zinc-400 text-xs leading-relaxed">
          Resetting user progress clears all active tracking, streaks, accumulated XP, activity logs, and unlocked milestone badges. Seed sample data to test dynamic matrix transitions.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {onSeedTestData && (
            <button
              id="settings-seed-test-data-btn"
              onClick={onSeedTestData}
              className="py-2.5 px-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Cpu className="w-4 h-4" />
              <span>Seed Sample Activity Data</span>
            </button>
          )}

          <button
            id="settings-reset-progress-btn"
            onClick={() => setShowResetConfirm(true)}
            className="py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#121214] border border-rose-500/30 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-zinc-300 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-zinc-100">Reset All Progress?</h3>
                <p className="text-xs text-zinc-400">This action is permanent and cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-[#0d0d0f] border border-white/5 p-3.5 rounded-xl">
              Are you sure you want to reset your account? This will clear your <strong className="text-rose-400">coding streak (0)</strong>, <strong className="text-rose-400">Total XP (0)</strong>, <strong className="text-rose-400">solved problems count</strong>, <strong className="text-rose-400">activity logs</strong>, and <strong className="text-rose-400">unlocked badges</strong>.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                id="cancel-reset-progress-btn"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-reset-progress-btn"
                onClick={() => {
                  if (onResetProgress) {
                    onResetProgress();
                  } else {
                    localStorage.clear();
                    window.location.reload();
                  }
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-rose-600/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Reset Progress</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
