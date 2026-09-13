import React from 'react';
import { X, Award, CheckCircle2, TrendingUp, Calendar, Archive } from 'lucide-react';
import { Batch, Language } from '../../types';
import { toBengaliNumber } from '../../utils/banglaDate';

interface OldBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  batches: Batch[];
  language: Language;
}

export const OldBatchModal: React.FC<OldBatchModalProps> = ({
  isOpen,
  onClose,
  batches,
  language,
}) => {
  if (!isOpen) return null;

  const completedBatches = batches.filter((b) => b.status === 'completed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#208A7C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐔</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {language === 'bn' ? 'পূর্ববর্তী ব্যাচ আর্কাইভ' : 'Old Batch Archive'}
              </h3>
              <p className="text-xs text-white/80">
                {language === 'bn'
                  ? `সম্পন্ন ব্যাচ: ${toBengaliNumber(completedBatches.length)} টি`
                  : `Completed Batches: ${completedBatches.length}`}
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
          {completedBatches.length > 0 ? (
            completedBatches.map((batch) => {
              const survivalRate = ((batch.currentBirds / batch.initialBirds) * 100).toFixed(1);
              return (
                <div
                  key={batch.id}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-slate-800 text-base">
                          {batch.batchNumber}
                        </h4>
                        <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                          {batch.breed}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {batch.startDate} ~ {batch.endDate || '2026-07-25'}
                        </span>
                      </p>
                    </div>

                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'সম্পন্ন' : 'Finished'}</span>
                    </span>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-slate-200 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">
                        {language === 'bn' ? 'শুরুর বাচ্চা' : 'Initial Birds'}
                      </span>
                      <span className="font-bold text-slate-800 text-sm">
                        {language === 'bn' ? toBengaliNumber(batch.initialBirds) : batch.initialBirds}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block">
                        {language === 'bn' ? 'বেঁচে থাকার হার' : 'Livability'}
                      </span>
                      <span className="font-bold text-emerald-600 text-sm">
                        {language === 'bn' ? `${toBengaliNumber(survivalRate)}%` : `${survivalRate}%`}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block">
                        {language === 'bn' ? 'গড় ওজন' : 'Avg Weight'}
                      </span>
                      <span className="font-bold text-teal-700 text-sm">
                        {language === 'bn' ? `${toBengaliNumber(batch.currentAvgWeightKg || 0.82)} kg` : `${batch.currentAvgWeightKg || 0.82} kg`}
                      </span>
                    </div>
                  </div>

                  {/* Notes / Result */}
                  {batch.notes && (
                    <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200/80 text-xs text-emerald-900 flex items-start space-x-2">
                      <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">{language === 'bn' ? 'ফলাফল ও নোট:' : 'Performance Summary:'}</span>
                        <p className="mt-0.5">{batch.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-slate-400 text-sm">
              <Archive className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p>{language === 'bn' ? 'কোনো পূর্ববর্তী ব্যাচের রেকর্ড নেই' : 'No archived batches found'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
