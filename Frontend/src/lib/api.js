// src/lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, // Important for CSRF cookie
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Function to get CSRF cookie from Laravel Sanctum
export const getCsrfCookie = async () => {
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true
    });
    return true;
  } catch (error) {
    console.error('Failed to get CSRF cookie:', error);
    return false;
  }
};

export const staffService = {
  // Get all staff members
  getAll: async () => {
    // Get CSRF cookie before making the authenticated request
    await getCsrfCookie();
    return api.get('/admin/staff');
  },

  // Create a new staff member
  create: async (staffData) => {
    await getCsrfCookie();
    return api.post('/admin/staff', staffData);
  },

  // Update an existing staff member
  update: async (id, staffData) => {
    await getCsrfCookie();
    return api.put(`/admin/staff/${id}`, staffData);
  },

  // Delete a staff member
  delete: async (id, role) => {
    await getCsrfCookie();
    return api.delete(`/admin/staff/${id}`, { data: { role } });
  }
};

export const clientService = {
  // Get all clients
  getAll: async () => {
    await getCsrfCookie();
    return api.get('/admin/clients');
  },

  // Get a specific client
  getById: async (id) => {
    await getCsrfCookie();
    return api.get(`/admin/clients/${id}`);
  },

  // Create a new client
  create: async (clientData) => {
    await getCsrfCookie();
    return api.post('/admin/clients', clientData);
  },

  // Update an existing client
  update: async (id, clientData) => {
    await getCsrfCookie();
    return api.put(`/admin/clients/${id}`, clientData);
  },

  // Delete a client
  delete: async (id) => {
    await getCsrfCookie();
    return api.delete(`/admin/clients/${id}`);
  },

  // Get all membership plans
  getMembershipPlans: async () => {
    await getCsrfCookie();
    return api.get('/admin/membership-plans');
  }
};

export default api;