import { test, expect } from "@playwright/test";

test.describe("Create flow", () => {
  test("fill out the create form step by step and verify preview", async ({ page }) => {
    await page.goto("/create");

    // ── Step 1: choose template + tone ──
    await expect(
      page.getByText(/pick a template/i)
    ).toBeVisible();

    // Select a different template from the dropdown
    const select = page.locator("#template-select");
    const options = select.locator("option");
    const optionCount = await options.count();
    if (optionCount > 1) {
      await select.selectOption({ index: optionCount - 1 });
    }

    // Click the "Funny" tone button
    await page.getByRole("button", { name: "😂", exact: false }).click();

    // Continue to step 2
    await page.getByRole("button", { name: /continue/i }).click();

    // ── Step 2: write message ──
    await expect(
      page.getByPlaceholder("I've been meaning to tell you...")
    ).toBeVisible();

    const textarea = page.getByPlaceholder("I've been meaning to tell you...");
    await textarea.fill("You make every day better just by being in it. This is my way of saying thank you.");

    // Verify character count updates
    await expect(
      page.getByText(/\/520/)
    ).toBeVisible();

    // Continue to step 3
    await page.getByRole("button", { name: /continue/i }).click();

    // ── Step 3: name and details ──
    await expect(
      page.getByPlaceholder(/your name/i)
    ).toBeVisible();

    await page.getByPlaceholder(/your name/i).fill("Alex");
    await page.getByPlaceholder(/e\.?g\.? sarah/i).fill("Jordan");

    // Continue to step 4
    await page.getByRole("button", { name: /continue/i }).click();

    // ── Step 4: preview & share ──
    await expect(
      page.getByText(/ready to launch/i)
    ).toBeVisible();

    // Verify a preview of the message appears
    await expect(
      page.getByText("You make every day better")
    ).toBeVisible();

    // Verify preview button exists
    await expect(
      page.getByRole("button", { name: /preview/i })
    ).toBeVisible();

    // Verify generate link button exists
    await expect(
      page.getByRole("button", { name: /generate link/i })
    ).toBeVisible();
  });
});
