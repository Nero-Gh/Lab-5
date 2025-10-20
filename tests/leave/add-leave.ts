import { test } from "../../src/fixtures/base.fixture";

test("TC-LEAVE-001: Employee applies for leave @leave", async ({
  loginPage,
  leavePage,
}) => {
  await loginPage.goto();
  await loginPage.login("Admin", "admin123");
  await leavePage.applyLeave("Annual Leave", "2025-10-21", "2025-10-22");
});
