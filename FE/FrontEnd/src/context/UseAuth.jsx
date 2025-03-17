import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "../context/UserSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (formData, setIsLoading, setErrors) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", formData);
      const { token, role, customerId } = response.data.data;

      dispatch(loginSuccess({ customerId, token, role }));
      toast.success("Successfully logged in!");

      switch (role) {
        case "Admin":
          navigate("/dashboard/order");
          break;
        case "Staff":
          navigate("/dashboard/order");
          break;
        case "Customer":
          navigate("/");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setErrors({ api: err.response?.data || "Login failed!" });
      toast.error(err.response?.data || "Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return { login, logoutUser };
};

export default useAuth;
