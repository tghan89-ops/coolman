// playwright.config.ts
//
// Group 12 — end-to-end browser tests.
//
// These run against a REAL running site (not mocked) and assume the seed data
// from UAT.md "Seed prerequisites" exists. They do not run in the normal `pnpm test`
// (vitest) pass — run them with `pnpm e2e` once the dev server + database are up.
//
// Base URL: set PLAYWRIGHT_BASE_URL to point at a deployed/preview site, or leave it
// and Playwright will start `pnpm dev` locally (needs the DB env vars to be set).

import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'
const useExternalServer = Boolean(process.env.PLAYWRIGHT_BASE_URL)

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: useExternalServer
    ? undefined
    : {
        command: 'pnpm dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
