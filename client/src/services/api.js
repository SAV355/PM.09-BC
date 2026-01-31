import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const mortgageApi = {
    calculate: (data) => api.post('/calculations/mortgage', data),
    save: (data) => api.post('/calculations/save', data),
    sendEmail: (data) => api.post('/calculations/send-email', data),
};

export const adminApi = {
    getCalculations: () => api.get('/admin/calculations'),
    exportCalculations: () => api.get('/admin/export'),
};

export default api;