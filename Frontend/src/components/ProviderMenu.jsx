import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit3, CheckCircle2, X, CircleDot, Leaf, UtensilsCrossed, Clock, Ban, ShieldCheck, Eye, Send, Image as ImageIcon, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProviderMenu, saveMenu, submitMenuForApproval, deleteMenu, deleteMenuItem } from "../store/providerSlice";
import { useDialog } from "../context/DialogContext";
import API from "../api/auth";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const EMPTY_DAY = () => ({ lunch: { items: [], price: 0 }, dinner: { items: [], price: 0 } });

const buildWeekMenu = (serverWeekMenu = []) => {
    return DAYS.map(day => {
        const found = serverWeekMenu.find(d => d.day === day);
        return found ? { day, lunch: found.lunch || EMPTY_DAY().lunch, dinner: found.dinner || EMPTY_DAY().dinner } : { day, ...EMPTY_DAY() };
    });
};

export const ProviderMenu = ({ theme }) => {
    const T = theme || {
        text: 'inherit',
        textSec: '#aaa',
        textMuted: '#aaa',
        card: 'rgba(255,255,255,0.05)',
        border: 'rgba(255,255,255,0.1)',
        cardShadow: 'none',
        bg: 'transparent'
    };

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { menu, loading } = useSelector((state) => state.provider);
    const { showConfirm } = useDialog();

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
    const fileInputRef = useRef();

    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [itemImage, setItemImage] = useState("");

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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setIsUploadingImage(true);
        try {
            const res = await API.post("/tiffins/upload-image", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setItemImage(res.data.imageUrl);
            showToast("Image uploaded successfully!");
        } catch (err) {
            console.error("Upload error:", err);
            showToast(err.response?.data?.message || "Image upload failed", "error");
        } finally {
            setIsUploadingImage(false);
        }
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
        const confirmed = await showConfirm(
            "Submit Menu",
            "Are you sure you want to submit this menu for admin approval? You won't be able to edit items until they are approved or rejected."
        );
        if (!confirmed) return;
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

    const handleDeleteMenu = async () => {
        const confirmed = await showConfirm(
            "Delete Entire Menu",
            "Are you sure you want to delete your entire menu? This will cancel all active subscriptions and issue refunds. This action cannot be undone."
        );
        if (!confirmed) return;

        try {
            await dispatch(deleteMenu()).unwrap();
            setWeekMenu(DAYS.map(day => ({ day, ...EMPTY_DAY() })));
            showToast("Menu deleted completely.");
        } catch (err) {
            showToast(err || "Failed to delete menu.", "error");
        }
    };

    const handleDelete = async (dayName, mealType, itemId) => {
        const item = weekMenu.find(d => d.day === dayName)?.[mealType]?.items.find(i => (i.id || i._id) === itemId);
        const isSavedInDB = !!item?._id;

        if (isSavedInDB) {
            const confirmed = await showConfirm(
                "Delete Item",
                "Are you sure you want to remove this item? This will notify your active subscribers."
            );
            if (!confirmed) return;

            try {
                await dispatch(deleteMenuItem({ day: dayName, meal: mealType, itemId })).unwrap();
                showToast("Item deleted from backend.");
            } catch (err) {
                showToast(err || "Failed to delete item.", "error");
                return;
            }
        }

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
        
        if (!isSavedInDB) {
            showToast("Item removed locally — save to sync", "info");
        }
    };

    const handleMealPriceChange = (dayName, mealType, newPrice) => {
        let val = parseFloat(newPrice) || 0;
        if (val < 0) {
            showToast("Price cannot be negative", "error");
            val = 0;
        }
        setWeekMenu(prev => prev.map(d => {
            if (d.day !== dayName) return d;
            return { ...d, [mealType]: { ...d[mealType], price: val } };
        }));
    };

    const handleSaveItem = () => {
        const name = nameRef.current?.value?.trim();
        const type = typeRef.current?.value || "Sabzi";
        const price = parseFloat(priceRef.current?.value) || 0;
        const image = itemImage;
        if (!name) return;
        if (price < 0) {
            showToast("Price cannot be negative", "error");
            return;
        }

        const { day, mealType, item } = editingItem;
        setWeekMenu(prev => prev.map(d => {
            if (d.day !== day) return d;
            const meal = d[mealType];
            let newItems;
            if (item) {
                const targetId = item.id || item._id;
                newItems = meal.items.map(i => (i.id || i._id) === targetId ? { ...i, name, type, price, image } : i);
            } else {
                newItems = [...meal.items, { id: Date.now().toString(), name, type, price, image, status: "pending" }];
            }
            return { ...d, [mealType]: { ...meal, items: newItems } };
        }));
        showToast(item ? "Item updated locally" : "Item added locally — save to sync");
        setIsModalOpen(false);
        setEditingItem(null);
        setItemImage("");
    };

    const menuStatus = {
        isApproved: menu?.isApproved || false,
        submittedForApproval: menu?.submittedForApproval || false
    };

    const StatusBadge = ({ status }) => {
        const map = {
            pending: { color: "#b45309", bg: "#fef9e6", border: "#fde68a", label: "Pending", Icon: Clock },
            approved: { color: "#065f46", bg: "#ecfdf5", border: "#a7f3d0", label: "Approved", Icon: CheckCircle2 },
            rejected: { color: "#be123c", bg: "#fff1f2", border: "#fecdd3", label: "Rejected", Icon: Ban },
        };
        const { color, bg, border, label, Icon } = map[status] || map.pending;
        return (
            <span style={{ 
                background: bg, color: color, border: `1px solid ${border}`,
                display: "inline-flex", alignItems: "center", gap: 4, 
                fontSize: 10, fontWeight: 800, padding: "2px 8px", 
                borderRadius: 100, textTransform: "uppercase",
                whiteSpace: "nowrap"
            }}>
                <Icon size={9} />{label}
            </span>
        );
    };

    const renderMenuItemCard = (item, mealType) => {
        // Smart-Sync: If the overall menu is approved, treat all items in the weekMenu as approved 
        // to handle the backend data mismatch.
        const effectivelyApproved = menuStatus.isApproved || item.status === "approved";
        const statusToDisplay = effectivelyApproved ? "approved" : item.status;
        
        return (
            <div key={item.id || item._id} className="menu-item-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 12, background: item.status === "pending" ? "#fffbeb" : "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        {item.image ? (
                            <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <UtensilsCrossed size={18} color={item.status === "pending" ? "#f59e0b" : "#d1d5db"} />
                        )}
                    </div>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-start" }}>
                            <span style={{ fontWeight: 700, fontSize: 14, color: "inherit", marginRight: "auto" }}>{item.name}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ background: "#f3f4f6", color: "#6b7280", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 6, textTransform: "uppercase" }}>{item.type}</span>
                                <span style={{ fontSize: 11, fontWeight: 800, color: "#8FAE8E" }}>₹{item.price || 0}</span>
                                <StatusBadge status={statusToDisplay} />
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                            <Leaf size={10} color="#16a34a" />
                            <span style={{ fontSize: 10, color: "#9ca3af" }}>Pure Veg</span>
                        </div>
                    </div>
                </div>
                <div className="menu-item-actions" style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { setEditingItem({ day: selectedDay, mealType, item }); setItemImage(item.image || ""); setIsModalOpen(true); }}
                        style={{ padding: 8, border: "none", background: "none", cursor: "pointer", borderRadius: 8, color: "#9ca3af" }}>
                        <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(selectedDay, mealType, item._id || item.id)}
                        style={{ padding: 8, border: "none", background: "none", cursor: "pointer", borderRadius: 8, color: "#9ca3af" }}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div style={{ padding: 80, textAlign: "center", color: "#8FAE8E", fontWeight: 700 }}>Loading your menu...</div>
    );

    return (
        <div style={{ paddingBottom: 40, fontFamily: "'Nunito', sans-serif", position: "relative" }}>
            <style>{`
                @media (max-width: 900px) {
                    .menu-header-actions {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 16px !important;
                    }
                    .header-btns {
                        width: 100% !important;
                        justify-content: flex-start !important;
                        flex-wrap: wrap !important;
                    }
                    .header-btns button {
                        flex: 1 !important;
                        min-width: 140px !important;
                        justify-content: center !important;
                    }
                    .main-layout-grid {
                        grid-template-columns: 1fr !important;
                        gap: 20px !important;
                    }
                    .meal-grid {
                        grid-template-columns: 1fr !important;
                        gap: 24px !important;
                    }
                    .sticky-preview {
                        position: static !important;
                        margin-top: 24px !important;
                    }
                    .day-tabs {
                        padding: 4px !important;
                    }
                    .day-tabs button {
                        min-width: 80px !important;
                        padding: 8px 4px !important;
                        font-size: 12px !important;
                    }
                }
                @media (max-width: 480px) {
                    .menu-item-card {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 12px !important;
                    }
                    .menu-item-actions {
                        width: 100% !important;
                        justify-content: flex-end !important;
                        border-top: 1px solid rgba(255,255,255,0.05) !important;
                        padding-top: 8px !important;
                    }
                }
            `}</style>

            {/* Toast */}
            {toast && (
                <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "14px 24px", borderRadius: 14, fontWeight: 700, fontSize: 14, background: toast.type === "error" ? "#ef5350" : toast.type === "info" ? "#5c6bc0" : "#8FAE8E", color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
                    {toast.msg}
                </div>
            )}

            {/* Header actions */}
            <div className="menu-header-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                    <h2 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: T.text, margin: 0 }}>Menu Manager</h2>
                    <p style={{ fontSize: 13, color: T.textSec, marginTop: 4 }}>
                        {menuStatus.isApproved ? "✅ Menu is approved & live" : menuStatus.submittedForApproval ? "⏳ Awaiting admin approval" : "Draft — save and submit for approval"}
                    </p>
                </div>
                <div className="header-btns" style={{ display: "flex", gap: 10 }}>
                    {menu && (
                         <button onClick={handleDeleteMenu}
                            style={{ padding: "11px 18px", borderRadius: 12, border: `1px solid ${T.border}`, background: "none", color: "#ef5350", fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                            <Trash2 size={14} /> Delete
                        </button>
                    )}
                    <button onClick={handleSaveMenu} disabled={isSaving}
                        style={{ padding: "11px 18px", borderRadius: 12, border: "none", background: "#2d3b2d", color: "#fff", fontWeight: 800, fontSize: 13, cursor: isSaving ? "not-allowed" : "pointer" }}>
                        {isSaving ? "Saving..." : "💾 Save"}
                    </button>
                    {!menuStatus.isApproved && (
                        <button onClick={handleSubmitForApproval} disabled={isSubmitting}
                            style={{ padding: "11px 18px", borderRadius: 12, border: "none", background: "#8FAE8E", color: "#fff", fontWeight: 800, fontSize: 13, cursor: isSubmitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                            <Send size={14} /> {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    )}
                </div>
            </div>

            <div className="main-layout-grid" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 28 }}>
                <div>
                    {/* Day Tabs — FIXED: explicit colors, always readable */}
                    <div className="day-tabs" style={{ display: "flex", background: T.card, padding: 6, borderRadius: 18, border: `1px solid ${T.border}`, overflowX: "auto", gap: 4, marginBottom: 28 }}>
                        {DAYS.map(day => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                style={{
                                    flex: "1 1 0", minWidth: 90, padding: "10px 8px",
                                    borderRadius: 12, border: "none", cursor: "pointer",
                                    fontWeight: 800, fontSize: 13, transition: "all 0.2s",
                                    background: selectedDay === day ? "#5a7a50" : "transparent",
                                    color: selectedDay === day ? "#ffffff" : T.textSec,
                                    boxShadow: selectedDay === day ? "0 4px 14px rgba(90,122,80,0.3)" : "none",
                                }}
                                onMouseEnter={e => { if (selectedDay !== day) { e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.color = T.text; } }}
                                onMouseLeave={e => { if (selectedDay !== day) { e.target.style.background = "transparent"; e.target.style.color = T.textSec; } }}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    <div className="meal-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                        {/* Lunch */}
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center" }}><CircleDot size={18} color="#f59e0b" /></div>
                                    <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 18, color: T.text }}>Lunch</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                        <span style={{ position: "absolute", left: 8, fontSize: 11, fontWeight: 800, color: T.textSec }}>₹</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={currentDayData.lunch.price || ""}
                                            onChange={(e) => handleMealPriceChange(selectedDay, "lunch", e.target.value)}
                                            placeholder="Tiffin Price"
                                            style={{ width: 70, padding: "6px 8px 6px 18px", border: `1px solid ${T.border}`, background: T.card, color: T.text, borderRadius: 10, fontSize: 12, fontWeight: 800, outline: "none" }}
                                        />
                                    </div>
                                    <button onClick={() => { setEditingItem({ day: selectedDay, mealType: "lunch" }); setItemImage(""); setIsModalOpen(true); }}
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
                                    <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 18, color: T.text }}>Dinner</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                        <span style={{ position: "absolute", left: 8, fontSize: 11, fontWeight: 800, color: T.textSec }}>₹</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={currentDayData.dinner.price || ""}
                                            onChange={(e) => handleMealPriceChange(selectedDay, "dinner", e.target.value)}
                                            placeholder="Tiffin Price"
                                            style={{ width: 70, padding: "6px 8px 6px 18px", border: `1px solid ${T.border}`, background: T.card, color: T.text, borderRadius: 10, fontSize: 12, fontWeight: 800, outline: "none" }}
                                        />
                                    </div>
                                    <button onClick={() => { setEditingItem({ day: selectedDay, mealType: "dinner" }); setItemImage(""); setIsModalOpen(true); }}
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
                <div className="sticky-preview" style={{ position: "sticky", top: 28 }}>
                    <div style={{ background: T.card, borderRadius: 24, overflow: "hidden", border: `1px solid ${T.border}`, boxShadow: T.cardShadow }}>
                        <div style={{ background: "#5a7a50", padding: "16px 20px", display: "flex", alignItems: "center", gap: 8 }}>
                            <Eye size={16} color="#fff" />
                            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>Subscriber View</span>
                        </div>
                        <div style={{ padding: 20 }}>
                            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 16, border: `1px solid ${T.border}` }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                    <span style={{ fontWeight: 800, fontSize: 14, color: T.text }}>{selectedDay}'s Menu</span>
                                    <Leaf size={14} color="#16a34a" />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {[...currentDayData.lunch.items, ...currentDayData.dinner.items].map((item, i) => {
                                        const effectivelyApproved = menuStatus.isApproved || item.status === "approved";
                                        return (
                                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, opacity: effectivelyApproved ? 1 : 0.6 }}>
                                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: effectivelyApproved ? "#8FAE8E" : "#f59e0b", flexShrink: 0 }} />
                                                <span style={{ fontSize: 13, color: T.text }}>{item.name}</span>
                                                {!effectivelyApproved && <span style={{ fontSize: 8, fontWeight: 800, color: "#f59e0b", textTransform: "uppercase" }}>(Draft)</span>}
                                            </div>
                                        );
                                    })}
                                    {[...currentDayData.lunch.items, ...currentDayData.dinner.items].length === 0 && (
                                        <p style={{ fontSize: 12, color: "#d1d5db", fontStyle: "italic", margin: 0 }}>No items added yet</p>
                                    )}
                                </div>
                                <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                    <div>
                                        <p style={{ fontSize: 10, color: T.textSec, marginBottom: 4, fontWeight: 800, textTransform: "uppercase" }}>Lunch</p>
                                        <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 10px", fontWeight: 800, color: T.text, gap: 4, fontSize: 13 }}>
                                            <span>₹</span><span>{currentDayData.lunch.price || 0}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 10, color: T.textSec, marginBottom: 4, fontWeight: 800, textTransform: "uppercase" }}>Dinner</p>
                                        <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 10px", fontWeight: 800, color: T.text, gap: 4, fontSize: 13 }}>
                                            <span>₹</span><span>{currentDayData.dinner.price || 0}</span>
                                        </div>
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
                    <div onClick={() => { setIsModalOpen(false); setItemImage(""); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} />
                    <div style={{ position: "relative", background: T.bg === '#000000' ? '#1a1a1a' : '#fff', width: "100%", maxWidth: 440, borderRadius: 26, padding: 32, boxShadow: T.cardShadow || "0 20px 50px rgba(0,0,0,0.2)", color: T.text, border: `1px solid ${T.border}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                            <h3 style={{ fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 700, color: T.text, margin: 0 }}>
                                {editingItem?.item ? "Edit Item" : "New Menu Item"}
                            </h3>
                            <button onClick={() => { setIsModalOpen(false); setItemImage(""); }} style={{ padding: 8, border: "none", background: T.bg === '#000000' ? 'rgba(255,255,255,0.1)' : "#f5f5f5", borderRadius: "50%", cursor: "pointer", color: T.text }}>
                                <X size={18} />
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Item Name</label>
                                <input ref={nameRef} defaultValue={editingItem?.item?.name || ""}
                                    placeholder="e.g. Paneer Bhurji"
                                    style={{ width: "100%", padding: "12px 16px", border: `2px solid ${T.border}`, background: T.bg === '#000000' ? 'rgba(255,255,255,0.05)' : '#fff', color: T.text, borderRadius: 14, fontSize: 14, fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box" }} />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Type</label>
                                    <select ref={typeRef} defaultValue={editingItem?.item?.type || "Sabzi"}
                                        style={{ width: "100%", padding: "12px 16px", border: `2px solid ${T.border}`, borderRadius: 14, fontSize: 14, fontFamily: "'Nunito', sans-serif", outline: "none", appearance: "none", background: T.bg === '#000000' ? 'rgba(255,255,255,0.05)' : "#f9fafb", color: T.text }}>
                                        {["Dal", "Sabzi", "Rice", "Bread", "Dessert"].map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Individual Price</label>
                                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                        <span style={{ position: "absolute", left: 12, fontSize: 14, fontWeight: 800, color: T.textSec }}>₹</span>
                                        <input ref={priceRef} type="number" min="0" defaultValue={editingItem?.item?.price || 0}
                                            placeholder="0"
                                            style={{ width: "100%", padding: "12px 16px 12px 28px", border: `2px solid ${T.border}`, background: T.bg === '#000000' ? 'rgba(255,255,255,0.05)' : '#fff', color: T.text, borderRadius: 14, fontSize: 14, fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box" }} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Item Image</label>
                                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{ 
                                            width: 100, height: 100, borderRadius: 16, border: `2px dashed ${T.border}`, 
                                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
                                            cursor: "pointer", position: "relative", overflow: "hidden", background: T.bg === '#000000' ? 'rgba(255,255,255,0.05)' : "#f9fafb",
                                            transition: "all 0.2s"
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = "#8FAE8E"}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                                    >
                                        {isUploadingImage ? (
                                            <Loader2 size={24} className="animate-spin" style={{ color: "#8FAE8E" }} />
                                        ) : itemImage ? (
                                            <img src={itemImage} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <>
                                                <ImageIcon size={24} style={{ color: T.textMuted }} />
                                                <span style={{ fontSize: 10, color: T.textMuted, fontWeight: 700, marginTop: 4 }}>Add Photo</span>
                                            </>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 12, color: T.textMuted, margin: "0 0 8px 0", lineHeight: 1.4 }}>Clear photo of the meal. Max 2MB.</p>
                                        <button 
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg === '#000000' ? 'rgba(255,255,255,0.1)' : "#fff", fontSize: 11, fontWeight: 800, cursor: "pointer", color: T.text }}
                                        >
                                            {itemImage ? "Change" : "Choose"}
                                        </button>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleImageUpload} 
                                            accept="image/*" 
                                            style={{ display: "none" }} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Dietary</label>
                                <div style={{ padding: "12px 16px", border: "2px solid rgba(22, 163, 74, 0.2)", borderRadius: 14, background: "rgba(22, 163, 74, 0.1)", display: "flex", alignItems: "center", gap: 8 }}>
                                    <Leaf size={14} style={{ color: "#16a34a" }} />
                                    <span style={{ fontSize: 13, fontWeight: 800, color: "#16a34a" }}>Pure Veg</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                            <button onClick={() => { setIsModalOpen(false); setItemImage(""); }}
                                style={{ flex: 1, padding: 14, border: `2px solid ${T.border}`, borderRadius: 14, background: "none", fontWeight: 800, cursor: "pointer", color: T.textSec }}>
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
