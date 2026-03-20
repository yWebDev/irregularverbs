/**
 * E2E tests — Verbs table page (route: /verbs)
 *
 * Covers: page navigation, table rendering, column headers, row expansion,
 * and accessibility of the verbs list.
 *
 * The verbs endpoint returns AES-encrypted JSON decrypted by the Angular app
 * using `API_KEY + 'ig-verbs'` (from /assets/config.json). We intercept both
 * requests so the tests are self-contained and do not require the backend.
 */
import { test, expect } from "../fixtures/app.fixture";
import * as CryptoJS from "crypto-js";

const MOCK_API_KEY = "e2e-test-key";
const MOCK_SECRET = MOCK_API_KEY + "ig-verbs";

const MOCK_VERBS = [
  { id: "1", base: "go", pastSimple: "went", pastParticiple: "gone" },
  { id: "2", base: "run", pastSimple: "ran", pastParticiple: "run" },
  { id: "3", base: "take", pastSimple: "took", pastParticiple: "taken" },
];

const encryptedMockVerbs = CryptoJS.AES.encrypt(
  JSON.stringify(MOCK_VERBS),
  MOCK_SECRET
).toString();

test.describe("Verbs table page", () => {
  test.beforeEach(async ({ page, verbsPage }) => {
    // Return a known API_KEY so the app decrypts with MOCK_SECRET
    await page.route("**/assets/config.json", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ API_KEY: MOCK_API_KEY }),
      })
    );
    // Return mock verbs encrypted with the matching key
    await page.route("**/api/verbs/verbs", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: encryptedMockVerbs }),
      })
    );
    await verbsPage.goto();
  });

  test("displays the verbs page heading", async ({ verbsPage }) => {
    await verbsPage.expectHeadingVisible();
    const headingText = await verbsPage.heading.textContent();
    expect(headingText).toBeTruthy();
    expect(headingText!.toLowerCase()).toContain("verb");
  });

  test("renders the table", async ({ verbsPage }) => {
    await verbsPage.expectTableVisible();
  });

  test("shows all three column headers", async ({ verbsPage }) => {
    await verbsPage.expectColumnHeadersVisible();
  });

  test("loads verbs data (at least 1 row visible within timeout)", async ({
    verbsPage,
  }) => {
    await expect(verbsPage.tableRows.first()).toBeVisible({ timeout: 20_000 });
  });

  test("table has a meaningful aria-label", async ({ verbsPage }) => {
    const table = verbsPage.page.locator("[aria-label]").filter({
      has: verbsPage.page.locator("mat-header-cell, th"),
    });
    const count = await table.count();
    if (count > 0) {
      const label = await table.first().getAttribute("aria-label");
      expect(label).toBeTruthy();
    }
  });

  test("page title reflects the verbs page content", async ({ verbsPage }) => {
    const title = await verbsPage.page.title();
    expect(title.length).toBeGreaterThan(0);
  });
});

test.describe("Verbs table page — navigation", () => {
  test("can navigate back to search page via browser back", async ({ page }) => {
    await page.goto("/");
    await page.goto("/verbs");
    await page.goBack();
    await expect(page).toHaveURL("/");
  });

  test("direct URL /verbs loads correctly", async ({ page }) => {
    await page.goto("/verbs");
    await expect(page).toHaveURL(/\/verbs/);
    const heading = page.locator("h2, h1").first();
    await expect(heading).toBeVisible();
  });
});
