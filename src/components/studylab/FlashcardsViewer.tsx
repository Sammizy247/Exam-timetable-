import React, { useState } from 'react';
import {
  Layers,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { StudyLabFlashcard, StudyLabMaterial } from '../../types/studyLab';

interface FlashcardsViewerProps {
  material: StudyLabMaterial;
  onUpdateMaterial: (updated: StudyLabMaterial) => void;
}

export const FlashcardsViewer: React.FC<FlashcardsViewerProps> = ({
  material,
  onUpdateMaterial,
}) => {
  const [cards, setCards] = useState<StudyLabFlashcard[]>(material.flashcards || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'needs-review' | 'mastered'>('all');

  const filteredCards = cards.filter((c) => {
    if (filterMode === 'needs-review') return !c.mastered;
    if (filterMode === 'mastered') return !!c.mastered;
    return true;
  });

  if (cards.length === 0) {
    return (
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-8 border border-[#E5E7EB] dark:border-neutral-800 text-center space-y-3">
        <Layers className="w-10 h-10 text-[#D32F2F] mx-auto" />
        <h3 className="text-base font-bold text-[#171717] dark:text-white">
          No Flashcards Generated
        </h3>
        <p className="text-xs text-[#6B7280]">
          Upload materials to create interactive revision flashcards.
        </p>
      </div>
    );
  }

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredCards.length - 1));
  const currentCard = filteredCards[safeIndex];

  const handleToggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (safeIndex < filteredCards.length - 1) {
      setCurrentIndex(safeIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
    } else {
      setCurrentIndex(filteredCards.length - 1);
    }
  };

  const handleToggleMastered = (cardId: string) => {
    const updatedCards = cards.map((c) =>
      c.id === cardId ? { ...c, mastered: !c.mastered } : c
    );
    setCards(updatedCards);
    onUpdateMaterial({
      ...material,
      flashcards: updatedCards,
    });
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const masteredCount = cards.filter((c) => c.mastered).length;

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#D32F2F] dark:text-[#EF4444]">
              {material.courseCode}
            </span>
            <span className="text-xs font-bold text-[#171717] dark:text-white">
              • Revision Flashcards
            </span>
          </div>
          <p className="text-xs text-[#6B7280]">
            Mastered: <span className="font-bold text-[#171717] dark:text-white">{masteredCount}</span> of {cards.length} cards
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#F8F8F8] dark:bg-[#222] p-1 rounded-xl border border-[#E5E7EB] dark:border-neutral-700 text-xs">
            <button
              onClick={() => {
                setFilterMode('all');
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-[#333] text-[#D32F2F] shadow-xs'
                  : 'text-[#6B7280]'
              }`}
            >
              All ({cards.length})
            </button>
            <button
              onClick={() => {
                setFilterMode('needs-review');
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterMode === 'needs-review'
                  ? 'bg-white dark:bg-[#333] text-[#D32F2F] shadow-xs'
                  : 'text-[#6B7280]'
              }`}
            >
              Review ({cards.length - masteredCount})
            </button>
            <button
              onClick={() => {
                setFilterMode('mastered');
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterMode === 'mastered'
                  ? 'bg-white dark:bg-[#333] text-emerald-600 shadow-xs'
                  : 'text-[#6B7280]'
              }`}
            >
              Mastered ({masteredCount})
            </button>
          </div>

          <button
            onClick={handleShuffle}
            className="p-2 rounded-xl bg-[#F8F8F8] dark:bg-[#222] border border-[#E5E7EB] dark:border-neutral-700 text-[#6B7280] hover:text-[#D32F2F] transition-colors"
            title="Shuffle cards"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-8 border border-[#E5E7EB] dark:border-neutral-800 text-center space-y-2">
          <p className="text-xs text-[#6B7280]">
            No cards found in this filter category.
          </p>
          <button
            onClick={() => setFilterMode('all')}
            className="text-xs font-bold text-[#D32F2F] underline"
          >
            Show All Cards
          </button>
        </div>
      ) : (
        /* INTERACTIVE 3D FLIP CARD */
        <div className="space-y-3">
          <div
            onClick={handleToggleFlip}
            className={`min-h-[260px] sm:min-h-[300px] w-full rounded-2xl p-6 sm:p-8 border transition-all cursor-pointer flex flex-col justify-between select-none relative shadow-[0_4px_20px_rgba(0,0,0,0.05)] ${
              isFlipped
                ? 'bg-[#FFF1F1] dark:bg-[#221515] border-[#D32F2F]/40'
                : 'bg-white dark:bg-[#181818] border-[#E5E7EB] dark:border-neutral-800 hover:border-[#D32F2F]'
            }`}
          >
            {/* Card top badge */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FFF1F1] dark:bg-[#2B1818] text-[#D32F2F] border border-[#D32F2F]/20">
                {currentCard.category || 'Core Concept'} • {currentCard.topic}
              </span>

              <span className="text-[11px] font-bold text-[#6B7280]">
                {safeIndex + 1} / {filteredCards.length}
              </span>
            </div>

            {/* Card Body */}
            <div className="py-6 text-center space-y-3">
              {!isFlipped ? (
                <div>
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
                    QUESTION / PROMPT
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#171717] dark:text-white leading-relaxed max-w-lg mx-auto">
                    {currentCard.front}
                  </h3>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] font-bold text-[#D32F2F] uppercase tracking-wider block mb-2">
                    ANSWER / EXPLANATION
                  </span>
                  <div className="text-xs sm:text-sm font-semibold text-[#171717] dark:text-neutral-100 whitespace-pre-line leading-relaxed max-w-lg mx-auto">
                    {currentCard.back}
                  </div>
                </div>
              )}
            </div>

            {/* Card Bottom helper */}
            <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
              <span className="flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" />
                Tap to flip card
              </span>

              {currentCard.mastered ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mastered
                </span>
              ) : (
                <span className="text-[#D32F2F] font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Needs Review
                </span>
              )}
            </div>
          </div>

          {/* Navigation & Mastery Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              className="p-3 rounded-xl bg-white dark:bg-[#181818] border border-[#E5E7EB] dark:border-neutral-800 text-[#171717] dark:text-white font-bold text-xs shadow-xs hover:border-[#D32F2F] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={() => handleToggleMastered(currentCard.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                currentCard.mastered
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-[#FFF1F1] text-[#D32F2F] border border-[#D32F2F]/30 hover:bg-[#D32F2F] hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {currentCard.mastered ? 'Marked as Mastered' : 'Mark as Mastered'}
            </button>

            <button
              onClick={handleNext}
              className="p-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
