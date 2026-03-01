import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Leaf, 
  CircleDot, 
  ChevronLeft, 
  Clock, 
  Info,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { Button } from "./Button";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Typography } from "./Typography";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { cn } from "../../lib/utils";

interface MealOption {
  type: "veg" | "non-veg";
  items: string[];
}

interface DayMenu {
  lunch: MealOption;
  dinner: MealOption;
}

const WEEKLY_MENU: Record<string, DayMenu> = {
  Monday: {
    lunch: { type: "veg", items: ["Dal Tadka", "Jeera Rice", "Aloo Gobi", "2 Phulka", "Curd"] },
    dinner: { type: "veg", items: ["Paneer Butter Masala", "Plain Rice", "Mix Veg", "2 Phulka"] }
  },
  Tuesday: {
    lunch: { type: "non-veg", items: ["Egg Curry", "Steamed Rice", "Bhindi Masala", "2 Phulka"] },
    dinner: { type: "veg", items: ["Baingan Bharta", "Jeera Rice", "Dal Fry", "2 Phulka", "Salad"] }
  },
  Wednesday: {
    lunch: { type: "veg", items: ["Rajma Chawal", "Dry Aloo", "Salad", "Pickle"] },
    dinner: { type: "veg", items: ["Kadhai Paneer", "Veg Pulao", "Raita", "1 Butter Naan"] }
  },
  Thursday: {
    lunch: { type: "veg", items: ["Chole Bhature", "Sweet Lassi", "Onion Salad"] },
    dinner: { type: "veg", items: ["Yellow Dal", "Gobi Matar", "Steamed Rice", "2 Phulka"] }
  },
  Friday: {
    lunch: { type: "non-veg", items: ["Chicken Curry", "Pulao", "Raita", "Salad"] },
    dinner: { type: "veg", items: ["Dal Makhani", "Jeera Rice", "Mix Veg Sabzi", "2 Phulka"] }
  },
  Saturday: {
    lunch: { type: "veg", items: ["Puri Bhaji", "Shrikhand", "Papad", "Chana Masala"] },
    dinner: { type: "veg", items: ["Vegetable Biryani", "Mirchi Ka Salan", "Raita"] }
  },
  Sunday: {
    lunch: { type: "non-veg", items: ["Mutton Curry", "Steamed Rice", "Salad", "Papad"] },
    dinner: { type: "veg", items: ["Khichdi Kadhi", "Aloo Chokha", "Papad", "Ghee"] }
  }
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const ProviderProfile = ({ onBack }: { onBack: () => void }) => {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [plan, setPlan] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [meals, setMeals] = useState<"lunch" | "dinner" | "both">("both");

  const pricing = {
    daily: 150,
    weekly: 135,
    monthly: 120
  };

  const mealMultiplier = meals === "both" ? 2 : 1;
  const daysMultiplier = plan === "daily" ? 1 : plan === "weekly" ? 7 : 30;
  const totalPrice = pricing[plan] * mealMultiplier * daysMultiplier;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Top Cover Section */}
      <div className="relative h-[300px] md:h-[400px] w-full">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1745429523635-ad375f836bf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdhcm0lMjBob21lJTIwa2l0Y2hlbiUyMGludGVyaW9yJTIwaW5kaWFufGVufDF8fHx8MTc3MTEzNjA0NXww"
          alt="Home Kitchen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                <ShieldCheck size={14} className="text-[var(--lime)]" />
                FSSAI CERTIFIED: 22223056000123
              </div>
              <Typography variant="h1" className="!text-white font-serif !text-4xl md:!text-6xl">Naari's Kitchen</Typography>
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base opacity-90">
                <div className="flex items-center gap-1">
                  <Star size={18} className="fill-yellow-500 text-yellow-500" />
                  <span className="font-bold">4.9</span>
                  <span className="opacity-70">(128 reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={18} />
                  <span>Indiranagar, Bangalore</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={18} />
                  <span>Opens at 8:00 AM</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-[var(--foreground)] hover:bg-white/90">Follow Kitchen</Button>
              <Button variant="secondary">Share Profile</Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content: Weekly Menu */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Typography variant="h3" className="font-serif">Weekly Menu</Typography>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 text-xs font-medium text-[var(--muted-foreground)]">
                    <Leaf size={14} className="text-green-600" /> Veg
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-[var(--muted-foreground)]">
                    <CircleDot size={14} className="text-red-600" /> Non-Veg
                  </div>
                </div>
              </div>

              {/* Day Selector */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap border-2",
                      selectedDay === day 
                        ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-md" 
                        : "bg-white border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)]"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lunch Card */}
                <Card className="border-2 border-[var(--primary)]/10">
                  <CardHeader className="flex flex-row items-center justify-between bg-[var(--primary)]/5 p-4 rounded-t-[var(--radius)]">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Calendar className="text-[var(--primary)] w-5 h-5" />
                      </div>
                      <Typography variant="h4">Lunch</Typography>
                    </div>
                    {WEEKLY_MENU[selectedDay].lunch.type === "veg" ? (
                      <Leaf className="text-green-600" size={20} />
                    ) : (
                      <CircleDot className="text-red-600" size={20} />
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {WEEKLY_MENU[selectedDay].lunch.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-[var(--primary)] shrink-0" />
                          <Typography className="text-base">{item}</Typography>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-4 border-t border-dashed border-[var(--border)]">
                      <Typography variant="small" className="italic">Delivered between 12:30 PM - 1:30 PM</Typography>
                    </div>
                  </CardContent>
                </Card>

                {/* Dinner Card */}
                <Card className="border-2 border-[var(--accent)]/10">
                  <CardHeader className="flex flex-row items-center justify-between bg-[var(--accent)]/5 p-4 rounded-t-[var(--radius)]">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Clock className="text-[var(--accent)] w-5 h-5" />
                      </div>
                      <Typography variant="h4">Dinner</Typography>
                    </div>
                    {WEEKLY_MENU[selectedDay].dinner.type === "veg" ? (
                      <Leaf className="text-green-600" size={20} />
                    ) : (
                      <CircleDot className="text-red-600" size={20} />
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {WEEKLY_MENU[selectedDay].dinner.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-[var(--accent)] shrink-0" />
                          <Typography className="text-base">{item}</Typography>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-4 border-t border-dashed border-[var(--border)]">
                      <Typography variant="small" className="italic">Delivered between 7:30 PM - 8:30 PM</Typography>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[var(--radius)] border border-[var(--border)] space-y-4">
              <div className="flex items-center gap-2 text-[var(--primary)] font-bold">
                <Info size={20} />
                <Typography variant="h4" className="!text-[var(--primary)]">Kitchen Philosophy</Typography>
              </div>
              <Typography className="leading-relaxed">
                "We believe that food is the soul of a home. My kitchen uses heirloom recipes passed down through generations. We source our spices directly from local farmers and use cold-pressed oils for all our preparations. No artificial colors or preservatives are ever used in Naari's Kitchen."
              </Typography>
            </div>
          </div>

          {/* Sidebar: Subscription Plans */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <Card className="shadow-2xl border-[var(--primary)]/20 overflow-visible">
                <div className="absolute -top-4 left-6 bg-[var(--accent)] text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                  BEST VALUE PLANS
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="font-serif text-2xl">Subscription Plans</CardTitle>
                  <Typography variant="small">Secure your meals and save more.</Typography>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Plan Selector */}
                  <div className="space-y-3">
                    <Typography className="font-bold text-sm uppercase tracking-wider">1. Select Duration</Typography>
                    <div className="grid grid-cols-3 gap-2">
                      {(["daily", "weekly", "monthly"] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPlan(p)}
                          className={cn(
                            "py-3 rounded-xl text-sm font-bold transition-all border-2 capitalize",
                            plan === p 
                              ? "bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]" 
                              : "bg-gray-50 border-transparent text-[var(--muted-foreground)] hover:bg-gray-100"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Meal Selection */}
                  <div className="space-y-3">
                    <Typography className="font-bold text-sm uppercase tracking-wider">2. Select Meals</Typography>
                    <div className="grid grid-cols-3 gap-2">
                      {(["lunch", "dinner", "both"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMeals(m)}
                          className={cn(
                            "py-3 rounded-xl text-sm font-bold transition-all border-2 capitalize",
                            meals === m 
                              ? "bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]" 
                              : "bg-gray-50 border-transparent text-[var(--muted-foreground)] hover:bg-gray-100"
                          )}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-[var(--background)] p-6 rounded-2xl border border-[var(--border)] space-y-4">
                    <div className="flex justify-between items-center">
                      <Typography className="text-sm">Price per meal</Typography>
                      <Typography className="font-bold">₹{pricing[plan]}</Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography className="text-sm">Number of meals</Typography>
                      <Typography className="font-bold">{mealMultiplier * daysMultiplier}</Typography>
                    </div>
                    <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
                      <Typography variant="h4" className="!text-lg">Total Amount</Typography>
                      <div className="text-right">
                        <Typography variant="h3" className="!text-[var(--accent)] font-serif">₹{totalPrice}</Typography>
                        {plan !== "daily" && (
                          <Typography variant="small" className="text-[var(--primary)] font-bold">
                            Saved ₹{(pricing.daily - pricing[plan]) * mealMultiplier * daysMultiplier}
                          </Typography>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button className="w-full py-6 text-lg shadow-lg shadow-[var(--primary)]/20">
                    Subscribe Now
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-[var(--muted-foreground)] text-xs">
                    <ShieldCheck size={14} />
                    Secure Payment & Satisfaction Guarantee
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact */}
              <div className="bg-[var(--secondary)]/30 p-6 rounded-[var(--radius)] border border-[var(--border)] text-center">
                <Typography variant="h4" className="mb-2">Need Customization?</Typography>
                <Typography variant="small" className="mb-4">Chat with the chef for specific dietary requirements or corporate orders.</Typography>
                <Button variant="outline" className="w-full">Message Chef</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
