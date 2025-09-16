export const API_ENDPOINTS = {
  health: {
    check: "/health-check",
  },
  user: {
    login: "/users/login",
    logout: "/users/logout",
    profile: "/users/profile",
  },
  notes: {
    deleteById: (noteId: string) => "/notes/${noteId}",
  },
} as const;
