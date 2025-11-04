import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { EmployeePage } from "../pages/EmployeePage";
import { LeavePage } from "../pages/LeavePage";
import { AdminPage } from "../pages/AdminPage";
import { TestFixtures } from "../model/model";
import testData from "./testData.json";

export const test = base.extend<{
  loginPage: LoginPage;
  employeePage: EmployeePage;
  leavePage: LeavePage;
  adminPage: AdminPage;
  data: TestFixtures;
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
  data: async ({}, use) => {
    await use(testData as unknown as TestFixtures);
  },
});

export { expect } from "@playwright/test";
