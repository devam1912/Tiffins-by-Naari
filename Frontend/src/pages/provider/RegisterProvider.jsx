import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Modal({ variant, title, message, onClose }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const cfg = {
    success: { bar: "linear-gradient(90deg,#4caf50,#66bb6a,#a5d6a7)", circle: "linear-gradient(135deg,#4caf50,#66bb6a)", glow: "rgba(76,175,80,0.38)", tag: "Application Submitted", tagClr: "#4caf50", btn: "linear-gradient(135deg,#4caf50,#66bb6a)" },
    error:   { bar: "linear-gradient(90deg,#ef5350,#e57373,#ffcdd2)", circle: "linear-gradient(135deg,#ef5350,#e57373)", glow: "rgba(239,83,80,0.35)",  tag: "Something Went Wrong",   tagClr: "#ef5350", btn: "linear-gradient(135deg,#8FAE8E,#8FA873)" },
    location:{ bar: "linear-gradient(90deg,#1976d2,#42a5f5,#bbdefb)", circle: "linear-gradient(135deg,#1976d2,#42a5f5)", glow: "rgba(25,118,210,0.35)",  tag: "Location Captured",      tagClr: "#1976d2", btn: "linear-gradient(135deg,#8FAE8E,#8FA873)" },
  };
  const c = cfg[variant] || cfg.error;

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,35,20,0.6)", backdropFilter: "blur(14px)", padding: 20, animation: "overlayIn 0.25s ease" }}>
      {variant === "success" && ["#8FAE8E","#D9D9A8","#8FA873","#fff","#4caf50","#c5d490","#a5d6a7","#ffeb3b"].map((col, i) => (
        <div key={i} style={{ position: "absolute", pointerEvents: "none", width: i%2===0?11:7, height: i%2===0?11:7, borderRadius: i%3===0?"50%":3, background: col, top: `${28+(i%5)*5}%`, left: `${28+i*5.5}%`, animation: `confetti ${0.85+i*0.18}s ease forwards`, animationDelay: `${i*0.06}s` }} />
      ))}
      <div style={{ background: "#fff", borderRadius: 28, padding: "56px 44px 44px", maxWidth: 430, width: "100%", textAlign: "center", boxShadow: "0 48px 96px rgba(20,35,20,0.28)", animation: "modalIn 0.45s cubic-bezier(.22,.68,0,1.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: c.bar, borderRadius: "28px 28px 0 0" }} />
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: c.circle, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: `0 16px 48px ${c.glow}`, animation: "iconPop 0.55s cubic-bezier(.34,1.56,.64,1) 0.15s both" }}>
          {variant === "success" && <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M10 22l9 9 16-18" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          {variant === "error"   && <svg width="38" height="38" viewBox="0 0 38 38" fill="none"><path d="M12 12l14 14M26 12L12 26" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" /></svg>}
          {variant === "location"&& <svg width="38" height="38" viewBox="0 0 38 38" fill="none"><path d="M19 4C13.477 4 9 8.477 9 14c0 8.25 10 20 10 20s10-11.75 10-20c0-5.523-4.477-10-10-10zm0 13.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" fill="#fff" /></svg>}
        </div>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: c.tagClr, marginBottom: 10 }}>{c.tag}</p>
        <h2 style={{ fontFamily: "'Lora',serif", fontSize: 26, fontWeight: 700, color: "#2d3b2d", lineHeight: 1.25, marginBottom: 14 }}>{title}</h2>
        <p style={{ color: "#777", fontSize: 15, lineHeight: 1.8, marginBottom: 32, whiteSpace: "pre-line" }}>{message}</p>
        <button onClick={onClose} style={{ width: "100%", padding: "15px", background: c.btn, color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", boxShadow: `0 4px 20px ${c.glow}`, transition: "all 0.25s ease" }} onMouseEnter={e => { e.currentTarget.style.opacity="0.9"; e.currentTarget.style.transform="translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.opacity="1"; e.currentTarget.style.transform="none"; }}>
          {variant === "success" ? "Go to Dashboard →" : "Got it"}
        </button>
      </div>
    </div>
  );
}

export default function RegisterProvider() {
  const navigate   = useNavigate();
  const [loaded,   setLoaded]     = useState(false);
  const [loading,  setLoading]    = useState(false);
  const [locating, setLocating]   = useState(false);
  const [modal,    setModal]      = useState(null);
  const [focused,  setFocused]    = useState("");
  const [fssaiFile,    setFssaiFile]    = useState(null);
  const [fssaiPreview, setFssaiPreview] = useState(null);
  const [form,     setForm]       = useState({ businessName: "", ownerName: "", fssaiNumber: "", address: "" });
  const [coords,   setCoords]     = useState(null); // [lng, lat] — GPS only

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=Nunito:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setTimeout(() => setLoaded(true), 80);
  }, []);

  const anim = (d = 0) => ({ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.6s ease ${d}ms, transform 0.6s cubic-bezier(.22,.68,0,1.2) ${d}ms` });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFssaiFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setFssaiPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setFssaiPreview("pdf");
    }
  };

  const iStyle = (name) => ({
    width: "100%", padding: "14px 16px 14px 44px",
    border: `2px solid ${focused === name ? "#8FAE8E" : "#e0e0d0"}`,
    borderRadius: 14, fontSize: 15, fontFamily: "'Nunito',sans-serif", color: "#2d3b2d",
    background: focused === name ? "#fafff8" : "#fff",
    outline: "none", transition: "all 0.25s ease",
    boxShadow: focused === name ? "0 0 0 4px rgba(143,174,142,0.12)" : "none",
  });

  // GPS — sirf coords set karta hai, address field bilkul touch nahi hota
  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      setModal({ variant: "error", title: "Not Supported", message: "Geolocation is not supported by your browser." });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`, { headers: { "User-Agent": "TiffinsByNaari/1.0" } });
          setCoords([longitude, latitude]);
          setModal({
            variant: "location",
            title: "Location Pinned!",
            message: `GPS coordinates captured!\n${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E\n\nThese will be used for accurate delivery matching.`,
          });
        } catch {
          setModal({ variant: "error", title: "Couldn't Capture Location", message: "Something went wrong.\nPlease check your connection and try again." });
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setModal({ variant: "error", title: "Permission Denied", message: "Location access was blocked.\n\nPlease allow location in your browser settings." });
      }
    );
  };

  // Submit — address compulsory + GPS compulsory + certificate compulsory
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setModal({ variant: "error", title: "Session Expired", message: "Your login session has expired.\nPlease log in again.", nav: "/login" });
        return;
      }

      // Address compulsory check
      if (!form.address.trim()) {
        throw new Error("Please enter your full kitchen address.");
      }

      // GPS compulsory check
      if (!coords) {
        throw new Error("Please pin your exact location using the 📍 GPS button.\nThis is required for delivery matching.");
      }

      // Certificate compulsory check
      if (!fssaiFile) {
        throw new Error("Please upload your FSSAI certificate.\nThis is required for verification.");
      }

      // Location from GPS (compulsory)
      const finalLocation = { type: "Point", coordinates: coords };

      // Plain JSON payload — no FormData, backend unchanged
      const payload = { ...form, location: finalLocation };

      await axios.post("http://localhost:5000/api/tiffins/register", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setModal({ variant: "success", title: "Application Submitted!", message: "You're on the list! 🎉\n\nOur team will review your kitchen details and notify you via email within 24–48 hours once approved.", nav: "/CustomerDashboard" });
    } catch (err) {
      setModal({ variant: "error", title: "Submission Failed", message: err.response?.data?.message || err.message || "Something went wrong. Please check your details and try again." });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => { if (modal?.nav) navigate(modal.nav); setModal(null); };

  return (
    <div style={{ minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito',sans-serif", display: "flex", overflow: "hidden" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: #bbb; }
        textarea { resize: none; font-family: 'Nunito',sans-serif; }
        @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes spinSlow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes spinRev   { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
        @keyframes pulseDot  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.55);opacity:0.35} }
        @keyframes pulseRing { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.1);opacity:0.15} }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        @keyframes modalIn   { from{opacity:0;transform:scale(0.88) translateY(32px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes iconPop   { 0%{transform:scale(0) rotate(-15deg);opacity:0} 65%{transform:scale(1.2) rotate(4deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes confetti  { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(-120px) rotate(420deg);opacity:0} }
        .btn-submit:not(:disabled):hover { opacity:0.9 !important; transform:translateY(-2px) !important; box-shadow:0 12px 36px rgba(143,174,142,0.55) !important; }
        .btn-cancel:hover  { border-color:#ef9a9a !important; color:#ef5350 !important; background:#fff5f5 !important; }
        .btn-locate:hover:not(:disabled) { background:rgba(143,174,142,0.22) !important; border-color:#8FAE8E !important; }
        .link-h:hover { color:#5a7a50 !important; }
        .upload-zone:hover { border-color:#8FAE8E !important; background:rgba(143,174,142,0.1) !important; }
      `}</style>

      {modal && <Modal variant={modal.variant} title={modal.title} message={modal.message} onClose={closeModal} />}

      {/* ════════ LEFT PANEL ════════ */}
      <div style={{ flex: 1, background: "linear-gradient(145deg,#8FA873,#6b8a5e)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", top: "-130px", left: "-130px" }} />
        <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", bottom: "-90px", right: "-90px" }} />
        <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", border: "1.5px dashed rgba(255,255,255,0.14)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "spinSlow 28s linear infinite" }} />
        <div style={{ position: "absolute", width: 130, height: 130, borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.1)", top: "16%", right: "10%", animation: "spinRev 20s linear infinite" }} />
        <div style={{ position: "absolute", width: 13, height: 13, borderRadius: "50%", background: "rgba(255,255,255,0.15)", top: "25%", left: "13%", animation: "floatY 4.5s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.1)", bottom: "28%", right: "16%", animation: "floatY 6s ease-in-out infinite 1.5s" }} />

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 360 }}>
          <div style={{ position: "relative", margin: "0 auto 32px", width: 96, height: 96 }}>
            <div style={{ position: "absolute", inset: -12, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.18)", animation: "pulseRing 2.5s ease-in-out infinite" }} />
            <div style={{ width: 96, height: 96, borderRadius: 28, background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.28)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, backdropFilter: "blur(8px)", animation: "floatY 5s ease-in-out infinite", boxShadow: "0 16px 48px rgba(0,0,0,0.12)" }}>👩‍🍳</div>
          </div>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>For Home Chefs</p>
          <h2 style={{ fontFamily: "'Lora',serif", fontSize: 36, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 18, ...anim(100) }}>List Your<br /><em>Kitchen Today</em></h2>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 15, lineHeight: 1.8, marginBottom: 32, ...anim(180) }}>Turn your passion for cooking into a steady income. Reach subscribers who crave real, home-cooked food every day.</p>
          {[
            { icon: "💰", title: "Earn on your terms",   sub: "Set your own menu, pricing & schedule"    },
            { icon: "🔒", title: "FSSAI verified badge", sub: "Build trust with a certified kitchen tag"  },
            { icon: "📦", title: "We handle discovery",  sub: "Focus on cooking — we find your customers" },
          ].map(({ icon, title, sub }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12, textAlign: "left", background: "rgba(255,255,255,0.1)", borderRadius: 16, padding: "12px 16px", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.15)", ...anim(260 + i * 90) }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
              <div><div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 2 }}>{title}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{sub}</div></div>
            </div>
          ))}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "8px 18px", marginTop: 14, ...anim(640) }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4caf50", display: "inline-block", animation: "pulseDot 1.8s ease-in-out infinite" }} />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>Approval within 24–48 hours</span>
          </div>
        </div>
      </div>

      {/* ════════ RIGHT PANEL ════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "48px", background: "#E7E6B6", position: "relative", overflowY: "auto" }}>
        <div style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(143,168,115,0.15),transparent 70%)", bottom: "-80px", right: "-80px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle,rgba(217,217,168,0.35),transparent 70%)", top: "8%", left: "-40px", pointerEvents: "none" }} />

        <div style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 1 }}>
          <a href="/" className="link-h" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#8FA873", fontWeight: 700, fontSize: 14, textDecoration: "none", marginBottom: 32, transition: "color 0.2s", ...anim(0) }}>← Back to home</a>

          <div style={{ ...anim(80) }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3.5, textTransform: "uppercase", color: "#8FA873", marginBottom: 10 }}>Provider Registration</p>
            <h1 style={{ fontFamily: "'Lora',serif", fontSize: 36, fontWeight: 700, color: "#2d3b2d", lineHeight: 1.15, marginBottom: 6 }}>Register Your Kitchen</h1>
            <p style={{ color: "#999", fontSize: 15, marginBottom: 32 }}>Join our community of home chefs.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Business Name */}
              <div style={{ position: "relative", ...anim(140) }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18, pointerEvents: "none", zIndex: 1 }}>🏠</span>
                <input name="businessName" placeholder="Business Name" value={form.businessName} onChange={handleChange} required onFocus={() => setFocused("businessName")} onBlur={() => setFocused("")} style={iStyle("businessName")} />
              </div>

              {/* Owner Name */}
              <div style={{ position: "relative", ...anim(165) }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18, pointerEvents: "none", zIndex: 1 }}>👤</span>
                <input name="ownerName" placeholder="Owner Name" value={form.ownerName} onChange={handleChange} required onFocus={() => setFocused("ownerName")} onBlur={() => setFocused("")} style={iStyle("ownerName")} />
              </div>

              {/* FSSAI Number */}
              <div style={{ position: "relative", ...anim(190) }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18, pointerEvents: "none", zIndex: 1 }}>📋</span>
                <input name="fssaiNumber" placeholder="FSSAI License Number" value={form.fssaiNumber} onChange={handleChange} required onFocus={() => setFocused("fssaiNumber")} onBlur={() => setFocused("")} style={iStyle("fssaiNumber")} />
              </div>

              {/* FSSAI hint */}
              <div style={{ background: "rgba(143,174,142,0.1)", border: "1.5px solid rgba(143,174,142,0.25)", borderRadius: 14, padding: "11px 16px", display: "flex", alignItems: "flex-start", gap: 10, ...anim(205) }}>
                <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>ℹ️</span>
                <p style={{ fontSize: 13, color: "#5a6a50", lineHeight: 1.6, fontWeight: 600 }}>
                  Don't have a FSSAI licence yet?{" "}
                  <a href="https://foscos.fssai.gov.in" target="_blank" rel="noreferrer" style={{ color: "#8FA873", textDecoration: "none", fontWeight: 800 }}>Apply here →</a>
                </p>
              </div>

              {/* ── FSSAI Certificate Upload (compulsory) ── */}
              <div style={{ ...anim(220) }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#5a6a50", marginBottom: 8, letterSpacing: 0.5 }}>
                  FSSAI Certificate <span style={{ color: "#ef5350", fontSize: 12 }}>*required</span>
                </p>
                <label className="upload-zone" style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 18px", borderRadius: 14,
                  border: `2px dashed ${fssaiFile ? "rgba(76,175,80,0.5)" : "rgba(143,174,142,0.4)"}`,
                  background: fssaiFile ? "rgba(76,175,80,0.06)" : "rgba(255,255,255,0.6)",
                  cursor: "pointer", transition: "all 0.2s ease",
                }}>
                  {fssaiFile ? (
                    fssaiPreview === "pdf"
                      ? <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(239,83,80,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📄</div>
                      : <img src={fssaiPreview} alt="cert" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0, border: "2px solid rgba(76,175,80,0.3)" }} />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(143,174,142,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📎</div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: fssaiFile ? "#2d6a2d" : "#5a7a50", marginBottom: 2 }}>
                      {fssaiFile ? fssaiFile.name : "Upload FSSAI Certificate"}
                    </p>
                    <p style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>
                      {fssaiFile ? `${(fssaiFile.size / 1024).toFixed(1)} KB` : "PNG, JPG or PDF · Max 5MB"}
                    </p>
                  </div>
                  {fssaiFile && (
                    <span onClick={(e) => { e.preventDefault(); setFssaiFile(null); setFssaiPreview(null); }} style={{ fontSize: 18, color: "#ccc", cursor: "pointer", flexShrink: 0, padding: 4 }} title="Remove">✕</span>
                  )}
                  <input type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ display: "none" }} />
                </label>
              </div>

              {/* ── KITCHEN LOCATION SECTION ── */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, ...anim(240) }}>
                <div style={{ flex: 1, height: 1, background: "#ddddc8" }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: "#bbb", letterSpacing: 2.5, textTransform: "uppercase" }}>Kitchen Location</span>
                <div style={{ flex: 1, height: 1, background: "#ddddc8" }} />
              </div>

              {/* Address — compulsory, fully independent from GPS */}
              <div style={{ position: "relative", ...anim(255) }}>
                <span style={{ position: "absolute", left: 14, top: 15, fontSize: 18, pointerEvents: "none", zIndex: 1 }}>🗺️</span>
                <textarea
                  name="address"
                  placeholder="Type your full kitchen address here… (required)"
                  value={form.address}
                  onChange={handleChange}
                  required
                  onFocus={() => setFocused("address")} onBlur={() => setFocused("")}
                  style={{ ...iStyle("address"), padding: "14px 16px 14px 44px", minHeight: 90 }}
                />
              </div>

              {/* AND divider — both are required */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, ...anim(270) }}>
                <div style={{ flex: 1, height: 1, background: "#ddddc8" }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: "#bbb", letterSpacing: 2, textTransform: "uppercase" }}>+ pin GPS</span>
                <div style={{ flex: 1, height: 1, background: "#ddddc8" }} />
              </div>

              {/* GPS card — compulsory, independent from address */}
              <div style={{ ...anim(285), borderRadius: 14, border: `1.5px solid ${coords ? "rgba(76,175,80,0.4)" : "rgba(239,83,80,0.25)"}`, background: coords ? "rgba(76,175,80,0.06)" : "rgba(255,255,255,0.5)", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, transition: "all 0.3s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: coords ? "rgba(76,175,80,0.15)" : "rgba(239,83,80,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📍</div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 800, color: coords ? "#2d6a2d" : "#2d3b2d", marginBottom: 2 }}>
                      {coords ? "GPS Pinned ✓" : "Pin Exact Location"}{" "}
                      {!coords && <span style={{ fontSize: 11, color: "#ef5350", fontWeight: 700 }}>*required</span>}
                    </p>
                    <p style={{ fontSize: 12, color: coords ? "#4caf50" : "#999", fontWeight: 600 }}>
                      {coords
                        ? `${coords[1].toFixed(5)}° N, ${coords[0].toFixed(5)}° E`
                        : "GPS coordinates required for delivery matching"}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={handleAutoLocate} className="btn-locate" disabled={locating} style={{ flexShrink: 0, padding: "10px 18px", borderRadius: 10, border: `1.5px solid ${coords ? "rgba(76,175,80,0.45)" : "rgba(143,174,142,0.4)"}`, background: coords ? "rgba(76,175,80,0.12)" : "rgba(143,174,142,0.12)", cursor: locating ? "wait" : "pointer", fontSize: 13, fontWeight: 800, color: coords ? "#2d6a2d" : "#5a7a50", fontFamily: "'Nunito',sans-serif", display: "flex", alignItems: "center", gap: 7, transition: "all 0.2s ease", whiteSpace: "nowrap" }}>
                  {locating
                    ? <><span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(143,174,142,0.3)", borderTopColor: "#8FA873", display: "inline-block", animation: "spinSlow 0.7s linear infinite" }} /> Locating…</>
                    : coords ? "✓ Re-pin" : "Pin Location"}
                </button>
              </div>

              <div style={{ height: 1, background: "#ddddc8", borderRadius: 2, margin: "4px 0", ...anim(300) }} />

              {/* Cancel + Submit */}
              <div style={{ display: "flex", gap: 12, ...anim(315) }}>
                <button type="button" className="btn-cancel" onClick={() => navigate("/CustomerDashboard")} style={{ flex: "0 0 auto", padding: "15px 24px", background: "transparent", border: "2px solid #ddddc8", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", color: "#999", fontFamily: "'Nunito',sans-serif", transition: "all 0.2s ease" }}>Cancel</button>
                <button type="submit" disabled={loading} className="btn-submit" style={{ flex: 1, padding: "15px", background: loading ? "#d4d4bc" : "linear-gradient(135deg,#8FAE8E,#8FA873)", color: loading ? "#aaa9a0" : "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Nunito',sans-serif", boxShadow: loading ? "none" : "0 4px 20px rgba(143,174,142,0.4)", transition: "all 0.35s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  {loading ? <><span style={{ width: 17, height: 17, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.35)", borderTopColor: "#fff", display: "inline-block", animation: "spinSlow 0.7s linear infinite" }} /> Processing...</> : "Submit Application →"}
                </button>
              </div>

              <p style={{ textAlign: "center", fontSize: 12, color: "#bbb", fontWeight: 600, ...anim(330) }}>Our team reviews applications within 24–48 hours</p>
            </div>
          </form>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24, ...anim(345) }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4caf50", display: "inline-block", animation: "pulseDot 1.8s ease-in-out infinite" }} />
            <span style={{ fontSize: 13, color: "#bbb", fontWeight: 600 }}>Free to list · No commission on first month</span>
          </div>
        </div>
      </div>
    </div>
  );
}