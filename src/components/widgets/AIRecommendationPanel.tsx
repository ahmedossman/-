import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Brain,
  Zap,
  Target,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  HelpCircle,
  Activity,
  Layers,
  Info
} from 'lucide-react';
import { aiPlatform } from '../../services/aiPlatform';

export const AIRecommendationPanel: React.FC<{ onOpenBuyModal?: () => void }> = ({ onOpenBuyModal }) => {
  const { language, marketData } = useApp();
  const isAr = language === 'AR';

  const [showExplainability, setShowExplainability] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [showConfidenceDetails, setShowConfidenceDetails] = useState(false);

  const signal = aiPlatform.getDetailedAISignal(marketData);
  const regimeInfo = aiPlatform.getMarketRegimeInfo(marketData);

  return (
    <div className="bg-gradient-to-br from-[#0D1424] via-[#10192e] to-amber-950/20 border border-amber-500/30 rounded-xl p-5 select-none space-y-4 relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base text-white">
                {isAr ? 'محرك الذكاء الاصطناعي المؤسسي للذهب (Gemini Bullion Engine)' : 'Gemini Institutional Bullion Engine'}
              </h3>
              
              {/* Confidence Score Badge */}
              <button
                onClick={() => setShowConfidenceDetails(!showConfidenceDetails)}
                className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-mono flex items-center gap-1 hover:bg-amber-400 transition-all cursor-pointer"
                title="Click for confidence score breakdown"
              >
                <span>{signal.confidenceScore}% CONFIDENCE</span>
                {showConfidenceDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr ? 'تحليل لحظي لأسعار الصاغة وسعر الصرف الموازي ومعدل التضخم' : 'Automated multi-variable macro signal & target pricing model'}
            </p>
          </div>
        </div>

        {/* Signal & Regime Badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Active Regime Tag */}
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
              {isAr ? 'النظام الاقتصادي الحاكم' : 'Market Regime'}
            </span>
            <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded inline-block mt-0.5">
              {regimeInfo.activeRegimeId.replace('REGIME_', '')}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
              {isAr ? 'التوصية الحالية' : 'Current Signal'}
            </span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono tracking-wide px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-lg inline-block mt-0.5">
              {signal.goldSignal.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Confidence Breakdown Panel (Expandable) */}
      {showConfidenceDetails && signal.confidenceBreakdown && (
        <div className="bg-slate-900/90 p-3.5 rounded-xl border border-amber-500/30 space-y-2 animate-fadeIn text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'تفاصيل درجة الثقة الذكية (Confidence Score Decomposition)' : 'AI Confidence Score Breakdown'}</span>
            </span>
            <span className="font-mono text-amber-400 font-extrabold">{signal.confidenceScore} / 100</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">{isAr ? 'جودة البيانات' : 'Data Streams'}</span>
              <span className="text-emerald-400 font-extrabold">{signal.confidenceBreakdown.dataStreamQuality}%</span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">{isAr ? 'تطابق النماذج' : 'Model Concurrence'}</span>
              <span className="text-emerald-400 font-extrabold">{signal.confidenceBreakdown.modelConcurrence}%</span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">{isAr ? 'اختبار الأداء التاريخي' : 'Backtest Score'}</span>
              <span className="text-indigo-400 font-extrabold">{signal.confidenceBreakdown.historicalBacktest}%</span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">{isAr ? 'استقرار النظام الاقتصادي' : 'Regime Stability'}</span>
              <span className="text-amber-400 font-extrabold">{signal.confidenceBreakdown.macroRegimeStability}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Targets & Pricing Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[11px] block">{isAr ? 'السعر المستهدف (21K)' : 'Target Price (21K)'}</span>
          <span className="text-emerald-400 font-extrabold text-sm">{signal.targetPrice21kEGP.toLocaleString()} EGP</span>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[11px] block">{isAr ? 'حد إيقاف الخسارة' : 'Stop-Loss (21K)'}</span>
          <span className="text-rose-400 font-extrabold text-sm">{signal.stopLoss21kEGP.toLocaleString()} EGP</span>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[11px] block">{isAr ? 'مستوى المخاطرة' : 'Risk Category'}</span>
          <span className="text-amber-400 font-extrabold text-sm">{signal.riskRating}</span>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'ملخص التحليل الفني والكلي' : 'AI Analysis Summary'}</span>
          </p>

          <button
            onClick={() => setShowExplainability(!showExplainability)}
            className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer underline decoration-dotted"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isAr ? (showExplainability ? 'إخفاء شجرة التفسير' : 'شجرة التفسير والوزن النسبي') : (showExplainability ? 'Hide Explainability' : 'Explainability Tree')}</span>
          </button>
        </div>

        <p>{isAr ? signal.summaryAr || signal.summary : signal.summary}</p>

        {/* Explainability Tree Breakdown */}
        {showExplainability && signal.explainabilityTree && (
          <div className="pt-2 border-t border-slate-800 space-y-2 animate-fadeIn text-xs">
            <span className="text-slate-400 font-bold block">{isAr ? 'عوامل القرار والأوزان النسبية (Explainability Factor Breakdown):' : 'Factor Breakdown & Impact Weights:'}</span>
            <div className="space-y-2">
              {signal.explainabilityTree.map((factor, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{isAr ? factor.factorAr : factor.factor}</span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-amber-400 font-bold">Weight: {factor.weightPercent}%</span>
                      <span className={`px-1.5 py-0.5 rounded ${factor.impactScore > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        Impact: {factor.impactScore > 0 ? `+${factor.impactScore}` : factor.impactScore}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{isAr ? factor.descriptionAr : factor.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Verified Source References */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
        <button
          onClick={() => setShowSources(!showSources)}
          className="text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer font-medium"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isAr ? 'المراجع والمصادر الرسمية المعتمدة (4 مصادر)' : 'Verified Market Sources & Data Feeds'}</span>
          {showSources ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {onOpenBuyModal && (
          <button
            onClick={onOpenBuyModal}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-1 transition-all"
          >
            <span>{isAr ? 'تنفيذ واستثمار الآن' : 'Execute AI Strategy'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Source References Drawer */}
      {showSources && signal.sourceReferences && (
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-2 animate-fadeIn">
          <span className="text-slate-400 font-bold block">{isAr ? 'المصادر والبيانات المستخدمة في التوليد:' : 'Verified Data Streams & Reference Citations:'}</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {signal.sourceReferences.map((src, idx) => (
              <div key={idx} className="bg-slate-900 p-2 rounded-lg border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300 text-[11px]">{src.publisher}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{src.verifiedAt}</span>
                </div>
                <p className="text-white font-medium text-[11px]">{src.title}</p>
                <p className="text-[10px] text-slate-400 italic">{src.relevanceNote}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
