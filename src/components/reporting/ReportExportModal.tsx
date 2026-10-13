import React from 'react';
import { useApp } from '../../context/AppContext';
import { exportHoldingsCSV, exportTransactionsCSV, generatePrintableReport } from '../../services/reportGenerator';
import { FileText, Download, Printer, ShieldCheck, X } from 'lucide-react';

export const ReportExportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { holdings, transactions, riskMetrics, marketData, language } = useApp();
  const isAr = language === 'AR';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0D1424] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base text-white">
              {isAr ? 'تصدير التقارير واستخراج كشوف الحساب' : 'Export Enterprise Statement & Reports'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {isAr
            ? 'توليد تقارير مالية معتمدة تدعم الحسابات، الأرباح، متوسط تكلفة الجرام، وقيمة الأصول لاستخدامات التدقيق الضريبي والمالي.'
            : 'Generate certified financial inventory reports, transaction ledgers, and executive tax summaries in CSV or printable PDF.'}
        </p>

        <div className="space-y-3 font-mono text-xs pt-2">
          <button
            onClick={() => generatePrintableReport(holdings, riskMetrics, marketData)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer font-bold"
          >
            <div className="flex items-center gap-2.5 font-sans">
              <Printer className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'طباعة تقرير كشف الحساب (Print / PDF)' : 'Print Executive Audit Statement (PDF)'}</span>
            </div>
            <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded">PDF</span>
          </button>

          <button
            onClick={() => exportHoldingsCSV(holdings)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 transition-all cursor-pointer font-bold"
          >
            <div className="flex items-center gap-2.5 font-sans">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'تصدير جدول الحيازات (Holdings CSV)' : 'Export Asset Inventory (CSV)'}</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">EXCEL</span>
          </button>

          <button
            onClick={() => exportTransactionsCSV(transactions)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 transition-all cursor-pointer font-bold"
          >
            <div className="flex items-center gap-2.5 font-sans">
              <Download className="w-4 h-4 text-indigo-400" />
              <span>{isAr ? 'تصدير دفتر العمليات (Transactions CSV)' : 'Export Transaction History (CSV)'}</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">EXCEL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
