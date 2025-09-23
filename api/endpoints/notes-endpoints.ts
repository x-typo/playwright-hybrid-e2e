const BASE = "/notes/api/notes";

export const NOTES_ENDPOINTS = {
  BASE,
  BY_ID: (noteId: string) => `${BASE}/${noteId}`,
} as const;
