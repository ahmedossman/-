import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, query, orderBy, limit, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import app, { db, auth } from '../lib/firebase';
import { AppNotification } from '../types';

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  priceAlertsEnabled: boolean;
  portfolioAlertsEnabled: boolean;
  aiAlertsEnabled: boolean;
  economicAlertsEnabled: boolean;
  fcmToken?: string;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  pushEnabled: true,
  emailEnabled: true,
  priceAlertsEnabled: true,
  portfolioAlertsEnabled: true,
  aiAlertsEnabled: true,
  economicAlertsEnabled: true,
};

export interface CustomPriceAlert {
  id: string;
  asset: string;
  condition: 'ABOVE' | 'BELOW';
  price: number;
  triggered?: boolean;
  createdAt: string;
}

export class NotificationService {
  private preferences: NotificationPreferences = DEFAULT_NOTIFICATION_PREFERENCES;
  private fcmToken: string | null = null;
  private messagingInstance: any = null;

  constructor() {
    this.loadPreferences();
    this.initFCM().catch((err) => console.warn('FCM Init Note:', err));
  }

  // Initialize Firebase Cloud Messaging
  async initFCM(): Promise<string | null> {
    try {
      const supported = await isSupported().catch(() => false);
      if (!supported) {
        console.log('Firebase Cloud Messaging not supported in this environment');
        return null;
      }

      this.messagingInstance = getMessaging(app);

      // Listen to incoming foreground messages
      onMessage(this.messagingInstance, (payload) => {
        console.log('FCM Foreground Message:', payload);
        if (payload.notification) {
          this.triggerNativePush(payload.notification.title || 'Gold Hub Alert', payload.notification.body || '');
        }
      });

      return this.fcmToken;
    } catch (err) {
      console.warn('FCM initialization fallback:', err);
      return null;
    }
  }

  // Request Web Push Notification permissions & register FCM Token
  async requestPushPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.preferences.pushEnabled = true;
        this.savePreferences();

        if (this.messagingInstance) {
          try {
            const token = await getToken(this.messagingInstance, {
              vapidKey: 'BEl62iUYgUivxI-257kKEY-demo-vapid-key-gold-hub',
            });
            if (token) {
              this.fcmToken = token;
              this.preferences.fcmToken = token;
              this.savePreferences();
              console.log('FCM Registration Token generated:', token);
            }
          } catch (e) {
            console.warn('VAPID Token request note:', e);
          }
        }
        return true;
      } else {
        this.preferences.pushEnabled = false;
        this.savePreferences();
        return false;
      }
    } catch (err) {
      console.warn('Notification permission error:', err);
      return false;
    }
  }

  // Native OS / Browser Push Popup
  triggerNativePush(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted' && this.preferences.pushEnabled) {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Native notification popup note:', e);
      }
    }
  }

  // Dispatch Email Alert (simulated & queued in Firestore)
  async dispatchEmailAlert(email: string, title: string, body: string): Promise<void> {
    if (!this.preferences.emailEnabled) return;

    try {
      const queueRef = collection(db, 'mail_queue');
      await addDoc(queueRef, {
        to: email,
        message: {
          subject: `[Gold Hub Alert] ${title}`,
          text: body,
          html: `<div style="font-family: sans-serif; padding: 20px; background: #0D1424; color: #fff;">
                  <h2 style="color: #f59e0b;">${title}</h2>
                  <p>${body}</p>
                  <hr style="border-color: #334155; margin-top: 20px;" />
                  <small style="color: #94a3b8;">Gold Portfolio Hub Enterprise Notification System</small>
                 </div>`,
        },
        createdAt: Timestamp.now(),
      });
      console.log('Dispatched email alert to queue for:', email);
    } catch (e) {
      console.warn('Email dispatch queue fallback:', e);
    }
  }

  // Load preferences
  loadPreferences(): NotificationPreferences {
    const saved = localStorage.getItem('gold_hub_notif_prefs');
    if (saved) {
      try {
        this.preferences = { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(saved) };
      } catch (e) {}
    }
    return this.preferences;
  }

  // Save preferences
  savePreferences(prefs?: Partial<NotificationPreferences>): NotificationPreferences {
    if (prefs) {
      this.preferences = { ...this.preferences, ...prefs };
    }
    localStorage.setItem('gold_hub_notif_prefs', JSON.stringify(this.preferences));

    // Sync to Firestore user document
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      setDoc(userRef, { notificationPreferences: this.preferences }, { merge: true }).catch(console.warn);
    }

    return this.preferences;
  }

  getPreferences(): NotificationPreferences {
    return this.preferences;
  }

  // Fetch Firestore Notification History
  async fetchNotificationHistory(): Promise<AppNotification[]> {
    if (!auth.currentUser) return [];

    try {
      const notifsRef = collection(db, 'users', auth.currentUser.uid, 'notifications');
      const q = query(notifsRef, orderBy('timestamp', 'desc'), limit(30));
      const snapshot = await getDocs(q);
      const list: AppNotification[] = [];

      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          title: d.title || 'Alert',
          message: d.message || '',
          type: d.type || 'SYSTEM',
          read: d.read ?? false,
          timestamp: d.timestamp?.toDate ? d.timestamp.toDate().toLocaleTimeString() : d.timestamp || 'Just now',
          link: d.link,
        });
      });

      return list;
    } catch (err) {
      console.warn('Fetch notification history fallback:', err);
      return [];
    }
  }

  // Save notification to Firestore
  async saveNotification(notif: AppNotification): Promise<void> {
    if (auth.currentUser) {
      try {
        const notifRef = doc(db, 'users', auth.currentUser.uid, 'notifications', notif.id);
        await setDoc(notifRef, {
          ...notif,
          timestamp: Timestamp.now(),
        });
      } catch (e) {
        console.warn('Save notification fallback:', e);
      }
    }
  }
}

export const notificationService = new NotificationService();
