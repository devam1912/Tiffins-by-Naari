import React, { useState, useEffect } from "react";
import "../../App.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import API from "../../api/auth";
import { toast } from "sonner";
import { addItemToCart, fetchCart } from "../../store/cartSlice";
import { fetchProfile } from "../../store/authSlice";
import { useDialog } from "../../context/DialogContext";
import { 
  PartyPopper, 
  Wallet, 
  ArrowRight, 
  ArrowLeft, 
  Leaf, 
  MapPin, 
  Star, 
  IndianRupee, 
  ChefHat, 
  Phone, 
  ClipboardList, 
  UtensilsCrossed, 
  Sun, 
  Moon, 
  Soup, 
  Salad, 
  Calendar, 
  CalendarDays, 
  CalendarRange, 
  Check, 
  AlertTriangle, 
  Utensils,

  Package,
  RefreshCcw
} from "lucide-react";
import Sidebar from "../../components/Customer/Sidebar";
import { logout } from "../../store/authSlice";



/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   SUCCESS OVERLAY
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const SuccessOverlay = ({ name, plan, slot, paymentMethod, onClose, onView }) => {
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
                <div style={{ width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", color: '#fff', boxShadow: "0 20px 56px rgba(143,174,142,0.5)", animation: "bIn .6s cubic-bezier(.34,1.56,.64,1) .12s both" }}>
                    <PartyPopper size={44} />
                </div>
                <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase", color: "#8FA873", marginBottom: 10 }}>Subscribed!</p>
                <h2 style={{ fontFamily: "'Lora',serif", fontSize: 28, fontWeight: 700, color: "#1a2a1a", marginBottom: 8, lineHeight: 1.2 }}>Meals are on the way!</h2>
                <p style={{ color: "#999", fontSize: 13, marginBottom: 4, fontWeight: 600 }}>{name}</p>
                <p style={{ color: "#ccc", fontSize: 12, marginBottom: 16, textTransform: "capitalize" }}>{plan} plan · {slot} pickup</p>
                {paymentMethod === "wallet" && (
                    <div style={{ background: "rgba(143,174,142,0.1)", border: "1px solid rgba(143,174,142,0.3)", borderRadius: 12, padding: "8px 14px", marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Wallet size={14} color="#4a7040" />
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#4a7040" }}>Paid using Wallet Balance</span>
                    </div>
                )}
                <button onClick={onView}
                    style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", color: "#fff", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Nunito',sans-serif", boxShadow: "0 8px 24px rgba(143,174,142,0.45)", marginBottom: 10, transition: "opacity .2s", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    onMouseEnter={e => e.currentTarget.style.opacity = ".85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    View My Subscriptions <ArrowRight size={18} />
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

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   MAIN
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ProviderDetailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tiffin = location.state?.tiffin;
    const { token, user, location: userLocation } = useSelector(s => s.auth);
    const { items: cartItems, timeSlot: cartSlot, isLoading: cartLoading } = useSelector(s => s.cart);
    const { showConfirm } = useDialog();

    const [collapsed, setCollapsed] = useState(false);
    const [activeNav, setActiveNav] = useState("tiffins");

    const [planType, setPlanType] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [loading, setLoading] = useState(false);
    const [addingToCart, setAddingToCart] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");

    const [menuData, setMenuData] = useState(null);
    const [menuLoading, setMenuLoading] = useState(true);
    const [selectedDayIdx, setSelectedDayIdx] = useState(null);

    const [feedbacks, setFeedbacks] = useState([]);

    // Current day for ordering restrictions
    const currentDay = new Date().toLocaleDateString("en-US", { weekday: "long" });

    useEffect(() => {
        if (tiffin && tiffin._id) {
            API.get(`/tiffins/menu/${tiffin._id}`)
                .then(res => {
                    const data = res.data;
                    setMenuData(data);
                    if (data.weekMenu) {
                        const todayIdx = data.weekMenu.findIndex(d => d.day === currentDay);
                        setSelectedDayIdx(todayIdx >= 0 ? todayIdx : 0);
                    }
                    setMenuLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching menu:", err);
                    setMenuLoading(false);
                });
            
            API.get(`/feedback/provider/${tiffin._id}`)
                .then(res => {
                    setFeedbacks(res.data.feedbacks || []);
                })
                .catch(err => {
                    console.error("Error fetching feedback:", err);
                });
            
            if (token) {
                dispatch(fetchCart());
            }
        } else {
            setMenuLoading(false);
        }
    }, [tiffin, token, dispatch]);
    const [success, setSuccess] = useState(false);
    const [subError, setSubError] = useState("");
    const [vis, setVis] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

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

    /* â”€â”€ same logic â”€â”€ */
    const handleSubscribe = async () => {
        if (!planType || !timeSlot) { setSubError("Please select a plan and time slot."); return; }
        try {
            setLoading(true); setSubError("");

            const res = await API.post("/subscriptions",
                { providerId: tiffin._id, planType, timeSlot }
            );

            const { subscription, razorpayOrderId, amountToPay, key } = res.data;

            // CASE 1: Activated via Wallet balance (Fully covered)
            if (!razorpayOrderId) {
                setPaymentMethod("wallet");
                setSuccess(true);
                dispatch(fetchProfile()); // refresh wallet balance
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
                        await API.post(`/subscriptions/verify-payment/${subscription._id}`, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        setPaymentMethod("gateway");
                        setSuccess(true);
                        dispatch(fetchProfile()); // refresh wallet balance
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

    const handleAddToCart = async (item, slot, fallbackPrice) => {
        if (!token) {
            toast.error("Please login to add items to cart");
            return;
        }

        // Logic check: if cart already has items from another slot
        if (cartItems.length > 0 && cartSlot !== slot) {
            const confirmed = await showConfirm(
                "Clear Cart?",
                `Your cart contains ${cartSlot} items. Adding this will clear your current cart. Continue?`
            );
            if (!confirmed) return;
        }

        try {
            setAddingToCart(item.name);
            const resultAction = await dispatch(addItemToCart({
                providerId: tiffin._id,
                timeSlot: slot,
                item: {
                    name: item.name,
                    price: item.price || fallbackPrice || tiffin.pricePerMeal || 0,
                    type: item.type || "veg",
                    quantity: 1
                }
            }));

            if (addItemToCart.fulfilled.match(resultAction)) {
                toast.success(`${item.name} added to cart!`);
            } else {
                toast.error(resultAction.payload || "Failed to add item");
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setAddingToCart(null);
        }
    };

    const a = (d = 0) => ({ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(22px)", transition: `opacity .52s ease ${d}ms, transform .52s cubic-bezier(.22,.68,0,1.2) ${d}ms` });

    const addr = tiffin?.address || tiffin?.area || tiffin?.location?.address || tiffin?.city || null;
    const meals = tiffin?.meals || tiffin?.menu || tiffin?.dishes || [];
    const canSub = !!(planType && timeSlot && !loading);

    /* â”€â”€ no data â”€â”€ */
    if (!tiffin) return (
        <div style={{ minHeight: "100vh", background: "#E7E6B6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito',sans-serif" }}>
            <style>{`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}`}</style>
            <div style={{ textAlign: "center", background: "rgba(255,255,255,0.85)", borderRadius: 28, padding: "52px 44px", maxWidth: 400, border: "1.5px solid rgba(143,174,142,0.2)" }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: '#8FAE8E' }}>
                    <Utensils size={52} strokeWidth={1} />
                </div>
                <h2 style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 700, color: "#2d3b2d", marginBottom: 10 }}>No provider data</h2>
                <p style={{ color: "#aaa", fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>Go back and select a tiffin provider from the browse page.</p>
                <button onClick={() => navigate("/tiffins")} style={{ background: "linear-gradient(135deg,#8FAE8E,#8FA873)", border: "none", borderRadius: 14, padding: "13px 28px", fontSize: 14, fontWeight: 800, color: "#fff", cursor: "pointer", fontFamily: "'Nunito',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    Browse Providers <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="page-container">
            <Sidebar 
                collapsed={collapsed} 
                setCollapsed={setCollapsed} 
                activeNav={activeNav} 
                setActiveNav={setActiveNav}
                user={user}
                location={userLocation || { address: "..." }}
                logout={handleLogout}
            />
            
            <div className="main-content" style={{ 
                marginLeft: collapsed ? "72px" : "260px"
            }}>
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
        @keyframes daySlide{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
        .day-tab:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(143,174,142,0.25)!important}
        .nav-arrow:hover{background:rgba(143,174,142,0.12)!important;border-color:#8FAE8E!important}

        .back-btn:hover{background:rgba(255,255,255,0.28)!important}
        .meal-row:hover{background:rgba(143,174,142,0.1)!important;border-color:rgba(143,174,142,0.35)!important}
        .meal-item-card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(143,174,142,0.12)!important;border-color:rgba(143,174,142,0.3)!important}
        .sub-btn-active:hover{opacity:.88!important}
        .info-pill{background:#fff;padding:12px 20px;border-radius:20px;display:flex;align-items:center;gap:12px;box-shadow:0 8px 20px rgba(90,120,70,0.04);border:1.5px solid rgba(143,174,142,0.08);flex:1;min-width:200px}

        @media(max-width:768px){
          .main-content {
            margin-left: 0 !important;
            padding: 0 0 100px 0 !important;
          }
          .main-grid{grid-template-columns:1fr!important; gap: 20px !important;}
          .panel-wrap{position:static!important; margin-bottom: 20px;}
          .info-bar{flex-direction:column;align-items:stretch!important; padding: 0 20px !important;}
          .info-pill{min-width:100%}
          .hero-content { padding: 24px 20px 40px !important; }
          .hero-title { font-size: 32px !important; }
          .body-content-wrap { padding: 8px 20px 72px !important; }
        }
      `}</style>

            {success && <SuccessOverlay name={tiffin.businessName} plan={planType} slot={timeSlot} paymentMethod={paymentMethod} onClose={() => setSuccess(false)} onView={() => navigate("/subscriptions")} />}

            {/* ══════════ HERO ══════════ */}
            <div style={{ background: "linear-gradient(158deg,#7da368 0%,#5d7f52 45%,#3f5939 100%)", position: "relative", overflow: "hidden" }}>
                {/* bg blobs */}
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 80% 40%,rgba(255,255,255,0.04) 0%,transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)", top: "-200px", right: "-120px", pointerEvents: "none" }} />
                <div style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.08)", bottom: "-100px", left: "3%", pointerEvents: "none", animation: "drift 55s linear infinite" }} />

                <div style={{ maxWidth: 1060, margin: "0 auto", padding: "36px 40px 0", position: "relative", zIndex: 1 }}>
                    <button className="back-btn" onClick={() => navigate(-1)}
                        style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "7px 14px", color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all .2s", display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <ArrowLeft size={14} /> Back
                    </button>
                </div>

                {/* hero content */}
                <div className="hero-content" style={{ maxWidth: 1060, margin: "0 auto", padding: "28px 40px 56px", position: "relative", zIndex: 1 }}>
                    <div style={a(0)}>
                        {/* top label row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Home Kitchen</span>
                            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
                            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 20, padding: "4px 12px" }}>
                                <Leaf size={12} color="#d4edda" />
                                <span style={{ color: "#d4edda", fontSize: 11, fontWeight: 800 }}>Pure Veg</span>
                            </div>
                        </div>

                        {/* name */}
                        <h1 className="hero-title" style={{ fontFamily: "'Lora',serif", fontSize: 46, fontWeight: 700, color: "#fff", lineHeight: 1.08, marginBottom: 20, letterSpacing: "-0.5px" }}>
                            {tiffin.businessName}
                        </h1>

                        {/* meta strip */}
                        <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
                            {[
                                addr && { icon: <MapPin size={14} />, text: addr },
                                tiffin.rating > 0 && { icon: <Star size={14} fill="white" />, text: `${Number(tiffin.rating).toFixed(1)} rating` },
                                tiffin.pricePerMeal && { icon: <IndianRupee size={14} />, text: `${tiffin.pricePerMeal}/meal` },
                                tiffin.distanceKm && { icon: <MapPin size={14} />, text: `${tiffin.distanceKm} km away` },
                            ].filter(Boolean).map((m, i, arr) => (
                                <React.Fragment key={i}>
                                    <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.78)", fontSize: 13, fontWeight: 600, padding: "0 16px 0 (i===0?0:0)" }}>
                                        {m.icon}{m.text}
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

            {/* ══════════ QUICK INFO BAR ══════════ */}
            <div style={{ maxWidth: 1060, margin: "-20px auto 24px", padding: "0 40px", position: "relative", zIndex: 10 }}>
                <div className="info-bar" style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flex: 1 }}>
                        <div className="info-pill">
                            <ChefHat size={18} color="#8FAE8E" />
                            <div>
                                <p style={{ fontSize: 9, fontWeight: 800, color: "#8FAE8E", textTransform: "uppercase", letterSpacing: 1 }}>Chef</p>
                                <p style={{ fontSize: 13, fontWeight: 700, color: "#2d3b2d" }}>{tiffin.ownerName}</p>
                            </div>
                        </div>
                        <div className="info-pill">
                            <Phone size={18} color="#8FAE8E" />
                            <div>
                                <p style={{ fontSize: 9, fontWeight: 800, color: "#8FAE8E", textTransform: "uppercase", letterSpacing: 1 }}>Contact</p>
                                <a href={`tel:${tiffin.phone || tiffin.contact}`} style={{ fontSize: 13, fontWeight: 700, color: "#2d3b2d", textDecoration: "none" }}>{tiffin.phone || tiffin.contact}</a>
                            </div>
                        </div>
                        <div className="info-pill">
                            <ClipboardList size={18} color="#8FAE8E" />
                            <div>
                                <p style={{ fontSize: 9, fontWeight: 800, color: "#8FAE8E", textTransform: "uppercase", letterSpacing: 1 }}>FSSAI</p>
                                <p style={{ fontSize: 13, fontWeight: 700, color: "#2d3b2d" }}>{tiffin.fssaiNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════ BODY ══════════ */}
            <div className="body-content-wrap" style={{ maxWidth: 1060, margin: "0 auto", padding: "8px 40px 72px" }}>
                <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>

                    {/* ══ LEFT ══════════════════════════════════ */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* About */}
                        {tiffin.description && (
                            <div style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", borderRadius: 22, border: "1.5px solid rgba(143,174,142,0.18)", boxShadow: "0 2px 20px rgba(90,120,70,0.07)", padding: "26px 28px", ...a(80) }}>
                                <h2 style={{ fontFamily: "'Lora',serif", fontSize: 17, fontWeight: 700, color: "#2d3b2d", marginBottom: 12 }}>About this Kitchen</h2>
                                <p style={{ fontSize: 14, color: "#5a5a4a", lineHeight: 1.85, fontWeight: 500 }}>{tiffin.description}</p>
                            </div>
                        )}


                        {/* Weekly Menu — Day Switcher */}
                        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)", borderRadius: 32, border: "1.5px solid rgba(143,174,142,0.16)", boxShadow: "0 12px 32px rgba(90,120,70,0.06)", overflow: "hidden", ...a(140) }}>
                            {/* Header */}
                            <div style={{ padding: "28px 32px 0", display: "flex", alignItems: "center", gap: 14 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(143,174,142,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: '#8FAE8E' }}>
                                    <Package size={24} />
                                </div>
                                <div>
                                    <h2 style={{ fontFamily: "'Lora',serif", fontSize: 19, fontWeight: 700, color: "#2d3b2d", margin: 0 }}>Weekly Menu</h2>
                                    <p style={{ fontSize: 11, color: "#8FAE8E", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2, marginTop: 2 }}>Swipe through the week</p>
                                </div>
                            </div>

                            {/* Day Tabs */}
                            {menuData && menuData.weekMenu && menuData.weekMenu.length > 0 && (
                                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "20px 32px 0" }}>
                                    <button className="nav-arrow" onClick={() => setSelectedDayIdx(i => Math.max(0, i - 1))} disabled={selectedDayIdx === 0}
                                        style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid #e8e8d8", background: "#fdfdf6", display: "flex", alignItems: "center", justifyContent: "center", cursor: selectedDayIdx === 0 ? "not-allowed" : "pointer", opacity: selectedDayIdx === 0 ? 0.4 : 1, transition: "all .2s", flexShrink: 0, color: "#8FAE8E" }}>
                                        <ArrowLeft size={14} />
                                    </button>
                                    <div style={{ display: "flex", gap: 6, flex: 1, overflow: "hidden", justifyContent: "center" }}>
                                        {menuData.weekMenu.map((d, i) => {
                                            const sel = i === selectedDayIdx;
                                            const isToday = d.day === currentDay;
                                            return (
                                                <button key={i} className="day-tab" onClick={() => setSelectedDayIdx(i)}
                                                    style={{ padding: "8px 14px", borderRadius: 12, border: sel ? "2px solid #8FA873" : "1.5px solid transparent", background: sel ? "linear-gradient(135deg,rgba(143,174,142,0.2),rgba(143,168,115,0.1))" : "rgba(248,248,244,0.6)", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: sel ? 900 : 700, color: sel ? "#2d4a22" : "#999", transition: "all .25s", position: "relative", whiteSpace: "nowrap" }}>
                                                    {d.day.slice(0, 3)}
                                                    {isToday && <span style={{ position: "absolute", bottom: -2, left: "50%", transform: "translateX(-50%)", width: 5, height: 5, borderRadius: "50%", background: "#8FA873" }} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button className="nav-arrow" onClick={() => setSelectedDayIdx(i => Math.min(menuData.weekMenu.length - 1, i + 1))} disabled={selectedDayIdx === menuData.weekMenu.length - 1}
                                        style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid #e8e8d8", background: "#fdfdf6", display: "flex", alignItems: "center", justifyContent: "center", cursor: selectedDayIdx === menuData.weekMenu.length - 1 ? "not-allowed" : "pointer", opacity: selectedDayIdx === menuData.weekMenu.length - 1 ? 0.4 : 1, transition: "all .2s", flexShrink: 0, color: "#8FAE8E" }}>
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            )}

                            {/* Selected Day Content */}
                            <div style={{ padding: "20px 32px 32px" }}>
                                {menuLoading ? (
                                    <div style={{ padding: "40px", textAlign: "center", color: "#8FAE8E", fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                        <RefreshCcw size={16} className="spin-anim" /> Preparing the menu...
                                    </div>
                                ) : menuData && menuData.weekMenu && menuData.weekMenu.length > 0 && selectedDayIdx !== null ? (() => {
                                    const dayMenu = menuData.weekMenu[selectedDayIdx];
                                    const isToday = dayMenu.day === currentDay;
                                    return (
                                        <div key={selectedDayIdx} style={{ animation: "daySlide .35s ease" }}>
                                            {/* Day Header */}
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                                                <div>
                                                    <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#2d3b2d", fontFamily: "'Lora',serif" }}>{dayMenu.day}</h3>
                                                    {isToday && <span style={{ fontSize: 10, fontWeight: 900, color: "#fff", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", padding: "3px 10px", borderRadius: 8, letterSpacing: 1, marginTop: 4, display: "inline-block" }}>TODAY</span>}
                                                </div>
                                                {!isToday && <span style={{ fontSize: 10, fontWeight: 800, color: "#bbb", textTransform: "uppercase", background: "#f8f8f4", padding: "5px 12px", borderRadius: 10 }}>Preview</span>}
                                            </div>

                                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                                {/* LUNCH */}
                                                {dayMenu.lunch && dayMenu.lunch.items && dayMenu.lunch.items.length > 0 && (
                                                    <div style={{ background: "rgba(255,255,255,0.4)", borderRadius: 20, padding: 16, border: "1px solid rgba(143,174,142,0.08)" }}>
                                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                                <Sun size={16} color="#8FA873" />
                                                                <span style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.2, color: "#8FA873" }}>Lunch</span>
                                                            </div>
                                                            <button onClick={() => handleAddToCart({ name: `Full Lunch (${dayMenu.day})`, price: dayMenu.lunch.price }, "lunch")}
                                                                disabled={!isToday || addingToCart === `Full Lunch (${dayMenu.day})`}
                                                                style={{ padding: "6px 14px", background: isToday ? "rgba(143,174,142,0.15)" : "#f0f0f0", color: isToday ? "#4a7040" : "#aaa", border: "none", borderRadius: 10, fontSize: 10, fontWeight: 800, cursor: isToday ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                                                                Add Full Tiffin @ ₹{dayMenu.lunch.price}
                                                            </button>
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                                            {dayMenu.lunch.items.map((item, i) => (
                                                                <div key={i} className="meal-item-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px", background: "#fff", border: "1.5px solid #f0f0e0", borderRadius: 16, transition: "all 0.2s" }}>
                                                                    <div style={{ width: 56, height: 56, borderRadius: 12, background: "#f5f5f0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                                                                        {item.image ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Salad size={28} color="#8FAE8E" />}
                                                                    </div>
                                                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                                        <span style={{ fontSize: 14, fontWeight: 700, color: "#2d3b2d" }}>{item.name}</span>
                                                                        {item.price > 0 && <span style={{ fontSize: 12, color: "#8FAE8E", fontWeight: 800 }}>₹{item.price}</span>}
                                                                    </div>
                                                                    {isToday && (
                                                                        <button onClick={() => handleAddToCart(item, "lunch", dayMenu.lunch.price)} disabled={addingToCart === item.name}
                                                                            style={{ width: 34, height: 34, borderRadius: 10, background: "#8FAE8E", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, fontWeight: 900, boxShadow: "0 4px 10px rgba(143,174,142,0.3)" }}>
                                                                            {addingToCart === item.name ? <RefreshCcw size={14} className="spin-anim" /> : "+"}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* DINNER */}
                                                {dayMenu.dinner && dayMenu.dinner.items && dayMenu.dinner.items.length > 0 && (
                                                    <div style={{ background: "rgba(255,255,255,0.4)", borderRadius: 20, padding: 16, border: "1px solid rgba(143,174,142,0.08)" }}>
                                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                                <Moon size={16} color="#6b8a5e" />
                                                                <span style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.2, color: "#6b8a5e" }}>Dinner</span>
                                                            </div>
                                                            <button onClick={() => handleAddToCart({ name: `Full Dinner (${dayMenu.day})`, price: dayMenu.dinner.price }, "dinner")}
                                                                disabled={!isToday || addingToCart === `Full Dinner (${dayMenu.day})`}
                                                                style={{ padding: "6px 14px", background: isToday ? "rgba(107,138,94,0.15)" : "#f0f0f0", color: isToday ? "#3f5939" : "#aaa", border: "none", borderRadius: 10, fontSize: 10, fontWeight: 800, cursor: isToday ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                                                                Add Full Tiffin @ ₹{dayMenu.dinner.price}
                                                            </button>
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                                            {dayMenu.dinner.items.map((item, i) => (
                                                                <div key={i} className="meal-item-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px", background: "#fff", border: "1.5px solid #f0f0e0", borderRadius: 16, transition: "all 0.2s" }}>
                                                                    <div style={{ width: 56, height: 56, borderRadius: 12, background: "#f5f5f0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                                                                        {item.image ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Soup size={28} color="#6b8a5e" />}
                                                                    </div>
                                                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                                        <span style={{ fontSize: 14, fontWeight: 700, color: "#2d3b2d" }}>{item.name}</span>
                                                                        {item.price > 0 && <span style={{ fontSize: 12, color: "#6b8a5e", fontWeight: 800 }}>₹{item.price}</span>}
                                                                    </div>
                                                                    {isToday && (
                                                                        <button onClick={() => handleAddToCart(item, "dinner", dayMenu.dinner.price)} disabled={addingToCart === item.name}
                                                                            style={{ width: 34, height: 34, borderRadius: 10, background: "#6b8a5e", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, fontWeight: 900, boxShadow: "0 4px 10px rgba(107,138,94,0.3)" }}>
                                                                            {addingToCart === item.name ? <RefreshCcw size={14} className="spin-anim" /> : "+"}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })() : (
                                    <div style={{ padding: "32px", textAlign: "center", background: "rgba(143,174,142,0.05)", borderRadius: 18, border: "1px dashed rgba(143,174,142,0.3)" }}>
                                        <p style={{ fontSize: 14, color: "#888", fontWeight: 600 }}>Tiffin service under process.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details grid */}
                        <div style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", borderRadius: 22, border: "1.5px solid rgba(143,174,142,0.18)", boxShadow: "0 2px 20px rgba(90,120,70,0.07)", padding: "26px 28px", ...a(200) }}>
                            <h2 style={{ fontFamily: "'Lora',serif", fontSize: 17, fontWeight: 700, color: "#2d3b2d", marginBottom: 18 }}>Provider Info</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 28px" }}>
                                {[
                                    { icon: <ChefHat size={14} />, label: "Owner", value: tiffin.ownerName },
                                    { icon: <Phone size={14} />, label: "Phone", value: tiffin.phone || tiffin.contact },
                                    { icon: <MapPin size={14} />, label: "Location", value: addr },
                                    { icon: <ClipboardList size={14} />, label: "FSSAI", value: tiffin.fssaiNumber },
                                    { icon: <IndianRupee size={14} />, label: "Per Meal", value: tiffin.pricePerMeal ? `₹${tiffin.pricePerMeal}` : null },
                                    { icon: <Star size={14} fill="#f59e0b" color="#f59e0b" />, label: "Rating", value: tiffin.rating ? `${Number(tiffin.rating).toFixed(1)} / 5` : "New" },
                                ].filter(d => d.value).map(({ icon, label, value }) => (
                                    <div key={label}>
                                        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", color: "#c8c8b4", marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}>{icon} {label}</p>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: "#2d3b2d", lineHeight: 1.4 }}>{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* â”€â”€ Customer Reviews â”€â”€ */}
                        <div style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", borderRadius: 22, border: "1.5px solid rgba(143,174,142,0.18)", boxShadow: "0 2px 20px rgba(90,120,70,0.07)", padding: "26px 28px", ...a(240) }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                                <h2 style={{ fontFamily: "'Lora',serif", fontSize: 17, fontWeight: 700, color: "#2d3b2d", margin: 0 }}>Customer Reviews</h2>
                                <span style={{ fontSize: 12, fontWeight: 800, color: "#5a7a50", background: "rgba(143,174,142,0.15)", padding: "4px 10px", borderRadius: 12 }}>
                                    {feedbacks.length} {feedbacks.length === 1 ? "Review" : "Reviews"}
                                </span>
                            </div>
                            
                            {feedbacks.length > 0 ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                                    {feedbacks.map((fb, i) => (
                                        <div key={fb._id || i} style={{ paddingBottom: i < feedbacks.length - 1 ? 18 : 0, borderBottom: i < feedbacks.length - 1 ? "1.5px solid rgba(0,0,0,0.04)" : "none" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#e8e8d8,#d4d4b8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#5a7a50" }}>
                                                        {(fb.user?.name || "C")[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: 14, fontWeight: 800, color: "#2d3b2d", lineHeight: 1.2 }}>{fb.user?.name || "Happy Customer"}</p>
                                                        <p style={{ fontSize: 10, color: "#aaa", fontWeight: 600 }}>{new Date(fb.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", gap: 2, background: "#fff", border: "1px solid #f0f0e0", padding: "4px 8px", borderRadius: 12 }}>
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star key={star} size={11} fill={star <= fb.rating ? "#f59e0b" : "transparent"} color={star <= fb.rating ? "#f59e0b" : "#e5e7eb"} />
                                                    ))}
                                                </div>
                                            </div>
                                            {fb.comment && (
                                                <div style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(0,0,0,0.03)", padding: "12px 14px", borderRadius: 12, marginTop: 10 }}>
                                                    <p style={{ fontSize: 13, color: "#5a5a4a", lineHeight: 1.6 }}>"{fb.comment}"</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ padding: "24px", textAlign: "center", background: "rgba(143,174,142,0.05)", borderRadius: 16, border: "1px dashed rgba(143,174,142,0.3)" }}>
                                    <p style={{ fontSize: 13, color: "#8FAE8E", fontWeight: 700 }}>No reviews yet. Be the first to try!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ══ RIGHT — SUBSCRIBE PANEL ══════════════ */}
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

                                {/* Wallet Chip */}
                                {user?.walletBalance > 0 && (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(135deg,rgba(143,174,142,0.12),rgba(143,168,115,0.06))", border: "1px solid rgba(143,174,142,0.3)", borderRadius: 14, padding: "10px 14px", marginBottom: 18 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <Wallet size={20} color="#8FA873" />
                                            <div>
                                                <p style={{ fontSize: 9, fontWeight: 900, color: "#8FA873", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Wallet Balance</p>
                                                <p style={{ fontSize: 14, fontWeight: 900, color: "#2d3b2d" }}>₹{user.walletBalance}</p>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: 10, fontWeight: 700, color: "#8FA873", background: "rgba(143,174,142,0.15)", padding: "3px 8px", borderRadius: 8 }}>Auto-applied</span>
                                    </div>
                                )}

                                {/* â”€â”€ Plan â”€â”€ */}
                                <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2.5, textTransform: "uppercase", color: "#b8b8a4", marginBottom: 10 }}>Plan Duration</p>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
                                    {[
                                        { val: "weekly", icon: <Calendar size={20} />, label: "Weekly", sub: "7 days" },
                                        { val: "monthly", icon: <CalendarDays size={20} />, label: "Monthly", sub: "30 days" },
                                        { val: "yearly", icon: <CalendarRange size={20} />, label: "Yearly", sub: "365 days" },
                                    ].map(({ val, icon, label, sub }) => {
                                        const sel = planType === val;
                                        return (
                                            <button key={val} onClick={() => { setPlanType(val); setSubError(""); }} disabled={loading}
                                                style={{ padding: "14px 6px 12px", border: `2px solid ${sel ? "#8FA873" : "rgba(143,174,142,0.22)"}`, borderRadius: 14, background: sel ? "linear-gradient(135deg,rgba(143,174,142,0.18),rgba(143,168,115,0.1))" : "rgba(248,248,244,0.8)", cursor: loading ? "not-allowed" : "pointer", transition: "all .2s", fontFamily: "'Nunito',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative" }}
                                                onMouseEnter={e => { if (!sel && !loading) { e.currentTarget.style.borderColor = "#8FAE8E"; e.currentTarget.style.background = "rgba(143,174,142,0.08)"; } }}
                                                onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = "rgba(143,174,142,0.22)"; e.currentTarget.style.background = "rgba(248,248,244,0.8)"; } }}>
                                                {sel && <span style={{ position: "absolute", top: 6, right: 6, width: 14, height: 14, borderRadius: "50%", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Check size={8} strokeWidth={4} /></span>}
                                                <div style={{ color: sel ? "#8FA873" : "#555", marginBottom: 4 }}>{icon}</div>
                                                <span style={{ fontSize: 12, fontWeight: 800, color: sel ? "#2d4a22" : "#555" }}>{label}</span>
                                                <span style={{ fontSize: 10, fontWeight: 600, color: sel ? "#5a7a50" : "#bbb" }}>{sub}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* â”€â”€ Slot â”€â”€ */}
                                <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2.5, textTransform: "uppercase", color: "#b8b8a4", marginBottom: 10 }}>Pickup Slot</p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                                    {[
                                        { val: "lunch", icon: <Sun size={26} />, label: "Lunch", sub: "12â€“2 PM" },
                                        { val: "dinner", icon: <Moon size={26} />, label: "Dinner", sub: "7â€“9 PM" },
                                    ].map(({ val, icon, label, sub }) => {
                                        const sel = timeSlot === val;
                                        return (
                                            <button key={val} onClick={() => { setTimeSlot(val); setSubError(""); }} disabled={loading}
                                                style={{ padding: "16px 10px", border: `2px solid ${sel ? "#8FA873" : "rgba(143,174,142,0.22)"}`, borderRadius: 14, background: sel ? "linear-gradient(135deg,rgba(143,174,142,0.18),rgba(143,168,115,0.1))" : "rgba(248,248,244,0.8)", cursor: loading ? "not-allowed" : "pointer", transition: "all .2s", fontFamily: "'Nunito',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, position: "relative" }}
                                                onMouseEnter={e => { if (!sel && !loading) { e.currentTarget.style.borderColor = "#8FAE8E"; e.currentTarget.style.background = "rgba(143,174,142,0.08)"; } }}
                                                onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = "rgba(143,174,142,0.22)"; e.currentTarget.style.background = "rgba(248,248,244,0.8)"; } }}>
                                                {sel && <span style={{ position: "absolute", top: 8, right: 8, width: 14, height: 14, borderRadius: "50%", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Check size={8} strokeWidth={4} /></span>}
                                                <div style={{ color: sel ? "#8FA873" : "#555", marginBottom: 5 }}>{icon}</div>
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
                                    <div style={{ background: "rgba(239,83,80,0.07)", border: "1px solid rgba(239,83,80,0.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 14, animation: "oIn .2s ease", display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <AlertTriangle size={14} color="#c62828" />
                                        <p style={{ fontSize: 12, fontWeight: 700, color: "#c62828" }}>{subError}</p>
                                    </div>
                                )}

                                {/* CTA */}
                                <button onClick={handleSubscribe} disabled={!canSub}
                                    className={canSub ? "sub-btn-active" : ""}
                                    style={{ width: "100%", padding: "15px", background: canSub ? "linear-gradient(135deg,#8FAE8E,#8FA873)" : "rgba(210,210,200,0.65)", color: canSub ? "#fff" : "#bbb", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 900, cursor: canSub ? "pointer" : "not-allowed", fontFamily: "'Nunito',sans-serif", boxShadow: canSub ? "0 8px 28px rgba(143,174,142,0.45)" : "none", transition: "all .25s", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, letterSpacing: ".2px" }}>
                                    {loading ? (
                                        <><span style={{ width: 16, height: 16, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", display: "inline-block", animation: "spin .7s linear infinite" }} />Subscribing...</>
                                    ) : (!planType || !timeSlot) ? "Select plan & slot to continue"
                                        : <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><UtensilsCrossed size={18} /> Subscribe Now <ArrowRight size={18} /></span>}
                                </button>

                                <p style={{ fontSize: 11, color: "#c8c8b4", textAlign: "center", marginTop: 14, fontWeight: 600 }}>Cancel or pause anytime · No hidden charges</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
};

export default ProviderDetailPage;
