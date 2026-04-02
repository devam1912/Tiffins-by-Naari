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
      <header className="mb-8">
        <h2 className="admin-title">Menus</h2>
        <p className="admin-subtitle m-0">View all kitchen menus.</p>
      </header>

      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="table-header">
              <tr>
                <th style={{ padding: "20px 24px" }} className="text-[11px] font-black uppercase tracking-widest text-[#5a7a50]">Kitchen</th>
                <th style={{ padding: "20px 24px" }} className="text-[11px] font-black uppercase tracking-widest text-[#5a7a50]">Cuisine Type</th>
                <th style={{ padding: "20px 24px" }} className="text-[11px] font-black uppercase tracking-widest text-[#5a7a50]">Menu Items</th>
                <th style={{ padding: "20px 24px" }} className="text-[11px] font-black uppercase tracking-widest text-[#5a7a50] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(143,174,142,0.1)]">
              {menus.length > 0 ? menus.map((menu, i) => (
                <tr key={menu._id} className="table-row group">
                  <td className="table-cell">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#8FAE8E]/20 rounded-2xl flex items-center justify-center text-[#5a7a50] group-hover:rotate-12 transition-transform shadow-inner">
                        <Utensils size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black tracking-tight text-[#2d3b2d] group-hover:text-[#5a7a50] transition-colors">
                          {menu.provider?.businessName || "Unknown Kitchen"}
                        </span>
                        <span className="text-[10px] text-[#888] font-bold uppercase tracking-widest">
                          Owner: {menu.provider?.ownerName || "Staff"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="inline-flex px-3 py-1 bg-[#8FAE8E]/20 text-[#5a7a50] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#8FAE8E]/30">
                      {menu.cuisineType || "Mixed"}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-lg text-[#2d3b2d]">
                        {menu.menuItems?.length || 0}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#aaa]">Dishes</span>
                    </div>
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex justify-end gap-2">
                      <button className="rounded-xl h-10 w-10 p-0 flex items-center justify-center text-[#aaa] hover:text-[#5a7a50] hover:bg-[#F4F4E4] transition-colors border-none bg-transparent">
                        <Info size={18} />
                      </button>
                      <button className="rounded-xl h-10 w-10 p-0 flex items-center justify-center text-[#aaa] hover:text-[#c62828] hover:bg-[#ffebee] transition-colors border-none bg-transparent">
                        <Trash2 size={18} />
                      </button>
                      <button className="rounded-xl h-10 px-4 group/btn flex items-center bg-transparent border-[1.5px] border-[rgba(143,174,142,0.3)] text-[#5a7a50] hover:bg-[#F4F4E4] transition-colors">
                        <span className="text-[10px] font-black uppercase tracking-widest mr-2 group-hover/btn:text-[#2d3b2d]">View</span>
                        <ExternalLink size={14} className="text-[#8FAE8E] group-hover/btn:text-[#2d3b2d]" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-24 text-center">
                    <div className="space-y-4 opacity-50">
                      <Utensils size={40} className="mx-auto text-[#8FAE8E]" />
                      <p className="font-black uppercase tracking-widest text-[#888] text-xs m-0">No menus found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
