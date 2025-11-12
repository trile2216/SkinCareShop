import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin, Card } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { quizService } from "../../services/quizService";
import { getRoutineBySkinTypeId } from "../../services/api.routine";
import { getRecommendedProducts } from "../../services/api.product";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../productlist/ProductCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Result = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [routines, setRoutines] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState({});

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const detailedResult = await quizService.getCustomerResult(
        localStorage.getItem("customerId")
      );
      setResult(detailedResult);

      // Fetch routines
      const routinesData = await getRoutineBySkinTypeId(
        detailedResult.skinTypeId
      );
      setRoutines(routinesData);

      // Fetch recommended products for each routine step
      const productsMap = {};
      for (const routine of routinesData) {
        for (const step of routine.steps) {
          try {
            const products = await getRecommendedProducts(
              detailedResult.skinTypeId,
              step.categoryId
            );
            // Filter products with recommendedLevel = 3
            const highlyRecommended = products.filter((product) =>
              product.productSkinTypes.some(
                (pst) =>
                  pst.skinTypeId === detailedResult.skinTypeId &&
                  pst.recommentedLevel === 3
              )
            );
            productsMap[step.id] = highlyRecommended;
          } catch (error) {
            console.error(
              `Error fetching products for step ${step.id}:`,
              error
            );
            productsMap[step.id] = [];
          }
        }
      }
      setRecommendedProducts(productsMap);
    } catch (error) {
      console.error("Error fetching result:", error);
    } finally {
      setLoading(false);
    }
  };

  const ProductSlider = ({ products }) => (
    <div className="relative px-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="product-swiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="p-2">
              <ProductCard product={product} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );

  const RoutineCard = ({ routine }) => (
    <Card
      className={`h-full shadow-md hover:shadow-lg transition-shadow ${
        routine.time === "Morning" ? "border-yellow-200" : "border-indigo-200"
      }`}
    >
      <div className="mb-4">
        <p className="text-gray-600">{routine.description}</p>
      </div>

      <div className="space-y-6">
        {routine.steps
          .sort((a, b) => a.stepOrder - b.stepOrder)
          .map((step) => (
            <div key={step.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`font-semibold ${
                    routine.time === "Morning"
                      ? "text-yellow-600"
                      : "text-indigo-600"
                  }`}
                >
                  Step {step.stepOrder}:
                </span>
                <h5 className="font-medium">{step.name}</h5>
              </div>
              <p className="text-gray-600 text-sm mb-3">{step.description}</p>

              {/* Recommended Products Slider */}
              {recommendedProducts[step.id]?.length > 0 && (
                <div className="mt-3">
                  <h6 className="text-sm font-semibold mb-4">
                    Recommended Products:
                  </h6>
                  <ProductSlider products={recommendedProducts[step.id]} />
                </div>
              )}
            </div>
          ))}
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-purple-50 py-12">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            {/* Skin Type Result */}
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">
                Your Skin Type Results
              </h2>
              <div className="text-4xl font-bold text-purple-600 mb-8">
                {result?.symbol}
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                {result?.characteristics}
              </p>
            </div>

            {/* Recommended Routines with Products */}
            {routines.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-6">
                  Your Personalized Skincare Routine
                </h3>
                <div className="space-y-6">
                  {/* Morning Routine First */}
                  {routines
                    .sort((a, b) => {
                      // Sắp xếp Morning lên trước, Night xuống dưới
                      if (a.time === "Morning") return -1;
                      if (b.time === "Morning") return 1;
                      return 0;
                    })
                    .map((routine) => (
                      <div key={routine.id} className="mb-8 last:mb-0">
                        <div className="flex items-center mb-4">
                          <div
                            className={`text-2xl mr-3 ${
                              routine.time === "Morning"
                                ? "text-yellow-500"
                                : "text-indigo-600"
                            }`}
                          >
                            {routine.time === "Morning" ? "☀️" : "🌙"}
                          </div>
                          <h4
                            className={`text-xl font-semibold ${
                              routine.time === "Morning"
                                ? "text-yellow-600"
                                : "text-indigo-600"
                            }`}
                          >
                            {routine.time} Routine
                          </h4>
                        </div>
                        <RoutineCard routine={routine} />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Thêm CSS tùy chỉnh
const styles = `
  .product-swiper {
    padding: 20px 0 40px;
  }

  .product-swiper .swiper-button-next,
  .product-swiper .swiper-button-prev {
    color: #7c3aed;
    background: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .product-swiper .swiper-button-next:after,
  .product-swiper .swiper-button-prev:after {
    font-size: 20px;
  }

  .product-swiper .swiper-pagination-bullet {
    background: #7c3aed;
  }

  .product-swiper .swiper-pagination-bullet-active {
    background: #5b21b6;
  }

  .swiper-slide {
    height: auto;
  }
`;

// Thêm styles vào head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Result;
