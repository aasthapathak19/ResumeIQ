const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  auth: {
    register: async (data: any) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return res.json();
    },
    login: async (data: any) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return res.json();
    },
    me: async () => {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getHeaders(),
      });
      return res.json();
    }
  },
  resumes: {
    upload: async (formData: FormData) => {
      // FormData doesn't need Content-Type header, fetch sets it automatically with boundary
      const token = localStorage.getItem('token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/resumes/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });
      return res.json();
    },
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/resumes`, {
        headers: getHeaders(),
      });
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        headers: getHeaders(),
      });
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return res.json();
    }
  },
  ai: {
    getAnalysis: async (resumeId: string) => {
      const res = await fetch(`${API_BASE_URL}/ai/analysis/${resumeId}`, {
        headers: getHeaders(),
      });
      return res.json();
    }
  }
};
