import { test, expect } from "../../../fixtures/automation-fixtures";

test.describe("Notes Dashboard Page", () => {
  test.beforeEach("Navigate to page", async ({ notesDashboardPage }) => {
    await notesDashboardPage.navigateNotesDashboardPage();
  });

  test(
    "Page Validation",
    { tag: ["@smoke", "@regression"] },
    async ({ notesDashboardPage }) => {
      await test.step("Verify", async () => {
        await expect(notesDashboardPage.myNotesLinkButton).toBeVisible();
      });
    }
  );

  test(
    "Visual Test",
    { tag: ["@visual", "@smoke", "@regression"] },
    async ({ notesDashboardPage }) => {
      const snapshotName = "notesDashboardPage_.png";
      const ratioAllowed = 0.03;

      await test.step("Perform visual comparison", async () => {
        await expect(notesDashboardPage.text("notes completed")).toBeVisible();
        expect(
          await notesDashboardPage.page.screenshot({
            animations: "disabled",
            mask: [notesDashboardPage.testIdSelector("notes-list")],
          })
        ).toMatchSnapshot(snapshotName, { maxDiffPixelRatio: ratioAllowed });
      });
    }
  );

  test("No Notes Displayed", async ({ notesDashboardPage }) => {
    await test.step("Select tab", async () => {
      await notesDashboardPage.personalTab.click();
    });
    await test.step("Verify", async () => {
      await expect(
        notesDashboardPage.text("You don't have any notes in")
      ).toBeVisible();
    });
  });

  test(
    "Search Notes",
    { tag: ["@smoke", "@regression"] },
    async ({ notesDashboardPage }) => {
      await test.step("Select tab", async () => {
        await notesDashboardPage.workTab.click();
      });
      await test.step("Search for notes", async () => {
        await notesDashboardPage.searchNotes("work1");
      });
      await test.step("Verify", async () => {
        await expect(notesDashboardPage.noteCardTitle("work1")).toBeVisible();
        await expect(notesDashboardPage.noteCardTitle("work2")).toBeHidden();
      });
    }
  );

  test(
    "Add New Note",
    { tag: ["@smoke", "@regression"] },
    async ({ notesDashboardPage, notesClient }) => {
      const noteData = {
        title: "addNoteTest",
        description: "addNoteDescriptionTest",
      };
      let noteId: string | null = null;

      await test.step("Get all notes data", async () => {
        const response = await notesClient.getAllNotes();

        expect(response.success).toBe(true);
        expect(response.status).toBe(200);

        console.log("ALL NOTES DATA", JSON.stringify(response.data, null, 2));
      });
    }
  );
});
