import { chromium, request, expect, FullConfig } from "@playwright/test";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { USERS_ENDPOINTS } from "../../api/endpoints/users-endpoints";

dotenv.config({
  path: ".env",
  quiet: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storageStateDir = path.resolve(__dirname, "../../auth/storageStates");
const storageStatePath = path.join(storageStateDir, "mainAccountSetup.json");

const baseURL = process.env.UI_BASE_URL!;
const apiOrigin = process.env.API_BASE_URL!;

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
  const { MAIN_USERNAME, MAIN_PASSWORD } = process.env;

  if (!MAIN_USERNAME || !MAIN_PASSWORD) {
    throw new Error("MAIN_USERNAME and MAIN_PASSWORD must be set");
  }

  await fs.mkdir(storageStateDir, { recursive: true });

  // UI login to create storage state
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const blockedDomains = [
    "https://www.googleadservices.com",
    "https://pagead2.googlesyndication.com",
    "https://googleads.g.doubleclick.net",
    "https://www.google.com",
    "https://tpc.googlesyndication.com",
  ];
  await page.context().route("**/*", (route) => {
    const url = route.request().url();
    blockedDomains.some((domain) => url.startsWith(domain))
      ? route.abort()
      : route.continue();
  });

  await page.goto(`${baseURL}/notes/app/login`);
  await page.getByTestId("login-email").fill(MAIN_USERNAME);
  await page.getByTestId("login-password").fill(MAIN_PASSWORD);

  await Promise.all([
    page.waitForURL("**/notes/app"),
    page.getByTestId("login-submit").click(),
  ]);

  await page.context().storageState({ path: storageStatePath });
  await browser.close();

  // API login to get token
  const apiContext = await request.newContext({ baseURL });
  const response = await apiContext.post(USERS_ENDPOINTS.LOGIN, {
    data: { email: MAIN_USERNAME, password: MAIN_PASSWORD },
    headers: { "User-Agent": "Mobile" },
  });

  expect(
    response.ok(),
    `API login failed with status ${response.status()}`
  ).toBe(true);
  const { data } = await response.json();
  const accessToken = data.token;

  // Merge token into storage state for UI context
  const storageState: MyStorageState = JSON.parse(
    await fs.readFile(storageStatePath, "utf-8")
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

  const authCookies = ["express:sess", "express:sess.sig", "io"];
  storageState.cookies = storageState.cookies.filter((cookie) =>
    authCookies.includes(cookie.name)
  );

  await fs.writeFile(storageStatePath, JSON.stringify(storageState, null, 2));

  process.env.API_TOKEN = accessToken;
}
