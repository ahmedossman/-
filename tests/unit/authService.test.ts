import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService, DEFAULT_USERS, ROLE_PERMISSIONS } from '../../src/services/authService';

describe('AuthService Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides correct default user profile', () => {
    const user = authService.getCurrentUser();
    expect(user).toBeDefined();
    expect(user.role).toBe('ADMIN');
  });

  it('switches role and saves to storage', () => {
    const switched = authService.switchRole('ANALYST');
    expect(switched.role).toBe('ANALYST');
    expect(authService.getCurrentUser().role).toBe('ANALYST');
  });

  it('has role permissions mapped correctly for all roles', () => {
    expect(ROLE_PERMISSIONS.ADMIN.canAccessAdmin).toBe(true);
    expect(ROLE_PERMISSIONS.INVESTOR.canAccessAdmin).toBe(false);
    expect(ROLE_PERMISSIONS.ANALYST.canAccessAdmin).toBe(false);
    expect(ROLE_PERMISSIONS.GUEST.canAddTransaction).toBe(false);
  });

  it('updates profile attributes correctly', () => {
    const updated = authService.updateProfile({ displayName: 'Chief Analyst', baseCurrency: 'USD' });
    expect(updated.displayName).toBe('Chief Analyst');
    expect(updated.baseCurrency).toBe('USD');
  });
});
