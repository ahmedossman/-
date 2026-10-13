import React from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_GOLD_PRICE_FEED } from '../../services/goldService';
import { TrendingUp, TrendingDown, Clock, Globe, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const GlobalMarketSection: React.FC = () => {
  const { marketData, language } = useApp();
  const isAr = language === 'AR';

  const globalFeed = marketData.globalMarket || INITIAL_GOLD_PRICE_FEED.globalMarket!;
  const isDataDelayed = marketData.isDataDelayed ?? false;
  const lastUpdate = marketData.lastSuccessfulUpdate || marketData.updatedAt;

  const assets = [
    globalFeed.xauUsd,
    globalFeed.xagUsd,
    globalFeed.usdEgp,
    globalFeed.bitcoin,
    globalFeed.egx30,
  ].filter(Boolean);

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div id="global-market-section" className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {isAr ? 'القسم الثاني — الأسواق العالمية والمؤشرات' : 'Section 2 — Global Market & Indices'}
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50">
              <Globe className="w-3 h-3 mr-1 inline" /> Global
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAr ? 'أسعار أونصة الذهب، الفضة، الدولار، البيتكوين، ومؤشر EGX30' : 'Live spot rates for Gold, Silver, USD/EGP, Bitcoin, and EGX30'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isDataDelayed ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>{isAr ? 'بيانات متأخرة' : 'Data Delayed'}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isAr ? 'مباشر' : 'Live Feed'}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-3 py-1 rounded-full border border-slate-200/60 dark:border-slate-700/50">
            <Clock className="w-3.5 h-3.5" />
            <span>{isAr ? `تحديث: ${formatDate(lastUpdate)}` : `Updated: ${formatDate(lastUpdate)}`}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
        {assets.map((asset) => {
          const isPos = asset.dailyChange >= 0;
          return (
            <div
              key={asset.id}
              id={`global-asset-${asset.id}`}
              className="bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all rounded-xl p-4 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{isAr ? asset.nameAr : asset.name}</span>
                  <span className="font-mono text-[10px] font-semibold text-slate-400 dark:text-slate-500">{asset.symbol}</span>
                </div>

                <div className="mt-2 flex items-baseline justify-between gap-1">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    {asset.livePrice.toLocaleString('en-US', { minimumFractionDigits: asset.livePrice < 100 ? 2 : 0 })}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {asset.unit}
                  </span>
                </div>

                <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{isPos ? `+${asset.dailyChange}` : asset.dailyChange}</span>
                  <span>({isPos ? `+${asset.dailyChangePercent}%` : `${asset.dailyChangePercent}%`})</span>
                </div>
              </div>

              {/* Detailed Metrics Grid: High, Low, Open, Previous Close */}
              <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>{isAr ? 'الأعلى:' : 'High:'}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{asset.high.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>{isAr ? 'الأدنى:' : 'Low:'}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{asset.low.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>{isAr ? 'الافتتاح:' : 'Open:'}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{asset.open.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>{isAr ? 'الإغلاق:' : 'Prev:'}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{asset.previousClose.toLocaleString('en-US')}</span>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-right text-slate-400 dark:text-slate-500 pt-1">
                {isAr ? `تحديث ${formatDate(asset.lastUpdate)}` : `Updated ${formatDate(asset.lastUpdate)}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
