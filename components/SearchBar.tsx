"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        router.push(`/stock/${query.toUpperCase()}`);
        setQuery("");
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full flex items-center gap-2">
            <div className="relative flex-1">
                <input
                    type="text"
                    placeholder="검색 (예: AAPL, SPY)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-slate-900 text-slate-100 pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm placeholder:text-slate-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-colors flex-shrink-0"
                aria-label="검색"
            >
                <Search className="w-5 h-5" />
            </button>
        </form>
    );
}
