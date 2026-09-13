import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { OtherRevenueRecord, Language } from '../../types';
import { toBengaliNumber } from '../../utils/banglaDate';

interface OtherRevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  revenues: OtherRevenueRecord[];
  language: Language;
  onAddRevenue: (rev: Omit<OtherRevenueRecord, 'id'>) => void;
  onDeleteRevenue: (id: string) => void;
}

export const OtherRevenueModal: React.FC<OtherRevenueModalProps> = ({
  isOpen,
  onClose,
  revenues,
  language,
  onAddRevenue,
  onDeleteRevenue,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  // Form
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [source, setSource] = useState<OtherRevenueRecord['source']>('feed_sacks');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [buyerName, setBuyerName] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);

  const sourceLabels: Record<string, { bn: string; en: string }> = {
    feed_sacks: { bn: 'খালি ফিডের বস্তা বিক্রয়', en: 'Empty Feed Sacks' },
    manure: { bn: 'মুরগির লিটার / বিষ্ঠা সার', en: 'Litter / Manure Fertilizer' },
    equipment_rent: { bn: 'যন্ত্রপাতি ভাড়া', en: 'Equipment Rental' },
    subsidy: { bn: 'সরকারি / কোম্পানি প্রণোদনা', en: 'Subsidy / Rebate' },
    other: { bn: 'অন্যান্য আয়', en: 'Other Income' },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    onAddRevenue({
      date,
      source,
      title: title.trim() || sourceLabels[source]?.[language] || 'অন্যান্য আয়',
      amount: Number(amount),
      buyerName: buyerName.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setAmount('');
    setBuyerName('');
    setNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#208A7C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💵</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {language === 'bn' ? 'অন্যান্য আয় খাতা' : 'Other Revenue'}
              </h3>
              <p className="text-xs text-white/80">
                {language === 'bn' ? `মোট আয়: ৳ ${toBengaliNumber(totalRevenue.toLocaleString())}` : `Total: ৳ ${totalRevenue.toLocaleString()}`}
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
              {/* Header with Add Button */}
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 text-sm">
                  {language === 'bn' ? 'আনুষঙ্গিক খামার আয়ের তালিকা' : 'Miscellaneous Earnings'}
                </h4>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#208A7C] hover:bg-[#197569] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'bn' ? 'আয় যোগ করুন' : 'Add Revenue'}</span>
                </button>
              </div>

              {/* Revenue List */}
              <div className="space-y-2.5">
                {revenues.length > 0 ? (
                  revenues.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 hover:bg-slate-100/90 p-3 rounded-xl border border-slate-200 flex items-center justify-between transition-colors"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-800 text-sm block">
                          {item.title}
                        </span>
                        <div className="text-xs text-slate-500 flex items-center space-x-2">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span className="text-teal-700 font-medium">
                            {sourceLabels[item.source]?.[language] || item.source}
                          </span>
                          {item.buyerName && (
                            <>
                              <span>•</span>
                              <span>{item.buyerName}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-slate-900 text-base">
                          ৳ {language === 'bn' ? toBengaliNumber(item.amount.toLocaleString()) : item.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => onDeleteRevenue(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    {language === 'bn' ? 'কোনো অন্যান্য আয়ের রেকর্ড নেই' : 'No records found'}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Add Form */
            <form onSubmit={handleSubmit} className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm border-b pb-2">
                {language === 'bn' ? 'অন্যান্য আয়ের বিবরণ দিন' : 'Enter Revenue Details'}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'আয়ের উৎস' : 'Revenue Source'}
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as OtherRevenueRecord['source'])}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"
                  >
                    {Object.entries(sourceLabels).map(([k, val]) => (
                      <option key={k} value={k}>
                        {val[language]}
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
                  placeholder="যেমন: খালি ৫০টি প্লাস্টিক বস্তা"
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
                    {language === 'bn' ? 'ক্রেতার নাম (ঐচ্ছিক)' : 'Buyer Name (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="ভাঙ্গারি বা চাষী"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  {language === 'bn' ? 'মন্তব্য' : 'Notes'}
                </label>
                <input
                  type="text"
                  placeholder="অতিরিক্ত তথ্য"
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
                  {language === 'bn' ? 'আয় সংরক্ষণ করুন' : 'Save Revenue'}
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
