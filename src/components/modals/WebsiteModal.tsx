import React from 'react';
import { X, Globe, ExternalLink, Shield, CloudCheck, Smartphone, Laptop } from 'lucide-react';
import { Language } from '../../types';

interface WebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const WebsiteModal: React.FC<WebsiteModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#208A7C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-6 h-6 text-white" />
            <div>
              <h3 className="font-bold text-lg leading-tight">
                poultrykhata.com
              </h3>
              <p className="text-xs text-white/80">
                {language === 'bn' ? 'ওয়েব ড্যাশবোর্ড ও ক্লাউড সিঙ্ক' : 'Web Dashboard & Cloud Sync'}
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
          <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#208A7C] text-white flex items-center justify-center mx-auto">
              <CloudCheck className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-teal-950 text-base">
              {language === 'bn' ? 'অনলাইন ক্লাউড ডাটাবেজ সিঙ্ক সক্রিয়' : 'Cloud Sync Connected'}
            </h4>
            <p className="text-xs text-teal-800 leading-relaxed max-w-md mx-auto">
              {language === 'bn'
                ? 'পোল্ট্রি খাতা মোবাইল অ্যাপ এবং poultrykhata.com ওয়েব পোর্টালের ডাটা একই সাথে সিঙ্ক থাকে। আপনি মোবাইল কিংবা কম্পিউটার যেকোনো স্থান থেকে হিসাব পরিচালনা করতে পারবেন।'
                : 'Your poultry farm records stay synchronized in real time across your mobile device and computer at poultrykhata.com.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <Smartphone className="w-5 h-5 text-[#208A7C]" />
              <h5 className="font-bold text-xs text-slate-800">
                {language === 'bn' ? 'মোবাইল অ্যাপ' : 'Mobile App'}
              </h5>
              <p className="text-[11px] text-slate-500">
                {language === 'bn' ? 'শেডে দাঁড়িয়ে দ্রুত হিসাব ও খাদ্য এন্ট্রি' : 'Instant shed-side daily recording'}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <Laptop className="w-5 h-5 text-indigo-600" />
              <h5 className="font-bold text-xs text-slate-800">
                {language === 'bn' ? 'কম্পিউটার ড্যাশবোর্ড' : 'PC Dashboard'}
              </h5>
              <p className="text-[11px] text-slate-500">
                {language === 'bn' ? 'বড় স্ক্রিনে এক্সেল শিট ও বিস্তারিত প্রিন্ট' : 'Large screen reports & Excel export'}
              </p>
            </div>
          </div>

          <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
            <span className="font-mono text-slate-800 font-semibold truncate">
              https://poultrykhata.com/dashboard
            </span>
            <a
              href="https://poultrykhata.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="bg-[#208A7C] text-white px-3 py-1 rounded-lg font-bold flex items-center space-x-1 shrink-0 ml-2"
            >
              <span>{language === 'bn' ? 'প্রবেশ করুন' : 'Visit'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
