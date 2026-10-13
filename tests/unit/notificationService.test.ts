import { describe, it, expect, beforeEach } from 'vitest';
import { notificationService, DEFAULT_NOTIFICATION_PREFERENCES } from '../../src/services/notificationService';

describe('NotificationService Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads default notification preferences correctly', () => {
    const prefs = notificationService.loadPreferences();
    expect(prefs.emailEnabled).toBe(true);
    expect(prefs.pushEnabled).toBe(true);
    expect(prefs.priceAlertsEnabled).toBe(true);
  });

  it('updates and persists preferences in localStorage', () => {
    notificationService.savePreferences({ emailEnabled: false });
    const prefs = notificationService.getPreferences();
    expect(prefs.emailEnabled).toBe(false);
    expect(prefs.pushEnabled).toBe(true);
  });
});
