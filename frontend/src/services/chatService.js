/**
 * Chat Service
 * API calls for medical chatbot functionality
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const chatService = {
  /**
   * Send a message to the chatbot
   */
  async sendMessage(question) {
    try {
      const response = await api.post('/chat/medical/', { question });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.detail || 'Failed to send message',
        status: error.response?.status,
      };
    }
  },

  /**
   * Get chat history
   */
  async getChatHistory() {
    try {
      const response = await api.get('/chat/history/');
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.detail || 'Failed to load chat history',
        status: error.response?.status,
      };
    }
  },

  /**
   * Clear chat history
   */
  async clearChatHistory() {
    try {
      const response = await api.delete('/chat/history/clear/');
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.detail || 'Failed to clear chat history',
        status: error.response?.status,
      };
    }
  },

  /**
   * Check chatbot service health
   */
  async checkHealth() {
    try {
      const response = await api.get('/chat/health/');
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.detail || 'Failed to check service health',
        status: error.response?.status,
      };
    }
  },
};

export default chatService;
