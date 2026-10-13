import React from 'react';
import { BarChart3, TrendingUp, Users, Cpu, FileText, Bell, Globe2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

export const UsageAnalyticsTab: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const dailyTraffic = [
    { day: 'Mon', users: 1420, aiQueries: 480, exports: 120 },
    { day: 'Tue', users: 1890, aiQueries: 620, exports: 190 },
    { day: 'Wed', users: 2350, aiQueries: 890, exports: 240 },
    { day: 'Thu', users: 3100, aiQueries: 1120, exports: 310 },
    { day: 'Fri', users: 2840, aiQueries: 940, exports: 280 },
    { day: 'Sat', users: 3950, aiQueries: 1450, exports: 420 },
    { day: 'Sun', users: 4200, aiQueries: 1680, exports: 510 },
  ];

  const geoBreakdown = [
    { region: isAr ? 'القاهرة الكبرى' : 'Greater Cairo', percentage: 58, count: '24,360 users' },
    { region: isAr ? 'الإسكندرية والساحل' : 'Alexandria & Delta', percentage: 22, count: '9,240 users' },
    { region: isAr ? 'الجيزة والصعيد' : 'Giza & Upper Egypt', percentage: 12, count: '5,040 users' },
    { region: isAr ? 'المستثمرون بالخارج (Gulf/EU)' : 'International / Expat', percentage: 8, count: '3,360 users' },
  ];

  return (
    <div className="space-y-5">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-400 font-sans block">{isAr ? 'المستخدمون النشطون (DAU)' : 'Daily Active Users (DAU)'}</span>
          <span className="text-xl font-bold text-amber-400">4,200</span>
          <span className="text-[10px] text-emerald-400 block">+14.2% vs last week</span>
        </div>

        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-400 font-sans block">{isAr ? 'استشارات Gemini الذكية' : 'Gemini AI Advisory Calls'}</span>
          <span className="text-xl font-bold text-sky-400">1,680</span>
          <span className="text-[10px] text-emerald-400 block">Avg 1.2s response time</span>
        </div>

        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-400 font-sans block">{isAr ? 'تقارير المحفظة المصدرة' : 'Portfolio Export Memos'}</span>
          <span className="text-xl font-bold text-indigo-400">510</span>
          <span className="text-[10px] text-slate-400 block">PDF / Excel Formats</span>
        </div>

        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-400 font-sans block">{isAr ? 'تنبيهات أسعار الصاغة' : 'Price Alerts Fired'}</span>
          <span className="text-xl font-bold text-emerald-400">3,840</span>
          <span className="text-[10px] text-slate-400 block">FCM Web & Email</span>
        </div>
      </div>

      {/* Traffic & AI Usage Chart */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'اتجاهات النشاط اليومي واستعلامات الذكاء الاصطناعي' : 'Weekly Traffic & AI Advisory Activity'}</span>
            </h4>
            <span className="text-[11px] text-slate-400">Unique visitors vs Gemini 3.6 Flash queries</span>
          </div>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTraffic}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#64748b" tickLine={false} />
              <YAxis stroke="#64748b" tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0D1424', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="users" name="Active Users" stroke="#f59e0b" fillOpacity={1} fill="url(#colorUsers)" />
              <Area type="monotone" dataKey="aiQueries" name="AI Queries" stroke="#38bdf8" fillOpacity={1} fill="url(#colorAI)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Geographic Breakdown */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-indigo-400" />
          <span>{isAr ? 'التوزيع الجغرافي للمستخدمين بالسوق المصري' : 'Egyptian Market User Geographic Demographics'}</span>
        </h4>

        <div className="space-y-3">
          {geoBreakdown.map((geo) => (
            <div key={geo.region} className="space-y-1.5">
              <div className="flex items-center justify-between font-sans">
                <span className="font-bold text-slate-200">{geo.region}</span>
                <span className="font-mono text-slate-400 text-[11px]">
                  {geo.count} ({geo.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-amber-400 h-full rounded-full"
                  style={{ width: `${geo.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
