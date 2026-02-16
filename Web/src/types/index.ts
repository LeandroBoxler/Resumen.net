export interface StudyNote {
  id: string;
  name: string;
  description: string;
  pdfLink: string;
  userId: string
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

export interface SecureUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  favorites: unknown[]
  createdNotes: StudyNote[]
}