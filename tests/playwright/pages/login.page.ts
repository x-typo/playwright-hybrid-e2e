import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  readonly loginPageHeading: Locator;
  readonly emailInputBox: Locator;
  readonly passwordInputBox: Locator;
  readonly loginButton: Locator;
  readonly googleLoginButton: Locator;

  constructor(page: Page, isMobile: boolean | undefined) {
    super(page, isMobile);

    this.loginPageHeading = this.heading("Login");
    this.emailInputBox = this.inputBox("Email");
    this.passwordInputBox = this.inputBox("Password");
    this.loginButton = this.testIdSelector("login-submit");
    this.googleLoginButton = this.testIdSelector("login-with-google");
  }

  // ===== NAVIGATION =====
  async goto() {
    await this.navigatePage("/login");
  }

  // ===== INTERACTIONS =====
  async selectLoginButton() {
    await this.loginButton.click();
  }

  async login({
    emailAddress,
    password,
  }: {
    emailAddress: string;
    password: string;
  }) {
    await this.emailInputBox.fill(emailAddress);
    await this.passwordInputBox.fill(password);
    await this.loginButton.click();
  }
}
