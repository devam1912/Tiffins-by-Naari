import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  LogOut, 
  LayoutDashboard, 
  Clock, 
  Users, 
  ChefHat, 
  Utensils, 
  Package, 
  MessageSquare,
  AlertCircle,
  Eye,
  CheckCircle,
  XCircle,
  X
} from "lucide-react";

// Internal Components
import { AdminUsers } from "../../components/AdminUsers";
import { AdminMenu } from "../../components/AdminMenu";
import { AdminFeedback } from "../../components/AdminFeedback";
import { AdminOverview } from "../../components/AdminOverview";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Typography } from "../../components/ui/Typography";
import { cn } from "../../lib/utils";

// ══════════════════════════════════════════
// 1. MODAL COMPONENTS
// ══════════════════════════════════════════

function ApproveModal({ provider, onClose, onApprove, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[32px] overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="h-2 bg-gradient-to-r from-primary to-accent" />
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ChefHat size={40} className="text-primary" />
          </div>
          <Typography variant="h3" className="mb-2">Approve Kitchen?</Typography>
          <Typography className="text-muted-foreground mb-8">
            Authorize <strong>{provider?.businessName}</strong>? This will enable their menu and notify <strong>{provider?.ownerName}</strong>.
          </Typography>
          <div className="flex gap-4">
            <Button variant="outline" onClick={onClose} className="flex-1 rounded-2xl">Cancel</Button>
            <Button onClick={onApprove} disabled={loading} className="flex-[2] rounded-2xl shadow-lg shadow-primary/20">
              {loading ? "Processing..." : "Confirm Approval"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RejectModal({ provider, onClose, onReject, loading }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[32px] overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="h-2 bg-destructive" />
        <CardContent className="p-8">
          <Typography variant="h3" className="mb-1">Decline Application</Typography>
          <Typography variant="small" className="text-destructive font-bold mb-6">Kitchen: {provider?.businessName}</Typography>
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reason for Rejection</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g., FSSAI document blurry..."
              className="w-full min-h-[120px] p-4 rounded-2xl border-2 border-muted bg-muted/30 focus:border-destructive focus:ring-0 transition-all outline-none text-sm"
            />
            <div className="flex gap-4">
              <Button variant="outline" onClick={onClose} className="flex-1 rounded-2xl">Back</Button>
              <Button onClick={() => onReject(reason)} disabled={!reason.trim() || loading} variant="secondary" className="flex-[2] bg-destructive text-white hover:bg-destructive/90 rounded-2xl">
                {loading ? "Sending..." : "Confirm Rejection"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ViewApplicationModal({ provider, onClose, onApprove, onReject }) {
  const isPdf = provider?.fssaiCertificate?.toLowerCase().includes(".pdf");
  const DataField = ({ label, value }) => (
    <div className="py-3 border-b border-muted last:border-0">
      <Typography variant="small" className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">{label}</Typography>
      <Typography className="font-semibold text-foreground text-sm">{value || "Not Provided"}</Typography>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="w-full max-w-2xl max-h-[90vh] border-none shadow-2xl rounded-[40px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b bg-muted/30 flex justify-between items-center">
          <div>
            <Typography variant="h3">Kitchen Dossier</Typography>
            <Typography variant="small" className="text-muted-foreground">ID: {provider?._id?.slice(-8).toUpperCase()}</Typography>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full h-10 w-10 p-0"><X size={20} /></Button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <DataField label="Business Entity" value={provider?.businessName} />
            <DataField label="Owner/Chef" value={provider?.ownerName} />
            <DataField label="FSSAI Registration" value={provider?.fssaiNumber} />
            <DataField label="Contact Email" value={provider?.email} />
            <DataField label="Phone" value={provider?.phone} />
          </div>
          <div className="space-y-4">
            <Typography variant="small" className="uppercase tracking-widest text-primary font-bold">Verification Document</Typography>
            <div className="aspect-video relative rounded-3xl border-2 border-dashed border-muted bg-muted/20 flex items-center justify-center overflow-hidden">
              {provider?.fssaiCertificate ? (
                isPdf ? (
                  <div className="text-center">
                    <Typography className="mb-4">📜 Certificate PDF</Typography>
                    <Button as="a" href={provider.fssaiCertificate} target="_blank" size="sm" className="rounded-xl">View Full PDF</Button>
                  </div>
                ) : <img src={provider.fssaiCertificate} className="w-full h-full object-contain" alt="FSSAI" />
              ) : <Typography className="text-destructive">Document missing</Typography>}
            </div>
          </div>
          {(!provider?.isApproved && !provider?.isActive) && (
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={() => { onClose(); onReject(provider); }} className="flex-1 border-destructive text-destructive hover:bg-destructive/10 rounded-2xl">Decline</Button>
              <Button onClick={() => { onClose(); onApprove(provider); }} className="flex-1 rounded-2xl shadow-lg shadow-primary/20">Approve Credentials</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════
// 2. MAIN DASHBOARD
// ══════════════════════════════════════════

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [activeNav, setActiveNav] = useState("dashboard");
  const [stats, setStats] = useState({ totalUsers: 0, totalProviders: 0, totalOrders: 0, totalRevenue: 0 });
  const [allProviders, setAllProviders] = useState([]);
  const [pending, setPending] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [allMenus, setAllMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAllData = useCallback(async () => {
    if (!token) { navigate("/login"); return; }
    try {
      const [sRes, pRes, penRes, uRes, oRes, fRes, mRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/stats", { headers }),
        axios.get("http://localhost:5000/api/admin/providers", { headers }),
        axios.get("http://localhost:5000/api/admin/providers/pending", { headers }),
        axios.get("http://localhost:5000/api/admin/users", { headers }),
        axios.get("http://localhost:5000/api/admin/orders", { headers }),
        axios.get("http://localhost:5000/api/feedback", { headers }),
        axios.get("http://localhost:5000/api/tiffins/menu", { headers })
      ]);
      setStats(sRes.data);
      setAllProviders(pRes.data || []);
      setPending(penRes.data.providers || penRes.data || []);
      setAllUsers(uRes.data || []);
      setAllOrders(oRes.data || []);
      setAllFeedbacks(fRes.data.feedbacks || []);
      setAllMenus(mRes.data.menus || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }, [token, navigate, headers]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  const confirmApprove = async () => {
    if (!approveTarget) return;
    setActionLoading(true);
    try {
      await axios.patch(`http://localhost:5000/api/tiffins/approve/${approveTarget._id}`, {}, { headers });
      setPending(p => p.filter(x => x._id !== approveTarget._id));
      setApproveTarget(null);
      fetchAllData();
    } catch { alert("Error approving provider"); }
    finally { setActionLoading(false); }
  };

  const confirmReject = async (reason) => {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      await axios.patch(`http://localhost:5000/api/tiffins/reject/${rejectTarget._id}`, { reason }, { headers });
      setPending(p => p.filter(x => x._id !== rejectTarget._id));
      setRejectTarget(null);
      fetchAllData();
    } catch { alert("Error rejecting provider"); }
    finally { setActionLoading(false); }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pending", label: "Approvals", icon: Clock, badge: pending.length },
    { id: "providers", label: "Kitchens", icon:ChefHat },
    { id: "users", label: "Users", icon: Users },
    { id: "menus", label: "Menus", icon: Utensils },
    { id: "orders", label: "Orders", icon: Package },
    { id: "feedbacks", label: "Feedback", icon: MessageSquare }
  ];

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-lightbg gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <Typography className="font-bold text-primary animate-pulse uppercase tracking-[0.2em] text-xs">Synchronizing Portal...</Typography>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-lightbg font-sans selection:bg-primary/20">
      {approveTarget && <ApproveModal provider={approveTarget} onClose={() => setApproveTarget(null)} onApprove={confirmApprove} loading={actionLoading} />}
      {rejectTarget && <RejectModal provider={rejectTarget} onClose={() => setRejectTarget(null)} onReject={confirmReject} loading={actionLoading} />}
      {viewTarget && <ViewApplicationModal provider={viewTarget} onClose={() => setViewTarget(null)} onApprove={setApproveTarget} onReject={setRejectTarget} />}

      {/* SIDEBAR */}
      <aside className="w-72 bg-primary text-white flex flex-col h-screen sticky top-0 shadow-2xl">
        <div className="p-8 pb-12">
          <Typography variant="h3" className="font-serif !text-white leading-none">Naari</Typography>
          <Typography variant="small" className="!text-white/60 font-bold uppercase tracking-widest mt-1">Admin Panel</Typography>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group",
                activeNav === item.id ? "bg-white text-primary shadow-lg shadow-black/10 scale-[1.02]" : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className={cn("transition-transform group-hover:scale-110", activeNav === item.id ? "text-primary" : "text-white/60")} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-black", activeNav === item.id ? "bg-primary text-white" : "bg-accent text-white")}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-4 text-white/60 hover:text-white hover:bg-destructive/20 rounded-2xl px-6 py-6"
            onClick={() => { localStorage.clear(); navigate("/login"); }}
          >
            <LogOut size={20} />
            <span className="font-bold">Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 max-h-screen overflow-y-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {activeNav === "dashboard" && (
            <div className="space-y-10">
              <AdminOverview stats={stats} activities={[]} />
              {pending.length > 0 && (
                <Card className="bg-primary border-none shadow-xl shadow-primary/20 rounded-[40px] overflow-hidden group">
                  <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center animate-pulse">
                        <AlertCircle size={32} className="text-white" />
                      </div>
                      <div>
                        <Typography variant="h3" className="!text-white mb-2 leading-none">Reviews Pending</Typography>
                        <Typography className="!text-white/70">You have <strong>{pending.length}</strong> applications waiting for verification.</Typography>
                      </div>
                    </div>
                    <Button onClick={() => setActiveNav("pending")} className="bg-white text-primary hover:bg-white/90 rounded-2xl px-10 h-14 font-black shadow-xl shadow-black/10">
                      Open Queue
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeNav === "pending" && (
            <div className="space-y-8">
              <header>
                <Typography variant="h2" className="mb-2">Incoming Applications</Typography>
                <Typography className="text-muted-foreground">Verification queue for new kitchen partners.</Typography>
              </header>
              {pending.length === 0 ? (
                <div className="py-24 text-center bg-white/50 rounded-[40px] border-2 border-dashed border-muted">
                  <Typography className="text-muted-foreground font-medium">All caught up! The queue is empty.</Typography>
                </div>
              ) : (
                <div className="grid gap-4">
                  {pending.map(p => (
                    <Card key={p._id} className="border-none shadow-sm hover:shadow-md transition-all rounded-[28px] group">
                      <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center font-serif text-xl font-bold text-primary">
                            {p.businessName[0]}
                          </div>
                          <div>
                            <Typography className="font-black text-lg leading-none mb-1">{p.businessName}</Typography>
                            <Typography variant="small" className="text-muted-foreground uppercase tracking-widest leading-none">{p.ownerName} • {p.email}</Typography>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setViewTarget(p)} className="rounded-xl px-6 h-12">Inspect</Button>
                          <Button onClick={() => setApproveTarget(p)} className="rounded-xl px-6 h-12">Quick Approve</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="section-container">
            {activeNav === "users" && <AdminUsers users={allUsers} />}
            {activeNav === "feedbacks" && <AdminFeedback feedbacks={allFeedbacks} loading={loading} />}
            {activeNav === "menus" && <AdminMenu menus={allMenus} loading={loading} />}
            
            {activeNav === "orders" && (
              <div className="space-y-8">
                <Typography variant="h2">Order Management</Typography>
                <Card className="rounded-[32px] border-none shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    <table className="w-full text-left">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-muted/30">
                        {allOrders.map(o => (
                          <tr key={o._id} className="hover:bg-muted/20 transition-colors">
                            <td className="p-6 font-bold text-sm">#{o._id.slice(-6).toUpperCase()}</td>
                            <td className="p-6 text-sm">{o.user?.name || "Guest"}</td>
                            <td className="p-6 font-black text-primary text-sm">₹{o.totalPrice}</td>
                            <td className="p-6">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm",
                                o.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                              )}>
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeNav === "providers" && (
              <div className="space-y-8">
                <Typography variant="h2">Tiffin Providers</Typography>
                <Card className="rounded-[32px] border-none shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    <table className="w-full text-left">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Business</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Owner</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right w-[140px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-muted/30">
                        {allProviders.map(p => (
                          <tr key={p._id} className="hover:bg-muted/20 transition-colors">
                            <td className="p-6 font-bold text-sm">{p.businessName}</td>
                            <td className="p-6 text-sm">{p.ownerName}</td>
                            <td className="p-6 text-sm">{p.phone}</td>
                            <td className="p-6">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm",
                                p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              )}>
                                {p.isActive ? "ACTIVE" : "INACTIVE"}
                              </span>
                            </td>
                            <td className="p-6 text-right">
                              <Button 
                                onClick={() => setViewTarget(p)}
                                className="rounded-xl h-10 px-4 group/btn flex items-center justify-end w-full" 
                                variant="ghost"
                              >
                                <span className="text-[10px] font-black uppercase tracking-widest mr-2 group-hover/btn:text-primary transition-colors">Details</span>
                                <Eye size={14} className="text-muted-foreground group-hover/btn:text-primary transition-colors" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
