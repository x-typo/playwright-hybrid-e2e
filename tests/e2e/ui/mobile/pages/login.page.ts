import { $ } from "@wdio/globals";
import Page from "./index.page.ts";

class LoginPage extends Page {
  get emailInputBox() {
    const selector = "//input[@type='email']";
    return $(selector);
  }
  get passwordInputBox() {
    const selector = "//input[@type='password']";
    return $(selector);
  }
  get createAccountButton() {
    const selector = "//*[contains(text(), 'Create an Account')]";
    return $(selector);
  }
  get forgotPasswordButton() {
    const selector = "//*[@id='button__forgotPassword']";
    return $(selector);
  }
  get loginButton() {
    const selector = "//*[@id='button__login']";
    return $(selector);
  }

  //INTERACTION//
  async loginQaAccount() {
    await this.emailInputBox.setValue("email@email.com");
    await this.passwordInputBox.setValue("password");
    await this.loginButton.click();
  }
}

export default new LoginPage();
