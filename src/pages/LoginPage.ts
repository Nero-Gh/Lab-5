import { Page, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/");
  }

  /**
   * Clicks login and waits for either a dashboard indicator or an error/validation
   * Uses tolerant waits because OrangeHRM loads dynamically.
   */
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

  /** Waits and asserts that Dashboard is visible (successful login). */
  async expectDashboardVisible() {
    await this.page
      .locator("text=Dashboard")
      .first()
      .waitFor({ state: "visible", timeout: 8000 });
    await expect(this.page.locator("text=Dashboard").first()).toBeVisible();
  }

  /** Waits for either the global invalid-credentials alert or any visible alert */
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

  /**
   * Specifically check for inline Required validation messages displayed on empty fields.
   * This is used for TC-AUTH-004.
   */
  async expectEmptyFieldValidation() {
    const requiredMsg = this.page.locator(
      '.oxd-input-field-error-message:has-text("Required")'
    );
    await requiredMsg.first().waitFor({ state: "visible", timeout: 5000 });
    await expect(requiredMsg.first()).toBeVisible();
  }

  /** Returns the input type of the password field (should be "password"). */
  async getPasswordInputType(): Promise<string | null> {
    return await this.page.getAttribute('input[name="password"]', "type");
  }

  /** Clicks the "Forgot your password?" link and waits for reset page to load. */
  async clickForgotPassword() {
    await this.page.getByText("Forgot your password?").click();

    await this.page
      .waitForURL(/requestPasswordResetCode|resetPassword|password/i, {
        timeout: 7000,
      })
      .catch(() => null);
  }

  /** Verifies the reset password page is visible. */
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
