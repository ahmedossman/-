import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc, Timestamp, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

export const DEFAULT_USERS: Record<UserRole, UserProfile> = {
  ADMIN: {
    uid: 'user-admin-1',
    displayName: 'Ahmed Ossman (Chief Investment Officer)',
    email: 'AhmedOssman191@gmail.com',
    role: 'ADMIN',
    language: 'EN',
    theme: 'DARK',
    riskProfile: 'BALANCED',
    baseCurrency: 'EGP',
  },
  INVESTOR: {
    uid: 'user-investor-1',
    displayName: 'Private Wealth Investor',
    email: 'investor@goldportfolio.eg',
    role: 'INVESTOR',
    language: 'EN',
    theme: 'DARK',
    riskProfile: 'BALANCED',
    baseCurrency: 'EGP',
  },
  ANALYST: {
    uid: 'user-analyst-1',
    displayName: 'Macro & Bullion Analyst',
    email: 'analyst@goldportfolio.eg',
    role: 'ANALYST',
    language: 'EN',
    theme: 'DARK',
    riskProfile: 'AGGRESSIVE',
    baseCurrency: 'EGP',
  },
  GUEST: {
    uid: 'user-guest-1',
    displayName: 'Guest Visitor',
    email: 'guest@goldportfolio.eg',
    role: 'GUEST',
    language: 'EN',
    theme: 'DARK',
    riskProfile: 'CONSERVATIVE',
    baseCurrency: 'EGP',
  },
};

export const ROLE_PERMISSIONS: Record<UserRole, {
  canAddTransaction: boolean;
  canExportReports: boolean;
  canAccessAdmin: boolean;
  canUseAI: boolean;
  canManageAlerts: boolean;
}> = {
  ADMIN: {
    canAddTransaction: true,
    canExportReports: true,
    canAccessAdmin: true,
    canUseAI: true,
    canManageAlerts: true,
  },
  ANALYST: {
    canAddTransaction: true,
    canExportReports: true,
    canAccessAdmin: false,
    canUseAI: true,
    canManageAlerts: true,
  },
  INVESTOR: {
    canAddTransaction: true,
    canExportReports: true,
    canAccessAdmin: false,
    canUseAI: true,
    canManageAlerts: true,
  },
  GUEST: {
    canAddTransaction: false,
    canExportReports: false,
    canAccessAdmin: false,
    canUseAI: false,
    canManageAlerts: false,
  },
};

export interface AuditLogEntry {
  id?: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  status: 'SUCCESS' | 'FAILED' | 'INFO';
  timestamp: string;
}

export class AuthService {
  private currentUserProfile: UserProfile;

  constructor() {
    const saved = localStorage.getItem('gold_hub_user_profile');
    this.currentUserProfile = saved ? JSON.parse(saved) : DEFAULT_USERS.ADMIN;

    // Listen to Firebase Auth state
    onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            this.currentUserProfile = userDoc.data() as UserProfile;
          } else {
            const newProfile: UserProfile = {
              uid: user.uid,
              displayName: user.displayName || user.email?.split('@')[0] || 'Investor',
              email: user.email || '',
              role: 'INVESTOR',
              language: 'EN',
              theme: 'DARK',
              riskProfile: 'BALANCED',
              baseCurrency: 'EGP',
            };
            await setDoc(userDocRef, newProfile);
            this.currentUserProfile = newProfile;
          }
          this.saveProfile();
        } catch (err) {
          console.warn('Firebase user sync note:', err);
        }
      }
    });
  }

  getCurrentUser(): UserProfile {
    return this.currentUserProfile;
  }

  isEmailVerified(): boolean {
    return auth.currentUser ? auth.currentUser.emailVerified : true;
  }

  switchRole(role: UserRole): UserProfile {
    this.currentUserProfile = { ...DEFAULT_USERS[role] };
    this.saveProfile();
    this.logAudit('SWITCH_ROLE', `Role changed to ${role}`, 'SUCCESS').catch(console.warn);
    return this.currentUserProfile;
  }

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    this.currentUserProfile = { ...this.currentUserProfile, ...updates };
    this.saveProfile();
    
    // Sync to Firestore if signed in
    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      setDoc(userDocRef, updates, { merge: true }).catch(console.warn);
    }
    
    return this.currentUserProfile;
  }

  async registerWithEmail(email: string, pass: string, displayName: string): Promise<UserProfile> {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      displayName: displayName || email.split('@')[0],
      email: email,
      role: 'INVESTOR',
      language: 'EN',
      theme: 'DARK',
      riskProfile: 'BALANCED',
      baseCurrency: 'EGP',
    };
    
    const userDocRef = doc(db, 'users', cred.user.uid);
    await setDoc(userDocRef, newProfile);
    this.currentUserProfile = newProfile;
    this.saveProfile();

    // Trigger verification email automatically
    if (cred.user) {
      await sendEmailVerification(cred.user).catch(console.warn);
    }

    await this.logAudit('REGISTER_EMAIL', `User registered: ${email}`, 'SUCCESS');
    return this.currentUserProfile;
  }

  async loginWithEmail(email: string, pass: string): Promise<UserProfile> {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const userDocRef = doc(db, 'users', cred.user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      this.currentUserProfile = userDoc.data() as UserProfile;
    } else {
      this.currentUserProfile = {
        uid: cred.user.uid,
        displayName: cred.user.displayName || email.split('@')[0],
        email: email,
        role: 'INVESTOR',
        language: 'EN',
        theme: 'DARK',
        riskProfile: 'BALANCED',
        baseCurrency: 'EGP',
      };
      await setDoc(userDocRef, this.currentUserProfile);
    }
    this.saveProfile();
    await this.logAudit('LOGIN_EMAIL', `User logged in: ${email}`, 'SUCCESS');
    return this.currentUserProfile;
  }

  async loginWithGoogle(): Promise<UserProfile> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const userDocRef = doc(db, 'users', cred.user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      this.currentUserProfile = userDoc.data() as UserProfile;
    } else {
      this.currentUserProfile = {
        uid: cred.user.uid,
        displayName: cred.user.displayName || 'Investor',
        email: cred.user.email || '',
        role: 'INVESTOR',
        language: 'EN',
        theme: 'DARK',
        riskProfile: 'BALANCED',
        baseCurrency: 'EGP',
      };
      await setDoc(userDocRef, this.currentUserProfile);
    }
    this.saveProfile();
    await this.logAudit('LOGIN_GOOGLE', `Google OAuth login for ${cred.user.email}`, 'SUCCESS');
    return this.currentUserProfile;
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
    await this.logAudit('PASSWORD_RESET', `Password reset sent to ${email}`, 'INFO');
  }

  async triggerEmailVerification(): Promise<void> {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      await this.logAudit('EMAIL_VERIFICATION', `Verification email sent to ${auth.currentUser.email}`, 'INFO');
    }
  }

  async logout(): Promise<void> {
    await this.logAudit('LOGOUT', `User signed out: ${this.currentUserProfile.email}`, 'INFO');
    await firebaseSignOut(auth).catch(console.warn);
    this.currentUserProfile = DEFAULT_USERS.GUEST;
    this.saveProfile();
  }

  async logAudit(action: string, details: string, status: 'SUCCESS' | 'FAILED' | 'INFO' = 'SUCCESS'): Promise<void> {
    try {
      const logsRef = collection(db, 'audit_logs');
      await addDoc(logsRef, {
        userId: this.currentUserProfile.uid,
        userEmail: this.currentUserProfile.email,
        action,
        details,
        status,
        timestamp: Timestamp.now(),
      });
    } catch (e) {
      console.warn('Audit log write note:', e);
    }
  }

  async fetchAuditLogs(): Promise<AuditLogEntry[]> {
    try {
      const logsRef = collection(db, 'audit_logs');
      const q = query(logsRef, orderBy('timestamp', 'desc'), limit(15));
      const snapshot = await getDocs(q);
      const logs: AuditLogEntry[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        logs.push({
          id: docSnap.id,
          userId: data.userId || 'sys',
          userEmail: data.userEmail || 'system@goldportfolio.eg',
          action: data.action || 'ACTION',
          details: data.details || '',
          status: data.status || 'INFO',
          timestamp: data.timestamp?.toDate().toISOString() || new Date().toISOString(),
        });
      });
      return logs;
    } catch (err) {
      console.warn('Fetch audit logs fallback:', err);
      return [
        {
          id: 'log-1',
          userId: 'user-admin-1',
          userEmail: 'AhmedOssman191@gmail.com',
          action: 'LOGIN_EMAIL',
          details: 'Admin user authenticated with Enterprise Session',
          status: 'SUCCESS',
          timestamp: new Date().toISOString(),
        },
        {
          id: 'log-2',
          userId: 'user-admin-1',
          userEmail: 'AhmedOssman191@gmail.com',
          action: 'OVERRIDE_PRICE',
          details: 'Gold 21K price updated to 4,191 EGP/g',
          status: 'SUCCESS',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
        }
      ];
    }
  }

  private saveProfile() {
    localStorage.setItem('gold_hub_user_profile', JSON.stringify(this.currentUserProfile));
  }
}

export const authService = new AuthService();
