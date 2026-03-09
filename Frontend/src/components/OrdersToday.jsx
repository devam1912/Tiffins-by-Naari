import React, { useState, useEffect } from "react";
import {
    ShoppingBag,
    MapPin,
    Clock,
    User,
    CheckCircle2,
    Clock3,
    AlertCircle,
    Loader2,
    RefreshCw,
    Phone,
    XCircle
} from "lucide-react";
import { Typography } from "./ui/Typography";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";
import api from "../services/api";

// Demo data removed - syncing purely with backend
const DEMO_ORDERS = [];

export const OrdersToday = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    const token = localStorage.getItem("token");

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/api/orders/tsp", {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Filter to today's orders only
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const todayOrders = (res.data || []).filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= today && orderDate < tomorrow;
            });

            setOrders(todayOrders);
        } catch (err) {
            console.error("Orders sync failed:", err.message);
            setError("Unable to sync live orders. Please check your connection.");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        setActionLoading(orderId);
        try {
            await api.patch(`/api/orders/tsp/${orderId}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchOrders();
        } catch (err) {
            console.error("Status update failed:", err.message);
        } finally {
            setActionLoading(null);
        }
    };

    // Helpers
    const getStatusColor = (status) => {
        switch (status) {
            case "completed": return "bg-green-50 text-green-700 border-green-100";
            case "ready": return "bg-blue-50 text-blue-700 border-blue-100";
            case "preparing": return "bg-amber-50 text-amber-700 border-amber-100";
            case "confirmed": return "bg-purple-50 text-purple-700 border-purple-100";
            case "cancelled": return "bg-red-50 text-red-700 border-red-100";
            case "pending": return "bg-gray-50 text-gray-700 border-gray-100";
            default: return "bg-gray-50 text-gray-700 border-gray-100";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed": return <CheckCircle2 size={14} />;
            case "ready": return <ShoppingBag size={14} />;
            case "preparing": return <Clock3 size={14} />;
            case "cancelled": return <XCircle size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: "Pending",
            confirmed: "Confirmed",
            preparing: "Preparing",
            ready: "Ready for Pickup",
            completed: "Picked Up",
            cancelled: "Cancelled",
        };
        return labels[status] || status;
    };

    const formatOrderId = (id) => `ORD-${(id || "").slice(-6).toUpperCase()}`;

    const getSlotLabel = (slot) => slot ? slot.charAt(0).toUpperCase() + slot.slice(1) : "—";

    const formatDate = () => {
        return new Date().toLocaleDateString("en-IN", {
            month: "short", day: "numeric", year: "numeric"
        });
    };

    const completedCount = orders.filter(o => o.status === "completed").length;
    const readyCount = orders.filter(o => o.status === "ready").length;
    const preparingCount = orders.filter(o => o.status === "preparing").length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
                <Typography className="ml-4 text-gray-500">Loading today's orders...</Typography>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header + Stats */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                    <Typography
                        variant="h2"
                        className="font-serif !text-[32px] !font-bold"
                    >
                        Orders Today
                    </Typography>
                    <Typography variant="small" className="text-gray-500">
                        Managing {orders.length} deliveries for {formatDate()}
                    </Typography>
                </div>
                <div className="flex gap-4 flex-wrap">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</p>
                            <p className="text-xl font-bold">{orders.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                            <Clock3 size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Preparing</p>
                            <p className="text-xl font-bold">{preparingCount}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed</p>
                            <p className="text-xl font-bold">{completedCount}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="h-auto py-3" onClick={fetchOrders}>
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

            {/* Orders List */}
            {orders.length === 0 ? (
                <div className="py-20 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                    <ShoppingBag size={40} className="mx-auto text-gray-300 mb-4" />
                    <Typography className="text-gray-400 text-sm italic">No orders for today yet.</Typography>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {orders.map((order) => (
                        <Card key={order._id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    {/* Colored accent bar */}
                                    <div className={cn(
                                        "md:w-2 w-full h-2 md:h-auto shrink-0",
                                        order.timeSlot === "lunch" ? "bg-[var(--primary)]" : "bg-[var(--accent)]"
                                    )} />

                                    <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        {/* Order info */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                    {formatOrderId(order._id)}
                                                </span>
                                                <div className={cn(
                                                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize",
                                                    getStatusColor(order.status)
                                                )}>
                                                    {getStatusIcon(order.status)}
                                                    {getStatusLabel(order.status)}
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                                                    order.paymentStatus === "paid" ? "bg-green-100 text-green-700"
                                                        : order.paymentStatus === "partial" ? "bg-amber-100 text-amber-700"
                                                            : "bg-gray-100 text-gray-500"
                                                )}>
                                                    {order.paymentStatus || "pending"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <Typography className="font-bold">{order.user?.name || "Unknown"}</Typography>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                                        Veg • {(order.items || []).map(i => i.name).join(", ") || "—"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Slot & contact info */}
                                        <div className="flex flex-col md:items-end gap-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Clock size={16} className="text-gray-400" />
                                                <span className="font-medium">{getSlotLabel(order.timeSlot)} Slot</span>
                                                <span className="text-gray-300">|</span>
                                                <span className="font-bold text-[var(--primary)]">₹{order.totalPrice || 0}</span>
                                            </div>
                                            {order.user?.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone size={16} className="text-gray-400" />
                                                    <span>{order.user.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex gap-2 shrink-0">
                                            {(order.status === "confirmed" || order.status === "pending") && (
                                                <Button
                                                    size="sm"
                                                    className="h-9"
                                                    onClick={() => handleStatusUpdate(order._id, "preparing")}
                                                    disabled={actionLoading === order._id}
                                                >
                                                    {actionLoading === order._id ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
                                                    Start Preparing
                                                </Button>
                                            )}
                                            {order.status === "preparing" && (
                                                <Button
                                                    size="sm"
                                                    className="h-9"
                                                    onClick={() => handleStatusUpdate(order._id, "ready")}
                                                    disabled={actionLoading === order._id}
                                                >
                                                    {actionLoading === order._id ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
                                                    Mark Ready
                                                </Button>
                                            )}
                                            {order.status === "ready" && (
                                                <Button
                                                    size="sm"
                                                    className="h-9"
                                                    onClick={() => handleStatusUpdate(order._id, "completed")}
                                                    disabled={actionLoading === order._id}
                                                >
                                                    {actionLoading === order._id ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
                                                    Mark Picked Up
                                                </Button>
                                            )}
                                            {order.status !== "completed" && order.status !== "cancelled" && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-9 text-red-500 hover:bg-red-50"
                                                    onClick={() => handleStatusUpdate(order._id, "cancelled")}
                                                    disabled={actionLoading === order._id}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
