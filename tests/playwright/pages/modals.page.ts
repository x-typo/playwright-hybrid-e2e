import { type Locator, type Page, expect } from "@playwright/test";

export class ModalsPage {
  readonly page: Page;
  readonly isMob: boolean | undefined;

  // LOCATOR DECLARATIONS //
  snackBar: (message: string) => Locator;
  button: (name: string) => Locator;
  heading: (name: string) => Locator;
  text: (name: string) => Locator;
  inputBox: (name: string) => Locator;
  icon: (name: string) => Locator;
  radio: (name: string) => Locator;
  checkbox: (name: string) => Locator;
  comboBox: (name: string) => Locator;
  option: (name: string) => Locator;

  // LOCATOR INITIALIZATIONS //
  constructor(page: Page, isMob: boolean | undefined) {
    this.page = page;
    this.isMob = isMob;

    this.snackBar = (message: string) => page.getByText(message);
    this.button = (name) => page.getByRole("button", { name: name });
    this.heading = (name) => page.getByRole("heading", { name: name });
    this.text = (name) => page.getByText(name);
    this.inputBox = (name) => page.getByRole("textbox", { name: name });
    this.icon = (name) =>
      page.locator("div.MuiDialogContent-root").getByTestId(name);
    this.radio = (name) => page.getByRole("radio", { name: name });
    this.checkbox = (name) => page.getByRole("checkbox", { name: name });
    this.comboBox = (name) => page.getByRole("combobox", { name: name });
    this.option = (name) => page.getByRole("option", { name: name });
  }

  // Interactions //
  async selectButton(name: string) {
    await this.button(name).click();
    await this.page.waitForTimeout(1000);
  }

  async selectText(name: string) {
    await this.text(name).click();
  }

  async selectOption(name) {
    await this.option(name).click();
  }

  async selectIcon(name) {
    await this.icon(name).click();
  }

  async selectComboBox(name) {
    await this.comboBox(name).click();
  }

  async deleteLocationCustomer({ confirmationText, modalType }) {
    await this.button("Yes, Continue").click();
    await this.inputBox("").fill(confirmationText);
    await this.button(`Delete ${modalType}`).click();
    await this.page.waitForTimeout(1000);
  }

  // Verifications //
  async verifyDeleteLocationCustomerModalBase(modalType) {
    if (modalType === "customer") {
      await expect(this.text("all locations associated")).toBeVisible();
    }
    await expect(this.heading(`Delete ${modalType}`)).toBeVisible();
    await expect(this.text(`Selected ${modalType}`)).toBeVisible();
    await expect(this.text(`delete this ${modalType}`)).toBeVisible();
    await expect(this.button("Cancel")).toBeVisible();
    await this.selectButton("Yes, Continue");
    await expect(
      this.text(
        `To delete the selected ${modalType}, type ‘DELETE ${modalType}’`
      )
    ).toBeVisible();
    await expect(this.inputBox("")).toBeVisible();
    await expect(this.button(`Delete ${modalType}`)).toBeVisible();
  }

  async verifyDeleteLocationCustomerModalHaveDevice(modalType) {
    await expect(this.text(`assigned to this ${modalType}`)).toBeVisible();
    await expect(this.text(`What to do with this ${modalType}`)).toBeVisible();
    await expect(this.radio("Delete devices")).toBeVisible();
    await expect(this.radio("Send devices")).toBeVisible();
    await this.verifyDeleteLocationCustomerModalBase(modalType);
  }
}
