import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowUpRight, ArrowDownLeft, Receipt, Search, FileText } from 'lucide-react';

export const RecentTransactionsWidget: React.FC = () => {
  const { transactions, setActivePage, language } = useApp();
  const isAr = language === 'AR';

  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter((tx) => {
    const term = searchTerm.toLowerCase();
    return (
      tx.assetType.toLowerCase().includes(term) ||
      (tx.notes && tx.notes.toLowerCase().includes(term)) ||
      tx.date.includes(term)
    );
  });

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              {isAr ? 'سجل العمليات والصفقات الأخيرة' : 'Institutional Transaction Audit Log'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'آخر عمليات شراء وبيع الذهب والشهادات والعملات' : 'Recent purchases, liquidations, and deposit settlements'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActivePage('portfolio')}
          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
        >
          <span>{isAr ? 'سجل المحفظة الكامل' : 'View Full Audit Trail'}</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder={isAr ? 'تصفية الصفقات بالتاريخ أو الأصل...' : 'Filter transactions by asset or date...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800 font-semibold">
              <th className="pb-2.5">{isAr ? 'نوع العملية' : 'Type'}</th>
              <th className="pb-2.5">{isAr ? 'الأصل / العيار' : 'Asset / Purity'}</th>
              <th className="pb-2.5">{isAr ? 'الكمية / الوزن' : 'Qty / Weight'}</th>
              <th className="pb-2.5">{isAr ? 'التاريخ' : 'Date'}</th>
              <th className="pb-2.5 text-right">{isAr ? 'السعر الفردي' : 'Unit Cost'}</th>
              <th className="pb-2.5 text-right">{isAr ? 'الإجمالي (EGP)' : 'Total Amount'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filtered.slice(0, 5).map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                      tx.type === 'BUY'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {tx.type === 'BUY' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                    {tx.type}
                  </span>
                </td>
                <td className="py-3 font-sans font-bold text-white">
                  {tx.assetType} {tx.purity ? `(${tx.purity})` : ''}
                </td>
                <td className="py-3 text-slate-300">
                  {tx.weightGrams ? `${tx.weightGrams}g` : tx.totalAmountEGP / tx.pricePerGramOrUnitEGP}
                </td>
                <td className="py-3 text-slate-400 font-sans">{tx.date}</td>
                <td className="py-3 text-right text-slate-300">
                  {tx.pricePerGramOrUnitEGP.toLocaleString()} EGP
                </td>
                <td className="py-3 text-right font-bold text-amber-400">
                  {tx.totalAmountEGP.toLocaleString()} EGP
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
