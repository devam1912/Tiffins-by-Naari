import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Customer/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [stats, setStats] = useState({ tiffins: 0, subscriptions: 0, orders: 0 });
  const [location, setLocation] = useState({ address: "Fetching location...", loading: true });

  // ✅ Redux se user aur token
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  // ✅ Login nahi hai toh redirect
  if (!token) { navigate("/login"); return; }

  useEffect(() => {
    // 1. Get Coordinates from Browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // 2. Reverse Geocode using OpenStreetMap (Nominatim)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();

            // Extract a clean address (Suburb/City)
            const city = data.address.city || data.address.town || data.address.village || "";
            const suburb = data.address.suburb || data.address.neighbourhood || "";
            const displayAddress = suburb ? `${suburb}, ${city}` : city;

            setLocation({
              address: displayAddress || "Location Found",
              lat: latitude,
              lng: longitude,
              loading: false
            });
          } catch (error) {
            console.error("Geocoding error:", error);
            setLocation({ address: "Location unavailable", loading: false });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation({ address: "Location access denied", loading: false });
        }
      );
    } else {
      setLocation({ address: "Geolocation not supported", loading: false });
    }

    // Fonts
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=Nunito:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // ✅ Token ab Redux se aa raha hai, localStorage se nahi
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get("http://localhost:5000/api/tiffins"),
      axios.get("http://localhost:5000/api/subscriptions", { headers }),
      axios.get("http://localhost:5000/api/orders", { headers }),
    ])
      .then(([tiffinsRes, subsRes, ordersRes]) => {
        setStats({
          tiffins: tiffinsRes.data.length || 0,
          subscriptions: subsRes.data.length || 0,
          orders: ordersRes.data.length || 0,
        });
      })
      .catch(err => console.error("Dashboard fetch error:", err));

    setTimeout(() => setLoaded(true), 80);
  }, [navigate, token]);

  // ✅ Naya logout — Redux dispatch karta hai
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const anim = (delay = 0) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
  });

  const firstName = user?.name?.split(" ")[0] || "User";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Navigation items
  const navItems = [
    { id: "dashboard", icon: "⊞", label: "Dashboard", path: "/CustomerDashboard" },
    { id: "tiffins", icon: "🍱", label: "Browse Tiffins", path: "/tiffins" },
    { id: "subscriptions", icon: "📅", label: "Subscriptions", path: "/subscriptions" },
    { id: "profile", icon: "👤", label: "My Profile", path: "/CustomerProfile" },
  ];

  const statCards = [
    {
      icon: "🏡", label: "Kitchens Available", value: stats.tiffins,
      bg: "linear-gradient(135deg, #8FAE8E, #8FA873)",
      shadow: "rgba(143,174,142,0.4)", textColor: "#fff",
      sub: "Home kitchens near you",
    },
    {
      icon: "📜", label: "Active Subscriptions", value: stats.subscriptions,
      bg: "linear-gradient(135deg, #D9D9A8, #c5ce88)",
      shadow: "rgba(180,190,100,0.3)", textColor: "#2d3b2d",
      sub: "Current meal plans",
    },
    {
      icon: "🛍️", label: "Total Orders Placed", value: stats.orders,
      bg: "rgba(255,255,255,0.8)",
      shadow: "rgba(143,174,142,0.18)", textColor: "#2d3b2d",
      sub: "All-time orders", border: "1.5px solid rgba(143,174,142,0.3)",
    },
  ];

  const quickActions = [
    { icon: "🍱", label: "Browse Tiffins", desc: "Explore home kitchens", path: "/tiffins", bg: "linear-gradient(135deg,#8FAE8E,#8FA873)", shadow: "rgba(143,174,142,0.38)" },
    { icon: "📅", label: "Subscriptions", desc: "Manage your meal plans", path: "/subscriptions", bg: "linear-gradient(135deg,#a8c5a0,#7a9e72)", shadow: "rgba(120,170,110,0.3)" },
    { icon: "👤", label: "My Profile", desc: "Update your details", path: "/CustomerProfile", bg: "linear-gradient(135deg,#c5d490,#9ab870)", shadow: "rgba(154,184,112,0.3)" },
  ];

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

        .stat-card { transition:all 0.3s cubic-bezier(.22,.68,0,1.2); }
        .stat-card:hover { transform:translateY(-7px); }
        .quick-btn { transition:all 0.28s cubic-bezier(.22,.68,0,1.2); border:none; cursor:pointer; font-family:'Nunito',sans-serif; }
        .logout-btn:hover { background:rgba(239,83,80,0.1)!important; color:#c62828!important; border-color:rgba(239,83,80,0.4)!important; }
      `}</style>

      {/* ══════════════ SIDEBAR ══════════════ */}
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        activeNav={activeNav} 
        setActiveNav={setActiveNav} 
        user={user} 
        location={location} 
        logout={handleLogout}
      />

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <main style={{
        marginLeft: collapsed ? 72 : 260,
        flex: 1, padding: "40px 44px",
        transition: "margin-left 0.35s cubic-bezier(.22,.68,0,1.2)",
        minHeight: "100vh", overflowY: "auto",
      }}>

        {/* ── Top bar ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36, flexWrap: "wrap", gap: 16, ...anim(0) }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "#8FA873", marginBottom: 6 }}>{greeting} 👋</p>
            <h1 style={{ fontFamily: "'Lora',serif", fontSize: "clamp(24px,3.2vw,38px)", fontWeight: 700, color: "#2d3b2d", lineHeight: 1.15 }}>
              Namaste, <em style={{ color: "#8FA873" }}>{firstName}!</em>
            </h1>
            <p style={{ color: "#888", fontSize: 14, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4caf50", display: "inline-block", animation: "pulseDot 1.8s ease-in-out infinite" }} />
              📍 {location.address} · Ready for your next meal?
            </p>
          </div>

          {/* Notification + Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.72)", backdropFilter: "blur(12px)", border: "1px solid rgba(143,174,142,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", boxShadow: "0 4px 14px rgba(143,174,142,0.12)", position: "relative" }}>
              🔔
              <span style={{ position: "absolute", top: 9, right: 10, width: 8, height: 8, borderRadius: "50%", background: "#ef5350", border: "2px solid #E7E6B6" }} />
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#8FAE8E,#8FA873)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lora',serif", fontWeight: 700, fontSize: 17, color: "#fff", boxShadow: "0 4px 14px rgba(143,174,142,0.4)", cursor: "pointer" }}>
              {firstName[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* ── Hero banner ── */}
        <div style={{
          background: "linear-gradient(135deg, #8FA873, #6b8a5e)",
          borderRadius: 26, padding: "38px 44px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: "0 12px 44px rgba(90,120,70,0.28)",
          marginBottom: 36, position: "relative", overflow: "hidden",
          flexWrap: "wrap", gap: 20,
          ...anim(80),
        }}>
          <div style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.07)", top: "-70px", right: "200px", pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", border: "1.5px dashed rgba(255,255,255,0.12)", bottom: "-50px", right: "60px", pointerEvents: "none", animation: "spinSlow 30s linear infinite" }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 480 }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>Today's Menu is Ready 🍽️</p>
            <h2 style={{ fontFamily: "'Lora',serif", fontSize: "clamp(20px,2.8vw,30px)", fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: 12 }}>
              Discover Fresh Home-Cooked<br /><em>Meals Near You</em>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              Browse from <strong style={{ color: "#fff" }}>{stats.tiffins}</strong> home kitchens in <strong>{location.address.split(',')[0]}</strong> — wholesome, authentic and delivered fresh.
            </p>
            <button
              className="quick-btn"
              onClick={() => navigate("/tiffins")}
              style={{ background: "#fff", color: "#5a7a50", borderRadius: 14, padding: "13px 30px", fontWeight: 800, fontSize: 15, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
            >
              Order New Tiffin →
            </button>
          </div>

          <div style={{ fontSize: 88, animation: "floatY 5s ease-in-out infinite", position: "relative", zIndex: 1, lineHeight: 1 }}>🥘</div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20, marginBottom: 44, ...anim(160) }}>
          {statCards.map(({ icon, label, value, bg, shadow, textColor, sub, border }) => (
            <div key={label} className="stat-card" style={{ background: bg, borderRadius: 22, padding: "28px 26px", boxShadow: `0 8px 32px ${shadow}`, border: border || "none", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.09)", bottom: -25, right: -20, pointerEvents: "none" }} />
              <div style={{ fontSize: 34, marginBottom: 16 }}>{icon}</div>
              <div style={{ fontFamily: "'Lora',serif", fontSize: 40, fontWeight: 700, color: textColor, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: textColor, marginTop: 8, opacity: 0.9 }}>{label}</div>
              <div style={{ fontSize: 12, color: textColor, marginTop: 4, opacity: 0.55, fontWeight: 600 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Quick actions label ── */}
        <div style={{ marginBottom: 16, ...anim(240) }}>
          <h2 style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 700, color: "#2d3b2d", marginBottom: 4 }}>Quick Actions</h2>
          <p style={{ color: "#888", fontSize: 14 }}>Everything you need, one click away</p>
        </div>

        {/* ── Quick action cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 18, marginBottom: 44, ...anim(280) }}>
          {quickActions.map(({ icon, label, desc, path, bg, shadow }) => (
            <button key={label} className="quick-btn" onClick={() => navigate(path)} style={{ background: bg, borderRadius: 22, padding: "26px 22px", boxShadow: `0 8px 24px ${shadow}`, textAlign: "left", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.1)", bottom: -22, right: -16, pointerEvents: "none" }} />
              <div style={{ fontSize: 36, marginBottom: 14 }}>{icon}</div>
              <div style={{ fontFamily: "'Lora',serif", fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 5 }}>{label}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{desc}</div>
              <div style={{ marginTop: 16, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>Open →</div>
            </button>
          ))}
        </div>

        {/* ── Bottom row: activity + today's meal ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start", ...anim(340) }}>

          {/* Activity feed */}
          <div style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(14px)", border: "1px solid rgba(143,174,142,0.2)", borderRadius: 24, padding: "28px 26px", boxShadow: "0 4px 24px rgba(143,174,142,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <div>
                <h2 style={{ fontFamily: "'Lora',serif", fontSize: 20, fontWeight: 700, color: "#2d3b2d", marginBottom: 2 }}>Recent Activity</h2>
                <p style={{ fontSize: 13, color: "#bbb", fontWeight: 600 }}>Your latest updates</p>
              </div>
              <button className="outline-btn" onClick={() => navigate("/subscriptions")} style={{ background: "transparent", border: "2px solid #8FAE8E", color: "#5a7a50", borderRadius: 20, padding: "7px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.25s ease" }}>View All</button>
            </div>

            {[
              { icon: "📅", text: `${stats.subscriptions} subscription plan(s) currently active`, time: "Updated recently", bg: "#fff9e6" },
              { icon: "🏡", text: `${stats.tiffins} home kitchens available near you`, time: "Live data", bg: "#e8f5e9" },
              { icon: "🛍️", text: `${stats.orders} total orders placed so far`, time: "All time", bg: "#fff9e6" },
            ].map(({ icon, text, time, bg }, i) => (
              <div key={i} className="activity-row" style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 14px", borderRadius: 14, marginBottom: 4, transition: "background 0.2s", cursor: "default" }}>
                <div style={{ width: 42, height: 42, borderRadius: 13, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#2d3b2d", lineHeight: 1.4 }}>{text}</div>
                  <div style={{ fontSize: 12, color: "#bbb", fontWeight: 600, marginTop: 2 }}>{time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Tip card */}
            <div style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(14px)", border: "1px solid rgba(143,174,142,0.2)", borderRadius: 22, padding: "22px", boxShadow: "0 4px 20px rgba(143,174,142,0.1)" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#D9D9A8,#c5d490)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>💡</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#2d3b2d", marginBottom: 6 }}>Save more!</div>
                  <div style={{ fontSize: 13, color: "#777", lineHeight: 1.65 }}>A weekly subscription saves up to <strong style={{ color: "#5a7a50" }}>20%</strong> vs daily orders.</div>
                  <button onClick={() => navigate("/subscriptions")} style={{ marginTop: 10, background: "none", border: "none", color: "#8FA873", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Nunito',sans-serif", padding: 0 }}>
                    Explore plans →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}