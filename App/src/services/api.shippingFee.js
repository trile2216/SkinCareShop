import { instance } from "../lib/axios";

const shippingFeeService = {
  getAllCities: async () => {
    try {
      const response = await instance.get("/shipping-fee/cities");
      return response.data;
    } catch (error) {
      console.error("Error fetching cities:", error);
      throw error;
    }
  },

  getDistrictsByCity: async (cityId) => {
    try {
      const response = await instance.get(`/shipping-fee/districts-by-city/${cityId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching districts for city ${cityId}:`, error);
      throw error;
    }
  },

  getShippingFee: async (cityId, districtId) => {
    try {
      // Use the format with & like the backend expects
      const response = await instance.get(`/shipping-fee/${cityId}&${districtId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching shipping fee:", error);
      // Return default fee if endpoint doesn't exist
      return { fee: 15 };
    }
  },

  getAllShippingFees: async () => {
    try {
      const response = await instance.get("/shipping-fee/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching all shipping fees:", error);
      throw error;
    }
  },

  createShippingFee: async (data) => {
    try {
      const response = await instance.post("/shipping-fee/create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating shipping fee:", error);
      throw error;
    }
  },

  updateShippingFee: async (id, data) => {
    try {
      const response = await instance.put(`/shipping-fee/update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating shipping fee ${id}:`, error);
      throw error;
    }
  },

  deleteShippingFee: async (id) => {
    try {
      const response = await instance.delete(`/shipping-fee/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting shipping fee ${id}:`, error);
      throw error;
    }
  },

  getDistrictsById: async (id) => {
    try {
      const response = await instance.get(`/shipping-fee/districts-by-id/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching districts for ID ${id}:`, error);
      throw error;
    }
  },
};

export default shippingFeeService;
