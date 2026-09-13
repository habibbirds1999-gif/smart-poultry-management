import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SmartPoultryLogo } from '../SmartPoultryLogo';
import { Language } from '../../types';

interface AuthPageProps {
  language: Language;
  onContinueAsGuest?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ language, onContinueAsGuest }) => {
  const { loginWithEmailOrPhone, registerWithEmailOrPhone, loginWithGoogle, loginAsGuest } =
    useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [farmName, setFarmName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setError(
        language === 'bn'
          ? 'মোবাইল নম্বর অথবা ইমেইল প্রদান করুন'
          : 'Please enter your mobile number or email'
      );
      return;
    }

    if (!password || password.length < 6) {
      setError(
        language === 'bn'
          ? 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে'
          : 'Password must be at least 6 characters'
      );
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError(
        language === 'bn'
          ? 'উভয় পাসওয়ার্ড হুবহু এক হতে হবে'
          : 'Passwords do not match'
      );
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmailOrPhone(cleanId, password);
      } else {
        await registerWithEmailOrPhone(
          cleanId,
          password,
          farmName.trim() || undefined,
          ownerName.trim() || undefined,
          phone.trim() || (cleanId.includes('@') ? '' : cleanId)
        );
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err?.message || 'Authentication error';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        msg =
          language === 'bn'
            ? 'মোবাইল/ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।'
            : 'Incorrect identifier or password.';
      } else if (msg.includes('email-already-in-use')) {
        msg =
          language === 'bn'
            ? 'এই মোবাইল বা ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট রয়েছে। লগইন করুন।'
            : 'Account already exists for this number/email. Please login.';
      } else if (msg.includes('network-request-failed')) {
        msg =
          language === 'bn'
            ? 'ইন্টারনেট সংযোগ চেক করুন।'
            : 'Network error. Check your connection.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Google sign in error:', err);
      if (!err?.message?.includes('popup-closed-by-user')) {
        setError(
          language === 'bn'
            ? 'গুগল দিয়ে লগইন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।'
            : 'Google login failed. Please try again.'
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setError(null);
    setGuestLoading(true);
    try {
      if (onContinueAsGuest) {
        onContinueAsGuest();
      } else {
        await loginAsGuest();
      }
    } catch (err: any) {
      console.error('Guest login error:', err);
      setError('Guest mode could not be started.');
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0ECE1] flex flex-col items-center justify-center p-3 sm:p-4 text-slate-800">
      <div className="w-full max-w-md bg-[#FAF8F3] rounded-3xl shadow-2xl border border-[#E0D9C8] overflow-hidden">
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-br from-[#0E3D2F] via-[#165340] to-[#0A2E23] p-6 text-white text-center relative">
          {/* Subtle Ambient Circle */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* Logo Badge */}
          <div className="inline-flex p-2 rounded-2xl bg-[#F8F6EE] border-2 border-emerald-500/40 shadow-lg mb-3">
            <SmartPoultryLogo className="w-14 h-14" showBackground={false} />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            {language === 'bn' ? 'স্মার্ট পোল্ট্রি' : 'Smart Poultry'}
            <span className="text-[10px] bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Cloud
            </span>
          </h1>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-xs mx-auto">
            {language === 'bn'
              ? 'খামারের সকল হিসাব স্বয়ংক্রিয়ভাবে ক্লাউড ডাটাবেজে সংরক্ষিত ও নিরাপদ'
              : 'Multi-device cloud synchronization for your poultry enterprise'}
          </p>

          {/* Sync Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#092B21]/80 text-[#86EFAC] text-[11px] font-medium px-3 py-1 rounded-full mt-3 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {language === 'bn'
                ? 'একাধিক মোবাইলে একই সাথে ডেটা সিঙ্ক'
                : 'Real-time multi-device sync enabled'}
            </span>
          </div>
        </div>

        {/* Tab Switcher: Login vs Sign Up */}
        <div className="flex border-b border-[#E8E2D2] bg-[#F2EDE2]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-3.5 text-sm font-bold transition-all relative ${
              mode === 'login'
                ? 'text-[#0E3D2F] bg-[#FAF8F3]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'bn' ? 'লগইন করুন' : 'Login'}
            {mode === 'login' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E3D2F]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-3.5 text-sm font-bold transition-all relative ${
              mode === 'signup'
                ? 'text-[#0E3D2F] bg-[#FAF8F3]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'bn' ? 'নতুন অ্যাকাউন্ট খুলুন' : 'Sign Up'}
            {mode === 'signup' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E3D2F]" />
            )}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <p className="flex-1">{error}</p>
            </div>
          )}

          {/* Sign Up extra fields */}
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'খামারের নাম' : 'Farm Name'}
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder={
                      language === 'bn'
                        ? 'উদা: হাবিব পোল্ট্রি ফার্ম'
                        : 'e.g., Green Valley Poultry'
                    }
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D5CDBC] rounded-xl text-sm focus:ring-2 focus:ring-[#0E3D2F] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'খামারির নাম' : 'Owner / Manager Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder={
                      language === 'bn'
                        ? 'উদা: মো: রফিকুল ইসলাম'
                        : 'e.g., Rafiqul Islam'
                    }
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D5CDBC] rounded-xl text-sm focus:ring-2 focus:ring-[#0E3D2F] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </>
          )}

          {/* Identifier: Mobile or Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'bn'
                ? 'মোবাইল নম্বর অথবা ইমেইল'
                : 'Mobile Number or Email'}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-slate-400">
                {identifier.includes('@') ? (
                  <Mail className="w-4 h-4" />
                ) : (
                  <Phone className="w-4 h-4" />
                )}
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? '017XXXXXXXX অথবা user@gmail.com'
                    : '017XXXXXXXX or user@gmail.com'
                }
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D5CDBC] rounded-xl text-sm focus:ring-2 focus:ring-[#0E3D2F] focus:border-transparent outline-none transition"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {language === 'bn'
                ? '💡 যেকোনো মোবাইল নম্বর বা ইমেইল আইডি ব্যবহার করতে পারবেন'
                : '💡 You can use any 11-digit mobile number or standard email'}
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'bn' ? 'পাসওয়ার্ড (Password)' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#D5CDBC] rounded-xl text-sm focus:ring-2 focus:ring-[#0E3D2F] focus:border-transparent outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password for Sign Up */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D5CDBC] rounded-xl text-sm focus:ring-2 focus:ring-[#0E3D2F] focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#0E3D2F] hover:bg-[#144F3D] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'login'
                    ? language === 'bn'
                      ? 'লগইন করুন'
                      : 'Login to Farm'
                    : language === 'bn'
                    ? 'অ্যাকাউন্ট তৈরি করুন'
                    : 'Create Farm Account'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-[#E2DDD0]" />
            <span className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {language === 'bn' ? 'অথবা' : 'OR'}
            </span>
            <div className="flex-1 border-t border-[#E2DDD0]" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-[#D5CDBC] rounded-xl font-semibold text-xs shadow-xs transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {language === 'bn'
                    ? 'Google দিয়ে সরাসরি প্রবেশ করুন'
                    : 'Sign In with Google'}
                </span>
              </>
            )}
          </button>

          {/* Explore as Guest / Demo */}
          <button
            type="button"
            onClick={handleGuestSignIn}
            disabled={guestLoading}
            className="w-full py-2 px-3 text-slate-600 hover:text-[#0E3D2F] bg-transparent hover:bg-[#EBE5D8]/50 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {guestLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {language === 'bn'
                    ? 'লগইন ছাড়া ডেমো হিসেবে ঘুরে দেখুন'
                    : 'Try as Guest / Explore Demo Farm'}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Bottom Feature Pill */}
        <div className="bg-[#F0ECE1] px-6 py-3 border-t border-[#E4DDCF] flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {language === 'bn' ? 'অফলাইন ও ক্লাউড অটো-সিঙ্ক' : 'Offline & Cloud Sync'}
          </span>
          <span className="font-semibold text-emerald-800">
            {language === 'bn' ? 'স্মার্ট পোল্ট্রি v2.5' : 'Smart Poultry v2.5'}
          </span>
        </div>
      </div>
    </div>
  );
};
