import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { FiArrowLeft } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import axios from "../../config/axios";
import shippingFeeService from "../../services/api.shippingFee";

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

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [shippingFee, setShippingFee] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const citiesData = await shippingFeeService.getAllCities();
        setCities(citiesData);
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("Could not load cities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (formData.city) {
      const fetchDistricts = async () => {
        try {
          setLoading(true);
          const districtsData = await shippingFeeService.getDistrictsByCity(
            formData.city
          );
          setDistricts(districtsData);
          setFormData((prev) => ({ ...prev, state: "" }));
        } catch (error) {
          console.error("Error fetching districts:", error);
          toast.error("Could not load districts for the selected city.");
        } finally {
          setLoading(false);
        }
      };

      fetchDistricts();
    } else {
      setDistricts([]);
    }
  }, [formData.city]);

  useEffect(() => {
    if (formData.city && formData.state) {
      const fetchShippingFee = async () => {
        try {
          setLoading(true);
          const feeData = await shippingFeeService.getShippingFee(
            formData.city,
            formData.state
          );
          setShippingFee(feeData.fee || 0);
        } catch (error) {
          console.error("Error fetching shipping fee:", error);
          toast.error("Could not load shipping fee for the selected location.");
          setShippingFee(0);
        } finally {
          setLoading(false);
        }
      };

      fetchShippingFee();
    } else {
      setShippingFee(0);
    }
  }, [formData.city, formData.state]);

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

  const customerId = parseInt(localStorage.getItem("customerId"));
  console.log("Customer ID:", customerId);

  const getShippingFee = () => {
    return shippingFee;
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
            productId: item.productId,
            quantity: item.quantity,
            productPrice: item.productPrice,
          })),
          totalPrice: getTotalPrice(),
          shippingFee: getShippingFee(),
          paymentMethod: formData.paymentMethod,
          street: formData.street,
          city: formData.city,
          state: formData.state,
        };

        const response = await axios.post(
          "/checkout/process-payment",
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
                    disabled={loading}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

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
                    disabled={!formData.city || loading}
                  >
                    <option value="">Select State</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">
                  Payment Method <span className="text-red-500">*</span>{" "}
                </h3>
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
                className={`overflow-hidden transition-all duration-500 ${showAllItems ? "max-h" : "max-h-[450px]"
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
                      <tr key={item.productId} className="border-b">
                        <td className="py-2 px-4">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        </td>
                        <td className="py-2 px-4 font-semibold">{item.productName}</td>
                        <td className="py-2 px-4 text-center">
                          {item.quantity}
                        </td>
                        <td className="py-2 px-4 text-right font-semibold">
                          {(item.productPrice * item.quantity).toLocaleString("en-US")}{" "}
                          $
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </form>

          <div className="mt-6 text-right">
            <div className="text-gray-700 text-lg">
              <span className="font-medium">Subtotal: </span>
              <span className="font-bold">
                {getTotalPrice().toLocaleString("en-US")}$
              </span>
            </div>

            {formData.city !== "" && formData.state !== "" && (
              <div className="text-gray-700 text-lg">
                <span className="font-medium">Shipping Fee: </span>
                {loading ? (
                  <span>Calculating...</span>
                ) : (
                  <span className="font-bold">
                    {getShippingFee().toLocaleString("en-US")}$
                  </span>
                )}
              </div>
            )}

            {formData.city !== "" && formData.state !== "" && !loading && (
              <div className="mt-2 text-rose-700 text-xl">
                <span className="font-semibold">Total: </span>
                <span className="font-extrabold">
                  {(getTotalPrice() + getShippingFee()).toLocaleString("en-US")}
                  $
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 text-right">
            <button
              type="button"
              onClick={handleSubmitOrder}
              className="bg-gradient-to-r from-rose-500 to-rose-700 text-white text-lg py-2 px-6 rounded-lg shadow-md hover:shadow-lg hover:from-rose-600 hover:to-rose-800 transition-all duration-300"
            >
              Place Order
            </button>
          </div>

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
                  <tr key={item.productId} className="border-b">
                    <td className="py-2 px-4">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </td>
                    <td className="py-2 px-4 font-semibold">{item.productName}</td>
                    <td className="py-2 px-4 text-center">{item.quantity}</td>
                    <td className="py-2 px-4 text-right font-semibold">
                      {(item.productPrice * item.quantity).toLocaleString("en-US")} $
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
    </>
  );
};

export default CheckOutDetails;
