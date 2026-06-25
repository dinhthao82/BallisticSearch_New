import { test, expect } from '@playwright/test';

/**
 * Cross-page integration: login → home → search-apl → submit-rapid → logout.
 * Verifies the protected-route shell, navigation between features, and the
 * lazy-route Suspense fallback doesn't break the flow.
 */
test.describe('Cross-page navigation', () => {
  test('login → home → search-apl → submit-rapid → logout', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.getByRole('textbox', { name: /username/i }).fill('e2euser');
    await page.getByLabel(/password/i).fill('secret');
    await page.getByRole('button', { name: /^login$/i }).click();

    // 2. Land on home (/app)
    await expect(page).toHaveURL(/\/app($|\/$)/);
    await expect(page.getByText(/welcome, e2euser/i)).toBeVisible();

    // 3. Click "Search APL" quick action → /app/search-apl
    await page.getByRole('link', { name: /search apl/i }).click();
    await expect(page).toHaveURL(/\/app\/search-apl/);
    await expect(page.getByRole('heading', { name: /APL Reports/i }).first()).toBeVisible();

    // 4. Navigate to submit-rapid via nav button (in ProtectedLayout sidebar)
    //    Alternative: direct URL navigation works (router supports it)
    await page.goto('/app/submit-rapid');
    await expect(page.getByText(/submit rapid ballistics/i)).toBeVisible();

    // 5. Logout from header
    await page.getByRole('button', { name: /logout/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('deep link /app/case-number works after login', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: /username/i }).fill('e2euser');
    await page.getByLabel(/password/i).fill('secret');
    await page.getByRole('button', { name: /^login$/i }).click();

    // Direct URL to a feature route
    await page.goto('/app/case-number');
    await expect(page.getByText(/audit inquiry/i)).toBeVisible();
    await expect(page.getByRole('textbox', { name: /case number/i })).toBeVisible();
  });

  test('home page renders 8 quick-action cards', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: /username/i }).fill('e2euser');
    await page.getByLabel(/password/i).fill('secret');
    await page.getByRole('button', { name: /^login$/i }).click();

    await expect(page).toHaveURL(/\/app($|\/$)/);
    const cards = page.getByTestId('home-quick-action');
    await expect(cards).toHaveCount(8);
  });
});
