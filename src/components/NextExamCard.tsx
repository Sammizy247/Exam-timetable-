import React from 'react';
import { Exam } from '../types/dashboard';
import { Clock, MapPin, AlertCircle, ArrowRight, Play, CheckCircle2, Sparkles } from 'lucide-react';

interface NextExamCardProps {
  nextExam: (Exam & { status: string; computedPrep: number }) | undefined;
  inProgressExam: (Exam & { status: string; computedPrep: number }) | undefined;
  countdownDisplay: string;
  hoursRemaining: number;
  remainingCount: number;
  operationalMode: string;
  onStartStudyForSubject?: (subjectCode: string) => void;
  onViewSubjectDetails?: (examId: string) => void;
  onStudyWithAi?: (subjectCode: string) => void;
}

export const NextExamCard: React.FC<NextExamCardProps> = ({
  nextExam,
  inProgressExam,
  countdownDisplay,
  hoursRemaining,
  remainingCount,
  operationalMode,
  onStartStudyForSubject,
  onViewSubjectDetails,
  onStudyWithAi,
}) => {
  if (inProgressExam) {
    return (
      <div className="bg-white dark:bg-[#181818] border-2 border-emerald-500 rounded-2xl p-5 text-[#171717] dark:text-white shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            EXAM IN PROGRESS NOW
          </span>
          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
            Venue: {inProgressExam.venue}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-700 dark:text-emerald-400 mb-1 font-mono">
          {inProgressExam.code}
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 font-medium mb-3">
          {inProgressExam.title}
        </p>

        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-3 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold uppercase">Exam Window</p>
            <p className="text-xs font-mono font-semibold text-emerald-900 dark:text-emerald-100">
              {inProgressExam.startTime} – {inProgressExam.endTime}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold uppercase">Remaining</p>
            <p className="text-xs font-mono text-emerald-600 dark:text-emerald-300 font-black">{countdownDisplay}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!nextExam) {
    return (
      <div className="bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center text-[#171717] dark:text-white shadow-sm">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
        <h3 className="text-lg font-black tracking-tight">ALL EXAMINATIONS CONCLUDED</h3>
        <p className="text-xs text-[#666666] dark:text-neutral-400 mt-1">
          You have completed all 10 scheduled papers for the semester diet.
        </p>
      </div>
    );
  }

  const isUnder24Hours = hoursRemaining <= 24;

  return (
    <div
      className={`bg-white dark:bg-[#181818] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all overflow-hidden border ${
        isUnder24Hours
          ? 'border-[#D32F2F] dark:border-[#EF4444] ring-1 ring-[#D32F2F]/25'
          : 'border-[#E5E7EB] dark:border-neutral-800'
      }`}
    >
      {/* Top Red Brand Accent Line */}
      <div className="h-1.5 w-full bg-[#D32F2F] dark:bg-[#EF4444]" />

      {/* 24-Hour Urgent Banner if applicable */}
      {isUnder24Hours && (
        <div className="bg-[#FFF1F1] dark:bg-[#EF4444]/15 border-b border-[#D32F2F]/20 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#D32F2F] dark:text-[#EF4444] font-bold tracking-wider">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>EXAM PRIORITY MODE</span>
          </div>
          <span className="text-[11px] text-[#D32F2F] dark:text-[#EF4444] font-semibold">
            Academics first. Skills can wait.
          </span>
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Header Kicker */}
        <div className="flex items-center justify-between gap-2 text-xs font-bold tracking-wider mb-2">
          <span className="uppercase text-[#D32F2F] dark:text-[#EF4444] flex items-center gap-1.5 font-extrabold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#D32F2F] dark:bg-[#EF4444] animate-pulse" />
            NEXT EXAM
          </span>
          <span className="font-mono text-[#6B7280] dark:text-[#A3A3A3] text-[11px]">
            EXAMS REMAINING: <strong className="text-[#171717] dark:text-white font-bold">{remainingCount}</strong>
          </span>
        </div>

        {/* Main Course Lockup */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-3">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#D32F2F] dark:text-[#EF4444]">
              {nextExam.code}
            </h2>
            <p className="text-sm font-semibold text-[#171717] dark:text-neutral-200 mt-0.5">
              {nextExam.title}
            </p>
          </div>

          <div className="mt-2 sm:mt-0 text-left sm:text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#A3A3A3] block">
              Preparation
            </span>
            <span className="text-lg font-mono font-bold text-[#171717] dark:text-white">
              {nextExam.computedPrep}%
            </span>
          </div>
        </div>

        {/* Date, Time, Venue metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6B7280] dark:text-neutral-300 py-3 border-y border-[#E5E7EB] dark:border-neutral-800 my-3 font-medium">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D32F2F] dark:text-[#EF4444] shrink-0" />
            <span className="font-semibold text-[#171717] dark:text-neutral-200">
              {nextExam.displayDate}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span>{nextExam.startTime} – {nextExam.endTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D32F2F] dark:text-[#EF4444] shrink-0" />
            <span>Venue: <strong className="text-[#171717] dark:text-white">{nextExam.venue}</strong></span>
          </div>
        </div>

        {/* Prominent Live Countdown Box with subtle red tint */}
        <div className="rounded-xl p-4 bg-[#FFF1F1] dark:bg-[#1F1717] border border-[#D32F2F]/25 dark:border-[#EF4444]/30 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D32F2F] dark:text-[#EF4444] block">
              COUNTDOWN TO PAPER
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[#D32F2F] dark:text-[#EF4444] tabular-nums">
              {countdownDisplay}
            </span>
          </div>

          {isUnder24Hours ? (
            <div className="text-xs text-[#D32F2F] dark:text-[#EF4444] font-bold sm:text-right">
              Final Revision · Past Questions · Sleep Early
            </div>
          ) : (
            <div className="text-xs text-[#6B7280] dark:text-[#A3A3A3] sm:text-right font-medium">
              Deep study & past papers scheduled
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          {onStudyWithAi && (
            <button
              onClick={() => onStudyWithAi(nextExam.code)}
              className="flex-1 min-h-[44px] px-4 py-2.5 bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white rounded-xl font-bold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>STUDY {nextExam.code} WITH AI</span>
            </button>
          )}

          {onStartStudyForSubject && (
            <button
              onClick={() => onStartStudyForSubject(nextExam.code)}
              className="min-h-[44px] px-4 py-2.5 bg-white dark:bg-[#181818] border border-[#D32F2F] text-[#D32F2F] dark:border-[#EF4444] dark:text-[#EF4444] hover:bg-[#FFF1F1] dark:hover:bg-[#EF4444]/10 rounded-xl font-bold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Timer</span>
            </button>
          )}

          {onViewSubjectDetails && (
            <button
              onClick={() => onViewSubjectDetails(nextExam.id)}
              className="min-h-[44px] px-4 py-2.5 bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-700 text-[#171717] dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl font-bold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
              title="View syllabus topics and past questions"
            >
              <span>Syllabus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
