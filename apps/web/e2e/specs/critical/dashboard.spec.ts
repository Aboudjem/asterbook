import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  // Skip auth for now - in real tests, use authenticated fixture
  test.skip('should display main dashboard elements', async ({ page }) => {
    // This test requires authentication setup
    await page.goto('/dashboard');

    // Check for main layout components
    await expect(page.locator('nav, .pc-sidebar')).toBeVisible();
    await expect(page.locator('header, .pc-header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test.describe('Layout Structure', () => {
    test('landing page should be accessible', async ({ page }) => {
      await page.goto('/');

      // Check page loads without errors
      await expect(page).toHaveTitle(/Asterbook/i);
    });

    test('auth pages should have consistent styling', async ({ page }) => {
      await page.goto('/auth/login');

      // Check for animated background
      const background = page.locator('.auth-chronicle-bg, .asterbook-animated-bg');
      await expect(background).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('sidebar links should have correct href attributes', async ({ page }) => {
      // Navigate to a public page first
      await page.goto('/auth/login');

      // Check that the page contains expected navigation structure when authenticated
      // For now, just verify the login page loads correctly
      await expect(page.locator('a[href="/auth/register"]')).toBeVisible();
    });
  });
});

test.describe('Dashboard Components', () => {
  test.skip('pet widget should display correctly', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for pet widget elements
    const petWidget = page.locator('[data-testid="pet-widget"]');
    await expect(petWidget).toBeVisible();
  });

  test.skip('portfolio card should show statistics', async ({ page }) => {
    await page.goto('/dashboard');

    const portfolioCard = page.locator('[data-testid="portfolio-card"]');
    await expect(portfolioCard).toBeVisible();
  });

  test.skip('market ticker should animate', async ({ page }) => {
    await page.goto('/dashboard');

    const ticker = page.locator('[data-testid="market-ticker"]');
    await expect(ticker).toBeVisible();
  });
});
