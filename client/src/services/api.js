import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
/*
// Интерцептор для обработки ошибок
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Обработка ошибки аутентификации
            console.error('Authentication error');
        } else if (error.response?.status === 500) {
            console.error('Server error');
        }
        return Promise.reject(error);
    }
);
*/
export const calculationsAPI = {
    mortgage: (data) => api.post('/calculations/mortgage', data),
    auto: (data) => api.post('/calculations/auto', data),
    consumer: (data) => api.post('/calculations/consumer', data),
    pension: (data) => api.post('/calculations/pension', data),
    save: (data) => api.post('/calculations/save', data),
    sendEmail: (data) => api.post('/calculations/send-email', data),
};

export const adminApi = {
    getCalculations: () => api.get('/admin/calculations'),
    exportCalculations: () => api.get('/admin/export'),
};

export default api;