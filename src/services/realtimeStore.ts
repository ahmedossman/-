import { GoldPriceFeed } from '../types';

export interface RealtimeMarketTick {
  sequence: number;
  timestamp: string;
  feed: GoldPriceFeed;
  latencyMs?: number;
}

export type TickListener = (tick: RealtimeMarketTick) => void;

class RealtimeStore {
  private listeners: Set<TickListener> = new Set();
  private tickHistory: RealtimeMarketTick[] = [];
  private maxHistoryLength = 120; // 2 minutes of 1-second ticks
  private currentTick: RealtimeMarketTick | null = null;
  private isConnected = false;

  subscribe(listener: TickListener): () => void {
    this.listeners.add(listener);
    if (this.currentTick) {
      listener(this.currentTick);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  setConnected(status: boolean) {
    this.isConnected = status;
  }

  getIsConnected() {
    return this.isConnected;
  }

  pushTick(data: GoldPriceFeed, sequence: number, timestamp: string, latencyMs?: number) {
    const tick: RealtimeMarketTick = {
      sequence,
      timestamp,
      feed: data,
      latencyMs,
    };

    this.currentTick = tick;
    this.tickHistory.push(tick);
    if (this.tickHistory.length > this.maxHistoryLength) {
      this.tickHistory.shift();
    }

    this.listeners.forEach((listener) => {
      try {
        listener(tick);
      } catch (err) {
        console.warn('[RealtimeStore] Listener error:', err);
      }
    });
  }

  getLatestTick(): RealtimeMarketTick | null {
    return this.currentTick;
  }

  getTickHistory(): RealtimeMarketTick[] {
    return this.tickHistory;
  }
}

export const realtimeStore = new RealtimeStore();
