import { browser } from "@wdio/globals";

/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class Page {
  /**
   * Opens a sub page of the page
   * @param path path of the sub page (e.g. /path/to/page.html)
   */
  public openURL() {
    return browser.url(`https://desktop.dev.tbd.com/#/login`);
  }

  /**
   * Clears the value from a text field on mobile by using the appropriate key code
   * based on the platform (iOS or Android).
   * @param element
   */
  async clearValue(element) {
    const count = (await element.getAttribute("value")).length;
    await element.click();
    for (let i = 0; i < count; i++) {
      if (browser.isIOS) {
        await element.addValue("\uE003");
      } else {
        await browser.pressKeyCode(67);
      }
    }
  }
}
