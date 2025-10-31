import { createContext, useContext, useEffect, useState } from "react";
import { instance } from "../lib/axios";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    const res = await instance.get("/product");
    setBooks(res.data);
  };

  const addProduct = async (newProduct) => {
    const res = await instance.post("/product", newProduct);
    setBooks((prevProducts) => [...prevProducts, res.data]);
  };

  const removeProduct = async (id) => {
    await instance.delete(`/product/${id}`);
    setBooks((prevProducts) => prevProducts.filter((product) => product.id !== id));
  };

  const updateProduct = async (id, updatedProduct) => {
    const res = await instance.put(`/product/${id}`, updatedProduct);
    setBooks((prevProducts) =>
      prevProducts.map((product) => (product.id === id ? res.data : product))
    );
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <AppContext.Provider
      value={{
        books,
        setBooks,
        addProduct,
        removeProduct,
        updateProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export default AppProvider;
