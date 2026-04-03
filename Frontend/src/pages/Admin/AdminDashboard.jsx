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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#2d3b2d]/40 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="w-full max-w-md border-none shadow-[0_32px_120px_rgba(45,59,45,0.3)] rounded-[40px] overflow-hidden animate-in zoom-in-95 duration-500 bg-[#E7E6B6]">
        <div className="h-2 bg-gradient-to-r from-[#8FA873] to-[#D9D9A8]" />
        <CardContent className="p-10 text-center">
          <div className="w-24 h-24 bg-white/60 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-sm border border-[rgba(143,174,142,0.1)]">
            <div className="w-16 h-16 bg-[#8FA873]/10 rounded-2xl flex items-center justify-center animate-pulse">
              <CheckCircle size={40} className="text-[#8FA873]" />
            </div>
          </div>

          <Typography variant="h3" className="mb-3 text-[#2d3b2d]" style={{ fontFamily: "Lora, serif" }}>Approve Kitchen?</Typography>
          <Typography className="text-[#5a7a50] font-medium leading-relaxed mb-10 px-2">
            You are about to authorize <span className="font-black text-[#2d3b2d]">"{provider?.businessName}"</span>. This will enable their menu and notify the owner.
          </Typography>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl border-2 border-[rgba(143,174,142,0.2)] text-[#5a7a50] hover:bg-white/40 font-black uppercase tracking-widest text-[11px] transition-all"
            >
              Back
            </button>
            <button
              onClick={onApprove}
              disabled={loading}
              className="flex-[2] h-14 rounded-2xl bg-[#8FA873] hover:bg-[#6b8a5e] text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-[#8FA873]/30 transition-all transform hover:-translate-y-1 disabled:opacity-50"
            >
              {loading ? "Approving..." : "Confirm Approval"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RejectModal({ provider, onClose, onReject, loading }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#2d3b2d]/40 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="w-full max-w-md border-none shadow-[0_32px_120px_rgba(239,83,80,0.2)] rounded-[40px] overflow-hidden animate-in zoom-in-95 duration-500 bg-[#E7E6B6]">
        <div className="h-2 bg-[#ef5350]" />
        <CardContent className="p-10">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[rgba(143,174,142,0.1)]">
            <div className="w-14 h-14 bg-red-100/50 rounded-2xl flex items-center justify-center shrink-0">
              <XCircle size={28} className="text-red-500" />
            </div>
            <div>
              <Typography variant="h3" className="mb-0 text-[#2d3b2d]" style={{ fontFamily: "Lora, serif" }}>Decline Application</Typography>
              <Typography variant="small" className="text-red-500 font-bold uppercase tracking-widest text-[9px]">Target: {provider?.businessName}</Typography>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5a7a50] ml-1 mb-2 block">Reason for Rejection</label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g., FSSAI document blurry or invalid..."
                className="w-full min-h-[140px] p-5 rounded-[24px] border-2 border-[rgba(143,174,142,0.2)] bg-white/50 focus:border-red-400 focus:bg-white transition-all outline-none text-sm font-medium text-[#2d3b2d] resize-none shadow-inner"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 h-14 rounded-2xl border-2 border-[rgba(143,174,142,0.1)] text-[#5a7a50] hover:bg-white/40 font-black uppercase tracking-widest text-[11px] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => onReject(reason)}
                disabled={!reason.trim() || loading}
                className="flex-[2] h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-red-500/20 transition-all transform hover:-translate-y-1 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ViewApplicationModal({ provider, onClose, onApprove, onReject }) {
  const isPdf = provider?.fssaiCertificate?.toLowerCase().includes(".pdf");

  const DataField = ({ label, value, icon: Icon }) => (
    <div className="p-4 bg-white/50 rounded-2xl border border-[rgba(143,174,142,0.1)] shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-2 mb-1.5">
        <Typography variant="small" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5a7a50] opacity-60 m-0">{label}</Typography>
      </div>
      <Typography className="font-bold text-[#2d3b2d] text-sm truncate m-0">{value || "Not Provided"}</Typography>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#2d3b2d]/40 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="w-full max-w-3xl max-h-[92vh] border-none shadow-[0_32px_120px_rgba(45,59,45,0.3)] rounded-[48px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 bg-[#E7E6B6]">
        {/* Header */}
        <div className="px-10 py-8 border-b border-[rgba(143,174,142,0.2)] bg-white/30 flex justify-between items-center relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8FA873] via-[#D9D9A8] to-[#8FA873]" />
          <div>
            <Typography variant="h3" className="m-0 text-[#2d3b2d]" style={{ fontFamily: "Lora, serif" }}>Kitchen Dossier</Typography>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#8FA873] animate-pulse" />
              <Typography variant="small" className="text-[#5a7a50] font-black uppercase tracking-widest text-[9px]">Verification ID: {provider?._id?.slice(-8).toUpperCase()}</Typography>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-white/60 hover:bg-white text-[#5a7a50] flex items-center justify-center transition-all shadow-sm border border-[rgba(143,174,142,0.1)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <DataField label="Business" value={provider?.businessName} />
            <DataField label="Owner" value={provider?.ownerName} />
            <DataField label="FSSAI Code" value={provider?.fssaiNumber} />
            <DataField label="Email" value={provider?.email} />
            <DataField label="Phone" value={provider?.phone} />
            <DataField label="Status" value={provider?.isApproved ? "Approved" : "Pending Review"} />
          </div>

          {/* Document Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <Typography className="uppercase tracking-[0.2em] text-[11px] font-black text-[#5a7a50]">Verification Document</Typography>
              {provider?.fssaiCertificate && !isPdf && (
                <a
                  href={provider.fssaiCertificate}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-black text-[#8FA873] hover:underline uppercase tracking-wider"
                >
                  Open Original View ↗
                </a>
              )}
            </div>

            <div className="group relative rounded-[32px] border-4 border-dashed border-[rgba(143,174,142,0.3)] bg-white/40 flex items-center justify-center overflow-hidden min-h-[340px] shadow-inner transition-all hover:border-[#8FA873]/50">
              {provider?.fssaiCertificate ? (
                isPdf ? (
                  <div className="text-center p-12">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md border border-[rgba(143,174,142,0.1)]">
                      <Package size={32} className="text-[#8FA873]" />
                    </div>
                    <Typography className="mb-6 font-bold text-[#2d3b2d]">📜 FSSAI Certificate (PDF)</Typography>
                    <Button as="a" href={provider.fssaiCertificate} target="_blank" className="rounded-2xl h-12 px-8 bg-[#8FA873] hover:bg-[#6b8a5e] shadow-lg shadow-[#8FA873]/20">
                      View Full Certificate
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    <img
                      src={provider.fssaiCertificate}
                      className="max-w-full max-h-[500px] object-contain rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                      alt="FSSAI Certificate"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400/8FA873/white?text=Document+Load+Error";
                      }}
                    />
                    <div className="mt-4 py-2 px-4 bg-white/80 backdrop-blur-sm rounded-full text-[10px] font-black text-[#5a7a50] border border-[rgba(143,174,142,0.1)] shadow-sm">
                      FSSAI CERTIFICATE PREVIEW
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-20">
                  <AlertCircle size={48} className="text-destructive mx-auto mb-4 opacity-40" />
                  <Typography className="text-destructive font-black uppercase tracking-widest text-xs">Document missing from application</Typography>
                </div>
              )}
            </div>
          </div>

          {/* Address Section */}
          <div className="p-6 bg-white/40 rounded-3xl border border-[rgba(143,174,142,0.1)]">
            <Typography variant="small" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5a7a50] opacity-60 mb-2 block">Registered Kitchen Address</Typography>
            <Typography className="text-sm font-bold text-[#2d3b2d] leading-relaxed italic m-0">"{provider?.address || "No address provided"}"</Typography>
          </div>

          {/* Actions */}
          {(!provider?.isApproved && !provider?.isActive) && (
            <div className="flex gap-4 pt-4 sticky bottom-0 bg-[#E7E6B6]/80 backdrop-blur-sm py-4">
              <button
                onClick={() => { onClose(); onReject(provider); }}
                className="flex-1 h-14 rounded-2xl border-2 border-destructive/20 text-destructive hover:bg-destructive/10 font-black uppercase tracking-widest text-xs transition-all"
              >
                Decline Application
              </button>
              <button
                onClick={() => { onClose(); onApprove(provider); }}
                className="flex-[1.5] h-14 rounded-2xl bg-[#8FA873] hover:bg-[#6b8a5e] text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-[#8FA873]/30 transition-all transform hover:-translate-y-1"
              >
                Approve Credentials
              </button>
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
    { id: "providers", label: "Kitchens", icon: ChefHat },
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
    <div style={{ display: "flex", minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito',sans-serif" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .admin-sidebar { background: linear-gradient(160deg,#8FA873,#6b8a5e); position: sticky; top: 0; min-height: 100vh; overflow-y: auto; }
        .admin-sidebar::-webkit-scrollbar { width: 4px; }
        .admin-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }
        .admin-main { flex: 1; padding: 40px; overflow-y: auto; max-height: 100vh; position: relative; }
        .admin-main::-webkit-scrollbar { width: 5px; }
        .admin-main::-webkit-scrollbar-track { background: transparent; }
        .admin-main::-webkit-scrollbar-thumb { background: #8FAE8E; border-radius: 10px; }
        .nav-item { transition: all 0.3s cubic-bezier(.22,.68,0,1.2); }
        .nav-item.active { background: rgba(255,255,255,0.92); color: #2d3b2d !important; box-shadow: 0 8px 24px rgba(90,120,70,0.2) !important; transform: scale(1.03); }
        .nav-item.active * { color: #8FA873 !important; }
        .stat-card { background: rgba(255,255,255,0.85); backdrop-filter: blur(16px); border: 1.5px solid rgba(143,174,142,0.2); border-radius: 28px; box-shadow: 0 4px 24px rgba(90,120,70,0.08); transition: all 0.3s cubic-bezier(.22,.68,0,1.2); }
        .stat-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(90,120,70,0.18); border-color: rgba(143,174,142,0.45); }
        .admin-title { font-family: 'Lora', serif; color: #2d3b2d; font-size: 32px; font-weight: 700; line-height: 1.1; margin-bottom: 8px; }
        .admin-subtitle { color: #5a7a50; font-size: 14px; font-weight: 600; }
        .table-container { background: rgba(255,255,255,0.85); backdrop-filter: blur(16px); border: 1.5px solid rgba(143,174,142,0.2); border-radius: 32px; box-shadow: 0 12px 36px rgba(90,120,70,0.1); overflow: hidden; }
        .table-header { background: rgba(143,174,142,0.1); border-bottom: 1.5px solid rgba(143,174,142,0.2); }
        .table-header th { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #5a7a50; padding: 20px 24px; }
        .table-row { border-bottom: 1px solid rgba(143,174,142,0.1); transition: background 0.2s; }
        .table-row:hover { background: rgba(255,255,255,0.95); }
        .table-cell { padding: 20px 24px; color: #2d3b2d; font-size: 14px; font-weight: 600; }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* Background decorations for main area */}
      <div style={{ position: "fixed", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(143,168,115,0.12) 0%, transparent 70%)", top: "-100px", right: "-80px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", width: 300, height: 300, borderRadius: "50%", border: "1.5px dashed rgba(143,174,142,0.2)", bottom: "10%", left: "25%", pointerEvents: "none", animation: "spinSlow 45s linear infinite", zIndex: 0 }} />

      {approveTarget && <ApproveModal provider={approveTarget} onClose={() => setApproveTarget(null)} onApprove={confirmApprove} loading={actionLoading} />}
      {rejectTarget && <RejectModal provider={rejectTarget} onClose={() => setRejectTarget(null)} onReject={confirmReject} loading={actionLoading} />}
      {viewTarget && <ViewApplicationModal provider={viewTarget} onClose={() => setViewTarget(null)} onApprove={setApproveTarget} onReject={setRejectTarget} />}

      {/* SIDEBAR */}
      <aside className="w-72 admin-sidebar text-white flex flex-col shadow-2xl z-10">
        <div className="p-8 pb-12 relative overflow-hidden">
          <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)", top: -30, right: -40 }} />
          <h1 style={{ fontFamily: "'Lora',serif", fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>Naari</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", mt: 1 }}>Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={cn(
                "nav-item w-full flex items-center justify-between px-6 py-4 rounded-2xl",
                activeNav === item.id ? "active" : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon size={18} className="transition-transform group-hover:scale-110" />
                <span className="font-bold text-[13px] tracking-wide">{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span style={{ background: activeNav === item.id ? "#8FA873" : "rgba(255,255,255,0.2)", padding: "2px 8px" }} className="rounded-full text-[10px] font-black text-white">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <button
            className="w-full flex items-center gap-4 text-white/70 hover:text-white hover:bg-red-500/20 rounded-2xl px-6 py-4 transition-all"
            onClick={() => { localStorage.clear(); navigate("/login"); }}
          >
            <LogOut size={18} />
            <span className="font-bold text-[13px]">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main z-10">
        <div className="max-w-7xl mx-auto relative animate-in fade-in slide-in-from-bottom-4 duration-700">

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
                <h2 className="admin-title">Incoming Applications</h2>
                <p className="admin-subtitle">Verification queue for new kitchen partners.</p>
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
                <header>
                  <h2 className="admin-title">Order Management</h2>
                  <p className="admin-subtitle">Track and monitor all transactions.</p>
                </header>
                <div className="table-container">
                  <table className="w-full text-left border-collapse">
                    <thead className="table-header">
                      <tr>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(143,174,142,0.1)]">
                      {allOrders.map(o => (
                        <tr key={o._id} className="table-row">
                          <td className="table-cell font-bold">#{o._id.slice(-6).toUpperCase()}</td>
                          <td className="table-cell">{o.user?.name || "Guest"}</td>
                          <td className="table-cell font-black text-[#6b8a5e]">₹{o.totalPrice}</td>
                          <td className="table-cell">
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
                </div>
              </div>
            )}

            {activeNav === "providers" && (
              <div className="space-y-8">
                <header>
                  <h2 className="admin-title">Tiffin Providers</h2>
                  <p className="admin-subtitle">Directory of all active and inactive kitchens.</p>
                </header>
                <div className="table-container">
                  <table className="w-full text-left border-collapse">
                    <thead className="table-header">
                      <tr>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Business</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Owner</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right w-[140px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(143,174,142,0.1)]">
                      {allProviders.map(p => (
                        <tr key={p._id} className="table-row">
                          <td className="table-cell font-bold">{p.businessName}</td>
                          <td className="table-cell">{p.ownerName}</td>
                          <td className="table-cell">{p.phone}</td>
                          <td className="table-cell">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm",
                              p.isActive ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#ffebee] text-[#c62828]'
                            )}>
                              {p.isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </td>
                          <td className="table-cell text-right">
                            <button
                              onClick={() => setViewTarget(p)}
                              className="px-4 py-2 rounded-xl text-[#5a7a50] hover:bg-[#8FAE8E]/10 transition-colors font-bold text-[11px] uppercase"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
