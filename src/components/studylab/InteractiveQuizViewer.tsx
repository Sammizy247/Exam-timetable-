import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  BookmarkPlus,
  Loader2,
} from 'lucide-react';
import { StudyLabMaterial, StudyLabQuizQuestion } from '../../types/studyLab';

interface InteractiveQuizViewerProps {
  material: StudyLabMaterial;
  onSyncWeakArea: (subject: string, topic: string) => void;
  onRetake: () => void;
}

export const InteractiveQuizViewer: React.FC<InteractiveQuizViewerProps> = ({
  material,
  onSyncWeakArea,
}) => {
  const questions: StudyLabQuizQuestion[] = material.quizData || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  // Deeper AI explanation state
  const [deepExplanationLoading, setDeepExplanationLoading] = useState(false);
  const [deepExplanation, setDeepExplanation] = useState<string | null>(null);

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-8 border border-[#E5E7EB] dark:border-neutral-800 text-center space-y-3">
        <HelpCircle className="w-10 h-10 text-[#D32F2F] mx-auto" />
        <h3 className="text-base font-bold text-[#171717] dark:text-white">
          No Quiz Questions Available
        </h3>
        <p className="text-xs text-[#6B7280]">
          Upload academic notes or questions to generate an interactive quiz for this material.
        </p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const hasAnsweredCurrent = isAnswerSubmitted[currentIndex] !== undefined;
  const currentSelectedOption = selectedAnswers[currentIndex];
  const isCorrect = currentSelectedOption === currentQ.correctIndex;

  const handleSelectOption = (optionIndex: number) => {
    if (hasAnsweredCurrent) return; // Prevent changing after submission
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
    setIsAnswerSubmitted((prev) => ({ ...prev, [currentIndex]: true }));
    setDeepExplanation(null);
  };

  const handleNextQuestion = () => {
    setDeepExplanation(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleAskAIDeeper = async () => {
    if (currentSelectedOption === undefined) return;
    setDeepExplanationLoading(true);
    try {
      const response = await fetch('/api/study-lab/explain-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          selectedOption: currentQ.options[currentSelectedOption],
          correctOption: currentQ.options[currentQ.correctIndex],
          courseCode: material.courseCode,
        }),
      });
      const data = await response.json();
      setDeepExplanation(data.explanation || 'Detailed review generated.');
    } catch (err) {
      setDeepExplanation(
        `In ${material.courseCode}, option "${currentQ.options[currentQ.correctIndex]}" is verified by the small-signal equations. Common calculation slips occur when sign inversion is ignored.`
      );
    } finally {
      setDeepExplanationLoading(false);
    }
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setIsAnswerSubmitted({});
    setCurrentIndex(0);
    setQuizFinished(false);
    setDeepExplanation(null);
  };

  // Score calculation
  const totalQuestions = questions.length;
  let correctCount = 0;
  const missedTopics: string[] = [];

  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctIndex) {
      correctCount += 1;
    } else if (selectedAnswers[idx] !== undefined) {
      if (q.topic && !missedTopics.includes(q.topic)) {
        missedTopics.push(q.topic);
      }
    }
  });

  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="space-y-4">
      {/* Quiz Progress Header */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#D32F2F] dark:text-[#EF4444]">
              {material.courseCode}
            </span>
            <span className="text-xs font-bold text-[#171717] dark:text-white">
              • Interactive Diagnostic Quiz
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-black text-[#171717] dark:text-white mt-0.5">
            Question {currentIndex + 1} of {totalQuestions}
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-48 space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-[#6B7280]">
            <span>Progress</span>
            <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#F8F8F8] dark:bg-[#252525] overflow-hidden border border-[#E5E7EB] dark:border-neutral-700">
            <div
              className="h-full bg-[#D32F2F] transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* QUIZ FINISHED RESULTS SCREEN */}
      {quizFinished ? (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-center space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center font-black text-xl shadow-md border-2 border-[#D32F2F] bg-[#FFF1F1] text-[#D32F2F]">
            {scorePercent}%
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-[#171717] dark:text-white">
              Quiz Completed!
            </h3>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              You scored <span className="font-bold text-[#171717] dark:text-white">{correctCount}</span> out of{' '}
              <span className="font-bold text-[#171717] dark:text-white">{totalQuestions}</span> questions correct.
            </p>
          </div>

          {/* Identified Weak Areas from the Quiz */}
          {missedTopics.length > 0 ? (
            <div className="p-4 rounded-2xl bg-[#FFF1F1] dark:bg-[#281616] border border-[#D32F2F]/30 text-left space-y-2.5 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-xs font-black text-[#D32F2F] dark:text-[#EF4444]">
                <AlertTriangle className="w-4 h-4" />
                <span>Identified Weak Concept Areas ({missedTopics.length})</span>
              </div>
              <p className="text-[11px] text-[#6B7280] dark:text-neutral-300">
                Based on your incorrect selections, these topics require focused review before your exam paper:
              </p>
              <div className="space-y-1.5">
                {missedTopics.map((topic, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#D32F2F]/20 text-xs"
                  >
                    <span className="font-semibold text-[#171717] dark:text-white truncate">
                      {topic}
                    </span>
                    <button
                      onClick={() => onSyncWeakArea(material.courseCode, topic)}
                      className="px-2.5 py-1 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-[10px] font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <BookmarkPlus className="w-3 h-3" />
                      Add to Focus List
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto font-medium">
              Outstanding mastery! You answered all diagnostic questions correctly on this syllabus section.
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Quiz
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE QUESTION CARD */
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
          {/* Question topic & difficulty tag */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FFF1F1] dark:bg-[#281818] text-[#D32F2F] dark:text-[#EF4444] border border-[#D32F2F]/20">
              {currentQ.topic || 'Exam Topic'}
            </span>
            <span className="text-[10px] font-bold text-[#6B7280]">
              Difficulty: {currentQ.difficulty || 'Medium'}
            </span>
          </div>

          {/* Question Statement */}
          <h3 className="text-sm sm:text-base font-bold text-[#171717] dark:text-white leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-2.5 pt-1">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = currentSelectedOption === optIdx;
              const isOptionCorrect = optIdx === currentQ.correctIndex;

              let optionStyle =
                'bg-[#F8F8F8] dark:bg-[#222] border-[#E5E7EB] dark:border-neutral-700 text-[#171717] dark:text-neutral-200 hover:border-[#D32F2F]';

              if (hasAnsweredCurrent) {
                if (isOptionCorrect) {
                  optionStyle =
                    'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold ring-1 ring-emerald-500/30';
                } else if (isSelected && !isOptionCorrect) {
                  optionStyle =
                    'bg-[#FFF1F1] dark:bg-[#2A1515] border-[#D32F2F] text-[#D32F2F] dark:text-[#EF4444] font-bold ring-1 ring-[#D32F2F]/30';
                } else {
                  optionStyle =
                    'bg-[#F8F8F8] dark:bg-[#1E1E1E] border-[#E5E7EB] dark:border-neutral-800 opacity-60 text-[#6B7280]';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={hasAnsweredCurrent}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5 ${
                      hasAnsweredCurrent && isOptionCorrect
                        ? 'bg-emerald-600 text-white'
                        : hasAnsweredCurrent && isSelected && !isOptionCorrect
                        ? 'bg-[#D32F2F] text-white'
                        : 'bg-white dark:bg-[#2A2A2A] border border-[#E5E7EB] dark:border-neutral-700 text-[#171717] dark:text-neutral-300'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1">{option}</span>

                  {hasAnsweredCurrent && isOptionCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {hasAnsweredCurrent && isSelected && !isOptionCorrect && (
                    <XCircle className="w-5 h-5 text-[#D32F2F] shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* EXPLANATION PANEL (APPEARS AFTER SELECTING AN OPTION) */}
          {hasAnsweredCurrent && (
            <div className="pt-3 space-y-3 animate-in fade-in">
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  isCorrect
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-[#FFF1F1] dark:bg-[#2A1616] border-[#D32F2F]/30 text-[#171717] dark:text-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#D32F2F] shrink-0" />
                  )}
                  <span className="text-xs font-black uppercase tracking-wider">
                    {isCorrect ? 'Correct! High-Yield Solution:' : 'Incorrect. Answer Analysis:'}
                  </span>
                </div>

                {/* Right answer explanation */}
                <p className="text-xs leading-relaxed font-medium">
                  {currentQ.explanation}
                </p>

                {/* Why the selected wrong option was incorrect */}
                {!isCorrect &&
                  currentSelectedOption !== undefined &&
                  currentQ.wrongOptionExplanations?.[currentSelectedOption] && (
                    <div className="pt-2 border-t border-[#D32F2F]/20 text-xs space-y-1">
                      <span className="font-bold text-[#D32F2F] dark:text-[#EF4444] block">
                        Why Your Choice Was Wrong:
                      </span>
                      <p className="text-[11px] text-[#6B7280] dark:text-neutral-300">
                        {currentQ.wrongOptionExplanations[currentSelectedOption]}
                      </p>
                    </div>
                  )}
              </div>

              {/* Deeper AI explanation */}
              {deepExplanation && (
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#222] border border-[#D32F2F]/20 text-xs text-[#171717] dark:text-neutral-200 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#D32F2F] uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Professor's Engineering Breakdown</span>
                  </div>
                  <p className="text-xs leading-relaxed whitespace-pre-line">
                    {deepExplanation}
                  </p>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                <div className="flex items-center gap-2">
                  {!isCorrect && (
                    <button
                      onClick={handleAskAIDeeper}
                      disabled={deepExplanationLoading}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#222] border border-[#E5E7EB] dark:border-neutral-700 hover:border-[#D32F2F] text-xs font-bold text-[#171717] dark:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {deepExplanationLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D32F2F]" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-[#D32F2F]" />
                      )}
                      Explain Misconception
                    </button>
                  )}

                  {!isCorrect && currentQ.topic && (
                    <button
                      onClick={() => onSyncWeakArea(material.courseCode, currentQ.topic)}
                      className="px-3 py-1.5 rounded-lg bg-[#FFF1F1] text-[#D32F2F] text-xs font-bold border border-[#D32F2F]/20 hover:bg-[#D32F2F] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      Add "{currentQ.topic}" to Focus List
                    </button>
                  )}
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1.5 ml-auto cursor-pointer"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
