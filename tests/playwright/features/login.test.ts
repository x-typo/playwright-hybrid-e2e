import { test, expect, asUser } from "../../../fixtures/automation-fixtures";

test.use(asUser("guest"));

if (!process.env.MAIN_USERNAME || !process.env.MAIN_PASSWORD) {
  throw new Error(
    "Environment variables MAIN_USERNAME and MAIN_PASSWORD must be set for this test."
  );
}

test.beforeEach("Navigate to page", async ({ loginPage }) => {
  await loginPage.navigateLoginPage();
});

test("Page Validation", async ({ loginPage }) => {
  const expectedElement = "Login";

  await test.step("Verify", async () => {
    await expect(loginPage.heading(expectedElement)).toBeVisible();
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

test("Invalid Email Address", async ({ loginPage }) => {
  const credentials = {
    email: "invalidAddress",
    password: "password12345!",
  };
  const buttonName = "login-submit";
  const expectedElement = "Email address is invalid";

  await test.step("Enter invalid email address", async () => {
    await loginPage.enterCreds(credentials.email, credentials.password);
    await loginPage.selectTestIdSelector(buttonName);
  });
  await test.step("Verify", async () => {
    await expect(loginPage.text(expectedElement)).toBeVisible();
  });
});

test("Invalid Password", async ({ loginPage }) => {
  const credentials = {
    email: "email@email.com",
    password: "pass",
  };
  const buttonName = "login-submit";
  const expectedElement = "Password should be between 6 and 30 characters";

  await test.step("Enter invalid password", async () => {
    await loginPage.enterCreds(credentials.email, credentials.password);
    await loginPage.selectTestIdSelector(buttonName);
  });
  await test.step("Verify", async () => {
    await expect(loginPage.text(expectedElement)).toBeVisible();
  });
});

test("Successful Login", async ({ loginPage, notesDashboardPage }) => {
  const credentials = {
    email: process.env.MAIN_USERNAME!,
    password: process.env.MAIN_PASSWORD!,
  };

  await test.step("Login with valid credentials", async () => {
    await loginPage.enterCreds(credentials.email, credentials.password);
    await loginPage.selectTestIdSelector("login-submit");
  });
  await test.step("Verify", async () => {
    await expect(
      notesDashboardPage.searchInputBox("Search notes...")
    ).toBeVisible();
  });
});
