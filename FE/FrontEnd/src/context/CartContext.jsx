import { createContext, useContext, useState, useEffect } from "react";
import api from "../config/axios";

// //
// import { useSelector, useDispatch } from "react-redux";
// import {
//   setCartItems as setCartItemsAction,
//   addToCart as addToCartAction,
//   removeFromCart as removeFromCartAction,
//   updateQuantity as updateQuantityAction,
//   clearCart as clearCartAction,
// } from "../context/CartSlice";
// //

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // //
  // const dispatch = useDispatch();
  // const cartItems = useSelector((state) => state.cart.cartItems);
  // const cartCount = useSelector((state) =>
  //   state.cart.cartItems.reduce((total, item) => total + item.quantity, 0)
  // );
  // const totalPrice = useSelector((state) =>
  //   state.cart.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  // );

  // //
  useEffect(() => {
    fetchCartData();
  }, []);

  useEffect(() => {
    setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
    const totalQuantity = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    console.log("Cart updated:", { totalQuantity, cartItems });
  }, [cartItems, loading]);

  const fetchCartData = async () => {
    try {
      const response = await api.get("/cart");
      if (response.data === null) {
        setCartItems([]);
      }
      setCartItems(response.data);
      // dispatch(setCartItemsAction(response.data));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    const response = await api.post("/cart/add", {
      productId: product.id,
      quantity: product.quantity || 1,
    });

    console.log("Add to cart response:", response.data);
    try {
      setCartItems((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);

        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + (product.quantity || 1),
            product.stock
          );

          if (newQuantity === existingItem.quantity) {
            return prevCart;
          }

          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: newQuantity } : item
          );
        }

        return [...prevCart, { ...product, quantity: product.quantity || 1 }];
      });
      // dispatch(addToCartAction(product));
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setCartItems((prevCart) =>
        prevCart.filter((item) => item.id !== productId)
      );
      // dispatch(removeFromCartAction(productId));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        return removeFromCart(productId);
      }

      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: Math.min(newQuantity, item.stock),
              }
            : item
        )
      );
      // dispatch(updateQuantityAction({ productId, newQuantity }));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const clearCart = async () => {
    try {
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    // return totalPrice;
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
