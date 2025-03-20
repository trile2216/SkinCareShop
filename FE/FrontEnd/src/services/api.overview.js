import api from "../config/axios";

const overviewService = {
    // Lấy dữ liệu tổng quan
    getSummaryData: async () => {
        try {
            const response = await api.get('/admin/summary');
            return response.data;
        } catch (error) {
            console.error('Error fetching summary data:', error);
            throw error;
        }
    },

    // Lấy danh sách top sản phẩm
    getTopProducts: async () => {
        try {
            const response = await api.get('/admin/top-products');
            return response.data;
        } catch (error) {
            console.error('Error fetching top products:', error);
            throw error;
        }
    },

    // Lấy danh sách đơn hàng gần đây
    getRecentOrders: async () => {
        try {
            const response = await api.get('/admin/recent-orders');
            return response.data;
        } catch (error) {
            console.error('Error fetching recent orders:', error);
            throw error;
        }
    },

    // Lấy thống kê trạng thái đơn hàng
    getOrderStatus: async () => {
        try {
            const response = await api.get('/admin/order-status');
            return response.data;
        } catch (error) {
            console.error('Error fetching order status:', error);
            throw error;
        }
    },

    // Lấy tất cả dữ liệu dashboard
    getAllDashboardData: async () => {
        try {
            const [summary, topProducts, recentOrders, orderStatus] = await Promise.all([
                overviewService.getSummaryData(),
                overviewService.getTopProducts(),
                overviewService.getRecentOrders(),
                overviewService.getOrderStatus()
            ]);

            return {
                summary,
                topProducts,
                recentOrders,
                orderStatus
            };
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }
    }
};

export default overviewService; 