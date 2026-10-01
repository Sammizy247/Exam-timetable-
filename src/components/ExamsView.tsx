import React, { useState } from 'react';
import { Exam, ExamStatus } from '../types/dashboard';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Plus,
  FileCheck,
  Check,
  Search,
} from 'lucide-react';

interface ExamsViewProps {
  exams: (Exam & { status: ExamStatus; computedPrep: number })[];
  onToggleTopicUnderstood: (examId: string, topicId: string) => void;
  onAddTopic: (examId: string, topicName: string) => void;
  onUpdatePastQuestions: (examId: string, pq: Exam['pastQuestions']) => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({
  exams,
  onToggleTopicUnderstood,
  onAddTopic,
  onUpdatePastQuestions,
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [expandedExamId, setExpandedExamId] = useState<string | null>(null);
  const [newTopicInput, setNewTopicInput] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExams = exams.filter((e) => {
    if (filter === 'upcoming') {
      if (e.status === 'COMPLETED') return false;
    } else if (filter === 'completed') {
      if (e.status !== 'COMPLETED') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return e.code.toLowerCase().includes(q) || e.title.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedExamId(expandedExamId === id ? null : id);
  };

  const handleAddTopicSubmit = (examId: string, e: React.FormEvent) => {
    e.preventDefault();
    const val = (newTopicInput[examId] || '').trim();
    if (!val) return;
    onAddTopic(examId, val);
    setNewTopicInput({ ...newTopicInput, [examId]: '' });
  };

  const incrementPQ = (exam: Exam, field: 'attempted' | 'completed' | 'correct') => {
    const next = { ...exam.pastQuestions, [field]: (exam.pastQuestions[field] || 0) + 1 };
    onUpdatePastQuestions(exam.id, next);
  };

  return (
    <div className="space-y-4">
      {/* Page Title & Search / Filter Controls */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-[#171717] dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D32F2F] dark:text-[#EF4444]" />
                <span>EXAM TIMETABLE & SYLLABUS</span>
              </h2>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5 font-medium">
              300-Level Electrical Engineering Examination Diet (10 Papers)
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-[#F8F8F8] dark:bg-[#222222] rounded-xl self-start sm:self-auto border border-[#E5E7EB] dark:border-neutral-700/60">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white dark:bg-[#181818] text-[#D32F2F] dark:text-[#EF4444] shadow-xs'
                  : 'text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-white'
              }`}
            >
              All (10)
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                filter === 'upcoming'
                  ? 'bg-white dark:bg-[#181818] text-[#D32F2F] dark:text-[#EF4444] shadow-xs'
                  : 'text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-white'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                filter === 'completed'
                  ? 'bg-white dark:bg-[#181818] text-[#D32F2F] dark:text-[#EF4444] shadow-xs'
                  : 'text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-white'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search course code or title (e.g. EEE 356, Control, Solid-State)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F8F8] dark:bg-[#222222] border border-[#E5E7EB] dark:border-neutral-700 rounded-xl text-xs text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
          />
        </div>
      </div>

      {/* Exam Cards List */}
      <div className="space-y-3">
        {filteredExams.map((exam) => {
          const isExpanded = expandedExamId === exam.id;
          const isNext = exam.status === 'NEXT';
          const isToday = exam.status === 'TODAY';
          const isInProgress = exam.status === 'IN_PROGRESS';
          const isCompleted = exam.status === 'COMPLETED';

          const understoodCount = exam.topics.filter((t) => t.understood).length;
          const totalTopics = exam.topics.length;

          return (
            <div
              key={exam.id}
              className={`rounded-2xl border transition-all overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)] ${
                isInProgress
                  ? 'bg-white dark:bg-[#181818] border-2 border-emerald-500'
                  : isNext
                  ? 'bg-white dark:bg-[#181818] border-2 border-[#D32F2F] dark:border-[#EF4444] shadow-[0_4px_16px_rgba(211,47,47,0.08)]'
                  : isToday
                  ? 'bg-white dark:bg-[#181818] border-2 border-[#D32F2F]/80 ring-1 ring-[#D32F2F]/20'
                  : isCompleted
                  ? 'bg-white dark:bg-[#161616] border-[#E5E7EB] dark:border-neutral-850 opacity-80'
                  : 'bg-white dark:bg-[#181818] border-[#E5E7EB] dark:border-neutral-800'
              }`}
            >
              {/* Top Accent Strip */}
              {isNext && <div className="h-1 w-full bg-[#D32F2F] dark:bg-[#EF4444]" />}
              {isToday && !isNext && <div className="h-1 w-full bg-[#D32F2F]" />}
              {isInProgress && <div className="h-1 w-full bg-emerald-500" />}

              {/* Clickable Card Summary */}
              <div
                onClick={() => toggleExpand(exam.id)}
                className="p-4 sm:p-5 cursor-pointer select-none"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
                        isNext || isToday
                          ? 'text-[#D32F2F] dark:text-[#EF4444]'
                          : isCompleted
                          ? 'text-neutral-500 dark:text-neutral-400'
                          : 'text-[#171717] dark:text-white'
                      }`}
                    >
                      {exam.code}
                    </span>

                    {/* Status Badges */}
                    {isNext && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#D32F2F] dark:bg-[#EF4444] text-white">
                        NEXT EXAM
                      </span>
                    )}
                    {isInProgress && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-600 text-white animate-pulse">
                        IN PROGRESS
                      </span>
                    )}
                    {isToday && !isInProgress && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#D32F2F] text-white">
                        TODAY
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#F8F8F8] dark:bg-neutral-800 text-[#6B7280] dark:text-neutral-400 border border-[#E5E7EB]">
                        COMPLETED
                      </span>
                    )}
                  </div>

                  {/* Preparation Bar & Percentage */}
                  <div className="flex items-center gap-3 sm:justify-end">
                    <div className="w-24 sm:w-32">
                      <div className="flex justify-between text-[10px] font-mono text-[#6B7280] dark:text-[#A3A3A3] mb-1 font-semibold">
                        <span>Prep</span>
                        <span className="font-bold text-[#171717] dark:text-white">
                          {exam.computedPrep}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#E5E7EB] dark:bg-[#222222] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isCompleted ? 'bg-emerald-600' : 'bg-[#D32F2F] dark:bg-[#EF4444]'
                          }`}
                          style={{ width: `${exam.computedPrep}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-neutral-400 hover:text-[#171717] dark:hover:text-white pl-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                <div className="text-xs sm:text-sm font-semibold text-[#171717] dark:text-neutral-200 mb-2">
                  {exam.title}
                </div>

                {/* Details Bar */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B7280] dark:text-[#A3A3A3] font-medium">
                  <span className="flex items-center gap-1 font-semibold text-[#171717] dark:text-neutral-200">
                    <Calendar className="w-3.5 h-3.5 text-[#D32F2F] dark:text-[#EF4444]" />
                    {exam.displayDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    {exam.startTime} – {exam.endTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D32F2F] dark:text-[#EF4444]" />
                    <span>Venue: <strong className="text-[#171717] dark:text-white">{exam.venue}</strong></span>
                  </span>
                </div>
              </div>

              {/* Expanded Syllabus & Past Questions Drawer */}
              {isExpanded && (
                <div className="p-4 sm:p-5 bg-[#F8F8F8] dark:bg-[#1E1E1E] border-t border-[#E5E7EB] dark:border-neutral-800 space-y-4 text-xs">
                  {/* Past Questions Row */}
                  <div className="p-3 bg-white dark:bg-[#181818] rounded-xl border border-[#E5E7EB] dark:border-neutral-750 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#D32F2F] dark:text-[#EF4444]" />
                      <div>
                        <span className="font-bold text-[#171717] dark:text-white">
                          Past Questions:
                        </span>{' '}
                        <span className="font-mono text-[#D32F2F] dark:text-[#EF4444] font-bold">
                          {exam.pastQuestions.completed} completed
                        </span>
                        <span className="text-[#6B7280] dark:text-neutral-400 text-[11px] ml-1">
                          ({exam.pastQuestions.attempted} attempted, {exam.pastQuestions.correct} correct)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => incrementPQ(exam, 'completed')}
                        className="px-3 py-1 bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white font-bold rounded-lg text-xs transition active:scale-[0.98]"
                      >
                        +1 Completed
                      </button>
                    </div>
                  </div>

                  {/* Topics Checklist */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2 font-bold text-[#171717] dark:text-white">
                      <span>Syllabus Topics ({understoodCount}/{totalTopics} Understood)</span>
                      <span className="text-[11px] text-[#6B7280] dark:text-neutral-400 font-normal">
                        Checkmark when mastered
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {exam.topics.map((t) => (
                        <div
                          key={t.id}
                          className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 transition ${
                            t.understood
                              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                              : t.isWeak
                              ? 'bg-[#FFF1F1] dark:bg-[#EF4444]/10 border-[#D32F2F]/30 text-[#171717] dark:text-white'
                              : 'bg-white dark:bg-[#181818] border-[#E5E7EB] dark:border-neutral-750 text-[#171717] dark:text-neutral-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <button
                              onClick={() => onToggleTopicUnderstood(exam.id, t.id)}
                              className={`w-5 h-5 rounded border flex items-center justify-center transition shrink-0 ${
                                t.understood
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-[#D32F2F]/60 dark:border-[#EF4444]/60 bg-white dark:bg-[#181818]'
                              }`}
                            >
                              {t.understood && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                            <span className={`text-xs ${t.understood ? 'line-through text-neutral-400 dark:text-neutral-500 font-normal' : 'font-semibold'}`}>
                              {t.name}
                            </span>
                          </div>

                          {t.isWeak && (
                            <span className="text-[10px] uppercase font-bold text-[#D32F2F] dark:text-[#EF4444] px-1.5 py-0.5 rounded bg-[#FFF1F1] dark:bg-[#EF4444]/15 shrink-0">
                              Weak Area
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Custom Topic Input */}
                    <form
                      onSubmit={(e) => handleAddTopicSubmit(exam.id, e)}
                      className="flex items-center gap-2 mt-2 pt-1"
                    >
                      <input
                        type="text"
                        placeholder="Add specific syllabus topic or derivation..."
                        value={newTopicInput[exam.id] || ''}
                        onChange={(e) =>
                          setNewTopicInput({ ...newTopicInput, [exam.id]: e.target.value })
                        }
                        className="flex-1 px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818] text-[#171717] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition active:scale-[0.98]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </form>
                  </div>

                  {/* Notes / Tips */}
                  {exam.notes && (
                    <div className="p-3 bg-white dark:bg-[#181818] border-l-4 border-l-[#D32F2F] border border-[#E5E7EB] dark:border-neutral-750 rounded-r-xl text-xs text-[#171717] dark:text-neutral-200">
                      <strong>Exam Strategy Note:</strong> {exam.notes}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
