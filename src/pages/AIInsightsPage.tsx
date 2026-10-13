import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIRecommendationPanel } from '../components/widgets/AIRecommendationPanel';
import { AIPortfolioOptimizerWidget } from '../components/widgets/AIPortfolioOptimizerWidget';
import { AITaxZakatWidget } from '../components/widgets/AITaxZakatWidget';
import { AIRiskInflationWidget } from '../components/widgets/AIRiskInflationWidget';
import { AIScenariosReportWidget } from '../components/widgets/AIScenariosReportWidget';
import { AIInvestmentCoachWidget } from '../components/widgets/AIInvestmentCoachWidget';
import { AIForecastWidget } from '../components/widgets/AIForecastWidget';
import { Sparkles, Brain, PieChart, Calculator, ShieldAlert, FileText, Bot } from 'lucide-react';

export const AIInsightsPage: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'AR';

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'OPTIMIZER' | 'TAX_ZAKAT' | 'RISK_INFLATION' | 'REPORTS' | 'COACH'>('OVERVIEW');

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-[#0D1424] to-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-xl shadow-indigo-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-extrabold text-white">
              {isAr ? 'محرك الذكاء الاصطناعي المؤسسي المطور (Upgraded Enterprise AI Engine)' : 'Upgraded Enterprise AI Intelligence Hub'}
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {isAr
              ? 'توصيات الشراء/البيع، تحسين المحفظة، إعادة التوزيع الذاتي، خصم الزكاة، توقعات التضخم والمخاطر، كشف النظام الحاكم، والتقارير التنفيذية'
              : 'Full 12-module AI platform: Portfolio Optimization, Rebalancing, Tax/Zakat, Risk & Inflation, Regime Detection, Reports & Investment Coach'}
          </p>
        </div>

        <span className="text-xs font-bold font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          GEMINI 3.6 FLASH ENABLED
        </span>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 bg-[#0D1424] p-1.5 rounded-xl border border-slate-800 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'OVERVIEW' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Brain className="w-4 h-4 text-amber-400" />
          <span>{isAr ? 'التوصيات وشجرة التفسير' : 'Signals & Explainability'}</span>
        </button>

        <button
          onClick={() => setActiveTab('OPTIMIZER')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'OPTIMIZER' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <PieChart className="w-4 h-4 text-emerald-400" />
          <span>{isAr ? 'تحسين المحفظة والتوزيع' : 'Optimization & Rebalance'}</span>
        </button>

        <button
          onClick={() => setActiveTab('TAX_ZAKAT')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'TAX_ZAKAT' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4 text-indigo-400" />
          <span>{isAr ? 'الزكاة والدرع الضريبي' : 'Tax & Zakat Engine'}</span>
        </button>

        <button
          onClick={() => setActiveTab('RISK_INFLATION')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'RISK_INFLATION' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>{isAr ? 'توقعات التضخم والمخاطر' : 'Risk & Inflation Forecast'}</span>
        </button>

        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'REPORTS' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-300" />
          <span>{isAr ? 'السيناريوهات والتقارير' : 'Scenarios & Reports'}</span>
        </button>

        <button
          onClick={() => setActiveTab('COACH')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'COACH' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4 text-cyan-400" />
          <span>{isAr ? 'المستشار الاستثماري' : 'Investment Coach'}</span>
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6 animate-fadeIn">
          <AIRecommendationPanel />
          <AIForecastWidget />
        </div>
      )}

      {activeTab === 'OPTIMIZER' && (
        <div className="animate-fadeIn">
          <AIPortfolioOptimizerWidget />
        </div>
      )}

      {activeTab === 'TAX_ZAKAT' && (
        <div className="animate-fadeIn">
          <AITaxZakatWidget />
        </div>
      )}

      {activeTab === 'RISK_INFLATION' && (
        <div className="animate-fadeIn">
          <AIRiskInflationWidget />
        </div>
      )}

      {activeTab === 'REPORTS' && (
        <div className="animate-fadeIn">
          <AIScenariosReportWidget />
        </div>
      )}

      {activeTab === 'COACH' && (
        <div className="animate-fadeIn">
          <AIInvestmentCoachWidget />
        </div>
      )}
    </div>
  );
};
