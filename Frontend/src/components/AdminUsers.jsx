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
export const AdminUsers = ({ users = [] }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter(
        (user) =>
            (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 style={{ fontFamily: "'Lora', serif", fontSize: 32, fontWeight: 700, color: "#2d3b2d" }}>User Management</h2>
                    <Typography className="text-gray-500 mt-1">Manage and monitor all registered platform users.</Typography>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            className="pl-10 w-64 h-11 bg-white border-gray-100 focus:border-[var(--primary)] transition-all"
                            placeholder="Search users..."
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
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">User Details</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined Date</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-400 shadow-sm border border-white">
                                                <UserIcon size={20} />
                                            </div>
                                            <div>
                                                <Typography className="font-bold text-sm leading-none mb-1.5">{user.name}</Typography>
                                                <Typography variant="small" className="text-[10px] text-gray-400 font-medium">{user.email}</Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border",
                                            user.role === 'provider' ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                        )}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                "bg-green-50 text-green-600 border border-green-100"
                                            )}>
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    "bg-green-500"
                                                )} />
                                                Active
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
                                            <button className="p-2 text-gray-400 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-xl transition-all">
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <Search size={32} />
                            </div>
                            <Typography className="text-gray-400 font-medium">No users found matching your search.</Typography>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
