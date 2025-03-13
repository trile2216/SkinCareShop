import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin, Card, Image } from "antd";
import { quizService } from "../../services/quizService";
import { getRoutineBySkinTypeId } from "../../services/api.routine";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Result = () => {
  const { resultId } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

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

      // Fetch recommendations
      const recommendationsData = await getRoutineBySkinTypeId(detailedResult.skinTypeId);
      console.log(recommendationsData);
      setRecommendations(recommendationsData);
    } catch (error) {
      console.error("Error fetching result:", error);
    } finally {
      setLoading(false);
    }
  };

  const ProductCard = ({ product }) => (
    <Card
      hoverable
      className="h-full max-w-[250px]"
      bodyStyle={{ padding: "12px" }}
      cover={
        <Image
          alt={product.name}
          src={product.image}
          className="object-cover h-32"
          style={{ borderRadius: "8px 8px 0 0" }}
        />
      }
    >
      <Card.Meta
        title={<span className="text-sm font-medium">{product.name}</span>}
        description={
          <div className="text-xs">
            <p className="text-gray-600 mb-1 line-clamp-2">
              {product.description}
            </p>
            <p className="text-purple-600 font-semibold">${product.price}</p>
          </div>
        }
      />
    </Card>
  );

  const RoutineCard = ({ routine }) => (
    <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h4 className="text-xl font-semibold text-purple-600">{routine.name}</h4>
        <p className="text-gray-600">{routine.description}</p>
      </div>

      <div className="space-y-4">
        {routine.steps
          .sort((a, b) => a.stepOrder - b.stepOrder)
          .map((step) => (
            <div key={step.id} className="border-b pb-3 last:border-b-0">
              <div className="flex items-center gap-2">
                <span className="text-purple-600 font-semibold">Step {step.stepOrder}:</span>
                <h5 className="font-medium">{step.name}</h5>
              </div>
              <p className="text-gray-600 text-sm mt-1">{step.description}</p>
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

            {/* Recommended Routine */}
            {recommendations && recommendations.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-6">
                  Your Personalized Skincare Routine
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.map((routine) => (
                    <RoutineCard key={routine.id} routine={routine} />
                  ))}
                </div>
              </div>
            )}


            {/* {recommendations?.products && (
              <div>
                <h3 className="text-xl font-semibold mb-6">
                  Recommended Products for Your Skin Type
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {recommendations.products.map((product, index) => (
                    <div key={index} className="flex justify-center">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Result;
