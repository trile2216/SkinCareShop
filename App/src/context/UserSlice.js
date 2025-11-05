import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  role: null,
  customerId: null,
  username: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, role, customerId, username } = action.payload;
      state.token = token;
      state.role = role;
      state.customerId = customerId;
      state.username = username;
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.customerId = null;
      state.username = null;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
