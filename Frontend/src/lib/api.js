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

export const classService = {
  // Get all classes
  getAll: async () => {
    await getCsrfCookie();
    return api.get('/admin/classes');
  },

  // Get a specific class
  getById: async (id) => {
    await getCsrfCookie();
    return api.get(`/admin/classes/${id}`);
  },

  // Create a new class
  create: async (classData) => {
    await getCsrfCookie();
    return api.post('/admin/classes', classData);
  },

  // Update an existing class
  update: async (id, classData) => {
    await getCsrfCookie();
    return api.put(`/admin/classes/${id}`, classData);
  },

  // Delete a class
  delete: async (id) => {
    await getCsrfCookie();
    return api.delete(`/admin/classes/${id}`);
  },

  // Get all coaches for dropdown
  getCoaches: async () => {
    await getCsrfCookie();
    return api.get('/admin/coaches-list');
  }
};

export const productService = {
  // Get all products
  getAll: async () => {
    await getCsrfCookie();
    return api.get('/admin/products');
  },

  // Get a specific product
  getById: async (id) => {
    await getCsrfCookie();
    return api.get(`/admin/products/${id}`);
  },

  // Create a new product
  create: async (productData) => {
    await getCsrfCookie();
    return api.post('/admin/products', productData);
  },

  // Update an existing product
  update: async (id, productData) => {
    await getCsrfCookie();
    return api.put(`/admin/products/${id}`, productData);
  },

  // Delete a product
  delete: async (id) => {
    await getCsrfCookie();
    return api.delete(`/admin/products/${id}`);
  },

  // Get all product categories
  getCategories: async () => {
    await getCsrfCookie();
    return api.get('/admin/product-categories');
  }
};

export const analyticsService = {
  // 1. Monthly revenue + expenses for last 6 months
  getRevenueData: async () => {
    await getCsrfCookie();
    return api.get('/admin/analytics/revenue');
  },

  // 2. Active membership distribution (counts per plan)
  getMembershipDistribution: async () => {
    await getCsrfCookie();
    return api.get('/admin/analytics/membership');
  },

  // 3. Client age-group distribution
  getAgeDistribution: async () => {
    await getCsrfCookie();
    return api.get('/admin/analytics/age-distribution');
  },

  // 4. Top 5 product sales
  getProductSales: async () => {
    await getCsrfCookie();
    return api.get('/admin/analytics/product-sales');
  },

  // 5. Monthly profit margins for last 6 months
  getProfitMargins: async () => {
    await getCsrfCookie();
    return api.get('/admin/analytics/profit-margins');
  }
};


export default api;