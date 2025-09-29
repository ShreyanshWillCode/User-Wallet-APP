import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Wallet API
export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  addMoney: (data) => api.post('/wallet/add', data),
  transfer: (data) => api.post('/wallet/transfer', data),
  withdraw: (data) => api.post('/wallet/withdraw', data),
  searchRecipients: (query) => api.get(`/wallet/recipients?q=${encodeURIComponent(query)}`),
};

// Transactions API
export const transactionsAPI = {
  getTransactions: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/transactions?${queryString}`);
  },
  getTransaction: (id) => api.get(`/transactions/${id}`),
  getStats: (period = '30d') => api.get(`/transactions/stats/summary?period=${period}`),
  getMonthlyStats: (year = new Date().getFullYear()) => 
    api.get(`/transactions/stats/monthly?year=${year}`),
};

export default api;
