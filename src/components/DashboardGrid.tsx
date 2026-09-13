import React from 'react';
import {
  ActiveBatchIcon,
  BatchExpIcon,
  ChickenSalesIcon,
  EggStockIcon,
  EggSalesIcon,
  OtherRevenueIcon,
  DeadBirdsIcon,
  DealerIcon,
  BuyerIcon,
  VaccineIcon,
  OldBatchIcon,
  HowToRenewIcon,
  RenewIcon,
  WeightChartIcon,
  ReportIcon,
} from './icons/AppIcons';
import { Language, FarmMode, Batch } from '../types';
import { translations } from '../utils/i18n';
import { toBengaliNumber } from '../utils/banglaDate';

export type ModuleKey =
  | 'activeBatch'
  | 'batchExp'
  | 'chickenSales'
  | 'eggStock'
  | 'eggSales'
  | 'otherRevenue'
  | 'deadBirds'
  | 'dealer'
  | 'buyer'
  | 'vaccine'
  | 'oldBatch'
  | 'howToRenew'
  | 'renew'
  | 'weightChart'
  | 'reports';

interface DashboardGridProps {
  language: Language;
  farmMode: FarmMode;
  activeBatch?: Batch;
  onOpenModule: (key: ModuleKey) => void;
  onOpenWebsite: () => void;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  language,
  farmMode,
  activeBatch,
  onOpenModule,
  onOpenWebsite,
}) => {
  const t = translations[language];

  // Dynamic status text for subtitles
  const liveBirdCountStr = activeBatch
    ? `${language === 'bn' ? toBengaliNumber(activeBatch.currentBirds) : activeBatch.currentBirds} ${language === 'bn' ? 'পাখি' : 'birds'}`
    : language === 'bn' ? '১,৫৮০ পাখি' : '1,580 birds';

  const flockAgeDays = activeBatch
    ? Math.max(
        1,
        Math.floor(
          (new Date().getTime() - new Date(activeBatch.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      )
    : 28;

  // Build items list based on selected farmMode
  interface ModuleItem {
    id: string;
    key: ModuleKey;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    badge?: string;
  }

  const broilerModules: ModuleItem[] = [
    {
      id: 'module-active-batch',
      key: 'activeBatch',
      title: t.activeBatch,
      subtitle: `${liveBirdCountStr} • ${language === 'bn' ? `দিন ${toBengaliNumber(flockAgeDays)}` : `Day ${flockAgeDays}`}`,
      icon: <ActiveBatchIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-batch-exp',
      key: 'batchExp',
      title: t.batchExp,
      subtitle: language === 'bn' ? 'খাদ্য, ওষুধ ও বাচ্চা' : 'Feed, meds & chicks',
      icon: <BatchExpIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-chicken-sales',
      key: 'chickenSales',
      title: t.chickenSales,
      subtitle: language === 'bn' ? 'ব্রয়লার / কক কেজি দরে' : 'Broiler / Cock live sale',
      icon: <ChickenSalesIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-weight-chart',
      key: 'weightChart',
      title: language === 'bn' ? 'ওজন চার্ট ও বৃদ্ধি' : 'Weight & Growth',
      subtitle: language === 'bn' ? 'দৈনিক বৃদ্ধির গ্রাফ' : 'Daily weight curve',
      icon: <WeightChartIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
      badge: language === 'bn' ? 'নতুন' : 'New',
    },
    {
      id: 'module-dead-birds',
      key: 'deadBirds',
      title: t.deadBirds,
      subtitle: language === 'bn' ? 'দৈনিক মৃত্যুর হিসাব' : 'Daily mortality logger',
      icon: <DeadBirdsIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-vaccine',
      key: 'vaccine',
      title: t.vaccine,
      subtitle: language === 'bn' ? 'রুটিন টিকা ক্যালেন্ডার' : 'Vaccine schedule',
      icon: <VaccineIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-dealer',
      key: 'dealer',
      title: t.dealer,
      subtitle: language === 'bn' ? 'ফিড ও বাচ্চার বাকি' : 'Feed & chick suppliers',
      icon: <DealerIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-buyer',
      key: 'buyer',
      title: t.buyer,
      subtitle: language === 'bn' ? 'মুরগি পাইকারের বাকি' : 'Wholesalers & dues',
      icon: <BuyerIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-other-revenue',
      key: 'otherRevenue',
      title: t.otherRevenue,
      subtitle: language === 'bn' ? 'লিটার ও বস্তা বিক্রি' : 'Manure & sacks',
      icon: <OtherRevenueIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-reports',
      key: 'reports',
      title: language === 'bn' ? 'লাভ-ক্ষতি রিপোর্ট' : 'P&L Reports',
      subtitle: language === 'bn' ? 'আয়-ব্যয় ও ক্যাশ হিসাব' : 'Financial breakdown',
      icon: <ReportIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-old-batch',
      key: 'oldBatch',
      title: t.oldBatch,
      subtitle: language === 'bn' ? 'সংরক্ষিত পুরনো ব্যাচ' : 'Archived flocks',
      icon: <OldBatchIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-renew',
      key: 'renew',
      title: t.renew,
      subtitle: language === 'bn' ? 'প্যাকেজ ও মেয়াদ বৃদ্ধি' : 'Renew subscription',
      icon: <RenewIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
  ];

  const layerModules: ModuleItem[] = [
    {
      id: 'module-active-batch',
      key: 'activeBatch',
      title: t.activeBatch,
      subtitle: `${liveBirdCountStr} • ${language === 'bn' ? 'লেয়ার শেড' : 'Layer shed'}`,
      icon: <ActiveBatchIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-batch-exp',
      key: 'batchExp',
      title: t.batchExp,
      subtitle: language === 'bn' ? 'খাদ্য ও ওষুধ খরচ' : 'Layer feed & meds',
      icon: <BatchExpIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-egg-stock',
      key: 'eggStock',
      title: t.eggStock,
      subtitle: language === 'bn' ? '৩,২০০ টি স্টকে' : '3,200 pcs in stock',
      icon: <EggStockIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-egg-sales',
      key: 'eggSales',
      title: t.eggSales,
      subtitle: language === 'bn' ? 'কেস ও পিস পাইকারি' : 'Wholesale crates & pcs',
      icon: <EggSalesIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-chicken-sales',
      key: 'chickenSales',
      title: language === 'bn' ? 'লেয়ার বিক্রি (বয়লার)' : 'Cull Hen Sales',
      subtitle: language === 'bn' ? 'বয়স্ক মুরগি বিক্রয়' : 'Retired flock sale',
      icon: <ChickenSalesIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-dead-birds',
      key: 'deadBirds',
      title: t.deadBirds,
      subtitle: language === 'bn' ? 'দৈনিক মৃত্যুর হিসাব' : 'Daily mortality logger',
      icon: <DeadBirdsIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-vaccine',
      key: 'vaccine',
      title: t.vaccine,
      subtitle: language === 'bn' ? 'টিকা ও কৃমিনাশক' : 'Vaccine & deworming',
      icon: <VaccineIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-dealer',
      key: 'dealer',
      title: t.dealer,
      subtitle: language === 'bn' ? 'ফিড ডিলারের বাকি' : 'Feed dealers & dues',
      icon: <DealerIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-buyer',
      key: 'buyer',
      title: t.buyer,
      subtitle: language === 'bn' ? 'ডিম ক্রেতার বাকি' : 'Egg wholesalers',
      icon: <BuyerIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-other-revenue',
      key: 'otherRevenue',
      title: t.otherRevenue,
      subtitle: language === 'bn' ? 'লিটার ও বস্তা বিক্রি' : 'Manure & sacks',
      icon: <OtherRevenueIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-reports',
      key: 'reports',
      title: language === 'bn' ? 'লাভ-ক্ষতি রিপোর্ট' : 'P&L Reports',
      subtitle: language === 'bn' ? 'পূর্ণাঙ্গ খামার হিসাব' : 'Financial summary',
      icon: <ReportIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
    {
      id: 'module-renew',
      key: 'renew',
      title: t.renew,
      subtitle: language === 'bn' ? 'প্যাকেজ ও মেয়াদ বৃদ্ধি' : 'Renew subscription',
      icon: <RenewIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    },
  ];

  const currentModules = farmMode === 'broiler' ? broilerModules : layerModules;

  return (
    <div className="w-full px-3.5 pb-20 select-none">
      {/* Section Header (Matching Screenshot 1 & 2) */}
      <div className="flex items-center justify-between pt-2 pb-2.5">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#0E3D2F]">
            {language === 'bn' ? 'প্রধান সেবা ও হিসাবসমূহ' : 'Quick Actions'}
          </h3>
          <p className="text-[11px] text-[#557567]">
            {farmMode === 'broiler'
              ? language === 'bn' ? 'ব্রয়লার খামারের প্রয়োজনীয় মডিউল' : 'Broiler farm modules'
              : language === 'bn' ? 'লেয়ার খামারের প্রয়োজনীয় মডিউল' : 'Layer farm modules'}
          </p>
        </div>

        <span className="text-[11px] font-semibold text-[#0E3D2F] bg-[#E2EDE6] px-2.5 py-1 rounded-full border border-[#C6DDD0]">
          {language === 'bn' ? 'ট্যাপ করে ডাটা দিন' : 'Tap to manage'}
        </span>
      </div>

      {/* Grid of Cards (Matching the clean, modern card style with subtitles) */}
      <div className="grid grid-cols-3 gap-2.5">
        {currentModules.map((module) => (
          <button
            key={module.key}
            id={module.id}
            onClick={() => onOpenModule(module.key)}
            className="group relative bg-white rounded-2xl p-2.5 sm:p-3 border border-[#E6E2D5] hover:border-[#276F57] hover:shadow-sm active:scale-95 transition-all text-center flex flex-col items-center justify-between min-h-[105px] sm:min-h-[115px] focus:outline-none"
          >
            {/* Optional badge */}
            {module.badge && (
              <span className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-2xs">
                {module.badge}
              </span>
            )}

            {/* Icon */}
            <div className="transform group-hover:scale-105 transition-transform">
              {module.icon}
            </div>

            {/* Title & Subtitle */}
            <div className="mt-1 w-full leading-tight">
              <span className="block text-xs sm:text-[13px] font-bold text-[#1A3328] group-hover:text-[#0E3D2F] line-clamp-1">
                {module.title}
              </span>
              <span className="block text-[10px] text-[#557567] mt-0.5 font-normal line-clamp-1">
                {module.subtitle}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Secondary Quick Access Links: Old Batch & How to Renew */}
      <div className="grid grid-cols-2 gap-2 mt-2.5">
        <button
          id="quick-old-batch-button"
          onClick={() => onOpenModule('oldBatch')}
          className="bg-[#FAF8F2] hover:bg-[#F2EFE5] p-2 rounded-xl border border-[#E6E2D5] flex items-center space-x-2 text-left transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <span className="text-base">📁</span>
          </div>
          <div className="leading-tight">
            <span className="text-xs font-bold text-[#1A3328] block">
              {t.oldBatch}
            </span>
            <span className="text-[10px] text-[#557567]">
              {language === 'bn' ? 'পূর্ববর্তী সব ব্যাচের রেকর্ড' : 'All archived records'}
            </span>
          </div>
        </button>

        <button
          id="quick-how-to-renew-button"
          onClick={() => onOpenModule('howToRenew')}
          className="bg-[#FAF8F2] hover:bg-[#F2EFE5] p-2 rounded-xl border border-[#E6E2D5] flex items-center space-x-2 text-left transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
            <span className="text-base">▶️</span>
          </div>
          <div className="leading-tight">
            <span className="text-xs font-bold text-[#1A3328] block">
              {t.howToRenew}
            </span>
            <span className="text-[10px] text-[#557567]">
              {language === 'bn' ? 'ভিডিও ও টিউটোরিয়াল' : 'Tutorial video'}
            </span>
          </div>
        </button>
      </div>

      {/* Footer link matching screenshot: visit our website */}
      <div className="mt-4 pt-2 text-center select-none border-t border-[#E6E2D5]">
        <p className="text-xs text-[#557567] font-medium inline">
          {t.visitWebsite}{' '}
        </p>
        <button
          id="website-dashboard-link"
          onClick={onOpenWebsite}
          className="text-xs text-[#0E3D2F] font-bold underline hover:text-[#185A45] transition-colors focus:outline-none ml-1"
        >
          https://poultrykhata.com/dashboard
        </button>
      </div>
    </div>
  );
};
