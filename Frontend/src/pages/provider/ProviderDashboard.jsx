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
import { Typography } from "../../components/ui/Typography";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { cn } from "../../lib/utils";

// --- Placeholder Sub-components ---

const DashboardOverview = ({ stats, loading, isServiceActive }) => {
    const statsConfig = [
        {
            label: "Monthly Revenue",
            value: loading ? "..." : `₹${stats?.monthlyRevenue?.toLocaleString() || 0}`,
            icon: DollarSign,
            trend: "This Month",
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            label: "Active Subscribers",
            value: loading ? "..." : (stats?.activeSubscribers || 0),
            icon: Users,
            trend: "Active Now",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: "Meals Today",
            value: loading ? "..." : (stats?.todaysMeals || 0),
            icon: ShoppingBag,
            trend: loading ? "" : `${stats?.lunchCount || 0}L / ${stats?.dinnerCount || 0}D`,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            label: "Service Status",
            value: isServiceActive ? "Active" : "Paused",
            icon: UtensilsCrossed,
            trend: "Current",
            color: isServiceActive ? "text-amber-600" : "text-red-600",
            bg: isServiceActive ? "bg-amber-50" : "bg-red-50"
        },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsConfig.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                                    <stat.icon className={stat.color} size={24} />
                                </div>
                                <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider", stat.bg, stat.color)}>
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
                <Card className="lg:col-span-2 border-none shadow-sm flex flex-col">
                    <CardHeader className="border-b border-gray-50 pb-5">
                        <CardTitle className="text-xl font-serif">Recent Subscriptions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        {loading ? (
                            <div className="h-64 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                            </div>
                        ) : !stats?.recentActivity || stats.recentActivity.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-400 italic">
                                <Users size={40} className="mb-4 opacity-20" />
                                <p>No recent subscription activity</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plan</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {stats.recentActivity.map((activity, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-gray-800">{activity.user?.name || "Customer"}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-md capitalize">
                                                        {activity.planType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-700">₹{activity.amountPaid}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(activity.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="border-b border-gray-50 pb-5">
                        <CardTitle className="text-xl font-serif">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                                        <Clock size={18} />
                                    </div>
                                    <span className="text-sm font-medium">Lunch Deliveries</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{stats?.lunchCount || 0}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-orange-400 h-full transition-all duration-1000"
                                    style={{ width: `${(stats?.todaysMeals > 0 ? (stats.lunchCount / stats.todaysMeals) * 100 : 0) || 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                        <Clock size={18} />
                                    </div>
                                    <span className="text-sm font-medium">Dinner Deliveries</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{stats?.dinnerCount || 0}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-400 h-full transition-all duration-1000"
                                    style={{ width: `${(stats?.todaysMeals > 0 ? (stats.dinnerCount / stats.todaysMeals) * 100 : 0) || 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-50">
                            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <TrendingUp size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Efficiency Tip</span>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                    {stats?.lunchCount > stats?.dinnerCount
                                        ? "Lunch hours are your peak. Consider prepping side dishes earlier."
                                        : "Dinner demand is rising. Ensure your evening staff is ready."}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const ViewPlaceholder = ({ title }) => (
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

import { ProviderMenu } from "../../components/ProviderMenu";
import { ActiveSubscriptions } from "../../components/ActiveSubscriptions";
import { OrdersToday } from "../../components/OrdersToday";
import { ProfileSettings } from "../../components/ProfileSettings";
import api from "../../services/api";

// --- Main Dashboard Component ---

export const ProviderDashboard = ({ onLogout = () => console.log("Logout triggered") }) => {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [isServiceActive, setIsServiceActive] = useState(true);
    const [isStatusLoading, setIsStatusLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);

    const fetchDashboardStats = async () => {
        setLoadingStats(true);
        try {
            const token = localStorage.getItem("token");
            const userData = JSON.parse(localStorage.getItem("user") || "{}");

            const res = await api.get("/api/subscriptions/provider/dashboard", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setStats(res.data.data);

                // --- PROFILE & STATUS SYNC ---
                // We fetch the public 'nearby' list to find our own provider record
                // This gives us the accurate 'isActive' status and 'businessName'
                try {
                    const nearbyRes = await api.get("/api/tiffins/nearby?lat=0&lng=0&distance=100000");
                    if (Array.isArray(nearbyRes.data)) {
                        // Match by user ID from localStorage
                        const myProfile = nearbyRes.data.find(p => p.user === userData.id);

                        if (myProfile) {
                            setProfile(myProfile);
                            setIsServiceActive(true); // Found in public 'active' list
                        } else {
                            // If not found in the 'active/approved' list, we are inactive
                            setIsServiceActive(false);
                            // Still try to get profile data from stats if the scraper misses it
                            // (e.g., if newly registered but not approved yet)
                        }
                    }
                } catch (pErr) {
                    console.warn("Status sync via nearby failed:", pErr.message);
                }
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        } finally {
            setLoadingStats(false);
        }
    };

    React.useEffect(() => {
        fetchDashboardStats();
    }, []);

    const toggleServiceStatus = async () => {
        setIsStatusLoading(true);
        try {
            const token = localStorage.getItem("token");
            const endpoint = isServiceActive ? "/api/tiffin/deactivate" : "/api/tiffin/reactivate";
            await api.patch(endpoint, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsServiceActive(!isServiceActive);
            // Refresh counts (meals, subscribers) which might change after pausing/resuming
            await fetchDashboardStats();
        } catch (error) {
            console.error("Failed to toggle service status:", error);
            alert("Failed to update service status. Please try again.");
        } finally {
            setIsStatusLoading(false);
        }
    };

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
                    <Typography variant="h4" className="!text-primary-foreground font-serif tracking-tight">
                        {profile?.businessName || stats?.businessName || "My Kitchen"}
                    </Typography>
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
                            onClick={toggleServiceStatus}
                            disabled={isStatusLoading}
                            className={cn(
                                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50",
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
                                <p className="text-sm font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors">
                                    {profile?.businessName || stats?.businessName || "My Kitchen"}
                                </p>
                                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">{profile?.ownerName || stats?.ownerName || "Chef"}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center border-2 border-[var(--primary)]/20 shadow-sm group-hover:scale-105 transition-transform">
                                <span className="text-[var(--primary)] font-bold">
                                    {(profile?.businessName || stats?.businessName || "K").charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* View Render */}
                <div className="p-10 max-w-7xl mx-auto text-left">
                    <Typography
                        variant="h2"
                        className="mb-8 font-serif !text-[32px] !font-bold"
                    >
                        {activeTab === "Dashboard" ? "TSP Dashboard Overview" : activeTab}
                    </Typography>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === "Dashboard" ? (
                                <DashboardOverview stats={stats} loading={loadingStats} isServiceActive={isServiceActive} />
                            ) : activeTab === "Menu Management" ? (
                                <ProviderMenu />
                            ) : activeTab === "Active Subscriptions" ? (
                                <ActiveSubscriptions />
                            ) : activeTab === "Orders Today" ? (
                                <OrdersToday />
                            ) : activeTab === "Profile Settings" ? (
                                <ProfileSettings
                                    isServiceActive={isServiceActive}
                                    toggleServiceStatus={toggleServiceStatus}
                                    isStatusLoading={isStatusLoading}
                                    profileData={profile || stats} // Fallback to stats if scraper fails
                                />
                            ) : (
                                <ViewPlaceholder title={activeTab} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};
