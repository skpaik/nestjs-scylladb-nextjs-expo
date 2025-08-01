import axios from 'axios';
import { Product, PaginatedResponse, ApiResponse } from '@/types/product';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const productApi = {
  // Get all products with pagination
  getProducts: async (page: number = 1, limit: number = 12): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Product>>>(
      `/products?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  // Get latest products
  getLatestProducts: async (limit: number = 8): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>(`/products/latest?limit=${limit}`);
    return response.data.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string, page: number = 1, limit: number = 12): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Product>>>(
      `/products/category/${category}?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  // Search products
  searchProducts: async (query: string, page: number = 1, limit: number = 12): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Product>>>(
      `/products/search?q=${query}&page=${page}&limit=${limit}`
    );
    return response.data.data;
  },
};

export default api;