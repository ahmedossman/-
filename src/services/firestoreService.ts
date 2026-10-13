import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc,
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Transaction, PortfolioHolding, GoldPriceFeed, AppNotification, UserProfile } from '../types';

export class FirestoreService {
  // Sync transactions to Firestore
  async saveTransaction(userId: string, transaction: Transaction): Promise<void> {
    try {
      const txRef = doc(db, 'users', userId, 'transactions', transaction.id);
      await setDoc(txRef, {
        ...transaction,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.warn('Firestore transaction save fallback:', error);
    }
  }

  // Delete transaction from Firestore
  async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    try {
      const txRef = doc(db, 'users', userId, 'transactions', transactionId);
      await deleteDoc(txRef);
    } catch (error) {
      console.warn('Firestore transaction delete fallback:', error);
    }
  }

  // Save holdings to Firestore
  async saveHoldings(userId: string, holdings: PortfolioHolding[]): Promise<void> {
    try {
      const portfolioRef = doc(db, 'users', userId, 'portfolios', 'main_portfolio');
      await setDoc(portfolioRef, {
        userId,
        holdings,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.warn('Firestore holdings save fallback:', error);
    }
  }

  // Subscribe to market price feeds in Firestore
  subscribeLiveMarketPrices(callback: (prices: Partial<GoldPriceFeed>) => void): () => void {
    try {
      const pricesRef = doc(db, 'gold_prices', 'latest');
      return onSnapshot(pricesRef, (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data() as Partial<GoldPriceFeed>);
        }
      }, (err) => {
        console.warn('Firestore live market price snapshot note:', err);
      });
    } catch (error) {
      console.warn('Firestore market listener init fallback:', error);
      return () => {};
    }
  }

  // Push latest market prices to Firestore cache
  async updateLiveMarketCache(prices: GoldPriceFeed): Promise<void> {
    try {
      const pricesRef = doc(db, 'gold_prices', 'latest');
      await setDoc(pricesRef, {
        ...prices,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.warn('Firestore market cache update fallback:', error);
    }
  }

  // Save Audit Log
  async logAuditEvent(userId: string, action: string, details: string): Promise<void> {
    try {
      const logRef = doc(collection(db, 'audit_logs'));
      await setDoc(logRef, {
        userId,
        action,
        details,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.warn('Audit log write fallback:', error);
    }
  }
}

export const firestoreService = new FirestoreService();
