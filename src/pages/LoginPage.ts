import { Page, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/");
  }

  async login(username: string, password: string) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');

    await Promise.race([
      this.page
        .locator("text=Dashboard")
        .first()
        .waitFor({ state: "visible", timeout: 8000 })
        .catch(() => null),

      this.page
        .locator(".oxd-alert-content")
        .first()
        .waitFor({ state: "visible", timeout: 8000 })
        .catch(() => null),

      this.page
        .locator("text=Required")
        .first()
        .waitFor({ state: "visible", timeout: 8000 })
        .catch(() => null),
    ]);
  }

  async expectDashboardVisible() {
    await this.page.locator("text=Dashboard").first();
    await expect(this.page.locator("text=Dashboard").first()).toBeVisible();
  }

  async expectLoginError() {
    const global = this.page.locator(".oxd-alert-content");
    if ((await global.count()) > 0) {
      await expect(global.first()).toBeVisible();
      return;
    }

    await expect(
      this.page
        .locator("text=Invalid credentials")
        .first()
        .or(this.page.locator(".oxd-input-field-error-text").first())
    ).toBeVisible();
  }

  async expectEmptyFieldValidation() {
    const requiredMsg = this.page.locator(
      '.oxd-input-field-error-message:has-text("Required")'
    );
    await requiredMsg.first().waitFor({ state: "visible", timeout: 5000 });
    await expect(requiredMsg.first()).toBeVisible();
  }

  async getPasswordInputType(): Promise<string | null> {
    return await this.page.getAttribute('input[name="password"]', "type");
  }

  async clickForgotPassword() {
    await this.page.getByText("Forgot your password?").click();

    await this.page
      .waitForURL(/requestPasswordResetCode|resetPassword|password/i, {
        timeout: 7000,
      })
      .catch(() => null);
  }

  async expectResetPasswordPageVisible() {
    await this.page
      .locator("text=Reset Password")
      .first()
      .waitFor({ state: "visible", timeout: 7000 })
      .catch(() => null);
    await expect(
      this.page.locator("text=Reset Password").first()
    ).toBeVisible();
  }
}
