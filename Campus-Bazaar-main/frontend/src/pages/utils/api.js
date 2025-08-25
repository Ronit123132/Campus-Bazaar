import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true
});

// Optionally attach token automatically if it exists in localStorage
api.interceptors.request.use((config) => {
  // Do not attach token for public auth routes
  const publicRoutes = ['/api/auth/signup', '/api/auth/login'];
  const isPublic = publicRoutes.some(route => config.url && config.url.includes(route));
  if (!isPublic) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
