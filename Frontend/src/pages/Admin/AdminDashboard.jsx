import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { 
  fetchAdminData, 
  approveProvider, 
  rejectProvider, 
  processPayout, 
  creditProviderWallet 
} from "../../store/adminSlice";
import API from "../../api/auth";

// Internal Components
import { AdminUsers } from "../../components/AdminUsers";
import { AdminMenu } from "../../components/AdminMenu";
import { AdminFeedback } from "../../components/AdminFeedback";

// ══════════════════════════════════════════
// 1. APPROVE MODAL
// ══════════════════════════════════════════
function ApproveModal({ provider, onClose, onApprove, loading }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,30,20,0.6)", backdropFilter: "blur(12px)", padding: 20 }}
    >
      <div style={{ background: "#fff", borderRadius: 32, padding: "48px", maxWidth: 440, width: "100%", textAlign: "center", boxShadow: "0 40px 80px rgba(0,0,0,0.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg,#8FAE8E,#D9D9A8)" }} />
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 36, color: "#fff" }}>👩‍🍳</div>
        <h2 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: "#2d3b2d", marginBottom: 12 }}>Approve Kitchen?</h2>
        <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
          Authorize <strong>{provider?.businessName}</strong>. This will enable their menu and notify <strong>{provider?.ownerName}</strong>.
        </p>
        <div style={{ display: "flex", gap: 14 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "14px", background: "#f5f5f0", border: "none", borderRadius: 16, fontWeight: 700, cursor: "pointer", color: "#888" }}>Cancel</button>
          <button onClick={onApprove} disabled={loading} style={{ flex: 2, padding: "14px", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", color: "#fff", border: "none", borderRadius: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Approving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// 2. REJECT MODAL
// ══════════════════════════════════════════
function RejectModal({ provider, onClose, onReject, loading }) {
  const [reason, setReason] = useState("");
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(30,10,10,0.6)", backdropFilter: "blur(12px)", padding: 20 }}
    >
      <div style={{ background: "#fff", borderRadius: 32, padding: "44px", maxWidth: 480, width: "100%", boxShadow: "0 40px 80px rgba(0,0,0,0.25)", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#ef5350" }} />
        <h2 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: "#2d3b2d", marginBottom: 6 }}>Decline Kitchen</h2>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>Entity: <span style={{ color: "#ef5350", fontWeight: 700 }}>{provider?.businessName}</span></p>

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

// ══════════════════════════════════════════
// 3. PAYOUT MODAL
// ══════════════════════════════════════════
function PayoutModal({ provider, type = "debit", onClose, onConfirm, loading }) {
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  const isDebit = type === "debit";
  const title = isDebit ? "Process Payout" : "Manual Adjustment";
  const color = isDebit ? "#8FAE8E" : "#6366f1";

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 10001, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", padding: 20 }}
    >
      <div style={{ background: "#fff", borderRadius: 32, padding: "40px", maxWidth: 440, width: "100%", boxShadow: "0 40px 80px rgba(0,0,0,0.2)", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: color }} />
        <h2 style={{ fontFamily: "'Lora', serif", fontSize: 24, fontWeight: 700, color: "#2d3b2d", marginBottom: 8 }}>{title}</h2>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>Entity: <span style={{ color: color, fontWeight: 700 }}>{provider?.businessName}</span></p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#aaa", textTransform: "uppercase", marginBottom: 8 }}>Amount (₹)</label>
          <input 
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            style={{ width: "100%", padding: "14px 18px", borderRadius: 14, border: "2px solid #f0f0f0", outline: "none", fontSize: 16, fontWeight: 700 }}
          />
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#aaa", textTransform: "uppercase", marginBottom: 8 }}>Description / Note</label>
          <input 
            type="text"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder={isDebit ? "Weekly settlement" : "Order adjustment"}
            style={{ width: "100%", padding: "14px 18px", borderRadius: 14, border: "2px solid #f0f0f0", outline: "none", fontSize: 14 }}
          />
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "14px", background: "#f5f5f0", border: "none", borderRadius: 16, fontWeight: 700, cursor: "pointer", color: "#888" }}>Cancel</button>
          <button 
            disabled={!amount || loading}
            onClick={() => onConfirm({ amount: Number(amount), description: desc })}
            style={{ flex: 2, padding: "14px", background: color, color: "#fff", border: "none", borderRadius: 16, fontWeight: 700, cursor: (!amount || loading) ? "not-allowed" : "pointer" }}
          >
            {loading ? "Processing..." : "Confirm Action"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// 4. VIEW APPLICATION MODAL
// ══════════════════════════════════════════
function ViewApplicationModal({ provider, onClose, onApprove, onReject }) {
  const isPdf = provider?.fssaiCertificate?.toLowerCase().includes(".pdf");
  const DataField = ({ label, value, fullWidth = false }) => (
    <div style={{ padding: "14px 0", borderBottom: "1px solid #f4f7f4", width: fullWidth ? "100%" : "50%" }}>
      <p style={{ fontSize: 10, fontWeight: 800, color: "#8FAE8E", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 14, color: "#2d3b2d", fontWeight: 600 }}>{value || "N/A"}</p>
    </div>
  );

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,30,20,0.6)", backdropFilter: "blur(18px)", padding: 20 }}
    >
      <div style={{ background: "#fff", borderRadius: 32, width: "100%", maxWidth: 600, maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 40px 80px rgba(0,0,0,0.2)" }}>
        <div style={{ padding: "28px 36px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fcfdfc" }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: 24, fontWeight: 700, color: "#2d3b2d" }}>Kitchen Application</h2>
          <button onClick={onClose} style={{ background: "#f5f5f0", border: "none", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", color: "#aaa" }}>✕</button>
        </div>

        <div style={{ padding: "36px", overflowY: "auto", flex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 32 }}>
            <DataField label="Name" value={provider?.businessName} />
            <DataField label="Chef" value={provider?.ownerName} />
            <DataField label="FSSAI" value={provider?.fssaiNumber} />
            <DataField label="Email" value={provider?.email} />
            <DataField label="Phone" value={provider?.phone} />
            <DataField label="Location" value={provider?.address} fullWidth />
          </div>

          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#8FAE8E", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>Documentation</p>
            <div style={{ borderRadius: 16, border: "2px dashed #eee", background: "#f9faf9", padding: 16, textAlign: "center" }}>
              {provider?.fssaiCertificate ? (
                isPdf ? <a href={provider.fssaiCertificate} target="_blank" rel="noreferrer" style={{ color: "#8FAE8E", fontWeight: 700 }}>📄 Open Certificate</a> :
                  <img src={provider.fssaiCertificate} alt="FSSAI" style={{ maxWidth: "100%", borderRadius: 8 }} />
              ) : <p style={{ color: "#ef5350", fontSize: 13 }}>Certificate missing.</p>}
            </div>
          </div>

          {!provider?.isApproved && (
            <div style={{ display: "flex", gap: 16 }}>
              <button onClick={() => { onClose(); onReject(provider); }} style={{ flex: 1, padding: 14, borderRadius: 14, border: "2px solid #ef5350", color: "#ef5350", fontWeight: 700, background: "none", cursor: "pointer" }}>Decline</button>
              <button onClick={() => { onClose(); onApprove(provider); }} style={{ flex: 1, padding: 14, borderRadius: 14, background: "#8FAE8E", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Approve</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// 5. MAIN DASHBOARD CONTROLLER
// ══════════════════════════════════════════
export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // UI & Data State
  const [loaded, setLoaded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  const { 
      providers, 
      pending, 
      users, 
      orders, 
      feedbacks, 
      menus, 
      subscriptions,
      payoutBalances,
      stats, 
      loading: dataLoading 
  } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);

  // Selection Targets
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [payoutTarget, setPayoutTarget] = useState(null);
  const [adjustmentTarget, setAdjustmentTarget] = useState(null);

  // Action Loading States
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [payoutLoading, setPayoutLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminData());
    setLoaded(true);
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=Nunito:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, [dispatch]);

  const confirmApprove = async () => {
    if (!approveTarget) return;
    setApproving(true);
    try {
      await dispatch(approveProvider(approveTarget._id)).unwrap();
      setApproveTarget(null);
    } catch (err) {
      alert(err || "Approval failed.");
    } finally {
      setApproving(false);
    }
  };

  const confirmReject = async (reason) => {
    if (!rejectTarget) return;
    setRejecting(true);
    try {
      await dispatch(rejectProvider({ providerId: rejectTarget._id, reason })).unwrap();
      setRejectTarget(null);
    } catch (err) {
      alert(err || "Rejection failed.");
    } finally {
      setRejecting(false);
    }
  };

  const handlePayout = async ({ amount, description }) => {
    if (!payoutTarget) return;
    setPayoutLoading(true);
    try {
      await dispatch(processPayout({ providerId: payoutTarget.providerId, amount, description })).unwrap();
      setPayoutTarget(null);
      alert("Payout processed successfully!");
    } catch (err) {
      alert(err || "Payout failed.");
    } finally {
      setPayoutLoading(false);
    }
  };

  const handleAdjustment = async ({ amount, description }) => {
    if (!adjustmentTarget) return;
    setPayoutLoading(true);
    try {
      await dispatch(creditProviderWallet({ providerId: adjustmentTarget.providerId, amount, description })).unwrap();
      setAdjustmentTarget(null);
      alert("Credit adjustment successful!");
    } catch (err) {
      alert(err || "Adjustment failed.");
    } finally {
      setPayoutLoading(false);
    }
  };

  const anim = (d = 0) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.6s ease ${d}ms, transform 0.6s cubic-bezier(.22,.68,0,1.2) ${d}ms`,
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (dataLoading && !loaded) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#E7E6B6", color: "#5a7a50", fontWeight: 700 }}>
        SYNCING COMMAND CENTER...
      </div>
    );
  }

  const statCards = [
    { label: "Platform Users", val: stats.totalUsers, icon: "👥" },
    { label: "Active Kitchens", val: stats.totalProviders, icon: "👩‍🍳" },
    { label: "Menus", val: menus.length, icon: "🍱" },
    { label: "Orders", val: stats.totalOrders, icon: "🛍️" },
    { label: "Total Revenue", val: `₹${stats.totalRevenue?.toLocaleString() || 0}`, icon: "💰" }
  ];

  const adminName = user?.name?.split(" ")[0] || "Admin";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #E7E6B6; }
        ::-webkit-scrollbar-thumb { background: #8FAE8E; border-radius: 10px; }
        .nav-btn {
          display:flex; align-items:center; gap:12px;
          width:100%; padding:14px 18px; border-radius:16px;
          border:none; background:none; cursor:pointer;
          font-family:'Nunito',sans-serif; font-size:15px; font-weight:700;
          color:rgba(255,255,255,0.7); transition:all 0.25s cubic-bezier(.22,.68,0,1.2);
          text-align:left;
        }
        .nav-btn:hover { background:rgba(255,255,255,0.15); color:#fff; transform:translateX(4px); }
        .nav-btn.active { background:rgba(255,255,255,0.25); color:#fff; box-shadow:0 8px 24px rgba(0,0,0,0.12); }
      `}</style>

      {approveTarget && <ApproveModal provider={approveTarget} onClose={() => setApproveTarget(null)} onApprove={confirmApprove} loading={approving} />}
      {rejectTarget && <RejectModal provider={rejectTarget} onClose={() => setRejectTarget(null)} onReject={confirmReject} loading={rejecting} />}
      {viewTarget && <ViewApplicationModal provider={viewTarget} onClose={() => setViewTarget(null)} onApprove={setApproveTarget} onReject={setRejectTarget} />}
      
      {payoutTarget && (
        <PayoutModal 
          provider={payoutTarget} 
          type="debit" 
          onClose={() => setPayoutTarget(null)} 
          onConfirm={handlePayout} 
          loading={payoutLoading} 
        />
      )}
      
      {adjustmentTarget && (
        <PayoutModal 
          provider={adjustmentTarget} 
          type="credit" 
          onClose={() => setAdjustmentTarget(null)} 
          onConfirm={handleAdjustment} 
          loading={payoutLoading} 
        />
      )}

      <aside style={{
        width: collapsed ? 80 : 280, minHeight: "100vh",
        background: "linear-gradient(165deg, #5a7a50 0%, #2d3b2d 100%)",
        display: "flex", flexDirection: "column", padding: "36px 24px",
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100,
        transition: "width 0.35s cubic-bezier(.22,.68,0,1.2)",
        boxShadow: "6px 0 44px rgba(0,0,0,0.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48, cursor: "pointer" }} onClick={() => setCollapsed(!collapsed)}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🛡️</div>
          {!collapsed && <div>
            <div style={{ fontFamily: "'Lora', serif", fontWeight: 800, fontSize: 16, color: "#fff", lineHeight: 1.1 }}>Naari Admin</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 4 }}>Command Center</div>
          </div>}
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {[
            { id: "dashboard", icon: "⊞", label: "Overview" },
            { id: "users", icon: "👥", label: "Users" },
            { id: "providers", icon: "👩‍🍳", label: "Tiffin Providers" },
            { id: "menu", icon: "🍱", label: "Menus" },
            { id: "orders", icon: "🛍️", label: "Orders" },
            { id: "subscriptions", icon: "📅", label: "Subscriptions" },
            { id: "payouts", icon: "💰", label: "Payouts" },
            { id: "feedback", icon: "💬", label: "Feedbacks" }

          ].map(item => (
            <button key={item.id} className={`nav-btn ${activeNav === item.id ? "active" : ""}`} onClick={() => setActiveNav(item.id)}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} style={{ marginTop: "auto", width: "100%", padding: "14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, color: "rgba(255,255,255,0.6)", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
          <span>🚪</span> {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      <main style={{ marginLeft: collapsed ? 80 : 280, flex: 1, padding: "44px", transition: "margin-left 0.35s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36, ...anim(0) }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "#8FA873", marginBottom: 6 }}>Admin Dashboard</p>
            <h1 style={{ fontFamily: "'Lora',serif", fontSize: 32, fontWeight: 700, color: "#2d3b2d" }}>Namaste, <em style={{ color: "#8FA873" }}>{adminName}!</em></h1>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#8FAE8E,#8FA873)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lora',serif", fontWeight: 700, color: "#fff" }}>{adminName[0]}</div>
        </div>

        {activeNav === "dashboard" ? (
          <div style={{ ...anim(100) }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, marginBottom: 40 }}>
              {statCards.map((card, i) => (
                <div key={i} style={{ background: "#fff", padding: "32px", borderRadius: 28, boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{card.icon}</div>
                  <p style={{ fontSize: 12, fontWeight: 800, color: "#aaa", textTransform: "uppercase", marginBottom: 4 }}>{card.label}</p>
                  <h3 style={{ fontSize: 32, color: "#2d3b2d", fontWeight: 800, fontFamily: "'Lora',serif" }}>{card.val}</h3>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", padding: "36px", borderRadius: 32, boxShadow: "0 20px 50px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                <h3 style={{ fontSize: 22, color: "#2d3b2d", fontFamily: "'Lora', serif", fontWeight: 700 }}>Kitchen Applications</h3>
                {pending.length > 0 && <span style={{ padding: "4px 12px", background: "#fef3c7", color: "#92400e", borderRadius: 100, fontSize: 11, fontWeight: 800 }}>{pending.length} PENDING</span>}
              </div>
              {pending.length === 0 ? <p style={{ color: "#aaa", textAlign: "center", padding: "40px" }}>No new applications.</p> : (
                <div style={{ display: "grid", gap: 16 }}>
                  {pending.map(p => (
                    <div key={p._id} style={{ display: "flex", alignItems: "center", padding: "20px 24px", background: "#fcfdfc", border: "1px solid #f0f4f0", borderRadius: 20 }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 700, color: "#2d3b2d" }}>{p.businessName}</h4>
                        <p style={{ fontSize: 13, color: "#888" }}>{p.ownerName} • {p.email}</p>
                      </div>
                      <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={() => setViewTarget(p)} style={{ padding: "10px 20px", borderRadius: 12, border: "1px solid #ddd", background: "#fff", fontWeight: 700, cursor: "pointer" }}>View</button>
                        <button onClick={() => setApproveTarget(p)} style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: "#8FAE8E", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Approve</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ ...anim(100), background: "#fff", padding: "36px", borderRadius: 32, boxShadow: "0 20px 50px rgba(0,0,0,0.03)" }}>
            {activeNav === "users" && <AdminUsers users={users} />}
            {activeNav === "feedback" && <AdminFeedback feedbacks={feedbacks} />}
            {activeNav === "menu" && <AdminMenu menus={menus} />}
            {activeNav === "orders" && (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <th style={{ textAlign: "left", padding: "12px", fontSize: 11, color: "#8FAE8E", textTransform: "uppercase" }}>Order ID</th>
                      <th style={{ textAlign: "left", padding: "12px", fontSize: 11, color: "#8FAE8E", textTransform: "uppercase" }}>Customer</th>
                      <th style={{ textAlign: "left", padding: "12px", fontSize: 11, color: "#8FAE8E", textTransform: "uppercase" }}>Amount</th>
                      <th style={{ textAlign: "right", padding: "12px", fontSize: 11, color: "#8FAE8E", textTransform: "uppercase" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id} style={{ borderBottom: "1px solid #fafafa" }}>
                        <td style={{ padding: "16px 12px", fontSize: 14, fontWeight: 700 }}>#{o._id?.slice(-6).toUpperCase() || "N/A"}</td>
                        <td style={{ padding: "16px 12px", fontSize: 14 }}>{o.user?.name || "Anonymous"}</td>
                        <td style={{ padding: "16px 12px", fontSize: 14, fontWeight: 800 }}>₹{o.totalPrice}</td>
                        <td style={{ padding: "16px 12px", textAlign: "right" }}>
                           <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 800, background: o.status === 'delivered' ? '#e8f5e9' : '#fff3e0', color: o.status === 'delivered' ? '#2e7d32' : '#ef6c00' }}>{o.status?.toUpperCase() || "PENDING"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeNav === "subscriptions" && (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <th style={{ textAlign: "left", padding: "12px", fontSize: 11, color: "#8FAE8E", textTransform: "uppercase" }}>Plan</th>
                      <th style={{ textAlign: "left", padding: "12px", fontSize: 11, color: "#8FAE8E", textTransform: "uppercase" }}>Customer</th>
                      <th style={{ textAlign: "left", padding: "12px", fontSize: 11, color: "#8FAE8E", textTransform: "uppercase" }}>Kitchen</th>
                      <th style={{ textAlign: "right", padding: "12px", fontSize: 11, color: "#8FAE8E", textTransform: "uppercase" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map(s => (
                      <tr key={s._id} style={{ borderBottom: "1px solid #fafafa" }}>
                        <td style={{ padding: "16px 12px", fontSize: 14, fontWeight: 700 }}>{s.planType?.toUpperCase() || "Standard"}</td>
                        <td style={{ padding: "16px 12px", fontSize: 13 }}>{s.user?.name || "Customer"}</td>
                        <td style={{ padding: "16px 12px", fontSize: 13 }}>{s.provider?.businessName || "Kitchen"}</td>
                        <td style={{ padding: "16px 12px", textAlign: "right" }}>
                          <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 800, background: s.status === 'active' ? '#e8f5e9' : '#fff3e0', color: s.status === 'active' ? '#2e7d32' : '#ef6c00' }}>{s.status?.toUpperCase() || "ACTIVE"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeNav === "payouts" && (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <th style={{ textAlign: "left", padding: "12px", fontSize: 11, color: "#8FAE8E", textTransform: "uppercase" }}>Kitchen</th>
                      <th style={{ textAlign: "left", padding: "12px", fontSize: 11, color: "#8FAE8E", textTransform: "uppercase" }}>Balance</th>
                      <th style={{ textAlign: "left", padding: "12px", fontSize: 11, color: "#8FAE8E", textTransform: "uppercase" }}>Total Paid</th>
                      <th style={{ textAlign: "right", padding: "12px", fontSize: 11, color: "#8FAE8E", textTransform: "uppercase" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoutBalances.map(p => (
                      <tr key={p.providerId} style={{ borderBottom: "1px solid #fafafa" }}>
                        <td style={{ padding: "16px 12px" }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{p.businessName}</div>
                          <div style={{ fontSize: 11, color: "#aaa" }}>{p.ownerName}</div>
                        </td>
                        <td style={{ padding: "16px 12px", fontSize: 16, fontWeight: 800, color: "#2d3b2d" }}>₹{p.walletBalance?.toLocaleString()}</td>
                        <td style={{ padding: "16px 12px", fontSize: 14, color: "#888" }}>₹{p.totalPaid?.toLocaleString() || 0}</td>
                        <td style={{ padding: "16px 12px", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button onClick={() => setAdjustmentTarget(p)} style={{ background: "#f0f0f0", border: "none", padding: "8px 12px", borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: "pointer", color: "#666" }}>Adjust</button>
                            <button onClick={() => setPayoutTarget(p)} style={{ background: "#8FAE8E", border: "none", padding: "8px 12px", borderRadius: 10, fontSize: 11, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Payout</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeNav === "providers" && (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <th style={{ textAlign: "left", padding: "12px", fontSize: 11, color: "#8FAE8E", textTransform: "uppercase" }}>Business</th>
                      <th style={{ textAlign: "left", padding: "12px", fontSize: 11, color: "#8FAE8E", textTransform: "uppercase" }}>Chef</th>
                      <th style={{ textAlign: "left", padding: "12px", fontSize: 11, color: "#8FAE8E", textTransform: "uppercase" }}>Phone</th>
                      <th style={{ textAlign: "right", padding: "12px", fontSize: 11, color: "#8FAE8E", textTransform: "uppercase" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map(p => (
                      <tr key={p._id} style={{ borderBottom: "1px solid #fafafa" }}>
                        <td style={{ padding: "16px 12px", fontSize: 14, fontWeight: 700 }}>{p.businessName}</td>
                        <td style={{ padding: "16px 12px", fontSize: 14 }}>{p.ownerName}</td>
                        <td style={{ padding: "16px 12px", fontSize: 14 }}>{p.phone}</td>
                        <td style={{ padding: "16px 12px", textAlign: "right" }}>
                          <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 800, background: p.isActive ? '#e8f5e9' : '#ffebee', color: p.isActive ? '#2e7d32' : '#c62828' }}>{p.isActive ? "ACTIVE" : "INACTIVE"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

