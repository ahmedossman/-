import React from 'react';
import { useApp } from '../../context/AppContext';
import { aiPlatform } from '../../services/aiPlatform';
import { ShieldAlert, TrendingDown, Activity, Zap, Flame, BarChart3 } from 'lucide-react';

export const AIRiskInflationWidget: React.FC = () => {
  const { holdings, marketData, language } = useApp();
  const isAr = language === 'AR';

  const inflationForecasts = aiPlatform.getInflationForecast(marketData);
  const riskForecast = aiPlatform.getRiskForecast(holdings, marketData);

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-5">
      {/* 1. Inflation Forecast Engine Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">
              {isAr ? 'توقعات التضخم والعائد الحقيقي (Inflation Forecast & Real Returns)' : 'AI Inflation Forecast & Real Yield Model'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'مقارنة التضخم المتوقع من الجهاز المركزي للتعبئة والإحصاء مع العائد الحقيقي للذهب والشهادات' : 'CAPMAS Headline Inflation vs Core CBE vs Physical Gold Real Purchasing Power'}
            </p>
          </div>
        </div>

        {/* Forecast Table Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
          {inflationForecasts.map((pt) => (
            <div key={pt.periodMonths} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="font-bold text-amber-400 font-sans text-xs">{pt.periodMonths} {isAr ? 'أشهر' : 'Months'}</span>
                <span className="text-[10px] text-slate-500 font-sans">Headline: {pt.capmasHeadlineInflation}%</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>{isAr ? 'العائد الحقيقي للذهب:' : 'Gold Real Return:'}</span>
                  <span>+{pt.goldRealReturnPercent}%</span>
                </div>
                <div className={`flex items-center justify-between font-bold ${pt.bankCdRealReturnPercent < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                  <span>{isAr ? 'العائد الحقيقي للشهادات:' : 'CD Real Yield:'}</span>
                  <span>{pt.bankCdRealReturnPercent > 0 ? `+${pt.bankCdRealReturnPercent.toFixed(1)}%` : `${pt.bankCdRealReturnPercent.toFixed(1)}%`}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>{isAr ? 'فقدان القوة الشرائية للشرائح:' : 'Purchasing Power Loss:'}</span>
                  <span>-{pt.egpPurchasingPowerLossPercent}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Risk Forecast & Value-at-Risk (VaR) Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">
              {isAr ? 'توقعات المخاطر والقيمة المعرضة للمخاطرة (Risk Forecast & VaR)' : 'Risk Forecast & Stress Testing Engine'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'نمذجة المخاطر الذكية واختبارات الضغط لسيناريوهات خفض الجنيه والهزات العالمية' : 'Parametric VaR 95%/99%, Expected Shortfall (CVaR), and macroeconomic shock simulation'}
            </p>
          </div>
        </div>

        {/* VaR Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] font-sans block">{isAr ? 'القيمة المعرضة للمخاطرة VaR 95%' : 'Value at Risk (VaR 95%)'}</span>
            <span className="text-amber-400 font-extrabold text-base block">{riskForecast.var95PercentEGP.toLocaleString()} EGP</span>
            <span className="text-[10px] text-slate-500 font-sans block">95% confidence max expected 30-day loss</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] font-sans block">{isAr ? 'العجز المتوقع (CVaR / Tail Risk)' : 'Expected Shortfall (CVaR)'}</span>
            <span className="text-rose-400 font-extrabold text-base block">{riskForecast.expectedShortfallEGP.toLocaleString()} EGP</span>
            <span className="text-[10px] text-slate-500 font-sans block">Tail risk loss beyond 99% VaR threshold</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] font-sans block">{isAr ? 'احتمالية التراجع الأقصى' : 'Max Drawdown Probability'}</span>
            <span className="text-indigo-400 font-extrabold text-base block">{riskForecast.maxDrawdownProbability}%</span>
            <span className="text-[10px] text-slate-500 font-sans block">Based on historical Sagha price volatility</span>
          </div>
        </div>

        {/* Stress Testing Results Table */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
          <span className="font-bold text-white block flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'نتائج محاكاة الصدمات الاقتصادية (Macro Stress Testing Scenarios):' : 'Macro Stress Test Simulations:'}</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
            {riskForecast.stressTestResults.map((st, idx) => (
              <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-sans">
                  <span className="font-bold text-white text-xs">{isAr ? st.scenarioNameAr : st.scenarioName}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold font-mono ${st.impactPercentage > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                    {st.impactPercentage > 0 ? `+${st.impactPercentage}%` : `${st.impactPercentage}%`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
                  <span>Projected Valuation:</span>
                  <span className="text-white font-bold font-mono">{st.projectedPortfolioEGP.toLocaleString()} EGP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
