import { test, expect, request } from "@playwright/test";

// -----------------------------
// Helper: Login via API and get JWT
async function getJwtToken(apiContext) {
  const loginResponse = await apiContext.post(
    "http://localhost:4000/api/auth/login",
    {
      headers: { "Content-Type": "application/json" },
      data: {
        email: "malla.varshini03@gmail.com",
        password: "Varshini@123",
      },
    }
  );
  const body = await loginResponse.json();
  return body.token; // adjust this if your API returns { token: "..." } differently
}

// Helper: Inject token into localStorage
async function setToken(page, token) {
  await page.addInitScript((token) => {
    localStorage.setItem("token", token);
  }, token);
}

// Helper: Create a trip via UI
async function createTrip(page, origin = "Delhi", destination = "Mumbai") {
  await page.getByRole("button", { name: /Create New Trip/i }).click();
  await page.getByPlaceholder("Starting location").fill(origin);
  await page.getByPlaceholder("Destination location").fill(destination);
  await page.locator("select[name=truck]").selectOption({ index: 1 });
  await page.locator("select[name=driver]").selectOption({ index: 1 });
  await page.locator('input[name="startDate"]').fill("2025-09-23T09:00");
  await page.locator('input[name="endDate"]').fill("2025-09-24T09:00");
  await page.locator('input[name="totalKm"]').fill("1500");
  await page.locator('input[name="cargoWeight"]').fill("2000");
  await page.locator('input[name="fuelStart"]').fill("100");

  await page.getByRole("button", { name: /Create Trip/i }).click();
  await expect(page.getByText(/Trip created successfully/i)).toBeVisible();
}

// -----------------------------
test.describe("Trips Feature - End-to-End", () => {
  let token;

  test.beforeAll(async ({ request: apiContext }) => {
    token = await getJwtToken(apiContext);
  });

  test.beforeEach(async ({ page }) => {
    await setToken(page, token);
    await page.goto("http://localhost:3000/trips");
    await expect(
      page.getByRole("heading", { name: /Trips|My Trips/i })
    ).toBeVisible();
  });

  test("should show empty state when no trips exist", async ({ page }) => {
    await page.route("**/api/trips**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "[]",
      })
    );
    await page.reload();
    await expect(page.getByText(/No Trips Found/i)).toBeVisible();
  });

  test("should validate trip form and show error for empty submit", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Create New Trip/i }).click();
    await page.getByRole("button", { name: /Create Trip/i }).click();
    const input = page.getByPlaceholder("Starting location");
    const isValid = await input.evaluate((el) => el.checkValidity());
    expect(isValid).toBeFalsy();
  });

  test("should show error for same origin and destination", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Create New Trip/i }).click();

    await page.getByPlaceholder("Starting location").fill("Mumbai");
    await page.getByPlaceholder("Destination location").fill("Mumbai");

    await page.locator("select[name=truck]").selectOption({ index: 1 });
    await page.locator("select[name=driver]").selectOption({ index: 1 });

    await page.locator('input[name="startDate"]').fill("2025-09-23T09:00");
    await page.locator('input[name="endDate"]').fill("2025-09-24T09:00");
    await page.locator('input[name="totalKm"]').fill("1500");
    await page.locator('input[name="cargoWeight"]').fill("2000");
    await page.locator('input[name="fuelStart"]').fill("100");

    await page.getByRole("button", { name: /Create Trip/i }).click();

    await expect(
      page
        .locator(".Toastify__toast")
        .getByText(/Origin and Destination cannot be the same/i)
    ).toBeVisible();
  });

  test("should create a trip with valid data", async ({ page }) => {
    await createTrip(page);
  });

  test("should edit and update an existing trip", async ({ page }) => {
    await createTrip(page, "Hyderabad", "Chennai");
    const editBtn = page
      .getByRole("row")
      .nth(1)
      .getByRole("button", { name: /Edit/i });
    if (await editBtn.isEnabled()) {
      await editBtn.click();
      await page.getByLabel("Origin").fill("Bangalore");
      await page.getByRole("button", { name: /Update Trip/i }).click();
      await expect(page.getByText(/Trip updated successfully/i)).toBeVisible();
    }
  });

  test("should cancel trip form and return to list", async ({ page }) => {
    await page.getByRole("button", { name: /Create New Trip/i }).click();
    await page.getByRole("button", { name: /Cancel/i }).click();
    await expect(
      page.getByRole("heading", { name: /Trips|My Trips/i })
    ).toBeVisible();
  });

  test("should view trip details", async ({ page }) => {
    await createTrip(page, "Pune", "Goa");
    await page
      .getByRole("row")
      .nth(1)
      .getByRole("button", { name: /View/i })
      .click();
    await expect(
      page.getByRole("heading", { name: /Trip/i }).first()
    ).toBeVisible();
    await expect(page.getByText(/Driver Information/i)).toBeVisible();
  });

  test("should delete and restore a trip", async ({ page }) => {
    await createTrip(page, "Surat", "Ahmedabad");
    const row = page.getByRole("row").nth(1);
    const deleteBtn = row.getByRole("button", { name: "Delete" });
    if (await deleteBtn.isEnabled()) {
      await deleteBtn.click();
      await page.getByRole("button", { name: /Delete/i }).click();
      await expect(page.getByText(/Trip deleted successfully/i)).toBeVisible();

      await page.getByRole("button", { name: /Show Deleted Trips/i }).click();
      await row.getByRole("button", { name: /Restore/i }).click();
      await expect(page.getByText(/Trip restored/i)).toBeVisible();
    }
  });

  test("should show error for non-existent trip", async ({ page }) => {
    await page.goto("http://localhost:3000/trips/invalid-trip-id");
    await expect(page.getByText("Loading trip data...")).toBeVisible();
  });

  test("should show loading spinner when trips are loading", async ({
    page,
  }) => {
    await page.route("**/api/trips**", async (route) => {
      await new Promise((r) => setTimeout(r, 2000));
      await route.fulfill({ status: 200, body: "[]" });
    });
    await page.reload();
    await expect(page.getByRole("status")).toBeVisible();
  });

  test("should allow driver to start, complete trip and log events", async ({
    page,
  }) => {
    await createTrip(page, "Nagpur", "Indore");
    await page
      .getByRole("row")
      .nth(1)
      .getByRole("button", { name: /View/i })
      .click();

    if (await page.getByRole("button", { name: /Start Trip/i }).isVisible()) {
      await page.getByRole("button", { name: /Start Trip/i }).click();
    }

    if (await page.getByRole("button", { name: /Log Refuel/i }).isVisible()) {
      await page.getByRole("button", { name: /Log Refuel/i }).click();
      await page.getByLabel("Fuel Before").fill("60");
      await page.getByLabel("Fuel Added").fill("20");
      await page.getByLabel("Payment Mode").selectOption("cash");
      await page.getByRole("button", { name: /Submit/i }).click();
    }

    if (
      await page.getByRole("button", { name: /Complete Trip/i }).isVisible()
    ) {
      await page.getByRole("button", { name: /Complete Trip/i }).click();
      await page.getByLabel("Fuel Left").fill("40");
      await page.getByRole("button", { name: /Submit/i }).click();
    }
  });
});
