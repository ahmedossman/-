import React from 'react';
import { useApp } from '../context/AppContext';
import { TradingViewChart } from '../components/widgets/TradingViewChart';
import { TradingViewCandlestickChart } from '../components/widgets/TradingViewCandlestickChart';
import { GoldHistoricalWidget } from '../components/widgets/GoldHistoricalWidget';
import { PerformanceTimelineWidget } from '../components/widgets/PerformanceTimelineWidget';
import { AdvancedAnalyticsWidget } from '../components/widgets/AdvancedAnalyticsWidget';
import { LineChart } from 'lucide-react';

export const HistoricalAnalysisPage: React.FC = () => {
  const { language, riskMetrics } = useApp();
  const isAr = language === 'AR';

  return (
    <div className="space-y-6 select-none">
      <div className="bg-gradient-to-r from-amber-500/10 via-[#0D1424] to-slate-900 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <LineChart className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-extrabold text-white">
            {isAr ? 'التحليل التاريخي والرسوم البيانية المتقدمة' : 'Historical Analysis & Technical Analytics'}
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {isAr
            ? 'دراسة المسار التراكمي لأسعار الذهب والتقلبات وتأثير معدلات التضخم المصرية'
            : 'Multi-year trajectory analysis, annual volatility, and drawdown benchmarks'}
        </p>
      </div>

      <TradingViewCandlestickChart />
      <AdvancedAnalyticsWidget />
      <TradingViewChart />

      {/* Volatility & Return Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400 font-sans mb-1">{isAr ? 'معدل التقلب السنوي (Volatility)' : 'Annualized Volatility'}</div>
          <div className="text-xl font-bold text-amber-400">{riskMetrics.volatilityPercentage}%</div>
          <p className="text-[10px] text-slate-500 font-sans mt-1">
            {isAr ? 'مستويات تقلب منخفضة نسبياً مقارنة بالأسهم' : 'Moderate price variance relative to EGP'}
          </p>
        </div>

        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400 font-sans mb-1">{isAr ? 'أقصى تراجع تاريخي (Max Drawdown)' : 'Maximum Drawdown'}</div>
          <div className="text-xl font-bold text-rose-400">-{riskMetrics.maxDrawdownPercentage}%</div>
          <p className="text-[10px] text-slate-500 font-sans mt-1">
            {isAr ? 'أقصى انخفاض من الذروة إلى القاع' : 'Peak-to-trough correction risk'}
          </p>
        </div>

        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400 font-sans mb-1">{isAr ? 'نسبة شارب لتعديل المخاطر (Sharpe)' : 'Sharpe Ratio'}</div>
          <div className="text-xl font-bold text-emerald-400">{riskMetrics.sharpeRatio}</div>
          <p className="text-[10px] text-slate-500 font-sans mt-1">
            {isAr ? 'العائد الإضافي مقارنة بفائدة الشهادات' : 'Excess return over risk-free rate'}
          </p>
        </div>
      </div>

      <GoldHistoricalWidget />
      <PerformanceTimelineWidget />
    </div>
  );
};
