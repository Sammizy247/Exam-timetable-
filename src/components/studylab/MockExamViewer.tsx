import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BookmarkPlus,
  HelpCircle,
  Flag,
} from 'lucide-react';
import { StudyLabMaterial, StudyLabMockExam, StudyLabMockExamQuestion } from '../../types/studyLab';

interface MockExamViewerProps {
  material: StudyLabMaterial;
  onSyncWeakArea: (subject: string, topic: string) => void;
}

export const MockExamViewer: React.FC<MockExamViewerProps> = ({
  material,
  onSyncWeakArea,
}) => {
  const mockExam: StudyLabMockExam = material.mockExam || {
    id: 'mock-default',
    title: `${material.courseCode} Examination Paper`,
    durationMinutes: 30,
    totalMarks: 50,
    instructions: ['Answer all questions.'],
    questions: [],
  };

  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(mockExam.durationMinutes * 60);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (!hasStarted || isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [hasStarted, isSubmitted]);

  const questions = mockExam.questions || [];

  if (questions.length === 0) {
    return (
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-8 border border-[#E5E7EB] dark:border-neutral-800 text-center space-y-3">
        <FileCheck className="w-10 h-10 text-[#D32F2F] mx-auto" />
        <h3 className="text-base font-bold text-[#171717] dark:text-white">
          No Mock Exam Questions Generated
        </h3>
        <p className="text-xs text-[#6B7280]">
          Upload syllabus material to generate timed exam papers with calculation questions.
        </p>
      </div>
    );
  }

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setHasStarted(true);
    setIsSubmitted(false);
    setSecondsRemaining(mockExam.durationMinutes * 60);
  };

  const handleAnswerChange = (qId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const toggleFlag = (qId: string) => {
    setFlaggedQuestions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitExam = () => {
    setIsSubmitModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsSubmitModalOpen(false);
    setIsSubmitted(true);
  };

  const currentQ = questions[activeQuestionIndex];

  // Grading calculation
  let earnedMarks = 0;
  const missedTopics: string[] = [];

  questions.forEach((q) => {
    if (q.type === 'multiple_choice') {
      const studentAns = answers[q.id];
      if (studentAns === q.correctAnswer) {
        earnedMarks += q.marks;
      } else {
        if (q.topic && !missedTopics.includes(q.topic)) {
          missedTopics.push(q.topic);
        }
      }
    } else {
      // For theory, default to giving feedback and model answers
      if (answers[q.id]) {
        earnedMarks += Math.round(q.marks * 0.8); // estimated student completion
      }
    }
  });

  const percentScore = Math.round((earnedMarks / mockExam.totalMarks) * 100);

  return (
    <div className="space-y-4">
      {/* 1. EXAM BRIEFING SCREEN (BEFORE STARTING) */}
      {!hasStarted && !isSubmitted && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF1F1] text-[#D32F2F] flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-[#D32F2F] uppercase tracking-wider">
                UNIVERSITY TIMED MOCK PAPER
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#171717] dark:text-white">
                {mockExam.title}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-700">
              <span className="text-[10px] text-[#6B7280] uppercase font-bold block">
                Duration
              </span>
              <span className="text-sm font-black text-[#171717] dark:text-white">
                {mockExam.durationMinutes} Minutes
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-700">
              <span className="text-[10px] text-[#6B7280] uppercase font-bold block">
                Total Marks
              </span>
              <span className="text-sm font-black text-[#D32F2F]">
                {mockExam.totalMarks} Marks
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-700 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-[#6B7280] uppercase font-bold block">
                Total Questions
              </span>
              <span className="text-sm font-black text-[#171717] dark:text-white">
                {questions.length} Questions
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-xl bg-[#F8F8F8] dark:bg-[#222] border border-[#E5E7EB] dark:border-neutral-700 space-y-1.5 text-xs text-[#171717] dark:text-neutral-200">
            <span className="font-bold text-[#D32F2F] uppercase tracking-wider block">
              Examination Instructions:
            </span>
            {mockExam.instructions?.map((inst, i) => (
              <div key={i} className="flex items-start gap-2">
                <span>•</span>
                <span>{inst}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleStartExam}
            className="w-full py-3.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            Begin Mock Examination
          </button>
        </div>
      )}

      {/* 2. ACTIVE EXAM PAPER */}
      {hasStarted && !isSubmitted && (
        <div className="space-y-4">
          {/* Real-time Sticky Exam Header */}
          <div className="sticky top-2 z-30 bg-white/95 dark:bg-[#181818]/95 backdrop-blur-md rounded-2xl p-4 border border-[#E5E7EB] dark:border-neutral-800 shadow-md flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-[#6B7280] block">
                {material.courseCode} Mock Paper
              </span>
              <span className="text-xs font-black text-[#171717] dark:text-white">
                Question {activeQuestionIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Countdown Display in primary red */}
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1.5 rounded-xl font-mono font-black text-sm sm:text-base border flex items-center gap-1.5 ${
                  secondsRemaining < 300
                    ? 'bg-[#FFF1F1] text-[#D32F2F] border-[#D32F2F] animate-pulse'
                    : 'bg-[#F8F8F8] dark:bg-[#222] text-[#171717] dark:text-white border-[#E5E7EB] dark:border-neutral-700'
                }`}
              >
                <Clock className="w-4 h-4 text-[#D32F2F]" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>

              <button
                onClick={handleSubmitExam}
                className="px-4 py-1.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Submit Paper
              </button>
            </div>
          </div>

          {/* Question Palette Strip */}
          <div className="bg-white dark:bg-[#181818] rounded-2xl p-3 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center gap-1.5 overflow-x-auto">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = idx === activeQuestionIndex;
              const isFlagged = flaggedQuestions[q.id];

              return (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center justify-center relative cursor-pointer ${
                    isCurrent
                      ? 'bg-[#D32F2F] text-white shadow-xs scale-105'
                      : isAnswered
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-400'
                      : 'bg-[#F8F8F8] dark:bg-[#222] text-[#6B7280] dark:text-neutral-400 hover:border-neutral-400'
                  }`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-0.5 right-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Question Display */}
          <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FFF1F1] text-[#D32F2F] border border-[#D32F2F]/20">
                {currentQ.section} • [{currentQ.marks} MARKS]
              </span>

              <button
                type="button"
                onClick={() => toggleFlag(currentQ.id)}
                className={`text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                  flaggedQuestions[currentQ.id]
                    ? 'bg-amber-100 text-amber-700'
                    : 'text-[#6B7280] hover:text-[#171717]'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flaggedQuestions[currentQ.id] ? 'Flagged' : 'Flag Question'}</span>
              </button>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-[#171717] dark:text-white leading-relaxed">
              {currentQ.questionText}
            </h3>

            {/* Answer Input based on type */}
            {currentQ.type === 'multiple_choice' && currentQ.options ? (
              <div className="space-y-2 pt-1">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = answers[currentQ.id] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleAnswerChange(currentQ.id, oIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFF1F1] dark:bg-[#2A1515] border-[#D32F2F] text-[#D32F2F] dark:text-[#EF4444] font-bold ring-1 ring-[#D32F2F]/30'
                          : 'bg-[#F8F8F8] dark:bg-[#202020] border-[#E5E7EB] dark:border-neutral-700 text-[#171717] dark:text-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5 ${
                          isSelected
                            ? 'bg-[#D32F2F] text-white'
                            : 'bg-white dark:bg-[#2A2A2A] border border-[#E5E7EB] dark:border-neutral-700 text-[#171717] dark:text-neutral-300'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Structured Theory Scratchpad & Student Answer Area */
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-[#6B7280] block">
                  Write Your Derivation & Calculation Steps:
                </label>
                <textarea
                  rows={6}
                  placeholder="State equations, substitution steps, and final numeric result with units..."
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-700 text-xs font-mono text-[#171717] dark:text-white focus:outline-none focus:border-[#D32F2F]"
                />
              </div>
            )}

            {/* Prev / Next controls */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB] dark:border-neutral-800">
              <button
                disabled={activeQuestionIndex === 0}
                onClick={() => setActiveQuestionIndex((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B7280] hover:text-[#171717] disabled:opacity-40 transition-colors"
              >
                ← Previous
              </button>
              <button
                disabled={activeQuestionIndex === questions.length - 1}
                onClick={() => setActiveQuestionIndex((prev) => prev + 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#D32F2F] hover:underline disabled:opacity-40 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. POST-EXAM GRADING & MODEL SOLUTIONS SCREEN */}
      {isSubmitted && (
        <div className="space-y-4 animate-in fade-in">
          {/* Score Header */}
          <div className="bg-white dark:bg-[#181818] rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-center space-y-3">
            <span className="text-xs font-black uppercase text-[#D32F2F] tracking-wider">
              EXAMINATION SCRIPT RESULT
            </span>
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center font-black text-xl shadow-md border-2 border-[#D32F2F] bg-[#FFF1F1] text-[#D32F2F]">
              {percentScore}%
            </div>
            <h3 className="text-lg font-black text-[#171717] dark:text-white">
              Score: {earnedMarks} / {mockExam.totalMarks} Marks
            </h3>
            <p className="text-xs text-[#6B7280]">
              Review the complete marking scheme and model answers below to calibrate your exam technique.
            </p>

            <button
              onClick={() => {
                setHasStarted(false);
                setIsSubmitted(false);
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#F8F8F8] dark:bg-[#252525] border border-[#E5E7EB] dark:border-neutral-700 text-xs font-bold text-[#171717] dark:text-white hover:border-[#D32F2F] transition-colors"
            >
              Reset Paper
            </button>
          </div>

          {/* Model Answer Breakdown for each question */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#171717] dark:text-white">
              EXAMINER'S MODEL SOLUTIONS & MARKING SCHEME
            </h4>

            {questions.map((q, idx) => {
              const studentAnswer = answers[q.id];
              const isObj = q.type === 'multiple_choice';
              const isCorrect = isObj && studentAnswer === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className="bg-white dark:bg-[#181818] rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-black text-[#D32F2F]">
                      Question {idx + 1} • [{q.marks} Marks]
                    </span>
                    {isObj && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isCorrect ? 'Correct (+Full Marks)' : 'Missed'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-[#171717] dark:text-white">
                    {q.questionText}
                  </p>

                  {/* Model Solution Box */}
                  <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-700 text-xs space-y-1.5">
                    <span className="font-bold text-[#D32F2F] block">
                      Model Solution:
                    </span>
                    <p className="text-xs text-[#171717] dark:text-neutral-200 leading-relaxed font-mono whitespace-pre-line">
                      {q.modelSolution}
                    </p>
                  </div>

                  {/* Marking Scheme Points */}
                  {q.markingScheme && q.markingScheme.length > 0 && (
                    <div className="text-[11px] text-[#6B7280] space-y-1">
                      <span className="font-bold text-[#171717] dark:text-neutral-300 block">
                        Marking Rubric:
                      </span>
                      {q.markingScheme.map((item, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add to Focus list if needed */}
                  {q.topic && (
                    <div className="pt-2 border-t border-[#E5E7EB] dark:border-neutral-800 flex justify-end">
                      <button
                        onClick={() => onSyncWeakArea(material.courseCode, q.topic)}
                        className="text-[10px] font-bold text-[#D32F2F] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <BookmarkPlus className="w-3 h-3" />
                        Track topic "{q.topic}" in Focus List
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* SUBMIT EXAM CONFIRMATION MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#181818] rounded-2xl max-w-sm w-full p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF1F1] text-[#D32F2F] flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#171717] dark:text-white">
                  Submit Examination Paper?
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-neutral-400 mt-1">
                  You have answered {Object.keys(answers).length} of {questions.length} questions. Are you ready to finish and view your immediate marking scheme and diagnostics?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6B7280] hover:text-[#171717] dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                Continue Exam
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#D32F2F] hover:bg-[#B71C1C] text-white shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Submit & Grade</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
