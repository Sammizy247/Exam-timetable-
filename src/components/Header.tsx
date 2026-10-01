import React, { useState } from 'react';
import { AppSettings } from '../types/dashboard';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Moon, Sun, Smartphone, Calendar } from 'lucide-react';

interface HeaderProps {
  settings: AppSettings;
  effectiveDate: Date;
  greeting: string;
  operationalMode: string;
  onUpdateSettings: (settings: AppSettings) => void;
  onOpenDateSimulation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  effectiveDate,
  greeting,
  operationalMode,
  onUpdateSettings,
  onOpenDateSimulation,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const toggleDarkMode = () => {
    onUpdateSettings({
      ...settings,
      darkMode: !settings.darkMode,
    });
  };

  const formattedDate = effectiveDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = effectiveDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const isSimulated = !!settings.simulatedDate;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#141414]/95 text-[#171717] dark:text-white backdrop-blur-md border-b border-[#E5E7EB] dark:border-neutral-800 transition-colors shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Top bar contract: Brand, Status, Actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-black tracking-tight text-[#171717] dark:text-white flex items-center gap-2 truncate">
              <span className="w-3 h-3 rounded-full bg-[#D32F2F] dark:bg-[#EF4444] shrink-0 shadow-xs shadow-red-500/50" />
              MY EXAM COMMAND CENTER
            </h1>
            <p className="text-[11px] sm:text-xs text-[#6B7280] dark:text-[#A3A3A3] font-medium truncate">
              Exam Mode — Focus. Prepare. Execute.
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Install PWA Button if available */}
            {isInstallable && !isInstalled && (
              <button
                onClick={install}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white rounded-lg transition-all active:scale-[0.98] shadow-sm whitespace-nowrap"
                title="Install app for offline exam access"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}

            {isIOS && !isInstalled && (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#171717] dark:text-white bg-[#F8F8F8] dark:bg-[#1F1F1F] hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-[#E5E7EB] dark:border-neutral-700 rounded-lg transition-colors"
                title="Add to Home Screen instructions"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#D32F2F] dark:text-[#EF4444]" />
                <span className="hidden sm:inline">Install</span>
              </button>
            )}

            {/* Simulated Date Quick Trigger */}
            {onOpenDateSimulation && (
              <button
                onClick={onOpenDateSimulation}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                  isSimulated
                    ? 'bg-[#FFF1F1] dark:bg-[#EF4444]/15 text-[#D32F2F] dark:text-[#EF4444] border border-[#D32F2F]/30'
                    : 'text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-white hover:bg-[#F8F8F8] dark:hover:bg-[#1F1F1F]'
                }`}
                title="Configure date simulation / live device time"
              >
                <Calendar className="w-4 h-4" />
                {isSimulated && <span className="text-[10px] hidden md:inline font-bold">Simulated</span>}
              </button>
            )}

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-white hover:bg-[#F8F8F8] dark:hover:bg-[#1F1F1F] transition-colors"
              title={settings.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle color theme"
            >
              {settings.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="mt-2.5 pt-2 border-t border-[#E5E7EB] dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#171717] dark:text-white uppercase tracking-wider text-[11px]">
              {greeting}, {settings.userName}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="text-[#6B7280] dark:text-[#A3A3A3] font-medium">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2 font-mono tabular-nums text-[#6B7280] dark:text-[#A3A3A3]">
            <span>{formattedTime}</span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span
              className={`font-bold tracking-wider text-[11px] ${
                operationalMode === 'EXAM_PRIORITY_MODE'
                  ? 'text-[#D32F2F] dark:text-[#EF4444]'
                  : operationalMode === 'IN_PROGRESS'
                  ? 'text-emerald-600 dark:text-emerald-400 animate-pulse'
                  : 'text-[#171717] dark:text-neutral-200'
              }`}
            >
              {operationalMode === 'EXAM_PRIORITY_MODE'
                ? 'EXAM PRIORITY MODE'
                : operationalMode === 'IN_PROGRESS'
                ? 'EXAM IN PROGRESS'
                : 'EXAM MODE ACTIVE'}
            </span>
          </div>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-[#171717] dark:text-white">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#181818] p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-5 h-5 text-[#D32F2F] dark:text-[#EF4444]" />
              <h3 className="text-base font-bold">Install on iPhone / iPad</h3>
            </div>
            <p className="text-xs text-[#666666] dark:text-[#A3A3A3] leading-relaxed mb-4">
              1. Tap the <strong className="text-[#171717] dark:text-white">Share</strong> button in the Safari toolbar.<br />
              2. Scroll down and tap <strong className="text-[#171717] dark:text-white">Add to Home Screen</strong>.<br />
              3. Tap <strong className="text-[#171717] dark:text-white">Add</strong> to launch the Exam Command Center as a standalone app.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white font-bold text-xs transition active:scale-[0.98]"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
