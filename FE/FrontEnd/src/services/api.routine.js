import api from '../config/axios';
import axios from '../config/axios';


export const getRoutineBySkinTypeId = async (skinTypeId) => {
  try {
    const response = await api.get(`/routine/skintype/${skinTypeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching skin care routine:', error);
    throw error;
  }
};

export const getRecommendedProducts = async (skinTypeId, categoryId) => {
  try {
    const response = await api.get(`/product/recommendation/${skinTypeId}&${categoryId}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
    throw error;
  }
};