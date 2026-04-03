// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import tiffinReducer from "./tiffinSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tiffins: tiffinReducer,
  },
});