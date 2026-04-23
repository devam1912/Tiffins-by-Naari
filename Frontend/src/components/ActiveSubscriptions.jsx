import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProviderSubscriptions, markMealReady } from "../store/providerSlice";
import { useDialog } from "../context/DialogContext";
import API from "../api/auth";

export const ActiveSubscriptions = ({ theme }) => {
    const dispatch = useDispatch();
    const { showAlert } = useDialog();
    const { subscriptions, loading, error } = useSelector((state) => state.provider);
    const [searchQuery, setSearchQuery] = useState("");
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);

    const T = theme || {
        text: 'inherit',
        textSec: '#aaa',
        textMuted: '#aaa',
        card: 'rgba(255,255,255,0.05)',
        border: 'rgba(255,255,255,0.1)',
        rowBg: 'rgba(255,255,255,0.05)',
        cardShadow: 'none',
        bg: 'transparent'
    };

    useEffect(() => {
        dispatch(fetchProviderSubscriptions());
    }, [dispatch]);

    const handleMarkMealReady = async (subId) => {
        setActionLoading(subId);
        try {
            await dispatch(markMealReady(subId)).unwrap();
        } catch (err) {
            showAlert("Error", err || "Failed to mark meal ready");
        } finally {
            setActionLoading(null);
        }
    };

    // Helpers
    const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "—";
    const getTotalMeals = (sub) => sub.planType === "weekly" ? 7 : sub.planType === "monthly" ? 30 : sub.planType === "yearly" ? 365 : sub.remainingMeals || 0;
    const getDaysRemaining = (endDate) => endDate ? Math.max(0, Math.ceil((new Date(endDate) - new Date()) / 86400000)) : 0;

    const statusBadge = (status) => {
        const isDark = T.bg === '#000000';
        const map = {
            active: { bg: isDark ? "rgba(34, 197, 94, 0.15)" : "#e8f5e9", color: "#22c55e", dot: "#22c55e", label: "Active" },
            paused: { bg: isDark ? "rgba(245, 158, 11, 0.15)" : "#fff8e1", color: "#f59e0b", dot: "#f59e0b", label: "Paused" },
            cancelled: { bg: isDark ? "rgba(239, 68, 68, 0.15)" : "#ffebee", color: "#ef4444", dot: "#ef4444", label: "Cancelled" },
            completed: { bg: isDark ? "rgba(59, 130, 246, 0.15)" : "#e3f2fd", color: "#3b82f6", dot: "#3b82f6", label: "Completed" },
            pending: { bg: isDark ? "rgba(156, 163, 175, 0.15)" : "#f5f5f5", color: "#9ca3af", dot: "#9ca3af", label: "Pending" },
        };
        return map[status] || map.pending;
    };

    const planBadge = (planType) => {
        const isDark = T.bg === '#000000';
        const map = {
            weekly: { bg: isDark ? "rgba(59, 130, 246, 0.1)" : "#e3f2fd", color: "#3b82f6" },
            monthly: { bg: isDark ? "rgba(168, 85, 247, 0.1)" : "#f3e5f5", color: "#a855f7" },
            yearly: { bg: isDark ? "rgba(34, 197, 94, 0.1)" : "#e8f5e9", color: "#22c55e" },
        };
        return map[planType] || { bg: isDark ? "rgba(156, 163, 175, 0.1)" : "#f5f5f5", color: "#9ca3af" };
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
        <div style={{ fontFamily: "'Nunito', sans-serif", color: T.text }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h2 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: T.text, margin: 0 }}>Active Subscriptions</h2>
                    <p style={{ color: T.textSec, fontSize: 13, marginTop: 4 }}>
                        {activeSubs.length} active • {pausedSubs.length} paused • {subscriptions.length} total
                    </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: T.textSec }}>🔍</span>
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search customers..."
                            style={{ paddingLeft: 36, paddingRight: 16, paddingTop: 10, paddingBottom: 10, border: `1px solid ${T.border}`, background: T.card, color: T.text, borderRadius: 12, fontSize: 13, fontFamily: "'Nunito', sans-serif", outline: "none", width: 220 }}
                        />
                    </div>
                    <button onClick={() => dispatch(fetchProviderSubscriptions())}
                        style={{ padding: "10px 18px", borderRadius: 12, border: `1px solid ${T.border}`, background: "transparent", color: T.text, fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
                {[
                    { label: "Active", val: activeSubs.length, icon: "👥", bg: T.bg === '#000000' ? "rgba(34, 197, 94, 0.1)" : "#e8f5e9", color: "#22c55e" },
                    { label: "Paused", val: pausedSubs.length, icon: "⏸️", bg: T.bg === '#000000' ? "rgba(245, 158, 11, 0.1)" : "#fff8e1", color: "#f59e0b" },
                    { label: "Total", val: subscriptions.length, icon: "📋", bg: T.bg === '#000000' ? "rgba(59, 130, 246, 0.1)" : "#e3f2fd", color: "#3b82f6" },
                ].map((s, i) => (
                    <div key={i} style={{ background: s.bg, borderRadius: 18, padding: "20px 18px", border: `1px solid ${T.border}`, transition: "transform 0.2s" }}>
                        <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: s.color, textTransform: "uppercase", letterSpacing: 1.5 }}>{s.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: T.text, fontFamily: "'Lora', serif" }}>{s.val}</div>
                    </div>
                ))}
            </div>

            {/* Error Banner */}
            {error && (
                <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "12px 18px", borderRadius: 12, marginBottom: 20, fontSize: 13, fontWeight: 700, border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Subscription Cards */}
            {filteredSubs.length === 0 ? (
                <div style={{ padding: "80px 0", textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
                    <p style={{ color: T.textMuted, fontSize: 16, fontStyle: "italic" }}>No subscriptions found.</p>
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
                            <div key={sub._id} style={{ border: `1px solid ${T.border}`, borderRadius: 20, overflow: "hidden", background: T.card }}>
                                {/* Row */}
                                <div style={{ display: "flex", alignItems: "center", padding: "18px 24px", gap: 16, cursor: "pointer", flexWrap: "wrap" }}
                                    onClick={() => setSelectedSub(isExpanded ? null : sub._id)}>

                                    {/* Avatar */}
                                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(143,174,142,0.1)", border: `2px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#8FAE8E", fontSize: 16, flexShrink: 0 }}>
                                        {(sub.user?.name || "?").charAt(0).toUpperCase()}
                                    </div>

                                    {/* Name & ID */}
                                    <div style={{ flex: 1, minWidth: 120 }}>
                                        <div style={{ fontWeight: 800, fontSize: 14, color: T.text }}>{sub.user?.name || "Unknown"}</div>
                                        <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>{subId} &bull; {sub.user?.email || ""}</div>
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
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, fontWeight: 800, color: T.textSec, marginBottom: 4, textTransform: "uppercase" }}>
                                            <span>{remaining}/{totalMeals}</span>
                                            <span>{pct}%</span>
                                        </div>
                                        <div style={{ height: 5, background: T.border, borderRadius: 100, overflow: "hidden" }}>
                                            <div style={{ height: "100%", background: pct < 20 ? "#ef4444" : "#8FAE8E", borderRadius: 100, width: `${pct}%`, transition: "width 0.5s" }} />
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

                                    <span style={{ color: T.textSec, fontSize: 16 }}>{isExpanded ? "▲" : "▼"}</span>
                                </div>

                                {/* Expanded Detail */}
                                {isExpanded && (
                                    <div style={{ borderTop: `1px solid ${T.border}`, padding: "20px 24px", background: "rgba(255,255,255,0.02)" }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
                                            <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 14, border: `1px solid ${T.border}` }}>
                                                <p style={{ fontSize: 10, fontWeight: 800, color: T.textSec, textTransform: "uppercase", marginBottom: 6 }}>Timeline</p>
                                                <p style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{formatDate(sub.startDate)} → {formatDate(sub.endDate)}</p>
                                                <p style={{ fontSize: 11, color: "#8FAE8E", fontWeight: 700, marginTop: 4 }}>{getDaysRemaining(sub.endDate)} days remaining</p>
                                            </div>
                                            <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 14, border: `1px solid ${T.border}` }}>
                                                <p style={{ fontSize: 10, fontWeight: 800, color: T.textSec, textTransform: "uppercase", marginBottom: 6 }}>Payment</p>
                                                <p style={{ fontSize: 13, fontWeight: 700, color: T.text }}>₹{sub.amountPaid || 0} / ₹{sub.totalPrice || 0}</p>
                                                <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 8, textTransform: "uppercase", background: sub.paymentStatus === "paid" ? "rgba(34, 197, 94, 0.15)" : "rgba(245, 158, 11, 0.15)", color: sub.paymentStatus === "paid" ? "#22c55e" : "#f59e0b" }}>
                                                    {sub.paymentStatus || "pending"}
                                                </span>
                                            </div>
                                            <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 14, border: `1px solid ${T.border}` }}>
                                                <p style={{ fontSize: 10, fontWeight: 800, color: T.textSec, textTransform: "uppercase", marginBottom: 6 }}>Meals</p>
                                                <p style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{remaining} of {totalMeals} remaining</p>
                                                {sub.lastServedDate && <p style={{ fontSize: 11, color: T.textSec, marginTop: 4 }}>Last served: {formatDate(sub.lastServedDate)}</p>}
                                            </div>
                                            {sub.user?.phone && (
                                                <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 14, border: `1px solid ${T.border}` }}>
                                                    <p style={{ fontSize: 10, fontWeight: 800, color: T.textSec, textTransform: "uppercase", marginBottom: 6 }}>Contact</p>
                                                    <p style={{ fontSize: 13, fontWeight: 700, color: T.text }}>📞 {sub.user.phone}</p>
                                                    {sub.user?.email && <p style={{ fontSize: 11, color: T.textSec, marginTop: 4 }}>✉️ {sub.user.email}</p>}
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
