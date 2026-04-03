import React from "react";
import {
  MessageSquare,
  Star,
  Quote,
  User,
  Calendar,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { Typography } from "./ui/Typography";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";

export const AdminFeedback = ({ feedbacks = [], loading }) => {
  if (loading) return (
    <div className="py-24 flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <Typography variant="small" className="font-black uppercase tracking-widest text-muted-foreground">Loading feedback...</Typography>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="admin-title">Feedback</h2>
          <p className="admin-subtitle m-0">View feedback and ratings from users.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_4px_16px_rgba(143,174,142,0.06)] border-[1.5px] border-[rgba(143,174,142,0.3)] flex items-center gap-4">
            <div className="w-10 h-10 bg-[#f59e0b]/20 rounded-xl flex items-center justify-center text-[#f59e0b]">
              <Star size={20} fill="currentColor" />
            </div>
            <div>
              <h3 style={{ fontFamily: "'Lora',serif", fontSize: 24, fontWeight: 700, color: "#2d3b2d" }} className="leading-none m-0 mb-1">4.8</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#888] m-0">Average</p>
            </div>
          </div>
        </div>
      </header>

      {feedbacks.length === 0 ? (
        <div className="rounded-[40px] shadow-sm bg-[rgba(255,255,255,0.4)] border-2 border-dashed border-[#8FAE8E]/30 py-24 text-center">
          <MessageSquare size={48} className="mx-auto text-[#8FAE8E] opacity-50 mb-4" />
          <p className="text-[#888] font-black uppercase tracking-widest text-xs m-0">No feedback found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {feedbacks.map((f, i) => (
            <div
              key={f._id}
              className="stat-card group relative overflow-hidden flex flex-col"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute top-6 right-8 text-[#8FAE8E]/10 group-hover:text-[#8FAE8E]/20 transition-colors">
                <Quote size={40} />
              </div>

              <div className="p-8 flex flex-col h-full relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={cn(
                        "transition-transform group-hover:scale-110",
                        i < (f.rating || 5) ? "text-[#f59e0b] fill-[#f59e0b]" : "text-[#d1d5db] fill-[#d1d5db]"
                      )}
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>

                <p className="text-[#2d3b2d] font-medium leading-relaxed mb-8 flex-1 italic group-hover:text-[#5a7a50] transition-colors m-0 text-sm">
                  "{f.comment || "No written feedback provided."}"
                </p>

                <div className="pt-6 border-t border-[rgba(143,174,142,0.2)] flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F4F4E4] rounded-2xl flex items-center justify-center text-[#5a7a50] font-serif text-lg font-bold group-hover:bg-[#8FAE8E]/10 group-hover:text-[#5a7a50] transition-all shadow-inner">
                      {f.user?.name?.[0] || <User size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-black tracking-tight text-[#2d3b2d] m-0">{f.user?.name || "Guest User"}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#aaa] m-0">Verified User</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="rounded-xl h-10 w-10 p-0 flex items-center justify-center text-[#aaa] hover:text-[#c62828] hover:bg-[#ffebee] transition-colors border-none bg-transparent">
                      <Trash2 size={16} />
                    </button>
                    <button className="rounded-xl h-10 w-10 p-0 flex items-center justify-center text-[#aaa] hover:text-[#2e7d32] hover:bg-[#e8f5e9] transition-colors border-none bg-transparent">
                      <CheckCircle2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtle hover indicator */}
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-[#8FA873] to-[#6b8a5e] transition-all duration-700" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
