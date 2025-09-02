import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

export default defineConfig({
  testDir: ".",
  snapshotPathTemplate:
    "tests/e2e/ui/visualTestsSnapshots/{testFileDir}/{arg}{projectName}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 2 : 2,
  reporter: process.env.CI
    ? [
        ["list"],
        [
          "junit",
          {
            outputFile: "./desktop-junit-reports/junit.xml",
            embedAnnotationsAsProperties: true,
          },
        ],
        ["html"],
      ]
    : [["list"], ["html", { open: "never" }]],
  use: {
    headless: true,
    trace: "retain-on-failure",
  },
  timeout: 60000, //Timeout is shared between all tests.
  expect: {
    timeout: 30000, //Expect timeout is shared between all tests.
  },

  projects: process.env.CI
    ? [
        { name: "mainAccountSetup", testMatch: /mainAccountSetup.ts/ },
        // { name: "uiStageSetup", testMatch: /uiStageSetup.ts/ },
        // },
        // },
        {
          name: "chromeUI",
          testDir: "./tests/e2e/ui/desktop/uiTests/",
          dependencies: ["mainAccountSetup"],
          use: {
            baseURL: "https://qa-practice.netlify.app/",
            ...devices["Desktop Chrome"],
            viewport: { width: 1920, height: 1080 },
            storageState: "auth/storageStates/mainAccountSetup.json",
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
          testDir: "./tests/e2e/ui/desktop/uiTests/",
          dependencies: ["mainAccountSetup"],
          use: {
            baseURL: "https://qa-practice.netlify.app/",
            ...devices["iPhone 14 Pro Max"],
            storageState: "auth/storageStates/mainAccountSetup.json",
          },
        },
      ]
    : [
        {
          name: "mainAccountSetup",
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
          testDir: "./tests/e2e/ui/desktop/uiTests/",
          dependencies: ["mainAccountSetup"],
          use: {
            baseURL: "https://qa-practice.netlify.app/",
            ...devices["Desktop Chrome"],
            viewport: { width: 1920, height: 1080 },
            storageState: "auth/storageStates/mainAccountSetup.json",
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
          testDir: "./tests/e2e/ui/desktop/uiTests/",
          dependencies: ["mainAccountSetup"],
          use: {
            baseURL: "https://qa-practice.netlify.app/",
            ...devices["iPhone 14 Pro Max"],
            storageState: "auth/storageStates/mainAccountSetup.json",
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
