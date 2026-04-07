import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchNearbyTiffins } from "../../store/tiffinSlice";

// Cache to avoid re-fetching same coordinates
const geocodeCache = {};

async function reverseGeocode(lat, lng) {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (geocodeCache[key]) return geocodeCache[key];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`,
      { headers: { "User-Agent": "TiffinsByNaari/1.0" } }
    );
    const data = await res.json();
    const a = data.address || {};
    const parts = [
      a.neighbourhood || a.suburb || a.village || a.town || a.county,
      a.city || a.state_district || a.state,
    ].filter(Boolean);
    const label = parts.join(", ") || data.display_name?.split(",").slice(0, 2).join(", ") || "Unknown area";
    geocodeCache[key] = label;
    return label;
  } catch {
    return null;
  }
}

export default function BrowseTiffins() {
  const navigate = useNavigate();

  // ✅ Redux se token
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();
  const { providers, loading } = useSelector((state) => state.tiffins);

  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState(10);
  const [userLocation, setUserLocation] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [sortBy, setSortBy] = useState("distance");
  const [areaMap, setAreaMap] = useState({});
  const geocodingRef = useRef(false);

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=Nunito:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setTimeout(() => setLoaded(true), 80);

    if (!navigator.geolocation) {
      setUserLocation({ lat: 23.0225, lng: 72.5714 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: 23.0225, lng: 72.5714 })
    );
  }, []);

  useEffect(() => {
    if (!userLocation) return;
    dispatch(fetchNearbyTiffins({ lat: userLocation.lat, lng: userLocation.lng, radius, token }));
  }, [userLocation, radius, dispatch, token]);

  useEffect(() => {
    if (!providers.length) return;
    geocodeProviders(providers);
  }, [providers]);


  const geocodeProviders = async (list) => {
    if (geocodingRef.current) return;
    geocodingRef.current = true;
    for (const p of list) {
      const coords = p.location?.coordinates;
      if (!coords) continue;
      if (p.address) {
        setAreaMap(prev => ({ ...prev, [p._id]: p.address }));
        continue;
      }
      const [lng, lat] = coords;
      const label = await reverseGeocode(lat, lng);
      if (label) {
        setAreaMap(prev => ({ ...prev, [p._id]: label }));
      }
      await new Promise(r => setTimeout(r, 1100));
    }
    geocodingRef.current = false;
  };

  const calcDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
  };

  const filtered = providers
    .filter((p) => {
      const q = searchQuery.toLowerCase();
      const area = areaMap[p._id] || "";
      return (
        !q ||
        p.businessName?.toLowerCase().includes(q) ||
        p.ownerName?.toLowerCase().includes(q) ||
        p.address?.toLowerCase().includes(q) ||
        area.toLowerCase().includes(q)
      );
    })
    .map((p) => ({
      ...p,
      distanceKm:
        userLocation && p.location?.coordinates
          ? calcDistance(
            userLocation.lat, userLocation.lng,
            p.location.coordinates[1], p.location.coordinates[0]
          )
          : null,
    }))
    .sort((a, b) => {
      if (sortBy === "distance") return (a.distanceKm || 99) - (b.distanceKm || 99);
      if (sortBy === "price") return (a.pricePerMeal || 0) - (b.pricePerMeal || 0);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  const anim = (d = 0) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.55s ease ${d}ms, transform 0.55s cubic-bezier(.22,.68,0,1.2) ${d}ms`,
  });

  const StarRating = ({ rating = 0 }) => (
    <span style={{ fontSize: 12, letterSpacing: 1 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#f59e0b" : "#d1d5db" }}>★</span>
      ))}
    </span>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito',sans-serif" }}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#E7E6B6}
        ::-webkit-scrollbar-thumb{background:#8FAE8E;border-radius:10px}
        @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.93) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes floatLeaf{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-6px) rotate(3deg)}}
        .provider-card{
          background:rgba(255,255,255,0.82);backdrop-filter:blur(16px);
          border-radius:24px;border:1.5px solid rgba(143,174,142,0.2);
          box-shadow:0 4px 24px rgba(90,120,70,0.08);
          transition:all 0.3s cubic-bezier(.22,.68,0,1.2);
          overflow:hidden;display:flex;flex-direction:column;
        }
        .provider-card:hover{transform:translateY(-6px);box-shadow:0 16px 48px rgba(90,120,70,0.18);border-color:rgba(143,174,142,0.45)}
        .view-menu-btn{width:100%;padding:13px;background:linear-gradient(135deg,#8FAE8E,#8FA873);color:#fff;border:none;border-radius:14px;font-family:'Nunito',sans-serif;font-size:14px;font-weight:800;cursor:pointer;transition:all 0.25s;box-shadow:0 4px 16px rgba(143,174,142,0.35);letter-spacing:0.3px}
        .view-menu-btn:hover{opacity:0.9;transform:translateY(-1px);box-shadow:0 8px 24px rgba(143,174,142,0.45)}
        .sort-btn{padding:8px 16px;border-radius:12px;border:1.5px solid #e0e0d0;background:rgba(255,255,255,0.7);color:#888;font-family:'Nunito',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s;white-space:nowrap}
        .sort-btn.active{background:linear-gradient(135deg,#8FAE8E,#8FA873);color:#fff;border-color:#8FAE8E}
        .sort-btn:hover:not(.active){background:rgba(143,174,142,0.12);color:#4a7040}
        .search-wrap:focus-within{box-shadow:0 0 0 3px rgba(143,174,142,0.2)!important;border-color:#8FAE8E!important}
        .skeleton{background:linear-gradient(90deg,rgba(143,174,142,0.08) 25%,rgba(143,174,142,0.18) 50%,rgba(143,174,142,0.08) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:12px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .area-loading{animation:pulse 1.2s ease-in-out infinite;color:#ccc!important}
      `}</style>

      {/* ── HERO HEADER ── */}
      <div style={{ background: "linear-gradient(160deg,#8FA873,#6b8a5e)", padding: "48px 40px 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.07)", top: "-120px", right: "-80px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.1)", bottom: "-60px", left: "10%", pointerEvents: "none", animation: "spinSlow 40s linear infinite" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <button onClick={() => navigate(-1)} style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 12, padding: "8px 16px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", marginBottom: 24, transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}>
            ← Back
          </button>

          <div style={{ ...anim(0) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3.5, textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>Pure Veg Tiffins</div>
              <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.2)" }} />
            </div>
            <h1 style={{ fontFamily: "'Lora',serif", fontSize: 42, fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 10 }}>
              Find Tiffins <em>Near You</em>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, fontWeight: 600 }}>
              Home-cooked, pure veg meals delivered fresh to your door
            </p>
          </div>

          {/* Search + filter bar */}
          <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap", ...anim(100) }}>
            <div className="search-wrap" style={{ flex: 1, minWidth: 240, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.92)", border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 16, padding: "12px 18px", transition: "all 0.2s" }}>
              <span style={{ fontSize: 18 }}>🔍</span>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tiffin providers or area..."
                style={{ border: "none", background: "none", outline: "none", fontSize: 15, fontFamily: "'Nunito',sans-serif", color: "#2d3b2d", flex: 1, fontWeight: 600 }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: 18, lineHeight: 1 }}>×</button>
              )}
            </div>

            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <span style={{ position: "absolute", left: 14, fontSize: 16, pointerEvents: "none" }}>📏</span>
              <select
                value={radius}
                onChange={e => setRadius(Number(e.target.value))}
                style={{ appearance: "none", background: "rgba(255,255,255,0.92)", border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 16, padding: "12px 40px 12px 42px", fontSize: 14, fontFamily: "'Nunito',sans-serif", fontWeight: 700, color: "#2d3b2d", cursor: "pointer", outline: "none" }}
              >
                {[5, 10, 15, 20].map(r => <option key={r} value={r}>{r} km radius</option>)}
              </select>
              <span style={{ position: "absolute", right: 14, fontSize: 12, color: "#8FA873", pointerEvents: "none" }}>▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 40px 60px" }}>

        {/* Results bar + sort */}
        {!loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12, ...anim(150) }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#5a7a50" }}>
              {filtered.length > 0
                ? <><strong style={{ color: "#2d3b2d", fontSize: 16 }}>{filtered.length}</strong> provider{filtered.length !== 1 ? "s" : ""} found within <strong>{radius} km</strong></>
                : "No providers found"}
            </p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#aaa", marginRight: 4 }}>Sort:</span>
              {[
                { key: "distance", label: "📏 Nearest" },
                { key: "price", label: "💰 Price" },
                { key: "rating", label: "⭐ Rating" },
              ].map(s => (
                <button key={s.key} className={`sort-btn ${sortBy === s.key ? "active" : ""}`} onClick={() => setSortBy(s.key)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32, ...anim(0) }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(143,174,142,0.2)", borderTopColor: "#8FA873", animation: "spinSlow 0.8s linear infinite" }} />
              <p style={{ fontFamily: "'Lora',serif", fontSize: 18, color: "#5a7a50", fontWeight: 600 }}>Loading nearby tiffin providers...</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="provider-card" style={{ padding: 24, opacity: 1 - i * 0.15 }}>
                  <div className="skeleton" style={{ height: 160, borderRadius: 16, marginBottom: 18 }} />
                  <div className="skeleton" style={{ height: 20, width: "70%", marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 14, width: "50%", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 20 }} />
                  <div className="skeleton" style={{ height: 44, borderRadius: 14 }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "72px 40px", background: "rgba(255,255,255,0.7)", borderRadius: 28, border: "1.5px dashed rgba(143,174,142,0.35)", ...anim(0) }}>
            <div style={{ fontSize: 64, marginBottom: 20, animation: "floatLeaf 3s ease-in-out infinite" }}>🍱</div>
            <h3 style={{ fontFamily: "'Lora',serif", fontSize: 24, fontWeight: 700, color: "#2d3b2d", marginBottom: 10 }}>No tiffin providers found</h3>
            <p style={{ color: "#aaa", fontSize: 15, fontWeight: 600, marginBottom: 24 }}>
              {searchQuery ? `No results for "${searchQuery}". Try a different search.` : `No providers within ${radius} km. Try increasing the radius.`}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ background: "rgba(143,174,142,0.15)", border: "1.5px solid rgba(143,174,142,0.3)", borderRadius: 14, padding: "11px 22px", fontSize: 14, fontWeight: 700, color: "#5a7a50", cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>Clear search</button>
              )}
              {radius < 20 && (
                <button onClick={() => setRadius(r => Math.min(r + 5, 20))} style={{ background: "linear-gradient(135deg,#8FAE8E,#8FA873)", border: "none", borderRadius: 14, padding: "11px 22px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>Expand to {radius + 5} km →</button>
              )}
            </div>
          </div>
        )}

        {/* Provider Grid */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {filtered.map((p, i) => {
              const area = areaMap[p._id];
              return (
                <div key={p._id} className="provider-card" style={{ animation: `popIn 0.4s cubic-bezier(.22,.68,0,1.2) ${i * 55}ms both` }}>

                  {/* Image */}
                  <div style={{ position: "relative", height: 160, background: "linear-gradient(135deg,#8FAE8E,#6b9e5e)", overflow: "hidden" }}>
                    {p.image ? (
                      <img src={p.image} alt={p.businessName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
                        <div style={{ fontSize: 44 }}>👩‍🍳</div>
                        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Home Kitchen</p>
                      </div>
                    )}
                    {p.distanceKm && (
                      <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", borderRadius: 20, padding: "4px 12px", display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ fontSize: 11 }}>📍</span>
                        <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>{p.distanceKm} km</span>
                      </div>
                    )}
                    <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.95)", borderRadius: 20, padding: "4px 12px", display: "flex", alignItems: "center", gap: 5, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                      <span style={{ fontSize: 12 }}>🌱</span>
                      <span style={{ color: "#388e3c", fontSize: 11, fontWeight: 800, letterSpacing: 0.5 }}>Pure Veg</span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "20px 22px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontFamily: "'Lora',serif", fontSize: 18, fontWeight: 700, color: "#2d3b2d", marginBottom: 6, lineHeight: 1.2 }}>
                      {p.businessName}
                    </h3>

                    <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }}>
                      <span>📍</span>
                      <span
                        className={area === undefined ? "area-loading" : ""}
                        style={{ color: area ? "#888" : "#ccc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {area ?? "Locating area…"}
                      </span>
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <StarRating rating={p.rating} />
                        {p.rating
                          ? <span style={{ fontSize: 12, fontWeight: 700, color: "#5a7a50" }}>({p.rating.toFixed(1)})</span>
                          : <span style={{ fontSize: 11, color: "#ccc", fontWeight: 600 }}>New</span>}
                      </div>
                      <div style={{ width: 1, height: 14, background: "#e0e0d0" }} />
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 13 }}>💰</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#2d3b2d" }}>
                          {p.pricePerMeal ? `₹${p.pricePerMeal}/meal` : "Price on inquiry"}
                        </span>
                      </div>
                      {p.distanceKm && (
                        <>
                          <div style={{ width: 1, height: 14, background: "#e0e0d0" }} />
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: 13 }}>📏</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#8FA873" }}>{p.distanceKm} km away</span>
                          </div>
                        </>
                      )}
                    </div>

                    <p style={{ fontSize: 12, color: "#bbb", fontWeight: 600, marginBottom: 16 }}>by {p.ownerName}</p>

                    <button className="view-menu-btn" onClick={() => navigate(`/provider/${p._id}`, { state: { tiffin: p } })}>
                      View Menu & Subscribe →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}