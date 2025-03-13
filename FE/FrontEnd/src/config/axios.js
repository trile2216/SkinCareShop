import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:5286/api',
    //    baseURL: 'https://678511df1ec630ca33a711bb.mockapi.io/'
    withCredentials: true,

});

// Thêm interceptor để gửi token trong header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Thêm token vào header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;