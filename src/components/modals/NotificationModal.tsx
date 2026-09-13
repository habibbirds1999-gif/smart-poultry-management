import React from 'react';
import { X, Bell, Syringe, Crown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Language, VaccineScheduleItem } from '../../types';
import { toBengaliNumber } from '../../utils/banglaDate';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  daysLeft: number;
  vaccines: VaccineScheduleItem[];
  onOpenRenew: () => void;
  onOpenVaccines: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  language,
  daysLeft,
  vaccines,
  onOpenRenew,
  onOpenVaccines,
}) => {
  if (!isOpen) return null;

  const upcomingVaccine = vaccines.find((v) => !v.isCompleted) || vaccines[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl border border-[#E6E2D5] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D5]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#0E3D2F] text-white flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0E3D2F]">
                {language === 'bn' ? 'বিজ্ঞপ্তি ও সতর্কতা' : 'Notifications & Alerts'}
              </h3>
              <p className="text-xs text-[#557567]">
                {language === 'bn' ? 'খামারের গুরুত্বপূর্ণ রিমাইন্ডার' : 'Important farm reminders'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="py-3 space-y-2.5">
          {/* 1. Subscription Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start space-x-3">
            <Crown className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <span className="font-bold text-amber-900 block">
                {language === 'bn' ? 'প্যাকেজের মেয়াদ' : 'Subscription Status'}
              </span>
              <p className="text-amber-800 mt-0.5">
                {language === 'bn'
                  ? `আপনার সাবস্ক্রিপশনের মেয়াদ আর মাত্র ${toBengaliNumber(daysLeft)} দিন বাকি রয়েছে। নির্বিঘ্নে ব্যবহারের জন্য এখনই রিনিউ করুন।`
                  : `You have ${daysLeft} days remaining on your subscription. Renew today for uninterrupted service.`}
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenRenew();
                }}
                className="mt-2 text-xs font-bold text-amber-900 underline hover:text-amber-700"
              >
                {language === 'bn' ? 'প্যাকেজ দেখুন ও রিনিউ করুন →' : 'View Packages & Renew →'}
              </button>
            </div>
          </div>

          {/* 2. Vaccine Alert */}
          {upcomingVaccine && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start space-x-3">
              <Syringe className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <span className="font-bold text-emerald-900 block">
                  {language === 'bn' ? 'আসন্ন ভ্যাকসিন সতর্কবার্তা' : 'Upcoming Vaccination'}
                </span>
                <p className="text-emerald-800 mt-0.5">
                  {language === 'bn'
                    ? `আগামী ভ্যাকসিন: ${upcomingVaccine.vaccineName} (${upcomingVaccine.disease}), দিন: ${toBengaliNumber(upcomingVaccine.dayNumber)} (${upcomingVaccine.route})`
                    : `Next Vaccine: ${upcomingVaccine.vaccineName} (${upcomingVaccine.disease}), Day ${upcomingVaccine.dayNumber} (${upcomingVaccine.route})`}
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenVaccines();
                  }}
                  className="mt-2 text-xs font-bold text-emerald-900 underline hover:text-emerald-700"
                >
                  {language === 'bn' ? 'টিকা ক্যালেন্ডার দেখুন →' : 'View Vaccine Schedule →'}
                </button>
              </div>
            </div>
          )}

          {/* 3. Daily Care Advice */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <span className="font-bold text-slate-800 block">
                {language === 'bn' ? 'দৈনিক বায়োসিকিউরিটি পরামর্শ' : 'Daily Biosecurity Tip'}
              </span>
              <p className="text-slate-600 mt-0.5">
                {language === 'bn'
                  ? 'খামারের পানির পাত্র প্রতিদিন ব্লিচিং বা জীবাণুনাশক দিয়ে ভালো করে পরিষ্কার করুন এবং তাপমাত্রা ও বায়ু চলাচল নিয়মিত পর্যবেক্ষণ করুন।'
                  : 'Clean drinkers with disinfectant daily and monitor shed temperature and ventilation.'}
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-2 py-2 bg-[#0E3D2F] text-white text-xs font-bold rounded-xl hover:bg-[#16503E] transition-colors"
        >
          {language === 'bn' ? 'ঠিক আছে' : 'OK'}
        </button>
      </div>
    </div>
  );
};
