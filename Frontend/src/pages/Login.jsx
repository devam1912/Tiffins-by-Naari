import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import {
    Utensils,
    Home,
    Leaf,
    Truck,
    ArrowLeft,
    ArrowRight,
    Mail,
    Lock,
    Eye,
    EyeOff,
    AlertTriangle
} from "lucide-react";

export default function Login() {
    const [loaded, setLoaded] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });
    const [focused, setFocused] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isFormReady = form.email.trim() !== "" && form.password !== "";

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isFormReady || loading) return;

        setError("");
        setLoading(true);

        try {
            const res = await loginUser({
                email: form.email,
                password: form.password,
            });

            const token = res.data.token;
            const user = res.data.user;

            dispatch(loginSuccess({ user, token }));

            // role based navigation
            if (user.role === "admin") {
                navigate("/admin");
            }
            else if (user.role === "provider") {
                navigate("/ProviderDashboard");
            }
            else {
                navigate("/CustomerDashboard");
            }

        } catch (err) {
            console.log(err);
            setError(
                err.response?.data?.message ||
                "Invalid email or password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=Nunito:wght@400;500;600;700;800&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        setTimeout(() => setLoaded(true), 80);
    }, []);

    const anim = (delay) => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
    });

    const inputStyle = (name) => ({
        width: "100%",
        padding: "14px 16px 14px 44px",
        border: `2px solid ${error && (name === "email" || name === "password") ? "#ef5350"
            : focused === name ? "#8FAE8E"
                : "#e8e8d8"
            }`,
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
        <div className="login-container" style={{
            minHeight: "100vh",
            background: "#E7E6B6",
            fontFamily: "'Nunito', sans-serif",
            display: "flex",
            overflow: "hidden",
            position: "relative",
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
                @keyframes shakeX {
                    0%, 100% { transform: translateX(0); }
                    20%      { transform: translateX(-8px); }
                    40%      { transform: translateX(8px); }
                    60%      { transform: translateX(-5px); }
                    80%      { transform: translateX(5px); }
                }
                .shake { animation: shakeX 0.45s ease; }
                .google-btn:hover  { background: #f5f5f5 !important; box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important; }
                .submit-active:hover { opacity: 0.9 !important; transform: translateY(-1px) !important; box-shadow: 0 8px 28px rgba(143,174,142,0.55) !important; }
                .link-hover:hover  { color: #5a7a50 !important; }

                @media (max-width: 900px) {
                    .login-container { flex-direction: column !important; min-height: auto !important; }
                    .left-panel { display: none !important; }
                    .right-panel { padding: 60px 24px !important; min-height: 100vh !important; justify-content: flex-start !important; }
                }
            `}</style>

            {/* ── LEFT PANEL ── */}
            <div className="left-panel" style={{
                flex: 1,
                background: "linear-gradient(145deg, #8FA873, #6b8a5e)",
                display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center",
                padding: "60px 48px",
                position: "relative", overflow: "hidden",
            }}>
                {/* Decorative rings */}
                <div style={{ position: "absolute", width: 440, height: 440, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", top: "-120px", left: "-120px" }} />
                <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", bottom: "-80px", right: "-80px" }} />
                <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", border: "1.5px dashed rgba(255,255,255,0.15)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "spinSlow 25s linear infinite" }} />
                <div style={{ position: "absolute", width: 340, height: 340, borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.08)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "spinSlow 40s linear infinite reverse" }} />

                <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 360 }}>
                    {/* Logo */}
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 32, margin: "0 auto 28px",
                        backdropFilter: "blur(8px)",
                        animation: "floatY 5s ease-in-out infinite",
                    }}><img src="/logo.png" alt="Logo" style={{ width: "90%", height: "90%", objectFit: "contain", borderRadius: 12 }} /></div>

                    <h2 style={{
                        fontFamily: "'Lora', serif",
                        fontSize: 36, fontWeight: 700,
                        color: "#fff", lineHeight: 1.2, marginBottom: 16,
                        ...anim(100),
                    }}>
                        Welcome back to<br /><em>Tiffins-By-Naari</em>
                    </h2>

                    <p style={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: 15, lineHeight: 1.7, marginBottom: 40,
                        ...anim(200),
                    }}>
                        Your favourite home-cooked meals are waiting. Log in to continue your delicious journey.
                    </p>

                    {/* Feature pills */}
                    {[
                        { icon: <Home size={22} />, text: "Authentic home kitchens" },
                        { icon: <Leaf size={22} />, text: "Healthy, wholesome meals" },
                        { icon: <Truck size={22} />, text: "Fresh daily pickup" },
                    ].map(({ icon, text }, i) => (
                        <div key={text} style={{
                            display: "flex", alignItems: "center", gap: 12,
                            background: "rgba(255,255,255,0.12)",
                            border: "1px solid rgba(255,255,255,0.18)",
                            borderRadius: 14, padding: "12px 18px",
                            marginBottom: 10, textAlign: "left",
                            backdropFilter: "blur(6px)",
                            ...anim(300 + i * 100),
                        }}>
                            <span style={{ color: "#fff", display: 'flex', alignItems: 'center' }}>{icon}</span>
                            <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{text}</span>

                        </div>
                    ))}
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="right-panel" style={{
                flex: 1,
                display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center",
                padding: "60px 48px",
                background: "#E7E6B6",
                position: "relative",
            }}>
                {/* bg blob */}
                <div style={{
                    position: "absolute", width: 400, height: 400, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(143,168,115,0.15), transparent 70%)",
                    top: "-60px", right: "-80px", pointerEvents: "none",
                }} />

                <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>

                    {/* Back */}
                    <Link to="/" style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        color: "#8FA873", fontWeight: 700, fontSize: 14,
                        textDecoration: "none", marginBottom: 36,
                        ...anim(0),
                    }}>
                        <ArrowLeft size={16} /> Back to home
                    </Link>


                    <div style={{ ...anim(100) }}>
                        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#8FA873", marginBottom: 8 }}>Welcome Back</p>
                        <h1 style={{ fontFamily: "'Lora', serif", fontSize: 38, fontWeight: 700, color: "#2d3b2d", marginBottom: 8 }}>Log In</h1>
                        <p style={{ color: "#888", fontSize: 15, marginBottom: 36 }}>
                            Don't have an account?{" "}
                            <Link to="/signup" style={{ color: "#8FA873", fontWeight: 700, textDecoration: "none", display: 'inline-flex', alignItems: 'center', gap: 4 }} className="link-hover">
                                Sign up free <ArrowRight size={14} />
                            </Link>

                        </p>
                    </div>

                    {/* Google */}
                    <button className="google-btn" style={{
                        width: "100%", padding: "13px 20px",
                        background: "#fff",
                        border: "1.5px solid #e0e0d0",
                        borderRadius: 14, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                        fontSize: 15, fontWeight: 700, color: "#333",
                        fontFamily: "'Nunito', sans-serif",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        transition: "all 0.25s ease",
                        marginBottom: 24,
                        ...anim(200),
                    }}>
                        <svg width="20" height="20" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
                            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
                            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.3C9.7 35.7 16.3 44 24 44z" />
                            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.2 5.2C37 38.3 44 33 44 24c0-1.3-.1-2.6-.4-3.9z" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, ...anim(250) }}>
                        <div style={{ flex: 1, height: 1, background: "#ddddc8" }} />
                        <span style={{ color: "#aaa", fontSize: 13, fontWeight: 600 }}>or login with email</span>
                        <div style={{ flex: 1, height: 1, background: "#ddddc8" }} />
                    </div>

                    {/* Error banner */}
                    {error && (
                        <div className="shake" style={{
                            background: "#fff5f5",
                            border: "1.5px solid #ef9a9a",
                            borderRadius: 12,
                            padding: "12px 16px",
                            marginBottom: 18,
                            display: "flex", alignItems: "center", gap: 10,
                        }}>
                            <AlertTriangle size={18} color="#c62828" />
                            <span style={{ color: "#c62828", fontSize: 14, fontWeight: 600 }}>{error}</span>
                        </div>

                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                            {/* Email */}
                            <div style={{ position: "relative", ...anim(300) }}>
                                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8FA873", pointerEvents: "none", display: 'flex', alignItems: 'center' }}>
                                    <Mail size={18} />
                                </span>

                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={form.email}
                                    onChange={e => { setForm({ ...form, email: e.target.value }); setError(""); }}
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused("")}
                                    style={inputStyle("email")}
                                />
                            </div>

                            {/* Password */}
                            <div style={{ position: "relative", ...anim(380) }}>
                                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8FA873", pointerEvents: "none", display: 'flex', alignItems: 'center' }}>
                                    <Lock size={18} />
                                </span>

                                <input
                                    type={showPass ? "text" : "password"}
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={e => { setForm({ ...form, password: e.target.value }); setError(""); }}
                                    onFocus={() => setFocused("password")}
                                    onBlur={() => setFocused("")}
                                    style={{ ...inputStyle("password"), paddingRight: 48 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8FA873", padding: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}
                                >
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>

                            </div>

                            {/* Forgot password */}
                            <div style={{ textAlign: "right", marginTop: -8, ...anim(420) }}>
                                <a href="#" style={{ color: "#8FA873", fontWeight: 700, fontSize: 14, textDecoration: "none" }} className="link-hover">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={!isFormReady || loading}
                                className={isFormReady ? "submit-active" : ""}
                                style={{
                                    width: "100%", padding: "15px",
                                    background: isFormReady
                                        ? "linear-gradient(135deg, #8FAE8E, #8FA873)"
                                        : "#d4d4bc",
                                    color: isFormReady ? "#fff" : "#aaa9a0",
                                    border: "none", borderRadius: 14,
                                    fontSize: 16, fontWeight: 700,
                                    cursor: isFormReady ? "pointer" : "not-allowed",
                                    fontFamily: "'Nunito', sans-serif",
                                    boxShadow: isFormReady ? "0 4px 20px rgba(143,174,142,0.4)" : "none",
                                    transition: "all 0.3s ease",
                                    marginTop: 4,
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                    ...anim(480),
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span style={{
                                            width: 18, height: 18, borderRadius: "50%",
                                            border: "2.5px solid rgba(255,255,255,0.4)",
                                            borderTopColor: "#fff",
                                            display: "inline-block",
                                            animation: "spinSlow 0.7s linear infinite",
                                        }} />
                                        Logging in...
                                    </>
                                ) : (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        Log In <ArrowRight size={18} />
                                    </span>
                                )}

                            </button>
                        </div>
                    </form>

                    {/* Footer note */}
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        marginTop: 28,
                        ...anim(540),
                    }}>
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#8FA873", display: "inline-block", animation: "pulseDot 1.8s ease-in-out infinite" }} />
                        <span style={{ fontSize: 13, color: "#888", fontWeight: 600 }}>Home-cooked · Trusted by our customers</span>
                    </div>
                </div>
            </div>
        </div>
    );
}