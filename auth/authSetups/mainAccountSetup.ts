import { test as setup, expect } from "@playwright/test";
import fs from "fs/promises";

const MainAccountFile = "auth/storageStates/mainAccountSetup.json";

const mainUsername = process.env.MAIN_USERNAME;
const mainPassword = process.env.MAIN_PASSWORD;

if (!mainUsername || !mainPassword) {
  throw new Error(
    "Environment variables main_USERNAME and main_PASSWORD not set."
  );
}

setup("Main Account", async ({ page, request }) => {
  await page.goto("https://practice.expandtesting.com/notes/app/login");
  await page.getByTestId("login-email").fill(mainUsername);
  await page.getByTestId("login-password").fill(mainPassword);
  await page.getByTestId("login-submit").click();
  await page.waitForURL("https://practice.expandtesting.com/notes/app/");
  await page.context().storageState({ path: MainAccountFile });

  // const response = await request.post(
  //   "https://api.dev.tbd.com/v1/users/login",
  //   {
  //     data: {
  //       username: mainUsername,
  //       password: mainPassword,
  //     },
  //     headers: {
  //       "User-Agent": "Mobile",
  //     },
  //   }
  // );
  // const content = await response.json();
  // const accessToken = content.accessToken;
  // const storageState = JSON.parse(await fs.readFile(MainAccountFile, "utf-8"));

  // storageState.origins.push({
  //   origin: "https://api.dev.tbd.com",
  //   localStorage: [
  //     {
  //       name: "api_access_token",
  //       value: accessToken,
  //     },
  //   ],
  // });

  // await fs.writeFile(MainAccountFile, JSON.stringify(storageState, null, 2));
});
