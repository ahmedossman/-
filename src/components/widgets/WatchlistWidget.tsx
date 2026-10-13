import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Bell, TrendingUp, TrendingDown, ArrowUpRight, Plus, Search } from 'lucide-react';

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  nameAr: string;
  category: 'BULLION' | 'CURRENCY' | 'INDEX' | 'CRYPTO';
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  unit: string;
  isStarred: boolean;
  alertPrice?: number;
}

export const WatchlistWidget: React.FC = () => {
  const { marketData, language } = useApp();
  const isAr = language === 'AR';

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'STARRED' | 'BULLION' | 'CURRENCY'>('ALL');

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    {
      id: 'w1',
      symbol: 'GOLD21K',
      name: 'Gold 21K Bullion',
      nameAr: 'ذهب عيار 21 صاغة',
      category: 'BULLION',
      price: marketData.gold21kEGP,
      change24h: 1.15,
      high24h: marketData.gold21kEGP + 35,
      low24h: marketData.gold21kEGP - 20,
      unit: 'EGP/g',
      isStarred: true,
      alertPrice: 4250,
    },
    {
      id: 'w2',
      symbol: 'GOLD24K',
      name: 'Gold 24K Pure Ingot',
      nameAr: 'سبائك عيار 24 نقي',
      category: 'BULLION',
      price: marketData.gold24kEGP,
      change24h: 1.22,
      high24h: marketData.gold24kEGP + 40,
      low24h: marketData.gold24kEGP - 25,
      unit: 'EGP/g',
      isStarred: true,
    },
    {
      id: 'w3',
      symbol: 'EGP_POUND',
      name: 'Gold Sovereign Coin (8g)',
      nameAr: 'جنيه ذهب جورج (8 جرام)',
      category: 'BULLION',
      price: marketData.goldPoundEGP,
      change24h: 1.12,
      high24h: marketData.goldPoundEGP + 280,
      low24h: marketData.goldPoundEGP - 160,
      unit: 'EGP',
      isStarred: true,
    },
    {
      id: 'w4',
      symbol: 'USD_PARALLEL',
      name: 'USD Parallel Market',
      nameAr: 'الدولار الموازي / الصاغة',
      category: 'CURRENCY',
      price: marketData.usdEgpParallel,
      change24h: 0.45,
      high24h: marketData.usdEgpParallel + 0.8,
      low24h: marketData.usdEgpParallel - 0.4,
      unit: 'EGP',
      isStarred: true,
      alertPrice: 51.5,
    },
    {
      id: 'w5',
      symbol: 'USD_OFFICIAL',
      name: 'USD Official CBE Rate',
      nameAr: 'الدولار البنك المركزي',
      category: 'CURRENCY',
      price: marketData.usdEgpOfficial,
      change24h: 0.05,
      high24h: marketData.usdEgpOfficial + 0.1,
      low24h: marketData.usdEgpOfficial - 0.05,
      unit: 'EGP',
      isStarred: false,
    },
    {
      id: 'w6',
      symbol: 'SILVER925',
      name: 'Egyptian Silver 925',
      nameAr: 'فضة عيار 925 نقي',
      category: 'BULLION',
      price: marketData.silver925EGP,
      change24h: -0.35,
      high24h: marketData.silver925EGP + 1.2,
      low24h: marketData.silver925EGP - 0.8,
      unit: 'EGP/g',
      isStarred: false,
    },
    {
      id: 'w7',
      symbol: 'EGX30',
      name: 'EGX 30 Stock Index',
      nameAr: 'مؤشر البورصة المصرية EGX30',
      category: 'INDEX',
      price: marketData.egx30Index,
      change24h: 1.85,
      high24h: marketData.egx30Index + 450,
      low24h: marketData.egx30Index - 200,
      unit: 'PTS',
      isStarred: false,
    },
    {
      id: 'w8',
      symbol: 'BTCUSD',
      name: 'Bitcoin / US Dollar',
      nameAr: 'بيتكوين مقابل الدولار',
      category: 'CRYPTO',
      price: marketData.bitcoinUSD,
      change24h: 2.4,
      high24h: marketData.bitcoinUSD + 1800,
      low24h: marketData.bitcoinUSD - 1200,
      unit: 'USD',
      isStarred: false,
    },
  ]);

  const toggleStar = (id: string) => {
    setWatchlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isStarred: !item.isStarred } : item))
    );
  };

  const filteredWatchlist = watchlist.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameAr.includes(searchTerm) ||
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'STARRED') return item.isStarred;
    if (filter === 'BULLION') return item.category === 'BULLION';
    if (filter === 'CURRENCY') return item.category === 'CURRENCY';
    return true;
  });

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>{isAr ? 'قائمة المتابعة والتنبيهات المباشرة' : 'Institutional Market Watchlist & Alerts'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr ? 'رصد أسعار الذهب والدولار والفضة ومعدل التغير والتنبيهات' : 'Real-time price feed, 24h ranges and configurable price thresholds'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {(['ALL', 'STARRED', 'BULLION', 'CURRENCY'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                filter === f ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f === 'ALL'
                ? (isAr ? 'الكل' : 'ALL')
                : f === 'STARRED'
                ? (isAr ? 'المفضلة' : 'STARRED')
                : f}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder={isAr ? 'بحث في قائمة المتابعة...' : 'Filter assets by name or symbol...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredWatchlist.map((item) => {
          const range = item.high24h - item.low24h || 1;
          const posPct = Math.min(100, Math.max(0, ((item.price - item.low24h) / range) * 100));

          return (
            <div
              key={item.id}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl space-y-2.5 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStar(item.id)}
                    className="text-slate-500 hover:text-amber-400 cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        item.isStarred ? 'text-amber-400 fill-amber-400' : ''
                      }`}
                    />
                  </button>
                  <div>
                    <span className="font-bold text-xs text-white block">
                      {isAr ? item.nameAr : item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.symbol}</span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-sm font-extrabold text-white">
                    {item.price.toLocaleString()}{' '}
                    <span className="text-[10px] text-slate-400 font-sans">{item.unit}</span>
                  </div>
                  <div
                    className={`text-[11px] font-bold flex items-center justify-end gap-0.5 ${
                      item.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {item.change24h >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>
                      {item.change24h >= 0 ? '+' : ''}
                      {item.change24h}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 24h High/Low Progress Bar */}
              <div className="space-y-1 font-mono text-[10px]">
                <div className="flex justify-between text-slate-400">
                  <span>L: {item.low24h.toLocaleString()}</span>
                  <span>H: {item.high24h.toLocaleString()}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${posPct}%` }}
                  />
                </div>
              </div>

              {item.alertPrice && (
                <div className="flex items-center gap-1.5 text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">
                  <Bell className="w-3 h-3 text-amber-400" />
                  <span>
                    {isAr ? 'تنبيه مُفعّل عند:' : 'Alert set at:'} {item.alertPrice} {item.unit}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
