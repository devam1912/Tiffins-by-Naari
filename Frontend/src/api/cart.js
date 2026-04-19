import API from "./auth";

const getCart = async () => {
  const response = await API.get("/cart");
  return response.data;
};

const addToCart = async (providerId, timeSlot, item) => {
  const response = await API.post("/cart/add", { providerId, timeSlot, item });
  return response.data;
};

const removeFromCart = async (itemName, providerId) => {
  const response = await API.post("/cart/remove", { itemName, providerId });
  return response.data;
};

const clearCart = async () => {
  const response = await API.delete("/cart/clear");
  return response.data;
};

const cartService = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};

export default cartService;
