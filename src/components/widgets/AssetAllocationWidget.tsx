import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';
import { PieChart as PieIcon, BarChart3, ShieldAlert, Layers } from 'lucide-react';

export const AssetAllocationWidget: React.FC = () => {
  const { holdings, riskMetrics, language } = useApp();
  const isAr = language === 'AR';

  const [activeTab, setActiveTab] = useState<'PIE' | 'BAR'>('PIE');

  // Group holdings by Asset Category
  const categoryTotals = holdings.reduce((acc, h) => {
    const cat = h.assetType;
    acc[cat] = (acc[cat] || 0) + h.currentValueEGP;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = riskMetrics.totalValueEGP || 1;

  const COLORS: Record<string, string> = {
    GOLD: '#f59e0b', // Amber
    USD_CASH: '#10b981', // Emerald
    EGP_CASH: '#3b82f6', // Blue
    BANK_CERTIFICATE: '#8b5cf6', // Purple
    EGX_STOCKS: '#ec4899', // Pink
    SILVER: '#94a3b8', // Slate
    CRYPTO: '#f97316', // Orange
    REAL_ESTATE: '#14b8a6', // Teal
  };

  const CATEGORY_NAMES: Record<string, { en: string; ar: string }> = {
    GOLD: { en: 'Gold & Bullion', ar: 'الذهب والسبائك' },
    USD_CASH: { en: 'USD Liquidity', ar: 'سيولة دولارية' },
    EGP_CASH: { en: 'EGP Cash', ar: 'سيولة بالجنيه' },
    BANK_CERTIFICATE: { en: 'Bank Certificates (CDs)', ar: 'شهادات ادخار بانكية' },
    EGX_STOCKS: { en: 'EGX Stocks', ar: 'أسهم البورصة المصرية' },
    SILVER: { en: 'Silver Bullion', ar: 'فضة وسبائك' },
    CRYPTO: { en: 'Crypto / Stablecoins', ar: 'عملات رقمية' },
    REAL_ESTATE: { en: 'Real Estate', ar: 'عقارات وأصول' },
  };

  const pieData = Object.entries(categoryTotals).map(([cat, val]) => ({
    name: isAr ? CATEGORY_NAMES[cat]?.ar || cat : CATEGORY_NAMES[cat]?.en || cat,
    key: cat,
    value: val,
    percentage: Math.round((val / totalValue) * 1000) / 10,
  }));

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              {isAr ? 'توزيع الأصول وهيكل المحفظة' : 'Asset Allocation Structure'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'تقسيم الاستثمارات بين الذهب والشهادات والدولار' : 'Visual breakdown across bullion, CDs, and fiat currencies'}
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('PIE')}
            className={`p-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'PIE' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Pie Chart"
          >
            <PieIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('BAR')}
            className={`p-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'BAR' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Bar Allocation"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeTab === 'PIE' ? (
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="h-60 w-full md:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.key] || '#f59e0b'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(val: any) => [`${Number(val).toLocaleString()} EGP`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full md:w-1/2 space-y-2 text-xs">
            {pieData.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[item.key] || '#f59e0b' }}
                  />
                  <span className="font-semibold text-slate-200">{item.name}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-white font-bold block">{item.percentage}%</span>
                  <span className="text-[10px] text-slate-400">{item.value.toLocaleString()} EGP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Horizontal Bar Breakdown */
        <div className="space-y-3 pt-2">
          {pieData.map((item) => (
            <div key={item.key} className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-200">{item.name}</span>
                <span className="font-mono text-slate-300">
                  {item.percentage}% ({item.value.toLocaleString()} EGP)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: COLORS[item.key] || '#f59e0b',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
