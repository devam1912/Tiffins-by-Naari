import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit3, CheckCircle2, X, CircleDot, Leaf, UtensilsCrossed, Clock, Ban, ShieldCheck, Eye, Send } from "lucide-react";
import { useSelector } from "react-redux";
import API from "../api/auth";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const EMPTY_DAY = () => ({ lunch: { items: [], price: 0 }, dinner: { items: [], price: 0 } });

const buildWeekMenu = (serverWeekMenu = []) => {
    return DAYS.map(day => {
        const found = serverWeekMenu.find(d => d.day === day);
        return found ? { day, lunch: found.lunch || EMPTY_DAY().lunch, dinner: found.dinner || EMPTY_DAY().dinner } : { day, ...EMPTY_DAY() };
    });
};

export const ProviderMenu = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { menu, loading } = useSelector((state) => state.provider);

    const [selectedDay, setSelectedDay] = useState("Monday");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [weekMenu, setWeekMenu] = useState(DAYS.map(day => ({ day, ...EMPTY_DAY() })));
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const nameRef = useRef();
    const typeRef = useRef();
    const priceRef = useRef();

    useEffect(() => {
        if (user) {
            dispatch(fetchProviderMenu(user.id || user._id));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (menu?.weekMenu) {
            setWeekMenu(buildWeekMenu(menu.weekMenu));
        }
    }, [menu]);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const currentDayData = weekMenu.find(d => d.day === selectedDay) || { ...EMPTY_DAY() };

    const handleSaveMenu = async () => {
        setIsSaving(true);
        try {
            await dispatch(saveMenu(weekMenu)).unwrap();
            showToast("Menu saved successfully!");
        } catch (err) {
            showToast(err || "Save failed.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmitForApproval = async () => {
        if (!window.confirm("Submit this menu for admin approval?")) return;
        setIsSubmitting(true);
        try {
            await dispatch(submitMenuForApproval()).unwrap();
            showToast("Submitted for admin approval!");
        } catch (err) {
            showToast(err || "Submission failed.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (dayName, mealType, itemId) => {
        setWeekMenu(prev => prev.map(d => {
            if (d.day !== dayName) return d;
            return {
                ...d,
                [mealType]: {
                    ...d[mealType],
                    items: d[mealType].items.filter(i => (i.id || i._id) !== itemId)
                }
            };
        }));
        showToast("Item removed locally — save to sync", "info");
    };

    const handleMealPriceChange = (dayName, mealType, newPrice) => {
        const val = parseFloat(newPrice) || 0;
        setWeekMenu(prev => prev.map(d => {
            if (d.day !== dayName) return d;
            return { ...d, [mealType]: { ...d[mealType], price: val } };
        }));
    };

    const handleSaveItem = () => {
        const name = nameRef.current?.value?.trim();
        const type = typeRef.current?.value || "Sabzi";
        const price = parseFloat(priceRef.current?.value) || 0;
        if (!name) return;

        const { day, mealType, item } = editingItem;
        setWeekMenu(prev => prev.map(d => {
            if (d.day !== day) return d;
            const meal = d[mealType];
            let newItems;
            if (item) {
                const itemId = item.id || item._id;
                newItems = meal.items.map(i => (i.id || i._id) === itemId ? { ...i, name, type, price } : i);
            } else {
                newItems = [...meal.items, { id: Date.now().toString(), name, type, price, status: "pending" }];
            }
            return { ...d, [mealType]: { ...meal, items: newItems } };
        }));
        showToast(item ? "Item updated locally" : "Item added locally — save to sync");
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const menuStatus = {
        isApproved: menu?.isApproved || false,
        submittedForApproval: menu?.submittedForApproval || false
    };

    const StatusBadge = ({ status }) => {
        const map = {
            pending: { cls: "background:#fef9e6;color:#b45309;border:1px solid #fde68a", label: "Pending", Icon: Clock },
            approved: { cls: "background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0", label: "Approved", Icon: CheckCircle2 },
            rejected: { cls: "background:#fff1f2;color:#be123c;border:1px solid #fecdd3", label: "Rejected", Icon: Ban },
        };
        const { cls, label, Icon } = map[status] || map.pending;
        return (
            <span style={{ ...Object.fromEntries(cls.split(";").filter(Boolean).map(s => { const [k, v] = s.split(":"); return [k.trim(), v.trim()]; })), display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 100, textTransform: "uppercase" }}>
                <Icon size={9} />{label}
            </span>
        );
    };

    const renderMenuItemCard = (item, mealType) => {
        const isApproved = item.status === "approved";
        return (
            <div key={item.id || item._id} style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: item.status === "pending" ? "#fffbeb" : "#f9fafb", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <UtensilsCrossed size={16} color={item.status === "pending" ? "#f59e0b" : "#d1d5db"} />
                    </div>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 700, fontSize: 14, color: "#2d3b2d" }}>{item.name}</span>
                            <span style={{ background: "#f3f4f6", color: "#6b7280", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 6, textTransform: "uppercase" }}>{item.type}</span>
                            <span style={{ fontSize: 11, fontWeight: 800, color: "#8FAE8E" }}>₹{item.price || 0}</span>
                            <StatusBadge status={item.status} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                            <Leaf size={10} color="#16a34a" />
                            <span style={{ fontSize: 10, color: "#9ca3af" }}>Pure Veg</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                    {!isApproved && (
                        <>
                            <button onClick={() => { setEditingItem({ day: selectedDay, mealType, item }); setIsModalOpen(true); }}
                                style={{ padding: 8, border: "none", background: "none", cursor: "pointer", borderRadius: 8, color: "#9ca3af" }}>
                                <Edit3 size={16} />
                            </button>
                            <button onClick={() => handleDelete(selectedDay, mealType, item.id)}
                                style={{ padding: 8, border: "none", background: "none", cursor: "pointer", borderRadius: 8, color: "#9ca3af" }}>
                                <Trash2 size={16} />
                            </button>
                        </>
                    )}
                    {isApproved && <div style={{ padding: 8, color: "#16a34a" }}><ShieldCheck size={16} /></div>}
                </div>
            </div>
        );
    };

    if (loading) return (
        <div style={{ padding: 80, textAlign: "center", color: "#8FAE8E", fontWeight: 700 }}>Loading your menu...</div>
    );

    return (
        <div style={{ paddingBottom: 40, fontFamily: "'Nunito', sans-serif", position: "relative" }}>

            {/* Toast */}
            {toast && (
                <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "14px 24px", borderRadius: 14, fontWeight: 700, fontSize: 14, background: toast.type === "error" ? "#ef5350" : toast.type === "info" ? "#5c6bc0" : "#8FAE8E", color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
                    {toast.msg}
                </div>
            )}

            {/* Header actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                    <h2 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: "#2d3b2d", margin: 0 }}>Menu Manager</h2>
                    <p style={{ fontSize: 13, color: "#999", marginTop: 4 }}>
                        {menuStatus.isApproved ? "✅ Menu is approved & live" : menuStatus.submittedForApproval ? "⏳ Awaiting admin approval" : "Draft — save and submit for approval"}
                    </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={handleSaveMenu} disabled={isSaving}
                        style={{ padding: "11px 22px", borderRadius: 12, border: "none", background: "#2d3b2d", color: "#fff", fontWeight: 800, fontSize: 14, cursor: isSaving ? "not-allowed" : "pointer" }}>
                        {isSaving ? "Saving..." : "💾 Save Menu"}
                    </button>
                    {!menuStatus.isApproved && (
                        <button onClick={handleSubmitForApproval} disabled={isSubmitting}
                            style={{ padding: "11px 22px", borderRadius: 12, border: "none", background: "#8FAE8E", color: "#fff", fontWeight: 800, fontSize: 14, cursor: isSubmitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                            <Send size={14} /> {isSubmitting ? "Submitting..." : "Submit for Approval"}
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 28 }}>
                <div>
                    {/* Day Tabs — FIXED: explicit colors, always readable */}
                    <div style={{ display: "flex", background: "#fff", padding: 6, borderRadius: 18, border: "1px solid #f0f0f0", overflowX: "auto", gap: 4, marginBottom: 28 }}>
                        {DAYS.map(day => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                style={{
                                    flex: "1 1 0", minWidth: 90, padding: "10px 8px",
                                    borderRadius: 12, border: "none", cursor: "pointer",
                                    fontWeight: 800, fontSize: 13, transition: "all 0.2s",
                                    background: selectedDay === day ? "#5a7a50" : "transparent",
                                    color: selectedDay === day ? "#ffffff" : "#4b5563",
                                    boxShadow: selectedDay === day ? "0 4px 14px rgba(90,122,80,0.3)" : "none",
                                }}
                                onMouseEnter={e => { if (selectedDay !== day) { e.target.style.background = "#f0f4f0"; e.target.style.color = "#2d3b2d"; } }}
                                onMouseLeave={e => { if (selectedDay !== day) { e.target.style.background = "transparent"; e.target.style.color = "#4b5563"; } }}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                        {/* Lunch */}
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center" }}><CircleDot size={18} color="#f59e0b" /></div>
                                    <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 18, color: "#2d3b2d" }}>Lunch</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                        <span style={{ position: "absolute", left: 8, fontSize: 11, fontWeight: 800, color: "#9ca3af" }}>₹</span>
                                        <input
                                            type="number"
                                            value={currentDayData.lunch.price || ""}
                                            onChange={(e) => handleMealPriceChange(selectedDay, "lunch", e.target.value)}
                                            placeholder="Tiffin Price"
                                            style={{ width: 70, padding: "6px 8px 6px 18px", border: "1px solid #f0f0f0", borderRadius: 10, fontSize: 12, fontWeight: 800, outline: "none" }}
                                        />
                                    </div>
                                    <button onClick={() => { setEditingItem({ day: selectedDay, mealType: "lunch" }); setIsModalOpen(true); }}
                                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", border: "none", background: "none", color: "#8FAE8E", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>
                                        <Plus size={15} /> Add
                                    </button>
                                </div>
                            </div>
                            {currentDayData.lunch.items.map(item => renderMenuItemCard(item, "lunch"))}
                            {currentDayData.lunch.items.length === 0 && (
                                <div style={{ padding: "40px 0", textAlign: "center", background: "#fafafa", borderRadius: 14, border: "2px dashed #e5e7eb" }}>
                                    <span style={{ color: "#d1d5db", fontSize: 13, fontStyle: "italic" }}>Empty for Lunch</span>
                                </div>
                            )}
                        </div>

                        {/* Dinner */}
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}><CircleDot size={18} color="#6366f1" /></div>
                                    <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 18, color: "#2d3b2d" }}>Dinner</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                        <span style={{ position: "absolute", left: 8, fontSize: 11, fontWeight: 800, color: "#9ca3af" }}>₹</span>
                                        <input
                                            type="number"
                                            value={currentDayData.dinner.price || ""}
                                            onChange={(e) => handleMealPriceChange(selectedDay, "dinner", e.target.value)}
                                            placeholder="Tiffin Price"
                                            style={{ width: 70, padding: "6px 8px 6px 18px", border: "1px solid #f0f0f0", borderRadius: 10, fontSize: 12, fontWeight: 800, outline: "none" }}
                                        />
                                    </div>
                                    <button onClick={() => { setEditingItem({ day: selectedDay, mealType: "dinner" }); setIsModalOpen(true); }}
                                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", border: "none", background: "none", color: "#8FAE8E", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>
                                        <Plus size={15} /> Add
                                    </button>
                                </div>
                            </div>
                            {currentDayData.dinner.items.map(item => renderMenuItemCard(item, "dinner"))}
                            {currentDayData.dinner.items.length === 0 && (
                                <div style={{ padding: "40px 0", textAlign: "center", background: "#fafafa", borderRadius: 14, border: "2px dashed #e5e7eb" }}>
                                    <span style={{ color: "#d1d5db", fontSize: 13, fontStyle: "italic" }}>Empty for Dinner</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Subscriber Preview */}
                <div style={{ position: "sticky", top: 28 }}>
                    <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", border: "1px solid #f0f0f0", boxShadow: "0 8px 24px rgba(0,0,0,0.04)" }}>
                        <div style={{ background: "#5a7a50", padding: "16px 20px", display: "flex", alignItems: "center", gap: 8 }}>
                            <Eye size={16} color="#fff" />
                            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>Subscriber View</span>
                        </div>
                        <div style={{ padding: 20 }}>
                            <div style={{ background: "#f8fafc", borderRadius: 16, padding: 16, border: "1px solid #f0f0f0" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                    <span style={{ fontWeight: 800, fontSize: 14, color: "#2d3b2d" }}>{selectedDay}'s Menu</span>
                                    <Leaf size={14} color="#16a34a" />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {[...currentDayData.lunch.items, ...currentDayData.dinner.items].filter(i => i.status === "approved").map((item, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8FAE8E", flexShrink: 0 }} />
                                            <span style={{ fontSize: 13, color: "#374151" }}>{item.name}</span>
                                        </div>
                                    ))}
                                    {[...currentDayData.lunch.items, ...currentDayData.dinner.items].filter(i => i.status === "approved").length === 0 && (
                                        <p style={{ fontSize: 12, color: "#d1d5db", fontStyle: "italic", margin: 0 }}>No approved items yet</p>
                                    )}
                                </div>
                                <div style={{ marginTop: 16 }}>
                                    <p style={{ fontSize: 10, color: "#9ca3af", marginBottom: 6, fontWeight: 800, textTransform: "uppercase" }}>Tiffin Price</p>
                                    <div style={{ display: "flex", alignItems: "center", background: "#f0f0f0", borderRadius: 10, padding: "10px 14px", fontWeight: 800, color: "#374151", gap: 6 }}>
                                        <span>₹</span><span>{currentDayData.lunch.price || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 16, background: "#eff6ff", padding: 16, borderRadius: 18, border: "1px solid #dbeafe", display: "flex", gap: 12 }}>
                        <ShieldCheck size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: 2 }} />
                        <div>
                            <p style={{ fontWeight: 800, fontSize: 12, color: "#1e40af", marginBottom: 4 }}>Provider Notice</p>
                            <p style={{ fontSize: 11, color: "#3b82f6", lineHeight: 1.5, margin: 0 }}>Only veg items allowed. Admin approval required for all submissions.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                    <div onClick={() => setIsModalOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }} />
                    <div style={{ position: "relative", background: "#fff", width: "100%", maxWidth: 440, borderRadius: 26, padding: 32, boxShadow: "0 40px 80px rgba(0,0,0,0.2)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                            <h3 style={{ fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 700, color: "#2d3b2d", margin: 0 }}>
                                {editingItem?.item ? "Edit Item" : "New Menu Item"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ padding: 8, border: "none", background: "#f5f5f5", borderRadius: "50%", cursor: "pointer" }}>
                                <X size={18} />
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Item Name</label>
                                <input ref={nameRef} defaultValue={editingItem?.item?.name || ""}
                                    placeholder="e.g. Paneer Bhurji"
                                    style={{ width: "100%", padding: "12px 16px", border: "2px solid #f0f0f0", borderRadius: 14, fontSize: 14, fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box" }} />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Type</label>
                                    <select ref={typeRef} defaultValue={editingItem?.item?.type || "Sabzi"}
                                        style={{ width: "100%", padding: "12px 16px", border: "2px solid #f0f0f0", borderRadius: 14, fontSize: 14, fontFamily: "'Nunito', sans-serif", outline: "none", appearance: "none", background: "#f9fafb" }}>
                                        {["Dal", "Sabzi", "Rice", "Bread", "Dessert"].map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Item Price (Individual)</label>
                                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                        <span style={{ position: "absolute", left: 12, fontSize: 14, fontWeight: 800, color: "#9ca3af" }}>₹</span>
                                        <input ref={priceRef} type="number" defaultValue={editingItem?.item?.price || 0}
                                            placeholder="0"
                                            style={{ width: "100%", padding: "12px 16px 12px 28px", border: "2px solid #f0f0f0", borderRadius: 14, fontSize: 14, fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box" }} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Dietary</label>
                                <div style={{ padding: "12px 16px", border: "2px solid #d1fae5", borderRadius: 14, background: "#ecfdf5", display: "flex", alignItems: "center", gap: 8 }}>
                                    <Leaf size={14} color="#16a34a" />
                                    <span style={{ fontSize: 13, fontWeight: 800, color: "#065f46" }}>Veg Only</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                            <button onClick={() => setIsModalOpen(false)}
                                style={{ flex: 1, padding: 14, border: "2px solid #e5e7eb", borderRadius: 14, background: "none", fontWeight: 800, cursor: "pointer", color: "#6b7280" }}>
                                Cancel
                            </button>
                            <button onClick={handleSaveItem}
                                style={{ flex: 2, padding: 14, border: "none", borderRadius: 14, background: "#5a7a50", color: "#fff", fontWeight: 800, cursor: "pointer" }}>
                                Save Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
