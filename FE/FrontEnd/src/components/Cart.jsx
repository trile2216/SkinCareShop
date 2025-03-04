import { Link } from "react-router";
import { FiTrash, FiPlus, FiMinus, FiX } from "react-icons/fi";
// import { useDispatch, useSelector } from "react-redux";
// import { removeFromCartAndSync, updateQuantityAndSync, fetchCartData } from "../context/CartSlice";
import { useCart } from "../context/CartContext";
import { useEffect } from "react";

const Cart = ({ isCartOpen, onClose }) => {
  // const dispatch = useDispatch();
  // const cartItems = useSelector((state) => state.cart.cartItems);

  // // Total Price
  // const getTotalPrice = () =>
  //   cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // // Gọi API để lấy dữ liệu giỏ hàng khi mở cart
  // useEffect(() => {
  //   if (isCartOpen) {
  //     dispatch(fetchCartData());
  //   }
  // }, [isCartOpen, dispatch]);

  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // Total Price
  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);


  return (
    isCartOpen && (
      <div className="absolute right-10 top-12 w-96 bg-white rounded-lg shadow-lg py-4 z-50">
        {/* Cart button*/}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <FiX size={20} />
        </button>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 p-4">Your cart is empty.</p>
        ) : (
          <>
            <div className="max-h-80 overflow-y-auto px-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 border-b border-gray-200"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 px-4">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-gray-600 text-xs">
                      {(item.price * item.quantity).toLocaleString("vi-VN")} $
                    </p>

                    {/* Increase/Decrease Quantity */}
                    <div className="flex items-center space-x-2 mt-1">
                      <button
                      //  onClick={() => dispatch(updateQuantityAndSync({ id: item.id, quantity: item.quantity - 1 }))} 
                      onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 rounded-full bg-rose-200 hover:bg-rose-300"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="px-2 text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                          // onClick={() => dispatch(updateQuantityAndSync({ id: item.id, quantity: item.quantity + 1 }))} 
                          onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 rounded-full bg-rose-200 hover:bg-rose-300"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Remove*/}
                  <button
                    // onClick={() => dispatch(removeFromCartAndSync(item.id))} 
                    onClick={() => removeFromCart(item.id)}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    <FiTrash size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="px-4 py-2 font-semibold text-right border-t border-gray-200">
              Total: {getTotalPrice().toLocaleString("vi-VN")} $
            </div>

            {/* => Check out */}
            <Link
              to="/checkout"
              className="block text-center py-2 bg-rose-500 text-white rounded-md mx-4 mt-2 hover:bg-rose-600"
            >
              Checkout
            </Link>
          </>
        )}
      </div>
    )
  );
};

export default Cart;
