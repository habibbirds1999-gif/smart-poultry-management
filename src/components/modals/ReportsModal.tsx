import React, { useState, useMemo, useRef } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  ArrowDownCircle,
  ArrowUpCircle,
  Egg,
  Scale,
  DollarSign,
  AlertCircle,
  ChevronDown,
  Search,
  Calendar,
  Filter,
  FileText,
  MessageSquare,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Printer,
  Eye,
  Loader2,
} from 'lucide-react';
import {
  Batch,
  ExpenseRecord,
  ChickenSaleRecord,
  EggSaleRecord,
  OtherRevenueRecord,
  Dealer,
  Buyer,
  Language,
  FarmSettings,
} from '../../types';
import { toBengaliNumber } from '../../utils/banglaDate';
import {
  generateFinancialStatementCsv,
  triggerCsvDownload,
  FinancialStatementExportData,
  ExpenseCategorySummary,
} from '../../utils/csvExport';
import { exportElementToPdf, printFormattedElement } from '../../utils/pdfExport';
import { PrintableFinancialStatement } from '../reports/PrintableFinancialStatement';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBatch?: Batch;
  batches?: Batch[];
  expenses: ExpenseRecord[];
  chickenSales: ChickenSaleRecord[];
  eggSales: EggSaleRecord[];
  otherRevenues: OtherRevenueRecord[];
  dealers: Dealer[];
  buyers: Buyer[];
  language: Language;
  farmName?: string;
  farmSettings?: FarmSettings;
}

type TabMode = 'statement' | 'history' | 'pdf_preview';
type FilterType = 'all' | 'expense' | 'sale' | 'has_notes';

interface UnifiedTransaction {
  id: string;
  type: 'expense' | 'chicken_sale' | 'egg_sale' | 'other_revenue';
  date: string;
  title: string;
  categoryLabel: string;
  entityName?: string;
  amount: number;
  isIncome: boolean;
  notes?: string;
  extraDetails?: string;
  paymentType?: 'cash' | 'due';
  dueAmount?: number;
  batchId?: string;
}

export const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  activeBatch,
  batches = [],
  expenses,
  chickenSales,
  eggSales,
  otherRevenues,
  dealers,
  buyers,
  language,
  farmName,
  farmSettings,
}) => {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<TabMode>('statement');

  // CSV download states
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isDownloadingHistory, setIsDownloadingHistory] = useState(false);
  const [historyDownloadSuccess, setHistoryDownloadSuccess] = useState(false);

  // PDF Export & Print states
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  // Search & Filter state for History view
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [historyBatchFilter, setHistoryBatchFilter] = useState<string>('all');

  // Batch selection state: defaults to currently active batch or first available
  const [selectedBatchId, setSelectedBatchId] = useState<string>(() => {
    return activeBatch?.id || (batches.length > 0 ? batches[0].id : '');
  });

  // Keep in sync if activeBatch changes
  const currentBatch =
    batches.find((b) => b.id === selectedBatchId) || activeBatch || batches[0];

  // Helper maps for dealer & buyer names
  const dealerMap = useMemo(() => {
    const map = new Map<string, string>();
    dealers.forEach((d) => map.set(d.id, d.name));
    return map;
  }, [dealers]);

  const categoryNames: Record<string, { bn: string; en: string }> = {
    feed: { bn: 'খাদ্য (ফিড)', en: 'Feed' },
    chicks: { bn: 'বাচ্চা ক্রয়', en: 'Chicks' },
    medicine: { bn: 'ওষুধ ও ভ্যাকসিন', en: 'Medicine/Vaccine' },
    litter: { bn: 'লিটার (তুষ/ভুসি)', en: 'Litter' },
    electricity: { bn: 'বিদ্যুৎ ও জেনারেটর', en: 'Electricity' },
    gas_heat: { bn: 'গ্যাস ও ব্রুডিং তাপ', en: 'Gas/Brooding' },
    labor: { bn: 'শ্রমিক মজুরি', en: 'Labor' },
    transport: { bn: 'পরিবহন / গাড়িভাড়া', en: 'Transport' },
    other: { bn: 'অন্যান্য খরচ', en: 'Other' },
  };

  // -------------------------------------------------------------
  // 1. UNIFIED SEARCHABLE TRANSACTIONS LIST
  // -------------------------------------------------------------
  const allTransactions = useMemo<UnifiedTransaction[]>(() => {
    const list: UnifiedTransaction[] = [];

    // Expenses
    expenses.forEach((e) => {
      const catLabel = language === 'bn'
        ? categoryNames[e.category]?.bn || 'খরচ'
        : categoryNames[e.category]?.en || 'Expense';
      const dealerName = e.dealerId ? dealerMap.get(e.dealerId) : undefined;
      list.push({
        id: `exp-${e.id}`,
        type: 'expense',
        date: e.date,
        title: e.title,
        categoryLabel: catLabel,
        entityName: dealerName,
        amount: e.amount,
        isIncome: false,
        notes: e.notes,
        extraDetails: e.quantity ? `${e.quantity} ${e.unit || ''}` : undefined,
        paymentType: e.paymentType,
        batchId: e.batchId,
      });
    });

    // Chicken Sales
    chickenSales.forEach((s) => {
      list.push({
        id: `csale-${s.id}`,
        type: 'chicken_sale',
        date: s.date,
        title: language === 'bn'
          ? `${s.buyerName} - ${toBengaliNumber(s.birdCount)} টি মুরগি বিক্রি`
          : `${s.buyerName} - ${s.birdCount} birds sold`,
        categoryLabel: language === 'bn' ? 'মুরগি বিক্রি' : 'Chicken Sale',
        entityName: s.buyerName,
        amount: s.totalAmount,
        isIncome: true,
        notes: s.notes,
        extraDetails: `${s.totalWeightKg} kg @ ৳${s.ratePerKg}/kg`,
        paymentType: s.dueAmount > 0 ? 'due' : 'cash',
        dueAmount: s.dueAmount,
        batchId: s.batchId,
      });
    });

    // Egg Sales
    eggSales.forEach((e) => {
      list.push({
        id: `esale-${e.id}`,
        type: 'egg_sale',
        date: e.date,
        title: language === 'bn'
          ? `${e.buyerName} - ${toBengaliNumber(e.quantity)} ${e.saleType === 'crate' ? 'কেস' : 'টি'} ডিম বিক্রি`
          : `${e.buyerName} - ${e.quantity} ${e.saleType === 'crate' ? 'crates' : 'eggs'} sold`,
        categoryLabel: language === 'bn' ? 'ডিম বিক্রি' : 'Egg Sale',
        entityName: e.buyerName,
        amount: e.totalAmount,
        isIncome: true,
        notes: e.notes,
        extraDetails: `৳${e.rate}/${e.saleType === 'crate' ? (language === 'bn' ? 'কেস' : 'crate') : (language === 'bn' ? 'টি' : 'egg')}`,
        paymentType: e.dueAmount > 0 ? 'due' : 'cash',
        dueAmount: e.dueAmount,
      });
    });

    // Other Revenues
    otherRevenues.forEach((r) => {
      list.push({
        id: `rev-${r.id}`,
        type: 'other_revenue',
        date: r.date,
        title: r.title,
        categoryLabel: r.source === 'manure'
          ? (language === 'bn' ? 'লিটার/বিষ্ঠা বিক্রি' : 'Litter/Manure')
          : (language === 'bn' ? 'অন্যান্য আয়' : 'Other Income'),
        amount: r.amount,
        isIncome: true,
        notes: r.notes,
        batchId: r.batchId,
      });
    });

    // Sort newest first
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, chickenSales, eggSales, otherRevenues, dealerMap, language]);

  // Filtered transactions based on search query, date, batch, and filterType
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((item) => {
      // 1. Filter by Type
      if (filterType === 'expense' && item.isIncome) return false;
      if (filterType === 'sale' && !item.isIncome) return false;
      if (filterType === 'has_notes' && (!item.notes || item.notes.trim() === '')) return false;

      // 2. Filter by Batch
      if (historyBatchFilter !== 'all' && item.batchId && item.batchId !== historyBatchFilter) {
        return false;
      }

      // 3. Filter by Date Input
      if (selectedDate && item.date !== selectedDate) {
        return false;
      }

      // 4. Filter by Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesDate = item.date.toLowerCase().includes(q);
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesCategory = item.categoryLabel.toLowerCase().includes(q);
        const matchesEntity = item.entityName ? item.entityName.toLowerCase().includes(q) : false;
        const matchesNotes = item.notes ? item.notes.toLowerCase().includes(q) : false;
        const matchesExtra = item.extraDetails ? item.extraDetails.toLowerCase().includes(q) : false;
        const matchesAmount = item.amount.toString().includes(q);

        return (
          matchesDate ||
          matchesTitle ||
          matchesCategory ||
          matchesEntity ||
          matchesNotes ||
          matchesExtra ||
          matchesAmount
        );
      }

      return true;
    });
  }, [allTransactions, filterType, historyBatchFilter, selectedDate, searchQuery]);

  // Filtered totals
  const totalFilteredIncome = filteredTransactions
    .filter((t) => t.isIncome)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFilteredExpense = filteredTransactions
    .filter((t) => !t.isIncome)
    .reduce((sum, t) => sum + t.amount, 0);

  if (!isOpen) return null;

  // -------------------------------------------------------------
  // 2. ACTIVE / SELECTED BATCH FINANCIAL CALCULATIONS
  // -------------------------------------------------------------
  const batchExpenses = currentBatch
    ? expenses.filter((e) => e.batchId === currentBatch.id)
    : expenses;
  const batchTotalExpenses = batchExpenses.reduce((sum, e) => sum + e.amount, 0);

  const batchFeedCost = batchExpenses
    .filter((e) => e.category === 'feed')
    .reduce((s, e) => s + e.amount, 0);
  const batchChicksCost = batchExpenses
    .filter((e) => e.category === 'chicks')
    .reduce((s, e) => s + e.amount, 0);
  const batchMedicineCost = batchExpenses
    .filter((e) => e.category === 'medicine')
    .reduce((s, e) => s + e.amount, 0);
  const batchOtherCost = batchExpenses
    .filter((e) => !['feed', 'chicks', 'medicine'].includes(e.category))
    .reduce((s, e) => s + e.amount, 0);

  // Batch Sales & Revenues
  const batchChickenSales = currentBatch
    ? chickenSales.filter((s) => s.batchId === currentBatch.id)
    : chickenSales;
  const batchChickenIncome = batchChickenSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const batchSoldBirds = batchChickenSales.reduce((sum, s) => sum + s.birdCount, 0);
  const batchSoldWeight = batchChickenSales.reduce((sum, s) => sum + s.totalWeightKg, 0);

  const batchOtherRevenues = currentBatch
    ? otherRevenues.filter((r) => !r.batchId || r.batchId === currentBatch.id)
    : otherRevenues;
  const batchOtherIncome = batchOtherRevenues.reduce((sum, r) => sum + r.amount, 0);

  // If the batch is a Layer flock, include egg sales
  const batchEggIncome =
    currentBatch?.breed === 'Layer'
      ? eggSales.reduce((sum, e) => sum + e.totalAmount, 0)
      : 0;

  // Total Batch Revenue & Net Profit
  const batchTotalRevenue = batchChickenIncome + batchOtherIncome + batchEggIncome;
  const batchNetProfit = batchTotalRevenue - batchTotalExpenses;
  const isBatchProfitable = batchNetProfit >= 0;

  // Batch Key Metrics
  const costPerChick =
    currentBatch && currentBatch.initialBirds > 0
      ? Math.round(batchTotalExpenses / currentBatch.initialBirds)
      : 0;

  const feedSharePercentage =
    batchTotalExpenses > 0 ? Math.round((batchFeedCost / batchTotalExpenses) * 100) : 0;

  const avgSoldRate =
    batchSoldWeight > 0 ? (batchChickenIncome / batchSoldWeight).toFixed(1) : '0';

  // Standing birds asset estimate in shed (if batch still has live birds)
  const standingBirdsCount = currentBatch?.currentBirds || 0;
  const standingAvgWeight = currentBatch?.currentAvgWeightKg || 1.45;
  const benchmarkRate =
    batchChickenSales.length > 0
      ? batchChickenSales[0].ratePerKg
      : currentBatch?.breed === 'Sonali'
      ? 290
      : 195;
  const standingFlockEstimatedValue = Math.round(
    standingBirdsCount * standingAvgWeight * benchmarkRate
  );

  // -------------------------------------------------------------
  // 3. OVERALL FARM TOTAL CALCULATIONS (ALL BATCHES)
  // -------------------------------------------------------------
  const grandTotalChickenIncome = chickenSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const grandTotalEggIncome = eggSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const grandTotalOtherIncome = otherRevenues.reduce((sum, r) => sum + r.amount, 0);
  const grandTotalIncome =
    grandTotalChickenIncome + grandTotalEggIncome + grandTotalOtherIncome;

  const grandTotalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const grandTotalNetProfit = grandTotalIncome - grandTotalExpenses;
  const isGrandProfitable = grandTotalNetProfit >= 0;

  const totalReceivables = buyers.reduce((sum, b) => sum + b.dueAmount, 0);
  const totalPayables = dealers.reduce((sum, d) => sum + d.dueAmount, 0);

  // Pre-calculate expense breakdown and batch transactions so both CSV and PDF generators can use them cleanly
  const statementExpenseBreakdown: ExpenseCategorySummary[] = useMemo(() => {
    const list: ExpenseCategorySummary[] = Object.keys(categoryNames)
      .map((key) => {
        const catExpenses = batchExpenses.filter((e) => e.category === key);
        const catAmount = catExpenses.reduce((s, e) => s + e.amount, 0);
        const catPercentage =
          batchTotalExpenses > 0 ? Math.round((catAmount / batchTotalExpenses) * 100) : 0;
        return {
          categoryKey: key,
          categoryLabel: language === 'bn' ? categoryNames[key].bn : categoryNames[key].en,
          amount: catAmount,
          percentage: catPercentage,
        };
      })
      .filter((c) => c.amount > 0);

    // Other expenses not in standard categoryNames
    const uncategorizedExpenses = batchExpenses.filter((e) => !categoryNames[e.category]);
    if (uncategorizedExpenses.length > 0) {
      const uncategorizedTotal = uncategorizedExpenses.reduce((s, e) => s + e.amount, 0);
      list.push({
        categoryKey: 'other_custom',
        categoryLabel: language === 'bn' ? 'অন্যান্য খরচ' : 'Other Uncategorized Costs',
        amount: uncategorizedTotal,
        percentage:
          batchTotalExpenses > 0 ? Math.round((uncategorizedTotal / batchTotalExpenses) * 100) : 0,
      });
    }
    return list;
  }, [batchExpenses, batchTotalExpenses, language]);

  // Relevant transactions for this batch
  const statementBatchTransactions = useMemo(() => {
    return allTransactions.filter(
      (t) => !currentBatch || !t.batchId || t.batchId === currentBatch.id
    );
  }, [allTransactions, currentBatch]);

  const formattedGeneratedDate = useMemo(() => {
    return new Date().toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });
  }, [language]);

  // Download Financial Statement CSV for the currently selected/active batch
  const handleDownloadStatementCsv = () => {
    setIsDownloading(true);
    try {
      const exportData: FinancialStatementExportData = {
        farmName: farmSettings?.farmName || farmName,
        generatedDate: formattedGeneratedDate,
        batch: currentBatch
          ? {
              batchNumber: currentBatch.batchNumber,
              breed: currentBatch.breed,
              startDate: currentBatch.startDate,
              status: currentBatch.status,
              initialBirds: currentBatch.initialBirds,
              currentBirds: currentBatch.currentBirds,
              deadBirds: currentBatch.deadBirds,
              currentAvgWeightKg: currentBatch.currentAvgWeightKg,
            }
          : undefined,
        summary: {
          totalRevenue: batchTotalRevenue,
          totalExpenses: batchTotalExpenses,
          netProfit: batchNetProfit,
          costPerChick,
          feedSharePercentage,
          avgSoldRate,
          standingBirdsCount,
          standingFlockEstimatedValue,
        },
        revenueBreakdown: {
          chickenSalesAmount: batchChickenIncome,
          chickenBirdsSold: batchSoldBirds,
          chickenWeightKg: batchSoldWeight,
          eggSalesAmount: batchEggIncome,
          otherIncomeAmount: batchOtherIncome,
        },
        expenseBreakdown: statementExpenseBreakdown,
        dues: {
          receivableBuyers: totalReceivables,
          payableDealers: totalPayables,
        },
        allTimeTotals: {
          totalIncome: grandTotalIncome,
          totalExpenses: grandTotalExpenses,
          netProfit: grandTotalNetProfit,
        },
        transactions: statementBatchTransactions.map((tx) => ({
          date: tx.date,
          type: tx.type,
          categoryLabel: tx.categoryLabel,
          title: tx.title,
          entityName: tx.entityName,
          extraDetails: tx.extraDetails,
          paymentType: tx.paymentType,
          amount: tx.amount,
          dueAmount: tx.dueAmount,
          notes: tx.notes,
          isIncome: tx.isIncome,
        })),
      };

      const csvContent = generateFinancialStatementCsv(exportData, language);
      const safeBatch = (currentBatch?.batchNumber || 'Statement')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .toLowerCase();
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `smart_poultry_statement_${safeBatch}_${dateStr}.csv`;

      triggerCsvDownload(filename, csvContent);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export statement CSV:', err);
      alert(language === 'bn' ? 'CSV ফাইলে রূপান্তরে ত্রুটি হয়েছে।' : 'Failed to generate CSV file.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Download Formatted PDF Report (with Company Header)
  const handleDownloadStatementPdf = async () => {
    if (!printableRef.current) return;
    setIsExportingPdf(true);
    try {
      const safeBatch = (currentBatch?.batchNumber || 'Statement')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .toLowerCase();
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `smart_poultry_report_${safeBatch}_${dateStr}.pdf`;

      await exportElementToPdf(printableRef.current, {
        filename,
      });

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert(
        language === 'bn'
          ? 'PDF তৈরিতে সাময়িক সমস্যা হয়েছে। আপনি সরাসরি প্রিন্ট অপশনটি ব্যবহার করতে পারেন।'
          : 'Failed to generate PDF. You can use the Print option.'
      );
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Direct Browser Print (Formatted layout with Company Header)
  const handlePrintStatement = () => {
    if (!printableRef.current) return;
    setIsPrinting(true);
    try {
      const farmTitle = farmSettings?.farmName || farmName || 'Smart Poultry';
      const batchTitle = currentBatch?.batchNumber ? ` - ${currentBatch.batchNumber}` : '';
      printFormattedElement(printableRef.current, `${farmTitle}${batchTitle} Financial Statement`);
    } catch (err) {
      console.error('Failed to trigger print:', err);
    } finally {
      setTimeout(() => setIsPrinting(false), 1000);
    }
  };

  // Download Filtered Transactions CSV for Search & History tab
  const handleDownloadFilteredHistoryCsv = () => {
    setIsDownloadingHistory(true);
    try {
      const exportData: FinancialStatementExportData = {
        farmName,
        generatedDate: new Date().toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
        }),
        summary: {
          totalRevenue: totalFilteredIncome,
          totalExpenses: totalFilteredExpense,
          netProfit: totalFilteredIncome - totalFilteredExpense,
          costPerChick: 0,
          feedSharePercentage: 0,
          avgSoldRate: '0',
          standingBirdsCount: 0,
          standingFlockEstimatedValue: 0,
        },
        revenueBreakdown: {
          chickenSalesAmount: filteredTransactions
            .filter((t) => t.type === 'chicken_sale')
            .reduce((s, t) => s + t.amount, 0),
          chickenBirdsSold: 0,
          chickenWeightKg: 0,
          eggSalesAmount: filteredTransactions
            .filter((t) => t.type === 'egg_sale')
            .reduce((s, t) => s + t.amount, 0),
          otherIncomeAmount: filteredTransactions
            .filter((t) => t.type === 'other_revenue')
            .reduce((s, t) => s + t.amount, 0),
        },
        expenseBreakdown: [],
        dues: {
          receivableBuyers: totalReceivables,
          payableDealers: totalPayables,
        },
        allTimeTotals: {
          totalIncome: grandTotalIncome,
          totalExpenses: grandTotalExpenses,
          netProfit: grandTotalNetProfit,
        },
        transactions: filteredTransactions.map((tx) => ({
          date: tx.date,
          type: tx.type,
          categoryLabel: tx.categoryLabel,
          title: tx.title,
          entityName: tx.entityName,
          extraDetails: tx.extraDetails,
          paymentType: tx.paymentType,
          amount: tx.amount,
          dueAmount: tx.dueAmount,
          notes: tx.notes,
          isIncome: tx.isIncome,
        })),
      };

      const csvContent = generateFinancialStatementCsv(exportData, language);
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `smart_poultry_transactions_${dateStr}.csv`;
      triggerCsvDownload(filename, csvContent);
      setHistoryDownloadSuccess(true);
      setTimeout(() => setHistoryDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export history CSV:', err);
    } finally {
      setIsDownloadingHistory(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`bg-[#FAF8F2] rounded-2xl w-full ${
          activeTab === 'pdf_preview' ? 'max-w-4xl' : 'max-w-2xl'
        } overflow-hidden shadow-2xl flex flex-col max-h-[94vh] border border-[#E6E2D5] transition-all duration-200`}
      >
        {/* Modal Header */}
        <div className="bg-[#0E3D2F] text-white px-5 py-4 flex items-center justify-between border-b border-[#16503E]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#17523F] border border-[#276F57] flex items-center justify-center shadow-inner">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">
                {language === 'bn' ? 'আয়-ব্যয়, রিপোর্ট ও অনুসন্ধান' : 'Financial Reports & Ledger'}
              </h3>
              <p className="text-xs text-[#A3C7B6]">
                {language === 'bn'
                  ? 'আর্থিক সারসংক্ষেপ ও অতীতের লেনদেন খোঁজার খাতা'
                  : 'Financial Statement & Historical Search'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            {/* Download PDF Button */}
            <button
              onClick={handleDownloadStatementPdf}
              disabled={isExportingPdf}
              title={language === 'bn' ? 'ফরম্যাটেড PDF ডাউনলোড (কোম্পানি হেডার সহ)' : 'Download Formatted PDF Report'}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer flex items-center space-x-1 text-xs font-semibold px-2 border border-[#276F57] ${
                pdfSuccess
                  ? 'bg-emerald-700 text-white ring-1 ring-emerald-300'
                  : 'bg-[#17523F] hover:bg-[#206850] text-[#86E4B9] hover:text-white'
              }`}
            >
              {isExportingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : pdfSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">PDF</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrintStatement}
              disabled={isPrinting}
              title={language === 'bn' ? 'প্রিন্ট / সেভ করুন' : 'Print Statement'}
              className="p-1.5 rounded-xl hover:bg-white/15 text-[#A3E5C7] hover:text-white transition-colors cursor-pointer flex items-center space-x-1 text-xs font-semibold px-2 border border-[#276F57]/50"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
            </button>

            {/* CSV Button */}
            <button
              onClick={handleDownloadStatementCsv}
              disabled={isDownloading}
              title={language === 'bn' ? 'আর্থিক বিবরণী CSV ডাউনলোড' : 'Download Financial Statement CSV'}
              className="p-1.5 rounded-xl hover:bg-white/15 text-[#A3E5C7] hover:text-white transition-colors cursor-pointer flex items-center space-x-1 text-xs font-semibold px-2 border border-[#276F57]/50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <div className="bg-white border-b border-[#E6E2D5] px-3 pt-2 flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('statement')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-t-xl border-b-2 flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'statement'
                ? 'border-[#0E3D2F] text-[#0E3D2F] bg-[#FAF8F2]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'bn' ? 'আর্থিক বিবরণী' : 'Financial Statement'}</span>
          </button>

          <button
            onClick={() => setActiveTab('pdf_preview')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-t-xl border-b-2 flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'pdf_preview'
                ? 'border-[#0E3D2F] text-[#0E3D2F] bg-[#FAF8F2]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{language === 'bn' ? 'PDF ও প্রিন্ট প্রিভিউ' : 'PDF & Print'}</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-t-xl border-b-2 flex items-center justify-center space-x-1.5 transition-all relative ${
              activeTab === 'history'
                ? 'border-[#0E3D2F] text-[#0E3D2F] bg-[#FAF8F2]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>{language === 'bn' ? 'লেনদেন খুঁজুন' : 'Search & History'}</span>
            <span className="bg-[#0E3D2F]/10 text-[#0E3D2F] text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ml-1">
              {allTransactions.length}
            </span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeTab === 'pdf_preview' ? (
            /* ========================================================= */
            /* TAB 3: FORMATTED PDF PREVIEW & PRINT VIEW WITH COMPANY HEADER */
            /* ========================================================= */
            <div className="space-y-4">
              {/* Preview Action Header Bar */}
              <div className="bg-white border border-[#D9D4C5] rounded-2xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0E3D2F]/10 text-[#0E3D2F] flex items-center justify-center font-bold">
                    🏛️
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-[#0E3D2F]">
                        {farmSettings?.farmName || farmName || (language === 'bn' ? 'স্মার্ট পোল্ট্রি খামার' : 'Smart Poultry Farm')}
                      </h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                        {language === 'bn' ? 'কোম্পানি হেডার সংযুক্ত' : 'Company Header Included'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {language === 'bn'
                        ? 'অফিসিয়াল লেটারহেড ও অডিট সহ প্রিন্ট ও সংরক্ষণের উপযোগী ফরম্যাট'
                        : 'Official letterhead layout ready to print or save'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleDownloadStatementPdf}
                    disabled={isExportingPdf}
                    id="btn-preview-download-pdf"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer ${
                      pdfSuccess
                        ? 'bg-emerald-700 text-white ring-2 ring-emerald-300'
                        : 'bg-[#0E3D2F] hover:bg-[#16503E] active:scale-95 text-white'
                    }`}
                  >
                    {isExportingPdf ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>{language === 'bn' ? 'PDF তৈরি হচ্ছে...' : 'Generating PDF...'}</span>
                      </>
                    ) : pdfSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>{language === 'bn' ? 'ডাউনলোড হয়েছে!' : 'Downloaded!'}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-[#86E4B9]" />
                        <span>{language === 'bn' ? 'PDF ডাউনলোড' : 'Download PDF'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePrintStatement}
                    disabled={isPrinting}
                    id="btn-preview-print"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 border border-[#D9D4C5] text-slate-700 flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-4 h-4 text-[#0E3D2F]" />
                    <span>{language === 'bn' ? 'প্রিন্ট করুন' : 'Print'}</span>
                  </button>
                </div>
              </div>

              {/* Realistic A4 Paper Frame */}
              <div className="bg-slate-200/80 p-3 sm:p-5 rounded-2xl border border-slate-300 overflow-x-auto shadow-inner">
                <div className="min-w-[650px] max-w-[800px] mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <PrintableFinancialStatement
                    farmSettings={farmSettings}
                    farmName={farmName}
                    language={language}
                    currentBatch={currentBatch}
                    generatedDate={formattedGeneratedDate}
                    summary={{
                      totalRevenue: batchTotalRevenue,
                      totalExpenses: batchTotalExpenses,
                      netProfit: batchNetProfit,
                      costPerChick,
                      feedSharePercentage,
                      avgSoldRate,
                      standingBirdsCount,
                      standingFlockEstimatedValue,
                    }}
                    revenueBreakdown={{
                      chickenSalesAmount: batchChickenIncome,
                      chickenBirdsSold: batchSoldBirds,
                      chickenWeightKg: batchSoldWeight,
                      eggSalesAmount: batchEggIncome,
                      otherIncomeAmount: batchOtherIncome,
                    }}
                    expenseBreakdown={statementExpenseBreakdown}
                    dues={{
                      receivableBuyers: totalReceivables,
                      payableDealers: totalPayables,
                    }}
                    allTimeTotals={{
                      totalIncome: grandTotalIncome,
                      totalExpenses: grandTotalExpenses,
                      netProfit: grandTotalNetProfit,
                    }}
                    transactions={statementBatchTransactions.map((tx) => ({
                      date: tx.date,
                      type: tx.type,
                      categoryLabel: tx.categoryLabel,
                      title: tx.title,
                      entityName: tx.entityName,
                      extraDetails: tx.extraDetails,
                      paymentType: tx.paymentType,
                      amount: tx.amount,
                      dueAmount: tx.dueAmount,
                      notes: tx.notes,
                      isIncome: tx.isIncome,
                    }))}
                  />
                </div>
              </div>
            </div>
          ) : activeTab === 'history' ? (
            /* ========================================================= */
            /* TAB 2: INTERACTIVE SEARCH & HISTORICAL TRANSACTIONS */
            /* ========================================================= */
            <div className="space-y-3.5">
              {/* Search Bar Input */}
              <div className="bg-white p-3 rounded-2xl border border-[#E6E2D5] shadow-xs space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#557567] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      language === 'bn'
                        ? 'তারিখ (2026-09-12), বিবরণ, মন্তব্য, ফিড, বা নাম দিয়ে খুঁজুন...'
                        : 'Search by date (YYYY-MM-DD), title, notes, or name...'
                    }
                    className="w-full pl-9 pr-8 py-2.5 text-xs bg-[#FAF8F2] border border-[#D9D4C5] rounded-xl text-[#1A3328] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E3D2F]/20 focus:border-[#0E3D2F] transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 p-0.5 rounded-full hover:bg-slate-200 text-slate-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filters Row: Date Picker + Batch Filter */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Date Filter */}
                  <div className="flex items-center space-x-1.5 bg-[#FAF8F2] border border-[#D9D4C5] rounded-xl px-2.5 py-1.5 text-xs text-[#1A3328]">
                    <Calendar className="w-3.5 h-3.5 text-[#557567] shrink-0" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-transparent text-xs text-[#1A3328] focus:outline-none"
                    />
                    {selectedDate && (
                      <button
                        onClick={() => setSelectedDate('')}
                        title="Clear date"
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Batch Filter Dropdown */}
                  <div className="relative">
                    <select
                      value={historyBatchFilter}
                      onChange={(e) => setHistoryBatchFilter(e.target.value)}
                      className="w-full bg-[#FAF8F2] border border-[#D9D4C5] rounded-xl px-2.5 py-1.5 pr-6 text-xs text-[#1A3328] appearance-none focus:outline-none"
                    >
                      <option value="all">
                        {language === 'bn' ? 'সব ব্যাচের হিসাব' : 'All Batches'}
                      </option>
                      {batches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.batchNumber}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Category Type Filter Chips */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      filterType === 'all'
                        ? 'bg-[#0E3D2F] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {language === 'bn' ? 'সব লেনদেন' : 'All'}
                  </button>

                  <button
                    onClick={() => setFilterType('expense')}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      filterType === 'expense'
                        ? 'bg-rose-700 text-white'
                        : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    {language === 'bn' ? '💸 শুধু খরচ' : '💸 Expenses'}
                  </button>

                  <button
                    onClick={() => setFilterType('sale')}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      filterType === 'sale'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {language === 'bn' ? '💰 শুধু বিক্রি' : '💰 Sales'}
                  </button>

                  <button
                    onClick={() => setFilterType('has_notes')}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      filterType === 'has_notes'
                        ? 'bg-amber-700 text-white'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    {language === 'bn' ? '📝 মন্তব্যযুক্ত' : '📝 With Notes'}
                  </button>
                </div>
              </div>

              {/* Live Count and Financial Summary Bar of Search Results */}
              <div className="flex items-center justify-between px-1 text-xs text-[#557567] gap-2">
                <span className="truncate">
                  {language === 'bn'
                    ? `${toBengaliNumber(filteredTransactions.length)} টি ফলাফল পাওয়া গেছে`
                    : `${filteredTransactions.length} records found`}
                </span>

                <div className="flex items-center space-x-2 shrink-0">
                  <div className="flex items-center space-x-1.5 font-mono text-[11px]">
                    {totalFilteredIncome > 0 && (
                      <span className="text-emerald-700 font-bold">
                        +{language === 'bn' ? toBengaliNumber(totalFilteredIncome.toLocaleString()) : totalFilteredIncome.toLocaleString()} ৳
                      </span>
                    )}
                    {totalFilteredExpense > 0 && (
                      <span className="text-rose-700 font-bold">
                        -{language === 'bn' ? toBengaliNumber(totalFilteredExpense.toLocaleString()) : totalFilteredExpense.toLocaleString()} ৳
                      </span>
                    )}
                  </div>

                  {filteredTransactions.length > 0 && (
                    <button
                      onClick={handleDownloadFilteredHistoryCsv}
                      disabled={isDownloadingHistory}
                      className="px-2 py-1 bg-white hover:bg-[#FAF8F2] border border-[#D9D4C5] rounded-lg text-[11px] font-bold text-[#0E3D2F] flex items-center space-x-1 transition-colors cursor-pointer shadow-2xs"
                      title={language === 'bn' ? 'অনুসন্ধানের ফলাফল CSV ফাইলে নামিয়ে নিন' : 'Export search results as CSV'}
                    >
                      {historyDownloadSuccess ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{language === 'bn' ? 'ডাউনলোড সম্পন্ন' : 'Downloaded'}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3 h-3 text-[#0E3D2F]" />
                          <span>{language === 'bn' ? 'CSV এক্সপোর্ট' : 'Export CSV'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Transactions Result List */}
              <div className="space-y-2.5">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-3 rounded-xl border border-[#E6E2D5] shadow-2xs hover:border-[#0E3D2F]/40 transition-all flex flex-col space-y-1.5"
                    >
                      {/* Top Row: Date, Category badge, Amount */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="text-[11px] font-mono text-slate-500 bg-[#FAF8F2] px-2 py-0.5 rounded border border-[#E6E2D5]">
                            📅 {item.date}
                          </span>

                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              item.isIncome
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.categoryLabel}
                          </span>

                          {item.paymentType && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                item.paymentType === 'due'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.paymentType === 'due'
                                ? language === 'bn' ? 'বাকি' : 'Due'
                                : language === 'bn' ? 'নগদ' : 'Cash'}
                            </span>
                          )}
                        </div>

                        {/* Amount */}
                        <div className="text-right shrink-0 ml-2">
                          <span
                            className={`text-sm sm:text-base font-extrabold ${
                              item.isIncome ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {item.isIncome ? '+' : '-'}৳{' '}
                            {language === 'bn'
                              ? toBengaliNumber(item.amount.toLocaleString())
                              : item.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Middle Row: Title / Description */}
                      <div className="text-xs font-bold text-[#1A3328]">
                        {item.title}
                      </div>

                      {/* Extra Details (Quantity, unit, rate, dealer) */}
                      {(item.extraDetails || item.entityName) && (
                        <div className="text-[11px] text-[#557567] flex items-center space-x-2 flex-wrap">
                          {item.extraDetails && <span>• {item.extraDetails}</span>}
                          {item.entityName && <span>• {item.entityName}</span>}
                          {item.dueAmount && item.dueAmount > 0 ? (
                            <span className="text-amber-800 font-semibold">
                              (বাকি: ৳ {toBengaliNumber(item.dueAmount.toLocaleString())})
                            </span>
                          ) : null}
                        </div>
                      )}

                      {/* Bottom Row: Notes / Remarks Highlight */}
                      {item.notes && item.notes.trim() !== '' && (
                        <div className="bg-[#FAF8F2] border-l-2 border-amber-400 p-1.5 rounded-r text-[11px] text-amber-900 flex items-start space-x-1.5 mt-1">
                          <MessageSquare className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                          <span className="italic leading-tight">{item.notes}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  /* Empty state */
                  <div className="bg-white rounded-2xl p-8 border border-dashed border-[#D9D4C5] text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Search className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {language === 'bn'
                          ? 'কোনো লেনদেনের হিসাব মেলেনি'
                          : 'No matching records found'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        {language === 'bn'
                          ? 'অন্য কোনো তারিখ, শিরোনাম বা মন্তব্য লিখে পুনরায় অনুসন্ধান করুন।'
                          : 'Try searching with another date, title keyword, or note.'}
                      </p>
                    </div>
                    {(searchQuery || selectedDate || filterType !== 'all' || historyBatchFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedDate('');
                          setFilterType('all');
                          setHistoryBatchFilter('all');
                        }}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF8F2] hover:bg-slate-200 text-xs font-bold text-[#0E3D2F] rounded-lg border border-[#D9D4C5] transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* TAB 1: FINANCIAL STATEMENT OVERVIEW (KPIs + LEDGER) */
            /* ========================================================= */
            <>
              {/* ACTIVE BATCH SUMMARY DASHBOARD & CARDS */}
              <div className="bg-white border-2 border-[#0E3D2F]/20 rounded-2xl p-4 space-y-3.5 shadow-xs">
                {/* Batch Header & Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6E2D5] pb-3">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-bold tracking-wider uppercase text-[#0E3D2F]">
                        {language === 'bn'
                          ? 'চলতি ব্যাচের আর্থিক সারসংক্ষেপ'
                          : 'Active Batch Financial Dashboard'}
                      </span>
                    </div>
                    <h4 className="font-bold text-[#1A3328] text-base mt-0.5">
                      {currentBatch?.batchNumber || (language === 'bn' ? 'চলতি ব্যাচ' : 'Active Batch')}
                    </h4>
                    <p className="text-xs text-[#557567]">
                      {currentBatch?.breed} •{' '}
                      {language === 'bn'
                        ? `শুরু: ${currentBatch?.startDate || '-'}`
                        : `Started: ${currentBatch?.startDate || '-'}`}
                    </p>
                  </div>

                  {/* Batch Selector if multiple batches exist */}
                  {batches.length > 1 && (
                    <div className="relative">
                      <select
                        value={selectedBatchId}
                        onChange={(e) => setSelectedBatchId(e.target.value)}
                        className="text-xs font-semibold bg-[#FAF8F2] border border-[#D9D4C5] text-slate-700 rounded-lg px-2.5 py-1.5 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-[#0E3D2F]"
                      >
                        {batches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.batchNumber} {b.status === 'active' ? '(Active)' : ''}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-2.5 pointer-events-none" />
                    </div>
                  )}
                </div>

                {/* Official Report Export & Document Action Center */}
                <div className="bg-linear-to-br from-[#EBF5EF] via-[#F3F9F5] to-[#FAF8F2] border border-[#B9DEC9] rounded-2xl p-3.5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#0E3D2F] text-[#86E4B9] flex items-center justify-center shrink-0 shadow-xs">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h5 className="text-xs font-bold text-[#0E3D2F]">
                            {language === 'bn' ? 'অফিসিয়াল রিপোর্ট এক্সপোর্ট ও প্রিন্ট' : 'Official Report Export & Print'}
                          </h5>
                          <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.2 rounded-full font-bold">
                            {farmSettings?.farmName || farmName || (language === 'bn' ? 'কোম্পানি হেডার' : 'Company Header')}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#2F6854]">
                          {language === 'bn'
                            ? 'খামারের নাম ও অফিসিয়াল হেডার সহ রঙিন PDF, প্রিন্ট বা এক্সেল CSV'
                            : 'Color PDF with company header, print layout, or Excel CSV'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* 1. Download PDF */}
                    <button
                      onClick={handleDownloadStatementPdf}
                      disabled={isExportingPdf}
                      id="btn-statement-download-pdf"
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-xs cursor-pointer ${
                        pdfSuccess
                          ? 'bg-emerald-700 text-white ring-2 ring-emerald-300'
                          : 'bg-[#0E3D2F] hover:bg-[#16503E] active:scale-95 text-white'
                      }`}
                    >
                      {isExportingPdf ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>{language === 'bn' ? 'তৈরি হচ্ছে...' : 'Generating...'}</span>
                        </>
                      ) : pdfSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>{language === 'bn' ? 'PDF নামানো হয়েছে' : 'Downloaded!'}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-[#86E4B9]" />
                          <span>{language === 'bn' ? 'PDF ডাউনলোড' : 'Download PDF'}</span>
                        </>
                      )}
                    </button>

                    {/* 2. Print / Save as PDF */}
                    <button
                      onClick={handlePrintStatement}
                      disabled={isPrinting}
                      id="btn-statement-print"
                      className="py-2 px-3 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 border border-[#B9DEC9] text-[#0E3D2F] flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <Printer className="w-4 h-4 text-[#0E3D2F]" />
                      <span>{language === 'bn' ? 'প্রিন্ট / সেভ' : 'Print / Save'}</span>
                    </button>

                    {/* 3. Download CSV */}
                    <button
                      onClick={handleDownloadStatementCsv}
                      disabled={isDownloading}
                      id="btn-statement-download-csv"
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all border shadow-2xs cursor-pointer ${
                        downloadSuccess
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                          : 'bg-white hover:bg-[#EBF5EF] border-[#B9DEC9] text-[#0E3D2F]'
                      }`}
                    >
                      <FileSpreadsheet className="w-4 h-4 text-[#0E3D2F]" />
                      <span>
                        {downloadSuccess
                          ? (language === 'bn' ? 'CSV নামানো হয়েছে' : 'Downloaded!')
                          : (language === 'bn' ? 'CSV এক্সপোর্ট' : 'Export CSV')}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 3 Main KPI Cards: Revenue, Expenses, Net Profit */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Card 1: Batch Revenue */}
                  <div className="bg-[#FAF8F2] p-2.5 sm:p-3 rounded-xl border border-emerald-200 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center space-x-1 text-emerald-700 font-semibold text-[11px]">
                      <ArrowDownCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        {language === 'bn' ? 'ব্যাচ আয়' : 'Revenue'}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-extrabold text-emerald-800 mt-1">
                      ৳{' '}
                      {language === 'bn'
                        ? toBengaliNumber(batchTotalRevenue.toLocaleString())
                        : batchTotalRevenue.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
                      {language === 'bn'
                        ? `${toBengaliNumber(batchSoldBirds)} টি মুরগি`
                        : `${batchSoldBirds} birds sold`}
                    </span>
                  </div>

                  {/* Card 2: Batch Expenses */}
                  <div className="bg-[#FAF8F2] p-2.5 sm:p-3 rounded-xl border border-rose-200 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center space-x-1 text-rose-700 font-semibold text-[11px]">
                      <ArrowUpCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        {language === 'bn' ? 'ব্যাচ ব্যয়' : 'Expenses'}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-extrabold text-rose-800 mt-1">
                      ৳{' '}
                      {language === 'bn'
                        ? toBengaliNumber(batchTotalExpenses.toLocaleString())
                        : batchTotalExpenses.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
                      {language === 'bn' ? 'ফিড, বাচ্চা ও ওষুধ' : 'Feed, chicks, meds'}
                    </span>
                  </div>

                  {/* Card 3: Batch Net Profit (Revenue - Expenses) */}
                  <div
                    className={`p-2.5 sm:p-3 rounded-xl border shadow-2xs flex flex-col justify-between ${
                      isBatchProfitable
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                        : 'bg-amber-50/80 border-amber-300 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center space-x-1 font-bold text-[11px]">
                      {isBatchProfitable ? (
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      )}
                      <span className="truncate">
                        {isBatchProfitable
                          ? language === 'bn'
                            ? 'নীট লাভ'
                            : 'Net Profit'
                          : language === 'bn'
                          ? 'ব্যয় ব্যবধান'
                          : 'Net Balance'}
                      </span>
                    </div>

                    <p
                      className={`text-sm sm:text-base font-black mt-1 ${
                        isBatchProfitable ? 'text-emerald-700' : 'text-amber-800'
                      }`}
                    >
                      {isBatchProfitable ? '+' : '-'}৳{' '}
                      {language === 'bn'
                        ? toBengaliNumber(Math.abs(batchNetProfit).toLocaleString())
                        : Math.abs(batchNetProfit).toLocaleString()}
                    </p>

                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md inline-block mt-0.5 text-center truncate ${
                        isBatchProfitable
                          ? 'bg-emerald-200/80 text-emerald-900'
                          : standingBirdsCount > 0
                          ? 'bg-amber-200/80 text-amber-900'
                          : 'bg-rose-200/80 text-rose-900'
                      }`}
                    >
                      {isBatchProfitable
                        ? language === 'bn'
                          ? 'লাভজনক'
                          : 'Profitable'
                        : standingBirdsCount > 0
                        ? language === 'bn'
                          ? 'রিয়ারিং ফেজ'
                          : 'In Rearing'
                        : language === 'bn'
                        ? 'নীট ঘাটতি'
                        : 'Loss'}
                    </span>
                  </div>
                </div>

                {/* Financial Health Indicator Note */}
                {!isBatchProfitable && standingBirdsCount > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-start space-x-2 text-xs text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1 text-[11px] leading-relaxed">
                      <p className="font-semibold">
                        {language === 'bn'
                          ? 'ব্যাচের মুরগি এখনও শেডে মজুদ রয়েছে'
                          : 'Batch is actively growing in shed'}
                      </p>
                      <p className="text-amber-800 text-[10px] mt-0.5">
                        {language === 'bn'
                          ? `শেডে এখনও ${toBengaliNumber(standingBirdsCount)} টি জীবিত মুরগি রয়েছে (আনুমানিক বাজারমূল্য: ৳ ${toBengaliNumber(
                              standingFlockEstimatedValue.toLocaleString()
                            )})। বিক্রয় সম্পন্ন হলে চূড়ান্ত নীট মুনাফা অর্জিত হবে।`
                          : `Currently ${standingBirdsCount} live birds in shed (est. market value: ৳ ${standingFlockEstimatedValue.toLocaleString()}). Final profit realizes upon lot harvest.`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Secondary KPI Strip for this Batch */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#E6E2D5] text-center">
                  <div className="bg-[#FAF8F2] py-1.5 px-2 rounded-lg border border-[#E6E2D5]">
                    <span className="text-[10px] text-slate-500 block">
                      {language === 'bn' ? 'বাচ্চা প্রতি মোট ব্যয়' : 'Cost per Chick'}
                    </span>
                    <span className="font-bold text-slate-800 text-xs">
                      ৳{' '}
                      {language === 'bn'
                        ? toBengaliNumber(costPerChick.toLocaleString())
                        : costPerChick.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-[#FAF8F2] py-1.5 px-2 rounded-lg border border-[#E6E2D5]">
                    <span className="text-[10px] text-slate-500 block">
                      {language === 'bn' ? 'খাদ্য খরচ অনুপাত' : 'Feed Share'}
                    </span>
                    <span className="font-bold text-slate-800 text-xs">
                      {language === 'bn'
                        ? `${toBengaliNumber(feedSharePercentage)}%`
                        : `${feedSharePercentage}%`}
                    </span>
                  </div>

                  <div className="bg-[#FAF8F2] py-1.5 px-2 rounded-lg border border-[#E6E2D5]">
                    <span className="text-[10px] text-slate-500 block">
                      {language === 'bn' ? 'গড় বিক্রয় দর' : 'Avg Sale Rate'}
                    </span>
                    <span className="font-bold text-slate-800 text-xs">
                      {avgSoldRate !== '0'
                        ? language === 'bn'
                          ? `৳ ${toBengaliNumber(avgSoldRate)}/কেজি`
                          : `৳ ${avgSoldRate}/kg`
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ALL-TIME FARM OVERALL FINANCIAL HIGHLIGHT */}
              <div className="space-y-2 pt-1">
                <h5 className="font-bold text-xs text-[#557567] uppercase tracking-wider flex items-center space-x-1.5">
                  <span>{language === 'bn' ? 'সার্বিক খামার খতিয়ান' : 'All-Time Farm Ledger'}</span>
                </h5>

                {/* Farm Overall Net Highlight Banner */}
                <div
                  className={`p-3.5 rounded-xl border text-center ${
                    isGrandProfitable
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">
                    {isGrandProfitable
                      ? language === 'bn'
                        ? 'সার্বিক খামার নীট লাভ'
                        : 'All-Time Total Farm Profit'
                      : language === 'bn'
                      ? 'সার্বিক খামার নীট ক্ষতি'
                      : 'All-Time Net Loss'}
                  </span>
                  <div className="text-2xl font-black mt-1 flex items-center justify-center space-x-1">
                    {isGrandProfitable ? (
                      <TrendingUp className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-rose-600" />
                    )}
                    <span>
                      ৳{' '}
                      {language === 'bn'
                        ? toBengaliNumber(Math.abs(grandTotalNetProfit).toLocaleString())
                        : Math.abs(grandTotalNetProfit).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Income vs Expense Breakdown Columns */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Total Incomes */}
                  <div className="bg-white p-3 rounded-xl border border-[#E6E2D5] space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-xs">
                      <ArrowDownCircle className="w-4 h-4" />
                      <span>{language === 'bn' ? 'মোট আয়' : 'Total Incomes'}</span>
                    </div>
                    <p className="text-lg font-bold text-slate-800">
                      ৳{' '}
                      {language === 'bn'
                        ? toBengaliNumber(grandTotalIncome.toLocaleString())
                        : grandTotalIncome.toLocaleString()}
                    </p>

                    <div className="space-y-1 pt-1 border-t border-slate-100 text-[11px] text-slate-600">
                      <div className="flex justify-between">
                        <span>{language === 'bn' ? 'মুরগি বিক্রয়:' : 'Chicken:'}</span>
                        <span className="font-semibold">
                          ৳ {toBengaliNumber(grandTotalChickenIncome.toLocaleString())}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'bn' ? 'ডিম বিক্রয়:' : 'Eggs:'}</span>
                        <span className="font-semibold">
                          ৳ {toBengaliNumber(grandTotalEggIncome.toLocaleString())}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'bn' ? 'অন্যান্য আয়:' : 'Other:'}</span>
                        <span className="font-semibold">
                          ৳ {toBengaliNumber(grandTotalOtherIncome.toLocaleString())}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Total Expenses */}
                  <div className="bg-white p-3 rounded-xl border border-[#E6E2D5] space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-rose-700 font-bold text-xs">
                      <ArrowUpCircle className="w-4 h-4" />
                      <span>{language === 'bn' ? 'মোট ব্যয়' : 'Total Expenses'}</span>
                    </div>
                    <p className="text-lg font-bold text-slate-800">
                      ৳{' '}
                      {language === 'bn'
                        ? toBengaliNumber(grandTotalExpenses.toLocaleString())
                        : grandTotalExpenses.toLocaleString()}
                    </p>

                    <div className="space-y-1 pt-1 border-t border-slate-100 text-[11px] text-slate-600">
                      <div className="flex justify-between">
                        <span>{language === 'bn' ? 'খাদ্য (ফিড):' : 'Feed:'}</span>
                        <span className="font-semibold">
                          ৳{' '}
                          {toBengaliNumber(
                            expenses
                              .filter((e) => e.category === 'feed')
                              .reduce((s, e) => s + e.amount, 0)
                              .toLocaleString()
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'bn' ? 'বাচ্চা ক্রয়:' : 'Chicks:'}</span>
                        <span className="font-semibold">
                          ৳{' '}
                          {toBengaliNumber(
                            expenses
                              .filter((e) => e.category === 'chicks')
                              .reduce((s, e) => s + e.amount, 0)
                              .toLocaleString()
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'bn' ? 'ওষুধ/টিকা:' : 'Meds:'}</span>
                        <span className="font-semibold">
                          ৳{' '}
                          {toBengaliNumber(
                            expenses
                              .filter((e) => e.category === 'medicine')
                              .reduce((s, e) => s + e.amount, 0)
                              .toLocaleString()
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'bn' ? 'অন্যান্য:' : 'Other:'}</span>
                        <span className="font-semibold">
                          ৳{' '}
                          {toBengaliNumber(
                            expenses
                              .filter((e) => !['feed', 'chicks', 'medicine'].includes(e.category))
                              .reduce((s, e) => s + e.amount, 0)
                              .toLocaleString()
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dues & Balance Box */}
              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 space-y-2">
                <h5 className="font-bold text-xs text-amber-900 uppercase tracking-wider">
                  {language === 'bn' ? 'বকেয়া হিসাব (Dues Status)' : 'Outstanding Dues'}
                </h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-amber-200">
                    <span className="text-[10px] text-slate-500 block">
                      {language === 'bn' ? 'ক্রেতাদের কাছে বাকি পাওনা' : 'Receivable from Buyers'}
                    </span>
                    <span className="font-bold text-emerald-700 text-sm">
                      ৳{' '}
                      {language === 'bn'
                        ? toBengaliNumber(totalReceivables.toLocaleString())
                        : totalReceivables.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-amber-200">
                    <span className="text-[10px] text-slate-500 block">
                      {language === 'bn' ? 'ডিলারদের নিকট দেনা' : 'Payable to Dealers'}
                    </span>
                    <span className="font-bold text-rose-700 text-sm">
                      ৳{' '}
                      {language === 'bn'
                        ? toBengaliNumber(totalPayables.toLocaleString())
                        : totalPayables.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: PDF & CSV Download */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadStatementPdf}
                  disabled={isExportingPdf}
                  id="btn-download-statement-pdf-footer"
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs ${
                    pdfSuccess
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#0E3D2F] hover:bg-[#16503E] text-white'
                  }`}
                >
                  {isExportingPdf ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : pdfSuccess ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Download className="w-4 h-4 text-[#86E4B9]" />
                  )}
                  <span>
                    {language === 'bn'
                      ? 'কোম্পানি হেডার সহ PDF ডাউনলোড'
                      : 'Download PDF Report (with Header)'}
                  </span>
                </button>

                <button
                  onClick={handleDownloadStatementCsv}
                  disabled={isDownloading}
                  id="btn-download-statement-csv-footer"
                  className="w-full py-2.5 px-3 bg-[#EBF5EF] hover:bg-[#DDF0E5] border border-[#B9DEC9] rounded-xl text-xs font-bold text-[#0E3D2F] flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#0E3D2F]" />
                  <span>
                    {language === 'bn'
                      ? 'এক্সেলে নামিয়ে নিন (CSV)'
                      : 'Download CSV (Excel / Sheets)'}
                  </span>
                </button>
              </div>

              {/* View Layout in Preview Mode */}
              <button
                onClick={() => setActiveTab('pdf_preview')}
                className="w-full py-2 px-3 bg-white hover:bg-[#FAF8F2] border border-[#D9D4C5] rounded-xl text-xs font-bold text-[#0E3D2F] flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#0E3D2F]" />
                <span>
                  {language === 'bn'
                    ? 'প্রিন্ট ও PDF লেআউটের প্রিভিউ দেখুন →'
                    : 'Preview Print & PDF Layout →'}
                </span>
              </button>

              {/* Quick Jump to Search & History */}
              <button
                onClick={() => setActiveTab('history')}
                className="w-full py-2 px-3 bg-white hover:bg-[#FAF8F2] border border-[#D9D4C5] rounded-xl text-xs font-bold text-[#557567] flex items-center justify-center space-x-2 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>
                  {language === 'bn'
                    ? 'অতীতের নির্দিষ্ট খরচ বা বিক্রয়ের ইতিহাস খুঁজুন →'
                    : 'Search Past Expenses & Sales History →'}
                </span>
              </button>
            </>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full bg-[#0E3D2F] hover:bg-[#16503E] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>

      {/* Hidden printable container for off-screen PDF / Print generation */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0',
          width: '820px',
          zIndex: -999,
          background: '#ffffff',
        }}
      >
        <div ref={printableRef}>
          <PrintableFinancialStatement
            farmSettings={farmSettings}
            farmName={farmName}
            language={language}
            currentBatch={currentBatch}
            generatedDate={formattedGeneratedDate}
            summary={{
              totalRevenue: batchTotalRevenue,
              totalExpenses: batchTotalExpenses,
              netProfit: batchNetProfit,
              costPerChick,
              feedSharePercentage,
              avgSoldRate,
              standingBirdsCount,
              standingFlockEstimatedValue,
            }}
            revenueBreakdown={{
              chickenSalesAmount: batchChickenIncome,
              chickenBirdsSold: batchSoldBirds,
              chickenWeightKg: batchSoldWeight,
              eggSalesAmount: batchEggIncome,
              otherIncomeAmount: batchOtherIncome,
            }}
            expenseBreakdown={statementExpenseBreakdown}
            dues={{
              receivableBuyers: totalReceivables,
              payableDealers: totalPayables,
            }}
            allTimeTotals={{
              totalIncome: grandTotalIncome,
              totalExpenses: grandTotalExpenses,
              netProfit: grandTotalNetProfit,
            }}
            transactions={statementBatchTransactions.map((tx) => ({
              date: tx.date,
              type: tx.type,
              categoryLabel: tx.categoryLabel,
              title: tx.title,
              entityName: tx.entityName,
              extraDetails: tx.extraDetails,
              paymentType: tx.paymentType,
              amount: tx.amount,
              dueAmount: tx.dueAmount,
              notes: tx.notes,
              isIncome: tx.isIncome,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

