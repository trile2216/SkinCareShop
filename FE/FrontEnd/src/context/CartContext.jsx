import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "CeraVe Hydrating Facial Cleanser",
      brand: "CeraVe",
      price: 400000,
      quantity: 1,
      image: "https://bizweb.dktcdn.net/100/407/286/products/cerave-hydrating-facial-cleanser.jpg?v=1621057598607",
    },
    {
      id: 2,
      name: "The Ordinary Niacinamide 10% + Zinc 1%",
      brand: "The Ordinary",
      price: 600000,
      quantity: 2,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUjUlg1wLjh-nwIREswW_fEAzBfztnBB3Udg&s",
    },
    {
      id: 3,
      name: "Neutrogena Hydro Boost Water Gel",
      brand: "Neutrogena",
      price: 450000,
      quantity: 1,
      image: "https://bizweb.dktcdn.net/100/407/286/products/cerave-hydrating-facial-cleanser.jpg?v=1621057598607",
    },
    {
      id: 4,
      name: "The Ordinary Niacinamide 10% + Zinc 1%",
      brand: "The Ordinary",
      price: 600000,
      quantity: 2,
      image: "https://bizweb.dktcdn.net/100/407/286/products/cerave-hydrating-facial-cleanser.jpg?v=1621057598607",
    },
    {
      id: 5,
      name: "La Roche-Posay Effaclar Duo+ Acne Treatment",
      brand: "La Roche-Posay",
      price: 550000,
      quantity: 1,
      image: "https://bizweb.dktcdn.net/100/407/286/products/cerave-hydrating-facial-cleanser.jpg?v=1621057598607",
    },
    {
      id: 6,
      name: "CeraVe Moisturizing Cream",
      brand: "CeraVe",
      price: 500000,
      quantity: 1,
      image: "https://bizweb.dktcdn.net/100/407/286/products/cerave-hydrating-facial-cleanser.jpg?v=1621057598607",
    },
    {
      id: 7,
      name: "Alastin Restorative Skin Complex",
      brand: "Alastin",
      price: 3200000,
      quantity: 1,
      image: "https://alastin.com/cdn/shop/files/RSCShadow_800x800_crop_center@2x.png?v=1716245407",
    },
    {
      id: 8,
      name: "The Ordinary Hyaluronic Acid 2% + B5",
      brand: "The Ordinary",
      price: 350000,
      quantity: 2,
      image: "https://alastin.com/cdn/shop/files/RSCShadow_800x800_crop_center@2x.png?v=1716245407",
    },
  ]);

  const [cartCount, setCartCount] = useState(0);

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  useEffect(() => {
    setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCartItems((prevCart) =>
      quantity > 0
        ? prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
        : prevCart.filter((item) => item.id !== id) // Delete quantity 0
    );
  };

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
