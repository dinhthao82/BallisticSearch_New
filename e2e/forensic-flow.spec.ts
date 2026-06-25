import { test, expect, type Page } from '@playwright/test';

/**
 * Forensic core cross-page flow: login → SearchEvent → select 2 rows →
 * Compare → close → Export popup → submit → toast. Then drive over to
 * SearchCSAProcess and SearchQAReports as smoke tests.
 *
 * Real MSW handlers respond — covers full client → mock backend stack.
 */

async function loginAs(page: Page, username = 'forensic_user', password = 'secret') {
  await page.goto('/login');
  await page.getByRole('textbox', { name: /username/i }).fill(username);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /^login$/i }).click();
  await expect(page).toHaveURL(/\/app($|\/)/);
}

test.describe('Forensic core cross-page flow', () => {
  test('login → SearchEvent → Compare → Export → toast', async ({ page }) => {
    await loginAs(page);
    await page.goto('/app/search-event');
    await expect(page.getByText(/Search Events/i).first()).toBeVisible();

    // Submit search
    await page.getByRole('button', { name: /^Search$/i }).click();
    // First event row visible
    await expect(page.getByText('EV-20000').first()).toBeVisible({ timeout: 5000 });

    // Compare disabled until 2 rows selected
    const compareBtn = page.getByRole('button', { name: /^Compare/i });
    await expect(compareBtn).toBeDisabled();

    // Select first 2 rows by their compare checkboxes (aria-label match)
    await page.getByLabel('Select event EV-20000 for compare').check();
    await page.getByLabel('Select event EV-20001 for compare').check();

    // Compare now enabled — click
    await expect(compareBtn).toBeEnabled();
    await compareBtn.click();

    // Compare dialog shows 2 sides
    await expect(page.getByText(/Compare events/i)).toBeVisible();
    const sides = page.getByTestId('compare-side');
    await expect(sides).toHaveCount(2);

    // Close compare
    await page.getByRole('button', { name: /^Close$/i }).click();

    // Export popup
    await page.getByRole('button', { name: /^Export$/i }).click();
    await expect(page.getByText(/Export search events/i)).toBeVisible();
    await page.getByRole('button', { name: /submit export/i }).click();

    // Success toast appears
    await expect(page.getByText(/Export job EXP-/i)).toBeVisible({ timeout: 5000 });
  });

  test('SearchCSA smoke test — search returns rows', async ({ page }) => {
    await loginAs(page);
    await page.goto('/app/search-csa');
    await page.getByRole('button', { name: /^Search$/i }).click();
    await expect(page.getByText('CSA-5000').first()).toBeVisible({ timeout: 5000 });
  });

  test('SearchQA smoke test — search returns rows', async ({ page }) => {
    await loginAs(page);
    await page.goto('/app/search-qa');
    await page.getByRole('button', { name: /^Search$/i }).click();
    await expect(page.getByText('QA-7000').first()).toBeVisible({ timeout: 5000 });
  });
});
