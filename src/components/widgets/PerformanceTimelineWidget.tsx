import React from 'react';
import { useApp } from '../../context/AppContext';
import { Milestone, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

export const PerformanceTimelineWidget: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'AR';

  const milestones = [
    {
      date: 'March 2022',
      title: 'First EGP Adjustment (15.7 → 18.2)',
      titleAr: 'التعويم الأول للجنيه (من 15.7 إلى 18.2 ج.م)',
      gold21k: '850 EGP/g',
      return: '+28% Hedge Gain',
      desc: 'Central Bank of Egypt raised benchmark rates by 100 bps; gold provided instant purchasing power preservation.',
      descAr: 'رفع البنك المركزي الفائدة 100 نقطة أساس؛ وحافظ الذهب على القوة الشرائية فوراً.',
    },
    {
      date: 'October 2022',
      title: 'Flexible Exchange Rate Adoption (19.7 → 24.2)',
      titleAr: 'اعتماد سعر صرف مرن (من 19.7 إلى 24.2 ج.م)',
      gold21k: '1,120 EGP/g',
      return: '+32% Hedge Gain',
      desc: 'Move to durable flexible exchange rate regime sparked major gold bullion demand across Cairo jeweler shops.',
      descAr: 'التحول لنظام صرف مرن أطلق موجة طلب قياسية على السبائك في محلات الصاغة.',
    },
    {
      date: 'January 2023',
      title: 'Third Devaluation Surge (24.2 → 30.5)',
      titleAr: 'تعديل الصرف الثالث (من 24.2 إلى 30.5 ج.م)',
      gold21k: '1,750 EGP/g',
      return: '+56% Hedge Gain',
      desc: 'Commercial banks issued 25% certificates of deposit; gold outperformed all bank fixed income products.',
      descAr: 'طرح شهادات الـ 25% بالبنوك؛ وسجل الذهب تفوقاً تاريخياً على جميع عوائد الشهادات.',
    },
    {
      date: 'March 2024',
      title: 'Major Unification & Rate Hike (30.9 → 49.5)',
      titleAr: 'تحرير الصرف وتوحيد السعر (من 30.9 إلى 49.5 ج.م)',
      gold21k: '3,100 EGP/g',
      return: '+77% Hedge Gain',
      desc: '600 bps rate hike & exchange rate unification. Gold 21K scaled to new all-time highs above 3,200 EGP.',
      descAr: 'رفع الفائدة 600 نقطة أساس وتوحيد سعر الصرف؛ ووصل جرام 21 لمستويات قياسية فوق 3200 ج.م.',
    },
    {
      date: '2025 - 2026',
      title: 'Current Bull Run ($3,000 Spot Alignment)',
      titleAr: 'الموجة التضخمية الحالية ووصول الأوقية لـ $3000',
      gold21k: '4,191 EGP/g',
      return: '+120% Total Return',
      desc: 'Global spot gold broken historical record $3,000/oz amid central bank buying, propelling local 21K to 4,191 EGP.',
      descAr: 'كسر الأوقية العالمية حاجز 3000 دولار مع مشتريات البنوك المركزية يدفع جرام 21 لمستوى 4191 ج.م.',
    },
  ];

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Milestone className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              {isAr ? 'محطات انخفاض الجنيه واستجابة الذهب' : 'EGP Devaluation Timeline & Gold Protection Response'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'سجل المحطات التاريخية لقرارات الصرف وأداء الذهب كحامي للثروة' : 'Historical milestones tracking Cairo exchange rate shifts and gold bullion performance'}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative border-l-2 border-amber-500/30 pl-4 space-y-6 my-2 ml-2">
        {milestones.map((ms, idx) => (
          <div key={idx} className="relative group">
            {/* Bullet Dot */}
            <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-slate-950 group-hover:scale-125 transition-all" />

            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {ms.date}
                </span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {ms.return}
                </span>
              </div>

              <h4 className="font-bold text-white text-sm">
                {isAr ? ms.titleAr : ms.title}
              </h4>

              <p className="text-slate-300 leading-relaxed text-xs">
                {isAr ? ms.descAr : ms.desc}
              </p>

              <div className="pt-1 font-mono text-[11px] text-slate-400">
                {isAr ? 'سعر جرام 21 حينها:' : 'Gold 21K Price then:'} <span className="text-amber-300 font-bold">{ms.gold21k}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
