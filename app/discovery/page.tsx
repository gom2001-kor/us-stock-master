"use client";

import React, { useState, useEffect } from "react";
import { useStocks, useWatchlist } from "@/components/Providers";
import { StockDetail, StockSignal } from "@/lib/types";
import { fetchStockDetails } from "@/lib/stock-data";
import { TrendingUp, DollarSign, Star, X, BarChart3, Target, ChevronRight, Briefcase } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

// --- Guru Mock Data ---
type GuruAction = {
    ticker: string;
    type: "New Buy" | "Add" | "Sold Out" | "Reduce";
    price: number;
    date: string;
};

type GuruProfile = {
    id: string;
    name: string;
    firm: string;
    image: string; // Using a placeholder color/initials for now
    actions: GuruAction[];
};

const MOCK_GURUS: GuruProfile[] = [
    {
        id: "buffett",
        name: "워렌 버핏",
        firm: "Berkshire Hathaway",
        image: "bg-orange-500",
        actions: [
            { ticker: "OXY", type: "Add", price: 58.20, date: "2024Q3" },
            { ticker: "AAPL", type: "New Buy", price: 175.50, date: "2024Q3" }, // Fictional for demo
        ]
    },
    {
        id: "burry",
        name: "마이클 버리",
        firm: "Scion Asset Management",
        image: "bg-blue-600",
        actions: [
            { ticker: "BABA", type: "New Buy", price: 72.50, date: "2024Q3" },
            { ticker: "TSLA", type: "Reduce", price: 240.10, date: "2024Q3" },
        ]
    },
    {
        id: "wood",
        name: "캐시 우드",
        firm: "ARK Invest",
        image: "bg-purple-500",
        actions: [
            { ticker: "TSLA", type: "Add", price: 235.00, date: "2024Q3" },
            { ticker: "NVDA", type: "Sold Out", price: 890.00, date: "2024Q3" },
        ]
    }
];

export default function DiscoveryPage() {
    const stocks = useStocks();
    const { watchlist, removeFromWatchlist } = useWatchlist();
    const [category, setCategory] = useState<"undervalued" | "bluechip" | "guru">("undervalued");
    const [selectedStock, setSelectedStock] = useState<StockDetail | null>(null);
    const [watchlistStocks, setWatchlistStocks] = useState<StockDetail[]>([]);

    const filteredStocks = stocks.filter((stock) => stock.category === category);

    // Hydrate Watchlist
    useEffect(() => {
        const details = watchlist.map((ticker) => fetchStockDetails(ticker));
        setWatchlistStocks(details);
    }, [watchlist]);

    const getSignalBadge = (signal: StockSignal) => {
        switch (signal) {
            case "강력 매수": return "bg-red-600 text-white";
            case "매수": return "bg-red-500/20 text-red-500";
            case "중립": return "bg-yellow-500/20 text-yellow-500";
            case "매도": return "bg-blue-500/20 text-blue-500";
            default: return "bg-slate-700 text-slate-300";
        }
    };

    const getGuruActionColor = (type: string) => {
        if (type === "New Buy" || type === "Add") return "bg-green-500/20 text-green-400";
        if (type === "Sold Out" || type === "Reduce") return "bg-red-500/20 text-red-400";
        return "bg-slate-700 text-slate-300";
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-20">
            <header className="mb-4">
                <h1 className="text-2xl font-bold text-white mb-1">종목 발굴</h1>
                <p className="text-slate-400 text-sm">AI가 분석한 투자가치 유망 종목</p>
            </header>

            {/* WATCHLIST SECTION */}
            <section className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        나의 관심종목
                        <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                            {watchlist.length}
                        </span>
                    </h2>
                </div>

                {watchlist.length === 0 ? (
                    <div className="bg-slate-900/40 border border-dashed border-slate-700 rounded-xl p-6 text-center">
                        <p className="text-slate-500 text-sm mb-2">아직 관심종목이 없습니다.</p>
                        <p className="text-xs text-slate-600">검색을 통해 관심있는 종목을 추가해보세요!</p>
                    </div>
                ) : (
                    <div className="flex space-x-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                        {watchlistStocks.map((stock) => {
                            const isPlus = stock.changePercent >= 0;
                            // Mini chart data
                            const data = Array.from({ length: 15 }).map((_, i) => ({
                                value: stock.price + (Math.random() - 0.45) * stock.price * 0.02
                            }));

                            return (
                                <div key={stock.ticker} className="flex-none w-40 bg-slate-900 border border-slate-800 rounded-xl p-3 relative group">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFromWatchlist(stock.ticker);
                                        }}
                                        className="absolute top-2 right-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    >
                                        <X size={14} />
                                    </button>

                                    <Link href={`/stock/${stock.ticker}`} className="block">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-slate-200">{stock.ticker}</span>
                                            <span className={`text-xs font-bold ${isPlus ? "text-red-500" : "text-blue-500"}`}>
                                                {stock.changePercent > 0 ? "+" : ""}{stock.changePercent}%
                                            </span>
                                        </div>

                                        <div className="h-10 mb-2 opacity-50">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={data}>
                                                    <Area type="monotone" dataKey="value" stroke={isPlus ? "#ef4444" : "#3b82f6"} fill="transparent" strokeWidth={1.5} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="text-lg font-bold text-white">
                                            ${stock.price.toFixed(2)}
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Category Toggle */}
            <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto scrollbar-hide">
                <button
                    onClick={() => setCategory("undervalued")}
                    className={`flex-1 min-w-[100px] py-1 text-sm font-bold rounded-lg transition-all ${category === "undervalued" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500"}`}
                >
                    저평가 가치주
                </button>
                <button
                    onClick={() => setCategory("bluechip")}
                    className={`flex-1 min-w-[100px] py-1 text-sm font-bold rounded-lg transition-all ${category === "bluechip" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500"}`}
                >
                    시장 주도주
                </button>
                <button
                    onClick={() => setCategory("guru")}
                    className={`flex-1 min-w-[120px] py-1 text-sm font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${category === "guru" ? "bg-indigo-900/50 text-indigo-300 shadow-sm border border-indigo-500/30" : "text-slate-500"}`}
                >
                    <Briefcase size={14} /> 큰손 포트폴리오
                </button>
            </div>

            {/* Description */}
            {category !== "guru" && (
                <div className="text-xs text-slate-500 px-1 text-center">
                    {category === "undervalued"
                        ? "재무 건전성이 뛰어나지만 시장에서 소외된 숨겨진 보석"
                        : "압도적인 시장 점유율과 미래 성장성을 겸비한 1등 기업"}
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            {category === "guru" ? (
                // GURU TRACKER UI
                <div className="space-y-4">
                    {MOCK_GURUS.map((guru) => (
                        <div key={guru.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-full ${guru.image} flex items-center justify-center text-lg font-bold text-white shadow-lg`}>
                                    {guru.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg leading-tight">{guru.name}</h3>
                                    <p className="text-sm text-slate-400">{guru.firm}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {guru.actions.map((action, idx) => (
                                    <div key={idx} className="bg-slate-950/50 rounded-lg p-3 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-200 w-12">{action.ticker}</span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getGuruActionColor(action.type)}`}>
                                                {action.type}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-slate-300 font-medium">${action.price.toFixed(2)}</div>
                                            <div className="text-[10px] text-slate-500">{action.date} 기준</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 text-right">
                                <span className="text-[10px] text-slate-600">출처: 최신 13F 공시 (Simulation)</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // EXISTING STOCK LIST
                <div className="grid grid-cols-1 gap-4">
                    {filteredStocks.map((stock) => (
                        <div
                            key={stock.ticker} // Changed from stock.id to stock.ticker as per original code
                            onClick={() => setSelectedStock(stock)}
                            className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 flex justify-between items-center cursor-pointer hover:bg-slate-800 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                                        {stock.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                                            {stock.ticker}
                                        </span>
                                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getSignalBadge(stock.signal)}`}> {/* Changed from stock.Analysis.signal to stock.signal */}
                                            {stock.signal} {/* Changed from stock.Analysis.signal to stock.signal */}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-white">${stock.price}</div>
                                <div className={`text-sm font-bold flex items-center justify-end gap-1 ${stock.changePercent >= 0 ? "text-red-500" : "text-blue-500"}`}>
                                    {stock.changePercent >= 0 ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
                                    {stock.changePercent}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stock Detail Modal */}
            {selectedStock && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200" onClick={() => setSelectedStock(null)}>
                    <div
                        className="bg-slate-900 w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-5 border-b border-slate-800 flex justify-between items-start bg-slate-800/50">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    {selectedStock.name}
                                    <span className="text-sm font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{selectedStock.ticker}</span>
                                </h2>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-3xl font-bold text-white">${selectedStock.price}</span>
                                    <span className={`text-sm font-bold ${selectedStock.changePercent > 0 ? "text-red-500" : "text-blue-500"}`}>
                                        {selectedStock.changePercent > 0 ? "+" : ""}{selectedStock.changePercent}%
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedStock(null)}
                                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* 1. Signal Card */}
                            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm text-slate-400 font-medium">AI 투자 매력도</span>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star size={14} fill="currentColor" />
                                        <span className="font-bold">{selectedStock.score}</span>
                                        <span className="text-slate-500 text-xs">/ 100</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`px-4 py-2 rounded-lg font-bold text-lg whitespace-nowrap ${getSignalBadge(selectedStock.signal)}`}>
                                        {selectedStock.signal}
                                    </div>
                                    <p className="text-xs text-slate-400 leading-tight">
                                        현재 주가는 기업 가치 대비
                                        <span className="text-slate-200">
                                            {selectedStock.signal === "강력 매수" || selectedStock.signal === "매수"
                                                ? " 저평가 상태"
                                                : " 적정 수준"}
                                        </span>입니다.
                                    </p>
                                </div>
                            </div>

                            {/* 2. Wall Street Consensus */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                                    <Target size={16} className="text-blue-400" /> 월스트리트 의견
                                </h3>
                                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-sm">
                                    <div className="text-center">
                                        <div className="text-slate-400 text-xs mb-1">투자의견</div>
                                        <div className="font-bold text-indigo-400">
                                            {selectedStock.consensus.buy}명 <span className="text-slate-500 font-normal">/ {selectedStock.consensus.total}명 매수</span>
                                        </div>
                                    </div>
                                    <div className="w-px h-8 bg-slate-800"></div>
                                    <div className="text-center">
                                        <div className="text-slate-400 text-xs mb-1">목표주가</div>
                                        <div className="font-bold text-white">
                                            ${selectedStock.consensus.targetPrice}
                                            <span className="text-xs text-red-400 ml-1">
                                                (+{((selectedStock.consensus.targetPrice - selectedStock.price) / selectedStock.price * 100).toFixed(0)}%)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. AI Outlook */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                                    <BarChart3 size={16} className="text-purple-400" /> AI 미래 전망
                                </h3>
                                <p className="text-sm text-slate-200 leading-relaxed font-bold mb-1">
                                    "{selectedStock.analysis.headline}"
                                </p>
                                <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                                    {selectedStock.analysis.details.slice(0, 2).map((d, i) => (
                                        <li key={i}>{d}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* 4. Key Metrics Grid */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-slate-800/30 p-3 rounded-lg text-center">
                                    <div className="text-[10px] text-slate-500 mb-1">PER</div>
                                    <div className="font-bold text-slate-300">{selectedStock.metrics.per}배</div>
                                </div>
                                <div className="bg-slate-800/30 p-3 rounded-lg text-center">
                                    <div className="text-[10px] text-slate-500 mb-1">PBR</div>
                                    <div className="font-bold text-slate-300">{selectedStock.metrics.pbr}배</div>
                                </div>
                                <div className="bg-slate-800/30 p-3 rounded-lg text-center">
                                    <div className="text-[10px] text-slate-500 mb-1">ROE</div>
                                    <div className="font-bold text-slate-300">{selectedStock.metrics.roe}%</div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Button */}
                        <div className="p-4 border-t border-slate-800 bg-slate-900">
                            <button
                                onClick={() => setSelectedStock(null)}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
