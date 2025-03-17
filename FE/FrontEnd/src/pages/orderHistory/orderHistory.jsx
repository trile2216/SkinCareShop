import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import axios from "axios";
import api from "../../config/axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const accessToken = localStorage.getItem("token");
        const customerId = localStorage.getItem("customerId");
        const response = await api.get(`/order/customer/${customerId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch orders");
        }

        const data = response.data;
        console.log("response: ", response);
        console.log("data: ", data);

        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders: ", err);
      }
    };

    fetchOrderHistory();
  }, []);

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US");
  };

  return (
    <>
      <Header />
      <div className="container mx-auto">
        <div className="bg-white p-6 shadow-lg rounded-lg my-10">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-rose-300">
                <thead>
                  <tr className="bg-rose-300 text-white">
                    <th className="border p-2">Order ID</th>
                    <th className="border p-2">Order Date</th>
                    <th className="border p-2">Total Price</th>
                    <th className="border p-2">Shipping Fee</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className="text-center hover:bg-gray-50">
                        <td className="border p-2">{order.id}</td>
                        <td className="border p-2">
                          {formatDate(order.orderDate)}
                        </td>
                        <td className="border p-2">
                          {formatCurrency(order.totalPrice)}
                        </td>
                        <td className="border p-2">
                          {formatCurrency(order.shippingFee)}
                        </td>
                        <td className="border p-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "Confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Shipping"
                                ? "bg-purple-100 text-purple-800"
                                : order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="border p-2">
                          <button
                            onClick={() => toggleOrderDetails(order.id)}
                            className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded text-sm"
                          >
                            {expandedOrder === order.id ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>
                      {expandedOrder === order.id && (
                        <tr>
                          <td colSpan="6" className="border p-4 bg-gray-50">
                            <div className="text-left">
                              <h3 className="font-semibold mb-2">
                                Order Details #{order.id}
                              </h3>
                              <table className="w-full border-collapse border border-gray-300 mb-2">
                                <thead>
                                  <tr className="bg-gray-200">
                                    <th className="border p-2">Product</th>
                                    <th className="border p-2">Quantity</th>
                                    <th className="border p-2">Unit Price</th>
                                    <th className="border p-2">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.orderItems.map((item) => (
                                    <tr key={item.id} className="text-center">
                                      <td className="border p-2">
                                        {item.productName}
                                      </td>
                                      <td className="border p-2">
                                        {item.quantity}
                                      </td>
                                      <td className="border p-2">
                                        {formatCurrency(item.unitPrice)}
                                      </td>
                                      <td className="border p-2">
                                        {formatCurrency(
                                          item.quantity * item.unitPrice
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div className="text-right mt-2">
                                <p>
                                  <span className="font-semibold">
                                    Subtotal:
                                  </span>{" "}
                                  {formatCurrency(order.totalPrice)}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Shipping Fee:
                                  </span>{" "}
                                  {formatCurrency(order.shippingFee)}
                                </p>
                                <p className="text-lg font-bold">
                                  <span>Total:</span>{" "}
                                  {formatCurrency(
                                    order.totalPrice + order.shippingFee
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderHistory;
