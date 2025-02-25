import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FaStar, FaRegStar, FaShoppingCart } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

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

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden group">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            title="Add to Cart"
          >
            <FaShoppingCart className="text-gray-800 text-xl" />
          </button>
        </div>
        {product.sale > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md">
            {product.sale}% OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.brand}</p>

        <div className="flex items-center mb-2">
          {renderRatingStars(product.rating)}
          <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
        </div>

        <div className="mb-3">
          {product.sale > 0 ? (
            <div className="space-y-1">
              <p className="text-lg font-bold text-red-500">
                {(product.price * (1 - product.sale / 100)).toLocaleString(
                  "vi-VN"
                )}
                $
              </p>
              <p className="text-sm line-through text-gray-500">
                {product.price.toLocaleString("vi-VN")}$
              </p>
            </div>
          ) : (
            <>
              <p className="text-lg font-bold">
                {product.price.toLocaleString("vi-VN")}$
              </p>
              <p className="text-lg font-bold">&nbsp;</p>
            </>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3">
          {product.stock > 0 ? (
            <span className="text-green-600">In Stock: {product.stock}</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </p>
        <Link
          to={`/product/${product.id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
