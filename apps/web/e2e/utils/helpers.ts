import { Page } from '@playwright/test';

/**
 * Wait for page to be fully loaded with all animations settled
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  // Wait for any animations to settle
  await page.waitForTimeout(300);
}

/**
 * Take a full page screenshot for visual comparison
 */
export async function takeFullPageScreenshot(page: Page, name: string) {
  await waitForPageLoad(page);
  return page.screenshot({
    path: `./e2e/screenshots/${name}.png`,
    fullPage: true,
  });
}

/**
 * Check if glassmorphism effects are rendering correctly
 */
export async function checkGlassEffects(page: Page) {
  // Check for glass panels
  const glassPanels = await page.locator('.glass-panel, .glass-card').count();
  return glassPanels > 0;
}

/**
 * Common navigation helper
 */
export async function navigateToPage(page: Page, path: string) {
  await page.goto(path);
  await waitForPageLoad(page);
}
