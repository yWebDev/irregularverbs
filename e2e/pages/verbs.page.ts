import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Page Object for the Verbs table page (route: /verbs).
 *
 * Provides helpers to interact with the Material table of irregular verbs,
 * including column headers, rows, expand/collapse, and loading state.
 */
export class VerbsPage {
  readonly page: Page;

  // --- Layout ---
  readonly heading: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;

  // --- Table ---
  readonly table: Locator;
  readonly headerRow: Locator;
  readonly tableRows: Locator;
  readonly expandButtons: Locator;
  readonly baseFormHeader: Locator;
  readonly pastSimpleHeader: Locator;
  readonly pastParticipleHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.locator("h2").first();
    this.loadingIndicator = page.locator('[aria-live="polite"], .loading');
    this.errorMessage = page.locator('[role="alert"], .error');

    // Angular Material 21 (MDC) renders <table mat-table> as a native <table>
    // with <tr mat-row> attribute rows — NOT custom element tags.
    this.table = page.locator("table[aria-label], table.mat-mdc-table");
    this.headerRow = page.locator("tr[mat-header-row]");
    // Data rows have class "element-row"; detail/expand rows have "detail-row".
    this.tableRows = page.locator("tr.element-row");
    this.expandButtons = page.locator('button[aria-label*="expand" i]');

    this.baseFormHeader = page
      .locator("th[mat-header-cell]")
      .filter({ hasText: /base/i });
    this.pastSimpleHeader = page
      .locator("th[mat-header-cell]")
      .filter({ hasText: /past simple/i });
    this.pastParticipleHeader = page
      .locator("th[mat-header-cell]")
      .filter({ hasText: /past participle/i });
  }

  async goto() {
    await this.page.goto("/verbs");
  }

  async waitForTableData() {
    await expect(this.tableRows.first()).toBeVisible({ timeout: 20_000 });
  }

  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }

  async getRowByBaseVerb(base: string): Promise<Locator> {
    return this.tableRows.filter({ hasText: base }).first();
  }

  async expandRow(index = 0) {
    await this.expandButtons.nth(index).click();
  }

  async expectHeadingVisible() {
    await expect(this.heading).toBeVisible();
  }

  async expectTableVisible() {
    await expect(this.table).toBeVisible();
  }

  async expectColumnHeadersVisible() {
    // Headers are <th mat-header-cell> — filter by text is the most reliable
    await expect(
      this.page.locator("th").filter({ hasText: /base/i }).first()
    ).toBeVisible();
    await expect(
      this.page.locator("th").filter({ hasText: /past simple/i }).first()
    ).toBeVisible();
    await expect(
      this.page.locator("th").filter({ hasText: /past participle/i }).first()
    ).toBeVisible();
  }

  async expectMinimumRowCount(min: number) {
    const count = await this.getRowCount();
    expect(count).toBeGreaterThanOrEqual(min);
  }
}
