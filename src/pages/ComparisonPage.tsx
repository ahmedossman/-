import React from 'react';
import { useApp } from '../context/AppContext';
import { Gold21kVsGlobalSpotWidget } from '../components/widgets/Gold21kVsGlobalSpotWidget';
import { CurrencyComparisonWidget } from '../components/widgets/CurrencyComparisonWidget';
import { GoldVsUsdWidget } from '../components/widgets/GoldVsUsdWidget';
import { GoldVsCertificatesWidget } from '../components/widgets/GoldVsCertificatesWidget';
import { GoldVsBitcoinWidget } from '../components/widgets/GoldVsBitcoinWidget';
import { GitCompare } from 'lucide-react';

export const ComparisonPage: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'AR';

  const items = [
    {
      name: isAr ? 'الذهب (سبائك وعيار 21)' : 'Gold Bullion & 21K',
      yield1y: '+38.5%',
      yield3y: '+142.0%',
      liquidity: isAr ? 'سيولة فورية (عالية جداً)' : 'Immediate (Very High)',
      inflationHedge: isAr ? 'تحوط ممتاز ضد التضخم' : 'Excellent Devaluation Hedge',
      risk: isAr ? 'منخفض / متوسط' : 'Low / Moderate',
      rank: 1,
    },
    {
      name: isAr ? 'شهادات البنوك الحكومية (23.5%)' : 'Bank Certificates (23.5%)',
      yield1y: '+23.5%',
      yield3y: '+70.5%',
      liquidity: isAr ? 'مقيدة لمدة 3 سنوات' : 'Locked (3 Years)',
      inflationHedge: isAr ? 'سالب مع تضخم 28.5%' : 'Negative Real Return vs 28.5% Inflation',
      risk: isAr ? 'صفر (مضمونة)' : 'Zero Default Risk',
      rank: 3,
    },
    {
      name: isAr ? 'الدولار الأمريكي كاش' : 'USD Cash Reserves',
      yield1y: '+18.2%',
      yield3y: '+62.0%',
      liquidity: isAr ? 'عالية جداً' : 'Very High',
      inflationHedge: isAr ? 'تحوط متوسط ضد الجنيه' : 'Currency Devaluation Proxy',
      risk: isAr ? 'منخفض' : 'Low',
      rank: 4,
    },
    {
      name: isAr ? 'مؤشر الأسهم المصرية EGX30' : 'EGX 30 Stocks',
      yield1y: '+28.0%',
      yield3y: '+110.0%',
      liquidity: isAr ? 'عالية (جلسات التداول)' : 'High (Market Hours)',
      inflationHedge: isAr ? 'جيد جداً للشركات المصدّرة' : 'Good for Exporting Firms',
      risk: isAr ? 'مرتفع' : 'High Volatility',
      rank: 2,
    },
    {
      name: isAr ? 'العقارات والشهادات العقارية' : 'Egyptian Real Estate',
      yield1y: '+32.0%',
      yield3y: '+125.0%',
      liquidity: isAr ? 'بطيئة جداً (أشهر)' : 'Very Slow (Months)',
      inflationHedge: isAr ? 'ممتاز على المدى الطويل' : 'Excellent Long-term',
      risk: isAr ? 'متوسط' : 'Moderate',
      rank: 2,
    },
  ];

  return (
    <div className="space-y-6 select-none">
      <div className="bg-gradient-to-r from-amber-500/10 via-[#0D1424] to-slate-900 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <GitCompare className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-extrabold text-white">
            {isAr ? 'مقارنة عوائد الأصول الاستثمارية في مصر' : 'Multi-Asset Performance Comparison Engine'}
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {isAr
            ? 'تقييم الذهب مقابل شهادات البنوك ذات العائد العالي والدولار والأسهم والعقارات'
            : 'Comparative matrix evaluating Gold vs 23.5% Bank Certificates, USD, EGX30, and Real Estate'}
        </p>
      </div>

      <Gold21kVsGlobalSpotWidget />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CurrencyComparisonWidget />
        <GoldVsUsdWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoldVsCertificatesWidget />
        <GoldVsBitcoinWidget />
      </div>

      <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-3 font-semibold">{isAr ? 'الترتيب' : 'Rank'}</th>
                <th className="pb-3 font-semibold">{isAr ? 'الأصل الاستثماري' : 'Asset Class'}</th>
                <th className="pb-3 font-semibold">{isAr ? 'عائد 1 سنة' : '1-Year Return'}</th>
                <th className="pb-3 font-semibold">{isAr ? 'عائد 3 سنوات' : '3-Year Return'}</th>
                <th className="pb-3 font-semibold">{isAr ? 'مستوى السيولة' : 'Liquidity'}</th>
                <th className="pb-3 font-semibold">{isAr ? 'مقاومة التضخم' : 'Inflation Protection'}</th>
                <th className="pb-3 font-semibold">{isAr ? 'المخاطرة' : 'Risk Profile'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50 transition-all">
                  <td className="py-3.5 font-bold text-amber-400">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold">
                      #{item.rank}
                    </span>
                  </td>
                  <td className="py-3.5 font-bold text-slate-100">{item.name}</td>
                  <td className="py-3.5 font-bold text-emerald-400">{item.yield1y}</td>
                  <td className="py-3.5 font-bold text-emerald-300">{item.yield3y}</td>
                  <td className="py-3.5 text-slate-300 font-sans">{item.liquidity}</td>
                  <td className="py-3.5 text-slate-300 font-sans">{item.inflationHedge}</td>
                  <td className="py-3.5 text-slate-300 font-sans">{item.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
