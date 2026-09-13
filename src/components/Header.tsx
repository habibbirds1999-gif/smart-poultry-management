import React from 'react';
import { Menu, Globe, Bell, Cloud, CloudCheck, RefreshCw, LogOut } from 'lucide-react';
import { Language } from '../types';
import { SmartPoultryLogo } from './SmartPoultryLogo';
import { SyncStatus } from '../context/AuthContext';

interface HeaderProps {
  language: Language;
  onOpenDrawer: () => void;
  onToggleLanguage: () => void;
  onOpenSocial: (platform: 'facebook' | 'whatsapp') => void;
  onOpenNotifications?: () => void;
  syncStatus?: SyncStatus;
  onLogout?: () => void;
  userEmailOrPhone?: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onOpenDrawer,
  onToggleLanguage,
  onOpenSocial,
  onOpenNotifications,
  syncStatus = 'synced',
  onLogout,
  userEmailOrPhone,
}) => {
  return (
    <header className="bg-[#0E3D2F] text-white shadow-md select-none sticky top-0 z-30 border-b border-[#16503E]">
      <div className="flex items-center justify-between px-3 py-2 sm:px-4">
        {/* Left: Hamburger Menu and App Logo + Title */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <button
            id="drawer-open-button"
            onClick={onOpenDrawer}
            className="p-1.5 rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none flex-shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-[#E2ECE4]" />
          </button>

          {/* Smart Poultry Logo badge matching the user's emblem */}
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FAF8F2] border-2 border-[#276F57] flex items-center justify-center shadow-md flex-shrink-0 overflow-hidden p-0.5">
              <SmartPoultryLogo className="w-full h-full" showBackground={false} />
            </div>

            <div className="leading-tight min-w-0">
              <div className="flex items-center space-x-1.5">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-white font-sans truncate">
                  {language === 'bn' ? 'স্মার্ট পোল্ট্রি' : 'Smart Poultry'}
                </h1>
                <span className="text-[9px] bg-[#1B5E4A] text-[#86EFAC] px-1.5 py-0.2 rounded font-semibold border border-[#23775E] hidden xs:inline-block">
                  PRO
                </span>
              </div>
              <div className="flex items-center space-x-1 text-[10px] sm:text-[11px] text-[#A3C7B6]">
                {syncStatus === 'syncing' ? (
                  <span className="inline-flex items-center text-amber-300 gap-1 animate-pulse">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    <span>{language === 'bn' ? 'সিঙ্ক হচ্ছে...' : 'Syncing...'}</span>
                  </span>
                ) : syncStatus === 'offline' ? (
                  <span className="inline-flex items-center text-rose-300 gap-1">
                    <Cloud className="w-2.5 h-2.5" />
                    <span>{language === 'bn' ? 'অফলাইন' : 'Offline'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[#86EFAC] gap-1 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    <span className="truncate">{userEmailOrPhone ? userEmailOrPhone.replace(/@smartpoultry\.app$/, '').replace(/^phone_/, '') : (language === 'bn' ? 'ক্লাউড সিঙ্ক' : 'Cloud Sync')}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Notification Bell, Language switcher, WhatsApp & Logout Button */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          {/* Notification Bell */}
          <button
            id="header-notification-button"
            onClick={onOpenNotifications}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#17523F] hover:bg-[#1E674F] active:scale-95 transition-all flex items-center justify-center border border-[#276F57] relative focus:outline-none"
            title={language === 'bn' ? 'নোটিফিকেশন ও নোটিশ' : 'Notifications & Alerts'}
          >
            <Bell className="w-3.5 h-3.5 text-[#E2ECE4]" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </button>

          {/* Language Switcher Badge */}
          <button
            id="header-lang-toggle"
            onClick={onToggleLanguage}
            className="flex items-center space-x-1 bg-[#17523F] hover:bg-[#1E674F] px-2 py-1 rounded-full text-xs font-semibold tracking-wider transition-colors border border-[#276F57] text-[#E2ECE4]"
            title="Toggle Language (বাংলা / English)"
          >
            <Globe className="w-3 h-3 text-[#86EFAC]" />
            <span className="text-[11px]">{language === 'bn' ? 'বাং' : 'EN'}</span>
          </button>

          {/* WhatsApp Support */}
          <button
            id="social-whatsapp-button"
            onClick={() => onOpenSocial('whatsapp')}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xs"
            aria-label="WhatsApp Helpline"
            title="WhatsApp Helpline"
          >
            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
              <path d="M12.031 0C5.398 0 .018 5.38.018 12.013a11.96 11.96 0 001.624 6.04L0 24l6.108-1.603a11.98 11.98 0 005.923 1.57h.005c6.632 0 12.012-5.38 12.012-12.013S18.663 0 12.031 0zm0 21.996h-.004a9.98 9.98 0 01-5.09-1.396l-.365-.216-3.782.992 1.01-3.687-.238-.378a9.96 9.96 0 01-1.536-5.3C2.026 6.488 6.516 2 12.031 2c2.671 0 5.182 1.04 7.07 2.929a9.94 9.94 0 012.924 7.084c0 5.526-4.49 10.012-10.005 10.012zm5.485-7.5c-.301-.15-1.782-.88-2.058-.98-.276-.1-.477-.15-.678.15-.2.301-.778.98-.954 1.18-.176.2-.352.226-.653.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.352.452-.527.151-.176.201-.301.302-.502.1-.2.05-.377-.025-.527-.075-.15-.678-1.634-.93-2.24-.244-.59-.493-.51-.678-.52-.175-.01-.376-.01-.577-.01-.2 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.511s1.08 2.912 1.23 3.113c.15.2 2.124 3.243 5.147 4.549.719.311 1.28.497 1.718.636.722.23 1.378.197 1.898.12.58-.087 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.431-.076-.126-.276-.201-.577-.352z" />
            </svg>
          </button>

          {/* Logout Button */}
          {onLogout && (
            <button
              id="header-logout-button"
              onClick={onLogout}
              className="flex items-center space-x-1 bg-rose-600/80 hover:bg-rose-600 active:scale-95 px-2 py-1 rounded-full text-xs font-semibold tracking-wider transition-colors border border-rose-500 text-white shadow-2xs"
              title={language === 'bn' ? 'লগআউট (Logout)' : 'Logout'}
            >
              <LogOut className="w-3 h-3 text-rose-100" />
              <span className="text-[11px] hidden xs:inline">{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

