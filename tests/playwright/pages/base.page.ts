import { type Locator, type Page, expect } from "@playwright/test";

export class BasePage {
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
    this.image = (name) => page.getByRole("img", { name });
    this.text = (text) => page.getByText(text);
    this.heading = (text) => page.getByRole("heading", { name: text });
    this.link = (name) => page.getByRole("link", { name: name });
    this.button = (name) => page.getByRole("button", { name: name });
    this.inputBox = (name) => page.getByRole("textbox", { name: name });
  }

  // NAVIGATIONS //
  async navigatePage(path: string) {
    await this.page.goto(path);
  }

  // INTERACTIONS //
  async selectTestIdSelector(name: string) {
    await this.testIdSelector(name).click();
  }

  async selectButton(name: string) {
    await this.button(name).click();
  }

  async selectLink(name: string) {
    await this.link(name).click();
  }
}
