import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const cliService = {
  async executeCommand(command, cwd = null) {
    try {
      const response = await axios.post(
        `${API_URL}/api/cli/execute`,
        { command, cwd },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('mvc_token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error executing command:', error);
      throw error;
    }
  },

  async initProject() {
    return this.executeCommand('puf init');
  },

  async addModel(modelPath, version) {
    return this.executeCommand(`puf add ${modelPath} -v ${version}`);
  },

  async commit(message) {
    return this.executeCommand(`puf commit -m "${message}"`);
  },

  async push() {
    return this.executeCommand('puf push');
  },

  async pull() {
    return this.executeCommand('puf pull');
  },

  async status() {
    return this.executeCommand('puf status');
  },

  async log() {
    return this.executeCommand('puf log');
  },

  async branch(name) {
    return this.executeCommand(`puf branch ${name}`);
  },

  async checkout(branch) {
    return this.executeCommand(`puf checkout ${branch}`);
  },

  async merge(sourceBranch) {
    return this.executeCommand(`puf merge ${sourceBranch}`);
  },

  async compareVersions(v1, v2) {
    return this.executeCommand(`puf compare ${v1} ${v2}`);
  }
};

export default cliService;
