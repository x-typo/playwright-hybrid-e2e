import { test, expect, asUser } from "../../../fixtures/automation-fixtures";

test.use(asUser("guest"));

if (!process.env.MAIN_USERNAME || !process.env.MAIN_PASSWORD) {
  throw new Error(
    "Environment variables MAIN_USERNAME and MAIN_PASSWORD must be set for this test."
  );
}

test.beforeEach("Navigate to page", async ({ basePage }) => {
  await basePage.navigatePage("/notes/app/login");
});

test(
  "Page Validation",
  {
    tag: ["@smoke", "@regression"],
  },
  async ({ loginPage }) => {
    await test.step("Verify", async () => {
      await expect(loginPage.loginPageHeading).toBeVisible();
    });
  }
);

test(
  "Visual Test",
  {
    tag: ["@visual", "@smoke", "@regression"],
  },
  async ({ loginPage }) => {
    const snapshotName = "loginPage_.png";
    const ratioAllowed = 0.03;

    await test.step("Perform Visual Test", async () => {
      await expect(loginPage.emailInptutBox).toBeVisible();
      expect(
        await loginPage.page.screenshot({
          animations: "disabled",
          mask: [loginPage.googleLoginButton],
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
  const expectedText = "Email address is invalid";

  await test.step("Enter invalid email address", async () => {
    await loginPage.login(credentials.email, credentials.password);
  });
  await test.step("Verify", async () => {
    await expect(loginPage.text(expectedText)).toBeVisible();
  });
});

test("Invalid Password", async ({ loginPage }) => {
  const credentials = {
    email: "email@email.com",
    password: "pass",
  };
  const expectedText = "Password should be between 6 and 30 characters";

  await test.step("Enter invalid password", async () => {
    await loginPage.login(credentials.email, credentials.password);
  });
  await test.step("Verify", async () => {
    await expect(loginPage.text(expectedText)).toBeVisible();
  });
});

test("Successful Login", async ({ loginPage, notesDashboardPage }) => {
  const credentials = {
    email: process.env.MAIN_USERNAME!,
    password: process.env.MAIN_PASSWORD!,
  };

  await test.step("Login with valid credentials", async () => {
    await loginPage.login(credentials.email, credentials.password);
  });
  await test.step("Verify", async () => {
    await expect(notesDashboardPage.searchInputBox).toBeVisible();
  });
});
