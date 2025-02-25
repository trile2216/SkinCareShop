import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import Footer from "../../components/Footer";
import { FiArrowLeft } from "react-icons/fi";
import cityStateMapping from "../checkout/CityStateMapping";


const CheckOutDetail = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    paymentMethod: ""
  });

  const [error, setError] = useState("");
  const { cartItems, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [isPlaceOrder, setIsPlaceOrder] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Xóa state nếu người dùng thay đổi city
    if (name === "city") {
      setFormData({ ...formData, city: value, state: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Kiểm tra bắt buộc
    if (!formData.firstName || !formData.lastName) {
      setError("First name and last name are required.");
      return;
    }
  
    if (!formData.paymentMethod) {
      setError("Please select a payment method.");
      return;
    }
  
    if (window.confirm("Are you sure? Your order cannot be changed once placed.")) {
      console.log("Payment submitted", formData);
  
      if (formData.paymentMethod === "cod") {
        setIsPlaceOrder(true); // Đánh dấu đặt hàng thành côngg
      } else if (formData.paymentMethod === "vnpay") {
        //navigate("/vnpay");
        setIsPlaceOrder(true);
      }
    }
  };
  

  // Shipping fee
  const shippingFee = 40000;

  const handlePaymentChange = (e) => {
    setFormData({ ...formData, paymentMethod: e.target.value });
    console.log("Selected Payment Method:", e.target.value);
  };
  

  const cities = Object.keys(cityStateMapping);

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
            <span className="ml-2 text-rose-700 font-semibold">Your Cart</span>
          </div>
          <div className="flex-1 h-px bg-rose-500 mx-4"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-rose-500 text-white flex items-center justify-center rounded-full font-bold">
              2
            </div>
            <span className="ml-2 text-rose-700 font-semibold">Checkout Details</span>
          </div>
          <div className="flex-1 h-px bg-gray-300 mx-4"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-500 flex items-center justify-center rounded-full font-bold">
              3
            </div>
            <span className="ml-2 text-gray-500 font-semibold">Order Complete</span>
          </div>
        </div>

        {/* "Keep Shopping" */}
        <Link to="/checkout" className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <FiArrowLeft className="mr-2" size={20} /> Your Cart
        </Link>

        <h2 className="text-2xl font-bold mb-6">Checkout Details</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
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
                <label className="block text-sm font-medium mb-1">Last Name</label>
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

            <div>
              <label className="block text-sm font-medium mb-1">Street Address</label>
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

            <div>
              <label className="block text-sm font-medium mb-1">Apartment, Suite, etc. (Optional)</label>
              <input
                type="text"
                name="apartment"
                placeholder="Apartment, suite, etc. (optional)"
                value={formData.apartment}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
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

              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="border p-2 rounded w-full"
                disabled={!formData.city} // Vô hiệu hóa nếu city chưa được chọn
              >
                <option value="">Select State</option>
                {formData.city &&
                  cityStateMapping[formData.city].map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
              </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
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
              <label className="block text-sm font-medium mb-1">Email Address (Optional)</label>
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

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Payment Options</h3>

            <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === "cod"}
                onChange={handlePaymentChange}
                className="mr-2"
              />
              Pay on delivery
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="vnpay"
                checked={formData.paymentMethod === "vnpay"}
                onChange={handlePaymentChange}
                className="mr-2"
              />
              Pay via VN-Pay
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s"
                alt="VN-Pay"
                className="ml-2 w-16 h-auto"
              />
            </label>
            </div>

            {/* Shipping fee */}
            {formData.city !== "" && formData.state !== "" && 
             <h3 
              className= "text-rose-700 text-right text-lg font-semibold">Shipping fee: {shippingFee.toLocaleString("vi-VN")}</h3>}

            {/* Total */}
            {formData.city !== "" && formData.state !== "" &&
              <h3
                className ="text-rose-700 text-right text-lg font-semibold"
                >Total: {(getTotalPrice() +  shippingFee).toLocaleString("vi-VN")} VND</h3>}

            {/* Place Order*/}
            <button
              type="submit"
              className="bg-rose-500 text-white py-1 px-4 rounded-lg hover:bg-rose-600 float-right"
            >
              Place Order
            </button>
          </div>
        </form>

        {/* Cart Detail*/}
        <h2 className="text-xl font-bold mt-10 mb-4">Your Cart</h2>

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
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                </td>
                <td className="py-2 px-4 font-semibold">{item.name}</td>
                <td className="py-2 px-4 text-center">{item.quantity}</td>
                <td className="py-2 px-4 text-right font-semibold">
                  {(item.price * item.quantity).toLocaleString("vi-VN")} VND
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Sub cart total*/}
        <div className="mt-4 text-right text-lg font-bold">
          Subtotal: {getTotalPrice().toLocaleString("vi-VN")} VND
        </div>
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
            <span className="ml-2 text-rose-700 font-semibold">Your Cart</span>
          </div>
          <div className="flex-1 h-px bg-rose-500 mx-4"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-rose-500 text-white flex items-center justify-center rounded-full font-bold">
              2
            </div>
            <span className="ml-2 text-rose-700 font-semibold">Checkout Details</span>
          </div>
          <div className="flex-1 h-px bg-rose-500 mx-4"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-rose-500 text-white flex items-center justify-center rounded-full font-bold">
              3
            </div>
            <span className="ml-2 text-rose-700 font-semibold">Order Complete</span>
          </div>
        </div>  

        {/* Order Success Message */}
        <h2 className="text-2xl font-bold text-center text-rose-700 mb-6">
          🎉 Order Placed Successfully! 🎉
        </h2>
        <p className="text-center text-gray-600">Your order has been placed successfully and is being processed.</p>

        {/* Order Details */}
        <div className="bg-gray-100 p-6 mt-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Order Details</h3>

          {/* Customer Information */}
          <div className="mb-4">
            <h4 className="text-lg font-medium">Recipient Information</h4>
            <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
            <p><strong>Address:</strong> {formData.street}, {formData.apartment ? `${formData.apartment},` : ""} {formData.city}, {formData.state}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
            {formData.email && <p><strong>Email:</strong> {formData.email}</p>}
          </div>

          {/* Payment Method */}
          <div className="mb-4">
            <h4 className="text-lg font-medium">Payment Method</h4>
            <p>{formData.paymentMethod === "cod" ? "Cash on Delivery" : "VN-Pay"}</p>
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
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  </td>
                  <td className="py-2 px-4 font-semibold">{item.name}</td>
                  <td className="py-2 px-4 text-center">{item.quantity}</td>
                  <td className="py-2 px-4 text-right font-semibold">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} VND
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Order Total */}
          <div className="mt-4 text-right text-lg font-bold">
            <p>Subtotal: {getTotalPrice().toLocaleString("vi-VN")}</p>
            <p>Shipping Fee: {shippingFee.toLocaleString("vi-VN")}</p>
            <p className="text-rose-700 text-xl">Total: {(getTotalPrice() + shippingFee).toLocaleString("vi-VN")} VND</p>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-6">
          <Link to="/homepage" className="bg-rose-500 text-white py-2 px-6 rounded-lg hover:bg-rose-600">
            Back to Home
          </Link>
        </div>
      </div>
    )}

        
      {/* Footer */}
      <Footer />
    </>
  );
};

export default CheckOutDetail;
