import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchAISignals } from '../../services/apiClient';
import { AISignal } from '../../types';
import { Sparkles, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AIWidgetBar: React.FC = () => {
  const { setActivePage, language } = useApp();
  const isAr = language === 'AR';

  const [signal, setSignal] = useState<AISignal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchAISignals('1W').then((res) => {
      if (mounted) {
        setSignal(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !signal) {
    return (
      <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-4 animate-pulse flex items-center justify-between text-xs text-indigo-300">
        <span>{isAr ? 'جاري استدعاء توصيات محرك الذكاء الاصطناعي Gemini...' : 'Querying Gemini AI Investment Engine...'}</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-950/80 via-[#0D1424] to-slate-900 border border-indigo-500/30 rounded-xl p-4 shadow-lg shadow-indigo-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex-shrink-0">
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white">
              {isAr ? 'توصية Gemini AI المباشرة:' : 'Gemini AI Investment Signal:'}
            </span>
            <span className="font-extrabold text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded">
              {signal.goldSignal} ({signal.confidenceScore}% {isAr ? 'ثقة' : 'Confidence'})
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
            {signal.summary}
          </p>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono mt-1.5">
            <span>{isAr ? 'المستهدف:' : 'Target:'} <strong className="text-amber-400">{signal.targetPrice21kEGP} EGP</strong></span>
            <span>{isAr ? 'وقف الخسارة:' : 'Stop Loss:'} <strong className="text-rose-400">{signal.stopLoss21kEGP} EGP</strong></span>
            <span>{isAr ? 'درجة المخاطرة:' : 'Risk:'} <strong className="text-indigo-300">{signal.riskRating}</strong></span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setActivePage('ai_insights')}
        className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all flex-shrink-0 cursor-pointer shadow-md shadow-indigo-600/30"
      >
        <span>{isAr ? 'استعراض تقرير AI الكامل' : 'Open Full AI Report'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
