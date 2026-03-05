import React, { useState, useEffect } from "react";
import {
    Search,
    Filter,
    Eye,
    Pause,
    XCircle,
    Clock,
    Calendar,
    Phone,
    MapPin,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Play,
    RefreshCw
} from "lucide-react";
import { Typography } from "./ui/Typography";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import api from "../services/api";

// Demo fallback data (used when backend is unavailable)
const DEMO_SUBSCRIPTIONS = [
    {
        _id: "demo-sub-101",
        user: { name: "Aditi Sharma", email: "aditi@example.com" },
        planType: "monthly",
        timeSlot: "lunch",
        startDate: "2026-02-01T00:00:00Z",
        endDate: "2026-03-01T00:00:00Z",
        status: "active",
        remainingMeals: 42,
        totalPrice: 4500,
        amountPaid: 4500,
        paymentStatus: "paid",
    },
    {
        _id: "demo-sub-102",
        user: { name: "Rahul Verma", email: "rahul@example.com" },
        planType: "weekly",
        timeSlot: "dinner",
        startDate: "2026-02-12T00:00:00Z",
        endDate: "2026-02-19T00:00:00Z",
        status: "paused",
        remainingMeals: 4,
        totalPrice: 1050,
        amountPaid: 1050,
        paymentStatus: "paid",
    },
    {
        _id: "demo-sub-103",
        user: { name: "Priya Das", email: "priya@example.com" },
        planType: "monthly",
        timeSlot: "lunch",
        startDate: "2026-01-15T00:00:00Z",
        endDate: "2026-02-15T00:00:00Z",
        status: "active",
        remainingMeals: 2,
        totalPrice: 4500,
        amountPaid: 4500,
        paymentStatus: "paid",
    }
];

export const ActiveSubscriptions = () => {
    const [selectedSub, setSelectedSub] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    const token = localStorage.getItem("token");

    const fetchDashboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/api/subscriptions/provider/dashboard", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data?.success) {
                const data = res.data.data;
                setDashboardStats({
                    todaysMeals: data.todaysMeals,
                    lunchCount: data.lunchCount,
                    dinnerCount: data.dinnerCount,
                    activeSubscribers: data.activeSubscribers,
                    monthlyRevenue: data.monthlyRevenue,
                });
                setSubscriptions(data.recentActivity || []);
            }
        } catch (err) {
            console.warn("Backend unavailable, using demo data:", err.message);
            setError("Using demo data — backend is offline.");
            setSubscriptions(DEMO_SUBSCRIPTIONS);
            setDashboardStats({
                todaysMeals: 42,
                lunchCount: 28,
                dinnerCount: 14,
                activeSubscribers: 3,
                monthlyRevenue: 10050,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handlePause = async (subId) => {
        setActionLoading(subId);
        try {
            const today = new Date();
            const pauseEnd = new Date();
            pauseEnd.setDate(today.getDate() + 3);

            await api.patch(`/api/subscriptions/${subId}/pause`, {
                pauseStart: today.toISOString(),
                pauseEnd: pauseEnd.toISOString(),
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await fetchDashboard();
            setSelectedSub(null);
        } catch (err) {
            console.error("Pause failed:", err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleResume = async (subId) => {
        setActionLoading(subId);
        try {
            await api.patch(`/api/subscriptions/${subId}/resume`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchDashboard();
            setSelectedSub(null);
        } catch (err) {
            console.error("Resume failed:", err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancel = async (subId) => {
        setActionLoading(subId);
        try {
            await api.patch(`/api/subscriptions/${subId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchDashboard();
            setSelectedSub(null);
        } catch (err) {
            console.error("Cancel failed:", err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleMarkMealReady = async (subId) => {
        setActionLoading(subId);
        try {
            await api.patch(`/api/subscriptions/${subId}/mark-meal-ready`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchDashboard();
        } catch (err) {
            console.error("Mark meal ready failed:", err.message);
        } finally {
            setActionLoading(null);
        }
    };

    // Helpers
    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            month: "short", day: "numeric", year: "numeric"
        });
    };

    const getPlanLabel = (planType) => {
        const labels = { weekly: "Weekly", monthly: "Monthly", yearly: "Yearly" };
        return labels[planType] || planType;
    };

    const getSlotLabel = (slot) => {
        return slot ? slot.charAt(0).toUpperCase() + slot.slice(1) : "—";
    };

    const getTotalMeals = (sub) => {
        if (sub.planType === "weekly") return 7;
        if (sub.planType === "monthly") return 30;
        if (sub.planType === "yearly") return 365;
        return sub.remainingMeals || 0;
    };

    const getDaysRemaining = (endDate) => {
        if (!endDate) return 0;
        const diff = new Date(endDate) - new Date();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const filteredSubs = subscriptions.filter(sub =>
        (sub.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub._id || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
                <Typography className="ml-4 text-gray-500">Loading subscriptions...</Typography>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Row */}
            {dashboardStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Active Subscribers", value: dashboardStats.activeSubscribers, color: "text-green-600", bg: "bg-green-50" },
                        { label: "Today's Meals", value: dashboardStats.todaysMeals, color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Lunch Orders", value: dashboardStats.lunchCount, color: "text-amber-600", bg: "bg-amber-50" },
                        { label: "Dinner Orders", value: dashboardStats.dinnerCount, color: "text-purple-600", bg: "bg-purple-50" },
                    ].map((stat, i) => (
                        <Card key={i} className="border-none shadow-sm">
                            <CardContent className="p-5">
                                <Typography variant="small" className="text-gray-400 uppercase font-bold tracking-widest">{stat.label}</Typography>
                                <Typography className={cn("text-2xl font-bold mt-1", stat.color)}>{stat.value}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Typography variant="h2" className="font-serif">Active Subscriptions</Typography>
                    <Typography className="text-gray-500">View and manage your current customer plans.</Typography>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            className="pl-10 w-64 h-11"
                            placeholder="Search customers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-11" onClick={fetchDashboard}>
                        <RefreshCw size={18} className="mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-amber-50 text-amber-800 px-6 py-3 rounded-xl border border-amber-200 text-sm font-medium flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {/* Table */}
            <Card className="border-none shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Plan</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Slot</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Timeline</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Meals Left</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredSubs.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-16 text-center">
                                        <Typography className="text-gray-400 italic">No subscriptions found.</Typography>
                                    </td>
                                </tr>
                            ) : filteredSubs.map((sub) => {
                                const totalMeals = getTotalMeals(sub);
                                const remaining = sub.remainingMeals ?? 0;
                                const subId = `SUB-${(sub._id || "").slice(-6).toUpperCase()}`;

                                return (
                                    <tr key={sub._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-[var(--primary)]/10 flex items-center justify-center">
                                                    <span className="text-[var(--primary)] font-bold text-sm">
                                                        {(sub.user?.name || "?").charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <Typography className="font-bold text-sm leading-none mb-1">{sub.user?.name || "Unknown"}</Typography>
                                                    <Typography variant="small" className="text-xs text-gray-400">{subId}</Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={cn(
                                                "text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-sm",
                                                sub.planType === "monthly" ? "bg-purple-100 text-purple-700"
                                                    : sub.planType === "yearly" ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-blue-100 text-blue-700"
                                            )}>
                                                {getPlanLabel(sub.planType)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <Clock size={14} className="text-gray-400" />
                                                <Typography className="text-sm font-medium">{getSlotLabel(sub.timeSlot)}</Typography>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <Typography className="text-xs font-bold">{formatDate(sub.startDate)}</Typography>
                                                <Typography variant="small" className="text-[10px] text-gray-400 uppercase">to {formatDate(sub.endDate)}</Typography>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                sub.status === "active" ? "bg-green-100 text-green-700"
                                                    : sub.status === "paused" ? "bg-amber-100 text-amber-700"
                                                        : sub.status === "cancelled" ? "bg-red-100 text-red-700"
                                                            : "bg-gray-100 text-gray-700"
                                            )}>
                                                <div className={cn("w-1.5 h-1.5 rounded-full",
                                                    sub.status === "active" ? "bg-green-600"
                                                        : sub.status === "paused" ? "bg-amber-600"
                                                            : sub.status === "cancelled" ? "bg-red-600"
                                                                : "bg-gray-600"
                                                )} />
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="w-32 space-y-2">
                                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                    <span>{remaining} / {totalMeals}</span>
                                                    <span>{totalMeals > 0 ? Math.round((remaining / totalMeals) * 100) : 0}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-1000",
                                                            totalMeals > 0 && (remaining / totalMeals) < 0.2 ? "bg-red-500" : "bg-[var(--primary)]"
                                                        )}
                                                        style={{ width: `${totalMeals > 0 ? (remaining / totalMeals) * 100 : 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => setSelectedSub(sub)}
                                                className="p-2 text-gray-400 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-all"
                                            >
                                                <Eye size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedSub && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSub(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#F8FAF8] w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
                        >
                            {/* Left Panel */}
                            <div className="w-full md:w-80 bg-white p-8 border-r border-gray-100 space-y-8 shrink-0">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-gray-50 shadow-md mb-4 bg-[var(--primary)]/10 flex items-center justify-center">
                                        <span className="text-[var(--primary)] font-bold text-3xl">
                                            {(selectedSub.user?.name || "?").charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <Typography variant="h4" className="font-serif">{selectedSub.user?.name || "Unknown"}</Typography>
                                    <Typography variant="small" className="text-gray-400">SUB-{(selectedSub._id || "").slice(-6).toUpperCase()}</Typography>
                                </div>

                                <div className="space-y-6">
                                    {selectedSub.user?.email && (
                                        <div className="flex gap-4 items-start">
                                            <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
                                                <Phone size={18} />
                                            </div>
                                            <div>
                                                <Typography variant="small" className="font-bold text-gray-500 uppercase tracking-widest">Email</Typography>
                                                <Typography className="text-sm font-medium">{selectedSub.user.email}</Typography>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex gap-4 items-start">
                                        <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <Typography variant="small" className="font-bold text-gray-500 uppercase tracking-widest">Payment</Typography>
                                            <Typography className="text-sm font-medium">
                                                ₹{selectedSub.amountPaid || 0} / ₹{selectedSub.totalPrice || 0}
                                                <span className={cn("ml-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                                                    selectedSub.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                                )}>
                                                    {selectedSub.paymentStatus || "pending"}
                                                </span>
                                            </Typography>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 space-y-3">
                                    {selectedSub.status === "active" && (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="w-full border-gray-200"
                                                onClick={() => handlePause(selectedSub._id)}
                                                disabled={actionLoading === selectedSub._id}
                                            >
                                                {actionLoading === selectedSub._id ? (
                                                    <Loader2 size={18} className="mr-2 animate-spin" />
                                                ) : (
                                                    <Pause size={18} className="mr-2" />
                                                )}
                                                Pause Plan
                                            </Button>
                                            <Button
                                                variant="primary"
                                                className="w-full"
                                                onClick={() => handleMarkMealReady(selectedSub._id)}
                                                disabled={actionLoading === selectedSub._id}
                                            >
                                                {actionLoading === selectedSub._id ? (
                                                    <Loader2 size={18} className="mr-2 animate-spin" />
                                                ) : (
                                                    <CheckCircle2 size={18} className="mr-2" />
                                                )}
                                                Mark Meal Ready
                                            </Button>
                                        </>
                                    )}
                                    {selectedSub.status === "paused" && (
                                        <Button
                                            variant="outline"
                                            className="w-full border-green-200 text-green-700 hover:bg-green-50"
                                            onClick={() => handleResume(selectedSub._id)}
                                            disabled={actionLoading === selectedSub._id}
                                        >
                                            {actionLoading === selectedSub._id ? (
                                                <Loader2 size={18} className="mr-2 animate-spin" />
                                            ) : (
                                                <Play size={18} className="mr-2" />
                                            )}
                                            Resume Plan
                                        </Button>
                                    )}
                                    {(selectedSub.status === "active" || selectedSub.status === "paused") && (
                                        <Button
                                            variant="ghost"
                                            className="w-full text-red-500 hover:bg-red-50"
                                            onClick={() => handleCancel(selectedSub._id)}
                                            disabled={actionLoading === selectedSub._id}
                                        >
                                            <XCircle size={18} className="mr-2" />
                                            Cancel Subscription
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Right Panel */}
                            <div className="flex-1 p-10 overflow-y-auto max-h-[80vh] scrollbar-hide">
                                <div className="flex justify-between items-center mb-10">
                                    <Typography variant="h3" className="font-serif">Subscription Details</Typography>
                                    <button onClick={() => setSelectedSub(null)} className="p-2 hover:bg-white rounded-full transition-colors border border-gray-100 shadow-sm">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-6 mb-10">
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
                                        <Typography variant="small" className="text-gray-400 uppercase font-bold tracking-widest mb-1">Plan Type</Typography>
                                        <Typography className="text-xl font-bold text-[var(--primary)]">{getPlanLabel(selectedSub.planType)}</Typography>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
                                        <Typography variant="small" className="text-gray-400 uppercase font-bold tracking-widest mb-1">Time Slot</Typography>
                                        <Typography className="text-xl font-bold text-blue-600">{getSlotLabel(selectedSub.timeSlot)}</Typography>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
                                        <Typography variant="small" className="text-gray-400 uppercase font-bold tracking-widest mb-1">Days Left</Typography>
                                        <Typography className="text-xl font-bold text-amber-600">{getDaysRemaining(selectedSub.endDate)}</Typography>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div>
                                        <Typography variant="h4" className="font-serif mb-6">Delivery Timeline</Typography>
                                        <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm">
                                            <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-50">
                                                <div className="flex gap-4">
                                                    <div className="p-3 bg-green-50 rounded-2xl text-green-600">
                                                        <Calendar size={24} />
                                                    </div>
                                                    <div>
                                                        <Typography className="font-bold">End Date</Typography>
                                                        <Typography variant="small" className="text-gray-400">{formatDate(selectedSub.endDate)}</Typography>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Typography className="text-xs font-bold text-gray-400 uppercase">Total Amount</Typography>
                                                    <Typography className="text-xl font-bold text-[var(--accent)]">₹{selectedSub.totalPrice || 0}</Typography>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20">
                                                        <CheckCircle2 size={20} />
                                                    </div>
                                                    <div className="flex-1 border-b border-dashed border-gray-100 pb-4">
                                                        <Typography className="font-bold text-sm">Meals Remaining</Typography>
                                                        <Typography variant="small" className="text-green-600 font-bold">
                                                            {selectedSub.remainingMeals ?? 0} out of {getTotalMeals(selectedSub)} meals left
                                                        </Typography>
                                                    </div>
                                                </div>

                                                {selectedSub.lastServedDate && (
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border-2 border-white shadow-sm">
                                                            <div className="w-3 h-3 bg-gray-300 rounded-full" />
                                                        </div>
                                                        <div className="flex-1 border-b border-dashed border-gray-100 pb-4">
                                                            <Typography className="font-bold text-sm">Last Served</Typography>
                                                            <Typography variant="small" className="text-gray-400">{formatDate(selectedSub.lastServedDate)}</Typography>
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedSub.pauseStart && selectedSub.pauseEnd && (
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 border-2 border-white shadow-sm">
                                                            <Pause size={18} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <Typography className="font-bold text-sm">
                                                                Paused: {formatDate(selectedSub.pauseStart)} — {formatDate(selectedSub.pauseEnd)}
                                                            </Typography>
                                                            <Typography variant="small" className="text-amber-600 font-bold">Pause period</Typography>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
