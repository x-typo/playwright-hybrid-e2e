import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  constructor(page: Page, isMobile: boolean | undefined) {
    super(page, isMobile);
  }

  // ===== LOCATOR GETTERS =====
  get loginPageHeading(): Locator {
    return this.heading("Login");
  }
  get emailInputBox(): Locator {
    return this.inputBox("Email");
  }
  get passwordInputBox(): Locator {
    return this.inputBox("Password");
  }
  get loginButton(): Locator {
    return this.testIdSelector("login-submit");
  }
  get googleLoginButton(): Locator {
    return this.testIdSelector("login-with-google");
  }

  // ===== NAVIGATION =====
  async navigateLoginPage(): Promise<void> {
    await this.navigatePage("/notes/app/login");
  }

  // ===== INTERACTIONS =====
  async selectLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async login({
    emailAddress,
    password,
  }: {
    emailAddress: string;
    password: string;
  }): Promise<void> {
    await this.emailInputBox.fill(emailAddress);
    await this.passwordInputBox.fill(password);
    await this.loginButton.click();
  }
}
