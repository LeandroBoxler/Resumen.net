export interface StudyNote {
  id: string;
  name: string;
  description: string;
  pdfLink: string;
  userId: string;
}

export type StudyNotePayload = Omit<StudyNote, 'id' | "userId">;



export interface UserFavorite {
  id: string;
  userId: string;
  noteId: string;
  studyNote: StudyNote;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileRequest {
  email: string;
  firstName: string;
  lastName: string;
}

export interface SecureUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  favorites: UserFavorite[];
  createdNotes: StudyNote[];
}