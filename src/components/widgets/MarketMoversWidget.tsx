import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, TrendingDown, Flame, BarChart2, ArrowUpRight } from 'lucide-react';

export const MarketMoversWidget: React.FC = () => {
  const { marketData, language } = useApp();
  const isAr = language === 'AR';

  const [tab, setTab] = useState<'GAINERS' | 'LOSERS' | 'VOLUME'>('GAINERS');

  const movers = [
    {
      name: isAr ? 'سبائك عيار 24 (ج.م)' : 'Gold 24K Pure Ingot',
      category: 'BULLION',
      price: `${marketData.gold24kEGP.toLocaleString()} EGP`,
      change: '+1.22%',
      isPositive: true,
      volume: '85.4 KG',
    },
    {
      name: isAr ? 'أسهم البورصة EGX 30' : 'EGX 30 Stock Index',
      category: 'INDEX',
      price: `${marketData.egx30Index.toLocaleString()} PTS`,
      change: '+1.85%',
      isPositive: true,
      volume: '420M EGP',
    },
    {
      name: isAr ? 'ذهب عيار 21 صاغة' : 'Gold 21K Bullion',
      category: 'BULLION',
      price: `${marketData.gold21kEGP.toLocaleString()} EGP`,
      change: '+1.15%',
      isPositive: true,
      volume: '142.0 KG',
    },
    {
      name: isAr ? 'بيتكوين / دولار' : 'Bitcoin / USD',
      category: 'CRYPTO',
      price: `$${marketData.bitcoinUSD.toLocaleString()}`,
      change: '+2.40%',
      isPositive: true,
      volume: '$1.2B',
    },
    {
      name: isAr ? 'فضة عيار 925' : 'Silver 925',
      category: 'BULLION',
      price: `${marketData.silver925EGP} EGP`,
      change: '-0.35%',
      isPositive: false,
      volume: '310.0 KG',
    },
  ];

  const displayList =
    tab === 'GAINERS'
      ? movers.filter((m) => m.isPositive)
      : tab === 'LOSERS'
      ? movers.filter((m) => !m.isPositive)
      : movers;

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              {isAr ? 'الأكثر تحركاً بسوق الصاغة والبورصة' : 'Cairo Bullion & Market Movers'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'الأعلى ارتفاعاً وانخفاضاً في الذهب والعملات والبورصة المصرية' : 'Top gainers, decliners and high volume instruments today'}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {(['GAINERS', 'LOSERS', 'VOLUME'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-2 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                tab === t ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 'GAINERS'
                ? isAr
                  ? 'الرابحون'
                  : 'GAINERS'
                : t === 'LOSERS'
                ? isAr
                  ? 'الخاسرون'
                  : 'LOSERS'
                : isAr
                ? 'الحجم'
                : 'VOLUME'}
            </button>
          ))}
        </div>
      </div>

      {/* Movers List */}
      <div className="space-y-2 font-mono text-xs">
        {displayList.map((m, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-slate-700 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  m.isPositive ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
              <div>
                <span className="font-bold text-white block font-sans">{m.name}</span>
                <span className="text-[10px] text-slate-400">VOL: {m.volume}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-bold text-white block">{m.price}</span>
              <span
                className={`text-[11px] font-bold flex items-center justify-end gap-0.5 ${
                  m.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {m.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{m.change}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
