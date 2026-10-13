import React from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_GOLD_PRICE_FEED } from '../../services/goldService';
import { Scale, ArrowUpRight, ArrowDownRight, Activity, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const Gold21kVsGlobalSpotWidget: React.FC = () => {
  const { marketData, language } = useApp();
  const isAr = language === 'AR';

  const comp = marketData.comparison21kVsSpot || INITIAL_GOLD_PRICE_FEED.comparison21kVsSpot!;
  const isDataDelayed = marketData.isDataDelayed ?? false;
  const lastUpdate = marketData.lastSuccessfulUpdate || marketData.updatedAt;

  const isPremium = comp.premiumDiscountEGP >= 0;

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
    <div id="gold-21k-vs-spot-comparison-widget" className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 rounded-2xl p-6 border border-amber-500/30 shadow-xl relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-700/60 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Scale className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-100">
              {isAr ? 'مقارنة الذهب المصري عيار 21 بالسعر العالمي (Spot XAU)' : 'Egyptian Gold 21K vs. Global Gold Spot (XAU)'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isAr ? 'تحليل العلاقة السعرية والفرق بين الصاغة المصرية والقيمة العادلة للأوقية العالمية' : 'Arbitrage & premium analysis between local Sagha 21K and international spot parity'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isDataDelayed && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-900/60 text-amber-300 border border-amber-700/60 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isAr ? 'بيانات متأخرة' : 'Data Delayed'}</span>
            </span>
          )}

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? `تحديث: ${formatDate(lastUpdate)}` : `Updated: ${formatDate(lastUpdate)}`}</span>
          </div>
        </div>
      </div>

      {/* Primary Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 relative z-10">
        {/* Card 1: Local 21K Price */}
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 backdrop-blur-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            {isAr ? 'الذهب المصري عيار 21' : 'Egyptian Gold 21K'}
          </div>
          <div className="text-2xl font-black text-amber-400">
            {comp.local21kEGP.toLocaleString('en-US')} <span className="text-xs text-slate-400 font-normal">EGP/g</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>{isAr ? 'سعر الصاغة المحلية' : 'Sagha Local Market'}</span>
            <span className="text-amber-300/80 font-mono">🇪🇬 EGP</span>
          </div>
        </div>

        {/* Card 2: International Fair Parity */}
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 backdrop-blur-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            {isAr ? 'القيمة العادلة عالمياً (21K)' : 'Global Spot Parity (21K)'}
          </div>
          <div className="text-2xl font-black text-slate-100">
            {comp.parity21kEGP.toLocaleString('en-US')} <span className="text-xs text-slate-400 font-normal">EGP/g</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>{isAr ? `بسعر صرف ${comp.usdEgpRate} ج.م` : `@ ${comp.usdEgpRate} EGP/USD`}</span>
            <span className="text-blue-400 font-mono">🌐 XAU</span>
          </div>
        </div>

        {/* Card 3: Premium / Discount */}
        <div className={`rounded-xl p-4 border backdrop-blur-sm ${isPremium ? 'bg-amber-950/40 border-amber-500/40' : 'bg-emerald-950/40 border-emerald-500/40'}`}>
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>{isAr ? 'علاوة / خصم السوق' : 'Premium / Discount'}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isPremium ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
              {isPremium ? (isAr ? 'علاوة محلية' : 'PREMIUM') : (isAr ? 'خصم محلي' : 'DISCOUNT')}
            </span>
          </div>
          <div className={`text-2xl font-black flex items-center gap-1 ${isPremium ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isPremium ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
            <span>{isPremium ? `+${comp.premiumDiscountEGP}` : comp.premiumDiscountEGP}</span>
            <span className="text-xs font-normal text-slate-300">EGP</span>
          </div>
          <div className="text-xs font-semibold mt-2 text-slate-300">
            {isAr ? `فرق نسبة: ${isPremium ? '+' : ''}${comp.premiumDiscountPercent}%` : `Difference: ${isPremium ? '+' : ''}${comp.premiumDiscountPercent}%`}
          </div>
        </div>

        {/* Card 4: 30-Day Correlation Factor */}
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 backdrop-blur-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>{isAr ? 'معامل الارتباط (30 يوم)' : '30D Correlation'}</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {(comp.correlation30d * 100).toFixed(0)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>{isAr ? 'ارتباط وثيق للغاية' : 'High Positive Coupling'}</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3 h-3" /> {comp.correlation30d}
            </span>
          </div>
        </div>
      </div>

      {/* Historical Comparison Trend Points Table */}
      <div className="mt-6 pt-5 border-t border-slate-700/60 relative z-10">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          {isAr ? 'التتبع التاريخي للفرق السعري (30 يوماً الأخيرة)' : 'Historical Parity Comparison (30 Days)'}
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-700/80 text-slate-400 uppercase text-[10px]">
                <th className="py-2 px-3">{isAr ? 'التاريخ' : 'Date'}</th>
                <th className="py-2 px-3">{isAr ? 'عيار 21 محلي (EGP)' : 'Local 21K (EGP)'}</th>
                <th className="py-2 px-3">{isAr ? 'المكافئ العالمي (EGP)' : 'Global Spot Equiv (EGP)'}</th>
                <th className="py-2 px-3 text-right">{isAr ? 'نسبة العلاوة (%)' : 'Premium %'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {comp.historicalComparison.map((pt, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-400">{pt.date}</td>
                  <td className="py-2.5 px-3 font-bold text-amber-400">{pt.local21kEGP.toLocaleString('en-US')} EGP</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{pt.globalSpotEGP.toLocaleString('en-US')} EGP</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400">+{pt.premiumPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
