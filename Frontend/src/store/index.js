// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import tiffinReducer from "./tiffinSlice";
import adminReducer from "./adminSlice";
import providerReducer from "./providerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tiffins: tiffinReducer,
    admin: adminReducer,
    provider: providerReducer,
  },
});