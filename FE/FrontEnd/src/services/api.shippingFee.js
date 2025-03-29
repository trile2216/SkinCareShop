import api from "../config/axios";

const shippingFeeService = {
    getAllCities: async () => {
      try {
        const response = await api.get(`shipping-fee/cities`);
        return response.data;
      } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }
    },
  
    getDistrictsByCity: async (cityId) => {
      try {
        const response = await api.get(`/shipping-fee/districts/${cityId}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching districts for city ${cityId}:`, error);
        throw error;
      }
    },
  
    getShippingFee: async (cityId, districtId) => {
      try {
        const response = await api.get(`/shipping-fee/${cityId}&${districtId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching shipping fee:', error);
        throw error;
      }
    },
  
    // Admin only functions
    getAllShippingFees: async () => {
      try {
        const response = await api.get(`/shipping-fee/all`);
        return response.data;
      } catch (error) {
        console.error('Error fetching all shipping fees:', error);
        throw error;
      }
    },
  
    createShippingFee: async (data) => {
      try {
        const response = await api.post(`/shipping-fee/create`, data);
        return response.data;
      } catch (error) {
        console.error('Error creating shipping fee:', error);
        throw error;
      }
    },
  
    updateShippingFee: async (id, data) => {
      try {
        const response = await api.put(`/shipping-fee/update/${id}`, data);
        return response.data;
      } catch (error) {
        console.error(`Error updating shipping fee ${id}:`, error);
        throw error;
      }
    }
  };
  
  export default shippingFeeService;