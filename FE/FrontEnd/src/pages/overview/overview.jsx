import React, { useState, useEffect } from "react";
import { Area } from "@ant-design/plots";
import { Spin } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  TagOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import overviewService from "../../services/api.overview";
import { toast } from "react-toastify";

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
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const { summary, topProducts, recentOrders, orderStatus } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">Welcome to your dashboard overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {/* Total Orders Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCartOutlined className="text-blue-600 text-xl" />
            </div>
            <span className="text-green-500 flex items-center">
              <ArrowUpOutlined /> 12%
            </span>
          </div>
          <h3 className="text-2xl font-bold mt-4">{summary?.totalOrders}</h3>
          <p className="text-gray-600 text-sm">Total Orders</p>
        </div>

        {/* Total Customers Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-100 rounded-full">
              <UserOutlined className="text-purple-600 text-xl" />
            </div>
            <span className="text-green-500 flex items-center">
              <ArrowUpOutlined /> 8%
            </span>
          </div>
          <h3 className="text-2xl font-bold mt-4">{summary?.totalCustomers}</h3>
          <p className="text-gray-600 text-sm">Total Customers</p>
        </div>

        {/* Total Products Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-100 rounded-full">
              <ShoppingOutlined className="text-green-600 text-xl" />
            </div>
            <span className="text-red-500 flex items-center">
              <ArrowDownOutlined /> 3%
            </span>
          </div>
          <h3 className="text-2xl font-bold mt-4">{summary?.totalProducts}</h3>
          <p className="text-gray-600 text-sm">Total Products</p>
        </div>

        {/* Additional Summary Cards... */}
        <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-yellow-100 rounded-full">
              <AppstoreOutlined className="text-yellow-600 text-xl" />
            </div>
            <span className="text-green-500 flex items-center">
              <ArrowUpOutlined /> 5%
            </span>
          </div>
          <h3 className="text-2xl font-bold mt-4">
            {summary?.totalCategories}
          </h3>
          <p className="text-gray-600 text-sm">Categories</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-pink-100 rounded-full">
              <TagOutlined className="text-pink-600 text-xl" />
            </div>
            <span className="text-green-500 flex items-center">
              <ArrowUpOutlined /> 7%
            </span>
          </div>
          <h3 className="text-2xl font-bold mt-4">{summary?.totalBrands}</h3>
          <p className="text-gray-600 text-sm">Brands</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-indigo-100 rounded-full">
              <DollarOutlined className="text-indigo-600 text-xl" />
            </div>
            <span className="text-green-500 flex items-center">
              <ArrowUpOutlined /> 15%
            </span>
          </div>
          <h3 className="text-2xl font-bold mt-4">
            ${summary?.totalRevenue.toFixed(2)}
          </h3>
          <p className="text-gray-600 text-sm">Total Revenue</p>
        </div>
      </div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Order Status</h2>
          <div className="h-[300px]">
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
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{product.totalSold} sold</p>
                  <p className="text-sm text-gray-500">Rank #{index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
