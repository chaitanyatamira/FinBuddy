import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getUser: () => api.get('/auth/user'),
  updateProfileImage: (data) => {
    const formData = new FormData();
    formData.append('image', data);
    return api.post('/auth/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const income = {
  getAll: () => api.get('/income'),
  add: (data) => api.post('/income', data),
  delete: (id) => api.delete(`/income/${id}`),
  export: () => api.get('/income/export', { responseType: 'blob' }),
};

export const expenses = {
  getAll: () => api.get('/expenses'),
  add: (data) => api.post('/expenses', data),
  delete: (id) => api.delete(`/expenses/${id}`),
  export: () => api.get('/expenses/export', { responseType: 'blob' }),
};

export const dashboard = {
  getSummary: () => api.get('/dashboard/summary'),
  getRecentTransactions: () => api.get('/dashboard/recent-transactions'),
  getExpenseCategories: () => api.get('/dashboard/expense-categories'),
  getIncomeCategories: () => api.get('/dashboard/income-categories'),
  getLast30DaysExpenses: () => api.get('/dashboard/last-30-days-expenses'),
};

export default api; 