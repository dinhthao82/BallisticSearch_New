import { test, expect } from '@playwright/test';

/**
 * E2E happy path: login → SearchAPL → search → result table → paginate.
 * Uses MSW browser worker (VITE_USE_MOCK=true via .env.development).
 */
test.describe('SearchAPL happy path', () => {
  test('login → search → result rows → paginate', async ({ page }) => {
    // 1. Land on /login
    await page.goto('/login');
    await expect(page.getByText(/BIQ V5\.1 Login/i)).toBeVisible();

    // 2. Submit login (mock — any credentials → Admin role)
    await page.getByRole('button', { name: /login/i }).click();

    // 3. Land on /app/search-apl
    await expect(page).toHaveURL(/\/app\/search-apl/);
    await expect(page.getByRole('heading', { name: /APL Reports/i }).first()).toBeVisible();

    // 4. Submit empty search (returns 47 rows)
    await page.getByRole('button', { name: /^Search$/i }).click();

    // 5. Wait for results — first APL ID visible
    await expect(page.getByText('1000000').first()).toBeVisible({ timeout: 5000 });

    // 6. "47 records" count text
    await expect(page.getByText(/47 records?/i)).toBeVisible();

    // 7. Pagination shows page 1, click page 2
    await page.getByRole('button', { name: '2' }).click();

    // 8. Page 2 has different rows (row 25 should appear)
    await expect(page.getByText('1000025')).toBeVisible({ timeout: 5000 });
  });

  test('filter by APL ID narrows results', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL(/\/app\/search-apl/);

    // Fill APL ID filter
    await page.getByLabel(/APL ID/i).fill('1000005');
    await page.getByRole('button', { name: /^Search$/i }).click();

    // Should show 1 record
    await expect(page.getByText(/1 record/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('1000005')).toBeVisible();
  });

  test('logout returns to /login', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL(/\/app/);

    // Logout from header
    await page.getByRole('button', { name: /^Logout$/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('sticky header on result table', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /login/i }).click();
    await page.getByRole('button', { name: /^Search$/i }).click();
    await expect(page.getByText('1000000').first()).toBeVisible({ timeout: 5000 });

    // Check sticky CSS on header
    const header = page.locator('table thead').first();
    const position = await header.evaluate((el) => window.getComputedStyle(el).position);
    expect(['sticky', '-webkit-sticky']).toContain(position);
  });
});
