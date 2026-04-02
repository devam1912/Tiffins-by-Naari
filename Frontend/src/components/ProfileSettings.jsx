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

export const ProfileSettings = ({ isServiceActive, toggleServiceStatus, isStatusLoading, profileData }) => {
    const [isSaved, setIsSaved] = useState(false);

    // Use dynamic data from backend with fallback to empty strings (NO MOCK DATA)
    const [formData, setFormData] = useState({
        kitchenName: profileData?.businessName || profileData?.name || "",
        chefName: profileData?.ownerName || "",
        email: profileData?.email || "",
        phone: profileData?.phone || "",
        location: profileData?.address || "",
        specialty: profileData?.cuisineType || "",
        fssai: profileData?.fssaiNumber || "",
        description: profileData?.description || ""
    });

    // Update form if props change
    React.useEffect(() => {
        if (profileData) {
            setFormData({
                kitchenName: profileData.businessName || profileData.name || "",
                chefName: profileData.ownerName || "",
                email: profileData.email || "",
                phone: profileData.phone || "",
                location: profileData.address || "",
                specialty: profileData.cuisineType || "",
                fssai: profileData.fssaiNumber || "",
                description: profileData.description || ""
            });
        }
    }, [profileData]);

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
                    <h2 className="admin-title">Profile Settings</h2>
                    <p className="admin-subtitle">Manage your kitchen identity, contact info, and certifications.</p>
                </div>
                <Button
                    onClick={handleSave}
                    className="bg-[#8FA873] text-white hover:bg-[#6b8a5e] flex items-center gap-2 rounded-2xl h-12 px-6 shadow-md"
                >
                    {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                    {isSaved ? "Saved Successfully" : "Save Profile"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Identity Section */}
                    <Card className="border-[1.5px] border-[rgba(143,174,142,0.2)] bg-white/60 backdrop-blur-md shadow-[0_12px_36px_rgba(90,120,70,0.1)] rounded-[32px]">
                        <CardHeader className="border-b border-[rgba(143,174,142,0.2)] pb-5">
                            <CardTitle className="text-xl flex items-center gap-2 font-serif text-[#2d3b2d]">
                                <Store className="text-[#8FA873]" size={24} />
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
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Tell your customers about your cooking style and ingredients..."
                                    className="w-full p-4 bg-gray-50 border-none rounded-xl text-sm focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all resize-none h-32"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Section */}
                    <Card className="border-[1.5px] border-[rgba(143,174,142,0.2)] bg-white/60 backdrop-blur-md shadow-[0_12px_36px_rgba(90,120,70,0.1)] rounded-[32px]">
                        <CardHeader className="border-b border-[rgba(143,174,142,0.2)] pb-5">
                            <CardTitle className="text-xl flex items-center gap-2 font-serif text-[#2d3b2d]">
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
                    <Card className="border-[1.5px] border-[rgba(143,174,142,0.2)] bg-white/60 backdrop-blur-md shadow-[0_12px_36px_rgba(90,120,70,0.1)] overflow-hidden text-center rounded-[32px]">
                        <div className="h-28 bg-gradient-to-tr from-[#8FA873] to-[#6b8a5e] opacity-80" />
                        <div className="px-6 pb-8 -mt-14 text-center">
                            <div className="relative inline-block">
                                <div className="w-28 h-28 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden mx-auto flex items-center justify-center font-bold text-4xl text-[var(--primary)]">
                                    {formData.kitchenName?.charAt(0) || '👩‍🍳'}
                                </div>
                                <button className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-[var(--primary)] border border-gray-100 transition-colors">
                                    <Upload size={16} />
                                </button>
                            </div>
                            <Typography variant="h3" className="mt-4 font-serif">{formData.kitchenName || 'Kitchen Profile'}</Typography>
                            <Typography className="text-gray-500 font-medium">{formData.chefName || 'Chef'}</Typography>
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                {profileData?.isApproved && (
                                    <span className="text-[10px] font-bold px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 uppercase tracking-widest">Verified Partner</span>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Certification Card */}
                    <Card className="bg-amber-50/90 backdrop-blur-md border-[1.5px] border-amber-200 shadow-[0_12px_36px_rgba(90,120,70,0.1)] rounded-[32px]">
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
                                    {profileData?.fssaiCertificate ? 'Certificate Uploaded & Valid' : 'Certificate Pending Verification'}
                                </div>
                                <p className="text-xs text-amber-600 mt-1 font-medium ml-4.5">Last updated: {profileData?.updatedAt ? new Date(profileData.updatedAt).toLocaleDateString() : '—'}</p>
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
