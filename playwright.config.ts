import { defineConfig, devices } from '@playwright/test'

/**
 * Real-browser checks for what the jsdom tests can't see: which element actually receives a
 * click (door hinge, z-index of the open card), the lock in a fresh browser, and accessibility.
 * Runs against the production build (`vite preview`), like the live site.
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // CI has just built dist/ (the same files that get deployed); locally, build first
    command: process.env.CI
      ? 'npx vite preview --port 4173 --strictPort'
      : 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
