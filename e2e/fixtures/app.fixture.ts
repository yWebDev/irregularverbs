import { test as base } from "@playwright/test";
import { SearchPage } from "../pages/search.page";
import { VerbsPage } from "../pages/verbs.page";
import { GamePage } from "../pages/game.page";

/**
 * Extended Playwright test fixture that provides pre-instantiated page objects
 * for all major areas of the iVerbs application.
 *
 * Usage in tests:
 *   import { test } from '../fixtures/app.fixture';
 *
 *   test('my test', async ({ searchPage, verbsPage }) => { ... });
 */
type AppFixtures = {
  searchPage: SearchPage;
  verbsPage: VerbsPage;
  gamePage: GamePage;
};

export const test = base.extend<AppFixtures>({
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  verbsPage: async ({ page }, use) => {
    await use(new VerbsPage(page));
  },
  gamePage: async ({ page }, use) => {
    await use(new GamePage(page));
  },
});

export { expect } from "@playwright/test";
