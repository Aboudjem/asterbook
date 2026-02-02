import { test, expect } from '@playwright/test';

test.describe('Staking Page', () => {
  test('should redirect unauthenticated users', async ({ page }) => {
    await page.goto('/staking');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test.describe('Authenticated User', () => {
    test.skip('should display staking vaults', async ({ page }) => {
      // Requires authentication
      await page.goto('/staking');

      await expect(page.locator('h1')).toContainText(/Staking/i);
    });

    test.skip('should show APY information', async ({ page }) => {
      await page.goto('/staking');

      // Check for APY display
      await expect(page.locator('text=/APY|%/')).toBeVisible();
    });
  });
});

test.describe('DeFi Page', () => {
  test('should redirect unauthenticated users', async ({ page }) => {
    await page.goto('/defi');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe('Bridge Page', () => {
  test('should redirect unauthenticated users', async ({ page }) => {
    await page.goto('/bridge');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe('Lending Page', () => {
  test('should redirect unauthenticated users', async ({ page }) => {
    await page.goto('/lending');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe('Buy ASTER Page', () => {
  test('should redirect unauthenticated users', async ({ page }) => {
    await page.goto('/buyaster');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe('Shop Page', () => {
  test('should redirect unauthenticated users', async ({ page }) => {
    await page.goto('/shop');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
