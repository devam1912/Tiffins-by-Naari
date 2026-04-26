import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/auth";
import { 
  ChefHat, 
  Store, 
  User, 
  ClipboardList, 
  Camera, 
  MapPin, 
  Check, 
  ArrowRight 
} from "lucide-react";


function Modal({ variant, title, message, onClose }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const cfg = {
    success: { bar: "linear-gradient(90deg,#4caf50,#66bb6a,#a5d6a7)", circle: "linear-gradient(135deg,#4caf50,#66bb6a)", glow: "rgba(76,175,80,0.38)", tag: "Application Submitted", tagClr: "#4caf50", btn: "linear-gradient(135deg,#4caf50,#66bb6a)" },
    error: { bar: "linear-gradient(90deg,#ef5350,#e57373,#ffcdd2)", circle: "linear-gradient(135deg,#ef5350,#e57373)", glow: "rgba(239,83,80,0.35)", tag: "Something Went Wrong", tagClr: "#ef5350", btn: "linear-gradient(135deg,#8FAE8E,#8FA873)" },
    location: { bar: "linear-gradient(90deg,#1976d2,#42a5f5,#bbdefb)", circle: "linear-gradient(135deg,#1976d2,#42a5f5)", glow: "rgba(25,118,210,0.35)", tag: "Location Captured", tagClr: "#1976d2", btn: "linear-gradient(135deg,#8FAE8E,#8FA873)" },
  };
  const c = cfg[variant] || cfg.error;

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,35,20,0.6)", backdropFilter: "blur(14px)", padding: 20, animation: "overlayIn 0.25s ease" }}>
      {variant === "success" && ["#8FAE8E", "#D9D9A8", "#8FA873", "#fff", "#4caf50", "#c5d490", "#a5d6a7", "#ffeb3b"].map((col, i) => (
        <div key={i} style={{ position: "absolute", pointerEvents: "none", width: i % 2 === 0 ? 11 : 7, height: i % 2 === 0 ? 11 : 7, borderRadius: i % 3 === 0 ? "50%" : 3, background: col, top: `${28 + (i % 5) * 5}%`, left: `${28 + i * 5.5}%`, animation: `confetti ${0.85 + i * 0.18}s ease forwards`, animationDelay: `${i * 0.06}s` }} />
      ))}
      <div style={{ background: "#fff", borderRadius: 28, padding: "56px 44px 44px", maxWidth: 430, width: "100%", textAlign: "center", boxShadow: "0 48px 96px rgba(20,35,20,0.28)", animation: "modalIn 0.45s cubic-bezier(.22,.68,0,1.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: c.bar, borderRadius: "28px 28px 0 0" }} />
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: c.circle, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: `0 16px 48px ${c.glow}`, animation: "iconPop 0.55s cubic-bezier(.34,1.56,.64,1) 0.15s both" }}>
          {variant === "success" && <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M10 22l9 9 16-18" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          {variant === "error" && <svg width="38" height="38" viewBox="0 0 38 38" fill="none"><path d="M12 12l14 14M26 12L12 26" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" /></svg>}
          {variant === "location" && <svg width="38" height="38" viewBox="0 0 38 38" fill="none"><path d="M19 4C13.477 4 9 8.477 9 14c0 8.25 10 20 10 20s10-11.75 10-20c0-5.523-4.477-10-10-10zm0 13.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" fill="#fff" /></svg>}
        </div>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: c.tagClr, marginBottom: 10 }}>{c.tag}</p>
        <h2 style={{ fontFamily: "'Lora',serif", fontSize: 26, fontWeight: 700, color: "#2d3b2d", lineHeight: 1.25, marginBottom: 14 }}>{title}</h2>
        <p style={{ color: "#777", fontSize: 15, lineHeight: 1.8, marginBottom: 32, whiteSpace: "pre-line" }}>{message}</p>
        <button onClick={onClose} style={{ width: "100%", padding: "15px", background: c.btn, color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", boxShadow: `0 4px 20px ${c.glow}`, transition: "all 0.25s ease" }} onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}>
          {variant === "success" ? "Go to Dashboard →" : "Got it"}
        </button>
      </div>
    </div>
  );
}

export default function RegisterProvider() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [modal, setModal] = useState(null);
  const [focused, setFocused] = useState("");
  const [fssaiFile, setFssaiFile] = useState(null);
  const [fssaiPreview, setFssaiPreview] = useState(null);
  const [form, setForm] = useState({ businessName: "", ownerName: "", fssaiNumber: "", address: "" });
  const [coords, setCoords] = useState(null);

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

    // Strict Image-only validation
    if (!file.type.startsWith("image/")) {
        setModal({ 
            variant: "error", 
            title: "Invalid File", 
            message: "Please upload an image (JPG, PNG). PDF files are not supported for the certificate." 
        });
        e.target.value = ""; // clear input
        return;
    }

    setFssaiFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setFssaiPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const iStyle = (name) => ({
    width: "100%", padding: "14px 16px 14px 44px",
    border: `2px solid ${focused === name ? "#8FAE8E" : "#e0e0d0"}`,
    borderRadius: 14, fontSize: 15, fontFamily: "'Nunito',sans-serif", color: "#2d3b2d",
    background: focused === name ? "#fafff8" : "#fff",
    outline: "none", transition: "all 0.25s ease",
    boxShadow: focused === name ? "0 0 0 4px rgba(143,174,142,0.12)" : "none",
  });

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
            message: `GPS coordinates captured!\n${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E`,
          });
        } catch {
          setModal({ variant: "error", title: "Couldn't Capture Location", message: "Something went wrong. Please check connection." });
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setModal({ variant: "error", title: "Permission Denied", message: "Please allow location in your browser settings." });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Session Expired. Please log in again.");
      if (!form.address.trim()) throw new Error("Please enter your kitchen address.");
      if (!coords) throw new Error("Please pin your exact GPS location.");
      if (!fssaiFile) throw new Error("Please upload your FSSAI certificate image.");

      const formData = new FormData();
      formData.append("businessName", form.businessName);
      formData.append("ownerName", form.ownerName);
      formData.append("fssaiNumber", form.fssaiNumber);
      formData.append("address", form.address);
      formData.append("location[type]", "Point");
      formData.append("location[coordinates][]", coords[0]);
      formData.append("location[coordinates][]", coords[1]);
      formData.append("fssaiCertificate", fssaiFile);

      await axios.post(`${BASE_URL}/api/tiffins/register`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setModal({ variant: "success", title: "Application Submitted!", message: "Our team will review your kitchen details within 24–48 hours.", nav: "/CustomerDashboard" });
    } catch (err) {
      setModal({ variant: "error", title: "Submission Failed", message: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => { if (modal?.nav) navigate(modal.nav); setModal(null); };

  return (
    <div className="register-container" style={{ minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito',sans-serif", display: "flex", overflow: "hidden" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: #bbb; }
        textarea { resize: none; font-family: 'Nunito',sans-serif; }
        @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes spinSlow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulseDot  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.55);opacity:0.35} }
        @keyframes pulseRing { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.1);opacity:0.15} }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        @keyframes modalIn   { from{opacity:0;transform:scale(0.88) translateY(32px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes iconPop   { 0%{transform:scale(0) rotate(-15deg);opacity:0} 65%{transform:scale(1.2) rotate(4deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes confetti  { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(-120px) rotate(420deg);opacity:0} }
        .btn-submit:not(:disabled):hover { opacity:0.9 !important; transform:translateY(-2px) !important; box-shadow:0 12px 36px rgba(143,174,142,0.55) !important; }
        .upload-zone:hover { border-color:#8FAE8E !important; background:rgba(143,174,142,0.1) !important; }
        @media (max-width: 900px) {
          .register-container { flex-direction: column !important; overflow-y: auto !important; min-height: auto !important; }
          .register-left-panel { min-height: auto !important; flex: none !important; padding: 60px 20px !important; }
          .register-right-panel { flex: none !important; padding: 40px 20px !important; overflow-y: visible !important; min-height: 100vh !important; justify-content: flex-start !important; }
        }
      `}</style>

      {modal && <Modal variant={modal.variant} title={modal.title} message={modal.message} onClose={closeModal} />}

      {/* LEFT PANEL */}
      <div className="register-left-panel" style={{ flex: 1, background: "linear-gradient(145deg,#8FA873,#6b8a5e)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 360 }}>
          <div style={{ position: "relative", margin: "0 auto 32px", width: 96, height: 96 }}>
            <div style={{ position: "absolute", inset: -12, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.18)", animation: "pulseRing 2.5s ease-in-out infinite" }} />
            <div style={{ width: 96, height: 96, borderRadius: 28, background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.28)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", backdropFilter: "blur(8px)", animation: "floatY 5s ease-in-out infinite" }}>
              <ChefHat size={48} />
            </div>
          </div>

          <h2 style={{ fontFamily: "'Lora',serif", fontSize: 36, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 18, ...anim(100) }}>List Your<br /><em>Kitchen Today</em></h2>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 15, lineHeight: 1.8, marginBottom: 32, ...anim(180) }}>Reach subscribers who crave real, home-cooked food every day.</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="register-right-panel" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "48px", background: "#E7E6B6", position: "relative", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 1 }}>
          <div style={{ ...anim(80) }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3.5, textTransform: "uppercase", color: "#8FA873", marginBottom: 10 }}>Provider Registration</p>
            <h1 style={{ fontFamily: "'Lora',serif", fontSize: 36, fontWeight: 700, color: "#2d3b2d", lineHeight: 1.15, marginBottom: 32 }}>Register Your Kitchen</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ position: "relative", ...anim(140) }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8FA873", pointerEvents: "none", zIndex: 1, display: 'flex', alignItems: 'center' }}>
                  <Store size={18} />
                </span>
                <input name="businessName" placeholder="Business Name" value={form.businessName} onChange={handleChange} required onFocus={() => setFocused("businessName")} onBlur={() => setFocused("")} style={iStyle("businessName")} />
              </div>


              <div style={{ position: "relative", ...anim(165) }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8FA873", pointerEvents: "none", zIndex: 1, display: 'flex', alignItems: 'center' }}>
                  <User size={18} />
                </span>
                <input name="ownerName" placeholder="Owner Name" value={form.ownerName} onChange={handleChange} required onFocus={() => setFocused("ownerName")} onBlur={() => setFocused("")} style={iStyle("ownerName")} />
              </div>


              <div style={{ position: "relative", ...anim(190) }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8FA873", pointerEvents: "none", zIndex: 1, display: 'flex', alignItems: 'center' }}>
                  <ClipboardList size={18} />
                </span>
                <input name="fssaiNumber" placeholder="FSSAI License Number" value={form.fssaiNumber} onChange={handleChange} required onFocus={() => setFocused("fssaiNumber")} onBlur={() => setFocused("")} style={iStyle("fssaiNumber")} />
              </div>


              {/* FSSAI Certificate Upload (IMAGE ONLY) */}
              <div style={{ ...anim(220) }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#5a6a50", marginBottom: 8 }}>FSSAI Certificate Image <span style={{ color: "#ef5350", fontSize: 12 }}>*required</span></p>
                <label className="upload-zone" style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14,
                  border: `2px dashed ${fssaiFile ? "#4caf50" : "#8FAE8E"}`,
                  background: fssaiFile ? "rgba(76,175,80,0.06)" : "#fff",
                  cursor: "pointer", transition: "all 0.2s ease",
                }}>
                  {fssaiFile ? (
                    <img src={fssaiPreview} alt="cert" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(143,174,142,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: '#8FAE8E' }}>
                      <Camera size={22} />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: "#5a7a50", margin: 0 }}>{fssaiFile ? fssaiFile.name : "Upload Image"}</p>
                    <p style={{ fontSize: 12, color: "#aaa", margin: 0 }}>PNG or JPG only · Max 5MB</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                </label>
              </div>

              <div style={{ position: "relative", ...anim(255) }}>
                <span style={{ position: "absolute", left: 14, top: 15, color: "#8FA873", display: 'flex', alignItems: 'center' }}>
                  <MapPin size={18} />
                </span>
                <textarea name="address" placeholder="Full kitchen address..." value={form.address} onChange={handleChange} required onFocus={() => setFocused("address")} onBlur={() => setFocused("")} style={{ ...iStyle("address"), padding: "14px 16px 14px 44px", minHeight: 90 }} />
              </div>


              <div style={{ ...anim(285), borderRadius: 14, border: "1.5px solid #ddddc8", background: "#fff", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#2d3b2d", margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {coords ? <>GPS Captured <Check size={16} color="#4caf50" /></> : "Pin Location"}
                  </p>
                  <p style={{ fontSize: 12, color: "#999", margin: 0 }}>Required for matching</p>
                </div>
                <button type="button" onClick={handleAutoLocate} disabled={locating} style={{ padding: "8px 16px", borderRadius: 10, border: "1.5px solid #8FAE8E", background: "rgba(143,174,142,0.1)", cursor: "pointer", fontSize: 13, fontWeight: 800, color: "#5a7a50" }}>
                  {locating ? "Locating..." : coords ? "Re-pin" : "Pin GPS"}
                </button>

              </div>

              <button type="submit" disabled={loading} className="btn-submit" style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                {loading ? "Processing..." : <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Submit Application <ArrowRight size={18} /></span>}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}