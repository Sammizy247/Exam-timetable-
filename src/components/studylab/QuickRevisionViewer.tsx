import React, { useState } from 'react';
import {
  Zap,
  CheckSquare,
  Square,
  Copy,
  Printer,
  Sparkles,
  BookOpen,
  BookmarkCheck,
} from 'lucide-react';
import { StudyLabMaterial } from '../../types/studyLab';

interface QuickRevisionViewerProps {
  material: StudyLabMaterial;
  onSyncWeakArea?: (subject: string, topic: string) => void;
}

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export const QuickRevisionViewer: React.FC<QuickRevisionViewerProps> = ({ material }) => {
  const { notesData } = material;

  const defaultChecklist: ChecklistItem[] = [
    {
      id: 'c1',
      text: 'Memorized all transconductance (gm) and small-signal hybrid-pi equations',
      checked: false,
    },
    {
      id: 'c2',
      text: 'Reviewed stability factor S(Ico) derivation for voltage divider self-bias',
      checked: false,
    },
    {
      id: 'c3',
      text: 'Practiced 3 past examination calculation problems under timed conditions',
      checked: false,
    },
    {
      id: 'c4',
      text: 'Checked Op-Amp golden rules and non-inverting voltage gain derivations',
      checked: false,
    },
    {
      id: 'c5',
      text: 'Verified Miller capacitance calculation steps and upper 3dB cutoff frequency',
      checked: false,
    },
    {
      id: 'c6',
      text: 'Packed scientific calculator, student identification card, and exam pens',
      checked: false,
    },
  ];

  const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist);
  const [copied, setCopied] = useState(false);

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  };

  const handleCopySummary = () => {
    const text = `${material.courseCode} — QUICK REVISION
DEFINITIONS:
${notesData.definitions.map((d) => `• ${d.term}: ${d.definition}`).join('\n')}

FORMULAS:
${notesData.formulas.map((f) => `• ${f.name}: ${f.equation}`).join('\n')}

KEY CONCEPTS:
${notesData.keyTakeaways.map((k) => `• ${k}`).join('\n')}

EXAM PITFALLS:
${notesData.examPitfalls.map((p) => `• ${p.pitfall}: ${p.advice}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Header Strip */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFF1F1] text-[#D32F2F]">
              CONDENSED SHEET
            </span>
            <span className="text-xs text-[#6B7280]">Last-Minute Exam Preparation</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-[#171717] dark:text-white mt-0.5">
            {material.courseCode} — Quick Revision
          </h2>
          <p className="text-xs text-[#6B7280] dark:text-neutral-400">
            High-yield memory triggers, formula cheat sheet, and last-minute checklist.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-3.5 py-2 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] hover:bg-[#FFF1F1] text-xs font-bold text-[#171717] dark:text-white hover:text-[#D32F2F] border border-[#E5E7EB] dark:border-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>

      {/* Main Revision Sheet */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-7 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-6 text-xs">
        {/* 1. IMPORTANT DEFINITIONS */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-4 bg-[#D32F2F] rounded-full" />
            <h3 className="font-black text-[#D32F2F] uppercase tracking-wider text-xs">
              IMPORTANT DEFINITIONS
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {notesData.definitions.map((def) => (
              <div
                key={def.id}
                className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-800"
              >
                <div className="font-bold text-[#171717] dark:text-white text-xs mb-1">
                  • {def.term}
                </div>
                <p className="text-[#6B7280] dark:text-neutral-300 leading-relaxed text-[11px]">
                  {def.definition}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. IMPORTANT FORMULAS */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-4 bg-[#D32F2F] rounded-full" />
            <h3 className="font-black text-[#D32F2F] uppercase tracking-wider text-xs">
              IMPORTANT FORMULAS
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {notesData.formulas.map((f) => (
              <div
                key={f.id}
                className="p-3.5 rounded-xl bg-[#FFF1F1] dark:bg-[#D32F2F]/10 border border-[#D32F2F]/20 font-mono"
              >
                <div className="text-[11px] font-bold text-[#D32F2F]">{f.name}</div>
                <div className="text-sm font-black text-[#171717] dark:text-white my-1">
                  {f.equation}
                </div>
                <div className="text-[10px] font-sans text-[#6B7280] dark:text-neutral-400">
                  {f.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. KEY CONCEPTS */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-4 bg-[#D32F2F] rounded-full" />
            <h3 className="font-black text-[#D32F2F] uppercase tracking-wider text-xs">
              KEY CONCEPTS
            </h3>
          </div>
          <div className="p-4 rounded-xl bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-800 space-y-2">
            {notesData.keyTakeaways.map((takeaway, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] mt-1.5 shrink-0" />
                <span className="text-[#171717] dark:text-neutral-200 leading-relaxed font-medium">
                  {takeaway}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. COMMON EXAM AREAS */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-4 bg-[#D32F2F] rounded-full" />
            <h3 className="font-black text-[#D32F2F] uppercase tracking-wider text-xs">
              COMMON EXAM AREAS & PITFALLS
            </h3>
          </div>
          <div className="space-y-2">
            {notesData.examPitfalls.map((pit, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60"
              >
                <div className="font-bold text-amber-900 dark:text-amber-300 mb-0.5">
                  Pitfall: {pit.pitfall}
                </div>
                <div className="text-[11px] text-amber-800 dark:text-amber-400">
                  Advice: {pit.advice}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. LAST-MINUTE CHECKLIST */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-4 bg-[#D32F2F] rounded-full" />
            <h3 className="font-black text-[#D32F2F] uppercase tracking-wider text-xs">
              LAST-MINUTE CHECKLIST
            </h3>
          </div>
          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all select-none ${
                  item.checked
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                    : 'bg-white dark:bg-[#181818] border-[#E5E7EB] dark:border-neutral-700 hover:border-[#D32F2F]'
                }`}
              >
                {item.checked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-[#6B7280] shrink-0" />
                )}
                <span
                  className={`text-xs ${
                    item.checked
                      ? 'line-through text-[#6B7280]'
                      : 'font-semibold text-[#171717] dark:text-white'
                  }`}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
