import fs from "fs/promises";
import { asUser, UserRole } from "../auth/authManager";
import {
  test as base,
  expect,
  Page,
  APIRequestContext,
} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  addCustomerAPI,
  editCustomerAPI,
  deleteCustomerAPI,
  toggleCustomerNotificationAPI,
  addLocationAPI,
  deleteLocationAPI,
  toggleLocationNotifications,
} from "../api/clients/customers";
import { NotesClient } from "../api/clients/notes.client";
import { PageFactory } from "../tests/playwright/pages/page-Factory.page";
import { BasePage } from "../tests/playwright/pages/base.page";
import { LoginPage } from "../tests/playwright/pages/login.page";
import { NotesDashboardPage } from "../tests/playwright/pages/notes-dashboard.page";
import { ModalsPage } from "../tests/playwright/pages/modals.page";

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
  addCustomerAPI: typeof addCustomerAPI;
  editCustomerAPI: typeof editCustomerAPI;
  deleteCustomerAPI: typeof deleteCustomerAPI;
  toggleCustomerNotificationAPI: typeof toggleCustomerNotificationAPI;
  addLocationAPI: typeof addLocationAPI;
  deleteLocationAPI: typeof deleteLocationAPI;
  toggleLocationNotifications: typeof toggleLocationNotifications;
  notesClient: NotesClient;
  pageFactory: PageFactory;
  basePage: BasePage;
  loginPage: LoginPage;
  notesDashboardPage: NotesDashboardPage;
  modalsPage: ModalsPage;
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
      return await fs.readFile(path, "utf-8");
    }
    await use(readFile);
  },

  apiClient: [
    async ({ playwright }, use) => {
      const authFile = "auth/storageStates/mainAccountSetup.json";
      const apiContext = await playwright.request.newContext({
        baseURL: "https://practice.expandtesting.com",
        storageState: authFile,
      });

      await use(apiContext);
      await apiContext.dispose();
    },
    { scope: "worker" },
  ],

  addCustomerAPI: [
    async ({}, use) => {
      await use(addCustomerAPI);
    },
    { scope: "worker" },
  ],
  editCustomerAPI: [
    async ({}, use) => {
      await use(editCustomerAPI);
    },
    { scope: "worker" },
  ],
  deleteCustomerAPI: [
    async ({}, use) => {
      await use(deleteCustomerAPI);
    },
    { scope: "worker" },
  ],
  toggleCustomerNotificationAPI: [
    async ({}, use) => {
      await use(toggleCustomerNotificationAPI);
    },
    { scope: "worker" },
  ],
  addLocationAPI: [
    async ({}, use) => {
      await use(addLocationAPI);
    },
    { scope: "worker" },
  ],
  deleteLocationAPI: [
    async ({}, use) => {
      await use(deleteLocationAPI);
    },
    { scope: "worker" },
  ],
  toggleLocationNotifications: [
    async ({}, use) => {
      await use(toggleLocationNotifications);
    },
    { scope: "worker" },
  ],

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
  notesClient: async ({ apiClient }, use) => {
    await use(new NotesClient(apiClient));
  },

  // Accessibility tooling
  axeBuilder: async ({ page }, use) => {
    const axeBuilder = new AxeBuilder({ page });
    await use(axeBuilder);
  },
});

export { expect, asUser };
export type { UserRole };
