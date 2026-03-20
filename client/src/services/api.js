import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Automatically attach admin JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Admin Auth
export const loginAdmin = (data) => API.post('/admin/login', data);

// Certificates
export const uploadExcel = (formData) =>
    API.post('/certificates/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const verifyCertificate = (id) => API.get(`/certificates/verify/${id}`);
export const getAllCertificates = () => API.get('/certificates');
export const deleteCertificate = (id) => API.delete(`/certificates/${id}`);

export default API;
