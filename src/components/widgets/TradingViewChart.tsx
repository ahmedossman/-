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
import { generateHistoricalPrices } from '../../services/goldService';
import { useApp } from '../../context/AppContext';
import { Maximize2, RefreshCw } from 'lucide-react';

export const TradingViewChart: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'AR';

  const [timeframe, setTimeframe] = useState<'1W' | '1M' | '6M' | '1Y' | '5Y'>('1M');
  const [activeSeries, setActiveSeries] = useState<{ [key: string]: boolean }>({
    gold21kEGP: true,
    gold24kEGP: false,
    usdEgpRate: false,
  });

  const data = generateHistoricalPrices(timeframe);

  const toggleSeries = (key: string) => {
    setActiveSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4 sm:p-5 select-none">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm sm:text-base text-white">
              {isAr ? 'مخطط أسعار الذهب والدولار التفاعلي (TradingView Style)' : 'Egyptian Bullion & Exchange Chart'}
            </h3>
            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
              EGP / GRAM
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr ? 'تحليل مسار عيار 21 و 24 وسعر الصرف مقابل الجنيه' : 'Historical trajectory for 21K, 24K Gold and USD/EGP rate'}
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          {(['1W', '1M', '6M', '1Y', '5Y'] as const).map((tf) => (
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

      {/* Series Toggle Chips */}
      <div className="flex items-center gap-2 mb-4 flex-wrap text-xs">
        <button
          onClick={() => toggleSeries('gold21kEGP')}
          className={`px-3 py-1 rounded-full font-semibold border transition-all cursor-pointer ${
            activeSeries.gold21kEGP
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
              : 'bg-slate-900 text-slate-500 border-slate-800 opacity-60'
          }`}
        >
          ● {isAr ? 'عيار 21 (ج.م)' : 'Gold 21K (EGP)'}
        </button>

        <button
          onClick={() => toggleSeries('gold24kEGP')}
          className={`px-3 py-1 rounded-full font-semibold border transition-all cursor-pointer ${
            activeSeries.gold24kEGP
              ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50'
              : 'bg-slate-900 text-slate-500 border-slate-800 opacity-60'
          }`}
        >
          ● {isAr ? 'عيار 24 (ج.م)' : 'Gold 24K (EGP)'}
        </button>

        <button
          onClick={() => toggleSeries('usdEgpRate')}
          className={`px-3 py-1 rounded-full font-semibold border transition-all cursor-pointer ${
            activeSeries.usdEgpRate
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              : 'bg-slate-900 text-slate-500 border-slate-800 opacity-60'
          }`}
        >
          ● {isAr ? 'سعر الدولار (EGP)' : 'USD/EGP Rate'}
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gold21kGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="gold24kGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#eab308" stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="usdGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
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

            {activeSeries.gold21kEGP && (
              <Area
                type="monotone"
                dataKey="gold21kEGP"
                name={isAr ? 'عيار 21' : 'Gold 21K'}
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gold21kGrad)"
              />
            )}

            {activeSeries.gold24kEGP && (
              <Area
                type="monotone"
                dataKey="gold24kEGP"
                name={isAr ? 'عيار 24' : 'Gold 24K'}
                stroke="#eab308"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gold24kGrad)"
              />
            )}

            {activeSeries.usdEgpRate && (
              <Area
                type="monotone"
                dataKey="usdEgpRate"
                name={isAr ? 'سعر الدولار' : 'USD/EGP'}
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#usdGrad)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
