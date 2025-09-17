import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  // LOCATOR DECLARATIONS //
  readonly loginButton: Locator;

  // LOCATOR INITIALIZATIONS //
  constructor(page: Page, isMob: boolean | undefined) {
    super(page, isMob);

    this.loginButton = page.getByTestId("login-submit");
  }

  // INTERACTIONS //
  async selectLoginButton() {
    await this.loginButton.click();
  }

  async login(email: string, password: string) {
    await this.inputBox("Email").fill(email);
    await this.inputBox("Password").fill(password);
    await this.loginButton.click();
  }
}
