import { defineConfig, devices } from "@playwright/test";

// Automated browser checks run against the Vite dev server (started automatically, reused if already running).
export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  use: { baseURL: "http://localhost:5173", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npx vite --no-open",
    url: "http://localhost:5173/work/m-goat",
    reuseExistingServer: true
  }
});
