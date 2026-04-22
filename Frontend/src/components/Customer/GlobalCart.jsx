import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export default function GlobalCart() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useSelector((state) => state.cart);
  const { user, token } = useSelector((state) => state.auth);

  // Don't show if not logged in or not a customer
  // Most customer pages are /CustomerDashboard, /tiffins, /subscriptions, /order-history, /CustomerProfile, /cart, /orders/:id, /notifications
  // We can check if the current path is one of the customer paths or just check the role if available
  const isCustomerPath = [
    "/CustomerDashboard", 
    "/tiffins", 
    "/subscriptions", 
    "/order-history", 
    "/CustomerProfile", 
    "/cart", 
    "/notifications"
  ].some(path => location.pathname.startsWith(path)) || location.pathname.startsWith("/orders/") || location.pathname.startsWith("/provider/");

  if (!token || (user && user.role !== "customer" && user.role !== undefined) || !isCustomerPath) return null;
  
  // Don't show on the cart page itself
  if (location.pathname === "/cart") return null;

  const count = items?.length || 0;

  return (
    <div 
      onClick={() => navigate("/cart")}
      style={{
        position: "fixed",
        bottom: "40px",
        right: "40px",
        zIndex: 9999,
        cursor: "pointer",
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(12px)",
        width: "52px",
        height: "52px",
        borderRadius: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 10px 30px rgba(90, 120, 70, 0.12)",
        border: "1.5px solid rgba(143, 174, 142, 0.15)",
        transition: "all 0.3s cubic-bezier(.22,.68,0,1.2)",
        color: "#5a7a50"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
        e.currentTarget.style.boxShadow = "0 15px 40px rgba(90, 120, 70, 0.2)";
        e.currentTarget.style.borderColor = "rgba(143, 174, 142, 0.3)";
        e.currentTarget.style.background = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(90, 120, 70, 0.12)";
        e.currentTarget.style.borderColor = "rgba(143, 174, 142, 0.15)";
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.92)";
      }}
    >
      <ShoppingCart size={22} strokeWidth={2.5} />
      {count > 0 && (
        <span 
          style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            background: "linear-gradient(135deg, #8FAE8E, #8FA873)",
            color: "#fff",
            fontSize: "10px",
            fontWeight: "900",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 10px rgba(143, 174, 142, 0.4)",
            border: "2.5px solid #fff"
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}
