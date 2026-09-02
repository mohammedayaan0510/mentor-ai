import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  Code, 
  Compass, 
  Menu 
} from 'lucide-react';
import { ViewType } from '../types';

interface MobileNavProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  openSidebar: () => void;
}

export default function MobileNav({ currentView, setView, openSidebar }: MobileNavProps) {
  const primaryTabs: { id: ViewType; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'practice', label: 'Practice', icon: BookOpen },
    { id: 'editor', label: 'Code', icon: Code },
    { id: 'roadmaps', label: 'Roadmaps', icon: Compass },
  ];

  return (
    <nav 
      id="mobile-bottom-nav" 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121214]/95 backdrop-blur-md border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl"
    >
      {primaryTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentView === tab.id;
        return (
          <button
            id={`mobile-tab-${tab.id}`}
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`
              flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl transition-all duration-200 cursor-pointer
              ${isActive 
                ? 'text-indigo-400 font-bold bg-indigo-500/10' 
                : 'text-zinc-500 hover:text-zinc-300'
              }
            `}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400 scale-110' : 'text-zinc-400'}`} />
            <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
          </button>
        );
      })}

      <button
        id="mobile-tab-more"
        onClick={openSidebar}
        className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
      >
        <Menu className="w-5 h-5 text-zinc-400" />
        <span className="text-[10px] tracking-tight mt-0.5">Menu</span>
      </button>
    </nav>
  );
}
