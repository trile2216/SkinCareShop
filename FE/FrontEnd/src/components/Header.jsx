import { useState } from "react";
import {  Link, useNavigate  } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import Cart from "./Cart";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../context/UserSlice";
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const cartCount = useSelector((state) => state.cart.cartCount);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token; 

  const handleLogout = () => {
    dispatch(logout()); 
    setShowLogoutConfirm(false); 
    toast.success("Log out success!", { position: "top-right", autoClose: 3000 });

    setTimeout(() => {
      navigate("/"); 
    }, 1500);
  };

  const categories = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/productlist" },
    { name: "Skincare Library", path: "/library" },
    //    { name: "Sale", path: "/sale" },
    { name: "Take The Quiz", path: "/skinquiz" },
  ];

  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto px-3">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/">
            <img
              src="src/assets/logo.png"
              className="h-25 w-auto cursor-pointer"
              alt="Logo"
            />
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 justify-center mx-8">
            <div className="relative w-1/3">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-rose-400"
              />
              <FiSearch className="absolute right-4 top-3 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-6">
          <div className="relative">
            {/* Profile */}
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="text-gray-600 hover:text-rose-900"
            >
              <FiUser size={24} />
            </button>

            {/* Dropdown Profile */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                {localStorage.getItem("token") ? (
                  <>
                    <Link
                      to="/customerProfile"
                      className="block px-4 py-2 hover:bg-rose-300"
                    >
                      Profile
                    </Link>
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="block w-full text-left px-4 py-2 hover:bg-rose-300"
                      >
                        Log Out
                      </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-rose-300"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 hover:bg-rose-300"
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
                className="text-gray-600 hover:text-teal-900 relative"
              >
                <FiShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Nav Bar */}
        <nav className="hidden md:block py-4">
          <ul className="flex justify-center space-x-8">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  to={category.path}
                  className="text-gray-600 hover:text-rose-700 font-medium"
                >
                  {category.name}
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
      <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg relative z-50">
          <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
          <p>Are you sure you want to log out?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <button onClick={() => setShowLogoutConfirm(false)} className="px-4 py-2 bg-gray-300 rounded-lg">
              Cancel
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg">
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
