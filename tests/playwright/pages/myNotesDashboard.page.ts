import { type Locator, type Page, expect } from "@playwright/test";

export class MyNotesDashboardPage {
  readonly page: Page;
  readonly isMob: boolean | undefined;

  // LOCATOR DECLARATIONS //
  idSelector: (name: string) => Locator;
  testIdSelector: (name: string) => Locator;
  heading: (name: string) => Locator;
  text: (text: string) => Locator;
  link: (name: string) => Locator;
  icon: (name: string) => Locator;
  button: (name: string) => Locator;
  readonly toolBar: Locator;
  readonly textBody: Locator;
  readonly deviceNotesPaperHeader: Locator;

  // LOCATOR INITIALIZATIONS //
  constructor(page: Page, isMob: boolean | undefined) {
    this.page = page;
    this.isMob = isMob;

    this.idSelector = (name) => page.locator(`#${name}`);
    this.testIdSelector = (name) => page.getByTestId(name);
    this.heading = (name) => page.getByRole("heading", { name: name });
    this.text = (text) => page.getByText(text);
    this.link = (name) => page.getByRole("link", { name: name, exact: true });
    this.icon = (name) => page.getByTestId(name).first();
    this.button = (name) => page.getByRole("button", { name: name });
    this.toolBar = page.locator(".ql-toolbar");
    this.textBody = page.locator(".ql-editor");
  }

  // Interactions //
  async navigateMyNotesDashboardPage() {
    await this.page.goto("/notes/app");
    // if (this.page.url().includes("dev")) {
    //   await this.page.goto("#/notes/app/");
    // } else {
    //   await this.page.goto("#/staging/notes/app/");
    // }
  }

  async selectButton(name) {
    await this.button(name).click();
  }

  async updateNotes(notes: string) {
    await this.textBody.fill(notes);
    await this.button("Save").click();
  }

  //Verifications//
  async verifyMyNotesDashboardPage() {
    await expect(this.testIdSelector("home")).toBeVisible();
  }
}
