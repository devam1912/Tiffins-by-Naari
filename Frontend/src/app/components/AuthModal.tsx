import React, { useState, useRef } from "react";
import { X, Mail, Lock, User, ShieldCheck, Phone, Store, UtensilsCrossed, FileImage, Upload } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Typography } from "./Typography";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: "user" | "provider" | "admin") => void;
}

export const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<"user" | "provider">("user");
  const [loading, setLoading] = useState(false);
  const [certificateFileName, setCertificateFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Admin Check
    const formData = new FormData(e.target as HTMLFormElement);
    const emailInput = (formData.get("email") as string || "").trim().toLowerCase();
    const passwordInput = (formData.get("password") as string || "").trim();

    // Read all signup fields (for reference / future backend integration)
    if (mode === "signup") {
      const signupData: Record<string, any> = {
        name: formData.get("name"),
        email: emailInput,
        phone: formData.get("phone"),
        password: passwordInput,
        role: role === "user" ? "customer" : "provider",
      };

      if (role === "provider") {
        signupData.businessName = formData.get("businessName");
        signupData.fssaiNumber = formData.get("fssaiNumber");
        signupData.cuisineType = formData.get("cuisineType");
        signupData.fssaiCertificate = formData.get("fssaiCertificate");
      }

      console.log("Signup data:", signupData);
    }

    setTimeout(() => {
      setLoading(false);

      if (emailInput === "admin@gmail.com" && passwordInput === "admin123") {
        toast.success("Admin Login Successful", {
          description: "Welcome back, Administrator!",
        });
        onSuccess("admin");
        onClose();
      } else if (emailInput && passwordInput) {
        toast.success(mode === "signup" ? "Account Created" : "Login Successful", {
          description: mode === "signup"
            ? "Welcome to Tiffins by Naari!"
            : "Welcome back to Tiffins by Naari!",
        });
        onSuccess(role);
        onClose();
      } else {
        toast.error(mode === "signup" ? "Signup Failed" : "Login Failed", {
          description: "Please check your details and try again.",
        });
      }
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateFileName(file.name);
    }
  };

  if (!isOpen) return null;

  const isProviderSignup = mode === "signup" && role === "provider";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white w-full max-w-md rounded-[24px] overflow-hidden shadow-2xl"
      >
        <div className={`p-8 ${isProviderSignup ? "max-h-[85vh] overflow-y-auto" : ""}`}>
          <div className="flex justify-between items-center mb-8">
            <Typography variant="h3" className="font-serif capitalize">{mode}</Typography>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => setRole("user")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === "user" ? "bg-white shadow-sm text-[var(--primary)]" : "text-gray-500"}`}
            >
              Subscriber
            </button>
            <button
              onClick={() => setRole("provider")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === "provider" ? "bg-white shadow-sm text-[var(--primary)]" : "text-gray-500"}`}
            >
              Chef / Provider
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ===== SIGNUP FIELDS ===== */}
            {mode === "signup" && (
              <>
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input className="pl-12 h-12" name="name" placeholder="John Doe" required />
                  </div>
                </div>
              </>
            )}

            {/* Email — always shown */}
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input className="pl-12 h-12" type="email" name="email" placeholder="name@example.com" required />
              </div>
            </div>

            {/* Phone — only on signup */}
            {mode === "signup" && (
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input className="pl-12 h-12" type="tel" name="phone" placeholder="+91 9876543210" required />
                </div>
              </div>
            )}

            {/* Password — always shown */}
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input className="pl-12 h-12" type="password" name="password" placeholder="••••••••" minLength={6} required />
              </div>
            </div>

            {/* ===== PROVIDER-ONLY SIGNUP FIELDS ===== */}
            {isProviderSignup && (
              <>
                <div className="border-t border-gray-200 my-2 pt-4">
                  <Typography variant="small" className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-4 block">
                    Business Details
                  </Typography>
                </div>

                {/* Business Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Business Name</label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input className="pl-12 h-12" name="businessName" placeholder="Naari's Kitchen" required />
                  </div>
                </div>

                {/* FSSAI Number */}
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">FSSAI License Number</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input className="pl-12 h-12" name="fssaiNumber" placeholder="12345678901234" required />
                  </div>
                </div>

                {/* FSSAI Certificate Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">FSSAI Certificate</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-3 w-full h-12 px-4 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] bg-[var(--input-background)] cursor-pointer hover:border-[var(--primary)] transition-colors"
                  >
                    {certificateFileName ? (
                      <>
                        <FileImage className="text-[var(--primary)] shrink-0" size={18} />
                        <span className="text-sm text-gray-700 truncate">{certificateFileName}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="text-gray-400 shrink-0" size={18} />
                        <span className="text-sm text-gray-400">Upload certificate image (JPG, PNG, PDF)</span>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="fssaiCertificate"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Cuisine Type */}
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Cuisine Type</label>
                  <div className="relative">
                    <UtensilsCrossed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input className="pl-12 h-12" name="cuisineType" placeholder="North Indian, South Indian, etc." />
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full h-12 text-base font-bold" disabled={loading}>
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                mode === "login" ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Typography variant="small" className="text-gray-500">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setCertificateFileName("");
                }}
                className="text-[var(--primary)] font-bold hover:underline"
              >
                {mode === "login" ? "Sign Up" : "Log In"}
              </button>
            </Typography>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <ShieldCheck size={14} />
            Secure & Verified by Naari
          </div>
        </div>
      </motion.div>
    </div>
  );
};
