"use client";

import React, { useState } from "react";
import { CalendarDays, DollarSign, Megaphone, ChevronRight } from "lucide-react";

// --- Mock Data Types ---
type DividendEvent = {
    ticker: string;
    name: string;
    amount: number;
    exDate: string; // Ex-Dividend Date
    paymentDate: string;
    yield: number;
};

type EarningsEvent = {
    ticker: string;
    name: string;
    date: string;
    time: "Before Market" | "After Market";
    estimateEPS: number;
    priorEPS: number;
};

// --- Mock Data ---
// ... (MOCK_DIVIDENDS expanded)
const MOCK_DIVIDENDS: DividendEvent[] = [
    { ticker: "KO", name: "코카콜라", amount: 0.46, exDate: "12/15", paymentDate: "12/30", yield: 3.1 },
    { ticker: "JNJ", name: "존슨앤존슨", amount: 1.19, exDate: "12/18", paymentDate: "01/05", yield: 2.9 },
    { ticker: "MCD", name: "맥도날드", amount: 1.67, exDate: "12/20", paymentDate: "01/10", yield: 2.3 },
    { ticker: "MMM", name: "3M", amount: 1.50, exDate: "12/21", paymentDate: "01/12", yield: 5.5 },
    { ticker: "VZ", name: "버라이즌", amount: 0.66, exDate: "12/22", paymentDate: "01/15", yield: 6.8 },
    { ticker: "PEP", name: "펩시코", amount: 1.26, exDate: "12/23", paymentDate: "01/18", yield: 3.0 },
    { ticker: "IBM", name: "IBM", amount: 1.66, exDate: "12/24", paymentDate: "01/20", yield: 4.1 },
    { ticker: "T", name: "AT&T", amount: 0.28, exDate: "12/26", paymentDate: "01/25", yield: 6.5 },
];

// ... (MOCK_EARNINGS keep same)
const MOCK_EARNINGS: EarningsEvent[] = [
    { ticker: "MU", name: "마이크론", date: "12/20", time: "After Market", estimateEPS: -0.95, priorEPS: -1.12 },
    { ticker: "NKE", name: "나이키", date: "12/21", time: "After Market", estimateEPS: 0.84, priorEPS: 0.79 },
    { ticker: "FDX", name: "페덱스", date: "12/19", time: "After Market", estimateEPS: 3.96, priorEPS: 3.80 },
    { ticker: "ACN", name: "액센츄어", date: "12/19", time: "Before Market", estimateEPS: 3.14, priorEPS: 2.95 },
    { ticker: "KMX", name: "카맥스", date: "12/21", time: "Before Market", estimateEPS: 0.42, priorEPS: 0.35 },
];

export default function CalendarPage() {
    const [activeTab, setActiveTab] = useState<"dividends" | "earnings">("dividends");
    const [week, setWeek] = useState<"this" | "next">("this");
    const [sortBy, setSortBy] = useState<"date" | "yield">("date");

    const sortedDividends = [...MOCK_DIVIDENDS].sort((a, b) => {
        if (sortBy === "yield") return b.yield - a.yield;
        return a.exDate.localeCompare(b.exDate);
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            {/* Header */}
            <header className="mb-4">
                {/* ... (Keep Header) */}
                <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <CalendarDays className="text-blue-500" />
                    마켓 캘린더
                </h1>
                <p className="text-slate-400 text-sm">주요 배당락일 및 실적 발표 일정</p>
            </header>

            {/* Week Tab (Visually Distinct) */}
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                <button
                    onClick={() => setWeek("this")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${week === "this" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}
                >
                    이번 주
                </button>
                <button
                    onClick={() => setWeek("next")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${week === "next" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}
                >
                    다음 주
                </button>
            </div>

            {/* Type Tabs with Sort Option */}
            <div className="flex justify-between items-end border-b border-slate-800">
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab("dividends")}
                        className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all relative ${activeTab === "dividends" ? "text-white" : "text-slate-500"
                            }`}
                    >
                        <DollarSign size={18} className={activeTab === "dividends" ? "text-green-400" : ""} />
                        배당 일정
                        {activeTab === "dividends" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("earnings")}
                        className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all relative ${activeTab === "earnings" ? "text-white" : "text-slate-500"
                            }`}
                    >
                        <Megaphone size={18} className={activeTab === "earnings" ? "text-orange-400" : ""} />
                        실적 발표
                        {activeTab === "earnings" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                        )}
                    </button>
                </div>

                {activeTab === "dividends" && (
                    <div className="pb-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as "date" | "yield")}
                            className="bg-slate-900 text-xs text-slate-300 border border-slate-700 rounded px-2 py-1 outline-none"
                        >
                            <option value="date">날짜순</option>
                            <option value="yield">수익률순</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Content List */}
            <div className="space-y-3">
                {activeTab === "dividends" ? (
                    // Dividends List (Sorted)
                    sortedDividends.map((item) => (
                        <div key={item.ticker} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex justify-between items-center group hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300">
                                    {item.ticker[0]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-white">{item.ticker}</h3>
                                        <span className="text-xs text-slate-500">{item.name}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-0.5">
                                        배당락일: <span className="text-slate-200 font-medium">{item.exDate}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-green-400">${item.amount}</div>
                                <div className={`text-xs ${item.yield > 5 ? "text-yellow-400 font-bold" : "text-slate-500"}`}>
                                    배당수익률 {item.yield}%
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    // Earnings List (Keep original for now)
                    MOCK_EARNINGS.map((item) => (
                        <div key={item.ticker} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex justify-between items-center group hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300">
                                    {item.ticker[0]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-white">{item.ticker}</h3>
                                        <span className="text-xs text-slate-500">{item.name}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                        {item.time === "After Market" ? "장 마감 후" : "장 시작 전"}
                                        <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                        <span className="text-slate-200">{item.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500 mb-0.5">예상 EPS</div>
                                <div className={`font-bold ${item.estimateEPS >= 0 ? 'text-white' : 'text-red-400'}`}>
                                    ${item.estimateEPS.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="text-center text-xs text-slate-600 mt-8">
                * 위 데이터는 시뮬레이션을 위한 가상의 데이터입니다.
            </div>
        </div>
    );
}
