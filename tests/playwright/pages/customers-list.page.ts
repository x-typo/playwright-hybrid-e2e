import { type Locator, type Page, expect } from "@playwright/test";

export class CustomersListPage {
  readonly page: Page;
  readonly isMob: boolean | undefined;

  // LOCATOR DECLARATIONS //
  selector: (name: string) => Locator;
  heading: (name: string) => Locator;
  text: (text: string) => Locator;
  link: (name: string) => Locator;
  icon: (name: string) => Locator;
  button: (name: string) => Locator;
  radio: (name: string) => Locator;
  checkbox: (name: string) => Locator;
  searchBox: (listType: string, name: string) => Locator;
  columnHeader: (listType: string, name: string) => Locator;
  rowStatus: (customer: string, status: string) => Locator;
  rowLink: (name: string, link: string) => Locator;
  rowText: (text: string) => Locator;
  rowButton: (listType: string, name: string) => Locator;
  readonly rowMenuButton: Locator;
  cardLink: (name: string, link: string) => Locator;
  cardText: (text: string) => Locator;
  cardButton: (button: string) => Locator;
  acceptDenyCustomer: (name: string, button: string) => Locator;

  // LOCATOR INITIALIZATIONS //
  constructor(page: Page, isMob: boolean | undefined) {
    this.page = page;
    this.isMob = isMob;

    this.selector = (name) => page.locator(`#${name}`);
    this.heading = (name) => page.getByRole("heading", { name: name });
    this.text = (text) => page.getByText(text);
    this.link = (name) => page.getByRole("link", { name: name, exact: true });
    this.icon = (name) => page.getByTestId(name).first();
    this.button = (name) => page.getByRole("button", { name: name });
    this.radio = (name) => page.getByRole("radio", { name: name });
    this.checkbox = (name) => page.getByRole("checkbox", { name: name });
    this.searchBox = (listType, name) =>
      page.locator(`#${listType}`).getByPlaceholder(name);
    this.columnHeader = (listType, name) =>
      page.locator(`#${listType}`).getByRole("columnheader", { name }).first();
    this.rowStatus = (customer, status) =>
      page
        .getByRole("presentation")
        .getByRole("row", { name: customer })
        .getByTestId(`${status}OutlinedIcon`);
    this.rowLink = (name, link) =>
      page.getByRole("row", { name: name }).getByRole("link", { name: link });
    this.rowText = (text) => page.getByRole("row").getByText(text);
    this.rowButton = (listType, name) =>
      page.locator(`#${listType}`).getByRole("button", { name: name });
    this.rowMenuButton = page.getByRole("row").getByTestId("MoreVertIcon");
    this.cardLink = (link) =>
      page.locator("div.MuiCard-root").getByRole("link", { name: link });
    this.cardText = (text) =>
      page.locator("div.MuiCard-root").getByText(text, { exact: true });
    this.cardButton = (button) =>
      page.locator("div.MuiCard-root").getByTestId(button);
    this.acceptDenyCustomer = (name, button) =>
      page.getByRole("row", { name: name }).locator(`[data-field="${button}"]`);
  }

  // Navigations //
  async navigateCustomersListPage() {
    await this.page.goto("#/customers");
  }

  // Interactions //
  async search(list, name) {
    if (await this.rowButton(list, "Clear").isVisible()) {
      await this.rowButton(list, "Clear").click();
    }
    await this.searchBox(list, "Search").fill(name);
    await this.page.waitForTimeout(500);
  }

  async selectLink(name) {
    await this.link(name).click();
  }

  async selectIcon(name) {
    await this.icon(name).click();
  }

  async selectText(text) {
    await this.text(text).click();
  }

  async selectButton(name) {
    await this.button(name).click();
  }

  async selectRowButton({ listType, buttonName }) {
    await this.rowButton(listType, buttonName).click();
  }

  async selectViewBy(option) {
    await this.button("View By").click();
    await this.radio(option).click();
  }

  // Verifications //
  async verifyPageTableView() {
    const listType = "customerList";

    await this.search("customerList", "test_Customer");
    await expect(this.heading("Customers")).toBeVisible();
    await expect(this.searchBox(listType, "Search")).toBeVisible();
  }

  async verifySearchResultTableView({ expectedName, notExpectedName }) {
    await expect(this.rowLink(expectedName, expectedName)).toBeVisible();
    await expect(this.rowLink(notExpectedName, notExpectedName)).toBeHidden();
  }

  async verifyElementStateAfterUpdate({
    verification,
    options = {},
  }: {
    verification: {
      searchQuery: string;
      expectedText: string;
      state?: "visible" | "hidden";
    };
    options?: {
      retries?: number;
      timeout?: number;
    };
  }) {
    const { searchQuery, expectedText, state = "visible" } = verification;
    const { retries = 8, timeout = 2000 } = options || {};

    let isStateCorrect = false;
    let retryCount = 0;

    while (retryCount < retries && !isStateCorrect) {
      await this.page.waitForTimeout(timeout);
      await this.navigateCustomersListPage();
      await this.link("Add Customer").click();
      await this.navigateCustomersListPage();

      await this.search(searchQuery);

      const element = this.text(expectedText);
      if (state === "visible") {
        isStateCorrect = await element.isVisible();
      } else {
        isStateCorrect = await element.isHidden();
      }
      retryCount++;
    }

    const stateDescription = state === "visible" ? "visible" : "hidden";
    expect(
      isStateCorrect,
      `Expected text "${expectedText}" to be ${stateDescription} after update, but it was not.`
    ).toBe(true);
  }
}
