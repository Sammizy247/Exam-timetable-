import React from 'react';
import { Calendar, RotateCcw } from 'lucide-react';

interface DateSimulatorBannerProps {
  isSimulated: boolean;
  dateDisplay: string;
  onResetToLive: () => void;
  onSelectDate: (iso: string) => void;
}

export const DateSimulatorBanner: React.FC<DateSimulatorBannerProps> = ({
  isSimulated,
  dateDisplay,
  onResetToLive,
  onSelectDate,
}) => {
  if (!isSimulated) return null;

  return (
    <aside aria-label="Date preview mode" className="bg-[#FFF1F1] dark:bg-[#1C1212] border-b border-[#D32F2F]/25 dark:border-[#EF4444]/30 text-[#D32F2F] dark:text-[#EF4444] text-xs px-4 py-2 transition-colors">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#D32F2F] dark:text-[#EF4444] shrink-0" />
          <span className="font-semibold text-[#171717] dark:text-neutral-200">
            <strong className="text-[#D32F2F] dark:text-[#EF4444]">Preview Mode:</strong> Simulating {dateDisplay}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSelectDate('2026-10-01T08:00:00')}
            className="text-[11px] font-bold px-2 py-0.5 bg-white dark:bg-[#2A1818] border border-[#D32F2F]/30 rounded hover:bg-[#D32F2F]/10"
          >
            Oct 1
          </button>
          <button
            onClick={() => onSelectDate('2026-10-02T12:30:00')}
            className="text-[11px] font-bold px-2 py-0.5 bg-white dark:bg-[#2A1818] border border-[#D32F2F]/30 rounded hover:bg-[#D32F2F]/10"
          >
            Oct 2 (Exam)
          </button>
          <button
            onClick={onResetToLive}
            className="flex items-center gap-1 font-bold text-white px-2.5 py-0.5 bg-[#D32F2F] dark:bg-[#EF4444] rounded hover:opacity-90 ml-1 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Live Clock</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
