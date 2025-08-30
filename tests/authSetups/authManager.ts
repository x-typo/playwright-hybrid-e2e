export type UserRole = "main" | "guest";

const authFiles: Record<string, string> = {
  main: "playwright/auth/mainAccountSetup.json",
};

/**
 * Returns the storageState object for a given user role.
 * @param user - The user role to get the storage state for.
 */
export function asUser(user: UserRole): {
  storageState: string | { cookies: []; origins: [] };
} {
  if (user === "guest") {
    return {
      storageState: { cookies: [], origins: [] },
    };
  }

  return {
    storageState: authFiles[user],
  };
}
