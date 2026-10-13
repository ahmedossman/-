import { describe, it, expect } from 'vitest';
import { marketDataLayer } from '../../src/services/marketDataProvider';
import { calculateRiskMetrics } from '../../src/services/financialEngine';
import { authService } from '../../src/services/authService';

describe('Integration Tests - Data Flow & Services Interoperability', () => {
  it('fetches market feed and computes risk metrics for current user holdings', async () => {
    // 1. Fetch Market Feed
    const { feed } = await marketDataLayer.getMarketFeed(true);
    expect(feed.gold21kEGP).toBeGreaterThan(0);

    // 2. Mock Holdings
    const holdings = [
      {
        id: 'h-1',
        assetType: 'GOLD' as const,
        purity: '21K' as const,
        name: 'Bitcoin Sovereign Coin 8g',
        weightGrams: 8,
        quantity: 1,
        purchasePriceEGP: 3900,
        currentPriceEGP: feed.gold21kEGP,
        totalCostEGP: 31200,
        currentValueEGP: 8 * feed.gold21kEGP,
        totalProfitLossEGP: 8 * feed.gold21kEGP - 31200,
        returnPercentage: Math.round(((8 * feed.gold21kEGP - 31200) / 31200) * 10000) / 100,
        purchaseDate: '2025-01-01',
      },
    ];

    // 3. Calculate Risk Metrics with live feed price
    const metrics = calculateRiskMetrics(holdings, [], feed.gold21kEGP);
    expect(metrics.totalValueEGP).toBe(8 * feed.gold21kEGP);
    expect(metrics.averageCost21kEGP).toBe(3900);

    // 4. Verify user context integration
    const user = authService.getCurrentUser();
    expect(user.email).toBeDefined();
  });
});
