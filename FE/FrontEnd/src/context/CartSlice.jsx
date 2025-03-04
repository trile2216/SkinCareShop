import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
  cartCount: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity = Math.min(
          existingItem.quantity + (product.quantity || 1),
          product.stock
        );
      } else {
        state.cartItems.push({ ...product, quantity: product.quantity || 1 });
      }

      state.cartCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    removeFromCart(state, action) {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== productId);

      state.cartCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    updateQuantity(state, action) {
      const { productId, newQuantity } = action.payload;
      const item = state.cartItems.find((item) => item.id === productId);

      if (item) {
        if (newQuantity < 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== productId);
        } else {
          item.quantity = Math.min(newQuantity, item.stock);
        }
      }

      state.cartCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    clearCart(state) {
      state.cartItems = [];
      state.cartCount = 0;
      state.totalPrice = 0;
      localStorage.removeItem("cartItems");
    },

    // 
    setCartItems(state, action) {
      state.cartItems = action.payload;
      state.cartCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    }    
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
