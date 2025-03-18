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
        
    },
    
    // Import quiz từ file
    importQuiz: async (file, fileType) => {
        const formData = new FormData();
        formData.append("file", file);
        
        const endpoint = fileType === "excel" ? "/quiz/import/excel" : "/quiz/import/csv";
        const response = await api.post(endpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    },
    
    // Download template cho quiz
    downloadTemplate: async () => {
        const response = await api.get("/quiz/download-template", {
            responseType: "blob",
        });
        return response.data;
    },
    
    // Get all quizzes
    getAllQuizzes: async () => {
        const response = await api.get('/quiz/all');
        return response.data;
    },

    setQuizActiveStatus: async (quizId, isActive) => {
        const response = await api.put(`/quiz/change-status/${quizId}`, { isActive });
        return response.data;
    },
};