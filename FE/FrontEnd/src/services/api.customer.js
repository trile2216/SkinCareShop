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

    // Quên mật khẩu - gửi email khôi phục
    forgotPassword: async (email) => {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            toast.success("If this email is registered, you will receive password reset instructions");
            return response.data;
        } catch (error) {
            console.error("Error requesting password reset:", error);
            // Không hiển thị toast lỗi để bảo vệ thông tin người dùng
            throw error;
        }
    },

    // Đặt lại mật khẩu sau khi nhận được email
    resetPassword: async (resetData) => {
        try {
            const response = await api.post('/auth/reset-password', resetData);
            toast.success("Password reset successful!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data || "Failed to reset password. Please try again.");
            throw error;
        }
    }
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

// Quên mật khẩu - gửi email khôi phục
export const forgotPassword = async (email) => {
    try {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        console.error("Error requesting password reset:", error);
        throw error;
    }
};

// Đặt lại mật khẩu
export const resetPassword = async (resetData) => {
        const response = await api.post('/auth/reset-password', resetData);
        return response.data;
};

const getCustomerTestResult = async (userId) => {
    try {
        const response = await fetch(`/api/quiz/result/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch test results');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching test results:', error);
        throw error;
    }
};

// Export thêm hàm mới
export {
    // ... existing exports ...
    getCustomerTestResult
};
