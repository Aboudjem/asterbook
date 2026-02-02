import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.describe('Auth Pages', () => {
    test('login page visual snapshot', async ({ page }) => {
      await page.goto('/auth/login');
      await page.waitForLoadState('networkidle');

      // Wait for animations to settle
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('login-page.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('register page visual snapshot', async ({ page }) => {
      await page.goto('/auth/register');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('register-page.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });

  test.describe('Landing Page', () => {
    test('homepage visual snapshot', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('homepage.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });

  test.describe('Glassmorphism Effects', () => {
    test('glass panels render correctly on login', async ({ page }) => {
      await page.goto('/auth/login');
      await page.waitForLoadState('networkidle');

      // Check for glass card element
      const glassCard = page.locator('.ac-card, .glass-card');
      await expect(glassCard).toBeVisible();

      // Visual check of glass effect
      await expect(glassCard).toHaveScreenshot('glass-card-login.png');
    });
  });

  test.describe('Responsive Layout', () => {
    test('login page mobile view', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/auth/login');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('login-mobile.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('login page tablet view', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/auth/login');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('login-tablet.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('login page desktop view', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/auth/login');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('login-desktop.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });
});
