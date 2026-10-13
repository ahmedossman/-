import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, Zap, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const ScenarioSimulatorWidget: React.FC = () => {
  const { holdings, riskMetrics, language } = useApp();
  const isAr = language === 'AR';

  const [goldShiftPct, setGoldShiftPct] = useState<number>(15);
  const [usdEgpShiftPct, setUsdEgpShiftPct] = useState<number>(10);
  const [inflationShiftPct, setInflationShiftPct] = useState<number>(5);

  // Compute simulated portfolio valuation
  const baseValue = riskMetrics.totalValueEGP;
  const goldHoldings = holdings.filter((h) => h.assetType === 'GOLD');
  const usdHoldings = holdings.filter((h) => h.assetType === 'USD_CASH');
  const otherHoldings = holdings.filter((h) => h.assetType !== 'GOLD' && h.assetType !== 'USD_CASH');

  const baseGoldValue = goldHoldings.reduce((sum, h) => sum + h.currentValueEGP, 0);
  const baseUsdValue = usdHoldings.reduce((sum, h) => sum + h.currentValueEGP, 0);
  const baseOtherValue = otherHoldings.reduce((sum, h) => sum + h.currentValueEGP, 0);

  // Gold price change also carries devaluation multiplier
  const simulatedGoldValue = baseGoldValue * (1 + goldShiftPct / 100);
  const simulatedUsdValue = baseUsdValue * (1 + usdEgpShiftPct / 100);
  const simulatedOtherValue = baseOtherValue;

  const simulatedTotalValue = simulatedGoldValue + simulatedUsdValue + simulatedOtherValue;
  const simulatedGainEGP = simulatedTotalValue - baseValue;
  const simulatedGainPct = baseValue > 0 ? (simulatedGainEGP / baseValue) * 100 : 0;

  // Inflation impact on purchasing power
  const inflationAdjustedSimulatedValue = simulatedTotalValue / (1 + inflationShiftPct / 100);
  const netRealPurchasingPowerGain = inflationAdjustedSimulatedValue - baseValue;

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              {isAr ? 'محاكي صدمات السوق والتغيرات الاقتصادية (Macro Scenario Simulator)' : 'Interactive Macro Stress Test Simulator'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'حساب الأثر المباشر لقفزات الذهب وانخفاض الجنيه والتضخم على محفظتك' : 'Real-time portfolio valuation sensitivity to gold spot surges, USD shocks, and inflation'}
            </p>
          </div>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
        <div>
          <div className="flex justify-between font-bold mb-1">
            <span className="text-slate-300">{isAr ? 'تغير سعر الذهب عيار 21:' : 'Gold Price Shift:'}</span>
            <span className="text-amber-400 font-mono">{goldShiftPct > 0 ? `+${goldShiftPct}%` : `${goldShiftPct}%`}</span>
          </div>
          <input
            type="range"
            min="-20"
            max="50"
            step="5"
            value={goldShiftPct}
            onChange={(e) => setGoldShiftPct(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between font-bold mb-1">
            <span className="text-slate-300">{isAr ? 'تغير سعر الدولار مقابل الجنيه:' : 'USD/EGP Rate Shift:'}</span>
            <span className="text-emerald-400 font-mono">{usdEgpShiftPct > 0 ? `+${usdEgpShiftPct}%` : `${usdEgpShiftPct}%`}</span>
          </div>
          <input
            type="range"
            min="-10"
            max="40"
            step="5"
            value={usdEgpShiftPct}
            onChange={(e) => setUsdEgpShiftPct(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between font-bold mb-1">
            <span className="text-slate-300">{isAr ? 'ارتفاع معدل التضخم السنوي:' : 'Headline Inflation Increase:'}</span>
            <span className="text-rose-400 font-mono">+{inflationShiftPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={inflationShiftPct}
            onChange={(e) => setInflationShiftPct(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Simulated Valuation Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 block text-[11px] font-sans">{isAr ? 'القيمة الحالية للمحفظة' : 'Current Portfolio Base'}</span>
          <span className="text-white font-extrabold text-base">{baseValue.toLocaleString()} EGP</span>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl space-y-1">
          <span className="text-indigo-300 block text-[11px] font-sans">{isAr ? 'القيمة المتوقعة بعد الصدمة' : 'Simulated Post-Shock Value'}</span>
          <span className="text-indigo-200 font-extrabold text-base">{Math.round(simulatedTotalValue).toLocaleString()} EGP</span>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-sans">
            {simulatedGainEGP >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>
              {simulatedGainEGP >= 0 ? '+' : ''}
              {Math.round(simulatedGainEGP).toLocaleString()} EGP ({simulatedGainPct.toFixed(1)}%)
            </span>
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl space-y-1">
          <span className="text-emerald-400 block text-[11px] font-sans">{isAr ? 'صافي القوة الشرائية المعدلة' : 'Net Inflation-Adjusted Return'}</span>
          <span className="text-emerald-300 font-extrabold text-base">
            {Math.round(netRealPurchasingPowerGain).toLocaleString()} EGP
          </span>
          <span className="text-[10px] text-slate-400 block font-sans">
            {isAr ? 'العائد الحقيقي الفعلي بعد التضخم' : 'Net real wealth gain after erosion'}
          </span>
        </div>
      </div>
    </div>
  );
};
