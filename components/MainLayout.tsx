"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Telescope, PieChart, Newspaper, CalendarDays } from "lucide-react";
import SearchBar from "./SearchBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const tabs = [
        { name: "홈", path: "/", icon: Home },
        { name: "발굴", path: "/discovery", icon: Telescope },
        { name: "캘린더", path: "/calendar", icon: CalendarDays },
        { name: "포트폴리오", path: "/portfolio", icon: PieChart },
        { name: "뉴스", path: "/news", icon: Newspaper },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 relative pb-20">
            {/* Mobile-First Container */}
            <div className="max-w-md mx-auto min-h-screen bg-slate-950 relative shadow-2xl shadow-black">
                {/* Header with Search */}
                <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md px-4 py-3 border-b border-slate-900/50">
                    <SearchBar />
                </header>

                <main className="p-4 pt-2">{children}</main>

                {/* Bottom Navigation */}
                <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 pb-safe">
                    <div className="max-w-md mx-auto flex justify-around items-center h-16">
                        {tabs.map((tab) => {
                            const isActive = pathname === tab.path;
                            const Icon = tab.icon;
                            return (
                                <Link
                                    key={tab.path}
                                    href={tab.path}
                                    className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${isActive ? "text-slate-50" : "text-slate-500 hover:text-slate-300"
                                        }`}
                                >
                                    <Icon className={`w-6 h-6 mb-1 ${isActive ? "text-blue-500" : ""}`} />
                                    <span className="text-[10px] font-medium">{tab.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </div>
    );
}
