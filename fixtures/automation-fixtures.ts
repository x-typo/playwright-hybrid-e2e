import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { asUser, UserRole } from "../auth/authManager";
import { test as base, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { NotesClient } from "../api/clients/notes.client";
import { ApiClientFactory } from "../api/clients/api-client-factory";
import { HealthApiClient } from "../api/clients/health.api-client";
import { PageFactory } from "../tests/playwright/pages/page-Factory.page";
import { BasePage } from "../tests/playwright/pages/base.page";
import { LoginPage } from "../tests/playwright/pages/login.page";
import { NotesDashboardPage } from "../tests/playwright/pages/notes-dashboard.page";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load API token from storage state
const storageStatePath = path.resolve(
  __dirname,
  "../auth/storageStates/mainAccountSetup.json"
);
if (fs.existsSync(storageStatePath)) {
  const storageState = JSON.parse(fs.readFileSync(storageStatePath, "utf-8"));
  const apiOrigin = process.env.API_BASE_URL!;
  const token = storageState.origins
    ?.find((o: any) => o.origin === apiOrigin)
    ?.localStorage.find((l: any) => l.name === "token")?.value;

  if (token) {
    process.env.API_TOKEN = token;
  }
}

// Domains to block in UI tests
const blockedDomains = [
  "https://www.googleadservices.com",
  "https://pagead2.googlesyndication.com",
  "https://googleads.g.doubleclick.net",
  "https://www.google.com",
  "https://tpc.googlesyndication.com",
];

type AutomationFixtures = {
  // Utilities
  readFile: (path: string) => Promise<string>;
  generateRandomText: (length?: number) => string;
  performAccessibilityScan: () => Promise<any>;

  // API
  notesClient: NotesClient;
  apiClientFactory: typeof ApiClientFactory;
  healthClient: HealthApiClient;

  // Pages
  pageFactory: PageFactory;
  basePage: BasePage;
  loginPage: LoginPage;
  notesDashboardPage: NotesDashboardPage;
};

export const test = base.extend<AutomationFixtures>({
  // Ads block setup
  context: async ({ context }, use) => {
    await context.route("**/*", (route) => {
      const url = route.request().url();
      blockedDomains.some((domain) => url.startsWith(domain))
        ? route.abort()
        : route.continue();
    });
    await use(context);
  },

  // Utilities
  readFile: async ({}, use) => {
    await use((path: string) => fs.promises.readFile(path, "utf-8"));
  },
  generateRandomText: async ({}, use) => {
    await use((length = 10) => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      return Array.from({ length }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("");
    });
  },

  // --- API ---
  apiClientFactory: async ({}, use) => {
    await use(ApiClientFactory);
  },
  healthClient: async ({}, use) => {
    await use(await ApiClientFactory.getHealthClient());
  },
  notesClient: async ({}, use) => {
    await use(await ApiClientFactory.getNotesClient());
  },

  // --- Pages ---
  pageFactory: async ({ page, isMobile }, use) => {
    await use(new PageFactory(page, isMobile));
  },
  basePage: async ({ page, isMobile }, use) => {
    await use(new BasePage(page, isMobile));
  },
  loginPage: async ({ pageFactory }, use) => {
    await use(pageFactory.getLoginPage());
  },
  notesDashboardPage: async ({ pageFactory }, use) => {
    await use(pageFactory.getNotesDashboardPage());
  },

  // Accessibility tools (optional)
  // performAccessibilityScan: async ({ axeBuilder }, use) => { ... }
  // axeBuilder: async ({ page }, use) => { ... }
});

export { expect, asUser };
export type { UserRole };
