# Test Plan

## 1. Purpose
Verify the main user flows of a demo e-commerce web app (UI) and a booking REST API,
and keep an automated regression suite that runs on every change.

## 2. Systems under test
- UI: https://www.saucedemo.com (public demo shop)
- API: https://restful-booker.herokuapp.com (public demo booking service)

## 3. Scope
**In scope:** login (valid, invalid, locked user), product sorting, cart, end-to-end checkout,
booking API CRUD flow, authorization checks on the API.

**Out of scope:** performance, load, security testing, cross-browser and mobile coverage,
visual regression.

## 4. Approach
- Functional, regression, integration and end-to-end testing, automated with Playwright (TypeScript).
- UI tests use the Page Object pattern; shared setup lives in fixtures.
- API tests cover the full create / read / update / delete cycle plus a negative authorization case.
- Tags: `@smoke` marks the critical path, run on every push and pull request.
  The full suite runs on a weekday schedule and on demand.

## 5. Scenarios
| ID | Area | Scenario | Type | Smoke |
|----|------|----------|------|-------|
| UI-01 | Login | Valid user reaches the product list | UI | yes |
| UI-02 | Login | Wrong password shows an error | UI, negative | no |
| UI-03 | Login | Locked-out user is blocked | UI, negative | no |
| UI-04 | Cart | Adding an item updates the cart badge | UI | yes |
| UI-05 | Inventory | Sorting by price low to high | UI | no |
| UI-06 | Checkout | Full purchase end to end | E2E | yes |
| API-01 | Auth | Token is issued for valid credentials | API | no |
| API-02 | Booking | Create a booking | API | no |
| API-03 | Booking | Read the created booking | API | no |
| API-04 | Booking | Update without token returns 403 | API, negative | no |
| API-05 | Booking | Update with token succeeds | API | no |
| API-06 | Booking | Delete, then read returns 404 | API | no |

## 6. Risks
- Public demo services can be slow or unavailable, which may cause flaky failures.
- Demo data and behavior can change without notice.
- Locators depend on `data-test` attributes provided by the demo app.

## 7. Entry and exit criteria
- Entry: the application and API respond; dependencies installed.
- Exit: all smoke tests pass for a merge; full regression passes before a release.

## 8. Reporting
Playwright HTML report is stored as a CI artifact for every run.
Failures are analyzed with screenshots and traces.
