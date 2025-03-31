import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import shippingFeeService from "../../services/api.shippingFee";
import {
  Table,
  Input,
  Button,
  Space,
  Select,
  Form,
  InputNumber,
  Modal,
  Tag,
  Typography,
  Spin,
  message,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const ShippingFeeManagement = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [cities, setCities] = useState([]);
  const [shippingFees, setShippingFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFee, setCurrentFee] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fetch all shipping fees and cities on component mount
  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Gọi API lấy cities
      const citiesResponse = await shippingFeeService.getAllCities();
      console.log("Cities response:", citiesResponse);

      // Vì response trả về trực tiếp là array nên không cần .data
      if (Array.isArray(citiesResponse)) {
        setCities(citiesResponse);
      } else {
        console.error("Invalid cities data:", citiesResponse);
        message.error("Failed to load cities data");
      }

      // Lấy shipping fees
      const feesResponse = await shippingFeeService.getAllShippingFees();
      setShippingFees(feesResponse);
      setFilteredFees(feesResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load data. Please try again later.");

      if (error.response?.status === 401) {
        message.error("You are not authorized to access this page");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter shipping fees when search term or selected city changes
  useEffect(() => {
    let filtered = shippingFees;

    if (searchText) {
      filtered = filtered.filter(
        (fee) =>
          fee.cityName?.toLowerCase().includes(searchText.toLowerCase()) ||
          fee.districtName?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(
        (fee) => fee.cityId === parseInt(selectedCity)
      );
    }

    setFilteredFees(filtered);
  }, [searchText, selectedCity, shippingFees]);

  // Fetch districts when city changes in form
  const handleCityChange = async (cityId) => {
    if (!cityId) {
      setDistricts([]);
      form.resetFields(["districtId"]);
      return;
    }

    try {
      const districtsData = await shippingFeeService.getDistrictsByCity(cityId);
      console.log("Districts data:", districtsData);

      if (Array.isArray(districtsData)) {
        setDistricts(districtsData);
      } else {
        console.error("Invalid districts data:", districtsData);
        message.error("Error loading districts data");
      }
      form.resetFields(["districtId"]);
    } catch (error) {
      console.error("Error fetching districts:", error);
      message.error("Could not load districts for the selected city.");
      setDistricts([]);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleCityFilter = (value) => {
    setSelectedCity(value);
  };

  const showCreateModal = () => {
    setIsEditing(false);
    setCurrentFee(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (fee) => {
    setCurrentFee(fee);
    setIsEditing(true);

    form.setFieldsValue({
      cityId: fee.cityId,
      districtId: fee.districtId,
      fee: fee.fee,
    });

    handleCityChange(fee.cityId);
    setIsModalVisible(true);
  };

  const handleDeteleFee = async (id) => {
    const response = await shippingFeeService.deleteShippingFee(id);

    if (response) {
      fetchData();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    if (submitting) return;

    try {
      setSubmitting(true);

      if (isEditing) {
        // Update existing shipping fee
        const updatedFee = await shippingFeeService.updateShippingFee(
          currentFee.id,
          {
            fee: values.fee,
            isActive: true,
          }
        );

        message.success("Shipping fee updated successfully");

        // Refresh data to show updated information
        fetchData();
      } else {
        // Create new shipping fee
        await shippingFeeService.createShippingFee({
          cityId: values.cityId,
          districtId: values.districtId,
          fee: values.fee,
        });

        message.success("Shipping fee created successfully");

        // Refresh data to show the new fee
        fetchData();
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving shipping fee:", error);

      if (error.response && error.response.data) {
        message.error(
          `Failed to save: ${error.response.data.error || "Unknown error"}`
        );
      } else {
        message.error("Failed to save shipping fee. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "City",
      dataIndex: "cityName",
      key: "cityName",
      sorter: (a, b) => a.cityName.localeCompare(b.cityName),
    },
    {
      title: "District",
      dataIndex: "districtName",
      key: "districtName",
      sorter: (a, b) => a.districtName.localeCompare(b.districtName),
    },
    {
      title: "Fee ($)",
      dataIndex: "fee",
      key: "fee",
      render: (fee) => {
        return new Intl.NumberFormat("vi-VN").format(fee);
      },
      sorter: (a, b) => a.fee - b.fee,
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ backgroundColor: "#fda4af" }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete the product"
            description="Are you sure to delete this product?"
            onConfirm={() => handleDeteleFee(record.id)}
          >
            <Button danger type="primary">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Search and Filter Controls */}
      <div style={{ marginBottom: 16 }}>
        <Space size="middle">
          <Input
            placeholder="Search by city or district"
            value={searchText}
            onChange={handleSearch}
            style={{
              width: 250,
              border: "2px solid #fda4af",
              borderRadius: "6px",
              transition: "border-color 0.3s ease",
            }}
            suffix={<SearchOutlined style={{ color: "#fda4af" }} />}
          />

          <Select
            placeholder="Filter by City"
            style={{
              width: 200,
              border: "2px solid #fda4af",
              borderRadius: "6px",
            }}
            value={selectedCity || undefined}
            onChange={handleCityFilter}
            allowClear
          >
            {cities.map((city) => (
              <Option key={city.id} value={city.id}>
                {city.name}
              </Option>
            ))}
          </Select>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
            style={{ backgroundColor: "#fda4af" }}
          >
            Add New Fee
          </Button>
        </Space>
      </div>

      {/* Shipping Fees Table */}
      <Table
        columns={columns}
        dataSource={filteredFees}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      {/* Modal for Create/Edit */}
      <Modal
        title={isEditing ? "Edit Shipping Fee" : "Create New Shipping Fee"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="cityId"
            label="City/Province"
            rules={[{ required: true, message: "Please select a city" }]}
          >
            <Select
              placeholder="Select City"
              onChange={handleCityChange}
              disabled={isEditing}
              loading={loading}
              showSearch
              optionFilterProp="children"
            >
              {Array.isArray(cities) &&
                cities.map((city) => (
                  <Option key={city.id} value={city.id}>
                    {city.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="districtId"
            label="District"
            rules={[{ required: true, message: "Please select a district" }]}
          >
            <Select
              placeholder="Select District"
              disabled={!form.getFieldValue("cityId")}
              loading={loading}
              showSearch
              optionFilterProp="children"
            >
              {Array.isArray(districts) &&
                districts.map((district) => (
                  <Option key={district.id} value={district.id}>
                    {district.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="fee"
            label="Shipping Fee ($)"
            rules={[
              { required: true, message: "Please enter a fee" },
              {
                type: "number",
                min: 0,
                message: "Fee must be a positive number",
              },
            ]}
          >
            <InputNumber
              min={0}
              step={1000}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                style={{ backgroundColor: "#fda4af" }}
              >
                {isEditing ? "Update" : "Create"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShippingFeeManagement;
