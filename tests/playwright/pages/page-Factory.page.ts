import { Page } from "@playwright/test";
import { LoginPage } from "./login.page";
import { NotesDashboardPage } from "./notes-dashboard.page";

export class PageFactory {
  constructor(
    private page: Page,
    private isMobile: boolean | undefined
  ) {}

  getLoginPage(): LoginPage {
    return new LoginPage(this.page, this.isMobile);
  }

  getNotesDashboardPage(): NotesDashboardPage {
    return new NotesDashboardPage(this.page, this.isMobile);
  }
}
