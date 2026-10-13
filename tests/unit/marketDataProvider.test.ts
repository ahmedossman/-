import { describe, it, expect, vi } from 'vitest';
import { marketDataLayer, retryWithBackoff, CurrencyService, CryptoStockService } from '../../src/services/marketDataProvider';

describe('Market Data Provider Unit Tests', () => {
  it('retries functions with backoff on failure', async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      if (attempts < 2) throw new Error('Network error');
      return 'SUCCESS';
    };

    const res = await retryWithBackoff(fn, 3, 50);
    expect(res).toBe('SUCCESS');
    expect(attempts).toBe(2);
  });

  it('fallback currency service provides default EGP rates', async () => {
    const currencyService = new CurrencyService();
    const rates = await currencyService.fetchRates();
    expect(rates.usdEgpOfficial).toBeGreaterThan(0);
    expect(rates.usdEgpParallel).toBeGreaterThan(rates.usdEgpOfficial);
  });

  it('fallback crypto stock service provides fallback data', async () => {
    const cryptoService = new CryptoStockService();
    const data = await cryptoService.fetchLatest();
    expect(data.bitcoinUSD).toBeGreaterThan(0);
    expect(data.egx30Index).toBeGreaterThan(0);
  });
});
