import { test, expect } from "@playwright/test";

test.describe("Basic page loads", () => {
  test("homepage loads and shows the CTA", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: /skip a beat/i })
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: /create an experience/i })
    ).toBeVisible();
  });

  test("templates page loads and shows template cards", async ({ page }) => {
    await page.goto("/templates");

    await expect(
      page.getByRole("heading", { level: 1, name: /choose your.*message style/i })
    ).toBeVisible();

    await expect(
      page.getByText(/ready to play/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("create page loads and shows the form", async ({ page }) => {
    await page.goto("/create");

    await expect(
      page.getByRole("heading", { level: 1, name: /create your own version/i })
    ).toBeVisible();

    await expect(
      page.getByText(/gamified creation/i)
    ).toBeVisible();
  });

  test("create page wizard navigation works", async ({ page }) => {
    await page.goto("/create");

    const continueBtn = page.getByRole("button", { name: /continue/i });

    await expect(continueBtn).toBeVisible();

    // Step 1 → 2
    await continueBtn.click();
    await expect(
      page.getByPlaceholder("I've been meaning to tell you...")
    ).toBeVisible();

    // Step 2 → 3
    await continueBtn.click();
    await expect(
      page.getByPlaceholder(/your name/i)
    ).toBeVisible();

    // Step 3 → 4
    await continueBtn.click();
    await expect(
      page.getByText(/ready to launch/i)
    ).toBeVisible();
  });
});
