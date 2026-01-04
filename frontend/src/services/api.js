const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth endpoints
  async signup(email, password, codeforcesHandle) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, codeforces_handle: codeforcesHandle }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // POTD endpoints
  async getTodayPOTD() {
    return this.request('/potd/today');
  }

  async getPOTDByDate(date) {
    return this.request(`/potd/date/${date}`);
  }

  async getPastPOTDs(limit = 10) {
    return this.request(`/potd/past?limit=${limit}`);
  }

  // Progress endpoints
  async getProgressForDate(date) {
    return this.request(`/progress/date/${date}`);
  }

  async getProgressForRange(from, to) {
    return this.request(`/progress/range?from=${from}&to=${to}`);
  }

  async syncProgress(date = null) {
    return this.request('/progress/sync', {
      method: 'POST',
      body: JSON.stringify(date ? { date } : {}),
    });
  }

  // Heatmap endpoint
  async getHeatmap(from, to, refresh = false) {
    return this.request(`/heatmap?from=${from}&to=${to}${refresh ? '&refresh=true' : ''}`);
  }

  // Profile endpoints
  async getProfile() {
    return this.request('/profile');
  }

  async updateProfile(updates) {
    return this.request('/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }
}

export default new ApiService();

