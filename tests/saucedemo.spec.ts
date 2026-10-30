import { test, expect, Page } from '@playwright/test';

async function login(page: Page, user = 'standard_user', pass = 'secret_sauce') {
  await page.goto('/');
  await page.getByTestId('username').fill(user);
  await page.getByTestId('password').fill(pass);
  await page.getByTestId('login-button').click();
}

test('login: valid user sees product list', async ({ page }) => {
  await login(page);
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByTestId('title')).toHaveText('Products');
});

test('login: wrong password shows error', async ({ page }) => {
  await login(page, 'standard_user', 'wrong_password');
  await expect(page.getByTestId('error')).toContainText('Username and password do not match');
});

test('login: locked out user is blocked', async ({ page }) => {
  await login(page, 'locked_out_user');
  await expect(page.getByTestId('error')).toContainText('locked out');
});

test('cart: add item updates badge', async ({ page }) => {
  await login(page);
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
});

test('inventory: sort by price low to high', async ({ page }) => {
  await login(page);
  await page.getByTestId('product-sort-container').selectOption('lohi');
  const texts = await page.getByTestId('inventory-item-price').allTextContents();
  const prices = texts.map((t) => parseFloat(t.replace('$', '')));
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});

test('checkout: full purchase end-to-end', async ({ page }) => {
  await login(page);
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('shopping-cart-link').click();
  await page.getByTestId('checkout').click();
  await page.getByTestId('firstName').fill('Alla');
  await page.getByTestId('lastName').fill('Golosenko');
  await page.getByTestId('postalCode').fill('46500');
  await page.getByTestId('continue').click();
  await page.getByTestId('finish').click();
  await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
});
