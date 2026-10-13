import {
  AISignal,
  EconomicEvent,
  EconomicIndicator,
  ForecastScenario,
  GoldPriceFeed,
  HistoricalPricePoint,
  NewsArticle,
  PortfolioHolding,
  Transaction,
} from '../types';

// Initial Egyptian market benchmarks
const nowIso = new Date().toISOString();

export const INITIAL_GOLD_PRICE_FEED: GoldPriceFeed = {
  goldOunceUSD: 4396.5,
  goldOunceEGP: 218902.0,
  usdEgpOfficial: 49.79,
  usdEgpParallel: 50.89,
  gold24kEGP: 6950,
  gold21kEGP: 6081,
  gold18kEGP: 5213,
  goldPoundEGP: 48648, // 8 grams 21K
  buy21kEGP: 5925,
  sell21kEGP: 6124,
  silver925EGP: 68.5,
  cbeInterestRate: 27.25,
  headlineInflation: 26.5,
  bankCertificate3YrRate: 23.5,
  egx30Index: 31450.0,
  bitcoinUSD: 94800.0,
  marketStatus: 'OPEN',
  updatedAt: nowIso,
  source: 'Egyptian Local Market Provider | Global: Spot Gold Feed',
  isDataDelayed: true,
  lastSuccessfulUpdate: nowIso,

  egyptianMarket: {
    gold24k: {
      id: 'gold24k',
      name: 'Gold 24K Pure Bullion',
      nameAr: 'ذهب عيار 24 (سبائك ناعمة)',
      currentPrice: 6950,
      price: 6950,
      bid: 6771,
      ask: 6999,
      dailyChange: 15,
      dailyChangePercent: 0.22,
      lastUpdate: nowIso,
      timestamp: nowIso,
      marketStatus: 'OPEN',
      unit: 'EGP/g',
      source: 'Egyptian Local Market Provider',
      provider: 'GoldPriceZ Egyptian Feed',
      isLive: false,
      isDelayed: true,
    },
    gold21k: {
      id: 'gold21k',
      name: 'Gold 21K Standard',
      nameAr: 'ذهب عيار 21 (الأكثر انتشاراً)',
      currentPrice: 6081,
      price: 6081,
      bid: 5925,
      ask: 6124,
      dailyChange: 12,
      dailyChangePercent: 0.20,
      lastUpdate: nowIso,
      timestamp: nowIso,
      marketStatus: 'OPEN',
      unit: 'EGP/g',
      source: 'Egyptian Local Market Provider',
      provider: 'GoldPriceZ Egyptian Feed',
      isLive: false,
      isDelayed: true,
    },
    gold18k: {
      id: 'gold18k',
      name: 'Gold 18K Jewellery',
      nameAr: 'ذهب عيار 18 (مشغولات ذهبية)',
      currentPrice: 5213,
      price: 5213,
      bid: 5078,
      ask: 5249,
      dailyChange: 10,
      dailyChangePercent: 0.19,
      lastUpdate: nowIso,
      timestamp: nowIso,
      marketStatus: 'OPEN',
      unit: 'EGP/g',
      source: 'Egyptian Local Market Provider',
      provider: 'GoldPriceZ Egyptian Feed',
      isLive: false,
      isDelayed: true,
    },
    goldPound: {
      id: 'goldPound',
      name: 'Gold Sovereign Coin (8g 21K)',
      nameAr: 'الجنيه الذهب (8 جرام عيار 21)',
      currentPrice: 48648,
      price: 48648,
      bid: 47400,
      ask: 48992,
      dailyChange: 96,
      dailyChangePercent: 0.20,
      lastUpdate: nowIso,
      timestamp: nowIso,
      marketStatus: 'OPEN',
      unit: 'EGP',
      source: 'Egyptian Local Market Provider',
      provider: 'GoldPriceZ Egyptian Feed',
      isLive: false,
      isDelayed: true,
    },
    goldOunceEgp: {
      id: 'goldOunceEgp',
      name: 'Gold Ounce (EGP)',
      nameAr: 'الأوقية الذهب بالجنيه',
      currentPrice: 218902,
      price: 218902,
      bid: null,
      ask: null,
      dailyChange: 420,
      dailyChangePercent: 0.20,
      lastUpdate: nowIso,
      timestamp: nowIso,
      marketStatus: 'OPEN',
      unit: 'EGP',
      source: 'Egyptian Local Market Provider',
      provider: 'GoldPriceZ Egyptian Feed',
      isLive: false,
      isDelayed: true,
    },
  },

  globalMarket: {
    xauUsd: {
      id: 'xauUsd',
      name: 'Gold Spot (XAU/USD)',
      nameAr: 'الأوقية الذهب عالمياً (XAU/USD)',
      symbol: 'XAU/USD',
      livePrice: 4396.50,
      price: 4396.50,
      bid: 4396.00,
      ask: 4397.00,
      dailyChange: 8.50,
      dailyChangePercent: 0.20,
      high: 4410.00,
      low: 4380.00,
      open: 4388.00,
      previousClose: 4388.00,
      lastUpdate: nowIso,
      timestamp: nowIso,
      unit: 'USD/oz',
      source: 'Global Spot Provider',
      provider: 'GoldAPI / Yahoo Finance',
      isLive: false,
      isDelayed: true,
    },
    xagUsd: {
      id: 'xagUsd',
      name: 'Silver Spot (XAG/USD)',
      nameAr: 'الفضة العالمية (XAG/USD)',
      symbol: 'XAG/USD',
      livePrice: 32.80,
      price: 32.80,
      bid: 32.75,
      ask: 32.85,
      dailyChange: 0.45,
      dailyChangePercent: 1.39,
      high: 33.10,
      low: 32.20,
      open: 32.40,
      previousClose: 32.35,
      lastUpdate: nowIso,
      timestamp: nowIso,
      unit: 'USD/oz',
      source: 'Global Spot Provider',
      provider: 'FXRatesAPI',
      isLive: false,
      isDelayed: true,
    },
    usdEgp: {
      id: 'usdEgp',
      name: 'USD / EGP Exchange Rate',
      nameAr: 'سعر صرف الدولار (USD/EGP)',
      symbol: 'USD/EGP',
      livePrice: 49.79,
      price: 49.79,
      bid: 49.69,
      ask: 49.89,
      dailyChange: 0.15,
      dailyChangePercent: 0.30,
      high: 50.25,
      low: 49.50,
      open: 49.64,
      previousClose: 49.64,
      lastUpdate: nowIso,
      timestamp: nowIso,
      unit: 'EGP',
      source: 'Open Exchange Rates',
      provider: 'Open Exchange Rates',
      isLive: false,
      isDelayed: true,
    },
    bitcoin: {
      id: 'bitcoin',
      name: 'Bitcoin (BTC/USD)',
      nameAr: 'البيتكوين مقابل الدولار',
      symbol: 'BTC/USD',
      livePrice: 94800.00,
      price: 94800.00,
      bid: 94750.00,
      ask: 94850.00,
      dailyChange: 1600.00,
      dailyChangePercent: 1.72,
      high: 95600.00,
      low: 92800.00,
      open: 93500.00,
      previousClose: 93200.00,
      lastUpdate: nowIso,
      timestamp: nowIso,
      unit: 'USD',
      source: 'Binance API',
      provider: 'Binance',
      isLive: false,
      isDelayed: true,
    },
    egx30: {
      id: 'egx30',
      name: 'EGX30 Benchmark Index',
      nameAr: 'مؤشر البورصة المصرية EGX30',
      symbol: 'EGX30',
      livePrice: 31450.00,
      price: 31450.00,
      bid: null,
      ask: null,
      dailyChange: 270.00,
      dailyChangePercent: 0.87,
      high: 31580.00,
      low: 31150.00,
      open: 31200.00,
      previousClose: 31180.00,
      lastUpdate: nowIso,
      timestamp: nowIso,
      unit: 'Points',
      source: 'Egyptian Exchange',
      provider: 'EGX',
      isLive: false,
      isDelayed: true,
    },
  },

  comparison21kVsSpot: {
    local21kEGP: 4191,
    globalSpotUSD: 2980.50,
    globalSpotEGP: 149323.00,
    usdEgpRate: 50.10,
    parity21kEGP: 4115,
    premiumDiscountEGP: 76,
    premiumDiscountPercent: 1.85,
    historicalComparison: [
      { date: '2026-07-08', local21kEGP: 4050, globalSpotEGP: 3990, premiumPercent: 1.50 },
      { date: '2026-07-15', local21kEGP: 4080, globalSpotEGP: 4010, premiumPercent: 1.75 },
      { date: '2026-07-22', local21kEGP: 4120, globalSpotEGP: 4050, premiumPercent: 1.73 },
      { date: '2026-07-29', local21kEGP: 4150, globalSpotEGP: 4080, premiumPercent: 1.71 },
      { date: '2026-08-07', local21kEGP: 4191, globalSpotEGP: 4115, premiumPercent: 1.85 },
    ],
    correlation30d: 0.96,
    status: 'PREMIUM',
  },
};

// Generate realistic 30-day or 1-year historical chart data for charts
export function generateHistoricalPrices(timeframe: '1W' | '1M' | '6M' | '1Y' | '5Y' = '1M'): HistoricalPricePoint[] {
  const points: HistoricalPricePoint[] = [];
  const daysMap = {
    '1W': 7,
    '1M': 30,
    '6M': 180,
    '1Y': 365,
    '5Y': 1825,
  };
  const count = daysMap[timeframe] || 30;
  const now = new Date();

  let base21k = 4191;
  let baseUsdEgp = 50.1;
  let baseOunceUsd = 2980;

  for (let i = count; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);

    // Random walk with trend simulation
    const trendFactor = 1 - (i / count) * 0.18; // Upward historical trend
    const noise = (Math.random() - 0.48) * 25;

    const current21k = Math.round(base21k * trendFactor + noise);
    const current24k = Math.round(current21k * (24 / 21));
    const current18k = Math.round(current21k * (18 / 21));
    const currentOunce = Math.round((baseOunceUsd * trendFactor + noise * 0.4) * 100) / 100;
    const currentUsdRate = Math.round((baseUsdEgp * (1 - (i / count) * 0.08) + noise * 0.05) * 100) / 100;

    points.push({
      date: d.toISOString().split('T')[0],
      gold21kEGP: current21k,
      gold24kEGP: current24k,
      gold18kEGP: current18k,
      goldOunceUSD: currentOunce,
      usdEgpRate: currentUsdRate,
      bankCdYield: 23.5,
      inflationRate: 26.5 + (Math.random() - 0.5) * 0.8,
    });
  }

  return points;
}

// Sample Portfolio Holdings
export const INITIAL_HOLDINGS: PortfolioHolding[] = [
  {
    id: 'hold-1',
    assetType: 'GOLD',
    purity: 'BAR_24K',
    name: 'BTC 24K Gold Bar (50g)',
    weightGrams: 50,
    quantity: 1,
    purchasePriceEGP: 4320, // purchase price per gram
    currentPriceEGP: 4790,
    totalCostEGP: 216000,
    currentValueEGP: 239500,
    totalProfitLossEGP: 23500,
    returnPercentage: 10.88,
    purchaseDate: '2025-11-15',
    notes: 'Stored in CIB bank safe deposit box',
  },
  {
    id: 'hold-2',
    assetType: 'GOLD',
    purity: 'SOVEREIGN_COIN',
    name: 'Egyptian Gold Sovereign (George V 8g)',
    weightGrams: 24,
    quantity: 3,
    purchasePriceEGP: 3880,
    currentPriceEGP: 4191,
    totalCostEGP: 93120,
    currentValueEGP: 100584,
    totalProfitLossEGP: 7464,
    returnPercentage: 8.02,
    purchaseDate: '2025-12-01',
    notes: '3x Gold coins (21K 8 grams each)',
  },
  {
    id: 'hold-3',
    assetType: 'BANK_CERTIFICATE',
    name: 'National Bank of Egypt (NBE) 3-Yr Certificate',
    quantity: 1,
    purchasePriceEGP: 150000,
    currentPriceEGP: 150000,
    totalCostEGP: 150000,
    currentValueEGP: 150000,
    totalProfitLossEGP: 17625, // Accumulated yield payout
    returnPercentage: 11.75,
    purchaseDate: '2025-06-10',
    notes: '23.5% monthly payout CD',
  },
  {
    id: 'hold-4',
    assetType: 'USD_CASH',
    name: 'USD Emergency Cash Holdings ($2,000)',
    quantity: 2000,
    purchasePriceEGP: 48.5, // USD purchase rate
    currentPriceEGP: 50.1,
    totalCostEGP: 97000,
    currentValueEGP: 100200,
    totalProfitLossEGP: 3200,
    returnPercentage: 3.3,
    purchaseDate: '2025-08-20',
    notes: 'Foreign currency cash reserve',
  },
];

// Sample Transactions
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'BUY',
    assetType: 'GOLD',
    purity: 'BAR_24K',
    weightGrams: 50,
    pricePerGramOrUnitEGP: 4320,
    workmanshipFeePerGramEGP: 65,
    totalAmountEGP: 219250,
    feeEGP: 3250,
    date: '2025-11-15',
    notes: 'Purchased 50g BTC stamped 24K ingot from El-Sagha dealer in Khan El-Khalili.',
  },
  {
    id: 'tx-2',
    type: 'BUY',
    assetType: 'GOLD',
    purity: 'SOVEREIGN_COIN',
    weightGrams: 24,
    pricePerGramOrUnitEGP: 3880,
    workmanshipFeePerGramEGP: 45,
    totalAmountEGP: 94200,
    feeEGP: 1080,
    date: '2025-12-01',
    notes: '3x Gold Sovereigns 21K (8g each).',
  },
  {
    id: 'tx-3',
    type: 'BUY',
    assetType: 'BANK_CERTIFICATE',
    pricePerGramOrUnitEGP: 150000,
    totalAmountEGP: 150000,
    date: '2025-06-10',
    notes: 'Issued 3-Year NBE Platinum Certificate at 23.5% payout.',
  },
];

// AI Signal Recommendation Data
export const INITIAL_AI_SIGNAL: AISignal = {
  id: 'sig-1',
  goldSignal: 'STRONG_BUY',
  confidenceScore: 88,
  targetPrice21kEGP: 4450,
  stopLoss21kEGP: 4050,
  summary:
    'Egyptian Gold 21K shows strong momentum driven by global spot gold crossing $2,980/oz and elevated inflation. Rebalancing cash and bank certificates into 24K stamped bullion is recommended.',
  summaryAr:
    'يسجل الذهب عيار 21 بمصر خيارات شراء قوية مدعوماً بتجاوز الأوقية العالمية مستوى 2980 دولاراً واستمرار معدلات التضخم. يُنصح بإعادة توزيع السيولة والشهادات البنكية نحو سبائك الذهب عيار 24.',
  macroDrivers: [
    'International Spot Gold above $2,980/oz',
    'Cairo parallel exchange market premium +2.2%',
    'Expiration of 25% Bank Certificates releasing liquidity',
  ],
  riskRating: 'LOW',
  createdAt: new Date().toISOString(),
};

// AI Forecast Scenarios
export const INITIAL_FORECASTS: ForecastScenario[] = [
  {
    periodMonths: 3,
    optimistic21kEGP: 4520,
    neutral21kEGP: 4350,
    pessimistic21kEGP: 4100,
    confidenceScore: 88,
    keyDrivers: [
      'IMF program review and EGP adjustment expectations',
      'Global central bank gold reserves expansion',
      'Local seasonal gold buying demand',
    ],
  },
  {
    periodMonths: 6,
    optimistic21kEGP: 4860,
    neutral21kEGP: 4570,
    pessimistic21kEGP: 4230,
    confidenceScore: 82,
    keyDrivers: [
      'Potential CBE monetary policy rate cuts',
      'Sustained retail demand for 24K stamped ingots',
      'Global macroeconomic interest rate cycle',
    ],
  },
  {
    periodMonths: 12,
    optimistic21kEGP: 5530,
    neutral21kEGP: 5030,
    pessimistic21kEGP: 4520,
    confidenceScore: 76,
    keyDrivers: [
      'Long-term EGP purchasing power offset against USD',
      'Geopolitical premium supporting spot bullion',
      'Opportunity cost favoring physical bullion over fixed income',
    ],
  },
];

// Economic indicators
export const ECONOMIC_INDICATORS: EconomicIndicator[] = [
  {
    id: 'ind-1',
    name: 'Central Bank Corridor Interest Rate',
    nameAr: 'سعر الفائدة بالبنك المركزي',
    code: 'CBE_INTEREST',
    value: 27.25,
    unit: '%',
    change24h: 0,
    trend: 'STABLE',
    lastUpdated: '2026-08-01',
    category: 'MONETARY',
  },
  {
    id: 'ind-2',
    name: 'CAPMAS Urban Inflation Rate',
    nameAr: 'معدل التضخم السنوي (التعبئة والإحصاء)',
    code: 'INFLATION_EGY',
    value: 26.5,
    unit: '%',
    change24h: -0.4,
    trend: 'DOWN',
    lastUpdated: '2026-08-01',
    category: 'INFLATION',
  },
  {
    id: 'ind-3',
    name: 'USD/EGP Official Exchange Rate',
    nameAr: 'سعر الدولار الرسمي مقابل الجنيه',
    code: 'USD_EGP_OFFICIAL',
    value: 50.1,
    unit: 'EGP',
    change24h: 0.15,
    trend: 'UP',
    lastUpdated: '2026-08-06',
    category: 'CURRENCY',
  },
  {
    id: 'ind-4',
    name: 'CBE Foreign Reserve Assets',
    nameAr: 'الاحتياطي النقدي الأجنبي بالبنك المركزي',
    code: 'FOREIGN_RESERVES',
    value: 46.9,
    unit: 'Billion USD',
    change24h: 0.3,
    trend: 'UP',
    lastUpdated: '2026-08-01',
    category: 'BENCHMARK',
  },
  {
    id: 'ind-5',
    name: 'Global Gold Spot Ounce',
    nameAr: 'سعر أوقية الذهب العالمية',
    code: 'GOLD_OUNCE_USD',
    value: 2980.5,
    unit: 'USD',
    change24h: 12.4,
    trend: 'UP',
    lastUpdated: '2026-08-06',
    category: 'COMMODITY',
  },
];

// News Feed
export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Egyptian Gold Dealers Report Steady Inflows as 21K Reaches 4,191 EGP',
    titleAr: 'تجار الذهب بمصر يسجلون إقبالاً هادئاً مع وصول عيار 21 إلى 4191 جنيهاً',
    summary:
      'Gold prices in Khan El-Khalili and Sagha markets maintained firm levels supported by international spot strength above $2,980/oz and steady local retail demand for stamped 24K ingots.',
    summaryAr:
      'استقرت أسعار الذهب في محلات الصاغة مستفيدة من صعود الأوقية عالمياً فوق 2980 دولاراً واستمرار الإقبال المحلي على السبائك المدموغة.',
    source: 'Enterprise Egypt Financial',
    publishedAt: '2026-08-06T09:30:00Z',
    sentiment: 'BULLISH',
    impact: 'HIGH',
    relatedAsset: 'GOLD',
  },
  {
    id: 'news-2',
    title: 'Central Bank of Egypt Monetary Policy Committee Prepares Next Rate Meeting',
    titleAr: 'لجنة السياسة النقدية بالبنك المركزي المصري تستعد لاجتماع تحديد الفائدة',
    summary:
      'Analysts expect the CBE to maintain the overnight deposit rate at 27.25% as CAPMAS inflation figures show gradual deceleration toward target corridor.',
    summaryAr:
      'يتوقع المحللون الإبقاء على سعر الفائدة عند 27.25% مع تباطؤ التضخم تدريجياً وفق بيانات الجهاز المركزي للتعبئة العامة والإحصاء.',
    source: 'Ahram Weekly Economic',
    publishedAt: '2026-08-05T14:15:00Z',
    sentiment: 'NEUTRAL',
    impact: 'HIGH',
    relatedAsset: 'CBE',
  },
  {
    id: 'news-3',
    title: 'Egyptian Banking Sector Reports 23.5% Certificate Issuances Peak',
    titleAr: 'البنوك المصرية تسجل ذروة في إقبال المواطنين على شهادات الـ 23.5%',
    summary:
      'National Bank of Egypt and Banque Misr report high liquidity absorption through 3-year high-yield certificates as investors balance fixed yield against bullion.',
    summaryAr:
      'البنك الأهلي وبنك مصر يسجلان حصيلة قياسية من الشهادات الادخارية ذات العائد الارتفاع مع توازن خيارات المستثمرين بين الذهب والشهادات.',
    source: 'Cairo Financial Times',
    publishedAt: '2026-08-04T11:00:00Z',
    sentiment: 'NEUTRAL',
    impact: 'MEDIUM',
    relatedAsset: 'EGP',
  },
];

export const INITIAL_NEWS = NEWS_ARTICLES;

// Economic Calendar Events
export const ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'evt-1',
    title: 'CAPMAS Monthly Inflation Release (Egypt)',
    titleAr: 'إعلان معدل التضخم الشهري (التعبئة والإحصاء)',
    date: '2026-08-10',
    time: '08:00 UTC',
    country: 'EGYPT',
    impact: 'HIGH',
    forecast: '26.1%',
    previous: '26.5%',
  },
  {
    id: 'evt-2',
    title: 'CBE Monetary Policy Committee (MPC) Rate Decision',
    titleAr: 'اجتماع لجنة السياسة النقدية بالبنك المركزي المصري',
    date: '2026-08-22',
    time: '16:00 UTC',
    country: 'EGYPT',
    impact: 'HIGH',
    forecast: '27.25%',
    previous: '27.25%',
  },
  {
    id: 'evt-3',
    title: 'US Federal Reserve FOMC Rate Decision',
    titleAr: 'قرار الفيدرالي الأمريكي بشأن الفائدة',
    date: '2026-09-18',
    time: '18:00 UTC',
    country: 'USA',
    impact: 'HIGH',
    forecast: '4.75%',
    previous: '5.00%',
  },
];

export const INITIAL_ECONOMIC_EVENTS = ECONOMIC_EVENTS;
