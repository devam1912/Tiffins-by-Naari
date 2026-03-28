import React from "react";

export const AdminFeedback = ({ feedbacks, loading }) => {
    if (loading) {
        return (
            <div className="af-loading" style={{ padding: "40px", textAlign: "center" }}>
                <div className="af-spinner" style={{ width: 40, height: 40, border: "3px solid rgba(143,174,142,0.1)", borderTopColor: "#8FAE8E", borderRadius: "50%", animation: "spinSlow 0.8s linear infinite", margin: "0 auto 16px" }} />
                <p className="af-loading-text" style={{ color: "#8fa873", fontWeight: 700, fontSize: 14 }}>Fetching community voices...</p>
                <style>{`@keyframes spinSlow { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="af-root" style={{ animation: "popIn 0.4s cubic-bezier(.22,.68,0,1.2)" }}>

            {/* ── PAGE HEADER ── */}
            <div className="af-header" style={{ marginBottom: 28 }}>
                <p className="af-eyebrow" style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3.5, textTransform: "uppercase", color: "#8FA873", marginBottom: 8 }}>Customer Satisfaction</p>
                <h1 className="af-title" style={{ fontFamily: "'Lora',serif", fontSize: 32, fontWeight: 700, color: "#2d3b2d", marginBottom: 6 }}>All Feedbacks</h1>
                <p className="af-subtitle" style={{ color: "#999", fontSize: 14 }}>{feedbacks?.length || 0} reviews shared by our community</p>
            </div>

            {(!feedbacks || feedbacks.length === 0) ? (
                <div className="af-empty" style={{ background: "rgba(255,255,255,0.7)", borderRadius: 22, padding: "60px 40px", textAlign: "center", border: "1px solid rgba(143,174,142,0.2)" }}>
                    <div className="af-empty-icon" style={{ fontSize: 52, marginBottom: 16 }}>💬</div>
                    <h3 className="af-empty-title" style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 700, color: "#2d3b2d", marginBottom: 8 }}>No feedback yet</h3>
                    <p className="af-empty-desc" style={{ color: "#aaa", fontSize: 15, fontWeight: 600 }}>Once customers start sharing their experiences, they'll appear here.</p>
                </div>
            ) : (
                <div className="af-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 20 }}>
                    {feedbacks.map((f, i) => (
                        <div key={f._id} className="af-card" style={{
                            background: "rgba(255,255,255,0.85)",
                            backdropFilter: "blur(12px)",
                            borderRadius: 24,
                            padding: "24px",
                            border: "1.5px solid rgba(143,174,142,0.15)",
                            boxShadow: "0 10px 30px rgba(90,120,70,0.06)",
                            animation: `popIn 0.4s cubic-bezier(.22,.68,0,1.2) ${i * 40}ms both`,
                            display: "flex",
                            flexDirection: "column",
                            gap: 16
                        }}>
                            {/* Card Top Row */}
                            <div className="af-card-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div className="af-user-info" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div className="af-avatar" style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#8FAE8E,#8FA873)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontWeight: 800 }}>
                                        {f.user?.name?.[0] || "?"}
                                    </div>
                                    <div>
                                        <h4 className="af-user-name" style={{ fontWeight: 800, fontSize: 15, color: "#2d3b2d", marginBottom: 2 }}>{f.user?.name || "Unknown User"}</h4>
                                        <span className="af-user-date" style={{ fontSize: 11, color: "#bbb", fontWeight: 700 }}>
                                            {new Date(f.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                                <div className="af-rating" style={{ background: "rgba(217,217,168,0.15)", color: "#a5a56d", padding: "6px 12px", borderRadius: 12, display: "flex", alignItems: "center", gap: 4, fontWeight: 800, fontSize: 13 }}>
                                    <span>⭐</span> {f.rating}
                                </div>
                            </div>

                            {/* Comment Block */}
                            <div className="af-comment-block" style={{ padding: "16px", background: "rgba(143,174,142,0.05)", borderRadius: 16, border: "1px solid rgba(143,174,142,0.08)" }}>
                                <p className="af-comment-text" style={{ color: "#555", fontSize: 14, lineHeight: 1.6, fontStyle: "italic" }}>"{f.comment}"</p>
                            </div>

                            {/* Provider Tag */}
                            <div className="af-provider-row" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
                                <span className="af-review-label" style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>Review for:</span>
                                <span className="af-provider-tag" style={{
                                    background: "rgba(143,174,142,0.1)",
                                    color: "#5a7a50",
                                    padding: "4px 10px",
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontWeight: 800,
                                    border: "1px solid rgba(143,174,142,0.2)"
                                }}>
                                    {f.provider?.businessName || "General Feedback"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Syne:wght@400;600;700;800&display=swap');

                @keyframes popIn { from { opacity: 0; transform: scale(0.96) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                @keyframes spinSlow { to { transform: rotate(360deg); } }
                @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes shimmerRating { 0%,100% { box-shadow: 0 0 0 0 rgba(165,165,109,0.25); } 50% { box-shadow: 0 0 0 8px rgba(165,165,109,0); } }

                .af-root { font-family: 'Syne', sans-serif; }

                /* ── LOADING ── */
                .af-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 200px;
                    gap: 16px;
                }
                .af-loading-text {
                    font-family: 'Syne', sans-serif;
                    letter-spacing: 1.5px;
                    font-size: 12px !important;
                    text-transform: uppercase;
                }

                /* ── HEADER ── */
                .af-header { animation: fadeSlideUp 0.5s ease both; }
                .af-eyebrow {
                    font-family: 'Syne', sans-serif !important;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                .af-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px; height: 2px;
                    background: #8FA873;
                    border-radius: 99px;
                }
                .af-title { font-family: 'Lora', serif !important; letter-spacing: -0.5px; }
                .af-subtitle { font-family: 'Syne', sans-serif; }

                /* ── EMPTY STATE ── */
                .af-empty {
                    backdrop-filter: blur(10px);
                    transition: box-shadow 0.3s;
                }
                .af-empty:hover { box-shadow: 0 20px 50px rgba(143,174,142,0.1); }
                .af-empty-icon { animation: popIn 0.5s 0.2s both; }
                .af-empty-title { font-family: 'Lora', serif !important; }

                /* ── GRID ── */
                .af-grid { animation: fadeSlideUp 0.5s 0.1s ease both; }

                /* ── FEEDBACK CARD ── */
                .af-card {
                    font-family: 'Syne', sans-serif;
                    position: relative;
                    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s, border-color 0.3s;
                    overflow: hidden;
                }
                .af-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #8FAE8E, #D9D9A8, #8FA873);
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .af-card:hover {
                    transform: translateY(-4px) scale(1.01);
                    box-shadow: 0 24px 60px rgba(90,120,70,0.14) !important;
                    border-color: rgba(143,174,142,0.35) !important;
                }
                .af-card:hover::before { opacity: 1; }

                /* ── AVATAR ── */
                .af-avatar {
                    font-family: 'Lora', serif;
                    font-size: 20px !important;
                    transition: transform 0.3s, box-shadow 0.3s;
                    box-shadow: 0 4px 14px rgba(143,174,142,0.3);
                }
                .af-card:hover .af-avatar {
                    transform: scale(1.08) rotate(-3deg);
                    box-shadow: 0 8px 24px rgba(143,174,142,0.4);
                }

                /* ── USER NAME & DATE ── */
                .af-user-name { font-family: 'Syne', sans-serif !important; }
                .af-user-date {
                    font-family: 'Syne', sans-serif;
                    letter-spacing: 0.5px;
                }

                /* ── RATING PILL ── */
                .af-rating {
                    font-family: 'Lora', serif;
                    transition: background 0.3s, transform 0.3s;
                    animation: shimmerRating 3s ease-in-out infinite;
                }
                .af-card:hover .af-rating {
                    background: rgba(217,217,168,0.28) !important;
                    transform: scale(1.05);
                }

                /* ── COMMENT BLOCK ── */
                .af-comment-block {
                    transition: background 0.3s, border-color 0.3s;
                    position: relative;
                }
                .af-comment-block::before {
                    content: '"';
                    position: absolute;
                    top: -8px; left: 12px;
                    font-family: 'Lora', serif;
                    font-size: 48px;
                    color: rgba(143,174,142,0.2);
                    line-height: 1;
                    pointer-events: none;
                }
                .af-card:hover .af-comment-block {
                    background: rgba(143,174,142,0.08) !important;
                    border-color: rgba(143,174,142,0.18) !important;
                }
                .af-comment-text { font-family: 'Lora', serif !important; }

                /* ── PROVIDER TAG ── */
                .af-provider-tag {
                    font-family: 'Syne', sans-serif;
                    transition: background 0.25s, color 0.25s, transform 0.25s;
                    cursor: default;
                }
                .af-provider-tag:hover {
                    background: rgba(143,174,142,0.2) !important;
                    transform: translateY(-1px);
                }
                .af-review-label { font-family: 'Syne', sans-serif; }
            `}</style>
        </div>
    );
};