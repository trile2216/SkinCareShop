import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import Cart from "./Cart";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../context/useAuth";
import { getCustomerTestResult } from "../services/api.customer";

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { cartCount } = useCart();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const { logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    setShowLogoutConfirm(false);

    toast.success("Log out success!", {
      position: "top-right",
      autoClose: 3000,
    });

    setTimeout(() => {
      navigate("/");
    }, 0);
  };

  const [customerTestResults, setCustomerTestResults] = useState(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const data = await getCustomerTestResult(userId);
          setCustomerTestResults(data);
        }
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    };

    if (localStorage.getItem("token")) {
      fetchTestResults();
    }
  }, []);

  const categories = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/productlist" },
    { name: "Sale", path: "/sale" },
    { name: "Blog", path: "/blog" },
    { name: "Take The Quiz", path: "/skinquiz" },
  ];

  return (
    <div className="bg-white shadow-lg sticky top-0 z-40 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {/* Logo */}
          <Link
            to="/"
            className="transition-transform duration-300 hover:scale-105"
          >
            <img
              src="src/assets/logo.png"
              className="h-16 w-auto cursor-pointer"
              alt="Logo"
            />
          </Link>

          <div className="flex items-center space-x-8">
            <div className="relative">
              {/* Profile */}
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="text-gray-700 hover:text-rose-600 transition-colors duration-300 p-2 rounded-full hover:bg-rose-50"
              >
                <FiUser size={22} />
              </button>

              {/* Dropdown Profile */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 transition-all duration-300 transform origin-top-right">
                  {localStorage.getItem("token") ? (
                    <>
                      <Link
                        to="/customerProfile"
                        className="block px-4 py-3 hover:bg-rose-50 text-gray-700 hover:text-rose-600 transition-colors duration-200"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={() => navigate("/order-history")}
                        className="block w-full text-left px-4 py-3 hover:bg-rose-50 text-gray-700 hover:text-rose-600 transition-colors duration-200"
                      >
                        My Orders
                      </button>
                      <Link
                        to="/result"
                        className="block px-4 py-3 hover:bg-rose-50 text-gray-700 hover:text-rose-600 transition-colors duration-200"
                      >
                        My Result
                        {customerTestResults?.symbol && (
                          <span className="text-xs text-gray-400 ml-2">
                            ({customerTestResults.symbol})
                          </span>
                        )}
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="block w-full text-left px-4 py-3 hover:bg-rose-50 text-gray-700 hover:text-rose-600 transition-colors duration-200"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-3 hover:bg-rose-50 text-gray-700 hover:text-rose-600 transition-colors duration-200"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-3 hover:bg-rose-50 text-gray-700 hover:text-rose-600 transition-colors duration-200"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="text-gray-700 hover:text-rose-600 transition-colors duration-300 p-2 rounded-full hover:bg-rose-50 relative"
              >
                <FiShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium shadow-sm transition-all duration-300 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Nav Bar */}
        <nav className="hidden md:block py-3 border-t border-gray-100">
          <ul className="flex justify-center space-x-12">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  to={category.path}
                  className="text-gray-700 hover:text-rose-600 font-medium text-sm uppercase tracking-wider py-2 relative group transition-colors duration-300"
                >
                  {category.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Show Cart */}
      <Cart isCartOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Confirm log out*/}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-500 z-50 transition-all duration-300"
          style={{ backgroundColor: "rgba(107, 114, 128, 0.5)" }}
        >
          <div className="bg-white p-6 rounded-xl shadow-2xl relative z-50 w-80 transform transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Logout
            </h2>
            <p className="text-gray-600">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
