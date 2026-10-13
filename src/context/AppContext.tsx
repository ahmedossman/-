import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { calculateRiskMetrics } from '../services/financialEngine';
import {
  INITIAL_GOLD_PRICE_FEED,
  INITIAL_HOLDINGS,
  INITIAL_TRANSACTIONS,
} from '../services/goldService';
import { firestoreService } from '../services/firestoreService';
import { authService } from '../services/authService';
import { marketDataLayer } from '../services/marketDataProvider';
import {
  AppLanguage,
  AppNotification,
  AppTheme,
  GoldPriceFeed,
  PortfolioHolding,
  RiskMetrics,
  Transaction,
  UserRole,
} from '../types';

export type MarketConnectionStatus = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED' | 'DEGRADED';

interface AppContextType {
  language: AppLanguage;
  theme: AppTheme;
  role: UserRole;
  activePage: string;
  marketData: GoldPriceFeed;
  marketConnectionStatus: MarketConnectionStatus;
  holdings: PortfolioHolding[];
  transactions: Transaction[];
  riskMetrics: RiskMetrics;
  notifications: AppNotification[];
  setActivePage: (page: string) => void;
  setLanguage: (lang: AppLanguage) => void;
  setTheme: (theme: AppTheme) => void;
  setRole: (role: UserRole) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  addHolding: (holding: PortfolioHolding) => void;
  deleteHolding: (id: string) => void;
  updateMarketPrices: (updated: Partial<GoldPriceFeed>) => void;
  setMarketConnectionStatus: (status: MarketConnectionStatus) => void;
  markNotificationRead: (id: string) => void;
  refreshMarketFeed: () => Promise<void>;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>('EN');
  const [theme, setThemeState] = useState<AppTheme>('DARK');
  const [role, setRole] = useState<UserRole>('INVESTOR');
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [marketConnectionStatus, setMarketConnectionStatus] = useState<MarketConnectionStatus>('CONNECTING');

  const [marketData, setMarketData] = useState<GoldPriceFeed>(INITIAL_GOLD_PRICE_FEED);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(() => {
    const saved = localStorage.getItem('gold_hub_holdings');
    return saved ? JSON.parse(saved) : INITIAL_HOLDINGS;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('gold_hub_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Gold 21K Price Alert',
      message: 'Gold 21K traded up +1.2% to 4,191 EGP/gram following global spot gains ($2,980/oz).',
      type: 'PRICE_ALERT',
      read: false,
      timestamp: '10 minutes ago',
    },
    {
      id: 'notif-2',
      title: 'AI Buy Signal Generated',
      message: 'Gemini AI Investment Engine generated a BUY signal for 24K Ingots with 85% confidence.',
      type: 'AI_SIGNAL',
      read: false,
      timestamp: '1 hour ago',
    },
  ]);

  // Recalculate Risk Metrics whenever holdings or marketData change
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>(() =>
    calculateRiskMetrics(holdings, transactions, marketData.gold21kEGP)
  );

  const isFetchingRef = useRef(false);

  const refreshMarketFeed = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const { feed } = await marketDataLayer.getMarketFeed(true);
      if (feed) {
        updateMarketPrices(feed);
      }
    } catch (e) {
      console.warn('Network refresh error, marking data as delayed:', e);
      setMarketData((prev) => ({
        ...prev,
        isDataDelayed: true,
      }));
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    // Initial fetch of market data on mount
    refreshMarketFeed();

    // 5-second polling interval for live market updates
    const pollInterval = setInterval(() => {
      refreshMarketFeed();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    // Sync current live prices to holdings
    const updatedHoldings = holdings.map((h) => {
      let currentPrice = h.currentPriceEGP;
      if (h.assetType === 'GOLD') {
        if (h.purity === '24K' || h.purity === 'BAR_24K') currentPrice = marketData.gold24kEGP;
        else if (h.purity === '21K' || h.purity === 'SOVEREIGN_COIN') currentPrice = marketData.gold21kEGP;
        else if (h.purity === '18K') currentPrice = marketData.gold18kEGP;
      } else if (h.assetType === 'USD_CASH') {
        currentPrice = marketData.usdEgpOfficial;
      }

      const totalCost = h.totalCostEGP;
      const totalQty = h.weightGrams || h.quantity || 1;
      const currentValue = currentPrice * totalQty;
      const profitLoss = currentValue - totalCost;
      const returnPct = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

      return {
        ...h,
        currentPriceEGP: currentPrice,
        currentValueEGP: currentValue,
        totalProfitLossEGP: profitLoss,
        returnPercentage: Math.round(returnPct * 100) / 100,
      };
    });

    const newMetrics = calculateRiskMetrics(updatedHoldings, transactions, marketData.gold21kEGP);
    setRiskMetrics(newMetrics);
    localStorage.setItem('gold_hub_holdings', JSON.stringify(updatedHoldings));
    
    // Push updated holdings to Firestore for current user
    const user = authService.getCurrentUser();
    if (user?.uid) {
      firestoreService.saveHoldings(user.uid, updatedHoldings).catch(console.warn);
    }
  }, [marketData]);

  useEffect(() => {
    localStorage.setItem('gold_hub_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Language switch handler (updates HTML dir attribute for RTL support)
  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    document.documentElement.setAttribute('dir', lang === 'AR' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang === 'AR' ? 'ar' : 'en');
  };

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
  };

  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
    };

    const newTxList = [newTx, ...transactions];
    setTransactions(newTxList);

    // Sync to Firestore
    const user = authService.getCurrentUser();
    if (user?.uid) {
      firestoreService.saveTransaction(user.uid, newTx).catch(console.warn);
      firestoreService.logAuditEvent(user.uid, 'ADD_TRANSACTION', `Added transaction ${newTx.id} (${newTx.type} ${newTx.assetType})`).catch(console.warn);
    }

    // Update holdings accordingly
    if (newTx.assetType === 'GOLD') {
      const existingHoldingIndex = holdings.findIndex(
        (h) => h.assetType === 'GOLD' && h.purity === newTx.purity
      );

      if (existingHoldingIndex >= 0 && newTx.type === 'BUY') {
        const existing = holdings[existingHoldingIndex];
        const addedGrams = newTx.weightGrams || 0;
        const addedCost = newTx.totalAmountEGP;
        const totalGrams = (existing.weightGrams || 0) + addedGrams;
        const totalCost = existing.totalCostEGP + addedCost;
        const avgPrice = totalCost / (totalGrams || 1);

        let currentPrice = marketData.gold21kEGP;
        if (newTx.purity === '24K' || newTx.purity === 'BAR_24K') currentPrice = marketData.gold24kEGP;
        else if (newTx.purity === '18K') currentPrice = marketData.gold18kEGP;

        const currentValue = currentPrice * totalGrams;
        const updatedHolding: PortfolioHolding = {
          ...existing,
          weightGrams: totalGrams,
          totalCostEGP: totalCost,
          purchasePriceEGP: Math.round(avgPrice),
          currentValueEGP: currentValue,
          totalProfitLossEGP: currentValue - totalCost,
          returnPercentage: Math.round(((currentValue - totalCost) / totalCost) * 10000) / 100,
        };

        const updatedHoldingsList = [...holdings];
        updatedHoldingsList[existingHoldingIndex] = updatedHolding;
        setHoldings(updatedHoldingsList);
      } else if (newTx.type === 'BUY') {
        // Create new holding entry
        let currentPrice = marketData.gold21kEGP;
        if (newTx.purity === '24K' || newTx.purity === 'BAR_24K') currentPrice = marketData.gold24kEGP;
        else if (newTx.purity === '18K') currentPrice = marketData.gold18kEGP;

        const grams = newTx.weightGrams || 10;
        const totalCost = newTx.totalAmountEGP;
        const currentValue = currentPrice * grams;

        const newHolding: PortfolioHolding = {
          id: `hold-${Date.now()}`,
          assetType: 'GOLD',
          purity: newTx.purity || '21K',
          name: `Egyptian Gold ${newTx.purity || '21K'} Holding`,
          weightGrams: grams,
          quantity: 1,
          purchasePriceEGP: newTx.pricePerGramOrUnitEGP,
          currentPriceEGP: currentPrice,
          totalCostEGP: totalCost,
          currentValueEGP: currentValue,
          totalProfitLossEGP: currentValue - totalCost,
          returnPercentage: Math.round(((currentValue - totalCost) / totalCost) * 10000) / 100,
          purchaseDate: newTx.date,
          notes: newTx.notes,
        };
        setHoldings([...holdings, newHolding]);
      }
    }

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Transaction Logged',
      message: `Recorded ${newTx.type} of ${newTx.assetType} for ${newTx.totalAmountEGP.toLocaleString()} EGP.`,
      type: 'PORTFOLIO',
      read: false,
      timestamp: 'Just now',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const addHolding = (newHolding: PortfolioHolding) => {
    setHoldings((prev) => [newHolding, ...prev]);
  };

  const deleteHolding = (id: string) => {
    setHoldings(holdings.filter((h) => h.id !== id));
  };

  const updateMarketPrices = (updated: Partial<GoldPriceFeed>) => {
    setMarketData((prev) => {
      const mergedEgyptian = updated.egyptianMarket
        ? { ...prev.egyptianMarket, ...updated.egyptianMarket }
        : prev.egyptianMarket;
      const mergedGlobal = updated.globalMarket
        ? { ...prev.globalMarket, ...updated.globalMarket }
        : prev.globalMarket;
      const mergedComp = updated.comparison21kVsSpot
        ? { ...prev.comparison21kVsSpot, ...updated.comparison21kVsSpot }
        : prev.comparison21kVsSpot;

      return {
        ...prev,
        ...updated,
        egyptianMarket: mergedEgyptian,
        globalMarket: mergedGlobal,
        comparison21kVsSpot: mergedComp,
        updatedAt: updated.updatedAt || new Date().toISOString(),
      };
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const resetToDefaultData = () => {
    setHoldings(INITIAL_HOLDINGS);
    setTransactions(INITIAL_TRANSACTIONS);
    setMarketData(INITIAL_GOLD_PRICE_FEED);
    localStorage.removeItem('gold_hub_holdings');
    localStorage.removeItem('gold_hub_transactions');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        theme,
        role,
        activePage,
        marketData,
        marketConnectionStatus,
        holdings,
        transactions,
        riskMetrics,
        notifications,
        setActivePage,
        setLanguage,
        setTheme,
        setRole,
        addTransaction,
        addHolding,
        deleteHolding,
        updateMarketPrices,
        setMarketConnectionStatus,
        markNotificationRead,
        refreshMarketFeed,
        resetToDefaultData,
      }}
    >
      <div className={theme === 'DARK' ? 'bg-[#090D16] text-slate-100 min-h-screen font-sans' : 'bg-slate-50 text-slate-900 min-h-screen font-sans'}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
