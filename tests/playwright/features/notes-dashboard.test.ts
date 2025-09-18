import { test, expect } from "../../../fixtures/automation-fixtures";
import { API_ENDPOINTS } from "../../../api/routes/endpoints";
import { CreateNewNoteApiResponse } from "../../../api/models/notes.models";

test.describe("Notes Dashboard Page", () => {
  test.beforeEach("Navigate to page", async ({ basePage }) => {
    await basePage.navigatePage("/notes/app");
  });

  test(
    "Page Validation",
    {
      tag: ["@smoke", "@regression"],
    },
    async ({ notesDashboardPage }) => {
      await test.step("Verify", async () => {
        await expect(notesDashboardPage.myNotesHomeLinkButton).toBeVisible();
      });
    }
  );

  test(
    "Visual Test",
    {
      tag: ["@visual", "@smoke", "@regression"],
    },
    async ({ notesDashboardPage }) => {
      const snapshotName = "notesDashboardPage_.png";
      const ratioAllowed = 0.03;

      await test.step("Perform Visual Test", async () => {
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
      await notesDashboardPage.selectTab("category-personal");
    });
    await test.step("Verify", async () => {
      await expect(
        notesDashboardPage.text("You don't have any notes in")
      ).toBeVisible();
    });
  });

  test(
    "Search Notes",
    {
      tag: ["@smoke", "@regression"],
    },
    async ({ notesDashboardPage }) => {
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
    }
  );

  test.fixme(
    "Add New Note",
    {
      tag: ["@smoke", "@regression"],
    },
    async ({ basePage, notesDashboardPage, notesClient }) => {
      const tab = "category-home";
      const noteData = {
        title: "addNoteTest",
        description: "addNoteDescriptionTest",
      };
      let noteId: string | null = null;

      await test.step("Navigate to the dashboard", async () => {
        await basePage.navigatePage("/notes/app");
      });
      await test.step("Add new note and capture its ID", async () => {
        await notesDashboardPage.selectTestIdSelector(tab);
        noteId = await notesDashboardPage.addNewNote(
          noteData.title,
          noteData.description
        );
      });
      await test.step("Verify", async () => {
        await expect(noteId, "should return a valid note ID").toBeDefined();
        await expect(typeof noteId).toBe("string");
        await expect(
          notesDashboardPage.noteCardTitle(noteData.title)
        ).toBeVisible();
      });
      await test.step("Teardown", async () => {
        expect(
          noteId,
          "Cannot perform teardown because noteId is null."
        ).not.toBeNull();
        const response = await notesClient.deleteNoteById(noteId!);
        expect(
          response.ok(),
          `API teardown failed for note ID ${noteId}.`
        ).toBe(true);
      });
    }
  );
});
