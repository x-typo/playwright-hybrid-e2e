import { test, expect } from "../../../fixtures/automation-fixtures";

test.describe("Notes Dashboard Page", () => {
  test.beforeEach("Navigate to page", async ({ notesDashboardPage }) => {
    await notesDashboardPage.navigateNotesDashboardPage();
  });

  test("Page Validation", async ({ notesDashboardPage }) => {
    await test.step("Verify", async () => {
      await expect(notesDashboardPage.testIdSelector("home")).toBeVisible();
    });
  });

  test(
    "Visual Test",
    {
      tag: "@visual",
    },
    async ({ notesDashboardPage }) => {
      const expectedElement = "notes completed";
      const maskedElement = "notes-list";
      const snapshotName = "notesDashboardPage_.png";
      const ratioAllowed = 0.03;

      await test.step("Perform Visual Test", async () => {
        await expect(notesDashboardPage.text(expectedElement)).toBeVisible();
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
    const tab = "category-personal";
    const expectedText = "You don't have any notes in";

    await test.step("Select tab", async () => {
      await notesDashboardPage.selectTestIdSelector(tab);
    });
    await test.step("Verify", async () => {
      await expect(notesDashboardPage.text(expectedText)).toBeVisible();
    });
  });

  test("Search Notes", async ({ notesDashboardPage }) => {
    const tab = "category-work";
    const searchText = "work1";
    const expectedNoteCard = "work1";
    const notExpectedNoteCard = "work2";

    await test.step("Select tab", async () => {
      await notesDashboardPage.selectTestIdSelector(tab);
    });
    await test.step("Perform search", async () => {
      await notesDashboardPage.searchNotes(searchText);
    });
    await test.step("Verify", async () => {
      await expect(
        notesDashboardPage.noteCardTitle(expectedNoteCard)
      ).toBeVisible();
      await expect(
        notesDashboardPage.noteCardTitle(notExpectedNoteCard)
      ).toBeHidden();
    });
  });
});
