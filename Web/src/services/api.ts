import axios from 'axios';
import { LoginRequest, RegisterRequest, StudyNote } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TOKEN_KEY = "token"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY); // O donde guardes el JWT
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: LoginRequest): Promise<boolean> => {
    const response = await apiClient.post<string>('/api/auth/login', credentials);
    if (response.status !== 200) {
      return false
    }
    localStorage.setItem(TOKEN_KEY, response.data);
    return true
  },
  register: async (credentials: RegisterRequest): Promise<boolean> => {
    const response = await apiClient.post<StudyNote>('/api/auth/register', credentials);
    return response.status === 200;
  },
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

  create: async (studyNote: Omit<StudyNote, 'id'>): Promise<StudyNote> => {
    const response = await apiClient.post<StudyNote>('/api/notes', studyNote);
    return response.data;
  },

  update: async (id: string, studyNote: StudyNote): Promise<StudyNote> => {
    const response = await apiClient.put<StudyNote>(`/api/notes/${id}`, studyNote);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/notes/${id}`);
  },
};

export default apiClient;
