import React, { useState, useEffect } from "react";
import {
    UtensilsCrossed,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Trash2,
    Clock,
    Store
} from "lucide-react";
import { Typography } from "./ui/Typography";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";
import api from "../services/api";

export const AdminMenu = ({ menus: initialMenus = [], loading: dataLoading }) => {
    const [menus, setMenus] = useState(initialMenus);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionLoading, setActionLoading] = useState({});

    // Keep local state in sync with props from AdminDashboard
    useEffect(() => {
        setMenus(initialMenus);
    }, [initialMenus]);

    const filteredMenus = menus.filter(
        (m) =>
            m.provider?.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.provider?.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStatusChange = async (menuId, newStatus) => {
        setActionLoading(prev => ({ ...prev, [menuId]: true }));
        try {
            const token = localStorage.getItem("token");
            const action = newStatus === 'Approved' ? 'approve' : 'reject';

            // Backend endpoint: PATCH /api/tiffins/menu/:menuId/approve|reject
            await api.patch(`/api/tiffins/menu/${menuId}/${action}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMenus(prev =>
                prev.map((m) =>
                    m._id === menuId ? { ...m, isApproved: newStatus === 'Approved', submittedForApproval: newStatus !== 'Approved' } : m
                )
            );
            alert(`Menu ${action}d successfully!`);
        } catch (error) {
            console.error(`Failed to ${newStatus.toLowerCase()} menu:`, error);
            alert(error.response?.data?.message || `Failed to ${newStatus.toLowerCase()} menu.`);
        } finally {
            setActionLoading(prev => ({ ...prev, [menuId]: false }));
        }
    };

    const handleDelete = (menuId) => {
        if (window.confirm("Are you sure you want to remove this menu from view? (Note: Delete endpoint not available, this is UI only)")) {
            setMenus(prev => prev.filter((m) => m._id !== menuId));
        }
    };

    return (
        <div className="am-root space-y-8">
            {/* ── PAGE HEADER ── */}
            <div className="am-header flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="am-title" style={{ fontFamily: "'Lora', serif", fontSize: 32, fontWeight: 700, color: "#2d3b2d" }}>Menu & Tiffin Management</h2>
                    <Typography className="text-gray-500 mt-1">Review and approve tiffin offerings from providers.</Typography>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            className="am-search pl-10 w-64 h-11 bg-white border-gray-100 focus:border-[var(--primary)] transition-all"
                            placeholder="Search meals or providers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* ── TABLE CARD ── */}
            <Card className="am-table-card border-none shadow-sm overflow-hidden rounded-[32px]">
                <div className="overflow-x-auto">
                    <table className="am-table w-full text-left">
                        <thead>
                            <tr className="am-thead bg-gray-50/50 border-b border-gray-100/50">
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plan Details</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provider</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Updated</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {filteredMenus.map((menu) => (
                                <tr key={menu._id} className="am-row hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="am-menu-icon w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm border border-orange-100">
                                                <UtensilsCrossed size={18} />
                                            </div>
                                            <div>
                                                <Typography className="font-bold text-sm leading-none mb-1.5">
                                                    {menu.weekMenu?.length > 0 ? `${menu.weekMenu.length} Day Schedule` : "Empty Menu"}
                                                </Typography>
                                                <Typography variant="small" className="text-[10px] text-gray-400 font-medium">
                                                    Weekly Subscription Plan
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Store size={14} className="text-gray-400" />
                                            <div>
                                                <Typography className="text-sm font-bold">{menu.provider?.businessName || "Unknown Kitchen"}</Typography>
                                                <Typography variant="small" className="text-[10px] text-gray-400">{menu.provider?.ownerName}</Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "am-status-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            menu.isApproved ? "bg-green-50 text-green-600 border border-green-100" :
                                                menu.submittedForApproval ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                                    "bg-gray-50 text-gray-600 border border-gray-100"
                                        )}>
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                menu.isApproved ? "bg-green-500" :
                                                    menu.submittedForApproval ? "bg-amber-500" : "bg-gray-500"
                                            )} />
                                            {menu.isApproved ? 'Approved' : menu.submittedForApproval ? 'Pending' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-gray-500">
                                        <Typography className="text-xs font-bold">
                                            {menu.updatedAt ? new Date(menu.updatedAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' }) : "—"}
                                        </Typography>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {actionLoading[menu._id] ? (
                                                <Clock className="animate-spin text-gray-400 mr-4" size={18} />
                                            ) : (
                                                <>
                                                    {!menu.isApproved && menu.submittedForApproval && (
                                                        <button
                                                            onClick={() => handleStatusChange(menu._id, 'Approved')}
                                                            className="am-action-btn am-approve-btn p-2 text-green-500 hover:bg-green-50 rounded-xl transition-all"
                                                            title="Approve Menu"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                    )}
                                                    {menu.isApproved && (
                                                        <button
                                                            onClick={() => handleStatusChange(menu._id, 'Rejected')}
                                                            className="am-action-btn am-reject-btn p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                            title="Reject/Unpublish Menu"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(menu._id)}
                                                        className="am-action-btn am-delete-btn p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Remove from View"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredMenus.length === 0 && (
                        <div className="am-empty py-32 text-center">
                            <div className="am-empty-icon w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                                <UtensilsCrossed size={40} />
                            </div>
                            <Typography variant="h3" className="font-serif text-gray-400 mb-2">No menus found</Typography>
                            <Typography className="text-gray-400 max-w-xs mx-auto">
                                {dataLoading ? "Fetching latest menus..." : "There are no kitchen menus to display currently. This could be because no providers have submitted menus for approval yet."}
                            </Typography>
                        </div>
                    )}
                </div>
            </Card>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Syne:wght@400;600;700;800&display=swap');

                @keyframes amFadeUp  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes amRowIn   { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes amIconBob { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-3px) rotate(-5deg); } }

                .am-root { font-family: 'Syne', sans-serif; }

                /* ── HEADER ── */
                .am-header { animation: amFadeUp 0.45s ease both; }
                .am-title {
                    font-family: 'Lora', serif !important;
                    letter-spacing: -0.5px;
                    background: linear-gradient(135deg, #2d3b2d 0%, #5a7a50 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .am-search {
                    font-family: 'Syne', sans-serif;
                    border-radius: 14px !important;
                    transition: box-shadow 0.25s !important;
                }
                .am-search:focus { box-shadow: 0 0 0 3px rgba(143,174,142,0.15) !important; }

                /* ── TABLE CARD ── */
                .am-table-card {
                    border: 1px solid rgba(143,174,142,0.1) !important;
                    transition: box-shadow 0.3s;
                    animation: amFadeUp 0.5s 0.1s ease both;
                }
                .am-table-card:hover { box-shadow: 0 20px 60px rgba(143,174,142,0.1) !important; }

                /* ── THEAD ── */
                .am-thead { background: linear-gradient(90deg, #f5f7f3, #f0f4ee) !important; }
                .am-thead th { font-family: 'Syne', sans-serif; }

                /* ── ROWS ── */
                .am-row {
                    animation: amRowIn 0.4s ease both;
                    transition: background 0.2s !important;
                    position: relative;
                }
                .am-row::after {
                    content: '';
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 0;
                    background: linear-gradient(90deg, rgba(143,174,142,0.12), transparent);
                    transition: width 0.3s ease;
                    pointer-events: none;
                }
                .am-row:hover::after { width: 100%; }
                .am-row:hover { background: rgba(143,174,142,0.03) !important; }

                /* ── MENU ICON ── */
                .am-menu-icon {
                    transition: transform 0.3s, background 0.3s, color 0.3s;
                }
                .am-row:hover .am-menu-icon {
                    animation: amIconBob 0.6s ease-in-out;
                    background: rgba(143,174,142,0.1) !important;
                    border-color: rgba(143,174,142,0.25) !important;
                    color: #5a7a50 !important;
                }

                /* ── STATUS BADGE ── */
                .am-status-badge {
                    font-family: 'Syne', sans-serif;
                    transition: transform 0.2s, box-shadow 0.2s;
                    cursor: default;
                }
                .am-row:hover .am-status-badge {
                    transform: scale(1.05);
                    box-shadow: 0 3px 10px rgba(0,0,0,0.08);
                }

                /* ── ACTION BUTTONS ── */
                .am-action-btn {
                    font-family: 'Syne', sans-serif;
                    transition: all 0.2s !important;
                    position: relative;
                }
                .am-action-btn:hover { transform: scale(1.15) !important; }
                .am-approve-btn:hover { box-shadow: 0 4px 12px rgba(46,125,50,0.2) !important; }
                .am-reject-btn:hover  { box-shadow: 0 4px 12px rgba(239,83,80,0.2) !important; }
                .am-delete-btn:hover  { box-shadow: 0 4px 12px rgba(239,83,80,0.15) !important; }

                /* ── EMPTY STATE ── */
                .am-empty { animation: amFadeUp 0.5s ease both; }
                .am-empty-icon {
                    transition: transform 0.3s;
                }
                .am-empty:hover .am-empty-icon { transform: scale(1.1) rotate(-5deg); }
            `}</style>
        </div>
    );
};