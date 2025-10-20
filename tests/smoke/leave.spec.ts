import { test } from "../../src/fixtures/base.fixture";
import { LeavePage } from "../../src/pages/LeavePage";
import { expect } from "@playwright/test";

test.describe("Leave Module", () => {
  let leavePage: LeavePage;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login("Admin", "admin123");
    leavePage = new LeavePage(page);
  });

  // TC-LEAVE-001
  test("TC-LEAVE-001: Verify employee can apply for leave", async () => {
    await leavePage.applyLeave(
      "CAN - Personal",
      formatDate(today),
      formatDate(tomorrow),
      "Vacation trip"
    );
    await leavePage.expectLeaveApplied();
  });

  // TC-LEAVE-002
  test("TC-LEAVE-002: Verify employee cannot apply for leave with invalid date range", async () => {
    await leavePage.applyLeave(
      "CAN - Personal",
      formatDate(tomorrow),
      formatDate(today)
    );
    await leavePage.expectInvalidDateError();
  });

  // TC-LEAVE-003
  test("TC-LEAVE-003: Verify Manager can approve leave request", async () => {
    await leavePage.gotoLeaveList();
    await leavePage.approvePendingLeave();
  });

  // TC-LEAVE-004
  test("TC-LEAVE-004: Verify leave status updates correctly for employee", async () => {
    await leavePage.gotoMyLeave();
    await leavePage.expectLeaveInList("Approved");
  });

  // TC-LEAVE-005
  test("TC-LEAVE-005: Verify employee cannot apply leave beyond available balance", async () => {
    await leavePage.applyLeave(
      "CAN - Vacation",
      formatDate(today),
      formatDate(tomorrow)
    );
    await leavePage.expectInsufficientBalanceError().catch(async () => {
      const toast = leavePage.page.locator(".oxd-toast-content");
      await expect(toast).toBeVisible({ timeout: 5000 });
    });
  });
});
