import { useState, useEffect, useMemo } from "react";
import api from "../../config/axios";
import ProductCard from "./ProductCard";
import { Slider } from "antd";
import { Pagination } from "antd"; 
import { useSearch } from "../../context/SearchContext";

const ProductList = () => {
  // Phân trang
  const productsPerPage = 9; 
  const [currentPage, setCurrentPage] = useState(1); 

  // Search value
  const { searchQuery } = useSearch(); 

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 50],
    category: "",
    brand: "",
    skinType: "",
    onSaleOnly: false,
  });
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes, brandsRes, skinTypesRes] =
          await Promise.all([
            api.get("/product"),
            api.get("/category"),
            api.get("/brand"),
            api.get("/skintype"),
          ]);

        const validProducts = productsRes.data?.filter((p) => p) || [];
        const validCategories = categoriesRes.data?.filter((c) => c) || [];
        const validBrands = brandsRes.data?.filter((b) => b && b.id) || [];
        const validSkinTypes =
          skinTypesRes.data?.filter((s) => s && s.id) || [];

        setProducts(validProducts);
        setCategories(validCategories);
        setBrands(validBrands);
        setSkinTypes(validSkinTypes);
        setError(null);
      } catch (error) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) => {
      const brandMatch =
        !filters.brand || product.brandId === parseInt(filters.brand);
      const categoryMatch =
        !filters.category || product.categoryId === parseInt(filters.category);

      // Sửa lại logic kiểm tra skinType và recommentedLevel
      const skinTypeMatch =
        !filters.skinType ||
        (product.productSkinTypes &&
          product.productSkinTypes.some((pst) => {
            // Kiểm tra nếu skinTypeId khớp và recommentedLevel >= 4
            return (
              parseInt(pst.skinTypeId) === parseInt(filters.skinType) &&
              pst.recommentedLevel >= 3
            );
          }));

      // Lọc dựa trên searchQuery
      const searchMatch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return (
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1] &&
        categoryMatch &&
        brandMatch &&
        skinTypeMatch &&
        searchMatch &&
        (!filters.onSaleOnly || product.sale > 0) &&
        product.status === true
      );
    });

    // Sửa lại phần sort
    switch (sortBy) {
      case "priceLowToHigh":
        return result.sort((a, b) => a.price - b.price);
      case "priceHighToLow":
        return result.sort((a, b) => b.price - a.price);
      case "recommentedLevel":
        return result.sort((a, b) => {
          // Lấy recommentedLevel cho sản phẩm với skinType đã chọn
          const getrecommentedLevel = (product) => {
            if (!product.productSkinTypes || !filters.skinType) return 0;
            const skinType = product.productSkinTypes.find(
              (pst) => parseInt(pst.skinTypeId) === parseInt(filters.skinType)
            );
            return skinType ? skinType.recommentedLevel || 0 : 0;
          };

          const aLevel = getrecommentedLevel(a);
          const bLevel = getrecommentedLevel(b);
          return bLevel - aLevel; // Sort từ cao xuống thấp
        });
      default:
        return result;
    }
  }, [filters, products, sortBy, searchQuery]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

   // Lấy danh sách sản phẩm cho trang hiện tại
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage]);

  const renderBrandsSelect = () => (
    <div className="mb-6">
      <h3 className="font-medium mb-2">Brands</h3>
      <select
        value={filters.brand}
        onChange={(e) => handleFilterChange("brand", e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">All Brands</option>
        {brands &&
          brands.length > 0 &&
          brands.map((brand) =>
            brand && brand.id ? (
              <option key={brand.id} value={brand.id.toString()}>
                {brand.name}
              </option>
            ) : null
          )}
      </select>
    </div>
  );

  const renderSkinTypesSelect = () => (
    <div className="mb-6">
      <h3 className="font-medium mb-2">Skin Type</h3>
      <select
        value={filters.skinType}
        onChange={(e) => handleFilterChange("skinType", e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">All Skin Types</option>
        {skinTypes.map((skinType) => (
          <option key={skinType.id} value={skinType.id}>
            {skinType.symbol}
          </option>
        ))}
      </select>
    </div>
  );

  const renderSortSelect = () => (
    <div className="mb-6">
      <h3 className="font-medium mb-2">Sort By</h3>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        trackStyle={[{ backgroundColor: "#fb7185" }]} // Thanh trượt màu rose-400
        handleStyle={[
          { borderColor: "#fb7185", backgroundColor: "#fb7185" }, 
          { borderColor: "#fb7185", backgroundColor: "#fb7185" }
        ]}
      >
        <option value="default">Default Sorting</option>
        <option value="priceLowToHigh">Price: Low to High</option>
        <option value="priceHighToLow">Price: High to Low</option>
        {filters.skinType && (
          <option value="recommentedLevel">Best Recommended</option>
        )}
      </select>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-semibold mb-6">Filters</h2>

            {renderSortSelect()}

            <div className="mb-6">
              <h3 className="font-medium mb-2">Price Range</h3>
              <Slider
                range
                min={0}
                max={50}
                step={5}
                value={filters.priceRange}
                onChange={(value) => handleFilterChange("priceRange", value)}
                trackStyle={[{ backgroundColor: "#fb7185" }]} // Thanh trượt màu rose-400
                handleStyle={[
                  { borderColor: "#fb7185", backgroundColor: "#fb7185" }, 
                  { borderColor: "#fb7185", backgroundColor: "#fb7185" }
                ]} 
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span  className="text-rose-600">{filters.priceRange[0].toLocaleString("vi-VN")} $</span>
                <span className="text-rose-600">{filters.priceRange[1].toLocaleString("vi-VN")} $</span>
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

            {renderBrandsSelect()}
            {renderSkinTypesSelect()}
          </div>

          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Phân trang */}
            <div className="mt-8 flex justify-center">
              <Pagination
                        current={currentPage}
                        pageSize={productsPerPage}
                        total={filteredAndSortedProducts.length}
                        onChange={(page) => setCurrentPage(page)}
                      />
              </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ProductList;
