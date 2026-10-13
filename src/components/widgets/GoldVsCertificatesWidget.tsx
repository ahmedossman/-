import React from 'react';
import { useApp } from '../../context/AppContext';
import { Landmark, Coins, TrendingUp, AlertCircle } from 'lucide-react';

export const GoldVsCertificatesWidget: React.FC = () => {
  const { marketData, language } = useApp();
  const isAr = language === 'AR';

  const inflation = marketData.headlineInflation; // 28.5%
  const cdYield = marketData.bankCertificate3YrRate; // 23.5%
  const cdRealReturn = cdYield - inflation; // -5.0%

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              {isAr ? 'مقارنة العائد الحقيقي: الذهب مقابل الشهادات البنكية' : 'Real Yield Comparison: Gold Bullion vs Bank CDs'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'مقارنة العائد الفعلي بعد خصم التضخم (28.5%) بين شهادات الـ 23.5% والذهب' : 'Net real return calculation deducting CAPMAS headline inflation from yields'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Bank Certificate Card */}
        <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-300 font-sans">{isAr ? 'شهادات الادخار 3 سنوات' : '3-Year Bank CDs (NBE/Banque Misr)'}</span>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold">REAL RETURN: {cdRealReturn.toFixed(1)}%</span>
          </div>
          <div className="text-xl font-extrabold text-white">{cdYield}% {isAr ? 'عائد اسمي' : 'Nominal Payout'}</div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            {isAr
              ? `العائد الاسمي ${cdYield}% يتأكل أمام التضخم السنوي (${inflation}%) مما ينتج عنه عائد حقيقي بالسالب (-5.0%).`
              : `Nominal yield of ${cdYield}% falls short of headline inflation (${inflation}%), resulting in a negative real return.`}
          </p>
        </div>

        {/* Gold Bullion Card */}
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-300 font-sans">{isAr ? 'السبائك الذهبية (21K Bullion)' : 'Gold Bullion Ingot'}</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">REAL RETURN: +13.5%</span>
          </div>
          <div className="text-xl font-extrabold text-white">+42.0% {isAr ? 'عائد سنوي' : '1-Yr Compound'}</div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            {isAr
              ? `يحقق الذهب عائداً أسمياً يفوق التضخم بكثير، ليمنح المستثمر عائداً حقيقياً موجباً بقدر (+13.5%).`
              : `Gold capital appreciation surpasses headline inflation, yielding a positive net real return (+13.5%).`}
          </p>
        </div>
      </div>
    </div>
  );
};
