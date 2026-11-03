import { defineConfig, devices } from "@playwright/test";

const e2e = "tests/e2e";

export default defineConfig({
  reporter: "list",
  forbidOnly: !!process.env.CI,
  use: { baseURL: "http://127.0.0.1:4173" },
  projects: [
    { name: "unit", testDir: "tests/unit" },
    { name: "repo", testDir: "tests/repo" },
    { name: "build", testDir: "tests/build", use: { ...devices["Desktop Chrome"] } },
    { name: "desktop", testDir: e2e, use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
    { name: "iphone-13", testDir: e2e, use: { ...devices["iPhone 13"] } },
    { name: "pixel-7", testDir: e2e, use: { ...devices["Pixel 7"] } },
  ],
  webServer: process.env.PW_NO_SERVER
    ? undefined
    : {
        command: "npx vite preview --host 127.0.0.1 --port 4173 --strictPort",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: false,
      },
});
