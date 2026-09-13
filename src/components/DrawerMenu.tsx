import React from 'react';
import {
  X,
  Home,
  FileSpreadsheet,
  Settings,
  Languages,
  Download,
  Upload,
  RotateCcw,
  Phone,
  HelpCircle,
  ShieldCheck,
  Building2,
  ExternalLink,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { FarmSettings, Language } from '../types';
import { toBengaliNumber } from '../utils/banglaDate';
import { SmartPoultryLogo } from './SmartPoultryLogo';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  settings: FarmSettings;
  language: Language;
  onToggleLanguage: () => void;
  onOpenSettings: () => void;
  onOpenReports: () => void;
  onOpenHowToRenew: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
  onOpenWebsite: () => void;
  onLogout?: () => void;
  userEmailOrPhone?: string;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isOpen,
  onClose,
  settings,
  language,
  onToggleLanguage,
  onOpenSettings,
  onOpenReports,
  onOpenHowToRenew,
  onExportData,
  onImportData,
  onResetData,
  onOpenWebsite,
  onLogout,
  userEmailOrPhone,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header with Deep Forest Green */}
        <div className="bg-[#0E3D2F] text-white p-5 select-none relative border-b border-[#16503E]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F2] border-2 border-[#276F57] flex items-center justify-center shadow-md overflow-hidden p-0.5 flex-shrink-0">
              <SmartPoultryLogo className="w-full h-full" showBackground={false} />
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-lg leading-tight truncate">
                {settings.farmName || (language === 'bn' ? 'স্মার্ট পোল্ট্রি' : 'Smart Poultry')}
              </h2>
              <p className="text-xs text-[#A3C7B6] truncate">
                {settings.ownerName}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#16503E] flex items-center justify-between text-xs text-[#E2ECE4]">
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center space-x-1 hover:underline font-bold"
              title={language === 'bn' ? 'কল করুন' : 'Call'}
            >
              <span>📱 {settings.phone}</span>
            </a>
            <span className="bg-[#17523F] border border-[#276F57] px-2 py-0.5 rounded font-mono font-bold text-[#86EFAC]">
              {language === 'bn' ? `${toBengaliNumber(settings.subscriptionDaysLeft)} দিন বাকি` : `${settings.subscriptionDaysLeft} days left`}
            </span>
          </div>
        </div>

        {/* Menu Navigation Items */}
        <div className="flex-1 overflow-y-auto py-2 divide-y divide-slate-100">
          <div className="px-2 py-1 space-y-0.5">
            {/* Dashboard Home */}
            <button
              onClick={onClose}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-[#FAF8F2] hover:text-[#0E3D2F] transition-colors text-sm font-medium"
            >
              <Home className="w-5 h-5 text-[#0E3D2F]" />
              <span>{language === 'bn' ? 'ড্যাশবোর্ড (হোম)' : 'Dashboard (Home)'}</span>
            </button>

            {/* Financial Reports */}
            <button
              onClick={() => {
                onClose();
                onOpenReports();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-[#FAF8F2] hover:text-[#0E3D2F] transition-colors text-sm font-medium"
            >
              <FileSpreadsheet className="w-5 h-5 text-[#0E3D2F]" />
              <span>{language === 'bn' ? 'আয়-ব্যয় ও লাভ-ক্ষতি হিসাব' : 'Financial Statement & Profit/Loss'}</span>
            </button>

            {/* Farm Profile & Settings */}
            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-[#208A7C] transition-colors text-sm font-medium"
            >
              <Settings className="w-5 h-5 text-slate-500" />
              <span>{language === 'bn' ? 'খামারের তথ্য ও প্রোফাইল' : 'Farm Profile & Settings'}</span>
            </button>
          </div>

          {/* Preferences & Tools */}
          <div className="px-2 py-2 space-y-0.5">
            <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {language === 'bn' ? 'পদ্ধতি ও ব্যাকআপ' : 'Tools & Data'}
            </div>

            {/* Language Toggle */}
            <button
              onClick={onToggleLanguage}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              <div className="flex items-center space-x-3">
                <Languages className="w-5 h-5 text-indigo-500" />
                <span>{language === 'bn' ? 'ভাষা পরিবর্তন' : 'Language Toggle'}</span>
              </div>
              <span className="text-xs bg-slate-200 px-2 py-0.5 rounded font-bold text-slate-700">
                {language === 'bn' ? 'বাংলা' : 'English'}
              </span>
            </button>

            {/* How to Renew */}
            <button
              onClick={() => {
                onClose();
                onOpenHowToRenew();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <span>{language === 'bn' ? 'রিনিউ করার নিয়মাবলী' : 'How to Renew License'}</span>
            </button>

            {/* Export Data */}
            <button
              onClick={onExportData}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              <Download className="w-5 h-5 text-emerald-600" />
              <span>{language === 'bn' ? 'ব্যাকআপ ডাউনলোড (JSON)' : 'Backup Data (Export JSON)'}</span>
            </button>

            {/* Import Data */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              <Upload className="w-5 h-5 text-blue-600" />
              <span>{language === 'bn' ? 'ব্যাকআপ রিস্টোর (Import)' : 'Restore Data (Import)'}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onImportData}
              accept=".json"
              className="hidden"
            />

            {/* Reset Data */}
            <button
              onClick={onResetData}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-sm font-medium"
            >
              <RotateCcw className="w-5 h-5 text-rose-500" />
              <span>{language === 'bn' ? 'ডেমো ডাটা রিসেট' : 'Reset to Default Data'}</span>
            </button>

            {/* Logout Option */}
            {onLogout && (
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-rose-700 bg-rose-50/70 hover:bg-rose-100 transition-colors text-sm font-bold border border-rose-200 mt-1"
              >
                <LogOut className="w-5 h-5 text-rose-600" />
                <div className="text-left">
                  <span>{language === 'bn' ? 'লগআউট করুন' : 'Logout from Account'}</span>
                  {userEmailOrPhone && (
                    <p className="text-[10px] text-rose-500 font-normal">
                      {userEmailOrPhone.replace(/@smartpoultry\.app$/, '').replace(/^phone_/, '')}
                    </p>
                  )}
                </div>
              </button>
            )}
          </div>

          {/* Contact / Helpline Card */}
          <div className="px-3 py-2">
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === 'bn' ? 'যোগাযোগ ও সহায়তা' : 'Contact & Support'}</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-mono font-bold">
                  {settings.phone}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center justify-center space-x-1 bg-[#208A7C] hover:bg-[#1a6e63] text-white py-1.5 px-2 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'কল করুন' : 'Call'}</span>
                </a>
                <a
                  href={`https://wa.me/88${settings.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-1 bg-[#25D366] hover:bg-[#20ba5a] text-white py-1.5 px-2 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                >
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Web Portal Link */}
          <div className="px-2 py-2">
            <button
              onClick={() => {
                onClose();
                onOpenWebsite();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-teal-700 bg-teal-50/70 hover:bg-teal-100 transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-5 h-5 text-[#208A7C]" />
              <span className="truncate">smartpoultry.app/dashboard</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          <p className="font-semibold text-slate-700">স্মার্ট পোল্ট্রি (Smart Poultry) v2.5</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {language === 'bn' ? 'ক্লাউড সিঙ্ক সমৃদ্ধ স্মার্ট খামার খাতা' : 'Cloud Synchronized Smart Poultry Management'}
          </p>
        </div>
      </div>
    </div>
  );
};
