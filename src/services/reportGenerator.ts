import { PortfolioHolding, Transaction, RiskMetrics, GoldPriceFeed } from '../types';

export function exportHoldingsCSV(holdings: PortfolioHolding[]): void {
  const headers = ['ID,Asset,Purity,Name,Grams/Qty,AvgCostEGP,CurrentPriceEGP,TotalCostEGP,CurrentValueEGP,ProfitLossEGP,Return%'];
  const rows = holdings.map((h) =>
    [
      h.id,
      h.assetType,
      h.purity || '',
      `"${h.name.replace(/"/g, '""')}"`,
      h.weightGrams || h.quantity,
      h.purchasePriceEGP,
      h.currentPriceEGP,
      h.totalCostEGP,
      h.currentValueEGP,
      h.totalProfitLossEGP,
      `${h.returnPercentage}%`,
    ].join(',')
  );

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Gold_Portfolio_Holdings_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTransactionsCSV(transactions: Transaction[]): void {
  const headers = ['ID,Type,Asset,Purity,WeightGrams,PricePerUnit,TotalAmountEGP,WorkmanshipFee,Date,Notes'];
  const rows = transactions.map((t) =>
    [
      t.id,
      t.type,
      t.assetType,
      t.purity || '',
      t.weightGrams || '',
      t.pricePerGramOrUnitEGP,
      t.totalAmountEGP,
      t.workmanshipFeePerGramEGP || 0,
      t.date,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ].join(',')
  );

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Gold_Portfolio_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generatePrintableReport(
  holdings: PortfolioHolding[],
  riskMetrics: RiskMetrics,
  marketData: GoldPriceFeed
) {
  const windowRef = window.open('', '_blank');
  if (!windowRef) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Gold Portfolio Hub - Executive Wealth Report</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; }
          h1 { color: #b45309; margin-bottom: 5px; }
          .header { border-bottom: 2px solid #e2e8f0; pb-20px; margin-bottom: 20px; }
          .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
          .card { background: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 8px; }
          .card-title { font-size: 11px; color: #64748b; font-weight: bold; }
          .card-value { font-size: 18px; font-weight: bold; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
          th { background: #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Egyptian Gold Portfolio Hub</h1>
          <p>Executive Statement & Wealth Audit Report | Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="grid">
          <div class="card"><div class="card-title">TOTAL PORTFOLIO VALUE</div><div class="card-value">${riskMetrics.totalValueEGP.toLocaleString()} EGP</div></div>
          <div class="card"><div class="card-title">COST BASIS</div><div class="card-value">${riskMetrics.totalCostEGP.toLocaleString()} EGP</div></div>
          <div class="card"><div class="card-title">UNREALIZED PROFIT</div><div class="card-value">+${riskMetrics.totalProfitEGP.toLocaleString()} EGP (${riskMetrics.roiPercentage}%)</div></div>
          <div class="card"><div class="card-title">AVG COST 21K GRAM</div><div class="card-value">${riskMetrics.averageCost21kEGP.toLocaleString()} EGP</div></div>
        </div>

        <h2>Detailed Holdings Inventory</h2>
        <table>
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Category</th>
              <th>Grams / Qty</th>
              <th>Avg Purchase Cost</th>
              <th>Live Market Rate</th>
              <th>Total Value</th>
              <th>P/L</th>
            </tr>
          </thead>
          <tbody>
            ${holdings
              .map(
                (h) => `
              <tr>
                <td><strong>${h.name}</strong></td>
                <td>${h.assetType}</td>
                <td>${h.weightGrams ? h.weightGrams + 'g' : h.quantity}</td>
                <td>${h.purchasePriceEGP.toLocaleString()} EGP</td>
                <td>${h.currentPriceEGP.toLocaleString()} EGP</td>
                <td><strong>${h.currentValueEGP.toLocaleString()} EGP</strong></td>
                <td style="color: ${h.totalProfitLossEGP >= 0 ? '#059669' : '#dc2626'}">
                  ${h.totalProfitLossEGP >= 0 ? '+' : ''}${h.totalProfitLossEGP.toLocaleString()} EGP (${h.returnPercentage}%)
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <script>window.print();</script>
      </body>
    </html>
  `;

  windowRef.document.write(html);
  windowRef.document.close();
}
