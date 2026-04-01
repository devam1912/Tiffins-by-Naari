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
        <Card className={cn(
            "group relative overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[32px] bg-white h-full",
            "animate-in fade-in slide-in-from-bottom-4"
        )} style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-8 flex flex-col justify-between h-full relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div className={cn("p-4 rounded-2xl shadow-inner transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-500", bgColor, color)}>
                        <Icon size={24} />
                    </div>
                    <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border",
                        trend === 'up' ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                    )}>
                        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{description}</span>
                    </div>
                </div>
                <div>
                    <Typography variant="small" className="text-muted-foreground font-black uppercase tracking-[0.2em] mb-2">{title}</Typography>
                    <div className="flex items-baseline gap-2">
                        <Typography variant="h2" className="font-serif !text-4xl tracking-tighter text-foreground group-hover:text-primary transition-colors">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </Typography>
                        <Typography variant="small" className="text-muted-foreground/50 font-bold uppercase tracking-widest">Total</Typography>
                    </div>
                </div>
            </CardContent>
            {/* Background Decorative Element */}
            <div className={cn("absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-[0.03] transition-transform duration-700 group-hover:scale-150", bgColor)} />
        </Card>
    );
};

export const AdminOverview = ({ stats, activities = [] }) => {
    const statCardsVisible = [
        {
            title: 'Total Users',
            value: (stats?.totalUsers || 0) + (stats?.totalProviders || 0),
            icon: Users,
            description: 'Platform Members',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100/50',
            trend: 'up'
        },
        {
            title: 'Active Kitchens',
            value: stats?.totalProviders || 0,
            icon: Store,
            description: 'Verified Partners',
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            trend: 'up'
        },
        {
            title: 'Orders Processed',
            value: stats?.totalOrders || 0,
            icon: Package,
            description: 'Lifetime Total',
            color: 'text-accent',
            bgColor: 'bg-accent/10',
            trend: 'up'
        },
        {
            title: 'Gross Revenue',
            value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: IndianRupee,
            description: 'Earnings',
            color: 'text-orange-600',
            bgColor: 'bg-orange-100/50',
            trend: 'up'
        },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            {/* HEADER AREA */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <Typography variant="h2" className="font-serif tracking-tight">Admin Dashboard</Typography>
                    <Typography className="text-muted-foreground max-w-lg">Overview of platform performance and recent activity.</Typography>
                </div>
                <div className="flex p-1 bg-white/50 backdrop-blur-md rounded-2xl border border-muted-foreground/10 shadow-sm">
                    {['Overview', 'Analysis', 'Trends'].map((tab) => (
                        <button key={tab} className={cn(
                            "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            tab === 'Overview' ? "bg-white text-primary shadow-sm ring-1 ring-black/5" : "text-muted-foreground hover:text-foreground"
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
                <Card className="lg:col-span-2 border-none shadow-sm rounded-[40px] bg-white overflow-hidden group">
                    <CardHeader className="border-b border-muted/30 p-10 bg-muted/10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary group-hover:rotate-12 transition-transform">
                                <Activity size={24} />
                            </div>
                            <CardTitle className="font-serif text-2xl">Recent Activity</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            {activities.length > 0 ? activities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center gap-6 p-6 rounded-[28px] hover:bg-muted/30 transition-all duration-300 group/item border border-transparent hover:border-muted-foreground/5"
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border border-white shrink-0 group-hover/item:scale-110 duration-500",
                                        activity.type === 'user' ? "bg-blue-50 text-blue-600" :
                                            activity.type === 'provider' ? "bg-primary/10 text-primary" :
                                                "bg-accent/10 text-accent"
                                    )}>
                                        {activity.type === 'user' && <Users size={18} />}
                                        {activity.type === 'provider' && <Store size={18} />}
                                        {activity.type === 'order' && <Calendar size={18} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Typography className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors">{activity.message}</Typography>
                                        <Typography variant="small" className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em] mt-1">{activity.timestamp}</Typography>
                                    </div>
                                    <ArrowUpRight className="text-muted-foreground/30 group-hover/item:text-primary opacity-0 group-hover/item:opacity-100 transition-all" size={20} />
                                </div>
                            )) : (
                                <div className="p-20 text-center space-y-4 bg-muted/5 rounded-[32px] m-4 border-2 border-dashed border-muted">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground opacity-50">
                                        <Clock size={32} />
                                    </div>
                                    <Typography className="text-muted-foreground font-medium uppercase tracking-widest text-xs">No recent activity</Typography>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* AI Recommendations Card */}
                <Card className="border-none shadow-xl rounded-[40px] bg-[#1a1c1e] text-background overflow-hidden relative group">
                    <CardContent className="p-10 flex flex-col h-full relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 group-hover:animate-pulse">
                                <Sparkles size={24} className="text-[#a5b4fc]" />
                            </div>
                            <span className="px-3 py-1 bg-[#a5b4fc]/20 text-[#a5b4fc] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#a5b4fc]/30">Auto-Generated</span>
                        </div>
                        <Typography variant="h3" className="!text-white font-serif mb-3 leading-tight">AI Insights</Typography>
                        <Typography className="text-white/60 text-sm mb-8 leading-relaxed font-medium">Smart recommendations based on platform activity.</Typography>

                        <div className="mt-auto space-y-6">
                            {[
                                { title: 'High Demand Detected', desc: 'Surge in orders in North Sector. Notify nearby providers.', color: 'text-green-400', bg: 'bg-green-400' },
                                { title: 'Provider Engagement', desc: '3 kitchens missed menu updates today. Send reminders.', color: 'text-amber-400', bg: 'bg-amber-400' },
                                { title: 'Revenue Optimization', desc: 'Conversion rate up 12%. Optimal time for premium push.', color: 'text-blue-400', bg: 'bg-blue-400' }
                            ].map((insight, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", insight.bg)} />
                                        <Typography variant="small" className={cn("font-bold text-[10px] uppercase tracking-[0.15em]", insight.color)}>{insight.title}</Typography>
                                    </div>
                                    <Typography className="text-white/70 text-sm leading-relaxed pl-3.5 border-l border-white/10 ml-[3px]">{insight.desc}</Typography>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    {/* Abstract Decorative Graphics */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />
                </Card>
            </div>
        </div>
    );
};

