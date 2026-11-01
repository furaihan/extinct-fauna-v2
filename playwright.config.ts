import { defineConfig, devices } from '@playwright/test'

/**
 * E2E config. Runs against the dedicated test database defined in `.env.test`
 * (never the dev database — the quiz specs insert rows).
 *
 * Playwright itself is launched through Node, not Bun:
 *   node --env-file=.env.test ./node_modules/@playwright/test/cli.js test
 */
export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  // TanStack Start + Vite compile routes on first request, so allow a slow first paint.
  expect: { timeout: 10_000 },

  use: {
    baseURL: 'http://localhost:3101',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      testIgnore: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],

  webServer: {
    // `dev` hardcodes port 3100, where a dev-database server may already be
    // running; `dev:e2e` binds 3101 so the test DB can never be swapped out.
    command: 'bun --env-file=.env.test run dev:e2e',
    url: 'http://localhost:3101',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
