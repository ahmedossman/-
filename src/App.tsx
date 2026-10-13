import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SocketProvider } from './context/SocketContext';
import { TerminalHeader } from './components/layout/TerminalHeader';
import { NavigationSidebar } from './components/layout/NavigationSidebar';
import { MarketTickerBanner } from './components/layout/MarketTickerBanner';
import { TransactionModal } from './components/modals/TransactionModal';

import { DashboardPage } from './pages/DashboardPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { GoldPricesPage } from './pages/GoldPricesPage';
import { HistoricalAnalysisPage } from './pages/HistoricalAnalysisPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { ForecastPage } from './pages/ForecastPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { EconomicCalendarPage } from './pages/EconomicCalendarPage';
import { NewsPage } from './pages/NewsPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPanelPage } from './pages/AdminPanelPage';

function AppContent() {
  const { activePage } = useApp();
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage onOpenBuyModal={() => setIsBuyModalOpen(true)} />;
      case 'portfolio':
        return <PortfolioPage onOpenBuyModal={() => setIsBuyModalOpen(true)} />;
      case 'gold_prices':
        return <GoldPricesPage />;
      case 'historical':
        return <HistoricalAnalysisPage />;
      case 'comparison':
        return <ComparisonPage />;
      case 'forecast':
        return <ForecastPage />;
      case 'ai_insights':
        return <AIInsightsPage />;
      case 'economic_calendar':
        return <EconomicCalendarPage />;
      case 'news':
        return <NewsPage />;
      case 'calculator':
        return <CalculatorPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'admin':
        return <AdminPanelPage />;
      default:
        return <DashboardPage onOpenBuyModal={() => setIsBuyModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MarketTickerBanner />
      <TerminalHeader onOpenBuyModal={() => setIsBuyModalOpen(true)} />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <NavigationSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      <TransactionModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </AppProvider>
  );
}
