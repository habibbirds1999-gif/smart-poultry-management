import React, { useState } from 'react';
import { X, Plus, Trash2, Filter } from 'lucide-react';
import { ExpenseRecord, Dealer, Language } from '../../types';
import { toBengaliNumber } from '../../utils/banglaDate';

interface BatchExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: ExpenseRecord[];
  dealers: Dealer[];
  language: Language;
  onAddExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
}

export const BatchExpenseModal: React.FC<BatchExpenseModalProps> = ({
  isOpen,
  onClose,
  expenses,
  dealers,
  language,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form states
  const [category, setCategory] = useState<ExpenseRecord['category']>('feed');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit, setUnit] = useState('বস্তা');
  const [paymentType, setPaymentType] = useState<'cash' | 'due'>('cash');
  const [dealerId, setDealerId] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const filteredExpenses = selectedCategory === 'all'
    ? expenses
    : expenses.filter((e) => e.category === selectedCategory);

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    onAddExpense({
      batchId: 'batch-14',
      date,
      category,
      title: title.trim() || (category === 'feed' ? 'পোল্ট্রি ফিড খরচ' : 'খামার খরচ'),
      amount: Number(amount),
      quantity: quantity ? Number(quantity) : undefined,
      unit: quantity ? unit : undefined,
      dealerId: dealerId || undefined,
      paymentType,
      notes,
    });

    // Reset Form
    setTitle('');
    setAmount('');
    setNotes('');
    setShowAddForm(false);
  };

  const categoryNames: Record<string, { bn: string; en: string }> = {
    feed: { bn: 'খাদ্য (ফিড)', en: 'Feed' },
    chicks: { bn: 'বাচ্চা ক্রয়', en: 'Chicks' },
    medicine: { bn: 'ওষুধ ও ভ্যাকসিন', en: 'Medicine/Vaccine' },
    litter: { bn: 'লিটার (তুষ/ভুসি)', en: 'Litter' },
    electricity: { bn: 'বিদ্যুৎ ও জেনারেটর', en: 'Electricity' },
    gas_heat: { bn: 'গ্যাস ও ব্রুডিং তাপ', en: 'Gas/Brooding' },
    labor: { bn: 'শ্রমিক মজুরি', en: 'Labor' },
    transport: { bn: 'গাড়িভাড়া / পরিবহন', en: 'Transport' },
    other: { bn: 'অন্যান্য খরচ', en: 'Other' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#208A7C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👛</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {language === 'bn' ? 'ব্যাচ খরচ খাতা' : 'Batch Expenses'}
              </h3>
              <p className="text-xs text-white/80">
                {language === 'bn' ? `মোট খরচ: ৳ ${toBengaliNumber(totalExpense.toLocaleString())}` : `Total Spent: ৳ ${totalExpense.toLocaleString()}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {!showAddForm ? (
            <>
              {/* Category Filter Pills & Add Button */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 overflow-x-auto py-1 flex items-center space-x-1.5 no-scrollbar">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-[#208A7C] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {language === 'bn' ? 'সব খরচ' : 'All'}
                  </button>
                  {Object.entries(categoryNames).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === key
                          ? 'bg-[#208A7C] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {language === 'bn' ? val.bn : val.en}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#208A7C] hover:bg-[#197569] text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center space-x-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'খরচ লিখুন' : 'Add'}</span>
                </button>
              </div>

              {/* Expenses List */}
              <div className="space-y-2.5">
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 hover:bg-slate-100/80 p-3 rounded-xl border border-slate-200 flex items-center justify-between transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-800 text-sm">
                            {item.title}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            item.paymentType === 'cash' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.paymentType === 'cash' ? (language === 'bn' ? 'নগদ' : 'Cash') : (language === 'bn' ? 'বাকি' : 'Due')}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 flex items-center space-x-2">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span className="text-teal-700 font-medium">
                            {language === 'bn' ? categoryNames[item.category]?.bn : categoryNames[item.category]?.en}
                          </span>
                          {item.quantity && (
                            <>
                              <span>•</span>
                              <span>{language === 'bn' ? `${toBengaliNumber(item.quantity)} ${item.unit}` : `${item.quantity} ${item.unit}`}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <span className="font-bold text-slate-900 text-base">
                            ৳ {language === 'bn' ? toBengaliNumber(item.amount.toLocaleString()) : item.amount.toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => onDeleteExpense(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    {language === 'bn' ? 'এই ক্যাটাগরিতে কোনো খরচের হিসাব নেই' : 'No expenses found in this category'}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Add Expense Form */
            <form onSubmit={handleSubmit} className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm border-b pb-2">
                {language === 'bn' ? 'নতুন খরচের বিবরণ যোগ করুন' : 'Record New Expense'}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'খরচের খাত (Category)' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseRecord['category'])}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"
                  >
                    {Object.entries(categoryNames).map(([key, val]) => (
                      <option key={key} value={key}>
                        {language === 'bn' ? val.bn : val.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'তারিখ' : 'Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  {language === 'bn' ? 'বিবরণ / শিরোনাম' : 'Description'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ব্রয়লার গ্রোয়ার ফিড ১৫ বস্তা"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'টাকার পরিমাণ (৳)' : 'Amount (৳)'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="৳ 0"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'পরিশোধের ধরন' : 'Payment Mode'}
                  </label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value as 'cash' | 'due')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"
                  >
                    <option value="cash">{language === 'bn' ? 'নগদ পরিশোধ (Cash)' : 'Cash'}</option>
                    <option value="due">{language === 'bn' ? 'বাকি (Due)' : 'Due / Credit'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'পরিমাণ (সংখ্যা - ঐচ্ছিক)' : 'Quantity (Optional)'}
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: ১০"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'একক' : 'Unit'}
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="বস্তা / লিটার / কেজি"
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              {dealers.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'সংশ্লিষ্ট ডিলার (ঐচ্ছিক)' : 'Related Dealer (Optional)'}
                  </label>
                  <select
                    value={dealerId}
                    onChange={(e) => setDealerId(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"
                  >
                    <option value="">{language === 'bn' ? '-- নির্বাচন করুন --' : '-- None --'}</option>
                    {dealers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.companyName} ({d.name})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#208A7C] hover:bg-[#197569] text-white py-2.5 rounded-xl text-sm font-semibold"
                >
                  {language === 'bn' ? 'খরচ সংরক্ষণ করুন' : 'Save Expense'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-medium"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
