import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProviderSubscriptions, markMealReady, fetchProviderOrders, updateOrderStatus } from "../store/providerSlice";

export const OrdersToday = () => {
    const dispatch = useDispatch();
    const { subscriptions: allSubs, orders, loading, error } = useSelector((state) => state.provider);
    const [actionLoading, setActionLoading] = useState(null);
    const [activeSection, setActiveSection] = useState("all"); // all, subscription, onetime

    useEffect(() => {
        dispatch(fetchProviderSubscriptions());
        dispatch(fetchProviderOrders());
    }, [dispatch]);

    const handleMarkReady = async (subId) => {
        setActionLoading(subId);
        try {
            await dispatch(markMealReady(subId)).unwrap();
        } catch (err) {
            alert(err || "Failed to mark meal ready");
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        setActionLoading(orderId);
        try {
            await dispatch(updateOrderStatus({ orderId, status })).unwrap();
        } catch (err) {
            alert(err || "Failed to update order status");
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = () => new Date().toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric", year: "numeric" });

    // Filter to active subscriptions that need serving today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const subscriptionMeals = allSubs.filter(sub => {
        if (sub.status !== "active") return false;
        if (sub.lastServedDate) {
            const lastServed = new Date(sub.lastServedDate);
            lastServed.setHours(0, 0, 0, 0);
            return lastServed.getTime() !== today.getTime();
        }
        return true;
    });

    const pendingOrders = orders.filter(o => o.status !== "delivered" && o.status !== "cancelled");

    const lunchSubs = subscriptionMeals.filter(s => s.timeSlot === "lunch");
    const dinnerSubs = subscriptionMeals.filter(s => s.timeSlot === "dinner");

    if (loading && allSubs.length === 0 && orders.length === 0) return (
        <div style={{ padding: 80, textAlign: "center", color: "#8FAE8E", fontWeight: 700 }}>Loading orders...</div>
    );

    return (
        <div style={{ fontFamily: "'Nunito', sans-serif" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h2 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: "inherit", margin: 0 }}>Orders Center</h2>
                    <p style={{ color: "#aaa", fontSize: 13, marginTop: 4 }}>{formatDate()} — {subscriptionMeals.length + pendingOrders.length} tasks pending</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                     <select 
                        value={activeSection} 
                        onChange={(e) => setActiveSection(e.target.value)}
                        style={{ padding: "10px", borderRadius: 12, border: "1px solid #eee", background: "transparent", color: "inherit", fontWeight: 700, fontSize: 13, outline: "none" }}
                    >
                        <option value="all">All Items</option>
                        <option value="subscription">Subscriptions Only</option>
                        <option value="onetime">One-time Orders</option>
                    </select>
                    <button onClick={() => { dispatch(fetchProviderSubscriptions()); dispatch(fetchProviderOrders()); }}
                        style={{ padding: "10px 18px", borderRadius: 12, border: "1px solid #eee", background: "transparent", color: "inherit", fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
                {[
                    { label: "Pending Orders", val: pendingOrders.length, icon: "🛍️", bg: "#e3f2fd", color: "#1565c0" },
                    { label: "Sub Meals Today", val: subscriptionMeals.length, icon: "🍱", bg: "#e8f5e9", color: "#2e7d32" },
                    { label: "Lunch", val: lunchSubs.length, icon: "🌞", bg: "#fff8e1", color: "#e65100" },
                    { label: "Dinner", val: dinnerSubs.length, icon: "🌙", bg: "#ede7f6", color: "#4527a0" },
                ].map((s, i) => (
                    <div key={i} style={{ background: s.bg, borderRadius: 18, padding: "20px 18px" }}>
                        <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: s.color, textTransform: "uppercase", letterSpacing: 1.5 }}>{s.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'Lora', serif" }}>{s.val}</div>
                    </div>
                ))}
            </div>

            {/* Error */}
            {error && (
                <div style={{ background: "#fff8e1", color: "#e65100", padding: "12px 18px", borderRadius: 12, marginBottom: 20, fontSize: 13, fontWeight: 700, border: "1px solid #ffe0b2" }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Orders List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                
                {/* ONE-TIME ORDERS SECTION */}
                {(activeSection === "all" || activeSection === "onetime") && pendingOrders.length > 0 && (
                    <>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 10, marginBottom: 4 }}>Direct Orders ({pendingOrders.length})</h3>
                        {pendingOrders.map(order => (
                            <div key={order._id} style={{
                                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, background: "rgba(255,255,255,0.05)", overflow: "hidden",
                                borderLeft: `6px solid #6366f1`
                            }}>
                                <div style={{ display: "flex", alignItems: "center", padding: "20px 24px", gap: 20, flexWrap: "wrap" }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "#6366f115", color: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📦</div>
                                    <div style={{ flex: 1, minWidth: 150 }}>
                                        <div style={{ fontWeight: 800, fontSize: 15 }}>{order.user?.name || "Customer"}</div>
                                        <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>ORD-{order._id.slice(-6).toUpperCase()} &bull; {order.items?.length || 0} items</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontWeight: 800, fontSize: 16 }}>₹{order.totalPrice}</div>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: order.paymentStatus === "paid" ? "#2e7d32" : "#e65100", textTransform: "uppercase" }}>{order.paymentStatus}</div>
                                    </div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        {['preparing', 'ready', 'delivered'].includes(order.status) ? (
                                             <select 
                                                value={order.status}
                                                onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                                disabled={actionLoading === order._id}
                                                style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #eee", fontSize: 12, fontWeight: 700, background: "transparent", color: "inherit", outline: "none" }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="preparing">Preparing</option>
                                                <option value="ready">Ready</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        ) : (
                                            <span style={{ padding: "6px 14px", borderRadius: 100, fontSize: 11, fontWeight: 800, background: "#f5f5f5", color: "#666", textTransform: "uppercase" }}>{order.status}</span>
                                        )}
                                        {order.status === 'pending' && <button onClick={() => handleUpdateStatus(order._id, 'preparing')} style={{ background: "#8FAE8E", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 10, fontWeight: 800, fontSize: 11, cursor: "pointer" }}>Accept Order</button>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* SUBSCRIPTION MEALS SECTION */}
                {(activeSection === "all" || activeSection === "subscription") && subscriptionMeals.length > 0 && (
                    <>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 10, marginBottom: 4 }}>Today's Subscription Tiffins ({subscriptionMeals.length})</h3>
                        {subscriptionMeals.map(sub => {
                            const isLoading = actionLoading === sub._id;
                            const isLunch = sub.timeSlot === "lunch";

                            return (
                                <div key={sub._id} style={{
                                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, background: "rgba(255,255,255,0.03)", overflow: "hidden",
                                    borderLeft: `4px solid ${isLunch ? "#f59e0b" : "#4527a0"}`
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", padding: "18px 24px", gap: 16, flexWrap: "wrap" }}>
                                        <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#f0f4f0", border: "2px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#8FAE8E", fontSize: 16, flexShrink: 0 }}>
                                            {(sub.user?.name || "?").charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 120 }}>
                                            <div style={{ fontWeight: 800, fontSize: 14 }}>{sub.user?.name || "Unknown"}</div>
                                            <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{sub.user?.phone || ""}</div>
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: isLunch ? "#f59e0b" : "#6366f1", background: isLunch ? "#fff8e1" : "#eef2ff", padding: "4px 12px", borderRadius: 100 }}>
                                            {isLunch ? "🌞 Lunch" : "🌙 Dinner"}
                                        </span>
                                        <span style={{ fontSize: 12, fontWeight: 700 }}>{sub.remainingMeals ?? 0} left</span>
                                        <button
                                            onClick={() => handleMarkReady(sub._id)}
                                            disabled={isLoading}
                                            style={{
                                                padding: "10px 20px", borderRadius: 12, border: "none",
                                                background: "linear-gradient(135deg, #8FAE8E, #5a7a50)", color: "#fff",
                                                fontWeight: 800, fontSize: 12, cursor: isLoading ? "not-allowed" : "pointer",
                                                boxShadow: "0 4px 14px rgba(90,122,80,0.3)", whiteSpace: "nowrap",
                                            }}>
                                            {isLoading ? "⏳ ..." : "✅ Mark Ready"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}

                {subscriptionMeals.length === 0 && pendingOrders.length === 0 && (
                    <div style={{ padding: "80px 0", textAlign: "center" }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🍱</div>
                        <p style={{ color: "#ccc", fontSize: 16, fontStyle: "italic" }}>All caught up! No pending tasks for now.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
