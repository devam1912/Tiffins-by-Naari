import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔥 Attach JWT automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signupUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const verifyOTP = (data) => API.post("/auth/verify-otp", data);
export const updateProfile = (data) => API.patch("/auth/update", data);

export default API;