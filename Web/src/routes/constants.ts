export const ROUTES = {
  HOME: '/',
  NOTES: '/notes',
  NEW_NOTE: '/notes/new',
  NOTE_DETAIL: '/notes/:id',
  EDIT_NOTE: '/notes/:id/edit',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

export const getNoteDetailPath = (id: string) => `/notes/${id}`;
export const getEditNotePath = (id: string) => `/notes/${id}/edit`;
