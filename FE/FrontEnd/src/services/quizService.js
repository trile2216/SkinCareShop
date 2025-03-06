import axios from 'axios';
import api from '../config/axios';

export const quizService = {
    // Lấy danh sách câu hỏi từ BE
    getQuestions: async () => {
        try {
            const response = await api.get(`/quiz/active`);
            return response.data;
        } catch (error) {
            console.error('Error fetching questions:', error);
            throw error;
        }
    },

    // Gửi câu trả lời và nhận kết quả
    submitAnswers: async (answers) => {
        try {
            const response = await api.post(`/quiz/submit`, { answers });
            return response.data;
        } catch (error) {
            console.error('Error submitting answers:', error);
            throw error;
        }
    },

    // Lấy routine và sản phẩm recommend theo skin type
    getRecommendations: async (skinType) => {
        try {
            const response = await api.get(`/skintype/${skinType}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            throw error;
        }
    }
}; 