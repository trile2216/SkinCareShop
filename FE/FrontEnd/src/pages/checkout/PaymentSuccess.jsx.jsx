// PaymentSuccess.jsx
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderId = params.get("orderId");
  const amount = params.get("amount");

  useEffect(() => {
    // Có thể gọi API để cập nhật trạng thái đơn hàng trong database
    // hoặc hiển thị thông tin chi tiết đơn hàng
  }, [orderId]);

  return (
    <div className="payment-result success">
      <h2>Thanh toán thành công!</h2>
      <div className="payment-details">
        <p>
          <strong>Mã đơn hàng:</strong> {orderId}
        </p>
        <p>
          <strong>Số tiền:</strong>{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(amount)}
        </p>
        <p>
          Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời
          gian sớm nhất.
        </p>
      </div>
      <Link to="/" className="back-button">
        Trở về trang chủ
      </Link>
    </div>
  );
};

export default PaymentSuccess;
