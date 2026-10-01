import React, { useState, useEffect, useRef } from 'react';
import { Difficulty, Exam, StudySession, WeakArea, WeakAreaStatus } from '../types/dashboard';
import { playTimerCompletionChime } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  BookOpen,
  Plus,
  AlertTriangle,
  FileCheck,
  CheckCircle,
  Trash2,
  Save,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface StudyViewProps {
  exams: Exam[];
  sessions: StudySession[];
  weakAreas: WeakArea[];
  defaultSubject?: string;
  onLogSession: (session: Omit<StudySession, 'id' | 'timestamp'>) => void;
  onAddWeakArea: (area: Omit<WeakArea, 'id' | 'createdAt'>) => void;
  onUpdateWeakAreaStatus: (id: string, status: WeakAreaStatus) => void;
  onDeleteWeakArea: (id: string) => void;
  onUpdatePastQuestions: (examId: string, pq: Exam['pastQuestions']) => void;
  onOpenAiStudyLab?: (courseCode?: string) => void;
}

export const StudyView: React.FC<StudyViewProps> = ({
  exams,
  sessions,
  weakAreas,
  defaultSubject,
  onLogSession,
  onAddWeakArea,
  onUpdateWeakAreaStatus,
  onDeleteWeakArea,
  onUpdatePastQuestions,
  onOpenAiStudyLab,
}) => {
  // Timer States
  const [selectedSubject, setSelectedSubject] = useState<string>(
    defaultSubject || (exams[0] ? exams[0].code : 'EEE 356')
  );
  const [selectedTask, setSelectedTask] = useState<string>('Past Questions');
  const [targetMinutes, setTargetMinutes] = useState<number>(45);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(45 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showLogPrompt, setShowLogPrompt] = useState<boolean>(false);
  const [sessionNotes, setSessionNotes] = useState<string>('');

  // Weak Area Form
  const [showAddWeakArea, setShowAddWeakArea] = useState<boolean>(false);
  const [waSubject, setWaSubject] = useState<string>(exams[0]?.code || 'EEE 356');
  const [waTopic, setWaTopic] = useState<string>('');
  const [waDifficulty, setWaDifficulty] = useState<Difficulty>('High');
  const [waNotes, setWaNotes] = useState<string>('');

  // Selected PQ subject for editing
  const [selectedPqExamId, setSelectedPqExamId] = useState<string>(exams[2]?.id || exams[0]?.id || '');

  // Sub-tabs: 'timer' | 'past-questions' | 'weak-areas' | 'sessions'
  const [activeSubTab, setActiveSubTab] = useState<'timer' | 'past-questions' | 'weak-areas' | 'sessions'>('timer');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer interval
  useEffect(() => {
    if (isRunning && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playTimerCompletionChime();
            try {
              confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
            } catch {}
            setShowLogPrompt(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, secondsRemaining]);

  const selectPreset = (mins: number) => {
    setIsRunning(false);
    setTargetMinutes(mins);
    setSecondsRemaining(mins * 60);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsRemaining(targetMinutes * 60);
  };

  const handleSaveCompletedSession = () => {
    const elapsedMinutes = Math.max(1, Math.round((targetMinutes * 60 - secondsRemaining) / 60));
    onLogSession({
      subject: selectedSubject,
      task: selectedTask,
      durationMinutes: elapsedMinutes,
      date: new Date().toISOString().split('T')[0],
      notes: sessionNotes.trim() || 'Focus session completed.',
    });
    setShowLogPrompt(false);
    setSessionNotes('');
    resetTimer();
  };

  // Weak area submit
  const handleCreateWeakArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waTopic.trim()) return;
    onAddWeakArea({
      subject: waSubject,
      topic: waTopic.trim(),
      difficulty: waDifficulty,
      notes: waNotes.trim(),
      status: 'Needs Review',
    });
    setWaTopic('');
    setWaNotes('');
    setShowAddWeakArea(false);
  };

  // Formatting MM:SS
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const formattedTimeRemaining = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const currentPqExam = exams.find((e) => e.id === selectedPqExamId) || exams[0];

  return (
    <div className="space-y-4">
      {/* Featured AI Study Lab Banner */}
      {onOpenAiStudyLab && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-white via-white to-[#FFF1F1]/50 dark:from-[#181818] dark:to-[#221818]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF1F1] dark:bg-[#D32F2F]/20 text-[#D32F2F] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#D32F2F] text-white uppercase tracking-wider">
                  NEW
                </span>
                <span className="text-xs font-bold text-[#171717] dark:text-white">
                  AI STUDY LAB
                </span>
              </div>
              <p className="text-xs text-[#6B7280] dark:text-neutral-400 mt-0.5">
                Upload your academic PDFs, extract structured notes, and take exam simulations.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenAiStudyLab(selectedSubject)}
            className="px-4 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all shrink-0 self-start sm:self-auto"
          >
            <span>Launch AI Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Subtab Segmented Control in Red & White */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-1.5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('timer')}
          className={`flex-1 min-h-[38px] px-3 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeSubTab === 'timer'
              ? 'bg-[#D32F2F] dark:bg-[#EF4444] text-white shadow-xs'
              : 'text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Focus Timer</span>
        </button>
        <button
          onClick={() => setActiveSubTab('past-questions')}
          className={`flex-1 min-h-[38px] px-3 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeSubTab === 'past-questions'
              ? 'bg-[#D32F2F] dark:bg-[#EF4444] text-white shadow-xs'
              : 'text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-white'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Past Questions</span>
        </button>
        <button
          onClick={() => setActiveSubTab('weak-areas')}
          className={`flex-1 min-h-[38px] px-3 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeSubTab === 'weak-areas'
              ? 'bg-[#D32F2F] dark:bg-[#EF4444] text-white shadow-xs'
              : 'text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Weak Areas ({weakAreas.filter((w) => w.status !== 'Mastered').length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('sessions')}
          className={`flex-1 min-h-[38px] px-3 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeSubTab === 'sessions'
              ? 'bg-[#D32F2F] dark:bg-[#EF4444] text-white shadow-xs'
              : 'text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Session Log</span>
        </button>
      </div>

      {/* VIEW 1: FOCUS TIMER */}
      {activeSubTab === 'timer' && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-6 sm:p-7 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors text-center">
          {/* Target Configs */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="grid grid-cols-2 gap-2 text-left text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider mb-1">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  disabled={isRunning}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-neutral-700 bg-[#F8F8F8] dark:bg-[#1E1E1E] text-[#171717] dark:text-white font-bold"
                >
                  {exams.map((e) => (
                    <option key={e.id} value={e.code}>
                      {e.code} — {e.title.slice(0, 18)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider mb-1">
                  Task Type
                </label>
                <select
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  disabled={isRunning}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-neutral-700 bg-[#F8F8F8] dark:bg-[#1E1E1E] text-[#171717] dark:text-white font-medium"
                >
                  <option value="Past Questions">Past Questions</option>
                  <option value="Deep Study">Deep Study</option>
                  <option value="Active Recall">Active Recall</option>
                  <option value="Review Weak Areas">Review Weak Areas</option>
                  <option value="Formula Derivations">Formula Derivations</option>
                </select>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {[25, 45, 60, 90].map((m) => (
                <button
                  key={m}
                  onClick={() => selectPreset(m)}
                  className={`min-h-[38px] px-3.5 py-1 text-xs font-bold rounded-lg transition-all active:scale-95 ${
                    targetMinutes === m && !isRunning
                      ? 'bg-[#D32F2F] dark:bg-[#EF4444] text-white shadow-xs'
                      : 'bg-[#F8F8F8] dark:bg-[#222222] text-[#171717] dark:text-neutral-300 border border-[#E5E7EB] dark:border-neutral-700 hover:bg-[#FFF1F1]'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>

            {/* Live Timer Display with Red Accents */}
            <div className="py-6 sm:py-8 my-2 rounded-2xl bg-[#F8F8F8] dark:bg-[#1F1F1F] border border-[#E5E7EB] dark:border-neutral-800">
              <div className="text-xs uppercase tracking-widest text-[#D32F2F] dark:text-[#EF4444] font-black mb-1">
                {selectedSubject} · {selectedTask}
              </div>
              <div className="text-5xl sm:text-7xl font-black font-mono tracking-tight text-[#171717] dark:text-white tabular-nums">
                {formattedTimeRemaining}
              </div>
              <div className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-2 font-medium">
                {isRunning ? 'Session Active — Maintain absolute focus' : 'Ready to begin study block'}
              </div>
            </div>

            {/* Controls in Brand Red */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`min-h-[48px] px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-sm text-white ${
                  isRunning
                    ? 'bg-neutral-800 hover:bg-neutral-700'
                    : 'bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] dark:hover:bg-[#DC2626]'
                }`}
              >
                {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                <span>{isRunning ? 'Pause Session' : 'START STUDY'}</span>
              </button>

              <button
                onClick={resetTimer}
                className="min-h-[48px] p-3 rounded-xl border border-[#E5E7EB] dark:border-neutral-700 bg-[#F8F8F8] dark:bg-[#181818] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-[#171717] dark:text-neutral-300 transition-all active:scale-[0.98]"
                title="Reset timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Completion Modal / Prompt */}
          {showLogPrompt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
              <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#181818] p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <CheckCircle className="w-6 h-6" />
                  <h3 className="text-base font-bold text-[#171717] dark:text-white">
                    Study Session Finished!
                  </h3>
                </div>

                <p className="text-xs text-[#666666] dark:text-[#A3A3A3]">
                  Well done. Log this{' '}
                  <strong className="text-[#171717] dark:text-white">
                    {targetMinutes} minute session for {selectedSubject}
                  </strong>{' '}
                  into your academic record?
                </p>

                <div>
                  <label className="block text-[11px] font-semibold text-[#666666] mb-1">
                    Session Notes (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="e.g. Mastered Barkhausen stability. Need to review Colpitts oscillator."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1E1E1E] text-[#171717] dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setShowLogPrompt(false);
                      resetTimer();
                    }}
                    className="px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 text-[#666666] dark:text-neutral-400"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSaveCompletedSession}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white flex items-center gap-1.5 transition active:scale-[0.98]"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>SAVE SESSION</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: PAST QUESTIONS TRACKER */}
      {activeSubTab === 'past-questions' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-neutral-200/90 dark:border-neutral-800 shadow-sm transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
                  <h3 className="text-base font-black text-[#171717] dark:text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-[#D32F2F] dark:text-[#EF4444]" />
                    <span>PAST QUESTIONS MASTERY</span>
                  </h3>
                </div>
                <p className="text-xs text-[#666666] dark:text-[#A3A3A3] mt-0.5 font-medium">
                  Track accuracy, problem sets attempted, and questions to revisit
                </p>
              </div>

              {/* Course Selector */}
              <select
                value={selectedPqExamId}
                onChange={(e) => setSelectedPqExamId(e.target.value)}
                className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#F7F7F7] dark:bg-[#222222] text-xs font-bold text-[#171717] dark:text-white"
              >
                {exams.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.code} ({e.pastQuestions.completed} solved)
                  </option>
                ))}
              </select>
            </div>

            {/* Active Subject PQ Scorecard */}
            {currentPqExam && (
              <div className="space-y-4">
                <div className="p-4 bg-[#F7F7F7] dark:bg-[#1F1F1F] rounded-xl border border-neutral-200 dark:border-neutral-750">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div>
                      <span className="text-xl font-black font-mono text-[#D32F2F] dark:text-[#EF4444]">
                        {currentPqExam.code}
                      </span>
                      <span className="text-xs text-[#666666] dark:text-neutral-400 ml-2 font-medium">
                        {currentPqExam.title}
                      </span>
                    </div>

                    {/* Accuracy Badge */}
                    {currentPqExam.pastQuestions.attempted > 0 && (
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-[#666666] dark:text-neutral-400 block">
                          Accuracy
                        </span>
                        <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                          {Math.round(
                            (currentPqExam.pastQuestions.correct /
                              (currentPqExam.pastQuestions.attempted || 1)) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 shadow-xs">
                      <span className="text-[10px] text-[#666666] dark:text-neutral-400 block font-medium">Attempted</span>
                      <span className="text-lg font-black font-mono text-[#171717] dark:text-white">
                        {currentPqExam.pastQuestions.attempted}
                      </span>
                      <button
                        onClick={() =>
                          onUpdatePastQuestions(currentPqExam.id, {
                            ...currentPqExam.pastQuestions,
                            attempted: currentPqExam.pastQuestions.attempted + 1,
                          })
                        }
                        className="mt-1 text-[11px] font-bold text-[#D32F2F] dark:text-[#EF4444] hover:underline"
                      >
                        +1
                      </button>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 shadow-xs">
                      <span className="text-[10px] text-[#666666] dark:text-neutral-400 block font-medium">Correct</span>
                      <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                        {currentPqExam.pastQuestions.correct}
                      </span>
                      <button
                        onClick={() =>
                          onUpdatePastQuestions(currentPqExam.id, {
                            ...currentPqExam.pastQuestions,
                            correct: currentPqExam.pastQuestions.correct + 1,
                            attempted: currentPqExam.pastQuestions.attempted + 1,
                            completed: currentPqExam.pastQuestions.completed + 1,
                          })
                        }
                        className="mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        +1
                      </button>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 shadow-xs">
                      <span className="text-[10px] text-[#666666] dark:text-neutral-400 block font-medium">Wrong</span>
                      <span className="text-lg font-black font-mono text-[#D32F2F] dark:text-[#EF4444]">
                        {currentPqExam.pastQuestions.wrong}
                      </span>
                      <button
                        onClick={() =>
                          onUpdatePastQuestions(currentPqExam.id, {
                            ...currentPqExam.pastQuestions,
                            wrong: currentPqExam.pastQuestions.wrong + 1,
                            attempted: currentPqExam.pastQuestions.attempted + 1,
                            revisit: currentPqExam.pastQuestions.revisit + 1,
                          })
                        }
                        className="mt-1 text-[11px] font-bold text-[#D32F2F] dark:text-[#EF4444] hover:underline"
                      >
                        +1
                      </button>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 shadow-xs">
                      <span className="text-[10px] text-[#666666] dark:text-neutral-400 block font-medium">Revisit Queue</span>
                      <span className="text-lg font-black font-mono text-neutral-800 dark:text-neutral-200">
                        {currentPqExam.pastQuestions.revisit}
                      </span>
                      <button
                        onClick={() =>
                          onUpdatePastQuestions(currentPqExam.id, {
                            ...currentPqExam.pastQuestions,
                            revisit: Math.max(0, currentPqExam.pastQuestions.revisit - 1),
                          })
                        }
                        className="mt-1 text-[11px] font-bold text-neutral-500 hover:text-neutral-800"
                      >
                        -1 Cleared
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-[#171717] dark:text-neutral-200">
                    <thead className="text-[11px] uppercase tracking-wider text-[#666666] dark:text-[#A3A3A3] border-b border-neutral-200 dark:border-neutral-800 font-bold">
                      <tr>
                        <th className="py-2 px-3">Course</th>
                        <th className="py-2 px-3">Completed</th>
                        <th className="py-2 px-3">Correct</th>
                        <th className="py-2 px-3">Wrong</th>
                        <th className="py-2 px-3">Revisit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
                      {exams.map((e) => (
                        <tr
                          key={e.id}
                          onClick={() => setSelectedPqExamId(e.id)}
                          className={`cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#1E1E1E] transition ${
                            e.id === selectedPqExamId ? 'bg-[#FFF1F1] dark:bg-[#EF4444]/10 font-bold text-[#D32F2F] dark:text-[#EF4444]' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 font-bold font-mono">
                            {e.code}
                          </td>
                          <td className="py-2.5 px-3">{e.pastQuestions.completed}</td>
                          <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">{e.pastQuestions.correct}</td>
                          <td className="py-2.5 px-3 text-[#D32F2F] dark:text-[#EF4444]">{e.pastQuestions.wrong}</td>
                          <td className="py-2.5 px-3">{e.pastQuestions.revisit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: WEAK AREAS TRACKER */}
      {activeSubTab === 'weak-areas' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-neutral-200/90 dark:border-neutral-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
                  <h3 className="text-base font-black text-[#171717] dark:text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#D32F2F] dark:text-[#EF4444]" />
                    <span>WEAK AREA REGISTER</span>
                  </h3>
                </div>
                <p className="text-xs text-[#666666] dark:text-[#A3A3A3] mt-0.5 font-medium">
                  Isolate concepts needing deliberate practice before examination day
                </p>
              </div>

              <button
                onClick={() => setShowAddWeakArea(!showAddWeakArea)}
                className="px-3.5 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-[0.98] shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>LOG WEAK AREA</span>
              </button>
            </div>

            {/* Add Weak Area Form */}
            {showAddWeakArea && (
              <form
                onSubmit={handleCreateWeakArea}
                className="mb-4 p-4 rounded-xl bg-[#F7F7F7] dark:bg-[#1F1F1F] border border-neutral-200 dark:border-neutral-700 text-xs space-y-3"
              >
                <div className="font-bold text-[#171717] dark:text-white">
                  Add Concept Needing Review
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#666666] mb-1">Subject</label>
                    <select
                      value={waSubject}
                      onChange={(e) => setWaSubject(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#181818] font-bold"
                    >
                      {exams.map((e) => (
                        <option key={e.id} value={e.code}>
                          {e.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#666666] mb-1">Concept / Topic</label>
                    <input
                      type="text"
                      placeholder="e.g. Barkhausen stability criteria derivations"
                      value={waTopic}
                      onChange={(e) => setWaTopic(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#181818]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#666666] mb-1">Difficulty</label>
                    <select
                      value={waDifficulty}
                      onChange={(e) => setWaDifficulty(e.target.value as Difficulty)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#181818]"
                    >
                      <option value="High">High (Urgent)</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#666666] mb-1">Notes / Specific Struggle</label>
                    <input
                      type="text"
                      placeholder="e.g. Confused with sign convention on loop gain."
                      value={waNotes}
                      onChange={(e) => setWaNotes(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#181818]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddWeakArea(false)}
                    className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-[#666666]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white font-bold transition active:scale-[0.98]"
                  >
                    Save Weak Area
                  </button>
                </div>
              </form>
            )}

            {/* List */}
            <div className="space-y-2.5">
              {weakAreas.length === 0 ? (
                <div className="text-center py-8 text-xs text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                  No weak areas currently flagged. Excellent progress!
                </div>
              ) : (
                weakAreas.map((w) => (
                  <div
                    key={w.id}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition ${
                      w.status === 'Mastered'
                        ? 'bg-neutral-50 dark:bg-[#151515] border-neutral-200 dark:border-neutral-850 opacity-60'
                        : 'bg-white dark:bg-[#1C1C1C] border-neutral-200/90 dark:border-neutral-800 shadow-xs'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-[#D32F2F] dark:text-[#EF4444] font-mono">
                          {w.subject}
                        </span>
                        <span className="font-bold text-[#171717] dark:text-white">
                          {w.topic}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                            w.difficulty === 'High'
                              ? 'bg-[#FFF1F1] dark:bg-[#EF4444]/15 text-[#D32F2F] dark:text-[#EF4444]'
                              : w.difficulty === 'Medium'
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                              : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                          }`}
                        >
                          {w.difficulty} Priority
                        </span>
                      </div>
                      {w.notes && (
                        <p className="text-[#666666] dark:text-neutral-400 text-[11px] mt-1 italic">
                          "{w.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <select
                        value={w.status}
                        onChange={(e) =>
                          onUpdateWeakAreaStatus(w.id, e.target.value as WeakAreaStatus)
                        }
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-[#181818]"
                      >
                        <option value="Needs Review">Needs Review</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Mastered">Mastered</option>
                      </select>

                      <button
                        onClick={() => onDeleteWeakArea(w.id)}
                        className="p-1 text-neutral-400 hover:text-[#D32F2F]"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: SESSIONS LOG */}
      {activeSubTab === 'sessions' && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-neutral-200/90 dark:border-neutral-800 shadow-sm transition-colors space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
                <h3 className="text-base font-black text-[#171717] dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#D32F2F] dark:text-[#EF4444]" />
                  <span>STUDY SESSION HISTORY</span>
                </h3>
              </div>
              <p className="text-xs text-[#666666] dark:text-[#A3A3A3] mt-0.5 font-medium">
                Verified focus minutes recorded for this examination diet
              </p>
            </div>
            <div className="font-mono text-xs font-black text-[#D32F2F] dark:text-[#EF4444]">
              {sessions.reduce((acc, s) => acc + s.durationMinutes, 0)} Mins Total
            </div>
          </div>

          <div className="space-y-2">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-xs text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                No recorded study sessions yet. Run the focus timer to build your log!
              </div>
            ) : (
              sessions.map((s) => (
                <div
                  key={s.id}
                  className="p-3 bg-[#F7F7F7] dark:bg-[#1E1E1E] rounded-xl border border-neutral-200/80 dark:border-neutral-750 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-black text-[#D32F2F] dark:text-[#EF4444]">
                        {s.subject}
                      </span>
                      <span className="text-neutral-300 dark:text-neutral-700">·</span>
                      <span className="text-[#171717] dark:text-neutral-200 font-sans font-semibold">
                        {s.task}
                      </span>
                      <span className="text-neutral-300 dark:text-neutral-700">·</span>
                      <span className="font-bold text-[#171717] dark:text-white">
                        {s.durationMinutes} mins
                      </span>
                    </div>
                    {s.notes && (
                      <p className="text-[11px] text-[#666666] dark:text-[#A3A3A3] mt-1 font-medium">
                        "{s.notes}"
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                    {s.date}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
