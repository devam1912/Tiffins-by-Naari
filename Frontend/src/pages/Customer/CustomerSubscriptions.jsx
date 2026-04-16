import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../components/Customer/Sidebar";
import { logout } from "../../store/authSlice";

export default function CustomerSubscriptions() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("subscriptions");
  const [loaded, setLoaded] = useState(false);

  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ address: "Fetching location...", loading: true });

  // Modal State
  const [modalType, setModalType] = useState(null); // 'pause', 'cancel', null
  const [selectedSub, setSelectedSub] = useState(null);
  const [pauseStart, setPauseStart] = useState("");
  const [pauseEnd, setPauseEnd] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  if (!token) { navigate("/login"); return null; }

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get("http://localhost:5000/api/subscriptions/my-subscriptions", { headers });
      setSubscriptions(res.data.data || []);
      setError(null);
    } catch (err) {
      console.error("Fetch subscriptions error:", err);
      setError(`Failed to load: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Geolocation for sidebar
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || "";
            const suburb = data.address.suburb || data.address.neighbourhood || "";
            setLocation({ address: suburb ? `${suburb}, ${city}` : city || "Location Found", loading: false });
          } catch (error) {
            setLocation({ address: "Location unavailable", loading: false });
          }
        },
        () => setLocation({ address: "Location access denied", loading: false })
      );
    } else {
      setLocation({ address: "Geolocation not supported", loading: false });
    }

    // Fonts
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=Nunito:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    fetchSubscriptions();
    setTimeout(() => setLoaded(true), 80);
  }, [token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // ----- ACTION HANDLERS -----

  const handleResume = async (id) => {
    try {
      setActionLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      await axios.patch(`http://localhost:5000/api/subscriptions/${id}/resume`, {}, { headers });
      await fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resume subscription");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePauseSubmit = async () => {
    if (!pauseStart || !pauseEnd) {
      alert("Please select both start and end dates.");
      return;
    }
    try {
      setActionLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      await axios.patch(`http://localhost:5000/api/subscriptions/${selectedSub}/pause`, {
        pauseStart,
        pauseEnd
      }, { headers });
      setModalType(null);
      await fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to pause subscription");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubmit = async () => {
    try {
      setActionLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      await axios.patch(`http://localhost:5000/api/subscriptions/${selectedSub}/cancel`, {}, { headers });
      setModalType(null);
      await fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel subscription");
    } finally {
      setActionLoading(false);
    }
  };

  const anim = (delay = 0) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
  });

  const getStatusBadge = (status) => {
    const map = {
      active: { bg: "#e8f5e9", color: "#2e7d32", label: "Active" },
      paused: { bg: "#fff8e1", color: "#e65100", label: "Paused" },
      cancelled: { bg: "#ffebee", color: "#c62828", label: "Cancelled" },
      completed: { bg: "#e3f2fd", color: "#1565c0", label: "Completed" },
      pending: { bg: "#f5f5f5", color: "#616161", label: "Pending" },
    };
    return map[status] || map.pending;
  };

  const getPlanBadge = (planType) => {
    const map = {
      weekly: { bg: "#e3f2fd", color: "#1565c0" },
      monthly: { bg: "#f3e5f5", color: "#7b1fa2" },
      yearly: { bg: "#e8f5e9", color: "#2e7d32" },
    };
    return map[planType] || { bg: "#f5f5f5", color: "#616161" };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #E7E6B6; }
        ::-webkit-scrollbar-thumb { background: #8FAE8E; border-radius: 10px; }
        
        .sub-card { transition: all 0.3s cubic-bezier(.22,.68,0,1.2); }
        .sub-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(143,174,142,0.22)!important; }
        
        .action-btn { transition: all 0.2s ease; cursor: pointer; border: none; font-family: 'Nunito', sans-serif; font-weight: 700; border-radius: 12px; padding: 10px 16px; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; }
        .action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-pause { background: #fff8e1; color: #e65100; border: 1px solid #ffe0b2; }
        .btn-pause:hover:not(:disabled) { background: #ffe0b2; }
        .btn-resume { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
        .btn-resume:hover:not(:disabled) { background: #c8e6c9; }
        .btn-cancel { background: #ffebee; color: #c62828; border: 1px solid #ffcdd2; }
        .btn-cancel:hover:not(:disabled) { background: #ffcdd2; }

        /* Sidebar styles */
        .nav-btn {
          display:flex; align-items:center; gap:12px;
          width:100%; padding:12px 16px; border-radius:14px;
          border:none; background:none; cursor:pointer;
          font-family:'Nunito',sans-serif; font-size:15px; font-weight:600;
          color:rgba(255,255,255,0.7); transition:all 0.22s ease;
          text-align:left; position:relative; overflow:hidden;
        }
        .nav-btn:hover { background:rgba(255,255,255,0.14)!important; color:#fff!important; transform:translateX(3px); }
        .nav-btn.active { background:rgba(255,255,255,0.22)!important; color:#fff!important; box-shadow:0 4px 16px rgba(0,0,0,0.08); }

        .kitchen-cta {
            background: rgba(255, 255, 255, 0.1) !important;
            border: 1px dashed rgba(255, 255, 255, 0.3) !important;
            margin-top: 15px;
            color: #fff !important;
        }
        .kitchen-cta:hover {
            background: #fff !important;
            color: #5a7a50 !important;
            border-style: solid !important;
        }
      `}</style>

      {/* ════ SIDEBAR ════ */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        location={location}
        logout={handleLogout}
      />

      {/* ════ MAIN CONTENT ════ */}
      <main style={{
        marginLeft: collapsed ? 72 : 260,
        flex: 1, padding: "40px 44px",
        transition: "margin-left 0.35s cubic-bezier(.22,.68,0,1.2)",
        minHeight: "100vh", overflowY: "auto", position: "relative"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36, ...anim(0) }}>
          <div>
            <h1 style={{ fontFamily: "'Lora',serif", fontSize: "clamp(24px,3vw,34px)", fontWeight: 700, color: "#2d3b2d", lineHeight: 1.15 }}>
              My Subscriptions 📅
            </h1>
            <p style={{ color: "#888", fontSize: 15, marginTop: 6 }}>
              Manage your active plans, pause deliveries, or view your history.
            </p>
          </div>
          <button
            onClick={fetchSubscriptions}
            disabled={isLoading}
            style={{ padding: "10px 18px", borderRadius: 14, border: "2px solid rgba(143,174,142,0.4)", background: "rgba(255,255,255,0.5)", fontWeight: 700, color: "#5a7a50", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}
            onMouseOver={(e) => e.target.style.background = "#fff"}
            onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.5)"}
          >
            {isLoading ? "⏳ Loading..." : "🔄 Refresh"}
          </button>
        </div>

        {error && (
          <div style={{ padding: "16px 20px", background: "#ffebee", color: "#c62828", borderRadius: 14, marginBottom: 24, fontWeight: 700, border: "1px solid #ffcdd2", ...anim(50) }}>
            ⚠️ {error}
          </div>
        )}

        {isLoading && subscriptions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#8FAE8E", fontWeight: 700, fontSize: 18, ...anim(100) }}>
            Loading your subscriptions...
          </div>
        ) : subscriptions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", background: "rgba(255,255,255,0.4)", borderRadius: 24, border: "1px dashed rgba(143,174,142,0.5)", ...anim(100) }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
            <h2 style={{ fontFamily: "'Lora', serif", color: "#2d3b2d", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No Active Plans Found</h2>
            <p style={{ color: "#777", fontSize: 15, marginBottom: 24 }}>You haven't subscribed to any kitchens yet.</p>
            <button onClick={() => navigate("/tiffins")} style={{ padding: "12px 24px", background: "#8FAE8E", color: "#fff", borderRadius: 14, border: "none", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px rgba(143,174,142,0.4)" }}>
              Browse Kitchens →
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24, ...anim(100) }}>
            {subscriptions.map((sub, index) => {
              const badge = getStatusBadge(sub.status);
              const planBadge = getPlanBadge(sub.planType);
              const isActionable = sub.status === "active" || sub.status === "paused";

              return (
                <div key={sub._id} className="sub-card" style={{
                  background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)",
                  borderRadius: 24, padding: "24px",
                  boxShadow: "0 6px 20px rgba(143,174,142,0.1)", border: "1px solid rgba(143,174,142,0.2)",
                  display: "flex", flexDirection: "column", position: "relative", overflow: "hidden"
                }}>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <span style={{ background: badge.bg, color: badge.color, padding: "4px 10px", borderRadius: 10, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>
                          {badge.label}
                        </span>
                        <span style={{ background: planBadge.bg, color: planBadge.color, padding: "4px 10px", borderRadius: 10, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>
                          {sub.planType}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: "'Lora',serif", fontSize: 20, fontWeight: 700, color: "#2d3b2d", margin: 0 }}>
                        {sub.provider?.businessName || "Unknown Kitchen"}
                      </h3>
                      <p style={{ fontSize: 13, color: "#777", marginTop: 2 }}>Order ID: SUB-{sub._id.slice(-6).toUpperCase()}</p>
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #c5d490, #9ab870)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                      {sub.timeSlot === "lunch" ? "🌞" : "🌙"}
                    </div>
                  </div>

                  {/* Progress / Timeline */}
                  <div style={{ background: "#f9fafb", borderRadius: 16, padding: "14px 16px", marginBottom: 20, border: "1px solid #f0f0f0", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 800, color: "#aaa", textTransform: "uppercase", marginBottom: 2 }}>Start Date</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#2d3b2d" }}>{formatDate(sub.startDate)}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 10, fontWeight: 800, color: "#aaa", textTransform: "uppercase", marginBottom: 2 }}>End Date</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#2d3b2d" }}>{formatDate(sub.endDate)}</p>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 10, fontWeight: 800, color: "#aaa", textTransform: "uppercase", marginBottom: 4 }}>Meals Remaining</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: 1, height: 6, background: "#e0e0e0", borderRadius: 10, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${Math.min(100, Math.max(0, (sub.remainingMeals / (sub.planType === 'weekly' ? 7 : sub.planType === 'monthly' ? 30 : 365)) * 100))}%`, background: "#8FAE8E", borderRadius: 10 }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 800, color: "#5a7a50" }}>{sub.remainingMeals}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  {isActionable && (
                    <div style={{ display: "flex", gap: 10 }}>
                      {sub.status === "active" ? (
                        <button className="action-btn btn-pause" style={{ flex: 1 }} onClick={() => { setSelectedSub(sub._id); setModalType('pause'); setPauseStart(""); setPauseEnd(""); }}>
                          ⏸️ Pause Plan
                        </button>
                      ) : sub.status === "paused" ? (
                        <div style={{ flex: 1, padding: "10px", background: "#fff3e0", color: "#e65100", borderRadius: 12, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, border: "1px dashed #ffe0b2", textAlign: "center", lineHeight: 1.2 }}>
                          Resumes automatically on {formatDate(sub.pauseEnd)}
                        </div>
                      ) : null}

                      <button className="action-btn btn-cancel" style={{ flex: 1 }} onClick={() => { setSelectedSub(sub._id); setModalType('cancel'); }}>
                        🗑️ Cancel
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ════ MODALS ════ */}
      {modalType && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: "32px", width: "100%", maxWidth: 420, boxShadow: "0 20px 40px rgba(0,0,0,0.15)", position: "relative", animation: "slideIn 0.3s cubic-bezier(.22,.68,0,1.2)" }}>
            <button onClick={() => setModalType(null)} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#aaa" }}>&times;</button>

            {modalType === 'pause' && (
              <>
                <h3 style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 700, color: "#2d3b2d", marginBottom: 8 }}>Pause Subscription ⏸️</h3>
                <p style={{ fontSize: 14, color: "#777", marginBottom: 24, lineHeight: 1.5 }}>Select the dates you'll be away. We'll automatically extend your end date by the paused duration.</p>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#2d3b2d", marginBottom: 6, textTransform: "uppercase" }}>Pause Start Date</label>
                  <input type="date" value={pauseStart} onChange={(e) => setPauseStart(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #ddd", fontSize: 14, fontFamily: "'Nunito',sans-serif", outline: "none" }} />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#2d3b2d", marginBottom: 6, textTransform: "uppercase" }}>Pause End Date</label>
                  <input type="date" value={pauseEnd} onChange={(e) => setPauseEnd(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #ddd", fontSize: 14, fontFamily: "'Nunito',sans-serif", outline: "none" }} />
                </div>

                <button onClick={handlePauseSubmit} disabled={actionLoading} style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "#e65100", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }}>
                  {actionLoading ? "Pausing..." : "Confirm Pause"}
                </button>
              </>
            )}

            {modalType === 'cancel' && (
              <>
                <div style={{ fontSize: 44, marginBottom: 12, textAlign: "center" }}>⚠️</div>
                <h3 style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 700, color: "#c62828", marginBottom: 8, textAlign: "center" }}>Cancel Subscription?</h3>
                <p style={{ fontSize: 14, color: "#777", marginBottom: 24, lineHeight: 1.5, textAlign: "center" }}>Are you absolutely sure you want to cancel this subscription? Any applicable refunds for remaining meals will be credited to your wallet.</p>

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setModalType(null)} style={{ flex: 1, padding: "14px", borderRadius: 14, border: "2px solid #ddd", background: "transparent", color: "#777", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                    Keep Plan
                  </button>
                  <button onClick={handleCancelSubmit} disabled={actionLoading} style={{ flex: 1, padding: "14px", borderRadius: 14, border: "none", background: "#c62828", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                    {actionLoading ? "Cancelling..." : "Yes, Cancel"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
