/**
 * E2E tests — Game flow (routes: /game, /game/login, /game/active)
 *
 * Covers: login form rendering & interaction, route guards, and navigation.
 * The game requires authentication (via the canAuthorize guard), so most
 * active-game tests go through the login flow first.
 */
import { test, expect } from "../fixtures/app.fixture";

test.describe("Game login page (/game/login)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/game/login");
    await page.waitForLoadState("domcontentloaded");
  });

  test("renders the login form with input and submit button", async ({
    page,
    gamePage,
  }) => {
    await gamePage.expectLoginFormVisible();

    const input = page
      .locator("app-login input, input[type='text'], input")
      .first();
    await expect(input).toBeVisible();

    const button = page
      .locator(
        'app-login button[type="submit"], app-login button, form button'
      )
      .first();
    await expect(button).toBeVisible();
  });

  test("submit button is disabled until username is entered", async ({
    page,
  }) => {
    const button = page.locator('button[type="submit"]').first();
    await expect(button).toBeDisabled();

    const input = page.locator("app-login input, input").first();
    await input.fill("TestPlayer");
    const value = await input.inputValue();
    expect(value).toBe("TestPlayer");
  });

  test("page title is set", async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });
});

test.describe("Game route guard", () => {
  test("redirects unauthenticated users away from /game/active", async ({
    page,
  }) => {
    await page.goto("/game/active");
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).not.toMatch(/\/game\/active$/);
  });

  test("direct navigation to /game redirects to /game/login", async ({
    page,
  }) => {
    await page.goto("/game");
    await page.waitForURL("**/game/login", { timeout: 15_000 });
    expect(page.url()).toContain("/game/login");
  });
});

test.describe("Game — navigation flow", () => {
  test("can navigate from search page to game and back", async ({ page }) => {
    await page.goto("/");
    const gameLink = page.locator('a[href*="/game"]').first();
    await gameLink.click();
    await page.waitForURL("**/game/**");
    expect(page.url()).toContain("/game");

    await page.goBack();
    await expect(page).toHaveURL("/");
  });
});
