import React from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_GOLD_PRICE_FEED } from '../../services/goldService';
import { TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const EgyptianMarketSection: React.FC = () => {
  const { marketData, language } = useApp();
  const isAr = language === 'AR';

  const egyptFeed = marketData.egyptianMarket || INITIAL_GOLD_PRICE_FEED.egyptianMarket!;
  const isDataDelayed = marketData.isDataDelayed ?? false;
  const lastUpdate = marketData.lastSuccessfulUpdate || marketData.updatedAt;

  const assets = [
    egyptFeed.gold24k,
    egyptFeed.gold21k,
    egyptFeed.gold18k,
    egyptFeed.goldPound,
    egyptFeed.goldOunceEgp,
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
    <div id="egyptian-gold-market-section" className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {isAr ? 'القسم الأول — سوق الذهب المصري (الصاغة)' : 'Section 1 — Egyptian Gold Market'}
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50">
              🇪🇬 EGP
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAr ? 'أسعار الصاغة والسبائك المحلية المدموغة وفقاً للتحديثات المباشرة' : 'Official Sagha market rates, stamped bullion ingots & coins'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isDataDelayed ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>{isAr ? 'بيانات متأخرة (مؤقتة)' : 'Data Delayed'}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isAr ? 'مباشر 30 ثانية' : 'Live Feed'}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-3 py-1 rounded-full border border-slate-200/60 dark:border-slate-700/50">
            <Clock className="w-3.5 h-3.5" />
            <span>{isAr ? `تحديث: ${formatDate(lastUpdate)}` : `Updated: ${formatDate(lastUpdate)}`}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
        {assets.map((asset) => {
          const isPos = asset.dailyChange >= 0;
          return (
            <div
              key={asset.id}
              id={`egypt-asset-${asset.id}`}
              className="bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all rounded-xl p-4 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>{isAr ? asset.nameAr : asset.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                    {asset.marketStatus}
                  </span>
                </div>

                <div className="mt-2 flex items-baseline justify-between gap-1">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    {asset.currentPrice.toLocaleString('en-US')}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {asset.unit}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-700/40 flex items-center justify-between text-xs">
                <div className={`flex items-center gap-1 font-semibold ${isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{isPos ? `+${asset.dailyChange.toLocaleString('en-US')}` : asset.dailyChange.toLocaleString('en-US')}</span>
                  <span>({isPos ? `+${asset.dailyChangePercent}%` : `${asset.dailyChangePercent}%`})</span>
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">
                  {formatDate(asset.lastUpdate)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
