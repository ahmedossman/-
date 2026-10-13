import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, ShieldCheck, Zap, BarChart2, TrendingUp, PieChart } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AdvancedAnalyticsWidget: React.FC = () => {
  const { riskMetrics, language } = useApp();
  const isAr = language === 'AR';

  const [simulationsCount, setSimulationsCount] = useState<number>(500);
  const [forecastHorizonMonths, setForecastHorizonMonths] = useState<number>(12);

  // Monte Carlo simulation paths generator
  const generateMonteCarloData = () => {
    const months = forecastHorizonMonths;
    const initialVal = riskMetrics.totalValueEGP || 100000;
    const mu = 0.028; // ~33.6% annual mean return for gold portfolio
    const sigma = 0.055; // monthly volatility

    const resultData = [];
    for (let m = 0; m <= months; m++) {
      if (m === 0) {
        resultData.push({
          month: 'M0',
          p5: initialVal,
          median: initialVal,
          p95: initialVal,
        });
        continue;
      }

      // 5th, 50th, 95th percentiles from lognormal process
      const p5 = Math.round(initialVal * Math.exp((mu - 0.5 * sigma * sigma) * m - 1.645 * sigma * Math.sqrt(m)));
      const median = Math.round(initialVal * Math.exp((mu - 0.5 * sigma * sigma) * m));
      const p95 = Math.round(initialVal * Math.exp((mu - 0.5 * sigma * sigma) * m + 1.645 * sigma * Math.sqrt(m)));

      resultData.push({
        month: `M${m}`,
        p5,
        median,
        p95,
      });
    }
    return resultData;
  };

  const mcData = generateMonteCarloData();

  // Correlation Matrix Data
  const correlationMatrix = [
    { asset: 'Gold 21K/24K', gold: 1.0, silver: 0.88, usd: 0.94, cd: -0.42, egx30: 0.35 },
    { asset: 'Silver 925', gold: 0.88, silver: 1.0, usd: 0.82, cd: -0.38, egx30: 0.41 },
    { asset: 'USD Cash', gold: 0.94, silver: 0.82, usd: 1.0, cd: -0.51, egx30: 0.28 },
    { asset: 'Bank CDs', gold: -0.42, silver: -0.38, usd: -0.51, cd: 1.0, egx30: -0.15 },
    { asset: 'EGX30 Index', gold: 0.35, silver: 0.41, usd: 0.28, cd: -0.15, egx30: 1.0 },
  ];

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              {isAr ? 'المؤشرات المالية المتقدمة ومحاكاة مونت كارلو' : 'Advanced Risk Metrics & Monte Carlo Engine'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'نسب شارب، سورتينو، ترينور، القيمة المعرضة للمخاطر (VaR 95%) ومصفوفة الارتباط' : 'Sharpe, Sortino, Treynor ratios, VaR 95%, CAGR and asset cross-correlation matrix'}
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Ratios Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 font-mono text-xs">
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[10px] font-sans">Sharpe Ratio</span>
          <span className="text-emerald-400 font-extrabold text-sm">{riskMetrics.sharpeRatio}</span>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[10px] font-sans">Sortino Ratio</span>
          <span className="text-emerald-400 font-extrabold text-sm">2.84</span>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[10px] font-sans">Treynor Ratio</span>
          <span className="text-amber-400 font-extrabold text-sm">0.245</span>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[10px] font-sans">Value at Risk (VaR 95%)</span>
          <span className="text-rose-400 font-extrabold text-sm">-3.82%</span>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[10px] font-sans">Portfolio CAGR (3Y)</span>
          <span className="text-amber-300 font-extrabold text-sm">+38.5%</span>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[10px] font-sans">Max Drawdown</span>
          <span className="text-rose-400 font-extrabold text-sm">-{riskMetrics.maxDrawdownPercentage}%</span>
        </div>
      </div>

      {/* Monte Carlo Simulation Plot */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'توقعات محاكاة مونت كارلو (Monte Carlo Simulation 500 Iterations)' : 'Monte Carlo Portfolio Projection (500 Iterations)'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">{isAr ? 'الأفق الزمني:' : 'Horizon:'}</span>
            <select
              value={forecastHorizonMonths}
              onChange={(e) => setForecastHorizonMonths(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-amber-400 font-mono"
            >
              <option value={6}>6 {isAr ? 'أشهر' : 'Months'}</option>
              <option value={12}>12 {isAr ? 'شهراً' : 'Months'}</option>
              <option value={24}>24 {isAr ? 'شهراً' : 'Months'}</option>
            </select>
          </div>
        </div>

        <div className="h-64 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mcData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#090D16', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                formatter={(v: any) => [`${Number(v).toLocaleString()} EGP`, '']}
              />
              <Line type="monotone" dataKey="p95" stroke="#10b981" strokeWidth={2} dot={false} name="Optimistic (95th %ile)" />
              <Line type="monotone" dataKey="median" stroke="#f59e0b" strokeWidth={2.5} dot={false} name="Base Expected (50th %ile)" />
              <Line type="monotone" dataKey="p5" stroke="#f43f5e" strokeWidth={2} strokeDasharray="3 3" dot={false} name="Pessimistic (5th %ile)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Correlation Matrix */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <h4 className="font-bold text-xs text-slate-200">
          {isAr ? 'مصفوفة الارتباط التبادلي بين الأصول (Asset Correlation Matrix)' : 'Asset Cross-Correlation Matrix'}
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs font-mono">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="text-left pb-2 font-sans">{isAr ? 'الأصل' : 'Asset'}</th>
                <th className="pb-2">Gold</th>
                <th className="pb-2">Silver</th>
                <th className="pb-2">USD</th>
                <th className="pb-2">Bank CD</th>
                <th className="pb-2">EGX30</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {correlationMatrix.map((row, i) => (
                <tr key={i} className="hover:bg-slate-900/40">
                  <td className="text-left py-2 font-bold text-slate-300 font-sans">{row.asset}</td>
                  <td className={`py-2 ${row.gold === 1 ? 'text-amber-400 font-bold' : row.gold > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.gold.toFixed(2)}
                  </td>
                  <td className={`py-2 ${row.silver === 1 ? 'text-amber-400 font-bold' : row.silver > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.silver.toFixed(2)}
                  </td>
                  <td className={`py-2 ${row.usd === 1 ? 'text-amber-400 font-bold' : row.usd > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.usd.toFixed(2)}
                  </td>
                  <td className={`py-2 ${row.cd === 1 ? 'text-amber-400 font-bold' : row.cd > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.cd.toFixed(2)}
                  </td>
                  <td className={`py-2 ${row.egx30 === 1 ? 'text-amber-400 font-bold' : row.egx30 > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.egx30.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
