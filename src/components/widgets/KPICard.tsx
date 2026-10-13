import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subValue?: string;
  change?: string;
  isPositive?: boolean;
  icon?: LucideIcon;
  accentColor?: 'amber' | 'emerald' | 'indigo' | 'rose' | 'slate';
  badge?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subValue,
  change,
  isPositive = true,
  icon: Icon,
  accentColor = 'amber',
  badge,
}) => {
  const colorMap = {
    amber: 'border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent text-amber-400',
    emerald: 'border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-transparent text-emerald-400',
    indigo: 'border-indigo-500/30 bg-gradient-to-b from-indigo-500/10 to-transparent text-indigo-400',
    rose: 'border-rose-500/30 bg-gradient-to-b from-rose-500/10 to-transparent text-rose-400',
    slate: 'border-slate-700/60 bg-slate-900/60 text-slate-300',
  };

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-sm transition-all hover:scale-[1.01] ${colorMap[accentColor]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {badge ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
            {badge}
          </span>
        ) : Icon ? (
          <Icon className="w-4 h-4 opacity-80" />
        ) : null}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="font-mono font-extrabold text-xl sm:text-2xl text-white tracking-tight">{value}</div>

        {change && (
          <div
            className={`flex items-center text-xs font-bold px-2 py-0.5 rounded ${
              isPositive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {subValue && <div className="mt-1.5 text-[11px] text-slate-400 font-medium">{subValue}</div>}
    </div>
  );
};
