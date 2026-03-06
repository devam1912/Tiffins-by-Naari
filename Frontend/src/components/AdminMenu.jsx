import React, { useState } from "react";
import {
    UtensilsCrossed,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Trash2,
    Clock,
    MoreHorizontal,
    ChevronRight,
    Store
} from "lucide-react";
import { Typography } from "./ui/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { cn } from "../lib/utils";

export const AdminMenu = () => {
    // Initializing with empty array as requested "no mock data"
    const [tiffins, setTiffins] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTiffins = tiffins.filter(
        (tiffin) =>
            tiffin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tiffin.providerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStatusChange = (tiffinId, newStatus) => {
        setTiffins(
            tiffins.map((t) =>
                t.id === tiffinId ? { ...t, status: newStatus } : t
            )
        );
    };

    const handleDelete = (tiffinId) => {
        if (window.confirm("Are you sure you want to delete this menu item?")) {
            setTiffins(tiffins.filter((t) => t.id !== tiffinId));
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Typography variant="h2" className="font-serif text-3xl">Menu & Tiffin Management</Typography>
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
                    <Button variant="outline" className="h-11 border-gray-100 hover:bg-gray-50">
                        <Filter className="mr-2" size={18} />
                        Filters
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden rounded-[32px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100/50">
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Meal Details</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provider</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Added On</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {filteredTiffins.map((tiffin) => (
                                <tr key={tiffin.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm border border-orange-100">
                                                <UtensilsCrossed size={18} />
                                            </div>
                                            <div>
                                                <Typography className="font-bold text-sm leading-none mb-1.5">{tiffin.name}</Typography>
                                                <Typography variant="small" className="text-[10px] text-gray-400 font-medium">₹{tiffin.price}</Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Store size={14} className="text-gray-400" />
                                            <Typography className="text-sm font-medium">{tiffin.providerName}</Typography>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
                                            {tiffin.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            tiffin.status === 'Approved' ? "bg-green-50 text-green-600 border border-green-100" :
                                                tiffin.status === 'Rejected' ? "bg-red-50 text-red-600 border border-red-100" :
                                                    "bg-amber-50 text-amber-600 border border-amber-100"
                                        )}>
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                tiffin.status === 'Approved' ? "bg-green-500" :
                                                    tiffin.status === 'Rejected' ? "bg-red-500" : "bg-amber-500"
                                            )} />
                                            {tiffin.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-gray-500">
                                        <Typography className="text-xs font-bold">{tiffin.createdAt}</Typography>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity">
                                            {tiffin.status !== 'Approved' && (
                                                <button
                                                    onClick={() => handleStatusChange(tiffin.id, 'Approved')}
                                                    className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-all"
                                                    title="Approve"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                            )}
                                            {tiffin.status !== 'Rejected' && (
                                                <button
                                                    onClick={() => handleStatusChange(tiffin.id, 'Rejected')}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Reject"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(tiffin.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTiffins.length === 0 && (
                        <div className="py-32 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                                <UtensilsCrossed size={40} />
                            </div>
                            <Typography variant="h3" className="font-serif text-gray-400 mb-2">No menu items found</Typography>
                            <Typography className="text-gray-400 max-w-xs mx-auto">There are no tiffins to display currently. This could be because no providers have added items yet.</Typography>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
