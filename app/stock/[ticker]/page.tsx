"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePortfolio, useWatchlist } from "@/components/Providers";
import { fetchStockDetails } from "@/lib/stock-data";
import { StockDetail } from "@/lib/types";
import { ArrowLeft, Plus, Check, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// --- Types ---
type TimeRange = "1D" | "1W" | "1M" | "1Y";

function generateChartData(basePrice: number, points: number = 30) {
    let current = basePrice;
    return Array.from({ length: points }).map((_, i) => {
        const change = (Math.random() - 0.48) * (basePrice * 0.05); // Slight upward bias
        current += change;
        return {
            name: `Day ${i + 1}`,
            value: Number(current.toFixed(2)),
        };
    });
}

export default function StockDetailPage() {
    const params = useParams();
    const ticker = params.ticker as string;
    const { addHolding } = usePortfolio();
    const { addToWatchlist, removeFromWatchlist, isWatched } = useWatchlist();

    const [stock, setStock] = useState<StockDetail | null>(null);
    const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<TimeRange>("1M");
    const [portfolioQty, setPortfolioQty] = useState("");

    // Derived state
    const isAdded = isWatched(ticker);

    useEffect(() => {
        // ... (existing loading logic) 
        setLoading(true);
        setTimeout(() => {
            const data = fetchStockDetails(ticker);
            setStock(data);
            setChartData(generateChartData(data.price));
            setLoading(false);
        }, 600);
    }, [ticker]);

    // ... (handleAddToPortfolio existing) ...
    const handleAddToPortfolio = () => {
        if (!stock) return;
        const qty = parseInt(portfolioQty);
        if (isNaN(qty) || qty <= 0) {
            alert("유효한 수량을 입력하세요.");
            return;
        }
        addHolding(stock.ticker, qty, stock.price);
        alert(`${stock.ticker} ${qty}주가 포트폴리오에 추가되었습니다.`);
        setPortfolioQty("");
    };

    if (loading) {
        // ... (existing loading spinner)
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (!stock) return <div className="p-4 text-center">종목을 찾을 수 없습니다.</div>;

    const isPlus = stock.changePercent >= 0;
    const colorClass = isPlus ? "text-red-500" : "text-blue-500";
    const bgClass = isPlus ? "bg-red-500/10" : "bg-blue-500/10";
    const strokeColor = isPlus ? "#ef4444" : "#3b82f6";

    const handleWatchlistToggle = () => {
        if (isAdded) {
            removeFromWatchlist(ticker);
        } else {
            addToWatchlist(ticker);
            alert("관심 종목에 추가되었습니다.");
        }
    };

    return (
        <div className="pb-20 animate-in fade-in duration-300">
            {/* ... (Nav Header, Price Header, Chart Section, Analysis Grid - KEEP SAME) ... */}

            {/* Nav Header */}
            <div className="flex items-center space-x-4 mb-6">
                <Link href="/" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-400" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold flex items-center space-x-2">
                        <span>{stock.name}</span>
                        <span className="text-xs text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            {stock.ticker}
                        </span>
                    </h1>
                </div>
            </div>

            {/* Price Header */}
            <div className="mb-8">
                <div className="flex items-end space-x-3 mb-1">
                    <span className={`text-4xl font-bold ${colorClass}`}>
                        ${stock.price.toLocaleString()}
                    </span>
                    <span className={`text-sm font-medium mb-1.5 ${colorClass}`}>
                        {isPlus ? "▲" : "▼"} {Math.abs(stock.changePercent)}%
                    </span>
                </div>
                <p className="text-xs text-slate-500">
                    전일 종가 기준 / 실시간 시뮬레이션
                </p>
            </div>

            {/* Chart Section */}
            <div className="h-64 mb-8 -mx-4">
                {/* ... Keep Chart ... */}
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", fontSize: "12px" }}
                            itemStyle={{ color: "#fff" }}
                            labelStyle={{ display: "none" }}
                            formatter={(value: number) => [`$${value}`, "주가"]}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={strokeColor}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
                {/* Time Range Selector (Mock) */}
                <div className="flex justify-center space-x-4 mt-2">
                    {["1D", "1W", "1M", "1Y"].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r as TimeRange)}
                            className={`text-xs px-3 py-1 rounded-full transition-colors ${range === r
                                ? "bg-slate-800 text-white font-medium"
                                : "text-slate-500 hover:text-slate-300"
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Analysis Grid (Bloomberg Style) */}
            <div className="space-y-6">

                {/* AI Verdict */}
                <section className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold flex items-center text-slate-200">
                            <Activity className="w-4 h-4 mr-2 text-purple-400" />
                            AI 투자 의견
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${stock.signal === '강력 매수' || stock.signal === '매수' ? 'bg-red-500/20 text-red-500' : 'bg-slate-700 text-slate-300'}`}>
                            {stock.signal}
                        </span>
                    </div>

                    <h4 className="text-lg font-bold text-white mb-2 leading-tight">
                        "{stock.analysis.headline}"
                    </h4>
                    <div className="space-y-2">
                        {stock.analysis.details.map((detail, idx) => (
                            <div key={idx} className="flex items-start text-sm text-slate-400">
                                <span className="mr-2 text-slate-600 mt-1">•</span>
                                <span>{detail}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Valuation Metrics */}
                <section className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                        <div className="text-xs text-slate-500 mb-1">PER</div>
                        <div className="text-lg font-bold text-slate-200">{stock.metrics.per}</div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                        <div className="text-xs text-slate-500 mb-1">PBR</div>
                        <div className="text-lg font-bold text-slate-200">{stock.metrics.pbr}</div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                        <div className="text-xs text-slate-500 mb-1">ROE</div>
                        <div className={`text-lg font-bold ${stock.metrics.roe > 15 ? 'text-red-400' : 'text-slate-200'}`}>
                            {stock.metrics.roe}%
                        </div>
                    </div>
                </section>

                {/* Consensus (Simulated) */}
                <section className="bg-slate-900 rounded-xl p-5 border border-slate-800 flex items-center justify-between">
                    <div>
                        <div className="text-xs text-slate-500 mb-1">월가 목표 주가</div>
                        <div className="text-xl font-bold text-white">${stock.consensus.targetPrice}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-500 mb-1">투자의견</div>
                        <div className="text-sm font-medium text-slate-300">
                            <span className="text-red-400">{stock.consensus.buy}명</span> 매수 / 전체 {stock.consensus.total}명
                        </div>
                    </div>
                </section>
            </div>


            {/* Action Buttons */}
            <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-4 z-40">
                <div className="flex space-x-3">
                    <button
                        onClick={handleWatchlistToggle}
                        className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center transition-colors ${isAdded
                            ? "bg-slate-800 text-slate-400"
                            : "bg-slate-800 text-white hover:bg-slate-700"
                            }`}
                    >
                        {isAdded ? <Check className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                        {isAdded ? "관심종목 해제" : "관심종목"}
                    </button>

                    {/* Portfolio Add Section - Simplified as a popover or inline for now */}
                    <div className="flex-[2] flex space-x-2">
                        <input
                            type="number"
                            placeholder="수량"
                            className="w-20 bg-slate-800 text-white rounded-xl px-3 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={portfolioQty}
                            onChange={(e) => setPortfolioQty(e.target.value)}
                        />
                        <button
                            onClick={handleAddToPortfolio}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-900/20"
                        >
                            담기
                        </button>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-10 text-[10px] text-slate-600 text-center leading-relaxed">
                본 서비스에서 제공하는 금융 정보는 시뮬레이션 엔진에 의해 생성된 가상의 데이터입니다.<br />
                실제 투자 판단의 근거로 활용할 수 없으며, 모든 투자의 책임은 사용자에게 있습니다.
            </div>
        </div>
    );
}
