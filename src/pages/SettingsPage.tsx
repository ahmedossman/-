import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Globe, Moon, Sun, ShieldCheck, RefreshCcw } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, theme, setTheme, role, resetToDefaultData } = useApp();
  const isAr = language === 'AR';

  return (
    <div className="space-y-6 select-none max-w-4xl">
      <div className="bg-gradient-to-r from-amber-500/10 via-[#0D1424] to-slate-900 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-extrabold text-white">
            {isAr ? 'تفضيلات وإعدادات المنصة' : 'Platform & User Settings'}
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {isAr ? 'تخصيص اللغة والعملة الأساسية والسمة الليلية' : 'Configure display language, theme modes, and reset local cache'}
        </p>
      </div>

      <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 space-y-6 text-xs">
        {/* Language */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-sm text-white">{isAr ? 'لغة الواجهة' : 'Display Language'}</h3>
            <p className="text-slate-400">{isAr ? 'اختيار اللغة العربية أو الإنجليزية' : 'Toggle between English LTR and Arabic RTL'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-3 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                language === 'EN' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('AR')}
              className={`px-3 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                language === 'AR' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              العربية
            </button>
          </div>
        </div>

        {/* Theme */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-sm text-white">{isAr ? 'السمة المظهرية' : 'Theme Mode'}</h3>
            <p className="text-slate-400">{isAr ? 'الوضع الداكن المتقدم أو الوضع الفاتح' : 'Bloomberg Dark Terminal or High-Contrast Light'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme('DARK')}
              className={`px-3 py-1.5 rounded-lg font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === 'DARK' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <span>Dark</span>
            </button>
            <button
              onClick={() => setTheme('LIGHT')}
              className={`px-3 py-1.5 rounded-lg font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === 'LIGHT' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light</span>
            </button>
          </div>
        </div>

        {/* Reset Data */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h3 className="font-bold text-sm text-rose-400">{isAr ? 'إعادة ضبط البيانات المحلية' : 'Reset Local Storage Cache'}</h3>
            <p className="text-slate-400">{isAr ? 'إعادة تعيين المحفظة والصفقات المسجلة محلياً إلى البيانات النموذجية' : 'Restore sample holdings and initial market rates'}</p>
          </div>
          <button
            onClick={resetToDefaultData}
            className="flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>{isAr ? 'إعادة الضبط' : 'Reset Demo Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
