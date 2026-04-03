import React from "react";
import {
    Users,
    Store,
    Calendar,
    UtensilsCrossed,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from "lucide-react";
import { Typography } from "./ui/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { dashboardStats, mockActivities } from "../data/adminMockData";
import { cn } from "../lib/utils";

const StatsCard = ({ title, value, icon: Icon, description, color, bgColor, trend }) => {
    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-[32px] overflow-hidden group">
            <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <div className={cn("p-4 rounded-2xl shadow-sm border border-white/50", bgColor, color)}>
                        <Icon size={24} />
                    </div>
                    <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border",
                        trend === 'up' ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                    )}>
                        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {description.split(' ')[0]}
                    </div>
                </div>
                <div>
                    <Typography variant="small" className="text-gray-400 font-bold uppercase tracking-widest mb-1.5">{title}</Typography>
                    <div className="flex items-end gap-3">
                        <Typography variant="h2" className="font-serif leading-none">{value.toLocaleString()}</Typography>
                        <Typography variant="small" className="text-gray-400 font-medium mb-1.5">Total</Typography>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const AdminOverview = () => {
    const stats = [
        {
            title: 'Total Users',
            value: dashboardStats.totalUsers,
            icon: Users,
            description: '+12% from last month',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            trend: 'up'
        },
        {
            title: 'Total Providers',
            value: dashboardStats.totalProviders,
            icon: Store,
            description: '+3 new this month',
            color: 'text-[var(--primary)]',
            bgColor: 'bg-[var(--primary)]/10',
            trend: 'up'
        },
        {
            title: 'Active Subs',
            value: dashboardStats.activeSubscriptions,
            icon: Calendar,
            description: '+8% from last month',
            color: 'text-[var(--accent)]',
            bgColor: 'bg-[var(--accent)]/10',
            trend: 'up'
        },
        {
            title: 'Menu Items',
            value: dashboardStats.totalMenuItems,
            icon: UtensilsCrossed,
            description: '+15 items added',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            trend: 'up'
        },
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Typography variant="h2" className="font-serif text-3xl">Dashboard Overview</Typography>
                    <Typography className="text-gray-500 mt-1">Platform performance and recent registrations at a glance.</Typography>
                </div>
                <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    {['24h', '7d', '30d', 'All'].map((range) => (
                        <button key={range} className={cn(
                            "px-5 py-2 rounded-xl text-xs font-bold transition-all",
                            range === '30d' ? "bg-white text-[var(--primary)] shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                        )}>
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat) => (
                    <StatsCard key={stat.title} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-sm rounded-[32px] overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100/50 p-8">
                        <div className="flex justify-between items-center">
                            <CardTitle className="font-serif text-xl flex items-center gap-3">
                                <Clock className="text-[var(--primary)]" size={24} />
                                Recent Activity
                            </CardTitle>
                            <button className="text-xs font-bold text-[var(--primary)] hover:underline">View All</button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            {mockActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center gap-6 p-6 rounded-[24px] hover:bg-gray-50/50 transition-all group"
                                >
                                    <div className={cn(
                                        "p-3 rounded-2xl shadow-sm border border-white shrink-0 group-hover:scale-110 transition-transform",
                                        activity.type === 'user_joined' ? "bg-blue-50 text-blue-600" :
                                            activity.type === 'provider_registered' ? "bg-[var(--primary)]/10 text-[var(--primary)]" :
                                                "bg-[var(--accent)]/10 text-[var(--accent)]"
                                    )}>
                                        {activity.type === 'user_joined' && <Users size={18} />}
                                        {activity.type === 'provider_registered' && <Store size={18} />}
                                        {activity.type === 'subscription_created' && <Calendar size={18} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Typography className="text-sm font-bold text-gray-800">{activity.message}</Typography>
                                        <Typography variant="small" className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">{activity.timestamp}</Typography>
                                    </div>
                                    <ArrowUpRight className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                    <CardContent className="p-10 flex flex-col h-full">
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl w-fit mb-8 outline outline-1 outline-white/20">
                            <TrendingUp size={24} className="text-green-400" />
                        </div>
                        <Typography variant="h3" className="!text-white font-serif mb-4 leading-tight">System Status & Statistics</Typography>
                        <Typography className="text-gray-400 text-sm mb-10 leading-relaxed font-medium">All platform services are currently operational. Traffic has increased by 22% in the last hour.</Typography>

                        <div className="mt-auto space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-gray-500">Processing Load</span>
                                    <span className="text-green-400">Stable</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-400 rounded-full" style={{ width: '45%' }} />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-gray-500">Database Stress</span>
                                    <span className="text-amber-400">Optimal</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '32%' }} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
