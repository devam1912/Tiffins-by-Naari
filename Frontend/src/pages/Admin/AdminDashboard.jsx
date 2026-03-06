import { AdminOverview } from "../../components/AdminOverview";
import { AdminUsers } from "../../components/AdminUsers";
import { AdminMenu } from "../../components/AdminMenu";

function ApproveModal({ provider, onClose, onApprove, loading }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,30,20,0.6)", backdropFilter: "blur(14px)", padding: 20, animation: "overlayIn 0.25s ease" }}>
      <div style={{ background: "#fff", borderRadius: 28, padding: "52px 44px 44px", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 48px 96px rgba(20,35,20,0.28)", animation: "modalIn 0.45s cubic-bezier(.22,.68,0,1.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: "linear-gradient(90deg,#8FAE8E,#8FA873,#D9D9A8)", borderRadius: "28px 28px 0 0" }} />
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 38, boxShadow: "0 16px 48px rgba(143,174,142,0.45)", animation: "iconPop 0.55s cubic-bezier(.34,1.56,.64,1) 0.15s both" }}>👩‍🍳</div>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "#8FA873", marginBottom: 10 }}>Provider Approval</p>
        <h2 style={{ fontFamily: "'Lora',serif", fontSize: 24, fontWeight: 700, color: "#2d3b2d", lineHeight: 1.25, marginBottom: 10 }}>Approve this kitchen?</h2>
        <p style={{ color: "#777", fontSize: 14, marginBottom: 6 }}><strong style={{ color: "#2d3b2d" }}>{provider?.businessName}</strong></p>
        <p style={{ color: "#aaa", fontSize: 13, marginBottom: 28 }}>by {provider?.ownerName} · {provider?.email}</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "13px", background: "transparent", border: "2px solid #e0e0d0", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#999", fontFamily: "'Nunito',sans-serif", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#ef9a9a"; e.currentTarget.style.color = "#ef5350"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0d0"; e.currentTarget.style.color = "#999"; }}>Cancel</button>
          <button onClick={onApprove} disabled={loading}
            style={{ flex: 1, padding: "13px", background: loading ? "#d4d4bc" : "linear-gradient(135deg,#8FAE8E,#8FA873)", color: "#fff", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Nunito',sans-serif", boxShadow: "0 4px 16px rgba(143,174,142,0.4)", transition: "all 0.25s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? <><span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", display: "inline-block", animation: "spinSlow 0.7s linear infinite" }} /> Approving...</> : "✓ Approve Kitchen"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RejectModal({ provider, onClose, onReject, loading }) {
  const [reason, setReason] = useState("");
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,30,20,0.6)", backdropFilter: "blur(14px)", padding: 20, animation: "overlayIn 0.25s ease" }}>
      <div style={{ background: "#fff", borderRadius: 28, padding: "44px 40px 40px", maxWidth: 460, width: "100%", textAlign: "center", boxShadow: "0 48px 96px rgba(20,35,20,0.28)", animation: "modalIn 0.45s cubic-bezier(.22,.68,0,1.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: "linear-gradient(90deg,#ef5350,#e57373,#ffcdd2)", borderRadius: "28px 28px 0 0" }} />
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#ef5350,#e57373)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 12px 36px rgba(239,83,80,0.35)", animation: "iconPop 0.55s cubic-bezier(.34,1.56,.64,1) 0.15s both" }}>
          <svg width="32" height="32" viewBox="0 0 38 38" fill="none"><path d="M12 12l14 14M26 12L12 26" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" /></svg>
        </div>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "#ef5350", marginBottom: 8 }}>Reject Application</p>
        <h2 style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 700, color: "#2d3b2d", lineHeight: 1.25, marginBottom: 4 }}>Reject this kitchen?</h2>
        <p style={{ color: "#aaa", fontSize: 13, marginBottom: 20 }}><strong style={{ color: "#555" }}>{provider?.businessName}</strong> · {provider?.ownerName}</p>
        <div style={{ textAlign: "left", marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#888", display: "block", marginBottom: 8 }}>Reason <span style={{ color: "#ef5350" }}>*</span></label>
          <textarea value={reason} onChange={e => setReason(e.target.value)}
            placeholder="e.g. FSSAI certificate is expired, please renew and re-apply..."
            rows={4}
            style={{ width: "100%", padding: "14px 16px", border: `2px solid ${reason.trim() ? "rgba(143,174,142,0.5)" : "#e0e0d0"}`, borderRadius: 14, fontSize: 14, fontFamily: "'Nunito',sans-serif", color: "#2d3b2d", background: "#fafafa", outline: "none", resize: "none", lineHeight: 1.6, transition: "border-color 0.2s", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#8FAE8E"}
            onBlur={e => e.target.style.borderColor = reason.trim() ? "rgba(143,174,142,0.5)" : "#e0e0d0"} />
          <p style={{ fontSize: 12, color: "#bbb", marginTop: 6, fontWeight: 600 }}>This will be sent directly to the provider's email.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "13px", background: "transparent", border: "2px solid #e0e0d0", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#999", fontFamily: "'Nunito',sans-serif", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#8FAE8E"; e.currentTarget.style.color = "#5a7a50"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0d0"; e.currentTarget.style.color = "#999"; }}>Cancel</button>
          <button onClick={() => onReject(reason)} disabled={!reason.trim() || loading}
            style={{ flex: 1, padding: "13px", background: !reason.trim() || loading ? "#e0ddd8" : "linear-gradient(135deg,#ef5350,#e57373)", color: !reason.trim() || loading ? "#aaa" : "#fff", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: !reason.trim() || loading ? "not-allowed" : "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.25s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? <><span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", display: "inline-block", animation: "spinSlow 0.7s linear infinite" }} /> Sending...</> : "✕ Send Rejection"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loaded, setLoaded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [allProviders, setAllProviders] = useState([]);
  const [pending, setPending] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=Nunito:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    if (!token) { navigate("/login"); return; }
    loadAll();
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const loadAll = async () => {
    try {
      const [statsR, provR, pendR, usersR, ordersR] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/stats", { headers }),
        axios.get("http://localhost:5000/api/admin/providers", { headers }),
        axios.get("http://localhost:5000/api/admin/providers/pending", { headers }),
        axios.get("http://localhost:5000/api/admin/users", { headers }),
        axios.get("http://localhost:5000/api/admin/orders", { headers }),
      ]);
      setStats(statsR.data);
      setAllProviders(provR.data);
      setPending(pendR.data.providers || []);
      setAllUsers(usersR.data);
      setAllOrders(ordersR.data);
    } catch (err) {
      console.error("Admin load error:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!approveTarget) return;
    setApproving(true);
    try {
      await axios.patch(`http://localhost:5000/api/tiffins/approve/${approveTarget._id}`, {}, { headers });
      setAllProviders(prev => prev.map(p => p._id === approveTarget._id ? { ...p, isApproved: true } : p));
      setPending(prev => prev.filter(p => p._id !== approveTarget._id));
      if (stats) setStats(s => ({ ...s, totalProviders: s.totalProviders + 1 }));
      setApproveTarget(null);
    } catch (err) {
      console.error("Approve error:", err);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (reason) => {
    if (!rejectTarget) return;
    setRejecting(true);
    try {
      await axios.patch(`http://localhost:5000/api/tiffins/reject/${rejectTarget._id}`, { reason }, { headers });
      setPending(prev => prev.filter(p => p._id !== rejectTarget._id));
      setAllProviders(prev => prev.filter(p => p._id !== rejectTarget._id));
      setRejectTarget(null);
    } catch (err) {
      console.error("Reject error:", err);
    } finally {
      setRejecting(false);
    }
  };

  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); };

  const anim = (d = 0) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.6s ease ${d}ms, transform 0.6s cubic-bezier(.22,.68,0,1.2) ${d}ms`,
  });

  const navItems = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "providers", icon: "🍳", label: "All Kitchens" },
    { id: "pending", icon: "⏳", label: "Pending", badge: pending.length },
    { id: "menus", icon: "🍱", label: "Menus" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "orders", icon: "📦", label: "Orders" },
  ];

  const filteredProviders = allProviders.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.businessName?.toLowerCase().includes(q) || p.ownerName?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q);
    const matchF = filterStatus === "all" || (filterStatus === "active" && p.isApproved) || (filterStatus === "pending" && !p.isApproved);
    return matchQ && matchF;
  });

  const statCards = stats ? [
    { label: "Total Users", value: (stats.totalUsers || 0) + (stats.totalProviders || 0), sub: `${stats.totalUsers || 0} customers · ${stats.totalProviders || 0} kitchens`, icon: "👥", grad: "linear-gradient(135deg,#8FAE8E,#8FA873)", shadow: "rgba(143,174,142,0.45)", textLight: true },
    { label: "Active Kitchens", value: stats.totalProviders || 0, sub: `${pending.length} pending approval`, icon: "🍳", grad: "linear-gradient(135deg,#a8c5a0,#6b9e5e)", shadow: "rgba(107,158,94,0.38)", textLight: true },
    { label: "Total Orders", value: stats.totalOrders || 0, sub: "All-time platform orders", icon: "📦", grad: "rgba(255,255,255,0.85)", shadow: "rgba(143,174,142,0.18)", textLight: false, border: "1.5px solid rgba(143,174,142,0.3)" },
    { label: "Gross Revenue", value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, sub: "Total amount collected", icon: "💰", grad: "linear-gradient(135deg,#D9D9A8,#c5ce88)", shadow: "rgba(180,190,100,0.32)", textLight: false },
  ] : [];

  const SIDEBAR_W = collapsed ? 72 : 240;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito',sans-serif" }}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#E7E6B6}::-webkit-scrollbar-thumb{background:#8FAE8E;border-radius:10px}
        @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulseDot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.55);opacity:0.35}}
        @keyframes overlayIn{from{opacity:0}to{opacity:1}}
        @keyframes modalIn{from{opacity:0;transform:scale(0.88) translateY(30px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes iconPop{0%{transform:scale(0) rotate(-15deg);opacity:0}65%{transform:scale(1.2) rotate(4deg)}100%{transform:scale(1) rotate(0);opacity:1}}
        @keyframes popIn{from{opacity:0;transform:scale(0.92) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes badgePop{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
        .nav-btn{display:flex;align-items:center;gap:12px;width:100%;padding:12px 16px;border-radius:14px;border:none;background:none;cursor:pointer;font-family:'Nunito',sans-serif;font-size:14px;font-weight:600;color:rgba(255,255,255,0.72);transition:all 0.22s ease;text-align:left;position:relative;overflow:hidden;white-space:nowrap}
        .nav-btn:hover{background:rgba(255,255,255,0.14)!important;color:#fff!important;transform:translateX(3px)}
        .nav-btn.active{background:rgba(255,255,255,0.22)!important;color:#fff!important;box-shadow:0 4px 16px rgba(0,0,0,0.08)}
        .nav-btn.active::before{content:'';position:absolute;left:0;top:22%;bottom:22%;width:3px;background:#fff;border-radius:2px}
        .stat-card:hover{transform:translateY(-4px)!important;box-shadow:0 20px 48px rgba(90,120,70,0.22)!important}
        .row-hover:hover{background:rgba(143,174,142,0.06)!important}
        .approve-btn:hover{background:linear-gradient(135deg,#8FAE8E,#8FA873)!important;color:#fff!important;box-shadow:0 4px 14px rgba(143,174,142,0.4)!important}
        .reject-btn:hover{background:linear-gradient(135deg,#ef5350,#e57373)!important;color:#fff!important;box-shadow:0 4px 14px rgba(239,83,80,0.35)!important}
        .tab-btn:hover{background:rgba(143,174,142,0.12)!important;color:#4a7040!important}
        .search-wrap:focus-within{box-shadow:0 0 0 3px rgba(143,174,142,0.18)!important;border-color:#8FAE8E!important}
      `}</style>

      {/* MODALS — outside overflow div */}
      {approveTarget && <ApproveModal provider={approveTarget} onClose={() => setApproveTarget(null)} onApprove={handleApprove} loading={approving} />}
      {rejectTarget && <RejectModal provider={rejectTarget} onClose={() => setRejectTarget(null)} onReject={handleReject} loading={rejecting} />}

      {/* SIDEBAR */}
      <div style={{ width: SIDEBAR_W, minHeight: "100vh", flexShrink: 0, background: "linear-gradient(170deg,#8FA873,#6b8a5e)", display: "flex", flexDirection: "column", transition: "width 0.32s cubic-bezier(.22,.68,0,1.2)", position: "sticky", top: 0, overflow: "hidden", boxShadow: "4px 0 32px rgba(90,120,70,0.18)", zIndex: 100 }}>
        <div style={{ position: "absolute", width: 240, height: 240, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.07)", top: "-80px", left: "-80px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.1)", bottom: "18%", right: "-50px", pointerEvents: "none", animation: "spinSlow 30s linear infinite" }} />
        <div style={{ padding: collapsed ? "22px 0" : "22px 20px", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 8, position: "relative", zIndex: 1 }}>
          {!collapsed && <div><div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 2 }}>Admin Panel</div><div style={{ fontFamily: "'Lora',serif", fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>Tiffins<em>ByNaari</em></div></div>}
          <button onClick={() => setCollapsed(c => !c)} style={{ width: 34, height: 34, borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.12)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15, transition: "all 0.2s", flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}>{collapsed ? "›" : "‹"}</button>
        </div>
        <nav style={{ flex: 1, padding: collapsed ? "8px" : "8px 12px", display: "flex", flexDirection: "column", gap: 4, position: "relative", zIndex: 1 }}>
          {navItems.map(({ id, icon, label, badge }) => (
            <button key={id} className={`nav-btn ${activeNav === id ? "active" : ""}`} onClick={() => setActiveNav(id)}
              style={{ justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "12px" : "12px 16px" }} title={collapsed ? label : undefined}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
              {!collapsed && <span style={{ flex: 1 }}>{label}</span>}
              {!collapsed && badge > 0 && <span style={{ background: "#ef5350", color: "#fff", fontSize: 10, fontWeight: 800, borderRadius: 20, padding: "2px 7px", animation: "badgePop 0.4s cubic-bezier(.34,1.56,.64,1)" }}>{badge}</span>}
              {collapsed && badge > 0 && <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#ef5350", animation: "pulseDot 1.8s ease-in-out infinite" }} />}
            </button>
          ))}
        </nav>
        <div style={{ padding: collapsed ? "12px 8px" : "12px", borderTop: "1px solid rgba(255,255,255,0.1)", position: "relative", zIndex: 1 }}>
          <button onClick={logout} className="nav-btn" style={{ justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "12px" : "12px 16px", color: "rgba(255,150,150,0.8)" }}>
            <span style={{ fontSize: 18 }}>⏻</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflowY: "auto", padding: "36px 40px", minWidth: 0 }}>
        {dataLoading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", border: "4px solid rgba(143,174,142,0.2)", borderTopColor: "#8FA873", animation: "spinSlow 0.8s linear infinite" }} />
            <p style={{ fontFamily: "'Lora',serif", fontSize: 18, color: "#5a7a50", fontWeight: 600 }}>Loading admin data...</p>
          </div>
        )}

        {!dataLoading && (<>

          {/* DASHBOARD */}
          {activeNav === "dashboard" && (
            <div style={{ animation: "popIn 0.4s cubic-bezier(.22,.68,0,1.2)" }}>
              <div style={{ marginBottom: 32, ...anim(0) }}>
                <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3.5, textTransform: "uppercase", color: "#8FA873", marginBottom: 8 }}>Admin Command Centre</p>
                <h1 style={{ fontFamily: "'Lora',serif", fontSize: 36, fontWeight: 700, color: "#2d3b2d", lineHeight: 1.1, marginBottom: 6 }}>System <em>Insights</em></h1>
                <p style={{ color: "#999", fontSize: 15 }}>Welcome back, Admin. Here's what's happening on the platform.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 18, marginBottom: 36 }}>
                {statCards.map(({ label, value, sub, icon, grad, shadow, textLight, border }, i) => (
                  <div key={i} className="stat-card" style={{ background: grad, borderRadius: 22, padding: "24px 22px", boxShadow: `0 8px 28px ${shadow}`, border: border || "none", transition: "all 0.3s", cursor: "default", ...anim(80 + i * 70) }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
                    <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase", color: textLight ? "rgba(255,255,255,0.7)" : "#8FA873", marginBottom: 6 }}>{label}</p>
                    <h2 style={{ fontFamily: "'Lora',serif", fontSize: 34, fontWeight: 700, color: textLight ? "#fff" : "#2d3b2d", lineHeight: 1, marginBottom: 8 }}>{value}</h2>
                    <p style={{ fontSize: 12, color: textLight ? "rgba(255,255,255,0.65)" : "#aaa", fontWeight: 600 }}>{sub}</p>
                  </div>
                ))}
              </div>

              {pending.length > 0 && (
                <div style={{ background: "linear-gradient(135deg,rgba(255,152,0,0.12),rgba(255,193,7,0.08))", border: "1.5px solid rgba(255,152,0,0.3)", borderRadius: 18, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 32, ...anim(320) }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 14, background: "rgba(255,152,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⏳</div>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: 14, color: "#7a4f00", marginBottom: 2 }}>{pending.length} kitchen{pending.length > 1 ? "s" : ""} awaiting approval</p>
                      <p style={{ fontSize: 13, color: "#a06020", fontWeight: 600 }}>Review and approve pending provider applications</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveNav("pending")} style={{ background: "linear-gradient(135deg,#ff9800,#ffa726)", color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Nunito',sans-serif", whiteSpace: "nowrap" }}>Review Now →</button>
                </div>
              )}

              <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)", borderRadius: 22, overflow: "hidden", border: "1px solid rgba(143,174,142,0.2)", boxShadow: "0 8px 32px rgba(90,120,70,0.1)", ...anim(360) }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(143,174,142,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontFamily: "'Lora',serif", fontSize: 18, fontWeight: 700, color: "#2d3b2d", marginBottom: 2 }}>Recent Kitchens</h3>
                    <p style={{ fontSize: 13, color: "#aaa", fontWeight: 600 }}>{allProviders.length} total registered</p>
                  </div>
                  <button onClick={() => setActiveNav("providers")} style={{ background: "rgba(143,174,142,0.15)", border: "1.5px solid rgba(143,174,142,0.3)", borderRadius: 12, padding: "8px 18px", fontSize: 13, fontWeight: 700, color: "#5a7a50", cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#8FAE8E,#8FA873)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(143,174,142,0.15)"; e.currentTarget.style.color = "#5a7a50"; }}>View all →</button>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr style={{ background: "rgba(143,174,142,0.07)" }}>
                    {["Kitchen", "Owner", "Status"].map(h => <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "#aaa" }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {allProviders.slice(0, 5).map(p => (
                      <tr key={p._id} className="row-hover" style={{ borderTop: "1px solid rgba(143,174,142,0.1)", transition: "background 0.2s" }}>
                        <td style={{ padding: "14px 20px", fontWeight: 800, fontSize: 14, color: "#2d3b2d" }}>{p.businessName}</td>
                        <td style={{ padding: "14px 20px" }}><p style={{ fontWeight: 700, fontSize: 13, color: "#555" }}>{p.ownerName}</p><p style={{ fontSize: 12, color: "#bbb" }}>{p.phone}</p></td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ background: p.isApproved ? "rgba(76,175,80,0.12)" : "rgba(255,152,0,0.12)", color: p.isApproved ? "#388e3c" : "#e65100", border: `1.5px solid ${p.isApproved ? "rgba(76,175,80,0.3)" : "rgba(255,152,0,0.3)"}`, borderRadius: 20, padding: "4px 12px", fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>
                            {p.isApproved ? "✓ Active" : "⏳ Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Recent Activity — Orders + Users side by side */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 18, ...anim(420) }}>

                {/* Recent Orders */}
                <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)", borderRadius: 22, overflow: "hidden", border: "1px solid rgba(143,174,142,0.2)", boxShadow: "0 8px 32px rgba(90,120,70,0.08)" }}>
                  <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(143,174,142,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ fontFamily: "'Lora',serif", fontSize: 16, fontWeight: 700, color: "#2d3b2d", marginBottom: 2 }}>Recent Orders</h3>
                      <p style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>{allOrders.length} total orders</p>
                    </div>
                    <button onClick={() => setActiveNav("orders")} style={{ background: "rgba(143,174,142,0.12)", border: "1.5px solid rgba(143,174,142,0.25)", borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "#5a7a50", cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#8FAE8E,#8FA873)"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(143,174,142,0.12)"; e.currentTarget.style.color = "#5a7a50"; }}>View all →</button>
                  </div>
                  {allOrders.length === 0 ? (
                    <div style={{ padding: "32px", textAlign: "center", color: "#ccc", fontSize: 13, fontWeight: 600 }}>📦 No orders yet</div>
                  ) : allOrders.slice(0, 5).map(o => (
                    <div key={o._id} className="row-hover" style={{ padding: "14px 22px", borderBottom: "1px solid rgba(143,174,142,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "background 0.2s" }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 13, color: "#2d3b2d", marginBottom: 2 }}>{o.user?.name || "—"}</p>
                        <p style={{ fontSize: 11, color: "#bbb", fontWeight: 600 }}>{o.provider?.businessName || "—"} · <span style={{ fontFamily: "monospace" }}>#{o._id?.slice(-6).toUpperCase()}</span></p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontWeight: 800, fontSize: 13, color: "#2d3b2d", marginBottom: 4 }}>₹{o.amountPaid?.toLocaleString() || "—"}</p>
                        <span style={{ background: o.status === "delivered" ? "rgba(76,175,80,0.12)" : o.status === "cancelled" ? "rgba(239,83,80,0.1)" : "rgba(255,152,0,0.1)", color: o.status === "delivered" ? "#388e3c" : o.status === "cancelled" ? "#c62828" : "#e65100", border: `1px solid ${o.status === "delivered" ? "rgba(76,175,80,0.3)" : o.status === "cancelled" ? "rgba(239,83,80,0.25)" : "rgba(255,152,0,0.3)"}`, borderRadius: 20, padding: "2px 10px", fontSize: 9, fontWeight: 800, textTransform: "capitalize" }}>
                          {o.status || "processing"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Users */}
                <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)", borderRadius: 22, overflow: "hidden", border: "1px solid rgba(143,174,142,0.2)", boxShadow: "0 8px 32px rgba(90,120,70,0.08)" }}>
                  <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(143,174,142,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ fontFamily: "'Lora',serif", fontSize: 16, fontWeight: 700, color: "#2d3b2d", marginBottom: 2 }}>Recent Users</h3>
                      <p style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>{allUsers.length} total registered</p>
                    </div>
                    <button onClick={() => setActiveNav("users")} style={{ background: "rgba(143,174,142,0.12)", border: "1.5px solid rgba(143,174,142,0.25)", borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "#5a7a50", cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#8FAE8E,#8FA873)"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(143,174,142,0.12)"; e.currentTarget.style.color = "#5a7a50"; }}>View all →</button>
                  </div>
                  {allUsers.length === 0 ? (
                    <div style={{ padding: "32px", textAlign: "center", color: "#ccc", fontSize: 13, fontWeight: 600 }}>👥 No users yet</div>
                  ) : allUsers.slice(0, 5).map(u => (
                    <div key={u._id} className="row-hover" style={{ padding: "14px 22px", borderBottom: "1px solid rgba(143,174,142,0.08)", display: "flex", alignItems: "center", gap: 14, transition: "background 0.2s" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                        {u.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: 13, color: "#2d3b2d", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</p>
                        <p style={{ fontSize: 11, color: "#bbb", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</p>
                      </div>
                      <span style={{ background: "rgba(143,174,142,0.12)", color: "#4a7040", border: "1px solid rgba(143,174,142,0.25)", borderRadius: 20, padding: "2px 10px", fontSize: 9, fontWeight: 800, textTransform: "uppercase", flexShrink: 0 }}>
                        {u.role || "customer"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ USERS ══ */}
          {activeNav === "users" && (
            <div style={{ animation: "popIn 0.4s cubic-bezier(.22,.68,0,1.2)" }}>
              <AdminUsers users={allUsers} />
            </div>
          )}

          {/* ══ MENUS ══ */}
          {activeNav === "menus" && (
            <div style={{ animation: "popIn 0.4s cubic-bezier(.22,.68,0,1.2)" }}>
              <AdminMenu />
            </div>
          )}

          {/* ══ ORDERS ══ */}
          {activeNav === "orders" && (
            <div style={{ animation: "popIn 0.4s cubic-bezier(.22,.68,0,1.2)" }}>
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3.5, textTransform: "uppercase", color: "#8FA873", marginBottom: 8 }}>Order Management</p>
                <h1 style={{ fontFamily: "'Lora',serif", fontSize: 32, fontWeight: 700, color: "#2d3b2d", marginBottom: 6 }}>All Orders</h1>
                <p style={{ color: "#999", fontSize: 14 }}>{allOrders.length} orders processed on the platform</p>
              </div>

              <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)", borderRadius: 22, overflow: "hidden", border: "1px solid rgba(143,174,142,0.2)", boxShadow: "0 8px 32px rgba(90,120,70,0.1)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(143,174,142,0.07)" }}>
                      {["Order ID", "Customer", "Kitchen", "Amount", "Status", "Date"].map(h => (
                        <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "#aaa" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.length === 0 ? (
                      <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#bbb", fontSize: 15 }}>No orders found</td></tr>
                    ) : allOrders.map((o) => (
                      <tr key={o._id} className="row-hover" style={{ borderTop: "1px solid rgba(143,174,142,0.1)", transition: "background 0.2s" }}>
                        <td style={{ padding: "14px 20px", fontSize: 11, color: "#bbb", fontWeight: 700, fontFamily: "monospace" }}>#{o._id?.slice(-8).toUpperCase()}</td>
                        <td style={{ padding: "14px 20px", fontWeight: 700, fontSize: 14, color: "#444" }}>{o.user?.name || "—"}</td>
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#666", fontWeight: 600 }}>{o.provider?.businessName || "—"}</td>
                        <td style={{ padding: "14px 20px", fontWeight: 800, fontSize: 14, color: "#2d3b2d" }}>₹{o.amountPaid?.toLocaleString() || "—"}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{
                            background: o.status === "delivered" ? "rgba(76,175,80,0.12)" : o.status === "cancelled" ? "rgba(239,83,80,0.1)" : "rgba(255,152,0,0.1)",
                            color: o.status === "delivered" ? "#388e3c" : o.status === "cancelled" ? "#c62828" : "#e65100",
                            border: `1.5px solid ${o.status === "delivered" ? "rgba(76,175,80,0.3)" : o.status === "cancelled" ? "rgba(239,83,80,0.25)" : "rgba(255,152,0,0.3)"}`,
                            borderRadius: 20, padding: "4px 12px", fontSize: 10, fontWeight: 800, textTransform: "capitalize",
                          }}>
                            {o.status || "processing"}
                          </span>
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: 12, color: "#bbb", fontWeight: 600 }}>
                          {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ ALL KITCHENS ══ */}
          {activeNav === "providers" && (
            <div style={{ animation: "popIn 0.4s cubic-bezier(.22,.68,0,1.2)" }}>
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3.5, textTransform: "uppercase", color: "#8FA873", marginBottom: 8 }}>Kitchen Directory</p>
                <h1 style={{ fontFamily: "'Lora',serif", fontSize: 32, fontWeight: 700, color: "#2d3b2d", marginBottom: 6 }}>All Kitchens</h1>
                <p style={{ color: "#999", fontSize: 14 }}>{allProviders.length} providers registered on the platform</p>
              </div>

              {/* Filters */}
              <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                <div className="search-wrap" style={{ flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.8)", border: "1.5px solid #e0e0d0", borderRadius: 14, padding: "10px 16px", transition: "all 0.2s" }}>
                  <span style={{ fontSize: 16 }}>🔍</span>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search kitchens, owners..."
                    style={{ border: "none", background: "none", outline: "none", fontSize: 14, fontFamily: "'Nunito',sans-serif", color: "#2d3b2d", flex: 1 }} />
                </div>
                {["all", "active", "pending"].map(f => (
                  <button key={f} className="tab-btn" onClick={() => setFilterStatus(f)}
                    style={{ padding: "10px 20px", borderRadius: 14, border: `1.5px solid ${filterStatus === f ? "#8FAE8E" : "#e0e0d0"}`, background: filterStatus === f ? "linear-gradient(135deg,#8FAE8E,#8FA873)" : "rgba(255,255,255,0.7)", color: filterStatus === f ? "#fff" : "#888", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.2s", textTransform: "capitalize" }}>
                    {f === "all" ? "All" : f === "active" ? "✓ Active" : "⏳ Pending"}
                  </button>
                ))}
              </div>

              <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)", borderRadius: 22, overflow: "hidden", border: "1px solid rgba(143,174,142,0.2)", boxShadow: "0 8px 32px rgba(90,120,70,0.1)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(143,174,142,0.07)" }}>
                      {["Kitchen / Business", "Owner", "Contact", "Status", "Action"].map(h => (
                        <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "#aaa" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProviders.length === 0 ? (
                      <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#bbb", fontSize: 15, fontWeight: 600 }}>No kitchens found</td></tr>
                    ) : filteredProviders.map((p) => (
                      <tr key={p._id} className="row-hover" style={{ borderTop: "1px solid rgba(143,174,142,0.1)", transition: "background 0.2s" }}>
                        <td style={{ padding: "16px 20px" }}>
                          <p style={{ fontWeight: 800, fontSize: 14, color: "#2d3b2d", marginBottom: 2 }}>{p.businessName}</p>
                          <p style={{ fontSize: 11, color: "#ccc", fontWeight: 600 }}>ID: {p._id?.slice(-6)}</p>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <p style={{ fontWeight: 700, fontSize: 14, color: "#444" }}>{p.ownerName}</p>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <p style={{ fontSize: 13, color: "#666", fontWeight: 600 }}>{p.email}</p>
                          <p style={{ fontSize: 12, color: "#bbb" }}>{p.phone}</p>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ background: p.isApproved ? "rgba(76,175,80,0.12)" : "rgba(255,152,0,0.12)", color: p.isApproved ? "#388e3c" : "#e65100", border: `1.5px solid ${p.isApproved ? "rgba(76,175,80,0.3)" : "rgba(255,152,0,0.3)"}`, borderRadius: 20, padding: "4px 12px", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
                            {p.isApproved ? "✓ Active" : "⏳ Pending"}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          {!p.isApproved && (
                            <div style={{ display: "flex", gap: 6 }}>
                              <button className="approve-btn" onClick={() => setApproveTarget(p)}
                                style={{ background: "rgba(143,174,142,0.12)", border: "1.5px solid rgba(143,174,142,0.35)", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 800, color: "#5a7a50", cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.2s" }}>
                                ✓
                              </button>
                              <button className="reject-btn" onClick={() => setRejectTarget(p)}
                                style={{ background: "rgba(239,83,80,0.06)", border: "1.5px solid rgba(239,83,80,0.25)", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 800, color: "#ef5350", cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.2s" }}>
                                ✕
                              </button>
                            </div>
                          )}
                          {p.isApproved && <span style={{ fontSize: 18, color: "#4caf50" }}>✓</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ PENDING APPROVALS ══ */}
          {activeNav === "pending" && (
            <div style={{ animation: "popIn 0.4s cubic-bezier(.22,.68,0,1.2)" }}>
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3.5, textTransform: "uppercase", color: "#8FA873", marginBottom: 8 }}>Action Required</p>
                <h1 style={{ fontFamily: "'Lora',serif", fontSize: 32, fontWeight: 700, color: "#2d3b2d", marginBottom: 6 }}>Pending Approvals</h1>
                <p style={{ color: "#999", fontSize: 14 }}>{pending.length} application{pending.length !== 1 ? "s" : ""} waiting for your review</p>
              </div>

              {pending.length === 0 ? (
                <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 22, padding: "60px 40px", textAlign: "center", border: "1px solid rgba(143,174,142,0.2)" }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
                  <h3 style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 700, color: "#2d3b2d", marginBottom: 8 }}>All caught up!</h3>
                  <p style={{ color: "#aaa", fontSize: 15, fontWeight: 600 }}>No pending provider applications right now.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
                  {pending.map((p, i) => (
                    <div key={p._id} style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", borderRadius: 22, padding: "26px", border: "1.5px solid rgba(255,152,0,0.2)", boxShadow: "0 6px 24px rgba(90,120,70,0.08)", animation: `popIn 0.4s cubic-bezier(.22,.68,0,1.2) ${i * 60}ms both` }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(255,152,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👩‍🍳</div>
                        <span style={{ background: "rgba(255,152,0,0.12)", color: "#e65100", border: "1.5px solid rgba(255,152,0,0.3)", borderRadius: 20, padding: "4px 12px", fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>⏳ Pending</span>
                      </div>
                      <h3 style={{ fontWeight: 800, fontSize: 16, color: "#2d3b2d", marginBottom: 4 }}>{p.businessName}</h3>
                      <p style={{ fontSize: 13, color: "#777", fontWeight: 600, marginBottom: 2 }}>👤 {p.ownerName}</p>
                      <p style={{ fontSize: 13, color: "#aaa", fontWeight: 600, marginBottom: 2 }}>📧 {p.email}</p>
                      <p style={{ fontSize: 13, color: "#aaa", fontWeight: 600, marginBottom: 4 }}>📱 {p.phone}</p>
                      {p.fssaiNumber && <p style={{ fontSize: 12, color: "#bbb", fontWeight: 600, marginBottom: 16 }}>FSSAI: {p.fssaiNumber}</p>}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="approve-btn" onClick={() => setApproveTarget(p)}
                          style={{ flex: 1, padding: "12px", background: "rgba(143,174,142,0.12)", border: "1.5px solid rgba(143,174,142,0.3)", borderRadius: 12, fontSize: 14, fontWeight: 800, color: "#5a7a50", cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.25s" }}>
                          ✓ Approve
                        </button>
                        <button className="reject-btn" onClick={() => setRejectTarget(p)}
                          style={{ flex: 1, padding: "12px", background: "rgba(239,83,80,0.06)", border: "1.5px solid rgba(239,83,80,0.25)", borderRadius: 12, fontSize: 14, fontWeight: 800, color: "#ef5350", cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.25s" }}>
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>)}
      </div >
    </div >
  );
}