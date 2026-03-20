import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Page Object for the Game flow (routes: /game, /game/login, /game/active).
 *
 * Models the entire game flow: promo → login → active game → game-over dialog.
 */
export class GamePage {
  readonly page: Page;

  // --- Game Promo (/game) ---
  readonly promoHeading: Locator;
  readonly playButton: Locator;
  readonly howToPlayButton: Locator;

  // --- Login (/game/login) ---
  readonly loginHeading: Locator;
  readonly usernameInput: Locator;
  readonly loginSubmitButton: Locator;
  readonly loginForm: Locator;

  // --- How To Play dialog ---
  readonly howToPlayDialog: Locator;
  readonly howToPlayCloseButton: Locator;

  // --- Active Game (/game/active) ---
  readonly gameBoard: Locator;
  readonly dragCards: Locator;
  readonly dropZones: Locator;
  readonly scoreDisplay: Locator;
  readonly progressIndicator: Locator;

  // --- Game Over dialog ---
  readonly gameOverDialog: Locator;
  readonly gameOverScore: Locator;
  readonly playAgainButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Promo
    this.promoHeading = page
      .locator("app-game-promo h1, app-game-promo h2")
      .first();
    this.playButton = page.locator(
      'button:has-text("Play"), a:has-text("Play"), [routerlink*="login"]'
    ).first();
    this.howToPlayButton = page
      .locator('button:has-text("How"), button:has-text("Rules"), button:has-text("Instructions")')
      .first();

    // Login
    this.loginHeading = page.locator("app-login h1, app-login h2").first();
    this.usernameInput = page.locator(
      'input[name="username"], input[placeholder*="name" i], app-login input'
    ).first();
    this.loginSubmitButton = page.locator(
      'app-login button[type="submit"], app-login button:has-text("Start"), app-login button:has-text("Play")'
    ).first();
    this.loginForm = page.locator("app-login form");

    // How To Play dialog
    this.howToPlayDialog = page.locator(
      "app-how-to-play, mat-dialog-container"
    ).first();
    this.howToPlayCloseButton = page.locator(
      'mat-dialog-container button[aria-label*="close" i], mat-dialog-container button:has-text("Close"), mat-dialog-container button:has-text("Got it")'
    ).first();

    // Active game
    this.gameBoard = page.locator("app-game .game-board, app-game .board, app-game").first();
    this.dragCards = page.locator(".drag-card, .card, [cdkDrag]");
    this.dropZones = page.locator(".drop-zone, [cdkDropList]");
    this.scoreDisplay = page.locator(".score, [aria-label*='score' i]").first();
    this.progressIndicator = page.locator(
      ".progress, mat-progress-bar, [aria-label*='progress' i]"
    ).first();

    // Game over
    this.gameOverDialog = page.locator("app-game-over-dialog, mat-dialog-container").first();
    this.gameOverScore = page.locator(
      "app-game-over-dialog .score, mat-dialog-container .score"
    ).first();
    this.playAgainButton = page.locator(
      'mat-dialog-container button:has-text("Play"), mat-dialog-container button:has-text("Again"), app-game-over-dialog button'
    ).first();
  }

  async gotoPromo() {
    await this.page.goto("/game");
  }

  async gotoLogin() {
    await this.page.goto("/game/login");
  }

  async gotoActive() {
    await this.page.goto("/game/active");
  }

  async login(username: string) {
    await this.usernameInput.fill(username);
    await this.loginSubmitButton.click();
  }

  async expectPromoVisible() {
    await expect(this.promoHeading).toBeVisible();
  }

  async expectLoginFormVisible() {
    await expect(this.loginForm).toBeVisible();
  }

  async expectGameBoardVisible() {
    await expect(this.gameBoard).toBeVisible({ timeout: 15_000 });
  }

  async expectGameOverDialogVisible() {
    await expect(this.gameOverDialog).toBeVisible({ timeout: 15_000 });
  }
}
