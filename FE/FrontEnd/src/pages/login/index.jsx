import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (formData.username.trim().length > 50) {
      newErrors.username = "Username must not exceed 50 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);

      try {
        const response = await api.post("auth/login", formData);
        const { token, role } = response.data.data;
        localStorage.setItem("token", token);
        toast.success("Successfully login!");

        if (role === "ADMIN") {
          navigate("/dashboard");
        } else if (role === "Customer") {
          navigate("/homepage");
        }
      } catch (err) {
        toast.error(err.response.data);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center">
      {/* Ảnh nền bị làm mờ */}
      <div className="absolute inset-0 bg-[url('https://i.imgur.com/xP1xJCq.jpg')] bg-cover bg-center blur-md opacity-90"></div>

      {/* Khung đăng nhập */}
      <div className="relative z-10 max-w-md w-full space-y-8 bg-rose-55 bg-opacity-70 backdrop-blur-lg p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-rose-400">
            Sign in to Fresh Face
          </h2>
        </div>

        {/* Form đăng nhập */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Input Username */}
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-lg block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-lg block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-rose-500 hover:text-pink">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Nút Sign in */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md 
               text-rose-500 bg-white hover:bg-rose-100 focus:ring-2 focus:ring-offset-2 focus:ring-rose-100"
            >
              Sign in
            </button>
          </div>

          {/* Đăng ký tài khoản */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-medium text-rose-500 hover:text-rose-500"
            >
              Register here
            </a>
          </p>

          {/* Hoặc đăng nhập với Google */}
          <div className="relative mt-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-rose-55 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2 px-4 
               text-sm font-medium rounded-md text-rose-500 bg-white 
               hover:bg-rose-100 focus:ring-2 focus:ring-offset-2 focus:ring-rose-100"
            >
              <FcGoogle className="h-5 w-5" />
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
