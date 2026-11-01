import { test, expect } from './fixtures';

test.describe('Login', () => {
  test('valid user sees product list @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectLoaded();
  });

  test('wrong password shows error', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login('standard_user', 'wrong_password');
    await loginPage.expectError('Username and password do not match');
  });

  test('locked out user is blocked', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.expectError('locked out');
  });
});

test.describe('Inventory and cart', () => {
  test('add item updates cart badge @smoke', async ({ loggedInInventory }) => {
    await loggedInInventory.addToCart('sauce-labs-backpack');
    await loggedInInventory.expectCartCount('1');
  });

  test('sort by price low to high', async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy('lohi');
    const prices = await loggedInInventory.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});

test('full checkout end-to-end @smoke', async ({ loggedInInventory, checkoutPage }) => {
  await loggedInInventory.addToCart('sauce-labs-backpack');
  await loggedInInventory.openCart();
  await checkoutPage.startCheckout();
  await checkoutPage.fillInfo('Alla', 'Golosenko', '46500');
  await checkoutPage.finish();
  await checkoutPage.expectOrderComplete();
});
