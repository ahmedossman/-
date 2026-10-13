import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { aiPlatform } from '../../services/aiPlatform';
import { PortfolioOptimizationResult, RebalanceTradeStep } from '../../types';
import { PieChart, Sliders, ArrowRightLeft, CheckCircle2, ShieldCheck, Zap, PlusCircle } from 'lucide-react';

export const AIPortfolioOptimizerWidget: React.FC = () => {
  const { holdings, marketData, language, addHolding } = useApp();
  const isAr = language === 'AR';

  const [riskProfile, setRiskProfile] = useState<'WEALTH_PRESERVATION' | 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE'>('WEALTH_PRESERVATION');
  const [optResult, setOptResult] = useState<PortfolioOptimizationResult | null>(null);
  const [executedSteps, setExecutedSteps] = useState<string[]>([]);

  useEffect(() => {
    async function loadOptimization() {
      const res = await aiPlatform.optimizePortfolio(holdings, marketData, riskProfile);
      setOptResult(res);
    }
    loadOptimization();
  }, [holdings, marketData, riskProfile]);

  const handleExecuteStep = (step: RebalanceTradeStep) => {
    if (step.action === 'BUY' && step.asset.includes('Gold')) {
      // Execute automatic rebalance step by adding holding
      const gold21k = marketData?.gold21kEGP || 4191;
      addHolding({
        id: `reb-${Date.now()}`,
        assetType: 'GOLD',
        purity: '21K',
        name: 'Auto-Rebalanced Gold 21K Ingot',
        weightGrams: step.quantityOrGrams,
        quantity: step.quantityOrGrams,
        purchasePriceEGP: gold21k,
        currentPriceEGP: gold21k,
        totalCostEGP: step.estimatedEGP,
        currentValueEGP: step.estimatedEGP,
        totalProfitLossEGP: 0,
        returnPercentage: 0,
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: `Executed via AI Auto-Rebalancing Engine: ${step.reason}`,
      });
    }
    setExecutedSteps((prev) => [...prev, step.id]);
  };

  if (!optResult) return null;

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">
              {isAr ? 'تحسين المحفظة وإعادة التوزيع الذاتي (Portfolio Optimization & Auto-Rebalancing)' : 'AI Portfolio Optimization & Auto-Rebalancing'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'نماذج خوارزمية لتوزيع الأصول وإعادة التوازن الفوري لمواجهة التضخم' : 'Automated asset allocation model & execution engine for inflation defense'}
            </p>
          </div>
        </div>

        {/* Risk Profile Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto text-xs font-semibold">
          {(['WEALTH_PRESERVATION', 'CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'] as const).map((profile) => (
            <button
              key={profile}
              onClick={() => setRiskProfile(profile)}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                riskProfile === profile ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {profile.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Target Allocation Grid */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-300 block">
          {isAr ? 'التوزيع المستهدف مقابل الوضع الحالي:' : 'Target Asset Allocation Benchmarks:'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {optResult.targetAllocation.map((item, idx) => (
            <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-sans text-[11px] truncate">{isAr ? item.assetAr : item.asset}</span>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              </div>
              <span className="text-white font-extrabold text-base block">{item.percentage}%</span>
              <span className="text-[10px] text-slate-500 block font-sans">Target Allocation</span>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p>{isAr ? optResult.explanationAr : optResult.explanation}</p>
      </div>

      {/* Automatic Rebalancing Action Engine */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-sm text-white flex items-center gap-1.5">
            <ArrowRightLeft className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'خطوات إعادة التوزيع التلقائي (Automatic Rebalance Steps)' : 'AI Automatic Rebalancing Engine'}</span>
          </span>
          <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
            {optResult.rebalanceSteps.length} ACTIONS READY
          </span>
        </div>

        {optResult.rebalanceSteps.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            {isAr ? 'محفظتك الحالية متوافقة تماماً مع أهداف توزيع الأصول.' : 'Your portfolio is currently optimal and matches all target allocation thresholds.'}
          </p>
        ) : (
          <div className="space-y-2">
            {optResult.rebalanceSteps.map((step) => {
              const isDone = executedSteps.includes(step.id);
              return (
                <div key={step.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] ${step.action === 'BUY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                        {step.action}
                      </span>
                      <span className="font-extrabold text-white text-sm">{isAr ? step.assetAr : step.asset}</span>
                      <span className="text-slate-400 font-mono">({step.quantityOrGrams} units / ~{step.estimatedEGP.toLocaleString()} EGP)</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{isAr ? step.reasonAr : step.reason}</p>
                  </div>

                  <button
                    onClick={() => handleExecuteStep(step)}
                    disabled={isDone}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-all ${
                      isDone
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{isAr ? 'تم التنفيذ' : 'Executed'}</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4" />
                        <span>{isAr ? 'تنفيذ خطوة التوزيع' : 'Execute Step'}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
