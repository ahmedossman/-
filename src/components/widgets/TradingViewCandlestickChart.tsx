import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { Activity, CandlestickChart, Layers, Eye, RefreshCw } from 'lucide-react';

interface OHLCPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema20: number;
  sma50: number;
  rsi: number;
  isGreen: boolean;
}

export const TradingViewCandlestickChart: React.FC = () => {
  const { marketData, language } = useApp();
  const isAr = language === 'AR';

  const [assetSymbol, setAssetSymbol] = useState<'GOLD_21K' | 'GOLD_24K' | 'GOLD_OUNCE_USD'>('GOLD_21K');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [showEMA, setShowEMA] = useState(true);
  const [showRSI, setShowRSI] = useState(false);

  const basePrice =
    assetSymbol === 'GOLD_21K'
      ? marketData.gold21kEGP
      : assetSymbol === 'GOLD_24K'
      ? marketData.gold24kEGP
      : marketData.goldOunceUSD;

  // Generate synthetic OHLC + Volume data for TradingView candlestick display
  const generateCandlesticks = (): OHLCPoint[] => {
    const points: OHLCPoint[] = [];
    const count = timeframe === '1D' ? 12 : timeframe === '1W' ? 14 : timeframe === '1M' ? 20 : 30;
    const now = new Date();

    let curr = basePrice * 0.9;
    let ema = curr;
    let sma = curr;

    for (let i = count; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * (timeframe === '1D' ? 0.1 : timeframe === '1W' ? 0.5 : 1));

      const changePct = (Math.sin(i * 0.7) + (Math.random() - 0.48)) * 0.015;
      const open = curr;
      const close = curr * (1 + changePct);
      const high = Math.max(open, close) * (1 + Math.random() * 0.008);
      const low = Math.min(open, close) * (1 - Math.random() * 0.008);
      const volume = Math.round(1000 + Math.random() * 4000);

      ema = ema * 0.8 + close * 0.2;
      sma = sma * 0.95 + close * 0.05;
      const rsi = Math.round(40 + Math.sin(i) * 25 + Math.random() * 10);

      points.push({
        date: d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' }),
        open: Math.round(open),
        high: Math.round(high),
        low: Math.round(low),
        close: Math.round(close),
        volume,
        ema20: Math.round(ema),
        sma50: Math.round(sma),
        rsi,
        isGreen: close >= open,
      });

      curr = close;
    }

    return points;
  };

  const candleData = generateCandlesticks();
  const latestCandle = candleData[candleData.length - 1] || candleData[0];

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <CandlestickChart className="w-5 h-5 text-amber-400" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">
                {isAr ? 'شمعات اليابانية وحجم التداول (TradingView Pro)' : 'TradingView Pro Candlestick Terminal'}
              </h3>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                {assetSymbol.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isAr ? 'بيانات الحركة السعرية OHLC وأحجام التداول مع مؤشرات EMA & RSI' : 'OHLC price action, volume bars, EMA(20) and RSI technical indicators'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={assetSymbol}
            onChange={(e) => setAssetSymbol(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-amber-400 font-bold text-xs rounded-lg px-2.5 py-1.5 cursor-pointer"
          >
            <option value="GOLD_21K">{isAr ? 'ذهب عيار 21 (جنيه/جرام)' : 'Gold 21K (EGP/g)'}</option>
            <option value="GOLD_24K">{isAr ? 'ذهب عيار 24 (جنيه/جرام)' : 'Gold 24K (EGP/g)'}</option>
            <option value="GOLD_OUNCE_USD">{isAr ? 'أوقية الذهب العالمية ($)' : 'Global Gold Ounce ($)'}</option>
          </select>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                  timeframe === tf ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* OHLC Bar Display */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono text-xs">
        <div>
          <span className="text-slate-500 block text-[10px]">OPEN</span>
          <span className="text-slate-200 font-bold">{latestCandle.open.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">HIGH</span>
          <span className="text-emerald-400 font-bold">{latestCandle.high.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">LOW</span>
          <span className="text-rose-400 font-bold">{latestCandle.low.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">CLOSE</span>
          <span className="text-amber-400 font-bold">{latestCandle.close.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">VOLUME</span>
          <span className="text-indigo-300 font-bold">{latestCandle.volume.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">RSI (14)</span>
          <span className={`font-bold ${latestCandle.rsi > 70 ? 'text-rose-400' : latestCandle.rsi < 30 ? 'text-emerald-400' : 'text-slate-300'}`}>
            {latestCandle.rsi}
          </span>
        </div>
      </div>

      {/* Indicator Toggles */}
      <div className="flex items-center gap-3 text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={showEMA}
            onChange={(e) => setShowEMA(e.target.checked)}
            className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
          />
          <span className="font-semibold">{isAr ? 'متوسط EMA (20)' : 'EMA (20) Overlay'}</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={showRSI}
            onChange={(e) => setShowRSI(e.target.checked)}
            className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
          />
          <span className="font-semibold">{isAr ? 'مؤشر القوة نسبية RSI' : 'RSI Indicator Panel'}</span>
        </label>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={candleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis yAxisId="price" stroke="#64748b" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
            <YAxis yAxisId="volume" orientation="right" stroke="#334155" tick={false} domain={[0, 'dataMax * 3']} />

            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#fff',
              }}
            />

            {/* Volume Bars */}
            <Bar yAxisId="volume" dataKey="volume" name="Volume">
              {candleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isGreen ? '#10b98130' : '#f43f5e30'} />
              ))}
            </Bar>

            {/* Price Trend Line */}
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="close"
              name="Price"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />

            {showEMA && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="ema20"
                name="EMA 20"
                stroke="#8b5cf6"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
