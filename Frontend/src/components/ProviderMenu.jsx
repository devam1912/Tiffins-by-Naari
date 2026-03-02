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
                items: day === "Monday" ? [
                    { id: "1", name: "Dal Tadka", type: "Dal", isVeg: true, status: "approved" },
                    { id: "2", name: "Jeera Rice", type: "Rice", isVeg: true, status: "approved" },
                    { id: "3", name: "Palak Paneer", type: "Sabzi", isVeg: true, status: "pending" },
                ] : [],
                price: 150
            },
            dinner: {
                items: day === "Monday" ? [
                    { id: "4", name: "Paneer Butter Masala", type: "Sabzi", isVeg: true, status: "approved" },
                    { id: "5", name: "Tandoori Roti", type: "Bread", isVeg: true, status: "pending" },
                ] : [],
                price: 150
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
            <Card key={item.id} className={cn(
                "border-none shadow-sm hover:shadow-md transition-all group",
                isPending && "ring-1 ring-amber-100",
                item.status === "rejected" && "opacity-60",
            )}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border",
                                isPending ? "bg-amber-50 border-amber-100" : "bg-gray-50 border-gray-100"
                            )}>
                                <UtensilsCrossed size={18} className={isPending ? "text-amber-400" : "text-gray-300"} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Typography className="font-bold text-sm">{item.name}</Typography>
                                    <span className="bg-gray-100 text-[9px] font-bold text-gray-500 px-1.5 py-0.5 rounded uppercase">
                                        {item.type}
                                    </span>
                                    <StatusBadge status={item.status} />
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    <Leaf size={10} className="text-green-600" />
                                    <Typography variant="small" className="text-[10px] text-gray-400">
                                        Pure Veg
                                    </Typography>
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
                                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedDay, mealType, item.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </>
                            )}
                            {isApproved && (
                                <div className="text-green-600 p-1.5" title="Approved items are locked">
                                    <ShieldCheck size={16} />
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    {/* Day Tabs */}
                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar">
                        {DAYS.map((day) => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={cn(
                                    "flex-1 min-w-[100px] py-3 text-sm font-bold rounded-xl transition-all",
                                    selectedDay === day
                                        ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                                        : "text-gray-500 hover:bg-gray-50"
                                )}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Lunch Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                                        <CircleDot size={20} />
                                    </div>
                                    <Typography variant="h4" className="font-serif">Lunch Menu</Typography>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-primary font-bold h-8 hover:bg-primary/10"
                                    onClick={() => {
                                        setEditingItem({ day: selectedDay, mealType: "lunch" });
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <Plus size={16} className="mr-1" /> Add
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {currentDayData.lunch.items.map((item) => renderMenuItemCard(item, "lunch"))}
                                {currentDayData.lunch.items.length === 0 && (
                                    <div className="py-10 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                                        <Typography className="text-gray-400 text-sm italic">Empty for Lunch</Typography>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dinner Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                        <CircleDot size={20} />
                                    </div>
                                    <Typography variant="h4" className="font-serif">Dinner Menu</Typography>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-primary font-bold h-8 hover:bg-primary/10"
                                    onClick={() => {
                                        setEditingItem({ day: selectedDay, mealType: "dinner" });
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <Plus size={16} className="mr-1" /> Add
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {currentDayData.dinner.items.map((item) => renderMenuItemCard(item, "dinner"))}
                                {currentDayData.dinner.items.length === 0 && (
                                    <div className="py-10 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                                        <Typography className="text-gray-400 text-sm italic">Empty for Dinner</Typography>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-28 space-y-6">
                        <Card className="border-none shadow-sm overflow-hidden bg-white">
                            <div className="bg-primary p-4 text-white flex items-center gap-2">
                                <Eye size={18} />
                                <Typography className="!text-white font-bold text-sm">Subscriber View</Typography>
                            </div>
                            <CardContent className="p-6">
                                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <Typography className="font-bold text-sm">{selectedDay}'s Menu</Typography>
                                        <Leaf size={16} className="text-green-600" />
                                    </div>

                                    <div className="space-y-3">
                                        {currentDayData.lunch.items
                                            .filter(item => item.status === "approved")
                                            .map((item, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    <Typography className="text-xs">{item.name}</Typography>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-col gap-2">
                                    <Typography variant="small" className="text-gray-400 text-center text-[10px]">Tiffin Price</Typography>
                                    <div className="relative">
                                        <Input className="pl-8 font-bold text-center bg-gray-50" value={currentDayData.lunch.price} readOnly />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex gap-4">
                            <ShieldCheck className="text-blue-600 shrink-0" size={20} />
                            <div>
                                <Typography className="text-xs font-bold text-blue-900 mb-1">Provider Notice</Typography>
                                <Typography variant="small" className="text-[10px] text-blue-800/70 leading-relaxed">
                                    Only veg items are allowed. Admin approval is required for all new submissions.
                                </Typography>
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
                            className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <Typography variant="h3" className="font-serif text-xl">{editingItem?.item ? "Edit Item" : "New Menu Item"}</Typography>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-5 text-left">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Item Name</label>
                                    <Input placeholder="e.g. Paneer Bhurji" defaultValue={editingItem?.item?.name} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Type</label>
                                        <select
                                            className="w-full h-11 bg-gray-50 border-none rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all"
                                            defaultValue={editingItem?.item?.type || "Sabzi"}
                                        >
                                            <option>Dal</option>
                                            <option>Sabzi</option>
                                            <option>Rice</option>
                                            <option>Bread</option>
                                            <option>Dessert</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Dietary</label>
                                        <div className="h-11 bg-green-50 rounded-xl px-4 flex items-center gap-2 border border-green-100">
                                            <Leaf size={14} className="text-green-600" />
                                            <span className="text-xs font-bold text-green-700">Veg Only</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button className="flex-1" onClick={() => {
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
