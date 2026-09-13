import React from 'react';
import { X, Scale, DollarSign, ShoppingBag, Skull, Egg, Syringe, Sparkles } from 'lucide-react';
import { Language, FarmMode } from '../../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  farmMode: FarmMode;
  onSelectAction: (actionKey: string) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  language,
  farmMode,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  const handleAction = (key: string) => {
    onClose();
    onSelectAction(key);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-[#E6E2D5] animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D5]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#0E3D2F] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0E3D2F]">
                {language === 'bn' ? 'দ্রুত ডাটা এন্ট্রি' : 'Quick Data Entry'}
              </h3>
              <p className="text-xs text-[#557567]">
                {language === 'bn' ? 'কোন হিসাবটি লিখতে চান?' : 'What would you like to record?'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-4">
          {/* 1. Weight Log (Broiler) or Egg Entry (Layer) */}
          {farmMode === 'broiler' ? (
            <button
              onClick={() => handleAction('activeBatch')}
              className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#FAF8F2] hover:bg-[#F2EFE5] border border-[#E6E2D5] text-left transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1A3328] block">
                  {language === 'bn' ? 'দৈনিক গড় ওজন' : 'Weight Log'}
                </span>
                <span className="text-[10px] text-[#557567]">
                  {language === 'bn' ? 'ওজন ও ফিড আপডেট' : 'Update flock weight'}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => handleAction('eggStock')}
              className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#FAF8F2] hover:bg-[#F2EFE5] border border-[#E6E2D5] text-left transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                <Egg className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1A3328] block">
                  {language === 'bn' ? 'আজকের ডিম সংগ্রহ' : 'Egg Collection'}
                </span>
                <span className="text-[10px] text-[#557567]">
                  {language === 'bn' ? 'সকাল ও বিকালের ডিম' : 'Morning & evening'}
                </span>
              </div>
            </button>
          )}

          {/* 2. Expense */}
          <button
            onClick={() => handleAction('batchExp')}
            className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#FAF8F2] hover:bg-[#F2EFE5] border border-[#E6E2D5] text-left transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-red-100 text-red-800 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1A3328] block">
                {language === 'bn' ? 'নতুন খরচ' : 'Add Expense'}
              </span>
              <span className="text-[10px] text-[#557567]">
                {language === 'bn' ? 'খাবার, ওষুধ বা বিদ্যুৎ' : 'Feed, medicine, etc.'}
              </span>
            </div>
          </button>

          {/* 3. Chicken Sales or Egg Sales */}
          {farmMode === 'broiler' ? (
            <button
              onClick={() => handleAction('chickenSales')}
              className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#FAF8F2] hover:bg-[#F2EFE5] border border-[#E6E2D5] text-left transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1A3328] block">
                  {language === 'bn' ? 'মুরগি বিক্রয়' : 'Chicken Sale'}
                </span>
                <span className="text-[10px] text-[#557567]">
                  {language === 'bn' ? 'কেজি ও দর অনুযায়ী' : 'Live weight & rate'}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => handleAction('eggSales')}
              className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#FAF8F2] hover:bg-[#F2EFE5] border border-[#E6E2D5] text-left transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1A3328] block">
                  {language === 'bn' ? 'ডিম বিক্রয়' : 'Egg Sale'}
                </span>
                <span className="text-[10px] text-[#557567]">
                  {language === 'bn' ? 'কেস ও পিস পাইকারি' : 'Crates & piece sales'}
                </span>
              </div>
            </button>
          )}

          {/* 4. Dead Birds */}
          <button
            onClick={() => handleAction('deadBirds')}
            className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#FAF8F2] hover:bg-[#F2EFE5] border border-[#E6E2D5] text-left transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center flex-shrink-0">
              <Skull className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1A3328] block">
                {language === 'bn' ? 'আজকের মৃত্যু' : 'Dead Birds'}
              </span>
              <span className="text-[10px] text-[#557567]">
                {language === 'bn' ? 'সংখ্যা ও কারণ লিখুন' : 'Mortality & cause'}
              </span>
            </div>
          </button>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#FAF8F2] hover:bg-[#EAE7DC] text-[#1A3328] text-xs font-bold rounded-xl border border-[#E6E2D5] transition-colors"
        >
          {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
        </button>
      </div>
    </div>
  );
};
