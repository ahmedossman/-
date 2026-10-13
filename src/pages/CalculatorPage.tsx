import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calculator, Coins, TrendingUp, DollarSign } from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  const { marketData, language } = useApp();
  const isAr = language === 'AR';

  const [monthlyDepositEGP, setMonthlyDepositEGP] = useState<number>(5000);
  const [durationYears, setDurationYears] = useState<number>(3);
  const [assumedGoldCagr, setAssumedGoldCagr] = useState<number>(30); // 30% annual EGP growth assumption

  // DCA calculation
  const totalMonths = durationYears * 12;
  const totalInvested = monthlyDepositEGP * totalMonths;

  // Future value formula for monthly deposits
  const monthlyRate = assumedGoldCagr / 100 / 12;
  const futureValueGold = Math.round(
    monthlyDepositEGP * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate))
  );

  // Future value for Bank CD 23.5%
  const cdRateMonthly = 0.235 / 12;
  const futureValueCD = Math.round(
    monthlyDepositEGP * (((Math.pow(1 + cdRateMonthly, totalMonths) - 1) / cdRateMonthly) * (1 + cdRateMonthly))
  );

  const totalGoldGramsAcquired = Math.round((futureValueGold / marketData.gold21kEGP) * 10) / 10;

  return (
    <div className="space-y-6 select-none">
      <div className="bg-gradient-to-r from-amber-500/10 via-[#0D1424] to-slate-900 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <Calculator className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-extrabold text-white">
            {isAr ? 'حاسبة الاستثمار والادخار التراكمي (DCA Engine)' : 'Dollar-Cost Averaging (DCA) & Yield Calculator'}
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {isAr
            ? 'احسب قيمة مدخراتك الشهرية بالذهب مقارنة بالشهادات البنكية والتضخم'
            : 'Simulate monthly systematic savings in gold ingots vs 23.5% bank certificates over time'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              {isAr ? 'الادخار الشهري (EGP)' : 'Monthly Savings Amount (EGP)'}
            </label>
            <input
              type="number"
              step="500"
              value={monthlyDepositEGP}
              onChange={(e) => setMonthlyDepositEGP(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              {isAr ? 'مدة الاستثمار (سنوات)' : 'Investment Horizon (Years)'}
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 3, 5, 10].map((y) => (
                <button
                  key={y}
                  onClick={() => setDurationYears(y)}
                  className={`py-2 rounded-lg font-bold border transition-all cursor-pointer ${
                    durationYears === y
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold'
                      : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  {y} {isAr ? 'سنة' : 'Yr'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              {isAr ? 'نمو الذهب السنوي المتوقع (%)' : 'Assumed Annual Gold CAGR (%)'}
            </label>
            <input
              type="number"
              value={assumedGoldCagr}
              onChange={(e) => setAssumedGoldCagr(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-white text-sm"
            />
          </div>
        </div>

        {/* Outcome Results */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
          {/* Gold DCA Card */}
          <div className="bg-[#0D1424] border border-amber-500/40 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                {isAr ? 'النتيجة بالادخار في الذهب' : 'Gold DCA Outcome'}
              </div>
              <div className="text-3xl font-extrabold text-white my-1">
                {futureValueGold.toLocaleString()} <span className="text-sm font-normal text-slate-400">EGP</span>
              </div>
              <p className="text-xs text-emerald-400 font-sans font-semibold mt-1">
                +{futureValueGold - totalInvested > 0 ? (futureValueGold - totalInvested).toLocaleString() : 0} EGP {isAr ? 'أرباح متوقعة' : 'estimated profit'}
              </p>
            </div>

            <div className="border-t border-slate-800 pt-3 mt-4 text-xs font-sans text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>{isAr ? 'إجمالي المبالغ المدفوعة:' : 'Total Invested:'}</span>
                <span className="font-mono font-bold">{totalInvested.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between">
                <span>{isAr ? 'حصيلة جرامات الذهب 21:' : 'Est. 21K Grams Accumulated:'}</span>
                <span className="font-mono font-bold text-amber-400">{totalGoldGramsAcquired}g</span>
              </div>
            </div>
          </div>

          {/* Bank CD DCA Card */}
          <div className="bg-[#0D1424] border border-slate-700/80 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {isAr ? 'النتيجة بالشهادة البنكية (23.5%)' : 'Bank Certificate (23.5%) Outcome'}
              </div>
              <div className="text-3xl font-extrabold text-slate-200 my-1">
                {futureValueCD.toLocaleString()} <span className="text-sm font-normal text-slate-400">EGP</span>
              </div>
              <p className="text-xs text-slate-400 font-sans font-semibold mt-1">
                +{futureValueCD - totalInvested > 0 ? (futureValueCD - totalInvested).toLocaleString() : 0} EGP {isAr ? 'أرباح الفائدة' : 'interest earned'}
              </p>
            </div>

            <div className="border-t border-slate-800 pt-3 mt-4 text-xs font-sans text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>{isAr ? 'الفارق لصالح الذهب:' : 'Gold Outperformance:'}</span>
                <span className="font-mono font-bold text-amber-400">
                  +{(futureValueGold - futureValueCD).toLocaleString()} EGP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
