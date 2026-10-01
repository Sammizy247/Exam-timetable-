import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  Layers,
  FileQuestion,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Calculator,
  ArrowRight,
} from 'lucide-react';
import { StudyLabMaterial, StudyLabTopic } from '../../types/studyLab';

interface TopicExplorerViewerProps {
  material: StudyLabMaterial;
  onSyncWeakArea: (subject: string, topic: string) => void;
}

type TopicModalMode = 'learn' | 'simple' | 'quiz' | 'flashcards' | 'practice';

export const TopicExplorerViewer: React.FC<TopicExplorerViewerProps> = ({
  material,
  onSyncWeakArea,
}) => {
  const topics = material.notesData.topics || [];
  const [selectedTopic, setSelectedTopic] = useState<StudyLabTopic | null>(null);
  const [modalMode, setModalMode] = useState<TopicModalMode>('learn');
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [practiceRevealed, setPracticeRevealed] = useState(false);

  // Filter questions and flashcards for selected topic
  const topicQuestions = material.quizData.filter(
    (q) =>
      !selectedTopic ||
      q.topic.toLowerCase().includes(selectedTopic.title.toLowerCase()) ||
      selectedTopic.title.toLowerCase().includes(q.topic.toLowerCase())
  );

  const topicFlashcards = material.flashcards.filter(
    (f) =>
      !selectedTopic ||
      f.topic.toLowerCase().includes(selectedTopic.title.toLowerCase()) ||
      selectedTopic.title.toLowerCase().includes(f.topic.toLowerCase())
  );

  const openTopicStudy = (topic: StudyLabTopic, mode: TopicModalMode = 'learn') => {
    setSelectedTopic(topic);
    setModalMode(mode);
    setQuizQuestionIndex(0);
    setSelectedOption(null);
    setHasEvaluated(false);
    setFlashcardFlipped(false);
    setPracticeRevealed(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Overview header */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFF1F1] text-[#D32F2F]">
                {material.courseCode}
              </span>
              <span className="text-xs text-[#6B7280]">
                {material.notesData.topics.length} Key Syllabus Topics
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-[#171717] dark:text-white mt-0.5">
              TOPICS FOUND IN {material.courseCode}
            </h2>
          </div>
          <span className="text-xs text-[#6B7280] hidden sm:block">
            Click any topic to open its Topic Study Page
          </span>
        </div>
        <p className="text-xs text-[#6B7280] dark:text-neutral-300 leading-relaxed">
          {material.notesData.summary}
        </p>
      </div>

      {/* TOPICS LIST */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717] dark:text-white mb-2">
          Click a topic to launch focused study:
        </h3>

        <div className="divide-y divide-[#E5E7EB] dark:divide-neutral-800">
          {topics.map((t, idx) => (
            <div
              key={t.id}
              onClick={() => openTopicStudy(t, 'learn')}
              className="py-3.5 px-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FFF1F1]/30 dark:hover:bg-[#202020] transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#F8F8F8] dark:bg-[#252525] border border-[#E5E7EB] dark:border-neutral-700 text-xs font-black text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#171717] dark:text-white group-hover:text-[#D32F2F] transition-colors">
                    {t.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {t.subtopics.map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#F8F8F8] dark:bg-[#252525] text-[#6B7280] dark:text-neutral-400 font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    t.examSignificance === 'Very High'
                      ? 'bg-[#FFF1F1] text-[#D32F2F]'
                      : 'bg-[#F8F8F8] dark:bg-neutral-800 text-[#6B7280]'
                  }`}
                >
                  {t.examSignificance}
                </span>
                <span className="text-xs font-bold text-[#D32F2F] flex items-center gap-1">
                  Study <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOPIC STUDY PAGE MODAL */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#181818] rounded-2xl w-full max-w-2xl border border-[#E5E7EB] dark:border-neutral-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E5E7EB] dark:border-neutral-800 bg-[#F8F8F8] dark:bg-[#141414] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-[#D32F2F] uppercase tracking-wider">
                  {material.courseCode} • TOPIC STUDY PAGE
                </span>
                <h2 className="text-base sm:text-lg font-black text-[#171717] dark:text-white mt-0.5">
                  {selectedTopic.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#171717] dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Sub-modes: [LEARN] [QUIZ ME] [FLASHCARDS] [PRACTICE QUESTIONS] [EXPLAIN SIMPLY] */}
            <div className="px-4 py-2 border-b border-[#E5E7EB] dark:border-neutral-800 flex items-center gap-1.5 overflow-x-auto bg-white dark:bg-[#181818]">
              <button
                onClick={() => setModalMode('learn')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  modalMode === 'learn'
                    ? 'bg-[#D32F2F] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#171717] dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                LEARN
              </button>

              <button
                onClick={() => setModalMode('simple')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  modalMode === 'simple'
                    ? 'bg-[#D32F2F] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#171717] dark:hover:text-white'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                EXPLAIN SIMPLY
              </button>

              <button
                onClick={() => setModalMode('quiz')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  modalMode === 'quiz'
                    ? 'bg-[#D32F2F] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#171717] dark:hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                QUIZ ME
              </button>

              <button
                onClick={() => setModalMode('flashcards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  modalMode === 'flashcards'
                    ? 'bg-[#D32F2F] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#171717] dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                FLASHCARDS
              </button>

              <button
                onClick={() => setModalMode('practice')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  modalMode === 'practice'
                    ? 'bg-[#D32F2F] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#171717] dark:hover:text-white'
                }`}
              >
                <FileQuestion className="w-3.5 h-3.5" />
                PRACTICE QUESTIONS
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* 1. LEARN MODE: EXACT 8-STEP PEDAGOGY */}
              {modalMode === 'learn' && (
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-800">
                    <span className="font-bold text-[#D32F2F] block mb-1">1. What is it?</span>
                    <p className="text-[#171717] dark:text-neutral-200 leading-relaxed">
                      {selectedTopic.title} is the mathematical and circuit analysis method used in{' '}
                      {material.courseCode} to establish controlled operating conditions, evaluate active device transconductance, and ensure predictable signal amplification.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-800">
                    <span className="font-bold text-[#D32F2F] block mb-1">
                      2. Why is it important?
                    </span>
                    <p className="text-[#171717] dark:text-neutral-200 leading-relaxed">
                      In university examinations, this topic directly accounts for derivation and numerical calculation questions. In physical electronics, poor biasing leads to thermal runaway, signal clipping, and severe harmonic distortion.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-800">
                    <span className="font-bold text-[#D32F2F] block mb-1">3. Core Concept</span>
                    <p className="text-[#171717] dark:text-neutral-200 leading-relaxed">
                      Establishing an optimal quiescent operating point (Q-point) allows the circuit to handle small-signal AC variations symmetrically around the DC bias line without crossing into cutoff or saturation.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-800">
                    <span className="font-bold text-[#D32F2F] block mb-1">4. Key Principles</span>
                    <ul className="list-disc pl-4 space-y-1 text-[#171717] dark:text-neutral-200">
                      {selectedTopic.keyConcepts.map((kc, i) => (
                        <li key={i}>{kc}</li>
                      ))}
                      <li>Thermal stabilization via negative feedback in the emitter branch</li>
                      <li>Impedance transformation between base input and collector load</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FFF1F1] dark:bg-[#D32F2F]/10 border border-[#D32F2F]/20 font-mono text-xs">
                    <span className="font-bold text-[#D32F2F] font-sans block mb-1.5">
                      5. Formulae
                    </span>
                    <div className="space-y-1.5 text-[#171717] dark:text-white">
                      <div>• Transconductance: gm = Ic / Vt = Ic / 26mV</div>
                      <div>• Base Resistance: r_pi = beta / gm = (beta * 26mV) / Ic</div>
                      <div>• Voltage Gain: Av ≈ - (gm * Rc) / (1 + gm * Re)</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-800">
                    <span className="font-bold text-[#D32F2F] block mb-1">6. Worked Example</span>
                    <p className="font-bold text-[#171717] dark:text-white mb-2">
                      Given Vcc = 12V, Rc = 3kΩ, Re = 1kΩ, R1 = 40kΩ, R2 = 10kΩ, beta = 100, Vbe = 0.7V.
                    </p>
                    <div className="font-mono text-[11px] p-2.5 bg-white dark:bg-[#181818] rounded-lg border border-[#E5E7EB] dark:border-neutral-700 space-y-1">
                      <div>Vth = 12 * (10 / 50) = 2.4 V</div>
                      <div>Rth = 40k || 10k = 8 kΩ</div>
                      <div>Ib = (2.4 - 0.7) / (8k + 101*1k) = 1.7 / 109k = 0.0156 mA</div>
                      <div>Ic = 100 * 0.0156 mA = 1.56 mA</div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400 font-sans pt-1">
                        Final Answer: Q-point Ic = 1.56 mA, gm = 60 mS (0.060 A/V)
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                    <span className="font-bold text-amber-800 dark:text-amber-400 block mb-1">
                      7. Common Mistakes
                    </span>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Forgetting the 180° phase inversion in common-emitter voltage gain</li>
                      <li>Using 25mV instead of 26mV when room temperature (300K) is specified</li>
                      <li>Neglecting the (beta + 1) multiplication factor for Re when viewed from the base</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200">
                    <span className="font-bold text-emerald-800 dark:text-emerald-400 block mb-1">
                      8. Quick Recap
                    </span>
                    <p className="leading-relaxed">
                      Set the DC bias first, determine Ic, compute gm and r_pi, substitute into the AC equivalent model, and calculate the overall voltage gain.
                    </p>
                  </div>
                </div>
              )}

              {/* 2. EXPLAIN SIMPLY */}
              {modalMode === 'simple' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#FFF1F1] dark:bg-[#D32F2F]/10 border border-[#D32F2F]/20">
                    <div className="flex items-center gap-2 font-bold text-[#D32F2F] mb-2 text-sm">
                      <Lightbulb className="w-4 h-4" />
                      <span>Explain Clearly Enough to Teach Someone Else</span>
                    </div>
                    <p className="text-sm font-medium text-[#171717] dark:text-white leading-relaxed">
                      Imagine you want to ride a seesaw with a friend. If the pivot is placed completely off to one edge, the seesaw gets jammed on the ground and cannot move up or down smoothly.
                    </p>
                    <p className="text-xs text-[#6B7280] dark:text-neutral-300 mt-2 leading-relaxed">
                      In {selectedTopic.title}, the DC bias voltage is simply placing the seesaw pivot right in the middle! That way, when the small AC audio or sensor signal arrives, the transistor can swing freely up and down without hitting the ground (cutoff) or hitting the ceiling (saturation).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-800 space-y-2">
                    <h4 className="font-bold text-[#171717] dark:text-white">
                      The One Big Rule To Memorize:
                    </h4>
                    <p className="text-[#6B7280] dark:text-neutral-300 leading-relaxed">
                      "DC biases the transistor into its active operating zone. AC rides on top of that DC level to get amplified."
                    </p>
                  </div>
                </div>
              )}

              {/* 3. QUIZ ME */}
              {modalMode === 'quiz' && (
                <div className="space-y-4">
                  {topicQuestions.length > 0 ? (
                    (() => {
                      const q = topicQuestions[quizQuestionIndex] || topicQuestions[0];
                      const isCorrect = selectedOption === q.correctIndex;
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs text-[#6B7280]">
                            <span>
                              Question {quizQuestionIndex + 1} of {topicQuestions.length}
                            </span>
                            <span className="font-semibold text-[#D32F2F]">{q.difficulty}</span>
                          </div>

                          <div className="p-4 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-800">
                            <p className="text-sm font-bold text-[#171717] dark:text-white">
                              {q.question}
                            </p>
                          </div>

                          <div className="space-y-2">
                            {q.options.map((opt, oIdx) => {
                              const isSelected = selectedOption === oIdx;
                              let btnClass = 'bg-white dark:bg-[#181818] border-[#E5E7EB] dark:border-neutral-800';
                              if (hasEvaluated) {
                                if (oIdx === q.correctIndex) {
                                  btnClass = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300';
                                } else if (isSelected) {
                                  btnClass = 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-800 dark:text-red-300';
                                }
                              } else if (isSelected) {
                                btnClass = 'bg-[#FFF1F1] border-[#D32F2F] text-[#D32F2F]';
                              }

                              return (
                                <button
                                  key={oIdx}
                                  disabled={hasEvaluated}
                                  onClick={() => setSelectedOption(oIdx)}
                                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${btnClass}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {!hasEvaluated ? (
                            <button
                              disabled={selectedOption === null}
                              onClick={() => {
                                setHasEvaluated(true);
                                if (selectedOption !== q.correctIndex) {
                                  onSyncWeakArea(material.courseCode, selectedTopic.title);
                                }
                              }}
                              className={`w-full py-3 rounded-xl text-xs font-bold ${
                                selectedOption === null
                                  ? 'bg-neutral-300 dark:bg-neutral-800 text-neutral-500'
                                  : 'bg-[#D32F2F] text-white hover:bg-[#B71C1C]'
                              }`}
                            >
                              Submit Answer
                            </button>
                          ) : (
                            <div className="space-y-3 animate-in fade-in">
                              <div
                                className={`p-4 rounded-xl border ${
                                  isCorrect
                                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                                    : 'bg-red-50 dark:bg-red-950/20 border-red-300 text-red-900 dark:text-red-200'
                                }`}
                              >
                                <div className="font-black text-sm mb-1">
                                  {isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                                </div>
                                <p className="leading-relaxed">{q.explanation}</p>
                                {!isCorrect && (
                                  <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-900 text-[11px] font-semibold">
                                    Flagged to your Dashboard Weak Areas for prioritized review.
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedOption(null);
                                  setHasEvaluated(false);
                                  setQuizQuestionIndex((prev) => (prev + 1) % topicQuestions.length);
                                }}
                                className="w-full py-2.5 rounded-xl bg-[#D32F2F] text-white text-xs font-bold"
                              >
                                Next Question →
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-8 text-[#6B7280]">
                      No quiz questions for this topic.
                    </div>
                  )}
                </div>
              )}

              {/* 4. FLASHCARDS */}
              {modalMode === 'flashcards' && (
                <div className="space-y-4">
                  {topicFlashcards.length > 0 ? (
                    <div
                      onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                      className="w-full min-h-[220px] p-6 rounded-2xl bg-white dark:bg-[#1E1E1E] border-2 border-[#D32F2F]/30 hover:border-[#D32F2F] shadow-md flex flex-col justify-center items-center text-center cursor-pointer transition-all active:scale-98 select-none"
                    >
                      <span className="text-[10px] font-bold text-[#D32F2F] uppercase tracking-wider mb-2">
                        {flashcardFlipped ? 'ANSWER / BACK' : 'QUESTION / FRONT'}
                      </span>
                      <p className="text-base font-bold text-[#171717] dark:text-white leading-relaxed">
                        {flashcardFlipped ? topicFlashcards[0].back : topicFlashcards[0].front}
                      </p>
                      <span className="text-[11px] text-[#6B7280] mt-4">
                        {flashcardFlipped ? 'Tap to view question' : 'Tap to reveal answer'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#6B7280]">
                      No flashcards found for this topic.
                    </div>
                  )}
                </div>
              )}

              {/* 5. PRACTICE QUESTIONS */}
              {modalMode === 'practice' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-[#181818] border border-[#E5E7EB] dark:border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF1F1] text-[#D32F2F]">
                        Standard University Exam Problem
                      </span>
                      <span className="text-[#6B7280]">15 Marks</span>
                    </div>
                    <p className="text-sm font-bold text-[#171717] dark:text-white leading-relaxed">
                      Derive the small-signal voltage gain Av for a Common-Emitter amplifier stage in terms of gm, Rc, and Re.
                    </p>

                    {!practiceRevealed ? (
                      <button
                        onClick={() => setPracticeRevealed(true)}
                        className="px-4 py-2 rounded-xl bg-[#D32F2F] text-white text-xs font-bold"
                      >
                        Reveal Step-by-Step Working
                      </button>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-700 font-mono text-[11px] space-y-1.5 animate-in fade-in">
                        <div>1. AC input loop: vin = ib * r_pi + (ib + ic) * Re</div>
                        <div>2. With ic = beta * ib: vin = ib * [r_pi + (beta + 1) * Re]</div>
                        <div>3. Output loop: vout = - ic * Rc = - beta * ib * Rc</div>
                        <div>4. Ratio Av = vout / vin = - (beta * Rc) / [r_pi + (beta + 1)*Re]</div>
                        <div className="pt-1 font-bold text-emerald-600 font-sans text-xs">
                          Final Answer: Av ≈ - (gm * Rc) / (1 + gm * Re) ≈ - Rc / Re
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
