import { test, expect } from "../../../fixtures/automation-fixtures";

test.describe("My Notes Dashboard Page", () => {
  test.beforeEach("Navigate to page", async ({ notesDashboardPage }) => {
    await notesDashboardPage.navigateNotesDashboardPage();
  });

  test("Page Validation", async ({ notesDashboardPage }) => {
    await test.step("Verify", async () => {
      await notesDashboardPage.verifyMyNotesDashboardPage();
    });
  });

  test.only(
    "Visual Test",
    {
      tag: "@visual",
    },
    async ({ notesDashboardPage }) => {
      const expectedElement = "Search notes...";
      const maskedElement = "notes-list";
      const snapshotName = "notesDashboardPage_.png";
      const ratioAllowed = 0.02;

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

  test.skip("Verify Location Notes Updated", async ({
    notesDashboardPage,
    generateRandomText,
  }) => {
    await test.step("Update the location's notes", async () => {
      await notesDashboardPage.updateNotes(generateRandomText());
    });
    await test.step("Verify location's notes is updated", async () => {});
  });
});
