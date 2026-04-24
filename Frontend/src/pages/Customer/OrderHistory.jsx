import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../components/Customer/Sidebar";
import { logout } from "../../store/authSlice";
import { BASE_URL } from "../../api/auth";
import { 
  History, 
  RefreshCcw, 
  ShoppingBag, 
  Sun, 
  Moon, 
  Calendar, 
  Clock, 
  Hash, 
  ArrowRight,
  AlertCircle
} from "lucide-react";


export default function OrderHistory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("order-history");
  const [loaded, setLoaded] = useState(false);

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ address: "Fetching location...", loading: true });

  if (!token) { navigate("/login"); return null; }

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${BASE_URL}/api/orders/my`, { headers });
      setOrders(res.data || []);
      setError(null);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(`Failed to load orders: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Geolocation for sidebar
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || "";
            const suburb = data.address.suburb || data.address.neighbourhood || "";
            setLocation({ address: suburb ? `${suburb}, ${city}` : city || "Location Found", loading: false });
          } catch (error) {
            setLocation({ address: "Location unavailable", loading: false });
          }
        },
        () => setLocation({ address: "Location access denied", loading: false })
      );
    } else {
      setLocation({ address: "Geolocation not supported", loading: false });
    }

    // Fonts
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=Nunito:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    fetchOrders();
    setTimeout(() => setLoaded(true), 80);
  }, [token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const anim = (delay = 0) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
  });

  const getStatusBadge = (status) => {
    const map = {
      pending: { bg: "#fff8e1", color: "#e65100", label: "Pending" },
      confirmed: { bg: "#e8f5e9", color: "#2e7d32", label: "Confirmed" },
      preparing: { bg: "#e3f2fd", color: "#1565c0", label: "Preparing" },
      ready: { bg: "#f3e5f5", color: "#7b1fa2", label: "Ready" },
      completed: { bg: "#e8f5e9", color: "#2e7d32", label: "Picked Up" },
      cancelled: { bg: "#ffebee", color: "#c62828", label: "Cancelled" },
    };
    return map[status] || { bg: "#f5f5f5", color: "#616161", label: status };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #E7E6B6; }
        ::-webkit-scrollbar-thumb { background: #8FAE8E; border-radius: 10px; }
        
        .order-card { transition: all 0.3s cubic-bezier(.22,.68,0,1.2); }
        .order-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(143,174,142,0.22)!important; }
        
        /* Sidebar styles from other pages */
        .nav-btn {
          display:flex; align-items:center; gap:12px;
          width:100%; padding:12px 16px; border-radius:14px;
          border:none; background:none; cursor:pointer;
          font-family:'Nunito',sans-serif; font-size:15px; font-weight:600;
          color:rgba(255,255,255,0.7); transition:all 0.22s ease;
          text-align:left; position:relative; overflow:hidden;
        }
        .nav-btn:hover { background:rgba(255,255,255,0.14)!important; color:#fff!important; transform:translateX(3px); }
        .nav-btn.active { background:rgba(255,255,255,0.22)!important; color:#fff!important; box-shadow:0 4px 16px rgba(0,0,0,0.08); }
        
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-anim { animation: spin 1s linear infinite; }
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
      <main style={{
        marginLeft: collapsed ? 72 : 260,
        flex: 1, padding: "40px 44px",
        transition: "margin-left 0.35s cubic-bezier(.22,.68,0,1.2)",
        minHeight: "100vh", overflowY: "auto", position: "relative"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36, ...anim(0) }}>
          <div>
            <h1 style={{ fontFamily: "'Lora',serif", fontSize: "clamp(24px,3vw,34px)", fontWeight: 700, color: "#2d3b2d", lineHeight: 1.15, display: 'flex', alignItems: 'center', gap: 12 }}>
              Order History <History size={32} />
            </h1>
            <p style={{ color: "#888", fontSize: 15, marginTop: 6 }}>
              Review your past orders and track their pickup status.
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={isLoading}
            style={{ padding: "10px 18px", borderRadius: 14, border: "2px solid rgba(143,174,142,0.4)", background: "rgba(255,255,255,0.5)", fontWeight: 700, color: "#5a7a50", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
            onMouseOver={(e) => e.target.style.background = "#fff"}
            onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.5)"}
          >
            <RefreshCcw size={16} className={isLoading ? 'spin-anim' : ''} />
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div style={{ padding: "16px 20px", background: "#ffebee", color: "#c62828", borderRadius: 14, marginBottom: 24, fontWeight: 700, border: "1px solid #ffcdd2", ...anim(50), display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {isLoading && orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#8FAE8E", fontWeight: 700, fontSize: 18, ...anim(100) }}>
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", background: "rgba(255,255,255,0.4)", borderRadius: 24, border: "1px dashed rgba(143,174,142,0.5)", ...anim(100) }}>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center', color: '#8FAE8E' }}>
              <ShoppingBag size={48} strokeWidth={1} />
            </div>
            <h2 style={{ fontFamily: "'Lora', serif", color: "#2d3b2d", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No Orders Placed Yet</h2>
            <p style={{ color: "#777", fontSize: 15, marginBottom: 24 }}>You haven't ordered any meals yet. Hunger calling?</p>
            <button onClick={() => navigate("/tiffins")} style={{ padding: "12px 24px", background: "#8FAE8E", color: "#fff", borderRadius: 14, border: "none", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px rgba(143,174,142,0.4)", display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Browse Kitchens <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, ...anim(100) }}>
            {orders.map((order, index) => {
              const badge = getStatusBadge(order.status);
              return (
                <div key={order._id} className="order-card" style={{
                  background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)",
                  borderRadius: 22, padding: "20px 24px",
                  boxShadow: "0 6px 20px rgba(143,174,142,0.08)", border: "1px solid rgba(143,174,142,0.15)",
                  display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap"
                }}>
                  {/* Icon */}
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #f0f4f0, #e0e8e0)", display: "flex", alignItems: "center", justifyContent: "center", color: '#8FA873', flexShrink: 0 }}>
                    {order.timeSlot === "lunch" ? <Sun size={28} /> : <Moon size={28} />}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <h3 style={{ fontFamily: "'Lora',serif", fontSize: 18, fontWeight: 700, color: "#2d3b2d", margin: 0 }}>
                        {order.provider?.businessName || "Unknown Kitchen"}
                      </h3>
                      <span style={{ background: badge.bg, color: badge.color, padding: "3px 10px", borderRadius: 8, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {badge.label}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", color: "#888", fontSize: 13, fontWeight: 600 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {formatDate(order.date)}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {order.timeSlot.toUpperCase()}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Hash size={14} /> ORD-{order._id.slice(-6).toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div style={{ flex: 1.5, minWidth: 250 }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: "#aaa", textTransform: "uppercase", marginBottom: 6, letterSpacing: 1 }}>Items Ordered</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {order.items?.map((item, idx) => (
                        <span key={idx} style={{ background: "#fff", border: "1px solid #eef0ee", padding: "4px 10px", borderRadius: 10, fontSize: 12, fontWeight: 600, color: "#5a6a5a" }}>
                          {item.name} <span style={{ color: "#aaa", fontSize: 11 }}>x{item.quantity}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div style={{ textAlign: "right", minWidth: 120 }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: "#aaa", textTransform: "uppercase", marginBottom: 4 }}>Total Amount</p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: "#2d3b2d", margin: 0 }}>₹{order.totalPrice}</p>
                    <button 
                      onClick={() => navigate(`/orders/${order._id}`)}
                      style={{ marginTop: 8, background: "none", border: "none", color: "#8FAE8E", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Nunito',sans-serif", padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      View Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
