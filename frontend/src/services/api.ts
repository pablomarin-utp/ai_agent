import axios, { AxiosInstance, AxiosError } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          toast.error('Your session has expired. Please login again.');
        } else if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          toast.error(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
        } else if (error.response?.status >= 500) {
          toast.error('Server error. Please try again later.');
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(email: string, password: string) {
    const response = await this.api.post('/auth/register', { email, password });
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // Chat endpoints
  async sendChatMessage(message: string) {
    const response = await this.api.post('/chat', { message });
    return response.data;
  }

  async getChatHistory() {
    const response = await this.api.get('/chat/history');
    return response.data;
  }

  // User endpoints
  async getUserUsage() {
    const response = await this.api.get('/user/usage');
    return response.data;
  }

  async updateUserProfile(data: any) {
    const response = await this.api.patch('/user/profile', data);
    return response.data;
  }

  // Admin endpoints
  async getUsers(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    const response = await this.api.get(`/admin/users?${params}`);
    return response.data;
  }

  async updateUser(userId: string, data: any) {
    const response = await this.api.patch(`/admin/users/${userId}`, data);
    return response.data;
  }

  async deleteUser(userId: string) {
    const response = await this.api.delete(`/admin/users/${userId}`);
    return response.data;
  }

  async getSystemLogs(page = 1, limit = 50, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    const response = await this.api.get(`/admin/logs?${params}`);
    return response.data;
  }

  async getSystemConfig() {
    const response = await this.api.get('/admin/config');
    return response.data;
  }

  async updateSystemConfig(config: any) {
    const response = await this.api.patch('/admin/config', config);
    return response.data;
  }
}

export const apiService = new ApiService();