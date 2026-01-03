import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器：自动携带Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('blog-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：统一处理错误
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 401 Token失效
    if (error.response?.status === 401) {
      localStorage.removeItem('blog-token');
      localStorage.removeItem('blog-user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;