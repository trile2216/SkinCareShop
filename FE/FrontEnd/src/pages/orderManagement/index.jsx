import { useEffect, useState } from "react";
import { orderService } from "../../services/orderService";
import "./styles.css";
import { Tabs, Table, Tag, Space, Button, Modal, message, Select, Input } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";

const OrderManagement = () => {
  // Lưu dữ liệu search Customer ID
  const [searchCustomerId, setSearchCustomerId] = useState("");
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

  // State quản lý Tab theo Status
  const [activeTab, setActiveTab] = useState("all");
  // Lọc danh sách order 
  const filteredOrders = orders.filter((order) => {
    if (activeTab !== "all" && order.status !== activeTab) return false;
    return searchCustomerId ? order.customerId.toString().startsWith(searchCustomerId) : true;
  });

  // Sort
  const [sortConfig, setSortConfig] = useState({ key: null, order: "asc" });
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortConfig.key) return 0;
  
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];
  
    if (sortConfig.key === "totalPrice") {
      valA = parseFloat(valA);
      valB = parseFloat(valB);
    } else if (sortConfig.key === "orderDate") {
      valA = new Date(valA);
      valB = new Date(valB);
    }
  
    return sortConfig.order === "asc" ? valA - valB : valB - valA;
  });

  // Tính số lượng đơn hàng theo từng trạng thái
  const orderCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  // Hiển thị số Order kế bên tab
  const getTabTitle = (label, key) => (
    <span>
      {label} <Tag color="#f9c6d1">{key === "all" ? orders.length : orderCounts[key] || 0}</Tag> 
    </span>
  );

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
          <Button
            type="ghost"
            shape="circle"
            icon={<EyeOutlined style={{ fontSize: "18px", color: "#eb2f96" }} />} 
            onClick={() => {
              setSelectedOrder(record);
              setIsModalVisible(true);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="order-management">
      <div className="order-management__header">
        <h1>Order Management</h1>
      </div>
      {/* Tabs lọc đơn hàng */}
      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)} style={{ marginBottom: 16 }}>
        <Tabs.TabPane tab={getTabTitle("All", "all")} key="all" />
        <Tabs.TabPane tab={getTabTitle("Pending", "Pending")} key="Pending" />
        <Tabs.TabPane tab={getTabTitle("Comfirmed", "Comfirmed")} key="Comfirmed" />
        <Tabs.TabPane tab={getTabTitle("Shipping", "Shipping")} key="Shipping" />
        <Tabs.TabPane tab={getTabTitle("Delivered", "Delivered")} key="Delivered" />
        <Tabs.TabPane tab={getTabTitle("Cancelled", "Cancelled")} key="Cancelled" />
      </Tabs>
      {/* --- */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: 16 }}>
      <Input
        className="custom-search"
        placeholder="Search by Customer ID"
        value={searchCustomerId}
        onChange={(e) => setSearchCustomerId(e.target.value)}
        style={{ width: 200 }}
        suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
      />

      <Button className="custom-button" onClick={() => handleSort("id")}>
        Order ID {sortConfig.key === "id" && (sortConfig.order === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />)}
      </Button>

      <Button className="custom-button" onClick={() => handleSort("totalPrice")}>
        Total Amount {sortConfig.key === "totalPrice" && (sortConfig.order === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />)}
      </Button>

      <Button className="custom-button" onClick={() => handleSort("orderDate")}>
        Order Date {sortConfig.key === "orderDate" && (sortConfig.order === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />)}
      </Button>
    </div>
       
      <div className="order-management__content">
        {/* <Table
          columns={columns}
          // dataSource={orders}
          dataSource={filteredOrders}
          loading={loading}
          rowKey="id"
        /> */}
        {/* Table hiển thị đơn hàng */}
        <Table columns={columns} dataSource={sortedOrders} loading={loading} rowKey="id" />

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
                  sortedOrders={selectedOrder.orderItems}
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
