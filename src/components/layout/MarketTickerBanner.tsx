import React from 'react';
import { useApp } from '../../context/AppContext';
import { useSocket } from '../../context/SocketContext';
import { TrendingUp, TrendingDown, Clock, Radio, Activity } from 'lucide-react';

export const MarketTickerBanner: React.FC = () => {
  const { marketData, language } = useApp();
  const { isConnected, tickCount, latencyMs } = useSocket();
  const isAr = language === 'AR';

  const tickerItems = [
    { label: isAr ? 'ذهب 21 (الأكثر تداولاً)' : 'Gold 21K (Egypt)', val: `${(marketData?.gold21kEGP ?? 0).toLocaleString()} EGP/g`, change: '+1.15%', up: true },
    { label: isAr ? 'ذهب 24 (سبائك)' : 'Gold 24K (Ingots)', val: `${(marketData?.gold24kEGP ?? 0).toLocaleString()} EGP/g`, change: '+1.20%', up: true },
    { label: isAr ? 'ذهب 18 (مشغولات)' : 'Gold 18K', val: `${(marketData?.gold18kEGP ?? 0).toLocaleString()} EGP/g`, change: '+1.10%', up: true },
    { label: isAr ? 'الجنيه الذهب (8 جرام)' : 'Gold Sovereign (8g)', val: `${(marketData?.goldPoundEGP ?? 0).toLocaleString()} EGP`, change: '+1.15%', up: true },
    { label: isAr ? 'أوقية الذهب عالمياً' : 'Gold Spot Ounce', val: `$${(marketData?.goldOunceUSD ?? 0).toLocaleString()}`, change: '+$14.2', up: true },
    { label: isAr ? 'الدولار رسمي' : 'USD/EGP Official', val: `${marketData.usdEgpOfficial} EGP`, change: '0.00%', up: true },
    { label: isAr ? 'الدولار موازي' : 'USD/EGP Parallel', val: `${marketData.usdEgpParallel} EGP`, change: '+0.25%', up: true },
    { label: isAr ? 'شهادات البنوك (3 سنوات)' : 'Bank CD Rate (3Yr)', val: `${marketData.bankCertificate3YrRate}%`, change: 'Fixed', up: true },
    { label: isAr ? 'التضخم السنوي' : 'CAPMAS Inflation', val: `${marketData.headlineInflation}%`, change: '-0.40%', up: false },
    { label: isAr ? 'الفائدة المركزي' : 'CBE Corridor Rate', val: `${marketData.cbeInterestRate}%`, change: 'Stable', up: true },
    { label: isAr ? 'الفضة 925' : 'Silver 925', val: `${marketData.silver925EGP} EGP/g`, change: '+0.80%', up: true },
  ];

  const isDataDelayed = marketData.isDataDelayed ?? false;
  const isTrulyLive = isConnected && !isDataDelayed;

  return (
    <div className="bg-[#0D1424] border-b border-amber-500/20 py-2 px-4 text-xs overflow-hidden select-none">
      <div className="flex items-center gap-6 animate-pulse-slow overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className={`flex items-center gap-1.5 font-semibold px-2.5 py-0.5 rounded border flex-shrink-0 ${
          isTrulyLive
            ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
            : 'text-amber-300 bg-amber-950/40 border-amber-800/50'
        }`}>
          <Clock className="w-3.5 h-3.5" />
          <span>
            {isTrulyLive
              ? (isAr ? 'سوق الذهب المصري (مباشر)' : 'EGYPT BULLION LIVE')
              : (isAr ? 'سوق الذهب المصري (بيانات متأخرة)' : 'EGYPT BULLION (DELAYED)')}
          </span>
        </div>

        {/* Live WebSocket 1s Stream Badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded border flex-shrink-0 text-[11px] font-bold ${
          isTrulyLive
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        }`}>
          <Radio className={`w-3 h-3 ${isTrulyLive ? 'animate-pulse text-emerald-400' : 'text-amber-400'}`} />
          <span>
            {isTrulyLive
              ? (isAr ? `تحديث لحظي WS (تيك #${tickCount})` : `1s WS Stream (Tick #${tickCount})`)
              : isDataDelayed
                ? (isAr ? 'بيانات متأخرة / وضع الاحتياطي' : 'Data Delayed (Fallback)')
                : (isAr ? 'جاري الاتصال بالسوق...' : 'Connecting WS Stream...')}
          </span>
          {isTrulyLive && (
            <span className="text-[10px] bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800 text-emerald-300 font-mono">
              {latencyMs}ms
            </span>
          )}
        </div>

        {tickerItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 flex-shrink-0 text-slate-300">
            <span className="text-slate-400 font-medium">{item.label}:</span>
            <span className="font-bold text-white font-mono">{item.val}</span>
            <span className={`flex items-center text-[11px] font-semibold ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>
              {item.up ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {item.change}
            </span>
            <span className="text-slate-700">|</span>
          </div>
        ))}
      </div>
    </div>
  );
};

