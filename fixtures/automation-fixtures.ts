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
  setLumaReverseHandoffRequest,
} from "../clients/customers";
import { LoginPage } from "../tests/playwright/pages/login.page";
import { NavigationDrawer } from "../tests/playwright/pages/navigationDrawer.page";
import { CustomersListPage } from "../tests/playwright/pages/customersList.page";
import { MyNotesDashboardPage } from "../tests/playwright/pages/myNotesDashboard.page";
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
  setLumaReverseHandoffRequest: typeof setLumaReverseHandoffRequest;
  extractCustomerIdFromUrl: (page: Page) => Promise<string>;
  extractLocationIdFromUrl: (page: Page) => Promise<string>;
  loginPage: LoginPage;
  navigationDrawer: NavigationDrawer;
  customersListPage: CustomersListPage;
  myNotesDashboardPage: MyNotesDashboardPage;
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
      const authFile = "auth/mainAccountSetup.json";
      const getTokenFromFile = (parsedJson: any): string => {
        const storageStateToken = parsedJson.origins?.find(
          (o: any) => o.origin === "https://api.dev.tbd.com"
        )?.localStorage[0]?.value;

        const token = storageStateToken || parsedJson.accessToken;
        return token;
      };

      const content = await fs.readFile(authFile, "utf-8");
      const parsedJson = JSON.parse(content);
      const token = getTokenFromFile(parsedJson);

      const apiContext = await playwright.request.newContext({
        baseURL: "https://api.dev.tbd.com",
        extraHTTPHeaders: {
          Authorization: `Bearer ${token}`,
        },
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

  setLumaReverseHandoffRequest: [
    async ({}, use) => {
      await use(setLumaReverseHandoffRequest);
    },
    { scope: "worker" },
  ],

  extractCustomerIdFromUrl: [
    async ({}, use) => {
      const extractFunc = async (page: Page): Promise<string> => {
        await page.waitForURL("**/dashboard", { timeout: 2000 });
        const url = page.url();
        const match = url.match(/customers\/([a-f0-9]+)/);
        expect(
          match,
          `Could not find customer ID pattern in URL: ${url}`
        ).not.toBeNull();
        const customerId = match![1];
        expect(
          customerId,
          "Extracted customerId was null or empty"
        ).toBeTruthy();
        return customerId;
      };
      await use(extractFunc);
    },
    { scope: "worker" },
  ],

  extractLocationIdFromUrl: [
    async ({}, use) => {
      const extractFunc = async (page: Page): Promise<string> => {
        await page.waitForURL("**/dashboard", { timeout: 2000 });
        const url = page.url();
        const match = url.match(/customers\/[a-f0-9]+\/([a-f0-9]+)/);
        expect(
          match,
          `Could not find location ID pattern in URL: ${url}`
        ).not.toBeNull();
        const locationId = match![1];
        expect(
          locationId,
          "Extracted locationId was null or empty"
        ).toBeTruthy();
        return locationId;
      };
      await use(extractFunc);
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

  axeBuilder: async ({ page }, use) => {
    const axeBuilder = new AxeBuilder({ page });
    await use(axeBuilder);
  },
  loginPage: async ({ page, isMobile }, use) => {
    await use(new LoginPage(page, isMobile));
  },
  navigationDrawer: async ({ page, isMobile }, use) => {
    await use(new NavigationDrawer(page, isMobile));
  },
  customersListPage: async ({ page, isMobile }, use) => {
    await use(new CustomersListPage(page, isMobile));
  },
  myNotesDashboardPage: async ({ page, isMobile }, use) => {
    await use(new MyNotesDashboardPage(page, isMobile));
  },
  modalsPage: async ({ page, isMobile }, use) => {
    await use(new ModalsPage(page, isMobile));
  },
});

export { expect, asUser };
export type { UserRole };
