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
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <Typography variant="h2" className="font-serif tracking-tight">Feedback</Typography>
          <Typography className="text-muted-foreground">View feedback and ratings from users.</Typography>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-4 bg-white rounded-2xl shadow-sm border border-muted flex items-center gap-4">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
              <Star size={20} fill="currentColor" />
            </div>
            <div>
              <Typography variant="h3" className="leading-none mb-1">4.8</Typography>
              <Typography variant="small" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Average</Typography>
            </div>
          </div>
        </div>
      </header>

      {feedbacks.length === 0 ? (
        <Card className="rounded-[40px] border-none shadow-sm bg-white/50 border-2 border-dashed border-muted py-24 text-center">
          <MessageSquare size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
          <Typography className="text-muted-foreground font-black uppercase tracking-widest text-xs">No feedback found.</Typography>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {feedbacks.map((f, i) => (
            <Card 
              key={f._id} 
              className="group relative border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[36px] bg-white overflow-hidden flex flex-col"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20 transition-colors">
                <Quote size={40} />
              </div>
              
              <CardContent className="p-8 flex flex-col h-full relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={cn(
                        "transition-transform group-hover:scale-110",
                        i < (f.rating || 5) ? "text-accent fill-accent" : "text-muted fill-muted"
                      )} 
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>

                <Typography className="text-foreground font-medium leading-relaxed mb-8 flex-1 italic group-hover:text-primary transition-colors">
                  "{f.comment || "No written feedback provided."}"
                </Typography>

                <div className="pt-6 border-t border-muted flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground font-serif text-lg font-bold group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      {f.user?.name?.[0] || <User size={18} />}
                    </div>
                    <div>
                      <Typography className="text-sm font-black tracking-tight">{f.user?.name || "Guest User"}</Typography>
                      <Typography variant="small" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Verified User</Typography>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="rounded-xl h-10 w-10 p-0 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-xl h-10 w-10 p-0 text-muted-foreground hover:text-primary transition-colors">
                      <CheckCircle2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
              
              {/* Subtle hover indicator */}
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary to-accent transition-all duration-700" />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
