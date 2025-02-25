import React, { useState } from "react";
import { FaArrowRight, FaShare, FaSave } from "react-icons/fa";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const SkinQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState("");

  const questions = [
    {
      id: "1",
      category: "D/O",
      question: "How does your skin feel 2 hours after washing your face?",
      options: [
        "Very dry, tight and possibly flaky",
        "A little dry but still comfortable",
        "Normal, neither dry nor oily",
        "Oily, especially in the T-zone",
      ],
    },
    {
      id: "2",
      category: "D/O",
      question: "What is the size of the pores on your face?",
      options: [
        "Hard to see with the naked eye",
        "Small and subtle",
        "Moderate",
        "Large and easily visible",
      ],
    },
    {
      id: "3",
      category: "D/O",
      question:
        "How many times a day do you usually have to apply moisturizer?",
      options: [
        "Many times a day because my skin always feels dry",
        "2 times a day as a habit",
        "1 time a day is enough",
        "Rarely need to use moisturizer",
      ],
    },
    {
      id: "4",
      category: "D/O",
      question: "How does your T-zone feel at noon?",
      options: [
        "Dry and feels tight",
        "Normal, no special signs",
        "Slightly shiny",
        "Very oily",
      ],
    },
    {
      id: "5",
      category: "D/O",
      question: "When you apply makeup, how often does your powder work",
      options: [
        "Dries out and clumps",
        "Stays put",
        "Slightly fades at the end of the day",
        "Waves off a lot and needs to be blotted frequently",
      ],
    },
    {
      id: "6",
      category: "D/O",
      question: "Does your skin tend to have acne?",
      options: [
        "Rarely has acne",
        "Occasionally has 1-2 pimples",
        "Often has small pimples",
        "Often has inflammatory acne and blackheads",
      ],
    },
    {
      id: "7",
      category: "D/O",
      question: "When you touch your face, how does it feel",
      options: ["Rough", "Soft", "Slightly oily", "Very oily"],
    },
    {
      id: "8",
      category: "D/O",
      question: "After waking up in the morning, your facial skin",
      options: ["Feels tight and dry", "Normal", "Slightly shiny", "Very oily"],
    },
    {
      id: "9",
      category: "D/O",
      question: "When not using moisturizer, your skin",
      options: [
        "Very uncomfortable and can peel",
        "A little dry but still acceptable",
        "No problem",
        "Feels more comfortable",
      ],
    },
    {
      id: "10",
      category: "D/O",
      question: "When using facial cleanser, what type do you prefer",
      options: [
        "Thick, moisturizing cream",
        "Gentle milk",
        "Clear gel",
        "Foamy and deep cleansing",
      ],
    },
    {
      id: "11",
      category: "S/R",
      question: "How does your skin usually react when using new products?",
      options: [
        "Often irritated, red or itchy",
        "Sometimes mild reactions",
        "Rarely problems",
        "Almost never reacts",
      ],
    },
    {
      id: "12",
      category: "S/R",
      question: "Does your skin turn red easily when",
      options: [
        "Always red, even without any impact",
        "Easily red when exposed to sunlight or rubbing",
        "Occasionally red under harsh conditions",
        "Rarely or never red",
      ],
    },
    {
      id: "13",
      category: "S/R",
      question:
        "Have you ever been diagnosed with skin problems such as eczema, rosacea?",
      options: ["Yes, often", "Sometimes mild", "Rarely", "Never"],
    },
    {
      id: "14",
      category: "S/R",
      question: "When the weather changes, your skin",
      options: [
        "Very easily irritated and red",
        "Sometimes has a mild reaction",
        "Rarely affected",
        "Never affected",
      ],
    },
    {
      id: "15",
      category: "S/R",
      question: "With scented products, your skin",
      options: [
        "Always irritated",
        "Occasionally irritated",
        "Rarely reacts",
        "Never reacts",
      ],
    },
    {
      id: "16",
      category: "S/R",
      question: "When applying makeup, your skin",
      options: [
        "Often itchy and uncomfortable",
        "Sometimes uncomfortable",
        "Rarely a problem",
        "Never a problem",
      ],
    },
    {
      id: "17",
      category: "S/R",
      question: "With sunlight, your skin",
      options: [
        "Very prone to sunburn and irritation",
        "Prone to redness but recovers quickly",
        "Sometimes a little red",
        "Rarely affected",
      ],
    },
    {
      id: "18",
      category: "S/R",
      question: "Does your skin get red easily when:",
      options: [
        "Slightly red but goes away quickly",
        "Always red and irritated for a long time",
        "Very mild redness",
        "No reaction",
      ],
    },
    {
      id: "19",
      category: "S/R",
      question: "With stress or anxiety, your skin",
      options: [
        "Prone to rashes and irritation",
        "Sometimes mild reactions",
        "Rarely affected",
        "Never affected",
      ],
    },
    {
      id: "20",
      category: "S/R",
      question: "When you drink alcohol or eat spicy food, your skin",
      options: [
        "Always red and hot",
        "Sometimes red",
        "Rarely reacts",
        "Never reacts",
      ],
    },
    {
      id: "21",
      category: "P/N",
      question: "Does your skin tend to darken after acne?",
      options: [
        "Always leaves lasting dark spots",
        "Sometimes has light dark spots",
        "Rarely dark",
        "Never dark",
      ],
    },
    {
      id: "22",
      category: "P/N",
      question: "When exposed to the sun, your skin:",
      options: [
        "Easily darkens and is uneven in color",
        "Dissolves slowly and evenly",
        "Little color change",
        "Almost no change",
      ],
    },
    {
      id: "23",
      category: "P/N",
      question: "Do you have freckles or brown spots on your skin?",
      options: ["Many and obvious", "A few spots", "Very few", "None"],
    },
    {
      id: "24",
      category: "P/N",
      question: "Your skin tone without makeup",
      options: [
        "Uneven, with many dark areas",
        "Slightly uneven",
        "Relatively even",
        "Very even",
      ],
    },
    {
      id: "25",
      category: "P/N",
      question: "When scratched, your skin",
      options: [
        "Always leaves a lasting dark spot",
        "Light dark spot that takes a while to go away",
        "Rarely leaves a dark spot",
        "Never dark",
      ],
    },
    {
      id: "26",
      category: "P/N",
      question: "Around your eyes",
      options: [
        "There are visible dark circles",
        "Slightly dark",
        "Even color",
        "Bright and even",
      ],
    },
    {
      id: "27",
      category: "P/N",
      question: "When using whitening products",
      options: [
        "Skin is easily irritated and uneven in color",
        "It takes a long time to see results",
        "Moderately effective",
        "Rarely needed",
      ],
    },
    {
      id: "28",
      category: "P/N",
      question: "For old scars",
      options: [
        "Usually dark and obvious",
        "Slightly dark",
        "Faint",
        "Almost invisible",
      ],
    },
    {
      id: "29",
      category: "P/N",
      question: "When bitten by insects",
      options: [
        "Always leaves a dark mark for a long time",
        "Lightly dark for a while",
        "Rarely dark",
        "Never dark",
      ],
    },
    {
      id: "30",
      category: "P/N",
      question: "Your neck area compared to your face",
      options: [
        "Much darker",
        "Slightly darker",
        "Relatively even",
        "Completely even",
      ],
    },
    {
      id: "31",
      category: "T/W",
      question: "When you gently pull the skin and release it, the skin:",
      options: [
        "Immediately returns to its original position",
        "Returns a little slower",
        "Takes a few seconds to return",
        "Returns very slowly",
      ],
    },
    {
      id: "32",
      category: "T/W",
      question: "What are the wrinkles on your face:",
      options: [
        "None or only when moving",
        "A few small wrinkles",
        "Clear wrinkles",
        "Many deep wrinkles",
      ],
    },
    {
      id: "33",
      category: "T/W",
      question: "What does your face tend to look like",
      options: [
        "Firm and plump",
        "Relatively firm",
        "Starting to sag slightly",
        "Obviously sagging",
      ],
    },
    {
      id: "34",
      category: "T/W",
      question: "When you smile, wrinkles",
      options: [
        "Disappears immediately when you stop smiling",
        "Takes a while to disappear",
        "Stays for quite a while",
        "Always present",
      ],
    },
    {
      id: "35",
      category: "T/W",
      question: "Your eye area",
      options: [
        "Tight and wrinkle-free",
        "Some fine lines",
        "Clear lines",
        "Many deep lines",
      ],
    },
    {
      id: "36",
      category: "T/W",
      question: "Skin elasticity when pressed lightly",
      options: [
        "Immediate recovery",
        "Recovery is relatively fast",
        "Recovery is slow",
        "Recovery takes a long time",
      ],
    },
    {
      id: "37",
      category: "T/W",
      question: "Your jawline",
      options: [
        "Definite and firm",
        "Relatively well defined",
        "Slightly saggy",
        "Very saggy",
      ],
    },
    {
      id: "38",
      category: "T/W",
      question: "Your cheeks",
      options: [
        "Naturally full",
        "Slightly saggy",
        "Signs of sagging",
        "Significantly sagging",
      ],
    },
    {
      id: "39",
      category: "T/W",
      question: "Wake up with pillow wrinkles",
      options: [
        "Disappears immediately",
        "Takes about 30 minutes",
        "Takes a few hours",
        "Lasts all day",
      ],
    },
    {
      id: "40",
      category: "T/W",
      question: "Lasts all day",
      options: [
        "The foundation goes on very smoothly",
        "The foundation goes on fairly evenly",
        "The foundation tends to settle in wrinkles",
        "The foundation always settles and shows wrinkles",
      ],
    },
  ];

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [step]: answer });
  };

  const calculateResult = () => {
    const scores = { D: 0, S: 0, P: 0, T: 0 };

    Object.keys(answers).forEach((key) => {
      const question = questions[key - 1];
      const answerIndex = question.options.indexOf(answers[key]);
      const score = answerIndex + 1;

      if (question.category === "D/O") scores.D += score;
      if (question.category === "S/R") scores.S += score;
      if (question.category === "P/N") scores.P += score;
      if (question.category === "T/W") scores.T += score;
    });

    const getSkinType = (score, type) => {
      if (score <= 20) return type;
      if (score <= 25) return type;
      if (score <= 30) return type;
      if (score <= 35)
        return type === "D"
          ? "O"
          : type === "S"
          ? "R"
          : type === "P"
          ? "N"
          : "W";
      return type === "D" ? "O" : type === "S" ? "R" : type === "P" ? "N" : "W";
    };

    const skinType = `${getSkinType(scores.D, "D")}${getSkinType(
      scores.S,
      "S"
    )}${getSkinType(scores.P, "P")}${getSkinType(scores.T, "T")}`;
    setResult(skinType);
  };

  const renderWelcome = () => (
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">
        Discover Your Skin Type
      </h1>
      <p className="text-lg mb-8 text-gray-600">
        According to Dr. Baumann Method
      </p>
      <button
        onClick={() => setStep(1)}
        className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 mx-auto"
      >
        Start Checking
        <FaArrowRight />
      </button>
    </div>
  );

  const renderQuestion = () => (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div
            className="h-2 bg-purple-600 rounded-full transition-all"
            style={{ width: `${(step / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-sm text-purple-600 mb-2">
          Question: {questions[step - 1].id}/40
        </h2>
        <h3 className="text-xl font-semibold mb-6">
          {questions[step - 1].question}
        </h3>

        <div className="space-y-4">
          {questions[step - 1].options.map((option, index) => (
            <label
              key={index}
              className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                answers[step] === option
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-purple-200"
              }`}
            >
              <input
                type="radio"
                name={`question-${step}`}
                value={option}
                checked={answers[step] === option}
                onChange={() => handleAnswer(option)}
                className="hidden"
              />
              <span className="text-gray-700">{option}</span>
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
              if (step === questions.length) {
                calculateResult();
                setStep(step + 1);
              } else {
                setStep(step + 1);
              }
            }}
            disabled={!answers[step]}
            className="px-6 py-2 bg-purple-600 text-white rounded-full disabled:opacity-50"
          >
            {step === questions.length ? "Result" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg p-8 shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-6">Your Skin Type: </h2>
        <div className="text-4xl font-bold text-purple-600 mb-8">{result}</div>

        <div className="flex gap-4 justify-center">
          <button className="flex items-center gap-2 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-full hover:bg-purple-50">
            <FaSave /> Save result
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-purple-50 py-12">
        {step === 0 && renderWelcome()}
        {step > 0 && step <= questions.length && renderQuestion()}
        {step > questions.length && renderResult()}
      </div>
      <Footer />
    </>
  );
};

export default SkinQuiz;
