import { describe, it, expect, beforeEach } from 'vitest';
import { adminService } from '../../src/services/adminService';

describe('AdminService Unit Tests', () => {
  beforeEach(() => {
    adminService.restoreDefaults();
  });

  it('lists initial admin users', () => {
    const users = adminService.getUsers();
    expect(users.length).toBeGreaterThan(0);
    expect(users[0].role).toBe('ADMIN');
  });

  it('adds a new user correctly', () => {
    const newUser = adminService.addUser({
      displayName: 'Test Partner',
      email: 'testpartner@goldportfolio.eg',
      role: 'ANALYST',
      language: 'EN',
      theme: 'DARK',
      riskProfile: 'BALANCED',
      baseCurrency: 'EGP',
      status: 'ACTIVE',
    });
    expect(newUser.uid).toBeDefined();
    const users = adminService.getUsers();
    expect(users.some((u) => u.email === 'testpartner@goldportfolio.eg')).toBe(true);
  });

  it('toggles feature flags', () => {
    const flags = adminService.getFeatureFlags();
    const firstFlag = flags[0];
    const originalState = firstFlag.enabled;
    const updated = adminService.toggleFeatureFlag(firstFlag.id);
    expect(updated?.enabled).toBe(!originalState);
  });

  it('creates and deletes state backups', () => {
    const initialCount = adminService.getBackups().length;
    const newBk = adminService.createBackup('Test Runner');
    expect(adminService.getBackups().length).toBe(initialCount + 1);

    adminService.deleteBackup(newBk.id);
    expect(adminService.getBackups().length).toBe(initialCount);
  });

  it('updates global system settings', () => {
    const updated = adminService.updateSettings({ refreshIntervalSeconds: 45 });
    expect(updated.refreshIntervalSeconds).toBe(45);
    expect(adminService.getSettings().refreshIntervalSeconds).toBe(45);
  });
});
