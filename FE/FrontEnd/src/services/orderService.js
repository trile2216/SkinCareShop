
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

    updateOrderStatus: async (orderId, orderStatus) => {

        const response = await api.put(`/order/changestatus/${orderId}&${orderStatus}`);
        return response.data;

    },
}; 