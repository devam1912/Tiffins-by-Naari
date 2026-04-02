import React, { useState } from "react";
import {
    Plus,
    Trash2,
    Edit3,
    CheckCircle2,
    X,
    CircleDot,
    Leaf,
    UtensilsCrossed,
    Clock,
    Ban,
    ShieldCheck,
    Eye
} from "lucide-react";
import { Typography } from "./ui/Typography";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { toast } from "sonner";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const ProviderMenu = () => {
    const [selectedDay, setSelectedDay] = useState("Monday");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Backend-aligned structure: array of daily objects
    const [weekMenu, setWeekMenu] = useState(
        DAYS.map(day => ({
            day,
            lunch: {
                items: [], // NO STATIC MOCK DATA
                price: 0
            },
            dinner: {
                items: [], // NO STATIC MOCK DATA
                price: 0
            }
        }))
    );

    const currentDayData = weekMenu.find(d => d.day === selectedDay) || { lunch: { items: [], price: 0 }, dinner: { items: [], price: 0 } };

    const handleDelete = (dayName, mealType, itemId) => {
        setWeekMenu(prev => prev.map(day => {
            if (day.day !== dayName) return day;
            return {
                ...day,
                [mealType]: {
                    ...day[mealType],
                    items: day[mealType].items.filter(i => i.id !== itemId)
                }
            };
        }));
        toast.success("Item Removed");
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            pending: "bg-amber-50 text-amber-700 border-amber-200",
            approved: "bg-green-50 text-green-700 border-green-200",
            rejected: "bg-red-50 text-red-700 border-red-200",
        };
        const icons = {
            pending: <Clock size={10} />,
            approved: <CheckCircle2 size={10} />,
            rejected: <Ban size={10} />,
        };
        const labels = {
            pending: "Pending",
            approved: "Approved",
            rejected: "Rejected",
        };
        return (
            <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider", styles[status])}>
                {icons[status]}
                {labels[status]}
            </span>
        );
    };

    const renderMenuItemCard = (item, mealType) => {
        const isApproved = item.status === "approved";
        const isPending = item.status === "pending";

        return (
            <div key={item.id} className={cn(
                "stat-card transition-all group overflow-hidden border-[1.5px] border-[rgba(143,174,142,0.3)] bg-white/60",
                isPending && "ring-2 ring-orange-200 border-orange-200",
                item.status === "rejected" && "opacity-60",
            )}>
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner",
                                isPending ? "bg-amber-50" : "bg-white/80"
                            )}>
                                <UtensilsCrossed size={18} className={isPending ? "text-amber-500" : "text-[#8FA873]"} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <p className="font-black text-sm text-[#2d3b2d] m-0 leading-none">{item.name}</p>
                                    <span className="bg-[#8FAE8E]/20 text-[9px] font-black text-[#5a7a50] px-2 py-0.5 rounded-full uppercase border border-[#8FAE8E]/30 tracking-widest shadow-sm">
                                        {item.type}
                                    </span>
                                    <StatusBadge status={item.status} />
                                </div>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm" />
                                    <p className="text-[10px] font-bold text-[#5a7a50] uppercase tracking-widest m-0">
                                        Pure Veg
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!isApproved && (
                                <>
                                    <button
                                        onClick={() => {
                                            setEditingItem({ day: selectedDay, mealType, item });
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 text-[#5a7a50] hover:text-[#2d3b2d] hover:bg-white rounded-xl transition-all shadow-sm"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedDay, mealType, item.id)}
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </>
                            )}
                            {isApproved && (
                                <div className="text-[#5a7a50] p-2 bg-white/60 rounded-xl shadow-sm border border-[rgba(143,174,142,0.2)]" title="Approved items are locked">
                                    <ShieldCheck size={16} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 pb-10 mt-2">
            <h2 className="admin-title mb-8">Menu Management</h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    {/* Day Tabs */}
                    <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-[20px] shadow-[0_4px_16px_rgba(90,120,70,0.08)] border border-[rgba(143,174,142,0.3)] overflow-x-auto no-scrollbar">
                        {DAYS.map((day) => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={cn(
                                    "flex-1 min-w-[100px] py-3 text-xs uppercase tracking-widest font-black rounded-2xl transition-all shadow-sm",
                                    selectedDay === day
                                        ? "bg-[#8FA873] text-white shadow-md shadow-[#8FA873]/30"
                                        : "text-[#5a7a50] hover:bg-white/60"
                                )}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Lunch Section */}
                        <div className="stat-card p-6 border-[1.5px] border-[rgba(143,174,142,0.3)]">
                            <div className="flex items-center justify-between mb-8 border-b border-[rgba(143,174,142,0.2)] pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/80 rounded-2xl flex items-center justify-center text-[#f59e0b] shadow-inner">
                                        <CircleDot size={20} />
                                    </div>
                                    <h4 className="text-2xl font-black text-[#2d3b2d] m-0" style={{ fontFamily: "Lora, serif" }}>Lunch Menu</h4>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-[#8FA873] border-[#8FA873] font-black h-9 hover:bg-[#8FAE8E]/10 rounded-xl px-4 uppercase tracking-wider text-[10px] shadow-sm"
                                    onClick={() => {
                                        setEditingItem({ day: selectedDay, mealType: "lunch" });
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <Plus size={14} className="mr-1" /> Add
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {currentDayData.lunch.items.map((item) => renderMenuItemCard(item, "lunch"))}
                                {currentDayData.lunch.items.length === 0 && (
                                    <div className="py-12 flex flex-col items-center gap-2 text-center bg-white/40 rounded-[24px] border-2 border-dashed border-[rgba(143,174,142,0.3)] inset-shadow-sm">
                                        <p className="text-[#5a7a50] font-black tracking-widest uppercase text-xs m-0 opacity-60">Empty for Lunch</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dinner Section */}
                        <div className="stat-card p-6 border-[1.5px] border-[rgba(143,174,142,0.3)]">
                            <div className="flex items-center justify-between mb-8 border-b border-[rgba(143,174,142,0.2)] pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/80 rounded-2xl flex items-center justify-center text-[#3b82f6] shadow-inner">
                                        <CircleDot size={20} />
                                    </div>
                                    <h4 className="text-2xl font-black text-[#2d3b2d] m-0" style={{ fontFamily: "Lora, serif" }}>Dinner Menu</h4>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-[#8FA873] border-[#8FA873] font-black h-9 hover:bg-[#8FAE8E]/10 rounded-xl px-4 uppercase tracking-wider text-[10px] shadow-sm"
                                    onClick={() => {
                                        setEditingItem({ day: selectedDay, mealType: "dinner" });
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <Plus size={14} className="mr-1" /> Add
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {currentDayData.dinner.items.map((item) => renderMenuItemCard(item, "dinner"))}
                                {currentDayData.dinner.items.length === 0 && (
                                    <div className="py-12 flex flex-col items-center gap-2 text-center bg-white/40 rounded-[24px] border-2 border-dashed border-[rgba(143,174,142,0.3)] inset-shadow-sm">
                                        <p className="text-[#5a7a50] font-black tracking-widest uppercase text-xs m-0 opacity-60">Empty for Dinner</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-28 space-y-6">
                        <div className="stat-card overflow-hidden bg-white/60 border-[1.5px] border-[rgba(143,174,142,0.3)]">
                            <div className="bg-[#8FA873] p-4 text-white flex items-center gap-2 shadow-inner">
                                <Eye size={18} />
                                <span className="font-bold text-sm tracking-wide uppercase">Subscriber View</span>
                            </div>
                            <div className="p-6">
                                <div className="bg-white/80 rounded-2xl p-5 border-[1.5px] border-[rgba(143,174,142,0.2)] space-y-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-black text-[#2d3b2d] m-0 text-sm uppercase tracking-wider">{selectedDay}'s Menu</p>
                                        <Leaf size={16} className="text-[#8FA873]" />
                                    </div>

                                    <div className="space-y-2.5">
                                        {currentDayData.lunch.items
                                            .filter(item => item.status === "approved")
                                            .map((item, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#8FA873] shadow-sm" />
                                                    <span className="text-xs font-bold text-[#5a7a50]">{item.name}</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-col gap-2">
                                    <p className="font-black text-center text-[10px] uppercase tracking-widest text-[#5a7a50] m-0">Tiffin Price</p>
                                    <div className="relative shadow-sm rounded-xl overflow-hidden border-[1.5px] border-[rgba(143,174,142,0.3)]">
                                        <Input className="pl-10 font-black text-center bg-white/80 h-10 text-[#2d3b2d] border-none focus-visible:ring-0" value={currentDayData.lunch.price} readOnly />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8FA873] font-black">₹</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card bg-[#8FAE8E]/10 p-5 border-[1.5px] border-[#8FAE8E]/30 flex gap-4 backdrop-blur-sm">
                            <ShieldCheck className="text-[#5a7a50] shrink-0" size={20} />
                            <div>
                                <p className="text-xs font-black text-[#2d3b2d] uppercase tracking-widest m-0 mb-1.5">Provider Notice</p>
                                <p className="text-[11px] font-bold text-[#5a7a50] leading-relaxed m-0 opacity-80">
                                    Only veg items are allowed. Admin approval is required for all new submissions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal placeholder */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative bg-[#E7E6B6] w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl p-8 border-[1.5px] border-[rgba(143,174,142,0.2)]"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-[#2d3b2d] m-0" style={{ fontFamily: "Lora, serif" }}>{editingItem?.item ? "Edit Item" : "New Menu Item"}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/60 rounded-full transition-colors shadow-sm bg-white/40 text-[#5a7a50]">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6 text-left">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-[#5a7a50] ml-1">Item Name</label>
                                    <Input className="bg-white/60 border-[1.5px] border-[rgba(143,174,142,0.3)] shadow-sm rounded-2xl h-12 text-[#2d3b2d] font-bold px-4 focus-visible:ring-[#8FA873]" placeholder="e.g. Paneer Bhurji" defaultValue={editingItem?.item?.name} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-[#5a7a50] ml-1">Type</label>
                                        <select
                                            className="w-full h-12 bg-white/60 border-[1.5px] border-[rgba(143,174,142,0.3)] shadow-sm rounded-2xl px-4 text-sm font-bold text-[#2d3b2d] outline-none focus:ring-2 focus:ring-[#8FA873]/40 appearance-none transition-all"
                                            defaultValue={editingItem?.item?.type || "Sabzi"}
                                        >
                                            <option>Dal</option>
                                            <option>Sabzi</option>
                                            <option>Rice</option>
                                            <option>Bread</option>
                                            <option>Dessert</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-[#5a7a50] ml-1">Dietary</label>
                                        <div className="h-12 bg-emerald-50/80 rounded-2xl px-4 flex items-center gap-2 border-[1.5px] border-emerald-200/60 shadow-inner">
                                            <Leaf size={14} className="text-emerald-600" />
                                            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700">Veg Only</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6 mt-4 border-t border-[rgba(143,174,142,0.2)]">
                                    <Button variant="outline" className="flex-1 h-12 rounded-2xl border-[#8FA873] text-[#5a7a50] hover:bg-white font-bold bg-white/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button className="flex-1 h-12 rounded-2xl shadow-md bg-[#8FA873] hover:bg-[#6b8a5e] text-white font-bold" onClick={() => {
                                        toast.success("Submitted for Approval");
                                        setIsModalOpen(false);
                                    }}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
