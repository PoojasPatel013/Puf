import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class AuthService {
  async login(credentials) {
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Login error:', error);
        throw new Error(error.detail || error.message || 'Failed to login');
      }

      const data = await response.json();
      localStorage.setItem('mvc_token', data.access_token);
      localStorage.setItem('mvc_user', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      throw error;
    }
  }

  async register(userData) {
    try {
      // Remove confirmPassword if it exists
      const { confirmPassword, ...userDataToSend } = userData;
      
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataToSend),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Registration error:', error);
        throw new Error(error.detail || error.message || 'Failed to register');
      }

      const data = await response.json();
      localStorage.setItem('mvc_token', data.access_token);
      localStorage.setItem('mvc_user', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('mvc_token');
      if (!token) {
        return null;
      }

      const response = await fetch(`${API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      this.logout();
      return null;
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
    const response = await fetch(`${API_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('mvc_token')}`,
      },
    });
    return await response.json();
  },

  async getModelVersions(modelId) {
    const response = await fetch(`${API_URL}/models/${modelId}/versions`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('mvc_token')}`,
      },
    });
    return await response.json();
    return response.data;
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
