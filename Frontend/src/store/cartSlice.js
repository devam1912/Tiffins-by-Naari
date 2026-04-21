import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "../api/cart";

const initialState = {
  items: [],
  timeSlot: null,
  totalPrice: 0,
  isLoading: false,
  isError: false,
  message: "",
};

// Get cart
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, thunkAPI) => {
    try {
      return await cartService.getCart();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add item to cart
export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async ({ providerId, timeSlot, item }, thunkAPI) => {
    try {
      return await cartService.addToCart(providerId, timeSlot, item);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Remove item from cart
export const removeItemFromCart = createAsyncThunk(
  "cart/removeItem",
  async ({ itemName, providerId }, thunkAPI) => {
    try {
      return await cartService.removeFromCart(itemName, providerId);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, thunkAPI) => {
    try {
      return await cartService.clearCart();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.timeSlot = action.payload.timeSlot || null;
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addItemToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.timeSlot = action.payload.timeSlot || null;
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.timeSlot = action.payload.timeSlot || null;
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.timeSlot = null;
        state.totalPrice = 0;
      });
  },
});

export const { reset } = cartSlice.actions;
export default cartSlice.reducer;
