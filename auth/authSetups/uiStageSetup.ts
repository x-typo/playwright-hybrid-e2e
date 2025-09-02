import { test as setup } from "@playwright/test";

const uiStageQaFile = "playwright/auth/uiStageQa.json";

setup("Stage QA Account", async ({ page }) => {
  await page.goto("https://desktop.staging.com/#/login");
  await page.getByPlaceholder("Email").fill("email@email.com");
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Log In" }).click();
  await page.waitForURL("https://desktop.staging.com/#/customers");

  await page.context().storageState({ path: uiStageQaFile });
});
