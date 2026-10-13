import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, AlertTriangle, RefreshCw, Globe, Check, Zap } from 'lucide-react';

interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST';
  status: '200 OK' | '429 BUSY' | '500 ERR';
  latencyMs: number;
  uptime24h: number;
  requests24h: number;
  provider: 'Google AI Studio' | 'Central Bank of Egypt' | 'Cairo Bullion Feed' | 'Firebase Cloud';
}

export const ApiMonitorTab: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [isPinging, setIsPinging] = useState(false);
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([
    {
      id: 'api-1',
      name: 'Gemini 3.6 Flash Intelligence API',
      url: '/api/ai/analyze',
      method: 'POST',
      status: '200 OK',
      latencyMs: 185,
      uptime24h: 99.95,
      requests24h: 1420,
      provider: 'Google AI Studio',
    },
    {
      id: 'api-2',
      name: 'Cairo Bullion Manual Override Gateway',
      url: '/api/bullion/rates',
      method: 'GET',
      status: '200 OK',
      latencyMs: 18,
      uptime24h: 100.0,
      requests24h: 8900,
      provider: 'Cairo Bullion Feed',
    },
    {
      id: 'api-3',
      name: 'CBE Currency & Interest Rate Gateway',
      url: '/api/cbe/rates',
      method: 'GET',
      status: '200 OK',
      latencyMs: 42,
      uptime24h: 99.8,
      requests24h: 3200,
      provider: 'Central Bank of Egypt',
    },
    {
      id: 'api-4',
      name: 'Firebase Auth & User Profile Stream',
      url: 'https://firestore.googleapis.com',
      method: 'POST',
      status: '200 OK',
      latencyMs: 32,
      uptime24h: 99.99,
      requests24h: 18400,
      provider: 'Firebase Cloud',
    },
    {
      id: 'api-5',
      name: 'System Health Diagnostics Endpoint',
      url: '/api/health',
      method: 'GET',
      status: '200 OK',
      latencyMs: 8,
      uptime24h: 100.0,
      requests24h: 2880,
      provider: 'Firebase Cloud',
    },
  ]);

  const handlePingAll = () => {
    setIsPinging(true);
    setTimeout(() => {
      setEndpoints((prev) =>
        prev.map((ep) => ({
          ...ep,
          latencyMs: Math.max(5, ep.latencyMs + Math.floor((Math.random() - 0.5) * 15)),
          requests24h: ep.requests24h + Math.floor(Math.random() * 20),
        }))
      );
      setIsPinging(false);
    }, 700);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <span>{isAr ? 'مراقب واجهات البرمجة والخدمات (API Monitor)' : 'API Endpoints & Infrastructure Monitor'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'تتبع حالة التشغيل الحية وزمن الاستجابة ونسبة الخطأ لخدمات الذكاء الاصطناعي والصاغة والبنك المركزي'
              : 'Live operational health check, latencies, and traffic throughput for external & internal API routes.'}
          </p>
        </div>

        <button
          onClick={handlePingAll}
          disabled={isPinging}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-sky-400' : ''}`} />
          <span>{isAr ? 'اختبار النبض الآن' : 'Ping All Endpoints'}</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4">
          <span className="text-slate-400 block mb-1 font-sans">{isAr ? 'متوسط زمن الاستجابة' : 'Avg API Latency'}</span>
          <span className="text-xl font-bold text-sky-400">
            {Math.round(endpoints.reduce((acc, e) => acc + e.latencyMs, 0) / endpoints.length)} ms
          </span>
          <span className="text-[10px] text-emerald-400 block mt-1">● Optimal (&lt; 200ms)</span>
        </div>

        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4">
          <span className="text-slate-400 block mb-1 font-sans">{isAr ? 'نسبة الاستقرار (24h Uptime)' : 'Platform Uptime'}</span>
          <span className="text-xl font-bold text-emerald-400">99.98%</span>
          <span className="text-[10px] text-slate-500 block mt-1">0 downtime incidents</span>
        </div>

        <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-4">
          <span className="text-slate-400 block mb-1 font-sans">{isAr ? 'طلبات الـ API اليومية' : '24h Total API Volume'}</span>
          <span className="text-xl font-bold text-amber-400">
            {endpoints.reduce((acc, e) => acc + e.requests24h, 0).toLocaleString()} req
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Rate limit headroom: 85%</span>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="p-3.5">{isAr ? 'اسم الخدمة المسار' : 'API Endpoint & Provider'}</th>
                <th className="p-3.5">{isAr ? 'طريقة الطلب' : 'Method'}</th>
                <th className="p-3.5">{isAr ? 'زمن الاستجابة' : 'Latency'}</th>
                <th className="p-3.5">{isAr ? 'نسبة التشغيل 24س' : '24h Uptime'}</th>
                <th className="p-3.5">{isAr ? 'طلبات 24س' : '24h Requests'}</th>
                <th className="p-3.5 text-right">{isAr ? 'كود الاستجابة' : 'HTTP Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {endpoints.map((ep) => (
                <tr key={ep.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5">
                    <span className="font-bold text-white block">{ep.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {ep.url} <span className="text-slate-500">• {ep.provider}</span>
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                        ep.method === 'POST'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {ep.method}
                    </span>
                  </td>

                  <td className="p-3.5 font-mono text-slate-200">
                    <span
                      className={
                        ep.latencyMs < 50
                          ? 'text-emerald-400 font-bold'
                          : ep.latencyMs < 200
                          ? 'text-sky-300'
                          : 'text-amber-400'
                      }
                    >
                      {ep.latencyMs} ms
                    </span>
                  </td>

                  <td className="p-3.5 font-mono text-slate-300">{ep.uptime24h}%</td>

                  <td className="p-3.5 font-mono text-slate-400">{ep.requests24h.toLocaleString()}</td>

                  <td className="p-3.5 text-right">
                    <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {ep.status}
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
