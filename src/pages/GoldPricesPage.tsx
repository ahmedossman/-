import React from 'react';
import { useApp } from '../context/AppContext';
import { EgyptianMarketSection } from '../components/widgets/EgyptianMarketSection';
import { GlobalMarketSection } from '../components/widgets/GlobalMarketSection';
import { Gold21kVsGlobalSpotWidget } from '../components/widgets/Gold21kVsGlobalSpotWidget';
import { Coins, RefreshCw, ShieldAlert, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export const GoldPricesPage: React.FC = () => {
  const { marketData, refreshMarketFeed, language, marketConnectionStatus } = useApp();
  const isAr = language === 'AR';

  const isDataDelayed = marketData.isDataDelayed ?? false;
  const lastUpdate = marketData.lastSuccessfulUpdate || marketData.updatedAt;

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
    <div className="space-y-8 select-none">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-[#0D1424] to-slate-900 border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-extrabold text-white">
              {isAr ? 'منظومة بيانات الأسواق الموحدة — الصاغة والأسواق العالمية' : 'Unified Market Data Layer — Egyptian & Global Feeds'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'تغطية فورية مباشرة لأسعار الذهب المصري، الأوقية العالمية، الفضة، العملات والمؤشرات الاقتصادية'
              : 'Real-time unified market feed covering Egyptian gold, global spot bullion, FX rates, and benchmark indices'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {marketConnectionStatus === 'CONNECTED' && !isDataDelayed ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'بث مباشر لحظي WS' : 'Live WS Stream'}</span>
            </div>
          ) : isDataDelayed ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-700/60 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'بيانات متأخرة' : 'Data Delayed'}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-700">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" />
              <span>{isAr ? 'جاري الاتصال بالسوق...' : 'Connecting...'}</span>
            </div>
          )}

          <button
            onClick={refreshMarketFeed}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isAr ? 'تحديث الآن' : 'Refresh Now'}</span>
          </button>
        </div>
      </div>

      {/* Section 1 — Egyptian Gold Market */}
      <EgyptianMarketSection />

      {/* Section 2 — Global Market */}
      <GlobalMarketSection />

      {/* Comparison Widget — Egyptian Gold 21K vs Global Gold Spot */}
      <Gold21kVsGlobalSpotWidget />

      {/* Macroeconomic Reference Rates Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-500" />
            <span>{isAr ? 'أسعار الفائدة والتضخم بالبنك المركزي المصري' : 'Egyptian Macroeconomic Reference Indicators'}</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {isAr ? `آخر تحديث: ${formatDate(lastUpdate)}` : `Last Sync: ${formatDate(lastUpdate)}`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">{isAr ? 'سعر الفائدة بالبنك المركزي' : 'CBE Interest Rate Corridor'}</span>
              <span className="text-[10px] text-slate-400">{isAr ? 'سعر الإقراض والإيداع الرسمي' : 'Official CBE Corridor'}</span>
            </div>
            <span className="font-mono font-extrabold text-lg text-indigo-600 dark:text-indigo-400">{marketData.cbeInterestRate}%</span>
          </div>

          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">{isAr ? 'معدل التضخم العام (CAPMAS)' : 'CAPMAS Headline Inflation'}</span>
              <span className="text-[10px] text-slate-400">{isAr ? 'التضخم السنوي العام' : 'Annual Headline Inflation'}</span>
            </div>
            <span className="font-mono font-extrabold text-lg text-rose-600 dark:text-rose-400">{marketData.headlineInflation}%</span>
          </div>

          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">{isAr ? 'عائد الشهادات البنكية (3 سنوات)' : '3-Year Bank CD Yield'}</span>
              <span className="text-[10px] text-slate-400">{isAr ? 'شهادات البنك الأهلي وبنك مصر' : 'NBE & Banque Misr Certificates'}</span>
            </div>
            <span className="font-mono font-extrabold text-lg text-emerald-600 dark:text-emerald-400">{marketData.bankCertificate3YrRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

