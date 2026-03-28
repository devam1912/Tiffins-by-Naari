import React from "react";
import {
    Users,
    Store,
    Calendar,
    IndianRupee,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from "lucide-react";
import { Typography } from "./ui/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { cn } from "../lib/utils";

const StatsCard = ({ title, value, icon: Icon, description, color, bgColor, trend }) => {
    return (
        <Card className="ao-stat-card border-none shadow-sm hover:shadow-md transition-all rounded-[32px] overflow-hidden group h-full">
            <CardContent className="p-8 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-6">
                    <div className={cn("ao-stat-icon p-4 rounded-2xl shadow-sm border border-white/50 shrink-0", bgColor, color)}>
                        <Icon size={24} />
                    </div>
                    <div className={cn(
                        "ao-trend-badge flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border ml-2 text-right",
                        trend === 'up' ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                    )}>
                        {trend === 'up' ? <ArrowUpRight size={14} className="shrink-0" /> : <ArrowDownRight size={14} className="shrink-0" />}
                        <span className="truncate">{description}</span>
                    </div>
                </div>
                <div>
                    <Typography variant="small" className="ao-stat-label text-gray-400 font-bold uppercase tracking-widest mb-1.5">{title}</Typography>
                    <div className="flex items-end gap-3">
                        <Typography variant="h2" className="ao-stat-value font-serif leading-none truncate overflow-hidden">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </Typography>
                        <Typography variant="small" className="text-gray-400 font-medium mb-1.5">Total</Typography>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const AdminOverview = ({ stats, activities = [] }) => {
    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: Users,
            description: 'Platform Members',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            trend: 'up'
        },
        {
            title: 'Active Kitchens',
            value: stats?.totalProviders || 0,
            icon: Store,
            description: 'Live Providers',
            color: 'text-[var(--primary)]',
            bgColor: 'bg-[var(--primary)]/10',
            trend: 'up'
        },
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: Calendar,
            description: 'Processed',
            color: 'text-[var(--accent)]',
            bgColor: 'bg-[var(--accent)]/10',
            trend: 'up'
        },
        {
            title: 'Revenue',
            value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: IndianRupee,
            description: 'Gross Sales',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            trend: 'up'
        },
    ];

    return (
        <div className="ao-root space-y-10">
            {/* ── TOP ROW ── */}
            <div className="ao-header flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Typography variant="h2" className="ao-main-title font-serif text-3xl">Dashboard Overview</Typography>
                    <Typography className="text-gray-500 mt-1">Platform performance and recent activity at a glance.</Typography>
                </div>
                <div className="ao-range-tabs flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    {['24h', '7d', '30d', 'All'].map((range) => (
                        <button key={range} className={cn(
                            "ao-range-btn px-5 py-2 rounded-xl text-xs font-bold transition-all",
                            range === 'All' ? "bg-white text-[var(--primary)] shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                        )}>
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── STAT CARDS ── */}
            <div className="ao-stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((stat, i) => (
                    <div key={stat.title} className="ao-stat-wrapper" style={{ animationDelay: `${i * 80}ms` }}>
                        <StatsCard {...stat} />
                    </div>
                ))}
            </div>

            {/* ── BOTTOM ROW ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <Card className="ao-activity-card lg:col-span-2 border-none shadow-sm rounded-[32px] overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100/50 p-8">
                        <div className="flex justify-between items-center">
                            <CardTitle className="ao-activity-title font-serif text-xl flex items-center gap-3">
                                <Clock className="ao-clock-icon text-[var(--primary)]" size={24} />
                                Recent Activity Feed
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            {activities.length > 0 ? activities.map((activity, i) => (
                                <div
                                    key={activity.id}
                                    className="ao-activity-item flex items-center gap-6 p-6 rounded-[24px] hover:bg-gray-50/50 transition-all group"
                                    style={{ animationDelay: `${i * 60}ms` }}
                                >
                                    <div className={cn(
                                        "ao-activity-icon p-3 rounded-2xl shadow-sm border border-white shrink-0 group-hover:scale-110 transition-transform",
                                        activity.type === 'user' ? "bg-blue-50 text-blue-600" :
                                            activity.type === 'provider' ? "bg-[var(--primary)]/10 text-[var(--primary)]" :
                                                "bg-[var(--accent)]/10 text-[var(--accent)]"
                                    )}>
                                        {activity.type === 'user' && <Users size={18} />}
                                        {activity.type === 'provider' && <Store size={18} />}
                                        {activity.type === 'order' && <Calendar size={18} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Typography className="ao-activity-msg text-sm font-bold text-gray-800">{activity.message}</Typography>
                                        <Typography variant="small" className="ao-activity-time text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">{activity.timestamp}</Typography>
                                    </div>
                                </div>
                            )) : (
                                <div className="ao-no-activity p-8 text-center text-gray-400 font-medium">No recent activity found.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* System Status */}
                <Card className="ao-system-card border-none shadow-sm rounded-[32px] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                    <CardContent className="p-10 flex flex-col h-full">
                        <div className="ao-system-icon p-4 bg-white/10 backdrop-blur-md rounded-2xl w-fit mb-8 outline outline-1 outline-white/20">
                            <TrendingUp size={24} className="text-green-400" />
                        </div>
                        <Typography variant="h3" className="ao-system-title !text-white font-serif mb-4 leading-tight">System Status & Statistics</Typography>
                        <Typography className="text-gray-400 text-sm mb-10 leading-relaxed font-medium">All platform services are currently operational. Traffic has remained stable in the last 24 hours.</Typography>

                        <div className="mt-auto space-y-6">
                            <div className="ao-progress-group space-y-3">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-gray-500">Processing Load</span>
                                    <span className="text-green-400">Stable</span>
                                </div>
                                <div className="ao-progress-track h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="ao-progress-fill ao-progress-green h-full bg-green-400 rounded-full" style={{ width: '45%' }} />
                                </div>
                            </div>
                            <div className="ao-progress-group space-y-3">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-gray-500">Database Stress</span>
                                    <span className="text-amber-400">Optimal</span>
                                </div>
                                <div className="ao-progress-track h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="ao-progress-fill ao-progress-amber h-full bg-amber-400 rounded-full" style={{ width: '32%' }} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Syne:wght@400;600;700;800&display=swap');

                @keyframes aoFadeUp   { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes aoCardIn   { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes aoActivityIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes aoBarGrow  { from { width: 0 !important; } to { } }
                @keyframes aoIconFloat { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-4px) rotate(3deg); } }
                @keyframes aoPulseGreen { 0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.3); } 50% { box-shadow: 0 0 0 8px rgba(74,222,128,0); } }
                @keyframes aoGradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

                .ao-root { font-family: 'Syne', sans-serif; }

                /* ── HEADER ── */
                .ao-header { animation: aoFadeUp 0.45s ease both; }
                .ao-main-title {
                    font-family: 'Lora', serif !important;
                    background: linear-gradient(135deg, #2d3b2d 0%, #5a7a50 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: -0.5px;
                }

                /* ── RANGE TABS ── */
                .ao-range-tabs {
                    background: rgba(255,255,255,0.7) !important;
                    backdrop-filter: blur(8px);
                    border-color: rgba(143,174,142,0.15) !important;
                }
                .ao-range-btn {
                    font-family: 'Syne', sans-serif;
                    transition: all 0.25s !important;
                }
                .ao-range-btn:not([class*="bg-white"]):hover {
                    color: #5a7a50 !important;
                    background: rgba(143,174,142,0.08);
                }

                /* ── STAT CARDS ── */
                .ao-stats-grid { animation: aoFadeUp 0.5s 0.1s ease both; }
                .ao-stat-wrapper {
                    animation: aoCardIn 0.5s ease both;
                }
                .ao-stat-card {
                    border: 1px solid rgba(143,174,142,0.08) !important;
                    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s, border-color 0.3s !important;
                    position: relative;
                    overflow: hidden !important;
                }
                .ao-stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #8FAE8E, #D9D9A8, #8FA873);
                    background-size: 200% 200%;
                    opacity: 0;
                    transition: opacity 0.3s;
                    animation: aoGradientShift 3s ease infinite;
                }
                .ao-stat-card:hover {
                    transform: translateY(-6px) scale(1.02) !important;
                    box-shadow: 0 24px 60px rgba(45,59,45,0.14) !important;
                    border-color: rgba(143,174,142,0.2) !important;
                }
                .ao-stat-card:hover::before { opacity: 1; }

                /* ── STAT ICON ── */
                .ao-stat-icon {
                    transition: transform 0.3s, box-shadow 0.3s;
                }
                .ao-stat-card:hover .ao-stat-icon {
                    transform: scale(1.1) rotate(-8deg);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                }

                /* ── TREND BADGE ── */
                .ao-trend-badge {
                    font-family: 'Syne', sans-serif;
                    transition: transform 0.2s;
                }
                .ao-stat-card:hover .ao-trend-badge { transform: scale(1.05); }

                /* ── STAT VALUES ── */
                .ao-stat-label { font-family: 'Syne', sans-serif; }
                .ao-stat-value {
                    font-family: 'Lora', serif !important;
                    transition: color 0.3s;
                }
                .ao-stat-card:hover .ao-stat-value { color: #5a7a50; }

                /* ── ACTIVITY CARD ── */
                .ao-activity-card {
                    border: 1px solid rgba(143,174,142,0.08) !important;
                    animation: aoFadeUp 0.55s 0.2s ease both;
                }
                .ao-activity-title { font-family: 'Lora', serif !important; }
                .ao-clock-icon { animation: aoIconFloat 3s ease-in-out infinite; }

                /* ── ACTIVITY ITEMS ── */
                .ao-activity-item {
                    animation: aoActivityIn 0.4s ease both;
                    border-radius: 20px !important;
                    transition: background 0.2s, transform 0.2s !important;
                    cursor: default;
                }
                .ao-activity-item:hover {
                    background: rgba(143,174,142,0.06) !important;
                    transform: translateX(4px);
                }
                .ao-activity-icon {
                    transition: transform 0.25s, box-shadow 0.25s !important;
                }
                .ao-activity-item:hover .ao-activity-icon {
                    box-shadow: 0 6px 16px rgba(0,0,0,0.1);
                }
                .ao-activity-msg { font-family: 'Syne', sans-serif !important; }
                .ao-activity-time { font-family: 'Syne', sans-serif; letter-spacing: 1px; }
                .ao-no-activity { font-family: 'Syne', sans-serif; }

                /* ── SYSTEM STATUS CARD ── */
                .ao-system-card {
                    position: relative;
                    animation: aoFadeUp 0.6s 0.3s ease both;
                    overflow: hidden !important;
                }
                .ao-system-card::before {
                    content: '';
                    position: absolute;
                    top: -100px; right: -100px;
                    width: 300px; height: 300px;
                    background: radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                }
                .ao-system-icon {
                    transition: transform 0.3s;
                    animation: aoIconFloat 4s ease-in-out infinite;
                }
                .ao-system-title { font-family: 'Lora', serif !important; }

                /* ── PROGRESS BARS ── */
                .ao-progress-track {
                    position: relative;
                    background: rgba(255,255,255,0.08) !important;
                }
                .ao-progress-fill {
                    animation: aoBarGrow 1.2s cubic-bezier(0.4,0,0.2,1) 0.5s both;
                    transition: width 0.5s ease;
                    position: relative;
                }
                .ao-progress-fill::after {
                    content: '';
                    position: absolute;
                    right: 0; top: 50%;
                    transform: translateY(-50%);
                    width: 6px; height: 6px;
                    border-radius: 50%;
                    background: inherit;
                    box-shadow: 0 0 8px currentColor;
                }
                .ao-progress-green { animation: aoPulseGreen 2s ease-in-out infinite; }
                .ao-progress-group { transition: opacity 0.3s; }
                .ao-progress-group:hover { opacity: 0.9; }
            `}</style>
        </div>
    );
};