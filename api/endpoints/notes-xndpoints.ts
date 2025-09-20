export const NOTES_ENDPOINTS = {
  GET_ALL: "/notes/api/notes",
  CREATE: "/notes/api/notes",
  DELETE: (noteId: string) => `/notes/api/notes/${noteId}`,
} as const;
