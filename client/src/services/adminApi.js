import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const adminApi = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Интерцептор для добавления токена
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers['x-admin-token'] = token;
    }
    return config;
});

export const adminAuth = {
    login: (password) => adminApi.post('/admin-auth/login', { password }),
};

export const adminCalculators = {
    getAll: () => adminApi.get('/admin/calculators'),
    getOne: (id) => adminApi.get(`/admin/calculators/${id}`),
    create: (data) => adminApi.post('/admin/calculators', data),
    update: (id, data) => adminApi.put(`/admin/calculators/${id}`, data),
    delete: (id) => adminApi.delete(`/admin/calculators/${id}`),
};

export const adminCalculations = {
    getList: (params) => adminApi.get('/admin/calculations', { params }),
    exportCSV: () => adminApi.get('/admin/export-csv', { responseType: 'blob' }),
    exportJSON: () => adminApi.get('/admin/export-json'),
};

export default adminApi;