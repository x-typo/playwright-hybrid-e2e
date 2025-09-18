import { chromium, request, expect, FullConfig } from "@playwright/test";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { API_ENDPOINTS } from "../../api/routes/endpoints";

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
  const mainUsername = process.env.MAIN_USERNAME;
  const mainPassword = process.env.MAIN_PASSWORD;

  if (!mainUsername || !mainPassword) {
    throw new Error("MAIN_USERNAME and MAIN_PASSWORD must be set.");
  }

  // Login via UI to get cookies and storageState
  const browser = await chromium.launch();
  const page = await browser.newPage();

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
  const response = await apiContext.post(API_ENDPOINTS.user.login, {
    data: { email: mainUsername, password: mainPassword },
    headers: { "User-Agent": "Mobile" },
  });

  expect(
    response.ok(),
    `API login failed with status ${response.status()}`
  ).toBe(true);

  const { data } = await response.json();
  const accessToken = data.token;

  // Merge API token into storageState
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

  await fs.writeFile(MainAccountFile, JSON.stringify(storageState, null, 2));

  // Post-merge token verification
  const verifyContext = await request.newContext({
    baseURL: apiOrigin,
    extraHTTPHeaders: {
      "x-auth-token": accessToken,
    },
  });

  const verifyResponse = await verifyContext.get(API_ENDPOINTS.user.profile);

  console.log("🔍 Verification status:", verifyResponse.status());
  console.log("🔍 Verification body:", await verifyResponse.text());

  expect(
    verifyResponse.ok(),
    `Token verification failed with status ${verifyResponse.status()}`
  ).toBe(true);

  console.log(`✅ Token verified for user: ${mainUsername}`);
  console.log(
    `✅ Global setup complete. Storage state written to: ${MainAccountFile}`
  );
  ////////////////////////////////////////
}
