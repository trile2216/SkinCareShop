import React, { useState } from "react";
import { FaArrowRight, FaShare, FaSave } from "react-icons/fa";

const SkinQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState("");

  const questions = [
    {
      id: "1",
      category: "D/O",
      question: "Sau khi rửa mặt 2 giờ, da bạn cảm thấy như thế nào?",
      options: [
        "Rất khô, căng và có thể bong tróc",
        "Hơi khô nhưng vẫn thoải mái",
        "Bình thường, không khô cũng không nhờn",
        "Bóng nhờn, đặc biệt ở vùng chữ T",
      ],
    },
    {
      id: "2",
      category: "D/O",
      question: "Kích thước lỗ chân lông trên mặt bạn như thế nào?",
      options: [
        "Khó nhìn thấy bằng mắt thường",
        "Nhỏ và tinh tế",
        "Vừa phải",
        "Lớn và dễ nhìn thấy",
      ],
    },
    {
      id: "3",
      category: "D/O",
      question: "Bạn thường phải thoa kem dưỡng ẩm bao nhiêu lần một ngày?",
      options: [
        "Nhiều lần trong ngày vì da luôn cảm thấy khô",
        "2 lần/ngày theo thói quen",
        "1 lần/ngày là đủ",
        "Hiếm khi cần dùng kem dưỡng ẩm",
      ],
    },
    {
      id: "4",
      category: "D/O",
      question: "Vào buổi trưa, vùng chữ T của bạn như thế nào?",
      options: [
        "Khô và có cảm giác căng",
        "Bình thường, không có dấu hiệu đặc biệt",
        "Hơi bóng nhẹ",
        "Rất bóng nhờn",
      ],
    },
    {
      id: "5",
      category: "D/O",
      question: "Khi trang điểm, phấn của bạn thường",
      options: [
        "Bị khô và vón cục",
        "Giữ nguyên trạng thái",
        "Hơi trôi nhẹ cuối ngày",
        "Trôi nhiều và cần phải thấm dầu thường xuyên",
      ],
    },
    {
      id: "6",
      category: "D/O",
      question: "Da bạn có xu hướng bị mụn không?",
      options: [
        "Hiếm khi bị mụn",
        "Thỉnh thoảng có 1-2 nốt",
        "Thường xuyên có mụn nhỏ",
        "Hay bị mụn viêm và mụn đầu đen",
      ],
    },
    {
      id: "7",
      category: "D/O",
      question: "Khi chạm vào da mặt, bạn cảm thấy",
      options: ["Khô ráp", "Mềm mại", "Hơi nhờn", "Rất nhờn"],
    },
    {
      id: "8",
      category: "D/O",
      question: "Sau khi thức dậy vào buổi sáng, da mặt bạn",
      options: [
        "Cảm thấy căng và khô",
        "Bình thường",
        "Hơi bóng nhẹ",
        "Rất bóng nhờn",
      ],
    },
    {
      id: "9",
      category: "D/O",
      question: "Khi không sử dụng kem dưỡng ẩm, da bạn",
      options: [
        "Rất khó chịu và có thể bong tróc",
        "Hơi khô nhưng vẫn chấp nhận được",
        "Không có vấn đề gì",
        "Cảm thấy thoải mái hơn",
      ],
    },
    {
      id: "10",
      category: "D/O",
      question: "Khi sử dụng sửa rửa mặt, bạn thích loại",
      options: [
        "Dạng kem đặc, có độ ẩm cao",
        "Dạng sữa nhẹ nhàng",
        "Dạng gel trong",
        "Dạng có nhiều bọt và làm sạch sâu",
      ],
    },
    {
      id: "11",
      category: "S/R",
      question: "Khi sử dụng sản phẩm mới, da bạn thường phản ứng như thế nào?",
      options: [
        "Thường xuyên bị kích ứng, đỏ hoặc ngứa",
        "Đôi khi có phản ứng nhẹ",
        "Hiếm khi gặp vấn đề",
        "Hầu như không bao giờ phản ứng",
      ],
    },
    {
      id: "12",
      category: "S/R",
      question: "Da bạn có dễ bị đỏ khi",
      options: [
        "Luôn đỏ, ngay cả khi không có tác động",
        "Dễ đỏ khi tiếp xúc với nắng hoặc cọ xát",
        "Thỉnh thoảng đỏ trong điều kiện khắc nghiệt",
        "Hiếm khi hoặc không bao giờ đỏ",
      ],
    },
    {
      id: "13",
      category: "S/R",
      question:
        "Bạn có từng bị chẩn đoán các vấn đề về da như chàm, rosacea không?",
      options: [
        "Có, thường xuyên gặp vấn đề",
        "Đôi khi có biểu hiện nhẹ",
        "Hiếm khi gặp",
        "Không bao giờ",
      ],
    },
    {
      id: "14",
      category: "S/R",
      question: "Khi thời tiết thay đổi, da bạn",
      options: [
        "Rất dễ bị kích ứng và đỏ",
        "Đôi khi có phản ứng nhẹ",
        "Ít khi bị ảnh hưởng",
        "Không bao giờ bị ảnh hưởng",
      ],
    },
    {
      id: "15",
      category: "S/R",
      question: "Với các sản phẩm có mùi hương, da bạn",
      options: [
        "Luôn bị kích ứng",
        "Thỉnh thoảng bị kích ứng",
        "Hiếm khi phản ứng",
        "Không bao giờ phản ứng",
      ],
    },
    {
      id: "16",
      category: "S/R",
      question: "Khi trang điểm, da bạn",
      options: [
        "Thường xuyên bị ngứa và khó chịu",
        "Đôi khi cảm thấy không thoải mái",
        "Hiếm khi gặp vấn đề",
        "Không bao giờ gặp vấn đề",
      ],
    },
    {
      id: "17",
      category: "S/R",
      question: "Với ánh nắng mặt trời, da bạn",
      options: [
        "Rất dễ bị cháy nắng và kích ứng",
        "Dễ bị đỏ nhưng hồi phục nhanh",
        "Đôi khi hơi đỏ",
        "Hiếm khi bị ảnh hưởng",
      ],
    },
    {
      id: "18",
      category: "S/R",
      question: "Da bạn có dễ bị đỏ khi:",
      options: [
        "Hơi đỏ nhưng nhanh hết",
        "Luôn bị đỏ và kích ứng kéo dài",
        "Đỏ rất nhẹ",
        "Không có phản ứng gì",
      ],
    },
    {
      id: "19",
      category: "S/R",
      question: "Với stress hoặc lo lắng, da bạn",
      options: [
        "Dễ bị nổi mẩn đỏ và kích ứng",
        "Đôi khi có phản ứng nhẹ",
        "Hiếm khi bị ảnh hưởng",
        "Không bao giờ bị ảnh hưởng",
      ],
    },
    {
      id: "20",
      category: "S/R",
      question: "Khi uống rượu hoặc ăn đồ cay, da bạn",
      options: [
        "Luôn bị đỏ và nóng",
        "Thỉnh thoảng bị đỏ",
        "Hiếm khi phản ứng",
        "Không bao giờ phản ứng",
      ],
    },
    {
      id: "21",
      category: "P/N",
      question: "Da bạn có xu hướng thâm sau mụn không?",
      options: [
        "Luôn để lại vết thâm kéo dài",
        "Thỉnh thoảng có vết thâm nhẹ",
        "Hiếm khi thâm",
        "Không bao giờ thâm",
      ],
    },
    {
      id: "22",
      category: "P/N",
      question: "Khi tiếp xúc với nắng, da bạn:",
      options: [
        "Dễ bị đen và không đều màu",
        "Tan từ từ và đều màu",
        "Ít thay đổi màu sắc",
        "Hầu như không thay đổi",
      ],
    },
    {
      id: "23",
      category: "P/N",
      question: "Bạn có tàn nhang hoặc đốm nâu trên da không?",
      options: ["Có nhiều và rõ ràng", "Có một vài đốm", "Rất ít", "Không có"],
    },
    {
      id: "24",
      category: "P/N",
      question: "Màu da của bạn khi không trang điểm",
      options: [
        "Không đều màu, có nhiều vùng sẫm màu",
        "Hơi không đều màu",
        "Tương đối đều màu",
        "Rất đều màu",
      ],
    },
    {
      id: "25",
      category: "P/N",
      question: "Khi bị trầy xước, da bạn",
      options: [
        "Luôn để lại vết thâm lâu dài",
        "Thâm nhẹ và mất một thời gian mới hết",
        "Ít khi để lại vết thâm",
        "Không bao giờ thâm",
      ],
    },
    {
      id: "26",
      category: "P/N",
      question: "Vùng quanh mắt của bạn",
      options: [
        "Có quầng thâm rõ rệt",
        "Hơi thâm",
        "Màu sắc đều",
        "Sáng và đều màu",
      ],
    },
    {
      id: "27",
      category: "P/N",
      question: "Khi dùng các sản phẩm làm trắng",
      options: [
        "Da dễ bị kích ứng và không đều màu",
        "Cần thời gian dài mới thấy hiệu quả",
        "Có hiệu quả vừa phải",
        "Ít khi cần dùng",
      ],
    },
    {
      id: "28",
      category: "P/N",
      question: "Với các vết sẹo cũ",
      options: [
        "Thường sẫm màu và rõ ràng",
        "Hơi sẫm màu",
        "Nhạt màu",
        "Gần như không nhìn thấy",
      ],
    },
    {
      id: "29",
      category: "P/N",
      question: "Khi bị côn trùng cắn",
      options: [
        "Luôn để lại vết thâm lâu",
        "Thâm nhẹ một thời gian",
        "Ít khi thâm",
        "Không bao giờ thâm",
      ],
    },
    {
      id: "30",
      category: "P/N",
      question: "Vùng cổ của bạn so với mặt",
      options: [
        "Sẫm màu hơn nhiều",
        "Hơi sẫm màu",
        "Tương đối đều màu",
        "Hoàn toàn đều màu",
      ],
    },
    {
      id: "31",
      category: "T/W",
      question: "Khi bạn kéo nhẹ da và thả ra, da:",
      options: [
        "Lập tức trở lại vị trí cũ",
        "Trở lại chậm hơn một chút",
        "Mất vài giây để trở lại",
        "Trở lại rất chậm",
      ],
    },
    {
      id: "32",
      category: "T/W",
      question: "Các nếp nhăn trên mặt bạn:",
      options: [
        "Không có hoặc chỉ có khi cử động",
        "Có một vài nếp nhăn nhỏ",
        "Có nếp nhăn rõ ràng",
        "Có nhiều nếp nhăn sâu",
      ],
    },
    {
      id: "33",
      category: "T/W",
      question: "Khuôn mặt bạn có xu hướng",
      options: [
        "Săn chắc và đầy đặn",
        "Tương đối săn chắc",
        "Bắt đầu chảy xệ nhẹ",
        "Rõ ràng bị chảy xệ",
      ],
    },
    {
      id: "34",
      category: "T/W",
      question: "Khi cười, các nếp nhăn",
      options: [
        "Biến mất ngay khi ngừng cười",
        "Mất một lúc mới biến mất",
        "Còn lưu lại khá lâu",
        "Luôn hiện diện",
      ],
    },
    {
      id: "35",
      category: "T/W",
      question: "Vùng mắt của bạn",
      options: [
        "Căng và không có nếp nhăn",
        "Có vài nếp nhăn nhỏ",
        "Có nếp nhăn rõ",
        "Có nhiều nếp nhăn sâu",
      ],
    },
    {
      id: "36",
      category: "T/W",
      question: "Độ đàn hồi của da khi ấn nhẹ",
      options: [
        "Lập tức phục hồi",
        "Phục hồi tương đối nhanh",
        "Phục hồi chậm",
        "Rất lâu mới phục hồi",
      ],
    },
    {
      id: "37",
      category: "T/W",
      question: "Đường viền hàm của bạn",
      options: [
        "Rõ ràng và săn chắc",
        "Tương đối rõ",
        "Hơi chảy xệ",
        "Rất chảy xệ",
      ],
    },
    {
      id: "38",
      category: "T/W",
      question: "Vùng má của bạn",
      options: [
        "Căng đầy tự nhiên",
        "Hơi chảy",
        "Có dấu hiệu chảy xệ",
        "Chảy xệ rõ rệt",
      ],
    },
    {
      id: "39",
      category: "T/W",
      question: "Khi ngủ dậy, các nếp nhăn gối",
      options: [
        "Biến mất ngay",
        "Mất khoảng 30 phút",
        "Mất vài giờ",
        "Kéo dài cả ngày",
      ],
    },
    {
      id: "40",
      category: "T/W",
      question: "Kéo dài cả ngày",
      options: [
        "Kem nền lên da rất mịn",
        "Kem nền lên da tương đối đều",
        "Kem nền hay bị đọng trong nếp nhăn",
        "Kem nền luôn bị đọng và làm lộ nếp nhăn",
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
        Khám Phá Loại Da Của Bạn
      </h1>
      <p className="text-lg mb-8 text-gray-600">
        Theo Phương Pháp Tiến Sĩ Baumann
      </p>
      <button
        onClick={() => setStep(1)}
        className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 mx-auto"
      >
        Bắt Đầu Kiểm Tra
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
          {questions[step - 1].category}
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
            Quay lại
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
            {step === questions.length ? "Xem Kết Quả" : "Tiếp tục"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg p-8 shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-6">
          Kết Quả Phân Tích Da Của Bạn
        </h2>
        <div className="text-4xl font-bold text-purple-600 mb-8">{result}</div>

        <div className="mb-8 text-left">
          <h3 className="font-semibold mb-4">Đặc điểm loại da của bạn:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Da có xu hướng dầu</li>
            <li>Nhạy cảm với các tác nhân bên ngoài</li>
            <li>Ít có vấn đề về sắc tố</li>
            <li>Độ đàn hồi tốt</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700">
            <FaShare /> Chia sẻ
          </button>
          <button className="flex items-center gap-2 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-full hover:bg-purple-50">
            <FaSave /> Lưu kết quả
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-purple-50 py-12">
      {step === 0 && renderWelcome()}
      {step > 0 && step <= questions.length && renderQuestion()}
      {step > questions.length && renderResult()}
    </div>
  );
};

export default SkinQuiz;
