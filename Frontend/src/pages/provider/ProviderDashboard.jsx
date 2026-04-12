import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import API from "../../api/auth";
import { ProviderMenu } from "../../components/ProviderMenu";
import { ActiveSubscriptions } from "../../components/ActiveSubscriptions";
import { OrdersToday } from "../../components/OrdersToday";
import { ProfileSettings } from "../../components/ProfileSettings";

// --- Dashboard Component ---
export const ProviderDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);

    const [loaded, setLoaded] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [isServiceActive, setIsServiceActive] = useState(true);
    const [stats, setStats] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [isStatusLoading, setIsStatusLoading] = useState(false);

    // Redirect if not logged in
    useEffect(() => {
        if (!token) navigate("/login");

        // Fonts
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=Nunito:wght@400;500;600;700;800&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        setTimeout(() => setLoaded(true), 80);
    }, [token, navigate]);

    useEffect(() => {
        dispatch(fetchProviderDashboard());
        dispatch(fetchProviderProfile());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const handleServiceToggle = () => {
        if (!profile) return;
        dispatch(toggleServiceStatus(profile.isActive));
    };

    const anim = (delay = 0) => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
    });

    const menuItems = [
        { name: "Dashboard", icon: "⊞" },
        { name: "Menu Management", icon: "🍱" },
        { name: "Active Subscriptions", icon: "👥" },
        { name: "Orders Today", icon: "🛍️" },
        { name: "Profile Settings", icon: "⚙️" },
    ];

    const firstName = user?.name?.split(" ")[0] || "Chef";
    const businessName = profile?.businessName || stats?.businessName || "My Kitchen";

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito', sans-serif" }}>
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: #E7E6B6; }
                ::-webkit-scrollbar-thumb { background: #8FAE8E; border-radius: 10px; }
                
                .nav-btn {
                    display:flex; align-items:center; gap:12px;
                    width:100%; padding:14px 18px; border-radius:16px;
                    border:none; background:none; cursor:pointer;
                    font-family:'Nunito',sans-serif; font-size:15px; font-weight:700;
                    color:rgba(255,255,255,0.7); transition:all 0.25s cubic-bezier(.22,.68,0,1.2);
                    text-align:left;
                }
                .nav-btn:hover { background:rgba(255,255,255,0.15); color:#fff; transform:translateX(4px); }
                .nav-btn.active { background:rgba(255,255,255,0.25); color:#fff; box-shadow:0 8px 24px rgba(0,0,0,0.12); }
                
                .stat-card { transition:all 0.3s cubic-bezier(.22,.68,0,1.2); }
                .stat-card:hover { transform:translateY(-7px); }
                
                .status-toggle {
                    width: 44px; height: 24px; border-radius: 100px;
                    background: ${isServiceActive ? '#8FAE8E' : 'rgba(255,255,255,0.2)'};
                    position: relative; cursor: pointer; border: none;
                    transition: all 0.3s ease;
                }
                .status-toggle::after {
                    content: ''; position: absolute; top: 3px;
                    left: ${isServiceActive ? '23px' : '3px'};
                    width: 18px; height: 18px; border-radius: 50%;
                    background: #fff; transition: all 0.3s cubic-bezier(.22,.68,0,1.2);
                }
            `}</style>

            {/* ══════════════ SIDEBAR ══════════════ */}
            <aside style={{
                width: collapsed ? 80 : 280,
                minHeight: "100vh",
                background: "linear-gradient(165deg, #8FA873 0%, #5a7a50 100%)",
                display: "flex", flexDirection: "column",
                padding: "36px 24px",
                position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100,
                transition: "width 0.35s cubic-bezier(.22,.68,0,1.2)",
                boxShadow: "6px 0 44px rgba(50,80,40,0.15)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48, justifyContent: collapsed ? "center" : "flex-start" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👩‍🍳</div>
                    {!collapsed && (
                        <div>
                            <div style={{ fontFamily: "'Lora',serif", fontWeight: 800, fontSize: 16, color: "#fff", lineHeight: 1.2 }}>{businessName}</div>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 2 }}>Kitchen Partner</div>
                        </div>
                    )}
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                    {menuItems.map(item => (
                        <button
                            key={item.name}
                            className={`nav-btn ${activeTab === item.name ? "active" : ""}`}
                            onClick={() => setActiveTab(item.name)}
                            style={{ justifyContent: collapsed ? "center" : "flex-start" }}
                        >
                            <span style={{ fontSize: 22 }}>{item.icon}</span>
                            {!collapsed && <span>{item.name}</span>}
                        </button>
                    ))}
                </nav>

                <div style={{ marginTop: "auto" }}>
                    {!collapsed && (
                        <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: "16px", marginBottom: 20 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1.5 }}>Service Status</span>
                                <button
                                    className="status-toggle"
                                    onClick={toggleServiceStatus}
                                    disabled={isStatusLoading}
                                />
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{isServiceActive ? "Kitchen Open" : "Temporarily Closed"}</div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        style={{
                            width: "100%", padding: "14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 16, color: "rgba(255,255,255,0.6)", fontWeight: 800, fontSize: 14,
                            cursor: "pointer", transition: "all 0.25s ease", display: "flex", alignItems: "center", gap: 12,
                            justifyContent: collapsed ? "center" : "flex-start"
                        }}
                    >
                        <span>🚪</span>
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* ══════════════ MAIN CONTENT ══════════════ */}
            <main style={{
                marginLeft: collapsed ? 80 : 280,
                flex: 1, padding: "44px",
                transition: "margin-left 0.35s cubic-bezier(.22,.68,0,1.2)",
                minHeight: "100vh", overflowY: "auto",
            }}>
                {/* Top header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36, ...anim(0) }}>
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "#8FA873", marginBottom: 6 }}>Welcome Back 👨‍🍳</p>
                        <h1 style={{ fontFamily: "'Lora',serif", fontSize: 32, fontWeight: 700, color: "#2d3b2d" }}>
                            Namaste Chef, <em style={{ color: "#8FA873" }}>{firstName}!</em>
                        </h1>
                    </div>

                    <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>🔔</div>
                        <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#8FAE8E,#8FA873)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lora',serif", fontWeight: 700, color: "#fff", boxShadow: "0 4px 14px rgba(143,174,142,0.4)" }}>{firstName[0]}</div>
                    </div>
                </div>

                {/* Content View */}
                <div style={{ ...anim(80) }}>
                    {activeTab === "Dashboard" ? (
                        <div>
                            {/* Stats Grid */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 40 }}>
                                {[
                                    { label: "Monthly Revenue", value: `₹${stats?.monthlyRevenue?.toLocaleString() || 0}`, icon: "💰", bg: "#fff", textColor: "#2d3b2d" },
                                    { label: "Active Subscribers", value: stats?.activeSubscribers || 0, icon: "👥", bg: "linear-gradient(135deg, #8FAE8E, #8FA873)", textColor: "#fff" },
                                    { label: "Meals Today", value: stats?.todaysMeals || 0, icon: "🍱", bg: "#fff", textColor: "#2d3b2d" },
                                    { label: "Kitchen Status", value: isServiceActive ? "Active" : "Paused", icon: "🍳", bg: "#fff", textColor: isServiceActive ? "#8FAE8E" : "#ef5350" },
                                ].map((stat, i) => (
                                    <div key={i} className="stat-card" style={{ background: stat.bg, padding: "32px", borderRadius: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid rgba(255,255,255,0.6)" }}>
                                        <div style={{ fontSize: 32, marginBottom: 16 }}>{stat.icon}</div>
                                        <div style={{ fontSize: 14, fontWeight: 800, color: stat.textColor, opacity: 0.6, textTransform: "uppercase", letterSpacing: 1.5 }}>{stat.label}</div>
                                        <div style={{ fontSize: 32, fontWeight: 800, color: stat.textColor, marginTop: 4, fontFamily: "'Lora',serif" }}>{stat.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Activity Section */}
                            <div style={{ background: "#fff", borderRadius: 32, padding: "36px", boxShadow: "0 20px 50px rgba(0,0,0,0.03)" }}>
                                <h2 style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 700, color: "#2d3b2d", marginBottom: 24 }}>Recent Subscriptions</h2>
                                {loadingStats ? (
                                    <div style={{ padding: "40px", textAlign: "center", color: "#8FA873" }}>Syncing kitchen data...</div>
                                ) : !stats?.recentActivity || stats.recentActivity.length === 0 ? (
                                    <div style={{ padding: "40px", textAlign: "center", color: "#aaa" }}>No recent activity to show.</div>
                                ) : (
                                    <div style={{ overflowX: "auto" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <thead>
                                                <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                                                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: 11, color: "#8FAE8E", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5 }}>Customer</th>
                                                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: 11, color: "#8FAE8E", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5 }}>Plan</th>
                                                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: 11, color: "#8FAE8E", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5 }}>Amount</th>
                                                    <th style={{ textAlign: "right", padding: "12px 10px", fontSize: 11, color: "#8FAE8E", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5 }}>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats.recentActivity.map((activity, idx) => (
                                                    <tr key={idx} style={{ borderBottom: "1px solid #fafafa" }}>
                                                        <td style={{ padding: "18px 10px", fontWeight: 700, color: "#2d3b2d", fontSize: 14 }}>{activity.user?.name || "Customer"}</td>
                                                        <td style={{ padding: "18px 10px" }}>
                                                            <span style={{ padding: "4px 10px", borderRadius: 8, background: "#eef2ff", color: "#4f46e5", fontSize: 11, fontWeight: 800, textTransform: "uppercase" }}>{activity.planType}</span>
                                                        </td>
                                                        <td style={{ padding: "18px 10px", fontWeight: 800, color: "#2d3b2d" }}>₹{activity.amountPaid}</td>
                                                        <td style={{ padding: "18px 10px", textAlign: "right", color: "#aaa", fontSize: 13 }}>{new Date(activity.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{ background: "#fff", borderRadius: 32, padding: "40px", boxShadow: "0 20px 50px rgba(0,0,0,0.03)" }}>
                            {activeTab === "Menu Management" ? <ProviderMenu /> :
                                activeTab === "Active Subscriptions" ? <ActiveSubscriptions /> :
                                    activeTab === "Orders Today" ? <OrdersToday /> :
                                        activeTab === "Profile Settings" ? (
                                            <ProfileSettings
                                                isServiceActive={isServiceActive}
                                                toggleServiceStatus={toggleServiceStatus}
                                                isStatusLoading={isStatusLoading}
                                                profileData={profile || stats}
                                            />
                                        ) : null}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
