import React, { useState } from 'react';
import { X, Plus, Phone, MapPin, HandCoins, Trash2 } from 'lucide-react';
import { Buyer, Language } from '../../types';
import { toBengaliNumber } from '../../utils/banglaDate';

interface BuyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyers: Buyer[];
  language: Language;
  onAddBuyer: (buyer: Omit<Buyer, 'id'>) => void;
  onCollectDue: (buyerId: string, collectAmount: number) => void;
  onDeleteBuyer: (buyerId: string) => void;
}

export const BuyerModal: React.FC<BuyerModalProps> = ({
  isOpen,
  onClose,
  buyers,
  language,
  onAddBuyer,
  onCollectDue,
  onDeleteBuyer,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [collectingBuyerId, setCollectingBuyerId] = useState<string | null>(null);
  const [collectAmount, setCollectAmount] = useState<number | ''>('');

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<Buyer['type']>('both');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [totalPurchase, setTotalPurchase] = useState<number | ''>('');
  const [paidAmount, setPaidAmount] = useState<number | ''>('');

  if (!isOpen) return null;

  const totalBuyerDue = buyers.reduce((sum, b) => sum + b.dueAmount, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const purchase = Number(totalPurchase) || 0;
    const paid = Number(paidAmount) || 0;
    const due = Math.max(0, purchase - paid);

    onAddBuyer({
      name: name.trim(),
      type,
      phone: phone.trim() || '01800-000000',
      address: address.trim() || 'আড়ত বাজার',
      totalPurchase: purchase,
      paidAmount: paid,
      dueAmount: due,
    });

    setName('');
    setPhone('');
    setAddress('');
    setTotalPurchase('');
    setPaidAmount('');
    setShowAddForm(false);
  };

  const handleCollectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectingBuyerId || !collectAmount || Number(collectAmount) <= 0) return;

    onCollectDue(collectingBuyerId, Number(collectAmount));
    setCollectingBuyerId(null);
    setCollectAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#208A7C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👨‍🌾</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {language === 'bn' ? 'ক্রেতা ও পাইকার হিসাব' : 'Buyer Ledger'}
              </h3>
              <p className="text-xs text-white/80">
                {language === 'bn'
                  ? `মোট পাওনা / বকেয়া: ৳ ${toBengaliNumber(totalBuyerDue.toLocaleString())}`
                  : `Total Receivables: ৳ ${totalBuyerDue.toLocaleString()}`}
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
              {/* Collection Box if active */}
              {collectingBuyerId && (
                <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-amber-900 text-sm">
                      {language === 'bn' ? 'ক্রেতার বকেয়া টাকা আদায় করুন' : 'Collect Due from Buyer'}
                    </h5>
                    <button
                      onClick={() => setCollectingBuyerId(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleCollectionSubmit} className="space-y-2">
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="আদায়কৃত টাকার পরিমাণ (৳)"
                      value={collectAmount}
                      onChange={(e) => setCollectAmount(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm font-semibold"
                    />
                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        type="submit"
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-xs font-bold transition-colors"
                      >
                        {language === 'bn' ? 'টাকা জমা নিশ্চিত করুন' : 'Confirm Collection'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCollectingBuyerId(null)}
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
                  {language === 'bn' ? 'ক্রেতাদের তালিকা' : 'Buyers Directory'}
                </h4>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#208A7C] hover:bg-[#197569] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'bn' ? 'নতুন ক্রেতা' : 'Add Buyer'}</span>
                </button>
              </div>

              {/* Buyer List */}
              <div className="space-y-3">
                {buyers.length > 0 ? (
                  buyers.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 hover:bg-slate-100/90 p-3.5 rounded-xl border border-slate-200 space-y-2.5 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                              {item.name}
                            </h5>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold">
                              {item.type === 'chicken' ? (language === 'bn' ? 'মুরগির আড়ত' : 'Chicken') : item.type === 'egg' ? (language === 'bn' ? 'ডিমের আড়ত' : 'Egg') : (language === 'bn' ? 'মুরগি ও ডিম' : 'Both')}
                            </span>
                          </div>
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
                          onClick={() => onDeleteBuyer(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Ledger breakdown */}
                      <div className="grid grid-cols-3 gap-1 bg-white p-2 rounded-lg border border-slate-200/70 text-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">
                            {language === 'bn' ? 'মোট ক্রয়' : 'Total Purchase'}
                          </span>
                          <span className="font-semibold text-slate-800">
                            ৳ {language === 'bn' ? toBengaliNumber(item.totalPurchase.toLocaleString()) : item.totalPurchase.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">
                            {language === 'bn' ? 'আদায়কৃত' : 'Paid'}
                          </span>
                          <span className="font-semibold text-emerald-700">
                            ৳ {language === 'bn' ? toBengaliNumber(item.paidAmount.toLocaleString()) : item.paidAmount.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">
                            {language === 'bn' ? 'বকেয়া পাওনা' : 'Receivable'}
                          </span>
                          <span className="font-bold text-amber-700">
                            ৳ {language === 'bn' ? toBengaliNumber(item.dueAmount.toLocaleString()) : item.dueAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Collect Button */}
                      <div className="flex justify-end pt-0.5">
                        <button
                          onClick={() => setCollectingBuyerId(item.id)}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center space-x-1 transition-colors"
                        >
                          <HandCoins className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'বকেয়া আদায়' : 'Collect Due'}</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    {language === 'bn' ? 'কোনো ক্রেতা যোগ করা হয়নি' : 'No buyers found'}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Add Buyer Form */
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm border-b pb-2">
                {language === 'bn' ? 'নতুন ক্রেতার তথ্য দিন' : 'Add Buyer Profile'}
              </h4>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  {language === 'bn' ? 'ক্রেতা বা আড়তের নাম' : 'Buyer Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: হাজী রহিম পোল্ট্রি"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'ক্রেতার ধরন' : 'Category'}
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as Buyer['type'])}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"
                  >
                    <option value="chicken">{language === 'bn' ? 'মুরগির পাইকার' : 'Chicken Buyer'}</option>
                    <option value="egg">{language === 'bn' ? 'ডিমের পাইকার' : 'Egg Buyer'}</option>
                    <option value="both">{language === 'bn' ? 'উভয়ই' : 'Both'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    placeholder="018xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  {language === 'bn' ? 'বাজারের ঠিকানা' : 'Address'}
                </label>
                <input
                  type="text"
                  placeholder="যেমন: কাপ্তান বাজার, ঢাকা"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'পূর্বের ক্রয় (ঐচ্ছিক)' : 'Previous Purchases'}
                  </label>
                  <input
                    type="number"
                    placeholder="৳ 0"
                    value={totalPurchase}
                    onChange={(e) => setTotalPurchase(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'পরিশোধিত টাকা' : 'Paid Amount'}
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
                  {language === 'bn' ? 'ক্রেতা সংরক্ষণ করুন' : 'Save Buyer'}
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
