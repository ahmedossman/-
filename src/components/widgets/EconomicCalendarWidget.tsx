import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, AlertCircle, Clock, Flag, ArrowRight } from 'lucide-react';
import { INITIAL_ECONOMIC_EVENTS } from '../../services/goldService';

export const EconomicCalendarWidget: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'AR';

  const [countryFilter, setCountryFilter] = useState<'ALL' | 'EGYPT' | 'USA'>('ALL');

  const events = INITIAL_ECONOMIC_EVENTS.filter((e) => {
    if (countryFilter === 'ALL') return true;
    return e.country === countryFilter;
  });

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              {isAr ? 'التقويم الاقتصادي المصري والعالمي' : 'Macroeconomic Events & Central Bank Calendar'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'قرارات البنك المركزي، بيانات التضخم ومؤشرات الفيدرالي الأمريكي' : 'CBE interest rate meetings, CAPMAS inflation data and Fed rate triggers'}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          {(['ALL', 'EGYPT', 'USA'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCountryFilter(c)}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                countryFilter === c ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c === 'ALL' ? (isAr ? 'الكل' : 'ALL') : c === 'EGYPT' ? (isAr ? 'مصر 🇪🇬' : 'Egypt 🇪🇬') : (isAr ? 'أمريكا 🇺🇸' : 'USA 🇺🇸')}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800 font-semibold">
              <th className="pb-2.5">{isAr ? 'التاريخ والوقت' : 'Date & Time'}</th>
              <th className="pb-2.5">{isAr ? 'الدولة' : 'Country'}</th>
              <th className="pb-2.5">{isAr ? 'الحدث الاقتصادي' : 'Event Title'}</th>
              <th className="pb-2.5">{isAr ? 'الأهمية' : 'Impact'}</th>
              <th className="pb-2.5 text-center">{isAr ? 'الفعلي' : 'Actual'}</th>
              <th className="pb-2.5 text-center">{isAr ? 'المتوقع' : 'Forecast'}</th>
              <th className="pb-2.5 text-center">{isAr ? 'السابق' : 'Previous'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {events.map((ev) => (
              <tr key={ev.id} className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 text-slate-300 font-bold whitespace-nowrap">
                  <div>{ev.date}</div>
                  <div className="text-[10px] text-slate-500 font-sans">{ev.time}</div>
                </td>
                <td className="py-3 whitespace-nowrap">
                  <span className="text-sm">
                    {ev.country === 'EGYPT' ? '🇪🇬' : ev.country === 'USA' ? '🇺🇸' : '🇪🇺'}
                  </span>
                </td>
                <td className="py-3 font-sans font-bold text-slate-100">
                  {isAr ? ev.titleAr : ev.title}
                </td>
                <td className="py-3 whitespace-nowrap">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      ev.impact === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {ev.impact}
                  </span>
                </td>
                <td className="py-3 text-center font-bold text-emerald-400">
                  {ev.actual || '--'}
                </td>
                <td className="py-3 text-center text-amber-300 font-semibold">
                  {ev.forecast || '--'}
                </td>
                <td className="py-3 text-center text-slate-400">
                  {ev.previous || '--'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
