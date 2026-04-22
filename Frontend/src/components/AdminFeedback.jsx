import React from "react";
import { MessageSquare, Star } from "lucide-react";


export const AdminFeedback = ({ feedbacks, loading, theme }) => {
    const T = theme || {
        text: 'inherit',
        textSec: '#aaa',
        textMuted: '#aaa',
        card: 'rgba(255,255,255,0.05)',
        border: 'rgba(143,174,142,0.15)',
        bg: 'transparent'
    };

    if (loading) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <div style={{ width: 40, height: 40, border: `3px solid ${T.border}`, borderTopColor: "#8FAE8E", borderRadius: "50%", animation: "spinSlow 0.8s linear infinite", margin: "0 auto 16px" }} />
                <p style={{ color: "#8fa873", fontWeight: 700, fontSize: 14 }}>Fetching community voices...</p>
            </div>
        );
    }

    return (
        <div style={{ animation: "popIn 0.4s cubic-bezier(.22,.68,0,1.2)" }}>
            <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3.5, textTransform: "uppercase", color: "#8FA873", marginBottom: 8 }}>Customer Satisfaction</p>
                <h1 style={{ fontFamily: "'Lora',serif", fontSize: 32, fontWeight: 700, color: T.text, marginBottom: 6 }}>All Feedbacks</h1>
                <p style={{ color: T.textSec, fontSize: 14 }}>{feedbacks?.length || 0} reviews shared by our community</p>
            </div>

            {(!feedbacks || feedbacks.length === 0) ? (
                <div style={{ background: T.card, borderRadius: 22, padding: "60px 40px", textAlign: "center", border: `1px solid ${T.border}` }}>
                    <div style={{ color: T.border, marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                        <MessageSquare size={52} />
                    </div>
                    <h3 style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 700, color: T.text, marginBottom: 8 }}>No feedback yet</h3>
                    <p style={{ color: T.textSec, fontSize: 15, fontWeight: 600 }}>Once customers start sharing their experiences, they'll appear here.</p>
                </div>

            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 20 }}>
                    {feedbacks.map((f, i) => (
                        <div key={f._id} style={{
                            background: T.card,
                            backdropFilter: "blur(12px)",
                            borderRadius: 24,
                            padding: "24px",
                            border: `1.5px solid ${T.border}`,
                            boxShadow: T.cardShadow || "0 10px 30px rgba(90,120,70,0.06)",
                            animation: `popIn 0.4s cubic-bezier(.22,.68,0,1.2) ${i * 40}ms both`,
                            display: "flex",
                            flexDirection: "column",
                            gap: 16
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#8FAE8E,#8FA873)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontWeight: 800 }}>
                                        {f.user?.name?.[0] || "?"}
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: 800, fontSize: 15, color: T.text, marginBottom: 2 }}>{f.user?.name || "Unknown User"}</h4>
                                        <span style={{ fontSize: 11, color: T.textMuted, fontWeight: 700 }}>
                                            {new Date(f.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ background: "rgba(217,217,168,0.15)", color: "#a5a56d", padding: "6px 12px", borderRadius: 12, display: "flex", alignItems: "center", gap: 6, fontWeight: 800, fontSize: 13 }}>
                                    <Star size={14} fill="currentColor" /> {f.rating}
                                </div>

                            </div>

                            <div style={{ padding: "16px", background: "rgba(143,174,142,0.05)", borderRadius: 16, border: "1px solid rgba(143,174,142,0.08)" }}>
                                <p style={{ color: T.text, fontSize: 14, lineHeight: 1.6, fontStyle: "italic", opacity: 0.8 }}>"{f.comment}"</p>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
                                <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>Review for:</span>
                                <span style={{
                                    background: "rgba(143,174,142,0.1)",
                                    color: "#8FAE8E",
                                    padding: "4px 10px",
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontWeight: 800,
                                    border: `1px solid ${T.border}`
                                }}>
                                    {f.provider?.businessName || "General Feedback"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
