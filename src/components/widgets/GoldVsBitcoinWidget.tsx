import React from 'react';
import { useApp } from '../../context/AppContext';
import { Coins, Activity, ShieldCheck, Flame } from 'lucide-react';

export const GoldVsBitcoinWidget: React.FC = () => {
  const { marketData, language } = useApp();
  const isAr = language === 'AR';

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              {isAr ? 'الذهب الفيزيائي مقابل البيتكوين الرقمي' : 'Physical Gold Bullion vs Digital Bitcoin'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'تحليل مقارن للعائد ومستوى الملاذ الآمن والتقلّبات السعرية' : 'Store-of-value characteristics, volatility comparison and return profile'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Physical Gold */}
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-300 font-sans">{isAr ? 'الذهب الفيزيائي (Physical Gold)' : 'Physical Gold Bullion'}</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">VOLATILITY: 12% LOW</span>
          </div>
          <div className="text-xl font-extrabold text-white">${marketData.goldOunceUSD.toLocaleString()} / oz</div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            {isAr
              ? 'ملاذ آمن تاريخي بدون أخطار إفلاس طرف ثانٍ، أداء هادئ ومستقر أثناء الأزمات الإقليمية والتضخم.'
              : 'Historic safe haven with zero counterparty risk; low volatility and strong inflation preservation.'}
          </p>
        </div>

        {/* Bitcoin */}
        <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-orange-300 font-sans">{isAr ? 'البيتكوين (Digital Gold BTC)' : 'Bitcoin (BTC)'}</span>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold">VOLATILITY: 48% HIGH</span>
          </div>
          <div className="text-xl font-extrabold text-white">${marketData.bitcoinUSD.toLocaleString()}</div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            {isAr
              ? 'أصل رقمي عالي العائد مع تقلبات سعرية حادة؛ مناسب للنمو والمخاطرة العالية بجانب الذهب.'
              : 'High beta digital commodity; offers asymmetric capital upside with elevated market volatility.'}
          </p>
        </div>
      </div>
    </div>
  );
};
