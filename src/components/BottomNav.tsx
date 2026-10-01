import React from 'react';
import { Home, Calendar, Clock, BarChart3, MoreHorizontal, Sparkles } from 'lucide-react';

export type NavTab = 'home' | 'exams' | 'ai-study' | 'study' | 'progress' | 'more';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  examsRemaining: number;
}

interface TabConfig {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  examsRemaining,
}) => {
  const tabs: TabConfig[] = [
    { id: 'home', label: 'HOME', icon: Home },
    {
      id: 'exams',
      label: 'EXAMS',
      icon: Calendar,
      badge: examsRemaining > 0 ? examsRemaining : undefined,
    },
    { id: 'ai-study', label: 'AI STUDY', icon: Sparkles, badge: 'NEW' },
    { id: 'study', label: 'STUDY', icon: Clock },
    { id: 'progress', label: 'PROGRESS', icon: BarChart3 },
    { id: 'more', label: 'MORE', icon: MoreHorizontal },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#141414]/95 backdrop-blur-md border-t border-[#E5E7EB] dark:border-neutral-800 transition-colors shadow-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="max-w-xl mx-auto grid grid-cols-6 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                isActive
                  ? 'text-[#D32F2F] dark:text-[#EF4444] font-bold'
                  : 'text-[#6B7280] dark:text-neutral-400 hover:text-[#171717] dark:hover:text-white font-medium'
              }`}
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 bg-[#D32F2F] dark:bg-[#EF4444] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-wider mt-1 select-none font-semibold">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] dark:bg-[#EF4444] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
