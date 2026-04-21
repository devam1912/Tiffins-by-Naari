import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import API from "../../api/auth";
import { toast } from "sonner";
import { fetchCart, removeItemFromCart, addItemToCart, clearCart } from "../../store/cartSlice";
import { logout } from "../../store/authSlice";
import Sidebar from "../../components/Customer/Sidebar";


const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);
  const { items, timeSlot, totalPrice, isLoading } = useSelector((s) => s.cart);

  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("cart");
  const [loaded, setLoaded] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);

  const [location, setLocation] = useState({ address: "Fetching location...", loading: true });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(fetchCart());
    setTimeout(() => setLoaded(true), 100);


    // Get location for sidebar
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          const data = await res.json();
          setLocation({ address: data.address.suburb || data.address.city || "Location Found", loading: false });
        } catch (e) {
          setLocation({ address: "Location error", loading: false });
        }
      });
    }
  }, [token, dispatch, navigate]);

  const handleUpdateQuantity = async (item, type) => {
    if (type === "increase") {
      dispatch(addItemToCart({
        providerId: item.provider._id || item.provider,
        timeSlot,
        item: { name: item.name, price: item.price, type: item.type, quantity: 1 }
      }));
    } else {
      dispatch(removeItemFromCart({ itemName: item.name, providerId: item.provider._id || item.provider }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!orderDate) {
      toast.error("Please select a delivery date");
      return;
    }

    try {
      setPlacingOrder(true);
      const res = await API.post("/orders", { date: orderDate });

      const { razorpayOrderId, amountToPay, key, orders } = res.data;

      if (!razorpayOrderId) {
        toast.success("Order placed successfully using wallet!");
        dispatch(clearCart());
        navigate("/order-history");
        return;
      }

      // Handle Razorpay
      const options = {
        key,
        amount: amountToPay * 100,
        currency: "INR",
        name: "Tiffins-By-Naari",
        description: `Order Payment for ${timeSlot}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await API.post(`/orders/verify-payment/${res.data.order._id}`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            toast.success("Payment successful! Order placed.");
            dispatch(clearCart());
            navigate("/order-history");
          } catch (err) {
            toast.error("Payment verification failed.");
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#8FA873" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  const anim = (d = 0) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "none" : "translateY(20px)",
    transition: `all 0.5s ease ${d}ms`
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#E7E6B6", fontFamily: "'Nunito', sans-serif" }}>
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        activeNav={activeNav} 
        setActiveNav={setActiveNav}
        user={user}
        location={location}
        logout={() => { dispatch(logout()); navigate("/login"); }}
      />


      <main style={{ 
        marginLeft: collapsed ? 72 : 260, 
        flex: 1, padding: "40px", 
        transition: "all 0.35s ease",
        maxWidth: 1200
      }}>
        <div style={anim(0)}>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 32, fontWeight: 700, color: "#2d3b2d", marginBottom: 8 }}>
            Your Cart 🛒
          </h1>
          <p style={{ color: "#7a7a6a", marginBottom: 32 }}>Review your items and schedule your delivery.</p>
        </div>

        {items.length === 0 ? (
          <div style={{ ...anim(100), textAlign: "center", padding: "80px 40px", background: "rgba(255,255,255,0.4)", borderRadius: 32, border: "2px dashed rgba(143,174,142,0.3)" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🥡</div>
            <h2 style={{ fontFamily: "'Lora', serif", color: "#4a5a4a", marginBottom: 12 }}>Your cart is empty</h2>
            <p style={{ color: "#8a8a7a", marginBottom: 24 }}>Hungry? Browse our kitchens and add some delicious meals!</p>
            <button onClick={() => navigate("/tiffins")} style={{ padding: "12px 32px", background: "#8FAE8E", color: "#fff", border: "none", borderRadius: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 20px rgba(143,174,142,0.3)" }}>
              Browse Kitchens →
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "start" }}>
            {/* Left: Item List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, ...anim(100) }}>
              <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)", borderRadius: 28, padding: "24px", border: "1.5px solid rgba(143,174,142,0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#8FAE8E", textTransform: "uppercase", letterSpacing: 1.5 }}>
                    {timeSlot?.toUpperCase()} DELIVERY
                  </span>
                  <button onClick={() => dispatch(clearCart())} style={{ background: "none", border: "none", color: "#ba6666", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    Clear All
                  </button>
                </div>
                
                {items.map((item, idx) => (
                  <div key={idx} style={{ 
                    display: "flex", alignItems: "center", gap: 20, padding: "16px 0", 
                    borderBottom: idx === items.length - 1 ? "none" : "1px solid rgba(0,0,0,0.05)" 
                  }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: "#f5f5f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                      {item.type === "veg" ? "🌱" : "🍲"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#2d3b2d", margin: 0 }}>{item.name}</h3>
                      <p style={{ fontSize: 12, color: "#8a8a7a", marginTop: 4 }}>by {item.provider?.businessName || "Kitchen"}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(0,0,0,0.03)", padding: "4px 8px", borderRadius: 12 }}>
                      <button onClick={() => handleUpdateQuantity(item, "decrease")} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "#fff", cursor: "pointer" }}>-</button>
                      <span style={{ width: 20, textAlign: "center", fontWeight: 700 }}>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item, "increase")} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "#fff", cursor: "pointer" }}>+</button>
                    </div>
                    <div style={{ minWidth: 80, textAlign: "right", fontWeight: 800, color: "#2d3b2d" }}>
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Checkout Summary */}
            <div style={{ position: "sticky", top: 40, ...anim(200) }}>
              <div style={{ background: "#fff", borderRadius: 32, padding: "32px", border: "1.5px solid rgba(143,174,142,0.25)", boxShadow: "0 20px 50px rgba(0,0,0,0.05)" }}>
                <h2 style={{ fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 700, color: "#2d3b2d", marginBottom: 16 }}>Order Summary</h2>

                {/* Wallet Balance Chip */}
                {user?.walletBalance > 0 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(135deg,rgba(143,174,142,0.12),rgba(143,168,115,0.06))", border: "1px solid rgba(143,174,142,0.3)", borderRadius: 14, padding: "10px 14px", marginBottom: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>👛</span>
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 900, color: "#8FA873", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Wallet Balance</p>
                        <p style={{ fontSize: 14, fontWeight: 900, color: "#2d3b2d" }}>₹{user.walletBalance}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#8FA873", background: "rgba(143,174,142,0.15)", padding: "3px 8px", borderRadius: 8 }}>Auto-applied</span>
                  </div>
                )}

                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Delivery Date</label>
                  <input 
                    type="date" 
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "2px solid #f0f0e0", outline: "none", fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 600 }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#8a8a7a", fontSize: 14 }}>
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#8a8a7a", fontSize: 14 }}>
                    <span>Delivery Fee</span>
                    <span>FREE</span>
                  </div>
                  <div style={{ height: 1.5, background: "#f0f0e0", margin: "8px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#2d3b2d", fontSize: 20, fontWeight: 800 }}>
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  style={{ 
                    width: "100%", padding: "16px", background: "linear-gradient(135deg,#8FAE8E,#8FA873)", 
                    color: "#fff", border: "none", borderRadius: 18, fontSize: 16, fontWeight: 900, 
                    cursor: "pointer", boxShadow: "0 10px 24px rgba(143,174,142,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10
                  }}
                >
                  {placingOrder ? "Processing..." : "Place Order →"}
                </button>
                
                <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
                  By placing the order, you agree to our Terms of Service & Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
