import React from "react";
import {
  Utensils,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Typography } from "./ui/Typography";
import { cn } from "../lib/utils";
import { useState } from "react";

export const AdminMenu = ({ menus = [], loading, onApprove, onReject, onViewDetails }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-[#8FA873] border-t-transparent rounded-full animate-spin" />
      <Typography variant="small" className="font-black uppercase tracking-widest text-[#5a7a50]">Synchronizing Menus...</Typography>
    </div>
  );

  const getItemsCount = (weekMenu) => {
    if (!weekMenu) return 0;
    return weekMenu.reduce((acc, day) => {
      const lunchCount = day.lunch?.items?.length || 0;
      const dinnerCount = day.dinner?.items?.length || 0;
      return acc + lunchCount + dinnerCount;
    }, 0);
  };

  const StatusBadge = ({ menu }) => {
    if (menu.isApproved) return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-black uppercase tracking-wider">
        <CheckCircle2 size={12} /> Approved
      </span>
    );
    if (menu.submittedForApproval) return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-black uppercase tracking-wider">
        <Clock size={12} /> Pending Review
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-wider">
        <XCircle size={12} /> Unsubmitted
      </span>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="mb-8">
        <h2 className="admin-title">Menu Approvals</h2>
        <p className="admin-subtitle m-0">Review and verify kitchen meal plans.</p>
      </header>

      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="table-header">
              <tr>
                <th style={{ padding: "20px 24px" }} className="text-[11px] font-black uppercase tracking-widest text-[#5a7a50]">Kitchen</th>
                <th style={{ padding: "20px 24px" }} className="text-[11px] font-black uppercase tracking-widest text-[#5a7a50]">Status</th>
                <th style={{ padding: "20px 24px" }} className="text-[11px] font-black uppercase tracking-widest text-[#5a7a50]">Total Items</th>
                <th style={{ padding: "20px 24px" }} className="text-[11px] font-black uppercase tracking-widest text-[#5a7a50] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(143,174,142,0.1)]">
              {menus.length > 0 ? menus.map((menu) => (
                <React.Fragment key={menu._id}>
                  <tr className="table-row group">
                    <td className="table-cell">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#8FAE8E]/20 rounded-2xl flex items-center justify-center text-[#5a7a50] shadow-inner">
                          <Utensils size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black tracking-tight text-[#2d3b2d]">
                            {menu.provider?.businessName || "Unknown Kitchen"}
                          </span>
                          <span className="text-[10px] text-[#888] font-bold uppercase tracking-widest">
                            Owner: {menu.provider?.ownerName || "Member"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <StatusBadge menu={menu} />
                    </td>
                    <td className="table-cell">
                      <div className="font-black text-[#2d3b2d]">
                        {getItemsCount(menu.weekMenu)} <span className="text-[10px] text-[#aaa] uppercase ml-1">Items</span>
                      </div>
                    </td>
                    <td className="table-cell text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setExpandedMenu(expandedMenu === menu._id ? null : menu._id)}
                          className="h-10 px-4 rounded-xl flex items-center gap-2 border-[1.5px] border-[rgba(143,174,142,0.2)] text-[#5a7a50] hover:bg-white transition-all font-black text-[10px] uppercase tracking-widest"
                        >
                          {expandedMenu === menu._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          Details
                        </button>

                        {menu.submittedForApproval && !menu.isApproved && (
                          <button
                            onClick={() => onApprove(menu)}
                            className="h-10 px-4 rounded-xl flex items-center bg-[#8FA873] text-white hover:bg-[#6b8a5e] shadow-lg shadow-[#8FA873]/20 transition-all font-black text-[10px] uppercase tracking-widest"
                          >
                            Approve
                          </button>
                        )}

                        {(menu.submittedForApproval || menu.isApproved) && (
                          <button
                            onClick={() => onReject(menu)}
                            className="h-10 px-4 rounded-xl flex items-center border-2 border-red-100 text-red-500 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-widest"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Details Row */}
                  {expandedMenu === menu._id && (
                    <tr className="bg-white/40">
                      <td colSpan={4} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {menu.weekMenu?.map((day) => (
                            <div key={day.day} className="p-4 bg-white/60 rounded-2xl border border-[rgba(143,174,142,0.1)]">
                              <Typography className="text-[10px] font-black uppercase tracking-widest text-[#8FA873] mb-3">{day.day}</Typography>
                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <div className="text-[9px] font-black text-[#aaa] uppercase">Lunch</div>
                                    <div className="text-[10px] font-black text-[#6b8a5e]">₹{day.lunch?.price || 0}</div>
                                  </div>
                                  <div className="space-y-1">
                                    {day.lunch?.items?.map(item => (
                                      <div key={item._id} className="text-[13px] font-bold text-[#2d3b2d] flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#8FA873]/30" />
                                        {item.name}
                                      </div>
                                    ))}
                                    {(!day.lunch?.items || day.lunch.items.length === 0) && <div className="text-[11px] text-[#ccc] italic">No items</div>}
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <div className="text-[9px] font-black text-[#aaa] uppercase">Dinner</div>
                                    <div className="text-[10px] font-black text-[#6b8a5e]">₹{day.dinner?.price || 0}</div>
                                  </div>
                                  <div className="space-y-1">
                                    {day.dinner?.items?.map(item => (
                                      <div key={item._id} className="text-[13px] font-bold text-[#2d3b2d] flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#8FA873]/30" />
                                        {item.name}
                                      </div>
                                    ))}
                                    {(!day.dinner?.items || day.dinner.items.length === 0) && <div className="text-[11px] text-[#ccc] italic">No items</div>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )) : (
                <tr>
                  <td colSpan={4} className="p-24 text-center">
                    <div className="space-y-4 opacity-50">
                      <Utensils size={40} className="mx-auto text-[#8FAE8E]" />
                      <p className="font-black uppercase tracking-widest text-[#888] text-xs m-0">No menus pending review.</p>
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
