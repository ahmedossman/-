import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, TrendingUp, BarChart, ArrowUpRight } from 'lucide-react';
import { generateHistoricalPrices } from '../../services/goldService';

export const GoldHistoricalWidget: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'AR';

  const [timeframe, setTimeframe] = useState<'1M' | '6M' | '1Y' | '5Y'>('1Y');

  const history = generateHistoricalPrices(timeframe);

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              {isAr ? 'التحليل التاريخي للذهب وسعر الصرف' : 'Bullion Historical Trend & Performance Table'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'سجل تحركات أسعار الذهب عبر الزمن مع نسب التغير ومعدل التضخم' : 'Multi-period historical dataset for 21K, 24K, USD Spot and CAPMAS inflation'}
            </p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          {(['1M', '6M', '1Y', '5Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                timeframe === tf ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Historical Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800 font-semibold">
              <th className="pb-2.5">{isAr ? 'التاريخ' : 'Date'}</th>
              <th className="pb-2.5 text-right">{isAr ? 'عيار 21 (EGP)' : 'Gold 21K (EGP)'}</th>
              <th className="pb-2.5 text-right">{isAr ? 'عيار 24 (EGP)' : 'Gold 24K (EGP)'}</th>
              <th className="pb-2.5 text-right">{isAr ? 'الدولار (EGP)' : 'USD/EGP'}</th>
              <th className="pb-2.5 text-right">{isAr ? 'الأوقية ($)' : 'Global Spot ($)'}</th>
              <th className="pb-2.5 text-right">{isAr ? 'التضخم (%)' : 'Inflation (%)'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {history.slice(-8).map((hp, idx) => (
              <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                <td className="py-2.5 font-bold text-slate-200 font-sans">{hp.date}</td>
                <td className="py-2.5 text-right font-bold text-amber-400">
                  {hp.gold21kEGP.toLocaleString()} EGP
                </td>
                <td className="py-2.5 text-right text-slate-300">
                  {hp.gold24kEGP.toLocaleString()} EGP
                </td>
                <td className="py-2.5 text-right text-emerald-400">
                  {hp.usdEgpRate.toFixed(1)} EGP
                </td>
                <td className="py-2.5 text-right text-indigo-300">
                  ${hp.goldOunceUSD.toLocaleString()}
                </td>
                <td className="py-2.5 text-right text-rose-400">
                  {hp.inflationRate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
