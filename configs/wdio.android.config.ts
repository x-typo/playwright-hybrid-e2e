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
      platformName: "Android",
      deviceName: "Galaxy S24 Ultra",
      platformVersion: "14",
      isRealMobile: true,
      app: "lt://APP10160261801757468749506405",
      build: `UI Build - Android - ${format(
        new Date(),
        "MM-dd-yyyy HH:mm:ss"
      )}`,
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
            embedAnnotationsAsProperties: true,
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
