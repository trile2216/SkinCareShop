import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/axios"; 

// Lấy dữ liệu giỏ hàng từ localStorage nếu có
const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

const initialState = {
    cartItems: cartItems,
    cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    loading: false,
};

//Lấy dữ liệu giỏ hàng từ server
export const fetchCartData = createAsyncThunk("cart/fetchCart", async () => {
  try {
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    console.error("Error fetching cart data:", error);
    throw error;
  }
});

//Cập nhật giỏ hàng lên server
export const updateCartInBackend = createAsyncThunk("cart/updateCart", async (_, { getState }) => {
  try {
    const cartItems = getState().cart.cartItems; // Lấy giỏ hàng từ state hiện tại
    await api.post("/cart", cartItems);
  } catch (error) {
    console.error("Error updating cart:", error);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find((item) => item.id === action.payload.id);
      if (existingItem) {
        const newQuantity = Math.min(
          existingItem.quantity + (action.payload.quantity || 1),
          action.payload.stock
        );

        if (newQuantity !== existingItem.quantity) {
          existingItem.quantity = newQuantity;
        }
      } else {
        state.cartItems.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }

      state.cartCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
      state.cartCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);

      if (item) {
        if (quantity < 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== id);
        } else {
          item.quantity = Math.min(quantity, item.stock);
        }
      }

      state.cartCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.cartCount = 0;
      localStorage.removeItem("cart");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCartData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.cartCount = action.payload.reduce((total, item) => total + item.quantity, 0);
        state.loading = false;
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      })
      .addCase(fetchCartData.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateCartInBackend.fulfilled, () => {
        console.log("Cart updated in backend");
      });
  },
});

// Middleware Thêm sản phẩm vào giỏ hàng và cập nhật lên server
export const addToCartAndSync = (payload) => (dispatch) => {
  dispatch(addToCart(payload)); // Thêm vào Redux state
  dispatch(updateCartInBackend()); // Gửi lên server
};

// Middleware Xóa sản phẩm khỏi giỏ hàng và cập nhật lên server
export const removeFromCartAndSync = (id) => (dispatch) => {
  dispatch(removeFromCart(id)); // Xóa khỏi Redux state
  dispatch(updateCartInBackend()); // Gửi lên server
};

// Middleware Cập nhật số lượng sản phẩm và đồng bộ với server
export const updateQuantityAndSync = (payload) => (dispatch) => {
  dispatch(updateQuantity(payload)); // Cập nhật Redux state
  dispatch(updateCartInBackend()); // Gửi lên server
};

// Total price selector
export const getTotalPrice = (state) => {
  return state.cart.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Export reducers
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
