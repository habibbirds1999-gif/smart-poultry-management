import React from 'react';
import { Calendar, Crown, Sparkles, ChevronRight } from 'lucide-react';
import { getFullFormattedHeaderDate, toBengaliNumber } from '../utils/banglaDate';
import { Language, Batch } from '../types';

interface TopBannerProps {
  daysLeft: number;
  language: Language;
  onRenewClick: () => void;
  activeBatch?: Batch;
}

export const TopBanner: React.FC<TopBannerProps> = ({
  daysLeft,
  language,
  onRenewClick,
  activeBatch,
}) => {
  const currentDateFormatted = getFullFormattedHeaderDate(new Date(), language);

  // Calculate age of active flock
  const flockAgeDays = activeBatch
    ? Math.max(
        1,
        Math.floor(
          (new Date().getTime() - new Date(activeBatch.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      )
    : 28;

  return (
    <div className="w-full select-none">
      {/* Warm Golden/Amber Subscription Banner matching Screenshot 2 */}
      <div className="bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#D97706] text-white py-1.5 px-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold truncate">
          <Crown className="w-3.5 h-3.5 text-amber-200 flex-shrink-0" />
          <span className="truncate">
            {language === 'bn'
              ? `স্বাগতম স্মার্ট পোল্ট্রিতে | মেয়াদের ${toBengaliNumber(daysLeft)} দিন বাকি আছে`
              : `Welcome to Smart Poultry | ${daysLeft} days left`}
          </span>
        </div>

        <button
          id="renew-pill-banner-button"
          onClick={onRenewClick}
          className="ml-2 flex-shrink-0 bg-white text-[#C2410C] hover:bg-amber-50 active:scale-95 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs transition-all border border-amber-200"
        >
          {language === 'bn' ? 'রিনিউ' : 'Renew'}
        </button>
      </div>

      {/* Date & Batch Status Strip matching Screenshot 2 */}
      <div className="bg-[#FAF8F2] border-b border-[#E8E4D8] px-3.5 py-1.5 flex items-center justify-between text-xs text-slate-700">
        <div className="flex items-center space-x-1.5 font-medium text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-[#0F4A38]" />
          <span>{currentDateFormatted}</span>
        </div>

        {activeBatch && (
          <span className="bg-[#E2EDE6] text-[#0E3D2F] font-semibold text-[11px] px-2 py-0.5 rounded-md border border-[#C6DDD0]">
            {activeBatch.batchNumber} (
            {language === 'bn' ? `দিন ${toBengaliNumber(flockAgeDays)}` : `Day ${flockAgeDays}`})
          </span>
        )}
      </div>
    </div>
  );
};
