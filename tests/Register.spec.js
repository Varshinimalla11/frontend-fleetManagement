import { test, expect } from "@playwright/test";

test.describe("User Registration Flow", () => {
  test("should complete registration via Send OTP, Verify OTP, and Register pages", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("button", { name: /Register/i }).click();

    await expect(
      page.getByRole("heading", { name: /Verify Your Email/i })
    ).toBeVisible();

    const testEmail = "newuser@example.com";
    await page.getByLabel(/Email Address/i).fill(testEmail);
    await page.getByRole("button", { name: /Send Verification Code/i }).click();
    await expect(page.getByText(/OTP sent to your email!/i)).toBeVisible();

    await expect(
      page.getByRole("heading", { name: /Verify OTP/i })
    ).toBeVisible();

    // Mock OTP verification API to always succeed
    await page.route("**/api/auth/verify-otp", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.getByLabel(/Verification Code/i).fill("123456");
    await page.getByRole("button", { name: /Verify Code/i }).click();
    await expect(page.getByText(/OTP verified/i)).toBeVisible();

    await expect(
      page.getByRole("heading", { name: /Create Account/i })
    ).toBeVisible();
    await page.getByLabel(/Name/i).fill("New User");
    //await page.getByLabel(/Email/i).fill(testEmail);
    await page
      .getByLabel(/Password/i)
      .first()
      .fill("Password@123");
    await page
      .getByLabel(/Password/i)
      .nth(1)
      .fill("Password@123");
    await page.getByLabel(/Phone/i).fill("9876543210");
    // Mock register API to succeed
    await page.route("**/api/auth/register", (route) => {
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ message: "Registration successful" }),
      });
    });

    await page.getByRole("button", { name: /Create Account/i }).click();

    // Check toast
    await expect(page.getByRole("alert")).toContainText(
      /registration successful/i
    );

    // Or check redirect
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("User Registration Flow - Failures", () => {
  test(" should show error if Send OTP fails", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("button", { name: /Register/i }).click();

    const testEmail = "failuser@example.com";
    await page.getByLabel(/Email Address/i).fill(testEmail);

    await page.route("**/api/auth/send-otp", (route) => {
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "Failed to send OTP" }),
      });
    });

    await page.getByRole("button", { name: /Send Verification Code/i }).click();

    await expect(page.getByRole("alert")).toContainText(/failed to send otp/i);
  });

  test(" should show error if OTP verification fails", async ({ page }) => {
    await page.goto("http://localhost:3000/");

    await page.getByRole("button", { name: /Register/i }).click();

    await page.getByLabel(/Email Address/i).fill("otpuser@example.com");

    // Mock OTP sent success
    await page.route("**/api/auth/send-otp", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "OTP sent to your email!" }),
      });
    });
    await page.getByRole("button", { name: /Send Verification Code/i }).click();
    await expect(page.getByRole("alert")).toContainText(
      /OTP sent to your email!/i
    );

    // Mock OTP verify fail
    await page.route("**/api/auth/verify-otp", (route) => {
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "Invalid OTP" }),
      });
    });

    await page.getByLabel(/Verification Code/i).fill("999999");
    await page.getByRole("button", { name: /Verify Code/i }).click();

    await expect(page.getByRole("alert")).toContainText(/invalid otp/i);
  });

  test(" should show error if Registration fails", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("button", { name: /Register/i }).click();

    const testEmail = "regfail@example.com";
    await page.getByLabel(/Email Address/i).fill(testEmail);

    // Mock OTP sent + verify success
    await page.route("**/api/auth/send-otp", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "OTP sent to your email!" }),
      });
    });
    await page.getByRole("button", { name: /Send Verification Code/i }).click();
    await page.route("**/api/auth/verify-otp", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });
    await page.getByLabel(/Verification Code/i).fill("123456");
    await page.getByRole("button", { name: /Verify Code/i }).click();

    // Fill registration form
    await page.getByLabel(/Name/i).fill("Failed User");
    await page
      .getByLabel(/Password/i)
      .first()
      .fill("Password@123");
    await page
      .getByLabel(/Password/i)
      .nth(1)
      .fill("Password@123");
    await page.getByLabel(/Phone/i).fill("9876543210");

    // Mock Register API (fail)
    await page.route("**/api/auth/register", (route) => {
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "Email already exists" }),
      });
    });

    await page.getByRole("button", { name: /Create Account/i }).click();

    await expect(page.getByRole("alert")).toContainText(/Registration failed/i);
  });
});
