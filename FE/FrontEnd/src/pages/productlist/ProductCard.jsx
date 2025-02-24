import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FaStar, FaRegStar } from "react-icons/fa";

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

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="relative aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold truncate mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.brand}</p>

        <div className="flex items-center mb-2">
          {renderRatingStars(product.rating)}
          <span className="ml-1 text-sm text-gray-600">({product.rating})</span>
        </div>

        <div className="mb-3">
          {product.sale > 0 ? (
            <>
              <p className="text-lg font-bold text-red-500">
                {(product.price * (1 - product.sale)).toLocaleString("vi-VN")}{" "}
                VND
              </p>
              <p className="text-sm line-through text-gray-500">
                {product.price.toLocaleString("vi-VN")} $
              </p>
            </>
          ) : (
            <p className="text-lg font-bold">
              {product.price.toLocaleString("vi-VN")} $
            </p>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-2">
          {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
