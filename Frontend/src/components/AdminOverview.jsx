import React from "react";
import {
    Users,
    Store,
    Calendar,
    IndianRupee,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Activity,
    Package,
    Sparkles
} from "lucide-react";
import { Typography } from "./ui/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { cn } from "../lib/utils";

const StatsCard = ({ title, value, icon: Icon, description, color, bgColor, trend, index }) => {
    return (
        <div className="stat-card flex flex-col justify-between p-8 relative overflow-hidden group h-full animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-500", bgColor, color)}>
                    <Icon size={24} />
                </div>
                <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border",
                    trend === 'up' ? "bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]" : "bg-[#ffebee] text-[#c62828] border-[#ffcdd2]"
                )}>
                    {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{description}</span>
                </div>
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-[#8FA873]">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h2 style={{ fontFamily: "'Lora',serif", fontSize: 36, fontWeight: 700, color: "#2d3b2d" }} className="group-hover:text-[#5a7a50] transition-colors">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#aaa]">Total</span>
                </div>
            </div>
            <div className={cn("absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-150", bgColor)} />
        </div>
    );
};

export const AdminOverview = ({ stats, activities = [] }) => {
    const statCardsVisible = [
        {
            title: 'Total Users',
            value: (stats?.totalUsers || 0) + (stats?.totalProviders || 0),
            icon: Users,
            description: 'Platform Members',
            color: 'text-[#1976d2]',
            bgColor: 'bg-[#1976d2]/10',
            trend: 'up'
        },
        {
            title: 'Active Kitchens',
            value: stats?.totalProviders || 0,
            icon: Store,
            description: 'Verified Partners',
            color: 'text-[#8FAE8E]',
            bgColor: 'bg-[#8FAE8E]/20',
            trend: 'up'
        },
        {
            title: 'Orders Processed',
            value: stats?.totalOrders || 0,
            icon: Package,
            description: 'Lifetime Total',
            color: 'text-[#f59e0b]',
            bgColor: 'bg-[#f59e0b]/10',
            trend: 'up'
        },
        {
            title: 'Gross Revenue',
            value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: IndianRupee,
            description: 'Earnings',
            color: 'text-[#d946ef]',
            bgColor: 'bg-[#d946ef]/10',
            trend: 'up'
        },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            {/* HEADER AREA */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="admin-title">Admin Dashboard</h2>
                    <p className="admin-subtitle max-w-lg">Overview of platform performance and recent activity.</p>
                </div>
                <div className="flex gap-2">
                    {['Overview', 'Analysis', 'Trends'].map((tab) => (
                        <button key={tab} className={cn(
                            "px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                            tab === 'Overview' ? "bg-[#8FAE8E] text-white shadow-[0_4px_16px_rgba(143,174,142,0.35)]" : "bg-white/60 text-[#888] border-[#e0e0d0] hover:bg-white hover:text-[#5a7a50]"
                        )}>
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* STAT CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCardsVisible.map((stat, i) => (
                    <StatsCard key={stat.title} {...stat} index={i} />
                ))}
            </div>

            {/* ACTIVITY & HEALTH SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Activity Feed */}
                {/* Activity Feed */}
                <div className="lg:col-span-2 table-container flex flex-col group overflow-visible">
                    <div className="p-8 pb-6 border-b border-[rgba(143,174,142,0.2)] bg-[rgba(143,174,142,0.05)]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm text-[#8FAE8E] group-hover:rotate-12 transition-transform">
                                <Activity size={24} />
                            </div>
                            <h3 style={{ fontFamily: "'Lora',serif", fontSize: 24, fontWeight: 700, color: "#2d3b2d" }}>Recent Activity</h3>
                        </div>
                    </div>
                    <div className="p-4 flex-1">
                        <div className="space-y-2">
                            {activities.length > 0 ? activities.map((activity, i) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center gap-6 p-6 rounded-[24px] hover:bg-white/80 transition-all duration-300 group/item border border-transparent hover:border-[#8FAE8E]/30"
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border border-white shrink-0 group-hover/item:scale-110 duration-500",
                                        activity.type === 'user' ? "bg-blue-50 text-blue-600" :
                                            activity.type === 'provider' ? "bg-[#8FAE8E]/20 text-[#5a7a50]" :
                                                "bg-amber-50 text-amber-600"
                                    )}>
                                        {activity.type === 'user' && <Users size={18} />}
                                        {activity.type === 'provider' && <Store size={18} />}
                                        {activity.type === 'order' && <Calendar size={18} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[#2d3b2d] group-hover/item:text-[#5a7a50] transition-colors m-0 mb-1">{activity.message}</p>
                                        <p className="text-[10px] text-[#aaa] font-black uppercase tracking-[0.15em] m-0">{activity.timestamp}</p>
                                    </div>
                                    <ArrowUpRight className="text-[#8FAE8E]/40 group-hover/item:text-[#8FAE8E] opacity-0 group-hover/item:opacity-100 transition-all" size={20} />
                                </div>
                            )) : (
                                <div className="p-20 text-center space-y-4 bg-[rgba(255,255,255,0.4)] rounded-[32px] m-4 border-2 border-dashed border-[#8FAE8E]/30">
                                    <div className="w-16 h-16 bg-[#8FAE8E]/10 rounded-full flex items-center justify-center mx-auto text-[#8FAE8E]">
                                        <Clock size={32} />
                                    </div>
                                    <p className="text-[#888] font-bold uppercase tracking-widest text-xs m-0">No recent activity</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Recommendations Card */}
                {/* AI Recommendations Card */}
                <div className="shadow-xl rounded-[40px] bg-[#2d3b2d] text-white overflow-hidden relative group p-10 flex flex-col">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 group-hover:animate-pulse">
                                <Sparkles size={24} className="text-[#E7E6B6]" />
                            </div>
                            <span className="px-3 py-1 bg-[#8FAE8E]/20 text-[#D9D9A8] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#8FAE8E]/30">Auto-Generated</span>
                        </div>
                        <h3 style={{ fontFamily: "'Lora',serif", fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 12 }}>AI Insights</h3>
                        <p className="text-white/60 text-sm mb-8 leading-relaxed font-medium">Smart recommendations based on platform activity.</p>

                        <div className="mt-auto space-y-6">
                            {[
                                { title: 'High Demand Detected', desc: 'Surge in orders in North Sector. Notify nearby providers.', color: 'text-[#E7E6B6]', bg: 'bg-[#E7E6B6]' },
                                { title: 'Provider Engagement', desc: '3 kitchens missed menu updates today. Send reminders.', color: 'text-amber-400', bg: 'bg-amber-400' },
                                { title: 'Revenue Optimization', desc: 'Conversion rate up 12%. Optimal time for premium push.', color: 'text-blue-300', bg: 'bg-blue-300' }
                            ].map((insight, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", insight.bg)} />
                                        <p className={cn("font-bold text-[10px] uppercase tracking-[0.15em] m-0", insight.color)}>{insight.title}</p>
                                    </div>
                                    <p className="text-white/70 text-[13px] leading-relaxed pl-3.5 border-l border-white/10 ml-[3px] m-0">{insight.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Abstract Decorative Graphics */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#8FAE8E]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D9D9A8]/10 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

