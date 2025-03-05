import axios from '../config/axios';

export const getSkinCareRoutine = async (skinTypeId) => {
  try {
    const response = await axios.get(`/api/skincare-routine/${skinTypeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching skin care routine:', error);
    throw error;
  }
};

export const getRecommendedProducts = async (skinTypeId) => {
  try {
    const response = await axios.get(`/api/products/recommended/${skinTypeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    throw error;
  }
};