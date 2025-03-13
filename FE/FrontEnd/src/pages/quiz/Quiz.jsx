import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { message, Spin, Card } from "antd";
import { quizService } from "../../services/quizService";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [mainQuiz, setMainQuiz] = useState(null);
  const [currentSkinQuizIndex, setCurrentSkinQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActiveQuiz();
  }, []);

  const fetchActiveQuiz = async () => {
    try {
      setLoading(true);
      const response = await quizService.getActiveQuiz();
      if (Array.isArray(response) && response.length > 0) {
        setMainQuiz(response[0]);
      } else {
        message.error("No quiz available");
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
      const submission = {
        mainQuizId: mainQuiz?.id,
        customerId: customerId,
        customerAnswers: customerAnswers,
      };

      const result = await quizService.submitQuiz(submission);
      // Chuyển hướng đến trang Result với resultId
      navigate(`/result`);
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
                width: `${((currentSkinQuizIndex + 1) / mainQuiz?.skinQuizzes?.length) * 100}%`,
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
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${answers[currentSkinQuiz.id]?.[question.id] === answer.id
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-200"
                      }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={answer.id}
                      checked={answers[currentSkinQuiz.id]?.[question.id] === answer.id}
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-purple-50 py-12">
        {step === 0 && renderWelcome()}
        {step > 0 && renderQuestion()}
      </div>
      <Footer />
    </>
  );
};

export default Quiz;
