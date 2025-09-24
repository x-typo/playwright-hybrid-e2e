import { test, expect } from "../../../fixtures/automation-fixtures";
import { getNoteIdByTitle } from "../../../api/utils/notes-helpers";

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

      await test.step("Create new note", async () => {
        await notesDashboardPage.addNewNote(
          noteData.title,
          noteData.description
        );
      });

      await test.step("Verify", async () => {
        await expect(
          notesDashboardPage.noteCardTitle(noteData.title)
        ).toBeVisible();
      });

      await test.step("Teardown", async () => {
        const response = await notesClient.getAllNotes();
        const noteId = getNoteIdByTitle(response.data ?? [], noteData.title);
        if (noteId) {
          const deleteResponse = await notesClient.deleteNote(noteId);
          expect(deleteResponse.success).toBe(true);
          expect(deleteResponse.status).toBe(200);
        }
      });
    }
  );

  test(
    "Update Note",
    { tag: ["@smoke", "@regression"] },
    async ({ notesDashboardPage, notesClient }) => {
      const noteId = "68c5dac606ff22028be98c3a";
      const originalNote = {
        title: "work2",
        description: "randomTexts123",
        completed: false,
        category: "Work",
      };
      const updatedNote = {
        title: "work2-updated",
        description: "randomTexts456",
        completed: false,
        category: "Work",
      };

      await test.step("Search for notes", async () => {
        await notesDashboardPage.searchNotes(originalNote.title);
      });

      await test.step("Update note", async () => {
        await notesDashboardPage.updateNote(
          updatedNote.title,
          updatedNote.description
        );
      });

      await test.step("Verify", async () => {
        await expect(
          notesDashboardPage.noteCardTitle(updatedNote.title)
        ).toBeVisible();
        await expect(
          notesDashboardPage.noteCardDescription(updatedNote.description)
        ).toBeVisible();
      });

      await test.step("Teardown", async () => {
        const restoreNoteResponse = await notesClient.updateNote(noteId, {
          ...originalNote,
        });
        expect(restoreNoteResponse.success).toBe(true);
        expect(restoreNoteResponse.status).toBe(200);
      });
    }
  );

  test(
    "Delete Note",
    { tag: ["@smoke", "@regression"] },
    async ({ notesDashboardPage, notesClient }) => {
      const noteData = {
        title: "deleteNoteTest",
        description: "deleteNoteDescriptionTest",
        category: "Personal",
      };

      let noteId: string | undefined;

      await test.step("Setup", async () => {
        const createNoteResponse = await notesClient.createNote(noteData);
        expect(createNoteResponse.success).toBe(true);
        expect(createNoteResponse.status).toBe(200);
        noteId = createNoteResponse.data?.id;
        expect(noteId).toBeTruthy();
      });

      await test.step("Reload page", async () => {
        await notesDashboardPage.navigateNotesDashboardPage();
      });

      await test.step("Search for notes", async () => {
        await notesDashboardPage.searchNotes(noteData.title);
      });

      await test.step("Delete Note", async () => {
        await notesDashboardPage.deleteNote();
      });

      await test.step("Verify", async () => {
        await expect(
          notesDashboardPage.noteCardTitle(noteData.title)
        ).toBeHidden();
      });
    }
  );
});
