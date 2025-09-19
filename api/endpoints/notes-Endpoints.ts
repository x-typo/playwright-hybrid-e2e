export const NOTES_ENDPOINTS = {
  CREATE: "/notes/api/notes",
  DELETE: (noteId: string) => `/notes/api/notes/${noteId}`,
} as const;
