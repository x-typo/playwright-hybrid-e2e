import { type Locator, type Page } from "@playwright/test";

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
  readonly loginButton: Locator;

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
    this.loginButton = page.getByTestId("login-submit");
  }

  // INTERACTIONS //
  async selectButton(name: string) {
    await this.button(name).click();
  }

  async selectTestIdSelector(name: string) {
    await this.testIdSelector(name).click();
  }

  async selectLink(name: string) {
    await this.link(name).click();
  }

  async selectLoginButton() {
    await this.loginButton.click();
  }

  async login(email: string, password: string) {
    await this.inputBox("Email").fill(email);
    await this.inputBox("Password").fill(password);
    await this.loginButton.click();
  }
}
