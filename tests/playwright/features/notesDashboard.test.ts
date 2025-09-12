import { test, expect } from "../../../fixtures/automation-fixtures";

test.describe("Notes Dashboard Page", () => {
  test.beforeEach("Navigate to page", async ({ notesDashboardPage }) => {
    await notesDashboardPage.navigateNotesDashboardPage();
  });

  test("Page Validation", async ({ notesDashboardPage }) => {
    await test.step("Verify", async () => {
      await notesDashboardPage.verifyMyNotesDashboardPage();
    });
  });

  test(
    "Visual Test",
    {
      tag: "@visual",
    },
    async ({ notesDashboardPage }) => {
      const expectedElement = "Search notes...";
      const maskedElement = "notes-list";
      const snapshotName = "notesDashboardPage_.png";
      const ratioAllowed = 0.03;

      await test.step("Perform Visual Test", async () => {
        await expect(
          notesDashboardPage.searchInputBox(expectedElement)
        ).toBeVisible();
        expect(
          await notesDashboardPage.page.screenshot({
            animations: "disabled",
            mask: [notesDashboardPage.testIdSelector(maskedElement)],
          })
        ).toMatchSnapshot(snapshotName, { maxDiffPixelRatio: ratioAllowed });
      });
    }
  );

  test("No Notes Displayed", async ({ notesDashboardPage }) => {
    await test.step("Verify", async () => {
      await expect(
        notesDashboardPage.text("You don't have any notes in all categories")
      ).toBeVisible();
    });
  });
});
