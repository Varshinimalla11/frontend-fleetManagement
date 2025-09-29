import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const BACKEND_URL = "http://localhost:4000";

// -------------------- Helper Functions --------------------

// Owner login via API and set token in localStorage
async function loginAsOwner(page) {
  const ownerLoginResponse = await page.request.post(
    `${BACKEND_URL}/api/auth/login`,
    {
      data: { email: "malla.varshini03@gmail.com", password: "Varshini@123" },
    }
  );

  const { token } = await ownerLoginResponse.json();

  // Set token in localStorage before navigation
  await page.addInitScript((t) => {
    localStorage.setItem("authToken", t);
  }, token);
}

test.describe("Driver Registration via Owner Invite", () => {
  test("should show error for invalid invite token", async ({ page }) => {
    await loginAsOwner(page);

    // Mock verify invite API to fail
    await page.route("**/api/invite-tokens/verify", (route) =>
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ message: "Invalid invite" }),
      })
    );

    await page.goto(`${BASE_URL}/register-driver?token=invalidtoken`);

    await expect(page.getByText(/Invalid Invitation/i)).toBeVisible({
      timeout: 5000,
    });
  });
});
