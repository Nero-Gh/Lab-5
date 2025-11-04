import { test } from "../../src/fixtures/base.fixture";

test("TC-LEAVE-001: Employee applies for leave @leave", async ({
  loginPage,
  leavePage,
  data,
}) => {
  await loginPage.goto();
  await loginPage.login(
    data.data.users.valid.username,
    data.data.users.valid.password
  );
  await leavePage.applyLeave("Annual Leave", "2025-10-21", "2025-10-22");
  await leavePage.expectLeaveApplied();
});
