import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { EmployeePage } from "../pages/EmployeePage";
import { LeavePage } from "../pages/LeavePage";
import { AdminPage } from "../pages/AdminPage";

export const test = base.extend<{
  loginPage: LoginPage;
  employeePage: EmployeePage;
  leavePage: LeavePage;
  adminPage: AdminPage;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  employeePage: async ({ page }, use) => {
    await use(new EmployeePage(page));
  },
  leavePage: async ({ page }, use) => {
    await use(new LeavePage(page));
  },
  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page));
  },
});

export { expect } from "@playwright/test";
