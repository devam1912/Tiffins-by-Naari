import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/auth";

export const fetchAdminData = createAsyncThunk(
  "admin/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const [pRes, penRes, uRes, oRes, fRes, mRes] = await Promise.all([
        API.get("/admin/providers"),
        API.get("/admin/providers/pending"),
        API.get("/admin/users"),
        API.get("/admin/orders"),
        API.get("/feedback"),
        API.get("/tiffins/menu")
      ]);

      const providers = pRes.data || [];
      const pending = penRes.data.providers || penRes.data || [];
      const users = uRes.data || [];
      const orders = (oRes.data.orders || oRes.data || []);
      const feedbacks = fRes.data.feedbacks || [];
      const menus = mRes.data.menus || [];

      const stats = {
        totalUsers: users.length,
        totalProviders: providers.filter(p => p.isApproved).length,
        totalOrders: orders.length,
        totalRevenue: Array.isArray(orders) ? orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0) : 0
      };

      return { providers, pending, users, orders, feedbacks, menus, stats };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch admin data");
    }
  }
);

export const approveProvider = createAsyncThunk(
  "admin/approveProvider",
  async (providerId, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/tiffins/approve/${providerId}`);
      return { providerId, data: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Approval failed");
    }
  }
);

export const rejectProvider = createAsyncThunk(
  "admin/rejectProvider",
  async ({ providerId, reason }, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/tiffins/reject/${providerId}`, { reason });
      return { providerId, data: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Rejection failed");
    }
  }
);

export const approveMenu = createAsyncThunk(
  "admin/approveMenu",
  async (menuId, { rejectWithValue }) => {
    try {
      await API.patch(`/tiffins/menu/${menuId}/approve`);
      return menuId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Menu approval failed");
    }
  }
);

export const rejectMenu = createAsyncThunk(
  "admin/rejectMenu",
  async ({ menuId, remark }, { rejectWithValue }) => {
    try {
      await API.patch(`/tiffins/menu/${menuId}/reject`, { remark });
      return menuId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Menu rejection failed");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    providers: [],
    pending: [],
    users: [],
    orders: [],
    feedbacks: [],
    menus: [],
    stats: { totalUsers: 0, totalProviders: 0, totalOrders: 0, totalRevenue: 0 },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveProvider.fulfilled, (state, action) => {
        const { providerId } = action.payload;
        state.providers = state.providers.map(p => p._id === providerId ? { ...p, isApproved: true } : p);
        state.pending = state.pending.filter(p => p._id !== providerId);
        state.stats.totalProviders += 1;
      })
      .addCase(rejectProvider.fulfilled, (state, action) => {
        const { providerId } = action.payload;
        state.pending = state.pending.filter(p => p._id !== providerId);
      })
      .addCase(approveMenu.fulfilled, (state, action) => {
        const menuId = action.payload;
        state.menus = state.menus.map(m => m._id === menuId ? { ...m, isApproved: true, submittedForApproval: false, isPublished: true } : m);
      })
      .addCase(rejectMenu.fulfilled, (state, action) => {
        const menuId = action.payload;
        state.menus = state.menus.map(m => m._id === menuId ? { ...m, isApproved: false, submittedForApproval: false, isPublished: false } : m);
      });
  },
});

export default adminSlice.reducer;
