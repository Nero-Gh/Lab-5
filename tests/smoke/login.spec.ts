import { expect, test } from "../../src/fixtures/base.fixture";
import { LoginPage } from "../../src/pages/LoginPage";

test.describe("Authentication Module", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("TC-AUTH-001: Verify user can login with valid credentials @smoke", async ({
    page,
  }) => {
    await loginPage.login("Admin", "admin123");
    await loginPage.expectDashboardVisible();

    await expect(page).toHaveScreenshot("dashboard-valid-login.png", {
      maxDiffPixelRatio: 0.02,
    });
  });

  test("TC-AUTH-002: Verify login fails with invalid credentials", async () => {
    await loginPage.login("wrongUser", "wrongPass");
    await loginPage.expectLoginError();
  });

  test("TC-AUTH-003: Verify password field masks user input", async () => {
    const inputType = await loginPage.getPasswordInputType();
    expect(inputType).toBe("password");
  });

  test("TC-AUTH-004: Verify login fails with empty fields", async ({
    page,
    loginPage,
  }) => {
    await loginPage.login("", "");
    try {
      await loginPage.expectEmptyFieldValidation();
    } catch (err) {
      await page.screenshot({ path: "debug-empty-fields.png", fullPage: true });
      throw err;
    }
  });

  test("TC-AUTH-005: Verify Forgot Password link works", async () => {
    await loginPage.clickForgotPassword();
    await loginPage.expectResetPasswordPageVisible();
  });
});
