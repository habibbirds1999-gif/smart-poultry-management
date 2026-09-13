import React, { useState } from 'react';
import { X, Plus, Phone, MapPin, CreditCard, UserCheck, Trash2 } from 'lucide-react';
import { Dealer, Language } from '../../types';
import { toBengaliNumber } from '../../utils/banglaDate';

interface DealerModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealers: Dealer[];
  language: Language;
  onAddDealer: (dealer: Omit<Dealer, 'id'>) => void;
  onPayDealer: (dealerId: string, paymentAmount: number) => void;
  onDeleteDealer: (dealerId: string) => void;
}

export const DealerModal: React.FC<DealerModalProps> = ({
  isOpen,
  onClose,
  dealers,
  language,
  onAddDealer,
  onPayDealer,
  onDeleteDealer,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [payingDealerId, setPayingDealerId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState<number | ''>('');

  // Form states
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [suppliedItems, setSuppliedItems] = useState('ফিড, বাচ্চা ও ওষুধ');
  const [totalBill, setTotalBill] = useState<number | ''>('');
  const [paidAmount, setPaidAmount] = useState<number | ''>('');

  if (!isOpen) return null;

  const totalDealerDue = dealers.reduce((sum, d) => sum + d.dueAmount, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !companyName) return;

    const bill = Number(totalBill) || 0;
    const paid = Number(paidAmount) || 0;
    const due = Math.max(0, bill - paid);

    onAddDealer({
      name: name.trim(),
      companyName: companyName.trim(),
      phone: phone.trim() || '01700-000000',
      address: address.trim() || 'স্থানীয় বাজার',
      suppliedItems: suppliedItems.trim(),
      totalBill: bill,
      paidAmount: paid,
      dueAmount: due,
    });

    setName('');
    setCompanyName('');
    setPhone('');
    setAddress('');
    setTotalBill('');
    setPaidAmount('');
    setShowAddForm(false);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingDealerId || !payAmount || Number(payAmount) <= 0) return;

    onPayDealer(payingDealerId, Number(payAmount));
    setPayingDealerId(null);
    setPayAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#208A7C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👨‍💼</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {language === 'bn' ? 'ডিলার লেজার ও বাকি খাতা' : 'Dealer Ledger'}
              </h3>
              <p className="text-xs text-white/80">
                {language === 'bn'
                  ? `মোট ডিলার দেনা: ৳ ${toBengaliNumber(totalDealerDue.toLocaleString())}`
                  : `Total Dealer Due: ৳ ${totalDealerDue.toLocaleString()}`}
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
              {/* Payment Overlay Form if active */}
              {payingDealerId && (
                <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-emerald-900 text-sm">
                      {language === 'bn' ? 'ডিলারকে বকেয়া পরিশোধ করুন' : 'Pay Due to Dealer'}
                    </h5>
                    <button
                      onClick={() => setPayingDealerId(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handlePaymentSubmit} className="space-y-2">
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="টাকার পরিমাণ লিখুন (৳)"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-sm font-semibold"
                    />
                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        type="submit"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition-colors"
                      >
                        {language === 'bn' ? 'পরিশোধ সম্পন্ন করুন' : 'Confirm Payment'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayingDealerId(null)}
                        className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                      >
                        {language === 'bn' ? 'বাতিল' : 'Cancel'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Action Button */}
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 text-sm">
                  {language === 'bn' ? 'ডিলারদের তালিকা' : 'Dealer Directory'}
                </h4>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#208A7C] hover:bg-[#197569] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'bn' ? 'নতুন ডিলার' : 'Add Dealer'}</span>
                </button>
              </div>

              {/* Dealer List */}
              <div className="space-y-3">
                {dealers.length > 0 ? (
                  dealers.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 hover:bg-slate-100/90 p-3.5 rounded-xl border border-slate-200 space-y-2.5 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                            {item.companyName}
                          </h5>
                          <p className="text-xs text-slate-600 font-medium">
                            {item.name}
                          </p>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
                            <span className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{item.phone}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{item.address}</span>
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteDealer(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Ledger numbers */}
                      <div className="grid grid-cols-3 gap-1 bg-white p-2 rounded-lg border border-slate-200/70 text-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">
                            {language === 'bn' ? 'মোট ক্রয়' : 'Total Bill'}
                          </span>
                          <span className="font-semibold text-slate-800">
                            ৳ {language === 'bn' ? toBengaliNumber(item.totalBill.toLocaleString()) : item.totalBill.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">
                            {language === 'bn' ? 'পরিশোধ' : 'Paid'}
                          </span>
                          <span className="font-semibold text-emerald-700">
                            ৳ {language === 'bn' ? toBengaliNumber(item.paidAmount.toLocaleString()) : item.paidAmount.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">
                            {language === 'bn' ? 'বর্তমান দেনা' : 'Current Due'}
                          </span>
                          <span className="font-bold text-rose-700">
                            ৳ {language === 'bn' ? toBengaliNumber(item.dueAmount.toLocaleString()) : item.dueAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Pay button */}
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[11px] text-teal-800 font-medium">
                          {item.suppliedItems}
                        </span>
                        <button
                          onClick={() => setPayingDealerId(item.id)}
                          className="bg-[#208A7C] hover:bg-[#197569] text-white px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center space-x-1"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'বকেয়া পরিশোধ' : 'Pay Due'}</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    {language === 'bn' ? 'কোনো ডিলার যোগ করা হয়নি' : 'No dealers found'}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Add Dealer Form */
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm border-b pb-2">
                {language === 'bn' ? 'নতুন ডিলারের তথ্য দিন' : 'Add Dealer Profile'}
              </h4>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  {language === 'bn' ? 'প্রতিষ্ঠানের নাম' : 'Company / Store Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মেসার্স সততা ফিড স্টোর"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'প্রোপাইটরের নাম' : 'Owner Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="নাম লিখুন"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    placeholder="017xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  {language === 'bn' ? 'ঠিকানা' : 'Address / Location'}
                </label>
                <input
                  type="text"
                  placeholder="বাজার ও উপজেলার নাম"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'পূর্বের মোট ক্রয় (ঐচ্ছিক)' : 'Previous Bill (Optional)'}
                  </label>
                  <input
                    type="number"
                    placeholder="৳ 0"
                    value={totalBill}
                    onChange={(e) => setTotalBill(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'পরিশোধ করা হয়েছিল' : 'Paid Amount'}
                  </label>
                  <input
                    type="number"
                    placeholder="৳ 0"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#208A7C] hover:bg-[#197569] text-white py-2.5 rounded-xl text-sm font-semibold"
                >
                  {language === 'bn' ? 'ডিলার সংরক্ষণ করুন' : 'Save Dealer'}
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
