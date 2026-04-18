import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { approveMenu, rejectMenu } from "../store/adminSlice";
import API from "../api/auth";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function RejectionModal({ menu, onClose, onReject, loading }) {
    const [reason, setReason] = useState("");
    return (
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(30,10,10,0.6)", backdropFilter: "blur(12px)", padding: 20 }}
        >
            <div style={{ background: "#fff", borderRadius: 32, padding: "44px", maxWidth: 480, width: "100%", boxShadow: "0 40px 80px rgba(0,0,0,0.25)", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#ef5350" }} />
                <h2 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: "#2d3b2d", marginBottom: 6 }}>Decline Menu</h2>
                <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>Kitchen: <span style={{ color: "#ef5350", fontWeight: 700 }}>{menu?.provider?.businessName}</span></p>

                <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Reason for rejection (sent to provider)..."
                    style={{ width: "100%", padding: 18, borderRadius: 16, border: "2px solid #f0f0f0", fontSize: 14, minHeight: 120, marginBottom: 24, resize: "none", outline: "none", fontFamily: "'Nunito', sans-serif" }}
                />

                <div style={{ display: "flex", gap: 14 }}>
                    <button onClick={onClose} style={{ flex: 1, padding: "14px", background: "transparent", border: "2px solid #eee", borderRadius: 16, fontWeight: 700, color: "#999", cursor: "pointer" }}>Back</button>
                    <button
                        onClick={() => onReject(reason)}
                        disabled={!reason.trim() || loading}
                        style={{ flex: 2, padding: "14px", background: "#ef5350", color: "#fff", border: "none", borderRadius: 16, fontWeight: 700, cursor: (!reason.trim() || loading) ? "not-allowed" : "pointer" }}
                    >
                        {loading ? "Processing..." : "Confirm Rejection"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export const AdminMenu = ({ menus = [] }) => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [actionLoading, setActionLoading] = useState({});
    const [selected, setSelected] = useState(null); // expanded menu
    const [rejectTarget, setRejectTarget] = useState(null);

    const filtered = menus.filter(m =>
        m.provider?.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.provider?.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleApprove = async (menuId) => {
        setActionLoading(p => ({ ...p, [menuId]: true }));
        try {
            await dispatch(approveMenu(menuId)).unwrap();
        } catch (e) { alert(e || "Approve failed"); }
        finally { setActionLoading(p => ({ ...p, [menuId]: false })); }
    };

    const handleReject = async (remark) => {
        if (!rejectTarget) return;
        const menuId = rejectTarget._id;
        setActionLoading(p => ({ ...p, [menuId]: true }));
        try {
            await dispatch(rejectMenu({ menuId, remark })).unwrap();
            setRejectTarget(null);
        } catch (e) { alert(e || "Reject failed"); }
        finally { setActionLoading(p => ({ ...p, [menuId]: false })); }
    };

    const statusBadge = (menu) => {
        if (menu.isApproved) return { label: "Live", bg: "#e8f5e9", color: "#2e7d32", dot: "#4caf50" };
        if (menu.submittedForApproval) return { label: "Pending", bg: "#fff8e1", color: "#e65100", dot: "#ff9800" };
        return { label: "Draft", bg: "#f5f5f5", color: "#757575", dot: "#9e9e9e" };
    };

    return (
        <div style={{ fontFamily: "'Nunito', sans-serif" }}>
            {rejectTarget && (
                <RejectionModal
                    menu={rejectTarget}
                    onClose={() => setRejectTarget(null)}
                    onReject={handleReject}
                    loading={actionLoading[rejectTarget._id]}
                />
            )}
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h2 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: "inherit", margin: 0 }}>Menu Moderation</h2>
                    <p style={{ color: "#aaa", fontSize: 13, marginTop: 4 }}>{menus.length} menus from registered kitchen partners</p>
                </div>
                <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#aaa" }}>🔍</span>
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search by kitchen or chef..."
                        style={{ paddingLeft: 36, paddingRight: 16, paddingTop: 10, paddingBottom: 10, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, fontSize: 13, fontFamily: "'Nunito', sans-serif", outline: "none", width: 240, background: "transparent", color: "inherit" }}
                    />
                </div>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <div style={{ padding: "80px 0", textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🍱</div>
                    <p style={{ color: "#ccc", fontSize: 16, fontStyle: "italic" }}>No menus found.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {filtered.map(menu => {
                        const badge = statusBadge(menu);
                        const isExpanded = selected === menu._id;
                        const loading = actionLoading[menu._id];

                        return (
                            <div key={menu._id} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, overflow: "hidden", background: "rgba(255,255,255,0.03)" }}>
                                {/* Row */}
                                <div style={{ display: "flex", alignItems: "center", padding: "18px 24px", gap: 16, cursor: "pointer" }}
                                    onClick={() => setSelected(isExpanded ? null : menu._id)}>
                                    <div style={{ width: 42, height: 42, borderRadius: 12, background: "#fff8f0", border: "1px solid #ffe0b2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🍱</div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 800, fontSize: 15, color: "inherit" }}>{menu.provider?.businessName || "Unknown Kitchen"}</div>
                                        <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>Chef: {menu.provider?.ownerName || "—"} &bull; {menu.weekMenu?.length || 0} days scheduled</div>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, fontSize: 10, fontWeight: 800, textTransform: "uppercase", background: badge.bg, color: badge.color }}>
                                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: badge.dot, display: "inline-block" }} />
                                            {badge.label}
                                        </span>

                                        {!loading ? (
                                            <div style={{ display: "flex", gap: 8 }}>
                                                {menu.submittedForApproval && !menu.isApproved && (
                                                    <button onClick={e => { e.stopPropagation(); handleApprove(menu._id); }}
                                                        style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "#8FAE8E", color: "#fff", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                                                        ✅ Approve
                                                    </button>
                                                )}
                                                {menu.isApproved && (
                                                    <button onClick={e => { e.stopPropagation(); setRejectTarget(menu); }}
                                                        style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid #ef5350", background: "none", color: "#ef5350", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                                                        ✕ Revoke
                                                    </button>
                                                )}
                                                {!menu.isApproved && menu.submittedForApproval && (
                                                     <button onClick={e => { e.stopPropagation(); setRejectTarget(menu); }}
                                                     style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid #ef5350", background: "none", color: "#ef5350", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                                                     ✕ Reject
                                                 </button>
                                                )}
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: 12, color: "#aaa" }}>Processing...</span>
                                        )}

                                        <span style={{ color: "#ccc", fontSize: 18 }}>{isExpanded ? "▲" : "▼"}</span>
                                    </div>
                                </div>

                                {/* Expanded: weekly menu detail */}
                                {isExpanded && (
                                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "20px 24px", background: "rgba(255,255,255,0.02)" }}>
                                        <p style={{ fontSize: 11, fontWeight: 800, color: "#8FAE8E", textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Weekly Schedule</p>
                                        <div style={{ display: "flex", overflowX: "auto", gap: 12, paddingBottom: 8 }}>
                                            {DAYS.map(day => {
                                                const dayData = menu.weekMenu?.find(d => d.day === day);
                                                const lunchItems = dayData?.lunch?.items || [];
                                                const dinnerItems = dayData?.dinner?.items || [];
                                                const hasItems = lunchItems.length > 0 || dinnerItems.length > 0;
                                                return (
                                                    <div key={day} style={{ minWidth: 140, borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", padding: 14, flexShrink: 0 }}>
                                                        <p style={{ fontWeight: 800, fontSize: 11, color: "#8FAE8E", textTransform: "uppercase", marginBottom: 10 }}>{day.slice(0, 3)}</p>
                                                        {!hasItems && <p style={{ fontSize: 11, color: "#ddd", fontStyle: "italic" }}>No items</p>}
                                                        {lunchItems.length > 0 && (
                                                            <div style={{ marginBottom: 8 }}>
                                                                <p style={{ fontSize: 10, fontWeight: 800, color: "#f59e0b", marginBottom: 4 }}>LUNCH</p>
                                                                {lunchItems.map((item, i) => (
                                                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                                                                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#8FAE8E", flexShrink: 0, display: "inline-block" }} />
                                                                        <span style={{ fontSize: 12, color: "inherit", flex: 1 }}>{item.name}</span>
                                                                        {item.price > 0 && <span style={{ fontSize: 10, fontWeight: 800, color: "#8FAE8E", whiteSpace: "nowrap" }}>₹{item.price}</span>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {dinnerItems.length > 0 && (
                                                            <div>
                                                                <p style={{ fontSize: 10, fontWeight: 800, color: "#6366f1", marginBottom: 4 }}>DINNER</p>
                                                                {dinnerItems.map((item, i) => (
                                                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                                                                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6366f1", flexShrink: 0, display: "inline-block" }} />
                                                                        <span style={{ fontSize: 12, color: "inherit", flex: 1 }}>{item.name}</span>
                                                                        {item.price > 0 && <span style={{ fontSize: 10, fontWeight: 800, color: "#6366f1", whiteSpace: "nowrap" }}>₹{item.price}</span>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                                                            {dayData?.lunch?.price > 0 && (
                                                                <span style={{ fontSize: 11, fontWeight: 800, color: "#f59e0b", background: "#fff8e1", padding: "2px 8px", borderRadius: 8 }}>🌞 ₹{dayData.lunch.price}</span>
                                                            )}
                                                            {dayData?.dinner?.price > 0 && (
                                                                <span style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", background: "#eef2ff", padding: "2px 8px", borderRadius: 8 }}>🌙 ₹{dayData.dinner.price}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <p style={{ fontSize: 11, color: "#ccc", marginTop: 12 }}>
                                            Last updated: {menu.updatedAt ? new Date(menu.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                                        </p>
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
