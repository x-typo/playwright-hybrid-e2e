import { test, expect } from "../../../fixtures/automation-fixtures";

test.describe("My Notes Dashboard Page", () => {
  test.beforeEach("Navigate to page", async ({ myNotesDashboardPage }) => {
    await myNotesDashboardPage.navigateMyNotesDashboardPage();
  });

  test("Page Validation", async ({ myNotesDashboardPage }) => {
    await test.step("Verify", async () => {
      await myNotesDashboardPage.verifyMyNotesDashboardPage();
    });
  });

  test.skip("Verify Location Notes Updated", async ({
    myNotesDashboardPage,
    generateRandomText,
  }) => {
    await test.step("Update the location's notes", async () => {
      await myNotesDashboardPage.updateNotes(generateRandomText());
    });
    await test.step("Verify location's notes is updated", async () => {});
  });
});
