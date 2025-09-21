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

  // test.fixme(
  //   "Add New Note",
  //   { tag: ["@smoke", "@regression"] },
  //   async ({ basePage, notesDashboardPage, notesClient }) => {
  //     const noteData = {
  //       title: "addNoteTest",
  //       description: "addNoteDescriptionTest",
  //     };
  //     let noteId: string | null = null;

  //     await test.step("Navigate to dashboard", async () => {
  //       await basePage.navigatePage("/notes/app");
  //     });

  //     await test.step("Add new note and capture ID", async () => {
  //       await notesDashboardPage.homeTab.click();
  //       noteId = await notesDashboardPage.addNewNote(
  //         noteData.title,
  //         noteData.description
  //       );
  //     });

  //     await test.step("Verify note creation", async () => {
  //       await expect(noteId, "should return a valid note ID").toBeDefined();
  //       await expect(typeof noteId).toBe("string");
  //       await expect(
  //         notesDashboardPage.noteCardTitle(noteData.title)
  //       ).toBeVisible();
  //     });

  //     await test.step("Teardown - delete created note", async () => {
  //       expect(
  //         noteId,
  //         "Cannot perform teardown because noteId is null."
  //       ).not.toBeNull();
  //       const response = await notesClient.deleteNoteById(noteId!);
  //       expect(
  //         response.ok(),
  //         `API teardown failed for note ID ${noteId}.`
  //       ).toBe(true);
  //     });
  //   }
  // );
});
