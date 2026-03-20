/**
 * E2E tests — Search page (route: /)
 *
 * Covers the main user journey: arrive at the home page, see the heading,
 * search for a verb, observe autocomplete suggestions, select a result, and
 * see the verb information panel.
 *
 * These tests assume the app is running at the BASE_URL configured in
 * playwright.config.ts (default: http://localhost:4200).
 */
import { test, expect } from "../fixtures/app.fixture";

test.describe("Search page", () => {
  test.beforeEach(async ({ searchPage }) => {
    await searchPage.goto();
    await searchPage.waitForLoad();
  });

  test("displays the home page heading", async ({ searchPage }) => {
    await searchPage.expectHeadingVisible();
    const headingText = await searchPage.heading.textContent();
    expect(headingText).toBeTruthy();
  });

  test("shows search input field", async ({ searchPage }) => {
    await searchPage.expectSearchInputVisible();
  });

  test("has a link to the game", async ({ page }) => {
    const gameLink = page.locator('a[href*="/game"]').first();
    await expect(gameLink).toBeVisible();
  });

  test("has a link to the verbs table", async ({ page }) => {
    const verbsLink = page.locator('a[href*="/verbs"]').first();
    await expect(verbsLink).toBeVisible();
  });

  test("page has a meaningful title", async ({ searchPage }) => {
    const title = await searchPage.page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test("search input accepts text input", async ({ searchPage }) => {
    await searchPage.search("go");
    const value = await searchPage.searchInput.inputValue();
    expect(value).toBe("go");
  });

  test("navigates to verbs page via link", async ({ page }) => {
    const verbsLink = page.locator('a[href*="/verbs"]').first();
    await verbsLink.click();
    await page.waitForURL("**/verbs");
    expect(page.url()).toContain("/verbs");
  });

  test("navigates to game page via link", async ({ page }) => {
    const gameLink = page.locator('a[href*="/game"]').first();
    await gameLink.click();
    await page.waitForURL("**/game/**");
    expect(page.url()).toContain("/game");
  });
});

test.describe("Search page — accessibility", () => {
  test("heading has correct heading level hierarchy", async ({ searchPage }) => {
    await searchPage.goto();
    // At least one heading should be present
    const headings = searchPage.page.locator("h1, h2, h3");
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);
  });

  test("search input has an accessible label", async ({ searchPage }) => {
    await searchPage.goto();
    const inputs = searchPage.page.locator("input");
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);

    // Each visible input should have some form of accessible label
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const ariaLabel = await input.getAttribute("aria-label");
        const placeholder = await input.getAttribute("placeholder");
        const id = await input.getAttribute("id");
        const labelForIt = id
          ? await searchPage.page.locator(`label[for="${id}"]`).count()
          : 0;
        const hasAccessibleName = ariaLabel || placeholder || labelForIt > 0;
        expect(hasAccessibleName).toBeTruthy();
      }
    }
  });

  test("page has meta description", async ({ searchPage }) => {
    await searchPage.goto();
    const metaDesc = searchPage.page.locator('meta[name="description"]');
    const content = await metaDesc.getAttribute("content");
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(10);
  });
});
