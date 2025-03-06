
import api from '../config/axios';

export const orderService = {
    getAllOrders: async () => {
        try {
            const response = await api.get(`/order`);
            return response.data;
        } catch (error) {
            console.error('Error in getAllOrders:', error);
            throw error;
        }
    },

    getOrderById: async (id) => {
        try {
            const response = await api.get(`/order/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error in getOrderById:', error);
            throw error;
        }
    },

    updateOrderStatus: async (id, status) => {
        try {
            const response = await api.put(`/order/${id}`, { status });
            return response.data;
        } catch (error) {
            console.error('Error in updateOrderStatus:', error);
            throw error;
        }
    }
}; 