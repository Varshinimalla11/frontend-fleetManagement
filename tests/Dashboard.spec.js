import { test, expect } from "@playwright/test";

test("delete truck by row index and check count decreases", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  // Login steps
  await page.getByRole("button", { name: " Login" }).click();
  await page
    .getByRole("textbox", { name: " Email Address" })
    .fill("malla.varshini03@gmail.com");
  await page.getByRole("textbox", { name: " Password" }).fill("Varshini@123");
  await page.getByRole("button", { name: " Sign In" }).click();

  // Go to dashboard and get the initial truck count (adjust nth as needed for your actual count location)
  const initialTrucksCount = parseInt(
    await page.getByRole("heading", { name: /\d+/ }).nth(1).textContent()
  );

  // Go to Trucks page
  await page.getByRole("link", { name: " Trucks" }).click();

  await page.getByRole("button", { name: "+ Add New Truck" }).click();

  const randomPlate = `AP30S${Math.floor(Math.random() * 10000)}`;

  await page.getByLabel("Plate Number").fill(randomPlate);
  await page.getByLabel("Condition").selectOption("active");
  await page.getByRole("spinbutton", { name: " Mileage Factor" }).fill("60");

  // Save Truck
  await page.getByRole("button", { name: " Save Truck" }).click();
  // Go back to dashboard
  await page.getByRole("link", { name: "FleetFlow LogoFleetFlow" }).click();
  await page.waitForTimeout(1500); // Let dashboard update

  // Get the new truck count and assert it decreased by 1
  const updatedTrucksCount = parseInt(
    await page.getByRole("heading", { name: /\d+/ }).nth(1).textContent()
  );
  expect(updatedTrucksCount).toBe(initialTrucksCount + 1);
});
