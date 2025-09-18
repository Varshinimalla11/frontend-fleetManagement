import { test, expect } from "@playwright/test";

test.describe("Login Page Tests", () => {
  const baseUrl = "http://localhost:3000/login";
  const email = "malla.varshini03@gmail.com";
  const password = "Varshini@123";

  test("should render login page elements", async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Forgot Password?" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Create Account" })
    ).toBeVisible();
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByLabel("Email Address").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Sign In" }).click();

    // check redirect
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByLabel("Email Address").fill("wrong@example.com");
    await page.getByLabel("Password").fill("wrongpass");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(
      page.locator("text=Login failed: Invalid email or password")
    ).toBeVisible();
  });

  test("should not allow submitting empty fields", async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByRole("button", { name: "Sign In" }).click();

    // HTML5 validation messages
    await expect(page.getByLabel("Email Address")).toHaveJSProperty(
      "validationMessage",
      "Please fill out this field."
    );
  });

  test("should toggle password visibility", async ({ page }) => {
    await page.goto(baseUrl);
    const passwordField = page.getByLabel("Password");

    await passwordField.fill(password);
    await expect(passwordField).toHaveAttribute("type", "password");

    // click eye icon
    await page.locator("i.fas.fa-eye").click();
    await expect(passwordField).toHaveAttribute("type", "text");
  });
  //It works on mobile data as the lan using the nodemailer doesn't work
  //   test("should open forgot password modal and send reset link", async ({
  //     page,
  //   }) => {
  //     await page.goto(baseUrl);
  //     await page.getByRole("button", { name: "Forgot Password?" }).click();

  //     await expect(page.locator("text=Reset Password")).toBeVisible();
  //     await page.getByPlaceholder("Enter your email").nth(1).fill(email);
  //     await page.getByRole("button", { name: "Send Reset Link" }).click();

  //     await expect(
  //       page.locator("text=If the email exists, a reset link has been sent")
  //     ).toBeVisible();
  //   });

  test("should show error when forgot password email is empty", async ({
    page,
  }) => {
    await page.goto(baseUrl);
    await page.getByRole("button", { name: "Forgot Password?" }).click();
    await page.getByRole("button", { name: "Send Reset Link" }).click();

    await expect(
      page.locator("text=Please enter your email address")
    ).toBeVisible();
  });

  test("should close forgot password modal on cancel", async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByRole("button", { name: "Forgot Password?" }).click();
    await expect(page.locator("text=Reset Password")).toBeVisible();

    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.locator("text=Reset Password")).not.toBeVisible();
  });

  test("should navigate to create account page", async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByRole("link", { name: "Create Account" }).click();
    await expect(page).toHaveURL(/.*send-otp/);
  });
});
