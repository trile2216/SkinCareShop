import axios from '../config/axios';

export const getRoutineBySkinTypeId = async (skinTypeId) => {
  try {
    const response = await axios.get(`/routine/skintype/${skinTypeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching skin care routine:', error);
    throw error;
  }
};

export const getRecommendedProducts = async (skinTypeId) => {
  try {
    const response = await axios.get(`/products/recommended/${skinTypeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    throw error;
  }
};