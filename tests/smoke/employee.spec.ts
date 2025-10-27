import { EmployeePage } from "../../src/pages/EmployeePage";
import { test } from "../../src/fixtures/base.fixture";

test.describe("Employee (PIM) Module", () => {
  let employeePage: EmployeePage;

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login("Admin", "admin123");
    employeePage = new EmployeePage(page);
  });

  test("TC-EMP-001: Verify Admin can navigate to PIM module @smoke", async () => {
    await employeePage.gotoPIM();
  });

  test("TC-EMP-002: Verify Admin can add new employee", async () => {
    await employeePage.gotoPIM();
    await employeePage.clickAddEmployee();
    await employeePage.addEmployee("John", "Doe");
  });

  test("TC-EMP-003: Verify required field validation on Add Employee form", async () => {
    await employeePage.gotoPIM();
    await employeePage.clickAddEmployee();
    await employeePage.addEmployee("", "");
    await employeePage.expectRequiredFieldValidation();
  });

  test("TC-EMP-004: Verify Admin can upload profile picture for employee", async () => {
    await employeePage.gotoPIM();
    await employeePage.clickAddEmployee();
    await employeePage.addEmployee("Michael", "Scott");
    await employeePage.uploadProfilePicture("tests/resources/profile.jpg");
  });

  test("TC-EMP-005: Verify Admin can edit existing employee details", async () => {
    await employeePage.gotoPIM();
    await employeePage.searchEmployee("John Doe");
    await employeePage.editEmployee("Johnny");
  });

  test("TC-EMP-006: Verify Admin can delete employee record", async () => {
    await employeePage.gotoPIM();
    await employeePage.searchEmployee("Johnny");
    await employeePage.deleteEmployee("Johnny");
  });
});
