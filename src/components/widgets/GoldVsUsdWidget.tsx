import React from 'react';
import { useApp } from '../../context/AppContext';
import { Coins, DollarSign, ArrowRightLeft, Scale } from 'lucide-react';

export const GoldVsUsdWidget: React.FC = () => {
  const { marketData, language } = useApp();
  const isAr = language === 'AR';

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              {isAr ? 'مقارنة القوة الشرائية: الذهب مقابل الدولار النقدي' : 'Gold Bullion vs USD Cash Purchasing Power'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'تحليل الأداء الفعلي بين حيازة الذهب وعملة الدولار بالجنيه' : 'Comparative total return matrix between local bullion holding and physical USD cash'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 font-sans">{isAr ? 'الذهب عيار 21 (Gold Bullion)' : 'Gold 21K Bullion'}</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">1-YR YIELD: +42%</span>
          </div>
          <div className="text-xl font-extrabold text-white">{marketData.gold21kEGP.toLocaleString()} EGP/g</div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            {isAr
              ? 'يوفر حماية مزدوجة: الاستفادة من صعود الذهب العالمي ($3,000) بالإضافة إلى انخفاض الجنيه المحلي.'
              : 'Offers dual upside protection: global gold spot appreciation ($3,000/oz) plus local EGP currency adjustment.'}
          </p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-400 font-sans">{isAr ? 'الدولار النقدي (USD Cash)' : 'USD Foreign Cash'}</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">1-YR YIELD: +28%</span>
          </div>
          <div className="text-xl font-extrabold text-white">{marketData.usdEgpParallel.toFixed(2)} EGP</div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            {isAr
              ? 'يوفر حماية ضد انخفاض الجنيه المحلي فقط دون عائد إضافي ناتج عن الأوقية العالمية.'
              : 'Protects solely against local EGP devaluation without participating in global gold spot rally.'}
          </p>
        </div>
      </div>
    </div>
  );
};
