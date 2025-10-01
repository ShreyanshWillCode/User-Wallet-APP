import axios from 'axios';

// Create axios instance with base configuration
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
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: {
    identifier: string; // email or phone
    password: string;
  }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: {
    name?: string;
    phone?: string;
  }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },
};

// Wallet API
export const walletAPI = {
  getBalance: async () => {
    const response = await api.get('/wallet/balance');
    return response.data;
  },

  addMoney: async (data: {
    amount: number;
    paymentMethod: string;
  }) => {
    const response = await api.post('/wallet/add-money', data);
    return response.data;
  },

  transfer: async (data: {
    recipient: string;
    amount: number;
    description?: string;
  }) => {
    const response = await api.post('/wallet/transfer', data);
    return response.data;
  },

  withdraw: async (data: {
    amount: number;
    bankDetails: {
      accountNumber: string;
      ifscCode: string;
      bankName: string;
      accountHolder: string;
    };
  }) => {
    const response = await api.post('/wallet/withdraw', data);
    return response.data;
  },

  searchRecipients: async (query: string) => {
    const response = await api.get(`/wallet/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

// Transactions API
export const transactionsAPI = {
  getTransactions: async (params?: {
    type?: string;
    status?: string;
    limit?: number;
    page?: number;
  }) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  getTransaction: async (id: string) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  getStats: async (period?: string) => {
    const response = await api.get('/transactions/stats/summary', {
      params: { period }
    });
    return response.data;
  },

  getMonthlyStats: async (year?: number) => {
    const response = await api.get('/transactions/stats/monthly', {
      params: { year }
    });
    return response.data;
  },
};

export default api;
