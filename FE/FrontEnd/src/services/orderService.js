
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

    getOrdersByCustomerId: async (customerId) => {
        try {
            const response = await api.get(`/order/customer/${customerId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching order history:', error);
            throw error;
        }
    },



    updateOrderStatus: async (orderId, orderStatus) => {

        const response = await api.put(`/order/changestatus/${orderId}?orderStatus=${orderStatus}`);
        return response.data;
    },
}; 