export const API_ENDPOINTS = {
  health: {
    check: "/notes/api/health-check",
  },
  user: {
    login: "/notes/api/users/login",
    logout: "/notes/api/users/logout",
    profile: "/notes/api/users/profile",
  },
  notes: {
    create: "/notes/api/notes",
    delete: (noteId: string) => `/notes/api/notes/${noteId}`,
  },
} as const;
