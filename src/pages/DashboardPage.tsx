import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FinancialKPIWidget } from '../components/widgets/FinancialKPIWidget';
import { PortfolioPerformanceChart } from '../components/widgets/PortfolioPerformanceChart';
import { TradingViewCandlestickChart } from '../components/widgets/TradingViewCandlestickChart';
import { AdvancedTechnicalChart } from '../components/charts/AdvancedTechnicalChart';
import { BacktestWidget } from '../components/backtesting/BacktestWidget';
import { ScenarioSimulatorWidget } from '../components/simulation/ScenarioSimulatorWidget';
import { AssetAllocationWidget } from '../components/widgets/AssetAllocationWidget';
import { AIRecommendationPanel } from '../components/widgets/AIRecommendationPanel';
import { WatchlistWidget } from '../components/widgets/WatchlistWidget';
import { EconomicCalendarWidget } from '../components/widgets/EconomicCalendarWidget';
import { RecentTransactionsWidget } from '../components/widgets/RecentTransactionsWidget';
import { LatestNewsPanel } from '../components/widgets/LatestNewsPanel';
import { MarketMoversWidget } from '../components/widgets/MarketMoversWidget';
import { RiskDashboardWidget } from '../components/widgets/RiskDashboardWidget';
import { PerformanceTimelineWidget } from '../components/widgets/PerformanceTimelineWidget';
import { GoldHistoricalWidget } from '../components/widgets/GoldHistoricalWidget';
import { AIForecastWidget } from '../components/widgets/AIForecastWidget';
import { CurrencyComparisonWidget } from '../components/widgets/CurrencyComparisonWidget';
import { GoldVsUsdWidget } from '../components/widgets/GoldVsUsdWidget';
import { GoldVsCertificatesWidget } from '../components/widgets/GoldVsCertificatesWidget';
import { GoldVsBitcoinWidget } from '../components/widgets/GoldVsBitcoinWidget';
import { HeatmapWidget } from '../components/widgets/HeatmapWidget';
import { LayoutGrid, Layers, LineChart, Sparkles, ShieldCheck } from 'lucide-react';

export const DashboardPage: React.FC<{ onOpenBuyModal: () => void }> = ({ onOpenBuyModal }) => {
  const { language } = useApp();
  const isAr = language === 'AR';

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CHARTS' | 'MACRO' | 'ANALYTICS'>('OVERVIEW');

  return (
    <div className="space-y-6">
      {/* Financial KPI Top Bar */}
      <FinancialKPIWidget />

      {/* Terminal View Mode Tabs */}
      <div className="flex items-center gap-1 bg-[#0D1424] p-1.5 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'OVERVIEW'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>{isAr ? 'لوحة القيادة الإجمالية Terminal' : 'Terminal Executive Overview'}</span>
        </button>

        <button
          onClick={() => setActiveTab('CHARTS')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'CHARTS'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LineChart className="w-4 h-4" />
          <span>{isAr ? 'الرسوم البيانية والشمعات' : 'Candlesticks & Technical Charts'}</span>
        </button>

        <button
          onClick={() => setActiveTab('MACRO')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'MACRO'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{isAr ? 'التقويم والأخبار الكلية' : 'Macro & Calendar Intel'}</span>
        </button>

        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'ANALYTICS'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAr ? 'المخاطر والتوقعات والذكاء' : 'Risk & AI Projections'}</span>
        </button>
      </div>

      {/* Tab 1: Executive Overview */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* AI Recommendation Engine */}
          <AIRecommendationPanel onOpenBuyModal={onOpenBuyModal} />

          {/* Main Chart Row: Performance + Asset Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PortfolioPerformanceChart />
            </div>
            <div>
              <AssetAllocationWidget />
            </div>
          </div>

          {/* Scenario Stress Simulator */}
          <ScenarioSimulatorWidget />

          {/* Watchlist + Market Movers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WatchlistWidget />
            </div>
            <div>
              <MarketMoversWidget />
            </div>
          </div>

          {/* Recent Transactions */}
          <RecentTransactionsWidget />
        </div>
      )}

      {/* Tab 2: Candlesticks & Technical Charts */}
      {activeTab === 'CHARTS' && (
        <div className="space-y-6">
          <AdvancedTechnicalChart />
          <TradingViewCandlestickChart />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PortfolioPerformanceChart />
            <HeatmapWidget />
          </div>
          <GoldHistoricalWidget />
        </div>
      )}

      {/* Tab 3: Macro & Calendar Intel */}
      {activeTab === 'MACRO' && (
        <div className="space-y-6">
          <EconomicCalendarWidget />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LatestNewsPanel />
            <PerformanceTimelineWidget />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CurrencyComparisonWidget />
            <GoldVsUsdWidget />
          </div>
        </div>
      )}

      {/* Tab 4: Risk & AI Projections */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <RiskDashboardWidget />
          <BacktestWidget />
          <AIForecastWidget />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GoldVsCertificatesWidget />
            <GoldVsBitcoinWidget />
          </div>
        </div>
      )}
    </div>
  );
};
