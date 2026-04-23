import React, { useState } from "react";
import { cn } from "../lib/utils";
import {
    Eye,
    Trash2,
    Ban,
    Search,
    MoreHorizontal,
    User as UserIcon,
    Filter,
    CheckCircle2,
    XCircle,
    Clock
} from "lucide-react";
import { Typography } from "./ui/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
export const AdminUsers = ({ users = [], theme }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const T = theme || {
        text: 'inherit',
        textSec: '#aaa',
        textMuted: '#aaa',
        card: '#fff',
        border: '#f0f0f0',
        bg: 'transparent'
    };

    const filteredUsers = users.filter(
        (user) =>
            (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <div>
                        <h2 style={{ fontFamily: "'Lora', serif", fontSize: 32, fontWeight: 700, color: T.text, margin: 0 }}>User Management</h2>
                        <p style={{ color: T.textSec, fontSize: 14, marginTop: 4 }}>Manage and monitor all registered platform users.</p>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ position: "relative" }}>
                            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.textMuted }}>
                                <Search size={18} />
                            </span>
                            <input
                                style={{
                                    paddingLeft: 40, paddingRight: 16, paddingTop: 10, paddingBottom: 10,
                                    background: T.bg === '#000000' ? 'rgba(255,255,255,0.05)' : '#fff',
                                    border: `1px solid ${T.border}`,
                                    borderRadius: 12, color: T.text, fontSize: 14, outline: "none", width: 240
                                }}
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ background: T.bg === '#000000' ? 'rgba(255,255,255,0.02)' : T.card, borderRadius: 32, overflow: "hidden", border: `1px solid ${T.border}` }}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ background: T.bg === '#000000' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderBottom: `1px solid ${T.border}` }}>
                                <th style={{ padding: "20px 32px", fontSize: 10, fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.5 }}>User Details</th>
                                <th style={{ padding: "20px 24px", fontSize: 10, fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.5 }}>Role</th>
                                <th style={{ padding: "20px 24px", fontSize: 10, fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.5 }}>Status</th>
                                <th style={{ padding: "20px 24px", fontSize: 10, fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.5 }}>Joined Date</th>
                                <th style={{ padding: "20px 32px", fontSize: 10, fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.5, textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody style={{ divideY: `1px solid ${T.border}` }}>
                            {filteredUsers.map((user) => (
                                <tr key={user._id} style={{ borderBottom: `1px solid ${T.border}`, transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: "20px 32px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.bg === '#000000' ? 'rgba(255,255,255,0.05)' : "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted, border: `1px solid ${T.border}` }}>
                                                <UserIcon size={20} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: 14, color: T.text }}>{user.name}</div>
                                                <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 600 }}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: "20px 24px" }}>
                                        <span style={{
                                            fontSize: 10, fontWeight: 800, px: 12, py: 4, borderRadius: 100, textTransform: "uppercase", letterSpacing: 1,
                                            padding: "4px 12px", border: `1px solid ${user.role === 'provider' ? 'rgba(147, 51, 234, 0.2)' : 'rgba(37, 99, 235, 0.2)'}`,
                                            background: user.role === 'provider' ? 'rgba(147, 51, 234, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                                            color: user.role === 'provider' ? '#a855f7' : '#3b82f6'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: "20px 24px" }}>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, fontSize: 10, fontWeight: 800, textTransform: "uppercase", background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                                            Active
                                        </span>
                                    </td>
                                    <td style={{ padding: "20px 24px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.textSec }}>
                                            <Clock size={14} style={{ opacity: 0.5 }} />
                                            <span style={{ fontSize: 12, fontWeight: 700 }}>
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                }) : "—"}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "20px 32px", textAlign: "right" }}>
                                        <button style={{ padding: 8, background: "transparent", border: "none", borderRadius: 10, color: T.textMuted, cursor: "pointer" }}>
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div style={{ padding: "80px 0", textAlign: "center" }}>
                            <div style={{ width: 64, height: 64, background: T.bg === '#000000' ? 'rgba(255,255,255,0.05)' : "#f9f9f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: T.textMuted }}>
                                <Search size={32} />
                            </div>
                            <p style={{ color: T.textMuted, fontWeight: 600 }}>No users found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
