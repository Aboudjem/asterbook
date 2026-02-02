import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.describe('Login Page', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('/auth/login');

      // Check page title and form elements
      await expect(page.locator('h2')).toContainText('Sign In');
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should have Chronicle book design', async ({ page }) => {
      await page.goto('/auth/login');

      // Check for Chronicle-style layout elements
      await expect(page.locator('.ac-book')).toBeVisible();
      await expect(page.locator('.ac-page-left')).toBeVisible();
      await expect(page.locator('.ac-page-right')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/auth/login');

      await page.fill('input[type="email"]', 'invalid@test.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');

      // Wait for error message
      await expect(page.locator('.ac-alert')).toBeVisible({ timeout: 5000 });
    });

    test('should navigate to register page', async ({ page }) => {
      await page.goto('/auth/login');

      await page.click('a[href="/auth/register"]');
      await expect(page).toHaveURL('/auth/register');
    });
  });

  test.describe('Register Page', () => {
    test('should display registration form', async ({ page }) => {
      await page.goto('/auth/register');

      await expect(page.locator('h2')).toContainText(/Create|Register/i);
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test('should have Chronicle book design', async ({ page }) => {
      await page.goto('/auth/register');

      await expect(page.locator('.ac-book')).toBeVisible();
    });

    test('should navigate to login page', async ({ page }) => {
      await page.goto('/auth/register');

      await page.click('a[href="/auth/login"]');
      await expect(page).toHaveURL('/auth/login');
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
      await page.goto('/dashboard');

      // Should redirect to login
      await expect(page).toHaveURL(/\/auth\/login/);
    });

    test('should protect gaming pages', async ({ page }) => {
      await page.goto('/gaming');
      await expect(page).toHaveURL(/\/auth\/login/);
    });

    test('should protect arena pages', async ({ page }) => {
      await page.goto('/arena');
      await expect(page).toHaveURL(/\/auth\/login/);
    });
  });
});
