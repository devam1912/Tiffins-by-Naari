import React, { useState } from "react";
import {
  Search,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  ShieldAlert,
  User,
  ChevronRight,
  X
} from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Typography } from "./ui/Typography";
import { cn } from "../lib/utils";

// ══════════════════════════════════════════
// 1. USER DETAILS MODAL
// ══════════════════════════════════════════

function UserDetailsModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg border-none shadow-2xl rounded-[40px] overflow-hidden bg-white animate-in zoom-in-95 duration-300">
        <div className="h-2 bg-[#8FA873]" />
        <div className="p-8 pb-4 flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 bg-[#F4F4E4] rounded-2xl flex items-center justify-center font-serif text-2xl font-bold text-[#5a7a50]">
              {user.name?.[0] || "?"}
            </div>
            <div>
              <h3 style={{ fontFamily: "'Lora',serif", fontSize: 24, fontWeight: 700, color: "#2d3b2d" }} className="mb-1">{user.name}</h3>
              <p className="text-[#888] text-[10px] uppercase tracking-widest font-black m-0">User Details</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full h-10 w-10 p-0 flex items-center justify-center hover:bg-[#F4F4E4] transition-colors"><X size={20} className="text-[#5a7a50]" /></button>
        </div>

        <div className="p-8 space-y-6 pt-2">
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-sm font-medium">
              <Mail className="text-[#8FA873] h-5 w-5" />
              <div className="flex-1">
                <p className="text-[10px] uppercase font-black text-[#888] tracking-widest m-0">Email Address</p>
                <p className="text-[#2d3b2d] font-bold m-0">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <Phone className="text-[#8FA873] h-5 w-5" />
              <div className="flex-1">
                <p className="text-[10px] uppercase font-black text-[#888] tracking-widest m-0">Contact Phone</p>
                <p className="text-[#2d3b2d] font-bold m-0">{user.phone || "Not Verified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <MapPin className="text-[#8FA873] h-5 w-5" />
              <div className="flex-1">
                <p className="text-[10px] uppercase font-black text-[#888] tracking-widest m-0">Default Address</p>
                <p className="text-[#2d3b2d] font-bold m-0 line-clamp-2">{user.address || "No address listed"}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[rgba(143,174,142,0.2)] space-y-4">
            <div className="flex justify-between items-center bg-[#F4F4E4] p-4 rounded-2xl text-sm font-medium">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5a7a50] m-0">User Role</p>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border",
                  user.role === 'provider' ? 'bg-[#8FAE8E]/20 text-[#5a7a50] border-[#8FAE8E]/30' : 'bg-blue-100/50 text-[#1976d2] border-blue-200'
                )}>
                  {user.role || 'customer'}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center bg-[#F4F4E4] p-4 rounded-2xl text-sm font-medium mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5a7a50] m-0">Verification Status</p>
              {user.isVerified ? (
                <div className="flex items-center gap-1.5 text-[#2e7d32]">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verified User</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[#c62828]">
                  <ShieldAlert size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Unverified</span>
                </div>
              )}
            </div>
            <button className="w-full rounded-2xl h-14 font-black bg-white border-2 border-[rgba(143,174,142,0.3)] text-[#5a7a50] hover:bg-[#F4F4E4] transition-colors" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// 2. MAIN COMPONENT
// ══════════════════════════════════════════

export const AdminUsers = ({ users = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {selectedUser && <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />}

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="admin-title">Users</h2>
          <p className="admin-subtitle m-0">Manage your platform's users.</p>
        </div>

        <div className="relative group min-w-[320px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a7a50] opacity-50 group-focus-within:opacity-100 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 pl-12 pr-6 rounded-2xl border-[1.5px] border-[rgba(143,174,142,0.3)] bg-white/80 backdrop-blur-md focus:border-[#8FAE8E] focus:bg-white transition-all outline-none font-bold text-sm shadow-[0_4px_16px_rgba(143,174,142,0.06)]"
          />
        </div>
      </header>

      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="table-header">
              <tr>
                <th style={{ padding: "20px 24px" }} className="text-[11px] font-black uppercase tracking-widest text-[#5a7a50]">User</th>
                <th style={{ padding: "20px 24px" }} className="text-[11px] font-black uppercase tracking-widest text-[#5a7a50]">Contact Info</th>
                <th style={{ padding: "20px 24px" }} className="text-[11px] font-black uppercase tracking-widest text-[#5a7a50]">Status & Role</th>
                <th style={{ padding: "20px 24px" }} className="text-[11px] font-black uppercase tracking-widest text-[#5a7a50] text-right w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(143,174,142,0.1)]">
              {filteredUsers.length > 0 ? filteredUsers.map((user, i) => (
                <tr key={user._id} className="table-row group">
                  <td className="table-cell">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#F4F4E4] rounded-2xl flex items-center justify-center font-serif font-black text-[#5a7a50] group-hover:scale-110 transition-transform shadow-inner">
                        {user.name?.[0] || <User size={20} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black tracking-tight text-[#2d3b2d] group-hover:text-[#5a7a50] transition-colors">{user.name}</span>
                        <span className="text-[10px] text-[#888] font-bold uppercase tracking-widest">ID: {user._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#555]">
                        <Mail size={14} className="text-[#8FAE8E]" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#999]">
                        <Phone size={12} className="text-[#8FAE8E]" />
                        <span>{user.phone || "No Phone"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex flex-col gap-2">
                      {user.isVerified ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8f5e9] text-[#2e7d32] rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-[#c8e6c9] w-fit">
                          <ShieldCheck size={14} />
                          Verified
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f5f5f5] text-[#757575] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#e0e0e0] w-fit">
                          <ShieldAlert size={14} />
                          Unverified
                        </div>
                      )}
                      <span className={cn(
                        "w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border",
                        user.role === 'provider' ? 'bg-[#fff3e0] text-[#ef6c00] border-[#ffe0b2]' : 'bg-[#e3f2fd] text-[#1565c0] border-[#bbdefb]'
                      )}>
                        {user.role || 'customer'}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell text-right">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="px-4 py-2 rounded-xl text-[#5a7a50] hover:bg-[#8FAE8E]/10 transition-all font-bold text-[11px] uppercase flex items-center justify-end w-full gap-2 group/btn border-none"
                    >
                      <span className="group-hover/btn:text-[#2d3b2d] transition-colors">Details</span>
                      <ChevronRight size={14} className="text-[#8FAE8E] group-hover/btn:translate-x-1 group-hover/btn:text-[#2d3b2d] transition-all" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-24 text-center">
                    <div className="space-y-2 opacity-50">
                      <Search size={40} className="mx-auto text-[#8FAE8E] mb-4" />
                      <p className="font-black uppercase tracking-widest text-[#888] text-xs m-0">No users found</p>
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
