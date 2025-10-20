import { Page, expect } from "@playwright/test";

export class LeavePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Go to Leave module */
  async gotoLeaveModule() {
    await this.page.getByRole("link", { name: /^Leave$/ }).click();
    await this.page.waitForURL(/leave/i);
    await expect(this.page.locator("h6:has-text('Leave')")).toBeVisible();
  }

  /** Navigate to Apply Leave tab */
  async gotoApplyLeave() {
    await this.gotoLeaveModule();
    await this.page.getByRole("link", { name: "Apply" }).click();
    await expect(this.page.locator("h6:has-text('Apply Leave')")).toBeVisible();
  }

  /** Select Leave Type properly */
  async selectLeaveType(typeName: string) {
    const dropdown = this.page.locator(".oxd-select-text").first();
    await dropdown.click();
    const option = this.page
      .locator(`.oxd-select-option:has-text("${typeName}")`)
      .first();
    await option.click();
  }

  /** Apply Leave */
  async applyLeave(
    type: string,
    fromDate: string,
    toDate: string,
    comment?: string
  ) {
    await this.gotoApplyLeave();
    await this.selectLeaveType(type);

    const inputs = this.page.locator('input[placeholder="yyyy-mm-dd"]');
    await inputs.first().fill(fromDate);
    await inputs.nth(1).fill(toDate);

    if (comment) await this.page.locator("textarea").fill(comment);
    await this.page.getByRole("button", { name: "Apply" }).click();
  }

  /** Expect success toast */
  async expectLeaveApplied() {
    const toast = this.page.locator(
      ".oxd-toast-content:has-text('Successfully Submitted')"
    );
    await expect(toast).toBeVisible({ timeout: 8000 });
  }

  /** Expect validation for invalid date range */
  async expectInvalidDateError() {
    const err = this.page.locator(".oxd-input-field-error-message");
    await expect(err).toContainText(["Should be after"], { timeout: 8000 });
  }

  /** Go to My Leave list */
  async gotoMyLeave() {
    await this.gotoLeaveModule();
    await this.page.getByRole("link", { name: "My Leave" }).click();
    await expect(this.page.locator("h6:has-text('My Leave')")).toBeVisible();
  }

  /** Check that at least one leave row is visible */
  async expectLeaveInList(status?: string) {
    const row = status
      ? this.page.locator(`.oxd-table-row:has-text("${status}")`).first()
      : this.page.locator(".oxd-table-row").first();

    await expect(row).toBeVisible({ timeout: 8000 });
  }

  /** Go to Leave List (Manager view) */
  async gotoLeaveList() {
    await this.gotoLeaveModule();
    await this.page.getByRole("link", { name: "Leave List" }).click();
    await expect(this.page.locator("h6:has-text('Leave List')")).toBeVisible();
  }

  /** Approve the first Pending leave */
  async approvePendingLeave() {
    const pending = this.page
      .locator('.oxd-table-row:has-text("Pending")')
      .first();
    await pending.waitFor({ state: "visible", timeout: 8000 });

    const actionBtn = pending.locator("button i.oxd-icon.bi-check");
    await actionBtn.first().click();

    const toast = this.page.locator(
      ".oxd-toast-content:has-text('Successfully Updated')"
    );
    await expect(toast).toBeVisible({ timeout: 8000 });
  }

  /** Expect Insufficient Leave Balance error */
  async expectInsufficientBalanceError() {
    const toast = this.page.locator(
      ".oxd-toast-content:has-text('Insufficient Leave Balance')"
    );
    await expect(toast).toBeVisible({ timeout: 8000 });
  }
}
