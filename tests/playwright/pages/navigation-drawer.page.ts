import { type Locator, type Page, expect } from "@playwright/test";

export class NavigationDrawer {
  readonly page: Page;
  readonly isMob: boolean | undefined;

  // LOCATOR DECLARATIONS //
  idSelector: (name: string) => Locator;
  heading: (name: string) => Locator;
  text: (name: string) => Locator;
  icon: (name: string) => Locator;
  button: (name: string) => Locator;
  link: (name: string) => Locator;
  menuItem: (name: string) => Locator;
  menuPopup: (name: string) => Locator;
  readonly navDrawer: Locator;
  readonly navBarButton: Locator;
  readonly navBarMobile: Locator;
  readonly navBarButtonMobile: Locator;

  // LOCATOR INITIALIZATIONS //
  constructor(page: Page, isMob: boolean | undefined) {
    this.page = page;
    this.isMob = isMob;

    this.idSelector = (name) => page.locator(`#${name}`);
    this.heading = (name) => page.getByRole("heading", { name: name });
    this.text = (name) => page.getByText(name);
    this.icon = (name) => page.getByTestId(name);
    this.button = (name) => page.getByRole("button", { name: name });
    this.link = (name) => page.getByRole("link", { name: name });
    this.menuItem = (name: string) =>
      page.getByRole("link", { name: new RegExp(`^${name}`) });
    this.menuPopup = (name: string) =>
      page.getByRole("tooltip", { name: new RegExp(`^${name}`) });
    this.navDrawer = page.locator("#sidebar");
    this.navBarButton = page.getByTestId("drawer-chevron");
    this.navBarMobile = page.getByTestId("mobile-navigation");
    this.navBarButtonMobile = page.getByRole("menuitem", { name: "Menu" });
  }

  // Interactions //
  async selectIdSelector(name: string) {
    await this.idSelector(name).click();
  }

  async selectMenuList(name: string) {
    await this.menuItem(name).click();
  }

  async selectIcon(name: string) {
    await this.icon(name).click();
  }

  async selectText(name: string) {
    await this.text(name).click();
  }

  async selectLink(name: string) {
    await this.link(name).click();
  }

  // Verifications //
  async verifyDrawer() {
    await expect(this.heading("QA Practice").first()).toBeVisible();
    await expect(this.link("Ecommerce - Login")).toBeVisible();
    await expect(this.link("Spot the BUGS CHALLENGE")).toBeVisible();
    await expect(this.link("GraphQL Testing")).toBeVisible();
    await expect(this.link("API Testing")).toBeVisible();
    await expect(this.link("Products List - Shop")).toBeVisible();
    await expect(this.link("Intercept API Request")).toBeVisible();
    await expect(this.link("Visual Testing - GIF Page")).toBeVisible();
    await expect(this.link("Forms")).toBeVisible();
    await expect(this.link("Buttons")).toBeVisible();
    await expect(this.link("New Tab / Window")).toBeVisible();
    await expect(this.link("Btn actions")).toBeVisible();
    await expect(this.link("Tables")).toBeVisible();
    await expect(this.link("Dropdowns")).toBeVisible();
    await expect(this.link("Iframes")).toBeVisible();
    await expect(this.link("Alerts")).toBeVisible();
    await expect(this.link("File Upload")).toBeVisible();
    await expect(this.link("Date Pickers")).toBeVisible();
    await expect(this.link("Loader")).toBeVisible();
    await expect(this.link("Pagination")).toBeVisible();
    await expect(this.link("RV - Website")).toBeVisible();
    await expect(this.link("Let's connect - LinkedIn")).toBeVisible();
    await expect(this.link("Learn with RV - YouTube")).toBeVisible();
  }
}
