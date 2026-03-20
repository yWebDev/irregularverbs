import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E configuration.
 *
 * The tests are designed to run against a locally served Angular app
 * (ng serve) at http://localhost:4200. The backend is expected to be
 * available at http://localhost:3000 (or proxied by the Angular dev server).
 *
 * To run tests:
 *   npx playwright test
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
  // Automatically start `ng serve` before the tests.
  // reuseExistingServer reuses a running server on localhost:4200 if one
  // is already up (e.g. you started it manually), which avoids the cold-start
  // wait during iterative development.
  webServer: {
    command: "ng serve --configuration=staging",
    url: "http://localhost:4200",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
