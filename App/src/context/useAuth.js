import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "./UserSlice";
import { instance } from "../lib/axios";
import { Alert } from "react-native";

const useAuth = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const login = async (formData) => {
    try {
      const response = await instance.post("/auth/login", formData);
      const { token, role, customerId, username } = response.data.data;

      dispatch(
        loginSuccess({
          token,
          role,
          customerId,
          username: formData.username,
        })
      );

      Alert.alert("Success", "Login successful!");
      return { success: true, role };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      Alert.alert("Error", errorMessage);
      return { success: false };
    }
  };

  const register = async (formData) => {
    try {
      const response = await instance.post("/auth/register", formData);
      Alert.alert("Success", "Registration successful! Please login.");
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      Alert.alert("Error", errorMessage);
      return { success: false };
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return { login, register, logoutUser, token, isLoggedIn: !!token };
};

export default useAuth;
