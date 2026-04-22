import React, { useState, useEffect } from "react";
import API from "../api/auth";
import { useDialog } from "../context/DialogContext";

export const ProfileSettings = ({ isServiceActive, toggleServiceStatus, isStatusLoading, profileData, theme }) => {
    const { showAlert } = useDialog();
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const T = theme || {
        text: 'inherit',
        textSec: '#aaa',
        textMuted: '#aaa',
        card: 'rgba(255,255,255,0.05)',
        border: 'rgba(255,255,255,0.1)',
        cardShadow: 'none',
        bg: 'transparent'
    };

    const [formData, setFormData] = useState({
        kitchenName: "", chefName: "", email: "", phone: "", location: "", specialty: "", fssai: "", description: ""
    });

    useEffect(() => {
        if (profileData) {
            setFormData({
                kitchenName: profileData.businessName || profileData.name || "",
                chefName: profileData.ownerName || "",
                email: profileData.email || "",
                phone: profileData.phone || "",
                location: profileData.address || "",
                specialty: profileData.cuisineType || "",
                fssai: profileData.fssaiNumber || "",
                description: profileData.description || ""
            });
        }
    }, [profileData]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await API.patch("/providers/profile", {
                businessName: formData.kitchenName,
                ownerName: formData.chefName,
                phone: formData.phone,
                address: formData.location,
                cuisineType: formData.specialty,
                description: formData.description,
            });
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (err) {
            showAlert("Update Failed", err.response?.data?.message || "Profile update failed");
        } finally {
            setSaving(false);
        }
    };

    const field = (label, key, opts = {}) => (
        <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{label}</label>
            <input
                value={formData[key]}
                onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                disabled={opts.disabled}
                placeholder={opts.placeholder || ""}
                style={{
                    width: "100%", padding: "12px 16px", border: `2px solid ${T.border}`, borderRadius: 14, fontSize: 14,
                    fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box",
                    background: opts.disabled ? "rgba(255,255,255,0.02)" : T.bg === '#000000' ? 'rgba(255,255,255,0.05)' : "#fff",
                    color: opts.disabled ? T.textMuted : T.text,
                    cursor: opts.disabled ? "not-allowed" : "text",
                }}
            />
            {opts.hint && <p style={{ fontSize: 10, color: T.textMuted, fontStyle: "italic", marginTop: 4 }}>{opts.hint}</p>}
        </div>
    );

    const isDark = T.bg === '#000000';

    return (
        <div style={{ fontFamily: "'Nunito', sans-serif", maxWidth: 900, color: T.text }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                    <h2 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: T.text, margin: 0 }}>Profile Settings</h2>
                    <p style={{ color: T.textSec, fontSize: 13, marginTop: 4 }}>Manage your kitchen identity and contact information.</p>
                </div>
                <button onClick={handleSave} disabled={saving}
                    style={{ padding: "12px 24px", borderRadius: 14, border: "none", background: isSaved ? "#4caf50" : "#2d3b2d", color: "#fff", fontWeight: 800, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", transition: "background 0.3s" }}>
                    {saving ? "Saving..." : isSaved ? "✅ Saved!" : "💾 Save Profile"}
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 28 }}>
                {/* Left: Form */}
                <div>
                    {/* Kitchen Identity */}
                    <div style={{ background: T.card, borderRadius: 22, padding: "28px", border: `1px solid ${T.border}`, marginBottom: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                            <span style={{ fontSize: 22 }}>🏪</span>
                            <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 18, color: T.text }}>Kitchen Identity</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>{field("Kitchen Name", "kitchenName", { placeholder: "Enter kitchen name" })}</div>
                            <div>{field("Chef Name", "chefName", { placeholder: "Enter chef name" })}</div>
                        </div>
                        {field("Specialty / Cuisine", "specialty", { placeholder: "e.g. South Indian, Desserts, Healthy Keto" })}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Kitchen Bio</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Tell customers about your cooking style..."
                                style={{ width: "100%", padding: "12px 16px", border: `2px solid ${T.border}`, background: isDark ? 'rgba(255,255,255,0.05)' : '#fff', color: T.text, borderRadius: 14, fontSize: 14, fontFamily: "'Nunito', sans-serif", outline: "none", resize: "none", height: 100, boxSizing: "border-box" }}
                            />
                        </div>
                    </div>

                    {/* Contact */}
                    <div style={{ background: T.card, borderRadius: 22, padding: "28px", border: `1px solid ${T.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                            <span style={{ fontSize: 22 }}>📞</span>
                            <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 18, color: T.text }}>Contact & Location</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>{field("Email", "email", { disabled: true, hint: "Contact support to change email" })}</div>
                            <div>{field("Phone", "phone", { placeholder: "Enter phone number" })}</div>
                        </div>
                        {field("Operating Location", "location", { placeholder: "Enter address" })}
                    </div>
                </div>

                {/* Right: Profile Card + Status */}
                <div>
                    {/* Profile Avatar Card */}
                    <div style={{ background: T.card, borderRadius: 22, overflow: "hidden", border: `1px solid ${T.border}`, marginBottom: 20 }}>
                        <div style={{ height: 80, background: "linear-gradient(135deg, #8FAE8E, #5a7a50)" }} />
                        <div style={{ padding: "0 24px 28px", textAlign: "center", marginTop: -40 }}>
                            <div style={{ width: 80, height: 80, borderRadius: "50%", background: isDark ? '#141414' : "#fff", border: `4px solid ${T.border}`, boxShadow: T.cardShadow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lora', serif", fontWeight: 800, fontSize: 32, color: "#8FAE8E", margin: "0 auto" }}>
                                {formData.kitchenName.charAt(0) || "?"}
                            </div>
                            <h3 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 18, color: T.text, marginTop: 12, marginBottom: 2 }}>{formData.kitchenName || "My Kitchen"}</h3>
                            <p style={{ fontSize: 13, color: T.textSec }}>{formData.chefName || "Chef"}</p>
                            <div style={{ display: "center", justifyContent: "center", gap: 8, marginTop: 12 }}>
                                <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, background: isDark ? "rgba(34, 197, 94, 0.15)" : "#e8f5e9", color: "#22c55e", textTransform: "uppercase" }}>Verified</span>
                                <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, background: isDark? "rgba(59, 130, 246, 0.15)" : "#e3f2fd", color: "#3b82f6", textTransform: "uppercase" }}>Top Rated</span>
                            </div>
                        </div>
                    </div>

                    {/* FSSAI Card */}
                    <div style={{ background: isDark ? 'rgba(255, 255, 255, 0.03)' : "#fffde7", borderRadius: 22, padding: "24px", border: `1px solid ${isDark ? T.border : "#ffe082"}`, marginBottom: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                            <span style={{ fontSize: 22 }}>🛡️</span>
                            <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 16, color: "#e65100" }}>FSSAI Status</span>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: isDark ? T.textSec : "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>License Number</label>
                            <input
                                value={formData.fssai}
                                onChange={e => setFormData({ ...formData, fssai: e.target.value })}
                                style={{
                                    width: "100%", padding: "12px 16px", border: `1px solid ${T.border}`, borderRadius: 14, fontSize: 14,
                                    fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box",
                                    background: isDark ? 'rgba(255,255,255,0.05)' : "#fff",
                                    color: T.text,
                                }}
                            />
                        </div>
                        <div style={{ padding: "10px 14px", background: isDark ? 'rgba(255,255,255,0.05)' : "#fff", borderRadius: 12, border: `1px solid ${isDark ? T.border : "#ffe082"}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, color: "#22c55e" }}>
                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                                Active & Valid
                            </div>
                        </div>
                    </div>

                    {/* Service Toggle */}
                    <button onClick={toggleServiceStatus} disabled={isStatusLoading}
                        style={{
                            width: "100%", padding: "14px", borderRadius: 14, fontWeight: 800, fontSize: 14, cursor: isStatusLoading ? "not-allowed" : "pointer",
                            border: `2px solid ${isServiceActive ? (isDark ? "rgba(239, 68, 68, 0.4)" : "#ffcdd2") : (isDark ? "rgba(34, 197, 94, 0.4)" : "#c8e6c9")}`,
                            background: isServiceActive ? (isDark ? "rgba(239, 68, 68, 0.15)" : "#ffebee") : (isDark ? "rgba(34, 197, 94, 0.15)" : "#e8f5e9"),
                            color: isServiceActive ? (isDark ? "#ef4444" : "#c62828") : (isDark ? "#22c55e" : "#2e7d32"),
                            transition: "all 0.3s"
                        }}>
                        {isStatusLoading ? "⏳ Processing..." : isServiceActive ? "⏸️ Pause My Service" : "▶️ Resume My Service"}
                    </button>
                </div>
            </div>
        </div>

    );
};
