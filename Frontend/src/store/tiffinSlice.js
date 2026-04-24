// src/store/tiffinSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../api/auth";

export const fetchNearbyTiffins = createAsyncThunk(
    "tiffins/fetchNearby",
    async ({ lat, lng, radius, token }, { rejectWithValue }) => {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.get(`${BASE_URL}/api/tiffins/nearby`, {
                params: { lat, lng, distance: radius },
                headers,
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch tiffins");
        }
    }
);

const tiffinSlice = createSlice({
    name: "tiffins",
    initialState: {
        providers: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearTiffins: (state) => {
            state.providers = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNearbyTiffins.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNearbyTiffins.fulfilled, (state, action) => {
                state.loading = false;
                state.providers = action.payload;
            })
            .addCase(fetchNearbyTiffins.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearTiffins } = tiffinSlice.actions;
export default tiffinSlice.reducer;
