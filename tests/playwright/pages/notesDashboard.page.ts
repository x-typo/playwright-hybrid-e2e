import { type Locator, type Page } from "@playwright/test";

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
  readonly toolBar: Locator;
  readonly textBody: Locator;
  noteCardTitle: (name: string) => Locator;

  readonly addNoteButton: Locator;
  readonly submitButton: Locator;

  readonly addNoteCategoryDropdown: Locator;

  readonly addNoteCompletedStatusCheckbox: Locator;

  readonly searchInputBox: Locator;
  readonly addNoteTitleInputBox: Locator;
  readonly addNoteDescriptionInputBox: Locator;

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
    this.toolBar = page.locator(".ql-toolbar");
    this.textBody = page.locator(".ql-editor");
    this.noteCardTitle = (name) =>
      page
        .getByTestId("note-card")
        .getByTestId("note-card-title")
        .filter({ hasText: name });

    this.addNoteButton = page.getByTestId("add-new-note");
    this.submitButton = page.getByTestId("note-submit");

    this.addNoteCategoryDropdown = page.getByTestId("note-category");

    this.addNoteCompletedStatusCheckbox = page.getByTestId("note-completed");

    this.searchInputBox = page.getByPlaceholder("Search notes...");
    this.addNoteTitleInputBox = page.getByTestId("note-title");
    this.addNoteDescriptionInputBox = page.getByTestId("note-description");
  }

  // INTERACTIONS //
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

  async searchNotes(note: string) {
    await this.searchInputBox.fill(note);
    await this.testIdSelector("search-btn").click();
  }

  async updateNotes(description: string) {
    await this.textBody.fill(description);
    await this.button("Save").click();
  }

  async addNewNote(title: string, description: string) {
    await this.addNoteButton.click();
    await this.addNoteTitleInputBox.fill(title);
    await this.addNoteDescriptionInputBox.fill(description);
    await this.testIdSelector("note-submit").click();
  }
}
