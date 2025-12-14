import React from "react";

type SectorData = {
    name: string;
    change: number;
    weight: number; // 1-5 scale for sizing
};

const MOCK_SECTORS: SectorData[] = [
    { name: "기술 (Tech)", change: 1.8, weight: 5 },
    { name: "금융 (Finance)", change: 0.5, weight: 3 },
    { name: "헬스케어", change: -0.2, weight: 3 },
    { name: "소비재", change: -1.2, weight: 2 },
    { name: "에너지", change: -2.1, weight: 2 },
    { name: "부동산", change: 0.8, weight: 1 },
    { name: "유틸리티", change: -0.5, weight: 1 },
    { name: "통신", change: 0.1, weight: 1 },
];

const getColor = (change: number) => {
    if (change >= 1.5) return "bg-red-500 text-white"; // Strong Up
    if (change > 0) return "bg-red-500/60 text-white"; // Slight Up
    if (change === 0) return "bg-slate-600/50 text-slate-300"; // Neutral
    if (change <= -1.5) return "bg-blue-600 text-white"; // Strong Down
    return "bg-blue-500/60 text-white"; // Slight Down
};

export default function SectorHeatmap() {
    return (
        <section className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                📊 오늘의 섹터별 흐름
            </h2>

            {/* Grid Layout mimicking a Treemap */}
            <div className="grid grid-cols-4 md:grid-cols-6 grid-rows-3 gap-2 h-64 md:h-80">
                {/* Tech - Biggest */}
                <div className={`col-span-2 md:col-span-3 row-span-2 rounded-xl flex flex-col items-center justify-center p-2 text-center transition-transform hover:scale-[1.02] ${getColor(MOCK_SECTORS[0].change)}`}>
                    <span className="font-bold text-lg md:text-2xl">{MOCK_SECTORS[0].name}</span>
                    <span className="font-bold text-sm md:text-base mt-1">
                        {MOCK_SECTORS[0].change > 0 ? "+" : ""}{MOCK_SECTORS[0].change}%
                    </span>
                </div>

                {/* Finance */}
                <div className={`col-span-2 md:col-span-2 row-span-1 rounded-xl flex flex-col items-center justify-center p-2 text-center transition-transform hover:scale-[1.02] ${getColor(MOCK_SECTORS[1].change)}`}>
                    <span className="font-bold text-sm md:text-lg">{MOCK_SECTORS[1].name}</span>
                    <span className="text-xs md:text-sm font-medium">
                        {MOCK_SECTORS[1].change > 0 ? "+" : ""}{MOCK_SECTORS[1].change}%
                    </span>
                </div>

                {/* Healthcare */}
                <div className={`col-span-2 md:col-span-1 row-span-2 rounded-xl flex flex-col items-center justify-center p-2 text-center transition-transform hover:scale-[1.02] ${getColor(MOCK_SECTORS[2].change)}`}>
                    <div className="md:rotate-90 md:whitespace-nowrap flex flex-col items-center">
                        <span className="font-bold text-sm md:text-base">{MOCK_SECTORS[2].name}</span>
                        <span className="text-xs md:text-sm font-medium">
                            {MOCK_SECTORS[2].change > 0 ? "+" : ""}{MOCK_SECTORS[2].change}%
                        </span>
                    </div>
                </div>

                {/* Consumer */}
                <div className={`col-span-1 md:col-span-1 row-span-1 rounded-xl flex flex-col items-center justify-center p-2 text-center transition-transform hover:scale-[1.02] ${getColor(MOCK_SECTORS[3].change)}`}>
                    <span className="font-bold text-xs md:text-sm">{MOCK_SECTORS[3].name}</span>
                    <span className="text-xs">
                        {MOCK_SECTORS[3].change > 0 ? "+" : ""}{MOCK_SECTORS[3].change}%
                    </span>
                </div>

                {/* Energy */}
                <div className={`col-span-1 md:col-span-1 row-span-1 rounded-xl flex flex-col items-center justify-center p-2 text-center transition-transform hover:scale-[1.02] ${getColor(MOCK_SECTORS[4].change)}`}>
                    <span className="font-bold text-xs md:text-sm">{MOCK_SECTORS[4].name}</span>
                    <span className="text-xs">
                        {MOCK_SECTORS[4].change > 0 ? "+" : ""}{MOCK_SECTORS[4].change}%
                    </span>
                </div>

                {/* Others Row */}
                <div className={`col-span-1 md:col-span-1 row-span-1 rounded-xl flex flex-col items-center justify-center p-1 text-center transition-transform hover:scale-[1.02] ${getColor(MOCK_SECTORS[5].change)}`}>
                    <span className="font-bold text-[10px] md:text-xs truncate w-full">{MOCK_SECTORS[5].name}</span>
                    <span className="text-[10px]">{MOCK_SECTORS[5].change}%</span>
                </div>
                <div className={`col-span-1 md:col-span-1 row-span-1 rounded-xl flex flex-col items-center justify-center p-1 text-center transition-transform hover:scale-[1.02] ${getColor(MOCK_SECTORS[6].change)}`}>
                    <span className="font-bold text-[10px] md:text-xs truncate w-full">{MOCK_SECTORS[6].name}</span>
                    <span className="text-[10px]">{MOCK_SECTORS[6].change}%</span>
                </div>
                <div className={`col-span-2 md:col-span-1 row-span-1 rounded-xl flex flex-col items-center justify-center p-1 text-center transition-transform hover:scale-[1.02] ${getColor(MOCK_SECTORS[7].change)}`}>
                    <span className="font-bold text-[10px] md:text-xs truncate w-full">{MOCK_SECTORS[7].name}</span>
                    <span className="text-[10px]">{MOCK_SECTORS[7].change}%</span>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-3 text-xs text-slate-500">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-sm"></div>강세</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500/60 rounded-sm"></div>상승</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-600/50 rounded-sm"></div>보합</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500/60 rounded-sm"></div>하락</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-600 rounded-sm"></div>약세</div>
            </div>
        </section>
    );
}
