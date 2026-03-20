/**
 * E2E tests — Search page (route: /)
 *
 * Covers the main user journey: arrive at the home page, see the heading,
 * search for a verb, and navigate to other sections.
 */
import { test, expect } from "../fixtures/app.fixture";

test.describe("Search page", () => {
  test.beforeEach(async ({ searchPage }) => {
    await searchPage.goto();
    await searchPage.waitForLoad();
  });

  test("renders heading, search input, and navigation links", async ({
    searchPage,
    page,
  }) => {
    await searchPage.expectHeadingVisible();
    const headingText = await searchPage.heading.textContent();
    expect(headingText).toBeTruthy();

    await searchPage.expectSearchInputVisible();

    await expect(page.locator('a[href*="/game"]').first()).toBeVisible();
    await expect(page.locator('a[href*="/verbs"]').first()).toBeVisible();
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
  test("has correct heading hierarchy and accessible input", async ({
    searchPage,
  }) => {
    await searchPage.goto();

    const headings = searchPage.page.locator("h1, h2, h3");
    expect(await headings.count()).toBeGreaterThan(0);

    const inputs = searchPage.page.locator("input");
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const ariaLabel = await input.getAttribute("aria-label");
        const placeholder = await input.getAttribute("placeholder");
        const id = await input.getAttribute("id");
        const labelForIt = id
          ? await searchPage.page.locator(`label[for="${id}"]`).count()
          : 0;
        expect(ariaLabel || placeholder || labelForIt > 0).toBeTruthy();
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
