import { useCart as useCartContext } from "../provider/CartProvider";

const useCart = () => {
  const cart = useCartContext();

  return {
    // Cart state
    cartItems: cart.cartItems,
    loading: cart.loading,
    
    // Cart operations
    addToCart: cart.addToCart,
    removeFromCart: cart.removeFromCart,
    updateQuantity: cart.updateQuantity,
    increaseQuantity: cart.increaseQuantity,
    decreaseQuantity: cart.decreaseQuantity,
    clearCart: cart.clearCart,
    
    // Cart calculations
    totalPrice: cart.getTotalPrice(),
    totalItems: cart.getTotalItems(),
    
    // Cart helpers
    isInCart: cart.isInCart,
    getItemQuantity: cart.getItemQuantity,
  };
};

export default useCart;
