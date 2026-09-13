import React, { useState } from 'react';
import { X, Plus, Trash2, TrendingUp, Phone, Truck } from 'lucide-react';
import { ChickenSaleRecord, Language } from '../../types';
import { toBengaliNumber } from '../../utils/banglaDate';

interface ChickenSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sales: ChickenSaleRecord[];
  language: Language;
  onAddSale: (sale: Omit<ChickenSaleRecord, 'id'>) => void;
  onDeleteSale: (id: string) => void;
}

export const ChickenSalesModal: React.FC<ChickenSalesModalProps> = ({
  isOpen,
  onClose,
  sales,
  language,
  onAddSale,
  onDeleteSale,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [birdCount, setBirdCount] = useState<number | ''>('');
  const [totalWeightKg, setTotalWeightKg] = useState<number | ''>('');
  const [ratePerKg, setRatePerKg] = useState<number | ''>(195);
  const [paidAmount, setPaidAmount] = useState<number | ''>('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Real-time calculation
  const weightVal = Number(totalWeightKg) || 0;
  const rateVal = Number(ratePerKg) || 0;
  const calculatedTotalAmount = weightVal * rateVal;
  const paidVal = paidAmount === '' ? calculatedTotalAmount : Number(paidAmount);
  const calculatedDueAmount = Math.max(0, calculatedTotalAmount - paidVal);

  const totalSoldBirds = sales.reduce((sum, s) => sum + s.birdCount, 0);
  const totalWeight = sales.reduce((sum, s) => sum + s.totalWeightKg, 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalDue = sales.reduce((sum, s) => sum + s.dueAmount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !totalWeightKg || !ratePerKg) return;

    onAddSale({
      batchId: 'batch-14',
      date,
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim() || undefined,
      birdCount: Number(birdCount) || 0,
      totalWeightKg: Number(totalWeightKg),
      ratePerKg: Number(ratePerKg),
      totalAmount: calculatedTotalAmount,
      paidAmount: paidVal,
      dueAmount: calculatedDueAmount,
      vehicleNo: vehicleNo.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    // Reset
    setBuyerName('');
    setBuyerPhone('');
    setBirdCount('');
    setTotalWeightKg('');
    setPaidAmount('');
    setVehicleNo('');
    setNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#208A7C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📊</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {language === 'bn' ? 'মুরগি বিক্রয় খাতা' : 'Chicken Sales'}
              </h3>
              <p className="text-xs text-white/80">
                {language === 'bn' ? `মোট বিক্রয়: ৳ ${toBengaliNumber(totalRevenue.toLocaleString())}` : `Total Sales: ৳ ${totalRevenue.toLocaleString()}`}
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
              {/* Summary Stats Grid */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-teal-50 border border-teal-200 p-2.5 rounded-xl">
                  <span className="text-[11px] text-teal-800 font-medium block">
                    {language === 'bn' ? 'বিক্রিত মুরগি' : 'Birds Sold'}
                  </span>
                  <span className="text-lg font-bold text-teal-900">
                    {language === 'bn' ? toBengaliNumber(totalSoldBirds) : totalSoldBirds}
                  </span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                  <span className="text-[11px] text-emerald-800 font-medium block">
                    {language === 'bn' ? 'মোট ওজন (kg)' : 'Total Weight'}
                  </span>
                  <span className="text-lg font-bold text-emerald-900">
                    {language === 'bn' ? toBengaliNumber(totalWeight.toFixed(1)) : totalWeight.toFixed(1)} kg
                  </span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
                  <span className="text-[11px] text-amber-800 font-medium block">
                    {language === 'bn' ? 'বকেয়া টাকা' : 'Due Amount'}
                  </span>
                  <span className="text-lg font-bold text-amber-900">
                    ৳ {language === 'bn' ? toBengaliNumber(totalDue.toLocaleString()) : totalDue.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-1">
                <h4 className="font-bold text-slate-800 text-sm">
                  {language === 'bn' ? 'বিক্রয়ের তালিকা' : 'Sales Records'}
                </h4>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#208A7C] hover:bg-[#197569] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'bn' ? 'নতুন বিক্রয় লিখুন' : 'Add Sale'}</span>
                </button>
              </div>

              {/* Sales List */}
              <div className="space-y-3">
                {sales.length > 0 ? (
                  sales.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 hover:bg-slate-100/90 p-3.5 rounded-xl border border-slate-200 space-y-2 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-slate-800 text-sm">
                            {item.buyerName}
                          </h5>
                          <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                            <span>{item.date}</span>
                            {item.buyerPhone && (
                              <>
                                <span>•</span>
                                <span className="flex items-center space-x-0.5">
                                  <Phone className="w-3 h-3" />
                                  <span>{item.buyerPhone}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <span className="font-bold text-slate-900 text-base block">
                              ৳ {language === 'bn' ? toBengaliNumber(item.totalAmount.toLocaleString()) : item.totalAmount.toLocaleString()}
                            </span>
                            {item.dueAmount > 0 ? (
                              <span className="text-[11px] font-medium text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                                {language === 'bn' ? `বকেয়া: ৳ ${toBengaliNumber(item.dueAmount.toLocaleString())}` : `Due: ৳ ${item.dueAmount.toLocaleString()}`}
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                {language === 'bn' ? 'পরিশোধ' : 'Paid'}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => onDeleteSale(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Weight and rate breakdown */}
                      <div className="bg-white px-2.5 py-1.5 rounded-lg text-xs text-slate-700 flex items-center justify-between border border-slate-200/60">
                        <span>
                          {language === 'bn' ? `মুরগি: ${toBengaliNumber(item.birdCount)} টি` : `Birds: ${item.birdCount} pcs`}
                        </span>
                        <span>
                          {language === 'bn' ? `ওজন: ${toBengaliNumber(item.totalWeightKg)} kg` : `Weight: ${item.totalWeightKg} kg`}
                        </span>
                        <span className="font-semibold text-teal-800">
                          {language === 'bn' ? `দর: ৳ ${toBengaliNumber(item.ratePerKg)}/kg` : `Rate: ৳ ${item.ratePerKg}/kg`}
                        </span>
                      </div>

                      {item.vehicleNo && (
                        <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                          <Truck className="w-3 h-3 text-slate-400" />
                          <span>{item.vehicleNo}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    {language === 'bn' ? 'কোনো বিক্রয়ের হিসাব পাওয়া যায়নি' : 'No sales records found'}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Add Sale Form */
            <form onSubmit={handleSubmit} className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm border-b pb-2">
                {language === 'bn' ? 'মুরগি বিক্রয়ের নতুন এন্ট্রি' : 'Record Chicken Sale'}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'ক্রেতা / পাইকারের নাম' : 'Buyer Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: রহিম ট্রেডার্স"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'মোট ওজন (kg)' : 'Total Weight (kg)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="যেমন: ৫০০"
                    value={totalWeightKg}
                    onChange={(e) => setTotalWeightKg(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'প্রতি কেজি দর (৳)' : 'Rate Per kg (৳)'}
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={ratePerKg}
                    onChange={(e) => setRatePerKg(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'মুরগির সংখ্যা (ঐচ্ছিক)' : 'Bird Count (Optional)'}
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: ৩০০"
                    value={birdCount}
                    onChange={(e) => setBirdCount(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'মোট বিক্রয় মূল্য' : 'Total Amount'}
                  </label>
                  <div className="w-full mt-1 px-3 py-2 bg-slate-100 border rounded-lg text-sm font-bold text-teal-800">
                    ৳ {language === 'bn' ? toBengaliNumber(calculatedTotalAmount.toLocaleString()) : calculatedTotalAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'নগদ জমা / ক্যাশ (৳)' : 'Cash Paid (৳)'}
                  </label>
                  <input
                    type="number"
                    placeholder={String(calculatedTotalAmount)}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'বকেয়া থাকবে' : 'Due Amount'}
                  </label>
                  <div className="w-full mt-1 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm font-bold text-amber-900">
                    ৳ {language === 'bn' ? toBengaliNumber(calculatedDueAmount.toLocaleString()) : calculatedDueAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Buyer Phone'}
                  </label>
                  <input
                    type="tel"
                    placeholder="017xxxxxxxx"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'গাড়ি নম্বর' : 'Vehicle / Truck No'}
                  </label>
                  <input
                    type="text"
                    placeholder="ঢাকা মেট্রো..."
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#208A7C] hover:bg-[#197569] text-white py-2.5 rounded-xl text-sm font-semibold"
                >
                  {language === 'bn' ? 'বিক্রয় সংরক্ষণ করুন' : 'Save Sale'}
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
