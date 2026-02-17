export const ROUTES = {
  NOTES: '/',
  NEW_NOTE: '/notes/new',
  NOTE_DETAIL: '/notes/:id',
  EDIT_NOTE: '/notes/:id/edit',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  EDIT_PROFILE: '/profile/edit',
} as const;

export const getNoteDetailPath = (id: string) => `/notes/${id}`;
export const getEditNotePath = (id: string) => `/notes/${id}/edit`;
