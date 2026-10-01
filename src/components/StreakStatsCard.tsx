import React from 'react';
import { OverallStreakStats } from '../types/dashboard';
import { Flame, Calendar, CheckSquare, Clock, GraduationCap } from 'lucide-react';

interface StreakStatsCardProps {
  streaks: OverallStreakStats;
  examsCompletedCount: number;
}

export const StreakStatsCard: React.FC<StreakStatsCardProps> = ({
  streaks,
  examsCompletedCount,
}) => {
  const totalHours = (streaks.totalStudyMinutes / 60).toFixed(1);

  return (
    <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#D32F2F] dark:text-[#EF4444] block">
            Academic Consistency System
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#171717] dark:text-white flex items-center gap-2 font-mono">
              <span className="p-1 rounded-lg bg-[#FFF1F1] dark:bg-[#EF4444]/15">
                <Flame className="w-6 h-6 text-[#D32F2F] dark:text-[#EF4444] fill-[#D32F2F] dark:fill-[#EF4444]" />
              </span>
              {streaks.currentStreak} DAY STREAK
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#A3A3A3] block">Personal Best</span>
          <span className="text-sm font-bold font-mono text-[#171717] dark:text-white">
            {streaks.bestStreak} Days
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#1F1F1F] border border-[#E5E7EB] dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-[#6B7280] dark:text-[#A3A3A3] text-[11px] font-semibold mb-1">
            <Clock className="w-3.5 h-3.5 text-[#D32F2F] dark:text-[#EF4444]" />
            <span>Study Hours</span>
          </div>
          <span className="text-xl font-black font-mono tracking-tight text-[#171717] dark:text-white tabular-nums">
            {totalHours}h
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#1F1F1F] border border-[#E5E7EB] dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-[#6B7280] dark:text-[#A3A3A3] text-[11px] font-semibold mb-1">
            <GraduationCap className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Exams Done</span>
          </div>
          <span className="text-xl font-black font-mono tracking-tight text-[#171717] dark:text-white tabular-nums">
            {examsCompletedCount} / 10
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#1F1F1F] border border-[#E5E7EB] dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-[#6B7280] dark:text-[#A3A3A3] text-[11px] font-semibold mb-1">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
            <span>Missions Done</span>
          </div>
          <span className="text-xl font-black font-mono tracking-tight text-[#171717] dark:text-white tabular-nums">
            {streaks.tasksCompleted}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#1F1F1F] border border-[#E5E7EB] dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-[#6B7280] dark:text-[#A3A3A3] text-[11px] font-semibold mb-1">
            <Calendar className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
            <span>Study Days</span>
          </div>
          <span className="text-xl font-black font-mono tracking-tight text-[#171717] dark:text-white tabular-nums">
            {streaks.totalStudyDays}
          </span>
        </div>
      </div>
    </div>
  );
};
