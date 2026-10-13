import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { 
  ShieldCheck, 
  Users, 
  Key, 
  Database, 
  Activity, 
  Server, 
  BarChart3, 
  FileText, 
  Archive, 
  Sliders, 
  Settings, 
  Lock, 
  Save, 
  CheckCircle2, 
  Radio
} from 'lucide-react';

import { UsersManagementTab } from '../components/admin/UsersManagementTab';
import { RolePermissionsTab } from '../components/admin/RolePermissionsTab';
import { DatabaseMonitorTab } from '../components/admin/DatabaseMonitorTab';
import { ApiMonitorTab } from '../components/admin/ApiMonitorTab';
import { SystemHealthTab } from '../components/admin/SystemHealthTab';
import { SystemMonitoringDashboard } from '../components/admin/SystemMonitoringDashboard';
import { UsageAnalyticsTab } from '../components/admin/UsageAnalyticsTab';
import { LogsTab } from '../components/admin/LogsTab';
import { BackupsRestoreTab } from '../components/admin/BackupsRestoreTab';
import { FeatureFlagsTab } from '../components/admin/FeatureFlagsTab';
import { ApplicationSettingsTab } from '../components/admin/ApplicationSettingsTab';

export type AdminTab = 
  | 'MONITORING'
  | 'OVERRIDE'
  | 'USERS'
  | 'PERMISSIONS'
  | 'DATABASE'
  | 'API'
  | 'HEALTH'
  | 'ANALYTICS'
  | 'LOGS'
  | 'BACKUPS'
  | 'FLAGS'
  | 'SETTINGS';

export const AdminPanelPage: React.FC = () => {
  const { marketData, updateMarketPrices, language, role } = useApp();
  const isAr = language === 'AR';

  const [activeTab, setActiveTab] = useState<AdminTab>('MONITORING');

  // Override Form State
  const [gold21k, setGold21k] = useState(marketData.gold21kEGP);
  const [gold24k, setGold24k] = useState(marketData.gold24kEGP);
  const [usdEgp, setUsdEgp] = useState(marketData.usdEgpOfficial);
  const [overrideSuccess, setOverrideSuccess] = useState(false);

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    updateMarketPrices({
      gold21kEGP: gold21k,
      gold24kEGP: gold24k,
      usdEgpOfficial: usdEgp,
      gold18kEGP: Math.round(gold21k * (18 / 21)),
      goldPoundEGP: gold21k * 8,
    });
    authService.logAudit('OVERRIDE_PRICE', `Updated Gold 21K to ${gold21k} EGP, USD to ${usdEgp} EGP`).catch(console.warn);
    setOverrideSuccess(true);
    setTimeout(() => setOverrideSuccess(false), 3000);
  };

  if (role !== 'ADMIN') {
    return (
      <div className="bg-[#0D1424] border border-rose-500/30 rounded-2xl p-8 text-center max-w-xl mx-auto my-12 space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">
          {isAr ? 'منطقة محمية - يتطلب صلاحية مسؤول (ADMIN)' : 'Protected Route - Restricted Access'}
        </h2>
        <p className="text-xs text-slate-400">
          {isAr
            ? 'لوحة الإدارة مقتصرة فقط على المسؤولين والتنفيذيين المعتمدين بـ Role-Based Access Control.'
            : 'Access to Enterprise Admin Operations requires Chief Investment Officer or Admin privileges.'}
        </p>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; labelAr: string; icon: React.ReactNode }[] = [
    { id: 'MONITORING', label: 'System Monitoring', labelAr: 'نظام المراقبة والتعافي', icon: <Activity className="w-4 h-4 text-emerald-400" /> },
    { id: 'USERS', label: 'Users Management', labelAr: 'إدارة المستخدمين', icon: <Users className="w-4 h-4" /> },
    { id: 'PERMISSIONS', label: 'Permissions & Role Editor', labelAr: 'محرر الصلاحيات والأدوار', icon: <Key className="w-4 h-4" /> },
    { id: 'DATABASE', label: 'Database Monitor', labelAr: 'مراقب قاعدة البيانات', icon: <Database className="w-4 h-4" /> },
    { id: 'API', label: 'API Monitor', labelAr: 'مراقب خدمات الـ API', icon: <Activity className="w-4 h-4" /> },
    { id: 'HEALTH', label: 'System Health', labelAr: 'صحة التشغيل والخادم', icon: <Server className="w-4 h-4" /> },
    { id: 'ANALYTICS', label: 'Usage Analytics', labelAr: 'تحليلات الاستخدام', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'LOGS', label: 'Audit Logs', labelAr: 'سجلات الأمان والعمليات', icon: <FileText className="w-4 h-4" /> },
    { id: 'BACKUPS', label: 'Backups & Restore', labelAr: 'النسخ الاحتياطي والاسترجاع', icon: <Archive className="w-4 h-4" /> },
    { id: 'FLAGS', label: 'Feature Flags', labelAr: 'مفاتيح الميزات', icon: <Sliders className="w-4 h-4" /> },
    { id: 'SETTINGS', label: 'App Settings', labelAr: 'إعدادات المنصة', icon: <Settings className="w-4 h-4" /> },
    { id: 'OVERRIDE', label: 'Rates Override', labelAr: 'تعديل أسعار الصاغة', icon: <Radio className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 select-none max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950/70 via-[#0D1424] to-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-rose-400" />
            <h2 className="text-xl font-extrabold text-white">
              {isAr ? 'لوحة التحكم الإدارية والمؤسسية (Enterprise Admin Dashboard)' : 'Enterprise Admin Dashboard & Infrastructure Control'}
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1.5">
            {isAr
              ? 'إدارة المستخدمين الصلاحيات مراقبة الخوادم وقواعد البيانات تحليلات الاستخدام والنسخ الاحتياطي'
              : 'Unified executive command center for User Management, RBAC Roles, Telemetry, Backups, and Market Overrides.'}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SYSTEM ONLINE
          </span>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-lg">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === t.id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.icon}
            <span>{isAr ? t.labelAr : t.label}</span>
          </button>
        ))}
      </div>

      {/* Main Active Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === 'MONITORING' && <SystemMonitoringDashboard isAr={isAr} />}
        {activeTab === 'USERS' && <UsersManagementTab isAr={isAr} />}
        {activeTab === 'PERMISSIONS' && <RolePermissionsTab isAr={isAr} />}
        {activeTab === 'DATABASE' && <DatabaseMonitorTab isAr={isAr} />}
        {activeTab === 'API' && <ApiMonitorTab isAr={isAr} />}
        {activeTab === 'HEALTH' && <SystemHealthTab isAr={isAr} />}
        {activeTab === 'ANALYTICS' && <UsageAnalyticsTab isAr={isAr} />}
        {activeTab === 'LOGS' && <LogsTab isAr={isAr} />}
        {activeTab === 'BACKUPS' && <BackupsRestoreTab isAr={isAr} />}
        {activeTab === 'FLAGS' && <FeatureFlagsTab isAr={isAr} />}
        {activeTab === 'SETTINGS' && <ApplicationSettingsTab isAr={isAr} />}

        {activeTab === 'OVERRIDE' && (
          <div className="space-y-5">
            <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
              <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2">
                {isAr ? 'تعديل أسعار الصاغة المباشرة (Cairo Bullion Rate Overrides)' : 'Cairo Bullion Rate Overrides'}
              </h3>

              {overrideSuccess && (
                <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 p-3 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'تم تحديث أسعار السوق بنجاح وحساب باقي الأعيرة آلياً!' : 'Market rates updated successfully across the platform!'}</span>
                </div>
              )}

              <form onSubmit={handleSaveRates} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">{isAr ? 'سعر جرام 21 (EGP)' : 'Gold 21K Price (EGP/g)'}</label>
                  <input
                    type="number"
                    value={gold21k}
                    onChange={(e) => setGold21k(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-white text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">{isAr ? 'سعر جرام 24 (EGP)' : 'Gold 24K Price (EGP/g)'}</label>
                  <input
                    type="number"
                    value={gold24k}
                    onChange={(e) => setGold24k(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-white text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">{isAr ? 'الدولار الرسمي (EGP)' : 'USD/EGP Rate (EGP)'}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={usdEgp}
                    onChange={(e) => setUsdEgp(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-white text-sm"
                    required
                  />
                </div>

                <div className="sm:col-span-3 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs shadow-lg shadow-rose-600/20 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isAr ? 'تطبيق وحفظ الأسعار الجديدة' : 'Publish Rate Override'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
