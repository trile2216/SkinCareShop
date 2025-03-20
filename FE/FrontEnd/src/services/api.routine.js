import api from '../config/axios';
import { toast } from 'react-toastify';

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

const routineService = {
  // Lấy tất cả các routine
  getAllRoutines: async () => {
    try {
      const response = await api.get('/routine');
      return response.data;
    } catch (error) {
      console.error('Error fetching routines:', error);
      throw error;
    }
  },

  // Lấy routine theo ID
  getRoutineById: async (id) => {
    try {
      const response = await api.get(`/routine/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching routine with id ${id}:`, error);
      throw error;
    }
  },

  // Tạo routine mới
  createRoutine: async (routineData) => {
    try {
      const response = await api.post('/routine/create', routineData);
      return response.data;
    } catch (error) {
      console.error('Error creating routine:', error);
      throw error;
    }
  },

  // Cập nhật routine
  updateRoutine: async (id, routineData) => {
    try {
      const response = await api.put(`/routine/update/${id}`, routineData);
      return response.data;
    } catch (error) {
      console.error(`Error updating routine with id ${id}:`, error);
      throw error;
    }
  },

  // Xóa routine
  deleteRoutine: async (id) => {
    try {
      const response = await api.delete(`/routine/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting routine with id ${id}:`, error);
      throw error;
    }
  },

  // Tạo hoặc cập nhật routine với các bước
  saveRoutineWithSteps: async (id, routineData) => {
    try {
      if (id) {
        // Cập nhật routine
        const response = await api.put(`/routine/update/${id}`, routineData);
        return response.data;
      } else {
        // Tạo routine mới
        const response = await api.post('/routine/create', routineData);
        return response.data;
      }
    } catch (error) {
      console.error('Error saving routine with steps:', error);
      throw error;
    }
  },
};

export default routineService;