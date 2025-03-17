import { useNavigate, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const showLoginToast = () => {
  toast.warn({
    autoClose: 3000,
    closeOnClick: false,
    closeButton: true,
    position: "top-center",
  });
};

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = useSelector((state) => state.user.token);
  const role = useSelector((state) => state.user.role);
  const navigate = useNavigate();

  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    if (!token && !toastShown) {
      showLoginToast();
      setToastShown(true);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 0);
    }
  }, [token, toastShown, navigate]);

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
