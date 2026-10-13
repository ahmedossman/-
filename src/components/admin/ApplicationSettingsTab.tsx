import React, { useState } from 'react';
import { adminService, SystemSettings } from '../../services/adminService';
import { authService } from '../../services/authService';
import { Settings, Save, Check, ShieldAlert, Globe, Clock, Mail, Lock } from 'lucide-react';

export const ApplicationSettingsTab: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [settings, setSettings] = useState<SystemSettings>(() => adminService.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    adminService.updateSettings(settings);
    authService.logAudit('SETTINGS_UPDATED', 'Updated global application system settings').catch(console.warn);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'إعدادات المنصة الشاملة (Global System Parameters)' : 'Global Enterprise Platform Settings'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'تكوين العملة الرئيسية للمحفظة، فترات تحديث السوق، مهلة الجلسة، وبريد الدعم الفني'
              : 'System-wide defaults for currency, live rate refresh intervals, session timeout, and security mandates.'}
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{isAr ? 'تم حفظ إعدادات المنصة بنجاح!' : 'Global system parameters saved and published across platform!'}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#0D1424] border border-slate-800 rounded-xl p-6 space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'العملة الافتراضية لعرض المحفظة:' : 'Default Base Currency:'}</span>
            </label>
            <select
              value={settings.defaultCurrency}
              onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value as any })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
            >
              <option value="EGP">EGP - Egyptian Pound (الجنيه المصري)</option>
              <option value="USD">USD - US Dollar ($)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>{isAr ? 'معدل تحديث أسعار الصاغة (ثواني):' : 'Bullion Rate Polling Interval (Sec):'}</span>
            </label>
            <input
              type="number"
              min={5}
              max={300}
              value={settings.refreshIntervalSeconds}
              onChange={(e) => setSettings({ ...settings, refreshIntervalSeconds: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-rose-400" />
              <span>{isAr ? 'مهلة الجلسة الأمنية (دقائق):' : 'Security Session Idle Timeout (Mins):'}</span>
            </label>
            <input
              type="number"
              min={10}
              max={480}
              value={settings.sessionTimeoutMinutes}
              onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>{isAr ? 'بريد الدعم الفني والمؤسسي:' : 'Enterprise Support Helpdesk Email:'}</span>
            </label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
            />
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.mandatoryMfa}
              onChange={(e) => setSettings({ ...settings, mandatoryMfa: e.target.checked })}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500"
            />
            <div>
              <span className="font-bold text-slate-200 block">{isAr ? 'فرض المصادقة الثنائية (Mandatory MFA)' : 'Enforce Multi-Factor Authentication (MFA)'}</span>
              <span className="text-[11px] text-slate-400">Requires 2FA verification for all Admin & Analyst accounts upon sign in.</span>
            </div>
          </label>

          <div className="space-y-1.5 pt-2">
            <label className="block text-slate-300 font-bold">{isAr ? 'رسالة راية الصيانة (Maintenance Banner text):' : 'System Maintenance Banner Text:'}</label>
            <input
              type="text"
              value={settings.maintenanceMessage}
              onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isAr ? 'حفظ ونشر الإعدادات' : 'Save & Propagate Platform Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
