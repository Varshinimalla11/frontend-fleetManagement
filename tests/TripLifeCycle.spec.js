import { test, expect } from "@playwright/test";

// Helper: Login as any user
async function login(page, email, password) {
  await page.goto("http://localhost:3000/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForLoadState("networkidle");
}

// Helper: Owner creates a trip and returns tripId and driverId
async function ownerCreatesTrip(page) {
  await page.getByRole("link", { name: "Trips" }).click();
  await page.getByRole("button", { name: /Create New Trip/i }).click();

  await page.getByPlaceholder("Starting location").fill("Delhi");
  await page.getByPlaceholder("Destination location").fill("Mumbai");
  await page.locator('select[name="truck"]').selectOption({ index: 1 });
  await page.locator('select[name="driver"]').selectOption({ index: 1 });
  await page.locator('input[name="startDate"]').fill("2025-09-23T09:00");
  await page.locator('input[name="endDate"]').fill("2025-09-24T09:00");
  await page.locator('input[name="totalKm"]').fill("1500");
  await page.locator('input[name="cargoWeight"]').fill("2000");
  await page.locator('input[name="fuelStart"]').fill("100");
  await page.getByRole("button", { name: /Create Trip/i }).click();
  await expect(page.getByText(/Trip created successfully/i)).toBeVisible();

  // Get tripId and driverId from the UI or API if possible
  // Example: Find the first trip row and extract data attributes or text
  const tripRow = page.getByRole("row").nth(1);
  const tripLink = await tripRow.getByRole("button", { name: /View/i });
  const tripHref = await tripLink.getAttribute("href");
  const tripId = tripHref ? tripHref.split("/")[2] : "test-trip-id";

  // For demo, assume driver email is known
  const driverEmail = "varshini.malla03@gmail.com";
  const driverPassword = "Varshini@123";

  return { tripId, driverEmail, driverPassword };
}

test("Trip lifecycle: owner creates trip, driver completes actions", async ({
  page,
}) => {
  // Step 1: Owner logs in and creates a trip
  await login(page, "malla.varshini03@gmail.com", "Varshini@123");
  const { tripId, driverEmail, driverPassword } = await ownerCreatesTrip(page);

  // Step 2: Owner logs out
  await page.getByRole("button", { name: "Varshini Malla" }).click();
  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page.getByRole("button", { name: /Login/i })).toBeVisible();

  // Step 3: Driver logs in
  await login(page, driverEmail, driverPassword);

  // Step 4: Driver goes to assigned trip
  await page.goto(`http://localhost:3000/trips/${tripId}`);
  await expect(
    page.getByRole("heading", { name: /Trip/i }).first()
  ).toBeVisible();

  // Step 5: Driver starts trip
  if (await page.getByRole("button", { name: /Start Trip/i }).isVisible()) {
    await page.getByRole("button", { name: /Start Trip/i }).click();
  }

  // Step 6: Driver starts drive session
  if (await page.getByRole("button", { name: /Start Session/i }).isVisible()) {
    await page.getByRole("button", { name: /Start Session/i }).click();
    await expect(
      page.getByText(/Drive session started successfully/i)
    ).toBeVisible();
  }

  // Step 7: Driver ends drive session
  if (await page.getByRole("button", { name: /End Session/i }).isVisible()) {
    await page.getByRole("button", { name: /End Session/i }).click();
    await expect(
      page.getByText(/Drive session ended successfully/i)
    ).toBeVisible();
  }

  // Step 8: Driver logs a refuel event
  if (await page.getByRole("button", { name: /Log Refuel/i }).isVisible()) {
    await page.getByRole("button", { name: /Log Refuel/i }).click();
    await page.getByLabel("Event Time").fill("2025-09-23T10:00");
    await page.getByLabel("Fuel Before").fill("80");
    await page.getByLabel("Fuel Added").fill("20");
    await page.getByLabel("Fuel After").fill("100");
    await page.getByLabel("Payment Mode").fill("Cash");
    await page.getByRole("button", { name: /Add Event/i }).click();
    await expect(
      page.getByText(/Refuel event added successfully/i)
    ).toBeVisible();
  }

  // Step 9: Driver completes trip
  if (await page.getByRole("button", { name: /Complete Trip/i }).isVisible()) {
    await page.getByRole("button", { name: /Complete Trip/i }).click();
    await page.getByLabel("Fuel Left").fill("70");
    await page.getByRole("button", { name: /Submit/i }).click();
    await expect(page.getByText(/Trip completed successfully/i)).toBeVisible();
  }
});
