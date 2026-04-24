import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "../../store/authSlice";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Calendar, 
  ShoppingCart, 
  History, 
  User, 
  ChefHat, 
  Store, 
  Wallet, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  MapPin
} from "lucide-react";


export default function Sidebar({
  collapsed,
  setCollapsed,
  activeNav,
  setActiveNav,
  user,
  location,
  logout
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((s) => s.cart);
  const { user: reduxUser } = useSelector((s) => s.auth);
  const resolvedUser = reduxUser || user;
  const firstName = resolvedUser?.name?.split(" ")[0] || "User";

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const navItems = [
    { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/CustomerDashboard" },
    { id: "tiffins", icon: <UtensilsCrossed size={20} />, label: "Browse Tiffins", path: "/tiffins" },
    { id: "subscriptions", icon: <Calendar size={20} />, label: "Subscriptions", path: "/subscriptions" },
    { id: "cart", icon: <ShoppingCart size={20} />, label: "My Cart", path: "/cart", badge: cartItems.length },
    { id: "order-history", icon: <History size={20} />, label: "Order History", path: "/order-history" },
    { id: "profile", icon: <User size={20} />, label: "My Profile", path: "/CustomerProfile" },
  ];

  return (
    <aside className="sidebar-container" style={{
      width: collapsed ? 72 : 260,
      minHeight: "100vh",
      background: "linear-gradient(165deg, #8FA873 0%, #5a7a50 100%)",
      display: "flex", flexDirection: "column",
      padding: collapsed ? "28px 12px" : "28px 20px",
      position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100,
      transition: "width 0.35s cubic-bezier(.22,.68,0,1.2), padding 0.35s ease, transform 0.35s ease",
      boxShadow: "4px 0 36px rgba(50,80,40,0.2)",
    }}>
      <style>{`
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

        .kitchen-cta {
            background: rgba(255, 255, 255, 0.1) !important;
            border: 1px dashed rgba(255, 255, 255, 0.3) !important;
            margin-top: 15px;
            color: #fff !important;
        }
        .kitchen-cta:hover {
            background: #fff !important;
            color: #5a7a50 !important;
            border-style: solid !important;
        }
        .logout-btn:hover { background:rgba(239,83,80,0.1)!important; color:#c62828!important; border-color:rgba(239,83,80,0.4)!important; }
        
        /* Mobile Bottom Nav */
        @media (max-width: 768px) {
          .sidebar-container {
            width: 100% !important;
            min-height: auto !important;
            height: 70px !important;
            flex-direction: row !important;
            top: auto !important;
            bottom: 0 !important;
            padding: 0 10px !important;
            z-index: 999 !important;
            align-items: center;
            justify-content: space-around;
            border-radius: 20px 20px 0 0;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.1) !important;
          }
          .sidebar-header { display: none !important; }
          .sidebar-nav {
            flex-direction: row !important;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            gap: 0 !important;
          }
          .nav-btn {
            flex-direction: column !important;
            gap: 4px !important;
            padding: 8px !important;
            width: auto !important;
            justify-content: center !important;
            text-align: center !important;
            border-radius: 12px !important;
          }
          .nav-btn:hover { transform: none !important; }
          .nav-btn span:not(.icon-wrapper) { display: none !important; }
          .kitchen-cta { display: none !important; }
          .user-info-panel { display: none !important; }
          .desktop-nav-title { display: none !important; }
        }
      `}</style>
      {/* Logo and Collapse Toggle */}
      <div className="sidebar-header" style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, overflow: "hidden" }}>
            <img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 8 }} />
          </div>
          {!collapsed && <div style={{ fontFamily: "'Lora',serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>Tiffins-By-Naari</div>}
        </div>
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: collapsed ? 'none' : 'flex', alignItems: 'center' }}
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}
        >
          <ChevronRight size={20} />
        </button>
      )}

      {!collapsed && <p className="desktop-nav-title" style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: 10 }}>Navigation</p>}

      {/* Nav Items */}
      <nav className="sidebar-nav" style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-btn ${activeNav === item.id ? "active" : ""}`}
            onClick={() => { setActiveNav(item.id); navigate(item.path); }}
            style={{ justifyContent: collapsed ? "center" : "flex-start" }}
          >
            <span style={{ fontSize: 20, position: "relative" }}>
              {item.icon}
              {item.badge > 0 && (
                <span style={{
                  position: "absolute", top: -5, right: -8,
                  background: "#fff", color: "#5a7a50",
                  fontSize: 10, fontWeight: 900,
                  width: 16, height: 16, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                  {item.badge}
                </span>
              )}
            </span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}

        <button
          className="nav-btn kitchen-cta"
          onClick={() => navigate("/RegisterProvider")}
          title={collapsed ? "List Your Kitchen" : ""}
          style={{ justifyContent: collapsed ? "center" : "flex-start", marginTop: "20px" }}
        >
          <Store size={20} />
          {!collapsed && (
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 14 }}>List Your Kitchen</div>
              <div style={{ fontSize: 10, opacity: 0.8, fontWeight: 400 }}>Become a partner</div>
            </div>
          )}
        </button>
      </nav>

      {/* User Info & Logout */}
      <div className="user-info-panel" style={{ position: "relative", zIndex: 1, marginTop: "auto" }}>
        {!collapsed && (
          <div style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 16, padding: "14px 16px", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lora',serif", fontWeight: 700, fontSize: 16, color: "#fff", flexShrink: 0 }}>
                {firstName[0]?.toUpperCase()}
              </div>
              <div style={{ overflow: "hidden", flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.2, whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{resolvedUser?.name || "User"}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600, whiteSpace: "nowrap", display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={10} /> {location.loading ? "..." : location.address.split(",")[0]}
                </div>
              </div>
            </div>
            {/* Wallet Balance */}
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Wallet size={14} color="rgba(255,255,255,0.7)" />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 700 }}>Wallet Balance</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: 20, padding: "3px 10px" }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: 0.5 }}>₹{resolvedUser?.walletBalance ?? 0}</span>
              </div>
            </div>
          </div>
        )}
        <button
          className="logout-btn"
          onClick={logout}
          style={{
            width: "100%", display: "flex", alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 10, padding: collapsed ? "12px" : "11px 16px",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 12, cursor: "pointer", color: "rgba(255,255,255,0.65)",
            fontSize: 14, fontWeight: 600, fontFamily: "'Nunito',sans-serif",
            transition: "all 0.25s ease",
          }}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}