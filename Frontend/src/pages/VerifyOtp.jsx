import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../api/auth";
import { 
  Mail, 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle 
} from "lucide-react";


export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const inputRefs = useRef([]);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const phone = location.state?.phone;

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=Nunito:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setTimeout(() => setLoaded(true), 80);
    // Focus first input
    setTimeout(() => inputRefs.current[0]?.focus(), 200);
  }, []);

  const anim = (delay = 0) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
  });

  // Handle individual digit input
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only
    setError("");
    const updated = [...otp];
    updated[index] = value.slice(-1); // only last char
    setOtp(updated);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = [...otp];
    for (let i = 0; i < pasted.length; i++) updated[i] = pasted[i];
    setOtp(updated);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const otpValue = otp.join("");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otpValue.length < 6) { setError("Please enter the complete 6-digit OTP."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await verifyOTP({ email, phone, otp: otpValue });
      // Replace alert with navigation — success is self-evident on next page
      navigate("/login", { state: { verified: true, message: res.data.message } });
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const maskedContact = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(b.length) + c)
    : phone
    ? phone.replace(/(\d{2})\d+(\d{2})/, "$1*****$2")
    : "your email or phone";

  const isReady = otpValue.length === 6;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#E7E6B6",
      fontFamily: "'Nunito', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%      { transform: scale(1.6); opacity: 0.35; }
        }
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-5px); }
          80%      { transform: translateX(5px); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
        .otp-input {
          width: 52px; height: 60px;
          border: 2px solid #e8e8d8;
          border-radius: 16px;
          text-align: center;
          font-size: 26px; font-weight: 800;
          font-family: 'Nunito', sans-serif;
          color: #2d3b2d; background: #fff;
          outline: none;
          transition: all 0.22s ease;
          caret-color: transparent;
        }
        .otp-input:focus {
          border-color: #8FAE8E;
          box-shadow: 0 0 0 4px rgba(143,174,142,0.15);
          background: #fafff8;
          transform: translateY(-2px);
        }
        .otp-input.filled {
          border-color: #8FA873;
          background: #f4f8f4;
          color: #5a7a50;
        }
        .otp-input.error {
          border-color: #ef5350;
          background: #fff5f5;
          animation: shakeX 0.4s ease;
        }
        .verify-btn:hover { opacity: 0.9 !important; transform: translateY(-2px) !important; box-shadow: 0 10px 32px rgba(143,174,142,0.55) !important; }
        .link-hover:hover { color: #5a7a50 !important; }
        .resend-btn:hover { color: #5a7a50 !important; }
      `}</style>

      {/* Background decorative blobs */}
      <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(143,168,115,0.18) 0%, transparent 70%)", top:"-100px", right:"-100px", pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle, rgba(217,217,168,0.4) 0%, transparent 70%)", bottom:"-60px", left:"-60px", pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:260, height:260, borderRadius:"50%", border:"1.5px dashed rgba(143,174,142,0.3)", top:"12%", left:"8%", pointerEvents:"none", animation:"spinSlow 35s linear infinite" }} />
      <div style={{ position:"absolute", width:160, height:160, borderRadius:"50%", border:"1px dashed rgba(143,174,142,0.2)", bottom:"18%", right:"10%", pointerEvents:"none", animation:"spinSlow 25s linear infinite reverse" }} />

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 460,
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(143,174,142,0.25)",
        borderRadius: 28,
        padding: "52px 44px 44px",
        boxShadow: "0 24px 64px rgba(90,120,70,0.14)",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}>
        {/* Top accent bar */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:5, background:"linear-gradient(90deg, #8FAE8E, #8FA873, #D9D9A8)" }} />

        {/* Floating icon */}
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: "linear-gradient(135deg, #8FAE8E, #8FA873)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 34, margin: "0 auto 24px",
          boxShadow: "0 12px 32px rgba(143,174,142,0.4)",
          animation: "floatY 5s ease-in-out infinite",
          color: "#fff",
          ...anim(0),
        }}>
          <Mail size={38} />
        </div>


        {/* Heading */}
        <div style={{ ...anim(100) }}>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "#8FA873", marginBottom: 10 }}>One Last Step</p>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 30, fontWeight: 700, color: "#2d3b2d", lineHeight: 1.2, marginBottom: 12 }}>
            Verify Your Account
          </h1>
          <p style={{ color: "#888", fontSize: 15, lineHeight: 1.7, marginBottom: 8 }}>
            We sent a 6-digit code to
          </p>
          <p style={{ fontWeight: 800, color: "#2d3b2d", fontSize: 15, marginBottom: 32 }}>
            {maskedContact}
          </p>
        </div>

        {/* OTP input boxes */}
        <form onSubmit={handleVerify}>
          <div style={{
            display: "flex", justifyContent: "center", gap: 10,
            marginBottom: 24,
            ...anim(180),
          }} onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                className={`otp-input ${digit ? "filled" : ""} ${error && !digit ? "error" : ""}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
              />
            ))}
          </div>

          {/* Separator dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 20, ...anim(220) }}>
            {otp.map((digit, i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: digit ? "#8FA873" : "rgba(143,174,142,0.25)",
                transition: "background 0.2s ease",
              }} />
            ))}
          </div>

          {/* Error */}
            <div style={{
              background: "#fff5f5", border: "1.5px solid #ef9a9a",
              borderRadius: 12, padding: "12px 16px",
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 20, textAlign: "left",
              animation: "shakeX 0.4s ease",
            }}>
              <AlertTriangle size={18} color="#c62828" />
              <span style={{ color: "#c62828", fontSize: 14, fontWeight: 600 }}>{error}</span>
            </div>


          {/* Submit */}
          <button
            type="submit"
            disabled={!isReady || loading}
            className={isReady ? "verify-btn" : ""}
            style={{
              width: "100%", padding: "15px",
              background: isReady
                ? "linear-gradient(135deg, #8FAE8E, #8FA873)"
                : "#d4d4bc",
              color: isReady ? "#fff" : "#aaa9a0",
              border: "none", borderRadius: 14,
              fontSize: 16, fontWeight: 700,
              cursor: isReady ? "pointer" : "not-allowed",
              fontFamily: "'Nunito', sans-serif",
              boxShadow: isReady ? "0 4px 20px rgba(143,174,142,0.4)" : "none",
              transition: "all 0.3s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              ...anim(280),
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 18, height: 18, borderRadius: "50%",
                  border: "2.5px solid rgba(255,255,255,0.35)",
                  borderTopColor: "#fff",
                  display: "inline-block",
                  animation: "spinSlow 0.7s linear infinite",
                }} />
                Verifying...
              </>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                Verify OTP <ArrowRight size={18} />
              </span>
            )}

          </button>
        </form>

        {/* Resend + back */}
        <div style={{ marginTop: 28, ...anim(360) }}>
          <p style={{ color: "#aaa", fontSize: 14, marginBottom: 10 }}>
            Didn't receive the code?{" "}
            <button
              className="resend-btn"
              onClick={() => { setOtp(["","","","","",""]); setError(""); inputRefs.current[0]?.focus(); }}
              style={{ background: "none", border: "none", color: "#8FA873", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Nunito', sans-serif", transition: "color 0.2s" }}
            >
              Resend OTP
            </button>
          </p>
          <a href="/signup" className="link-hover" style={{ color: "#8FA873", fontWeight: 700, fontSize: 14, textDecoration: "none", transition: "color 0.2s", display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={16} /> Back to Sign Up
          </a>

        </div>

        {/* Bottom pulsing dot note */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:28, ...anim(400) }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"#4caf50", display:"inline-block", animation:"pulseDot 1.8s ease-in-out infinite" }} />
          <span style={{ fontSize:12, color:"#aaa", fontWeight:600 }}>Secured with end-to-end encryption</span>
        </div>
      </div>
    </div>
  );
}