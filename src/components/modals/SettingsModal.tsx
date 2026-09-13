import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { FarmSettings, Language } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: FarmSettings;
  language: Language;
  onUpdateSettings: (newSettings: FarmSettings) => void;
  onLanguageChange: (lang: Language) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  language,
  onUpdateSettings,
  onLanguageChange,
}) => {
  const [farmName, setFarmName] = useState(settings.farmName);
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      farmName: farmName.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#208A7C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚙️</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {language === 'bn' ? 'খামারের প্রোফাইল ও সেটিংস' : 'Farm Profile & Settings'}
              </h3>
              <p className="text-xs text-white/80">
                {language === 'bn' ? 'তথ্য ও অ্যাপের ভাষা পরিবর্তন' : 'Manage Farm Info & Language'}
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Language Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              {language === 'bn' ? 'অ্যাপের ভাষা (Language):' : 'Language:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onLanguageChange('bn')}
                className={`py-2 px-3 rounded-xl border-2 font-bold text-xs transition-colors ${
                  language === 'bn'
                    ? 'border-[#208A7C] bg-teal-50 text-[#208A7C]'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                বাংলা (Bengali)
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`py-2 px-3 rounded-xl border-2 font-bold text-xs transition-colors ${
                  language === 'en'
                    ? 'border-[#208A7C] bg-teal-50 text-[#208A7C]'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Farm Name */}
          <div>
            <label className="text-xs font-medium text-slate-700">
              {language === 'bn' ? 'খামারের নাম' : 'Farm Name'}
            </label>
            <input
              type="text"
              required
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-semibold text-slate-800"
            />
          </div>

          {/* Owner Name */}
          <div>
            <label className="text-xs font-medium text-slate-700">
              {language === 'bn' ? 'খামারির নাম (প্রোপাইটর)' : 'Owner Name'}
            </label>
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-medium text-slate-700">
              {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-medium text-slate-700">
              {language === 'bn' ? 'খামারের ঠিকানা' : 'Farm Address'}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#208A7C] hover:bg-[#197569] text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-medium"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
