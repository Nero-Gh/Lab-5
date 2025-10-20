import { Page, expect } from "@playwright/test";

export class EmployeePage {
  constructor(private page: Page) {}

  async gotoPIM() {
    await this.page.getByRole("link", { name: "PIM" }).click();
    await this.page.waitForURL(/pim/);
    await expect(this.page.getByRole("heading", { name: "PIM" })).toBeVisible();
  }

  async clickAddEmployee() {
    const addButton = this.page.locator('button:has-text("Add")').first();
    await addButton.waitFor({ state: "visible" });
    await addButton.click();
    await expect(
      this.page.locator("h6:has-text('Add Employee')")
    ).toBeVisible();
  }

  async addEmployee(firstName: string, lastName: string) {
    await this.page.locator('input[name="firstName"]').fill(firstName);
    await this.page.locator('input[name="lastName"]').fill(lastName);
    await this.page.locator('button[type="submit"]').click();

    await Promise.race([
      this.page
        .locator("h6:has-text('Personal Details')")
        .waitFor({ timeout: 8000 })
        .catch(() => null),
      this.page
        .locator('.oxd-input-field-error-message:has-text("Required")')
        .waitFor({ timeout: 8000 })
        .catch(() => null),
    ]);
  }

  async expectEmployeeAdded() {
    await expect(
      this.page.locator("h6:has-text('Personal Details')")
    ).toBeVisible();
  }

  async expectRequiredFieldValidation() {
    const requiredMsg = this.page.locator(
      '.oxd-input-field-error-message:has-text("Required")'
    );
    await requiredMsg.first().waitFor({ state: "visible", timeout: 5000 });
    await expect(requiredMsg.first()).toBeVisible();
  }

  async uploadProfilePicture(imagePath: string) {
    const upload = this.page.locator('input[type="file"]').first();
    await upload.setInputFiles(imagePath);
    await this.page.waitForTimeout(2000);
    await expect(this.page.locator("img")).toBeVisible();
  }

  async searchEmployee(name: string) {
    await this.page
      .locator('input[placeholder="Type for hints..."]')
      .fill(name);
    await this.page.locator('button:has-text("Search")').click();
    await expect(
      this.page.locator(`.oxd-table-cell:has-text("${name}")`)
    ).toBeVisible();
  }

  async editEmployee(newFirstName: string) {
    const editIcon = this.page.locator('i[title="Edit"]').first();
    await editIcon.click();
    await this.page.locator('input[name="firstName"]').fill(newFirstName);
    await this.page.locator('button[type="submit"]').click();
    await expect(this.page.locator("text=Successfully Updated")).toBeVisible();
  }

  async deleteEmployee(name: string) {
    const row = this.page.locator(`.oxd-table-row:has-text("${name}")`);
    await row.locator('i[title="Delete"]').click();
    await this.page.getByRole("button", { name: "Yes, Delete" }).click();
    await expect(this.page.locator("text=Successfully Deleted")).toBeVisible();
  }
}
