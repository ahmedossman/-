import React from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp } from 'lucide-react';
import { AIForecastWidget } from '../components/widgets/AIForecastWidget';
import { PerformanceTimelineWidget } from '../components/widgets/PerformanceTimelineWidget';

export const ForecastPage: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'AR';

  return (
    <div className="space-y-6 select-none">
      <div className="bg-gradient-to-r from-amber-500/10 via-[#0D1424] to-slate-900 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-extrabold text-white">
            {isAr ? 'محرك التوقعات والسيناريوهات المستقبلية للذهب' : 'Econometric Gold Price Forecasting Engine'}
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {isAr
            ? 'سيناريوهات متوقعة لأسعار الذهب عيار 21 (متفائل، محايد، متحفظ) مع درجات الثقة ومحطات التاريخ'
            : 'Multi-horizon scenario modeling (Optimistic, Neutral, Pessimistic) for 21K Gold in EGP'}
        </p>
      </div>

      <AIForecastWidget />
      <PerformanceTimelineWidget />
    </div>
  );
};
