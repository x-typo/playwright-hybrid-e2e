import { test as setup, expect } from "@playwright/test";
import { API_ENDPOINTS } from "../../api/routes/endpoints";
import fs from "fs/promises";

const MainAccountFile = "./auth/storageStates/mainAccountSetup.json";
const baseURL = "https://practice.expandtesting.com";
const apiBaseURL = `${baseURL}/notes/api`;

const mainUsername = process.env.MAIN_USERNAME;
const mainPassword = process.env.MAIN_PASSWORD;

if (!mainUsername || !mainPassword) {
  throw new Error(
    "Environment variables MAIN_USERNAME and MAIN_PASSWORD must be set."
  );
}

setup("Hybrid UI and API Authentication", async ({ page, request }) => {
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
      route.abort();
    } else {
      route.continue();
    }
  });

  await page.goto(`${baseURL}/notes/app/login`);
  await page.getByTestId("login-email").fill(mainUsername);
  await page.getByTestId("login-password").fill(mainPassword);
  await page.getByTestId("login-submit").click();
  await expect(page.getByTestId("search-input")).toBeVisible({
    timeout: 10000,
  });
  await page.context().storageState({ path: MainAccountFile });

  const response = await request.post(
    `${apiBaseURL}${API_ENDPOINTS.user.login}`,
    {
      data: {
        email: mainUsername,
        password: mainPassword,
      },
      headers: {
        "User-Agent": "Mobile",
      },
    }
  );

  expect(
    response.ok(),
    `API login failed with status ${response.status()}. Check credentials.`
  ).toBe(true);

  const responseBody = await response.json();
  const accessToken = responseBody.data.token;

  const storageState = JSON.parse(await fs.readFile(MainAccountFile, "utf-8"));

  storageState.origins.push({
    origin: apiBaseURL,
    localStorage: [
      {
        name: "token",
        value: accessToken,
      },
    ],
  });

  await fs.writeFile(MainAccountFile, JSON.stringify(storageState, null, 2));
});
