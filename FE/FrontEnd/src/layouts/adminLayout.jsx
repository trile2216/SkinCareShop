import React, { useState } from "react";
import {
  DesktopOutlined,
  PieChartOutlined,
  ProductOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  UserOutlined,
  QuestionOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Button } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import { toast } from "react-toastify";
import ScrollToTop from "../components/ScrollToTop";
import useScrollToTop from "../hooks/useScrollToTop";
import { Avatar, Typography } from "antd";
const { Header, Sider } = Layout;
const { Title } = Typography;


function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboard/${key}`}>{label}</Link>,
  };
}

const items = [
  getItem("OVERVIEW", "overview", <PieChartOutlined />),
  getItem("PRODUCT", "product", <ProductOutlined />),
  getItem("ORDER", "order", <UnorderedListOutlined />),
  getItem("USER", "user", <UserOutlined />),
  getItem("QUIZ", "quiz", <QuestionOutlined />),
  getItem("ROUTINE", "routine", <FieldTimeOutlined />),
  getItem("LOGOUT", "logout", <LogoutOutlined />),
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useScrollToTop();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
      toast.success("Log out success!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={300}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ boxShadow: "2px 0 10px rgba(0,0,0,0.1)" }}
      >
        <div style={{ padding: 16, textAlign: "center" }}>
          <Avatar size={64} src="https://png.pngtree.com/png-clipart/20210308/original/pngtree-admin-line-icon-png-image_5784769.jpg" />
          {!collapsed && <Title level={5} style={{ color: "#fff", marginTop: 10 }}>Admin Panel</Title>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={items}
          onClick={handleMenuClick}
          style={{ fontSize: "16px" }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: colorBgContainer,
            boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
          
        </Header>
        <Content
          style={{
            margin: "20px 16px",
            padding: 24,
            borderRadius: "8px",
            background: colorBgContainer,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
      <ScrollToTop />
    </Layout>
  );
};

export default AdminLayout;
