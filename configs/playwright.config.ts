import {
  defineConfig,
  devices,
  type PlaywrightTestConfig,
} from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path where globalSetup will write the storage state
const MainAccountFile = path.resolve(
  __dirname,
  "../auth/storageStates/mainAccountSetup.json"
);

const config: PlaywrightTestConfig = defineConfig({
  // Run your login/setup script once before all tests
  globalSetup: path.resolve(__dirname, "../auth/authSetups/global-setup.ts"),

  // Where your feature tests live
  testDir: "../tests/playwright/features",

  snapshotPathTemplate:
    "../visual-snapshots/{testFileDir}/{arg}{projectName}{ext}",

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,

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
    baseURL: process.env.UI_BASE_URL,
    headless: true,
    trace: "retain-on-failure",
    storageState: MainAccountFile,
  },

  timeout: 60_000,
  expect: { timeout: 30_000 },

  projects: [
    {
      name: "chromeUI",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "iosUI",
      use: {
        ...devices["iPhone 14 Pro Max"],
      },
    },
  ],
});

export default config;
