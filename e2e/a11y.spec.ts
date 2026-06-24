import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility audit: run axe-core against each route.
 * Filters to 'critical' + 'serious' severity (target: 0 violations).
 * Moderate / minor noted for future cleanup but don't fail POC.
 */

async function loginAndGo(page: import('@playwright/test').Page, path: string) {
  await page.goto('/login');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL(/\/app/);
  if (path !== '/app' && path !== '/app/') {
    await page.goto(path);
  }
}

test.describe('A11y audit', () => {
  test('Login page — no critical or serious violations', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText(/BIQ V5\.1 Login/i)).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const serious = results.violations.filter((v) =>
      ['critical', 'serious'].includes(v.impact ?? 'minor')
    );
    if (serious.length > 0) {
      console.warn('Login serious violations:', JSON.stringify(serious, null, 2));
    }
    expect(serious).toEqual([]);
  });

  test('SearchAPL page (empty) — no critical or serious violations', async ({ page }) => {
    await loginAndGo(page, '/app/search-apl');
    await expect(page.getByRole('heading', { name: /APL Reports/i }).first()).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const serious = results.violations.filter((v) =>
      ['critical', 'serious'].includes(v.impact ?? 'minor')
    );
    if (serious.length > 0) {
      console.warn('SearchAPL empty serious violations:', JSON.stringify(serious, null, 2));
    }
    expect(serious).toEqual([]);
  });

  test('SearchAPL page (with results) — no critical or serious violations', async ({ page }) => {
    await loginAndGo(page, '/app/search-apl');
    await page.getByRole('button', { name: /^Search$/i }).click();
    await expect(page.getByText('1000000').first()).toBeVisible({ timeout: 5000 });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const serious = results.violations.filter((v) =>
      ['critical', 'serious'].includes(v.impact ?? 'minor')
    );
    if (serious.length > 0) {
      console.warn('SearchAPL results serious violations:', JSON.stringify(serious, null, 2));
    }
    expect(serious).toEqual([]);
  });
});
