import React from 'react';
import { Home, LineChart, Plus, FileSpreadsheet, Settings } from 'lucide-react';
import { Language, FarmMode } from '../types';

interface BottomNavBarProps {
  language: Language;
  farmMode: FarmMode;
  onOpenHome: () => void;
  onOpenWeightOrBatch: () => void;
  onQuickAdd: () => void;
  onOpenReports: () => void;
  onOpenSettings: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  language,
  farmMode,
  onOpenHome,
  onOpenWeightOrBatch,
  onQuickAdd,
  onOpenReports,
  onOpenSettings,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pointer-events-none">
      <div className="w-full max-w-md bg-white border-t border-[#E6E2D5] shadow-lg pointer-events-auto select-none px-2 py-1.5 flex items-center justify-around">
        {/* 1. Home */}
        <button
          id="bottom-nav-home"
          onClick={onOpenHome}
          className="flex flex-col items-center justify-center p-1 text-[#0E3D2F] hover:opacity-80 active:scale-95 transition-all focus:outline-none"
        >
          <Home className="w-5 h-5 text-[#0E3D2F]" />
          <span className="text-[10px] font-bold mt-0.5 text-[#0E3D2F]">
            {language === 'bn' ? 'হোম' : 'Home'}
          </span>
        </button>

        {/* 2. Weight & Growth / Batch */}
        <button
          id="bottom-nav-weight"
          onClick={onOpenWeightOrBatch}
          className="flex flex-col items-center justify-center p-1 text-[#557567] hover:text-[#0E3D2F] active:scale-95 transition-all focus:outline-none"
        >
          <LineChart className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">
            {farmMode === 'broiler'
              ? language === 'bn' ? 'ওজন চার্ট' : 'Weight'
              : language === 'bn' ? 'ডিম ও ব্যাচ' : 'Batch'}
          </span>
        </button>

        {/* 3. Central Quick Add Button */}
        <div className="relative -top-4 flex flex-col items-center">
          <button
            id="bottom-nav-quick-add"
            onClick={onQuickAdd}
            className="w-12 h-12 rounded-full bg-[#0E3D2F] text-white flex items-center justify-center shadow-md border-2 border-white hover:bg-[#16503E] active:scale-90 transition-all focus:outline-none"
            title={language === 'bn' ? 'দ্রুত এন্ট্রি যোগ করুন' : 'Quick Entry'}
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[9px] font-bold text-[#0E3D2F] mt-0.5">
            {language === 'bn' ? 'হিসাব যোগ' : 'Quick Add'}
          </span>
        </div>

        {/* 4. Reports */}
        <button
          id="bottom-nav-reports"
          onClick={onOpenReports}
          className="flex flex-col items-center justify-center p-1 text-[#557567] hover:text-[#0E3D2F] active:scale-95 transition-all focus:outline-none"
        >
          <FileSpreadsheet className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">
            {language === 'bn' ? 'রিপোর্ট' : 'Reports'}
          </span>
        </button>

        {/* 5. Settings */}
        <button
          id="bottom-nav-settings"
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center p-1 text-[#557567] hover:text-[#0E3D2F] active:scale-95 transition-all focus:outline-none"
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">
            {language === 'bn' ? 'সেটিংস' : 'Settings'}
          </span>
        </button>
      </div>
    </div>
  );
};
