import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API || "https://skincareshop.onrender.com/api",
  withCredentials: true, // Include cookies for session
});

// Add request interceptor to include auth token
instance.interceptors.request.use(
  (config) => {
    // Token will be added from Redux state in useAuth if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
