import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "./store/cartSlice";

import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import CustomerProfile from "./pages/Customer/CustomerProfile";
import VerifyOtp from "./pages/VerifyOtp";
import { ProviderDashboard } from "./pages/provider/ProviderDashboard";
import RegisterProvider from "./pages/provider/RegisterProvider";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import BrowseTiffins from "./pages/Customer/BrowseTiffins";
import ProviderDetailPage from "./pages/Customer/ProviderDetailPage";
import { Toaster } from "sonner";
import CustomerSubscriptions from "./pages/Customer/CustomerSubscriptions";
import OrderHistory from "./pages/Customer/OrderHistory";
import CartPage from "./pages/Customer/CartPage";

export default function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [token, dispatch]);

  return (

    <BrowserRouter>
      <Toaster position="top-center" expand={false} richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/CustomerDashboard" element={<CustomerDashboard />} />
        <Route path="/CustomerProfile" element={<CustomerProfile />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/ProviderDashboard" element={<ProviderDashboard />} />
        <Route path="/RegisterProvider" element={<RegisterProvider />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/tiffins" element={<BrowseTiffins />} />
        <Route path="/provider/:id" element={<ProviderDetailPage />} />
        <Route path="/subscriptions" element={<CustomerSubscriptions />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  );
}