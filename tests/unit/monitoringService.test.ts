import { describe, it, expect } from 'vitest';
import { monitoringService } from '../../src/services/monitoringService';

describe('Monitoring & Analytics Service Unit Tests', () => {
  it('records performance metrics correctly', () => {
    monitoringService.recordMetric('TTFB', 120, { source: 'Server API' });
    const summary = monitoringService.getMetricsSummary();
    expect(summary.metricsCount).toBeGreaterThan(0);
    expect(summary.recentMetrics[summary.recentMetrics.length - 1].name).toBe('TTFB');
  });

  it('reports runtime errors into queue', () => {
    monitoringService.reportError({
      message: 'Test handled exception',
      severity: 'WARNING',
      timestamp: new Date().toISOString(),
    });
    const summary = monitoringService.getMetricsSummary();
    expect(summary.errorCount).toBeGreaterThan(0);
    expect(summary.recentErrors[summary.recentErrors.length - 1].message).toBe('Test handled exception');
  });
});
