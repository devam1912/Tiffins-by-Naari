import React, { useState } from "react";
import { cn } from "../lib/utils";
import {
    Eye,
    Search,
    User as UserIcon,
    Filter,
    Clock,
    X,
    Mail,
    Phone,
    ShieldCheck
} from "lucide-react";
import { Typography } from "./ui/Typography";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { motion, AnimatePresence } from "motion/react";

export const AdminUsers = ({ users = [] }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const filteredUsers = users.filter(
        (user) =>
            (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="au-root space-y-8 pb-10">
            {/* ── PAGE HEADER ── */}
            <div className="au-header flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="au-title" style={{ fontFamily: "'Lora', serif", fontSize: 32, fontWeight: 700, color: "#2d3b2d" }}>User Management</h2>
                    <Typography className="text-gray-500 mt-1">Manage and monitor all registered platform users.</Typography>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            className="au-search pl-10 w-64 h-11 bg-white border-gray-100 focus:border-[var(--primary)] transition-all"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="au-filter-btn h-11 border-gray-100 hover:bg-gray-50">
                        <Filter className="mr-2" size={18} />
                        Filters
                    </Button>
                </div>
            </div>

            {/* ── TABLE CARD ── */}
            <Card className="au-table-card border-none shadow-sm overflow-hidden rounded-[32px]">
                <div className="overflow-x-auto">
                    <table className="au-table w-full text-left">
                        <thead>
                            <tr className="au-thead-row bg-gray-50/50 border-b border-gray-100/50">
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">User Details</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined Date</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="au-row hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="au-avatar w-10 h-10 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-400 shadow-sm border border-white">
                                                <UserIcon size={20} />
                                            </div>
                                            <div>
                                                <Typography className="au-user-name font-bold text-sm leading-none mb-1.5">{user.name}</Typography>
                                                <Typography variant="small" className="text-[10px] text-gray-400 font-medium">{user.email}</Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "au-role-badge text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border",
                                            user.role === 'provider' ? "bg-purple-50 text-purple-600 border-purple-100" :
                                                user.role === 'admin' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                    "bg-blue-50 text-blue-600 border-blue-100"
                                        )}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "au-status-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                user.isVerified ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-50 text-gray-600 border border-gray-100"
                                            )}>
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    user.isVerified ? "bg-green-500" : "bg-gray-400"
                                                )} />
                                                {user.isVerified ? "Verified" : "Unverified"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Clock size={14} className="opacity-50" />
                                            <Typography className="text-xs font-bold">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                }) : "—"}
                                            </Typography>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="au-view-btn p-2 text-gray-400 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-xl transition-all"
                                                title="View User Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="au-empty py-20 text-center">
                            <div className="au-empty-icon w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <Search size={32} />
                            </div>
                            <Typography className="text-gray-400 font-medium">No users found matching your search.</Typography>
                        </div>
                    )}
                </div>
            </Card>

            {/* ── USER DETAILS MODAL ── */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedUser(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="au-modal relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-8"
                        >
                            <div className="au-modal-accent" />
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="au-modal-avatar w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-400 border-4 border-white shadow-md">
                                        <UserIcon size={32} />
                                    </div>
                                    <div>
                                        <Typography variant="h3" className="au-modal-name font-serif leading-none mb-1 text-gray-800">{selectedUser.name}</Typography>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={cn(
                                                "text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border",
                                                selectedUser.role === 'provider' ? "bg-purple-50 text-purple-600 border-purple-100" :
                                                    selectedUser.role === 'admin' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                        "bg-blue-50 text-blue-600 border-blue-100"
                                            )}>
                                                {selectedUser.role}
                                            </span>
                                            {selectedUser.isVerified && (
                                                <span className="text-[10px] bg-green-50 text-green-600 border border-green-100 font-extrabold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                                                    <ShieldCheck size={12} />
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedUser(null)} className="au-close-btn p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6 mt-8">
                                <div className="au-info-row bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                                    <div className="au-info-icon p-3 bg-white rounded-xl shadow-sm text-[var(--primary)] text-[#8FAE8E]">
                                        <Mail size={18} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <Typography className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</Typography>
                                        <Typography className="font-medium text-gray-800 truncate" title={selectedUser.email}>{selectedUser.email}</Typography>
                                    </div>
                                </div>

                                {selectedUser.phone ? (
                                    <div className="au-info-row bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                                        <div className="au-info-icon p-3 bg-white rounded-xl shadow-sm text-blue-500">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <Typography className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</Typography>
                                            <Typography className="font-medium text-gray-800">{selectedUser.phone}</Typography>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-center">
                                        <Typography className="text-sm font-medium text-gray-400 italic">No phone number provided</Typography>
                                    </div>
                                )}

                                <div className="au-info-row bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                                    <div className="au-info-icon p-3 bg-white rounded-xl shadow-sm text-gray-500">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <Typography className="text-xs font-bold text-gray-400 uppercase tracking-widest">Member Since</Typography>
                                        <Typography className="font-medium text-gray-800">
                                            {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            }) : "—"}
                                        </Typography>
                                    </div>
                                </div>
                                {selectedUser.walletBalance !== undefined && (
                                    <div className="au-wallet-row bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4 text-center justify-center mt-2">
                                        <Typography className="text-sm font-bold text-gray-800">Wallet Balance: </Typography>
                                        <Typography className="text-sm font-bold text-[var(--primary)]">₹{selectedUser.walletBalance}</Typography>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Syne:wght@400;600;700;800&display=swap');

                @keyframes auFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes auRowIn  { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes auPulse  { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }

                .au-root { font-family: 'Syne', sans-serif; }

                /* ── HEADER ── */
                .au-header { animation: auFadeUp 0.45s ease both; }
                .au-title {
                    font-family: 'Lora', serif !important;
                    letter-spacing: -0.5px;
                    background: linear-gradient(135deg, #2d3b2d 0%, #5a7a50 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .au-search {
                    font-family: 'Syne', sans-serif;
                    border-radius: 14px !important;
                    transition: box-shadow 0.25s, border-color 0.25s !important;
                }
                .au-search:focus { box-shadow: 0 0 0 3px rgba(143,174,142,0.15) !important; }
                .au-filter-btn {
                    font-family: 'Syne', sans-serif;
                    font-weight: 700;
                    border-radius: 14px !important;
                    transition: all 0.25s !important;
                }
                .au-filter-btn:hover {
                    background: rgba(143,174,142,0.08) !important;
                    border-color: rgba(143,174,142,0.3) !important;
                    color: #5a7a50 !important;
                }

                /* ── TABLE CARD ── */
                .au-table-card {
                    border: 1px solid rgba(143,174,142,0.1) !important;
                    transition: box-shadow 0.3s;
                    animation: auFadeUp 0.5s 0.1s ease both;
                }
                .au-table-card:hover { box-shadow: 0 20px 60px rgba(143,174,142,0.1) !important; }

                /* ── THEAD ── */
                .au-thead-row { background: linear-gradient(90deg, #f5f7f3, #f0f4ee) !important; }
                .au-thead-row th { font-family: 'Syne', sans-serif; }

                /* ── ROWS ── */
                .au-row {
                    animation: auRowIn 0.4s ease both;
                    transition: background 0.2s, box-shadow 0.2s !important;
                    position: relative;
                }
                .au-row:hover { background: rgba(143,174,142,0.04) !important; }
                .au-row:hover .au-avatar {
                    background: linear-gradient(135deg, #8FAE8E, #8FA873) !important;
                    color: #fff !important;
                    transform: scale(1.1);
                }

                /* ── AVATAR ── */
                .au-avatar {
                    transition: background 0.3s, color 0.3s, transform 0.3s;
                }

                /* ── USER NAME ── */
                .au-user-name { font-family: 'Syne', sans-serif !important; letter-spacing: 0.1px; }

                /* ── ROLE BADGE ── */
                .au-role-badge {
                    font-family: 'Syne', sans-serif;
                    transition: transform 0.2s, box-shadow 0.2s;
                    cursor: default;
                }
                .au-row:hover .au-role-badge { transform: scale(1.04); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

                /* ── STATUS BADGE ── */
                .au-status-badge {
                    font-family: 'Syne', sans-serif;
                    transition: filter 0.2s;
                }
                .au-row:hover .au-status-badge { filter: brightness(0.95); }

                /* ── VIEW BUTTON ── */
                .au-view-btn {
                    font-family: 'Syne', sans-serif;
                    transition: all 0.2s !important;
                }
                .au-view-btn:hover {
                    color: #8FAE8E !important;
                    background: rgba(143,174,142,0.12) !important;
                    transform: scale(1.12);
                }

                /* ── EMPTY STATE ── */
                .au-empty { animation: auFadeUp 0.5s ease both; }
                .au-empty-icon { animation: auPulse 2s ease-in-out infinite; }

                /* ── MODAL ── */
                .au-modal {
                    font-family: 'Syne', sans-serif;
                    position: relative;
                    overflow: visible !important;
                }
                .au-modal-accent {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 5px;
                    background: linear-gradient(90deg, #8FAE8E, #D9D9A8, #8FA873);
                    border-radius: 24px 24px 0 0;
                }
                .au-modal-avatar {
                    transition: transform 0.3s, box-shadow 0.3s;
                    background: linear-gradient(135deg, #f5f5f0, #ebebdf) !important;
                }
                .au-modal:hover .au-modal-avatar {
                    transform: scale(1.05);
                    box-shadow: 0 8px 24px rgba(143,174,142,0.25) !important;
                }
                .au-modal-name { font-family: 'Lora', serif !important; }

                /* ── MODAL INFO ROWS ── */
                .au-info-row {
                    transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
                }
                .au-info-row:hover {
                    background: rgba(143,174,142,0.06) !important;
                    transform: translateX(4px);
                    box-shadow: 0 4px 16px rgba(143,174,142,0.08);
                }
                .au-info-icon {
                    transition: transform 0.25s, box-shadow 0.25s;
                }
                .au-info-row:hover .au-info-icon {
                    transform: scale(1.1) rotate(-5deg);
                    box-shadow: 0 4px 12px rgba(143,174,142,0.2);
                }

                /* ── WALLET ROW ── */
                .au-wallet-row {
                    background: linear-gradient(135deg, rgba(143,174,142,0.06), rgba(217,217,168,0.08)) !important;
                    border-color: rgba(143,174,142,0.15) !important;
                }

                /* ── CLOSE BTN ── */
                .au-close-btn {
                    transition: background 0.2s, transform 0.2s !important;
                }
                .au-close-btn:hover { transform: rotate(90deg) scale(1.1); }
            `}</style>
        </div>
    );
};