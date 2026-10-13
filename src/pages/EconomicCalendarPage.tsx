import React from 'react';
import { useApp } from '../context/AppContext';
import { CalendarDays } from 'lucide-react';
import { EconomicCalendarWidget } from '../components/widgets/EconomicCalendarWidget';
import { LatestNewsPanel } from '../components/widgets/LatestNewsPanel';

export const EconomicCalendarPage: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'AR';

  return (
    <div className="space-y-6 select-none">
      <div className="bg-gradient-to-r from-amber-500/10 via-[#0D1424] to-slate-900 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-extrabold text-white">
            {isAr ? 'التقويم الاقتصادي والأخبار المباشرة' : 'Macroeconomic Events Calendar & Real-Time News'}
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {isAr
            ? 'مواعيد اجتماعات البنك المركزي المصري والتعبئة والإحصاء والفيدرالي الأمريكي مع الأخبار المباشرة'
            : 'Key schedule of Central Bank of Egypt interest rate meetings, CAPMAS inflation announcements, and live market intelligence'}
        </p>
      </div>

      <EconomicCalendarWidget />
      <LatestNewsPanel />
    </div>
  );
};
