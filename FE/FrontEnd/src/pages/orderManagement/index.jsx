import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Button, Modal, message, Select } from "antd";
import { orderService } from "../../services/orderService";
import "./styles.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const statusOptions = [
    { label: "Pending", value: "0" },
    { label: "Comfirmed", value: "1" },
    { label: "Shipping", value: "2" },
    { label: "Deliveried", value: "3" },
    { label: "Cancelled", value: "4" },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!orderToUpdate || selectedStatus === "") {
      message.error("Please select a status");
      return;
    }

    try {
      const statusNumber = parseInt(selectedStatus);
      await orderService.updateOrderStatus(orderToUpdate.id, statusNumber);

      message.success("Order status updated successfully");
      setIsStatusModalVisible(false);
      setOrderToUpdate(null);
      setSelectedStatus("");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      message.error("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      0: "gold", // Pending
      1: "blue", // Confirmed
      2: "cyan", // Shipping
      3: "green", // Delivered
      4: "red", // Cancelled
    };
    return statusColors[status] || "default";
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
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (amount) => (amount ? `$${amount.toFixed(2)}` : "$0.00"),
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
            type="primary"
            onClick={() => {
              setSelectedOrder(record);
              setIsModalVisible(true);
            }}
          >
            View Details
          </Button>
          <Button
            onClick={() => {
              setOrderToUpdate(record);
              setSelectedStatus(record.status);
              setIsStatusModalVisible(true);
            }}
            disabled={
              record.status === "Delivered" || record.status === "Cancelled"
            }
          >
            Update Status
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="order-management">
      <div className="order-management__header">
        <h1>Order Management</h1>
      </div>

      <div className="order-management__content">
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="id"
        />

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
                  <strong>Order ID: </strong> {selectedOrder.id}
                </p>
                <p>
                  <strong>Customer ID: </strong> {selectedOrder.customerId}
                </p>
                <p>
                  <strong>Shipping Address: </strong>
                  {selectedOrder.deliveryAddress}
                </p>
                <p>
                  <strong>Shipping Fee: </strong>${selectedOrder.shippingFee}
                </p>
                <p>
                  <strong>Payment method: </strong>
                  {selectedOrder.paymentMethod}
                </p>
                <p>
                  <strong>Transaction: </strong>
                  {selectedOrder.transactionId}
                </p>
                <p>
                  <strong>Status: </strong> {selectedOrder.status}
                </p>
              </div>

              <div className="order-items">
                <h3>Order Items</h3>
                <Table
                  dataSource={selectedOrder.orderItems}
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
                      dataIndex: "unitPrice",
                      render: (price) =>
                        price ? `$${price.toFixed(2)}` : "$0.00",
                    },
                    {
                      title: "Subtotal",
                      render: (_, record) => {
                        const subtotal = record.quantity * record.unitPrice;
                        return subtotal ? `$${subtotal.toFixed(2)}` : "$0.00";
                      },
                    },
                  ]}
                  pagination={false}
                  rowKey="productId"
                />
              </div>
            </div>
          )}
        </Modal>
      </div>
      <Modal
        title="Update Order Status"
        open={isStatusModalVisible}
        onCancel={() => {
          setIsStatusModalVisible(false);
          setOrderToUpdate(null);
          setSelectedStatus("");
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsStatusModalVisible(false);
              setOrderToUpdate(null);
              setSelectedStatus("");
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleStatusUpdate}
            disabled={
              !selectedStatus || selectedStatus === orderToUpdate?.status
            }
          >
            Update Status
          </Button>,
        ]}
      >
        <div style={{ padding: "20px 0" }}>
          <p>
            <strong>Order ID:</strong> {orderToUpdate?.id}
          </p>
          <p>
            <strong>Current Status:</strong>{" "}
            <Tag color={getStatusColor(orderToUpdate?.status)}>
              {orderToUpdate?.status}
            </Tag>
          </p>
          <div style={{ marginTop: "20px" }}>
            <p>
              <strong>New Status:</strong>
            </p>
            <Select
              style={{ width: "100%" }}
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
            >
              {statusOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderManagement;
