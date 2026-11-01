# Playwright QA Portfolio

![Playwright Tests](https://github.com/agolosen/playwright-qa-portfolio/actions/workflows/playwright.yml/badge.svg)

Automated UI and API tests built with **Playwright + TypeScript**, structured with the
Page Object pattern and run in **GitHub Actions**.

## What is covered
- **UI** ([saucedemo.com](https://www.saucedemo.com)): login (positive and negative), sorting, cart, end-to-end checkout.
- **API** ([restful-booker](https://restful-booker.herokuapp.com)): token auth, create / read / update / delete a booking, authorization check.

See the [test plan](docs/test-plan.md) for scope, scenarios and risks.

## Tech stack
Playwright Test, TypeScript, Node.js, GitHub Actions.

## Project structure

## Run locally
```bash
npm ci
npx playwright install chromium
npm test            # full suite
npm run smoke       # only @smoke tests
npm run report      # open the HTML report
```

## CI
- Pull requests and pushes to `main`: **smoke** tests (`@smoke`).
- Weekdays 05:00 UTC and on manual trigger: **full regression**.
- The HTML report is uploaded as a build artifact on every run.

## Notes
This is a personal learning and portfolio project. The tested applications are public demo services,
so occasional slowness or unavailability of the API is possible.
