import { test, expect, type Page } from '@playwright/test';

/**
 * E2E happy path: login → SearchAPL → search → result table → paginate.
 * Uses MSW browser worker (VITE_USE_MOCK=true via .env.development).
 */

async function loginAs(page: Page, username = 'am_vu', password = 'Evidenceiq1!') {
  await page.goto('/login');
  await page.getByRole('textbox', { name: /username/i }).fill(username);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /^login$/i }).click();
  await expect(page).toHaveURL(/\/app($|\/)/);
}

test.describe('SearchAPL happy path', () => {
  test('login → search → result rows → paginate', async ({ page }) => {
    await loginAs(page);
    await page.goto('/app/search-apl');
    await expect(page.getByRole('heading', { name: /APL Reports/i }).first()).toBeVisible();

    // Submit empty search (returns 47 rows)
    await page.getByRole('button', { name: /^Search$/i }).click();

    // Wait for results — first APL ID visible
    await expect(page.getByText('1000000').first()).toBeVisible({ timeout: 5000 });

    // "47 records" count text
    await expect(page.getByText(/47 records?/i)).toBeVisible();

    // Pagination shows page 1, click page 2
    await page.getByRole('button', { name: '2' }).click();

    // Page 2 has different rows (row 25 should appear)
    await expect(page.getByText('1000025')).toBeVisible({ timeout: 5000 });
  });

  test('filter by APL ID narrows results', async ({ page }) => {
    await loginAs(page);
    await page.goto('/app/search-apl');

    await page.getByLabel(/APL ID/i).fill('1000005');
    await page.getByRole('button', { name: /^Search$/i }).click();

    await expect(page.getByText(/1 record/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('1000005')).toBeVisible();
  });

  test('logout returns to /login', async ({ page }) => {
    await loginAs(page);
    await page.getByRole('button', { name: /^Logout$/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('sticky header on result table', async ({ page }) => {
    await loginAs(page);
    await page.goto('/app/search-apl');
    await page.getByRole('button', { name: /^Search$/i }).click();
    await expect(page.getByText('1000000').first()).toBeVisible({ timeout: 5000 });

    const header = page.locator('table thead').first();
    const position = await header.evaluate((el) => window.getComputedStyle(el).position);
    expect(['sticky', '-webkit-sticky']).toContain(position);
  });
});
