import React, { useState, useEffect } from "react";
import API from "../api/auth";

export const ActiveSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);

    const fetchSubscriptions = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get("/subscriptions/provider-subscriptions");
            if (res.data?.success) {
                setSubscriptions(res.data.data || []);
            }
        } catch (err) {
            console.error("Provider subscriptions fetch failed:", err);
            setError("Unable to load subscriptions.");
            setSubscriptions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSubscriptions(); }, []);

    const handleMarkMealReady = async (subId) => {
        setActionLoading(subId);
        try {
            await API.patch(`/subscriptions/${subId}/mark-meal-ready`);
            await fetchSubscriptions();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to mark meal ready");
        } finally { setActionLoading(null); }
    };

    // Helpers
    const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "—";
    const getTotalMeals = (sub) => sub.planType === "weekly" ? 7 : sub.planType === "monthly" ? 30 : sub.planType === "yearly" ? 365 : sub.remainingMeals || 0;
    const getDaysRemaining = (endDate) => endDate ? Math.max(0, Math.ceil((new Date(endDate) - new Date()) / 86400000)) : 0;

    const statusBadge = (status) => {
        const map = {
            active: { bg: "#e8f5e9", color: "#2e7d32", dot: "#4caf50", label: "Active" },
            paused: { bg: "#fff8e1", color: "#e65100", dot: "#ff9800", label: "Paused" },
            cancelled: { bg: "#ffebee", color: "#c62828", dot: "#ef5350", label: "Cancelled" },
            completed: { bg: "#e3f2fd", color: "#1565c0", dot: "#42a5f5", label: "Completed" },
            pending: { bg: "#f5f5f5", color: "#616161", dot: "#9e9e9e", label: "Pending" },
        };
        return map[status] || map.pending;
    };

    const planBadge = (planType) => {
        const map = {
            weekly: { bg: "#e3f2fd", color: "#1565c0" },
            monthly: { bg: "#f3e5f5", color: "#7b1fa2" },
            yearly: { bg: "#e8f5e9", color: "#2e7d32" },
        };
        return map[planType] || { bg: "#f5f5f5", color: "#616161" };
    };

    const filteredSubs = subscriptions.filter(sub =>
        (sub.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub._id || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeSubs = subscriptions.filter(s => s.status === "active");
    const pausedSubs = subscriptions.filter(s => s.status === "paused");

    if (loading) return (
        <div style={{ padding: 80, textAlign: "center", color: "#8FAE8E", fontWeight: 700 }}>Loading subscriptions...</div>
    );

    return (
        <div style={{ fontFamily: "'Nunito', sans-serif" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h2 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: "#2d3b2d", margin: 0 }}>Active Subscriptions</h2>
                    <p style={{ color: "#aaa", fontSize: 13, marginTop: 4 }}>
                        {activeSubs.length} active • {pausedSubs.length} paused • {subscriptions.length} total
                    </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#aaa" }}>🔍</span>
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search customers..."
                            style={{ paddingLeft: 36, paddingRight: 16, paddingTop: 10, paddingBottom: 10, border: "1px solid #eee", borderRadius: 12, fontSize: 13, fontFamily: "'Nunito', sans-serif", outline: "none", width: 220 }}
                        />
                    </div>
                    <button onClick={fetchSubscriptions}
                        style={{ padding: "10px 18px", borderRadius: 12, border: "1px solid #eee", background: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
                {[
                    { label: "Active", val: activeSubs.length, icon: "👥", bg: "#e8f5e9", color: "#2e7d32" },
                    { label: "Paused", val: pausedSubs.length, icon: "⏸️", bg: "#fff8e1", color: "#e65100" },
                    { label: "Total", val: subscriptions.length, icon: "📋", bg: "#e3f2fd", color: "#1565c0" },
                ].map((s, i) => (
                    <div key={i} style={{ background: s.bg, borderRadius: 18, padding: "20px 18px", transition: "transform 0.2s" }}>
                        <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: s.color, textTransform: "uppercase", letterSpacing: 1.5 }}>{s.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'Lora', serif" }}>{s.val}</div>
                    </div>
                ))}
            </div>

            {/* Error Banner */}
            {error && (
                <div style={{ background: "#fff8e1", color: "#e65100", padding: "12px 18px", borderRadius: 12, marginBottom: 20, fontSize: 13, fontWeight: 700, border: "1px solid #ffe0b2" }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Subscription Cards */}
            {filteredSubs.length === 0 ? (
                <div style={{ padding: "80px 0", textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
                    <p style={{ color: "#ccc", fontSize: 16, fontStyle: "italic" }}>No subscriptions found.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {filteredSubs.map(sub => {
                        const badge = statusBadge(sub.status);
                        const plan = planBadge(sub.planType);
                        const totalMeals = getTotalMeals(sub);
                        const remaining = sub.remainingMeals ?? 0;
                        const pct = totalMeals > 0 ? Math.round((remaining / totalMeals) * 100) : 0;
                        const isExpanded = selectedSub === sub._id;
                        const isLoading = actionLoading === sub._id;
                        const subId = `SUB-${(sub._id || "").slice(-6).toUpperCase()}`;

                        return (
                            <div key={sub._id} style={{ border: "1px solid #f0f0f0", borderRadius: 20, overflow: "hidden", background: "#fcfdfc" }}>
                                {/* Row */}
                                <div style={{ display: "flex", alignItems: "center", padding: "18px 24px", gap: 16, cursor: "pointer", flexWrap: "wrap" }}
                                    onClick={() => setSelectedSub(isExpanded ? null : sub._id)}>

                                    {/* Avatar */}
                                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#f0f4f0", border: "2px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#8FAE8E", fontSize: 16, flexShrink: 0 }}>
                                        {(sub.user?.name || "?").charAt(0).toUpperCase()}
                                    </div>

                                    {/* Name & ID */}
                                    <div style={{ flex: 1, minWidth: 120 }}>
                                        <div style={{ fontWeight: 800, fontSize: 14, color: "#2d3b2d" }}>{sub.user?.name || "Unknown"}</div>
                                        <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{subId} &bull; {sub.user?.email || ""}</div>
                                    </div>

                                    {/* Plan badge */}
                                    <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 10, fontWeight: 800, textTransform: "uppercase", background: plan.bg, color: plan.color }}>
                                        {sub.planType}
                                    </span>

                                    {/* Slot */}
                                    <span style={{ fontSize: 12, fontWeight: 700, color: sub.timeSlot === "lunch" ? "#f59e0b" : "#6366f1" }}>
                                        {sub.timeSlot === "lunch" ? "🌞 Lunch" : "🌙 Dinner"}
                                    </span>

                                    {/* Status */}
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, fontSize: 10, fontWeight: 800, textTransform: "uppercase", background: badge.bg, color: badge.color }}>
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: badge.dot, display: "inline-block" }} />
                                        {badge.label}
                                    </span>

                                    {/* Meals progress */}
                                    <div style={{ width: 100 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, fontWeight: 800, color: "#aaa", marginBottom: 4, textTransform: "uppercase" }}>
                                            <span>{remaining}/{totalMeals}</span>
                                            <span>{pct}%</span>
                                        </div>
                                        <div style={{ height: 5, background: "#f0f0f0", borderRadius: 100, overflow: "hidden" }}>
                                            <div style={{ height: "100%", background: pct < 20 ? "#ef5350" : "#8FAE8E", borderRadius: 100, width: `${pct}%`, transition: "width 0.5s" }} />
                                        </div>
                                    </div>

                                    {/* Mark Meal Ready button */}
                                    {sub.status === "active" && (
                                        <button
                                            onClick={e => { e.stopPropagation(); handleMarkMealReady(sub._id); }}
                                            disabled={isLoading}
                                            style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: "#8FAE8E", color: "#fff", fontWeight: 800, fontSize: 11, cursor: isLoading ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
                                            {isLoading ? "..." : "✅ Meal Ready"}
                                        </button>
                                    )}

                                    <span style={{ color: "#ccc", fontSize: 16 }}>{isExpanded ? "▲" : "▼"}</span>
                                </div>

                                {/* Expanded Detail */}
                                {isExpanded && (
                                    <div style={{ borderTop: "1px solid #f5f5f5", padding: "20px 24px", background: "#fff" }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
                                            <div style={{ background: "#f9fafb", padding: 16, borderRadius: 14, border: "1px solid #f0f0f0" }}>
                                                <p style={{ fontSize: 10, fontWeight: 800, color: "#aaa", textTransform: "uppercase", marginBottom: 6 }}>Timeline</p>
                                                <p style={{ fontSize: 13, fontWeight: 700, color: "#2d3b2d" }}>{formatDate(sub.startDate)} → {formatDate(sub.endDate)}</p>
                                                <p style={{ fontSize: 11, color: "#8FAE8E", fontWeight: 700, marginTop: 4 }}>{getDaysRemaining(sub.endDate)} days remaining</p>
                                            </div>
                                            <div style={{ background: "#f9fafb", padding: 16, borderRadius: 14, border: "1px solid #f0f0f0" }}>
                                                <p style={{ fontSize: 10, fontWeight: 800, color: "#aaa", textTransform: "uppercase", marginBottom: 6 }}>Payment</p>
                                                <p style={{ fontSize: 13, fontWeight: 700, color: "#2d3b2d" }}>₹{sub.amountPaid || 0} / ₹{sub.totalPrice || 0}</p>
                                                <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 8, textTransform: "uppercase", background: sub.paymentStatus === "paid" ? "#e8f5e9" : "#fff8e1", color: sub.paymentStatus === "paid" ? "#2e7d32" : "#e65100" }}>
                                                    {sub.paymentStatus || "pending"}
                                                </span>
                                            </div>
                                            <div style={{ background: "#f9fafb", padding: 16, borderRadius: 14, border: "1px solid #f0f0f0" }}>
                                                <p style={{ fontSize: 10, fontWeight: 800, color: "#aaa", textTransform: "uppercase", marginBottom: 6 }}>Meals</p>
                                                <p style={{ fontSize: 13, fontWeight: 700, color: "#2d3b2d" }}>{remaining} of {totalMeals} remaining</p>
                                                {sub.lastServedDate && <p style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>Last served: {formatDate(sub.lastServedDate)}</p>}
                                            </div>
                                            {sub.user?.phone && (
                                                <div style={{ background: "#f9fafb", padding: 16, borderRadius: 14, border: "1px solid #f0f0f0" }}>
                                                    <p style={{ fontSize: 10, fontWeight: 800, color: "#aaa", textTransform: "uppercase", marginBottom: 6 }}>Contact</p>
                                                    <p style={{ fontSize: 13, fontWeight: 700, color: "#2d3b2d" }}>📞 {sub.user.phone}</p>
                                                    {sub.user?.email && <p style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>✉️ {sub.user.email}</p>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
