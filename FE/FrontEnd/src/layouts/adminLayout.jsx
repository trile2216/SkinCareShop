import React, { useState } from "react";
import {
  DesktopOutlined,
  PieChartOutlined,
  ProductOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Button } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import { toast } from "react-toastify";

const { Header, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboard/${key}`}>{label}</Link>,
  };
}

const items = [
  getItem("PRODUCT", "product", <ProductOutlined />),
  getItem("USER", "user", <DesktopOutlined />),
  getItem("ORDER", "order", <UnorderedListOutlined />),
  getItem("LOGOUT", "logout", <LogoutOutlined />),
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <div
            style={{
              padding: 24,
              height: "100%",
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
