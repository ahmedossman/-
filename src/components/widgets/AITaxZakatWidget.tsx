import React from 'react';
import { useApp } from '../../context/AppContext';
import { aiPlatform } from '../../services/aiPlatform';
import { Calculator, Shield, Coins, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';

export const AITaxZakatWidget: React.FC = () => {
  const { holdings, marketData, language } = useApp();
  const isAr = language === 'AR';

  const result = aiPlatform.calculateTaxAndZakat(holdings, marketData);

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">
              {isAr ? 'محرك الزكاة والدرع الضريبي (Tax & Zakat Optimization Engine)' : 'AI Tax & Zakat Optimization Engine'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'حساب نصاب الذهب (85 جرام عيار 24) والدرع الضريبي لشهادات البنوك' : 'Live Zakat Nisab tracking (85g 24K gold) & Bank Certificate tax shield analysis'}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${result.isZakatLiable ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}`}>
          {result.isZakatLiable ? (isAr ? 'مستحق للزكاة' : 'ZAKAT LIABLE') : (isAr ? 'دون النصاب' : 'BELOW NISAB')}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] font-sans block">{isAr ? 'حد النصاب الشرعي (85 جرام عيار 24)' : 'Current Nisab (85g 24K Gold)'}</span>
          <span className="text-amber-400 font-extrabold text-base block">{result.zakatNisabEGP.toLocaleString()} EGP</span>
          <span className="text-[10px] text-slate-500 font-sans block">Based on live 24K Sagha gold quote</span>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] font-sans block">{isAr ? 'إجمالي الزكاة المستحقة' : 'Total Zakat Due (2.5%)'}</span>
          <span className="text-emerald-400 font-extrabold text-base block">{result.totalZakatDueEGP.toLocaleString()} EGP</span>
          <span className="text-[10px] text-emerald-300 font-sans block">or {result.zakatGoldWeightGrams} grams 24K gold</span>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] font-sans block">{isAr ? 'وفر الدرع الضريبي للشهادات' : 'Bank CD Tax Shield Benefit'}</span>
          <span className="text-indigo-400 font-extrabold text-base block">+{result.bankCdTaxShieldBenefitEGP.toLocaleString()} EGP</span>
          <span className="text-[10px] text-indigo-300 font-sans block">0% tax rate vs 10% dividend tax</span>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
        <span className="font-bold text-white block flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>{isAr ? 'التوجيهات الضريبية والشرعية للمحفظة:' : 'Tax & Zakat Execution Guidelines:'}</span>
        </span>
        <div className="space-y-1.5 text-slate-300">
          {(isAr ? result.recommendationsAr : result.recommendations).map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
