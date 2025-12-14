"use client";

import React from "react";
import { useMarket } from "@/components/Providers";
import { ArrowUp, ArrowDown, Droplets, Banknote, Gauge, TrendingUp } from "lucide-react";
import SectorHeatmap from "@/components/SectorHeatmap";

export default function Home() {
  const market = useMarket();

  const getChangeColor = (change: number) => {
    return change > 0 ? "text-up" : change < 0 ? "text-down" : "text-gray-400";
  };

  const getChangeBg = (change: number) => {
    return change > 0 ? "bg-red-500/10" : change < 0 ? "bg-blue-500/10" : "bg-gray-500/10";
  };

  const renderIndexCard = (name: string, data: { value: number; change: number }) => (
    <div className={`p-4 rounded-xl border border-slate-800 flex flex-col items-start ${getChangeBg(data.change)}`}>
      <span className="text-slate-400 text-sm font-medium mb-1">{name}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-50">
          {data.value.toLocaleString()}
        </span>
      </div>
      <div className={`flex items-center text-sm font-semibold mt-1 ${getChangeColor(data.change)}`}>
        {data.change > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        <span className="ml-1">{Math.abs(data.change)}%</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">미국 증시 현황</h1>
          <p className="text-slate-400 text-sm">실시간 주요 지수 및 거시경제 지표</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">Update: Live</span>
        </div>
      </header>

      {/* Major Indices Grid */}
      <section className="grid grid-cols-3 gap-3">
        {renderIndexCard("S&P 500", market.snp500)}
        {renderIndexCard("나스닥", market.nasdaq)}
        {renderIndexCard("다우존스", market.dow)}
      </section>

      {/* Macro Indicators */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <TrendingUp size={20} className="text-yellow-500" />
          거시경제 지표
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {/* US 10Y Yield */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Banknote size={18} />
              <span className="text-sm">10년물 국채 금리</span>
            </div>
            <span className="text-2xl font-bold text-slate-50">{market.us10y}%</span>
            <span className="text-xs text-slate-500">연준 금리 정책 핵심 지표</span>
          </div>

          {/* Fear & Greed */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Gauge size={18} />
              <span className="text-sm">공포/탐욕 지수</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${market.fearGreed > 60 ? 'text-red-400' : 'text-blue-400'}`}>
                {market.fearGreed}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {market.fearGreed > 75 ? "Extreme Greed" : market.fearGreed > 50 ? "Greed" : "Fear"}
              </span>
            </div>
            <span className="text-xs text-slate-500">시장 심리 상태</span>
          </div>

          {/* Exchange Rate */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <span className="text-sm font-bold">₩/$</span>
              <span className="text-sm">원/달러 환율</span>
            </div>
            <span className="text-2xl font-bold text-slate-50">{market.exchangeRate.toLocaleString()}원</span>
          </div>

          {/* Oil */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Droplets size={18} />
              <span className="text-sm">국제 유가 (WTI)</span>
            </div>
            <span className="text-2xl font-bold text-slate-50">${market.oil}</span>
          </div>
        </div>
      </section >

      {/* Sector Heatmap */}
      < SectorHeatmap />

      {/* Featured Stock (Stock of the Day) */}
      < section className="bg-slate-900/50 p-4 rounded-xl border border-slate-800" >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-red-500" size={20} />
            오늘의 특징주
            <span className="text-[10px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded font-bold">HOT</span>
          </h2>
          <span className="text-xs text-slate-500 flex items-center pr-1">
            NVDA
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-green-400">
              N
            </div>
            <div>
              <div className="font-bold text-lg text-white">엔비디아</div>
              <div className="text-xs text-slate-400">AI 반도체 수요 폭발적 증가</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-white">$905.10</div>
            <div className="text-sm font-bold text-red-500 flex items-center justify-end gap-1">
              <ArrowUp size={14} /> 3.5%
            </div>
          </div>
        </div>
      </section >

      {/* Quick Insight (Optional) */}
      < section className="bg-gradient-to-r from-indigo-900/40 to-slate-900 p-5 rounded-2xl border border-indigo-500/30" >
        <h3 className="font-bold text-indigo-300 mb-2">💡 오늘의 시장 요약</h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          나스닥이 강세를 보이며 기술주 중심의 상승장이 이어지고 있습니다.
          특히 <strong>엔비디아</strong>를 필두로 한 AI 섹터의 자금 유입이 뚜렷합니다.
          다만, <strong>10년물 국채 금리</strong>가 4.25% 수준을 유지하고 있어 주의가 필요합니다.
        </p>
      </section >
    </div >
  );
}
