import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { TrendingUp, ArrowUpRight, DollarSign, Calendar, ShieldCheck } from 'lucide-react';

export const PortfolioPerformanceChart: React.FC = () => {
  const { riskMetrics, language } = useApp();
  const isAr = language === 'AR';

  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');

  // Simulated performance history relative to portfolio baseline
  const generatePortfolioHistory = () => {
    const baseValue = riskMetrics.totalCostEGP || 400000;
    const currValue = riskMetrics.totalValueEGP || 485000;
    const diff = currValue - baseValue;

    const pointsCount = timeframe === '1M' ? 10 : timeframe === '3M' ? 15 : timeframe === '6M' ? 20 : 25;
    const points = [];
    const now = new Date();

    for (let i = pointsCount; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * (timeframe === '1M' ? 3 : timeframe === '3M' ? 6 : 15));

      const ratio = (pointsCount - i) / pointsCount;
      // Add slight market volatility curve
      const noise = Math.sin(i * 0.8) * (baseValue * 0.02);
      const val = Math.round(baseValue + diff * Math.pow(ratio, 1.2) + noise);
      const cost = Math.round(baseValue + (i < pointsCount / 2 ? 0 : 20000));
      const goldBenchmark = Math.round(baseValue * (1 + ratio * 0.22));

      points.push({
        date: d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' }),
        PortfolioValue: val,
        CostBasis: cost,
        GoldBenchmark: goldBenchmark,
      });
    }

    return points;
  };

  const chartData = generatePortfolioHistory();

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">
              {isAr ? 'منحنى أداء المحفظة الاستثمارية' : 'Portfolio Equity & Performance Curve'}
            </h3>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
              +{riskMetrics.roiPercentage}% TOTAL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr
              ? 'تتبع القيمة السوقية الإجمالية للمحفظة مقارنة بالتكلفة ومعيار الذهب الصافي'
              : 'Real-time equity growth vs total cost basis and Egyptian 21K Bullion index'}
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Mini Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800 font-mono">
        <div>
          <span className="text-slate-400 block text-[11px]">{isAr ? 'القيمة الحالية' : 'Current Value'}</span>
          <span className="text-white font-bold text-sm">{riskMetrics.totalValueEGP.toLocaleString()} EGP</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">{isAr ? 'صافي الأرباح' : 'Net Profit'}</span>
          <span className="text-emerald-400 font-bold text-sm">+{riskMetrics.totalProfitEGP.toLocaleString()} EGP</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">{isAr ? 'العائد السنوي CAGR' : 'CAGR Yield'}</span>
          <span className="text-amber-400 font-bold text-sm">{riskMetrics.cagrPercentage}%</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">{isAr ? 'نسبة الشارب Sharpe' : 'Sharpe Ratio'}</span>
          <span className="text-indigo-400 font-bold text-sm">{riskMetrics.sharpeRatio}</span>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(val: any) => [`${Number(val).toLocaleString()} EGP`, '']}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Area
              type="monotone"
              dataKey="PortfolioValue"
              name={isAr ? 'قيمة المحفظة (EGP)' : 'Portfolio Value (EGP)'}
              stroke="#f59e0b"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#portGrad)"
            />
            <Area
              type="monotone"
              dataKey="CostBasis"
              name={isAr ? 'تكلفة الأساس (EGP)' : 'Cost Basis (EGP)'}
              stroke="#64748b"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#costGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
