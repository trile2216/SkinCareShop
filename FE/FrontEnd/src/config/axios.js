import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:5286/api',
//    baseURL: 'https://678511df1ec630ca33a711bb.mockapi.io/'
    withCredentials: true ,
});

export default api;