import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Clock, Search } from 'lucide-react';
import { INITIAL_NEWS } from '../../services/goldService';

export const LatestNewsPanel: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'AR';

  const [category, setCategory] = useState<'ALL' | 'GOLD' | 'EGP' | 'GLOBAL'>('ALL');

  const filteredNews = INITIAL_NEWS.filter((n) => {
    if (category === 'ALL') return true;
    return n.relatedAsset === category;
  });

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              {isAr ? 'آخر أخبار الصاغة والاقتصاد الكلي' : 'Live Bullion & Macro News Feed'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'تغطية مستمرة لأخبار سوق الذهب المصري وأسعار الفائدة العالمية' : 'Real-time market intel, Central Bank updates and commodity drivers'}
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          {(['ALL', 'GOLD', 'EGP', 'GLOBAL'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                category === cat ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL' ? (isAr ? 'الكل' : 'ALL') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Cards */}
      <div className="space-y-3">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                    news.sentiment === 'BULLISH'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : news.sentiment === 'BEARISH'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-500/20 text-slate-300 border-slate-500/40'
                  }`}
                >
                  {news.sentiment}
                </span>

                <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {news.source}
                </span>
              </div>

              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {news.publishedAt}
              </span>
            </div>

            <h4 className="font-bold text-sm text-white leading-snug">
              {isAr ? news.titleAr : news.title}
            </h4>

            <p className="text-slate-300 leading-relaxed text-xs">
              {isAr ? news.summaryAr : news.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
