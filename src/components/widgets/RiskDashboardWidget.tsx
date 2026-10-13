import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, ShieldAlert, Activity, AlertTriangle, Scale } from 'lucide-react';

export const RiskDashboardWidget: React.FC = () => {
  const { riskMetrics, language } = useApp();
  const isAr = language === 'AR';

  // Calculate Value at Risk (VaR) 95% 1-day estimated loss in EGP
  const valueAtRiskEGP = Math.round((riskMetrics.totalValueEGP * (riskMetrics.volatilityPercentage / 100) * 1.65) / Math.sqrt(252));

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              {isAr ? 'مؤشرات التقييم وتحليل المخاطر (Institutional Risk Model)' : 'Institutional Risk & Volatility Analytics'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'مؤشرات القيمة المعرضة للخطر VaR، التقلب السعري ومقياس شارب' : 'Value-at-Risk (VaR), Sharpe ratio, Sortino ratio and Max Drawdown stress metrics'}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded font-mono">
          RISK INDEX: {riskMetrics.riskScore} / 100
        </span>
      </div>

      {/* Grid of Risk Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[11px] block">{isAr ? 'مخاطرة يومية (VaR 95%)' : 'Value at Risk (1D 95%)'}</span>
          <span className="text-rose-400 font-extrabold text-sm">{valueAtRiskEGP.toLocaleString()} EGP</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{isAr ? 'خسارة متوقعة كحد أقصى' : 'Max 1-day normal loss'}</span>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[11px] block">{isAr ? 'التقلب السنوي' : 'Annual Volatility'}</span>
          <span className="text-amber-400 font-extrabold text-sm">{riskMetrics.volatilityPercentage}%</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{isAr ? 'انحراف معياري لعيار 21' : 'Gold 21K Std Deviation'}</span>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[11px] block">{isAr ? 'أقصى تراجع تاریخی' : 'Max Drawdown'}</span>
          <span className="text-rose-400 font-extrabold text-sm">-{riskMetrics.maxDrawdownPercentage}%</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{isAr ? 'أكبر انخفاض من الذروة' : 'Peak-to-trough decline'}</span>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[11px] block">{isAr ? 'نسبة سوربينو Sortino' : 'Sortino Ratio'}</span>
          <span className="text-emerald-400 font-extrabold text-sm">{riskMetrics.sortinoRatio}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{isAr ? 'عائد هبوطي معدل' : 'Downside risk-adjusted'}</span>
        </div>
      </div>

      {/* Drawdown Risk Gauge Bar */}
      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
        <div className="flex justify-between items-center text-slate-300 font-semibold">
          <span>{isAr ? 'مقياس قدرة استيعاب انخفاضات الجنيه (Inflation Hedge Buffer)' : 'Currency Devaluation Safety Margin'}</span>
          <span className="font-mono text-emerald-400 font-bold">HIGH PROTECTION (88%)</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 w-[88%] rounded-full" />
        </div>
      </div>
    </div>
  );
};
