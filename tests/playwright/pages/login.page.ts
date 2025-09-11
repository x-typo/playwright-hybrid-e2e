import { type Locator, type Page, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly isMob: boolean | undefined;

  // LOCATOR DECLARATIONS //
  idSelector: (name: string) => Locator;
  testIdSelector: (name: string) => Locator;
  image: (name: string) => Locator;
  text: (text: string) => Locator;
  heading: (text: string) => Locator;
  link: (name: string) => Locator;
  button: (name: string) => Locator;
  inputBox: (name: string) => Locator;

  // LOCATOR INITIALIZATIONS //
  constructor(page: Page, isMob: boolean | undefined) {
    this.page = page;
    this.isMob = isMob;

    this.idSelector = (name) => page.locator(`#${name}`);
    this.testIdSelector = (name) => page.getByTestId(name);
    this.image = (name) => page.getByRole("img", { name, exact: true });
    this.text = (text) => page.getByText(text);
    this.heading = (text) => page.getByRole("heading", { name: text });
    this.link = (name) => page.getByRole("link", { name: name });
    this.button = (name) => page.getByRole("button", { name: name });
    this.inputBox = (name) => page.getByRole("textbox", { name: name });
  }

  // Navigations //
  async navigateLoginPage() {
    await this.page.goto("/notes/app/login");
  }

  // Interactions //
  async selectButton(name) {
    await this.button(name).click();
  }

  async selectTestIdSelector(name) {
    await this.testIdSelector(name).click();
  }

  async selectLink(name) {
    await this.link(name).click();
  }

  async enterCreds(email, password) {
    await this.inputBox("Email").fill(email);
    await this.inputBox("Password").fill(password);
  }

  async enterInputBox(name, value) {
    await this.inputBox(name).fill(value);
  }

  // Verifications //
  async verifyPage() {
    await expect(this.heading("Login")).toBeVisible();
    await expect(this.idSelector("email")).toBeVisible();
    await expect(this.link("Forgot password")).toBeVisible();
    await expect(this.idSelector("password")).toBeVisible();
    await expect(this.testIdSelector("login-submit")).toBeVisible();
  }
}
