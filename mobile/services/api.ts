import axios from 'axios';
import { Product, ProductsResponse } from '@/types/product';

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = AsyncStorage.getItem('authToken');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const productApi = {
  // Get latest products for homepage
  getLatestProducts: async (limit: number = 10): Promise<Product[]> => {
    const response = await api.get(`/products/latest?limit=${limit}`);
    return response.data;
  },

  // Get products with pagination
  getProducts: async (page: number = 1, limit: number = 20, search?: string): Promise<ProductsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await api.get(`/products?${params}`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string, page: number = 1, limit: number = 20): Promise<ProductsResponse> => {
    const response = await api.get(`/products/category/${category}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query: string, page: number = 1, limit: number = 20): Promise<ProductsResponse> => {
    const response = await api.get(`/products/search?q=${query}&page=${page}&limit=${limit}`);
    return response.data;
  },
};

export default api;