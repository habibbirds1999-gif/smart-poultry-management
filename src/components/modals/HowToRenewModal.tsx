import React from 'react';
import { X, Play, CheckCircle2, Phone, AlertCircle, Sparkles } from 'lucide-react';
import { Language } from '../../types';

interface HowToRenewModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onGoToRenew: () => void;
}

export const HowToRenewModal: React.FC<HowToRenewModalProps> = ({
  isOpen,
  onClose,
  language,
  onGoToRenew,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#208A7C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">▶️</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {language === 'bn' ? 'রিনিউ করার নিয়মাবলী ও ভিডিও' : 'How to Renew License'}
              </h3>
              <p className="text-xs text-white/80">
                {language === 'bn' ? 'বিকাশ ও নগদে সাবস্ক্রিপশন গাইড' : 'bKash & Nagad Payment Guide'}
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
          {/* Mock YouTube Video Player Container */}
          <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-md flex items-center justify-center group cursor-pointer border border-slate-800">
            {/* Background Thumbnail */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
              <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded w-fit mb-1">
                YouTube Guide
              </span>
              <p className="text-white font-bold text-sm sm:text-base drop-shadow-md">
                {language === 'bn'
                  ? 'পোল্ট্রি খাতা অ্যাপে বিকাশ ও নগদে রিনিউ করার সহজ উপায়'
                  : 'How to Renew Poultry Khata License via bKash / Nagad'}
              </p>
              <span className="text-xs text-white/80 mt-0.5">3:24 mins • HD Tutorial</span>
            </div>

            {/* Red Play Button */}
            <div className="relative z-10 w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3 pt-1">
            <h4 className="font-bold text-slate-800 text-sm">
              {language === 'bn' ? 'সহজ ৩টি ধাপে রিনিউ করুন:' : '3 Simple Steps to Renew:'}
            </h4>

            {/* Step 1 */}
            <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#208A7C] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                ১
              </div>
              <div className="text-xs sm:text-sm text-slate-700">
                <p className="font-bold text-slate-900">
                  {language === 'bn' ? 'প্যাকেজ নির্বাচন করুন' : 'Select Subscription Package'}
                </p>
                <p className="text-slate-600 text-xs mt-0.5">
                  {language === 'bn'
                    ? '১ মাস (৳১৫০), ৬ মাস (৳৮০০) অথবা ১ বছর (৳১৫০০) মেয়াদী প্যাকেজ বাছাই করুন।'
                    : 'Choose 1 Month (৳150), 6 Months (৳800), or 1 Year (৳1500) plan.'}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#208A7C] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                ২
              </div>
              <div className="text-xs sm:text-sm text-slate-700">
                <p className="font-bold text-slate-900">
                  {language === 'bn' ? 'বিকাশ / নগদ পেমেন্ট সম্পন্ন করুন' : 'Pay via bKash / Nagad'}
                </p>
                <p className="text-slate-600 text-xs mt-0.5">
                  {language === 'bn'
                    ? 'অ্যাপের মার্চেন্ট গেটওয়েতে আপনার মোবাইল নম্বর ও ওটিপি দিয়ে পেমেন্ট নিশ্চিত করুন।'
                    : 'Enter your mobile wallet number and confirm payment securely.'}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#208A7C] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                ৩
              </div>
              <div className="text-xs sm:text-sm text-slate-700">
                <p className="font-bold text-slate-900">
                  {language === 'bn' ? 'তাৎক্ষণিক অটো-অ্যাক্টিভেশন' : 'Instant Auto-Activation'}
                </p>
                <p className="text-slate-600 text-xs mt-0.5">
                  {language === 'bn'
                    ? 'টাকা কাটার সাথে সাথেই আপনার খাতার মেয়াদ স্বয়ংক্রিয়ভাবে বৃদ্ধি পাবে।'
                    : 'Your app validity days will immediately extend with confirmation.'}
                </p>
              </div>
            </div>
          </div>

          {/* Hotline Box */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-amber-600" />
              <span>
                {language === 'bn' ? 'যেকোনো সহায়তায় কল করুন:' : 'Helpline:'}{' '}
                <a
                  href="tel:01749660491"
                  className="font-bold underline hover:text-[#208A7C]"
                >
                  01749660491
                </a>
              </span>
            </div>
            <a
              href="tel:01749660491"
              className="bg-[#208A7C] hover:bg-[#1a6e63] text-white px-2.5 py-1 rounded-lg text-xs font-semibold"
            >
              {language === 'bn' ? 'কল দিন' : 'Call'}
            </a>
          </div>

          {/* CTA button */}
          <button
            onClick={() => {
              onClose();
              onGoToRenew();
            }}
            className="w-full bg-[#208A7C] hover:bg-[#197569] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'bn' ? 'এখনই রিনিউ করুন' : 'Proceed to Renew Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
