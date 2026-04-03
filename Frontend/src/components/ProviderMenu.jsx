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
import { useSelector } from "react-redux";
import api from "../services/api";
import { useEffect } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const ProviderMenu = () => {
    const { profile } = useSelector((state) => state.provider);

    // 1. All State Hooks first
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isMenuPublished, setIsMenuPublished] = useState(false);
    const [isMenuApproved, setIsMenuApproved] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [rejectionRemark, setRejectionRemark] = useState("");
    const [selectedDay, setSelectedDay] = useState("Monday");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Initial empty state
    const initialMenu = DAYS.map(day => ({
        day,
        lunch: { items: [], price: 0 },
        dinner: { items: [], price: 0 }
    }));

    const [weekMenu, setWeekMenu] = useState(initialMenu);

    // 2. Derived Data (Must come AFTER state declarations)
    const currentDayData = weekMenu.find(d => d.day === selectedDay) || {
        lunch: { items: [], price: 0 },
        dinner: { items: [], price: 0 }
    };

    // 3. Effects
    useEffect(() => {
        if (!profile?._id) return;

        const loadMenu = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/tiffins/${profile._id}/menu`);
                if (res.data) {
                    setWeekMenu(res.data.weekMenu || initialMenu);
                    setIsMenuPublished(res.data.isPublished);
                    setIsMenuApproved(res.data.isApproved);
                    setIsSubmitted(res.data.submittedForApproval);
                    setRejectionRemark(res.data.rejectionRemark || "");
                }
            } catch (err) {
                if (err.response?.status !== 404) {
                    console.error("Error loading menu:", err);
                    toast.error("Failed to load menu");
                }
            } finally {
                setLoading(false);
            }
        };

        loadMenu();
    }, [profile?._id]);

    // 4. Handlers
    const handleSaveMenu = async () => {
        if (!profile?._id) return;
        try {
            setSaving(true);
            await api.post("/api/tiffins/menu", { weekMenu });
            toast.success("Menu saved successfully");
            // Allow resubmission after saving changes
            setIsSubmitted(false);
        } catch (err) {
            console.error("Error saving menu:", err);
            toast.error(err.response?.data?.message || "Failed to save menu");
        } finally {
            setSaving(false);
        }
    };

    const handleSubmitForApproval = async () => {
        // 🔒 Validation: Must have at least one meal for the first 5 days (Mon-Fri)
        const firstFiveDays = DAYS.slice(0, 5);
        const incompleteDays = firstFiveDays.filter(dayName => {
            const dayData = weekMenu.find(d => d.day === dayName);
            const hasLunch = dayData?.lunch?.items?.length > 0;
            const hasDinner = dayData?.dinner?.items?.length > 0;
            return !hasLunch && !hasDinner;
        });

        if (incompleteDays.length > 0) {
            toast.error(
                `Submission Blocked: Please add at least one meal for ${incompleteDays.join(", ")}.`,
                { description: "Approvals require a minimum 5-day meal plan." }
            );
            return;
        }

        try {
            setSaving(true);
            await api.patch("/api/tiffins/menu/submit");
            setIsSubmitted(true);
            setRejectionRemark(""); // Clear remark on resubmit
            toast.success("Menu submitted for admin approval");
        } catch (err) {
            console.error("Error submitting menu:", err);
            toast.error(err.response?.data?.message || "Failed to submit menu");
        } finally {
            setSaving(false);
        }
    };

    const handlePriceChange = (mealType, value) => {
        const price = value === "" ? 0 : Math.max(0, Number(value));
        setWeekMenu(prev => prev.map(day => {
            if (day.day !== selectedDay) return day;
            return {
                ...day,
                [mealType]: { ...day[mealType], price }
            };
        }));
        setIsSubmitted(false);
    };

    const handleDelete = (dayName, mealType, itemId) => {
        setWeekMenu(prev => prev.map(day => {
            if (day.day !== dayName) return day;
            return {
                ...day,
                [mealType]: {
                    ...day[mealType],
                    items: day[mealType].items.filter(i => (i._id || i.id) !== itemId)
                }
            };
        }));
        toast.success("Item Removed locally (Click Save to update)");
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
            <div key={item._id || item.id} className={cn(
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
                                    {(isMenuPublished || isMenuApproved || isSubmitted) && <StatusBadge status={isMenuApproved ? "approved" : (isSubmitted ? "pending" : "pending")} />}
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
                            {!isMenuApproved && (
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
                                        onClick={() => handleDelete(selectedDay, mealType, item._id || item.id)}
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </>
                            )}
                            {isMenuApproved && (
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
            {rejectionRemark && (
                <div className="stat-card bg-red-50 border-red-200 border p-4 mb-6 flex items-start gap-3 shadow-sm animate-in slide-in-from-top-4 duration-500">
                    <Ban className="text-red-500 shrink-0 mt-0.5" size={18} />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Menu Rejected by Admin</p>
                        <p className="text-sm font-bold text-red-800 m-0">"{rejectionRemark}"</p>
                        <p className="text-[11px] text-red-600/70 mt-1">Please update your menu and resubmit for approval.</p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-8">
                <h2 className="admin-title m-0">Menu Management</h2>
                <div className="flex gap-4">
                    <Button
                        onClick={handleSaveMenu}
                        disabled={saving || loading}
                        className="bg-white/60 text-[#5a7a50] border-[1.5px] border-[#8FA873] hover:bg-white font-black rounded-2xl px-8 h-12 uppercase tracking-widest shadow-sm"
                    >
                        {saving ? "Saving..." : "Save Menu"}
                    </Button>
                    <Button
                        onClick={handleSubmitForApproval}
                        disabled={saving || loading || isMenuApproved}
                        className={cn(
                            "font-black rounded-2xl px-8 h-12 uppercase tracking-widest shadow-md transition-all",
                            isMenuApproved
                                ? "bg-green-100 text-green-700 border border-green-200 cursor-default"
                                : isSubmitted && !rejectionRemark
                                    ? "bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200"
                                    : "bg-[#8FA873] hover:bg-[#6b8a5e] text-white shadow-[#8FA873]/20"
                        )}
                    >
                        {isMenuApproved
                            ? "Published"
                            : (isSubmitted && !rejectionRemark)
                                ? "Pending Approval"
                                : rejectionRemark
                                    ? "Resubmit Menu"
                                    : "Publish Menu"}
                    </Button>
                </div>
            </div>

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

                            <div className="mb-4 flex items-center gap-3 bg-white/40 p-3 rounded-2xl border border-[rgba(143,174,142,0.2)]">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#5a7a50] ml-1">Lunch Price (₹)</span>
                                <Input
                                    type="number"
                                    min="0"
                                    value={currentDayData.lunch.price || ""}
                                    onChange={(e) => handlePriceChange("lunch", e.target.value)}
                                    placeholder="0"
                                    className="w-24 h-9 bg-white/80 border-[#8FA873]/30 font-black text-center text-[#2d3b2d] rounded-xl focus-visible:ring-[#8FA873]"
                                />
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    <div className="py-12 flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#8FA873]/20 border-t-[#8FA873] rounded-full animate-spin" /></div>
                                ) : (
                                    <>
                                        {currentDayData.lunch.items.map((item) => renderMenuItemCard(item, "lunch"))}
                                        {currentDayData.lunch.items.length === 0 && (
                                            <div className="py-12 flex flex-col items-center gap-2 text-center bg-white/40 rounded-[24px] border-2 border-dashed border-[rgba(143,174,142,0.3)] inset-shadow-sm">
                                                <p className="text-[#5a7a50] font-black tracking-widest uppercase text-xs m-0 opacity-60">Empty for Lunch</p>
                                            </div>
                                        )}
                                    </>
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

                            <div className="mb-4 flex items-center gap-3 bg-white/40 p-3 rounded-2xl border border-[rgba(143,174,142,0.2)]">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#5a7a50] ml-1">Dinner Price (₹)</span>
                                <Input
                                    type="number"
                                    min="0"
                                    value={currentDayData.dinner.price || ""}
                                    onChange={(e) => handlePriceChange("dinner", e.target.value)}
                                    placeholder="0"
                                    className="w-24 h-9 bg-white/80 border-[#8FA873]/30 font-black text-center text-[#2d3b2d] rounded-xl focus-visible:ring-[#8FA873]"
                                />
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    <div className="py-12 flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#8FA873]/20 border-t-[#8FA873] rounded-full animate-spin" /></div>
                                ) : (
                                    <>
                                        {currentDayData.dinner.items.map((item) => renderMenuItemCard(item, "dinner"))}
                                        {currentDayData.dinner.items.length === 0 && (
                                            <div className="py-12 flex flex-col items-center gap-2 text-center bg-white/40 rounded-[24px] border-2 border-dashed border-[rgba(143,174,142,0.3)] inset-shadow-sm">
                                                <p className="text-[#5a7a50] font-black tracking-widest uppercase text-xs m-0 opacity-60">Empty for Dinner</p>
                                            </div>
                                        )}
                                    </>
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
                                            .map((item, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#8FA873] shadow-sm" />
                                                    <span className="text-xs font-bold text-[#5a7a50]">{item.name}</span>
                                                </div>
                                            ))}
                                        {currentDayData.dinner.items
                                            .map((item, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] shadow-sm" />
                                                    <span className="text-xs font-bold text-[#2d3b2d]">{item.name} (Dinner)</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <p className="font-black text-center text-[9px] uppercase tracking-widest text-[#5a7a50] m-0">Lunch Price</p>
                                        <div className="relative shadow-sm rounded-xl overflow-hidden border-[1.5px] border-[rgba(143,174,142,0.3)] bg-white/80 p-0">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA873] font-black text-xs">₹</span>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={currentDayData.lunch.price || ""}
                                                onChange={(e) => handlePriceChange("lunch", e.target.value)}
                                                className="pl-8 h-9 border-none bg-transparent font-black text-center text-[#2d3b2d] focus-visible:ring-0"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <p className="font-black text-center text-[9px] uppercase tracking-widest text-[#5a7a50] m-0">Dinner Price</p>
                                        <div className="relative shadow-sm rounded-xl overflow-hidden border-[1.5px] border-[rgba(143,174,142,0.3)] bg-white/80 p-0">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA873] font-black text-xs">₹</span>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={currentDayData.dinner.price || ""}
                                                onChange={(e) => handlePriceChange("dinner", e.target.value)}
                                                className="pl-8 h-9 border-none bg-transparent font-black text-center text-[#2d3b2d] focus-visible:ring-0"
                                            />
                                        </div>
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
                                        const modalEl = document.querySelector('.relative.bg-\\[\\#E7E6B6\\]');
                                        const nameInput = modalEl.querySelector('input');
                                        const typeSelect = modalEl.querySelector('select');

                                        const name = nameInput.value;
                                        const type = typeSelect.value;

                                        if (!name) return toast.error("Item name required");

                                        setWeekMenu(prev => prev.map(day => {
                                            if (day.day !== selectedDay) return day;
                                            const mealData = day[editingItem.mealType];
                                            let newItems;

                                            if (editingItem.item) {
                                                // Edit existing
                                                newItems = mealData.items.map(i => (i._id || i.id) === (editingItem.item._id || editingItem.item.id) ? { ...i, name, type } : i);
                                            } else {
                                                // Add new
                                                newItems = [...mealData.items, { id: Date.now().toString(), name, type, status: 'pending' }];
                                            }

                                            return {
                                                ...day,
                                                [editingItem.mealType]: { ...mealData, items: newItems }
                                            };
                                        }));

                                        toast.success(editingItem.item ? "Item Updated" : "Item Added");
                                        setIsModalOpen(false);
                                    }}>
                                        {editingItem?.item ? "Update Item" : "Add Item"}
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
