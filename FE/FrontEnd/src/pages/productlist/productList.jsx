import React, { useState, useEffect, useMemo } from "react";
import { useCart } from "../../context/CartContext";
import api from "../../config/axios";
import ProductCard from "./ProductCard";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Slider } from "antd";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 50],
    category: "",
    brand: "",
    onSaleOnly: false,
  });
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        api.get("/product"),
        api.get("/category"),
        api.get("/brand"),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setBrands(brandsRes.data);
      setError(null);
    };

    fetchData();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) => {
      return (
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1] &&
        (!filters.category ||
          product.categoryId === parseInt(filters.category)) &&
        (!filters.brand || product.brandId === parseInt(filters.brandName)) &&
        (!filters.onSaleOnly || product.sale > 0) &&
        product.status === true
      );
    });

    switch (sortBy) {
      case "priceLowToHigh":
        return result.sort((a, b) => a.price - b.price);
      case "priceHighToLow":
        return result.sort((a, b) => b.price - a.price);
      default:
        return result;
    }
  }, [filters, products, sortBy]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  if (error) return <div>{error}</div>;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-semibold mb-6">Filters</h2>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="default">Default Sorting</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
              </select>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Price Range</h3>
              <Slider
                range
                min={0}
                max={50}
                step={5}
                value={filters.priceRange}
                onChange={(value) => handleFilterChange("priceRange", value)}
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{filters.priceRange[0].toLocaleString("vi-VN")} $</span>
                <span>{filters.priceRange[1].toLocaleString("vi-VN")} $</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Categories</h3>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Brands</h3>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.onSaleOnly}
                  onChange={(e) =>
                    handleFilterChange("onSaleOnly", e.target.checked)
                  }
                  className="rounded"
                />
                <span>On Sale</span>
              </label>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductList;
