import { useState } from "react";
import { FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const categories = [
    "Home",
    "Brands",
    "Skincare Library",
    "Sale",
    "Take The Quiz ",
  ];
  const cartItems = [
    { id: 1, name: "Anti-Aging Cream", price: 49.99, quantity: 1 },
    { id: 2, name: "Lipstick - Rose Pink", price: 24.99, quantity: 2 },
  ];

  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto px-3">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <img src="./src/assets/logo.png" className="h-25 w-auto" />
          </div>

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
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="text-gray-600 hover:text-teal-900"
              >
                <FiUser size={24} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <a
                    href="/login"
                    className="block px-4 py-2 hover:bg-rose-300"
                  >
                    Sign In
                  </a>
                  <a
                    href="/register"
                    className="block px-4 py-2 hover:bg-rose-300"
                  >
                    Register
                  </a>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="text-gray-600 hover:text-teal-900 relative"
              >
                <FiShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  3
                </span>
              </button>
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-4 z-50">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-2 border-b border-gray-100"
                    >
                      <div className="flex justify-between">
                        <span>{item.name}</span>
                        <span>${item.price}</span>
                      </div>
                    </div>
                  ))}
                  <div className="px-4 py-2 font-semibold">Total: $99.97</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <nav className="hidden md:block py-4">
          <ul className="flex justify-center space-x-8">
            {categories.map((category) => (
              <li key={category}>
                <a
                  href="#"
                  className="text-gray-600 hover:text-rose-700 font-medium"
                >
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
export default Header;
