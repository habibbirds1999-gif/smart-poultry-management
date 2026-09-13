import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { EggSaleRecord, Language } from '../../types';
import { toBengaliNumber } from '../../utils/banglaDate';

interface EggSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  eggSales: EggSaleRecord[];
  currentStockEggs: number;
  language: Language;
  onAddEggSale: (sale: Omit<EggSaleRecord, 'id'>) => void;
  onDeleteEggSale: (id: string) => void;
}

export const EggSalesModal: React.FC<EggSalesModalProps> = ({
  isOpen,
  onClose,
  eggSales,
  currentStockEggs,
  language,
  onAddEggSale,
  onDeleteEggSale,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [buyerName, setBuyerName] = useState('');
  const [saleType, setSaleType] = useState<'crate' | 'piece'>('crate');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>(360); // 360 taka per crate or 12 taka per egg
  const [paidAmount, setPaidAmount] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const qVal = Number(quantity) || 0;
  const rVal = Number(rate) || 0;
  const totalEggs = saleType === 'crate' ? qVal * 30 : qVal;
  const totalAmount = qVal * rVal;
  const paidVal = paidAmount === '' ? totalAmount : Number(paidAmount);
  const dueVal = Math.max(0, totalAmount - paidVal);

  const totalSalesRevenue = eggSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalEggsSold = eggSales.reduce((sum, s) => sum + s.totalEggs, 0);
  const totalDue = eggSales.reduce((sum, s) => sum + s.dueAmount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !quantity || !rate) return;

    onAddEggSale({
      date,
      buyerName: buyerName.trim(),
      saleType,
      quantity: Number(quantity),
      totalEggs,
      rate: Number(rate),
      totalAmount,
      paidAmount: paidVal,
      dueAmount: dueVal,
      notes: notes.trim() || undefined,
    });

    setBuyerName('');
    setQuantity('');
    setPaidAmount('');
    setNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#208A7C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💰</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {language === 'bn' ? 'ডিম বিক্রয় খাতা' : 'Egg Sales'}
              </h3>
              <p className="text-xs text-white/80">
                {language === 'bn' ? `মোট বিক্রয়: ৳ ${toBengaliNumber(totalSalesRevenue.toLocaleString())}` : `Total Sales: ৳ ${totalSalesRevenue.toLocaleString()}`}
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
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-teal-50 border border-teal-200 p-2.5 rounded-xl">
                  <span className="text-[11px] text-teal-800 font-medium block">
                    {language === 'bn' ? 'মোট বিক্রয়' : 'Total Sales'}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-teal-900">
                    ৳ {language === 'bn' ? toBengaliNumber(totalSalesRevenue.toLocaleString()) : totalSalesRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
                  <span className="text-[11px] text-amber-800 font-medium block">
                    {language === 'bn' ? 'বিক্রিত ডিম' : 'Sold Eggs'}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-amber-900">
                    {language === 'bn' ? toBengaliNumber(totalEggsSold) : totalEggsSold}
                  </span>
                </div>
                <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                  <span className="text-[11px] text-rose-800 font-medium block">
                    {language === 'bn' ? 'বকেয়া' : 'Total Due'}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-rose-900">
                    ৳ {language === 'bn' ? toBengaliNumber(totalDue.toLocaleString()) : totalDue.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-1">
                <h4 className="font-bold text-slate-800 text-sm">
                  {language === 'bn' ? 'ডিম বিক্রয়ের তালিকা' : 'Egg Sales Log'}
                </h4>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#208A7C] hover:bg-[#197569] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'bn' ? 'ডিম বিক্রয় লিখুন' : 'Add Egg Sale'}</span>
                </button>
              </div>

              {/* Sales List */}
              <div className="space-y-2.5">
                {eggSales.length > 0 ? (
                  eggSales.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 hover:bg-slate-100/90 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-800 text-sm">
                            {item.buyerName}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            ({item.date})
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 flex items-center space-x-2">
                          <span>
                            {item.saleType === 'crate'
                              ? (language === 'bn' ? `${toBengaliNumber(item.quantity)} খাঁচি / কেস (${toBengaliNumber(item.totalEggs)} টি)` : `${item.quantity} crates (${item.totalEggs} pcs)`)
                              : (language === 'bn' ? `${toBengaliNumber(item.quantity)} টি ডিম` : `${item.quantity} eggs`)}
                          </span>
                          <span>•</span>
                          <span className="text-teal-700 font-medium">
                            {language === 'bn'
                              ? `দর: ৳ ${toBengaliNumber(item.rate)}/${item.saleType === 'crate' ? 'কেস' : 'পিস'}`
                              : `Rate: ৳ ${item.rate}/${item.saleType}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <span className="font-bold text-slate-900 text-base block">
                            ৳ {language === 'bn' ? toBengaliNumber(item.totalAmount.toLocaleString()) : item.totalAmount.toLocaleString()}
                          </span>
                          {item.dueAmount > 0 ? (
                            <span className="text-[11px] font-medium text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                              {language === 'bn' ? `বাকি: ৳ ${toBengaliNumber(item.dueAmount.toLocaleString())}` : `Due: ৳ ${item.dueAmount.toLocaleString()}`}
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                              {language === 'bn' ? 'নগদ পরিশোধ' : 'Cash Paid'}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => onDeleteEggSale(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    {language === 'bn' ? 'কোনো ডিম বিক্রয়ের রেকর্ড নেই' : 'No egg sale records found'}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Add Sale Form */
            <form onSubmit={handleSubmit} className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm border-b pb-2">
                {language === 'bn' ? 'ডিম বিক্রয়ের বিবরণ দিন' : 'Enter Egg Sale Details'}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'ক্রেতার নাম' : 'Buyer Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: আল-মদিনা স্টোর"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'বিক্রয়ের একক' : 'Sale Unit'}
                  </label>
                  <select
                    value={saleType}
                    onChange={(e) => {
                      const type = e.target.value as 'crate' | 'piece';
                      setSaleType(type);
                      setRate(type === 'crate' ? 360 : 12);
                    }}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"
                  >
                    <option value="crate">{language === 'bn' ? 'খাঁচি / কেস (৩০টি)' : 'Crate (30 pcs)'}</option>
                    <option value="piece">{language === 'bn' ? 'খুচরা পিস' : 'Single Pieces'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'পরিমাণ' : 'Quantity'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="যেমন: ২০"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? `দর (৳ প্রতি ${saleType === 'crate' ? 'কেস' : 'পিস'})` : `Rate (৳ per ${saleType})`}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={rate}
                    onChange={(e) => setRate(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'মোট মূল্য' : 'Total Amount'}
                  </label>
                  <div className="w-full mt-1 px-3 py-2 bg-slate-100 border rounded-lg text-sm font-bold text-teal-800">
                    ৳ {language === 'bn' ? toBengaliNumber(totalAmount.toLocaleString()) : totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'নগদ জমা (৳)' : 'Cash Paid (৳)'}
                  </label>
                  <input
                    type="number"
                    placeholder={String(totalAmount)}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'বকেয়া' : 'Due Amount'}
                  </label>
                  <div className="w-full mt-1 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm font-bold text-amber-900">
                    ৳ {language === 'bn' ? toBengaliNumber(dueVal.toLocaleString()) : dueVal.toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  {language === 'bn' ? 'মন্তব্য' : 'Notes'}
                </label>
                <input
                  type="text"
                  placeholder="নগদ পরিশোধ / চালান নম্বর"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#208A7C] hover:bg-[#197569] text-white py-2.5 rounded-xl text-sm font-semibold"
                >
                  {language === 'bn' ? 'বিক্রয় সেভ করুন' : 'Save Egg Sale'}
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
