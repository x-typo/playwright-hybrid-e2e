import { chromium, request, expect, FullConfig } from "@playwright/test";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { USERS_ENDPOINTS } from "../../api/endpoints/users-endpoints";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to storage state file
const MainAccountFile = path.resolve(
  __dirname,
  "../storageStates/mainAccountSetup.json"
);

const baseURL = "https://practice.expandtesting.com";
const apiOrigin = `${baseURL}/notes/api`;

type MyStorageState = {
  cookies: {
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: "Strict" | "Lax" | "None";
  }[];
  origins: {
    origin: string;
    localStorage: { name: string; value: string }[];
  }[];
};

export default async function globalSetup(config: FullConfig) {
  // Early environment variable check
  const mainUsername = process.env.MAIN_USERNAME;
  const mainPassword = process.env.MAIN_PASSWORD;

  if (!mainUsername || !mainPassword) {
    throw new Error(
      "MAIN_USERNAME and MAIN_PASSWORD must be set before running tests."
    );
  }

  // Launch browser and create page
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Block ad/tracker domains before navigation
  const blockedDomains = [
    "https://www.googleadservices.com",
    "https://pagead2.googlesyndication.com",
    "https://googleads.g.doubleclick.net",
    "https://www.google.com",
    "https://tpc.googlesyndication.com",
  ];

  await page.context().route("**/*", (route) => {
    const url = route.request().url();
    if (blockedDomains.some((domain) => url.startsWith(domain))) {
      return route.abort();
    }
    return route.continue();
  });

  // Login via UI to get cookies and storageState
  await page.goto(`${baseURL}/notes/app/login`);
  await page.getByTestId("login-email").fill(mainUsername);
  await page.getByTestId("login-password").fill(mainPassword);

  await Promise.all([
    page.waitForURL("**/notes/app"),
    page.getByTestId("login-submit").click(),
  ]);

  await page.context().storageState({ path: MainAccountFile });
  await browser.close();

  // Login via API to get token
  const apiContext = await request.newContext({ baseURL });
  const response = await apiContext.post(USERS_ENDPOINTS.LOGIN, {
    data: { email: mainUsername, password: mainPassword },
    headers: { "User-Agent": "Mobile" },
  });

  expect(
    response.ok(),
    `API login failed with status ${response.status()}`
  ).toBe(true);

  const { data } = await response.json();
  const accessToken = data.token;

  // Make token & base URL available to ApiClientFactory
  process.env.API_TOKEN = accessToken;
  process.env.API_BASE_URL = apiOrigin;

  // Merge API token into storageState for UI context
  const storageState: MyStorageState = JSON.parse(
    await fs.readFile(MainAccountFile, "utf-8")
  );

  const existingOrigin = storageState.origins.find(
    (o) => o.origin === apiOrigin
  );

  if (existingOrigin) {
    existingOrigin.localStorage = [{ name: "token", value: accessToken }];
  } else {
    storageState.origins.push({
      origin: apiOrigin,
      localStorage: [{ name: "token", value: accessToken }],
    });
  }

  // Keep only auth/session cookies
  const authCookies = ["express:sess", "express:sess.sig", "io"];
  storageState.cookies = storageState.cookies.filter((cookie) =>
    authCookies.includes(cookie.name)
  );

  await fs.writeFile(MainAccountFile, JSON.stringify(storageState, null, 2));

  // Post-merge token verification
  const verifyContext = await request.newContext({
    baseURL: apiOrigin,
    extraHTTPHeaders: {
      "x-auth-token": accessToken,
    },
  });

  const verifyResponse = await verifyContext.get(USERS_ENDPOINTS.PROFILE);

  expect(
    verifyResponse.ok(),
    `Token verification failed with status ${verifyResponse.status()}`
  ).toBe(true);

  console.log(`✅ Token verified for user: ${mainUsername}`);
  console.log(
    `✅ Global setup complete. Storage state written to: ${MainAccountFile}`
  );
}
