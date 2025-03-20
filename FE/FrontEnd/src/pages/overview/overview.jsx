import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Spin, message } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  TagOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Area } from "@ant-design/plots";
import overviewService from "../../services/api.overview";

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    summary: null,
    topProducts: [],
    recentOrders: [],
    orderStatus: [],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await overviewService.getAllDashboardData();
      setDashboardData(data);
    } catch (error) {
      message.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const topProductColumns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={record.image}
            alt={text}
            className="w-10 h-10 object-cover rounded mr-2"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Total Sold",
      dataIndex: "totalSold",
      key: "totalSold",
    },
  ];

  const recentOrderColumns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Delivered"
              ? "green"
              : status === "Processing"
              ? "blue"
              : status === "Pending"
              ? "orange"
              : status === "Cancelled"
              ? "red"
              : "default"
          }
        >
          {status}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const { summary, topProducts, recentOrders, orderStatus } = dashboardData;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <button
          onClick={fetchDashboardData}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Refresh Data
        </button>
      </div>

      {/* Summary Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Total Orders"
              value={summary?.totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Total Customers"
              value={summary?.totalCustomers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Total Products"
              value={summary?.totalProducts}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Total Categories"
              value={summary?.totalCategories}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Total Brands"
              value={summary?.totalBrands}
              prefix={<TagOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={summary?.totalRevenue}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      {/* Order Status Chart */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="Order Status Distribution">
            <div style={{ height: "300px" }}>
              {orderStatus.length > 0 && (
                <Area
                  data={orderStatus}
                  xField="status"
                  yField="count"
                  seriesField="status"
                  color={["#6366f1"]}
                  areaStyle={{
                    fill: "l(270) 0:#ffffff 0.5:#6366f1 1:#6366f1",
                  }}
                />
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Top Products">
            <Table
              columns={topProductColumns}
              dataSource={topProducts}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Card title="Recent Orders" className="mb-6">
        <Table
          columns={recentOrderColumns}
          dataSource={recentOrders}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Overview;
