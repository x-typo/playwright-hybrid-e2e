import { type Locator, type Page, expect } from "@playwright/test";

export class NotesDashboardPage {
  readonly page: Page;
  readonly isMob: boolean | undefined;

  // LOCATOR DECLARATIONS //
  idSelector: (name: string) => Locator;
  classSelector: (name: string) => Locator;
  testIdSelector: (name: string) => Locator;
  heading: (name: string) => Locator;
  text: (text: string) => Locator;
  link: (name: string) => Locator;
  icon: (name: string) => Locator;
  button: (name: string) => Locator;
  img: (name: string) => Locator;
  searchInputBox: (name: string) => Locator;
  readonly toolBar: Locator;
  readonly textBody: Locator;

  // LOCATOR INITIALIZATIONS //
  constructor(page: Page, isMob: boolean | undefined) {
    this.page = page;
    this.isMob = isMob;

    this.idSelector = (name) => page.locator(`#${name}`);
    this.classSelector = (name) => page.locator(`#core`).locator(`.${name}`);
    this.testIdSelector = (name) => page.getByTestId(name);
    this.heading = (name) => page.getByRole("heading", { name: name });
    this.text = (text) => page.getByText(text);
    this.link = (name) => page.getByRole("link", { name: name, exact: true });
    this.icon = (name) => page.getByTestId(name).first();
    this.button = (name) => page.getByRole("button", { name: name });
    this.img = (name) => page.getByRole("img", { name });
    this.searchInputBox = (name) => page.getByPlaceholder(name);
    this.toolBar = page.locator(".ql-toolbar");
    this.textBody = page.locator(".ql-editor");
  }

  // Interactions //
  async navigateNotesDashboardPage() {
    await this.page.goto("/notes/app");
    // if (this.page.url().includes("dev")) {
    //   await this.page.goto("#/notes/app/");
    // } else {
    //   await this.page.goto("#/staging/notes/app/");
    // }
  }

  async selectButton(buttonName: string) {
    await this.button(buttonName).click();
  }

  async selectTestIdSelector(element: string) {
    await this.testIdSelector(element).click();
  }

  async updateNotes(notes: string) {
    await this.textBody.fill(notes);
    await this.button("Save").click();
  }

  // Verifications //
  async verifyMyNotesDashboardPage() {
    if (this.isMob) {
      await this.classSelector("navbar-toggler").click();
    }
    await expect(this.link("Practice")).toBeVisible();
    await expect(
      this.link("Home - My Notes - The App for Automation Testing Practice")
    ).toBeVisible();
    await expect(this.testIdSelector("home")).toBeVisible();
    await expect(this.link("Profile")).toBeVisible();
    await expect(this.button("Logout")).toBeVisible();
    await expect(this.searchInputBox("Search notes...")).toBeVisible();
    await expect(this.button("Search")).toBeVisible();
    await expect(this.button("All")).toBeVisible();
    await expect(this.button("Home")).toBeVisible();
    await expect(this.button("Work")).toBeVisible();
    await expect(this.button("Personal")).toBeVisible();
    await expect(this.button("+ Add Note")).toBeVisible();
  }
}
