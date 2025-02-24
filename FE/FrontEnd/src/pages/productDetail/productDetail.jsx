import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import api from "../../config/axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2 px-4">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.brand}</p>
            <div className="mb-4">
              {product.sale > 0 ? (
                <>
                  <span className="text-2xl font-bold text-red-500 mr-2">
                    {(product.price * (1 - product.sale)).toLocaleString(
                      "vi-VN"
                    )}{" "}
                    VND
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {product.price.toLocaleString("vi-VN")} VND
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold">
                  {product.price.toLocaleString("vi-VN")} VND
                </span>
              )}
            </div>
            <div className="flex items-center mb-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 px-3 py-1 rounded-l"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value)))
                }
                className="w-16 text-center border-t border-b border-gray-200 py-1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 px-3 py-1 rounded-r"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mb-4"
            >
              Add to Cart
            </button>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
              <p className="text-gray-700">{product.ingredient}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default ProductDetail;
