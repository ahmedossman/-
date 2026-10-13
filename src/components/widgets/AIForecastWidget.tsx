import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Brain, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { INITIAL_FORECASTS } from '../../services/goldService';

export const AIForecastWidget: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'AR';

  const [months, setMonths] = useState<3 | 6 | 12>(6);

  const scenario = INITIAL_FORECASTS.find((f) => f.periodMonths === months) || INITIAL_FORECASTS[1];

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              {isAr ? 'سيناريوهات التوقع المستقبلية للذهب (AI Scenario Projections)' : 'AI Forward Scenario Projection Engine'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'نماذج استشرافية لأسعار الذهب عيار 21 خلال 3 و 6 و 12 شهراً' : 'Probabilistic gold 21K price projections based on macro scenario modeling'}
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          {([3, 6, 12] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMonths(m)}
              className={`px-3 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                months === m ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m} {isAr ? 'أشهر' : 'Months'}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        {/* Bullish Case */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-extrabold text-emerald-400 block uppercase tracking-wider font-sans">
            {isAr ? 'السيناريو المتفائل (Bull Case)' : 'Bullish Scenario'}
          </span>
          <span className="text-lg font-extrabold text-emerald-300 block">
            {scenario.optimistic21kEGP.toLocaleString()} EGP
          </span>
          <span className="text-[10px] text-emerald-400/80 block font-sans">
            {isAr ? 'احتمالية 25% | انخفاض إضافي للجنيه' : '25% Probability | EGP Devaluation Surge'}
          </span>
        </div>

        {/* Base Case */}
        <div className="bg-amber-500/10 border border-amber-500/40 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-extrabold text-amber-400 block uppercase tracking-wider font-sans">
            {isAr ? 'السيناريو المحايد (Base Case)' : 'Neutral Base Case'}
          </span>
          <span className="text-lg font-extrabold text-amber-300 block">
            {scenario.neutral21kEGP.toLocaleString()} EGP
          </span>
          <span className="text-[10px] text-amber-400/80 block font-sans">
            {isAr ? 'احتمالية 60% | نمو تضخمي طبيعي' : '60% Probability | Normal Inflation Offset'}
          </span>
        </div>

        {/* Bear Case */}
        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-extrabold text-rose-400 block uppercase tracking-wider font-sans">
            {isAr ? 'السيناريو المتشائم (Bear Case)' : 'Stressed Scenario'}
          </span>
          <span className="text-lg font-extrabold text-rose-300 block">
            {scenario.pessimistic21kEGP.toLocaleString()} EGP
          </span>
          <span className="text-[10px] text-rose-400/80 block font-sans">
            {isAr ? 'احتمالية 15% | استقرار تدفقات النقد' : '15% Probability | Strong FX Inflows'}
          </span>
        </div>
      </div>

      {/* Key Forecast Drivers */}
      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
        <span className="font-bold text-white block">{isAr ? 'أبرز فرضيات التوقع:' : 'Key Model Drivers & Hypotheses:'}</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
          {scenario.keyDrivers.map((driver, idx) => (
            <div key={idx} className="flex items-center gap-1.5 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{driver}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
