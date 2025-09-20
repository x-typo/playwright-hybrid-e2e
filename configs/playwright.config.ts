import {
  defineConfig,
  devices,
  type PlaywrightTestConfig,
} from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MainAccountFile = path.resolve(
  __dirname,
  "../auth/storageStates/mainAccountSetup.json"
);

const config: PlaywrightTestConfig = defineConfig({
  globalSetup: path.resolve(__dirname, "../auth/authSetups/global-setup.ts"),
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
  },

  timeout: 60_000,
  expect: { timeout: 30_000 },

  projects: [
    {
      name: "chromeUI",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        storageState: MainAccountFile,
      },
    },
    {
      name: "iosUI",
      use: {
        ...devices["iPhone 14 Pro Max"],
        storageState: MainAccountFile,
      },
    },
  ],
});

export default config;
