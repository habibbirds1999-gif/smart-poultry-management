import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, Scale, Calendar, List, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Batch, Language, WeightLogEntry } from '../types';
import { toBengaliNumber } from '../utils/banglaDate';

interface WeightProgressionChartProps {
  batch: Batch;
  language: Language;
  onDeleteLog?: (logId: string) => void;
}

export const WeightProgressionChart: React.FC<WeightProgressionChartProps> = ({
  batch,
  language,
  onDeleteLog,
}) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  // Prepare weight history points
  const rawHistory = batch.weightHistory && batch.weightHistory.length > 0
    ? [...batch.weightHistory].sort((a, b) => a.dayNumber - b.dayNumber)
    : [
        {
          id: 'w-init',
          date: batch.startDate,
          dayNumber: 1,
          avgWeightKg: batch.breed === 'Broiler' ? 0.045 : 0.035,
          targetWeightKg: batch.breed === 'Broiler' ? 0.042 : 0.032,
          feedBags: 1,
          notes: language === 'bn' ? 'শুরুর ওজন' : 'Initial Weight',
        },
        {
          id: 'w-curr',
          date: new Date().toISOString().split('T')[0],
          dayNumber: Math.max(
            1,
            Math.floor((new Date().getTime() - new Date(batch.startDate).getTime()) / (1000 * 60 * 60 * 24))
          ),
          avgWeightKg: batch.currentAvgWeightKg || 1.45,
          targetWeightKg: batch.targetWeightKg || 1.8,
          feedBags: batch.totalFeedBagsConsumed || 54,
          notes: language === 'bn' ? 'বর্তমান অবস্থা' : 'Current Status',
        },
      ];

  const chartData = rawHistory.map((item) => {
    const diffGrams = item.targetWeightKg !== undefined
      ? Math.round((item.avgWeightKg - item.targetWeightKg) * 1000)
      : null;

    return {
      id: item.id,
      dayNumber: item.dayNumber,
      date: item.date,
      label: language === 'bn' ? `দিন ${toBengaliNumber(item.dayNumber)}` : `Day ${item.dayNumber}`,
      actual: item.avgWeightKg,
      target: item.targetWeightKg ?? null,
      diffGrams,
      feedBags: item.feedBags,
      notes: item.notes,
    };
  });

  // Summary calculations
  const firstPoint = rawHistory[0];
  const lastPoint = rawHistory[rawHistory.length - 1];
  const daySpan = Math.max(1, lastPoint.dayNumber - firstPoint.dayNumber);
  const weightGainKg = Math.max(0, lastPoint.avgWeightKg - firstPoint.avgWeightKg);
  // Average Daily Gain (ADG) in grams per day
  const adgGrams = Math.round((weightGainKg / daySpan) * 1000);

  const lastDiffGrams = lastPoint.targetWeightKg !== undefined
    ? Math.round((lastPoint.avgWeightKg - lastPoint.targetWeightKg) * 1000)
    : 0;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const actualGrams = Math.round(data.actual * 1000);
      const targetGrams = data.target !== null ? Math.round(data.target * 1000) : null;

      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[190px]">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1 font-semibold text-teal-400">
            <span>{data.label}</span>
            <span className="text-slate-400 font-normal text-[11px]">{data.date}</span>
          </div>

          <div className="flex items-center justify-between text-slate-200">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#208A7C] inline-block" />
              <span>{language === 'bn' ? 'গড় ওজন:' : 'Avg Weight:'}</span>
            </span>
            <span className="font-bold text-white">
              {language === 'bn' ? `${toBengaliNumber(data.actual)} কেজি` : `${data.actual} kg`}{' '}
              <span className="text-[10px] text-slate-400">({language === 'bn' ? toBengaliNumber(actualGrams) : actualGrams} g)</span>
            </span>
          </div>

          {data.target !== null && (
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span>{language === 'bn' ? 'টার্গেট আদর্শ:' : 'Target Std:'}</span>
              </span>
              <span className="font-semibold text-amber-300">
                {language === 'bn' ? `${toBengaliNumber(data.target)} কেজি` : `${data.target} kg`}
              </span>
            </div>
          )}

          {data.diffGrams !== null && (
            <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">{language === 'bn' ? 'পার্থক্য:' : 'Variance:'}</span>
              <span
                className={`font-semibold ${
                  data.diffGrams >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {data.diffGrams >= 0 ? '+' : ''}
                {language === 'bn' ? toBengaliNumber(data.diffGrams) : data.diffGrams} g{' '}
                {data.diffGrams >= 0
                  ? (language === 'bn' ? '(এগিয়ে)' : '(Ahead)')
                  : (language === 'bn' ? '(ঘাটতি)' : '(Behind)')}
              </span>
            </div>
          )}

          {data.feedBags !== undefined && (
            <div className="text-[10px] text-slate-400 pt-0.5">
              {language === 'bn'
                ? `খাদ্য গ্রহণ: ${toBengaliNumber(data.feedBags)} বস্তা`
                : `Feed: ${data.feedBags} bags`}
            </div>
          )}

          {data.notes && (
            <div className="text-[10px] text-slate-300 italic pt-0.5 border-t border-slate-800">
              "{data.notes}"
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Card Header */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-teal-50/90 to-emerald-50/50 border-b border-teal-100/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#208A7C] text-white flex items-center justify-center shadow-2xs">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm sm:text-base flex items-center space-x-1.5">
              <span>{language === 'bn' ? 'ওজন বৃদ্ধির প্রবৃদ্ধি চার্ট' : 'Weight Progression Chart'}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                {batch.breed}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">
              {language === 'bn'
                ? 'বয়সের সাথে সাথে মুরগির দৈহিক গড় ওজনের অগ্রগতি ও টার্গেট তুলনা'
                : 'Bird avg weight trajectory over time vs standard growth target'}
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white/90 p-0.5 rounded-lg border border-teal-200/80 shadow-2xs text-xs font-medium">
          <button
            type="button"
            onClick={() => setViewMode('chart')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 ${
              viewMode === 'chart'
                ? 'bg-[#208A7C] text-white shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'গ্রাফ' : 'Chart'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 ${
              viewMode === 'table'
                ? 'bg-[#208A7C] text-white shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'তালিকা' : 'Log'}</span>
          </button>
        </div>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50/70 border-b border-slate-100 text-center py-2 px-1">
        <div>
          <div className="text-[10px] text-slate-500">{language === 'bn' ? 'বর্তমান ওজন' : 'Current Weight'}</div>
          <div className="text-xs sm:text-sm font-bold text-slate-800">
            {language === 'bn' ? toBengaliNumber(lastPoint.avgWeightKg) : lastPoint.avgWeightKg} kg
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500">{language === 'bn' ? 'দৈনিক গড় বৃদ্ধি (ADG)' : 'Daily Gain (ADG)'}</div>
          <div className="text-xs sm:text-sm font-bold text-teal-700">
            +{language === 'bn' ? toBengaliNumber(adgGrams) : adgGrams} g/day
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500">{language === 'bn' ? 'টার্গেট স্থিতি' : 'Target Status'}</div>
          <div className="text-xs sm:text-sm font-bold flex items-center justify-center space-x-1">
            {lastDiffGrams >= 0 ? (
              <span className="text-emerald-700 flex items-center space-x-0.5">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span>+{language === 'bn' ? toBengaliNumber(lastDiffGrams) : lastDiffGrams}g</span>
              </span>
            ) : (
              <span className="text-amber-700 flex items-center space-x-0.5">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span>{language === 'bn' ? toBengaliNumber(lastDiffGrams) : lastDiffGrams}g</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Body: Chart or Table */}
      <div className="p-3 sm:p-4">
        {viewMode === 'chart' ? (
          <div className="w-full">
            <div className="h-56 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 12, right: 12, left: -14, bottom: 4 }}
                >
                  <defs>
                    <linearGradient id="actualWeightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#208A7C" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#208A7C" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    unit="kg"
                    domain={[0, 'auto']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '6px' }}
                    formatter={(value) => {
                      if (value === 'actual') {
                        return (
                          <span className="text-slate-700 font-medium">
                            {language === 'bn' ? 'বর্তমান গড় ওজন (kg)' : 'Actual Weight (kg)'}
                          </span>
                        );
                      }
                      if (value === 'target') {
                        return (
                          <span className="text-amber-700 font-medium">
                            {language === 'bn' ? 'টার্গেট আদর্শ (kg)' : 'Target Std (kg)'}
                          </span>
                        );
                      }
                      return value;
                    }}
                  />
                  {/* Standard Benchmark Dotted Line */}
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                    activeDot={{ r: 4, stroke: '#d97706', strokeWidth: 1, fill: '#fff' }}
                  />
                  {/* Actual Weight Filled Area + Solid Line */}
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#208A7C"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#actualWeightGradient)"
                    dot={{ r: 4, fill: '#208A7C', stroke: '#ffffff', strokeWidth: 1.5 }}
                    activeDot={{ r: 6, fill: '#208A7C', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#208A7C] inline-block" />
                <span>
                  {language === 'bn' ? 'সবুজ বিন্দু: খামারের ওজন লগ' : 'Teal points: Recorded flock weigh-ins'}
                </span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                <span>
                  {language === 'bn' ? 'হলুদ রেখা: জাতভিত্তিক আদর্শ বৃদ্ধি' : 'Amber line: Breed target standard'}
                </span>
              </span>
            </div>
          </div>
        ) : (
          /* Table of Weight Logs */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="py-2 px-2.5 font-semibold">{language === 'bn' ? 'বয়স' : 'Age'}</th>
                  <th className="py-2 px-2.5 font-semibold">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                  <th className="py-2 px-2.5 font-semibold">{language === 'bn' ? 'ওজন (kg)' : 'Weight (kg)'}</th>
                  <th className="py-2 px-2.5 font-semibold">{language === 'bn' ? 'টার্গেট' : 'Target'}</th>
                  <th className="py-2 px-2.5 font-semibold">{language === 'bn' ? 'পার্থক্য' : 'Diff'}</th>
                  <th className="py-2 px-2.5 font-semibold">{language === 'bn' ? 'খাদ্য' : 'Feed'}</th>
                  {onDeleteLog && <th className="py-2 px-2 font-semibold text-right">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {rawHistory.map((row) => {
                  const diff = row.targetWeightKg !== undefined
                    ? Math.round((row.avgWeightKg - row.targetWeightKg) * 1000)
                    : null;

                  return (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-2.5 font-semibold text-teal-800">
                        {language === 'bn' ? `দিন ${toBengaliNumber(row.dayNumber)}` : `Day ${row.dayNumber}`}
                      </td>
                      <td className="py-2 px-2.5 text-slate-500">{row.date}</td>
                      <td className="py-2 px-2.5 font-bold text-slate-900">
                        {language === 'bn' ? toBengaliNumber(row.avgWeightKg) : row.avgWeightKg} kg
                      </td>
                      <td className="py-2 px-2.5 text-slate-500">
                        {row.targetWeightKg ? `${language === 'bn' ? toBengaliNumber(row.targetWeightKg) : row.targetWeightKg} kg` : '-'}
                      </td>
                      <td className="py-2 px-2.5 font-medium">
                        {diff !== null ? (
                          <span className={diff >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                            {diff >= 0 ? '+' : ''}
                            {language === 'bn' ? toBengaliNumber(diff) : diff}g
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-2 px-2.5 text-slate-500">
                        {row.feedBags ? `${language === 'bn' ? toBengaliNumber(row.feedBags) : row.feedBags} বস্তা` : '-'}
                      </td>
                      {onDeleteLog && (
                        <td className="py-2 px-2 text-right">
                          {row.id !== 'w-init' && (
                            <button
                              type="button"
                              onClick={() => onDeleteLog(row.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete log'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
