export type StockSignal = "강력 매수" | "매수" | "중립" | "매도";

export type StockDetail = {
    ticker: string;
    name: string; // Korean Name e.g. "애플"
    price: number;
    changePercent: number;
    category: "undervalued" | "bluechip";
    signal: StockSignal;
    score: number; // 0-100
    consensus: {
        buy: number;
        total: number;
        targetPrice: number;
    };
    analysis: {
        verdict: StockSignal;
        headline: string;
        details: string[]; // Fact-based bullet points
    };
    metrics: {
        per: number;
        pbr: number;
        roe: number;
    };
};
