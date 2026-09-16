import { User, Resume, Analysis, AuthResponse } from '~/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic request wrapper
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorData.message || errorMsg;
    } catch (e) {
      // Ignore if not json
    }
    throw new Error(errorMsg);
  }
  
  return response.json();
}

export const api = {
  auth: {
    register: (data: any): Promise<AuthResponse> => 
      request<AuthResponse>(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      }),
    login: (data: any): Promise<AuthResponse> => 
      request<AuthResponse>(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      }),
    me: (): Promise<User> => 
      request<User>(`${API_BASE_URL}/auth/me`, {
        headers: getHeaders(),
      })
  },
  resumes: {
    upload: (formData: FormData): Promise<{ message: string; resume: Resume }> => 
      request<{ message: string; resume: Resume }>(`${API_BASE_URL}/resumes/upload`, {
        method: 'POST',
        headers: getHeaders(true),
        body: formData,
      }),
    getAll: (): Promise<Resume[]> => 
      request<Resume[]>(`${API_BASE_URL}/resumes`, {
        headers: getHeaders(),
      }),
    getById: (id: string): Promise<Resume> => 
      request<Resume>(`${API_BASE_URL}/resumes/${id}`, {
        headers: getHeaders(),
      }),
    getFile: async (id: string): Promise<Blob> => {
      const res = await fetch(`${API_BASE_URL}/resumes/${id}/file`, { headers: getHeaders(true) });
      if (!res.ok) throw new Error('Failed to fetch file');
      return res.blob();
    },
    delete: (id: string): Promise<{ message: string }> => 
      request<{ message: string }>(`${API_BASE_URL}/resumes/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      })
  },
  ai: {
    getAnalysis: (resumeId: string): Promise<Analysis> => 
      request<Analysis>(`${API_BASE_URL}/ai/analysis/${resumeId}`, {
        headers: getHeaders(),
      })
  },
  share: {
    getSharedAnalysis: (token: string): Promise<{ resume: Resume, analysis: Analysis }> =>
      request<{ resume: Resume, analysis: Analysis }>(`${API_BASE_URL}/share/${token}`),
    getSharedFile: async (token: string): Promise<Blob> => {
      const res = await fetch(`${API_BASE_URL}/share/${token}/file`);
      if (!res.ok) throw new Error('Failed to fetch shared file');
      return res.blob();
    }
  }
};
