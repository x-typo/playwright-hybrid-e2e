module.exports = {
  targets: [
    {
      name: "teams",
      condition: "always",
      inputs: {
        url: process.env.TEAMS_WEBHOOK_URL,
        publish: "test-summary-slim",
        title: "Playwright E2E Tests Result - Destkop (Chrome)",
        title_link: "https://github.com/x-typo/playwright-hybrid-e2e",
        width: "full",
      },
      extensions: [
        {
          name: "hyperlinks",
          condition: "always",
          inputs: {
            links: [
              {
                text: "GitHub - x-typo",
                url: "https://github.com/x-typo",
              },
              {
                text: "Repo - Playwright Hybrid E2E",
                url: "https://github.com/x-typo/playwright-hybrid-e2e",
              },
              {
                text: "TestRail Reports",
                url: "https://testrail.com",
              },
            ],
          },
        },
      ],
    },
  ],
  results: [
    {
      type: "junit",
      files: ["../desktop-junit-reports/*.xml"],
    },
  ],
};
