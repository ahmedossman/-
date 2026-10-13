import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Plus,
  Trash2,
  TrendingUp,
  Coins,
  DollarSign,
  Building,
  ShieldCheck,
} from 'lucide-react';

export const PortfolioPage: React.FC<{ onOpenBuyModal: () => void }> = ({ onOpenBuyModal }) => {
  const { holdings, deleteHolding, riskMetrics, language } = useApp();
  const isAr = language === 'AR';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-[#0D1424] to-slate-900 border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-extrabold text-white">
              {isAr ? 'إدارة محفظة الأصول والاستثمارات' : 'Enterprise Portfolio Manager'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'متابعة السبائك المدموغة، الجنيهات الذهب، شهادات الاستثمار البنكية، والسيولة النقدية'
              : 'Detailed tracking of gold bars, sovereigns, bank CDs, and forex reserves'}
          </p>
        </div>

        <button
          onClick={onOpenBuyModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 text-xs sm:text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isAr ? 'إضافة صفقة / شـراء' : 'Add Holding / Transaction'}</span>
        </button>
      </div>

      {/* Portfolio Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-400 block mb-1">
            {isAr ? 'إجمالي قيمة المحفظة' : 'Total Current Value'}
          </span>
          <div className="text-xl font-bold text-white">{riskMetrics.totalValueEGP.toLocaleString()} EGP</div>
        </div>

        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-400 block mb-1">
            {isAr ? 'إجمالي تكلفة الشراء' : 'Total Cost Basis'}
          </span>
          <div className="text-xl font-bold text-slate-300">{riskMetrics.totalCostEGP.toLocaleString()} EGP</div>
        </div>

        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-400 block mb-1">
            {isAr ? 'صافي الأرباح غير المحققة' : 'Unrealized Profit'}
          </span>
          <div
            className={`text-xl font-bold ${
              riskMetrics.totalProfitEGP >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {riskMetrics.totalProfitEGP >= 0 ? '+' : ''}
            {riskMetrics.totalProfitEGP.toLocaleString()} EGP ({riskMetrics.roiPercentage}%)
          </div>
        </div>

        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-400 block mb-1">
            {isAr ? 'متوسط سعر جرام الذهب 21' : 'Avg Cost 21K Gram'}
          </span>
          <div className="text-xl font-bold text-amber-400">{riskMetrics.averageCost21kEGP.toLocaleString()} EGP</div>
        </div>
      </div>

      {/* Holdings Detailed Table */}
      <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <h3 className="font-bold text-base text-white">
            {isAr ? 'قائمة الحيازات التفصيلية' : 'Detailed Asset Holdings'}
          </h3>
          <span className="text-xs text-slate-400">
            {holdings.length} {isAr ? 'أصول مسجلة' : 'assets listed'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-3 font-semibold">{isAr ? 'اسم الأصل / العيار' : 'Asset / Purity'}</th>
                <th className="pb-3 font-semibold">{isAr ? 'النوع' : 'Category'}</th>
                <th className="pb-3 font-semibold">{isAr ? 'الكمية / الوزن' : 'Qty / Grams'}</th>
                <th className="pb-3 font-semibold">{isAr ? 'متوسط سعر الشراء' : 'Avg Purchase Price'}</th>
                <th className="pb-3 font-semibold">{isAr ? 'السعر الحالي' : 'Live Price'}</th>
                <th className="pb-3 font-semibold">{isAr ? 'التكلفة الإجمالية' : 'Total Cost'}</th>
                <th className="pb-3 font-semibold text-right">{isAr ? 'القيمة الحالية' : 'Current Value'}</th>
                <th className="pb-3 font-semibold text-right">{isAr ? 'الربح / الخسارة' : 'Profit / Loss'}</th>
                <th className="pb-3 text-center font-semibold">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {holdings.map((h) => (
                <tr key={h.id} className="hover:bg-slate-900/50 transition-all">
                  <td className="py-3.5 font-bold text-slate-100">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <div>
                        <div>{h.name}</div>
                        {h.notes && <div className="text-[10px] text-slate-500 font-sans">{h.notes}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold">
                      {h.assetType}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-200">
                    {h.weightGrams ? `${h.weightGrams}g` : h.quantity}
                  </td>
                  <td className="py-3.5 text-slate-300">{h.purchasePriceEGP.toLocaleString()} EGP</td>
                  <td className="py-3.5 font-bold text-amber-400">{h.currentPriceEGP.toLocaleString()} EGP</td>
                  <td className="py-3.5 text-slate-300">{h.totalCostEGP.toLocaleString()} EGP</td>
                  <td className="py-3.5 text-right font-bold text-white">{h.currentValueEGP.toLocaleString()} EGP</td>
                  <td
                    className={`py-3.5 text-right font-bold ${
                      h.totalProfitLossEGP >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {h.totalProfitLossEGP >= 0 ? '+' : ''}
                    {h.totalProfitLossEGP.toLocaleString()} EGP ({h.returnPercentage}%)
                  </td>
                  <td className="py-3.5 text-center">
                    <button
                      onClick={() => deleteHolding(h.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                      title="Delete holding"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
