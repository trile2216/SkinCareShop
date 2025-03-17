import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Tooltip,
  Drawer,
  Tabs,
  Typography,
  Divider,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import customerService from "../../services/api.customer";
import { orderService } from "../../services/orderService";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const [userOrders, setUserOrders] = useState([]);

  // Fetch users data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await customerService.getAllCustomers();
      setUsers(data);
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user edit
  const handleEdit = (user) => {
    setCurrentUser(user);
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
    });
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      await customerService.updateCustomer(currentUser.id, {
        ...values,
        id: currentUser.id,
        accountId: currentUser.accountId,
      });
      message.success("User updated successfully");
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error("Failed to update user");
    }
  };

  // Handle user deletion
  const handleDelete = async (userId) => {
    try {
      await customerService.deleteCustomer(userId);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  // View user details
  const viewUserDetails = async (user) => {
    setCurrentUser(user);
    setIsViewModalVisible(true);

    try {
      // Fetch user orders
      const orders = await orderService.getOrdersByCustomerId(user.id);
      console.log(orders);
      setUserOrders(orders);
    } catch (error) {
      message.error("Failed to fetch user details");
    }
  };

  // Filter users based on search text
  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      (user.phone && user.phone.includes(searchText))
  );

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "N/A",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) => {
        if (!address) return "N/A";
        return address.length > 30 ? (
          <Tooltip title={address}>{address.substring(0, 30)}...</Tooltip>
        ) : (
          address
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => viewUserDetails(record)}
          />
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Render user details in modal
  const renderUserDetails = () => {
    if (!currentUser) return null;

    return (
      <>
        <div className="mb-6">
          <Title level={4} className="mb-4">
            User Information
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <UserOutlined className="mr-2 text-purple-600" />
              <Text strong>Name:</Text>
              <Text className="ml-2">
                {currentUser.firstName} {currentUser.lastName}
              </Text>
            </div>
            <div className="flex items-center">
              <MailOutlined className="mr-2 text-purple-600" />
              <Text strong>Email:</Text>
              <Text className="ml-2">{currentUser.email}</Text>
            </div>
            <div className="flex items-center">
              <PhoneOutlined className="mr-2 text-purple-600" />
              <Text strong>Phone:</Text>
              <Text className="ml-2">{currentUser.phone || "N/A"}</Text>
            </div>
            <div className="flex items-center">
              <HomeOutlined className="mr-2 text-purple-600" />
              <Text strong>Address:</Text>
              <Text className="ml-2">{currentUser.address || "N/A"}</Text>
            </div>
          </div>
        </div>

        <Tabs defaultActiveKey="1">
          <TabPane tab="Orders" key="1">
            {userOrders.length > 0 ? (
              <Table
                dataSource={userOrders}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                columns={[
                  {
                    title: "Order ID",
                    dataIndex: "id",
                    key: "id",
                  },
                  {
                    title: "Date",
                    dataIndex: "orderDate",
                    key: "orderDate",
                    render: (date) => new Date(date).toLocaleDateString(),
                  },
                  {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: (status) => (
                      <Tag
                        color={
                          status === "Completed"
                            ? "green"
                            : status === "Processing"
                            ? "blue"
                            : status === "Cancelled"
                            ? "red"
                            : "orange"
                        }
                      >
                        {status}
                      </Tag>
                    ),
                  },
                  {
                    title: "Total",
                    dataIndex: "totalPrice",
                    key: "totalPrice",
                    render: (amount) =>
                      amount ? `$${amount.toFixed(2)}` : "$0.00",
                  },
                ]}
              />
            ) : (
              <Text>No orders found for this user.</Text>
            )}
          </TabPane>
        </Tabs>
      </>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>User Management</Title>
      </div>

      <div className="mb-4"></div>

      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            firstName: currentUser?.firstName,
            lastName: currentUser?.lastName,
            email: currentUser?.email,
            phone: currentUser?.phone || "",
            address: currentUser?.address || "",
          }}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View User Details Modal */}
      <Modal
        title={
          currentUser
            ? `${currentUser.firstName} ${currentUser.lastName}'s Profile`
            : "User Profile"
        }
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {renderUserDetails()}
      </Modal>
    </div>
  );
};

export default UserManagement;
