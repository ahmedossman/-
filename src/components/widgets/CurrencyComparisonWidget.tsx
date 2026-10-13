import React from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, ArrowRightLeft, Percent, ShieldCheck } from 'lucide-react';

export const CurrencyComparisonWidget: React.FC = () => {
  const { marketData, language } = useApp();
  const isAr = language === 'AR';

  const official = marketData.usdEgpOfficial;
  const parallel = marketData.usdEgpParallel;
  const premium = ((parallel - official) / official) * 100;

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              {isAr ? 'مقارنة أسعار الصرف والفجوة الدولارية' : 'FX Rate Matrix & Parallel Gap Monitor'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'مقارنة الدولار الرسمي بالدولار الموازي ودولار الصاغة الضمني' : 'Official CBE vs Cairo Bullion Implied exchange rate gap analysis'}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded font-mono">
          SPREAD: +{premium.toFixed(1)}%
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block font-sans">{isAr ? 'السعر الرسمي (البنك المركزي)' : 'Official CBE Exchange Rate'}</span>
          <span className="text-white font-extrabold text-base">{official.toFixed(2)} EGP</span>
          <span className="text-[10px] text-slate-500 block font-sans">{isAr ? 'مستقر بقرار البنوك' : 'Bank standard rate'}</span>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block font-sans">{isAr ? 'دولار الصاغة الضمني' : 'Bullion Implied Rate'}</span>
          <span className="text-amber-400 font-extrabold text-base">{parallel.toFixed(2)} EGP</span>
          <span className="text-[10px] text-amber-400/80 block font-sans">{isAr ? 'محسوب من أسعار الذهب' : 'Derived from gold price'}</span>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block font-sans">{isAr ? 'فارق العلاوة الصاغة' : 'Parallel Premium Gap'}</span>
          <span className="text-emerald-400 font-extrabold text-base">+{premium.toFixed(2)}%</span>
          <span className="text-[10px] text-slate-500 block font-sans">{isAr ? 'علاوة التحوط ضد التضخم' : 'Devaluation buffer'}</span>
        </div>
      </div>
    </div>
  );
};
