import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../api/auth";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, logout } from "../../store/authSlice";
import Sidebar from "../../components/Customer/Sidebar";

export default function EditProfile() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("profile");
  const [location, setLocation] = useState({ address: "Fetching location...", loading: true });
  const navigate = useNavigate();

  // ✅ Redux se user aur token
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=Nunito:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Geolocation for sidebar
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`);
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || "";
            const suburb = data.address.suburb || data.address.neighbourhood || "";
            setLocation({ address: suburb ? `${suburb}, ${city}` : city || "Location Found", loading: false });
          } catch {
            setLocation({ address: "Location unavailable", loading: false });
          }
        },
        () => setLocation({ address: "Location access denied", loading: false })
      );
    } else {
      setLocation({ address: "Geolocation not supported", loading: false });
    }

    // ✅ localStorage ki jagah Redux store se user data
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }

    setTimeout(() => setLoaded(true), 80);
  }, [user]);

  const anim = (delay = 0) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
  });

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await updateProfile(form);
      // ✅ localStorage ki jagah Redux store update karo
      dispatch(loginSuccess({ user: res.data.user, token }));
      setShowSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isReady = form.name.trim() && form.email.trim() && form.phone.trim();
  const firstName = form.name?.split(" ")[0] || "User";

  const inputStyle = (name) => ({
    width: "100%",
    padding: "14px 16px 14px 46px",
    border: `2px solid ${focused === name ? "#8FAE8E" : "#e8e8d8"}`,
    borderRadius: 14,
    fontSize: 15,
    fontFamily: "'Nunito', sans-serif",
    color: "#2d3b2d",
    background: focused === name ? "#fafff8" : "#fff",
    outline: "none",
    transition: "all 0.25s ease",
    boxShadow: focused === name ? "0 0 0 4px rgba(143,174,142,0.12)" : "none",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito', sans-serif" }}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        location={location}
        logout={handleLogout}
      />
      <main style={{
        marginLeft: collapsed ? 72 : 260,
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 40px",
        transition: "margin-left 0.35s cubic-bezier(.22,.68,0,1.2)",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #bbb; }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%      { transform: scale(1.5); opacity: 0.4; }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes dialogIn {
          from { opacity: 0; transform: scale(0.88) translateY(24px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          65%  { transform: scale(1.2) rotate(5deg);  opacity: 1; }
          100% { transform: scale(1)   rotate(0deg);  opacity: 1; }
        }
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .submit-btn:hover { opacity: 0.9 !important; transform: translateY(-2px) !important; box-shadow: 0 10px 32px rgba(143,174,142,0.55) !important; }
        .link-hover:hover { color: #5a7a50 !important; }
        .cancel-btn:hover { background: rgba(143,174,142,0.08) !important; border-color: #8FAE8E !important; }
      `}</style>

      {/* Background decorations */}
      <div style={{ position:"absolute", width:480, height:480, borderRadius:"50%", background:"radial-gradient(circle, rgba(143,168,115,0.17) 0%, transparent 70%)", top:"-100px", right:"-80px", pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(217,217,168,0.4) 0%, transparent 70%)", bottom:"-60px", left:"-60px", pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:240, height:240, borderRadius:"50%", border:"1.5px dashed rgba(143,174,142,0.28)", top:"10%", left:"6%", pointerEvents:"none", animation:"spinSlow 35s linear infinite" }} />
      <div style={{ position:"absolute", width:150, height:150, borderRadius:"50%", border:"1px dashed rgba(143,174,142,0.18)", bottom:"14%", right:"8%", pointerEvents:"none", animation:"spinSlow 22s linear infinite reverse" }} />

      {/* ══ SUCCESS DIALOG ══ */}
      {showSuccess && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(30,43,30,0.55)",
          backdropFilter: "blur(10px)",
          animation: "overlayIn 0.3s ease",
        }}>
          <div style={{
            background: "#fff", borderRadius: 28,
            padding: "52px 44px 40px",
            maxWidth: 400, width: "90%",
            textAlign: "center",
            boxShadow: "0 48px 96px rgba(30,43,30,0.25)",
            animation: "dialogIn 0.45s cubic-bezier(.22,.68,0,1.2)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:5, background:"linear-gradient(90deg,#8FAE8E,#8FA873,#D9D9A8)" }} />

            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, #8FAE8E, #8FA873)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 22px",
              boxShadow: "0 12px 36px rgba(143,174,142,0.45)",
              animation: "checkPop 0.55s cubic-bezier(.34,1.56,.64,1) 0.2s both",
            }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M8 18.5l7 7 13-14" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <p style={{ fontSize:11, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:"#8FA873", marginBottom:10 }}>All Done!</p>
            <h2 style={{ fontFamily:"'Lora',serif", fontSize:26, fontWeight:700, color:"#2d3b2d", lineHeight:1.2, marginBottom:12 }}>
              Profile Updated,<br /><em style={{ color:"#8FA873" }}>{firstName}!</em>
            </h2>
            <p style={{ color:"#888", fontSize:14, lineHeight:1.7, marginBottom:28 }}>
              Your details have been saved successfully.
            </p>

            <button
              onClick={() => navigate("/CustomerDashboard")}
              style={{
                width:"100%", padding:"14px",
                background:"linear-gradient(135deg,#8FAE8E,#8FA873)",
                color:"#fff", border:"none", borderRadius:14,
                fontSize:15, fontWeight:700, cursor:"pointer",
                fontFamily:"'Nunito',sans-serif",
                boxShadow:"0 4px 20px rgba(143,174,142,0.4)",
                transition:"all 0.25s ease", marginBottom:10,
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity="0.9"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity="1";   e.currentTarget.style.transform="translateY(0)"; }}
            >
              Back to Dashboard →
            </button>

            <button
              onClick={() => setShowSuccess(false)}
              style={{ background:"none", border:"none", color:"#bbb", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color="#888"}
              onMouseLeave={e => e.currentTarget.style.color="#bbb"}
            >
              Continue editing
            </button>
          </div>
        </div>
      )}

      {/* ══ CARD ══ */}
      <div style={{
        width: "100%", maxWidth: 480,
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(143,174,142,0.25)",
        borderRadius: 28,
        padding: "52px 44px 44px",
        boxShadow: "0 24px 64px rgba(90,120,70,0.14)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Top accent */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:5, background:"linear-gradient(90deg,#8FAE8E,#8FA873,#D9D9A8)" }} />

        {/* Avatar */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:32, ...anim(0) }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #8FAE8E, #8FA873)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 32, color: "#fff",
            boxShadow: "0 12px 32px rgba(143,174,142,0.4)",
            marginBottom: 16, animation: "floatY 5s ease-in-out infinite",
          }}>
            {firstName[0]?.toUpperCase() || "U"}
          </div>
          <p style={{ fontSize:12, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:"#8FA873", marginBottom:6 }}>Your Account</p>
          <h1 style={{ fontFamily:"'Lora',serif", fontSize:28, fontWeight:700, color:"#2d3b2d", textAlign:"center" }}>
            Edit Profile
          </h1>
          <p style={{ color:"#aaa", fontSize:14, marginTop:6 }}>Update your personal details below</p>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            background:"#fff5f5", border:"1.5px solid #ef9a9a",
            borderRadius:12, padding:"12px 16px",
            display:"flex", alignItems:"center", gap:10,
            marginBottom:22, animation:"shakeX 0.4s ease",
          }}>
            <span style={{ fontSize:18 }}>⚠️</span>
            <span style={{ color:"#c62828", fontSize:14, fontWeight:600 }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleUpdate}>
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

            {/* Name */}
            <div style={{ ...anim(120) }}>
              <label style={{ fontSize:13, fontWeight:700, color:"#555", display:"block", marginBottom:8, paddingLeft:2 }}>Full Name</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:18, pointerEvents:"none" }}>👤</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused("")}
                  placeholder="Your full name"
                  required
                  style={inputStyle("name")}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ ...anim(200) }}>
              <label style={{ fontSize:13, fontWeight:700, color:"#555", display:"block", marginBottom:8, paddingLeft:2 }}>Email Address</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:18, pointerEvents:"none" }}>📧</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  placeholder="your@email.com"
                  required
                  style={inputStyle("email")}
                />
              </div>
            </div>

            {/* Phone */}
            <div style={{ ...anim(280) }}>
              <label style={{ fontSize:13, fontWeight:700, color:"#555", display:"block", marginBottom:8, paddingLeft:2 }}>Phone Number</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:18, pointerEvents:"none" }}>📱</span>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused("")}
                  placeholder="Your phone number"
                  required
                  style={inputStyle("phone")}
                />
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display:"flex", gap:12, marginTop:8, ...anim(360) }}>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/CustomerDashboard")}
                style={{
                  flex:1, padding:"14px",
                  background:"transparent",
                  border:"2px solid #ddddc8",
                  borderRadius:14, fontSize:15, fontWeight:700,
                  cursor:"pointer", color:"#888",
                  fontFamily:"'Nunito',sans-serif",
                  transition:"all 0.25s ease",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isReady || loading}
                className={isReady ? "submit-btn" : ""}
                style={{
                  flex:2, padding:"14px",
                  background: isReady
                    ? "linear-gradient(135deg,#8FAE8E,#8FA873)"
                    : "#d4d4bc",
                  color: isReady ? "#fff" : "#aaa9a0",
                  border:"none", borderRadius:14,
                  fontSize:15, fontWeight:700,
                  cursor: isReady ? "pointer" : "not-allowed",
                  fontFamily:"'Nunito',sans-serif",
                  boxShadow: isReady ? "0 4px 20px rgba(143,174,142,0.4)" : "none",
                  transition:"all 0.3s ease",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width:17, height:17, borderRadius:"50%",
                      border:"2.5px solid rgba(255,255,255,0.35)",
                      borderTopColor:"#fff", display:"inline-block",
                      animation:"spinSlow 0.7s linear infinite",
                    }} />
                    Updating...
                  </>
                ) : "Save Changes →"}
              </button>
            </div>
          </div>
        </form>

        {/* Footer note */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:28, ...anim(420) }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"#4caf50", display:"inline-block", animation:"pulseDot 1.8s ease-in-out infinite" }} />
          <span style={{ fontSize:12, color:"#aaa", fontWeight:600 }}>Your data is safe and never shared</span>
        </div>
      </div>
      </main>
    </div>
  );
}