import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin, Card } from "antd";
import { quizService } from "../../services/quizService";
import { getRoutineBySkinTypeId } from "../../services/api.routine";
import { getRecommendedProducts } from "../../services/api.product";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../productlist/ProductCard";

const Result = () => {
  const { resultId } = useParams();
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
      const routinesData = await getRoutineBySkinTypeId(detailedResult.skinTypeId);
      setRoutines(routinesData);

      // Fetch recommended products for each routine step
      const productsMap = {};
      for (const routine of routinesData) {
        for (const step of routine.steps) {
          try {
            const products = await getRecommendedProducts(detailedResult.skinTypeId, step.categoryId);
            // Filter products with recommendedLevel = 3
            const highlyRecommended = products.filter(product =>
              product.productSkinTypes.some(pst =>
                pst.skinTypeId === detailedResult.skinTypeId && pst.recommentedLevel === 3
              )
            );
            productsMap[step.id] = highlyRecommended;
          } catch (error) {
            console.error(`Error fetching products for step ${step.id}:`, error);
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

  const RoutineCard = ({ routine }) => (
    <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h4 className="text-xl font-semibold text-purple-600">{routine.name}</h4>
        <p className="text-gray-600">{routine.description}</p>
      </div>

      <div className="space-y-6">
        {routine.steps
          .sort((a, b) => a.stepOrder - b.stepOrder)
          .map((step) => (
            <div key={step.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-purple-600 font-semibold">Step {step.stepOrder}:</span>
                <h5 className="font-medium">{step.name}</h5>
              </div>
              <p className="text-gray-600 text-sm mb-3">{step.description}</p>

              {/* Recommended Products for this step */}
              {recommendedProducts[step.id]?.length > 0 && (
                <div className="mt-3">
                  <h6 className="text-sm font-semibold mb-2">Recommended Products:</h6>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedProducts[step.id].map((product) => (
                      <div key={product.id} className="transform transition hover:scale-105">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
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
      <Header />
      <div className="min-h-screen bg-purple-50 py-12">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            {/* Skin Type Result */}
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Your Skin Type Results</h2>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {routines.map((routine) => (
                    <RoutineCard key={routine.id} routine={routine} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Result;
