import { Page } from "@playwright/test";

export class AdminPage {
  constructor(private page: Page) {}

  async openAdminModule() {
    await this.page.click("span:has-text(data.data.users.valid.username)");
  }

  async changeUserRole(username: string, role: string) {
    await this.page.fill('input[placeholder="Username"]', username);
    await this.page.selectOption('select[name="role"]', role);
    await this.page.click('button:has-text("Save")');
  }
}
