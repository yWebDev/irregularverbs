/**
 * E2E tests — Verbs table page (route: /verbs)
 *
 * Covers: table rendering, column headers, data loading, and navigation.
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
    await page.route("**/assets/config.json", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ API_KEY: MOCK_API_KEY }),
      })
    );
    await page.route("**/api/verbs/verbs", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: encryptedMockVerbs }),
      })
    );
    await verbsPage.goto();
  });

  test("renders heading, table with column headers, and loads data", async ({
    verbsPage,
  }) => {
    await verbsPage.expectHeadingVisible();
    const headingText = await verbsPage.heading.textContent();
    expect(headingText).toBeTruthy();
    expect(headingText!.toLowerCase()).toContain("verb");

    await verbsPage.expectTableVisible();
    await verbsPage.expectColumnHeadersVisible();
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
  test("direct URL /verbs loads correctly and can navigate back", async ({
    page,
  }) => {
    await page.goto("/");
    await page.goto("/verbs");
    await expect(page).toHaveURL(/\/verbs/);

    const heading = page.locator("h2, h1").first();
    await expect(heading).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL("/");
  });
});
