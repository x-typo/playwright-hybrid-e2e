import { test, expect, asUser } from "../../../fixtures/automation-fixtures";

test.use(asUser("guest"));

if (!process.env.MAIN_USERNAME || !process.env.MAIN_PASSWORD) {
  throw new Error(
    "Environment variables MAIN_USERNAME and MAIN_PASSWORD must be set for this test."
  );
}

test.beforeEach("Navigate to Login page", async ({ loginPage }) => {
  await loginPage.navigateLoginPage();
});

test("Page Validation", async ({ loginPage }) => {
  await test.step("Verify", async () => {
    await loginPage.verifyPage();
  });
});

test(
  "Visual Test",
  {
    tag: "@visual",
  },
  async ({ loginPage }) => {
    const expectedElement = "email";
    const maskedElement = "login-with-google";
    const snapshotName = "loginPage_.png";
    const ratioAllowed = 0.03;

    await test.step("Perform Visual Test", async () => {
      await expect(loginPage.idSelector(expectedElement)).toBeVisible();
      expect(
        await loginPage.page.screenshot({
          animations: "disabled",
          mask: [loginPage.testIdSelector(maskedElement)],
        })
      ).toMatchSnapshot(snapshotName, { maxDiffPixelRatio: ratioAllowed });
    });
  }
);

test.skip(
  "Accessibility Test",
  {
    tag: "@accessibility",
  },
  async ({ loginPage, performAccessibilityScan }) => {
    await test.step("Perform Accessibility Test", async () => {
      await expect(loginPage.inputBox("Email")).toBeVisible();
      const results = await performAccessibilityScan();
      await expect.soft(results).toEqual(0);
    });
  }
);

test.skip("Credentials Error", async ({ loginPage }) => {
  await test.step("Enter Invalid Credentials", async () => {
    await loginPage.enterCreds("invalid@snapone.com", "invalid");
    await loginPage.selectButton("Submit");
  });
  await test.step("Verify", async () => {
    await expect(loginPage.text("Bad credentials")).toBeVisible();
  });
});

test.skip("Successful Login", async ({ loginPage, customersListPage }) => {
  await test.step("Select 'Submit' button", async () => {
    await loginPage.enterCreds(
      process.env.MAIN_USERNAME,
      process.env.MAIN_PASSWORD
    );
    await loginPage.selectButton("Submit");
  });
  await test.step("Verify", async () => {
    await expect(customersListPage.heading("SHOPPING CART")).toBeVisible();
  });
});
