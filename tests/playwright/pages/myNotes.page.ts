import { type Locator, type Page, expect } from "@playwright/test";

export class NotesPage {
  readonly page: Page;
  readonly isMob: boolean | undefined;

  //Desktop Locators//
  readonly locationNotesTab: Locator;
  readonly deviceNotesTab: Locator;
  snackBar: (name: string) => Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;
  readonly toolBar: Locator;
  readonly textBody: Locator;
  readonly deviceNotesPaperHeader: Locator;

  //Mobile Locators//

  constructor(page: Page, isMob: boolean | undefined) {
    this.page = page;
    this.isMob = isMob;

    //Desktop Locators//
    this.locationNotesTab = page.locator("#notes__tab");
    this.deviceNotesTab = page
      .locator("a")
      .filter({ has: page.locator(".icon-notes") });
    this.snackBar = (name: string) => page.getByText(`${name}`);
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.toolBar = page.locator(".ql-toolbar");
    this.textBody = page.locator(".ql-editor");
    this.deviceNotesPaperHeader = page.getByRole("heading", {
      name: "Device Notes",
    });

    //Mobile Locators//
  }

  //Interactions//
  async navigateA_LocationNotesPage() {
    await this.page.goto("/");
    if (this.page.url().includes("dev")) {
      await this.page.goto(
        "#/customers/65bd5aefd5e6b549d4038396/65bd5af0d5e6b549d4038398/notes"
      );
    } else {
      await this.page.goto(
        "#/customers/65bfb95e41911e5dbc00e10e/65bfb95e41911e5dbc00e110/notes"
      );
    }
  }

  async navigateA_Location310RouterNotesPage() {
    await this.page.goto("/");
    if (this.page.url().includes("dev")) {
      await this.page.goto(
        "#/customers/65bd5aefd5e6b549d4038396/65bd5af0d5e6b549d4038398/device/614bc02eab1869e5b4ea4c67/notes"
      );
    } else {
      await this.page.goto(
        "#/customers/65bfb95e41911e5dbc00e10e/65bfb95e41911e5dbc00e110/notes"
      );
    }
  }

  async selectLocationNotesTab() {
    await this.locationNotesTab.click();
  }

  async selectDeviceNotesTab() {
    await this.deviceNotesTab.click();
  }

  async updateNotes(notes: string) {
    await this.textBody.fill(notes);
    await this.saveButton.click();
  }

  //Verifications//
  async verifyLocationNotesPage() {
    await expect(this.toolBar).toBeVisible();
    await expect(this.textBody).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
    await expect(this.saveButton).toBeVisible();
  }

  async verifyDeviceNotesPage() {
    await expect(this.deviceNotesPaperHeader).toBeVisible();
    await expect(this.toolBar).toBeVisible();
    await expect(this.textBody).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
    await expect(this.saveButton).toBeVisible();
  }
}
