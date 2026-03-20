import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Page Object for the Search page (route: /).
 *
 * Encapsulates all locator strategies and interaction helpers for the
 * search / home page, keeping test code clean and resilient to UI changes.
 */
export class SearchPage {
  readonly page: Page;

  // --- Layout ---
  readonly heading: Locator;
  readonly gameLink: Locator;
  readonly verbsTableLink: Locator;

  // --- Search input (app-verb-input) ---
  readonly searchInput: Locator;
  readonly searchAutocomplete: Locator;

  // --- Verb info panel (app-verb-info) ---
  readonly verbInfoPanel: Locator;
  readonly verbInfoBase: Locator;
  readonly verbInfoPastSimple: Locator;
  readonly verbInfoPastParticiple: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.locator("h2").first();
    this.gameLink = page.locator('a[routerlink="/game"], a[href="/game"]');
    this.verbsTableLink = page.locator(
      'a[routerlink="/verbs"], a[href="/verbs"]'
    );

    this.searchInput = page.locator(
      'input[aria-label*="verb" i], mat-autocomplete ~ input, app-verb-input input, input[type="text"]'
    ).first();
    this.searchAutocomplete = page.locator("mat-option, .mat-option");

    this.verbInfoPanel = page.locator("app-verb-info");
    this.verbInfoBase = page.locator("app-verb-info .base, app-verb-info [class*='base']");
    this.verbInfoPastSimple = page.locator(
      "app-verb-info .past-simple, app-verb-info [class*='past']"
    );
    this.verbInfoPastParticiple = page.locator(
      "app-verb-info .past-participle, app-verb-info [class*='participle']"
    );
  }

  async goto() {
    await this.page.goto("/");
  }

  async waitForLoad() {
    await this.page.waitForLoadState("networkidle");
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.page.waitForTimeout(300);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async selectSuggestion(index = 0) {
    await this.searchAutocomplete.nth(index).click();
  }

  async expectHeadingVisible() {
    await expect(this.heading).toBeVisible();
  }

  async expectSearchInputVisible() {
    await expect(this.searchInput).toBeVisible();
  }

  async expectSuggestionsVisible() {
    await expect(this.searchAutocomplete.first()).toBeVisible();
  }

  async expectPageTitle(title: string) {
    await expect(this.page).toHaveTitle(new RegExp(title, "i"));
  }
}
