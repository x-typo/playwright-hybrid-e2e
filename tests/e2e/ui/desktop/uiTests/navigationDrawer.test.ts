import {
  test,
  expect,
  asUser,
} from "../../../../../fixtures/automation-fixtures";

test.use(asUser("guest"));

if (!process.env.MAIN_USERNAME || !process.env.MAIN_PASSWORD) {
  throw new Error(
    "Environment variables MAIN_USERNAME and MAIN_PASSWORD must be set for this test."
  );
}

test.beforeEach("Setup", async ({ page, navigationDrawer }) => {
  await page.goto("/");
  if (navigationDrawer.isMob) {
    await navigationDrawer.selectIdSelector("sidebarCollapse");
  }
});

test("Drawer Validation", async ({ navigationDrawer }) => {
  await test.step("Verify", async () => {
    await navigationDrawer.verifyDrawer();
  });
});

test(
  "Visual Test",
  {
    tag: "@visual",
  },
  async ({ navigationDrawer }) => {
    const expectedHeading = "QA Practice";
    const snapshotName = "navigationDrawer_.png";
    const ratioAllowed = 0.02;

    await test.step("Perform Visual Test", async () => {
      await expect(navigationDrawer.heading(expectedHeading)).toBeVisible();
      expect(
        await navigationDrawer.navDrawer.screenshot({
          animations: "disabled",
        })
      ).toMatchSnapshot(snapshotName, {
        maxDiffPixelRatio: ratioAllowed,
      });
    });
  }
);

test.describe("Navigations", () => {
  test("Ecommerce", async ({ navigationDrawer }) => {
    const menuList = "Ecommerce - Login";
    const expectedHeading = "Login - Shop";

    await test.step("Select menuList", async () => {
      await navigationDrawer.selectLink(menuList);
    });
    await test.step("Verify", async () => {
      await expect(navigationDrawer.heading(expectedHeading)).toBeVisible();
    });
  });

  test("Bugs Challenge", async ({ navigationDrawer }) => {
    const menuList = "Spot the BUGS CHALLENGE";
    const expectedHeading = "CHALLENGE - Spot the BUGS!";

    await test.step("Select menuList", async () => {
      await navigationDrawer.selectLink(menuList);
    });
    await test.step("Verify", async () => {
      await expect(navigationDrawer.heading(expectedHeading)).toBeVisible();
    });
  });

  test("GraphQL Testing", async ({ navigationDrawer }) => {
    const menuList = "GraphQL Testing";
    const expectedHeading = "GraphQL Testing";

    await test.step("Select menuList", async () => {
      await navigationDrawer.selectLink(menuList);
    });
    await test.step("Verify", async () => {
      await expect(navigationDrawer.heading(expectedHeading)).toBeVisible();
    });
  });

  test("Official Website", async ({ navigationDrawer, page }) => {
    const menuList = "RV - Website";
    const expectedUrl = "https://razvanvancea.ro/";
    let page1Promise;
    let newsPage;

    await test.step("Select menuList", async () => {
      page1Promise = navigationDrawer.page.waitForEvent("popup");
      await navigationDrawer.selectMenuList(menuList);
    });
    await test.step("Verify", async () => {
      newsPage = await page1Promise;
      await expect(newsPage).toHaveURL(expectedUrl);
    });
  });
});
