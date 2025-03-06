import axios from 'axios';
import { Order } from '../types/Order';

export const orderService = {
    // Lấy danh sách orders
    getAllOrders: async () => {
        const response = await axios.get < Order[] > (`${API_URL}/orders`);
        return response.data;
    },

    // Lấy chi tiết order
    getOrderById: async (id: int) => {
        const response = await axios.get < Order > (`${API_URL}/orders/${id}`);
        return response.data;
    },

    // Cập nhật trạng thái order
    updateOrderStatus: async (id: int, status: string) => {
        const response = await axios.put(`${API_URL}/orders/${id}/status`, { status });
        return response.data;
    }
};