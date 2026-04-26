import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../components/Customer/Sidebar";
import { logout } from "../../store/authSlice";
import { BASE_URL } from "../../api/auth";
import { formatToISTDateLong, formatToISTTime } from "../../lib/dateUtils";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Package, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Gift, 
  Truck, 
  XCircle, 
  ClipboardList, 
  Check, 
  Leaf, 
  Wallet, 
  Home, 
  Sun, 
  Moon, 
  Calendar, 
  Star,
  X,
  AlertTriangle
} from "lucide-react";


export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("order-history");
  const [loaded, setLoaded] = useState(false);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ address: "Fetching location...", loading: true });

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  if (!token) { navigate("/login"); return null; }

  useEffect(() => {
    // Fonts
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

    // Fetch order
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${BASE_URL}/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
    setTimeout(() => setLoaded(true), 80);
  }, [id, token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const anim = (delay = 0) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
  });

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    setReviewSubmitting(true);
    try {
      await axios.post(`${BASE_URL}/api/feedback`, {
        providerId: order.provider._id || order.provider,
        rating,
        comment
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Thank you for your feedback!");
      setIsReviewOpen(false);
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending:   { bg: "#fff8e1", color: "#e65100",  label: "Pending",   icon: <Clock size={28} /> },
      confirmed: { bg: "#e8f5e9", color: "#2e7d32",  label: "Confirmed", icon: <CheckCircle2 size={28} /> },
      preparing: { bg: "#e3f2fd", color: "#1565c0",  label: "Preparing", icon: <ChefHat size={28} /> },
      ready:     { bg: "#f3e5f5", color: "#7b1fa2",  label: "Ready",     icon: <Gift size={28} /> },
      completed: { bg: "#e8f5e9", color: "#2e7d32",  label: "Ready for Pickup", icon: <Truck size={28} /> },
      cancelled: { bg: "#ffebee", color: "#c62828",  label: "Cancelled", icon: <XCircle size={28} /> },
    };
    return map[status] || { bg: "#f5f5f5", color: "#616161", label: status, icon: <ClipboardList size={28} /> };

  };

  const formatDate = (dateString) => formatToISTDateLong(dateString);
  const formatTime = (dateString) => formatToISTTime(dateString);

  const statusSteps = ["pending", "confirmed", "preparing", "ready", "completed"];
  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #E7E6B6; }
        ::-webkit-scrollbar-thumb { background: #8FAE8E; border-radius: 10px; }
        .nav-btn {
          display:flex; align-items:center; gap:12px;
          width:100%; padding:12px 16px; border-radius:14px;
          border:none; background:none; cursor:pointer;
          font-family:'Nunito',sans-serif; font-size:15px; font-weight:600;
          color:rgba(255,255,255,0.7); transition:all 0.22s ease;
          text-align:left;
        }
        .nav-btn:hover { background:rgba(255,255,255,0.14)!important; color:#fff!important; transform:translateX(3px); }
        .nav-btn.active { background:rgba(255,255,255,0.22)!important; color:#fff!important; }
        .item-row { transition: all 0.2s ease; }
        .item-row:hover { background: rgba(143,174,142,0.06)!important; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media (max-width: 768px) {
          .order-detail-main { margin-left: 0 !important; padding: 20px 16px !important; padding-bottom: 100px !important; }
          .order-detail-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .progress-container { flex-wrap: wrap !important; gap: 12px !important; }
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
      <main className="order-detail-main" style={{
        marginLeft: collapsed ? 72 : 260,
        flex: 1, padding: "40px 44px",
        transition: "margin-left 0.35s cubic-bezier(.22,.68,0,1.2)",
        minHeight: "100vh", overflowY: "auto",
      }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, ...anim(0) }}>
          <button
            onClick={() => navigate("/order-history")}
            style={{ background: "rgba(255,255,255,0.6)", border: "1.5px solid rgba(143,174,142,0.25)", borderRadius: 12, padding: "9px 18px", fontWeight: 700, fontSize: 13, color: "#5a7a50", cursor: "pointer", fontFamily: "'Nunito',sans-serif", display: "flex", alignItems: "center", gap: 6 }}
          >
            <ArrowLeft size={16} /> Back to Orders
          </button>
          <div>
            <h1 style={{ fontFamily: "'Lora',serif", fontSize: "clamp(22px,2.8vw,32px)", fontWeight: 700, color: "#2d3b2d", lineHeight: 1.15, display: 'flex', alignItems: 'center', gap: 12 }}>
              Order Details <Package size={32} />
            </h1>
            {order && (
              <p style={{ color: "#888", fontSize: 13, marginTop: 4, fontWeight: 600 }}>
                Order ID: ORD-{order._id.slice(-6).toUpperCase()}
              </p>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#8FAE8E", ...anim(80) }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(143,174,142,0.2)", borderTopColor: "#8FA873", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
            <p style={{ fontWeight: 700, fontSize: 16 }}>Loading order details...</p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div style={{ padding: "16px 20px", background: "#ffebee", color: "#c62828", borderRadius: 14, marginBottom: 24, fontWeight: 700, border: "1px solid #ffcdd2", ...anim(50), display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={20} /> {error}
            <button onClick={() => navigate("/order-history")} style={{ marginLeft: 16, background: "none", border: "none", color: "#c62828", fontWeight: 800, cursor: "pointer", textDecoration: "underline" }}>
              Go back
            </button>
          </div>
        )}

        {/* Order Content */}
        {!isLoading && order && (
          <div className="order-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start", ...anim(100) }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Status Banner */}
              {(() => {
                const badge = getStatusBadge(order.status);
                return (
                  <div style={{ background: badge.bg, border: `1.5px solid ${badge.color}22`, borderRadius: 22, padding: "22px 26px", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: `${badge.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: badge.color }}>
                      {badge.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 800, color: badge.color, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>Order Status</p>
                      <h2 style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 700, color: badge.color, margin: 0 }}>{badge.label}</h2>
                    </div>
                  </div>
                );
              })()}

              {/* Pickup Progress (only for non-cancelled orders) */}
              {order.status !== "cancelled" && (
                <div style={{ background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)", borderRadius: 22, padding: "24px 26px", border: "1px solid rgba(143,174,142,0.2)", boxShadow: "0 4px 20px rgba(143,174,142,0.08)" }}>
                  <h3 style={{ fontFamily: "'Lora',serif", fontSize: 17, fontWeight: 700, color: "#2d3b2d", marginBottom: 24 }}>Pickup Progress</h3>
                  <div className="progress-container" style={{ display: "flex", alignItems: "center", gap: 0 }}>
                    {statusSteps.map((step, idx) => {
                      const isDone = idx <= currentStepIndex;
                      const isActive = idx === currentStepIndex;
                      const stepBadge = getStatusBadge(step);
                      return (
                        <div key={step} style={{ display: "flex", alignItems: "center", flex: idx < statusSteps.length - 1 ? 1 : "none" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 60 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: "50%",
                              background: isDone ? "linear-gradient(135deg,#8FAE8E,#8FA873)" : "#f0f0e8",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 16,
                              boxShadow: isActive ? "0 0 0 4px rgba(143,174,142,0.25)" : "none",
                              border: isDone ? "none" : "1.5px solid #ddddc8",
                              transition: "all 0.3s ease",
                            }}>
                              {isDone ? <Check size={20} /> : React.cloneElement(stepBadge.icon, { size: 20 })}
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 700, color: isDone ? "#5a7a50" : "#bbb", textTransform: "uppercase", textAlign: "center", maxWidth: 55 }}>
                              {stepBadge.label}
                            </span>
                          </div>
                          {idx < statusSteps.length - 1 && (
                            <div style={{ flex: 1, height: 3, background: idx < currentStepIndex ? "linear-gradient(90deg,#8FAE8E,#8FA873)" : "#e8e8d8", borderRadius: 4, margin: "0 4px", marginBottom: 22, transition: "background 0.4s ease" }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Items Ordered */}
              <div style={{ background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)", borderRadius: 22, padding: "24px 26px", border: "1px solid rgba(143,174,142,0.2)", boxShadow: "0 4px 20px rgba(143,174,142,0.08)" }}>
                <h3 style={{ fontFamily: "'Lora',serif", fontSize: 17, fontWeight: 700, color: "#2d3b2d", marginBottom: 18 }}>
                  Items Ordered ({order.items?.length || 0})
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="item-row" style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "14px 12px", borderRadius: 14,
                      borderBottom: idx < order.items.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                    }}>
                      <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#f0f4f0,#e4ece4)", display: "flex", alignItems: "center", justifyContent: "center", color: '#8FAE8E', flexShrink: 0 }}>
                        <Leaf size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#2d3b2d", marginBottom: 2 }}>{item.name}</p>
                        <p style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>Qty: {item.quantity}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 15, fontWeight: 800, color: "#2d3b2d" }}>₹{(item.price * item.quantity).toFixed(0)}</p>
                        <p style={{ fontSize: 11, color: "#bbb", fontWeight: 600 }}>₹{item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Price Summary */}
              <div style={{ background: "#fff", borderRadius: 22, padding: "24px", border: "1.5px solid rgba(143,174,142,0.25)", boxShadow: "0 8px 28px rgba(90,120,70,0.1)" }}>
                <div style={{ height: 4, background: "linear-gradient(90deg,#8FAE8E,#8FA873,#D9D9A8)", borderRadius: 4, marginBottom: 20 }} />
                <h3 style={{ fontFamily: "'Lora',serif", fontSize: 17, fontWeight: 700, color: "#2d3b2d", marginBottom: 18 }}>Payment Summary</h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: 14, fontWeight: 600 }}>
                    <span>Items ({order.items?.length})</span>
                    <span>₹{order.totalPrice}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: 14, fontWeight: 600 }}>
                    <span>Pickup Fee</span>
                    <span style={{ color: "#5a7a50", fontWeight: 700 }}>FREE</span>
                  </div>
                  {order.paymentMethod === "wallet" && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#8FA873", fontSize: 13, fontWeight: 700, alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Wallet size={14} /> Paid via Wallet</span>
                      <span>₹{order.totalPrice}</span>
                    </div>
                  )}
                  <div style={{ height: 1.5, background: "#f0f0e0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 900, color: "#2d3b2d" }}>
                    <span>Total Paid</span>
                    <span>₹{order.totalPrice}</span>
                  </div>
                </div>

                <div style={{ background: "rgba(143,174,142,0.08)", border: "1px solid rgba(143,174,142,0.2)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle2 size={16} color="#5a7a50" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#5a7a50" }}>
                    Payment {order.paymentStatus === "paid" ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>

              {/* Pickup Info */}
              <div style={{ background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)", borderRadius: 22, padding: "24px", border: "1px solid rgba(143,174,142,0.2)", boxShadow: "0 4px 20px rgba(143,174,142,0.08)" }}>
                <h3 style={{ fontFamily: "'Lora',serif", fontSize: 17, fontWeight: 700, color: "#2d3b2d", marginBottom: 16 }}>Pickup Info</h3>
                {[
                  { icon: <Home size={18} />, label: "Kitchen", value: order.provider?.businessName || "—" },
                  { icon: <ChefHat size={18} />, label: "Chef", value: order.provider?.ownerName || "—" },
                  { icon: order.timeSlot === "lunch" ? <Sun size={18} /> : <Moon size={18} />, label: "Slot", value: order.timeSlot === "lunch" ? "Lunch (12–2 PM)" : "Dinner (7–9 PM)" },
                  { icon: <Calendar size={18} />, label: "Pickup Date", value: formatDate(order.date || order.createdAt) },
                  { icon: <Clock size={18} />, label: "Ordered At", value: formatTime(order.createdAt) },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: "#f5f5f0", display: "flex", alignItems: "center", justifyContent: "center", color: '#5a7a50', flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 800, color: "#bbb", textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#2d3b2d" }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rate button if completed */}
              {order.status === "completed" && (
                <button
                  onClick={() => setIsReviewOpen(true)}
                  style={{ width: "100%", padding: "14px", background: "#fff", color: "#5a7a50", border: "2px solid #8FAE8E", borderRadius: 16, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Nunito',sans-serif", marginBottom: 12, transition: "all 0.2s", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(143,174,142,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  <Star size={18} /> Rate Your Meal
                </button>
              )}

              {/* Back button */}
              <button
                onClick={() => navigate("/order-history")}
                style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", color: "#fff", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Nunito',sans-serif", boxShadow: "0 6px 20px rgba(143,174,142,0.4)", transition: "opacity 0.2s", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <ArrowLeft size={18} /> Back to Order History
              </button>
            </div>

          </div>
        )}

        {/* ── Review Modal ── */}
        {isReviewOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,18,10,0.7)", backdropFilter: "blur(10px)" }}>
            <div style={{ background: "#fff", borderRadius: 28, padding: "40px", maxWidth: 420, width: "90%", boxShadow: "0 24px 60px rgba(0,0,0,0.25)", position: "relative" }}>
              <h3 style={{ fontFamily: "'Lora',serif", fontSize: 24, fontWeight: 700, color: "#2d3b2d", marginBottom: 8 }}>Rate Your Meal</h3>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>How was the food from {order?.provider?.businessName}?</p>
              
              <div style={{ display: "flex", gap: 8, marginBottom: 24, justifyContent: "flex-start" }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setRating(star)} style={{ background: "none", border: "none", cursor: "pointer", color: star <= rating ? "#f59e0b" : "#e5e7eb", transition: "color 0.2s", padding: 0 }}>
                    <Star size={36} fill={star <= rating ? "#f59e0b" : "transparent"} />
                  </button>
                ))}
              </div>
              
              <textarea
                placeholder="Share your thoughts (optional)..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{ width: "100%", padding: "16px", borderRadius: 16, border: "2px solid #f0f0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif", minHeight: 120, marginBottom: 24, resize: "vertical", outline: "none" }}
              />
              
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setIsReviewOpen(false)} style={{ flex: 1, padding: "14px", background: "transparent", border: "2px solid #e0e0d0", borderRadius: 16, fontWeight: 800, cursor: "pointer", color: "#888", fontFamily: "'Nunito',sans-serif" }}>Cancel</button>
                <button onClick={handleSubmitReview} disabled={reviewSubmitting} style={{ flex: 2, padding: "14px", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", color: "#fff", border: "none", borderRadius: 16, fontWeight: 800, cursor: reviewSubmitting ? "not-allowed" : "pointer", fontFamily: "'Nunito',sans-serif", boxShadow: "0 8px 24px rgba(143,174,142,0.3)" }}>
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
