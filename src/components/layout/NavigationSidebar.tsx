import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Briefcase,
  Coins,
  LineChart,
  GitCompare,
  TrendingUp,
  Sparkles,
  CalendarDays,
  Newspaper,
  Calculator,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
} from 'lucide-react';

export const NavigationSidebar: React.FC = () => {
  const { activePage, setActivePage, language, role } = useApp();
  const isAr = language === 'AR';

  const navItems = [
    {
      id: 'dashboard',
      label: isAr ? 'لوحة التحكم الرئيسية' : 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'portfolio',
      label: isAr ? 'محفظة الاستثمار' : 'Portfolio Holdings',
      icon: Briefcase,
      badge: 'LIVE',
    },
    {
      id: 'gold_prices',
      label: isAr ? 'أسعار الذهب المباشرة' : 'Gold Market Feed',
      icon: Coins,
      badge: null,
    },
    {
      id: 'historical',
      label: isAr ? 'التحليل التاريخي والبياني' : 'Historical Analysis',
      icon: LineChart,
      badge: null,
    },
    {
      id: 'comparison',
      label: isAr ? 'مقارنة الأصول (ذهب/شهادات/دولار)' : 'Asset Comparison',
      icon: GitCompare,
      badge: null,
    },
    {
      id: 'forecast',
      label: isAr ? 'التوقعات الاقتصادية (3-12 شهر)' : 'Forecasting Engine',
      icon: TrendingUp,
      badge: 'PRO',
    },
    {
      id: 'ai_insights',
      label: isAr ? 'توصيات وتحليلات AI' : 'AI Signals & Intelligence',
      icon: Sparkles,
      badge: 'GEMINI',
      highlight: true,
    },
    {
      id: 'economic_calendar',
      label: isAr ? 'التقويم الاقتصادي (الفائدة والتضخم)' : 'Economic Calendar',
      icon: CalendarDays,
      badge: null,
    },
    {
      id: 'news',
      label: isAr ? 'الأخبار والتحليلات المعتمدة' : 'Bullion & Market News',
      icon: Newspaper,
      badge: null,
    },
    {
      id: 'calculator',
      label: isAr ? 'حاسبة الاستثمار والادخار DCA' : 'DCA & Yield Calculator',
      icon: Calculator,
      badge: null,
    },
    {
      id: 'reports',
      label: isAr ? 'تقارير الأداء وتصدير البيانات' : 'Enterprise Reports',
      icon: FileSpreadsheet,
      badge: null,
    },
    {
      id: 'settings',
      label: isAr ? 'الإعدادات والعملة الأساسية' : 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  if (role === 'ADMIN') {
    navItems.push({
      id: 'admin',
      label: isAr ? 'لوحة الإدارة والتعديل' : 'Admin Operations',
      icon: ShieldCheck,
      badge: 'ADMIN',
    });
  }

  return (
    <aside className="w-full md:w-64 bg-[#0B101D] border-r border-slate-800 p-3 flex flex-col justify-between select-none">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {isAr ? 'القائمة الرئيسية' : 'NAVIGATION MODULES'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border border-amber-500/30 font-bold'
                  : item.highlight
                  ? 'text-indigo-300 hover:bg-indigo-500/10 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-amber-400'
                      : item.highlight
                      ? 'text-indigo-400'
                      : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                    item.badge === 'GEMINI'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      : item.badge === 'LIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : item.badge === 'ADMIN'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Benchmark Card */}
      <div className="mt-6 p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] space-y-1">
        <div className="text-slate-400 font-medium">
          {isAr ? 'حالة السوق الحالي:' : 'Market Parity Index:'}
        </div>
        <div className="text-amber-400 font-bold font-mono">
          {isAr ? 'الذهب عيار 21: 4,191 ج.م' : '21K Gold: 4,191 EGP/g'}
        </div>
        <div className="text-[10px] text-slate-500">
          {isAr ? 'مصدر البيانات: البنك المركزي والصاغة' : 'Data Feed: CBE & Bullion Exchange'}
        </div>
      </div>
    </aside>
  );
};
