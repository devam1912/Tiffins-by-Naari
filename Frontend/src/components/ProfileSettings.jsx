import React, { useState } from "react";
import {
    Store,
    User,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    Upload,
    Save,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { Typography } from "./ui/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { toast } from "sonner";
import { cn } from "../lib/utils";

export const ProfileSettings = ({ isServiceActive, toggleServiceStatus, isStatusLoading }) => {
    const [isSaved, setIsSaved] = useState(false);
    const [formData, setFormData] = useState({
        kitchenName: "Naari's Kitchen",
        chefName: "Bhavika Sharma",
        email: "bhavika.chef@naari.com",
        phone: "+91 98765 43210",
        location: "Indiranagar, Bangalore",
        specialty: "North Indian Thalis & Fusion Bowls",
        fssai: "22223056000123",
        description: "Authentic North Indian homemade meals with less oil and spices. My kitchen uses heirloom recipes passed down through generations. We source our spices directly from local farmers and use cold-pressed oils."
    });

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        toast.success("Profile Updated", { description: "Your kitchen settings have been saved." });
    };

    return (
        <div className="space-y-8 max-w-5xl">
            <div className="flex items-center justify-between">
                <div>
                    <Typography variant="h2" className="font-serif">Profile Settings</Typography>
                    <Typography className="text-gray-500">Manage your kitchen identity, contact info, and certifications.</Typography>
                </div>
                <Button
                    onClick={handleSave}
                    className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 flex items-center gap-2"
                >
                    {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                    {isSaved ? "Saved Successfully" : "Save Profile"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Identity Section */}
                    <Card className="border-none shadow-sm rounded-2xl">
                        <CardHeader className="border-b border-gray-50 pb-5">
                            <CardTitle className="text-xl flex items-center gap-2 font-serif">
                                <Store className="text-[var(--primary)]" size={24} />
                                Kitchen Identity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Kitchen Name</label>
                                    <Input
                                        value={formData.kitchenName}
                                        onChange={(e) => setFormData({ ...formData, kitchenName: e.target.value })}
                                        placeholder="Enter kitchen name"
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Chef Name</label>
                                    <Input
                                        value={formData.chefName}
                                        onChange={(e) => setFormData({ ...formData, chefName: e.target.value })}
                                        placeholder="Enter chef name"
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Kitchen Specialty</label>
                                <Input
                                    value={formData.specialty}
                                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                    placeholder="e.g. South Indian, Desserts, Healthy Keto"
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Kitchen Bio / Philosophy</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Tell your customers about your cooking style and ingredients..."
                                    className="resize-none h-32"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Section */}
                    <Card className="border-none shadow-sm rounded-2xl">
                        <CardHeader className="border-b border-gray-50 pb-5">
                            <CardTitle className="text-xl flex items-center gap-2 font-serif">
                                <Phone className="text-blue-500" size={24} />
                                Contact & Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                                    <Input
                                        disabled
                                        value={formData.email}
                                        className="h-11 bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-[10px] text-gray-400 italic font-bold">Contact support to change primary email</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Phone Number</label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Operating Location</label>
                                <Input
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="h-11"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    {/* Profile Photo */}
                    <Card className="border-none shadow-sm overflow-hidden text-center rounded-2xl">
                        <div className="h-28 bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] opacity-80" />
                        <div className="px-6 pb-8 -mt-14 text-center">
                            <div className="relative inline-block">
                                <div className="w-28 h-28 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden mx-auto flex items-center justify-center font-bold text-4xl text-[var(--primary)]">
                                    {formData.kitchenName.charAt(0)}
                                </div>
                                <button className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-[var(--primary)] border border-gray-100 transition-colors">
                                    <Upload size={16} />
                                </button>
                            </div>
                            <Typography variant="h3" className="mt-4 font-serif">{formData.kitchenName}</Typography>
                            <Typography className="text-gray-500 font-medium">{formData.chefName}</Typography>
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                <span className="text-[10px] font-bold px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 uppercase tracking-widest">Verified</span>
                                <span className="text-[10px] font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 uppercase tracking-widest">Top Rated</span>
                            </div>
                        </div>
                    </Card>

                    {/* Certification Card */}
                    <Card className="bg-amber-50/50 border-amber-200 border shadow-sm rounded-2xl">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 text-amber-900 mb-6">
                                <ShieldCheck className="text-amber-600" size={28} />
                                <Typography variant="h3" className="!text-amber-900 font-serif">FSSAI Status</Typography>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-amber-900">License Number</label>
                                <Input
                                    className="bg-white border-amber-200 h-11 focus-visible:ring-amber-500"
                                    value={formData.fssai}
                                    onChange={(e) => setFormData({ ...formData, fssai: e.target.value })}
                                />
                            </div>
                            <div className="mt-6 p-4 bg-white rounded-xl border border-amber-100 shadow-sm">
                                <div className="flex items-center gap-2 text-sm font-bold text-green-700">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                    Currently Active & Valid
                                </div>
                                <p className="text-xs text-amber-600 mt-1 font-medium ml-4.5">Expiry: Jan 15, 2027</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        variant="outline"
                        onClick={toggleServiceStatus}
                        disabled={isStatusLoading}
                        className={cn(
                            "w-full h-12 transition-all duration-300 font-bold overflow-hidden relative group disabled:opacity-50",
                            !isServiceActive
                                ? "text-green-700 border-green-200 bg-green-50 hover:bg-green-100"
                                : "text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
                        )}
                    >
                        {isStatusLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : !isServiceActive ? (
                            "Resume My Service"
                        ) : (
                            "Pause My Service"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
