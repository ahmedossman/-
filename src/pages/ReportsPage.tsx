import React from 'react';
import { useApp } from '../context/AppContext';
import { FileSpreadsheet, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { holdings, riskMetrics, marketData, language } = useApp();
  const isAr = language === 'AR';

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Asset Name', 'Purity', 'Weight(g)/Qty', 'Avg Price(EGP)', 'Current Price(EGP)', 'Total Cost(EGP)', 'Current Value(EGP)', 'P&L(EGP)'];
    const rows = holdings.map((h) => [
      h.name,
      h.purity || 'N/A',
      h.weightGrams || h.quantity || 1,
      h.purchasePriceEGP,
      h.currentPriceEGP,
      h.totalCostEGP,
      h.currentValueEGP,
      h.totalProfitLossEGP,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Gold_Portfolio_Hub_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 select-none">
      <div className="bg-gradient-to-r from-amber-500/10 via-[#0D1424] to-slate-900 border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-extrabold text-white">
              {isAr ? 'تقارير الأداء وتصدير البيانات' : 'Enterprise Financial Reports & Export'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'توليد تقارير مالية رسمية قابلة للطباعة والتحميل بصيغة CSV أو PDF'
              : 'Generate audit-ready investment reports and export raw portfolio datasets'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{isAr ? 'تصدير CSV' : 'Export CSV'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl text-xs border border-slate-700 cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>{isAr ? 'طباعة التقرير' : 'Print PDF'}</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-[#0D1424] border border-slate-800 rounded-2xl p-6 space-y-6 font-sans">
        <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-amber-400">GOLD PORTFOLIO HUB ENTERPRISE</h3>
            <p className="text-xs text-slate-400">{isAr ? 'تقرير تقييم محفظة الأصول والمخاطر' : 'Executive Portfolio Valuation & Audit Report'}</p>
          </div>
          <div className="text-right text-xs text-slate-400 font-mono">
            <div>{isAr ? 'التاريخ:' : 'Date:'} {new Date().toLocaleDateString()}</div>
            <div>{isAr ? 'مرجع السوق:' : 'Ref:'} CBE Gold Bullion Index</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block mb-0.5">{isAr ? 'القيمة الكلية:' : 'Total Portfolio Value:'}</span>
            <strong className="text-white text-base">{riskMetrics.totalValueEGP.toLocaleString()} EGP</strong>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block mb-0.5">{isAr ? 'إجمالي التكلفة:' : 'Total Cost Basis:'}</span>
            <strong className="text-slate-300 text-base">{riskMetrics.totalCostEGP.toLocaleString()} EGP</strong>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block mb-0.5">{isAr ? 'صافي الأرباح:' : 'Unrealized P&L:'}</span>
            <strong className="text-emerald-400 text-base">+{riskMetrics.totalProfitEGP.toLocaleString()} EGP</strong>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block mb-0.5">{isAr ? 'نسبة Sharpe:' : 'Sharpe Ratio:'}</span>
            <strong className="text-indigo-300 text-base">{riskMetrics.sharpeRatio}</strong>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2 font-semibold">{isAr ? 'الأصل' : 'Asset Name'}</th>
                <th className="pb-2 font-semibold">{isAr ? 'الكمية' : 'Qty / Grams'}</th>
                <th className="pb-2 font-semibold">{isAr ? 'متوسط الشراء' : 'Purchase Price'}</th>
                <th className="pb-2 font-semibold">{isAr ? 'السعر الحالي' : 'Live Price'}</th>
                <th className="pb-2 font-semibold text-right">{isAr ? 'القيمة الحالية' : 'Current Value'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {holdings.map((h) => (
                <tr key={h.id}>
                  <td className="py-2.5 font-bold text-slate-200">{h.name}</td>
                  <td className="py-2.5 text-slate-300">{h.weightGrams ? `${h.weightGrams}g` : h.quantity}</td>
                  <td className="py-2.5 text-slate-300">{h.purchasePriceEGP.toLocaleString()} EGP</td>
                  <td className="py-2.5 font-bold text-amber-400">{h.currentPriceEGP.toLocaleString()} EGP</td>
                  <td className="py-2.5 text-right font-bold text-white">{h.currentValueEGP.toLocaleString()} EGP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
