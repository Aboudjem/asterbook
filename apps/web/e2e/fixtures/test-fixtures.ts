import { test as base, expect, Page } from '@playwright/test';

// Extend base test with custom fixtures
export const test = base.extend<{
  authenticatedPage: Page;
}>({
  // Add an authenticated page fixture
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login page
    await page.goto('/auth/login');

    // Fill in credentials (test user)
    await page.fill('input[name="email"]', 'test@asterbook.com');
    await page.fill('input[name="password"]', 'testpassword123');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });

    // Use the authenticated page
    await use(page);
  },
});

export { expect };
