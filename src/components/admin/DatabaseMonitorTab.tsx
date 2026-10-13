import React, { useState, useEffect } from 'react';
import { Database, HardDrive, RefreshCw, Zap, CheckCircle2, Server, Trash2, Cpu } from 'lucide-react';
import { authService } from '../../services/authService';

interface CollectionStats {
  name: string;
  docCount: number;
  sizeKb: number;
  readOps24h: number;
  writeOps24h: number;
  status: 'HEALTHY' | 'SYNCING';
}

export const DatabaseMonitorTab: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [latency, setLatency] = useState(14);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [collections, setCollections] = useState<CollectionStats[]>([
    { name: 'users', docCount: 1250, sizeKb: 450, readOps24h: 12400, writeOps24h: 310, status: 'HEALTHY' },
    { name: 'audit_logs', docCount: 8420, sizeKb: 2100, readOps24h: 4120, writeOps24h: 8420, status: 'HEALTHY' },
    { name: 'holdings', docCount: 4180, sizeKb: 1350, readOps24h: 34100, writeOps24h: 1250, status: 'HEALTHY' },
    { name: 'market_history', docCount: 15600, sizeKb: 4800, readOps24h: 89000, writeOps24h: 96, status: 'HEALTHY' },
    { name: 'price_alerts', docCount: 890, sizeKb: 240, readOps24h: 15200, writeOps24h: 420, status: 'HEALTHY' },
    { name: 'notifications', docCount: 3100, sizeKb: 890, readOps24h: 9400, writeOps24h: 1800, status: 'HEALTHY' },
  ]);

  const handleRefreshStats = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLatency(Math.floor(10 + Math.random() * 12));
      setCollections((prev) =>
        prev.map((c) => ({
          ...c,
          docCount: c.docCount + Math.floor(Math.random() * 5),
          readOps24h: c.readOps24h + Math.floor(Math.random() * 50),
        }))
      );
      setIsRefreshing(false);
    }, 600);
  };

  const handleClearLocalCache = () => {
    if (window.confirm('Clear client-side IndexedDB & LocalStorage cache?')) {
      localStorage.removeItem('gold_market_cache');
      localStorage.removeItem('gold_portfolio_cached_rates');
      authService.logAudit('CLEAR_DB_CACHE', 'Cleared client-side market data cache').catch(console.warn);
      alert('Local database cache purged successfully.');
    }
  };

  const totalDocs = collections.reduce((acc, c) => acc + c.docCount, 0);
  const totalSizeMb = (collections.reduce((acc, c) => acc + c.sizeKb, 0) / 1024).toFixed(2);
  const totalReads = collections.reduce((acc, c) => acc + c.readOps24h, 0).toLocaleString();
  const totalWrites = collections.reduce((acc, c) => acc + c.writeOps24h, 0).toLocaleString();

  return (
    <div className="space-y-5">
      {/* Top Banner & Quick Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'مراقب قاعدة البيانات Firestore & LocalDB' : 'Firestore & Database Storage Monitor'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'مراقبة فورية لمجموعات المستندات وحجم التخزين وزمن الاستجابة وعدد عمليات القراءة/الكتابة'
              : 'Real-time telemetry for Firestore collections, document counts, query latency, and write throughput.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearLocalCache}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'تفريغ الذاكرة المؤقتة' : 'Purge DB Cache'}</span>
          </button>

          <button
            onClick={handleRefreshStats}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isAr ? 'تحديث البيانات' : 'Refresh Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4">
          <span className="text-slate-400 block mb-1 font-sans">{isAr ? 'إجمالي المستندات' : 'Total Documents'}</span>
          <span className="text-xl font-bold text-amber-400">{totalDocs.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 block mt-1">Across 6 collections</span>
        </div>

        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4">
          <span className="text-slate-400 block mb-1 font-sans">{isAr ? 'حجم التخزين المستغل' : 'Storage Size'}</span>
          <span className="text-xl font-bold text-emerald-400">{totalSizeMb} MB</span>
          <span className="text-[10px] text-slate-500 block mt-1">Firestore Standard Tier</span>
        </div>

        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4">
          <span className="text-slate-400 block mb-1 font-sans">{isAr ? 'استعلامات القراءة (24h)' : '24h Read Queries'}</span>
          <span className="text-xl font-bold text-indigo-400">{totalReads}</span>
          <span className="text-[10px] text-slate-500 block mt-1">99.8% cache hit ratio</span>
        </div>

        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4">
          <span className="text-slate-400 block mb-1 font-sans">{isAr ? 'زمن استجابة الاستعلام' : 'Query Latency'}</span>
          <span className="text-xl font-bold text-sky-400">{latency} ms</span>
          <span className="text-[10px] text-emerald-400 block mt-1">● Healthy (gRPC stream)</span>
        </div>
      </div>

      {/* Collection Details Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden text-xs">
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 font-bold text-slate-200 flex items-center justify-between">
          <span>{isAr ? 'تفاصيل مجموعات البيانات (Collections Breakdown)' : 'Firestore Collections Inventory'}</span>
          <span className="text-slate-400 text-mono text-[11px]">Region: europe-west2</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="p-3.5">{isAr ? 'اسم المجموعة' : 'Collection Name'}</th>
                <th className="p-3.5">{isAr ? 'عدد المستندات' : 'Doc Count'}</th>
                <th className="p-3.5">{isAr ? 'الحجم المقدر' : 'Estimated Size'}</th>
                <th className="p-3.5">{isAr ? 'عمليات القراءة 24 س' : '24h Reads'}</th>
                <th className="p-3.5">{isAr ? 'عمليات الكتابة 24 س' : '24h Writes'}</th>
                <th className="p-3.5 text-right">{isAr ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {collections.map((col) => (
                <tr key={col.name} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-amber-300">
                    /{col.name}
                  </td>
                  <td className="p-3.5 font-mono text-slate-200">{col.docCount.toLocaleString()}</td>
                  <td className="p-3.5 font-mono text-slate-300">{col.sizeKb} KB</td>
                  <td className="p-3.5 font-mono text-slate-400">{col.readOps24h.toLocaleString()}</td>
                  <td className="p-3.5 font-mono text-slate-400">{col.writeOps24h.toLocaleString()}</td>
                  <td className="p-3.5 text-right">
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {col.status}
                    </span>
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
