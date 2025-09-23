import { type Locator, type Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class NotesDashboardPage extends BasePage {
  constructor(page: Page, isMobile: boolean | undefined) {
    super(page, isMobile);
  }

  // ===== LOCATOR GETTERS =====
  get myNotesLinkButton(): Locator {
    return this.testIdSelector("home");
  }
  get addNoteButton(): Locator {
    return this.testIdSelector("add-new-note");
  }
  get submitButton(): Locator {
    return this.testIdSelector("note-submit");
  }
  get addNoteCategoryDropdown(): Locator {
    return this.testIdSelector("note-category");
  }
  get addNoteCompletedStatusCheckbox(): Locator {
    return this.testIdSelector("note-completed");
  }
  get searchInputBox(): Locator {
    return this.testIdSelector("search-input");
  }
  get addNoteTitleInputBox(): Locator {
    return this.testIdSelector("note-title");
  }
  get addNoteDescriptionInputBox(): Locator {
    return this.testIdSelector("note-description");
  }

  // ===== LOCATOR METHODS =====
  noteCardTitle(name: string): Locator {
    return this.testIdSelector("note-card-title").filter({ hasText: name });
  }
  tabButton(name: string): Locator {
    return this.testIdSelector(name);
  }

  // Tabs
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
  async navigateNotesDashboardPage(): Promise<void> {
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

  async addNewNote(title: string, description: string) {
    await this.addNoteButton.click();
    await this.addNoteTitleInputBox.fill(title);
    await this.addNoteDescriptionInputBox.fill(description);
    await this.submitButton.click();
  }
}
