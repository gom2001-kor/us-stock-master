import { StockDetail, StockSignal } from "@/lib/types";

// --- Types Re-exported for convenience if needed, but defining them in types.ts is better.
// For now, I'll rely on a shared types file or define them here if I don't create types.ts.
// Let's create types.ts first or define here. Defining here is faster for now.

export type StartStockSignal = "강력 매수" | "매수" | "중립" | "매도";

export const MOCK_STOCKS: StockDetail[] = [
    // 우량주 (Blue Chip)
    {
        ticker: "AAPL",
        name: "애플",
        price: 178.25,
        changePercent: 1.2,
        category: "bluechip",
        signal: "매수",
        score: 88,
        consensus: { buy: 28, total: 35, targetPrice: 210 },
        analysis: {
            verdict: "매수",
            headline: "아이폰 매출 견조 및 서비스 부문 성장 지속",
            details: [
                "ROE 154%로 압도적인 자본 효율성 입증",
                "전통적 하드웨어 매출 둔화를 서비스 수익이 상쇄 중",
                "PER 26배로 다소 높은 편이나 프리미엄 정당화 가능"
            ]
        },
        metrics: { per: 26.5, pbr: 32.1, roe: 154.2 },
    },
    {
        ticker: "NVDA",
        name: "엔비디아",
        price: 905.10,
        changePercent: 3.5,
        category: "bluechip",
        signal: "강력 매수",
        score: 96,
        consensus: { buy: 40, total: 42, targetPrice: 1100 },
        analysis: {
            verdict: "강력 매수",
            headline: "AI 인프라 투자의 최대 수혜주",
            details: [
                "데이터센터 매출 전년 대비 폭발적 성장",
                "압도적인 시장 점유율로 경쟁사 진입 장벽 구축",
                "PER 75배이나 성장률 감안 시 고평가 논란 제한적"
            ]
        },
        metrics: { per: 75.2, pbr: 45.8, roe: 98.5 },
    },
    {
        ticker: "MSFT",
        name: "마이크로소프트",
        price: 425.05,
        changePercent: 0.9,
        category: "bluechip",
        signal: "강력 매수",
        score: 92,
        consensus: { buy: 38, total: 40, targetPrice: 480 },
        analysis: {
            verdict: "강력 매수",
            headline: "클라우드와 AI의 완벽한 조화",
            details: [
                "Azure 클라우드 성장세 지속",
                "Copilot 도입으로 사무용 소프트웨어 시장 지배력 강화",
                "안정적인 재무구조와 주주환원 정책"
            ]
        },
        metrics: { per: 35.4, pbr: 12.5, roe: 38.1 },
    },
    {
        ticker: "TSLA",
        name: "테슬라",
        price: 175.50,
        changePercent: 5.2,
        category: "bluechip",
        signal: "중립",
        score: 72,
        consensus: { buy: 20, total: 45, targetPrice: 190 },
        analysis: {
            verdict: "중립",
            headline: "전기차 수요 둔화와 마진 압박 우려",
            details: [
                "가격 인하 경쟁으로 인한 영업이익률 하락",
                "FSD(자율주행) 소프트웨어 매출 확대가 관건",
                "PER 45배로 여전히 높은 기대감이 반영됨"
            ]
        },
        metrics: { per: 45.2, pbr: 9.8, roe: 21.5 },
    },
    // 저평가 가치주 (Undervalued)
    {
        ticker: "KO",
        name: "코카콜라",
        price: 59.80,
        changePercent: -0.2,
        category: "undervalued",
        signal: "중립",
        score: 75,
        consensus: { buy: 12, total: 20, targetPrice: 65 },
        analysis: {
            verdict: "중립",
            headline: "경기 방어주로서의 매력 보유",
            details: [
                "강력한 브랜드 파워와 가격 결정력",
                "안정적인 배당 수익률 제공",
                "성장성은 제한적이나 현금 흐름 우수"
            ]
        },
        metrics: { per: 24.1, pbr: 10.2, roe: 42.5 },
    },
    {
        ticker: "F",
        name: "포드 모터",
        price: 12.15,
        changePercent: 0.5,
        category: "undervalued",
        signal: "매수",
        score: 80,
        consensus: { buy: 8, total: 18, targetPrice: 15 },
        analysis: {
            verdict: "매수",
            headline: "저평가 매력과 구조조정 기대감",
            details: [
                "PER 7배 수준의 절대적 저평가 영역",
                "전기차 부문 손실 축소 노력 지속",
                "높은 배당 매력 존재"
            ]
        },
        metrics: { per: 7.2, pbr: 1.1, roe: 12.8 },
    },
    {
        ticker: "PFE",
        name: "화이자",
        price: 28.50,
        changePercent: -0.8,
        category: "undervalued",
        signal: "매수",
        score: 82,
        consensus: { buy: 15, total: 25, targetPrice: 32 },
        analysis: {
            verdict: "매수",
            headline: "코로나 이후의 새로운 성장 동력 모색",
            details: [
                "항암제 중심의 R&D 파이프라인 강화",
                "역사적 하단 수준의 밸류에이션 매력",
                "높은 배당 수익률로 하방 경직성 확보"
            ]
        },
        metrics: { per: 11.5, pbr: 2.3, roe: 18.5 },
    },
];

// Helper: Deterministic Random Generator based on Ticker
const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
};

// FACT-BASED ANALYSIS ENGINE
const generateAnalysis = (metrics: { per: number; pbr: number; roe: number }, ticker: string) => {
    const details: string[] = [];
    let score = 0;

    // 1. Profitability Rule (ROE)
    if (metrics.roe > 15) {
        score += 40;
        details.push(`ROE가 ${metrics.roe}%로, 자본 효율성이 매우 높습니다 (기준: 15% 이상).`);
    } else if (metrics.roe > 10) {
        score += 20;
        details.push(`ROE가 ${metrics.roe}%로, 준수한 수익성을 보이고 있습니다.`);
    } else {
        details.push(`ROE가 ${metrics.roe}%로, 수익성 개선이 필요합니다.`);
    }

    // 2. Valuation Rule (PER)
    if (metrics.per < 15 && metrics.per > 0) {
        score += 40;
        details.push(`PER이 ${metrics.per}배로, 시장 평균 대비 저평가 상태입니다.`);
    } else if (metrics.per > 50) {
        score -= 10;
        details.push(`PER이 ${metrics.per}배로, 미래 성장 기대감이 주가에 선반영되어 있습니다.`);
    } else {
        score += 10;
        details.push(`PER이 ${metrics.per}배로, 적정 수준의 밸류에이션을 형성하고 있습니다.`);
    }

    // Determine Verdict
    let verdict: StockDetail["signal"] = "중립";
    let headline = "";

    if (score >= 60) {
        verdict = "강력 매수";
        headline = "강력한 펀더멘털과 매력적인 밸류에이션";
    } else if (score >= 30) {
        verdict = "매수";
        headline = "안정적인 수익성과 성장 잠재력 보유";
    } else {
        verdict = "중립";
        headline = "현재 주가는 펀더멘털을 적정하게 반영 중";
    }

    return { verdict, headline, details, score };
};

// --- Helper for Dynamic Fetch ---
export const fetchStockDetails = (ticker: string): StockDetail => {
    const upperTicker = ticker.toUpperCase();
    const existing = MOCK_STOCKS.find((s) => s.ticker === upperTicker);

    if (existing) {
        return existing;
    }

    // Generate Deterministic Data
    const hash = getHash(upperTicker);
    const price = (hash % 50000) / 100 + 10; // $10 ~ $510
    const changePercent = ((hash % 1000) - 500) / 100; // -5.00% ~ +5.00%
    const per = (hash % 800) / 10 + 5; // 5.0 ~ 85.0
    const roe = ((hash % 500) - 100) / 10; // -10.0% ~ 40.0%
    const pbr = (hash % 100) / 10 + 0.5; // 0.5 ~ 10.5

    const metrics = { per: Number(per.toFixed(1)), roe: Number(roe.toFixed(1)), pbr: Number(pbr.toFixed(1)) };
    const analysis = generateAnalysis(metrics, upperTicker);

    return {
        ticker: upperTicker,
        name: `${upperTicker} Corp (Simulated)`,
        price: Number(price.toFixed(2)),
        changePercent: Number(changePercent.toFixed(2)),
        category: metrics.per < 20 ? "undervalued" : "bluechip",
        signal: analysis.verdict,
        score: analysis.score,
        consensus: {
            buy: Math.floor((hash % 100) / 2),
            total: 50,
            targetPrice: Number((price * (1 + (analysis.score - 50) / 200)).toFixed(2))
        },
        analysis,
        metrics,
    };
};
