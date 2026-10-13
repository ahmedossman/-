import { UserProfile, UserRole } from '../types';
import { ROLE_PERMISSIONS, DEFAULT_USERS } from './authService';

export interface AdminUser extends UserProfile {
  status: 'ACTIVE' | 'SUSPENDED';
  lastLogin: string;
  createdAt: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'AI' | 'SECURITY' | 'MARKET' | 'PORTFOLIO' | 'SYSTEM';
}

export interface SystemBackup {
  id: string;
  timestamp: string;
  version: string;
  sizeKb: number;
  recordsCount: number;
  createdBy: string;
  dataJson: string;
}

export interface SystemSettings {
  defaultCurrency: 'EGP' | 'USD';
  refreshIntervalSeconds: number;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  mandatoryMfa: boolean;
  sessionTimeoutMinutes: number;
  maxHoldingsLimit: number;
  supportEmail: string;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'ff-1',
    key: 'enableGeminiAISignals',
    name: 'Gemini 3.6 Flash Realtime AI Signals',
    description: 'Generates automated bullish/bearish confidence scores & price target forecasts',
    enabled: true,
    category: 'AI',
  },
  {
    id: 'ff-2',
    key: 'enablePushNotifications',
    name: 'Firebase Cloud Messaging (FCM) Push',
    description: 'Sends real-time web & native push alerts on market threshold triggers',
    enabled: true,
    category: 'SECURITY',
  },
  {
    id: 'ff-3',
    key: 'enableCairoBullionOverride',
    name: 'Cairo Bullion Live Manual Overrides',
    description: 'Allows Admin users to manually override Gold 21K, 24K, and USD parallel rates',
    enabled: true,
    category: 'MARKET',
  },
  {
    id: 'ff-4',
    key: 'enableCryptoEGXAssets',
    name: 'Crypto & EGX 30 Stock Assets Tracking',
    description: 'Enables users to include Bitcoin and Egyptian Exchange equities in portfolio',
    enabled: true,
    category: 'PORTFOLIO',
  },
  {
    id: 'ff-5',
    key: 'enableDCASimulatorEngine',
    name: 'Dollar-Cost Averaging (DCA) Projection Engine',
    description: 'Provides 36-month wealth accumulation projections against inflation',
    enabled: true,
    category: 'PORTFOLIO',
  },
  {
    id: 'ff-6',
    key: 'enableDetailedStressTest',
    name: 'Monte Carlo Portfolio Stress Test',
    description: 'Simulates devaluation & inflation shock scenarios on asset yields',
    enabled: true,
    category: 'PORTFOLIO',
  },
  {
    id: 'ff-7',
    key: 'maintenanceMode',
    name: 'System Maintenance Mode',
    description: 'Displays a maintenance banner and restricts read-only access for guests',
    enabled: false,
    category: 'SYSTEM',
  },
];

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  defaultCurrency: 'EGP',
  refreshIntervalSeconds: 30,
  maintenanceMode: false,
  maintenanceMessage: 'System upgrading market feed connections. Services will resume shortly.',
  mandatoryMfa: false,
  sessionTimeoutMinutes: 60,
  maxHoldingsLimit: 100,
  supportEmail: 'support@goldportfolio.eg',
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    ...DEFAULT_USERS.ADMIN,
    status: 'ACTIVE',
    lastLogin: new Date().toISOString(),
    createdAt: '2025-01-01',
  },
  {
    ...DEFAULT_USERS.ANALYST,
    status: 'ACTIVE',
    lastLogin: new Date(Date.now() - 3600000).toISOString(),
    createdAt: '2025-01-15',
  },
  {
    ...DEFAULT_USERS.INVESTOR,
    status: 'ACTIVE',
    lastLogin: new Date(Date.now() - 86400000).toISOString(),
    createdAt: '2025-02-01',
  },
  {
    uid: 'user-investor-2',
    displayName: 'Cairo Bullion Merchant',
    email: 'merchant@cairogold.eg',
    role: 'INVESTOR',
    language: 'AR',
    theme: 'DARK',
    riskProfile: 'AGGRESSIVE',
    baseCurrency: 'EGP',
    status: 'ACTIVE',
    lastLogin: new Date(Date.now() - 172800000).toISOString(),
    createdAt: '2025-02-10',
  },
  {
    uid: 'user-guest-2',
    displayName: 'Suspended Account Test',
    email: 'suspended@test.com',
    role: 'GUEST',
    language: 'EN',
    theme: 'DARK',
    riskProfile: 'CONSERVATIVE',
    baseCurrency: 'EGP',
    status: 'SUSPENDED',
    lastLogin: '2025-01-20',
    createdAt: '2025-01-20',
  },
];

export class AdminService {
  private users: AdminUser[] = [];
  private featureFlags: FeatureFlag[] = [];
  private settings: SystemSettings = DEFAULT_SYSTEM_SETTINGS;
  private backups: SystemBackup[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const u = localStorage.getItem('gold_hub_admin_users');
      this.users = u ? JSON.parse(u) : INITIAL_ADMIN_USERS;

      const ff = localStorage.getItem('gold_hub_feature_flags');
      this.featureFlags = ff ? JSON.parse(ff) : DEFAULT_FEATURE_FLAGS;

      const st = localStorage.getItem('gold_hub_system_settings');
      this.settings = st ? JSON.parse(st) : DEFAULT_SYSTEM_SETTINGS;

      const bk = localStorage.getItem('gold_hub_backups');
      this.backups = bk ? JSON.parse(bk) : [
        {
          id: 'bk-1',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          version: '1.4.2-enterprise',
          sizeKb: 142.5,
          recordsCount: 420,
          createdBy: 'Ahmed Ossman (CIO)',
          dataJson: JSON.stringify({ users: INITIAL_ADMIN_USERS, settings: DEFAULT_SYSTEM_SETTINGS }),
        }
      ];
    } catch (e) {
      this.users = INITIAL_ADMIN_USERS;
      this.featureFlags = DEFAULT_FEATURE_FLAGS;
      this.settings = DEFAULT_SYSTEM_SETTINGS;
    }
  }

  private saveUsers() {
    localStorage.setItem('gold_hub_admin_users', JSON.stringify(this.users));
  }

  private saveFlags() {
    localStorage.setItem('gold_hub_feature_flags', JSON.stringify(this.featureFlags));
  }

  private saveSettings() {
    localStorage.setItem('gold_hub_system_settings', JSON.stringify(this.settings));
  }

  private saveBackups() {
    localStorage.setItem('gold_hub_backups', JSON.stringify(this.backups));
  }

  // User Management
  getUsers(): AdminUser[] {
    return this.users;
  }

  addUser(user: Omit<AdminUser, 'uid' | 'createdAt' | 'lastLogin'>): AdminUser {
    const newUser: AdminUser = {
      ...user,
      uid: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLogin: 'Never',
    };
    this.users = [newUser, ...this.users];
    this.saveUsers();
    return newUser;
  }

  updateUser(uid: string, updates: Partial<AdminUser>): AdminUser | null {
    const idx = this.users.findIndex((u) => u.uid === uid);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates };
      this.saveUsers();
      return this.users[idx];
    }
    return null;
  }

  deleteUser(uid: string): boolean {
    const initialLen = this.users.length;
    this.users = this.users.filter((u) => u.uid !== uid);
    this.saveUsers();
    return this.users.length < initialLen;
  }

  toggleUserStatus(uid: string): AdminUser | null {
    const idx = this.users.findIndex((u) => u.uid === uid);
    if (idx !== -1) {
      const current = this.users[idx].status;
      this.users[idx].status = current === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      this.saveUsers();
      return this.users[idx];
    }
    return null;
  }

  // Feature Flags
  getFeatureFlags(): FeatureFlag[] {
    return this.featureFlags;
  }

  toggleFeatureFlag(id: string): FeatureFlag | null {
    const idx = this.featureFlags.findIndex((f) => f.id === id);
    if (idx !== -1) {
      this.featureFlags[idx].enabled = !this.featureFlags[idx].enabled;
      this.saveFlags();
      return this.featureFlags[idx];
    }
    return null;
  }

  // System Settings
  getSettings(): SystemSettings {
    return this.settings;
  }

  updateSettings(updates: Partial<SystemSettings>): SystemSettings {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
    return this.settings;
  }

  // Backups & Restore
  getBackups(): SystemBackup[] {
    return this.backups;
  }

  createBackup(creator: string = 'Admin'): SystemBackup {
    const backupData = {
      timestamp: new Date().toISOString(),
      users: this.users,
      featureFlags: this.featureFlags,
      settings: this.settings,
      holdings: localStorage.getItem('gold_portfolio_holdings'),
      transactions: localStorage.getItem('gold_portfolio_transactions'),
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const newBackup: SystemBackup = {
      id: `bk-${Date.now()}`,
      timestamp: new Date().toISOString(),
      version: '1.5.0-enterprise',
      sizeKb: Math.round((jsonStr.length / 1024) * 10) / 10,
      recordsCount: this.users.length + this.featureFlags.length + 50,
      createdBy: creator,
      dataJson: jsonStr,
    };
    this.backups = [newBackup, ...this.backups];
    this.saveBackups();
    return newBackup;
  }

  restoreBackup(backupId: string): boolean {
    const bk = this.backups.find((b) => b.id === backupId);
    if (!bk) return false;
    try {
      const parsed = JSON.parse(bk.dataJson);
      if (parsed.users) {
        this.users = parsed.users;
        this.saveUsers();
      }
      if (parsed.featureFlags) {
        this.featureFlags = parsed.featureFlags;
        this.saveFlags();
      }
      if (parsed.settings) {
        this.settings = parsed.settings;
        this.saveSettings();
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  deleteBackup(backupId: string): boolean {
    this.backups = this.backups.filter((b) => b.id !== backupId);
    this.saveBackups();
    return true;
  }

  restoreDefaults() {
    this.users = INITIAL_ADMIN_USERS;
    this.featureFlags = DEFAULT_FEATURE_FLAGS;
    this.settings = DEFAULT_SYSTEM_SETTINGS;
    this.saveUsers();
    this.saveFlags();
    this.saveSettings();
  }
}

export const adminService = new AdminService();
