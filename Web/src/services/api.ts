import axios from 'axios';
import { StudyNote } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
