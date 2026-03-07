import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Internal Components for Modular Organization
import { AdminUsers } from "../../components/AdminUsers";
import { AdminMenu } from "../../components/AdminMenu";
import { AdminFeedback } from "../../components/AdminFeedback";

// ══════════════════════════════════════════
// 1. APPROVE MODAL COMPONENT
// ══════════════════════════════════════════
function ApproveModal({ provider, onClose, onApprove, loading }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,30,20,0.7)", backdropFilter: "blur(14px)", padding: 20, animation: "overlayIn 0.3s ease" }}
    >
      <div style={{ background: "#fff", borderRadius: 32, padding: "52px 44px 44px", maxWidth: 440, width: "100%", textAlign: "center", boxShadow: "0 48px 96px rgba(0,0,0,0.3)", position: "relative", overflow: "hidden", animation: "modalIn 0.4s cubic-bezier(.22,.68,0,1.2)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg,#8FAE8E,#D9D9A8)", borderRadius: "32px 32px 0 0" }} />
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: 40, boxShadow: "0 20px 40px rgba(143,174,142,0.4)" }}>👩‍🍳</div>
        <h2 style={{ fontFamily: "'Lora',serif", fontSize: 26, color: "#2d3b2d", marginBottom: 12 }}>Approve Kitchen?</h2>
        <p style={{ color: "#666", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          You are about to authorize <strong>{provider?.businessName}</strong>. This will enable their menu and notify <strong>{provider?.ownerName}</strong> via email.
        </p>
        <div style={{ display: "flex", gap: 14 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "16px", background: "#f5f5f0", border: "none", borderRadius: 16, fontWeight: 700, cursor: "pointer", color: "#888", transition: "0.2s" }}>Cancel</button>
          <button onClick={onApprove} disabled={loading} style={{ flex: 2, padding: "16px", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", color: "#fff", border: "none", borderRadius: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 8px 20px rgba(143,174,142,0.3)" }}>
            {loading ? "Processing..." : "Confirm Approval"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// 2. REJECT MODAL COMPONENT
// ══════════════════════════════════════════
function RejectModal({ provider, onClose, onReject, loading }) {
  const [reason, setReason] = useState("");
  
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(30,10,10,0.7)", backdropFilter: "blur(14px)", padding: 20 }}
    >
      <div style={{ background: "#fff", borderRadius: 32, padding: "44px 40px", maxWidth: 500, width: "100%", boxShadow: "0 48px 96px rgba(0,0,0,0.4)", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#ef5350", borderRadius: "32px 32px 0 0" }} />
        <h2 style={{ fontFamily: "'Lora',serif", fontSize: 24, color: "#2d3b2d", marginBottom: 6 }}>Declining Application</h2>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 28 }}>Kitchen: <span style={{ color: "#ef5350", fontWeight: 700 }}>{provider?.businessName}</span></p>
        
        <div style={{ textAlign: "left" }}>
          <label style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 10, letterSpacing: 1 }}>Reason for Rejection (Sent to Provider)</label>
          <textarea 
            value={reason} 
            onChange={e => setReason(e.target.value)}
            placeholder="Please provide specific feedback (e.g., 'FSSAI document is blurry' or 'Address mismatch')..."
            style={{ width: "100%", padding: 20, borderRadius: 16, border: "2px solid #f0f0f0", fontSize: 15, minHeight: 140, marginBottom: 24, resize: "none", outline: "none", fontFamily: "inherit", transition: "border-color 0.3s" }}
            onFocus={(e) => e.target.style.borderColor = "#ef5350"}
          />
        </div>
        
        <div style={{ display: "flex", gap: 14 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "16px", background: "transparent", border: "2px solid #eee", borderRadius: 16, fontWeight: 700, color: "#999", cursor: "pointer" }}>Go Back</button>
          <button 
            onClick={() => onReject(reason)} 
            disabled={!reason.trim() || loading}
            style={{ flex: 2, padding: "16px", background: "#ef5350", color: "#fff", border: "none", borderRadius: 16, fontWeight: 700, cursor: (!reason.trim() || loading) ? "not-allowed" : "pointer", opacity: !reason.trim() ? 0.6 : 1 }}
          >
            {loading ? "Sending Notification..." : "Confirm Rejection"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// 3. VIEW APPLICATION MODAL
// ══════════════════════════════════════════
function ViewApplicationModal({ provider, onClose, onApprove, onReject }) {
  const isPdf = provider?.fssaiCertificate?.toLowerCase().includes(".pdf");

  const DataField = ({ label, value, fullWidth = false }) => (
    <div style={{ padding: "16px 0", borderBottom: "1px solid #f4f7f4", width: fullWidth ? "100%" : "50%" }}>
      <p style={{ fontSize: 10, fontWeight: 800, color: "#8FAE8E", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 15, color: "#2d3b2d", fontWeight: 600 }}>{value || "Not Provided"}</p>
    </div>
  );

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,30,20,0.65)", backdropFilter: "blur(18px)", padding: 20 }}
    >
      <div style={{ background: "#fff", borderRadius: 36, width: "100%", maxWidth: 650, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 50px 100px rgba(0,0,0,0.25)", animation: "modalIn 0.5s ease" }}>
        <div style={{ padding: "30px 40px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fcfdfc" }}>
          <div>
            <h2 style={{ fontFamily: "'Lora',serif", fontSize: 24, color: "#2d3b2d" }}>Kitchen Dossier</h2>
            <p style={{ fontSize: 13, color: "#aaa" }}>Application ID: {provider?._id?.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} style={{ background: "#f5f5f0", border: "none", width: 40, height: 40, borderRadius: "50%", cursor: "pointer", fontSize: 18, color: "#aaa" }}>✕</button>
        </div>

        <div style={{ padding: "40px", overflowY: "auto", flex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 40 }}>
            <DataField label="Business Entity" value={provider?.businessName} />
            <DataField label="Lead Chef / Owner" value={provider?.ownerName} />
            <DataField label="Registration (FSSAI)" value={provider?.fssaiNumber} />
            <DataField label="Contact Channel" value={provider?.email} />
            <DataField label="Mobile Number" value={provider?.phone} />
            <DataField label="Operational Address" value={provider?.address} fullWidth />
          </div>

          <div style={{ marginBottom: 40 }}>
            <h3 style={{ fontSize: 12, color: "#8FAE8E", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Verified Documentation</h3>
            <div style={{ borderRadius: 24, border: "2px dashed #e0e6e0", overflow: "hidden", background: "#f9faf9", padding: 20, textAlign: "center" }}>
              {provider?.fssaiCertificate ? (
                isPdf ? (
                  <div style={{ padding: 20 }}>
                    <span style={{ fontSize: 50 }}>📜</span>
                    <p style={{ margin: "15px 0", fontWeight: 700, color: "#444" }}>FSSAI_Certificate.pdf</p>
                    <a href={provider.fssaiCertificate} target="_blank" rel="noreferrer" style={{ display: "inline-block", padding: "10px 24px", background: "#8FAE8E", color: "#fff", textDecoration: "none", borderRadius: 12, fontWeight: 700 }}>View Document</a>
                  </div>
                ) : (
                  <img src={provider.fssaiCertificate} alt="Certificate" style={{ width: "100%", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} />
                )
              ) : <p style={{ color: "#ef5350", padding: 40 }}>Notice: Certificate image missing from application.</p>}
            </div>
          </div>

          {!provider?.isApproved && (
            <div style={{ display: "flex", gap: 20 }}>
              <button 
                onClick={() => { onClose(); onReject(provider); }} 
                style={{ flex: 1, padding: 18, borderRadius: 18, border: "2px solid #ef5350", color: "#ef5350", fontWeight: 800, background: "none", cursor: "pointer", transition: "0.3s" }}
              >Decline Kitchen</button>
              <button 
                onClick={() => { onClose(); onApprove(provider); }} 
                style={{ flex: 1, padding: 18, borderRadius: 18, background: "#8FAE8E", border: "none", color: "#fff", fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 20px rgba(143,174,142,0.3)" }}
              >Approve Credentials</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// 4. MAIN DASHBOARD CONTROLLER
// ══════════════════════════════════════════
export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // UI & Data State
  const [loaded, setLoaded] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [stats, setStats] = useState({ totalUsers: 0, totalProviders: 0, totalOrders: 0, totalRevenue: 0 });
  const [allProviders, setAllProviders] = useState([]);
  const [pending, setPending] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  // Selection Targets
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  
  // Action Loading States
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  // Data Fetching Logic
  const fetchAllData = useCallback(async () => {
    if (!token) { navigate("/login"); return; }
    setDataLoading(true);
    try {
      const [sRes, pRes, penRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/stats", { headers }),
        axios.get("http://localhost:5000/api/admin/providers", { headers }),
        axios.get("http://localhost:5000/api/admin/providers/pending", { headers })
      ]);
      
      setStats(sRes.data);
      setAllProviders(pRes.data || []);
      setPending(penRes.data.providers || penRes.data || []);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setDataLoading(false);
      setLoaded(true);
    }
  }, [token, navigate, headers]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Business Logic Handlers
  const confirmApprove = async () => {
    if (!approveTarget) return;
    setApproving(true);
    try {
      await axios.patch(`http://localhost:5000/api/tiffins/approve/${approveTarget._id}`, {}, { headers });
      setAllProviders(current => current.map(p => p._id === approveTarget._id ? { ...p, isApproved: true } : p));
      setPending(current => current.filter(p => p._id !== approveTarget._id));
      setStats(s => ({ ...s, totalProviders: s.totalProviders + 1 }));
      setApproveTarget(null);
    } catch (err) {
      alert("System Error: Failed to approve provider.");
    } finally {
      setApproving(false);
    }
  };

  const confirmReject = async (reason) => {
    if (!rejectTarget) return;
    setRejecting(true);
    try {
      await axios.patch(`http://localhost:5000/api/tiffins/reject/${rejectTarget._id}`, { reason }, { headers });
      setPending(current => current.filter(p => p._id !== rejectTarget._id));
      setAllProviders(current => current.filter(p => p._id !== rejectTarget._id));
      setRejectTarget(null);
    } catch (err) {
      alert("System Error: Failed to process rejection.");
    } finally {
      setRejecting(false);
    }
  };

  if (dataLoading) {
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#E7E6B6", gap: 20 }}>
        <div style={{ width: 40, height: 40, border: "4px solid #8FAE8E", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ fontWeight: 700, color: "#5a7a50", letterSpacing: 1 }}>SECURE ADMIN HANDSHAKE...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito', sans-serif" }}>
      
      {/* LAYERED MODAL SYSTEM */}
      {approveTarget && <ApproveModal provider={approveTarget} onClose={() => setApproveTarget(null)} onApprove={confirmApprove} loading={approving} />}
      {rejectTarget && <RejectModal provider={rejectTarget} onClose={() => setRejectTarget(null)} onReject={confirmReject} loading={rejecting} />}
      {viewTarget && <ViewApplicationModal provider={viewTarget} onClose={() => setViewTarget(null)} onApprove={setApproveTarget} onReject={setRejectTarget} />}

      {/* DYNAMIC SIDEBAR */}
      <aside style={{ width: 280, background: "linear-gradient(180deg, #8FA873 0%, #6b8254 100%)", color: "#fff", padding: "40px 24px", display: "flex", flexDirection: "column", boxShadow: "10px 0 30px rgba(0,0,0,0.05)", zIndex: 10 }}>
        <div style={{ marginBottom: 50 }}>
          <h1 style={{ fontFamily: "'Lora',serif", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Naari Admin</h1>
          <div style={{ height: 3, width: 40, background: "#D9D9A8", borderRadius: 2 }} />
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { id: "dashboard", label: "Overview", icon: "📊" },
            { id: "pending", label: `Applications (${pending.length})`, icon: "⏳" },
            { id: "providers", label: "Kitchen Network", icon: "🍳" },
            { id: "users", label: "Customer Base", icon: "👥" },
            { id: "feedbacks", label: "Reviews", icon: "💬" }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{ 
                padding: "16px 20px", borderRadius: 16, border: "none", textAlign: "left", cursor: "pointer",
                background: activeNav === item.id ? "rgba(255,255,255,0.2)" : "transparent",
                color: "#fff", fontWeight: activeNav === item.id ? 800 : 500, transition: "0.3s", fontSize: 15
              }}
            >
              <span style={{ marginRight: 12 }}>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => { localStorage.clear(); navigate("/login"); }}
          style={{ padding: "16px", borderRadius: 16, background: "rgba(0,0,0,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", fontWeight: 700 }}
        >
          🚪 Terminate Session
        </button>
      </aside>

      {/* SCROLLABLE VIEWPORT */}
      <main style={{ flex: 1, padding: "50px 60px", overflowY: "auto", height: "100vh" }}>
        
        {activeNav === "dashboard" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <header style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 32, color: "#2d3b2d", fontFamily: "'Lora', serif" }}>Platform Health</h2>
              <p style={{ color: "#7a8a7a" }}>Real-time metrics for TiffinsByNaari</p>
            </header>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 30, marginBottom: 50 }}>
               {[
                 { label: "Active Kitchens", val: stats.totalProviders, color: "#8FAE8E", sub: "Verified Partners" },
                 { label: "Pending Reviews", val: pending.length, color: "#D9D9A8", sub: "Action Required" },
                 { label: "Total Orders", val: stats.totalOrders, color: "#8FA873", sub: "Lifetime Volume" },
                 { label: "Revenue", val: `₹${stats.totalRevenue.toLocaleString()}`, color: "#2d3b2d", sub: "Gross Earnings" }
               ].map((card, i) => (
                 <div key={i} style={{ background: "#fff", padding: 30, borderRadius: 28, boxShadow: "0 15px 35px rgba(0,0,0,0.03)" }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: "#aaa", textTransform: "uppercase", marginBottom: 10 }}>{card.label}</p>
                    <h3 style={{ fontSize: 36, color: card.color, marginBottom: 5 }}>{card.val}</h3>
                    <p style={{ fontSize: 13, color: "#888" }}>{card.sub}</p>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeNav === "pending" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <h3 style={{ fontSize: 24, marginBottom: 30, color: "#2d3b2d" }}>Incoming Applications</h3>
            {pending.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center", background: "#fff", borderRadius: 28 }}>
                <p style={{ fontSize: 18, color: "#aaa" }}>All caught up! No pending reviews.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 20 }}>
                {pending.map(p => (
                  <div key={p._id} style={{ display: "flex", alignItems: "center", padding: "24px 32px", background: "#fff", borderRadius: 24, boxShadow: "0 10px 25px rgba(0,0,0,0.02)" }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 18, color: "#2d3b2d", marginBottom: 4 }}>{p.businessName}</h4>
                      <p style={{ fontSize: 14, color: "#888" }}>{p.ownerName} • {p.email}</p>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                       <button onClick={() => setViewTarget(p)} style={{ padding: "12px 24px", borderRadius: 14, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontWeight: 700 }}>Inspect</button>
                       <button onClick={() => setApproveTarget(p)} style={{ padding: "12px 24px", borderRadius: 14, border: "none", background: "#8FAE8E", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Quick Approve</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EXTERNAL MODULES */}
        {activeNav === "users" && <AdminUsers headers={headers} />}
        {activeNav === "feedbacks" && <AdminFeedback headers={headers} />}
        {activeNav === "providers" && <div style={{ background: "#fff", padding: 40, borderRadius: 28 }}><h3>Kitchen Management Table Placeholder</h3><p>Integrate your list component here.</p></div>}
        
      </main>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}