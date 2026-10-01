import React, { useState } from 'react';
import { WeightSettings } from '../types/dashboard';
import { Sliders } from 'lucide-react';

interface DailyProgressBarProps {
  progress: {
    overall: number;
    academics: number;
    spiritual: number;
    reading: number;
    communication: number;
    skills: number;
    digitalDiscipline: number;
  };
  weights: WeightSettings;
  onUpdateWeights: (newWeights: WeightSettings) => void;
}

export const DailyProgressBar: React.FC<DailyProgressBarProps> = ({
  progress,
  weights,
  onUpdateWeights,
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [localWeights, setLocalWeights] = useState<WeightSettings>(weights);

  // Red + White + Charcoal palette with restrained secondary blue/green
  const categories = [
    { label: 'Academics (Primary)', score: progress.academics, weight: weights.academics, color: 'bg-[#D32F2F] dark:bg-[#EF4444]' },
    { label: 'Spiritual / Wellbeing', score: progress.spiritual, weight: weights.spiritual, color: 'bg-emerald-600 dark:bg-emerald-500' },
    { label: 'Self-Dev Reading', score: progress.reading, weight: weights.reading, color: 'bg-[#2563EB]' },
    { label: 'Communication Practice', score: progress.communication, weight: weights.communication, color: 'bg-neutral-700 dark:bg-neutral-400' },
    { label: 'Skill Maintenance', score: progress.skills, weight: weights.skills, color: 'bg-neutral-600 dark:bg-neutral-400' },
    { label: 'Digital Discipline', score: progress.digitalDiscipline, weight: weights.digitalDiscipline, color: 'bg-[#171717] dark:bg-neutral-300' },
  ];

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWeights(localWeights);
    setShowConfig(false);
  };

  return (
    <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_1px_4px_rgba(0,0,0,0.03)] transition-colors">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
            <h2 className="text-base sm:text-lg font-black tracking-tight text-[#171717] dark:text-white">
              TODAY'S PROGRESS
            </h2>
          </div>
          <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5 font-medium">
            Weighted academic system ({weights.academics}% priority)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[#D32F2F] dark:text-[#EF4444] tabular-nums">
            {progress.overall}%
          </span>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 text-neutral-400 hover:text-[#171717] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
            title="Configure category weight percentages"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Composite Progress Bar in Brand Red */}
      <div className="h-3 w-full bg-[#E5E7EB] dark:bg-[#222222] rounded-full overflow-hidden mb-4 p-0.5 border border-[#E5E7EB] dark:border-neutral-700/60 flex">
        <div
          className="h-full bg-[#D32F2F] dark:bg-[#EF4444] rounded-full transition-all duration-500 shadow-xs"
          style={{ width: `${Math.min(100, Math.max(0, progress.overall))}%` }}
        />
      </div>

      {/* Detailed Category Bars */}
      <div className="space-y-2.5 text-xs">
        {categories.map((cat) => (
          <div key={cat.label} className="space-y-1">
            <div className="flex justify-between items-center text-[#6B7280] dark:text-[#A3A3A3]">
              <span className="font-semibold text-[#171717] dark:text-neutral-200 flex items-center gap-1.5">
                <span className="text-[11px] text-neutral-400 font-mono">({cat.weight}%)</span>
                <span>{cat.label}</span>
              </span>
              <span className="font-mono tabular-nums font-bold text-[#171717] dark:text-white">
                {cat.score}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#E5E7EB] dark:bg-[#222222] rounded-full overflow-hidden">
              <div
                className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.max(0, cat.score))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Weight Config Modal */}
      {showConfig && (
        <form
          onSubmit={handleSaveWeights}
          className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-neutral-800 space-y-3 text-xs"
        >
          <div className="font-bold text-[#171717] dark:text-white flex items-center justify-between">
            <span>Configure Category Weights (%)</span>
            <span className="text-[#6B7280] font-mono text-[11px]">
              Sum: {Object.values(localWeights).reduce((a, b) => a + b, 0)}%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] text-[#6B7280] dark:text-neutral-400 mb-1 font-semibold">Academics</label>
              <input
                type="number"
                min="50"
                max="90"
                value={localWeights.academics}
                onChange={(e) => setLocalWeights({ ...localWeights, academics: Number(e.target.value) })}
                className="w-full px-2 py-1 border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818] rounded font-mono font-bold text-[#D32F2F] dark:text-[#EF4444]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#6B7280] dark:text-neutral-400 mb-1 font-semibold">Spiritual</label>
              <input
                type="number"
                min="0"
                max="25"
                value={localWeights.spiritual}
                onChange={(e) => setLocalWeights({ ...localWeights, spiritual: Number(e.target.value) })}
                className="w-full px-2 py-1 border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818] rounded font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#6B7280] dark:text-neutral-400 mb-1 font-semibold">Reading</label>
              <input
                type="number"
                min="0"
                max="20"
                value={localWeights.reading}
                onChange={(e) => setLocalWeights({ ...localWeights, reading: Number(e.target.value) })}
                className="w-full px-2 py-1 border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818] rounded font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#6B7280] dark:text-neutral-400 mb-1 font-semibold">Communication</label>
              <input
                type="number"
                min="0"
                max="20"
                value={localWeights.communication}
                onChange={(e) => setLocalWeights({ ...localWeights, communication: Number(e.target.value) })}
                className="w-full px-2 py-1 border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818] rounded font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#6B7280] dark:text-neutral-400 mb-1 font-semibold">Skills</label>
              <input
                type="number"
                min="0"
                max="20"
                value={localWeights.skills}
                onChange={(e) => setLocalWeights({ ...localWeights, skills: Number(e.target.value) })}
                className="w-full px-2 py-1 border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818] rounded font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#6B7280] dark:text-neutral-400 mb-1 font-semibold">Digital Discipline</label>
              <input
                type="number"
                min="0"
                max="20"
                value={localWeights.digitalDiscipline}
                onChange={(e) => setLocalWeights({ ...localWeights, digitalDiscipline: Number(e.target.value) })}
                className="w-full px-2 py-1 border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818] rounded font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowConfig(false)}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-neutral-700 text-[#6B7280] dark:text-neutral-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white font-bold transition active:scale-[0.98]"
            >
              Apply Weights
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
