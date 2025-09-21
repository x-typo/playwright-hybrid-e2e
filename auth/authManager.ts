import path from "path";
import { fileURLToPath } from "url";

export type UserRole = "main" | "guest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authFiles: Record<Exclude<UserRole, "guest">, string> = {
  main: path.resolve(__dirname, "storageStates/mainAccountSetup.json"),
};

/**
 * Returns the storageState config for a given user role.
 * - "main": loads pre-authenticated state from file
 * - "guest": starts with a completely blank state
 */
export function asUser(user: UserRole) {
  if (user === "guest") {
    return { storageState: { cookies: [], origins: [] } };
  }
  return { storageState: authFiles[user] };
}
