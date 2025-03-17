import { toast } from "react-toastify";
import api from "../config/axios";

const customerService = {
    // Lấy danh sách tất cả khách hàng
    getAllCustomers: async () => {
        try {
            const response = await api.get("/customer");
            return response.data;
        } catch (error) {
            console.error("Error fetching customers:", error);
            throw error;
        }
    },

    // Lấy thông tin chi tiết của một khách hàng
    getCustomerById: async (id) => {
        if (!id) {
            toast.error("Invalid Customer ID");
            throw new Error("Invalid Customer ID");
        }

        try {
            const response = await api.get(`/customer/${id}`);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data || "Failed to fetch customer data");
            throw error;
        }
    },

    // Cập nhật thông tin khách hàng
    updateCustomer: async (id, customerData) => {
        try {
            const response = await api.put(`/customer/${id}`, customerData);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data || "Failed to update customer");
            throw error;
        }
    },

    // Xóa khách hàng
    deleteCustomer: async (id) => {
        try {
            const response = await api.delete(`/customer/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting customer with id ${id}:`, error);
            throw error;
        }
    },

    // Lấy danh sách đơn hàng của khách hàng
    getCustomerOrders: async (id) => {
        try {
            const response = await api.get(`/customers/${id}/orders`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching orders for customer with id ${id}:`, error);
            throw error;
        }
    },

    // Lấy kết quả quiz của khách hàng
    getCustomerQuizResults: async (id) => {
        try {
            const response = await api.get(`/customers/${id}/quiz-results`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching quiz results for customer with id ${id}:`, error);
            throw error;
        }
    },

    
};

export default customerService;

// Change password
export const changePassword = async (id, passwordData) => {
    try {
        const response = await api.post(`/auth/change-password`, passwordData);
        toast.success("Password changed successfully");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data || "Failed to change password");
        throw error;
    }
};
