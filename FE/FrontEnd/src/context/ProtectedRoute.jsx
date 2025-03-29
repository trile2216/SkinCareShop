import { useNavigate, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect } from "react";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = useSelector((state) => state.user.token);
  const role = useSelector((state) => state.user.role);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.warn("You must login!", {
        autoClose: 3000,
        closeOnClick: true,
        closeButton: true,
        position: "top-center",
      });
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  // Not logged in
  if (!token) {
    return null;
  }

  // No permission
  if (!allowedRoles.includes(role)) {
    toast.error("You do not have permission to access this page!", {
      position: "top-center",
    });
    return <Navigate to="/" replace />;
  }

  //Valid
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
