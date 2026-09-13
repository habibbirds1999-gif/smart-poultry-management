import React, { useState } from 'react';
import { X, Check, Clock, AlertCircle, Syringe, ShieldCheck } from 'lucide-react';
import { VaccineScheduleItem, Language } from '../../types';
import { toBengaliNumber } from '../../utils/banglaDate';

interface VaccineModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaccines: VaccineScheduleItem[];
  language: Language;
  onToggleVaccine: (vaccineId: string) => void;
}

export const VaccineModal: React.FC<VaccineModalProps> = ({
  isOpen,
  onClose,
  vaccines,
  language,
  onToggleVaccine,
}) => {
  const [selectedBreed, setSelectedBreed] = useState<'all' | 'Broiler' | 'Layer' | 'Sonali'>('all');

  if (!isOpen) return null;

  const filteredVaccines = selectedBreed === 'all'
    ? vaccines
    : vaccines.filter((v) => v.breedSuitability.includes(selectedBreed));

  const completedCount = vaccines.filter((v) => v.isCompleted).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#208A7C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💉</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {language === 'bn' ? 'ভ্যাকসিন ও ওষুধ শিডিউল' : 'Vaccination Schedule'}
              </h3>
              <p className="text-xs text-white/80">
                {language === 'bn'
                  ? `${toBengaliNumber(completedCount)}/${toBengaliNumber(vaccines.length)} টি ভ্যাকসিন সম্পন্ন`
                  : `${completedCount}/${vaccines.length} completed`}
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
          {/* Breed Filter Tabs */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedBreed('all')}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                selectedBreed === 'all' ? 'bg-[#208A7C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'bn' ? 'সকল জাত' : 'All Breeds'}
            </button>
            <button
              onClick={() => setSelectedBreed('Broiler')}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                selectedBreed === 'Broiler' ? 'bg-[#208A7C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Broiler
            </button>
            <button
              onClick={() => setSelectedBreed('Sonali')}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                selectedBreed === 'Sonali' ? 'bg-[#208A7C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sonali
            </button>
            <button
              onClick={() => setSelectedBreed('Layer')}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                selectedBreed === 'Layer' ? 'bg-[#208A7C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Layer
            </button>
          </div>

          {/* Guidelines Banner */}
          <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl flex items-start space-x-2.5 text-xs text-sky-900">
            <ShieldCheck className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">
                {language === 'bn' ? 'ভ্যাকসিন প্রয়োগের গুরুত্বপূর্ণ নিয়ম:' : 'Essential Vaccination Rules:'}
              </p>
              <p className="opacity-90 mt-0.5 leading-relaxed">
                {language === 'bn'
                  ? 'ভ্যাকসিন দেওয়ার আগে পানি ফিল্টার করে ক্লোরিনমুক্ত করুন ও গুঁড়া দুধ মিশিয়ে নিন। সবসময় সকাল অথবা সন্ধ্যায় ঠান্ডা আবহাওয়ায় ভ্যাকসিন প্রয়োগ করুন।'
                  : 'Always administer vaccines in cool morning or evening hours using chlorine-free fresh water with skimmed milk powder.'}
              </p>
            </div>
          </div>

          {/* Vaccines Timeline */}
          <div className="space-y-3">
            {filteredVaccines.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.isCompleted
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                      item.isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {language === 'bn' ? `${toBengaliNumber(item.dayNumber)} দিন` : `Day ${item.dayNumber}`}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">
                        {item.vaccineName}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {item.disease}
                      </p>
                      <div className="flex items-center space-x-2 mt-1.5">
                        <span className="text-[11px] font-medium text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded">
                          {item.route}
                        </span>
                        {item.appliedDate && (
                          <span className="text-[11px] text-slate-500">
                            {language === 'bn' ? `প্রয়োগ: ${item.appliedDate}` : `Given: ${item.appliedDate}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleVaccine(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors flex items-center space-x-1 ${
                      item.isCompleted
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.isCompleted ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'সম্পন্ন' : 'Done'}</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{language === 'bn' ? 'বাকি আছে' : 'Pending'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
