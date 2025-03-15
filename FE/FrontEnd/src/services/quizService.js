import api from '../config/axios';


export const quizService = {
    // Lấy quiz đang active
    getActiveQuiz: async () => {
        try {
            const response = await api.get(`/quiz/active`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy quiz theo ID
    getQuizById: async (quizId) => {
        try {
            const response = await api.get(`/quiz/${quizId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Submit câu trả lời quiz
    submitQuiz: async (submission) => {
        try {
            const response = await api.post(`/quiz/submit`, submission);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy kết quả của customer
    getCustomerResult: async (customerId) => {
        try {
            const response = await api.get(`/quiz/result/${customerId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 