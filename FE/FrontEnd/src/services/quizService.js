import axios from 'axios';

const API_URL = 'api/quiz';

export const quizService = {
    // Lấy quiz đang active
    getActiveQuiz: async () => {
        try {
            const response = await axios.get(`${API_URL}/active`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy quiz theo ID
    getQuizById: async (quizId) => {
        try {
            const response = await axios.get(`${API_URL}/${quizId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Submit câu trả lời quiz
    submitQuiz: async (submission) => {
        try {
            const response = await axios.post(`${API_URL}/submit`, submission);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy kết quả của customer
    getCustomerResult: async (customerId) => {
        try {
            const response = await axios.get(`${API_URL}/result/${customerId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 