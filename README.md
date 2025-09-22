<p align="center">
    <img
        width="200px"
        src="https://applitools.com/wp-content/uploads/2022/08/Playwright_logo_long.png"
        />
    </p>

# Playwright Hybrid E2E Framework

A robust end‑to‑end testing solution that seamlessly combines UI and API testing capabilities. Designed for scalability, maintainability, speed, and efficiency, it empowers teams to build reliable automated test suites that deliver fast feedback and adapt easily to evolving project needs.

## Overview

TBD

## Key Features

TBD

# Hybrid Automation Tests

This repository features UI automation framework using Playwright with TypeScript.

[Latest Test Results](https://github.com)

[Test Coverage](https://github.com)

[How to run the tests remotely](https://github.com)

## Requirements

- Recent version of [Node.js](https://nodejs.org/en)
- [Visual Studio Code](https://code.visualstudio.com/) with the [Playwright extension](https://playwright.dev/docs/getting-started-vscode)
- GitHub account with a [Git](https://git-scm.com/) client
- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilotvs) for Visual Studio Code (Not strictly necessary, but it will significantly expedite the process of writing test cases.)

## Getting Started

1. Clone the repository.
2. Install project dependencies.

```
$ npm install
```

## 📁 Repository Structure

```
├── api/                    # Reusable API clients and request handlers
├── auth/                   # Authentication flows (e.g., login state setup)
├── configs/                # Environment-specific configuration files (e.g., staging, prod)
├── fixtures/               # Test data (e.g., user payloads, static responses)
├── reporters/              # Configuration for custom test reporters (e.g., Teams, JUnit)
├── tests/                  # Contains all the test suites (e.g., smoke, regression)
├── visual-snapshots/       # Baseline images for visual regression testing
├── package.json            # Lists project dependencies and defines run scripts
├── README.md               # Main project documentation
└── tsconfig.json           # TypeScript compiler options
```

### Running Tests

```bash
# Run all tests in headless mode
npm run chromeUI
npm run iosUI

# Run tests with visible browser
WIP

# Run tests in UI mode for interactive debugging
npm run chromeDebug
npm run iosDebug

# Open and show Playwright's HTML report
npm run report

# Run tests in Playwright's UI Mode
npm run uiMode

# Run Playwright's Test Generator for desktop/mobile
npm run codeGenDesktop
npm run codeGenMobile
```

## 🔄 Continuous Integration

This framework is designed to work seamlessly with CI/CD pipelines, supporting:

- GitHub Actions
- Jenkins

## 🔧 Framework Extensions

The framework can be easily extended with:

- Visual regression testing
- Performance testing
- Accessibility testing
- Data-driven testing
