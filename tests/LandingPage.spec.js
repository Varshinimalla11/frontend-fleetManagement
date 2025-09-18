import { test, expect } from "@playwright/test";

test.describe("Landing Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("landing page loads with title and tagline", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Fleet Flow/i })
    ).toBeVisible();
    await expect(
      page.getByText(/Safety. Efficiency. Excellence./)
    ).toBeVisible();
  });

  test("login button is visible on landing page", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Login/i })).toBeVisible();
  });

  test("register button is visible on landing page", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Register/i })).toBeVisible();
  });

  test("navigates to login page on login button click", async ({ page }) => {
    await page.getByRole("button", { name: /Login/i }).click();
    await expect(page).toHaveURL(/.*login/);
  });

  test("navigates to register page on register button click", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Register/i }).click();
    await expect(page).toHaveURL(/.*send-otp/);
  });
});

test.describe("Landing Page - Mobile View", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("mobile view shows landing page correctly", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await expect(
      page.getByRole("heading", { name: /Fleet Flow/i })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Login/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Register/i })).toBeVisible();
  });
});
