import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export const RiskGauge: React.FC = () => {
  const { riskMetrics, language } = useApp();
  const isAr = language === 'AR';

  const score = riskMetrics.riskScore || 32;

  let riskLevel = isAr ? 'منخفض المخاطر (تحوط قوي)' : 'Low Risk (Wealth Preservation)';
  let color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

  if (score > 60) {
    riskLevel = isAr ? 'مرتفع المخاطر' : 'High Volatility';
    color = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  } else if (score > 40) {
    riskLevel = isAr ? 'متوسط المخاطر' : 'Moderate Volatility';
    color = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  }

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4 select-none">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{isAr ? 'مؤشر مخاطر المحفظة (Risk Score)' : 'Portfolio Risk Score'}</span>
        </h3>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${color}`}>
          {score} / 100
        </span>
      </div>

      {/* Progress dial bar */}
      <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800 my-3">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-300">{riskLevel}</span>
        <span className="text-slate-400 font-mono">Sharpe: {riskMetrics.sharpeRatio}</span>
      </div>
    </div>
  );
};
