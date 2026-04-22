import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";
import forChefsImg from "../assets/for_chefs.png";
import { 
  Utensils, 
  Search, 
  ClipboardList, 
  Home as HomeIcon, 
  Package, 
  Lock, 
  MapPin, 
  Leaf, 
  ChefHat, 
  IndianRupee, 
  Handshake, 
  Mail, 
  Phone, 
  Smartphone, 
  Heart,
  ArrowRight,
  Instagram,
  Twitter,
  Linkedin
} from "lucide-react";


/* ── useInView hook ── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.12, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ── Step card ── */
function StepCard({ number, icon, title, desc, delay }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      background: "#fff", borderRadius: 24, padding: "36px 28px",
      flex: "1 1 220px", maxWidth: 280, position: "relative",
      boxShadow: "0 4px 24px rgba(100,130,90,0.09)",
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0) scale(1)" : "translateY(40px) scale(0.96)",
      transition: `all 0.6s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
    }}>
      <div style={{
        position: "absolute", top: -18, left: 28,
        width: 38, height: 38, borderRadius: "50%",
        background: "linear-gradient(135deg, #8FAE8E, #8FA873)",
        color: "#fff", fontWeight: 800, fontSize: 15,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Lora', serif", boxShadow: "0 4px 14px rgba(143,174,142,0.5)",
      }}>{number}</div>
      <div style={{ color: "linear-gradient(135deg, #8FAE8E, #8FA873)", marginBottom: 18 }}>{icon}</div>

      <h3 style={{ fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 700, margin: "0 0 10px" }}>{title}</h3>
      <p style={{ color: "#777", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  );
}

/* ── Why point ── */
function WhyPoint({ icon, title, desc, delay }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      display: "flex", gap: 18, alignItems: "flex-start",
      opacity: inView ? 1 : 0,
      transform: inView ? "translateX(0)" : "translateX(-32px)",
      transition: `all 0.65s ease ${delay}ms`,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 16, flexShrink: 0,
        background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center", color: '#fff',
      }}>{icon}</div>
      <div>
        <h3 style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 700, margin: "0 0 6px", color: "#fff" }}>{title}</h3>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ── MAIN HOME ── */
export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=Nunito:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    setTimeout(() => setLoaded(true), 80);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [whyImgRef, whyImgInView] = useInView();
  const [chefRef, chefInView] = useInView();

  const steps = [
    { number: "1", icon: <Search size={44} />, title: "Pick a Kitchen", desc: "Browse home chefs based on cuisine, distance, and reviews.", delay: 0 },
    { number: "2", icon: <ClipboardList size={44} />, title: "Choose a Plan", desc: "Select daily, weekly, or monthly meal plans that fit your life.", delay: 120 },
    { number: "3", icon: <Utensils size={44} />, title: "Enjoy Daily", desc: "Fresh, home-cooked goodness delivered to your door every single day.", delay: 240 },
  ];

  const whyPoints = [
    {
      icon: <HomeIcon size={24} />,
      title: "Real Home Kitchens",
      desc: "Every meal comes from a verified home kitchen — not a restaurant, not a cloud kitchen. Cooked by people who care.",
      delay: 100,
    },
    {
      icon: <Package size={24} />,
      title: "Subscription That Works",
      desc: "Daily, weekly, or monthly — pick a tiffin plan that fits your schedule and budget. No last-minute ordering, ever.",
      delay: 220,
    },
    {
      icon: <Lock size={24} />,
      title: "Verified & Trusted Chefs",
      desc: "Every chef on our platform goes through an onboarding check for hygiene, food quality, and consistency before going live.",
      delay: 340,
    },
  ];


  const h = (delay) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0px)" : "translateY(28px)",
    transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
  });

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#E7E6B6", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #E7E6B6; }
        ::-webkit-scrollbar-thumb { background: #8FAE8E; border-radius: 10px; }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.4); opacity: 0.5; }
        }
        @keyframes slideInBadge {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        input::placeholder { color: #aaa; }
        a { text-decoration: none; }
        .nav-link {
          color: #444; font-weight: 600; font-size: 15px;
          position: relative; padding-bottom: 3px; transition: color 0.2s;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0; height: 2px; background: #8FA873; border-radius: 2px;
          transition: width 0.3s ease;
        }
        .nav-link:hover { color: #5a7a50; }
        .nav-link:hover::after { width: 100%; }
        .food-float { animation: floatY 5s ease-in-out infinite; }
        .hero-badge-float { animation: floatY 3.5s ease-in-out infinite; }
        .chef-card:hover img { transform: scale(1.04); }
        .footer-link:hover { color: #D9D9A8 !important; }
        .social-icon:hover { background: rgba(143,174,142,0.3) !important; }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 48px", height: 70,
        background: scrollY > 50 ? "rgba(231,230,182,0.92)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(18px)" : "none",
        borderBottom: scrollY > 50 ? "1px solid rgba(143,174,142,0.2)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 19, ...h(0) }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, #8FAE8E, #8FA873)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 12px rgba(143,174,142,0.4)", overflow: "hidden" }}>
            <img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 8 }} />
          </div>
          Tiffins-By-Naari
        </div>

        {/* Navbar links that scroll to sections */}
        <div style={{ display: "flex", gap: 36, ...h(100) }}>
          <a href="#how-it-works" className="nav-link">How it Works</a>
          <a href="#why-us" className="nav-link">Why Us</a>
          <a href="#for-chefs" className="nav-link">For Chefs</a>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", ...h(200) }}>
          <Link to="/login" style={{ color: "#5a7a50", fontWeight: 700, fontSize: 15, fontFamily: "'Nunito', sans-serif" }}>Login</Link>
          <Link to="/signup">
            <button
              style={{ background: "linear-gradient(135deg, #8FAE8E, #8FA873)", color: "#fff", border: "none", borderRadius: 22, padding: "10px 26px", fontWeight: 700, cursor: "pointer", fontSize: 15, fontFamily: "'Nunito', sans-serif", boxShadow: "0 4px 18px rgba(143,174,142,0.45)", transition: "all 0.25s ease" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(143,174,142,0.55)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(143,174,142,0.45)"; }}
            >Sign Up Free</button>
          </Link>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section style={{ minHeight: "100vh", padding: "0 48px", paddingTop: 90, display: "flex", alignItems: "center", background: "#E7E6B6", position: "relative", overflow: "hidden" }}>
        {/* Background blobs */}
        <div style={{ position: "absolute", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(143,168,115,0.2) 0%, transparent 70%)", top: "5%", right: "-5%", pointerEvents: "none", transform: `translateY(${scrollY * 0.08}px)`, transition: "transform 0.1s linear" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(217,217,168,0.5) 0%, transparent 70%)", bottom: "10%", left: "-5%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "8%", top: "18%", width: 380, height: 380, borderRadius: "50%", border: "1.5px dashed rgba(143,174,142,0.4)", animation: "spinSlow 30s linear infinite", pointerEvents: "none" }} />

        {/* Left */}
        <div style={{ flex: 1, maxWidth: 620, position: "relative", zIndex: 2 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.7)", border: "1px solid rgba(143,174,142,0.35)",
            borderRadius: 30, padding: "7px 18px", fontSize: 13, fontWeight: 600, color: "#5a7a50",
            marginBottom: 28, backdropFilter: "blur(8px)", boxShadow: "0 2px 12px rgba(143,174,142,0.15)",
            ...h(100),
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4caf50", display: "inline-block", animation: "pulseDot 1.6s ease-in-out infinite" }} />
            <HomeIcon size={14} style={{ marginRight: 4 }} /> Home-cooked &amp; fresh · Delivered daily in your city
          </div>

          <h1 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(44px, 6vw, 76px)", fontWeight: 700, lineHeight: 1.08, color: "#2d3b2d", marginBottom: 24, ...h(200) }}>
            Ghar Jaisa Khana,<br />
            <em style={{ background: "linear-gradient(135deg, #8FAE8E, #6b8f5e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Everywhere</em>
          </h1>

          <p style={{ fontSize: 17, color: "#5a5a40", lineHeight: 1.75, maxWidth: 500, marginBottom: 38, fontWeight: 400, ...h(320) }}>
            Subscribe to authentic home-cooked meals by talented home chefs in your neighbourhood. Healthy, wholesome, and made with love — every single day.
          </p>

          {/* Search bar */}
          <div style={{ display: "flex", background: "#fff", borderRadius: 18, padding: "6px 6px 6px 20px", boxShadow: "0 8px 32px rgba(100,130,80,0.14)", border: "1.5px solid rgba(143,174,142,0.3)", maxWidth: 430, marginBottom: 28, ...h(420), alignItems: 'center' }}>
            <MapPin size={20} color="#8FAE8E" style={{ marginRight: 10 }} />
            <input placeholder="Enter your city or area..." style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 15, fontFamily: "'Nunito', sans-serif", color: "#333" }} />
            <button
              style={{ background: "linear-gradient(135deg, #8FAE8E, #8FA873)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 22px", fontWeight: 700, cursor: "pointer", fontSize: 15, fontFamily: "'Nunito', sans-serif", whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(143,174,142,0.4)", transition: "all 0.25s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Find Tiffins</button>
          </div>

          <div style={{ ...h(520), display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#888", fontSize: 14 }}>Are you a home chef?</span>
            <a href="#for-chefs" style={{ color: "#5a7a50", fontWeight: 700, fontSize: 14, borderBottom: "2px solid #8FAE8E", paddingBottom: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
              List your kitchen <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Right — hero image from Unsplash */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 2, ...h(300) }}>
          <img
            src={heroImg}
            alt="Delicious home-cooked meal"
            className="food-float"
            style={{ width: 420, height: 480, borderRadius: 32, objectFit: "cover", boxShadow: "0 32px 80px rgba(100,130,80,0.22)" }}
          />

          {/* Only one floating badge — delivery */}
          <div className="hero-badge-float" style={{
            position: "absolute", bottom: "12%", left: "0%",
            background: "#fff", borderRadius: 18, padding: "12px 18px",
            boxShadow: "0 8px 28px rgba(100,130,80,0.18)",
            fontSize: 13, fontWeight: 700, color: "#2d3b2d",
            display: "flex", alignItems: "center", gap: 10,
            animation: "floatY 4.2s ease-in-out infinite 1.5s, slideInBadge 0.6s ease 1s both",
            whiteSpace: "nowrap", border: "1px solid rgba(143,174,142,0.2)",
          }}>
            <HomeIcon size={20} color="#8FAE8E" />
            <div>
              <div style={{ fontWeight: 700 }}>Homemade with love</div>
              <div style={{ color: "#8FA873", fontWeight: 600, fontSize: 12 }}>Freshly prepared today</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="how-it-works" style={{ background: "#D9D9A8", padding: "100px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, background: "#E7E6B6", clipPath: "ellipse(55% 100% at 50% 0%)" }} />

        <div style={{ textAlign: "center", marginBottom: 68 }}>
          {(() => {
            const [r, v] = useInView();
            return (
              <div ref={r}>
                <p style={{ fontWeight: 700, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "#8FA873", marginBottom: 12, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(16px)", transition: "all 0.5s ease" }}>
                  How It Works
                </p>
                <h2 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#2d3b2d", lineHeight: 1.2, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease 0.1s" }}>
                  Simple Steps to<br /><em style={{ color: "#5a7a50" }}>Authentic Meals</em>
                </h2>
              </div>
            );
          })()}
        </div>

        <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap" }}>
          {steps.map(s => <StepCard key={s.title} {...s} />)}
        </div>
      </section>

      {/* ══ WHY US — completely rewritten ══ */}
      <section id="why-us" style={{ background: "linear-gradient(135deg, #8FA873 0%, #6b8a5e 100%)", padding: "100px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", pointerEvents: "none" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
          {/* Left text + points */}
          <div>
            {(() => {
              const [r, v] = useInView();
              return (
                <div ref={r}>
                  <p style={{ fontWeight: 700, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 14, opacity: v ? 1 : 0, transition: "all 0.5s ease" }}>
                    Why Us
                  </p>
                  <h2 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(28px, 4vw, 50px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 18, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(24px)", transition: "all 0.65s ease 0.1s" }}>
                    Tiffins Built on<br /><em>Trust, Not Tricks</em>
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.75, marginBottom: 44, fontSize: 15, opacity: v ? 1 : 0, transition: "all 0.65s ease 0.2s" }}>
                    We connect people who miss home food with home cooks who love making it. No middlemen. No industrial kitchens. Just real people, real meals, and a platform that keeps it honest.
                  </p>
                </div>
              );
            })()}

            <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              {whyPoints.map(p => <WhyPoint key={p.title} {...p} />)}
            </div>
          </div>

          {/* Right — real Unsplash photo of home cooking */}
          <div ref={whyImgRef} style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", opacity: whyImgInView ? 1 : 0, transform: whyImgInView ? "translateX(0)" : "translateX(50px)", transition: "all 0.8s cubic-bezier(.22,.68,0,1.2) 0.2s" }}>
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80"
              alt="Home chef cooking"
              style={{
                width: "100%", maxWidth: 360, height: 380,
                borderRadius: 28, objectFit: "cover",
                boxShadow: "0 32px 72px rgba(0,0,0,0.2)",
                border: "3px solid rgba(255,255,255,0.15)",
              }}
            />
            <div style={{ display: "flex", gap: 14 }}>
              {[{ icon: <Leaf size={16} />, text: "No Preservatives" }, { icon: <HomeIcon size={16} />, text: "Made at Home" }].map(({ icon, text }) => (
                <div key={text} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 16, padding: "10px 18px", fontSize: 13, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(8px)" }}>
                  {icon} {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOR CHEFS — replaces the hollow subscribe CTA ══ */}
      <section id="for-chefs" style={{ background: "#E7E6B6", padding: "100px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(143,168,115,0.18) 0%, transparent 70%)", top: "-80px", right: "-80px", pointerEvents: "none" }} />

        {(() => {
          const [r, v] = useInView();
          return (
            <div ref={r} style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72,
              alignItems: "center", maxWidth: 1100, margin: "0 auto",
              opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(32px)",
              transition: "all 0.7s ease",
            }}>
              {/* Left image */}
              <div style={{ position: "relative" }}>
                <img
                  src={forChefsImg}
                  alt="Home chef preparing tiffin"
                  style={{ width: "100%", height: 420, borderRadius: 28, objectFit: "cover", boxShadow: "0 24px 64px rgba(90,120,70,0.2)" }}
                />
                {/* Overlay pill */}
                <div style={{
                  position: "absolute", bottom: 24, left: 24,
                  background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)",
                  borderRadius: 16, padding: "14px 20px",
                  display: "flex", alignItems: "center", gap: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #8FAE8E, #8FA873)", display: "flex", alignItems: "center", justifyContent: "center", color: '#fff', flexShrink: 0 }}>
                    <ChefHat size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#2d3b2d" }}>Turn your cooking into income</div>
                    <div style={{ fontSize: 12, color: "#8FA873", fontWeight: 600 }}>Join chefs already on the platform</div>
                  </div>
                </div>
              </div>

              {/* Right text */}
              <div>
                <p style={{ fontWeight: 700, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "#8FA873", marginBottom: 14 }}>
                  For Home Chefs
                </p>
                <h2 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 700, color: "#2d3b2d", lineHeight: 1.2, marginBottom: 18 }}>
                  Cook from Home.<br /><em style={{ color: "#8FA873" }}>Earn on Your Terms.</em>
                </h2>
                <p style={{ color: "#5a5a40", fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
                  If you love cooking and want to share that with people in your community, Tiffins-By-Naari gives you the platform to do it. List your kitchen, set your menu, and let subscribers come to you.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
                  {[
                    { icon: <ClipboardList size={18} />, text: "Set your own menu and delivery schedule" },
                    { icon: <IndianRupee size={18} />, text: "Earn consistently through subscriptions" },
                    { icon: <Handshake size={18} />, text: "We handle discovery — you focus on cooking" },
                  ].map(({ icon, text }) => (
                    <div key={text} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(143,174,142,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: '#8FA873', flexShrink: 0 }}>{icon}</div>
                      <span style={{ fontSize: 15, color: "#3d4d3d", fontWeight: 600 }}>{text}</span>
                    </div>
                  ))}
                </div>

                <Link to="/signup">
                  <button
                    style={{ background: "linear-gradient(135deg, #8FAE8E, #8FA873)", color: "#fff", border: "none", borderRadius: 16, padding: "14px 32px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "'Nunito', sans-serif", boxShadow: "0 4px 20px rgba(143,174,142,0.4)", transition: "all 0.25s ease", display: 'flex', alignItems: 'center', gap: 10 }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(143,174,142,0.55)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(143,174,142,0.4)"; }}
                  >
                    List Your Kitchen <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ══ FOOTER — completely rewritten ══ */}
      <footer style={{ background: "#1a261a", color: "#fff", padding: "72px 48px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Top: brand + columns */}
          <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1.4fr", gap: 56, paddingBottom: 56, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>

            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Lora', serif", fontSize: 21, fontWeight: 700, marginBottom: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg, #8FAE8E, #8FA873)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, overflow: "hidden" }}>
                    <img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 8 }} />
                </div>
                Tiffins-By-Naari
              </div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.85, maxWidth: 280, marginBottom: 24 }}>
                A platform connecting home cooks with people who miss real, home-cooked food. No restaurants. Just kitchens.
              </p>
              {/* Social icons */}
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { icon: <Twitter size={16} />,  label: "Twitter/X"  },
                  { icon: <Linkedin size={16} />, label: "LinkedIn"    },
                  { icon: <Instagram size={16} />,  label: "Instagram"   },
                ].map(({ icon, label }) => (
                  <button key={label} title={label} className="social-icon" style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", cursor: "pointer", transition: "background 0.2s", fontFamily: "sans-serif" }}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform links */}
            <div>
              <h4 style={{ fontFamily: "'Lora', serif", fontWeight: 700, marginBottom: 22, fontSize: 15, color: "#fff" }}>Platform</h4>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 13 }}>
                {[
                  { label: "Find Tiffins", href: "/tiffins" },
                  { label: "How it Works", href: "#how-it-works" },
                  { label: "For Home Chefs", href: "#for-chefs" },
                  { label: "Sign Up Free", href: "/signup" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="footer-link" style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, transition: "color 0.2s" }}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h4 style={{ fontFamily: "'Lora', serif", fontWeight: 700, marginBottom: 22, fontSize: 15, color: "#fff" }}>Company</h4>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 13 }}>
                {[
                  { label: "About Us",       href: "#" },
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Use",   href: "#" },
                  { label: "Contact Us",     href: "#" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="footer-link" style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, transition: "color 0.2s" }}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact / reach out */}
            <div>
              <h4 style={{ fontFamily: "'Lora', serif", fontWeight: 700, marginBottom: 22, fontSize: 15, color: "#fff" }}>Get in Touch</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { icon: <Mail size={16} />, text: "tiffinsbynaari@gmail.com" },
                  { icon: <MapPin size={16} />, text: "Gujarat, India" },
                  { icon: <Phone size={16} />, text: "+91 93281 20975" },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>{icon}</span>
                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* App coming soon */}
              <div style={{ marginTop: 28, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Mobile App</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)", display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Smartphone size={18} /> Coming Soon on iOS & Android
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ padding: "24px 0 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              © 2026 Tiffins-By-Naari · Built with <Heart size={12} fill="#8FAE8E" color="#8FAE8E" /> for home food lovers
            </p>
            <div style={{ display: "flex", gap: 24 }}>
              {["Privacy", "Terms", "Cookies"].map(l => (
                <a key={l} href="#" className="footer-link" style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, transition: "color 0.2s" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}