import { GoldPriceFeed, EconomicEvent, NewsArticle } from '../types';
import { INITIAL_GOLD_PRICE_FEED } from './goldService';

export interface MarketDataProvider {
  name: string;
  fetchLatest(): Promise<Partial<GoldPriceFeed>>;
}

// Utility: exponential backoff retry
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 400
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

// Gold Price Service Class
export class GoldPriceService implements MarketDataProvider {
  name = 'Cairo Bullion & Global Gold Service';
  private lastCall = 0;
  private minIntervalMs = 2000; // Rate limit 2s

  async fetchLatest(): Promise<Partial<GoldPriceFeed>> {
    const now = Date.now();
    if (now - this.lastCall < this.minIntervalMs) {
      // Throttle rate limit
      const cached = localStorage.getItem('gold_hub_cached_feed');
      if (cached) return JSON.parse(cached);
    }
    this.lastCall = now;

    return retryWithBackoff(async () => {
      const baseUrl = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/market/summary`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    }, 2, 500);
  }
}

// Currency Service Class
export class CurrencyService {
  async fetchRates(): Promise<{ usdEgpOfficial: number; usdEgpParallel: number }> {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (res.ok) {
        const data = await res.json();
        const official = data.rates?.EGP || 50.10;
        return {
          usdEgpOfficial: Math.round(official * 100) / 100,
          usdEgpParallel: Math.round((official * 1.022) * 100) / 100,
        };
      }
    } catch (e) {
      console.warn('Currency service offline fallback:', e);
    }
    return { usdEgpOfficial: 50.10, usdEgpParallel: 51.25 };
  }
}

// Crypto & Stock Service Class
export class CryptoStockService {
  async fetchLatest(): Promise<{ bitcoinUSD: number; egx30Index: number }> {
    let btc = 94800.0;
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
      if (res.ok) {
        const data = await res.json();
        btc = parseFloat(data.price);
      }
    } catch (e) {
      console.warn('Crypto service offline fallback:', e);
    }
    return {
      bitcoinUSD: Math.round(btc * 100) / 100,
      egx30Index: 31450.0,
    };
  }
}

// Economic Calendar Service Class
export class EconomicCalendarService {
  private cache: EconomicEvent[] | null = null;

  async fetchEvents(): Promise<EconomicEvent[]> {
    if (this.cache) return this.cache;
    try {
      const res = await fetch('/api/market/economic-calendar');
      if (res.ok) {
        this.cache = await res.json();
        return this.cache!;
      }
    } catch (e) {
      console.warn('Economic calendar fetch fallback:', e);
    }
    return [
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
    ];
  }
}

// News Service Class
export class NewsService {
  private cache: NewsArticle[] | null = null;

  async fetchNews(): Promise<NewsArticle[]> {
    if (this.cache) return this.cache;
    try {
      const res = await fetch('/api/market/news');
      if (res.ok) {
        this.cache = await res.json();
        return this.cache!;
      }
    } catch (e) {
      console.warn('News service fetch fallback:', e);
    }
    return [
      {
        id: 'news-1',
        title: 'Egyptian Gold Dealers Report Steady Inflows as 21K Traverses Key Resistance Levels',
        titleAr: 'تجار الذهب بمصر يسجلون إقبالاً مكثفاً مع تجاوز عيار 21 مستويات المقاومة',
        summary:
          'Gold prices in Khan El-Khalili and Sagha markets maintained firm momentum supported by international spot strength and steady retail demand for stamped 24K bullion ingots.',
        summaryAr:
          'استقرت أسعار الذهب في محلات الصاغة مستفيدة من صعود الأوقية عالمياً واستمرار الإقبال المحلي على السبائك المدموغة.',
        source: 'Enterprise Egypt Financial Feed',
        publishedAt: new Date().toISOString(),
        sentiment: 'BULLISH',
        impact: 'HIGH',
        relatedAsset: 'GOLD',
      },
    ];
  }
}

// Aggregated Market Data Layer
export class MarketDataLayer {
  private goldService = new GoldPriceService();
  private currencyService = new CurrencyService();
  private cryptoStockService = new CryptoStockService();
  public economicCalendarService = new EconomicCalendarService();
  public newsService = new NewsService();

  private cache: GoldPriceFeed | null = null;
  private lastFetchTimestamp = 0;
  private ttlMs = 5000; // 5s cache TTL
  private isOfflineMode = false;

  async getMarketFeed(forceRefresh = false): Promise<{ feed: GoldPriceFeed; isOffline: boolean }> {
    const now = Date.now();
    if (!forceRefresh && this.cache && now - this.lastFetchTimestamp < this.ttlMs) {
      return { feed: this.cache, isOffline: this.isOfflineMode };
    }

    try {
      const serverData = await this.goldService.fetchLatest();
      const baseFeed = INITIAL_GOLD_PRICE_FEED;

      const mergedFeed: GoldPriceFeed = {
        ...baseFeed,
        ...serverData,
        updatedAt: serverData.updatedAt || new Date().toISOString(),
        lastSuccessfulUpdate: serverData.lastSuccessfulUpdate || new Date().toISOString(),
        isDataDelayed: serverData.isDataDelayed || false,
      };

      this.cache = mergedFeed;
      this.lastFetchTimestamp = now;
      this.isOfflineMode = !navigator.onLine;

      localStorage.setItem('gold_hub_cached_feed', JSON.stringify(mergedFeed));
      return { feed: mergedFeed, isOffline: this.isOfflineMode };
    } catch (err) {
      console.warn('Network market feed fetch failed, switching to cached data:', err);
      this.isOfflineMode = true;
      const saved = localStorage.getItem('gold_hub_cached_feed');
      if (saved) {
        const cachedFeed: GoldPriceFeed = JSON.parse(saved);
        cachedFeed.isDataDelayed = true;
        this.cache = cachedFeed;
        return { feed: cachedFeed, isOffline: true };
      }

      // If no saved feed exists, fallback to INITIAL_GOLD_PRICE_FEED marked as delayed
      const fallbackFeed: GoldPriceFeed = {
        ...INITIAL_GOLD_PRICE_FEED,
        isDataDelayed: true,
      };
      this.cache = fallbackFeed;
      return { feed: fallbackFeed, isOffline: true };
    }
  }
}

export const marketDataLayer = new MarketDataLayer();

