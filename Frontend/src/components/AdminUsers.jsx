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
      <Card className="w-full max-w-lg border-none shadow-2xl rounded-[40px] overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="h-2 bg-primary" />
        <div className="p-8 pb-4 flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center font-serif text-2xl font-bold text-primary">
              {user.name?.[0] || "?"}
            </div>
            <div>
              <Typography variant="h3">{user.name}</Typography>
              <Typography variant="small" className="text-muted-foreground uppercase tracking-widest font-black">User Details</Typography>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full h-10 w-10 p-0"><X size={20} /></Button>
        </div>
        
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm font-medium">
              <Mail className="text-primary h-5 w-5" />
              <div className="flex-1">
                <Typography variant="small" className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Email Address</Typography>
                <Typography>{user.email}</Typography>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <Phone className="text-primary h-5 w-5" />
              <div className="flex-1">
                <Typography variant="small" className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Contact Phone</Typography>
                <Typography>{user.phone || "Not Verified"}</Typography>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <MapPin className="text-primary h-5 w-5" />
              <div className="flex-1">
                <Typography variant="small" className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Default Address</Typography>
                <Typography className="line-clamp-2">{user.address || "No address listed"}</Typography>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-muted space-y-4">
            <div className="flex justify-between items-center bg-muted/20 p-4 rounded-2xl text-sm font-medium">
              <Typography variant="small" className="font-black uppercase tracking-[0.2em] text-muted-foreground">User Role</Typography>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                  user.role === 'provider' ? 'bg-primary/20 text-primary' : 'bg-blue-100 text-blue-700'
                )}>
                  {user.role || 'customer'}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center bg-muted/20 p-4 rounded-2xl text-sm font-medium mb-4">
              <Typography variant="small" className="font-black uppercase tracking-[0.2em] text-muted-foreground">Verification Status</Typography>
              {user.isVerified ? (
                <div className="flex items-center gap-1.5 text-primary">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verified User</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <ShieldAlert size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Unverified</span>
                </div>
              )}
            </div>
            <Button className="w-full rounded-2xl h-14 font-black" variant="outline" onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
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

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <Typography variant="h2" className="font-serif tracking-tight">Users</Typography>
          <Typography className="text-muted-foreground">Manage your platform's users.</Typography>
        </div>
        
        <div className="relative group min-w-[320px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 pl-12 pr-6 rounded-2xl border-2 border-muted bg-white focus:border-primary transition-all outline-none font-bold text-sm shadow-sm"
          />
        </div>
      </header>

      <Card className="rounded-[40px] border-none shadow-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/30 border-b border-muted">
                  <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">User</th>
                  <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Contact Info</th>
                  <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Status & Role</th>
                  <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-right w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/30">
                {filteredUsers.length > 0 ? filteredUsers.map((user, i) => (
                  <tr key={user._id} className="hover:bg-muted/10 transition-colors group">
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center font-serif font-black text-primary group-hover:scale-110 transition-transform">
                          {user.name?.[0] || <User size={20} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black tracking-tight text-foreground group-hover:text-primary transition-colors">{user.name}</span>
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">ID: {user._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                          <Mail size={14} className="text-primary/40" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                          <Phone size={12} className="text-primary/40" />
                          <span>{user.phone || "No Phone"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col gap-2">
                        {user.isVerified ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-primary/5 w-fit">
                            <ShieldCheck size={14} />
                            Verified
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground rounded-full text-[10px] font-black uppercase tracking-widest border border-muted-foreground/10 w-fit">
                            <ShieldAlert size={14} />
                            Unverified
                          </div>
                        )}
                        <span className={cn(
                          "w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
                          user.role === 'provider' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                        )}>
                          {user.role || 'customer'}
                        </span>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <Button 
                        onClick={() => setSelectedUser(user)}
                        className="rounded-xl h-10 px-4 group/btn" 
                        variant="ghost"
                      >
                        <Typography className="text-[10px] font-black uppercase tracking-widest mr-2 group-hover/btn:text-primary transition-colors">Details</Typography>
                        <ChevronRight size={14} className="text-muted-foreground group-hover/btn:translate-x-1 group-hover/btn:text-primary transition-all" />
                      </Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-24 text-center">
                      <div className="space-y-2 opacity-40">
                        <Search size={40} className="mx-auto text-muted-foreground mb-4" />
                        <Typography className="font-black uppercase tracking-widest text-xs">No users found</Typography>
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