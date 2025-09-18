import { type Locator, type Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";
import { API_ENDPOINTS } from "../../../api/routes/endpoints";

export class NotesDashboardPage extends BasePage {
  readonly myNotesLinkButton: Locator;
  readonly addNoteButton: Locator;
  readonly submitButton: Locator;
  readonly addNoteCategoryDropdown: Locator;
  readonly addNoteCompletedStatusCheckbox: Locator;
  readonly searchInputBox: Locator;
  readonly addNoteTitleInputBox: Locator;
  readonly addNoteDescriptionInputBox: Locator;

  constructor(page: Page, isMobile: boolean | undefined) {
    super(page, isMobile);

    this.myNotesLinkButton = this.testIdSelector("home");
    this.addNoteButton = this.testIdSelector("add-new-note");
    this.submitButton = this.testIdSelector("note-submit");
    this.addNoteCategoryDropdown = this.testIdSelector("note-category");
    this.addNoteCompletedStatusCheckbox = this.testIdSelector("note-completed");
    this.searchInputBox = this.testIdSelector("search-input");
    this.addNoteTitleInputBox = this.testIdSelector("note-title");
    this.addNoteDescriptionInputBox = this.testIdSelector("note-description");
  }

  // ===== LOCATOR METHODS =====
  noteCardTitle(name: string): Locator {
    return this.testIdSelector("note-card-title").filter({ hasText: name });
  }
  tabButton(name: string): Locator {
    return this.testIdSelector(name);
  }

  // ===== GETTERS =====
  get allTab(): Locator {
    return this.tabButton("category-all");
  }
  get workTab(): Locator {
    return this.tabButton("category-work");
  }
  get homeTab(): Locator {
    return this.tabButton("category-home");
  }
  get personalTab(): Locator {
    return this.tabButton("category-personal");
  }

  // ===== NAVIGATION =====
  async navigateNotesDashboardPage() {
    await this.navigatePage("/notes/app");
  }

  async expectOnDashboard(): Promise<void> {
    await this.expectVisible(this.myNotesLinkButton);
  }

  // ===== INTERACTIONS =====
  async searchNotes(note: string): Promise<void> {
    await this.searchInputBox.fill(note);
    await this.testIdSelector("search-btn").click();
  }

  async updateNotes(description: string): Promise<void> {
    await this.button("Save").click();
  }

  async selectTab(name: string): Promise<void> {
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
