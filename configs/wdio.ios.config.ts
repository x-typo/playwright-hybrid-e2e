import type { Options } from "@wdio/types";
import { format } from "date-fns";

export const config: Options.Testrunner = {
  user: "tyson.illi",
  key: "PyKUk6aMGP3iCLh0H37SrjV54Ev8KyHvibzTBXcCSLe47UVtsQ",
  hostname: "mobile-hub.lambdatest.com",
  port: 80,
  path: "/wd/hub",
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: "../tsconfig.json",
      transpileOnly: true,
    },
  },

  specs: ["../tests/appium/features/**/*.test.ts"],

  exclude: [],
  maxInstances: 1,

  capabilities: [
    {
      platformName: "ios",
      deviceName: "iPhone 14 Pro Max",
      platformVersion: "16",
      isRealMobile: true,
      app: "lt://APP10160461201757468751875869",
      build: `UI Build - iOS - ${format(new Date(), "MM-dd-yyyy HH:mm:ss")}`,
      autoWebview: "true",
      autoGrantPermissions: true,
    },
  ],

  logLevel: "error",
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ["lambdatest"],
  framework: "mocha",
  reporters: process.env.CI
    ? [
        "spec",
        [
          "junit",
          {
            outputDir: "../mobile-junit-reports",
            outputFileFormat: function (opts) {
              return `results-${opts.cid}.xml`;
            },
          },
        ],
      ]
    : ["spec"],
  mochaOpts: {
    ui: "bdd",
    timeout: 180000,
  },
};
