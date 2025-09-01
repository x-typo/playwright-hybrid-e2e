import { test, expect } from "../../../../../fixtures/automation-fixtures";

test.beforeAll("UNDER CONSTRUCT", async ({}) => {
  test.skip();
});

test.describe("Location Notes", () => {
  test.beforeEach(
    "Navigate to the location Notes page",
    async ({ notesPage }) => {
      await notesPage.navigateA_LocationNotesPage();
    }
  );

  test("Verify Location Notes Page Navigation", async ({
    customersListPage,
    notesPage,
  }) => {
    await test.step("Navigate to page", async () => {
      await customersListPage.navigateCustomersListPage();
      await customersListPage.selectCustomer("_QA_Test_Customer");
      await notesPage.selectLocationNotesTab();
    });
    await test.step("Verify page", async () => {
      await notesPage.verifyLocationNotesPage();
    });
  });

  test("Verify Page", async ({ notesPage }) => {
    await test.step("Verify the page", async () => {
      await notesPage.verifyLocationNotesPage();
    });
  });

  test("Verify Location Notes Updated", async ({
    notesPage,
    generateRandomText,
  }) => {
    await test.step("Update the location's notes", async () => {
      await notesPage.updateNotes(generateRandomText());
    });
    await test.step("Verify location's notes is updated", async () => {
      await expect(
        notesPage.snackBar("The notes for this location have been updated.")
      ).toBeVisible();
    });
  });
});

test.describe("Device Notes", () => {
  test.beforeEach(
    "Navigate to the device Notes page",
    async ({ notesPage }) => {
      await notesPage.navigateA_Location310RouterNotesPage();
    }
  );

  test("Verify Device Notes Page Navigation", async ({
    customersListPage,
    notesPage,
  }) => {
    await test.step("Navigate to page", async () => {
      await customersListPage.navigateCustomersListPage();
      await customersListPage.selectCustomer("_QA_Test_Customer");
      await devicesListPage.selectDevicesListTab();
      await devicesListPage.searchDevice("AN-310-RT-4L2W Router");
      await devicesListPage.selectDevice("AN-310-RT-4L2W Router");
      await notesPage.selectDeviceNotesTab();
    });
    await test.step("Verify page", async () => {
      await notesPage.verifyDeviceNotesPage();
    });
  });

  test("Verify Page", async ({ notesPage }) => {
    await test.step("Verify page", async () => {
      await notesPage.verifyDeviceNotesPage();
    });
  });

  test("Verify Device Notes Updated", async ({
    notesPage,
    generateRandomText,
  }) => {
    await test.step("Update the device notes", async () => {
      await notesPage.updateNotes(generateRandomText());
    });
    await test.step("Verify device notes is updated", async () => {
      await expect(
        notesPage.snackBar("The notes for this device have been updated.")
      ).toBeVisible();
    });
  });
});
