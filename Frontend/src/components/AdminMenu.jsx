import React from "react";
import { 
  Utensils, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Typography } from "./ui/Typography";
import { cn } from "../lib/utils";

export const AdminMenu = ({ menus = [], loading }) => {
  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <Typography variant="small" className="font-black uppercase tracking-widest text-muted-foreground">Loading menus...</Typography>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="space-y-1">
        <Typography variant="h2" className="font-serif tracking-tight">Menus</Typography>
        <Typography className="text-muted-foreground">View all kitchen menus.</Typography>
      </header>

      <Card className="rounded-[40px] border-none shadow-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/30 border-b border-muted">
                  <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Kitchen</th>
                  <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Cuisine Type</th>
                  <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Menu Items</th>
                  <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/30">
                {menus.length > 0 ? menus.map((menu, i) => (
                  <tr key={menu._id} className="hover:bg-muted/10 transition-colors group">
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                          <Utensils size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                            {menu.provider?.businessName || "Unknown Kitchen"}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            Owner: {menu.provider?.ownerName || "Staff"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="inline-flex px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/5">
                        {menu.cuisineType || "Mixed"}
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-2">
                        <Typography className="font-black text-lg text-foreground">
                          {menu.menuItems?.length || 0}
                        </Typography>
                        <Typography variant="small" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dishes</Typography>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="rounded-xl h-10 w-10 p-0 text-muted-foreground hover:text-primary">
                          <Info size={18} />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-xl h-10 w-10 p-0 text-muted-foreground hover:text-destructive">
                          <Trash2 size={18} />
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl h-10 px-4 group/btn">
                          <span className="text-[10px] font-black uppercase tracking-widest mr-2 group-hover/btn:text-primary">View</span>
                          <ExternalLink size={14} className="text-muted-foreground group-hover/btn:text-primary" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-24 text-center">
                      <div className="space-y-4 opacity-40">
                        <Utensils size={40} className="mx-auto text-muted-foreground" />
                        <Typography className="font-black uppercase tracking-widest text-xs">No menus found.</Typography>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};