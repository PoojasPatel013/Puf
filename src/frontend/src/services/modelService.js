import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const modelService = {
  async uploadModel(file, version, description) {
    const formData = new FormData();
    formData.append('model_file', file);
    if (version) formData.append('version', version);
    if (description) formData.append('description', description);

    const response = await axios.post(`${API_URL}/api/models/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getModels() {
    const response = await axios.get(`${API_URL}/api/models`);
    return response.data;
  },

  async getModel(version) {
    const response = await axios.get(`${API_URL}/api/models/${version}`);
    return response.data;
  },

  async listVersions() {
    try {
      const response = await axios.get(`${API_URL}/api/models`);
      return response.data;
    } catch (error) {
      console.error('Error fetching model versions:', error);
      throw error;
    }
  },

  async deleteModel(version) {
    const response = await axios.delete(`${API_URL}/api/models/${version}`);
    return response.data;
  },

  async compareVersions(version1, version2) {
    const response = await axios.get(`${API_URL}/api/models/compare`, {
      params: { v1: version1, v2: version2 },
    });
    return response.data;
  },
};

// Add auth token to requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('mvc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { modelService };
