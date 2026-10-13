import { describe, it, expect, vi } from 'vitest';
import { exportHoldingsCSV, exportTransactionsCSV } from '../../src/services/reportGenerator';
import { PortfolioHolding, Transaction } from '../../src/types';

describe('Report Generator Unit Tests', () => {
  it('generates holdings CSV download link correctly', () => {
    const mockHoldings: PortfolioHolding[] = [
      {
        id: 'h1',
        assetType: 'GOLD',
        purity: '21K',
        name: 'Gold Coin 8g',
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
    ];

    // Mock document.createElement and body methods
    const linkMock = {
      setAttribute: vi.fn(),
      click: vi.fn(),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(linkMock as any);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => linkMock as any);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => linkMock as any);

    exportHoldingsCSV(mockHoldings);

    expect(linkMock.setAttribute).toHaveBeenCalledWith('href', expect.stringContaining('data:text/csv'));
    expect(linkMock.click).toHaveBeenCalled();
  });

  it('generates transactions CSV download link correctly', () => {
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
    ];

    const linkMock = {
      setAttribute: vi.fn(),
      click: vi.fn(),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(linkMock as any);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => linkMock as any);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => linkMock as any);

    exportTransactionsCSV(mockTransactions);

    expect(linkMock.setAttribute).toHaveBeenCalledWith('href', expect.stringContaining('data:text/csv'));
    expect(linkMock.click).toHaveBeenCalled();
  });
});
