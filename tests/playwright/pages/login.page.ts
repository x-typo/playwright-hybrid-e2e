import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  // LOCATOR DECLARATIONS //
  readonly loginButton: Locator;
  readonly loginPageHeading: Locator;
  readonly emailInptutBox: Locator;
  readonly passwordInputBox: Locator;
  readonly googleLoginButton: Locator;

  // LOCATOR INITIALIZATIONS //
  constructor(page: Page, isMob: boolean | undefined) {
    super(page, isMob);

    this.loginButton = this.testIdSelector("login-submit");
    this.loginPageHeading = this.heading("Login");
    this.emailInptutBox = this.testIdSelector("login-email");
    this.passwordInputBox = this.testIdSelector("login-password");
    this.googleLoginButton = this.testIdSelector("login-with-google");
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
