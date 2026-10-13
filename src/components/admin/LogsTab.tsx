import React, { useState, useEffect } from 'react';
import { AuditLogEntry, authService } from '../../services/authService';
import { Shield, Search, Filter, Download, Trash2, CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export const LogsTab: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO'>('ALL');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const loadLogs = () => {
      authService.fetchAuditLogs().then(setLogs).catch(console.warn);
    };
    loadLogs();
    if (autoRefresh) {
      const timer = setInterval(loadLogs, 4000);
      return () => clearInterval(timer);
    }
  }, [autoRefresh]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSev = severityFilter === 'ALL' || log.status === severityFilter;
    return matchesSearch && matchesSev;
  });

  const handleExportLogsCSV = () => {
    const headers = ['ID', 'Timestamp', 'User Email', 'Action', 'Status', 'Details'];
    const rows = filteredLogs.map((l) => [
      l.id || '',
      l.timestamp,
      l.userEmail,
      l.action,
      l.status,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `security_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> SUCCESS
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" /> WARNING
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertOctagon className="w-3 h-3" /> ERROR
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Info className="w-3 h-3" /> INFO
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Action Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={isAr ? 'تصفية بالتفاصيل أو البريد أو الإجراء...' : 'Filter logs by details, email, action...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500"
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 font-bold"
          >
            <option value="ALL">{isAr ? 'جميع الحالات' : 'All Severities'}</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer font-sans">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-amber-500"
            />
            <span>{isAr ? 'تحديث تلقائي (4ث)' : 'Auto Live Stream'}</span>
          </label>

          <button
            onClick={handleExportLogsCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'تصدير CSV' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden text-xs">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-950/90 backdrop-blur z-10">
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="p-3.5">{isAr ? 'الوقت' : 'Timestamp'}</th>
                <th className="p-3.5">{isAr ? 'المستخدم' : 'Operator Email'}</th>
                <th className="p-3.5">{isAr ? 'الإجراء' : 'System Action'}</th>
                <th className="p-3.5">{isAr ? 'التفاصيل' : 'Audit Log Message'}</th>
                <th className="p-3.5 text-right">{isAr ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-sans">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <span>{isAr ? 'لا توجد سجلات أمنية مطابقة لفلتر البحث' : 'No audit records match current criteria.'}</span>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="p-3.5 text-amber-300 font-bold whitespace-nowrap">{log.userEmail}</td>

                    <td className="p-3.5 text-slate-200 font-bold">{log.action}</td>

                    <td className="p-3.5 text-slate-300 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">{getStatusBadge(log.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
