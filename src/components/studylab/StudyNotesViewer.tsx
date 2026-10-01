import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Search,
  Copy,
  Check,
  Calculator,
  ChevronDown,
  ChevronUp,
  BookmarkPlus,
  ArrowRight,
} from 'lucide-react';
import { StudyLabMaterial } from '../../types/studyLab';

interface StudyNotesViewerProps {
  material: StudyLabMaterial;
  onStartQuiz: () => void;
  onStartMockExam: () => void;
  onSyncWeakArea: (subject: string, topic: string) => void;
}

type NoteTab = 'all' | 'topics' | 'formulas' | 'definitions' | 'examples' | 'pitfalls';

export const StudyNotesViewer: React.FC<StudyNotesViewerProps> = ({
  material,
  onStartQuiz,
  onStartMockExam,
  onSyncWeakArea,
}) => {
  const [activeTab, setActiveTab] = useState<NoteTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedFormulaId, setCopiedFormulaId] = useState<string | null>(null);
  const [expandedTopicIds, setExpandedTopicIds] = useState<Record<string, boolean>>({});

  const toggleTopicExpand = (id: string) => {
    setExpandedTopicIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyFormula = (id: string, equation: string) => {
    navigator.clipboard.writeText(equation);
    setCopiedFormulaId(id);
    setTimeout(() => setCopiedFormulaId(null), 2000);
  };

  const { notesData } = material;

  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="space-y-4">
      {/* Title & Action Strip */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#D32F2F] dark:text-[#EF4444]">
                {material.courseCode}
              </span>
              <span className="text-xs font-bold text-[#171717] dark:text-white">
                {material.courseTitle}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-[#171717] dark:text-white mt-0.5">
              Structured Exam Study Notes & Formulas
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-neutral-400">
              Source file: <span className="font-semibold">{material.fileName}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onStartQuiz}
              className="px-3.5 py-2 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Quiz Me ({material.quizData?.length || 0})
            </button>
            <button
              onClick={onStartMockExam}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#202020] text-[#D32F2F] dark:text-[#EF4444] border border-[#D32F2F] hover:bg-[#FFF1F1] font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              Mock Exam
            </button>
          </div>
        </div>

        {/* Tab & Search Filter */}
        <div className="pt-2 border-t border-[#E5E7EB] dark:border-neutral-800 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(
              [
                { id: 'all', label: 'All Content' },
                { id: 'formulas', label: `Formulas (${notesData.formulas?.length || 0})` },
                { id: 'topics', label: `Topics (${notesData.topics?.length || 0})` },
                { id: 'definitions', label: `Definitions (${notesData.definitions?.length || 0})` },
                { id: 'examples', label: `Calculations (${notesData.workedExamples?.length || 0})` },
                { id: 'pitfalls', label: `Exam Traps (${notesData.examPitfalls?.length || 0})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#D32F2F] text-white shadow-xs'
                    : 'bg-[#F8F8F8] dark:bg-[#222] text-[#6B7280] dark:text-neutral-300 hover:text-[#171717]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search in notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-700 text-[#171717] dark:text-white focus:outline-none focus:border-[#D32F2F]"
            />
          </div>
        </div>
      </div>

      {/* 1. EXECUTIVE SUMMARY & KEY TAKEAWAYS */}
      {(activeTab === 'all' || activeTab === 'topics') && matchesSearch(notesData.summary) && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 rounded-full bg-[#D32F2F]" />
            <h3 className="text-xs font-black tracking-wider uppercase text-[#171717] dark:text-white">
              EXECUTIVE SYLLABUS SUMMARY
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#171717] dark:text-neutral-200 leading-relaxed">
            {notesData.summary}
          </p>

          {/* Key Takeaways */}
          {notesData.keyTakeaways && notesData.keyTakeaways.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#E5E7EB] dark:border-neutral-800 space-y-2">
              <span className="text-[11px] font-black uppercase text-[#D32F2F] tracking-wider block">
                HIGH-YIELD TAKEAWAYS:
              </span>
              <ul className="space-y-1.5">
                {notesData.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#171717] dark:text-neutral-200">
                    <CheckCircle2 className="w-4 h-4 text-[#D32F2F] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 2. FORMULAS SHEET */}
      {(activeTab === 'all' || activeTab === 'formulas') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#D32F2F]" />
              <h3 className="text-xs font-black tracking-wider uppercase text-[#171717] dark:text-white">
                MASTER FORMULAS & EQUATIONS
              </h3>
            </div>
            <span className="text-[11px] text-[#6B7280]">
              {notesData.formulas?.length || 0} equations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {notesData.formulas
              ?.filter((f) => matchesSearch(f.name + f.equation + f.description))
              .map((formula) => (
                <div
                  key={formula.id}
                  className="bg-white dark:bg-[#181818] rounded-2xl p-4 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-2.5 relative group hover:border-[#D32F2F] transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-black text-[#171717] dark:text-white">
                      {formula.name}
                    </h4>
                    <button
                      onClick={() => handleCopyFormula(formula.id, formula.equation)}
                      className="p-1 rounded text-[#6B7280] hover:text-[#D32F2F] hover:bg-[#FFF1F1] transition-colors"
                      title="Copy formula"
                    >
                      {copiedFormulaId === formula.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Formula Display Box in subtle red tint */}
                  <div className="p-3 rounded-xl bg-[#FFF1F1] dark:bg-[#261515] border border-[#D32F2F]/20 text-[#D32F2F] dark:text-[#EF4444] font-mono font-bold text-xs sm:text-sm tracking-wide">
                    {formula.equation}
                  </div>

                  <p className="text-[11px] text-[#6B7280] dark:text-neutral-300">
                    {formula.description}
                  </p>

                  {/* Parameters */}
                  {formula.parameters && formula.parameters.length > 0 && (
                    <div className="text-[10px] space-y-0.5 text-[#6B7280] dark:text-neutral-400 bg-[#F8F8F8] dark:bg-[#202020] p-2 rounded-lg">
                      <span className="font-bold text-[#171717] dark:text-neutral-200 block">
                        Parameters:
                      </span>
                      {formula.parameters.map((p, i) => (
                        <div key={i}>• {p}</div>
                      ))}
                    </div>
                  )}

                  {/* Exam Tip */}
                  {formula.examTip && (
                    <div className="flex items-start gap-1.5 text-[11px] text-[#D32F2F] dark:text-[#EF4444] bg-[#FFF1F1] dark:bg-[#251515] p-2 rounded-lg font-medium">
                      <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{formula.examTip}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. STRUCTURED TOPICS & CONCEPTS */}
      {(activeTab === 'all' || activeTab === 'topics') && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#D32F2F]" />
            <h3 className="text-xs font-black tracking-wider uppercase text-[#171717] dark:text-white">
              CORE SYLLABUS TOPICS
            </h3>
          </div>

          <div className="space-y-2.5">
            {notesData.topics
              ?.filter((t) => matchesSearch(t.title + t.subtopics.join(' ')))
              .map((topic) => {
                const isExpanded = expandedTopicIds[topic.id] !== false; // expanded by default
                return (
                  <div
                    key={topic.id}
                    className="bg-white dark:bg-[#181818] rounded-2xl border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden transition-all"
                  >
                    <div
                      onClick={() => toggleTopicExpand(topic.id)}
                      className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#F8F8F8] dark:hover:bg-[#202020] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-[#D32F2F]" />
                        <h4 className="text-xs sm:text-sm font-bold text-[#171717] dark:text-white">
                          {topic.title}
                        </h4>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            topic.examSignificance === 'Very High'
                              ? 'bg-[#D32F2F] text-white'
                              : 'bg-[#FFF1F1] text-[#D32F2F] border border-[#D32F2F]/20'
                          }`}
                        >
                          {topic.examSignificance} Priority
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSyncWeakArea(material.courseCode, topic.title);
                          }}
                          className="text-[10px] font-bold text-[#6B7280] hover:text-[#D32F2F] flex items-center gap-1 p-1 rounded hover:bg-[#FFF1F1] transition-colors"
                          title="Track as Focus Area in Dashboard"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" />
                          Track Area
                        </button>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-[#E5E7EB] dark:border-neutral-800 space-y-2.5 text-xs bg-[#F8F8F8]/40 dark:bg-[#1a1a1a]/40">
                        {topic.subtopics && topic.subtopics.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#6B7280] tracking-wider block mb-1">
                              Subtopics Covered:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {topic.subtopics.map((st, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#252525] border border-[#E5E7EB] dark:border-neutral-700 text-[#171717] dark:text-neutral-200 text-[11px]"
                                >
                                  {st}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {topic.keyConcepts && topic.keyConcepts.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#6B7280] tracking-wider block mb-1">
                              Key Concepts for Exam:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {topic.keyConcepts.map((kc, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 rounded-lg bg-[#FFF1F1] dark:bg-[#281818] border border-[#D32F2F]/20 text-[#D32F2F] dark:text-[#EF4444] text-[11px] font-medium"
                                >
                                  {kc}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 4. DEFINITIONS & TERMINOLOGY */}
      {(activeTab === 'all' || activeTab === 'definitions') && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 rounded-full bg-[#D32F2F]" />
            <h3 className="text-xs font-black tracking-wider uppercase text-[#171717] dark:text-white">
              EXAM DEFINITIONS & TERMINOLOGY
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {notesData.definitions
              ?.filter((d) => matchesSearch(d.term + d.definition))
              .map((def) => (
                <div
                  key={def.id}
                  className="bg-white dark:bg-[#181818] rounded-2xl p-4 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-2 hover:border-[#D32F2F] transition-all"
                >
                  <h4 className="text-xs font-black text-[#D32F2F] dark:text-[#EF4444]">
                    {def.term}
                  </h4>
                  <p className="text-xs text-[#171717] dark:text-neutral-200 leading-relaxed">
                    {def.definition}
                  </p>
                  {def.examContext && (
                    <div className="text-[10px] text-[#6B7280] dark:text-neutral-400 bg-[#F8F8F8] dark:bg-[#222] p-2 rounded-lg border border-[#E5E7EB] dark:border-neutral-800">
                      <span className="font-bold text-[#171717] dark:text-white">
                        Exam Context:{' '}
                      </span>
                      {def.examContext}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 5. WORKED CALCULATION EXAMPLES */}
      {(activeTab === 'all' || activeTab === 'examples') && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#D32F2F]" />
            <h3 className="text-xs font-black tracking-wider uppercase text-[#171717] dark:text-white">
              WORKED EXAMPLES & CALCULATION STEPS
            </h3>
          </div>

          <div className="space-y-3">
            {notesData.workedExamples
              ?.filter((w) => matchesSearch(w.title + w.problem))
              .map((ex, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#181818] rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#171717] dark:text-white">
                      {ex.title}
                    </h4>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFF1F1] text-[#D32F2F] border border-[#D32F2F]/20">
                      Calculation Model
                    </span>
                  </div>

                  {/* Problem statement */}
                  <div className="p-3 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-700 text-xs text-[#171717] dark:text-neutral-200">
                    <span className="font-bold text-[#D32F2F] block mb-1">Problem:</span>
                    {ex.problem}
                  </div>

                  {/* Step by step solution */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#6B7280]">
                      Solution Steps:
                    </span>
                    {ex.stepByStepSolution.map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className="text-xs text-[#171717] dark:text-neutral-300 pl-3 border-l-2 border-[#D32F2F] py-0.5 font-mono"
                      >
                        {step}
                      </div>
                    ))}
                  </div>

                  {/* Final answer */}
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Final Result: {ex.finalAnswer}
                  </div>

                  {/* Key trick */}
                  {ex.keyTrick && (
                    <div className="flex items-start gap-1.5 text-[11px] text-[#D32F2F] bg-[#FFF1F1] dark:bg-[#251515] p-2.5 rounded-xl font-medium">
                      <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{ex.keyTrick}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 6. EXAM PITFALLS & TRAPS */}
      {(activeTab === 'all' || activeTab === 'pitfalls') && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#D32F2F]" />
            <h3 className="text-xs font-black tracking-wider uppercase text-[#171717] dark:text-white">
              FREQUENT EXAM PITFALLS & MARK LOSERS
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {notesData.examPitfalls
              ?.filter((p) => matchesSearch(p.pitfall + p.advice))
              .map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#181818] rounded-2xl p-4 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-2 hover:border-[#D32F2F] transition-all"
                >
                  <div className="flex items-start gap-2 text-xs font-bold text-[#D32F2F] dark:text-[#EF4444]">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{item.pitfall}</span>
                  </div>
                  <div className="text-xs text-[#171717] dark:text-neutral-300 bg-[#F8F8F8] dark:bg-[#202020] p-2.5 rounded-xl border border-[#E5E7EB] dark:border-neutral-700">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                      How to Avoid:
                    </span>
                    {item.advice}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Bottom CTA to start interactive test */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h4 className="text-xs sm:text-sm font-black text-[#171717] dark:text-white">
            Ready to test your comprehension?
          </h4>
          <p className="text-xs text-[#6B7280]">
            Take an interactive quiz or sit the timed mock paper generated directly from this document.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onStartQuiz}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-black shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Start Quiz ({material.quizData?.length || 0})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
