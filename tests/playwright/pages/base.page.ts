import { type Locator, type Page, expect } from "@playwright/test";

export class BasePage {
  readonly page: Page;
  readonly isMobile: boolean | undefined;

  constructor(page: Page, isMobile: boolean | undefined) {
    this.page = page;
    this.isMobile = isMobile;
  }

  // ===== LOCATORS =====
  idSelector(name: string): Locator {
    return this.page.locator(`#${name}`);
  }
  classSelector(name: string): Locator {
    return this.page.locator(`#core`).locator(`.${name}`);
  }
  testIdSelector(name: string): Locator {
    return this.page.getByTestId(name);
  }
  heading(text: string): Locator {
    return this.page.getByRole("heading", { name: text });
  }
  text(text: string): Locator {
    return this.page.getByText(text);
  }
  image(name: string): Locator {
    return this.page.getByRole("img", { name });
  }
  icon(name: string): Locator {
    return this.page.getByTestId(name);
  }
  link(name: string): Locator {
    return this.page.getByRole("link", { name });
  }
  button(name: string): Locator {
    return this.page.getByRole("button", { name });
  }
  inputBox(name: string): Locator {
    return this.page.getByRole("textbox", { name });
  }

  // ===== NAVIGATION =====
  async navigatePage(path: string): Promise<void> {
    await this.page.goto(path);
  }

  // ===== INTERACTIONS =====
  async selectTestIdSelector(name: string): Promise<void> {
    await this.testIdSelector(name).click();
  }
  async selectButton(name: string): Promise<void> {
    await this.button(name).click();
  }
  async selectLink(name: string): Promise<void> {
    await this.link(name).click();
  }

  // ===== ASSERTIONS =====
  async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }
}
