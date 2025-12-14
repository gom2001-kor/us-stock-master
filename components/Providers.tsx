"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { StockDetail, StockSignal } from "@/lib/types";
import { MOCK_STOCKS } from "@/lib/stock-data";

export type MarketData = {
  snp500: { value: number; change: number };
  nasdaq: { value: number; change: number };
  dow: { value: number; change: number };
  us10y: number; // 10년물 국채
  fearGreed: number; // 공포/탐욕 지수 (0-100)
  exchangeRate: number; // 원/달러
  oil: number; // 유가 (WTI)
};

// Types and Helpers are now imported from @/lib/stock-data and @/lib/types

export type PortfolioItem = {
  id: string; // Unique ID (e.g. ticker + timestamp)
  ticker: string;
  quantity: number;
  avgPrice: number;
};

// --- Mock Data (Korean) ---

const MOCK_MARKET_DATA: MarketData = {
  snp500: { value: 5234.12, change: 0.45 },
  nasdaq: { value: 16421.30, change: 0.82 },
  dow: { value: 39120.50, change: -0.12 },
  us10y: 4.25,
  fearGreed: 72, // Greed
  exchangeRate: 1385.50,
  oil: 81.20,
};

// MOCK_STOCKS is imported from @/lib/stock-data

// --- Contexts ---

export type WatchlistContextType = {
  watchlist: string[];
  addToWatchlist: (ticker: string) => void;
  removeFromWatchlist: (ticker: string) => void;
  isWatched: (ticker: string) => boolean;
};

const MarketContext = createContext<MarketData | undefined>(undefined);
const StockContext = createContext<StockDetail[] | undefined>(undefined);
const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

interface PortfolioContextType {
  portfolio: PortfolioItem[];
  addHolding: (ticker: string, quantity: number, avgPrice: number) => void;
  removeHolding: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// --- Provider Component ---

export function Providers({ children }: { children: ReactNode }) {
  const [marketData] = useState<MarketData>(MOCK_MARKET_DATA);
  const [stocks] = useState<StockDetail[]>(MOCK_STOCKS);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const loadedPortfolio = localStorage.getItem("portfolio");
    const loadedWatchlist = localStorage.getItem("watchlist");
    if (loadedPortfolio) {
      setPortfolio(JSON.parse(loadedPortfolio));
    }
    if (loadedWatchlist) {
      setWatchlist(JSON.parse(loadedWatchlist));
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("portfolio", JSON.stringify(portfolio));
    }
  }, [portfolio, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist, isLoaded]);

  // Portfolio Handlers
  const addHolding = (ticker: string, quantity: number, avgPrice: number) => {
    const newItem: PortfolioItem = {
      id: `${ticker}-${Date.now()}`,
      ticker,
      quantity,
      avgPrice,
    };
    setPortfolio((prev) => [...prev, newItem]);
  };

  const removeHolding = (id: string) => {
    setPortfolio((prev) => prev.filter((item) => item.id !== id));
  };

  // Watchlist Handlers
  const addToWatchlist = (ticker: string) => {
    if (!watchlist.includes(ticker)) {
      setWatchlist((prev) => [...prev, ticker]);
    }
  };

  const removeFromWatchlist = (ticker: string) => {
    setWatchlist((prev) => prev.filter((t) => t !== ticker));
  };

  const isWatched = (ticker: string) => watchlist.includes(ticker);

  return (
    <MarketContext.Provider value={marketData}>
      <StockContext.Provider value={stocks}>
        <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isWatched }}>
          <PortfolioContext.Provider value={{ portfolio, addHolding, removeHolding }}>
            {children}
          </PortfolioContext.Provider>
        </WatchlistContext.Provider>
      </StockContext.Provider>
    </MarketContext.Provider>
  );
}

// --- Hooks ---

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) throw new Error("useMarket must be used within Providers");
  return context;
};

export const useStocks = () => {
  const context = useContext(StockContext);
  if (!context) throw new Error("useStocks must be used within Providers");
  return context;
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error("useWatchlist must be used within Providers");
  return context;
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("usePortfolio must be used within Providers");
  return context;
};
