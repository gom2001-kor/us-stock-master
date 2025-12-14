"use client";

import React from "react";
import { Clock, TrendingUp, Zap, Globe, MessageSquareQuote } from "lucide-react";

export default function NewsPage() {
    // Mock Data for News
    const newsData = {
        headline: {
            tag: "속보",
            title: "연준, 기준금리 동결에도 '매파적 동결'... 시장은 혼조세",
            summary: "파월 의장 '인플레이션 2% 목표 달성까지 갈 길 멀다'... 조기 금리 인하 기대감에 찬물. 국채 금리 소폭 상승.",
            time: "30분 전",
            imageColor: "bg-gradient-to-br from-red-900 via-slate-900 to-black"
        },
        aiSummary: [
            "연준 매파적 발언에 기술주 차익 실현 매물 출회",
            "엔비디아, 실적 발표 앞두고 변동성 확대... AI 섹터 긴장",
            "중동 지정학적 리스크 확산으로 유가 상승 압력 지속"
        ],
        sectors: [
            {
                category: "기술/AI",
                items: [
                    {
                        title: "오픈AI, GPT-5 출시 연기설에 마이크로소프트 하락",
                        time: "2시간 전",
                        impact: "negative"
                    },
                    {
                        title: "AMD, 새로운 AI 가속기 공개... 엔비디아 추격 가속화",
                        time: "4시간 전",
                        impact: "positive"
                    },
                    {
                        title: "TSMC, 3나노 공정 주문 폭주... 생산 능력 확대 계획",
                        time: "5시간 전",
                        impact: "positive"
                    }
                ]
            },
            {
                category: "경제/매크로",
                items: [
                    {
                        title: "미국 12월 소매판매 예상치 상회... 견조한 소비 입증",
                        time: "1시간 전",
                        impact: "positive"
                    },
                    {
                        title: "골드만삭스, '내년 미국 경기 침체 확률 15%로 하향'",
                        time: "3시간 전",
                        impact: "positive"
                    },
                    {
                        title: "비트코인, 현물 ETF 승인 기대감에 45K 돌파 시도",
                        time: "6시간 전",
                        impact: "neutral"
                    }
                ]
            }
        ]
    };

    const getImpactColor = (impact: string) => {
        return impact === "positive" ? "text-red-400" : impact === "negative" ? "text-blue-400" : "text-slate-400";
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-24">
            <header className="px-1">
                <h1 className="text-2xl font-bold text-white mb-1">뉴스 & 경제 분석</h1>
                <p className="text-slate-400 text-sm">글로벌 시장의 핵심 이슈를 빠르게 확인하세요</p>
            </header>

            {/* Section A: Headline News */}
            <section className="relative overflow-hidden rounded-2xl border border-indigo-500/30 shadow-2xl">
                <div className={`absolute inset-0 opacity-90 ${newsData.headline.imageColor}`}></div>
                <div className="relative p-6 z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                            {newsData.headline.tag}
                        </span>
                        <span className="text-slate-300 text-xs flex items-center gap-1">
                            <Clock size={12} /> {newsData.headline.time}
                        </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2 leading-snug">
                        {newsData.headline.title}
                    </h2>
                    <p className="text-sm text-slate-200 opacity-90 leading-relaxed">
                        {newsData.headline.summary}
                    </p>
                </div>
            </section>

            {/* Section C: AI Market Summary (Placed here for high visibility) */}
            <section className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                <h3 className="text-sm font-bold text-indigo-400 mb-3 flex items-center gap-2">
                    <MessageSquareQuote size={16} /> 오늘의 3줄 요약
                </h3>
                <ul className="space-y-2">
                    {newsData.aiSummary.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></span>
                            <span className="leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Section B: Sector Insights */}
            <section className="space-y-6">
                {newsData.sectors.map((sector) => (
                    <div key={sector.category}>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2 px-1">
                            {sector.category === "기술/AI" ? <Zap size={18} className="text-yellow-400" /> : <Globe size={18} className="text-blue-400" />}
                            {sector.category}
                        </h3>
                        <div className="space-y-3">
                            {sector.items.map((item, idx) => (
                                <div key={idx} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 hover:bg-slate-800/50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-bold text-slate-100 flex-1 pr-4 leading-normal">
                                            {item.title}
                                        </h4>
                                        <TrendingUp size={16} className={getImpactColor(item.impact)} />
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border border-slate-700 text-slate-400`}>
                                            {sector.category.split('/')[0]}
                                        </span>
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            {item.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
