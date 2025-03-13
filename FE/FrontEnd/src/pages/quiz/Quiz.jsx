import React, { useState, useEffect } from "react";
import { FaArrowRight, FaShare, FaSave } from "react-icons/fa";
import { message, Spin, Card, Image } from "antd";
import { quizService } from "../../services/quizService";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const [step, setStep] = useState(0);
  const [mainQuiz, setMainQuiz] = useState(null);
  const [currentSkinQuizIndex, setCurrentSkinQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    fetchActiveQuiz();
  }, []);

  const fetchActiveQuiz = async () => {
    try {
      setLoading(true);
      const response = await quizService.getActiveQuiz();
      console.log("API Response:", response);
      console.log("Response Length:", response.length);

      if (Array.isArray(response) && response.length > 0) {
        setMainQuiz(response[0]); // Chọn phần tử đầu tiên của mảng
      } else {
        console.error("No data in response");
        message.error("No data received from API");
      }
    } catch (error) {
      message.error("Failed to fetch quiz questions");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answerId) => {
    const currentSkinQuiz = mainQuiz.skinQuizzes[currentSkinQuizIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentSkinQuiz.id]: {
        ...prev[currentSkinQuiz.id],
        [questionId]: answerId,
      },
    }));
  };

  const getCurrentQuestions = () => {
    if (!mainQuiz || !mainQuiz.skinQuizzes[currentSkinQuizIndex]) return [];
    return mainQuiz.skinQuizzes[currentSkinQuizIndex].questions;
  };

  const submitQuiz = async () => {
    try {
      setLoading(true);

      // Format answers theo cấu trúc BE yêu cầu
      const customerAnswers = Object.entries(answers).map(
        ([skinQuizId, questionAnswers]) => ({
          skinQuizId: parseInt(skinQuizId),
          skinElement: mainQuiz.skinQuizzes.find(
            (sq) => sq.id === parseInt(skinQuizId)
          ).skinElement,
          answers: Object.entries(questionAnswers).map(
            ([questionId, answerId]) => ({
              questionId: parseInt(questionId),
              answerId: parseInt(answerId),
            })
          ),
        })
      );
      const customerId = parseInt(localStorage.getItem("customerId"));
      console.log("Customer ID:", customerId);
      // try {

      const submission = {
        mainQuizId: mainQuiz?.id,
        customerId: customerId, // Sử dụng customerId từ localStorage
        customerAnswers: customerAnswers,
      };

      const result = await quizService.submitQuiz(submission);
      setResult(result);
      setStep(mainQuiz?.skinQuizzes?.length + 1);

      // Sau khi có kết quả, lấy thêm thông tin chi tiết về kết quả
      const detailedResult = await quizService.getCustomerResult(
        localStorage.getItem("customerId")
      );
      setResult(detailedResult);
    } catch (error) {
      message.error("Failed to submit quiz");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const currentQuestions = getCurrentQuestions();
    if (currentSkinQuizIndex < mainQuiz?.skinQuizzes?.length - 1) {
      setCurrentSkinQuizIndex((prev) => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const renderWelcome = () => (
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">
        Discover Your Skin Type
      </h1>
      {/*<p className="text-lg mb-8 text-gray-600">
        Welcome {user?.username}! Take our personalized skin quiz to find your perfect skincare routine
      </p>*/}
      <button
        onClick={() => setStep(1)}
        className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 mx-auto"
      >
        Start Quiz
        <FaArrowRight />
      </button>
    </div>
  );

  const renderQuestion = () => {
    if (loading || !mainQuiz) {
      return <Spin size="large" />;
    }

    const currentSkinQuiz = mainQuiz.skinQuizzes[currentSkinQuizIndex];
    const currentQuestions = getCurrentQuestions();

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-8">
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-2 bg-purple-600 rounded-full transition-all"
              style={{
                width: `${
                  ((currentSkinQuizIndex + 1) / mainQuiz?.skinQuizzes?.length) *
                  100
                }%`,
              }}
            />
          </div>
          <div className="text-right text-sm text-gray-500 mt-2">
            {currentSkinQuizIndex + 1}/{mainQuiz?.skinQuizzes?.length}
          </div>
        </div>

        <Card className="shadow-lg">
          <h3 className="text-xl font-semibold mb-6">
            {currentSkinQuiz.skinElement}
          </h3>

          {currentQuestions.map((question) => (
            <div key={question.id} className="mb-6">
              <p className="mb-4">{question.content}</p>
              <div className="space-y-4">
                {question.answers.map((answer) => (
                  <label
                    key={answer.id}
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[currentSkinQuiz.id]?.[question.id] === answer.id
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-purple-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={answer.id}
                      checked={
                        answers[currentSkinQuiz.id]?.[question.id] === answer.id
                      }
                      onChange={() => handleAnswer(question.id, answer.id)}
                      className="hidden"
                    />
                    <span className="text-gray-700">{answer.content}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentSkinQuizIndex((prev) => prev - 1)}
              className="px-6 py-2 text-purple-600 hover:bg-purple-50 rounded-full"
              disabled={currentSkinQuizIndex === 0}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-purple-600 text-white rounded-full disabled:opacity-50"
              disabled={!answers[currentSkinQuiz.id]}
            >
              {currentSkinQuizIndex === mainQuiz?.skinQuizzes?.length - 1
                ? "See Results"
                : "Next"}
            </button>
          </div>
        </Card>
      </div>
    );
  };

  const renderRoutineCard = (routine) => (
    <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
      <h4 className="text-lg font-semibold mb-2">{routine.step}</h4>
      <p className="text-gray-600 mb-4">{routine.description}</p>
      <div className="text-sm text-gray-500">
        <p>Best time: {routine.bestTime}</p>
        <p>Frequency: {routine.frequency}</p>
      </div>
    </Card>
  );

  const renderProductCard = (product) => (
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

  const renderResult = () => {
    if (loading || !result) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spin size="large" />
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Your Skin Type Results</h2>
            <div className="text-4xl font-bold text-purple-600 mb-8">
              {result.skinType}
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              {result.description}
            </p>
            <div className="flex gap-4 justify-center">
              <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700">
                <FaSave /> Save Results
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-full hover:bg-purple-50">
                <FaShare /> Share Results
              </button>
            </div>
          </div>

          {/* Recommended Routine */}
          {result.recommendations && (
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-6">
                Your Personalized Skincare Routine
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.recommendations.routines.map((routine, index) => (
                  <div key={index}>{renderRoutineCard(routine)}</div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Products */}
          {result.recommendations && (
            <div>
              <h3 className="text-xl font-semibold mb-6">
                Recommended Products for Your Skin Type
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {result.recommendations.products.map((product, index) => (
                  <div key={index} className="flex justify-center">
                    {renderProductCard(product)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-purple-50 py-12">
        {step === 0 && renderWelcome()}
        {step > 0 && step <= mainQuiz?.skinQuizzes?.length && renderQuestion()}
        {step > (mainQuiz?.skinQuizzes?.length || 0) && renderResult()}
      </div>
      <Footer />
    </>
  );
};

export default Quiz;
