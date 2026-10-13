import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useApp } from './AppContext';
import { realtimeStore, RealtimeMarketTick } from '../services/realtimeStore';

export type SocketStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING';

interface SocketContextType {
  status: SocketStatus;
  isConnected: boolean;
  tickCount: number;
  lastTickTime: string | null;
  latestTick: RealtimeMarketTick | null;
  latencyMs: number;
  reconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { updateMarketPrices, setMarketConnectionStatus } = useApp();
  const [status, setStatus] = useState<SocketStatus>('CONNECTING');
  const [tickCount, setTickCount] = useState<number>(0);
  const [lastTickTime, setLastTickTime] = useState<string | null>(null);
  const [latestTick, setLatestTick] = useState<RealtimeMarketTick | null>(null);
  const [latencyMs, setLatencyMs] = useState<number>(12);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const backoffDelayRef = useRef<number>(1000); // Initial 1s backoff

  const updateStatus = (newStatus: SocketStatus) => {
    setStatus(newStatus);
    if (newStatus === 'CONNECTED') {
      setMarketConnectionStatus('CONNECTED');
    } else if (newStatus === 'CONNECTING' || newStatus === 'RECONNECTING') {
      setMarketConnectionStatus('CONNECTING');
    } else {
      setMarketConnectionStatus('DISCONNECTED');
    }
  };

  const connectSocket = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch (e) {
        // ignore
      }
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    updateStatus(backoffDelayRef.current > 1000 ? 'RECONNECTING' : 'CONNECTING');

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        updateStatus('CONNECTED');
        realtimeStore.setConnected(true);
        backoffDelayRef.current = 1000; // Reset exponential backoff on successful connection
        console.log('[WebSocket Engine] Realtime Market Data Stream Connected.');

        // Setup 20s heartbeat PING
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'PING' }));
          }
        }, 20000);
      };

      ws.onmessage = (event) => {
        try {
          const startTime = performance.now();
          const message = JSON.parse(event.data);

          if (
            message.type === 'INIT_MARKET_DATA' ||
            message.type === 'MARKET_TICK' ||
            message.type === 'MARKET_UPDATE' ||
            message.type === 'MARKET_SNAPSHOT'
          ) {
            const feedData = message.data;
            if (!feedData) return;

            const seq = message.sequence || 0;
            const timestamp = message.timestamp || new Date().toISOString();
            const calcLatency = Math.round(performance.now() - startTime);

            setLatencyMs(calcLatency > 0 ? calcLatency : 12);
            setTickCount((prev) => prev + 1);
            setLastTickTime(timestamp);

            // Push tick to realtime store
            realtimeStore.pushTick(feedData, seq, timestamp, calcLatency);
            setLatestTick({
              sequence: seq,
              timestamp,
              feed: feedData,
              latencyMs: calcLatency,
            });

            // Update React AppContext global market state automatically
            updateMarketPrices(feedData);
          }
        } catch (err) {
          console.warn('[WebSocket] Error parsing market payload:', err);
        }
      };

      ws.onerror = (err) => {
        console.warn('[WebSocket] Transport error:', err);
        updateStatus('DISCONNECTED');
        realtimeStore.setConnected(false);
      };

      ws.onclose = () => {
        updateStatus('DISCONNECTED');
        realtimeStore.setConnected(false);
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);

        const currentDelay = backoffDelayRef.current;
        console.warn(`[WebSocket] Connection lost. Reconnecting in ${currentDelay}ms...`);

        // Schedule reconnect with exponential backoff (1s, 2s, 4s, 8s... max 30s)
        backoffDelayRef.current = Math.min(currentDelay * 2, 30000);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectSocket();
        }, currentDelay);
      };
    } catch (e) {
      console.warn('[WebSocket] Socket creation exception:', e);
      updateStatus('DISCONNECTED');
      const currentDelay = backoffDelayRef.current;
      backoffDelayRef.current = Math.min(currentDelay * 2, 30000);
      reconnectTimeoutRef.current = setTimeout(() => {
        connectSocket();
      }, currentDelay);
    }
  };

  useEffect(() => {
    connectSocket();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        status,
        isConnected: status === 'CONNECTED',
        tickCount,
        lastTickTime,
        latestTick,
        latencyMs,
        reconnect: () => {
          backoffDelayRef.current = 1000;
          connectSocket();
        },
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return ctx;
};
