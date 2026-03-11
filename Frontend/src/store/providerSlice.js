// src/store/providerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchProviderDashboard = createAsyncThunk(
    "provider/fetchDashboard",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const res = await api.get("/api/subscriptions/provider/dashboard", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                return res.data.data;
            }
            return rejectWithValue("Failed to fetch dashboard data");
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Error fetching dashboard stats");
        }
    }
);

export const toggleProviderService = createAsyncThunk(
    "provider/toggleService",
    async (isCurrentlyActive, { getState, dispatch, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const endpoint = isCurrentlyActive ? "/api/tiffin/deactivate" : "/api/tiffin/reactivate";

            await api.patch(endpoint, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh dashboard stats after status change
            dispatch(fetchProviderDashboard());

            return !isCurrentlyActive;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to toggle service status");
        }
    }
);

const providerSlice = createSlice({
    name: "provider",
    initialState: {
        stats: null,
        profile: null,
        isServiceActive: false,
        loading: false,
        statusLoading: false,
        error: null,
    },
    reducers: {
        setProviderProfile: (state, action) => {
            state.profile = action.payload;
        },
        setServiceActive: (state, action) => {
            state.isServiceActive = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProviderDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProviderDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchProviderDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(toggleProviderService.pending, (state) => {
                state.statusLoading = true;
            })
            .addCase(toggleProviderService.fulfilled, (state, action) => {
                state.statusLoading = false;
                state.isServiceActive = action.payload;
            })
            .addCase(toggleProviderService.rejected, (state, action) => {
                state.statusLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setProviderProfile, setServiceActive } = providerSlice.actions;
export default providerSlice.reducer;
