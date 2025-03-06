import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import api from "../../config/axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FaStar, FaRegStar } from "react-icons/fa";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/product/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load product");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => {
      const newQuantity = prev + change;
      return Math.max(1, Math.min(newQuantity, product.stock));
    });
  };

  const handleInputQuantity = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, Math.min(value, product.stock)));
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        quantity: quantity,
      });
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400" />
        ) : (
          <FaRegStar key={i} className="text-yellow-400" />
        )
      );
    }
    return stars;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl text-gray-600 mb-4">{product.brand}</p>
            <div className="flex items-center mb-4">
              {renderRatingStars(product.rating)}
              <span className="ml-2">({product.rating})</span>
            </div>
            <div className="mb-6">
              {product.sale > 0 ? (
                <div>
                  <p className="text-3xl font-bold text-red-500">
                    {(product.price * (1 - product.sale)).toLocaleString(
                      "vi-VN"
                    )}
                    $
                  </p>
                  <p className="text-xl line-through text-gray-500">
                    {product.price.toLocaleString("vi-VN")}$
                  </p>
                </div>
              ) : (
                <p className="text-3xl font-bold">
                  {product.price.toLocaleString("vi-VN")}$
                </p>
              )}
            </div>
            <div className="mb-6">
              <p className="text-lg font-semibold mb-2">Quantity:</p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-1 border rounded-md hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleInputQuantity}
                  className="w-20 text-center border rounded-md py-1"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1 border rounded-md hover:bg-gray-100"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-lg mb-6">
              Status:{" "}
              {product.stock > 0 ? (
                <span className="text-green-600">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={` py-3 px-6 rounded-lg text-white text-lg font-semibold
                ${
                  product.stock > 0
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              Add to Cart
            </button>
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">
                Product Description
              </h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">Ingredient</h2>
              <p className="text-gray-700">{product.ingredient}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
