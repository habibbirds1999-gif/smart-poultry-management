import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, Scale, Wheat, Skull, CheckCircle2, AlertTriangle, ChevronDown } from 'lucide-react';
import { Batch, BirdBreed, Language } from '../../types';
import { toBengaliNumber } from '../../utils/banglaDate';
import { WeightProgressionChart } from '../WeightProgressionChart';

interface ActiveBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  batches: Batch[];
  language: Language;
  onAddBatch: (batch: Omit<Batch, 'id' | 'currentBirds' | 'deadBirds' | 'status'>) => void;
  onCloseBatch: (batchId: string) => void;
  onUpdateBatchMetrics: (
    batchId: string,
    avgWeightKg: number,
    feedBags: number,
    logDate?: string,
    notes?: string
  ) => void;
  onDeleteWeightLog?: (batchId: string, logId: string) => void;
}

export const ActiveBatchModal: React.FC<ActiveBatchModalProps> = ({
  isOpen,
  onClose,
  batches,
  language,
  onAddBatch,
  onCloseBatch,
  onUpdateBatchMetrics,
  onDeleteWeightLog,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const activeBatchesList = batches.filter((b) => b.status === 'active');
  const [selectedBatchId, setSelectedBatchId] = useState<string>(activeBatchesList[0]?.id || batches[0]?.id || '');
  const [newBatchNumber, setNewBatchNumber] = useState(`ব্যাচ-${batches.length + 14}`);
  const [newBreed, setNewBreed] = useState<BirdBreed>('Broiler');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newBirdCount, setNewBirdCount] = useState(2000);
  const [newChickPrice, setNewChickPrice] = useState(38);
  const [newShedNumber, setNewShedNumber] = useState('শেড নং ১');
  const [newNotes, setNewNotes] = useState('');

  // Metric update state
  const activeBatch = batches.find((b) => b.id === selectedBatchId && b.status === 'active') || batches.find((b) => b.status === 'active');
  const [editWeight, setEditWeight] = useState<number>(activeBatch?.currentAvgWeightKg || 1.45);
  const [editFeedBags, setEditFeedBags] = useState<number>(activeBatch?.totalFeedBagsConsumed || 54);
  const [editDate, setEditDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [editNotes, setEditNotes] = useState<string>('');
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState(false);

  useEffect(() => {
    if (activeBatch) {
      setEditWeight(activeBatch.currentAvgWeightKg || 1.45);
      setEditFeedBags(activeBatch.totalFeedBagsConsumed || 54);
    }
  }, [activeBatch?.id, activeBatch?.currentAvgWeightKg, activeBatch?.totalFeedBagsConsumed]);

  if (!isOpen) return null;

  const handleUpdate = () => {
    if (!activeBatch) return;
    onUpdateBatchMetrics(activeBatch.id, editWeight, editFeedBags, editDate, editNotes);
    setEditNotes('');
    setUpdateSuccessMsg(true);
    setTimeout(() => setUpdateSuccessMsg(false), 3000);
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBatch({
      batchNumber: newBatchNumber,
      breed: newBreed,
      startDate: newStartDate,
      initialBirds: Number(newBirdCount),
      chickPricePerUnit: Number(newChickPrice),
      shedNumber: newShedNumber,
      notes: newNotes,
      targetWeightKg: newBreed === 'Broiler' ? 1.8 : 0.85,
      currentAvgWeightKg: 0.05,
      totalFeedBagsConsumed: 1,
    });
    setShowAddForm(false);
  };

  // Calculations for current active batch
  const calculateAgeDays = (startDateStr: string) => {
    const start = new Date(startDateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  };

  const ageDays = activeBatch ? calculateAgeDays(activeBatch.startDate) : 0;
  const mortalityPercent = activeBatch && activeBatch.initialBirds > 0
    ? ((activeBatch.deadBirds / activeBatch.initialBirds) * 100).toFixed(1)
    : '0';

  // FCR Calculation: Total Feed (kg) / Total Live Weight (kg)
  // 1 bag of poultry feed = 50 kg
  const totalFeedKg = (activeBatch?.totalFeedBagsConsumed || 0) * 50;
  const totalLiveWeightKg = (activeBatch?.currentBirds || 0) * (activeBatch?.currentAvgWeightKg || 1);
  const fcr = totalLiveWeightKg > 0 ? (totalFeedKg / totalLiveWeightKg).toFixed(2) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#208A7C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐣</span>
            <h3 className="font-bold text-lg">
              {language === 'bn' ? 'চলতি ব্যাচ ব্যবস্থাপনা' : 'Active Batch Management'}
            </h3>
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
              {activeBatch ? (
                <div className="space-y-4">
                  {/* Batch Selector & Status */}
                  <div className="flex items-center justify-between bg-teal-50/80 p-3 rounded-xl border border-teal-200">
                    <div>
                      <h4 className="font-bold text-teal-900 text-base sm:text-lg">
                        {activeBatch.batchNumber}
                      </h4>
                      <p className="text-xs text-teal-700">
                        {activeBatch.breed} • {activeBatch.shedNumber} • {language === 'bn' ? 'শুরুর তারিখ: ' : 'Start: '} {activeBatch.startDate}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-full text-xs font-semibold uppercase tracking-wider">
                      {language === 'bn' ? 'চলতি' : 'Active'}
                    </span>
                  </div>

                  {/* 4 Core Summary Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Birds Alive & Mortality */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>{language === 'bn' ? 'জীবিত মুরগি' : 'Live Birds'}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-slate-800">
                        {language === 'bn' ? toBengaliNumber(activeBatch.currentBirds) : activeBatch.currentBirds}
                        <span className="text-xs text-slate-500 font-normal ml-1">
                          / {language === 'bn' ? toBengaliNumber(activeBatch.initialBirds) : activeBatch.initialBirds}
                        </span>
                      </div>
                      <div className="text-[11px] text-rose-600 mt-0.5 flex items-center space-x-1">
                        <Skull className="w-3 h-3" />
                        <span>
                          {language === 'bn' ? `মৃত্যু: ${toBengaliNumber(activeBatch.deadBirds)} (${toBengaliNumber(mortalityPercent)}%)` : `Mortality: ${activeBatch.deadBirds} (${mortalityPercent}%)`}
                        </span>
                      </div>
                    </div>

                    {/* Age in Days */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>{language === 'bn' ? 'ব্যাচের বয়স' : 'Flock Age'}</span>
                        <Calendar className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-slate-800">
                        {language === 'bn' ? toBengaliNumber(ageDays) : ageDays}
                        <span className="text-xs text-slate-500 font-normal ml-1">
                          {language === 'bn' ? 'দিন' : 'days'}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-600 mt-0.5">
                        {language === 'bn' ? 'ব্রুডিং ও বৃদ্ধি স্বাভাবিক' : 'Normal Growth Stage'}
                      </div>
                    </div>

                    {/* Average Weight */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>{language === 'bn' ? 'গড় ওজন (কেজি)' : 'Avg Weight'}</span>
                        <Scale className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-slate-800">
                        {language === 'bn' ? toBengaliNumber(activeBatch.currentAvgWeightKg || 1.45) : (activeBatch.currentAvgWeightKg || 1.45)}
                        <span className="text-xs text-slate-500 font-normal ml-1">kg</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {language === 'bn' ? `টার্গেট: ${toBengaliNumber(activeBatch.targetWeightKg || 1.8)} kg` : `Target: ${activeBatch.targetWeightKg || 1.8} kg`}
                      </div>
                    </div>

                    {/* FCR & Feed Intake */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>{language === 'bn' ? 'এফ.সি.আর (FCR)' : 'FCR Index'}</span>
                        <Wheat className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-teal-700">
                        {language === 'bn' ? toBengaliNumber(fcr) : fcr}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {language === 'bn' ? `খাদ্য: ${toBengaliNumber(activeBatch.totalFeedBagsConsumed || 54)} বস্তা` : `Feed: ${activeBatch.totalFeedBagsConsumed || 54} bags`}
                      </div>
                    </div>
                  </div>

                  {/* Weight Progression Chart */}
                  <WeightProgressionChart
                    batch={activeBatch}
                    language={language}
                    onDeleteLog={
                      onDeleteWeightLog
                        ? (logId) => onDeleteWeightLog(activeBatch.id, logId)
                        : undefined
                    }
                  />

                  {/* Daily Weight & Feed Update Box */}
                  <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-xs sm:text-sm text-amber-900">
                        {language === 'bn' ? '⚖️ দৈনিক ওজন ও খাদ্য গ্রহণ আপডেট (চার্টে যুক্ত হবে)' : '⚖️ Daily Weight & Feed Consumed Update (Plots on Chart)'}
                      </h5>
                      {updateSuccessMsg && (
                        <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-md border border-emerald-300 animate-fade-in">
                          {language === 'bn' ? 'চার্ট আপডেট হয়েছে!' : 'Chart updated!'}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] text-amber-800 font-medium">
                          {language === 'bn' ? 'ওজন পরিমাপের তারিখ' : 'Weighing Date'}
                        </label>
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="w-full mt-1 px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-amber-800 font-medium">
                          {language === 'bn' ? 'বর্তমান গড় ওজন (kg)' : 'Current Avg Weight (kg)'}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={editWeight}
                          onChange={(e) => setEditWeight(parseFloat(e.target.value) || 0)}
                          className="w-full mt-1 px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-amber-800 font-medium">
                          {language === 'bn' ? 'মোট খাদ্য গ্রহণ (বস্তা)' : 'Total Feed (Bags)'}
                        </label>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={editFeedBags}
                          onChange={(e) => setEditFeedBags(parseInt(e.target.value) || 0)}
                          className="w-full mt-1 px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-amber-800 font-medium">
                        {language === 'bn' ? 'মন্তব্য / পর্যায় (ঐচ্ছিক)' : 'Note / Growth Stage (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder={language === 'bn' ? 'যেমন: গ্রোয়ার ফিড শুরু, ৩য় সপ্তাহ সন্তোষজনক...' : 'e.g. Started Grower Feed, Normal growth...'}
                        className="w-full mt-1 px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleUpdate}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center space-x-1 shadow-2xs"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>
                        {language === 'bn' ? 'ওজন আপডেট ও চার্টে যুক্ত করুন' : 'Update Weight & Plot on Chart'}
                      </span>
                    </button>
                  </div>

                  {/* Actions: Add New Batch / Close Batch */}
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="flex-1 bg-[#208A7C] hover:bg-[#1a7165] text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{language === 'bn' ? 'নতুন ব্যাচ শুরু করুন' : 'Start New Batch'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(language === 'bn' ? 'আপনি কি এই ব্যাচটি সম্পূর্ণ করে আর্কাইভে পাঠাতে চান?' : 'Are you sure you want to close and archive this batch?')) {
                          onCloseBatch(activeBatch.id);
                        }
                      }}
                      className="px-3 py-2.5 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 rounded-xl text-sm font-medium transition-colors"
                    >
                      {language === 'bn' ? 'ব্যাচ সমাপ্ত করুন' : 'Close Batch'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm mb-4">
                    {language === 'bn' ? 'কোনো সক্রিয় ব্যাচ নেই। নতুন ব্যাচ শুরু করুন।' : 'No active batch found. Please start a new batch.'}
                  </p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-[#208A7C] text-white px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'bn' ? 'নতুন ব্যাচ শুরু করুন' : 'Start New Batch'}</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Add Batch Form */
            <form onSubmit={handleCreateBatch} className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm sm:text-base border-b pb-2">
                {language === 'bn' ? 'নতুন ব্যাচের তথ্য পূরণ করুন' : 'Enter New Batch Details'}
              </h4>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  {language === 'bn' ? 'ব্যাচের নাম / নম্বর' : 'Batch Name / No'}
                </label>
                <input
                  type="text"
                  required
                  value={newBatchNumber}
                  onChange={(e) => setNewBatchNumber(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'মুরগির জাত (Breed)' : 'Breed'}
                  </label>
                  <select
                    value={newBreed}
                    onChange={(e) => setNewBreed(e.target.value as BirdBreed)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"
                  >
                    <option value="Broiler">Broiler (ব্রয়লার)</option>
                    <option value="Sonali">Sonali (সোনালী)</option>
                    <option value="Layer">Layer (লেয়ার ডিম)</option>
                    <option value="Deshi">Deshi (দেশি)</option>
                    <option value="Cock">Cock (কক)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'শুরুর তারিখ' : 'Start Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  >
                  </input>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'মোট বাচ্চার সংখ্যা' : 'Chicks Count'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newBirdCount}
                    onChange={(e) => setNewBirdCount(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    {language === 'bn' ? 'প্রতি বাচ্চার দর (৳)' : 'Chick Price (৳)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newChickPrice}
                    onChange={(e) => setNewChickPrice(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  {language === 'bn' ? 'শেড বা ঘরের নম্বর' : 'Shed / Pen Number'}
                </label>
                <input
                  type="text"
                  value={newShedNumber}
                  onChange={(e) => setNewShedNumber(e.target.value)}
                  placeholder="যেমন: শেড নং ১"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  {language === 'bn' ? 'মন্তব্য' : 'Notes'}
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="হ্যাচারির নাম, হ্যাচিং তারিখ ইত্যাদি"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#208A7C] hover:bg-[#1a7165] text-white py-2.5 rounded-xl text-sm font-semibold"
                >
                  {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Batch'}
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
