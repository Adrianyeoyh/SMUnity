import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    studentId: string;
    role: 'student' | 'csp_leader' | 'admin';
  }) =>
    api.post('/auth/register', userData),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (userData: any) =>
    api.put('/auth/profile', userData),
};

// CSP API
export const cspAPI = {
  getCSPs: (filters?: {
    type?: string;
    location?: string;
    date?: string;
    skills?: string[];
    search?: string;
  }) =>
    api.get('/csps', { params: filters }),
  
  getCSP: (id: string) =>
    api.get(`/csps/${id}`),
  
  createCSP: (cspData: any) =>
    api.post('/csps', cspData),
  
  updateCSP: (id: string, cspData: any) =>
    api.put(`/csps/${id}`, cspData),
  
  deleteCSP: (id: string) =>
    api.delete(`/csps/${id}`),
  
  applyToCSP: (cspId: string, applicationData: any) =>
    api.post(`/csps/${cspId}/apply`, applicationData),
  
  getApplications: (cspId: string) =>
    api.get(`/csps/${cspId}/applications`),
  
  updateApplication: (cspId: string, applicationId: string, status: string) =>
    api.put(`/csps/${cspId}/applications/${applicationId}`, { status }),
};

// User API
export const userAPI = {
  getUsers: (role?: string) =>
    api.get('/users', { params: { role } }),
  
  getUser: (id: string) =>
    api.get(`/users/${id}`),
  
  updateUser: (id: string, userData: any) =>
    api.put(`/users/${id}`, userData),
  
  deleteUser: (id: string) =>
    api.delete(`/users/${id}`),
  
  getApplications: () =>
    api.get('/users/applications'),
  
  getMyCSPs: () =>
    api.get('/users/my-csps'),
};

// Analytics API
export const analyticsAPI = {
  getStats: () =>
    api.get('/analytics/stats'),
  
  getPopularCauses: () =>
    api.get('/analytics/popular-causes'),
  
  getVolunteerTrends: () =>
    api.get('/analytics/volunteer-trends'),
};

export default api;
