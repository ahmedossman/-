import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useSocket } from '../../context/SocketContext';
import {
  Coins,
  Globe,
  Bell,
  Moon,
  Sun,
  UserCheck,
  Plus,
  Sparkles,
  ChevronDown,
  CheckCheck,
  KeyRound,
  Radio,
} from 'lucide-react';
import { UserRole } from '../../types';

import { AlertCenterModal } from '../alerts/AlertCenterModal';
import { AuthModal } from '../modals/AuthModal';

export const TerminalHeader: React.FC<{ onOpenBuyModal: () => void }> = ({ onOpenBuyModal }) => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    role,
    setRole,
    notifications,
    setActivePage,
    marketData,
  } = useApp();
  const { isConnected, latencyMs } = useSocket();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isAr = language === 'AR';
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="bg-[#0B101D] border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0B101D] rounded-[10px] flex items-center justify-center">
                <Coins className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-white">
                  {isAr ? 'منصة محفظة الذهب الاستثمارية' : 'Gold Portfolio Hub'}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {isAr ? 'مركز التحليلات وإدارة الأصول في مصر' : 'Egyptian Market Investment Intelligence'}
              </p>
            </div>
          </div>

          {/* Live Market Quick Badges */}
          <div className="hidden lg:flex items-center gap-3 text-xs bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5">
              <Radio className={`w-3.5 h-3.5 ${isConnected && !marketData.isDataDelayed ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
              <span className="text-slate-400">{isAr ? 'جرام 21:' : 'Gold 21K:'}</span>
              <span className="font-bold text-amber-400 font-mono">{(marketData?.gold21kEGP ?? 0).toLocaleString()} EGP</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">{isAr ? 'الدولار:' : 'USD/EGP:'}</span>
              <span className="font-bold text-slate-200 font-mono">{marketData.usdEgpOfficial} EGP</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isConnected && !marketData.isDataDelayed ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-[10px] text-slate-400 font-mono">
                {isConnected && !marketData.isDataDelayed
                  ? `${latencyMs}ms Live`
                  : marketData.isDataDelayed
                    ? (isAr ? 'بيانات متأخرة' : 'Delayed Data')
                    : (isAr ? 'جاري الاتصال' : 'Connecting')}
              </span>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Buy Gold */}
            <button
              onClick={onOpenBuyModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isAr ? 'إضافة صفقات ذهب' : 'Buy / Add Gold'}</span>
            </button>

            {/* AI Insights Quick Trigger */}
            <button
              onClick={() => setActivePage('ai_insights')}
              className="hidden sm:flex items-center gap-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{isAr ? 'توصيات الذكاء الاصطناعي' : 'AI Signals'}</span>
            </button>

            {/* Firebase Auth Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all"
              title="Firebase Authentication & User Profile"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{isAr ? 'تسجيل الحساب' : 'Auth'}</span>
            </button>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">{role}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-[#0F172A] border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs">
                  {(['INVESTOR', 'ANALYST', 'ADMIN', 'GUEST'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 ${
                        role === r ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-slate-300'
                      }`}
                    >
                      <span>{r}</span>
                      {role === r && <CheckCheck className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsAlertModalOpen(true)}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 relative cursor-pointer"
                title="Open Smart Alert Center"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'EN' ? 'AR' : 'EN')}
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'EN' ? 'عربي' : 'EN'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'DARK' ? 'LIGHT' : 'DARK')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 cursor-pointer"
            >
              {theme === 'DARK' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>
        </div>
      </header>

      <AlertCenterModal isOpen={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
