import React, { useState } from 'react';
import { adminService, FeatureFlag } from '../../services/adminService';
import { authService } from '../../services/authService';
import { ToggleLeft, ToggleRight, Sliders, Check, Sparkles, Shield, Cpu, Layers } from 'lucide-react';

export const FeatureFlagsTab: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [flags, setFlags] = useState<FeatureFlag[]>(() => adminService.getFeatureFlags());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleToggle = (id: string, name: string) => {
    const updated = adminService.toggleFeatureFlag(id);
    setFlags(adminService.getFeatureFlags());
    if (updated) {
      authService.logAudit('FEATURE_FLAG_TOGGLED', `Feature flag '${name}' set to ${updated.enabled}`).catch(console.warn);
      setSuccessMsg(`Toggled '${name}' -> ${updated.enabled ? 'ENABLED' : 'DISABLED'}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'AI':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'SECURITY':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'MARKET':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'PORTFOLIO':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'مفاتيح الميزات والمحاكاة (Feature Flags & Runtime Toggles)' : 'Realtime System Feature Flags'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'تفعيل وتعديل ميزات المنصة فعدياً بدون إعادة تشغيل الخادم (Gemini AI, Notifications, Overrides)'
              : 'Dynamically toggle platform capabilities, experimental algorithms, and maintenance locks in realtime.'}
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Feature Flags Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {flags.map((flag) => (
          <div
            key={flag.id}
            className={`p-4 rounded-xl border transition-all ${
              flag.enabled
                ? 'bg-[#0D1424] border-slate-700'
                : 'bg-slate-950/40 border-slate-800/80 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getCategoryBadge(flag.category)}`}>
                    {flag.category}
                  </span>
                  <span className="font-bold text-white text-sm">{flag.name}</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{flag.description}</p>
                <span className="text-[10px] font-mono text-slate-500 block">
                  Key: <code className="text-amber-400 font-bold">{flag.key}</code>
                </span>
              </div>

              <button
                onClick={() => handleToggle(flag.id, flag.name)}
                className="shrink-0 cursor-pointer focus:outline-none"
                title={flag.enabled ? 'Click to disable' : 'Click to enable'}
              >
                {flag.enabled ? (
                  <ToggleRight className="w-9 h-9 text-emerald-400 hover:text-emerald-300 transition-colors" />
                ) : (
                  <ToggleLeft className="w-9 h-9 text-slate-600 hover:text-slate-500 transition-colors" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
