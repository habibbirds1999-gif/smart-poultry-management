/**
 * Utility for exporting financial statements and ledger transactions to CSV (UTF-8 with BOM)
 * formatted specifically for flawless rendering in Microsoft Excel and Google Sheets.
 */

export interface StatementMetricItem {
  labelBn: string;
  labelEn: string;
  value: string | number;
}

export interface ExpenseCategorySummary {
  categoryKey: string;
  categoryLabel: string;
  amount: number;
  percentage: number;
}

export interface ExportTransactionRow {
  date: string;
  type: string;
  categoryLabel: string;
  title: string;
  entityName?: string;
  extraDetails?: string;
  paymentType?: string;
  amount: number;
  dueAmount?: number;
  notes?: string;
  isIncome: boolean;
}

export interface FinancialStatementExportData {
  farmName?: string;
  generatedDate: string;
  batch?: {
    batchNumber: string;
    breed: string;
    startDate: string;
    status: string;
    initialBirds: number;
    currentBirds: number;
    deadBirds: number;
    currentAvgWeightKg?: number;
  };
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

/**
 * Cleanly escapes a cell for CSV compliance (RFC 4180)
 */
export function escapeCsvCell(cell: string | number | null | undefined): string {
  if (cell === null || cell === undefined) return '""';
  const str = String(cell).trim();
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates the full CSV text with UTF-8 BOM
 */
export function generateFinancialStatementCsv(
  data: FinancialStatementExportData,
  lang: 'bn' | 'en' = 'bn'
): string {
  const isBn = lang === 'bn';
  const lines: string[] = [];

  const row = (...cells: (string | number | null | undefined)[]) => {
    lines.push(cells.map(escapeCsvCell).join(','));
  };

  const emptyRow = () => lines.push('');

  // 1. Report Title & Metadata Header
  row(isBn ? 'স্মার্ট পোল্ট্রি - আর্থিক বিবরণী (Financial Statement)' : 'Smart Poultry - Financial Statement');
  row(
    isBn ? 'খামার:' : 'Farm:',
    data.farmName || (isBn ? 'স্মার্ট পোল্ট্রি খামার' : 'Smart Poultry Farm')
  );
  row(
    isBn ? 'রিপোর্ট তৈরির তারিখ:' : 'Report Generated:',
    data.generatedDate
  );

  if (data.batch) {
    row(isBn ? 'ব্যাচ নম্বর:' : 'Batch Number:', data.batch.batchNumber);
    row(isBn ? 'মুরগির জাত:' : 'Breed:', data.batch.breed);
    row(isBn ? 'ব্যাচ শুরুর তারিখ:' : 'Start Date:', data.batch.startDate);
    row(isBn ? 'ব্যাচের অবস্থা:' : 'Batch Status:', data.batch.status);
    row(isBn ? 'শুরুর মোট বাচ্চা:' : 'Initial Birds:', data.batch.initialBirds);
    row(isBn ? 'বর্তমান জীবিত মুরগি:' : 'Current Live Birds:', data.batch.currentBirds);
    row(isBn ? 'মৃত মুরগি:' : 'Dead Birds:', data.batch.deadBirds);
  }

  emptyRow();

  // 2. Executive Financial Summary
  row(
    isBn ? '=== আর্থিক সারসংক্ষেপ (FINANCIAL SUMMARY) ===' : '=== FINANCIAL SUMMARY ==='
  );
  row(
    isBn ? 'বিবরণ (Metric)' : 'Metric',
    isBn ? 'টাকা / পরিমাণ (Value)' : 'Value'
  );
  row(
    isBn ? 'মোট ব্যাচ আয় (Total Batch Revenue)' : 'Total Batch Revenue',
    `৳ ${data.summary.totalRevenue.toLocaleString()}`
  );
  row(
    isBn ? 'মোট ব্যাচ ব্যয় (Total Batch Expenses)' : 'Total Batch Expenses',
    `৳ ${data.summary.totalExpenses.toLocaleString()}`
  );
  row(
    isBn
      ? data.summary.netProfit >= 0
        ? 'ব্যাচ নীট লাভ (Net Profit)'
        : 'ব্যাচ নীট ঘাটতি (Net Loss)'
      : 'Batch Net Profit / Loss',
    `${data.summary.netProfit >= 0 ? '+' : '-'}৳ ${Math.abs(data.summary.netProfit).toLocaleString()}`
  );
  row(
    isBn ? 'বাচ্চা প্রতি গড় উৎপাদন খরচ' : 'Cost per Chick',
    `৳ ${data.summary.costPerChick.toLocaleString()}`
  );
  row(
    isBn ? 'মোট খরচে ফিডের অনুপাত' : 'Feed Share Percentage',
    `${data.summary.feedSharePercentage}%`
  );
  row(
    isBn ? 'গড় বিক্রয় দর (প্রতি কেজি)' : 'Average Sale Rate per kg',
    data.summary.avgSoldRate !== '0' ? `৳ ${data.summary.avgSoldRate}/kg` : '-'
  );
  row(
    isBn ? 'শেডে মজুদ মুরগির আনুমানিক মূল্য' : 'Standing Live Flock Est. Value',
    `৳ ${data.summary.standingFlockEstimatedValue.toLocaleString()}`
  );

  emptyRow();

  // 3. Revenue Breakdown Table
  row(isBn ? '=== আয়ের বিভাজন (REVENUE BREAKDOWN) ===' : '=== REVENUE BREAKDOWN ===');
  row(
    isBn ? 'আয়ের খাত (Source)' : 'Income Source',
    isBn ? 'পরিমাণ (Quantity)' : 'Quantity / Weight',
    isBn ? 'টাকা (Amount ৳)' : 'Amount (BDT)'
  );
  row(
    isBn ? 'মুরগি বিক্রয় (Chicken Sales)' : 'Chicken Sales',
    isBn
      ? `${data.revenueBreakdown.chickenBirdsSold} টি (${data.revenueBreakdown.chickenWeightKg} কেজি)`
      : `${data.revenueBreakdown.chickenBirdsSold} birds (${data.revenueBreakdown.chickenWeightKg} kg)`,
    `৳ ${data.revenueBreakdown.chickenSalesAmount.toLocaleString()}`
  );
  row(
    isBn ? 'ডিম বিক্রয় (Egg Sales)' : 'Egg Sales',
    '-',
    `৳ ${data.revenueBreakdown.eggSalesAmount.toLocaleString()}`
  );
  row(
    isBn ? 'অন্যান্য আয় (বিষ্ঠা/লিটার ইত্যাদি)' : 'Other Income (Litter/Manure etc.)',
    '-',
    `৳ ${data.revenueBreakdown.otherIncomeAmount.toLocaleString()}`
  );
  row(
    isBn ? 'মোট আয় (Total Revenue)' : 'Total Revenue',
    '-',
    `৳ ${data.summary.totalRevenue.toLocaleString()}`
  );

  emptyRow();

  // 4. Expense Breakdown Table
  row(isBn ? '=== ব্যয়ের বিভাজন (EXPENSES BREAKDOWN) ===' : '=== EXPENSES BREAKDOWN ===');
  row(
    isBn ? 'ব্যয়ের খাত (Expense Category)' : 'Category',
    isBn ? 'মোট টাকা (Amount ৳)' : 'Amount (BDT)',
    isBn ? 'শতকরা অনুপাত (% of Expense)' : 'Share (%)'
  );
  data.expenseBreakdown.forEach((cat) => {
    row(cat.categoryLabel, `৳ ${cat.amount.toLocaleString()}`, `${cat.percentage}%`);
  });
  row(
    isBn ? 'সর্বমোট ব্যয় (Total Expenses)' : 'Total Expenses',
    `৳ ${data.summary.totalExpenses.toLocaleString()}`,
    '100%'
  );

  emptyRow();

  // 5. Receivables and Payables Dues
  row(isBn ? '=== বকেয়া ও দেনা-পাওনা (DUES STATUS) ===' : '=== DUES & BALANCES ===');
  row(isBn ? 'খাত' : 'Account', isBn ? 'টাকা (BDT)' : 'Amount (BDT)');
  row(
    isBn ? 'পাইকার ও ক্রেতাদের কাছে বাকি পাওনা (Receivables)' : 'Receivables from Buyers',
    `৳ ${data.dues.receivableBuyers.toLocaleString()}`
  );
  row(
    isBn ? 'ফিড ও ওষুধ ডিলারদের নিকট দেনা (Payables)' : 'Payables to Feed/Med Dealers',
    `৳ ${data.dues.payableDealers.toLocaleString()}`
  );

  emptyRow();

  // 6. All-Time Farm Summary
  row(isBn ? '=== সার্বিক খামার খতিয়ান (ALL-TIME FARM TOTALS) ===' : '=== ALL-TIME FARM TOTALS ===');
  row(isBn ? 'খাত' : 'Category', isBn ? 'টাকা (BDT)' : 'Amount (BDT)');
  row(
    isBn ? 'সার্বিক মোট আয় (Grand Total Income)' : 'Grand Total Income',
    `৳ ${data.allTimeTotals.totalIncome.toLocaleString()}`
  );
  row(
    isBn ? 'সার্বিক মোট ব্যয় (Grand Total Expenses)' : 'Grand Total Expenses',
    `৳ ${data.allTimeTotals.totalExpenses.toLocaleString()}`
  );
  row(
    isBn ? 'সার্বিক নীট লাভ/ক্ষতি (All-Time Profit/Loss)' : 'All-Time Net Profit/Loss',
    `${data.allTimeTotals.netProfit >= 0 ? '+' : '-'}৳ ${Math.abs(data.allTimeTotals.netProfit).toLocaleString()}`
  );

  emptyRow();

  // 7. Itemized Detailed Transactions
  row(
    isBn
      ? '=== বিস্তারিত লেনদেনের তালিকা (ITEMIZED TRANSACTIONS) ==='
      : '=== ITEMIZED TRANSACTIONS ==='
  );
  row(
    isBn ? 'তারিখ (Date)' : 'Date',
    isBn ? 'ধরন (Type)' : 'Type',
    isBn ? 'খাত (Category)' : 'Category',
    isBn ? 'বিবরণ (Title)' : 'Title',
    isBn ? 'ডিলার / ক্রেতা (Entity)' : 'Party/Entity',
    isBn ? 'অতিরিক্ত তথ্য (Details)' : 'Details/Qty',
    isBn ? 'পরিশোধ (Payment)' : 'Payment Method',
    isBn ? 'টাকা (Amount ৳)' : 'Amount (BDT)',
    isBn ? 'বাকি টাকা (Due ৳)' : 'Due (BDT)',
    isBn ? 'মন্তব্য (Notes)' : 'Notes'
  );

  data.transactions.forEach((tx) => {
    const typeLabel = tx.isIncome
      ? isBn ? 'আয় (Income)' : 'Income'
      : isBn ? 'ব্যয় (Expense)' : 'Expense';

    row(
      tx.date,
      typeLabel,
      tx.categoryLabel,
      tx.title,
      tx.entityName || '-',
      tx.extraDetails || '-',
      tx.paymentType === 'due' ? (isBn ? 'বাকি' : 'Due') : (isBn ? 'নগদ' : 'Cash'),
      tx.amount,
      tx.dueAmount || 0,
      tx.notes || ''
    );
  });

  // Prepend UTF-8 BOM so Microsoft Excel correctly renders Bengali text
  return '\uFEFF' + lines.join('\r\n');
}

/**
 * Triggers a browser download of the CSV file
 */
export function triggerCsvDownload(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
