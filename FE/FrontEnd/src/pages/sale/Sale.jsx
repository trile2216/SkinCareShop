import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../productlist/ProductCard";

const Sale = () => {
  const [saleProducts, setSaleProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5286/api/product")
      .then((response) => {
        const filteredProducts = response.data.filter(
          (product) => product.sale > 0
        );
        setSaleProducts(filteredProducts);
      })
      .catch((error) => console.error("Error loading:", error));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-4">
        <h2 className="text-3xl font-bold text-center text-rose-500 mb-6">
          Products on Sale
        </h2>
        {saleProducts.length === 0 ? (
          <p className="text-center text-gray-600">
            No sale products available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {saleProducts.map((product) => (
              <div key={product.id} className="scale-90">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Sale;
