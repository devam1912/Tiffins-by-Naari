import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import CustomerProfile from "./pages/Customer/CustomerProfile";
import VerifyOtp from "./pages/VerifyOtp";
import { ProviderDashboard } from "./pages/provider/ProviderDashboard";
import RegisterProvider from "./pages/provider/RegisterProvider";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import BrowseTiffins from "./pages/Customer/BrowseTiffins";
import SubscriptionsPage from "./pages/Customer/SubscriptionsPage";
import ProviderDetailPage from "./pages/Customer/ProviderDetailPage";

export default function App() {
  return (
    <BrowserRouter>
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
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/provider/:id" element={<ProviderDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}