import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import { Link, Outlet } from "react-router-dom";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    AppstoreOutlined,
    SettingOutlined,
    ReadOutlined,
    DashboardOutlined,
    BellOutlined,
    LogoutOutlined
} from "@ant-design/icons";

const { Header, Sider, Content, Footer } = Layout;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    const menu = (
        <Menu>
            <Menu.Item key="1" icon={<LogoutOutlined />}>
                <Link to="/logout">Logout</Link>
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout className="h-screen w-full">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                className="bg-rose-300 min-h-screen"
                width={250}
            >
                <div className="text-white text-center p-4 font-bold text-lg">
                    Admin Panel
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    className="bg-[#F43F5E] min-h-full"
                    defaultSelectedKeys={["1"]}
                >
                    <Menu.Item key="1" icon={<DashboardOutlined />}>
                        <Link to="/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}>
                        <Link to="/dashboard/customers">Customers</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<AppstoreOutlined />}>
                        <Link to="/dashboard/products">Product</Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<ReadOutlined />}>
                        <Link to="/dashboard/blogs">Blogs</Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<SettingOutlined />}>
                        <Link to="/dashboard/account">Account</Link>
                    </Menu.Item>
                    <Menu.Item key="6" icon={<SettingOutlined />}>
                        <Link to="/dashboard/settings">Settings</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header className="bg-rose-500 flex justify-between items-center px-6">
                    <button
                        className="text-white text-lg"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </button>
                    <div className="flex items-center gap-4">

                        <Avatar src="https://fanpagefacebook.com/pph_include/images/Facebook%20Avatar.jpg" />
                    </div>
                </Header>
                <Content className="p-6 bg-gray-100 w-full min-h-screen">
                    <Outlet />
                </Content>

            </Layout>
        </Layout>
    );
};

export default AdminLayout;
