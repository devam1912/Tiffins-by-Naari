import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProviderSubscriptions, markMealReady } from "../store/providerSlice";

export const OrdersToday = () => {
    const dispatch = useDispatch();
    const { subscriptions: allSubs, loading, error } = useSelector((state) => state.provider);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        dispatch(fetchProviderSubscriptions());
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

    const formatDate = () => new Date().toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric", year: "numeric" });

    if (loading) return (
        <div style={{ padding: 80, textAlign: "center", color: "#8FAE8E", fontWeight: 700 }}>Loading today's orders...</div>
    );

    // Filter to active subscriptions that need serving today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const subscriptions = allSubs.filter(sub => {
        if (sub.status !== "active") return false;
        if (sub.lastServedDate) {
            const lastServed = new Date(sub.lastServedDate);
            lastServed.setHours(0, 0, 0, 0);
            return lastServed.getTime() !== today.getTime();
        }
        return true;
    });

    const lunchSubs = subscriptions.filter(s => s.timeSlot === "lunch");
    const dinnerSubs = subscriptions.filter(s => s.timeSlot === "dinner");

    return (
        <div style={{ fontFamily: "'Nunito', sans-serif" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h2 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: "inherit", margin: 0 }}>Orders Today</h2>
                    <p style={{ color: "#aaa", fontSize: 13, marginTop: 4 }}>{formatDate()} — {subscriptions.length} meals to prepare</p>
                </div>
                <button onClick={() => dispatch(fetchProviderSubscriptions())}
                    style={{ padding: "10px 18px", borderRadius: 12, border: "1px solid #eee", background: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    🔄 Refresh
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
                {[
                    { label: "Total Orders", val: subscriptions.length, icon: "🛍️", bg: "#e3f2fd", color: "#1565c0" },
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
            {subscriptions.length === 0 ? (
                <div style={{ padding: "80px 0", textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🍱</div>
                    <p style={{ color: "#ccc", fontSize: 16, fontStyle: "italic" }}>No pending meals for today.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {subscriptions.map(sub => {
                        const isLoading = actionLoading === sub._id;
                        const subId = `SUB-${(sub._id || "").slice(-6).toUpperCase()}`;
                        const isLunch = sub.timeSlot === "lunch";

                        return (
                            <div key={sub._id} style={{
                                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, background: "rgba(255,255,255,0.03)", overflow: "hidden",
                                borderLeft: `4px solid ${isLunch ? "#8FAE8E" : "#6366f1"}`
                            }}>
                                <div style={{ display: "flex", alignItems: "center", padding: "18px 24px", gap: 16, flexWrap: "wrap" }}>
                                    {/* Avatar */}
                                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#f0f4f0", border: "2px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#8FAE8E", fontSize: 16, flexShrink: 0 }}>
                                        {(sub.user?.name || "?").charAt(0).toUpperCase()}
                                    </div>

                                    {/* Customer Info */}
                                    <div style={{ flex: 1, minWidth: 120 }}>
                                        <div style={{ fontWeight: 800, fontSize: 14, color: "inherit" }}>{sub.user?.name || "Unknown"}</div>
                                        <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                                            {subId} &bull; {sub.user?.email || sub.user?.phone || ""}
                                        </div>
                                    </div>

                                    {/* Slot */}
                                    <span style={{ fontSize: 12, fontWeight: 700, color: isLunch ? "#f59e0b" : "#6366f1", background: isLunch ? "#fff8e1" : "#eef2ff", padding: "4px 12px", borderRadius: 100 }}>
                                        {isLunch ? "🌞 Lunch" : "🌙 Dinner"}
                                    </span>

                                    {/* Plan */}
                                    <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 10, fontWeight: 800, textTransform: "uppercase", background: "#f3e5f5", color: "#7b1fa2" }}>
                                        {sub.planType}
                                    </span>

                                    {/* Meals remaining */}
                                    <span style={{ fontSize: 12, fontWeight: 700, color: "inherit" }}>
                                        {sub.remainingMeals ?? 0} meals left
                                    </span>

                                    {/* Mark Ready button */}
                                    <button
                                        onClick={() => handleMarkReady(sub._id)}
                                        disabled={isLoading}
                                        style={{
                                            padding: "10px 20px", borderRadius: 12, border: "none",
                                            background: "linear-gradient(135deg, #8FAE8E, #5a7a50)", color: "#fff",
                                            fontWeight: 800, fontSize: 12, cursor: isLoading ? "not-allowed" : "pointer",
                                            boxShadow: "0 4px 14px rgba(90,122,80,0.3)", whiteSpace: "nowrap",
                                        }}>
                                        {isLoading ? "⏳ Processing..." : "✅ Mark Meal Ready"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
