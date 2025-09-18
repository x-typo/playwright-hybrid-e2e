import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve absolute path to this file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MainAccountFile = path.resolve(
  __dirname,
  "../auth/storageStates/mainAccountSetup.json"
);

// Define the base URL directly in config
const BASE_URL = "https://practice.expandtesting.com";

// Load other environment variables
dotenv.config({ quiet: true });

export default defineConfig({
  // Set directory for global setup file
  globalSetup: path.resolve(__dirname, "../auth/authSetups/global-setup.ts"),
  // Set directory for test files
  testDir: "../tests/playwright/features",
  // Set screenshot options
  snapshotPathTemplate:
    "../visual-snapshots/{testFileDir}/{arg}{projectName}{ext}",
  // Enable fully parallel test execution
  fullyParallel: true,
  // Fail the build on CI if there are any focused tests
  forbidOnly: !!process.env.CI,
  // Set options for CI and local runs
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 2 : 2,
  // Configure reporters for CI and local runs
  reporter: process.env.CI
    ? [
        ["list"],
        [
          "junit",
          {
            outputFile: "../desktop-junit-reports/junit.xml",
            embedAnnotationsAsProperties: true,
          },
        ],
        ["html"],
      ]
    : [["list"], ["html", { open: "never" }]],
  use: {
    // Set base URL for all tests
    baseURL: BASE_URL,
    // Run in headless mode
    headless: true,
    // Capture trace when test fails
    trace: "retain-on-failure",
  },
  // Set maximum time allowed for each test
  timeout: 60000,
  // Set maximum wait time for each expect() assertion
  expect: {
    timeout: 30000,
  },

  // Configure projects for CI environment
  projects: process.env.CI
    ? [
        {
          name: "chromeUI",
          use: {
            ...devices["Desktop Chrome"],
            viewport: { width: 1920, height: 1080 },
            storageState: path.resolve(
              __dirname,
              "../auth/storageStates/mainAccountSetup.json"
            ),
          },
        },
        {
          name: "iosUI",
          use: {
            ...devices["iPhone 14 Pro Max"],
            storageState: path.resolve(
              __dirname,
              "../auth/storageStates/mainAccountSetup.json"
            ),
          },
        },
      ]
    : // Configure projects for local environment
      [
        {
          name: "chromeUI",
          use: {
            ...devices["Desktop Chrome"],
            viewport: { width: 1920, height: 1080 },
            storageState: path.resolve(
              __dirname,
              "../auth/storageStates/mainAccountSetup.json"
            ),
          },
        },
        {
          name: "iosUI",
          use: {
            ...devices["iPhone 14 Pro Max"],
            storageState: path.resolve(
              __dirname,
              "../auth/storageStates/mainAccountSetup.json"
            ),
          },
        },
      ],
});
