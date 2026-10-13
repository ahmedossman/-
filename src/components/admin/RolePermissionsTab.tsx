import React, { useState } from 'react';
import { UserRole } from '../../types';
import { ROLE_PERMISSIONS, authService } from '../../services/authService';
import { Shield, Key, Check, Save, PlusCircle, AlertCircle } from 'lucide-react';

interface PermissionSpec {
  key: string;
  label: string;
  labelAr: string;
  description: string;
}

const PERMISSION_KEYS: PermissionSpec[] = [
  {
    key: 'canAccessAdmin',
    label: 'Access Enterprise Admin Dashboard',
    labelAr: 'الوصول للوحة التحكم والإدارة الحساسة',
    description: 'Grant right to modify rates, feature flags, backups, and user credentials.',
  },
  {
    key: 'canAddTransaction',
    label: 'Manage Portfolio Holdings & Trades',
    labelAr: 'إضافة وتعديل صفقات المحفظة والأصول',
    description: 'Allow adding gold bullion bars, USD liquidity, and bank certificate balances.',
  },
  {
    key: 'canExportReports',
    label: 'Generate & Export Financial PDF Reports',
    labelAr: 'تصدير التقارير المالية وتحليلات الذهب PDF',
    description: 'Enables downloading formal investment memos and valuation documentation.',
  },
  {
    key: 'canUseAI',
    label: 'Invoke Gemini 3.6 Flash Advisory Engine',
    labelAr: 'استخدام محرك التوصيات والذكاء الاصطناعي Gemini',
    description: 'Access smart market forecasts, gold signal summaries, and risk stress tests.',
  },
  {
    key: 'canManageAlerts',
    label: 'Configure Custom Bullion Price Alerts',
    labelAr: 'إدارة تنبيهات أسعار الصاغة والدولار',
    description: 'Set custom thresholds for 21K/24K gold rates and push notification triggers.',
  },
  {
    key: 'canBackupData',
    label: 'Execute System Backups & State Restores',
    labelAr: 'تصدير نسخ الاحتياط واسترجاع النظام',
    description: 'Export structured state archives and restore historical platform snapshots.',
  },
];

export const RolePermissionsTab: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [matrix, setMatrix] = useState(() => {
    const saved = localStorage.getItem('gold_hub_role_matrix');
    return saved
      ? JSON.parse(saved)
      : {
          ADMIN: { ...ROLE_PERMISSIONS.ADMIN, canBackupData: true },
          ANALYST: { ...ROLE_PERMISSIONS.ANALYST, canBackupData: false },
          INVESTOR: { ...ROLE_PERMISSIONS.INVESTOR, canBackupData: false },
          GUEST: { ...ROLE_PERMISSIONS.GUEST, canBackupData: false },
        };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [customRoleName, setCustomRoleName] = useState('');
  const [showCustomRoleInput, setShowCustomRoleInput] = useState(false);

  const togglePermission = (role: string, permKey: string) => {
    setMatrix((prev: any) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permKey]: !prev[role]?.[permKey],
      },
    }));
  };

  const handleSaveMatrix = () => {
    localStorage.setItem('gold_hub_role_matrix', JSON.stringify(matrix));
    authService.logAudit('PERMISSIONS_UPDATED', 'Updated RBAC permissions matrix across system roles').catch(console.warn);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoleName.trim()) return;
    const key = customRoleName.toUpperCase().replace(/\s+/g, '_');
    setMatrix((prev: any) => ({
      ...prev,
      [key]: {
        canAccessAdmin: false,
        canAddTransaction: true,
        canExportReports: true,
        canUseAI: false,
        canManageAlerts: true,
        canBackupData: false,
      },
    }));
    setCustomRoleName('');
    setShowCustomRoleInput(false);
  };

  const roles = Object.keys(matrix);

  return (
    <div className="space-y-5">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'مصفوفة التحكم بالصلاحيات (RBAC Permission Matrix)' : 'Role-Based Access Control (RBAC) Matrix'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'تخصيص الصلاحيات الدقيقة بكل دور في النظام لتقييد الإجراءات الحساسة'
              : 'Configure granular functional entitlements per system role across security boundaries.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCustomRoleInput(!showCustomRoleInput)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'إضافة دور مخصص' : 'Define Custom Role'}</span>
          </button>

          <button
            onClick={handleSaveMatrix}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isAr ? 'حفظ الصلاحيات' : 'Publish Matrix'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{isAr ? 'تم تطبيق وحفظ مصفوفة الصلاحيات بنجاح!' : 'RBAC permissions matrix updated and propagated across active sessions!'}</span>
        </div>
      )}

      {showCustomRoleInput && (
        <form onSubmit={handleAddCustomRole} className="bg-slate-950 border border-amber-500/40 p-4 rounded-xl flex items-center gap-3">
          <input
            type="text"
            placeholder={isAr ? 'اسم الدور الجديد (مثلاً VIP_DEALER)...' : 'Custom Role Title (e.g. VIP_DEALER)...'}
            value={customRoleName}
            onChange={(e) => setCustomRoleName(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs flex-1"
            required
          />
          <button type="submit" className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs">
            {isAr ? 'إضافة' : 'Create Role'}
          </button>
        </form>
      )}

      {/* Matrix Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="p-4 w-1/3">{isAr ? 'الوظيفة الصلاحية' : 'Permission Capability'}</th>
                {roles.map((role) => (
                  <th key={role} className="p-4 text-center font-bold">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md border text-[10px] ${
                        role === 'ADMIN'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : role === 'ANALYST'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          : role === 'INVESTOR'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {role}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {PERMISSION_KEYS.map((perm) => (
                <tr key={perm.key} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-slate-200 block">{isAr ? perm.labelAr : perm.label}</span>
                    <span className="text-[11px] text-slate-400">{perm.description}</span>
                  </td>

                  {roles.map((role) => {
                    const isChecked = !!matrix[role]?.[perm.key];
                    return (
                      <td key={role} className="p-4 text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(role, perm.key)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500 peer-checked:after:bg-slate-950 relative"></div>
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
