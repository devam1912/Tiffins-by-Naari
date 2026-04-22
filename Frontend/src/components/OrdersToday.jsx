import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProviderSubscriptions, markMealReady, fetchProviderOrders, updateOrderStatus } from "../store/providerSlice";
import { X, ChevronRight, Info, Trash2, CheckCircle2, Clock, Package, Phone, User, ExternalLink } from "lucide-react";
import { useDialog } from "../context/DialogContext";

export const OrdersToday = ({ theme }) => {
    const dispatch = useDispatch();
    const { showAlert } = useDialog();
    const { subscriptions: allSubs, orders, loading, error } = useSelector((state) => state.provider);
    const [actionLoading, setActionLoading] = useState(null);
    const [activeSection, setActiveSection] = useState("all"); // all, subscription, onetime
    const [selectedOrder, setSelectedOrder] = useState(null);

    const T = theme || {
        text: 'inherit',
        textSec: '#aaa',
        textMuted: '#aaa',
        card: 'rgba(255,255,255,0.05)',
        border: 'rgba(255,255,255,0.1)',
        rowBg: 'rgba(255,255,255,0.05)',
        bg: 'transparent'
    };

    useEffect(() => {
        dispatch(fetchProviderSubscriptions());
        dispatch(fetchProviderOrders());
    }, [dispatch]);

    const handleMarkReady = async (subId) => {
        setActionLoading(subId);
        try {
            await dispatch(markMealReady(subId)).unwrap();
        } catch (err) {
            showAlert("Error", err || "Failed to mark meal ready");
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        setActionLoading(orderId);
        try {
            await dispatch(updateOrderStatus({ orderId, status })).unwrap();
        } catch (err) {
            showAlert("Error", err || "Failed to update order status");
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
        <div style={{ fontFamily: "'Nunito', sans-serif", color: T.text }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h2 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: T.text, margin: 0 }}>Orders Center</h2>
                    <p style={{ color: T.textSec, fontSize: 13, marginTop: 4 }}>{formatDate()} — {subscriptionMeals.length + pendingOrders.length} tasks pending</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                     <select 
                        value={activeSection} 
                        onChange={(e) => setActiveSection(e.target.value)}
                        style={{ padding: "10px", borderRadius: 12, border: `1px solid ${T.border}`, background: T.card || "transparent", color: T.text, fontWeight: 700, fontSize: 13, outline: "none" }}
                    >
                        <option value="all">All Items</option>
                        <option value="subscription">Subscriptions Only</option>
                        <option value="onetime">One-time Orders</option>
                    </select>
                    <button onClick={() => { dispatch(fetchProviderSubscriptions()); dispatch(fetchProviderOrders()); }}
                        style={{ padding: "10px 18px", borderRadius: 12, border: `1px solid ${T.border}`, background: "transparent", color: T.text, fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
                {[
                    { label: "Pending Orders", val: pendingOrders.length, icon: "🛍️", bg: T.bg === '#000000' ? "rgba(37, 99, 235, 0.1)" : "#e3f2fd", color: "#3b82f6" },
                    { label: "Sub Meals Today", val: subscriptionMeals.length, icon: "🍱", bg: T.bg === '#000000' ? "rgba(34, 197, 94, 0.1)" : "#e8f5e9", color: "#22c55e" },
                    { label: "Lunch", val: lunchSubs.length, icon: "🌞", bg: T.bg === '#000000' ? "rgba(245, 158, 11, 0.1)" : "#fff8e1", color: "#f59e0b" },
                    { label: "Dinner", val: dinnerSubs.length, icon: "🌙", bg: T.bg === '#000000' ? "rgba(99, 102, 241, 0.1)" : "#ede7f6", color: "#6366f1" },
                ].map((s, i) => (
                    <div key={i} style={{ background: s.bg, borderRadius: 18, padding: "20px 18px", border: `1px solid ${T.border}` }}>
                        <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: s.color, textTransform: "uppercase", letterSpacing: 1.5 }}>{s.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: T.text, fontFamily: "'Lora', serif" }}>{s.val}</div>
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
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: T.textSec, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 10, marginBottom: 4 }}>Direct Orders ({pendingOrders.length})</h3>
                        {pendingOrders.map(order => (
                            <div key={order._id} style={{
                                border: `1px solid ${T.border}`, borderRadius: 20, background: T.rowBg || "rgba(255,255,255,0.05)", overflow: "hidden",
                                borderLeft: `6px solid #6366f1`
                            }}>
                                <div style={{ display: "flex", alignItems: "center", padding: "20px 24px", gap: 20, flexWrap: "wrap" }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "#6366f115", color: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📦</div>
                                    <div style={{ flex: 1, minWidth: 150 }}>
                                        <div style={{ fontWeight: 800, fontSize: 15, color: T.text }}>{order.user?.name || "Customer"}</div>
                                        <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>ORD-{order._id.slice(-6).toUpperCase()} &bull; {order.items?.length || 0} items</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontWeight: 800, fontSize: 16, color: T.text }}>₹{order.totalPrice}</div>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: order.paymentStatus === "paid" ? "#2e7d32" : "#e65100", textTransform: "uppercase" }}>{order.paymentStatus}</div>
                                    </div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            style={{ background: T.card || "rgba(255,255,255,0.08)", border: `1px solid ${T.border}`, color: T.text, padding: "8px 12px", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800 }}
                                        >
                                            <Info size={14} /> Details
                                        </button>
                                        {order.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleUpdateStatus(order._id, 'preparing')} style={{ background: "#8FAE8E", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 10, fontWeight: 800, fontSize: 11, cursor: "pointer" }}>Accept</button>
                                                <button onClick={() => { if(window.confirm("Reject this order?")) handleUpdateStatus(order._id, 'cancelled'); }} style={{ background: "none", border: "1px solid #fecdd3", color: "#ef5350", padding: "8px 12px", borderRadius: 10, fontWeight: 800, fontSize: 11, cursor: "pointer" }}><Trash2 size={14} /></button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* SUBSCRIPTION MEALS SECTION */}
                {(activeSection === "all" || activeSection === "subscription") && subscriptionMeals.length > 0 && (
                    <>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: T.textSec, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 10, marginBottom: 4 }}>Today's Subscription Tiffins ({subscriptionMeals.length})</h3>
                        {subscriptionMeals.map(sub => {
                            const isLoading = actionLoading === sub._id;
                            const isLunch = sub.timeSlot === "lunch";

                            return (
                                <div key={sub._id} style={{
                                    border: `1px solid ${T.border}`, borderRadius: 20, background: T.rowBg || "rgba(255,255,255,0.03)", overflow: "hidden",
                                    borderLeft: `4px solid ${isLunch ? "#f59e0b" : "#4527a0"}`
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", padding: "18px 24px", gap: 16, flexWrap: "wrap" }}>
                                        <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#f0f4f0", border: "2px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#8FAE8E", fontSize: 16, flexShrink: 0 }}>
                                            {(sub.user?.name || "?").charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 120 }}>
                                            <div style={{ fontWeight: 800, fontSize: 14, color: T.text }}>{sub.user?.name || "Unknown"}</div>
                                            <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>{sub.user?.phone || ""}</div>
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: isLunch ? "#f59e0b" : "#6366f1", background: isLunch ? "#fff8e1" : "#eef2ff", padding: "4px 12px", borderRadius: 100 }}>
                                            {isLunch ? "🌞 Lunch" : "🌙 Dinner"}
                                        </span>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{sub.remainingMeals ?? 0} left</span>
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
                        <p style={{ color: T.textMuted, fontSize: 16, fontStyle: "italic" }}>All caught up! No pending tasks for now.</p>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                    <div onClick={() => setSelectedOrder(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }} />
                    <div style={{ position: "relative", background: T.card === 'rgba(255,255,255,0.05)' ? '#141414' : T.card, width: "100%", maxWidth: 500, borderRadius: 28, padding: 36, boxShadow: "0 40px 80px rgba(0,0,0,0.2)", color: T.text }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                            <div>
                                <h3 style={{ fontFamily: "'Lora', serif", fontSize: 24, fontWeight: 700, margin: 0, color: T.text }}>Order Details</h3>
                                <p style={{ fontSize: 12, color: T.textSec, marginTop: 4, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>ID: ORD-{selectedOrder._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} style={{ padding: 10, border: "none", background: T.bg === '#000000' ? 'rgba(255,255,255,0.1)' : '#f5f5f5', borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.text }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                            {/* Customer Info */}
                            <div style={{ padding: "20px", background: T.bg === '#000000' ? 'rgba(255,255,255,0.05)' : '#f9fafb', borderRadius: 20, display: "flex", gap: 16, border: `1px solid ${T.border}` }}>
                                <div style={{ width: 48, height: 48, borderRadius: 14, background: "#8FAE8E20", color: "#8FAE8E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <User size={24} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: 16, color: T.text }}>{selectedOrder.user?.name}</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, color: T.textSec, fontSize: 13 }}>
                                        <Phone size={14} /> {selectedOrder.user?.phone || "N/A"}
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 16 }}>Order Items</label>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>
                                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                                <div style={{ width: 36, height: 36, borderRadius: 10, background: T.bg === '#000000' ? 'rgba(255,255,255,0.05)' : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🍱</div>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{item.name || "Menu Item"}</div>
                                                    <div style={{ fontSize: 12, color: T.textSec }}>Qty: {item.quantity || 1}</div>
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 800, fontSize: 14, color: T.text }}>₹{item.price * (item.quantity || 1)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div style={{ borderTop: `2px dashed ${T.border}`, paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontWeight: 800, fontSize: 16, color: T.text }}>Total Amount</span>
                                <span style={{ fontWeight: 800, fontSize: 24, color: "#8FAE8E" }}>₹{selectedOrder.totalPrice}</span>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
                            <button onClick={() => setSelectedOrder(null)} 
                                style={{ flex: 1, padding: 16, border: `2px solid ${T.border}`, borderRadius: 16, background: "none", fontWeight: 800, cursor: "pointer", color: T.textSec }}>
                                Close
                            </button>
                            {selectedOrder.status === 'pending' && (
                                <>
                                    <button onClick={() => { if(window.confirm("Reject this order?")) { handleUpdateStatus(selectedOrder._id, 'cancelled'); setSelectedOrder(null); } }}
                                        style={{ flex: 1, padding: 16, border: "2px solid #ef5350", borderRadius: 16, background: "none", color: "#ef5350", fontWeight: 800, cursor: "pointer" }}>
                                        Reject
                                    </button>
                                    <button onClick={() => { handleUpdateStatus(selectedOrder._id, 'preparing'); setSelectedOrder(null); }}
                                        style={{ flex: 2, padding: 16, border: "none", borderRadius: 16, background: "#8FAE8E", color: "#fff", fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 20px rgba(143,174,142,0.3)" }}>
                                        Accept & Start Preparing
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

