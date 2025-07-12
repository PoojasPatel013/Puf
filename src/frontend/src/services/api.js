import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mvc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class AuthService {
  async login(credentials) {
    try {
      const response = await api.post('/login', {
        username: credentials.username,
        password: credentials.password,
      });

      localStorage.setItem('mvc_token', response.data.access_token);
      localStorage.setItem('mvc_user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      throw new Error(error.response?.data?.detail || 'Failed to login');
    }
  }

  async register(userData) {
    try {
      // Remove confirmPassword if it exists
      const { confirmPassword, ...userDataToSend } = userData;
      
      const response = await api.post('/register', userDataToSend);
      localStorage.setItem('mvc_token', response.data.access_token);
      localStorage.setItem('mvc_user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      throw new Error(error.response?.data?.detail || 'Failed to register');
    }
  }

  async getCurrentUser() {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error.response?.data);
      throw new Error(error.response?.data?.detail || 'Failed to get user info');
    }
  }

  logout() {
    localStorage.removeItem('mvc_token');
    localStorage.removeItem('mvc_user');
  }
}

export const authService = new AuthService();

// Model services
export const modelService = {
  async getModels() {
    const response = await api.get('/models');
    return await response.data;
  },

  async getModelVersions(modelId) {
    const response = await api.get(`/models/${modelId}/versions`);
    return await response.data;
  },

  async uploadModel(formData) {
    const response = await api.post('/models/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getModelStats() {
    const response = await api.get('/models/stats');
    return response.data;
  },

  async getModelPerformance(modelId) {
    const response = await api.get(`/models/${modelId}/performance`);
    return response.data;
  },
};

export default api;
