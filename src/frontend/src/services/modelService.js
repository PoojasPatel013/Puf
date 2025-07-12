import axios from 'axios';

const API_URL = 'http://localhost:8000';

class ModelService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Model Versions
  async uploadModel(file, version, description) {
    const formData = new FormData();
    formData.append('model_file', file);
    if (version) formData.append('version', version);
    if (description) formData.append('description', description);

    const response = await this.api.post('/models/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async listVersions() {
    const response = await this.api.get('/models/versions');
    return response.data;
  }

  async getModelInfo(version) {
    const response = await this.api.get(`/models/${version}`);
    return response.data;
  }

  // Model Comparisons
  async compareVersions(version1, version2) {
    const response = await this.api.get(`/models/compare`, {
      params: { version1, version2 },
    });
    return response.data;
  }

  // Model Analytics
  async getModelMetrics(version) {
    const response = await this.api.get(`/models/${version}/metrics`);
    return response.data;
  }

  async getModelPerformance(version) {
    const response = await this.api.get(`/models/${version}/performance`);
    return response.data;
  }

  // Model Repository
  async createRepository(name, description) {
    const response = await this.api.post('/repositories', {
      name,
      description,
    });
    return response.data;
  }

  async listRepositories() {
    const response = await this.api.get('/repositories');
    return response.data;
  }

  async getRepository(id) {
    const response = await this.api.get(`/repositories/${id}`);
    return response.data;
  }

  async updateRepository(id, data) {
    const response = await this.api.put(`/repositories/${id}`, data);
    return response.data;
  }
}

export const modelService = new ModelService();
