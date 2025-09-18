import { Page } from "@playwright/test";
import { LoginPage } from "../tests/playwright/pages/login.page";
import { NavigationDrawer } from "../tests/playwright/pages/navigation-drawer.page";
import { CustomersListPage } from "../tests/playwright/pages/customers-list.page";
import { NotesDashboardPage } from "../tests/playwright/pages/notes-dashboard.page";
import { ModalsPage } from "../tests/playwright/pages/modals.page";
import { BasePage } from "../tests/playwright/pages/base.page";

export class PageFactory {
  private page: Page;
  private isMobile: boolean;
  private instances = new Map<string, any>();

  constructor(page: Page, isMobile: boolean) {
    this.page = page;
    this.isMobile = isMobile;
  }

  getLoginPage() {
    return this.get("loginPage", LoginPage);
  }

  getNavigationDrawer() {
    return this.get("navigationDrawer", NavigationDrawer);
  }

  getCustomersListPage() {
    return this.get("customersListPage", CustomersListPage);
  }

  getNotesDashboardPage() {
    return this.get("notesDashboardPage", NotesDashboardPage);
  }

  getModalsPage() {
    return this.get("modalsPage", ModalsPage);
  }

  getBasePage() {
    return this.get("basePage", BasePage);
  }

  private get<T>(
    key: string,
    Type: new (page: Page, isMobile: boolean) => T
  ): T {
    if (!this.instances.has(key)) {
      this.instances.set(key, new Type(this.page, this.isMobile));
    }
    return this.instances.get(key);
  }
}
