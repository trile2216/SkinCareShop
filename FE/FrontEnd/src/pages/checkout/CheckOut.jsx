import { Link } from "react-router";
import { FiArrowLeft, FiPlus, FiMinus } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import Footer from "../../components/Footer";

const Checkout = () => {
  const { cartItems, getTotalPrice, updateQuantity } = useCart();

  return (
    <>
      <div className="container mx-auto p-12">
        {/* "Keep Shopping" */}
        <Link
          to="/"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="mr-2" size={20} />
          Keep Shopping
        </Link>

        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>

        <div className="bg-white shadow-md rounded-lg p-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div>
              {/* Product Table */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-2 px-4 text-left">Image</th>
                    <th className="py-2 px-4 text-left">Product Name</th>
                    <th className="py-2 px-4 text-left">Brand</th>
                    <th className="py-2 px-4 text-center">Quantity</th>
                    <th className="py-2 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2 px-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </td>
                      <td className="py-2 px-4 font-semibold">{item.name}</td>
                      <td className="py-2 px-4 text-gray-600">
                        {item.brandName}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 rounded-full bg-rose-200 hover:bg-rose-300"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 rounded-full bg-rose-200 hover:bg-rose-300"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-right font-semibold">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} $
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total */}
              <div className="mt-4 text-right text-lg font-bold">
                Subtotal: {getTotalPrice().toLocaleString("vi-VN")} $
              </div>

              {/* Payment */}
              <div className="mt-4 text-right">
                <Link to="/checkoutDetail">
                  <button className="bg-rose-500 text-white py-2 px-6 rounded-lg hover:bg-rose-600">
                    Proceed to Payment
                  </button>{" "}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
