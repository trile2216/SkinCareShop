import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../../components/Footer";
import axios from "../../config/axios";
import { useCart } from "../../context/CartContext";

const CheckoutResult = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState(null);
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    processPaymentCallback();
  }, []);

  const processPaymentCallback = async () => {
    setLoading(true);

    // Các tham số từ VNPay
    const vnpResponseCode = searchParams.get("vnp_ResponseCode");
    const vnpOrderInfo = searchParams.get("vnp_OrderInfo");
    const vnpTransactionId = searchParams.get("vnp_TransactionNo");

    // Trích xuất OrderId từ OrderInfo
    let orderId = null;

    if (vnpOrderInfo) {
      try {
        const orderInfoParts = vnpOrderInfo.split("#");
        orderId = parseInt(orderInfoParts[orderInfoParts.length - 1]);
      } catch (error) {
        console.error("Error when parsing order information:", error);
      }
    }

    if (!orderId) {
      setErrorMessage("Unable to identify order from payment information.");
      setLoading(false);
      return;
    }

    // Gửi thông tin cập nhật đến backend
    try {
      const updateData = {
        orderId: orderId,
        responseCode: vnpResponseCode,
        transactionId: vnpTransactionId,
        paymentMethod: "VNPay",
      };

      await axios.post("/checkout/update-payment", updateData);

      if (vnpResponseCode === "00") {
        toast.success("Payment successful! Your order has been placed.");
        clearCart();
      } else {
        // Xử lý các mã lỗi
        let errorMessage = getErrorMessage(vnpResponseCode);
        setErrorMessage(errorMessage);
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      setErrorMessage(
        "An error occurred while processing payment. Please contact support."
      );
      toast.error("Payment processing error");
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (responseCode) => {
    switch (responseCode) {
      case "11":
        return "The transaction was unsuccessful because the payment waiting period has expired. Please try again.";
      case "12":
        return "Transaction failed because customer card/account is locked.";
      case "51":
        return "Transaction failed because account balance is not enough to make transaction.";
      case "14":
        return "The request is invalid, usually due to missing required fields.";
      case "24":
        return "Transaction failed because customer canceled transaction.";
      default:
        return "Transaction failed due to unknown error.";
    }
  };

  const handleBackToHome = () => {
    clearCart();
    navigate("/");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="spinner-border text-rose-500" role="status">
            <span className="visually-hidden">Processing payment...</span>
          </div>
          <p className="mt-3 text-lg">Processing payment...</p>
        </div>
      </div>
    );

  return (
    <>
      <div className="container mx-auto p-6">
        {/* Checkout Progress Bar */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-rose-500 text-white flex items-center justify-center rounded-full font-bold">
              1
            </div>
            <span className="ml-2 text-rose-700 font-semibold">Your Cart</span>
          </div>
          <div className="flex-1 h-px bg-rose-500 mx-4"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-rose-500 text-white flex items-center justify-center rounded-full font-bold">
              2
            </div>
            <span className="ml-2 text-rose-700 font-semibold">
              Checkout Details
            </span>
          </div>
          <div className="flex-1 h-px bg-rose-500 mx-4"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-rose-500 text-white flex items-center justify-center rounded-full font-bold">
              3
            </div>
            <span className="ml-2 text-rose-700 font-semibold">
              Order Complete
            </span>
          </div>
        </div>

        {/* Thông báo kết quả */}
        <div className="text-center">
          {!errorMessage ? (
            <div className="bg-green-100 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-green-700 mb-6">
                🎉 Order successful! 🎉
              </h2>
              <p className="text-gray-700 mb-4">
                Your order has been successfully placed and is being processed.
              </p>
              <p className="text-gray-700 mb-4">
                We will notify you when your order is shipped.
              </p>
            </div>
          ) : (
            <div className="bg-red-100 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-red-700 mb-6">
                Payment failed
              </h2>
              <p className="text-gray-700 mb-4">{errorMessage}</p>
              <p className="text-gray-700 mb-4">
                Sorry for the inconvenience, please try again or contact
                customer support.
              </p>
            </div>
          )}
        </div>

        {/* Nút quay về trang chủ */}
        <div className="text-center mt-8">
          <button
            onClick={handleBackToHome}
            className="bg-rose-500 text-white py-2 px-6 rounded-lg hover:bg-rose-600"
          >
            Back to Home
          </button>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={5000} />
      <Footer />
    </>
  );
};

export default CheckoutResult;
