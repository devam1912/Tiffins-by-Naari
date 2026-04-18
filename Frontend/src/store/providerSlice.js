import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/auth";

export const fetchProviderDashboard = createAsyncThunk(
  "provider/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const statsRes = await API.get("/subscriptions/provider/dashboard");
      return statsRes.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch dashboard stats");
    }
  }
);

export const fetchProviderProfile = createAsyncThunk(
  "provider/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.patch("/providers/profile", {});
      return res.data.provider;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);

export const fetchProviderSubscriptions = createAsyncThunk(
  "provider/fetchSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/subscriptions/provider-subscriptions");
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch subscriptions");
    }
  }
);

export const fetchProviderOrders = createAsyncThunk(
  "provider/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/orders/tsp");
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "provider/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue, dispatch }) => {
    try {
      const res = await API.patch(`/orders/tsp/${orderId}/status`, { status });
      dispatch(fetchProviderOrders());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update order status");
    }
  }
);

export const fetchProviderMenu = createAsyncThunk(
  "provider/fetchMenu",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await API.get("/tiffins/menu");
      const allMenus = res.data?.menus || [];
      const myMenu = allMenus.find(m =>
        m.provider?.user?._id === userId || m.provider?.user === userId
      );
      return myMenu || null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch menu");
    }
  }
);

export const saveMenu = createAsyncThunk(
  "provider/saveMenu",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const res = await API.post("/tiffins/menu", { weekMenu: payload });
      dispatch(fetchProviderMenu()); 
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to save menu");
    }
  }
);

export const submitMenuForApproval = createAsyncThunk(
  "provider/submitMenu",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await API.patch("/tiffins/menu/submit");
      dispatch(fetchProviderMenu());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to submit menu");
    }
  }
);

export const toggleServiceStatus = createAsyncThunk(
  "provider/toggleStatus",
  async (isCurrentlyActive, { rejectWithValue }) => {
    try {
      const endpoint = isCurrentlyActive ? "/providers/deactivate" : "/providers/reactivate";
      await API.patch(endpoint);
      return !isCurrentlyActive;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Service toggle failed");
    }
  }
);

export const markMealReady = createAsyncThunk(
  "provider/markMealReady",
  async (subId, { rejectWithValue, dispatch }) => {
    try {
      await API.patch(`/subscriptions/${subId}/mark-meal-ready`);
      dispatch(fetchProviderSubscriptions());
      return subId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to mark meal ready");
    }
  }
);

const providerSlice = createSlice({
  name: "provider",
  initialState: {
    profile: null,
    stats: null,
    subscriptions: [],
    orders: [],
    menu: null,
    loading: false,
    statusLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviderDashboard.pending, (state) => { state.loading = true; })
      .addCase(fetchProviderDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchProviderDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProviderProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchProviderSubscriptions.fulfilled, (state, action) => {
        state.subscriptions = action.payload;
      })
      .addCase(fetchProviderOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchProviderMenu.fulfilled, (state, action) => {
        state.menu = action.payload;
      })
      .addCase(toggleServiceStatus.pending, (state) => { state.statusLoading = true; })
      .addCase(toggleServiceStatus.fulfilled, (state, action) => {
        state.statusLoading = false;
        if (state.profile) state.profile.isActive = action.payload;
      })
      .addCase(toggleServiceStatus.rejected, (state) => { state.statusLoading = false; });
  },
});

export default providerSlice.reducer;
