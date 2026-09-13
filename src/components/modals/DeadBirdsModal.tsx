import React, { useState } from 'react';
import { X, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { DeadBirdRecord, Batch, Language } from '../../types';
import { toBengaliNumber } from '../../utils/banglaDate';

interface DeadBirdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deadRecords: DeadBirdRecord[];
  activeBatch?: Batch;
  language: Language;
  onAddDeadRecord: (record: Omit<DeadBirdRecord, 'id'>) => void;
  onDeleteDeadRecord: (id: string) => void;
}

export const DeadBirdsModal: React.FC<DeadBirdsModalProps> = ({
  isOpen,
  onClose,
  deadRecords,
  activeBatch,
  language,
  onAddDeadRecord,
  onDeleteDeadRecord,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  // Form
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [count, setCount] = useState<number | ''>('');
  const [cause, setCause] = useState<DeadBirdRecord['cause']>('unknown');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const totalDeaths = deadRecords.reduce((sum, r) => sum + r.count, 0);
  const initialBirds = activeBatch?.initialBirds || 2000;
  const mortalityPercent = ((totalDeaths / initialBirds) * 100).toFixed(1);
  const numericMortality = parseFloat(mortalityPercent);

  const causeLabels: Record<string, { bn: string; en: string }> = {
    heat_stroke: { bn: 'অতিরিক্ত গরম / হিট স্ট্রোক', en: 'Heat Stroke' },
    gumboro: { bn: 'গামবোরো ডিজিজ (IBD)', en: 'Gumboro Disease' },
    coccidiosis: { bn: 'রক্ত আমাশয় (Coccidiosis)', en: 'Coccidiosis' },
    respiratory: { bn: 'ঠান্ডা / শ্বাসকষ্ট (CRD)', en: 'Respiratory / CRD' },
    accident: { bn: 'চাপা পড়ে / দুর্ঘটনা', en: 'Accidental / Smothering' },
    unknown: { bn: 'অজ্ঞাত কারণ / দুর্বলতা', en: 'General / Unknown' },
    other: { bn: 'অন্যান্য অসুখ', en: 'Other Causes' },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!count || Number(count) <= 0) return;

    onAddDeadRecord({
      batchId: activeBatch?.id || 'batch-14',
      date,
      count: Number(count),
      cause,
      notes: notes.trim() || undefined,
    });

    setCount('');
    setNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#208A7C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {language === 'bn' ? 'মৃত মুরগির রেজিস্টার' : 'Dead Birds Record'}
              </h3>
              <p className="text-xs text-white/80">
                {language === 'bn'
                  ? `মোট মৃত্যু: ${toBengaliNumber(totalDeaths)} টি (${toBengaliNumber(mortalityPercent)}%)`
                  : `Total Mortality: ${totalDeaths} (${mortalityPercent}%)`}
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
              {/* Mortality Status Gauge */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                numericMortality <= 4
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : numericMortality <= 6
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center space-x-2.5">
                  {numericMortality <= 4 ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-sm block">
                      {numericMortality <= 4
                        ? (language === 'bn' ? 'মৃত্যুর হার স্বাভাবিক মাত্রায় আছে' : 'Mortality within normal range')
                        : (language === 'bn' ? 'সতর্কতা: দ্রুত কারণ অনুসন্ধান করুন' : 'Warning: High mortality detected')}
                    </span>
                    <span className="text-xs opacity-80">
                      {language === 'bn'
                        ? `মোট বাচ্চার ${toBengaliNumber(mortalityPercent)}% মৃত্যু (স্ট্যান্ডার্ড: ৪% এর নিচে)`
                        : `${mortalityPercent}% of initial birds (Standard: below 4%)`}
                    </span>
                  </div>
                </div>

                <div className="text-right pl-2 shrink-0">
                  <span className="text-2xl font-black">
                    {language === 'bn' ? toBengaliNumber(totalDeaths) : totalDeaths}
                  </span>
                  <span className="text-xs block opacity-80">
                    {language === 'bn' ? 'টি মৃত' : 'birds'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-1">
                <h4 className="font-bold text-slate-800 text-sm">
                  {language === 'bn' ? 'দৈনিক মৃত্যুর হিসাব' : 'Mortality Log'}
                </h4>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#208A7C] hover:bg-[#197569] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'bn' ? 'মৃত্যু সংখ্যা লিখুন' : 'Log Mortality'}</span>
                </button>
              </div>

              {/* Records List */}
              <div className="space-y-2.5">
                {deadRecords.length > 0 ? (
                  deadRecords.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 hover:bg-slate-100/90 p-3 rounded-xl border border-slate-200 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-rose-700 text-sm">
                            {language === 'bn' ? `${toBengaliNumber(item.count)} টি মুরগি` : `${item.count} birds`}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            ({item.date})
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 mt-1 flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-medium text-[11px]">
                            {causeLabels[item.cause]?.[language] || item.cause}
                          </span>
                          {item.notes && (
                            <span className="text-slate-500 italic">
                              "{item.notes}"
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteDeadRecord(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    {language === 'bn' ? 'কোনো মৃত্যুর রেকর্ড নেই। খামার সম্পূর্ণ সুস্থ!' : 'No mortality logged.'}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Add Mortality Form */
            <form onSubmit={handleSubmit} className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm border-b pb-2">
                {language === 'bn' ? 'মৃত মুরগির সংখ্যা ও কারণ লিখুন' : 'Enter Mortality Details'}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'মৃত মুরগির সংখ্যা' : 'Dead Bird Count'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="যেমন: ৫"
                    value={count}
                    onChange={(e) => setCount(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-bold text-rose-700"
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

              <div>
                <label className="text-xs font-medium text-slate-700">
                  {language === 'bn' ? 'সম্ভাব্য কারণ' : 'Suspected Cause'}
                </label>
                <select
                  value={cause}
                  onChange={(e) => setCause(e.target.value as DeadBirdRecord['cause'])}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  {Object.entries(causeLabels).map(([k, val]) => (
                    <option key={k} value={k}>
                      {val[language]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  {language === 'bn' ? 'লক্ষণ বা মন্তব্য' : 'Symptoms / Notes'}
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: পেট ফোলা, ড্রপিং সবুজ, রাতে ব্রুডিং তাপমাত্রা কম ছিল"
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
                  {language === 'bn' ? 'মৃত্যু এন্ট্রি সংরক্ষণ করুন' : 'Save Mortality'}
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
