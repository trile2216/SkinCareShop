import React from "react";
import {
  ORDER_STATUS,
  STATUS_LABELS,
  STATUS_COLORS,
} from "../utils/orderStatus";

const OrderStatusModal = ({ isOpen, onClose, order, onUpdateStatus }) => {
  const [status, setStatus] = React.useState(
    order?.status || ORDER_STATUS.PENDING
  );
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdateStatus(order.id, status);
      onClose();
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Chi tiết đơn hàng #{order.id}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Thông tin khách hàng */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Customer information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Customer name:</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone number:</p>
              <p className="font-medium">{order.phone}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600">Address:</p>
              <p className="font-medium">{order.address}</p>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Product list</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Unit price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.orderItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="ml-3">
                          <p className="font-medium">{item.product.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {item.price.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="px-4 py-3 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-right font-medium">
                    Total:
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-lg">
                    {order.totalAmount.toLocaleString("vi-VN")}$
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Form cập nhật trạng thái */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Update Status</h3>
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <select
                  className="w-full p-2 border rounded"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {loading ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderStatusModal;
