import React, { useState, useEffect } from "react";
import API from "../api/auth";

export const OrdersToday = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchTodaySubscriptions = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get("/subscriptions/provider-subscriptions");
            if (res.data?.success) {
                // Filter to active subscriptions that need serving today
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const todaySubs = (res.data.data || []).filter(sub => {
                    if (sub.status !== "active") return false;
                    // Include if not yet served today
                    if (sub.lastServedDate) {
                        const lastServed = new Date(sub.lastServedDate);
                        lastServed.setHours(0, 0, 0, 0);
                        return lastServed.getTime() !== today.getTime();
                    }
                    return true;
                });

                setSubscriptions(todaySubs);
            }
        } catch (err) {
            console.error("Orders sync failed:", err);
            setError("Unable to load today's orders.");
            setSubscriptions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTodaySubscriptions(); }, []);

    const handleMarkReady = async (subId) => {
        setActionLoading(subId);
        try {
            await API.patch(`/subscriptions/${subId}/mark-meal-ready`);
            await fetchTodaySubscriptions();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to mark meal ready");
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = () => new Date().toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric", year: "numeric" });

    if (loading) return (
        <div style={{ padding: 80, textAlign: "center", color: "#8FAE8E", fontWeight: 700 }}>Loading today's orders...</div>
    );

    const lunchSubs = subscriptions.filter(s => s.timeSlot === "lunch");
    const dinnerSubs = subscriptions.filter(s => s.timeSlot === "dinner");

    return (
        <div style={{ fontFamily: "'Nunito', sans-serif" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h2 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: "#2d3b2d", margin: 0 }}>Orders Today</h2>
                    <p style={{ color: "#aaa", fontSize: 13, marginTop: 4 }}>{formatDate()} — {subscriptions.length} meals to prepare</p>
                </div>
                <button onClick={fetchTodaySubscriptions}
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
                    <p style={{ color: "#ddd", fontSize: 12, marginTop: 6 }}>All meals have been served, or no active subscriptions.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {subscriptions.map(sub => {
                        const isLoading = actionLoading === sub._id;
                        const subId = `SUB-${(sub._id || "").slice(-6).toUpperCase()}`;
                        const isLunch = sub.timeSlot === "lunch";

                        return (
                            <div key={sub._id} style={{
                                border: "1px solid #f0f0f0", borderRadius: 20, background: "#fcfdfc", overflow: "hidden",
                                borderLeft: `4px solid ${isLunch ? "#8FAE8E" : "#6366f1"}`
                            }}>
                                <div style={{ display: "flex", alignItems: "center", padding: "18px 24px", gap: 16, flexWrap: "wrap" }}>
                                    {/* Avatar */}
                                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#f0f4f0", border: "2px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#8FAE8E", fontSize: 16, flexShrink: 0 }}>
                                        {(sub.user?.name || "?").charAt(0).toUpperCase()}
                                    </div>

                                    {/* Customer Info */}
                                    <div style={{ flex: 1, minWidth: 120 }}>
                                        <div style={{ fontWeight: 800, fontSize: 14, color: "#2d3b2d" }}>{sub.user?.name || "Unknown"}</div>
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
                                    <span style={{ fontSize: 12, fontWeight: 700, color: "#2d3b2d" }}>
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
