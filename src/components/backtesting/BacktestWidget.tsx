import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, Play, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const BacktestWidget: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'AR';

  const [monthlyContribution, setMonthlyContribution] = useState<number>(10000);
  const [durationYears, setDurationYears] = useState<number>(3);
  const [selectedStrategy, setSelectedStrategy] = useState<'DCA_GOLD' | 'CD_REINVEST' | 'BALANCED_50_50'>('DCA_GOLD');

  // Generate historical simulation data points
  const totalMonths = durationYears * 12;
  const chartData = [];

  let goldDcaValue = 0;
  let cdReinvestValue = 0;
  let balancedValue = 0;
  let totalInvested = 0;

  const monthlyGoldRate = Math.pow(1 + 0.385, 1 / 12) - 1; // 38.5% annual gold CAGR
  const monthlyCdRate = Math.pow(1 + 0.235, 1 / 12) - 1; // 23.5% bank CD yield
  const monthlyInflation = Math.pow(1 + 0.265, 1 / 12) - 1; // 26.5% inflation

  for (let m = 1; m <= totalMonths; m++) {
    totalInvested += monthlyContribution;

    // Strategy 1: Pure Gold 21K DCA
    goldDcaValue = (goldDcaValue + monthlyContribution) * (1 + monthlyGoldRate);

    // Strategy 2: Bank CD Yield Reinvested in Gold 24K
    const cdYieldThisMonth = cdReinvestValue * monthlyCdRate;
    cdReinvestValue = (cdReinvestValue + monthlyContribution + cdYieldThisMonth) * (1 + monthlyGoldRate * 0.4);

    // Strategy 3: 50/50 Balanced Allocation
    balancedValue = (balancedValue + monthlyContribution) * (1 + (monthlyGoldRate * 0.5 + monthlyCdRate * 0.5));

    // Inflation purchasing power benchmark
    const inflationFactor = Math.pow(1 + monthlyInflation, m);
    const goldReal = goldDcaValue / inflationFactor;

    chartData.push({
      month: `M${m}`,
      totalInvested: Math.round(totalInvested),
      goldDca: Math.round(goldDcaValue),
      cdReinvest: Math.round(cdReinvestValue),
      balanced: Math.round(balancedValue),
      inflationBenchmark: Math.round(totalInvested * inflationFactor),
      goldRealValue: Math.round(goldReal),
    });
  }

  const finalGold = chartData[chartData.length - 1]?.goldDca || 0;
  const finalCd = chartData[chartData.length - 1]?.cdReinvest || 0;
  const finalBalanced = chartData[chartData.length - 1]?.balanced || 0;
  const totalCost = totalInvested;

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              {isAr ? 'محاكي واختبار الاستراتيجيات التاريخية (Strategy Backtesting Engine)' : 'Historical Strategy Backtesting & Simulation'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'اختبار الادخار الشهري المنتظم في الذهب مقابل إعادة استثمار أرباح الشهادات' : 'Simulate monthly Gold DCA vs Bank Certificate yield compounding'}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded font-mono">
          CAGR MODEL: +38.5%
        </span>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
        <div>
          <label className="text-slate-400 font-bold block mb-1">
            {isAr ? 'المبلغ الشهري (جنيه):' : 'Monthly Deposit (EGP):'}
          </label>
          <input
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-slate-400 font-bold block mb-1">
            {isAr ? 'مدة الاستثمار:' : 'Backtest Period:'}
          </label>
          <select
            value={durationYears}
            onChange={(e) => setDurationYears(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-amber-500"
          >
            <option value={1}>1 {isAr ? 'سنة (12 شهر)' : 'Year (12 Months)'}</option>
            <option value={3}>3 {isAr ? 'سنوات (36 شهر)' : 'Years (36 Months)'}</option>
            <option value={5}>5 {isAr ? 'سنوات (60 شهر)' : 'Years (60 Months)'}</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 font-bold block mb-1">
            {isAr ? 'الاستراتيجية الرئيسية:' : 'Primary Focus Strategy:'}
          </label>
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-amber-300 font-mono focus:outline-none focus:border-amber-500"
          >
            <option value="DCA_GOLD">{isAr ? 'ادخار ذهب شهري (DCA Gold)' : 'Pure Gold DCA'}</option>
            <option value="CD_REINVEST">{isAr ? 'إعادة استثمار عوائد الشهادات بالذهب' : 'CD Yield Reinvested in Gold'}</option>
            <option value="BALANCED_50_50">{isAr ? 'محفظة متوازنة 50% ذهب / 50% شهادات' : '50/50 Gold & Bank CDs'}</option>
          </select>
        </div>
      </div>

      {/* Outcome Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[11px] font-sans">{isAr ? 'إجمالي المبالغ المستثمرة' : 'Total Capital Invested'}</span>
          <span className="text-white font-extrabold text-base">{totalCost.toLocaleString()} EGP</span>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl">
          <span className="text-amber-400 block text-[11px] font-sans">{isAr ? 'استراتيجية ادخار الذهب' : 'Pure Gold 21K DCA'}</span>
          <span className="text-amber-300 font-extrabold text-base">{finalGold.toLocaleString()} EGP</span>
          <span className="text-[10px] text-emerald-400 block font-sans">
            +{Math.round(((finalGold - totalCost) / totalCost) * 100)}% ROI
          </span>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 p-3.5 rounded-xl">
          <span className="text-purple-300 block text-[11px] font-sans">{isAr ? 'استراتيجية عائد الشهادات' : 'CD Reinvested in Gold'}</span>
          <span className="text-purple-200 font-extrabold text-base">{finalCd.toLocaleString()} EGP</span>
          <span className="text-[10px] text-emerald-400 block font-sans">
            +{Math.round(((finalCd - totalCost) / totalCost) * 100)}% ROI
          </span>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl">
          <span className="text-emerald-400 block text-[11px] font-sans">{isAr ? 'المحفظة المتوازنة 50/50' : 'Balanced 50/50 Strategy'}</span>
          <span className="text-emerald-300 font-extrabold text-base">{finalBalanced.toLocaleString()} EGP</span>
          <span className="text-[10px] text-emerald-400 block font-sans">
            +{Math.round(((finalBalanced - totalCost) / totalCost) * 100)}% ROI
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="goldDcaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cdGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#090D16', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
              formatter={(value: any) => [`${Number(value).toLocaleString()} EGP`, '']}
            />
            <Area type="monotone" dataKey="goldDca" stroke="#f59e0b" fillOpacity={1} fill="url(#goldDcaGrad)" name="Pure Gold DCA" />
            <Area type="monotone" dataKey="cdReinvest" stroke="#a855f7" fillOpacity={1} fill="url(#cdGrad)" name="CD Reinvested" />
            <Area type="monotone" dataKey="totalInvested" stroke="#64748b" strokeDasharray="4 4" fill="none" name="Capital Invested" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
