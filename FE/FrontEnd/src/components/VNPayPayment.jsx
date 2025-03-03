// Payment.jsx
import React, { useState } from "react";
import axios from "axios";

const VNPayPayment = ({ amount, orderId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const response = await axios.post("http://localhost:5286/api/checkout/processpayment", {
        paymentMethod: 1, // VNPay
        amount: amount,
        orderId: orderId,
        orderInfo: `Thanh toán đơn hàng #${orderId}`
      });

      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        onError("Không thể tạo URL thanh toán");
      }
    } catch (error) {
      onError(error.response?.data?.message || "Lỗi khi xử lý thanh toán");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      {loading ? "Đang xử lý..." : "Thanh toán qua VNPAY"}
    </button>
  );
};

export default VNPayPayment;
