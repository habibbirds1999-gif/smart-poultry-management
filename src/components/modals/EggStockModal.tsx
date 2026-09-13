import React, { useState } from 'react';
import { X, Plus, Trash2, Sun, Moon, AlertOctagon } from 'lucide-react';
import { EggStockEntry, Language } from '../../types';
import { toBengaliNumber } from '../../utils/banglaDate';

interface EggStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  eggEntries: EggStockEntry[];
  totalSoldEggs: number;
  language: Language;
  onAddEggEntry: (entry: Omit<EggStockEntry, 'id'>) => void;
  onDeleteEggEntry: (id: string) => void;
}

export const EggStockModal: React.FC<EggStockModalProps> = ({
  isOpen,
  onClose,
  eggEntries,
  totalSoldEggs,
  language,
  onAddEggEntry,
  onDeleteEggEntry,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [morningEggs, setMorningEggs] = useState<number | ''>('');
  const [eveningEggs, setEveningEggs] = useState<number | ''>('');
  const [brokenEggs, setBrokenEggs] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const totalCollected = eggEntries.reduce((sum, e) => sum + e.netGoodEggs, 0);
  const currentStockEggs = Math.max(0, totalCollected - totalSoldEggs);
  const currentStockCrates = (currentStockEggs / 30).toFixed(1);

  const mVal = Number(morningEggs) || 0;
  const eVal = Number(eveningEggs) || 0;
  const bVal = Number(brokenEggs) || 0;
  const netGood = Math.max(0, mVal + eVal - bVal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mVal + eVal === 0) return;

    onAddEggEntry({
      date,
      morningEggs: mVal,
      eveningEggs: eVal,
      brokenEggs: bVal,
      netGoodEggs: netGood,
      notes: notes.trim() || undefined,
    });

    setMorningEggs('');
    setEveningEggs('');
    setBrokenEggs('');
    setNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#208A7C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🧺</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {language === 'bn' ? 'ডিম মজুদ খাতা' : 'Egg Stock'}
              </h3>
              <p className="text-xs text-white/80">
                {language === 'bn'
                  ? `বর্তমান স্টক: ${toBengaliNumber(currentStockEggs)} টি (${toBengaliNumber(currentStockCrates)} কেস)`
                  : `In Stock: ${currentStockEggs} pcs (${currentStockCrates} crates)`}
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
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-center">
                  <span className="text-xs text-amber-800 font-medium block">
                    {language === 'bn' ? 'বর্তমান অবশিষ্ট ডিম' : 'Available Eggs'}
                  </span>
                  <span className="text-2xl font-bold text-amber-900">
                    {language === 'bn' ? toBengaliNumber(currentStockEggs) : currentStockEggs}
                  </span>
                  <span className="text-xs text-amber-700 block mt-0.5">
                    {language === 'bn' ? `(প্রায় ${toBengaliNumber(currentStockCrates)} খাঁচি / কেস)` : `(${currentStockCrates} crates)`}
                  </span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center">
                  <span className="text-xs text-emerald-800 font-medium block">
                    {language === 'bn' ? 'মোট সংগৃহীত ডিম' : 'Total Collected'}
                  </span>
                  <span className="text-2xl font-bold text-emerald-900">
                    {language === 'bn' ? toBengaliNumber(totalCollected) : totalCollected}
                  </span>
                  <span className="text-xs text-emerald-700 block mt-0.5">
                    {language === 'bn' ? `বিক্রিত: ${toBengaliNumber(totalSoldEggs)} টি` : `Sold: ${totalSoldEggs} pcs`}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-1">
                <h4 className="font-bold text-slate-800 text-sm">
                  {language === 'bn' ? 'দৈনিক ডিম সংগ্রহের রেকর্ড' : 'Daily Collection Log'}
                </h4>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#208A7C] hover:bg-[#197569] text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'bn' ? 'ডিম সংগ্রহ লিখুন' : 'Add Collection'}</span>
                </button>
              </div>

              {/* Collection List */}
              <div className="space-y-2.5">
                {eggEntries.length > 0 ? (
                  eggEntries.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 hover:bg-slate-100/90 p-3 rounded-xl border border-slate-200 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-800 text-sm">
                            {language === 'bn' ? `ভালো ডিম: ${toBengaliNumber(item.netGoodEggs)} টি` : `Net: ${item.netGoodEggs} pcs`}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            ({item.date})
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 flex items-center space-x-3 mt-1">
                          <span className="flex items-center space-x-1">
                            <Sun className="w-3 h-3 text-amber-500" />
                            <span>{language === 'bn' ? `সকাল: ${toBengaliNumber(item.morningEggs)}` : `Morn: ${item.morningEggs}`}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Moon className="w-3 h-3 text-indigo-500" />
                            <span>{language === 'bn' ? `বিকাল: ${toBengaliNumber(item.eveningEggs)}` : `Eve: ${item.eveningEggs}`}</span>
                          </span>
                          {item.brokenEggs > 0 && (
                            <span className="text-rose-600 flex items-center space-x-0.5">
                              <AlertOctagon className="w-3 h-3" />
                              <span>{language === 'bn' ? `ভাঙ্গা: ${toBengaliNumber(item.brokenEggs)}` : `Broken: ${item.brokenEggs}`}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteEggEntry(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    {language === 'bn' ? 'কোনো ডিম সংগ্রহের তথ্য নেই' : 'No egg collection entries'}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Add Collection Form */
            <form onSubmit={handleSubmit} className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm border-b pb-2">
                {language === 'bn' ? 'দৈনিক ডিম সংগ্রহের এন্ট্রি' : 'Daily Egg Collection Entry'}
              </h4>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  {language === 'bn' ? 'সংগ্রহের তারিখ' : 'Date'}
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'সকালের ডিম (পিস)' : 'Morning Eggs (pcs)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="যেমন: ৪০০"
                    value={morningEggs}
                    onChange={(e) => setMorningEggs(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'বিকালের ডিম (পিস)' : 'Evening Eggs (pcs)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="যেমন: ৩৫০"
                    value={eveningEggs}
                    onChange={(e) => setEveningEggs(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'ভাঙ্গা বা নষ্ট ডিম' : 'Broken / Cracked'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="০"
                    value={brokenEggs}
                    onChange={(e) => setBrokenEggs(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm text-rose-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'নীট ভালো ডিম' : 'Net Good Eggs'}
                  </label>
                  <div className="w-full mt-1 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm font-bold text-emerald-800">
                    {language === 'bn' ? `${toBengaliNumber(netGood)} টি` : `${netGood} pcs`}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  {language === 'bn' ? 'মন্তব্য (ঐচ্ছিক)' : 'Notes (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="যেমন: শেড নং ২ লেয়ার"
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
                  {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Collection'}
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
