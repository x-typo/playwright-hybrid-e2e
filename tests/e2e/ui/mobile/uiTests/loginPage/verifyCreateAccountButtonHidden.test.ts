import { expect } from "@wdio/globals";
import loginPage from "../../pages/login.page.ts";

describe("Login Page", () => {
  it("Verify 'Create Account' Button Hidden", async () => {
    await expect(loginPage.forgotPasswordButton).toBeDisplayed();
    await expect(loginPage.createAccountButton).not.toBeDisplayed();
  });
});
