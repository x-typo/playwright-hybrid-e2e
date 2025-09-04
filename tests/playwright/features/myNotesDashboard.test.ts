import { test, expect } from "../../../fixtures/automation-fixtures";

// test.beforeAll("UNDER CONSTRUCT", async ({}) => {
//   test.skip();
// });

test.describe("My Notes Dashboard Page", () => {
  test.beforeEach("Navigate to page", async ({ myNotesDashboardPage }) => {
    await myNotesDashboardPage.navigateMyNotesDashboardPage();
  });

  test.only("Page Validation", async ({ myNotesDashboardPage }) => {
    await test.step("Verify", async () => {
      await myNotesDashboardPage.verifyMyNotesDashboardPage();
    });
  });

  test("Verify Location Notes Updated", async ({
    myNotesDashboardPage,
    generateRandomText,
  }) => {
    await test.step("Update the location's notes", async () => {
      await myNotesDashboardPage.updateNotes(generateRandomText());
    });
    await test.step("Verify location's notes is updated", async () => {
      await expect(
        myNotesDashboardPage.snackBar(
          "The notes for this location have been updated."
        )
      ).toBeVisible();
    });
  });
});
