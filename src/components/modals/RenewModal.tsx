import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Zap, Sparkles, CreditCard } from 'lucide-react';
import { Language } from '../../types';
import { toBengaliNumber } from '../../utils/banglaDate';

interface RenewModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysLeft: number;
  language: Language;
  onExtendSubscription: (days: number) => void;
}

export const RenewModal: React.FC<RenewModalProps> = ({
  isOpen,
  onClose,
  daysLeft,
  language,
  onExtendSubscription,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'1m' | '6m' | '1y'>('6m');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [phoneNumber, setPhoneNumber] = useState('01749660491');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [addedDays, setAddedDays] = useState(0);

  if (!isOpen) return null;

  const plans = [
    {
      id: '1m',
      title: language === 'bn' ? '১ মাস মেয়াদ' : '1 Month Plan',
      days: 30,
      price: 150,
      badge: '',
    },
    {
      id: '6m',
      title: language === 'bn' ? '৬ মাস মেয়াদ' : '6 Months Plan',
      days: 180,
      price: 800,
      badge: language === 'bn' ? 'জনপ্রিয়' : 'Popular',
    },
    {
      id: '1y',
      title: language === 'bn' ? '১ বছর মেয়াদ' : '1 Year Plan',
      days: 365,
      price: 1500,
      badge: language === 'bn' ? 'সেরা সাশ্রয়ী' : 'Best Value',
    },
  ];

  const currentSelected = plans.find((p) => p.id === selectedPlan)!;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setAddedDays(currentSelected.days);
      onExtendSubscription(currentSelected.days);
    }, 1200);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#208A7C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💳</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {language === 'bn' ? 'সাবস্ক্রিপশন রিনিউ ও মেয়াদ বৃদ্ধি' : 'Renew Subscription'}
              </h3>
              <p className="text-xs text-white/80">
                {language === 'bn'
                  ? `বর্তমান মেয়াদ বাকি: ${toBengaliNumber(daysLeft)} দিন`
                  : `Current balance: ${daysLeft} days remaining`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {!isSuccess ? (
            <form onSubmit={handlePayment} className="space-y-4">
              {/* Plan Selection Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  {language === 'bn' ? 'প্যাকেজ নির্বাচন করুন:' : 'Choose a Package:'}
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id as any)}
                        className={`relative p-3 rounded-xl border-2 cursor-pointer text-center transition-all ${
                          isSelected
                            ? 'border-[#208A7C] bg-teal-50/50 ring-1 ring-[#208A7C]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {plan.badge && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-xs">
                            {plan.badge}
                          </span>
                        )}
                        <h5 className="font-bold text-slate-800 text-xs mt-1">
                          {plan.title}
                        </h5>
                        <p className="text-base sm:text-lg font-black text-slate-900 mt-1">
                          ৳ {language === 'bn' ? toBengaliNumber(plan.price) : plan.price}
                        </p>
                        <span className="text-[10px] text-slate-500 block">
                          {language === 'bn' ? `+${toBengaliNumber(plan.days)} দিন` : `+${plan.days} days`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  {language === 'bn' ? 'পেমেন্ট মাধ্যম বেছে নিন:' : 'Payment Method:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* bKash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`py-2 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center transition-all ${
                      paymentMethod === 'bkash'
                        ? 'border-[#D12053] bg-[#FDF2F5] text-[#D12053]'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    bKash (বিকাশ)
                  </button>

                  {/* Nagad */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`py-2 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center transition-all ${
                      paymentMethod === 'nagad'
                        ? 'border-[#F7931E] bg-[#FFF8F0] text-[#F7931E]'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    Nagad (নগদ)
                  </button>

                  {/* Rocket */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('rocket')}
                    className={`py-2 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center transition-all ${
                      paymentMethod === 'rocket'
                        ? 'border-[#8C3494] bg-[#F9F2FA] text-[#8C3494]'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    Rocket (রকেট)
                  </button>
                </div>
              </div>

              {/* Mobile number input */}
              <div>
                <label className="text-xs font-medium text-slate-700">
                  {language === 'bn' ? 'মোবাইল ব্যাংকিং ওয়ালেট নম্বর' : 'Wallet Mobile Number'}
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-semibold tracking-wider"
                />
              </div>

              {/* Security info */}
              <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {language === 'bn'
                    ? '১০০% নিরাপদ ও এনক্রিপ্টেড ইনস্ট্যান্ট পেমেন্ট গেটওয়ে।'
                    : '100% secure encrypted direct activation gateway.'}
                </span>
              </div>

              {/* Pay Submit */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#208A7C] hover:bg-[#197569] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <span>{language === 'bn' ? 'পেমেন্ট যাচাই করা হচ্ছে...' : 'Processing payment...'}</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>
                      {language === 'bn'
                        ? `৳ ${toBengaliNumber(currentSelected.price)} পরিশোধ করে মেয়াদ বাড়ান`
                        : `Pay ৳ ${currentSelected.price} & Activate`}
                    </span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Success confirmation */
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {language === 'bn' ? 'পেমেন্ট সফল হয়েছে!' : 'Payment Successful!'}
              </h4>
              <p className="text-sm text-slate-600">
                {language === 'bn'
                  ? `আপনার অ্যাকাউন্টে আরও ${toBengaliNumber(addedDays)} দিন মেয়াদ যোগ করা হয়েছে। বর্তমান অবশিষ্ট মেয়াদ: ${toBengaliNumber(daysLeft + addedDays)} দিন।`
                  : `Your account has been extended by ${addedDays} days. Total days remaining: ${daysLeft + addedDays} days.`}
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 bg-[#208A7C] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#197569]"
              >
                {language === 'bn' ? 'ড্যাশবোর্ডে ফিরে যান' : 'Back to Dashboard'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
