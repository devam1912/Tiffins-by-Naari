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
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import {
    fetchProviderDashboard,
    toggleProviderService,
    setProviderProfile,
    setServiceActive
} from "../../store/providerSlice";
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
        <div className="space-y-10">
            <header className="mb-8">
                <h2 className="admin-title">TSP Dashboard Overview</h2>
                <p className="admin-subtitle m-0">Quick stats and recent activity.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsConfig.map((stat, i) => (
                    <div key={i} className="stat-card p-6 flex flex-col group min-h-[140px] justify-between">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-white/60 rounded-2xl flex items-center justify-center text-[#5a7a50] shadow-sm group-hover:scale-110 transition-transform">
                                <stat.icon size={22} className={stat.color} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-white/60 px-3 py-1 rounded-full text-[#8FA873] shadow-sm">
                                {stat.trend}
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-[#5a7a50] font-bold text-xs uppercase tracking-wider m-0 mb-1">{stat.label}</p>
                            <h3 className="text-[#2d3b2d] text-2xl font-black m-0" style={{ fontFamily: "Lora, serif" }}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 table-container h-full flex flex-col">
                    <div className="p-6 border-b border-[rgba(143,174,142,0.2)]">
                        <h3 className="text-xl font-serif font-bold text-[#2d3b2d] m-0">Recent Subscriptions</h3>
                    </div>
                    <div className="p-0 flex-1 overflow-x-auto">
                        {loading ? (
                            <div className="h-64 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-[#8FA873]/30 border-t-[#8FA873] rounded-full animate-spin" />
                            </div>
                        ) : !stats?.recentActivity || stats.recentActivity.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-[#888] italic">
                                <Users size={40} className="mb-4 opacity-20 text-[#8FA873]" />
                                <p className="m-0 font-bold uppercase tracking-widest text-[#888] text-xs">No recent subscription activity</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="table-header">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-[#5a7a50] uppercase tracking-widest">Customer</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-[#5a7a50] uppercase tracking-widest">Plan</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-[#5a7a50] uppercase tracking-widest">Amount</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-[#5a7a50] uppercase tracking-widest">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[rgba(143,174,142,0.1)]">
                                    {stats.recentActivity.map((activity, idx) => (
                                        <tr key={idx} className="table-row">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-[#2d3b2d] m-0">{activity.user?.name || "Customer"}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-black px-3 py-1 bg-[#8FAE8E]/20 text-[#5a7a50] border border-[#8FAE8E]/30 rounded-full capitalize">
                                                    {activity.planType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-black text-[#6b8a5e]">₹{activity.amountPaid}</td>
                                            <td className="px-6 py-4 text-sm text-[#888] font-bold">
                                                {new Date(activity.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div className="stat-card h-full flex flex-col">
                    <div className="p-6 border-b border-[rgba(143,174,142,0.2)]">
                        <h3 className="text-xl font-serif font-bold text-[#2d3b2d] m-0">Quick Stats</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/60 rounded-lg flex items-center justify-center text-[#f59e0b] shadow-inner">
                                        <Clock size={16} />
                                    </div>
                                    <span className="text-sm font-bold text-[#2d3b2d]">Lunch Deliveries</span>
                                </div>
                                <span className="text-sm font-black text-[#2d3b2d]">{stats?.lunchCount || 0}</span>
                            </div>
                            <div className="w-full bg-[#E7E6B6] h-2 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="bg-[#f59e0b] h-full transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                    style={{ width: `${(stats?.todaysMeals > 0 ? (stats.lunchCount / stats.todaysMeals) * 100 : 0) || 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/60 rounded-lg flex items-center justify-center text-[#3b82f6] shadow-inner">
                                        <Clock size={16} />
                                    </div>
                                    <span className="text-sm font-bold text-[#2d3b2d]">Dinner Deliveries</span>
                                </div>
                                <span className="text-sm font-black text-[#2d3b2d]">{stats?.dinnerCount || 0}</span>
                            </div>
                            <div className="w-full bg-[#E7E6B6] h-2 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="bg-[#3b82f6] h-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    style={{ width: `${(stats?.todaysMeals > 0 ? (stats.dinnerCount / stats.todaysMeals) * 100 : 0) || 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-[rgba(143,174,142,0.2)]">
                            <div className="bg-[#8FAE8E]/10 p-5 rounded-2xl border-[1.5px] border-[#8FAE8E]/30 backdrop-blur-sm">
                                <div className="flex items-center gap-2 text-[#5a7a50] mb-2">
                                    <TrendingUp size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Efficiency Tip</span>
                                </div>
                                <p className="text-xs text-[#2d3b2d] leading-relaxed font-bold m-0">
                                    {stats?.lunchCount > stats?.dinnerCount
                                        ? "Lunch hours are your peak. Consider prepping side dishes earlier."
                                        : "Dinner demand is rising. Ensure your evening staff is ready."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
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

export const ProviderDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Dashboard");

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const {
        stats,
        profile,
        isServiceActive,
        loading: loadingStats,
        statusLoading: isStatusLoading
    } = useSelector((state) => state.provider);

    const user = useSelector((state) => state.auth.user);

    const syncProfileStatus = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            const nearbyRes = await api.get("/api/tiffins/nearby?lat=0&lng=0&distance=100000");
            if (Array.isArray(nearbyRes.data)) {
                const userId = userData._id || userData.id;
                const myProfile = nearbyRes.data.find(p => p.user === userId);
                if (myProfile) {
                    dispatch(setProviderProfile(myProfile));
                    dispatch(setServiceActive(true));
                } else {
                    dispatch(setServiceActive(false));
                }
            }
        } catch (pErr) {
            console.warn("Status sync via nearby failed:", pErr.message);
        }
    };

    React.useEffect(() => {
        dispatch(fetchProviderDashboard());
        syncProfileStatus();
    }, [dispatch]);

    const handleToggleService = () => {
        dispatch(toggleProviderService(isServiceActive));
    };

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Menu Management", icon: UtensilsCrossed },
        { name: "Active Subscriptions", icon: Users },
        { name: "Orders Today", icon: ShoppingBag },
        { name: "Profile Settings", icon: Settings },
    ];

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito',sans-serif" }}>
            <style>{`
                *, *::before, *::after { box-sizing: border-box; }
                .provider-sidebar { background: linear-gradient(160deg,#8FA873,#6b8a5e); position: sticky; top: 0; min-height: 100vh; overflow-y: auto; z-index: 50; }
                .provider-sidebar::-webkit-scrollbar { width: 4px; }
                .provider-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }
                .provider-main { flex: 1; padding: 40px; overflow-y: auto; max-height: 100vh; position: relative; }
                .provider-main::-webkit-scrollbar { width: 5px; }
                .provider-main::-webkit-scrollbar-track { background: transparent; }
                .provider-main::-webkit-scrollbar-thumb { background: #8FAE8E; border-radius: 10px; }
                .nav-item { transition: all 0.3s cubic-bezier(.22,.68,0,1.2); }
                .nav-item.active { background: rgba(255,255,255,0.92); color: #2d3b2d !important; box-shadow: 0 8px 24px rgba(90,120,70,0.2) !important; transform: scale(1.03); }
                .nav-item.active * { color: #8FA873 !important; }
                .stat-card { background: rgba(255,255,255,0.85); backdrop-filter: blur(16px); border: 1.5px solid rgba(143,174,142,0.2); border-radius: 28px; box-shadow: 0 4px 24px rgba(90,120,70,0.08); transition: all 0.3s cubic-bezier(.22,.68,0,1.2); }
                .stat-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(90,120,70,0.18); border-color: rgba(143,174,142,0.45); }
                .admin-title { font-family: 'Lora', serif; color: #2d3b2d; font-size: 32px; font-weight: 700; line-height: 1.1; margin-bottom: 8px; }
                .admin-subtitle { color: #5a7a50; font-size: 14px; font-weight: 600; }
                .table-container { background: rgba(255,255,255,0.85); backdrop-filter: blur(16px); border: 1.5px solid rgba(143,174,142,0.2); border-radius: 32px; box-shadow: 0 12px 36px rgba(90,120,70,0.1); overflow: hidden; }
                .table-header { background: rgba(143,174,142,0.1); border-bottom: 1.5px solid rgba(143,174,142,0.2); }
                .table-header th { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #5a7a50; padding: 20px 24px; }
                .table-row { border-bottom: 1px solid rgba(143,174,142,0.1); transition: background 0.2s; }
                .table-row:hover { background: rgba(255,255,255,0.95); }
                .table-cell { padding: 20px 24px; color: #2d3b2d; font-size: 14px; font-weight: 600; }
                @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            `}</style>
            <div style={{ position: "fixed", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(143,168,115,0.12) 0%, transparent 70%)", top: "-100px", right: "-80px", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", width: 300, height: 300, borderRadius: "50%", border: "1.5px dashed rgba(143,174,142,0.2)", bottom: "10%", left: "25%", pointerEvents: "none", animation: "spinSlow 45s linear infinite", zIndex: 0 }} />

            {/* Sidebar */}
            <aside className="w-72 provider-sidebar text-white flex flex-col shadow-2xl">
                <div className="p-8 pb-12 relative overflow-hidden">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-[0_4px_16px_rgba(143,174,142,0.2)] flex items-center justify-center mb-4">
                        <UtensilsCrossed className="text-[#8FA873] w-6 h-6" />
                    </div>
                    <h1 style={{ fontFamily: "'Lora',serif", fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
                        {profile?.businessName || stats?.businessName || "My Kitchen"}
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={cn(
                                "nav-item w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-[13px] tracking-wide",
                                activeTab === item.name
                                    ? "active"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <item.icon size={18} className="transition-transform group-hover:scale-110" />
                            {item.name}
                        </button>
                    ))}
                </nav>

                <div className="p-6">
                    <div className="flex items-center justify-between px-6 py-4 bg-white/10 rounded-2xl mb-4 text-white">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Service Status</span>
                            <span className="text-sm font-semibold">{isServiceActive ? "Active" : "Paused"}</span>
                        </div>
                        <button
                            onClick={handleToggleService}
                            disabled={isStatusLoading}
                            className={cn(
                                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50",
                                isServiceActive ? "bg-[#f59e0b]" : "bg-white/20"
                            )}
                        >
                            <span className={cn(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                                isServiceActive ? "translate-x-5" : "translate-x-0"
                            )} />
                        </button>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 text-white/70 hover:text-white hover:bg-red-500/20 rounded-2xl px-6 py-4 transition-all font-bold text-[13px]"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="provider-main z-10 w-full overflow-hidden">
                <div className="max-w-7xl mx-auto relative animate-in fade-in slide-in-from-bottom-4 duration-700">

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
                                    toggleServiceStatus={handleToggleService}
                                    isStatusLoading={isStatusLoading}
                                    profileData={profile || stats}
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
