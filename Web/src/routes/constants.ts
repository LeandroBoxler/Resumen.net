export const ROUTES = {
  HOME: '/',
  NOTES: '/notes',
  NOTE_DETAIL: '/notes/:id',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

export const getNoteDetailPath = (id: string) => `/notes/${id}`;
