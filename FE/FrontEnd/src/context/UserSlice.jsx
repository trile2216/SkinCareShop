import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
  customerId: localStorage.getItem("customerId") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, role, customerId } = action.payload;
      state.token = token;
      state.role = role;
      state.customerId = customerId;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (customerId) localStorage.setItem("customerId", customerId);
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.customerId = null;

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("customerId");
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
