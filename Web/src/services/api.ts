import axios from 'axios';
import { LoginRequest, RegisterRequest, SecureUser, StudyNote, StudyNotePayload, UpdateProfileRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TOKEN_KEY = "token"


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY); 
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: LoginRequest): Promise<string | null> => {
    const response = await apiClient.post<string>('/api/auth/login', credentials);
    const token = response.data;
    if (response.status !== 200) {
      return null
    }
    localStorage.setItem(TOKEN_KEY, token);
    return token
  },
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  register: async (credentials: RegisterRequest): Promise<boolean> => {
    const response = await apiClient.post<StudyNote>('/api/auth/register', credentials);
    return response.status === 200;
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },
  getProfile: async (): Promise<SecureUser | null> => {
    const response = await apiClient.post('/api/auth/profile');
    if (response.status !== 200) {
      return null;
    }
    return response.data;
  },
  updateProfile: async (data: UpdateProfileRequest): Promise<SecureUser | null> => {
    const response = await apiClient.put('/api/auth/profile', data);
    if (response.status !== 200) {
      return null;
    }
    return response.data;
  }
}

export const fileService = {
  upload: async (file: File): Promise<string | null> => {
    console.log("Uploading file:", file);
    const fileType = file.type
    const {data: apiRes } = await apiClient.post<{url:string}>('/api/presigned', { fileName: file.name, contentType: fileType });
    const presignedUrl = apiRes.url;
    const result = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": fileType
      }
    });

    if (result.status !== 200) {
      return null;
    }
    const uri = new URL(presignedUrl); 
    return `${uri.protocol}//${uri.host}${uri.pathname}`;
  }
}

export const studyNoteService = {
  getAll: async (): Promise<StudyNote[]> => {
    const response = await apiClient.get<StudyNote[]>('/api/notes');
    return response.data;
  },

  getById: async (id: string): Promise<StudyNote> => {
    const response = await apiClient.get<StudyNote>(`/api/notes/${id}`);
    return response.data;
  },

  create: async (studyNote: StudyNotePayload): Promise<StudyNote> => {
    const response = await apiClient.post<StudyNote>('/api/notes', studyNote);
    return response.data;
  },

  update: async (id: string, studyNote: StudyNotePayload): Promise<StudyNote> => {
    const response = await apiClient.put<StudyNote>(`/api/notes/${id}`, studyNote);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/notes/${id}`);
  },

};

export const favoritesService = {
  getUserFavorites: async (): Promise<{ id: string; noteId: string }[]> => {
    const response = await apiClient.get('/api/user/favorites');
    return response.data;
  },

  addFavorite: async (noteId: string): Promise<void> => {
    await apiClient.post(`/api/user/favorites/${noteId}`);
  },

  removeFavorite: async (noteId: string): Promise<void> => {
    await apiClient.delete(`/api/user/favorites/${noteId}`);
  },
};

export default apiClient;

