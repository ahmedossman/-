import { describe, it, expect } from 'vitest';
import { authService } from '../../src/services/authService';
import { notificationService } from '../../src/services/notificationService';
import { marketDataLayer } from '../../src/services/marketDataProvider';

describe('E2E Simulation Workflow Tests', () => {
  it('simulates full investment workflow: auth -> price check -> custom alert -> audit log', async () => {
    // Step 1: User Login & Role Switch
    const user = authService.switchRole('INVESTOR');
    expect(user.role).toBe('INVESTOR');

    // Step 2: Fetch Market Feed
    const { feed } = await marketDataLayer.getMarketFeed(true);
    expect(feed.gold21kEGP).toBeGreaterThan(0);

    // Step 3: Trigger custom price notification
    const prefs = notificationService.getPreferences();
    expect(prefs.priceAlertsEnabled).toBe(true);

    // Step 4: Audit Log Generation
    await authService.logAudit('E2E_WORKFLOW_TEST', 'Simulated end to end user portfolio check', 'SUCCESS');
    const logs = await authService.fetchAuditLogs();
    expect(logs.length).toBeGreaterThan(0);
  });
});
