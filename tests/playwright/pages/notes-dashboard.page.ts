import { type Locator, type Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";
import { API_ENDPOINTS } from "../../../api/routes/endpoints";

export class NotesDashboardPage extends BasePage {
  // LOCATOR DECLARATIONS //
  readonly toolBar: Locator;
  readonly textBody: Locator;
  noteCardTitle: (name: string) => Locator;

  readonly myNotesHomeLinkButton: Locator;

  tabButton: (name: string) => Locator;
  readonly addNoteButton: Locator;
  readonly submitButton: Locator;

  readonly addNoteCategoryDropdown: Locator;

  readonly addNoteCompletedStatusCheckbox: Locator;

  readonly searchInputBox: Locator;
  readonly addNoteTitleInputBox: Locator;
  readonly addNoteDescriptionInputBox: Locator;

  // LOCATOR INITIALIZATIONS //
  constructor(page: Page, isMob: boolean | undefined) {
    super(page, isMob);

    this.toolBar = page.locator(".ql-toolbar");
    this.textBody = page.locator(".ql-editor");
    this.noteCardTitle = (name) =>
      this.testIdSelector("note-card-title").filter({ hasText: name });

    this.myNotesHomeLinkButton = this.testIdSelector("home");

    this.tabButton = (name) => this.testIdSelector(name);
    this.addNoteButton = this.testIdSelector("add-new-note");
    this.submitButton = this.testIdSelector("note-submit");

    this.addNoteCategoryDropdown = this.testIdSelector("note-category");

    this.addNoteCompletedStatusCheckbox = this.testIdSelector("note-completed");

    this.searchInputBox = this.testIdSelector("search-notes");
    this.addNoteTitleInputBox = this.testIdSelector("note-title");
    this.addNoteDescriptionInputBox = this.testIdSelector("note-description");
  }

  // INTERACTIONS //
  async searchNotes(note: string) {
    await this.searchInputBox.fill(note);
    await this.testIdSelector("search-btn").click();
  }

  async updateNotes(description: string) {
    await this.textBody.fill(description);
    await this.button("Save").click();
  }

  async selectTab(name: string) {
    await this.tabButton(name).click();
  }

  async addNewNote(title: string, description: string): Promise<string> {
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().endsWith(API_ENDPOINTS.notes.create) &&
        response.request().method() === "POST"
    );

    await this.addNoteButton.click();
    await this.addNoteTitleInputBox.fill(title);
    await this.addNoteDescriptionInputBox.fill(description);
    await this.submitButton.click();

    const response = await responsePromise;
    const responseBody = await response.json();

    expect(response.ok(), "The 'create note' API call failed.").toBe(true);
    const {
      data: { id: noteId },
    } = responseBody;

    expect(
      noteId,
      "Could not find 'id' in the API response body."
    ).toBeDefined();

    return noteId;
  }
}
