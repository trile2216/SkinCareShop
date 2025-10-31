import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const CART_KEY = "cart_items";

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from AsyncStorage
  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(CART_KEY);
      const parsedData = JSON.parse(data) || [];
      setCartItems(parsedData);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save cart to AsyncStorage
  const saveCart = async (items) => {
    try {
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  // Add item to cart
  const addToCart = async (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    
    let updatedCart;
    if (existingItem) {
      // Increase quantity if item exists
      updatedCart = cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      // Add new item with quantity 1
      updatedCart = [...cartItems, { ...item, quantity: 1 }];
    }
    
    setCartItems(updatedCart);
    await saveCart(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    await saveCart(updatedCart);
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    await saveCart(updatedCart);
  };

  // Increase quantity
  const increaseQuantity = async (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      await updateQuantity(itemId, item.quantity + 1);
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      await updateQuantity(itemId, item.quantity - 1);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setCartItems([]);
    await saveCart([]);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  // Calculate total items count
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Check if item is in cart
  const isInCart = (itemId) => {
    return cartItems.some((item) => item.id === itemId);
  };

  // Get item quantity
  const getItemQuantity = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartProvider;
