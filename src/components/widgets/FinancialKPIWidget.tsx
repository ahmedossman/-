import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, TrendingUp, Coins, DollarSign, Percent, ArrowUpRight } from 'lucide-react';

export const FinancialKPIWidget: React.FC = () => {
  const { riskMetrics, marketData, language } = useApp();
  const isAr = language === 'AR';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Portfolio */}
      <div className="bg-[#0D1424] border border-amber-500/30 rounded-xl p-4 space-y-2 select-none relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-semibold">{isAr ? 'إجمالي قيمة المحفظة' : 'Total Portfolio Value'}</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-white font-mono">
            {(riskMetrics?.totalValueEGP ?? 0).toLocaleString()} EGP
          </span>
          <span className="text-xs font-bold text-emerald-400 font-mono">+{riskMetrics?.roiPercentage ?? 0}%</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          {isAr ? 'أساس التكلفة:' : 'Cost Basis:'} {(riskMetrics?.totalCostEGP ?? 0).toLocaleString()} EGP
        </div>
      </div>

      {/* Card 2: Net Profit */}
      <div className="bg-[#0D1424] border border-emerald-500/30 rounded-xl p-4 space-y-2 select-none">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-semibold">{isAr ? 'صافي أرباح المحفظة' : 'Unrealized Net Profit'}</span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-emerald-400 font-mono">
            +{(riskMetrics?.totalProfitEGP ?? 0).toLocaleString()} EGP
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          {isAr ? 'العائد المركب CAGR:' : 'CAGR Yield:'} {riskMetrics?.cagrPercentage ?? 0}%
        </div>
      </div>

      {/* Card 3: Gold 21K Price */}
      <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4 space-y-2 select-none">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-semibold">{isAr ? 'جرام 21 بسوق الصاغة' : 'Gold 21K Bullion Rate'}</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-white font-mono">
            {(marketData?.gold21kEGP ?? 0).toLocaleString()} EGP
          </span>
          <span className="text-xs font-bold text-emerald-400 font-mono">+1.15%</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          {isAr ? 'الأوقية العالمية:' : 'Global Spot:'} ${marketData.goldOunceUSD.toLocaleString()}
        </div>
      </div>

      {/* Card 4: USD Implied Exchange Rate */}
      <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4 space-y-2 select-none">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-semibold">{isAr ? 'دولار الصاغة الضمني' : 'Bullion Implied USD'}</span>
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-indigo-300 font-mono">
            {marketData.usdEgpParallel.toFixed(2)} EGP
          </span>
          <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">
            PARALLEL
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          {isAr ? 'البنك المركزي:' : 'Official CBE:'} {marketData.usdEgpOfficial} EGP
        </div>
      </div>
    </div>
  );
};
