import { configureStore } from "@reduxjs/toolkit";
// import cartReducer from "./CartSlice";
import userReducer from "./UserSlice";

export const store = configureStore({
  reducer: {
    // cart: cartReducer,
    user: userReducer,
  },
});

export default store;
