import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, Modal, message } from 'antd';
import { orderService } from '../../services/orderService';
import './styles.css';

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
            console.error('Error fetching orders:', error);
            message.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            message.success('Order status updated successfully');
            fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
            message.error('Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'Pending': 'gold',
            'Processing': 'blue',
            'Shipped': 'cyan',
            'Delivered': 'green',
            'Cancelled': 'red'
        };
        return statusColors[status] || 'default';
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Order Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => `$${amount.toFixed(2)}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
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
                        onClick={() => handleStatusUpdate(record.id, 'Processing')}
                        disabled={record.status === 'Delivered'}
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
                                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                                <p><strong>Customer ID:</strong> {selectedOrder.userId}</p>
                                <p><strong>Shipping Address:</strong> {selectedOrder.shippingAddress}</p>
                                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                            </div>

                            <div className="order-items">
                                <h3>Order Items</h3>
                                <Table
                                    dataSource={selectedOrder.items}
                                    columns={[
                                        {
                                            title: 'Product',
                                            dataIndex: 'productName',
                                        },
                                        {
                                            title: 'Quantity',
                                            dataIndex: 'quantity',
                                        },
                                        {
                                            title: 'Price',
                                            dataIndex: 'price',
                                            render: (price) => `$${price.toFixed(2)}`,
                                        },
                                        {
                                            title: 'Subtotal',
                                            dataIndex: 'subtotal',
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
            </div>
        </div>
    );
};

export default OrderManagement; 