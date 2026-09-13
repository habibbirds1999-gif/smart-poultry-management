import React from 'react';
import {
  Scale,
  TrendingUp,
  Skull,
  CircleDollarSign,
  Egg,
  Syringe,
  ChevronRight,
  ShieldCheck,
  PackageCheck,
  ChevronDown,
} from 'lucide-react';
import { Batch, ExpenseRecord, ChickenSaleRecord, EggStockEntry, EggSaleRecord, DeadBirdRecord, VaccineScheduleItem, FarmMode, Language } from '../types';
import { toBengaliNumber } from '../utils/banglaDate';

interface FarmOverviewWidgetProps {
  farmMode: FarmMode;
  onSelectFarmMode: (mode: FarmMode) => void;
  activeBatch?: Batch;
  batches: Batch[];
  expenses: ExpenseRecord[];
  chickenSales: ChickenSaleRecord[];
  eggStock: EggStockEntry[];
  eggSales: EggSaleRecord[];
  deadBirds: DeadBirdRecord[];
  vaccines: VaccineScheduleItem[];
  language: Language;
  onOpenBatchModal: () => void;
  onOpenVaccineModal: () => void;
}

export const FarmOverviewWidget: React.FC<FarmOverviewWidgetProps> = ({
  farmMode,
  onSelectFarmMode,
  activeBatch,
  batches,
  expenses,
  chickenSales,
  eggStock,
  eggSales,
  deadBirds,
  vaccines,
  language,
  onOpenBatchModal,
  onOpenVaccineModal,
}) => {
  // Calculations for current active flock
  const activeBatchId = activeBatch?.id;

  // Active batch financial metrics
  const batchExpenses = expenses
    .filter((e) => !activeBatchId || e.batchId === activeBatchId)
    .reduce((sum, e) => sum + e.amount, 0);

  const batchChickenSales = chickenSales
    .filter((s) => !activeBatchId || s.batchId === activeBatchId)
    .reduce((sum, s) => sum + s.totalAmount, 0);

  const batchEggSales = eggSales.reduce((sum, s) => sum + s.totalAmount, 0);

  const totalIncome = farmMode === 'broiler' ? batchChickenSales : batchEggSales + batchChickenSales;
  const netProfit = totalIncome - batchExpenses;

  // Today's date YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Today's specific metrics
  const todayMortality = deadBirds
    .filter((d) => d.date === todayStr)
    .reduce((sum, d) => sum + d.count, 0);

  const todayEggsCollected = eggStock
    .filter((e) => e.date === todayStr)
    .reduce((sum, e) => sum + e.netGoodEggs, 0);

  const totalEggStockPcs =
    eggStock.reduce((sum, e) => sum + e.netGoodEggs, 0) -
    eggSales.reduce((sum, s) => sum + s.totalEggs, 0);

  // Flock age
  const flockAgeDays = activeBatch
    ? Math.max(
        1,
        Math.floor(
          (new Date().getTime() - new Date(activeBatch.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      )
    : 28;

  // Upcoming vaccine
  const nextVaccine = vaccines.find((v) => !v.isCompleted && v.dayNumber >= flockAgeDays) || vaccines[0];

  // Layer production rate calculation (e.g. 1450 eggs from 1580 hens = ~92%)
  const liveHens = activeBatch?.currentBirds || 1580;
  const layRatePercent = liveHens > 0 ? Math.min(100, Math.round((todayEggsCollected / liveHens) * 100)) : 92;

  // Format currency
  const formatMoney = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('en-IN');
    const symbol = '৳ ';
    return language === 'bn' ? `${symbol}${toBengaliNumber(formatted)}` : `${symbol}${formatted}`;
  };

  return (
    <div className="w-full px-3.5 pt-3 pb-2 space-y-3">
      {/* 1. Farm Mode Switcher: Broiler vs Layer (The user's key request) */}
      <div className="bg-[#FAF8F2] p-1.5 rounded-2xl border border-[#E6E2D5] shadow-2xs">
        <div className="text-[11px] font-semibold text-[#1A3328] px-2 pt-0.5 pb-1 flex items-center justify-between">
          <span>{language === 'bn' ? 'খামারের ধরণ নির্বাচন করুন:' : 'Select Farm / Batch Mode:'}</span>
          <span className="text-[10px] text-[#557567] bg-[#E2EDE6] px-2 py-0.2 rounded-full font-medium">
            {farmMode === 'broiler'
              ? language === 'bn' ? 'ব্রয়লার মোড (ডিম হিসাব বন্ধ)' : 'Broiler (Egg tracking off)'
              : language === 'bn' ? 'লেয়ার মোড (ডিম হিসাব চালু)' : 'Layer (Egg tracking on)'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {/* Broiler Mode Button */}
          <button
            id="farm-mode-broiler-button"
            type="button"
            onClick={() => onSelectFarmMode('broiler')}
            className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all focus:outline-none ${
              farmMode === 'broiler'
                ? 'bg-[#0E3D2F] text-white shadow-sm border border-[#16503E]'
                : 'bg-white text-[#2D4539] hover:bg-slate-50 border border-[#E6E2D5]'
            }`}
          >
            <span className="text-base sm:text-lg">🍗</span>
            <div className="text-left leading-tight">
              <div>{language === 'bn' ? 'ব্রয়লার খামার' : 'Broiler Farm'}</div>
              <div className="text-[10px] font-normal opacity-80">
                {language === 'bn' ? 'মাংসের মুরগি (ডিম ছাড়া)' : 'Meat Birds only'}
              </div>
            </div>
          </button>

          {/* Layer Mode Button */}
          <button
            id="farm-mode-layer-button"
            type="button"
            onClick={() => onSelectFarmMode('layer')}
            className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all focus:outline-none ${
              farmMode === 'layer'
                ? 'bg-[#0E3D2F] text-white shadow-sm border border-[#16503E]'
                : 'bg-white text-[#2D4539] hover:bg-slate-50 border border-[#E6E2D5]'
            }`}
          >
            <span className="text-base sm:text-lg">🥚</span>
            <div className="text-left leading-tight">
              <div>{language === 'bn' ? 'লেয়ার খামার' : 'Layer Farm'}</div>
              <div className="text-[10px] font-normal opacity-80">
                {language === 'bn' ? 'ডিমের মুরগি ও ডিম হিসাব' : 'Egg production & sales'}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Season/Batch Overview Card (Matching Screenshot 1 "Your season at a glance") */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6E2D5] shadow-xs">
        {/* Header: Profit Title and Active Batch Selector Pill */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#527063]">
            {farmMode === 'broiler'
              ? language === 'bn' ? 'চলতি ব্যাচ · সম্ভাব্য লাভ' : 'This batch · profit'
              : language === 'bn' ? 'চলতি মাস · লাভ' : 'This month · profit'}
          </span>

          <button
            onClick={onOpenBatchModal}
            className="flex items-center space-x-1 text-[11px] font-semibold bg-[#FAF8F2] text-[#1A3328] px-2.5 py-1 rounded-full border border-[#E6E2D5] hover:bg-[#F2EFE5] transition-colors"
          >
            <span>
              {activeBatch
                ? `${activeBatch.batchNumber}`
                : language === 'bn' ? 'ব্যাচ-০১' : 'Batch-01'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#527063]" />
          </button>
        </div>

        {/* Large Bold Net Profit (Matching Screenshot 1 large figure ₹1,20,878) */}
        <div className="mt-1.5 mb-3">
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0E3D2F] tracking-tight">
            {netProfit >= 0 ? formatMoney(netProfit) : `-${formatMoney(Math.abs(netProfit))}`}
          </div>
        </div>

        {/* Split Sub-Cards for Income and Expense (Matching Screenshot 1) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Income Card */}
          <div className="bg-[#FAF8F2] p-2.5 rounded-xl border border-[#EAE7DC]">
            <div className="text-[10px] font-bold text-[#557567] tracking-wider uppercase">
              {language === 'bn' ? 'মোট আয়' : 'INCOME'}
            </div>
            <div className="text-sm sm:text-base font-extrabold text-[#0D6840] mt-0.5">
              {formatMoney(totalIncome)}
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-[#FAF8F2] p-2.5 rounded-xl border border-[#EAE7DC]">
            <div className="text-[10px] font-bold text-[#8A5650] tracking-wider uppercase">
              {language === 'bn' ? 'মোট খরচ' : 'EXPENSE'}
            </div>
            <div className="text-sm sm:text-base font-extrabold text-[#C53030] mt-0.5">
              {formatMoney(batchExpenses)}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mobile Live Widget Preview (Matching Screenshot 2's Dark Green Card) */}
      <div className="bg-[#0B3528] rounded-2xl p-3.5 text-white shadow-md border border-[#16503E] select-none">
        {/* Widget Top Title */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#16503E]">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-[#145E47] flex items-center justify-center">
              {farmMode === 'broiler' ? (
                <Scale className="w-3.5 h-3.5 text-[#86EFAC]" />
              ) : (
                <Egg className="w-3.5 h-3.5 text-[#FDE047]" />
              )}
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
              {language === 'bn' ? 'পোল্ট্রিখাতা লাইভ উইজেট' : 'Poultry Khata Live Widget'}
            </h4>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#124B3A] text-[#86EFAC] px-2 py-0.5 rounded-full text-[10px] font-semibold border border-[#1D6C54]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{language === 'bn' ? 'সচল (LIVE)' : 'ACTIVE'}</span>
          </div>
        </div>

        {/* 4 Metric Cards inside Live Widget */}
        <div className="grid grid-cols-2 gap-2">
          {/* Card 1: If Broiler -> Average Weight; If Layer -> Today's Egg Collection */}
          {farmMode === 'broiler' ? (
            <div className="bg-[#0E4233] p-2.5 rounded-xl border border-[#185A45]">
              <div className="flex items-center space-x-1 text-[11px] text-[#A3C7B6] font-medium">
                <Scale className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'bn' ? 'গড় দৈহিক ওজন' : 'Avg Weight'}</span>
              </div>
              <div className="mt-1 text-base sm:text-lg font-bold text-white">
                {language === 'bn'
                  ? `${toBengaliNumber((activeBatch?.currentAvgWeightKg || 1.45).toFixed(2))} কেজি`
                  : `${(activeBatch?.currentAvgWeightKg || 1.45).toFixed(2)} kg`}
              </div>
              <div className="text-[10px] text-emerald-300 font-medium mt-0.5">
                {language === 'bn' ? '↑ লক্ষ্যমাত্রা মান বজায় আছে' : '↑ On standard target'}
              </div>
            </div>
          ) : (
            <div className="bg-[#0E4233] p-2.5 rounded-xl border border-[#185A45]">
              <div className="flex items-center space-x-1 text-[11px] text-[#A3C7B6] font-medium">
                <Egg className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'bn' ? 'আজকের ডিম' : "Today's Egg"}</span>
              </div>
              <div className="mt-1 text-base sm:text-lg font-bold text-white">
                {language === 'bn'
                  ? `${toBengaliNumber(todayEggsCollected || 1450)} টি`
                  : `${todayEggsCollected || 1450} pcs`}
              </div>
              <div className="text-[10px] text-emerald-300 font-medium mt-0.5">
                {language === 'bn'
                  ? `↑ ${toBengaliNumber(layRatePercent)}% প্রোডাকশন হার`
                  : `↑ ${layRatePercent}% laying rate`}
              </div>
            </div>
          )}

          {/* Card 2: Total Live Birds */}
          <div className="bg-[#0E4233] p-2.5 rounded-xl border border-[#185A45]">
            <div className="flex items-center space-x-1 text-[11px] text-[#A3C7B6] font-medium">
              <span className="text-xs">🐥</span>
              <span>{language === 'bn' ? 'মোট জীবিত মুরগি' : 'Live Birds'}</span>
            </div>
            <div className="mt-1 text-base sm:text-lg font-bold text-white">
              {language === 'bn'
                ? `${toBengaliNumber(activeBatch?.currentBirds || 1580)} টি`
                : `${activeBatch?.currentBirds || 1580} birds`}
            </div>
            <div className="text-[10px] text-[#A3C7B6] font-medium mt-0.5">
              {activeBatch?.shedNumber
                ? activeBatch.shedNumber
                : language === 'bn' ? 'শেড ১ ও শেড ২' : 'Shed 1 & Shed 2'}
            </div>
          </div>

          {/* Card 3: Today's Mortality */}
          <div className="bg-[#0E4233] p-2.5 rounded-xl border border-[#185A45]">
            <div className="flex items-center space-x-1 text-[11px] text-[#F87171] font-medium">
              <Skull className="w-3.5 h-3.5 text-[#F87171]" />
              <span>{language === 'bn' ? 'আজকের মৃত্যু' : "Today's Dead"}</span>
            </div>
            <div className="mt-1 text-base sm:text-lg font-bold text-[#FCA5A5]">
              {language === 'bn'
                ? `${toBengaliNumber(todayMortality || 2)} টি`
                : `${todayMortality || 2} birds`}
            </div>
            <div className="text-[10px] text-[#A3C7B6] font-medium mt-0.5">
              {todayMortality <= 3
                ? language === 'bn' ? 'স্বাভাবিক সীমার মধ্যে' : 'Normal range'
                : language === 'bn' ? 'সতর্কতা প্রয়োজন' : 'Requires attention'}
            </div>
          </div>

          {/* Card 4: If Broiler -> Feed/FCR or Sales Net; If Layer -> Egg Stock in Trays */}
          {farmMode === 'broiler' ? (
            <div className="bg-[#0E4233] p-2.5 rounded-xl border border-[#185A45]">
              <div className="flex items-center space-x-1 text-[11px] text-[#A3C7B6] font-medium">
                <CircleDollarSign className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'bn' ? 'খাদ্য ও FCR' : 'Feed & FCR'}</span>
              </div>
              <div className="mt-1 text-base sm:text-lg font-bold text-white">
                {language === 'bn'
                  ? `${toBengaliNumber(activeBatch?.totalFeedBagsConsumed || 54)} বস্তা`
                  : `${activeBatch?.totalFeedBagsConsumed || 54} bags`}
              </div>
              <div className="text-[10px] text-amber-300 font-medium mt-0.5">
                {language === 'bn' ? 'FCR: ১.৫২ (উত্তম মান)' : 'FCR: 1.52 (Optimal)'}
              </div>
            </div>
          ) : (
            <div className="bg-[#0E4233] p-2.5 rounded-xl border border-[#185A45]">
              <div className="flex items-center space-x-1 text-[11px] text-[#A3C7B6] font-medium">
                <PackageCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'bn' ? 'মোট ডিম মজুদ' : 'Egg Stock'}</span>
              </div>
              <div className="mt-1 text-base sm:text-lg font-bold text-white">
                {language === 'bn'
                  ? `${toBengaliNumber(totalEggStockPcs > 0 ? totalEggStockPcs : 3200)} টি`
                  : `${totalEggStockPcs > 0 ? totalEggStockPcs : 3200} pcs`}
              </div>
              <div className="text-[10px] text-[#A3C7B6] font-medium mt-0.5">
                {language === 'bn'
                  ? `প্রায় ${toBengaliNumber(Math.floor((totalEggStockPcs || 3200) / 30))} ক্যারেট`
                  : `~${Math.floor((totalEggStockPcs || 3200) / 30)} crates`}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Vaccine Notification Banner inside Widget (Matching Screenshot 2) */}
        {nextVaccine && (
          <button
            id="widget-vaccine-alert-button"
            onClick={onOpenVaccineModal}
            className="w-full mt-2.5 bg-[#08281E] hover:bg-[#062018] active:scale-98 transition-all px-3 py-2 rounded-xl border border-[#1A624C] flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-2 truncate">
              <Syringe className="w-3.5 h-3.5 text-[#86EFAC] flex-shrink-0" />
              <span className="text-xs text-[#E2ECE4] font-medium truncate">
                {language === 'bn'
                  ? `আসন্ন: ${nextVaccine.vaccineName} (দিন ${toBengaliNumber(nextVaccine.dayNumber)})`
                  : `Upcoming: ${nextVaccine.vaccineName} (Day ${nextVaccine.dayNumber})`}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#86EFAC] flex-shrink-0 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};
