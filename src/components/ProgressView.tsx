import React from 'react';
import { DailyReflection, Exam, OverallStreakStats, StudySession } from '../types/dashboard';
import {
  Flame,
  Clock,
  TrendingUp,
  BookOpen,
} from 'lucide-react';

interface ProgressViewProps {
  streaks: OverallStreakStats;
  exams: Exam[];
  sessions: StudySession[];
  reflections: DailyReflection[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  streaks,
  exams,
  sessions,
  reflections,
}) => {
  // Aggregate study minutes per subject
  const subjectDistribution: Record<string, number> = {};
  exams.forEach((e) => {
    subjectDistribution[e.code] = 0;
  });
  sessions.forEach((s) => {
    subjectDistribution[s.subject] = (subjectDistribution[s.subject] || 0) + s.durationMinutes;
  });

  const totalMinutes = Object.values(subjectDistribution).reduce((a, b) => a + b, 0) || 1;
  const totalHours = (streaks.totalStudyMinutes / 60).toFixed(1);

  // Exams completed vs remaining
  const completedExamsCount = exams.filter((e) => {
    const endMs = new Date(e.endDateTime).getTime();
    return Date.now() > endMs;
  }).length;

  return (
    <div className="space-y-4">
      {/* Top Banner / Streaks Overview */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-6 border border-neutral-200/90 dark:border-neutral-800 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-[#171717] dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#D32F2F] dark:text-[#EF4444]" />
                <span>ACADEMIC PERFORMANCE & CONSISTENCY</span>
              </h2>
            </div>
            <p className="text-xs text-[#666666] dark:text-[#A3A3A3] mt-0.5 font-medium">
              Systematic tracking of verified hours, problem sets, and retention
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#FFF1F1] dark:bg-[#EF4444]/15 px-3 py-1.5 rounded-xl border border-[#D32F2F]/20 self-start sm:self-auto">
            <Flame className="w-4 h-4 text-[#D32F2F] dark:text-[#EF4444] fill-[#D32F2F] dark:fill-[#EF4444]" />
            <span className="text-xs font-mono font-bold text-[#D32F2F] dark:text-[#EF4444]">
              {streaks.currentStreak} Day Academic Streak
            </span>
          </div>
        </div>

        {/* 4 Core Pillars in Red & Neutral */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#1F1F1F] border border-[#E5E7EB] dark:border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-neutral-400 block mb-1">
              Focus Hours
            </span>
            <span className="text-2xl font-black font-mono text-[#D32F2F] dark:text-[#EF4444]">
              {totalHours}h
            </span>
            <span className="text-[10px] text-neutral-400 block mt-1 font-medium">Across all courses</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#1F1F1F] border border-[#E5E7EB] dark:border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-neutral-400 block mb-1">
              Exams Done
            </span>
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {completedExamsCount} / 10
            </span>
            <span className="text-[10px] text-neutral-400 block mt-1 font-medium">
              {10 - completedExamsCount} papers remaining
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#1F1F1F] border border-[#E5E7EB] dark:border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-neutral-400 block mb-1">
              Missions Done
            </span>
            <span className="text-2xl font-black font-mono text-[#171717] dark:text-white">
              {streaks.tasksCompleted}
            </span>
            <span className="text-[10px] text-neutral-400 block mt-1 font-medium">Priority tasks</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#1F1F1F] border border-[#E5E7EB] dark:border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-neutral-400 block mb-1">
              Best Streak
            </span>
            <span className="text-2xl font-black font-mono text-[#171717] dark:text-white">
              {streaks.bestStreak}d
            </span>
            <span className="text-[10px] text-neutral-400 block mt-1 font-medium">Academic record</span>
          </div>
        </div>
      </div>

      {/* Subject Study Time Distribution */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
              <h3 className="text-base font-black text-[#171717] dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D32F2F] dark:text-[#EF4444]" />
                <span>Time Distribution by Course</span>
              </h3>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5 font-medium">
              Align revision hours with upcoming paper deadlines
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {exams.map((e) => {
            const mins = subjectDistribution[e.code] || 0;
            const pct = Math.round((mins / totalMinutes) * 100);
            return (
              <div key={e.id} className="space-y-1 text-xs">
                <div className="flex justify-between items-center text-[#171717] dark:text-neutral-200">
                  <span className="font-bold font-mono">
                    <span className="text-[#D32F2F] dark:text-[#EF4444]">{e.code}</span>{' '}
                    <span className="text-[#6B7280] dark:text-neutral-400 font-sans font-normal ml-1">
                      ({e.title.slice(0, 24)}...)
                    </span>
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-[#6B7280] dark:text-[#A3A3A3]">
                    {mins}m ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-[#E5E7EB] dark:bg-[#222222] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D32F2F] dark:bg-[#EF4444] rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reflections Log Preview */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
          <h3 className="text-base font-black text-[#171717] dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#D32F2F] dark:text-[#EF4444]" />
            <span>Nightly Reflection Archive</span>
          </h3>
        </div>
        <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] font-medium">
          Saved self-awareness insights from the evening routine
        </p>

        {reflections.length === 0 ? (
          <div className="text-center py-6 text-xs text-neutral-400 border border-dashed border-[#E5E7EB] dark:border-neutral-800 rounded-xl">
            No reflections saved yet. Complete your first 9:00 PM reflection in the "More" section.
          </div>
        ) : (
          <div className="space-y-2.5">
            {reflections.slice(0, 5).map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-neutral-750 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-mono font-bold text-[#171717] dark:text-white">
                  <span className="text-[#D32F2F] dark:text-[#EF4444]">{r.date}</span>
                </div>
                {r.accomplished && (
                  <p className="text-[#171717] dark:text-neutral-200">
                    <strong className="text-neutral-500">Accomplished:</strong> {r.accomplished}
                  </p>
                )}
                {r.distracted && (
                  <p className="text-[#D32F2F] dark:text-[#EF4444]">
                    <strong className="text-neutral-500">Distraction:</strong> {r.distracted}
                  </p>
                )}
                {r.improveTomorrow && (
                  <p className="text-neutral-700 dark:text-neutral-300">
                    <strong className="text-neutral-500">Improve tomorrow:</strong> {r.improveTomorrow}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
