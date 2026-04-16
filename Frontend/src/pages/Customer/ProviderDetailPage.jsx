import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

/* ─────────────────────────────────────────
   SUCCESS OVERLAY
───────────────────────────────────────── */
const SuccessOverlay = ({ name, plan, slot, onClose, onView }) => {
    useEffect(() => {
        const fn = e => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", fn);
        return () => document.removeEventListener("keydown", fn);
    }, []);
    return (
        <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
            style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,18,10,0.72)", backdropFilter: "blur(20px)", padding: 24, animation: "oIn .2s ease" }}>
            <div style={{ background: "#fff", borderRadius: 32, padding: "56px 48px 44px", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 64px 120px rgba(10,30,10,0.35)", animation: "mIn .42s cubic-bezier(.22,.68,0,1.2)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg,#8FAE8E,#8FA873,#D9D9A8)", borderRadius: "32px 32px 0 0" }} />
                <div style={{ width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: 44, boxShadow: "0 20px 56px rgba(143,174,142,0.5)", animation: "bIn .6s cubic-bezier(.34,1.56,.64,1) .12s both" }}>
                    🎉
                </div>
                <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase", color: "#8FA873", marginBottom: 10 }}>Subscribed!</p>
                <h2 style={{ fontFamily: "'Lora',serif", fontSize: 28, fontWeight: 700, color: "#1a2a1a", marginBottom: 8, lineHeight: 1.2 }}>Meals are on the way!</h2>
                <p style={{ color: "#999", fontSize: 13, marginBottom: 4, fontWeight: 600 }}>{name}</p>
                <p style={{ color: "#ccc", fontSize: 12, marginBottom: 32, textTransform: "capitalize" }}>{plan} plan · {slot} delivery</p>
                <button onClick={onView}
                    style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", color: "#fff", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Nunito',sans-serif", boxShadow: "0 8px 24px rgba(143,174,142,0.45)", marginBottom: 10, transition: "opacity .2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = ".85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    View My Subscriptions →
                </button>
                <button onClick={onClose}
                    style={{ width: "100%", padding: "12px", background: "transparent", border: "2px solid #ebebdf", borderRadius: 16, fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#bbb", fontFamily: "'Nunito',sans-serif", transition: "all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#8FAE8E"; e.currentTarget.style.color = "#5a7a50"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#ebebdf"; e.currentTarget.style.color = "#bbb"; }}>
                    Stay here
                </button>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
const ProviderDetailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const tiffin = location.state?.tiffin;
    const { token, user } = useSelector(s => s.auth);

    const [planType, setPlanType] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [loading, setLoading] = useState(false);

    const [menuData, setMenuData] = useState(null);
    const [menuLoading, setMenuLoading] = useState(true);
    const [menuExpanded, setMenuExpanded] = useState(false);

    useEffect(() => {
        if (tiffin && tiffin._id) {
            axios.get(`http://localhost:5000/api/tiffins/menu/${tiffin._id}`)
                .then(res => {
                    setMenuData(res.data);
                    setMenuLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching menu:", err);
                    setMenuLoading(false);
                });
        } else {
            setMenuLoading(false);
        }
    }, [tiffin]);
    const [success, setSuccess] = useState(false);
    const [subError, setSubError] = useState("");
    const [vis, setVis] = useState(false);

    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,600;1,700&family=Nunito:wght@400;600;700;800;900&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        setTimeout(() => setVis(true), 60);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    /* ── same logic ── */
    const handleSubscribe = async () => {
        if (!planType || !timeSlot) { setSubError("Please select a plan and time slot."); return; }
        try {
            setLoading(true); setSubError("");

            const res = await axios.post("http://localhost:5000/api/subscriptions",
                { providerId: tiffin._id, planType, timeSlot },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { subscription, razorpayOrderId, amountToPay, key } = res.data;

            // CASE 1: Activated via Wallet balance (Fully covered)
            if (!razorpayOrderId) {
                setSuccess(true);
                return;
            }

            // CASE 2: Gateway Payment Required
            const options = {
                key: key,
                amount: amountToPay * 100, // in paise
                currency: "INR",
                name: "Tiffins-By-Naari",
                description: `${planType.toUpperCase()} Subscription - ${tiffin.businessName}`,
                order_id: razorpayOrderId,
                handler: async (response) => {
                    try {
                        setLoading(true);
                        // Verify payment on backend
                        await axios.post(`http://localhost:5000/api/subscriptions/verify-payment/${subscription._id}`, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, { headers: { Authorization: `Bearer ${token}` } });

                        setSuccess(true);
                    } catch (err) {
                        setSubError("Payment verification failed. Please contact support.");
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                },
                theme: { color: "#8FA873" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (resp) => {
                setSubError(resp.error.description || "Payment failed. Please try again.");
            });
            rzp.open();

        } catch (err) {
            console.error(err);
            setSubError(err.response?.data?.message || "Something went wrong. Try again.");
        } finally { setLoading(false); }
    };

    const a = (d = 0) => ({ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(22px)", transition: `opacity .52s ease ${d}ms, transform .52s cubic-bezier(.22,.68,0,1.2) ${d}ms` });

    const addr = tiffin?.address || tiffin?.area || tiffin?.location?.address || tiffin?.city || null;
    const meals = tiffin?.meals || tiffin?.menu || tiffin?.dishes || [];
    const canSub = !!(planType && timeSlot && !loading);

    /* ── no data ── */
    if (!tiffin) return (
        <div style={{ minHeight: "100vh", background: "#E7E6B6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito',sans-serif" }}>
            <style>{`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}`}</style>
            <div style={{ textAlign: "center", background: "rgba(255,255,255,0.85)", borderRadius: 28, padding: "52px 44px", maxWidth: 400, border: "1.5px solid rgba(143,174,142,0.2)" }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>🍽</div>
                <h2 style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 700, color: "#2d3b2d", marginBottom: 10 }}>No provider data</h2>
                <p style={{ color: "#aaa", fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>Go back and select a tiffin provider from the browse page.</p>
                <button onClick={() => navigate("/browse")} style={{ background: "linear-gradient(135deg,#8FAE8E,#8FA873)", border: "none", borderRadius: 14, padding: "13px 28px", fontSize: 14, fontWeight: 800, color: "#fff", cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
                    Browse Providers →
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito',sans-serif" }}>
            <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#8FAE8E;border-radius:99px}
        @keyframes oIn{from{opacity:0}to{opacity:1}}
        @keyframes mIn{from{opacity:0;transform:scale(.85) translateY(32px)}to{opacity:1;transform:none}}
        @keyframes bIn{0%{transform:scale(0) rotate(-15deg);opacity:0}65%{transform:scale(1.2) rotate(5deg)}100%{transform:scale(1) rotate(0);opacity:1}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes drift{0%,100%{transform:rotate(0)}50%{transform:rotate(360deg)}}
        @keyframes rowIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}

        .back-btn:hover{background:rgba(255,255,255,0.28)!important}
        .meal-row:hover{background:rgba(143,174,142,0.1)!important;border-color:rgba(143,174,142,0.35)!important}
        .sub-btn-active:hover{opacity:.88!important}
        .info-pill{background:#fff;padding:12px 20px;border-radius:20px;display:flex;align-items:center;gap:12px;box-shadow:0 8px 20px rgba(90,120,70,0.04);border:1.5px solid rgba(143,174,142,0.08);flex:1;min-width:200px}

        @media(max-width:760px){
          .main-grid{grid-template-columns:1fr!important}
          .panel-wrap{position:static!important}
          .info-bar{flex-direction:column;align-items:stretch!important}
          .info-pill{min-width:100%}
        }
      `}</style>

            {success && <SuccessOverlay name={tiffin.businessName} plan={planType} slot={timeSlot} onClose={() => setSuccess(false)} onView={() => navigate("/subscriptions")} />}

            {/* ══════════ HERO ══════════ */}
            <div style={{ background: "linear-gradient(158deg,#7da368 0%,#5d7f52 45%,#3f5939 100%)", position: "relative", overflow: "hidden" }}>
                {/* bg blobs */}
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 80% 40%,rgba(255,255,255,0.04) 0%,transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)", top: "-200px", right: "-120px", pointerEvents: "none" }} />
                <div style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.08)", bottom: "-100px", left: "3%", pointerEvents: "none", animation: "drift 55s linear infinite" }} />

                <div style={{ maxWidth: 1060, margin: "0 auto", padding: "36px 40px 0", position: "relative", zIndex: 1 }}>
                    <button className="back-btn" onClick={() => navigate(-1)}
                        style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "7px 14px", color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all .2s", display: "inline-flex", alignItems: "center", gap: 5 }}>
                        ← Back
                    </button>
                </div>

                {/* hero content */}
                <div style={{ maxWidth: 1060, margin: "0 auto", padding: "28px 40px 56px", position: "relative", zIndex: 1 }}>
                    <div style={a(0)}>
                        {/* top label row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Home Kitchen</span>
                            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
                            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 20, padding: "4px 12px" }}>
                                <span style={{ fontSize: 12 }}>🌱</span>
                                <span style={{ color: "#d4edda", fontSize: 11, fontWeight: 800 }}>Pure Veg</span>
                            </div>
                        </div>

                        {/* name */}
                        <h1 style={{ fontFamily: "'Lora',serif", fontSize: 46, fontWeight: 700, color: "#fff", lineHeight: 1.08, marginBottom: 20, letterSpacing: "-0.5px" }}>
                            {tiffin.businessName}
                        </h1>

                        {/* meta strip */}
                        <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
                            {[
                                addr && { icon: "📍", text: addr },
                                tiffin.rating > 0 && { icon: "⭐", text: `${Number(tiffin.rating).toFixed(1)} rating` },
                                tiffin.pricePerMeal && { icon: "💰", text: `₹${tiffin.pricePerMeal}/meal` },
                                tiffin.distanceKm && { icon: "📏", text: `${tiffin.distanceKm} km away` },
                            ].filter(Boolean).map((m, i, arr) => (
                                <React.Fragment key={i}>
                                    <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.78)", fontSize: 13, fontWeight: 600, padding: "0 16px 0 (i===0?0:0)" }}>
                                        <span style={{ fontSize: 14 }}>{m.icon}</span>{m.text}
                                    </span>
                                    {i < arr.length - 1 && <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.2)", margin: "0 4px" }} />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                {/* wavy bottom edge */}
                <div style={{ height: 40, background: "#E7E6B6", borderRadius: "50% 50% 0 0 / 40px 40px 0 0", marginTop: -1 }} />
            </div>

            {/* ══════════ QUICK INFO BAR ══════════ */}
            <div style={{ maxWidth: 1060, margin: "-20px auto 24px", padding: "0 40px", position: "relative", zIndex: 10 }}>
                <div className="info-bar" style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flex: 1 }}>
                        <div className="info-pill">
                            <span style={{ fontSize: 18 }}>👩‍🍳</span>
                            <div>
                                <p style={{ fontSize: 9, fontWeight: 800, color: "#8FAE8E", textTransform: "uppercase", letterSpacing: 1 }}>Chef</p>
                                <p style={{ fontSize: 13, fontWeight: 700, color: "#2d3b2d" }}>{tiffin.ownerName}</p>
                            </div>
                        </div>
                        <div className="info-pill">
                            <span style={{ fontSize: 18 }}>📞</span>
                            <div>
                                <p style={{ fontSize: 9, fontWeight: 800, color: "#8FAE8E", textTransform: "uppercase", letterSpacing: 1 }}>Contact</p>
                                <a href={`tel:${tiffin.phone || tiffin.contact}`} style={{ fontSize: 13, fontWeight: 700, color: "#2d3b2d", textDecoration: "none" }}>{tiffin.phone || tiffin.contact}</a>
                            </div>
                        </div>
                        <div className="info-pill">
                            <span style={{ fontSize: 18 }}>📋</span>
                            <div>
                                <p style={{ fontSize: 9, fontWeight: 800, color: "#8FAE8E", textTransform: "uppercase", letterSpacing: 1 }}>FSSAI</p>
                                <p style={{ fontSize: 13, fontWeight: 700, color: "#2d3b2d" }}>{tiffin.fssaiNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════ BODY ══════════ */}
            <div style={{ maxWidth: 1060, margin: "0 auto", padding: "8px 40px 72px" }}>
                <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>

                    {/* ══ LEFT ══════════════════════════════════ */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* About */}
                        {tiffin.description && (
                            <div style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", borderRadius: 22, border: "1.5px solid rgba(143,174,142,0.18)", boxShadow: "0 2px 20px rgba(90,120,70,0.07)", padding: "26px 28px", ...a(80) }}>
                                <h2 style={{ fontFamily: "'Lora',serif", fontSize: 17, fontWeight: 700, color: "#2d3b2d", marginBottom: 12 }}>About this Kitchen</h2>
                                <p style={{ fontSize: 14, color: "#5a5a4a", lineHeight: 1.85, fontWeight: 500 }}>{tiffin.description}</p>
                            </div>
                        )}

                        {/* Weekly Menu (Expandable) */}
                        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)", borderRadius: 32, border: "1.5px solid rgba(143,174,142,0.16)", boxShadow: "0 12px 32px rgba(90,120,70,0.06)", overflow: "hidden", ...a(140) }}>
                            <div
                                onClick={() => setMenuExpanded(!menuExpanded)}
                                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 32px", cursor: "pointer", background: menuExpanded ? "rgba(143,174,142,0.04)" : "transparent", transition: "all .3s" }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(143,174,142,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🍱</div>
                                    <div>
                                        <h2 style={{ fontFamily: "'Lora',serif", fontSize: 19, fontWeight: 700, color: "#2d3b2d", margin: 0 }}>Discover the Weekly Menu</h2>
                                        <p style={{ fontSize: 11, color: "#8FAE8E", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2, marginTop: 2 }}>{menuExpanded ? "Showing all 7 days" : "Tap to reveal the full menu"}</p>
                                    </div>
                                </div>
                                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#fdfdf6", border: "1px solid #f0f0e0", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .3s", transform: menuExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                                    ▼
                                </div>
                            </div>

                            <div style={{ maxHeight: menuExpanded ? "2000px" : "0px", opacity: menuExpanded ? 1 : 0, transition: "all .5s cubic-bezier(0.4, 0, 0.2, 1)", overflow: "hidden" }}>
                                <div style={{ padding: "0 32px 32px" }}>
                                    {menuLoading ? (
                                        <div style={{ padding: "40px", textAlign: "center", color: "#8FAE8E", fontWeight: 700, fontSize: 14 }}>✨ Preparing the menu...</div>
                                    ) : menuData && menuData.weekMenu && menuData.weekMenu.length > 0 ? (
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
                                            {menuData.weekMenu.map((dayMenu, idx) => (
                                                <div key={idx} className="meal-row" style={{
                                                    border: "1.5px solid rgba(143,174,142,0.08)",
                                                    background: "rgba(255,255,255,0.45)",
                                                    borderRadius: 20,
                                                    padding: "20px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 16
                                                }}>
                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px dashed rgba(143,174,142,0.2)", paddingBottom: 12 }}>
                                                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#2d3b2d" }}>{dayMenu.day}</h3>
                                                        <span style={{ fontSize: 10, fontWeight: 800, color: "#8FAE8E" }}>DAY {idx + 1}</span>
                                                    </div>

                                                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                                        {dayMenu.lunch && dayMenu.lunch.items && dayMenu.lunch.items.length > 0 && (
                                                            <div>
                                                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                                                                    <span style={{ fontSize: 10 }}>🌞</span>
                                                                    <span style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: "#8FA873" }}>Lunch • ₹{dayMenu.lunch.price}</span>
                                                                </div>
                                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                                                    {dayMenu.lunch.items.map((item, i) => (
                                                                        <div key={i} style={{
                                                                            display: "flex", alignItems: "center", gap: 8,
                                                                            padding: "4px 10px 4px 4px", background: "#fff",
                                                                            border: "1.5px solid #f0f0e0", borderRadius: 20,
                                                                            fontSize: 11, fontWeight: 700, color: "#4a4a3a",
                                                                            transition: "transform 0.2s", cursor: "default"
                                                                        }}>
                                                                            {item.image ? (
                                                                                <img src={item.image} alt={item.name} style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", background: "#f5f5f0" }} />
                                                                            ) : (
                                                                                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#f5f5f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🍛</div>
                                                                            )}
                                                                            {item.name}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {dayMenu.dinner && dayMenu.dinner.items && dayMenu.dinner.items.length > 0 && (
                                                            <div>
                                                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                                                                    <span style={{ fontSize: 10 }}>🌙</span>
                                                                    <span style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: "#6b8a5e" }}>Dinner • ₹{dayMenu.dinner.price}</span>
                                                                </div>
                                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                                                    {dayMenu.dinner.items.map((item, i) => (
                                                                        <div key={i} style={{
                                                                            display: "flex", alignItems: "center", gap: 8,
                                                                            padding: "4px 10px 4px 4px", background: "#fff",
                                                                            border: "1.5px solid #f0f0e0", borderRadius: 20,
                                                                            fontSize: 11, fontWeight: 700, color: "#4a4a3a",
                                                                            transition: "transform 0.2s", cursor: "default"
                                                                        }}>
                                                                            {item.image ? (
                                                                                <img src={item.image} alt={item.name} style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", background: "#f5f5f0" }} />
                                                                            ) : (
                                                                                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#f5f5f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🥘</div>
                                                                            )}
                                                                            {item.name}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ padding: "32px", textAlign: "center", background: "rgba(143,174,142,0.05)", borderRadius: 18, border: "1px dashed rgba(143,174,142,0.3)" }}>
                                            <p style={{ fontSize: 14, color: "#888", fontWeight: 600 }}>Tiffin service under process.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details grid */}
                        <div style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", borderRadius: 22, border: "1.5px solid rgba(143,174,142,0.18)", boxShadow: "0 2px 20px rgba(90,120,70,0.07)", padding: "26px 28px", ...a(200) }}>
                            <h2 style={{ fontFamily: "'Lora',serif", fontSize: 17, fontWeight: 700, color: "#2d3b2d", marginBottom: 18 }}>Provider Info</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 28px" }}>
                                {[
                                    { icon: "👩‍🍳", label: "Owner", value: tiffin.ownerName },
                                    { icon: "📞", label: "Phone", value: tiffin.phone || tiffin.contact },
                                    { icon: "📍", label: "Location", value: addr },
                                    { icon: "📋", label: "FSSAI", value: tiffin.fssaiNumber },
                                    { icon: "💰", label: "Per Meal", value: tiffin.pricePerMeal ? `₹${tiffin.pricePerMeal}` : null },
                                    { icon: "⭐", label: "Rating", value: tiffin.rating ? `${Number(tiffin.rating).toFixed(1)} / 5` : "New" },
                                ].filter(d => d.value).map(({ icon, label, value }) => (
                                    <div key={label}>
                                        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", color: "#c8c8b4", marginBottom: 5 }}>{icon} {label}</p>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: "#2d3b2d", lineHeight: 1.4 }}>{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ══ RIGHT — SUBSCRIBE PANEL ══════════════ */}
                    <div className="panel-wrap" style={{ position: "sticky", top: 20, ...a(100) }}>
                        <div style={{ background: "#fff", borderRadius: 24, border: "1.5px solid rgba(143,174,142,0.28)", boxShadow: "0 12px 52px rgba(90,120,70,0.16)", overflow: "hidden" }}>

                            {/* panel top bar */}
                            <div style={{ background: "linear-gradient(135deg,#8FA873,#6b8a5e)", padding: "22px 26px 20px" }}>
                                <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3.5, textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Subscribe Now</p>
                                <h3 style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>Choose Your Plan</h3>
                                {tiffin.pricePerMeal && (
                                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 600, marginTop: 5 }}>Starting at ₹{tiffin.pricePerMeal}/meal</p>
                                )}
                            </div>

                            <div style={{ padding: "22px 22px 24px" }}>

                                {/* ── Plan ── */}
                                <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2.5, textTransform: "uppercase", color: "#b8b8a4", marginBottom: 10 }}>Plan Duration</p>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
                                    {[
                                        { val: "weekly", icon: "📅", label: "Weekly", sub: "7 days" },
                                        { val: "monthly", icon: "📆", label: "Monthly", sub: "30 days" },
                                        { val: "yearly", icon: "🗓", label: "Yearly", sub: "365 days" },
                                    ].map(({ val, icon, label, sub }) => {
                                        const sel = planType === val;
                                        return (
                                            <button key={val} onClick={() => { setPlanType(val); setSubError(""); }} disabled={loading}
                                                style={{ padding: "14px 6px 12px", border: `2px solid ${sel ? "#8FA873" : "rgba(143,174,142,0.22)"}`, borderRadius: 14, background: sel ? "linear-gradient(135deg,rgba(143,174,142,0.18),rgba(143,168,115,0.1))" : "rgba(248,248,244,0.8)", cursor: loading ? "not-allowed" : "pointer", transition: "all .2s", fontFamily: "'Nunito',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative" }}
                                                onMouseEnter={e => { if (!sel && !loading) { e.currentTarget.style.borderColor = "#8FAE8E"; e.currentTarget.style.background = "rgba(143,174,142,0.08)"; } }}
                                                onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = "rgba(143,174,142,0.22)"; e.currentTarget.style.background = "rgba(248,248,244,0.8)"; } }}>
                                                {sel && <span style={{ position: "absolute", top: 6, right: 6, width: 14, height: 14, borderRadius: "50%", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: 900 }}>✓</span>}
                                                <span style={{ fontSize: 20 }}>{icon}</span>
                                                <span style={{ fontSize: 12, fontWeight: 800, color: sel ? "#2d4a22" : "#555" }}>{label}</span>
                                                <span style={{ fontSize: 10, fontWeight: 600, color: sel ? "#5a7a50" : "#bbb" }}>{sub}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* ── Slot ── */}
                                <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2.5, textTransform: "uppercase", color: "#b8b8a4", marginBottom: 10 }}>Delivery Slot</p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                                    {[
                                        { val: "lunch", icon: "🌞", label: "Lunch", sub: "12–2 PM" },
                                        { val: "dinner", icon: "🌙", label: "Dinner", sub: "7–9 PM" },
                                    ].map(({ val, icon, label, sub }) => {
                                        const sel = timeSlot === val;
                                        return (
                                            <button key={val} onClick={() => { setTimeSlot(val); setSubError(""); }} disabled={loading}
                                                style={{ padding: "16px 10px", border: `2px solid ${sel ? "#8FA873" : "rgba(143,174,142,0.22)"}`, borderRadius: 14, background: sel ? "linear-gradient(135deg,rgba(143,174,142,0.18),rgba(143,168,115,0.1))" : "rgba(248,248,244,0.8)", cursor: loading ? "not-allowed" : "pointer", transition: "all .2s", fontFamily: "'Nunito',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, position: "relative" }}
                                                onMouseEnter={e => { if (!sel && !loading) { e.currentTarget.style.borderColor = "#8FAE8E"; e.currentTarget.style.background = "rgba(143,174,142,0.08)"; } }}
                                                onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = "rgba(143,174,142,0.22)"; e.currentTarget.style.background = "rgba(248,248,244,0.8)"; } }}>
                                                {sel && <span style={{ position: "absolute", top: 8, right: 8, width: 14, height: 14, borderRadius: "50%", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: 900 }}>✓</span>}
                                                <span style={{ fontSize: 26 }}>{icon}</span>
                                                <span style={{ fontSize: 13, fontWeight: 800, color: sel ? "#2d4a22" : "#555" }}>{label}</span>
                                                <span style={{ fontSize: 11, fontWeight: 600, color: sel ? "#5a7a50" : "#bbb" }}>{sub}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* summary strip */}
                                {planType && timeSlot && (
                                    <div style={{ background: "linear-gradient(135deg,rgba(143,174,142,0.12),rgba(143,168,115,0.06))", border: "1px solid rgba(143,174,142,0.25)", borderRadius: 13, padding: "11px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", animation: "oIn .28s ease" }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: "#4a7040" }}>
                                            {planType.charAt(0).toUpperCase() + planType.slice(1)} · {timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)}
                                        </span>
                                        {tiffin.pricePerMeal && (
                                            <span style={{ fontSize: 12, fontWeight: 800, color: "#8FA873" }}>₹{tiffin.pricePerMeal}/meal</span>
                                        )}
                                    </div>
                                )}

                                {/* error */}
                                {subError && (
                                    <div style={{ background: "rgba(239,83,80,0.07)", border: "1px solid rgba(239,83,80,0.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 14, animation: "oIn .2s ease" }}>
                                        <p style={{ fontSize: 12, fontWeight: 700, color: "#c62828" }}>⚠ {subError}</p>
                                    </div>
                                )}

                                {/* CTA */}
                                <button onClick={handleSubscribe} disabled={!canSub}
                                    className={canSub ? "sub-btn-active" : ""}
                                    style={{ width: "100%", padding: "15px", background: canSub ? "linear-gradient(135deg,#8FAE8E,#8FA873)" : "rgba(210,210,200,0.65)", color: canSub ? "#fff" : "#bbb", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 900, cursor: canSub ? "pointer" : "not-allowed", fontFamily: "'Nunito',sans-serif", boxShadow: canSub ? "0 8px 28px rgba(143,174,142,0.45)" : "none", transition: "all .25s", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, letterSpacing: ".2px" }}>
                                    {loading ? (
                                        <><span style={{ width: 16, height: 16, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", display: "inline-block", animation: "spin .7s linear infinite" }} />Subscribing...</>
                                    ) : (!planType || !timeSlot) ? "Select plan & slot to continue"
                                        : "🍱 Subscribe Now →"}
                                </button>

                                <p style={{ fontSize: 11, color: "#c8c8b4", textAlign: "center", marginTop: 14, fontWeight: 600 }}>Cancel or pause anytime · No hidden charges</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProviderDetailPage;