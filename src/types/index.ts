export type GoldPurity = '24K' | '21K' | '18K' | 'SOVEREIGN_COIN' | 'BAR_24K';

export type AssetCategory =
  | 'GOLD'
  | 'USD_CASH'
  | 'EGP_CASH'
  | 'BANK_CERTIFICATE'
  | 'EGX_STOCKS'
  | 'SILVER'
  | 'CRYPTO'
  | 'REAL_ESTATE';

export type TransactionType = 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW';

export interface EgyptianAssetData {
  id: string;
  name: string;
  nameAr: string;
  currentPrice: number;
  price: number; // Canonical price field
  bid: number | null;
  ask: number | null;
  dailyChange: number;
  dailyChangePercent: number;
  lastUpdate: string;
  timestamp: string;
  marketStatus: 'OPEN' | 'CLOSED' | 'WEEKEND';
  unit: string;
  source: string;
  provider: string;
  isLive: boolean;
  isDelayed: boolean;
}

export interface GlobalAssetData {
  id: string;
  name: string;
  nameAr: string;
  symbol: string;
  livePrice: number;
  price: number; // Canonical price field
  bid: number | null;
  ask: number | null;
  dailyChange: number;
  dailyChangePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  lastUpdate: string;
  timestamp: string;
  unit: string;
  source: string;
  provider: string;
  isLive: boolean;
  isDelayed: boolean;
}

export interface HistoricalComparisonPoint {
  date: string;
  local21kEGP: number;
  globalSpotEGP: number;
  premiumPercent: number;
}

export interface Comparison21kVsSpot {
  local21kEGP: number;
  globalSpotUSD: number;
  globalSpotEGP: number;
  usdEgpRate: number;
  parity21kEGP: number;
  premiumDiscountEGP: number;
  premiumDiscountPercent: number;
  historicalComparison: HistoricalComparisonPoint[];
  correlation30d: number;
  status: 'PREMIUM' | 'DISCOUNT' | 'PARITY';
}

export interface GoldPriceFeed {
  goldOunceUSD: number;
  goldOunceEGP: number;
  usdEgpOfficial: number;
  usdEgpParallel: number;
  gold24kEGP: number;
  gold21kEGP: number;
  gold18kEGP: number;
  goldPoundEGP: number; // 8 grams of 21K gold
  buy21kEGP: number; // Merchant buy price from customer
  sell21kEGP: number; // Merchant sell price to customer
  silver925EGP: number;
  cbeInterestRate: number; // % Central Bank Corridor
  headlineInflation: number; // % CAPMAS
  bankCertificate3YrRate: number; // % 3-Year CD yield
  egx30Index: number; // EGX 30 Benchmark Index
  bitcoinUSD: number;
  marketStatus: 'OPEN' | 'CLOSED' | 'WEEKEND';
  updatedAt: string;
  source: string;

  // Unified Market Data Layer Fields
  isDataDelayed?: boolean;
  lastSuccessfulUpdate?: string;
  egyptianMarket?: {
    gold24k: EgyptianAssetData;
    gold21k: EgyptianAssetData;
    gold18k: EgyptianAssetData;
    goldPound: EgyptianAssetData;
    goldOunceEgp: EgyptianAssetData;
  };
  globalMarket?: {
    xauUsd: GlobalAssetData;
    xagUsd: GlobalAssetData;
    usdEgp: GlobalAssetData;
    bitcoin: GlobalAssetData;
    egx30: GlobalAssetData;
  };
  comparison21kVsSpot?: Comparison21kVsSpot;
}

export interface HistoricalPricePoint {
  date: string;
  gold24kEGP: number;
  gold21kEGP: number;
  gold18kEGP: number;
  goldOunceUSD: number;
  usdEgpRate: number;
  bankCdYield: number;
  inflationRate: number;
}

export interface PortfolioHolding {
  id: string;
  assetType: AssetCategory;
  purity?: GoldPurity;
  name: string;
  weightGrams?: number; // For gold/silver
  quantity: number; // Units/Grams/Count
  purchasePriceEGP: number; // Unit or Gram purchase cost
  currentPriceEGP: number; // Live per unit/gram price
  totalCostEGP: number;
  currentValueEGP: number;
  totalProfitLossEGP: number;
  returnPercentage: number;
  purchaseDate: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  assetType: AssetCategory;
  purity?: GoldPurity;
  weightGrams?: number;
  pricePerGramOrUnitEGP: number;
  totalAmountEGP: number;
  workmanshipFeePerGramEGP?: number; // "Kharamiya" / Making charge in EGP
  feeEGP?: number;
  date: string;
  notes?: string;
}

export interface EconomicIndicator {
  id: string;
  name: string;
  nameAr: string;
  code: string;
  value: number;
  unit: string;
  change24h: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  lastUpdated: string;
  category: 'MONETARY' | 'CURRENCY' | 'COMMODITY' | 'INFLATION' | 'BENCHMARK';
}

export interface AISignal {
  id: string;
  goldSignal: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'TAKE_PROFIT' | 'SELL';
  confidenceScore: number; // 1 to 100
  confidenceBreakdown?: {
    dataStreamQuality: number;
    modelConcurrence: number;
    historicalBacktest: number;
    macroRegimeStability: number;
  };
  targetPrice21kEGP: number;
  stopLoss21kEGP: number;
  summary: string;
  summaryAr?: string;
  macroDrivers: string[];
  riskRating: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  createdAt: string;
  activeRegime?: string;
  explainabilityTree?: ExplainabilityFactor[];
  sourceReferences?: SourceReference[];
}

export interface ExplainabilityFactor {
  factor: string;
  factorAr: string;
  weightPercent: number;
  impactScore: number; // -10 to +10
  description: string;
  descriptionAr: string;
}

export interface SourceReference {
  title: string;
  publisher: string;
  url?: string;
  verifiedAt: string;
  relevanceNote: string;
}

export interface RebalanceTradeStep {
  id: string;
  asset: string;
  assetAr: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  quantityOrGrams: number;
  estimatedEGP: number;
  reason: string;
  reasonAr: string;
}

export interface PortfolioOptimizationResult {
  riskProfile: 'WEALTH_PRESERVATION' | 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  targetAllocation: { asset: string; assetAr: string; percentage: number; color: string }[];
  expectedReturnAnnual: number;
  expectedVolatility: number;
  sharpeRatio: number;
  rebalanceSteps: RebalanceTradeStep[];
  explanation: string;
  explanationAr: string;
}

export interface TaxOptimizationResult {
  zakatNisabEGP: number; // Value of 85g 24K gold
  isZakatLiable: boolean;
  totalZakatDueEGP: number;
  zakatGoldWeightGrams: number;
  bankCdTaxShieldBenefitEGP: number; // 0% tax benefit vs taxable corporate dividends
  netTaxAdjustedReturnPercent: number;
  grossReturnPercent: number;
  recommendations: string[];
  recommendationsAr: string[];
}

export interface InflationForecastPoint {
  periodMonths: 3 | 6 | 12 | 24;
  capmasHeadlineInflation: number;
  cbeCoreInflation: number;
  goldRealReturnPercent: number;
  bankCdRealReturnPercent: number;
  egpPurchasingPowerLossPercent: number;
}

export interface RiskForecastResult {
  var95PercentEGP: number; // Value at Risk 95% confidence
  var95PercentRatio: number;
  var99PercentEGP: number; // Value at Risk 99% confidence
  expectedShortfallEGP: number; // CVaR
  maxDrawdownProbability: number;
  stressTestResults: {
    scenarioName: string;
    scenarioNameAr: string;
    impactPercentage: number;
    projectedPortfolioEGP: number;
  }[];
}

export interface MarketRegimeInfo {
  activeRegimeId: 'REGIME_DEVALUATION' | 'REGIME_BULLION_RALLY' | 'REGIME_CBE_TIGHTENING' | 'REGIME_CONSOLIDATION';
  activeRegimeName: string;
  activeRegimeNameAr: string;
  probabilityScore: number; // e.g. 68%
  durationForecastMonths: number;
  recommendedPosture: string;
  recommendedPostureAr: string;
  regimeProbabilities: { id: string; name: string; nameAr: string; probability: number }[];
}

export interface ScenarioComparisonPoint {
  periodMonths: 3 | 6 | 12;
  baseCaseEGP: number;
  devaluationShockEGP: number;
  globalBullionRallyEGP: number;
  egpStabilizationEGP: number;
}

export interface InvestmentCoachPrompt {
  id: string;
  question: string;
  questionAr: string;
  category: 'REBALANCING' | 'TAX_ZAKAT' | 'DEVALUATION' | 'CD_VS_GOLD';
  answer: string;
  answerAr: string;
  sources: string[];
}

export interface ForecastScenario {
  periodMonths: 3 | 6 | 12;
  optimistic21kEGP: number;
  neutral21kEGP: number;
  pessimistic21kEGP: number;
  confidenceScore: number;
  keyDrivers: string[];
}

export interface RiskMetrics {
  totalValueEGP: number;
  totalCostEGP: number;
  totalProfitEGP: number;
  roiPercentage: number;
  cagrPercentage: number;
  maxDrawdownPercentage: number;
  sharpeRatio: number;
  sortinoRatio: number;
  volatilityPercentage: number;
  averageCost21kEGP: number;
  breakEvenPrice21kEGP: number;
  riskScore: number; // 1-100 (10 = ultra safe, 90 = speculative)
}

export interface NewsArticle {
  id: string;
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  source: string;
  url?: string;
  publishedAt: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  relatedAsset: 'GOLD' | 'EGP' | 'USD' | 'CBE' | 'GLOBAL';
}

export interface EconomicEvent {
  id: string;
  title: string;
  titleAr: string;
  date: string;
  time: string;
  country: 'EGYPT' | 'USA' | 'EU' | 'GLOBAL';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  actual?: string;
  forecast?: string;
  previous?: string;
}

export type UserRole = 'ADMIN' | 'INVESTOR' | 'ANALYST' | 'GUEST';
export type AppLanguage = 'EN' | 'AR';
export type AppTheme = 'DARK' | 'LIGHT';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  language: AppLanguage;
  theme: AppTheme;
  riskProfile: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  baseCurrency: 'EGP' | 'USD';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'PRICE_ALERT' | 'PORTFOLIO' | 'ECONOMIC' | 'AI_SIGNAL' | 'SYSTEM';
  read: boolean;
  timestamp: string;
  link?: string;
}
