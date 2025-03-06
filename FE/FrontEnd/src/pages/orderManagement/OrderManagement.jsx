import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Button, Modal, message } from "antd";
import { orderService } from "../services/orderService";
import { ORDER_STATUS } from "../constants/orderConstants";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      message.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      message.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      message.error("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return "gold";
      case ORDER_STATUS.PROCESSING:
        return "blue";
      case ORDER_STATUS.SHIPPED:
        return "cyan";
      case ORDER_STATUS.DELIVERED:
        return "green";
      case ORDER_STATUS.CANCELLED:
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setSelectedOrder(record);
              setIsModalVisible(true);
            }}
          >
            View Details
          </Button>
          <Button
            type="primary"
            onClick={() =>
              handleStatusUpdate(record.id, ORDER_STATUS.PROCESSING)
            }
            disabled={record.status === ORDER_STATUS.DELIVERED}
          >
            Update Status
          </Button>
        </Space>
      ),
    },
  ];

  const OrderDetailsModal = () => (
    <Modal
      title="Order Details"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
      width={800}
    >
      {selectedOrder && (
        <div>
          <div className="order-info">
            <p>
              <strong>Order ID:</strong> {selectedOrder.id}
            </p>
            <p>
              <strong>Customer ID:</strong> {selectedOrder.userId}
            </p>
            <p>
              <strong>Shipping Address:</strong> {selectedOrder.shippingAddress}
            </p>
            <p>
              <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
            </p>
          </div>

          <div className="order-items">
            <h3 className="mt-4 mb-2">Order Items</h3>
            <Table
              dataSource={selectedOrder.items}
              columns={[
                {
                  title: "Product",
                  dataIndex: "productName",
                },
                {
                  title: "Quantity",
                  dataIndex: "quantity",
                },
                {
                  title: "Price",
                  dataIndex: "price",
                  render: (price) => `$${price.toFixed(2)}`,
                },
                {
                  title: "Subtotal",
                  dataIndex: "subtotal",
                  render: (subtotal) => `$${subtotal.toFixed(2)}`,
                },
              ]}
              pagination={false}
              rowKey="productId"
            />
          </div>
        </div>
      )}
    </Modal>
  );

  return (
    <div className="order-management">
      <div className="order-management__header">
        <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      </div>

      <div className="order-management__content">
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="id"
        />
      </div>

      <OrderDetailsModal />
    </div>
  );
};

export default OrderManagement;
