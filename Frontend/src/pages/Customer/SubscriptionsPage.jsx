import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000";

/* ══════════════════════════════════════════
   PAUSE MODAL
══════════════════════════════════════════ */
function PauseModal({ sub, onClose, onConfirm, loading }) {
  const today = new Date().toISOString().split("T")[0];
  const [pauseStart, setPauseStart] = useState(today);
  const [pauseEnd, setPauseEnd] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const handleSubmit = () => {
    if (!pauseEnd) { setErr("Please select a resume date."); return; }
    if (pauseEnd <= pauseStart) { setErr("Resume date must be after pause date."); return; }
    onConfirm({ pauseStart, pauseEnd });
  };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,30,20,0.6)", backdropFilter: "blur(14px)", padding: 20, animation: "overlayIn 0.25s ease" }}>
      <div style={{ background: "#fff", borderRadius: 28, padding: "44px 40px 40px", maxWidth: 440, width: "100%", boxShadow: "0 48px 96px rgba(20,35,20,0.28)", animation: "modalIn 0.4s cubic-bezier(.22,.68,0,1.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: "linear-gradient(90deg,#D9D9A8,#c5ce88,#8FA873)", borderRadius: "28px 28px 0 0" }} />
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#D9D9A8,#c5ce88)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 26, boxShadow: "0 8px 28px rgba(180,190,100,0.3)" }}>⏸</div>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "#8FA873", textAlign: "center", marginBottom: 8 }}>Pause Subscription</p>
        <h2 style={{ fontFamily: "'Lora',serif", fontSize: 20, fontWeight: 700, color: "#2d3b2d", textAlign: "center", marginBottom: 4 }}>Pause your tiffins?</h2>
        <p style={{ color: "#aaa", fontSize: 13, textAlign: "center", marginBottom: 24 }}>{sub?.provider?.businessName}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#888", display: "block", marginBottom: 6 }}>Pause From</label>
            <input type="date" value={pauseStart} min={today} onChange={e => { setPauseStart(e.target.value); setErr(""); }}
              style={{ width: "100%", padding: "11px 14px", border: "2px solid #e0e0d0", borderRadius: 12, fontSize: 14, fontFamily: "'Nunito',sans-serif", color: "#2d3b2d", outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#8FAE8E"}
              onBlur={e => e.target.style.borderColor = "#e0e0d0"} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#888", display: "block", marginBottom: 6 }}>Resume On</label>
            <input type="date" value={pauseEnd} min={pauseStart || today} onChange={e => { setPauseEnd(e.target.value); setErr(""); }}
              style={{ width: "100%", padding: "11px 14px", border: "2px solid #e0e0d0", borderRadius: 12, fontSize: 14, fontFamily: "'Nunito',sans-serif", color: "#2d3b2d", outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#8FAE8E"}
              onBlur={e => e.target.style.borderColor = "#e0e0d0"} />
          </div>
          {err && <p style={{ color: "#ef5350", fontSize: 12, fontWeight: 700 }}>⚠ {err}</p>}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", background: "transparent", border: "2px solid #e0e0d0", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#999", fontFamily: "'Nunito',sans-serif", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#ef9a9a"; e.currentTarget.style.color = "#ef5350"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0d0"; e.currentTarget.style.color = "#999"; }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}
            style={{ flex: 1, padding: "12px", background: loading ? "#d4d4bc" : "linear-gradient(135deg,#D9D9A8,#c5ce88)", color: "#5a6a20", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.25s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? <><span style={{ width: 13, height: 13, borderRadius: "50%", border: "2px solid rgba(90,106,32,0.3)", borderTopColor: "#5a6a20", display: "inline-block", animation: "spinSlow 0.7s linear infinite" }} />Pausing...</> : "⏸ Pause"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   CONFIRM MODAL (Resume / Cancel)
══════════════════════════════════════════ */
function ConfirmModal({ type, sub, onClose, onConfirm, loading }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);
  const isCancel = type === "cancel";
  const accent = isCancel
    ? { grad: "linear-gradient(135deg,#ef5350,#e57373)", text: "#ef5350" }
    : { grad: "linear-gradient(135deg,#8FAE8E,#8FA873)", text: "#8FA873" };
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,30,20,0.6)", backdropFilter: "blur(14px)", padding: 20, animation: "overlayIn 0.25s ease" }}>
      <div style={{ background: "#fff", borderRadius: 28, padding: "44px 40px 40px", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 48px 96px rgba(20,35,20,0.28)", animation: "modalIn 0.4s cubic-bezier(.22,.68,0,1.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: accent.grad, borderRadius: "28px 28px 0 0" }} />
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: accent.grad, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 24, color: "#fff", boxShadow: `0 8px 28px ${isCancel ? "rgba(239,83,80,0.3)" : "rgba(143,174,142,0.35)"}` }}>
          {isCancel ? "✕" : "▶"}
        </div>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: accent.text, marginBottom: 8 }}>
          {isCancel ? "Cancel Subscription" : "Resume Subscription"}
        </p>
        <h2 style={{ fontFamily: "'Lora',serif", fontSize: 20, fontWeight: 700, color: "#2d3b2d", marginBottom: 6 }}>
          {isCancel ? "Cancel your tiffins?" : "Resume your tiffins?"}
        </h2>
        <p style={{ color: "#aaa", fontSize: 13, marginBottom: 8 }}>{sub?.provider?.businessName}</p>
        {isCancel
          ? <p style={{ color: "#ffb74d", fontSize: 13, fontWeight: 600, marginBottom: 24 }}>⚠ This action cannot be undone.</p>
          : <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>Deliveries will resume from today onwards.</p>}
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", background: "transparent", border: "2px solid #e0e0d0", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#999", fontFamily: "'Nunito',sans-serif", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#ccc"; e.currentTarget.style.color = "#666"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0d0"; e.currentTarget.style.color = "#999"; }}>Go Back</button>
          <button onClick={onConfirm} disabled={loading}
            style={{ flex: 1, padding: "12px", background: loading ? "#ddd" : accent.grad, color: "#fff", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.25s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? <><span style={{ width: 13, height: 13, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", display: "inline-block", animation: "spinSlow 0.7s linear infinite" }} />Working...</> : isCancel ? "✕ Yes, Cancel" : "▶ Yes, Resume"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

function StatusBadge({ status }) {
  const map = {
    active:    { bg: "rgba(76,175,80,0.12)",  color: "#388e3c", border: "rgba(76,175,80,0.3)",    label: "✓ Active" },
    paused:    { bg: "rgba(217,217,168,0.45)", color: "#7a7a20", border: "rgba(180,190,100,0.45)", label: "⏸ Paused" },
    cancelled: { bg: "rgba(239,83,80,0.1)",   color: "#c62828", border: "rgba(239,83,80,0.25)",   label: "✕ Cancelled" },
    completed: { bg: "rgba(143,174,142,0.15)", color: "#4a7040", border: "rgba(143,174,142,0.35)", label: "✓ Completed" },
  };
  const s = map[status] || map.active;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1.5px solid ${s.border}`, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.3, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

function PaymentBadge({ status }) {
  const map = {
    paid:    { bg: "rgba(76,175,80,0.1)",  color: "#388e3c", label: "💳 Paid" },
    pending: { bg: "rgba(255,152,0,0.1)",  color: "#e65100", label: "⏳ Pending" },
    failed:  { bg: "rgba(239,83,80,0.08)", color: "#c62828", label: "✕ Failed" },
  };
  const s = map[status] || map.pending;
  return <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{s.label}</span>;
}

function InfoRow({ icon, label, value, accent }) {
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#bbb", marginBottom: 3 }}>{icon} {label}</p>
      <p style={{ fontSize: 14, fontWeight: accent ? 800 : 700, color: accent ? "#8FA873" : "#2d3b2d" }}>{value}</p>
    </div>
  );
}

function ActionBtn({ label, onClick, disabled, loading, variant }) {
  const v = {
    green:  { bg: "linear-gradient(135deg,#8FAE8E,#8FA873)", color: "#fff",   border: "none" },
    yellow: { bg: "rgba(217,217,168,0.45)",                  color: "#7a7a20", border: "1.5px solid rgba(180,190,100,0.45)" },
    red:    { bg: "rgba(239,83,80,0.08)",                    color: "#c62828", border: "1.5px solid rgba(239,83,80,0.25)" },
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ padding: "9px 18px", background: disabled ? "rgba(220,220,210,0.5)" : v.bg, color: disabled ? "#bbb" : v.color, border: v.border, borderRadius: 12, fontSize: 13, fontWeight: 800, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.82"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
      {loading && <span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(0,0,0,0.15)", borderTopColor: v.color, display: "inline-block", animation: "spinSlow 0.7s linear infinite" }} />}
      {label}
    </button>
  );
}

/* ══════════════════════════════════════════
   SUBSCRIPTION CARD
══════════════════════════════════════════ */
function SubCard({ sub, onPause, onResume, onCancel, actionLoading }) {
  const isPaused   = sub.status === "paused";
  const isPast     = sub.status === "cancelled" || sub.status === "completed";
  const busy       = actionLoading === sub._id;
  const accentBar  = isPast ? "#e0e0d0" : isPaused ? "linear-gradient(90deg,#D9D9A8,#c5ce88)" : "linear-gradient(90deg,#8FAE8E,#8FA873)";

  return (
    <div className="sub-card" style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(16px)", borderRadius: 24, border: `1.5px solid ${isPast ? "rgba(143,174,142,0.12)" : "rgba(143,174,142,0.28)"}`, boxShadow: isPast ? "0 2px 12px rgba(90,120,70,0.05)" : "0 6px 28px rgba(90,120,70,0.1)", overflow: "hidden", opacity: isPast ? 0.72 : 1, transition: "all 0.3s" }}>
      <div style={{ height: 4, background: accentBar }} />
      <div style={{ padding: "22px 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontFamily: "'Lora',serif", fontSize: 18, fontWeight: 700, color: "#2d3b2d", marginBottom: 6, lineHeight: 1.2 }}>
              {sub.provider?.businessName || "Provider"}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ background: "rgba(143,174,142,0.15)", color: "#4a7040", border: "1px solid rgba(143,174,142,0.3)", borderRadius: 20, padding: "3px 11px", fontSize: 11, fontWeight: 800, textTransform: "uppercase" }}>
                {sub.planType || "Plan"}
              </span>
              {sub.timeSlot && (
                <span style={{ background: "rgba(143,174,142,0.08)", color: "#5a7a50", borderRadius: 20, padding: "3px 11px", fontSize: 11, fontWeight: 700 }}>
                  🕐 {sub.timeSlot}
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={sub.status} />
        </div>

        {/* Info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: "12px 20px", marginBottom: 16 }}>
          <InfoRow icon="📅" label="Start Date"   value={fmtDate(sub.startDate)} />
          <InfoRow icon="📅" label="End Date"     value={fmtDate(sub.endDate)} />
          <InfoRow icon="🍱" label="Meals Left"   value={sub.remainingMeals ?? "—"} accent />
          <InfoRow icon="💰" label="Total Price"  value={sub.totalPrice   ? `₹${sub.totalPrice.toLocaleString()}`   : "—"} />
          <InfoRow icon="💳" label="Amount Paid"  value={sub.amountPaid   ? `₹${sub.amountPaid.toLocaleString()}`   : "—"} />
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#bbb", marginBottom: 5 }}>💳 Payment</p>
            <PaymentBadge status={sub.paymentStatus} />
          </div>
        </div>

        {/* Pause window */}
        {(sub.pauseStart || sub.pauseEnd) && (
          <div style={{ background: "rgba(217,217,168,0.22)", border: "1px solid rgba(180,190,100,0.3)", borderRadius: 12, padding: "10px 16px", marginBottom: 16, display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#bbb", marginBottom: 3 }}>⏸ Paused From</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#7a7a20" }}>{fmtDate(sub.pauseStart)}</p>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#bbb", marginBottom: 3 }}>▶ Resumes On</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#7a7a20" }}>{fmtDate(sub.pauseEnd)}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        {!isPast && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
            {isPaused ? (
              <ActionBtn label="▶ Resume" onClick={() => onResume(sub)} disabled={busy} loading={busy} variant="green" />
            ) : (
              <ActionBtn label="⏸ Pause"  onClick={() => onPause(sub)}  disabled={busy} loading={busy} variant="yellow" />
            )}
            <ActionBtn label="✕ Cancel" onClick={() => onCancel(sub)} disabled={busy} loading={busy} variant="red" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function SubscriptionsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [subs, setSubs]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [loaded, setLoaded]           = useState(false);
  const [pauseTarget, setPauseTarget] = useState(null);
  const [resumeTarget, setResumeTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=Nunito:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    if (!token) { navigate("/login"); return; }
    fetchSubs();
    setTimeout(() => setLoaded(true), 80);
  }, []);

  const fetchSubs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API}/api/subscriptions/my`, { headers });
      setSubs(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load subscriptions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async ({ pauseStart, pauseEnd }) => {
    setActionLoading(pauseTarget._id);
    try {
      await axios.patch(`${API}/api/subscriptions/${pauseTarget._id}/pause`, { pauseStart, pauseEnd }, { headers });
      setPauseTarget(null);
      await fetchSubs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to pause subscription.");
    } finally { setActionLoading(null); }
  };

  const handleResume = async () => {
    setActionLoading(resumeTarget._id);
    try {
      await axios.patch(`${API}/api/subscriptions/${resumeTarget._id}/resume`, {}, { headers });
      setResumeTarget(null);
      await fetchSubs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resume subscription.");
    } finally { setActionLoading(null); }
  };

  const handleCancel = async () => {
    setActionLoading(cancelTarget._id);
    try {
      await axios.patch(`${API}/api/subscriptions/${cancelTarget._id}/cancel`, {}, { headers });
      setCancelTarget(null);
      await fetchSubs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel subscription.");
    } finally { setActionLoading(null); }
  };

  const active = subs.filter(s => s.status === "active" || s.status === "paused");
  const past   = subs.filter(s => s.status === "cancelled" || s.status === "completed");

  const anim = (d = 0) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.55s ease ${d}ms, transform 0.55s cubic-bezier(.22,.68,0,1.2) ${d}ms`,
  });

  return (
    <div style={{ minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito',sans-serif" }}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#E7E6B6}
        ::-webkit-scrollbar-thumb{background:#8FAE8E;border-radius:10px}
        @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes overlayIn{from{opacity:0}to{opacity:1}}
        @keyframes modalIn{from{opacity:0;transform:scale(0.88) translateY(24px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.93) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .sub-card:hover{transform:translateY(-3px)!important;box-shadow:0 14px 40px rgba(90,120,70,0.14)!important}
        .skeleton{background:linear-gradient(90deg,rgba(143,174,142,0.08) 25%,rgba(143,174,142,0.18) 50%,rgba(143,174,142,0.08) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:12px}
      `}</style>

      {/* MODALS — outside overflow so position:fixed works */}
      {pauseTarget  && <PauseModal   sub={pauseTarget}  onClose={() => setPauseTarget(null)}  onConfirm={handlePause}  loading={actionLoading === pauseTarget._id} />}
      {resumeTarget && <ConfirmModal type="resume" sub={resumeTarget} onClose={() => setResumeTarget(null)} onConfirm={handleResume} loading={actionLoading === resumeTarget._id} />}
      {cancelTarget && <ConfirmModal type="cancel" sub={cancelTarget} onClose={() => setCancelTarget(null)} onConfirm={handleCancel} loading={actionLoading === cancelTarget._id} />}

      {/* HERO */}
      <div style={{ background: "linear-gradient(160deg,#8FA873,#6b8a5e)", padding: "44px 40px 52px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.07)", top: "-100px", right: "-60px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.1)", bottom: "-60px", left: "8%", pointerEvents: "none", animation: "spinSlow 40s linear infinite" }} />

        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <button onClick={() => navigate(-1)} style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 12, padding: "7px 15px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", marginBottom: 22, transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}>← Back</button>

          <div style={anim(0)}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3.5, textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>My Tiffins</p>
            <h1 style={{ fontFamily: "'Lora',serif", fontSize: 40, fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 8 }}>
              My <em>Subscriptions</em>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 15, fontWeight: 600 }}>
              Manage your tiffin plans — pause, resume, or cancel anytime
            </p>
          </div>

          {/* Summary pills */}
          {!loading && subs.length > 0 && (
            <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap", ...anim(120) }}>
              <Pill icon="✅" label={`${active.length} Active`} strong />
              <Pill icon="📦" label={`${past.length} Past`} />
              <Pill icon="🍱" label={`${active.reduce((a, s) => a + (s.remainingMeals || 0), 0)} meals left`} />
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 40px 64px" }}>

        {/* Loading */}
        {loading && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid rgba(143,174,142,0.2)", borderTopColor: "#8FA873", animation: "spinSlow 0.8s linear infinite" }} />
              <p style={{ fontFamily: "'Lora',serif", fontSize: 17, color: "#5a7a50", fontWeight: 600 }}>Loading your subscriptions...</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[1, 2].map(i => (
                <div key={i} style={{ background: "rgba(255,255,255,0.7)", borderRadius: 24, overflow: "hidden" }}>
                  <div style={{ height: 4, background: "rgba(143,174,142,0.15)" }} />
                  <div style={{ padding: "22px 24px" }}>
                    <div className="skeleton" style={{ height: 22, width: "40%", marginBottom: 12 }} />
                    <div className="skeleton" style={{ height: 14, width: "28%", marginBottom: 22 }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      {[1, 2, 3, 4, 5, 6].map(j => <div key={j} className="skeleton" style={{ height: 38 }} />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ background: "rgba(239,83,80,0.08)", border: "1.5px solid rgba(239,83,80,0.25)", borderRadius: 18, padding: "20px 24px", display: "flex", alignItems: "center", gap: 14, ...anim(0) }}>
            <div style={{ fontSize: 28 }}>⚠️</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 800, fontSize: 14, color: "#c62828", marginBottom: 4 }}>Something went wrong</p>
              <p style={{ fontSize: 13, color: "#888" }}>{error}</p>
            </div>
            <button onClick={fetchSubs} style={{ background: "linear-gradient(135deg,#8FAE8E,#8FA873)", border: "none", borderRadius: 12, padding: "9px 18px", fontSize: 13, fontWeight: 800, color: "#fff", cursor: "pointer", fontFamily: "'Nunito',sans-serif", flexShrink: 0 }}>
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && subs.length === 0 && (
          <div style={{ textAlign: "center", padding: "72px 40px", background: "rgba(255,255,255,0.7)", borderRadius: 28, border: "1.5px dashed rgba(143,174,142,0.3)", ...anim(0) }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🍱</div>
            <h3 style={{ fontFamily: "'Lora',serif", fontSize: 24, fontWeight: 700, color: "#2d3b2d", marginBottom: 10 }}>No subscriptions yet</h3>
            <p style={{ color: "#aaa", fontSize: 15, fontWeight: 600, marginBottom: 24 }}>
              Browse nearby tiffin providers and subscribe to a meal plan.
            </p>
            <button onClick={() => navigate("/browse")} style={{ background: "linear-gradient(135deg,#8FAE8E,#8FA873)", border: "none", borderRadius: 14, padding: "13px 28px", fontSize: 14, fontWeight: 800, color: "#fff", cursor: "pointer", fontFamily: "'Nunito',sans-serif", boxShadow: "0 4px 16px rgba(143,174,142,0.4)" }}>
              Browse Tiffins →
            </button>
          </div>
        )}

        {/* Subscriptions */}
        {!loading && !error && subs.length > 0 && (
          <>
            {/* Active */}
            {active.length > 0 && (
              <section style={anim(80)}>
                <SectionHeader label="Active Plans" count={active.length} accent="#388e3c" countBg="rgba(76,175,80,0.12)" countBorder="rgba(76,175,80,0.25)" />
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
                  {active.map((sub, i) => (
                    <div key={sub._id} style={{ animation: `popIn 0.4s cubic-bezier(.22,.68,0,1.2) ${i * 60}ms both` }}>
                      <SubCard sub={sub} onPause={setPauseTarget} onResume={setResumeTarget} onCancel={setCancelTarget} actionLoading={actionLoading} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Past */}
            {past.length > 0 && (
              <section style={anim(160)}>
                <SectionHeader label="Past Plans" count={past.length} accent="#888" countBg="rgba(143,174,142,0.1)" countBorder="rgba(143,174,142,0.2)" />
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {past.map((sub, i) => (
                    <div key={sub._id} style={{ animation: `popIn 0.4s cubic-bezier(.22,.68,0,1.2) ${i * 60}ms both` }}>
                      <SubCard sub={sub} onPause={setPauseTarget} onResume={setResumeTarget} onCancel={setCancelTarget} actionLoading={actionLoading} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Pill({ icon, label, strong }) {
  return (
    <div style={{ background: strong ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.12)", borderRadius: 20, padding: "6px 16px", display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ color: strong ? "#fff" : "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 700 }}>{label}</span>
    </div>
  );
}

function SectionHeader({ label, count, accent, countBg, countBorder }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
      <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: accent, whiteSpace: "nowrap" }}>{label}</p>
      <div style={{ height: 1, flex: 1, background: "rgba(143,174,142,0.2)" }} />
      <span style={{ background: countBg, color: accent, border: `1.5px solid ${countBorder}`, borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" }}>{count}</span>
    </div>
  );
}