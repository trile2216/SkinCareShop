import React from "react";
import { useLocation, Link } from "react-router-dom";

const PaymentFailure = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderId = params.get("orderId");
  const message = params.get("message") || "Thanh toán không thành công";

  return (
    <div className="payment-result failure">
      <h2>Thanh toán thất bại</h2>
      <div className="payment-details">
        {orderId && (
          <p>
            <strong>Mã đơn hàng:</strong> {orderId}
          </p>
        )}
        <p>
          <strong>Thông báo:</strong> {message}
        </p>
        <p>Vui lòng thử lại hoặc liên hệ với chúng tôi nếu bạn cần trợ giúp.</p>
      </div>
      <div className="action-buttons">
        <Link to="/payment" className="retry-button">
          Thử lại
        </Link>
        <Link to="/" className="back-button">
          Trở về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailure;
