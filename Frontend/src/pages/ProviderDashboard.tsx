import React, { useState } from "react";
import {
    LayoutDashboard,
    UtensilsCrossed,
    Users,
    ShoppingBag,
    Settings,
    LogOut,
    Bell,
    Search,
    ChevronDown,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { cn } from "../lib/utils";

// --- Placeholder Sub-components ---

const DashboardOverview = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { label: "Total Revenue", value: "₹45,280", icon: DollarSign, trend: "+12%", color: "text-green-600", bg: "bg-green-50" },
                { label: "Active Subscriptions", value: "128", icon: Users, trend: "+5%", color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Orders Today", value: "42", icon: ShoppingBag, trend: "+18%", color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Avg. Rating", value: "4.9", icon: UtensilsCrossed, trend: "Stable", color: "text-amber-600", bg: "bg-amber-50" },
            ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className={cn("p-3 rounded-2xl", stat.bg)}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                            <span className={cn("text-xs font-bold px-2 py-1 rounded-full", stat.bg, stat.color)}>
                                {stat.trend}
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <h3 className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</h3>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Recent Sales Overview</CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center bg-gray-50 rounded-xl m-6">
                    <Typography className="text-muted-foreground italic">Sales Chart Placeholder</Typography>
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Peak Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 m-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">12:00 PM - 1:00 PM</span>
                        <span className="text-sm font-bold text-primary">High</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[80%]"></div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">7:30 PM - 8:30 PM</span>
                        <span className="text-sm font-bold text-accent">Medium</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-accent h-full w-[60%]"></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
);

const ViewPlaceholder = ({ title }: { title: string }) => (
    <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Settings className="text-primary animate-spin-slow" size={40} />
        </div>
        <Typography variant="h3" className="mb-2 italic opacity-40">{title} Module</Typography>
        <Typography className="max-w-md text-muted-foreground mb-8">
            We are currently standardizing this module. The functionality will remain the same but with a cleaner, figma-trace-free implementation.
        </Typography>
        <Button variant="outline" disabled>Module Under Maintenance</Button>
    </div>
);

// --- Main Dashboard Component ---

interface ProviderDashboardProps {
    onLogout?: () => void;
}

export const ProviderDashboard = ({ onLogout = () => console.log("Logout triggered") }: ProviderDashboardProps) => {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [isServiceActive, setIsServiceActive] = useState(true);

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Menu Management", icon: UtensilsCrossed },
        { name: "Active Subscriptions", icon: Users },
        { name: "Orders Today", icon: ShoppingBag },
        { name: "Profile Settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-[#F8FAF8]">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-72 bg-[var(--primary)] text-primary-foreground flex flex-col z-50 shadow-xl">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center">
                        <UtensilsCrossed className="text-[var(--primary)] w-6 h-6" />
                    </div>
                    <Typography variant="h4" className="!text-primary-foreground font-serif tracking-tight">Naari Chef</Typography>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={cn(
                                "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium",
                                activeTab === item.name
                                    ? "bg-white/20 text-primary-foreground shadow-inner backdrop-blur-sm"
                                    : "text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground"
                            )}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/10 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-primary-foreground/50 uppercase tracking-[0.2em]">Service Status</span>
                            <span className="text-sm font-semibold">{isServiceActive ? "Active" : "Paused"}</span>
                        </div>
                        <button
                            onClick={() => setIsServiceActive(!isServiceActive)}
                            className={cn(
                                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                                isServiceActive ? "bg-[var(--accent)]" : "bg-white/20"
                            )}
                        >
                            <span className={cn(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                                isServiceActive ? "translate-x-5" : "translate-x-0"
                            )} />
                        </button>
                    </div>

                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-primary-foreground/70 hover:bg-red-500/20 hover:text-red-100 transition-all font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search subscribers or orders..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-gray-100"></div>
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors">Naari's Kitchen</p>
                                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Premium Provider</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center border-2 border-[var(--primary)]/20 shadow-sm group-hover:scale-105 transition-transform">
                                <span className="text-[var(--primary)] font-bold">NK</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* View Render */}
                <div className="p-10 max-w-7xl mx-auto">
                    <Typography variant="h2" className="mb-8 font-serif">{activeTab}</Typography>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === "Dashboard" ? <DashboardOverview /> : <ViewPlaceholder title={activeTab} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};
