import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  // LOCATOR DECLARATIONS //
  readonly loginPageHeading: Locator;

  readonly emailInptutBox: Locator;
  readonly passwordInputBox: Locator;

  readonly loginButton: Locator;
  readonly googleLoginButton: Locator;

  // LOCATOR INITIALIZATIONS //
  constructor(page: Page, isMob: boolean | undefined) {
    super(page, isMob);

    this.loginPageHeading = this.heading("Login");

    this.emailInptutBox = this.inputBox("Email");
    this.passwordInputBox = this.inputBox("Password");

    this.loginButton = this.testIdSelector("login-submit");
    this.googleLoginButton = this.testIdSelector("login-with-google");
  }

  // INTERACTIONS //
  async selectLoginButton() {
    await this.loginButton.click();
  }

  async login(email: string, password: string) {
    await this.emailInptutBox.fill(email);
    await this.passwordInputBox.fill(password);
    await this.loginButton.click();
  }
}
