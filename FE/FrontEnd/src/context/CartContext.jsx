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
    const totalQuantity = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    console.log("Cart updated:", { totalQuantity, cartItems });
  }, [cartItems, loading]);

  const fetchCartData = async () => {
    try {
      const response = await api.get("/cart");
      console.log("✅ API Response:", response.data);
      if (Array.isArray(response.data)) {
        setCartItems(response.data.map(item => ({
          productId: item.productId ?? item.id, 
          productName: item.productName ?? item.name,
          productImage: item.productImage ?? item.image,
          productPrice: item.productPrice ?? item.price ?? 0,  
          quantity: item.quantity ?? 1, 
        })));
      } else {
        setCartItems([]); 
      }
  
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    const response = await api.post("/cart/add", {
      productId: product.productId || product.id,
      quantity: product.quantity || 1,
    });

    console.log("Add to cart response:", response.data);
    try {
      setCartItems((prevCart) => {
        const existingItem = prevCart.find((item) => item.productId === product.id);

        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + (product.quantity || 1),
            product.stock
          );

          if (newQuantity === existingItem.quantity) {
            return prevCart;
          }

          return prevCart.map((item) =>
            item.id === product.productId ? { ...item, quantity: newQuantity } : item
          );
        }

        return [...prevCart, { ...product, quantity: product.quantity || 1 }];
      });
    await fetchCartData();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    console.log(`Delete product ID = ${productId}`);
    try {
      await api.delete(`/cart/${productId}`);
      setCartItems((prevCart) => prevCart.filter((item) => item.id !== productId));
      await fetchCartData();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    console.log(`Update quantity Product ID :  = ${productId}, New Quantity = ${newQuantity}`);
    
    if (newQuantity < 1) {
      return removeFromCart(productId);
    }
  
    try {
      await api.post("/cart/update-quantity", { productId, quantity: newQuantity });
  
      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity } 
            : item
        )
      );
  
      await fetchCartData();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  
  const clearCart = async () => {
    try {
      setCartItems([]);
      await fetchCartData();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + (item.productPrice || 0) * (item.quantity || 1), 0);
  

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
