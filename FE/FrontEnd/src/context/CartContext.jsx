import { createContext, useContext, useState, useEffect } from "react";
import api from "../config/axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartData();
  }, []);

  useEffect(() => {
    setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
    if (!loading) {
      updateCartInBackend(cartItems);
    }
  }, [cartItems, loading]);

  const fetchCartData = async () => {
    try {
      const response = await api.get("/cart");
      setCartItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setLoading(false);
    }
  };

  const updateCartInBackend = async (updatedCart) => {
    try {
      await api.post("/cart", updatedCart);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const addToCart = async (product) => {
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
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setCartItems((prevCart) =>
        prevCart.filter((item) => item.id !== productId)
      );
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
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const clearCart = async () => {
    try {
      setCartItems([]);
      await api.post("/cart", []);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
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
