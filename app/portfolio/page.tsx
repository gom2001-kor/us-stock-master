"use client";

import React, { useState } from "react";
import { usePortfolio, useStocks } from "@/components/Providers";
import { ArrowUp, ArrowDown, Plus, Trash2, X } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function PortfolioPage() {
    const { portfolio, addHolding, removeHolding } = usePortfolio();
    const stocks = useStocks();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ticker, setTicker] = useState("");
    const [quantity, setQuantity] = useState("");
    const [avgPrice, setAvgPrice] = useState("");

    // Derived state for Modal
    const matchedStock = stocks.find(s => s.ticker === ticker);

    // Helper to get current price from Context
    const getCurrentPrice = (ticker: string) => {
        const stock = stocks.find((s) => s.ticker === ticker.toUpperCase());
        return stock ? stock.price : 0;
    };

    const getStockName = (ticker: string) => {
        const stock = stocks.find((s) => s.ticker === ticker.toUpperCase());
        return stock ? stock.name : ticker.toUpperCase();
    };

    // Calculate Totals & Chart Data
    const totalValue = portfolio.reduce((acc, item) => {
        const price = getCurrentPrice(item.ticker);
        return acc + (price * item.quantity);
    }, 0);

    const totalCost = portfolio.reduce((acc, item) => acc + (item.avgPrice * item.quantity), 0);
    const totalProfit = totalValue - totalCost;
    const totalProfitRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    const chartData = portfolio.map(item => ({
        name: item.ticker,
        value: getCurrentPrice(item.ticker) * item.quantity
    })).filter(d => d.value > 0);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticker || !quantity || !avgPrice) return;
        addHolding(ticker, Number(quantity), Number(avgPrice));
        setTicker("");
        setQuantity("");
        setAvgPrice("");
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-24 relative">

            {/* Header & Add Button (Keep same) */}
            <header className="mb-6 flex justify-between items-end">
                {/* ... (Keep same) */}
                <div>
                    <h1 className="text-2xl font-bold text-white">내 자산</h1>
                    <p className="text-slate-400 text-sm">현재 보유 중인 미국 주식 현황</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-1 shadow-lg shadow-indigo-900/50 transition-all active:scale-95"
                >
                    <Plus size={16} /> 자산 추가
                </button>
            </header>

            {/* Summary Card with Chart */}
            {portfolio.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Metrics */}
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 text-center shadow-2xl flex flex-col justify-center">
                        <div className="text-sm text-indigo-300 mb-1">총 평가 자산</div>
                        <div className="text-3xl font-bold text-white mb-2">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <div className={`text-sm font-bold flex items-center justify-center gap-1 ${totalProfit >= 0 ? 'text-up' : 'text-down'}`}>
                            {totalProfit >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                            {Math.abs(totalProfitRate).toFixed(2)}% (${Math.abs(totalProfit).toLocaleString()})
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex justify-center items-center h-48 relative">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-20 h-20 rounded-full border-4 border-slate-800 opacity-20"></div>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={65}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => `$${value.toLocaleString()}`}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: 'white' }}
                                    itemStyle={{ color: 'white' }}
                                />
                                <Legend
                                    // @ts-ignore
                                    payload={
                                        chartData.map((item, index) => ({
                                            id: item.name,
                                            type: 'circle',
                                            value: `${item.name} ${(item.value / totalValue * 100).toFixed(0)}%`,
                                            color: COLORS[index % COLORS.length]
                                        }))
                                    }
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '10px' }}
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 text-center border-dashed">
                    <p className="text-slate-400 mb-2">보유 중인 미국 주식이 없습니다.</p>
                    <p className="text-sm text-slate-500">"자산 추가" 버튼을 눌러 포트폴리오를 만들어보세요!</p>
                </div>
            )}

            {/* Holdings Table (Keep same) */}
            {portfolio.length > 0 && (
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                    {/* ... (Keep Table Logic) ... */}
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900 text-slate-400">
                            <tr>
                                <th className="p-4 font-normal">종목명</th>
                                <th className="p-4 font-normal text-right">손익/수익률</th>
                                <th className="p-4 font-normal text-right hidden sm:table-cell">평가금액</th>
                                <th className="p-4 font-normal text-center w-10">삭제</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {portfolio.map((item) => {
                                const currentPrice = getCurrentPrice(item.ticker);
                                const currentPriceStr = currentPrice > 0 ? `$${currentPrice.toLocaleString()}` : "가격 정보 없음";
                                const profit = (currentPrice - item.avgPrice) * item.quantity;
                                const profitRate = ((currentPrice - item.avgPrice) / item.avgPrice) * 100;
                                const isProfitable = profit >= 0;

                                return (
                                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-100">{getStockName(item.ticker)}</div>
                                            <div className="text-xs text-slate-500">{item.ticker}</div>
                                            {/* Mobile only detail */}
                                            <div className="sm:hidden text-xs text-slate-400 mt-1">
                                                {item.quantity}주 · {currentPriceStr}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            {currentPrice > 0 ? (
                                                <>
                                                    <div className={`font-bold ${isProfitable ? 'text-up' : 'text-down'}`}>
                                                        {isProfitable ? "+" : ""}{profitRate.toFixed(2)}%
                                                    </div>
                                                    <div className={`text-xs ${isProfitable ? 'text-up' : 'text-down'} opacity-80`}>
                                                        ${profit.toLocaleString()}
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="text-slate-500 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right hidden sm:table-cell">
                                            <div className="text-slate-200 font-medium">${(currentPrice * item.quantity).toLocaleString()}</div>
                                            <div className="text-xs text-slate-500">평단 ${item.avgPrice.toLocaleString()}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => removeHolding(item.id)}
                                                className="text-slate-600 hover:text-red-500 transition-colors p-2"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Asset Modal (Update) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-900 w-full max-w-sm rounded-t-2xl sm:rounded-2xl border border-slate-700 shadow-2xl p-6 animate-in slide-in-from-bottom-10 duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">자산 추가</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">종목 코드 (Ticker)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="예: AAPL, NVDA"
                                        value={ticker}
                                        onChange={(e) => setTicker(e.target.value.toUpperCase())}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 font-bold placeholder:font-normal"
                                        required
                                    />
                                    {matchedStock && (
                                        <div className="absolute right-3 top-3 text-xs text-green-400 font-medium">
                                            {matchedStock.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">수량 (주)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 font-bold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">평균 단가 ($)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={avgPrice || (matchedStock ? matchedStock.price : "")}
                                        onChange={(e) => setAvgPrice(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 font-bold"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-colors mt-2"
                            >
                                저장하기
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
