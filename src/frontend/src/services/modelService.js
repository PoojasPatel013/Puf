import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const modelService = {
  async getModels() {
    try {
      const response = await axios.get(`${API_URL}/api/models`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  },

  async getModel(version) {
    try {
      const response = await axios.get(`${API_URL}/api/models/${version}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching model:', error);
      throw error;
    }
  },

  async getModelInfo(version) {
    try {
      const response = await axios.get(`${API_URL}/api/models/${version}/info`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching model info:', error);
      throw error;
    }
  },

  async getModelMetrics(version) {
    try {
      const response = await axios.get(`${API_URL}/api/models/${version}/metrics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching model metrics:', error);
      throw error;
    }
  },

  async getModelPerformance(version) {
    try {
      const response = await axios.get(`${API_URL}/api/models/${version}/performance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching model performance:', error);
      throw error;
    }
  },

  async uploadModel(file, version, description) {
    const formData = new FormData();
    formData.append('model_file', file);
    if (version) formData.append('version', version);
    if (description) formData.append('description', description);

    try {
      const response = await axios.post(`${API_URL}/api/models/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading model:', error);
      throw error;
    }
  },

  async deleteModel(version) {
    try {
      const response = await axios.delete(`${API_URL}/api/models/${version}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting model:', error);
      throw error;
    }
  },

  async compareVersions(version1, version2) {
    try {
      const response = await axios.get(`${API_URL}/api/models/compare/${version1}/${version2}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error comparing versions:', error);
      throw error;
    }
  },

  async createPullRequest(version, title, description) {
    try {
      const response = await axios.post(`${API_URL}/api/models/${version}/pull-requests`, {
        title,
        description
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating pull request:', error);
      throw error;
    }
  },

  async listPullRequests(version) {
    try {
      const response = await axios.get(`${API_URL}/api/models/${version}/pull-requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error listing pull requests:', error);
      throw error;
    }
  },

  async mergePullRequest(version, prId) {
    try {
      const response = await axios.post(`${API_URL}/api/models/${version}/pull-requests/${prId}/merge`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error merging pull request:', error);
      throw error;
    }
  },

  async getTeams() {
    try {
      const response = await axios.get(`${API_URL}/api/teams`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },

  async createTeam(name) {
    try {
      const response = await axios.post(`${API_URL}/api/teams`, { name }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  },

  async deleteTeam(teamId) {
    try {
      const response = await axios.delete(`${API_URL}/api/teams/${teamId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  },

  async updateTeam(teamId, data) {
    try {
      const response = await axios.put(`${API_URL}/api/teams/${teamId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  },

  async getTeamMembers(teamId) {
    try {
      const response = await axios.get(`${API_URL}/api/teams/${teamId}/members`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  async addTeamMember(teamId, userId) {
    try {
      const response = await axios.post(`${API_URL}/api/teams/${teamId}/members`, { userId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  },

  async removeTeamMember(teamId, userId) {
    try {
      const response = await axios.delete(`${API_URL}/api/teams/${teamId}/members/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing team member:', error);
      throw error;
    }
  },

  async getRepositories() {
    try {
      const response = await axios.get(`${API_URL}/api/repositories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  },

  async createRepository(name) {
    try {
      const response = await axios.post(`${API_URL}/api/repositories`, { name }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating repository:', error);
      throw error;
    }
  },

  async deleteRepository(repoId) {
    try {
      const response = await axios.delete(`${API_URL}/api/repositories/${repoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting repository:', error);
      throw error;
    }
  },

  async getRepository(repoName) {
    try {
      const response = await axios.get(`${API_URL}/api/repositories/${repoName}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching repository:', error);
      throw error;
    }
  },

  async updateRepository(repoId, data) {
    try {
      const response = await axios.put(`${API_URL}/api/repositories/${repoId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating repository:', error);
      throw error;
    }
  },

  async getRepositoryModels(repoName) {
    try {
      const response = await axios.get(`${API_URL}/api/repositories/${repoName}/models`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching repository models:', error);
      throw error;
    }
  },

  async addStar(repoName) {
    try {
      const response = await axios.post(`${API_URL}/api/repositories/${repoName}/star`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding star:', error);
      throw error;
    }
  },

  async removeStar(repoName) {
    try {
      const response = await axios.delete(`${API_URL}/api/repositories/${repoName}/star`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing star:', error);
      throw error;
    }
  },

  async getStarredItems() {
    try {
      const response = await axios.get(`${API_URL}/api/starred`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching starred items:', error);
      throw error;
    }
  },

  async starRepository(repoName) {
    try {
      const response = await axios.post(`${API_URL}/api/repositories/${repoName}/star`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error starring repository:', error);
      throw error;
    }
  },

  async unstarRepository(repoName) {
    try {
      const response = await axios.delete(`${API_URL}/api/repositories/${repoName}/star`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error unstarring repository:', error);
      throw error;
    }
  },

  async starModel(modelId) {
    try {
      const response = await axios.post(`${API_URL}/api/models/${modelId}/star`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error starring model:', error);
      throw error;
    }
  },

  async unstarModel(modelId) {
    try {
      const response = await axios.delete(`${API_URL}/api/models/${modelId}/star`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error unstarring model:', error);
      throw error;
    }
  },

  async isStarred(type, id) {
    try {
      const response = await axios.get(`${API_URL}/api/starred/${type}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking star status:', error);
      throw error;
    }
  },

  async executeCommand(command) {
    try {
      const response = await axios.post(`${API_URL}/api/cli/execute`, {
        command,
        cwd: null // Will be set to user's directory in backend
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error executing command:', error);
      throw error;
    }
  }
};

export default modelService;
