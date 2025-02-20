import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
});

apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    response => {
        return response
    },
    async error => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized request. Token may have expired.');
        }
        return Promise.reject(error);
    }
);

export default apiClient;