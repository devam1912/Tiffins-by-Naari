import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProfile } from "../api/auth";

export const fetchProfile = createAsyncThunk(
    "auth/fetchProfile",
    async (_, thunkAPI) => {
        try {
            const res = await getProfile();
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
        }
    }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchProfile.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem("user", JSON.stringify(state.user));
        })
        .addCase(fetchProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;