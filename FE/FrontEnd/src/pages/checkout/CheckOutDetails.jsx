import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import Footer from "../../components/Footer";
import { FiArrowLeft } from "react-icons/fi";
import cityStateMapping from "../checkout/CityStateMapping";
import { ToastContainer, toast } from "react-toastify";
import axios from "../../config/axios";

const CheckOutDetails = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    paymentMethod: "",
  });

  const [showAllItems, setShowAllItems] = useState(false);
  const [error, setError] = useState("");
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isPlaceOrder, setIsPlaceOrder] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "city") {
      setFormData({ ...formData, city: value, state: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.firstName) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("First Name is required.");
      return;
    }
    if (!formData.lastName) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("Last Name is required.");
      return;
    }
    if (!formData.phone) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("Phone number is required.");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("Phone number must be correct.");
      return;
    }
    if (!formData.street) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("Street Address is required.");
      return;
    }
    if (!formData.city) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("City is required.");
      return;
    }
    if (!formData.state) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("State is required.");
      return;
    }
    if (!formData.paymentMethod) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("Please select a payment method.");
      return;
    }

    if (
      window.confirm("Are you sure? Your order cannot be changed once placed.")
    ) {
      console.log("Payment submitted", formData);

      if (formData.paymentMethod === "COD") {
        toast.success("Order placed successfully!");
        setIsPlaceOrder(true);
      } else if (formData.paymentMethod === "VNPay") {
        navigate("/payment");
        setIsPlaceOrder(true);
      }
    }
  };

  const handlePaymentChange = (e) => {
    setFormData({ ...formData, paymentMethod: e.target.value });
    console.log("Selected Payment Method:", e.target.value);
  };

  const cities = Object.keys(cityStateMapping).sort();

  const getShippingFee = (city) => {
    return cityStateMapping[city]?.shippingFee || 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    // Check form validation
    if (!formData.firstName) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("First Name is required.");
      return;
    }
    if (!formData.lastName) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("Last Name is required.");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("Phone number must be correct.");
      return;
    }
    if (!formData.street) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("Street Address is required.");
      return;
    }
    if (!formData.city) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("City is required.");
      return;
    }
    if (!formData.state) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("State is required.");
      return;
    }
    if (!formData.paymentMethod) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("Please select a payment method.");
      return;
    }
    if (
      window.confirm("Are you sure? Your order cannot be changed once placed.")
    ) {
      try {
        const orderData = {
          customerId: parseInt(localStorage.getItem("customerId")),
          cartItems: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            productPrice: item.price,
          })),
          totalPrice: getTotalPrice(),
          shippingFee: getShippingFee(formData.city),
          paymentMethod: formData.paymentMethod,
          street: formData.street,
          city: formData.city,
          state: formData.state,
        };

        const response = await axios.post(
          "/checkout/processpayment",
          orderData
        );

        if (formData.paymentMethod === "VNPay") {
          if (response.data.paymentUrl) {
            window.location.href = response.data.paymentUrl;
          }
        } else if (formData.paymentMethod === "COD") {
          toast.success("Order placed successfully!");
          setIsPlaceOrder(true);
        }
      } catch (error) {
        toast.error("Failed to place order. Please try again.");
        console.error("Order submission error:", error);
      }
    }
  };

  //Back to home -> Clear cart 
  const handleBackToHome = () => {
    clearCart(); 
    navigate("/"); 
  };

  return (
    <>
      {!isPlaceOrder && (
        <div className="container mx-auto p-6">
          {/* Checkout Progress Bar */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-rose-500 text-white flex items-center justify-center rounded-full font-bold">
                1
              </div>
              <span className="ml-2 text-rose-700 font-semibold">
                Your Cart
              </span>
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
            <div className="flex-1 h-px bg-gray-300 mx-4"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 flex items-center justify-center rounded-full font-bold">
                3
              </div>
              <span className="ml-2 text-gray-500 font-semibold">
                Order Complete
              </span>
            </div>
          </div>

          {/* "Keep Shopping" */}
          <Link
            to="/checkout"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" size={20} /> Your Cart
          </Link>

          <h2 className="text-2xl font-bold mb-6">Checkout Details</h2>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Order Form*/}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* First Name*/}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>

              {/* Phone/ Mail */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address (optional)"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>

              {/* Street Address*/}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  placeholder="Street address"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* City*/}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* States */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="border p-2 rounded w-full"
                    disabled={!formData.city}
                  >
                    <option value="">Select State</option>
                    {formData.city &&
                      cityStateMapping[formData.city]?.states
                        ?.sort()
                        .map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                  </select>
                </div>
              </div>

              {/* Payment Options */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Payment Method <span className="text-red-500">*</span> </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === "COD"}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "paymentMethod",
                            value: e.target.value,
                          },
                        })
                      }
                    />
                    <span className="ml-2">COD (Cash on Delivery)</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VNPay"
                      checked={formData.paymentMethod === "VNPay"}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "paymentMethod",
                            value: e.target.value,
                          },
                        })
                      }
                    />
                    <span className="ml-2">VNPay</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Cart Detail */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold mt-5 mb-4">Your Cart</h2>
                {cartItems.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setShowAllItems(!showAllItems)}
                    className="text-rose-500 hover:text-rose-700 font-medium transition"
                  >
                    {showAllItems ? "Show Less ▲" : "Show More ▼"}
                  </button>
                )}
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ${
                  showAllItems ? "max-h" : "max-h-[450px]"
                }`}
              >
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-2 px-4 text-left">Image</th>
                      <th className="py-2 px-4 text-left">Product Name</th>
                      <th className="py-2 px-4 text-center">Quantity</th>
                      <th className="py-2 px-4 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 px-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        </td>
                        <td className="py-2 px-4 font-semibold">{item.name}</td>
                        <td className="py-2 px-4 text-center">
                          {item.quantity}
                        </td>
                        <td className="py-2 px-4 text-right font-semibold">
                          {(item.price * item.quantity).toLocaleString("en-US")}{" "}
                          $
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </form>

          {/* Sub cart total*/}
          <div className="mt-4 text-right text-lg font-bold">
            Subtotal: {getTotalPrice().toLocaleString("en-US")}$
          </div>

          {/* Shipping fee */}
          {formData.city !== "" && formData.state !== "" && (
            <h3 className="text-rose-700 text-right text-lg font-semibold">
              Shipping fee:{" "}
              {getShippingFee(formData.city).toLocaleString("en-US")} $
            </h3>
          )}

          {/* Total */}
          {formData.city !== "" && formData.state !== "" && (
            <h3 className="text-rose-700 text-right text-lg font-semibold">
              Total:{" "}
              {(getTotalPrice() + getShippingFee(formData.city)).toLocaleString(
                "en-US"
              )}{" "}
              $
            </h3>
          )}

          {/* Place Order*/}
          <button
            type="button"
            onClick={handleSubmitOrder}
            className="bg-rose-500 text-white py-1 px-4 rounded-lg hover:bg-rose-600 float-right"
          >
            Place Order
          </button>

          {/* {formData.paymentMethod === "VNPay" && (
            <VNPayPayment
              amount={getTotalPrice() + getShippingFee(formData.city)}
              orderId={Date.now()}
              onSuccess={(response) => {
                console.log("Payment success:", response);
              }}
              onError={(error) => {
                console.error("Payment error:", error);
                toast.error(error);
              }}
            />
          )} */}

          <ToastContainer position="top-center" autoClose={3000} />
        </div>
      )}

      {/* Order COD Complete */}
      {isPlaceOrder && (
        <div className="container mx-auto p-6">
          {/* Checkout Progress Bar */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-rose-500 text-white flex items-center justify-center rounded-full font-bold">
                1
              </div>
              <span className="ml-2 text-rose-700 font-semibold">
                Your Cart
              </span>
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

          {/* Order Success Message */}
          <h2 className="text-2xl font-bold text-center text-rose-700 mb-6">
            🎉 Order Placed Successfully! 🎉
          </h2>
          <p className="text-center text-gray-600">
            Your order has been placed successfully and is being processed.
          </p>

          {/* Order Details */}
          <div className="bg-gray-100 p-6 mt-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Order Details</h3>

            {/* Customer Information */}
            <div className="mb-4">
              <h4 className="text-lg font-medium">Recipient Information</h4>
              <p>
                <strong>Name:</strong> {formData.firstName} {formData.lastName}
              </p>
              <p>
                <strong>Address:</strong> {formData.street}, {formData.state},{" "}
                {formData.city}
              </p>
              <p>
                <strong>Phone:</strong> {formData.phone}
              </p>
              {formData.email && (
                <p>
                  <strong>Email:</strong> {formData.email}
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <h4 className="text-lg font-medium">Payment Method</h4>
              <p>
                {formData.paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : "VN-Pay"}
              </p>
            </div>

            {/* Order Status */}
            <div className="mb-4">
              <h4 className="text-lg font-medium">Order Status</h4>
              <p className="text-green-600 font-semibold">Processing</p>
            </div>

            {/* Cart Items */}
            <h4 className="text-lg font-medium mt-6 mb-2">Ordered Items</h4>
            <table className="w-full border-collapse bg-white rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-2 px-4 text-left">Image</th>
                  <th className="py-2 px-4 text-left">Product Name</th>
                  <th className="py-2 px-4 text-center">Quantity</th>
                  <th className="py-2 px-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2 px-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </td>
                    <td className="py-2 px-4 font-semibold">{item.name}</td>
                    <td className="py-2 px-4 text-center">{item.quantity}</td>
                    <td className="py-2 px-4 text-right font-semibold">
                      {(item.price * item.quantity).toLocaleString("en-US")} $
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Order Total */}
            <div className="mt-4 text-right text-lg font-bold">
              <p>Subtotal: {getTotalPrice().toLocaleString("vi-VN")} $</p>
              <p>
                Shipping Fee:{" "}
                {getShippingFee(formData.city).toLocaleString("en-US")} $
              </p>
              <p className="text-rose-700 text-xl">
                Total:{" "}
                {(
                  getTotalPrice() + getShippingFee(formData.city)
                ).toLocaleString("en-US")}{" "}
                $
              </p>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="text-center mt-6">
            <button
              onClick={handleBackToHome}
              className="bg-rose-500 text-white py-2 px-6 rounded-lg hover:bg-rose-600"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </>
  );
};
export default CheckOutDetails;
