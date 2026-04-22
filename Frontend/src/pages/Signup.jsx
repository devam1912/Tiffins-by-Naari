import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api/auth";
import { 
  Utensils, 
  User, 
  Mail, 
  Smartphone, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle 
} from "lucide-react";


/* ══ ERROR DIALOG ══ */
function ErrorDialog({ message, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(30,43,30,0.58)", backdropFilter: "blur(10px)", animation: "overlayIn 0.3s ease" }}>
      <div style={{ background: "#fff", borderRadius: 28, padding: "52px 44px 40px", maxWidth: 400, width: "90%", textAlign: "center", boxShadow: "0 48px 96px rgba(30,43,30,0.28)", animation: "dialogIn 0.45s cubic-bezier(.22,.68,0,1.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: "linear-gradient(90deg,#ef5350,#e57373,#ffcdd2)" }} />
        <div style={{ width: 84, height: 84, borderRadius: "50%", background: "linear-gradient(135deg,#ef5350,#e57373)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", boxShadow: "0 12px 36px rgba(239,83,80,0.35)", animation: "checkPop 0.55s cubic-bezier(.34,1.56,.64,1) 0.2s both" }}>
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none"><path d="M12 12l14 14M26 12L12 26" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" /></svg>
        </div>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "#ef5350", marginBottom: 10 }}>Something went wrong</p>
        <h2 style={{ fontFamily: "'Lora',serif", fontSize: 24, fontWeight: 700, color: "#2d3b2d", lineHeight: 1.2, marginBottom: 14 }}>Couldn't create account</h2>
        <p style={{ color: "#777", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>{message}</p>
        <button onClick={onClose} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.25s ease" }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
        >Try Again</button>
      </div>
    </div>
  );
}

/* ══ VALIDATION ══ */
const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE  = /^[6-9]\d{9}$/;
const HAS_UPPER = /[A-Z]/;
const HAS_NUM   = /[0-9]/;
const validateEmail    = (v) => EMAIL_RE.test(v.trim());
const validatePhone    = (v) => PHONE_RE.test(v.trim());
const validatePassword = (v) => v.length >= 8 && HAS_UPPER.test(v) && HAS_NUM.test(v);

function FieldHint({ show, message }) {
  if (!show) return null;
  return <p style={{ fontSize: 12, color: "#ef5350", fontWeight: 600, marginTop: 5, paddingLeft: 2, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12} /> {message}</p>;
}


const INITIAL_FORM = { name: "", email: "", phone: "", password: "", confirm: "" };

/* ══ MAIN COMPONENT ══ */
export default function Signup() {
  const [loaded,      setLoaded]      = useState(false);
  const [form,        setForm]        = useState(INITIAL_FORM);
  const [focused,     setFocused]     = useState("");
  const [touched,     setTouched]     = useState({});
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed,      setAgreed]      = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [errorMsg,    setErrorMsg]    = useState(null);
  const navigate = useNavigate();

  const emailOk    = validateEmail(form.email);
  const phoneOk    = validatePhone(form.phone);
  const passwordOk = validatePassword(form.password);
  const confirmOk  = form.confirm !== "" && form.password === form.confirm;

  const isFormReady = agreed && emailOk && phoneOk && passwordOk && confirmOk && form.name.trim() !== "";

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=Nunito:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setTimeout(() => setLoaded(true), 80);
  }, []);

  const anim = (d) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.65s ease ${d}ms, transform 0.65s cubic-bezier(.22,.68,0,1.2) ${d}ms`,
  });

  const borderFor = (name, valid) => {
    if (touched[name] && !valid) return "#ef5350";
    if (touched[name] &&  valid) return "#4caf50";
    if (focused === name)        return "#8FAE8E";
    return "#e8e8d8";
  };

  const inputStyle = (name, valid) => ({
    width: "100%", padding: "14px 16px 14px 44px",
    border: `2px solid ${borderFor(name, valid)}`,
    borderRadius: 14, fontSize: 15, fontFamily: "'Nunito',sans-serif", color: "#2d3b2d",
    background: focused === name ? "#fafff8" : "#fff",
    outline: "none", transition: "all 0.25s ease",
    boxShadow: focused === name ? "0 0 0 4px rgba(143,174,142,0.12)" : "none",
  });

  const f = (name) => ({
    value: form[name],
    onChange: e => setForm(prev => ({ ...prev, [name]: e.target.value })),
    onFocus:  () => setFocused(name),
    onBlur:   () => {
      setFocused("");
      if (form[name].length > 0) setTouched(t => ({ ...t, [name]: true }));
    },
  });

  const strength = (() => {
    const p = form.password;
    if (!p) return null;
    const score = [p.length >= 8, HAS_UPPER.test(p), HAS_NUM.test(p)].filter(Boolean).length;
    if (score <= 1) return { label: "Weak",   color: "#ef5350", width: "33%" };
    if (score === 2) return { label: "Fair",   color: "#ff9800", width: "66%" };
    return             { label: "Strong", color: "#4caf50", width: "100%" };
  })();

  const handleSignup = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, password: true, confirm: true });
    if (!isFormReady || loading) return;
    setLoading(true);
    try {
      await signupUser({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: "customer" });
      navigate("/verify-otp", { state: { email: form.email, phone: form.phone } });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito',sans-serif", display: "flex", overflow: "hidden", position: "relative" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #bbb; }
        @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0.4} }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        @keyframes dialogIn  { from{opacity:0;transform:scale(0.88) translateY(28px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes checkPop  { 0%{transform:scale(0) rotate(-20deg);opacity:0} 65%{transform:scale(1.2) rotate(5deg);opacity:1} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        .google-btn:hover    { background:#f5f5f5 !important; box-shadow:0 4px 16px rgba(0,0,0,0.1) !important; }
        .submit-active:hover { opacity:0.9 !important; transform:translateY(-1px) !important; box-shadow:0 8px 28px rgba(143,174,142,0.55) !important; }
        .link-hover:hover    { color:#5a7a50 !important; }
      `}</style>

      {errorMsg && <ErrorDialog message={errorMsg} onClose={() => setErrorMsg(null)} />}

      {/* LEFT PANEL */}
      <div style={{ flex: 1, background: "linear-gradient(145deg,#8FA873,#6b8a5e)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 440, height: 440, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", top: "-120px", left: "-120px" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", bottom: "-80px", right: "-80px" }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", border: "1.5px dashed rgba(255,255,255,0.15)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "spinSlow 25s linear infinite" }} />

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 360 }}>
<<<<<<< HEAD
          <div style={{ width: 72, height: 72, borderRadius: 22, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", margin: "0 auto 28px", backdropFilter: "blur(8px)", animation: "floatY 5s ease-in-out infinite" }}>
            <Utensils size={40} />
=======
          <div style={{ width: 72, height: 72, borderRadius: 22, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 28px", backdropFilter: "blur(8px)", animation: "floatY 5s ease-in-out infinite", overflow: "hidden" }}>
            <img src="/logo.png" alt="Logo" style={{ width: "95%", height: "95%", objectFit: "contain", borderRadius: 12 }} />
>>>>>>> e64a4d2cf07645efe503643237541708e9a4380d
          </div>

          <h2 style={{ fontFamily: "'Lora',serif", fontSize: 34, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
            Join the<br /><em>Naari Family</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
            Start your journey to authentic, home-cooked goodness. Fresh and wholesome, delivered with love every day.
          </p>
          {["Create your free account", "Browse home kitchens near you", "Subscribe & enjoy daily meals"].map((text, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, textAlign: "left" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lora',serif", fontWeight: 700, color: "#fff", fontSize: 14 }}>{i + 1}</div>
              <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600, fontSize: 14 }}>{text}</span>
            </div>
          ))}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "8px 18px", marginTop: 20 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#4caf50", display: "inline-block", animation: "pulseDot 1.8s ease-in-out infinite" }} />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Home-cooked · Trusted Platform</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "48px 48px", background: "#E7E6B6", position: "relative", overflowY: "auto" }}>
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(143,168,115,0.15),transparent 70%)", bottom: "-80px", right: "-80px", pointerEvents: "none" }} />

        <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>

          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#8FA873", fontWeight: 700, fontSize: 14, textDecoration: "none", marginBottom: 28, ...anim(0) }}>
            <ArrowLeft size={16} /> Back to home
          </a>


          <div style={{ ...anim(100) }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#8FA873", marginBottom: 8 }}>Get Started</p>
            <h1 style={{ fontFamily: "'Lora',serif", fontSize: 36, fontWeight: 700, color: "#2d3b2d", marginBottom: 8 }}>Create Account</h1>
            <p style={{ color: "#888", fontSize: 15, marginBottom: 24 }}>
              Already have an account?{" "}
              <a href="/login" style={{ color: "#8FA873", fontWeight: 700, textDecoration: "none", display: 'inline-flex', alignItems: 'center', gap: 4 }} className="link-hover">
                Log in <ArrowRight size={14} />
              </a>

            </p>
          </div>

          {/* Google sign up */}
          <button className="google-btn" style={{ width: "100%", padding: "13px 20px", background: "#fff", border: "1.5px solid #e0e0d0", borderRadius: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 15, fontWeight: 700, color: "#333", fontFamily: "'Nunito',sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "all 0.25s ease", marginBottom: 20, ...anim(150) }}>
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.3C9.7 35.7 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.2 5.2C37 38.3 44 33 44 24c0-1.3-.1-2.6-.4-3.9z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, ...anim(200) }}>
            <div style={{ flex: 1, height: 1, background: "#ddddc8" }} />
            <span style={{ color: "#aaa", fontSize: 13, fontWeight: 600 }}>or sign up with email</span>
            <div style={{ flex: 1, height: 1, background: "#ddddc8" }} />
          </div>

          {/* FORM */}
          <form onSubmit={handleSignup}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Name */}
              <div style={{ ...anim(250) }}>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8FA873", pointerEvents: "none", display: 'flex', alignItems: 'center' }}>
                    <User size={18} />
                  </span>

                  <input type="text" placeholder="Full name" {...f("name")} style={inputStyle("name", form.name.trim() !== "")} />
                </div>
                <FieldHint show={touched.name && !form.name.trim()} message="Name is required" />
              </div>

              {/* Email */}
              <div style={{ ...anim(300) }}>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8FA873", pointerEvents: "none", display: 'flex', alignItems: 'center' }}>
                    <Mail size={18} />
                  </span>

                  <input type="email" placeholder="Email address" {...f("email")} style={inputStyle("email", emailOk)} />
                </div>
                <FieldHint show={touched.email && !emailOk} message="Invalid email format" />
              </div>

              {/* Phone */}
              <div style={{ ...anim(350) }}>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8FA873", pointerEvents: "none", display: 'flex', alignItems: 'center' }}>
                    <Smartphone size={18} />
                  </span>

                  <input type="tel" placeholder="Phone number (10-digit)" {...f("phone")} style={inputStyle("phone", phoneOk)} />
                </div>
                <FieldHint show={touched.phone && !phoneOk} message="Phone must be a valid 10-digit Indian number" />
              </div>

              {/* Password */}
              <div style={{ ...anim(400) }}>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8FA873", pointerEvents: "none", display: 'flex', alignItems: 'center' }}>
                    <Lock size={18} />
                  </span>

                  <input type={showPass ? "text" : "password"} placeholder="Create password" {...f("password")}
                    style={{ ...inputStyle("password", passwordOk), paddingRight: 48 }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8FA873", padding: 0, display: 'flex', alignItems: 'center' }}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                </div>
                {strength && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ height: 4, background: "#e0e0d0", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: strength.width, background: strength.color, borderRadius: 4, transition: "all 0.4s ease" }} />
                    </div>
                    <span style={{ fontSize: 12, color: strength.color, fontWeight: 700, marginTop: 4, display: "block" }}>{strength.label} password</span>
                  </div>
                )}
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                  {[
                    { label: "At least 8 characters", met: form.password.length >= 8 },
                    { label: "One uppercase letter", met: HAS_UPPER.test(form.password) },
                    { label: "One number", met: HAS_NUM.test(form.password) },
                  ].map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 14, height: 14, borderRadius: "50%",
                        border: `1.5px solid ${c.met ? "#4caf50" : "#bbb"}`,
                        background: c.met ? "#4caf50" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.3s ease"
                      }}>
                        {c.met && <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </div>
                      <span style={{ fontSize: 12, color: c.met ? "#2d3b2d" : "#999", fontWeight: c.met ? 700 : 500, transition: "all 0.3s ease" }}>
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm password */}
              <div style={{ ...anim(450) }}>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8FA873", pointerEvents: "none", display: 'flex', alignItems: 'center' }}>
                    <CheckCircle2 size={18} />
                  </span>

                  <input type={showConfirm ? "text" : "password"} placeholder="Confirm password" {...f("confirm")}
                    style={{ ...inputStyle("confirm", confirmOk), paddingRight: 48 }} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8FA873", padding: 0, display: 'flex', alignItems: 'center' }}>
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                </div>
                <FieldHint show={touched.confirm && !confirmOk} message="Passwords don't match" />
              </div>

              {/* Terms */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", ...anim(500) }}>
                <div onClick={() => setAgreed(!agreed)} style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1, border: `2px solid ${agreed ? "#8FAE8E" : "#ccc"}`, background: agreed ? "#8FAE8E" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease", cursor: "pointer" }}>
                  {agreed && <Check size={14} color="#fff" strokeWidth={3} />}
                </div>

                <span style={{ fontSize: 13, color: "#777", lineHeight: 1.5 }}>
                  I agree to the{" "}<a href="#" style={{ color: "#8FA873", fontWeight: 700, textDecoration: "none" }}>Terms of Service</a>{" "}and{" "}
                  <a href="#" style={{ color: "#8FA873", fontWeight: 700, textDecoration: "none" }}>Privacy Policy</a>
                </span>
              </label>

              {/* Submit */}
              <button type="submit" disabled={!isFormReady || loading} className={isFormReady ? "submit-active" : ""}
                style={{ width: "100%", padding: "15px", background: isFormReady ? "linear-gradient(135deg,#8FAE8E,#8FA873)" : "#d4d4bc", color: isFormReady ? "#fff" : "#aaa9a0", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: isFormReady ? "pointer" : "not-allowed", fontFamily: "'Nunito',sans-serif", boxShadow: isFormReady ? "0 4px 20px rgba(143,174,142,0.4)" : "none", transition: "all 0.35s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, ...anim(550) }}
              >
                {loading ? (
                  <><span style={{ width: 17, height: 17, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.35)", borderTopColor: "#fff", display: "inline-block", animation: "spinSlow 0.7s linear infinite" }} /> Creating Account...</>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Create My Account <ArrowRight size={18} />
                  </span>
                )}

              </button>

              {!isFormReady && (Object.values(form).some(v => v !== "") || agreed) && (
                <p style={{ textAlign: "center", fontSize: 12, color: "#bbb", marginTop: -6 }}>
                  {!agreed ? "Please agree to the terms to continue"
                    : !confirmOk && form.confirm ? "Passwords don't match"
                    : "Fill in all fields correctly to continue"}
                </p>
              )}
            </div>
          </form>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24, ...anim(580) }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#4caf50", display: "inline-block", animation: "pulseDot 1.8s ease-in-out infinite" }} />
            <span style={{ fontSize: 13, color: "#888", fontWeight: 600 }}>Free to join · No credit card needed</span>
          </div>

        </div>
      </div>
    </div>
  );
}