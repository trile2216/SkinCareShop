import api from '../config/axios';


export const quizService = {
    // Lấy quiz đang active
    getActiveQuiz: async () => {
        const response = await api.get(`/quiz/active`);
        return response.data;
        
    },

    // Lấy quiz theo ID
    getQuizById: async (quizId) => {
       
            const response = await api.get(`/quiz/${quizId}`);
            return response.data;
        
    },

    // Submit câu trả lời quiz
    submitQuiz: async (submission) => {
        
            const response = await api.post(`/quiz/submit`, submission);
            return response.data;
        
    },

    // Lấy kết quả của customer
    getCustomerResult: async (customerId) => {
        
            const response = await api.get(`/quiz/result/${customerId}`);
            return response.data;
        
    }
}; 