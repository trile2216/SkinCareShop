import { toast } from "react-toastify";
import api from "../config/axios";

export const getCustomer = async (id) => {
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
};



export const updateCustomer = async ({ id, customer }) => {
    try {
        const response = await api.put(`/customer/${id}`, customer);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data || "Failed to update customer");
    }
};
