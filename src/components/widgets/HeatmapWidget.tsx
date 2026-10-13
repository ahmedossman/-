import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, ArrowUpRight } from 'lucide-react';

export const HeatmapWidget: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'AR';

  const assets = [
    { name: isAr ? 'ذهب عيار 21' : 'Gold 21K', m1: '+4.2%', m3: '+12.8%', y1: '+38.5%', y3: '+142%', category: 'GOLD' },
    { name: isAr ? 'سبائك عيار 24' : 'Gold 24K Ingots', m1: '+4.4%', m3: '+13.1%', y1: '+39.2%', y3: '+145%', category: 'GOLD' },
    { name: isAr ? 'شهادات البنوك 23.5%' : 'Bank Certificate (23.5%)', m1: '+1.9%', m3: '+5.8%', y1: '+23.5%', y3: '+70.5%', category: 'BANK' },
    { name: isAr ? 'الدولار الأمريكي / EGP' : 'USD Cash / EGP', m1: '+0.8%', m3: '+2.4%', y1: '+18.2%', y3: '+62.0%', category: 'FOREX' },
    { name: isAr ? 'مؤشر البورصة EGX30' : 'EGX 30 Index', m1: '-1.2%', m3: '+8.5%', y1: '+28.0%', y3: '+110%', category: 'STOCKS' },
    { name: isAr ? 'الفضة عيار 925' : 'Silver 925', m1: '+3.1%', m3: '+9.4%', y1: '+31.0%', y3: '+98.0%', category: 'SILVER' },
  ];

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4 select-none">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>{isAr ? 'مصفوفة الأداء والعوائد المقارنة (Heatmap)' : 'Multi-Asset Performance Matrix'}</span>
        </h3>
        <span className="text-[11px] text-slate-400">{isAr ? 'عوائد تراكمية' : 'Cumulative Returns'}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800">
              <th className="pb-2 font-semibold">{isAr ? 'الأصل الاستثماري' : 'Asset Class'}</th>
              <th className="pb-2 text-right font-semibold">{isAr ? 'شهر 1' : '1 Month'}</th>
              <th className="pb-2 text-right font-semibold">{isAr ? '3 أشهر' : '3 Months'}</th>
              <th className="pb-2 text-right font-semibold">{isAr ? 'سنة 1' : '1 Year'}</th>
              <th className="pb-2 text-right font-semibold">{isAr ? '3 سنوات' : '3 Years'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {assets.map((asset, idx) => (
              <tr key={idx} className="hover:bg-slate-900/50">
                <td className="py-2.5 font-bold text-slate-200">{asset.name}</td>
                <td className="py-2.5 text-right font-bold text-emerald-400 bg-emerald-500/5 px-2 rounded">{asset.m1}</td>
                <td className="py-2.5 text-right font-bold text-emerald-400 bg-emerald-500/10 px-2 rounded">{asset.m3}</td>
                <td className="py-2.5 text-right font-bold text-emerald-300 bg-emerald-500/20 px-2 rounded">{asset.y1}</td>
                <td className="py-2.5 text-right font-bold text-amber-300 bg-amber-500/20 px-2 rounded">{asset.y3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
