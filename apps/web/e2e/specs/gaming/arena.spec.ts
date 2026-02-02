import { test, expect } from '@playwright/test';

test.describe('Arena Page', () => {
  test.describe('Unauthenticated Access', () => {
    test('should redirect to login', async ({ page }) => {
      await page.goto('/arena');
      await expect(page).toHaveURL(/\/auth\/login/);
    });
  });

  test.describe('Pet Arena Features', () => {
    test.skip('should display arena lobby list', async ({ page }) => {
      // Requires authentication
      await page.goto('/arena');

      await expect(page.locator('h1')).toContainText(/Arena/i);
    });

    test.skip('should show battle options', async ({ page }) => {
      await page.goto('/arena');

      // Check for battle controls
      await expect(page.locator('[data-testid="battle-controls"]')).toBeVisible();
    });
  });
});

test.describe('Pet Adventure Page', () => {
  test('should redirect unauthenticated users', async ({ page }) => {
    await page.goto('/pet-adventure');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe('PvP Clash Page', () => {
  test('should redirect unauthenticated users', async ({ page }) => {
    await page.goto('/clash');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe('World Node Page', () => {
  test('should redirect unauthenticated users', async ({ page }) => {
    await page.goto('/world-node');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
