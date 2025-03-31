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
      console.log("✅ API Response:", response.data);

      // if (response.data === null) {
      //   setCartItems([]);
      // }
      // setCartItems(response.data);
      // dispatch(setCartItemsAction(response.data));
      if (Array.isArray(response.data)) {
        setCartItems(response.data.map(item => ({
          productId: item.productId ?? item.id, // Đồng nhất key
          productName: item.productName ?? item.name,
          productImage: item.productImage ?? item.image,
          productPrice: item.productPrice ?? item.price ?? 0,  // ✅ Đảm bảo giá trị hợp lệ
          quantity: item.quantity ?? 1, // ✅ Nếu quantity bị thiếu, mặc định là 1
        })));
      } else {
        setCartItems([]); // Nếu dữ liệu lỗi, đặt giỏ hàng rỗng
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
      // dispatch(addToCartAction(product));
       // Fetch lại giỏ hàng để đảm bảo đồng bộ với server
    await fetchCartData();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    console.log(`Xóa sản phẩm: Product ID = ${productId}`);
    try {
      const response = await api.delete(`/cart/${productId}`);
      // Cập nhật state giỏ hàng
      setCartItems((prevCart) => prevCart.filter((item) => item.id !== productId));

      // Fetch lại dữ liệu từ API để đảm bảo đồng bộ
      await fetchCartData();
      // dispatch(removeFromCartAction(productId));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    console.log(`Cập nhật số lượng: Product ID = ${productId}, New Quantity = ${newQuantity}`);
  
    if (newQuantity < 1) {
      return removeFromCart(productId);
    }
  
    try {
      const response = await api.post("/cart/update-quantity", {
        productId, 
        quantity: newQuantity
      });
  
      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(newQuantity, item.stock) }
            : item
        )
      );
  
      // Gọi API để đồng bộ dữ liệu
      await fetchCartData();
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
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
