import React, { useState, useEffect } from "react";
import { FaArrowRight, FaShare, FaSave } from "react-icons/fa";
import { message, Spin, Card, Image } from "antd";
import { quizService } from "../../services/quizService";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const SkinQuiz = () => {
  const [step, setStep] = useState(0);
  const [quizData, setQuizData] = useState(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      const response = await quizService.getQuestions();
      if (response && response.data) {
        setQuizData(response.data);
      } else {
        message.error("Invalid quiz data format");
      }
    } catch (error) {
      message.error("Failed to fetch quiz questions: " + error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answerId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const getCurrentQuestions = () => {
    if (!quizData || !quizData.questions) return [];
    return quizData.questions;
  };

  const getCurrentQuestion = () => {
    const questions = getCurrentQuestions();
    if (step <= 0 || step > questions.length) return null;
    return questions[step - 1];
  };

  const submitQuiz = async () => {
    try {
      setLoading(true);
      const submitData = {
        answers: Object.entries(answers).map(([questionId, answerId]) => ({
          questionId: parseInt(questionId),
          answerId: parseInt(answerId)
        }))
      };

      const resultData = await quizService.submitAnswers(submitData);
      if (resultData && resultData.data) {
        setResult(resultData.data);
        setStep(getCurrentQuestions().length + 1);

        const recommendData = await quizService.getRecommendations(resultData.data.skinType);
        if (recommendData && recommendData.data) {
          setRecommendations(recommendData.data);
        }
      }
    } catch (error) {
      message.error("Failed to submit quiz: " + error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderWelcome = () => (
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">
        Discover Your Skin Type
      </h1>
      <p className="text-lg mb-8 text-gray-600">
        Take our personalized skin quiz to find your perfect skincare routine
      </p>
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
    if (loading || !quizData) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spin size="large" />
        </div>
      );
    }

    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return null;

    const questions = getCurrentQuestions();
    const totalQuestions = questions.length;

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-8">
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-2 bg-purple-600 rounded-full transition-all"
              style={{ width: `${(step / totalQuestions) * 100}%` }}
            ></div>
          </div>
          <div className="text-right text-sm text-gray-500 mt-2">
            {step}/{totalQuestions}
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h3 className="text-xl font-semibold mb-6">
            {currentQuestion.content}
          </h3>

          <div className="space-y-4">
            {currentQuestion.answers.map((answer) => (
              <label
                key={answer.id}
                className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${answers[currentQuestion.id] === answer.id
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-purple-200"
                  }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={answer.id}
                  checked={answers[currentQuestion.id] === answer.id}
                  onChange={() => handleAnswer(currentQuestion.id, answer.id)}
                  className="hidden"
                />
                <span className="text-gray-700">{answer.content}</span>
              </label>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 text-purple-600 hover:bg-purple-50 rounded-full"
              disabled={step === 1}
            >
              Back
            </button>
            <button
              onClick={() => {
                if (step === totalQuestions) {
                  submitQuiz();
                } else {
                  setStep(step + 1);
                }
              }}
              disabled={!answers[currentQuestion.id]}
              className="px-6 py-2 bg-purple-600 text-white rounded-full disabled:opacity-50"
            >
              {step === totalQuestions ? "See Results" : "Next"}
            </button>
          </div>
        </div>
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
          {recommendations && (
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-6">
                Your Personalized Skincare Routine
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.routines.map((routine, index) => (
                  <div key={index}>{renderRoutineCard(routine)}</div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Products */}
          {recommendations && (
            <div>
              <h3 className="text-xl font-semibold mb-6">
                Recommended Products for Your Skin Type
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {recommendations.products.map((product, index) => (
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
        {step > 0 && step <= getCurrentQuestions().length && renderQuestion()}
        {step > getCurrentQuestions().length && renderResult()}
      </div>
      <Footer />
    </>
  );
};

export default SkinQuiz;
