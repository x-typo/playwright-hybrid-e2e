import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve absolute path to this file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the base URL directly in config
const BASE_URL = "https://practice.expandtesting.com/notes/app";
const BASE_API_URL = "https://practice.expandtesting.com/notes/api";

// Load other environment variables
dotenv.config({ quiet: true });

export default defineConfig({
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
        // Auth setup project to create storageState
        {
          name: "mainAccountSetup",
          testDir: "../auth/authSetups/",
          testMatch: /mainAccountSetup.ts/,
        },
        // { name: "uiStageSetup", testMatch: /uiStageSetup.ts/ },
        // },
        // },
        {
          name: "chromeUI",
          dependencies: ["mainAccountSetup"],
          use: {
            ...devices["Desktop Chrome"],
            viewport: { width: 1920, height: 1080 },
            storageState: path.resolve(
              __dirname,
              "../auth/storageStates/mainAccountSetup.json"
            ),
          },
        },
        // {
        //   name: "safari_Dev_UI",
        //   testDir: "./tests/e2e/ui/desktop/uiTests/",
        //   dependencies: ["uiDevSetup"],
        //   use: {
        //     baseURL: "https://desktop.dev.com",
        //     ...devices["Desktop Safari"],
        //     viewport: { width: 1920, height: 1080 },
        //     storageState: "playwright/auth/uiDevQa.json",
        //   },
        // },
        {
          name: "iosUI",
          dependencies: ["mainAccountSetup"],
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
        // Auth setup project to create storageState
        {
          name: "mainAccountSetup",
          testDir: "../auth/authSetups/",
          testMatch: /mainAccountSetup.ts/,
          use: { viewport: { width: 640, height: 480 } },
        },
        // {
        //   name: "apiDevSetup",
        //   testMatch: /apiDevSetup.ts/,
        // },
        // {
        //   name: "uiStageSetup",
        //   testMatch: /uiStageSetup.ts/,
        //   use: { viewport: { width: 640, height: 480 } },
        // },
        // },
        // },
        {
          name: "chromeUI",
          dependencies: ["mainAccountSetup"],
          use: {
            ...devices["Desktop Chrome"],
            viewport: { width: 1920, height: 1080 },
            storageState: path.resolve(
              __dirname,
              "../auth/storageStates/mainAccountSetup.json"
            ),
          },
        },
        // {
        //   name: "api_Dev",
        //   testDir: "./tests/e2e/api/tests/",
        //   dependencies: ["apiDevSetup"],
        //   use: {
        //     baseURL: "https://api.dev.com:5443",
        //     storageState: "playwright/auth/apiDev.json",
        //   },
        // },
        // {
        //   name: "edge_Dev_UI",
        //   testDir: "./tests/e2e/ui/tests/",
        //   dependencies: ["uiDevSetup"],
        //   use: {
        //     baseURL: "https://desktop.dev.com",
        //     ...devices["Desktop Edge"],
        //     viewport: { width: 1920, height: 1080 },
        //     storageState: "playwright/auth/uiDevQa.json",
        //   },
        // },
        // {
        //   name: "safari_Dev_UI",
        //   testDir: "./tests/e2e/ui/desktop/uiTests/",
        //   dependencies: ["uiDevSetup"],
        //   use: {
        //     baseURL: "https://desktop.dev.com",
        //     ...devices["Desktop Safari"],
        //     viewport: { width: 1920, height: 1080 },
        //     storageState: "playwright/auth/uiDevQa.json",
        //   },
        // },
        // {
        //   name: "firefox_Dev_UI",
        //   testDir: "./tests/e2e/ui/tests/",
        //   dependencies: ["uiDevSetup"],
        //   use: {
        //     baseURL: "https://desktop.dev.com",
        //     ...devices["Desktop Firefox"],
        //     viewport: { width: 1920, height: 1080 },
        //     storageState: "playwright/auth/uiDevQa.json",
        //   },
        // },
        {
          name: "iosUI",
          dependencies: ["mainAccountSetup"],
          use: {
            ...devices["iPhone 14 Pro Max"],
            storageState: path.resolve(
              __dirname,
              "../auth/storageStates/mainAccountSetup.json"
            ),
          },
        },
        // {
        //   name: "android_Dev_UI",
        //   testDir: "./tests/e2e/ui/desktop/uiTests/",
        //   dependencies: ["devSetup"],
        //   use: {
        //     baseURL: "https://desktop.dev.com",
        //     ...devices["Pixel 7"],
        //     storageState: "playwright/auth/uiDevMain.json",
        //   },
        // },
        // {
        //   name: "chrome_Stage_UI",
        //   testDir: "./tests/e2e/ui/desktop/uiTests/",
        //   dependencies: ["stageSetup"],
        //   use: {
        //     baseURL: "https://desktop.staging.com",
        //     ...devices["Desktop Chrome"],
        //     viewport: { width: 1920, height: 1080 },
        //     storageState: "playwright/auth/uiStageQa.json",
        //   },
        // },
      ],
});
