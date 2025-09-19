import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { asUser, UserRole } from "../auth/authManager";
import {
  test as base,
  expect,
  Page,
  APIRequestContext,
} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { NotesClient } from "../api/clients/notes.client";
import { ApiClientFactory } from "../api/clients/api-client-factory";
import { HealthApiClient } from "../api/clients/health.api-client";
import { PageFactory } from "../tests/playwright/pages/page-Factory.page";
import { BasePage } from "../tests/playwright/pages/base.page";
import { LoginPage } from "../tests/playwright/pages/login.page";
import { NotesDashboardPage } from "../tests/playwright/pages/notes-dashboard.page";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiEnvPath = path.resolve(__dirname, "../auth/api-env.json");
if (fs.existsSync(apiEnvPath)) {
  const { API_TOKEN, API_BASE_URL } = JSON.parse(
    fs.readFileSync(apiEnvPath, "utf-8")
  );
  process.env.API_TOKEN = API_TOKEN;
  process.env.API_BASE_URL = API_BASE_URL;
}

const blockedDomains = [
  "https://www.googleadservices.com",
  "https://pagead2.googlesyndication.com",
  "https://googleads.g.doubleclick.net",
  "https://www.google.com",
  "https://tpc.googlesyndication.com",
];

type AutomationFixtures = {
  readFile: (path: string) => Promise<string>;
  generateRandomText: (length?: number) => string;
  axeBuilder: AxeBuilder;
  apiClient: APIRequestContext;
  notesClient: NotesClient;
  apiClientFactory: typeof ApiClientFactory;
  healthClient: HealthApiClient;
  pageFactory: PageFactory;
  basePage: BasePage;
  loginPage: LoginPage;
  notesDashboardPage: NotesDashboardPage;
  performAccessibilityScan: () => Promise<any>;
};

export const test = base.extend<AutomationFixtures>({
  context: async ({ context }, use) => {
    await context.route("**/*", (route) => {
      const url = route.request().url();
      if (blockedDomains.some((domain) => url.startsWith(domain))) {
        route.abort();
      } else {
        route.continue();
      }
    });
    await use(context);
  },

  readFile: async ({}, use) => {
    async function readFile(path: string): Promise<string> {
      return await fs.promises.readFile(path, "utf-8");
    }
    await use(readFile);
  },

  generateRandomText: async ({}, use) => {
    function generateRandomText(length = 10): string {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    }
    await use(generateRandomText);
  },

  performAccessibilityScan: async ({ axeBuilder }, use) => {
    const performAccessibilityScan = async () => {
      const accessibilityScanResults = await axeBuilder
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag143"])
        .analyze();

      const seriousToCriticalViolations =
        accessibilityScanResults.violations.filter(
          ({ impact }) => impact === "critical" || impact === "serious"
        );

      const readableResults = seriousToCriticalViolations.map((result) => {
        return {
          description: result.description,
          nodes: result.nodes.map((node) => ({
            html: node.html,
            target: node.target,
          })),
        };
      });

      return JSON.stringify(readableResults, null, 2);
    };

    await use(performAccessibilityScan);
  },

  apiClientFactory: async ({}, use) => {
    await use(ApiClientFactory);
  },
  healthClient: async ({}, use) => {
    const client = await ApiClientFactory.getHealthClient();
    await use(client);
  },
  notesClient: async ({}, use) => {
    const client = await ApiClientFactory.getNotesClient();
    await use(client);
  },
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

  axeBuilder: async ({ page }, use) => {
    const axeBuilder = new AxeBuilder({ page });
    await use(axeBuilder);
  },
});

export { expect, asUser };
export type { UserRole };
