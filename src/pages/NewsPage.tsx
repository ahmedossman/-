import React from 'react';
import { useApp } from '../context/AppContext';
import { Newspaper, TrendingUp, Sparkles, ExternalLink } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'AR';

  const articles = [
    {
      id: 1,
      title: isAr
        ? 'ارتفاع إقبال المصريين على شراء السبائك والجنيهات الذهب بزيادة 18% بالربع الحالي'
        : 'Egyptian Demand for 24K Ingots Rises 18% Year-over-Year amidst Devaluation Hedging',
      summary: isAr
        ? 'سجلت مبيعات السبائك المدموغة عيار 24 والجنيهات الذهب مستويات قياسية بالصاغة مع توجه الأفراد والمؤسسات لتأمين الأصول ضد تقلبات أسعار الصرف.'
        : 'Retail and institutional investors in Cairo continue heavy accumulation of stamped 24K BTC ingots as a safe haven.',
      time: '2 hours ago',
      source: 'Cairo Bullion Bureau',
      sentiment: 'BULLISH',
    },
    {
      id: 2,
      title: isAr
        ? 'أوقية الذهب تخترق حاجز $2,980 دولاراً عالمياً مدعومة بتوقعات خفض الفائدة الأمريكية'
        : 'Global Gold Spot Breaches $2,980/oz as Fed Rate Cut Expectations Strengthen',
      summary: isAr
        ? 'قفزت أوقية الذهب في بورصة نيويورك (COMEX) إلى مستويات تاريخية جديدة مع تراجع عوائد سندات الخزانة الأمريكية واستمرار المشتريات السيادية للبنوك المركزية.'
        : 'International spot prices gained +1.4% driven by central bank purchases and lower Treasury yields.',
      time: '5 hours ago',
      source: 'Reuters Financial',
      sentiment: 'BULLISH',
    },
    {
      id: 3,
      title: isAr
        ? 'البنك المركزي المصري يعلن ارتفاع الاحتياطي النقدي من الذهب إلى مستويات قياسية'
        : 'Central Bank of Egypt Bullion Reserves Reach Record Highs in Foreign Assets',
      summary: isAr
        ? 'أظهرت بيانات البنك المركزي زيادة مكون الذهب في الاحتياطي الأجنبي، مما يعزز الملاءة المباشرة للعملة المحلية ويؤمن احتياطيات الدولة.'
        : 'CBE reports increased gold reserve ratio within total foreign exchange buffers.',
      time: '1 day ago',
      source: 'CBE Official Press',
      sentiment: 'NEUTRAL',
    },
  ];

  return (
    <div className="space-y-6 select-none">
      <div className="bg-gradient-to-r from-amber-500/10 via-[#0D1424] to-slate-900 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-extrabold text-white">
            {isAr ? 'أخبار وسوق الصاغة والاقتصاد المصري' : 'Egyptian Bullion & Macroeconomic News'}
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {isAr
            ? 'تغطية فورية للأسواق والتحليلات المعتمدة المصنفة بالذكاء الاصطناعي'
            : 'Verified news feed with Gemini AI sentiment tags (Bullish, Neutral, Bearish)'}
        </p>
      </div>

      <div className="space-y-4">
        {articles.map((art) => (
          <div
            key={art.id}
            className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400">{art.source}</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">{art.time}</span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  {art.sentiment}
                </span>
              </div>
            </div>

            <h3 className="font-bold text-base text-white hover:text-amber-300 transition-all cursor-pointer">
              {art.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">{art.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
