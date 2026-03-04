import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import CustomerProfile from "./pages/Customer/CustomerProfile";
import VerifyOtp from "./pages/VerifyOtp";
import { ProviderDashboard } from "./pages/provider/ProviderDashboard";
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
      </Routes>
    </BrowserRouter>
  );
}