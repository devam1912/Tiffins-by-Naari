import React from "react";
import { useNavigate } from "react-router-dom";

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
  const firstName = user?.name?.split(" ")[0] || "User";

  const navItems = [
    { id: "dashboard", icon: "⊞", label: "Dashboard", path: "/CustomerDashboard" },
    { id: "tiffins", icon: "🍱", label: "Browse Tiffins", path: "/tiffins" },
    { id: "subscriptions", icon: "📅", label: "Subscriptions", path: "/subscriptions" },
    { id: "profile", icon: "👤", label: "My Profile", path: "/CustomerProfile" },
  ];

  return (
    <aside style={{
      width: collapsed ? 72 : 260,
      minHeight: "100vh",
      background: "linear-gradient(165deg, #8FA873 0%, #5a7a50 100%)",
      display: "flex", flexDirection: "column",
      padding: collapsed ? "28px 12px" : "28px 20px",
      position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100,
      transition: "width 0.35s cubic-bezier(.22,.68,0,1.2), padding 0.35s ease",
      boxShadow: "4px 0 36px rgba(50,80,40,0.2)",
    }}>
      {/* Logo and Collapse Toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🍽️</div>
          {!collapsed && <div style={{ fontFamily: "'Lora',serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>Tiffins-By-Naari</div>}
        </div>
        {/* Toggle Button */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px', display: collapsed ? 'none' : 'block' }}
        >
          ❮
        </button>
      </div>

      {collapsed && (
        <button 
          onClick={() => setCollapsed(false)}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px', borderRadius: '8px', marginBottom: '20px' }}
        >
          ❯
        </button>
      )}

      {!collapsed && <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: 10 }}>Navigation</p>}

      {/* Nav Items */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-btn ${activeNav === item.id ? "active" : ""}`}
            onClick={() => { setActiveNav(item.id); navigate(item.path); }}
            style={{ justifyContent: collapsed ? "center" : "flex-start" }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}

        <button
          className="nav-btn kitchen-cta"
          onClick={() => navigate("/RegisterProvider")}
          title={collapsed ? "List Your Kitchen" : ""}
          style={{ justifyContent: collapsed ? "center" : "flex-start", marginTop: "20px" }}
        >
          <span style={{ fontSize: 20 }}>👩‍🍳</span>
          {!collapsed && (
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 14 }}>List Your Kitchen</div>
              <div style={{ fontSize: 10, opacity: 0.8, fontWeight: 400 }}>Become a partner</div>
            </div>
          )}
        </button>
      </nav>

      {/* User Info & Logout */}
      <div style={{ position: "relative", zIndex: 1, marginTop: "auto" }}>
        {!collapsed && (
          <div style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 16, padding: "14px 16px", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lora',serif", fontWeight: 700, fontSize: 16, color: "#fff", flexShrink: 0 }}>
                {firstName[0]?.toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.2, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name || "User"}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600, whiteSpace: 'nowrap' }}>
                  📍 {location.loading ? "..." : location.address.split(',')[0]}
                </div>
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
          <span style={{ fontSize: 18 }}>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}