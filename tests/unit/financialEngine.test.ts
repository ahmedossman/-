import { describe, it, expect } from 'vitest';
import { calculateRiskMetrics, calculateDCAProjection } from '../../src/services/financialEngine';
import { PortfolioHolding, Transaction } from '../../src/types';

describe('Financial Engine Unit Tests', () => {
  const mockHoldings: PortfolioHolding[] = [
    {
      id: 'h1',
      assetType: 'GOLD',
      purity: '21K',
      name: 'Egyptian Gold Coin (BTC)',
      weightGrams: 8,
      quantity: 1,
      purchasePriceEGP: 3800,
      currentPriceEGP: 4191,
      totalCostEGP: 30400,
      currentValueEGP: 33528,
      totalProfitLossEGP: 3128,
      returnPercentage: 10.29,
      purchaseDate: '2025-01-10',
    },
    {
      id: 'h2',
      assetType: 'GOLD',
      purity: '24K',
      name: '24K Gold Ingot 10g',
      weightGrams: 10,
      quantity: 1,
      purchasePriceEGP: 4300,
      currentPriceEGP: 4790,
      totalCostEGP: 43000,
      currentValueEGP: 47900,
      totalProfitLossEGP: 4900,
      returnPercentage: 11.4,
      purchaseDate: '2025-02-01',
    },
  ];

  const mockTransactions: Transaction[] = [
    {
      id: 't1',
      type: 'BUY',
      assetType: 'GOLD',
      purity: '21K',
      weightGrams: 8,
      pricePerGramOrUnitEGP: 3800,
      totalAmountEGP: 30400,
      date: '2025-01-10',
    },
    {
      id: 't2',
      type: 'BUY',
      assetType: 'GOLD',
      purity: '24K',
      weightGrams: 10,
      pricePerGramOrUnitEGP: 4300,
      totalAmountEGP: 43000,
      date: '2025-02-01',
    },
  ];

  it('correctly computes portfolio risk metrics and ROI', () => {
    const metrics = calculateRiskMetrics(mockHoldings, mockTransactions, 4191);
    expect(metrics.totalCostEGP).toBe(73400);
    expect(metrics.totalValueEGP).toBe(81428);
    expect(metrics.totalProfitEGP).toBe(8028);
    expect(metrics.roiPercentage).toBeGreaterThan(10);
    expect(metrics.averageCost21kEGP).toBeGreaterThan(0);
    expect(metrics.breakEvenPrice21kEGP).toBeGreaterThan(metrics.averageCost21kEGP);
    expect(metrics.riskScore).toBeGreaterThanOrEqual(10);
    expect(metrics.riskScore).toBeLessThanOrEqual(95);
  });

  it('correctly calculates DCA projection over timeline', () => {
    const dca = calculateDCAProjection({
      initialLumpSumEGP: 50000,
      monthlyContributionEGP: 5000,
      durationMonths: 12,
      expectedAnnualGoldAppreciation: 20,
      expectedAnnualInflationRate: 25,
      bankCdRate: 23.5,
    });

    expect(dca.timeline.length).toBe(12);
    expect(dca.totalInvested).toBe(110000);
    expect(dca.finalGoldNominal).toBeGreaterThan(dca.totalInvested);
    expect(dca.finalBankNominal).toBeGreaterThan(dca.totalInvested);
    expect(dca.goldGainNominal).toBe(dca.finalGoldNominal - dca.totalInvested);
  });
});
