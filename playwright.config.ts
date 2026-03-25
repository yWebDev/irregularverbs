import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E configuration.
 *
 * The dev server uses `ng serve --configuration=e2e` (static browser build, no SSR
 * route extraction) so it matches CI and avoids hanging builds. API calls are
 * proxied to http://localhost:3000 per proxy.conf.json.
 *
 * To run tests locally:
 *   npm run e2e
 *   # or in two terminals: npm run serve:e2e  →  npm run e2e  (reuses existing server)
 *
 * To run in UI mode:
 *   npx playwright test --ui
 *
 * To run headed (visible browser):
 *   npx playwright test --headed
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  workers: process.env["CI"] ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: process.env["BASE_URL"] ?? "http://localhost:4200",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  // `e2e` build = static SPA only (see angular.json). Staging/production SSR
  // builds can hang or fail during route extraction when no API is reachable.
  webServer: {
    command: "npx ng serve --configuration=e2e --port 4200",
    url: "http://localhost:4200",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
