import { test, expect } from "@playwright/test";

test.describe("Truck Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await page.getByLabel("Email").fill("malla.varshini03@gmail.com");
    await page.getByLabel("Password").fill("Varshini@123");
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.getByRole("link", { name: "Trucks" }).click();
  });

  test.describe("Truck List Page", () => {
    test("can navigate to add truck page", async ({ page }) => {
      await page.getByRole("button", { name: "Add New Truck" }).click();
      await expect(
        page.getByRole("heading", { name: "Add New Truck" })
      ).toBeVisible();
    });
  });

  test.describe("Truck Details Page", () => {
    test("shows truck details", async ({ page }) => {
      await page.getByRole("link", { name: "AP30S6323" }).click();

      await expect(
        page.getByRole("heading", { name: "Truck Details" })
      ).toBeVisible();
      await expect(page.getByText("Plate Number:")).toBeVisible();
      await expect(page.getByText("AP30S6323")).toBeVisible();
    });
  });

  test.describe("Truck Form", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole("button", { name: "Add New Truck" }).click();
    });

    test("creates a new truck", async ({ page }) => {
      const randomPlate = `AP30S${Math.floor(Math.random() * 10000)}`;

      await page.getByLabel("Plate Number").fill(randomPlate);
      await page.getByLabel("Condition").selectOption("active");
      await page.getByLabel("Mileage Factor").fill("90");
      await page.getByRole("button", { name: "Save Truck" }).click();
      await expect(page.getByText("Truck created successfully")).toBeVisible();
    });

    // Add New Truck Navigation
    test("navigates to add truck form", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: "Add New Truck" })
      ).toBeVisible();
    });

    // API Failure
    test("shows error when API fails", async ({ page }) => {
      await page.route("**/api/trucks", (route) =>
        route.fulfill({ status: 500, body: "" })
      );
      await page.goto("http://localhost:3000/trucks");
      await expect(page.getByText("Error loading trucks")).toBeVisible();
    });
  });

  test.describe("Truck API Mock", () => {
    test("shows empty state with no trucks", async ({ page }) => {
      await page.route("**/api/trucks", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]), // fake empty list
        });
      });

      await page.goto("http://localhost:3000/trucks");
      await expect(page.getByText("No trucks available")).toBeVisible();
    });
  });
});
