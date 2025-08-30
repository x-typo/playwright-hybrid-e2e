import { test as setup } from "@playwright/test";
import fs from "fs/promises";

const MainAccountFile = "common/auth/storageStates/mainAccountSetup.json";

const mainUsername = process.env.MAIN_USERNAME;
const mainPassword = process.env.MAIN_PASSWORD;

if (!mainUsername || !mainPassword) {
  throw new Error(
    "Environment variables main_USERNAME and main_PASSWORD not set."
  );
}

setup("Main Account", async ({ page, request }) => {
  await page.goto("https://qa-practice.netlify.app/auth_ecommerce.html");
  await page.getByPlaceholder("Email").fill(mainUsername);
  await page.getByPlaceholder("Password").fill(mainPassword);
  await page.getByRole("button", { name: "Submit" }).click();
  await page.waitForURL("https://qa-practice.netlify.app/auth_ecommerce.html");
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
