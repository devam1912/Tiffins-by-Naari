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
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 style={{ fontFamily: "'Lora', serif", fontSize: 32, fontWeight: 700, color: "#2d3b2d" }}>Menu & Tiffin Management</h2>
                    <Typography className="text-gray-500 mt-1">Review and approve tiffin offerings from providers.</Typography>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            className="pl-10 w-64 h-11 bg-white border-gray-100 focus:border-[var(--primary)] transition-all"
                            placeholder="Search meals or providers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden rounded-[32px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100/50">
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plan Details</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provider</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Updated</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {filteredMenus.map((menu) => (
                                <tr key={menu._id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm border border-orange-100">
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
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
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
                                                            className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-all"
                                                            title="Approve Menu"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                    )}
                                                    {menu.isApproved && (
                                                        <button
                                                            onClick={() => handleStatusChange(menu._id, 'Rejected')}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                            title="Reject/Unpublish Menu"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(menu._id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
                        <div className="py-32 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
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
        </div>
    );
};
