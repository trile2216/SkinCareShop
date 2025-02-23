import { useState, useEffect, useMemo } from "react";
import { FaHeart, FaStar, FaStarHalf, FaShoppingCart } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";
import api from "../../config/axios";

const categories = ["Skincare", "Makeup", "Hair Care", "Body Care"];
const brands = ["Luminous", "Glamour", "Vitality"];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 200],
    category: "",
    brand: "",
    onSaleOnly: false,
    minRating: 0,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/product");
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const price = product.salePrice || product.originalPrice;
      return (
        price >= filters.priceRange[0] &&
        price <= filters.priceRange[1] &&
        (!filters.category || product.category === filters.category) &&
        (!filters.brand || product.brand === filters.brand) &&
        (!filters.onSaleOnly || product.salePrice) &&
        product.rating >= filters.minRating
      );
    });
  }, [filters, products]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={i} />
        ))}
        {hasHalfStar && <FaStarHalf />}
      </div>
    );
  };

  const calculateDiscount = (original, sale) => {
    return Math.round(((original - sale) / original) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4 space-y-6 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800">Filters</h2>

              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: [
                        prev.priceRange[0],
                        parseInt(e.target.value),
                      ],
                    }))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Categories</h3>
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={filters.category === category}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          category: prev.category === category ? "" : category,
                        }))
                      }
                      className="rounded text-pink-500"
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>

              <div>
                <h3 className="font-medium mb-2">Brands</h3>
                {brands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={filters.brand === brand}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          brand: prev.brand === brand ? "" : brand,
                        }))
                      }
                      className="rounded text-pink-500"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.onSaleOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      onSaleOnly: e.target.checked,
                    }))
                  }
                  className="rounded text-pink-500"
                />
                <span>Sale Items Only</span>
              </label>
            </div>

            <div className="lg:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative"
                  >
                    <div className="relative">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      {product.salePrice && (
                        <div className="absolute -top-2 -right-2 overflow-hidden w-24 h-24 z-10">
                          <div className="absolute top-0 right-0 h-8 w-32 bg-red-500 text-white text-center transform rotate-45 origin-top-left translate-y-4 translate-x-6">
                            <span className="text-sm font-bold">
                              {calculateDiscount(
                                product.originalPrice,
                                product.salePrice
                              )}
                              % OFF
                            </span>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-2 left-2 p-2 rounded-full bg-white shadow-sm hover:bg-gray-100"
                      >
                        <FaHeart
                          className={
                            wishlist.includes(product.id)
                              ? "text-red-500"
                              : "text-gray-400"
                          }
                        />
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {product.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <RatingStars rating={product.rating} />
                        <span className="ml-2 text-sm text-gray-600">
                          ({product.rating})
                        </span>
                      </div>

                      <div className="mt-2 flex items-center">
                        {product.salePrice ? (
                          <>
                            <span className="text-lg font-bold text-gray-800">
                              ${product.salePrice}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ${product.originalPrice}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-800">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaShoppingCart />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {selectedProduct.name}
                </h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <RiCloseLine size={24} />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div>
                  <p className="text-gray-600 mb-4">
                    {selectedProduct.description}
                  </p>
                  <div className="flex items-center mb-4">
                    <RatingStars rating={selectedProduct.rating} />
                    <span className="ml-2 text-gray-600">
                      ({selectedProduct.rating})
                    </span>
                  </div>
                  <div className="flex items-center">
                    {selectedProduct.salePrice ? (
                      <>
                        <span className="text-2xl font-bold text-gray-800">
                          ${selectedProduct.salePrice}
                        </span>
                        <span className="ml-2 text-gray-500 line-through">
                          ${selectedProduct.originalPrice}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-gray-800">
                        ${selectedProduct.originalPrice}
                      </span>
                    )}
                  </div>
                  <button className="mt-6 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
