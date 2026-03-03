import React, { useState } from "react";
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Pause,
    XCircle,
    Clock,
    Calendar,
    Phone,
    MapPin,
    ChevronRight,
    X,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Typography } from "./ui/Typography";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export const ActiveSubscriptions = () => {
    const [selectedSub, setSelectedSub] = useState(null);

    const subscriptions = [
        {
            id: "SUB-101",
            customer: {
                name: "Aditi Sharma",
                avatar: "https://i.pravatar.cc/150?u=aditi",
                phone: "+91 98765 43210",
                address: "402, Lotus Apartments, Indiranagar, Bangalore"
            },
            plan: "Monthly",
            slot: "Both",
            startDate: "Feb 01, 2026",
            endDate: "Mar 01, 2026",
            status: "Active",
            remainingMeals: 42,
            totalMeals: 60
        },
        {
            id: "SUB-102",
            customer: {
                name: "Rahul Verma",
                avatar: "https://i.pravatar.cc/150?u=rahul",
                phone: "+91 87654 32109",
                address: "12, 5th Cross, Koramangala, Bangalore"
            },
            plan: "Weekly",
            slot: "Lunch",
            startDate: "Feb 12, 2026",
            endDate: "Feb 19, 2026",
            status: "Paused",
            remainingMeals: 4,
            totalMeals: 7
        },
        {
            id: "SUB-103",
            customer: {
                name: "Priya Das",
                avatar: "https://i.pravatar.cc/150?u=priya",
                phone: "+91 76543 21098",
                address: "78, Shanti Layout, Whitefield, Bangalore"
            },
            plan: "Monthly",
            slot: "Dinner",
            startDate: "Jan 15, 2026",
            endDate: "Feb 15, 2026",
            status: "Active",
            remainingMeals: 2,
            totalMeals: 30
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Typography variant="h2" className="font-serif">Active Subscriptions</Typography>
                    <Typography className="text-gray-500">View and manage your current customer plans.</Typography>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input className="pl-10 w-64 h-11" placeholder="Search customers..." />
                    </div>
                    <Button variant="outline" className="h-11">
                        <Filter className="mr-2" size={18} />
                        Filters
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Plan</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Slot</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Timeline</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Meals Left</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {subscriptions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                                                <img src={sub.customer.avatar} alt={sub.customer.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <Typography className="font-bold text-sm leading-none mb-1">{sub.customer.name}</Typography>
                                                <Typography variant="small" className="text-xs text-gray-400">{sub.id}</Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-sm",
                                            sub.plan === 'Monthly' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                                        )}>
                                            {sub.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5 text-gray-600">
                                            <Clock size={14} className="text-gray-400" />
                                            <Typography className="text-sm font-medium">{sub.slot}</Typography>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <Typography className="text-xs font-bold">{sub.startDate}</Typography>
                                            <Typography variant="small" className="text-[10px] text-gray-400 uppercase">to {sub.endDate}</Typography>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            sub.status === 'Active' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", sub.status === 'Active' ? "bg-green-600" : "bg-amber-600")} />
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="w-32 space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                <span>{sub.remainingMeals} / {sub.totalMeals}</span>
                                                <span>{Math.round((sub.remainingMeals / sub.totalMeals) * 100)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-1000",
                                                        (sub.remainingMeals / sub.totalMeals) < 0.2 ? "bg-red-500" : "bg-[var(--primary)]"
                                                    )}
                                                    style={{ width: `${(sub.remainingMeals / sub.totalMeals) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => setSelectedSub(sub)}
                                            className="p-2 text-gray-400 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-all"
                                        >
                                            <Eye size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedSub && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSub(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#F8FAF8] w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
                        >
                            {/* Left Panel - Info */}
                            <div className="w-full md:w-80 bg-white p-8 border-r border-gray-100 space-y-8 shrink-0">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-gray-50 shadow-md mb-4">
                                        <img src={selectedSub.customer.avatar} className="w-full h-full object-cover" />
                                    </div>
                                    <Typography variant="h4" className="font-serif">{selectedSub.customer.name}</Typography>
                                    <Typography variant="small" className="text-gray-400">{selectedSub.id}</Typography>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start">
                                        <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <Typography variant="small" className="font-bold text-gray-500 uppercase tracking-widest">Phone</Typography>
                                            <Typography className="text-sm font-medium">{selectedSub.customer.phone}</Typography>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <Typography variant="small" className="font-bold text-gray-500 uppercase tracking-widest">Address</Typography>
                                            <Typography className="text-sm font-medium leading-relaxed">{selectedSub.customer.address}</Typography>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 space-y-3">
                                    <Button variant="outline" className="w-full border-gray-200">
                                        <Pause size={18} className="mr-2" />
                                        Pause Plan
                                    </Button>
                                    <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50">
                                        <XCircle size={18} className="mr-2" />
                                        Cancel Subscription
                                    </Button>
                                </div>
                            </div>

                            {/* Right Panel - Details */}
                            <div className="flex-1 p-10 overflow-y-auto max-h-[80vh] scrollbar-hide">
                                <div className="flex justify-between items-center mb-10">
                                    <Typography variant="h3" className="font-serif">Subscription Details</Typography>
                                    <button onClick={() => setSelectedSub(null)} className="p-2 hover:bg-white rounded-full transition-colors border border-gray-100 shadow-sm">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-6 mb-10">
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
                                        <Typography variant="small" className="text-gray-400 uppercase font-bold tracking-widest mb-1">Plan Type</Typography>
                                        <Typography className="text-xl font-bold text-[var(--primary)]">{selectedSub.plan}</Typography>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
                                        <Typography variant="small" className="text-gray-400 uppercase font-bold tracking-widest mb-1">Time Slot</Typography>
                                        <Typography className="text-xl font-bold text-blue-600">{selectedSub.slot}</Typography>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
                                        <Typography variant="small" className="text-gray-400 uppercase font-bold tracking-widest mb-1">Expires In</Typography>
                                        <Typography className="text-xl font-bold text-amber-600">12 Days</Typography>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div>
                                        <Typography variant="h4" className="font-serif mb-6">Delivery Timeline</Typography>
                                        <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm">
                                            <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-50">
                                                <div className="flex gap-4">
                                                    <div className="p-3 bg-green-50 rounded-2xl text-green-600">
                                                        <Calendar size={24} />
                                                    </div>
                                                    <div>
                                                        <Typography className="font-bold">Renewal Date</Typography>
                                                        <Typography variant="small" className="text-gray-400">March 01, 2026</Typography>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Typography className="text-xs font-bold text-gray-400 uppercase">Amount Due</Typography>
                                                    <Typography className="text-xl font-bold text-[var(--accent)]">₹3,600</Typography>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20">
                                                        <CheckCircle2 size={20} />
                                                    </div>
                                                    <div className="flex-1 border-b border-dashed border-gray-100 pb-4">
                                                        <Typography className="font-bold text-sm">Today's Delivery</Typography>
                                                        <Typography variant="small" className="text-green-600 font-bold">Successfully Delivered • 1:15 PM</Typography>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border-2 border-white shadow-sm">
                                                        <div className="w-3 h-3 bg-gray-300 rounded-full" />
                                                    </div>
                                                    <div className="flex-1 border-b border-dashed border-gray-100 pb-4">
                                                        <Typography className="font-bold text-sm">Tomorrow's Delivery</Typography>
                                                        <Typography variant="small" className="text-gray-400">Scheduled for Lunch & Dinner</Typography>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 border-2 border-white shadow-sm">
                                                        <Pause size={18} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Typography className="font-bold text-sm">Feb 14 - Feb 16 (Upcoming Pause)</Typography>
                                                        <Typography variant="small" className="text-amber-600 font-bold">Customer requested pause</Typography>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100 flex gap-6">
                                        <AlertCircle className="text-blue-600 shrink-0" />
                                        <div>
                                            <Typography className="font-bold text-blue-900 mb-2">Internal Note</Typography>
                                            <Typography className="text-sm text-blue-800/70 leading-relaxed">
                                                "Customer prefers low spice in Dal and extra rotis on Mondays. Usually leaves thali at the security desk."
                                            </Typography>
                                            <button className="mt-4 text-sm font-bold text-blue-600 hover:underline">Edit Notes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
