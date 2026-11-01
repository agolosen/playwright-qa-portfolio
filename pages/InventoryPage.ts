import { Page, expect } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.page.getByTestId('title')).toHaveText('Products');
  }

  async addToCart(itemSlug: string) {
    await this.page.getByTestId(`add-to-cart-${itemSlug}`).click();
  }

  async expectCartCount(count: string) {
    await expect(this.page.getByTestId('shopping-cart-badge')).toHaveText(count);
  }

  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.page.getByTestId('product-sort-container').selectOption(value);
  }

  async getPrices(): Promise<number[]> {
    const texts = await this.page.getByTestId('inventory-item-price').allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async openCart() {
    await this.page.getByTestId('shopping-cart-link').click();
  }
}
