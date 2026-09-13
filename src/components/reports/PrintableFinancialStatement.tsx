import React from 'react';
import {
  Batch,
  FarmSettings,
  Language,
} from '../../types';
import { toBengaliNumber } from '../../utils/banglaDate';
import { ExpenseCategorySummary, ExportTransactionRow } from '../../utils/csvExport';
import { Sparkles, CheckCircle2, TrendingUp, TrendingDown, Layers, ShieldCheck, Phone, MapPin, User } from 'lucide-react';

export interface PrintableFinancialStatementProps {
  farmSettings?: FarmSettings;
  farmName?: string;
  language: Language;
  currentBatch?: Batch;
  generatedDate: string;
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    costPerChick: number;
    feedSharePercentage: number;
    avgSoldRate: string;
    standingBirdsCount: number;
    standingFlockEstimatedValue: number;
  };
  revenueBreakdown: {
    chickenSalesAmount: number;
    chickenBirdsSold: number;
    chickenWeightKg: number;
    eggSalesAmount: number;
    otherIncomeAmount: number;
  };
  expenseBreakdown: ExpenseCategorySummary[];
  dues: {
    receivableBuyers: number;
    payableDealers: number;
  };
  allTimeTotals: {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
  };
  transactions: ExportTransactionRow[];
}

export const PrintableFinancialStatement: React.FC<PrintableFinancialStatementProps> = ({
  farmSettings,
  farmName,
  language,
  currentBatch,
  generatedDate,
  summary,
  revenueBreakdown,
  expenseBreakdown,
  dues,
  allTimeTotals,
  transactions,
}) => {
  const isBn = language === 'bn';

  const effectiveFarmName =
    farmSettings?.farmName || farmName || (isBn ? 'স্মার্ট পোল্ট্রি খামার' : 'Smart Poultry Farm');
  const ownerName = farmSettings?.ownerName;
  const phone = farmSettings?.phone;
  const address = farmSettings?.address;

  const mortalityRate =
    currentBatch && currentBatch.initialBirds > 0
      ? ((currentBatch.deadBirds / currentBatch.initialBirds) * 100).toFixed(1)
      : '0';

  const fmt = (num: number) => {
    const formatted = num.toLocaleString('en-US');
    return isBn ? toBengaliNumber(formatted) : formatted;
  };

  const fmtCurrency = (num: number) => {
    const isNeg = num < 0;
    const absFmt = fmt(Math.abs(num));
    return `${isNeg ? '-' : ''}৳ ${absFmt}`;
  };

  return (
    <div
      id="printable-financial-statement"
      className="bg-white text-[#111827] p-8 max-w-[820px] mx-auto text-sm leading-relaxed border border-[#E5E7EB] shadow-xs rounded-none font-sans"
      style={{
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF',
        color: '#111827',
      }}
    >
      {/* 1. TOP OFFICIAL COMPANY HEADER */}
      <div className="border-b-2 border-[#0E3D2F] pb-4 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            {/* Farm Seal / Emblem */}
            <div className="w-14 h-14 rounded-2xl bg-[#0E3D2F] text-[#86E4B9] flex items-center justify-center shrink-0 shadow-xs border border-[#175240]">
              <span className="text-2xl font-black">🐔</span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-[#0E3D2F] tracking-tight">
                  {effectiveFarmName}
                </h1>
                <span className="bg-[#E7F4EE] text-[#0E3D2F] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#B9DEC9] uppercase tracking-wider">
                  {isBn ? 'ভেরিফায়েড খামার' : 'Verified Farm'}
                </span>
              </div>

              <p className="text-xs font-semibold text-[#4B6358] mt-0.5">
                {isBn
                  ? 'উন্নত বাণিজ্যিক ব্রয়লার ও লেয়ার খামার ব্যবস্থাপনা ও নিরীক্ষা'
                  : 'Commercial Broiler & Layer Poultry Farm Management & Audit'}
              </p>

              {/* Owner & Contact Details */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#374151] mt-2 font-medium">
                {ownerName && (
                  <div className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-[#0E3D2F]" />
                    <span>
                      {isBn ? 'খামারি / সত্ত্বাধিকারী:' : 'Proprietor:'}{' '}
                      <strong className="text-[#111827]">{ownerName}</strong>
                    </span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-[#0E3D2F]" />
                    <span>
                      {isBn ? 'মোবাইল:' : 'Phone:'}{' '}
                      <strong className="text-[#111827]">{isBn ? toBengaliNumber(phone) : phone}</strong>
                    </span>
                  </div>
                )}
                {address && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0E3D2F]" />
                    <span>
                      {isBn ? 'ঠিকানা:' : 'Location:'}{' '}
                      <strong className="text-[#111827]">{address}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Header: Document Meta */}
          <div className="text-right shrink-0">
            <div className="inline-block bg-[#0E3D2F] text-[#86E4B9] text-[11px] font-bold px-2.5 py-1 rounded-md mb-1.5 uppercase tracking-wide">
              {isBn ? 'আর্থিক বিবরণী প্রতিবেদন' : 'Financial Statement'}
            </div>
            <p className="text-[11px] text-[#6B7280]">
              {isBn ? 'প্রতিবেদনের তারিখ:' : 'Report Date:'}
            </p>
            <p className="text-xs font-bold text-[#111827]">{generatedDate}</p>
            {currentBatch && (
              <p className="text-[11px] text-[#0E3D2F] font-semibold mt-1">
                REF: SPF-{currentBatch.batchNumber}-{new Date().getFullYear()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. BATCH PERFORMANCE PROFILE */}
      {currentBatch && (
        <div className="bg-[#FAFBF9] border border-[#D1DCD5] rounded-xl p-3.5 mb-5">
          <div className="flex items-center justify-between border-b border-[#E2EBE5] pb-2 mb-2.5">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#0E3D2F]" />
              <h2 className="text-xs font-bold text-[#0E3D2F] uppercase tracking-wider">
                {isBn ? 'ব্যাচ পরিচিতি ও মূল তথ্য' : 'Batch Performance Profile'}
              </h2>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                currentBatch.status === 'active'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              {currentBatch.status === 'active'
                ? isBn
                  ? 'চলমান ব্যাচ (Active)'
                  : 'Active Batch'
                : isBn
                ? 'সম্পূর্ণ ব্যাচ (Closed)'
                : 'Completed Batch'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[11px] text-[#6B7280] block">
                {isBn ? 'ব্যাচ নম্বর' : 'Batch No'}
              </span>
              <strong className="text-sm font-black text-[#0E3D2F]">
                {currentBatch.batchNumber}
              </strong>
            </div>
            <div>
              <span className="text-[11px] text-[#6B7280] block">
                {isBn ? 'মুরগির জাত' : 'Breed'}
              </span>
              <strong className="text-[#111827]">{currentBatch.breed}</strong>
            </div>
            <div>
              <span className="text-[11px] text-[#6B7280] block">
                {isBn ? 'শুরুর তারিখ' : 'Start Date'}
              </span>
              <strong className="text-[#111827]">
                {isBn ? toBengaliNumber(currentBatch.startDate) : currentBatch.startDate}
              </strong>
            </div>
            <div>
              <span className="text-[11px] text-[#6B7280] block">
                {isBn ? 'শুরুর মোট বাচ্চা' : 'Initial Chicks'}
              </span>
              <strong className="text-[#111827]">{fmt(currentBatch.initialBirds)} টি</strong>
            </div>

            <div>
              <span className="text-[11px] text-[#6B7280] block">
                {isBn ? 'বর্তমান জীবিত মুরগি' : 'Live Birds'}
              </span>
              <strong className="text-emerald-700 font-bold">
                {fmt(currentBatch.currentBirds)} টি
              </strong>
            </div>
            <div>
              <span className="text-[11px] text-[#6B7280] block">
                {isBn ? 'মৃত মুরগি ও মৃত্যুর হার' : 'Mortality & Rate'}
              </span>
              <strong className="text-rose-700 font-bold">
                {fmt(currentBatch.deadBirds)} টি ({isBn ? toBengaliNumber(mortalityRate) : mortalityRate}%)
              </strong>
            </div>
            <div>
              <span className="text-[11px] text-[#6B7280] block">
                {isBn ? 'বর্তমান গড় ওজন' : 'Avg Weight'}
              </span>
              <strong className="text-[#111827]">
                {currentBatch.currentAvgWeightKg
                  ? `${isBn ? toBengaliNumber(currentBatch.currentAvgWeightKg) : currentBatch.currentAvgWeightKg} কেজি`
                  : '-'}
              </strong>
            </div>
            <div>
              <span className="text-[11px] text-[#6B7280] block">
                {isBn ? 'শেডের সম্ভাব্য মজুদ মূল্য' : 'Flock Valuation'}
              </span>
              <strong className="text-[#0E3D2F] font-bold">
                {fmtCurrency(summary.standingFlockEstimatedValue)}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* 3. FINANCIAL SUMMARY (KEY KPIS) */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-[#0E3D2F] uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#0E3D2F]" />
          <span>{isBn ? 'আর্থিক সারসংক্ষেপ (Financial Summary)' : 'Financial Summary (KPIs)'}</span>
        </h2>

        <div className="grid grid-cols-3 gap-3 mb-3">
          {/* Revenue */}
          <div className="border border-[#C3E4D3] bg-[#F2F9F5] p-3 rounded-xl">
            <span className="text-[11px] font-semibold text-[#276F57] block">
              {isBn ? 'মোট ব্যাচ রাজস্ব / বিক্রয়' : 'Total Batch Revenue'}
            </span>
            <div className="text-lg font-black text-[#0E3D2F] mt-0.5">
              {fmtCurrency(summary.totalRevenue)}
            </div>
            <span className="text-[10px] text-[#557567] mt-0.5 block">
              {isBn ? 'মুরগি, ডিম ও বিবিধ আয়' : 'Broiler, eggs & other sales'}
            </span>
          </div>

          {/* Expenses */}
          <div className="border border-[#F0D5D5] bg-[#FDF6F6] p-3 rounded-xl">
            <span className="text-[11px] font-semibold text-rose-800 block">
              {isBn ? 'মোট ব্যাচ খরচ / ব্যয়' : 'Total Batch Expenses'}
            </span>
            <div className="text-lg font-black text-rose-900 mt-0.5">
              {fmtCurrency(summary.totalExpenses)}
            </div>
            <span className="text-[10px] text-rose-600 mt-0.5 block">
              {isBn
                ? `ফিড খরচ: ${isBn ? toBengaliNumber(summary.feedSharePercentage) : summary.feedSharePercentage}%`
                : `Feed share: ${summary.feedSharePercentage}%`}
            </span>
          </div>

          {/* Net Profit / Loss */}
          <div
            className={`border p-3 rounded-xl ${
              summary.netProfit >= 0
                ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                : 'border-rose-300 bg-rose-50 text-rose-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold block">
                {isBn
                  ? summary.netProfit >= 0
                    ? 'ব্যাচ নীট লাভ'
                    : 'ব্যাচ নীট ক্ষতি'
                  : 'Batch Net Profit / Loss'}
              </span>
              {summary.netProfit >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-600" />
              )}
            </div>
            <div className="text-lg font-black mt-0.5">
              {fmtCurrency(summary.netProfit)}
            </div>
            <span className="text-[10px] opacity-80 mt-0.5 block">
              {summary.netProfit >= 0
                ? isBn
                  ? 'মুনাফাজনক ব্যাচ'
                  : 'Profitable'
                : isBn
                ? 'ঘাটিতির সম্মুখীন'
                : 'Deficit'}
            </span>
          </div>
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-3 gap-2 bg-[#FAF8F2] border border-[#E4DFCE] p-2.5 rounded-lg text-xs">
          <div>
            <span className="text-[11px] text-[#6B7280]">
              {isBn ? 'বাচ্চা প্রতি উৎপাদন খরচ:' : 'Cost per Chick:'}
            </span>{' '}
            <strong className="text-[#111827]">{fmtCurrency(summary.costPerChick)}</strong>
          </div>
          <div>
            <span className="text-[11px] text-[#6B7280]">
              {isBn ? 'গড় বিক্রয় দর (প্রতি কেজি):' : 'Avg Sale Rate/Kg:'}
            </span>{' '}
            <strong className="text-[#111827]">
              {summary.avgSoldRate !== '0'
                ? `৳ ${isBn ? toBengaliNumber(summary.avgSoldRate) : summary.avgSoldRate}/কেজি`
                : '-'}
            </strong>
          </div>
          <div>
            <span className="text-[11px] text-[#6B7280]">
              {isBn ? 'মোট খরচে ফিডের অংশ:' : 'Feed Share Ratio:'}
            </span>{' '}
            <strong className="text-[#0E3D2F]">
              {isBn ? toBengaliNumber(summary.feedSharePercentage) : summary.feedSharePercentage}%
            </strong>
          </div>
        </div>
      </div>

      {/* 4. REVENUE & EXPENSE TABLES (2-COLUMN BALANCED VIEW) */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Left: Revenue Breakdown Table */}
        <div className="border border-[#D9D4C5] rounded-xl overflow-hidden bg-white">
          <div className="bg-[#0E3D2F] text-white px-3 py-1.5 text-xs font-bold flex items-center justify-between">
            <span>{isBn ? 'আয়ের খাতসমূহ (Revenue Sources)' : 'Revenue Breakdown'}</span>
            <span className="text-[#86E4B9]">{fmtCurrency(summary.totalRevenue)}</span>
          </div>
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F4F1EA] text-[#4B6358] border-b border-[#D9D4C5] text-[11px]">
              <tr>
                <th className="py-1.5 px-3">{isBn ? 'খাত' : 'Source'}</th>
                <th className="py-1.5 px-3 text-right">{isBn ? 'পরিমাণ' : 'Qty/Weight'}</th>
                <th className="py-1.5 px-3 text-right">{isBn ? 'টাকা' : 'Amount'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE7DC]">
              <tr>
                <td className="py-1.5 px-3 font-medium text-[#111827]">
                  {isBn ? 'মুরগি বিক্রয়' : 'Chicken Sales'}
                </td>
                <td className="py-1.5 px-3 text-right text-[#4B6358]">
                  {revenueBreakdown.chickenBirdsSold > 0
                    ? `${fmt(revenueBreakdown.chickenBirdsSold)} টি (${fmt(revenueBreakdown.chickenWeightKg)} kg)`
                    : '-'}
                </td>
                <td className="py-1.5 px-3 text-right font-bold text-[#111827]">
                  {fmtCurrency(revenueBreakdown.chickenSalesAmount)}
                </td>
              </tr>
              <tr>
                <td className="py-1.5 px-3 font-medium text-[#111827]">
                  {isBn ? 'ডিম বিক্রয়' : 'Egg Sales'}
                </td>
                <td className="py-1.5 px-3 text-right text-[#4B6358]">-</td>
                <td className="py-1.5 px-3 text-right font-bold text-[#111827]">
                  {fmtCurrency(revenueBreakdown.eggSalesAmount)}
                </td>
              </tr>
              <tr>
                <td className="py-1.5 px-3 font-medium text-[#111827]">
                  {isBn ? 'অন্যান্য আয় (সার/বস্তা)' : 'Other Revenue'}
                </td>
                <td className="py-1.5 px-3 text-right text-[#4B6358]">-</td>
                <td className="py-1.5 px-3 text-right font-bold text-[#111827]">
                  {fmtCurrency(revenueBreakdown.otherIncomeAmount)}
                </td>
              </tr>
              <tr className="bg-[#FAF8F2] font-black border-t border-[#D9D4C5]">
                <td className="py-2 px-3 text-[#0E3D2F]" colSpan={2}>
                  {isBn ? 'সর্বমোট আয়' : 'Total Revenue'}
                </td>
                <td className="py-2 px-3 text-right text-[#0E3D2F]">
                  {fmtCurrency(summary.totalRevenue)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right: Expense Breakdown Table */}
        <div className="border border-[#D9D4C5] rounded-xl overflow-hidden bg-white">
          <div className="bg-[#782323] text-white px-3 py-1.5 text-xs font-bold flex items-center justify-between">
            <span>{isBn ? 'ব্যয়ের খাতসমূহ (Expense Breakdown)' : 'Expense Breakdown'}</span>
            <span className="text-[#FFC4C4]">{fmtCurrency(summary.totalExpenses)}</span>
          </div>
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F4F1EA] text-[#4B6358] border-b border-[#D9D4C5] text-[11px]">
              <tr>
                <th className="py-1.5 px-3">{isBn ? 'খাত' : 'Category'}</th>
                <th className="py-1.5 px-3 text-right">{isBn ? 'টাকা' : 'Amount'}</th>
                <th className="py-1.5 px-3 text-right">{isBn ? 'অনুপাত' : 'Share'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE7DC]">
              {expenseBreakdown.map((cat) => (
                <tr key={cat.categoryKey}>
                  <td className="py-1.5 px-3 font-medium text-[#111827]">{cat.categoryLabel}</td>
                  <td className="py-1.5 px-3 text-right font-bold text-[#111827]">
                    {fmtCurrency(cat.amount)}
                  </td>
                  <td className="py-1.5 px-3 text-right text-[#557567] font-semibold">
                    {isBn ? toBengaliNumber(cat.percentage) : cat.percentage}%
                  </td>
                </tr>
              ))}
              {expenseBreakdown.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-3 text-center text-gray-400">
                    {isBn ? 'কোনো ব্যয়ের তথ্য নেই' : 'No expenses recorded'}
                  </td>
                </tr>
              )}
              <tr className="bg-[#FAF8F2] font-black border-t border-[#D9D4C5]">
                <td className="py-2 px-3 text-[#782323]">{isBn ? 'সর্বমোট ব্যয়' : 'Total Expense'}</td>
                <td className="py-2 px-3 text-right text-[#782323]">
                  {fmtCurrency(summary.totalExpenses)}
                </td>
                <td className="py-2 px-3 text-right text-[#782323]">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. DUES & ALL-TIME LEDGER OVERVIEW */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Dues Status */}
        <div className="bg-[#FDFBF7] border border-[#E2DCB8] rounded-xl p-3">
          <div className="flex items-center space-x-1.5 border-b border-[#E8E2BF] pb-1.5 mb-2 text-xs font-bold text-[#7A5812]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B88719]" />
            <span>{isBn ? 'বকেয়া ও চলতি দায়-দেনা (Outstanding Balances)' : 'Dues & Balances'}</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#4B5563]">
                {isBn ? 'পাইকারদের কাছে মোট পাওনা:' : 'Receivables from Buyers:'}
              </span>
              <strong className="text-emerald-700 font-bold">{fmtCurrency(dues.receivableBuyers)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#4B5563]">
                {isBn ? 'ডিলারদের কাছে মোট দেনা:' : 'Payables to Dealers:'}
              </span>
              <strong className="text-rose-700 font-bold">{fmtCurrency(dues.payableDealers)}</strong>
            </div>
          </div>
        </div>

        {/* All-Time Totals */}
        <div className="bg-[#F4F9F6] border border-[#B9DEC9] rounded-xl p-3">
          <div className="flex items-center space-x-1.5 border-b border-[#CEE7D9] pb-1.5 mb-2 text-xs font-bold text-[#0E3D2F]">
            <Layers className="w-3.5 h-3.5 text-[#0E3D2F]" />
            <span>{isBn ? 'খামারের সর্বকালীন সামগ্রিক খতিয়ান' : 'All-Time Farm Totals'}</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#4B5563]">{isBn ? 'সার্বিক মোট আয়:' : 'Grand Total Income:'}</span>
              <strong className="text-[#0E3D2F] font-bold">{fmtCurrency(allTimeTotals.totalIncome)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#4B5563]">{isBn ? 'সার্বিক মোট ব্যয়:' : 'Grand Total Expense:'}</span>
              <strong className="text-rose-700 font-bold">{fmtCurrency(allTimeTotals.totalExpenses)}</strong>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#D2EADA]">
              <span className="text-[#111827] font-bold">{isBn ? 'সার্বিক নীট লাভ:' : 'Grand Net Profit:'}</span>
              <strong
                className={`font-black ${
                  allTimeTotals.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {fmtCurrency(allTimeTotals.netProfit)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 6. RECENT TRANSACTIONS LEDGER (UP TO 15 ROWS TO FIT BEAUTIFULLY) */}
      {transactions.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-[#0E3D2F] uppercase tracking-wider">
              {isBn ? 'ব্যাচের বিস্তারিত লেনদেন বিবরণী' : 'Detailed Transactions Ledger'}
            </h2>
            <span className="text-[11px] text-[#6B7280]">
              {isBn
                ? `মোট ${toBengaliNumber(transactions.length)} টি লেনদেন`
                : `${transactions.length} total entries`}
            </span>
          </div>

          <div className="border border-[#D9D4C5] rounded-xl overflow-hidden bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F4F1EA] text-[#4B6358] border-b border-[#D9D4C5] text-[11px]">
                <tr>
                  <th className="py-2 px-2.5">{isBn ? 'তারিখ' : 'Date'}</th>
                  <th className="py-2 px-2.5">{isBn ? 'ধরন' : 'Type'}</th>
                  <th className="py-2 px-2.5">{isBn ? 'খাত / বিবরণ' : 'Category / Title'}</th>
                  <th className="py-2 px-2.5">{isBn ? 'ব্যক্তি / প্রতিষ্ঠান' : 'Party'}</th>
                  <th className="py-2 px-2.5 text-right">{isBn ? 'টাকা' : 'Amount'}</th>
                  <th className="py-2 px-2.5 text-right">{isBn ? 'পেমেন্ট / বাকি' : 'Payment'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE7DC]">
                {transactions.slice(0, 15).map((tx, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-[#FCFAF6]' : ''}>
                    <td className="py-1.5 px-2.5 font-mono text-[11px] text-[#4B5563]">
                      {isBn ? toBengaliNumber(tx.date) : tx.date}
                    </td>
                    <td className="py-1.5 px-2.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          tx.isIncome
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {tx.isIncome ? (isBn ? 'আয়' : 'Income') : (isBn ? 'ব্যয়' : 'Expense')}
                      </span>
                    </td>
                    <td className="py-1.5 px-2.5 text-[#111827]">
                      <span className="font-semibold block">{tx.title}</span>
                      {tx.extraDetails && (
                        <span className="text-[10px] text-[#6B7280]">{tx.extraDetails}</span>
                      )}
                    </td>
                    <td className="py-1.5 px-2.5 text-[#4B5563]">{tx.entityName || '-'}</td>
                    <td
                      className={`py-1.5 px-2.5 text-right font-bold ${
                        tx.isIncome ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {tx.isIncome ? '+' : '-'}
                      {fmtCurrency(tx.amount)}
                    </td>
                    <td className="py-1.5 px-2.5 text-right text-[11px]">
                      {tx.paymentType === 'due' ? (
                        <span className="text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {isBn ? 'বাকি' : 'Due'}
                        </span>
                      ) : (
                        <span className="text-slate-600">
                          {isBn ? 'নগদ' : 'Cash'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {transactions.length > 15 && (
            <p className="text-[10px] text-[#6B7280] text-center mt-1.5 italic">
              {isBn
                ? `* স্থান সংকুলানের জন্য সর্বশেষ ১৫টি লেনদেন প্রদর্শিত হয়েছে। সম্পূর্ণ তালিকার জন্য CSV ডাউনলোড ব্যবহার করুন।`
                : `* First 15 transactions shown for concise printing. Export CSV for the full ledger.`}
            </p>
          )}
        </div>
      )}

      {/* 7. OFFICIAL SIGNATURE & AUTHORIZATION BLOCK */}
      <div className="pt-8 mt-6 border-t-2 border-[#D9D4C5]">
        <div className="grid grid-cols-3 gap-6 text-center text-xs">
          {/* Signatory 1 */}
          <div>
            <div className="h-10 border-b border-dashed border-[#9CA3AF] mb-1.5 flex items-end justify-center pb-1">
              {ownerName && <span className="text-xs font-serif italic text-slate-500">{ownerName}</span>}
            </div>
            <p className="font-bold text-[#111827]">
              {isBn ? 'হিসাব প্রস্তুতকারীর স্বাক্ষর' : 'Prepared By (Accountant)'}
            </p>
            <p className="text-[10px] text-[#6B7280]">
              {isBn ? 'স্মার্ট পোল্ট্রি ফার্ম' : 'Smart Poultry Farm'}
            </p>
          </div>

          {/* Farm Official Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#0E3D2F] flex flex-col items-center justify-center p-1 text-[9px] text-[#0E3D2F] font-bold uppercase tracking-tighter">
              <span>★ সিলমোহর ★</span>
              <span className="text-[8px] font-normal">{effectiveFarmName.substring(0, 14)}</span>
            </div>
            <p className="text-[10px] text-[#6B7280] mt-1">
              {isBn ? 'অফিসিয়াল সিলমোহর' : 'Official Seal'}
            </p>
          </div>

          {/* Signatory 2 */}
          <div>
            <div className="h-10 border-b border-dashed border-[#9CA3AF] mb-1.5 flex items-end justify-center pb-1">
              {ownerName && <span className="text-xs font-serif italic text-slate-500">{ownerName}</span>}
            </div>
            <p className="font-bold text-[#111827]">
              {isBn ? 'খামারির / স্বত্বাধিকারীর স্বাক্ষর' : 'Proprietor Signature'}
            </p>
            <p className="text-[10px] text-[#6B7280]">
              {ownerName || (isBn ? 'খামার ব্যবস্থাপনা' : 'Farm Management')}
            </p>
          </div>
        </div>
      </div>

      {/* 8. FOOTER NOTE */}
      <div className="mt-8 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[10px] text-[#6B7280]">
        <span>
          {isBn
            ? 'এই অডিট প্রতিবেদনটি স্মার্ট পোল্ট্রি ফার্ম ম্যানেজমেন্ট সফটওয়্যার দ্বারা প্রস্তুতকৃত।'
            : 'Generated via Smart Poultry Farm Management Platform.'}
        </span>
        <span className="font-mono">
          {generatedDate} • {isBn ? 'পৃষ্ঠা ১/১' : 'Page 1 of 1'}
        </span>
      </div>
    </div>
  );
};
