import React, { useState } from 'react';
import { QuoteItem } from '../types/dashboard';
import { NATURE_IMAGES } from '../data/defaultData';
import { Compass, BookOpen, Sparkles, RefreshCw } from 'lucide-react';

interface HourlyQuoteCardProps {
  quote: QuoteItem;
  currentHour: number;
}

export const HourlyQuoteCard: React.FC<HourlyQuoteCardProps> = ({ quote, currentHour }) => {
  const [showReflectionPrompt, setShowReflectionPrompt] = useState(false);

  // Format hour for display, e.g. "8:00 AM"
  const startHourFormatted = new Date(0, 0, 0, currentHour).toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  });

  const bgSrc =
    quote.bgUrl?.includes('sunrise') || quote.bgAtmosphere?.toLowerCase().includes('sun') || quote.bgAtmosphere?.toLowerCase().includes('dawn')
      ? NATURE_IMAGES.sunrise
      : quote.bgUrl?.includes('lake') || quote.bgAtmosphere?.toLowerCase().includes('lake') || quote.bgAtmosphere?.toLowerCase().includes('forest')
      ? NATURE_IMAGES.lake
      : quote.bgUrl?.includes('ocean') || quote.bgAtmosphere?.toLowerCase().includes('ocean') || quote.bgAtmosphere?.toLowerCase().includes('wave') || quote.bgAtmosphere?.toLowerCase().includes('sea')
      ? NATURE_IMAGES.ocean
      : quote.bgUrl?.includes('star') || quote.bgAtmosphere?.toLowerCase().includes('star') || quote.bgAtmosphere?.toLowerCase().includes('night') || quote.bgAtmosphere?.toLowerCase().includes('sky')
      ? NATURE_IMAGES.stars
      : quote.bgUrl || NATURE_IMAGES.sunrise;

  return (
    <div className="bg-white dark:bg-[#181818] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E7EB] dark:border-neutral-800 transition-all">
      {/* Subtle nature header preview banner */}
      <div className="relative h-20 sm:h-24 w-full overflow-hidden bg-neutral-900">
        <img
          src={bgSrc}
          alt={quote.bgAtmosphere || 'Nature background'}
          className="w-full h-full object-cover opacity-85 scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        
        {/* Top Header pill overlay on banner */}
        <div className="absolute inset-0 p-3 sm:p-4 flex items-center justify-between text-[11px] font-bold tracking-wider uppercase text-white">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] shadow-xs shadow-red-500/80" />
            <Compass className="w-3.5 h-3.5 text-[#EF4444]" />
            <span className="text-white font-extrabold text-[10px] sm:text-[11px]">HOURLY DISCIPLINE</span>
            <span className="text-white/60">·</span>
            <span className="text-white/90 font-medium text-[10px] sm:text-[11px]">{quote.bgAtmosphere || 'Focus'}</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 font-bold">
            <RefreshCw className="w-3 h-3 text-[#EF4444]" />
            <span>Hour {startHourFormatted}</span>
          </div>
        </div>
      </div>

      {/* Main Quote Content on Crisp White Background */}
      <div className="p-5 sm:p-6 text-[#171717] dark:text-white flex flex-col justify-between">
        {/* The Verified Quotation with Red Accent line */}
        <div className="border-l-3 border-[#D32F2F] dark:border-[#EF4444] pl-3.5 sm:pl-4 py-0.5">
          <blockquote className="text-sm sm:text-base md:text-lg font-semibold leading-relaxed tracking-tight text-[#171717] dark:text-neutral-100">
            "{quote.quote}"
          </blockquote>

          {/* Attribution & Book Source with Red accent */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="font-extrabold text-[#D32F2F] dark:text-[#EF4444] tracking-wide">
              — {quote.author}
            </span>
            {quote.source && (
              <>
                <span className="text-[#6B7280] dark:text-neutral-500">/</span>
                <span className="text-[#6B7280] dark:text-[#A3A3A3] italic flex items-center gap-1 font-medium">
                  <BookOpen className="w-3 h-3 text-[#6B7280] dark:text-[#A3A3A3] inline" />
                  {quote.source}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Bottom subtle actions */}
        <div className="mt-4 pt-3 border-t border-[#E5E7EB] dark:border-neutral-800 flex items-center justify-between text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">
          <span className="truncate">Refreshes automatically every hour</span>
          <button
            onClick={() => setShowReflectionPrompt(!showReflectionPrompt)}
            className="text-[#D32F2F] dark:text-[#EF4444] hover:text-[#B71C1C] dark:hover:text-red-400 font-bold flex items-center gap-1 transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D32F2F] dark:text-[#EF4444]" />
            <span>{showReflectionPrompt ? 'Hide Reflection' : 'Reflect'}</span>
          </button>
        </div>

        {/* Reflection Drawer with Subtle Red Background */}
        {showReflectionPrompt && (
          <div className="mt-3 p-3.5 bg-[#FFF1F1] dark:bg-[#1F1717] rounded-xl border border-[#D32F2F]/20 dark:border-[#EF4444]/30 text-xs text-[#171717] dark:text-neutral-200 animate-in fade-in duration-200">
            <p className="font-bold text-[#D32F2F] dark:text-[#EF4444] mb-1">Personal Focus Check:</p>
            <p className="leading-relaxed text-[#171717] dark:text-neutral-200">
              "How does this principle apply to my current session in electrical engineering? What excuse am I tempted to make right now that this wisdom dismantles?"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
