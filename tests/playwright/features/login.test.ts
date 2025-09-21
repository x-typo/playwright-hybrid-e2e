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

test(
  "Page Validation",
  { tag: ["@smoke", "@regression"] },
  async ({ loginPage }) => {
    await test.step("Verify", async () => {
      await expect(loginPage.loginPageHeading).toBeVisible();
    });
  }
);

test(
  "Visual Test",
  { tag: ["@visual", "@smoke", "@regression"] },
  async ({ loginPage }) => {
    const snapshotName = "loginPage_.png";
    const ratioAllowed = 0.03;

    await test.step("Perform visual comparison", async () => {
      await expect(loginPage.emailInputBox).toBeVisible();
      expect(
        await loginPage.page.screenshot({
          animations: "disabled",
          mask: [loginPage.googleLoginButton],
        })
      ).toMatchSnapshot(snapshotName, { maxDiffPixelRatio: ratioAllowed });
    });
  }
);

// test.skip(
//   "Accessibility Test",
//   { tag: "@accessibility" },
//   async ({ loginPage, performAccessibilityScan }) => {
//     await test.step("Run accessibility scan", async () => {
//       await expect(loginPage.inputBox("Email")).toBeVisible();
//       const results = await performAccessibilityScan();
//       await expect.soft(results).toEqual(0);
//     });
//   }
// );

test("Invalid Email Address", async ({ loginPage }) => {
  await test.step("Submit invalid email address", async () => {
    await loginPage.login({
      emailAddress: "invalidAddress",
      password: "password12345!",
    });
  });

  await test.step("Verify", async () => {
    await expect(loginPage.text("Email address is invalid")).toBeVisible();
  });
});

test("Invalid Password", async ({ loginPage }) => {
  await test.step("Submit invalid password", async () => {
    await loginPage.login({
      emailAddress: "email@email.com",
      password: "pass",
    });
  });

  await test.step("Verify", async () => {
    await expect(
      loginPage.text("Password should be between 6 and 30 characters")
    ).toBeVisible();
  });
});

test("Successful Login", async ({ loginPage, notesDashboardPage }) => {
  const validCreds = {
    emailAddress: process.env.MAIN_USERNAME!,
    password: process.env.MAIN_PASSWORD!,
  };

  await test.step("Login with valid credentials", async () => {
    await loginPage.login(validCreds);
  });

  await test.step("Verify", async () => {
    await expect(notesDashboardPage.myNotesLinkButton).toBeVisible();
  });
});
