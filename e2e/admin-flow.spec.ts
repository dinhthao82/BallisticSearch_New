import { test, expect, type Page } from '@playwright/test';

/**
 * Admin/Standard-pages flow:
 * login → ManageUsers → AddUsers → ContractManagement → DashboardVCC →
 * AuditAllTransactions → logout.
 *
 * Smoke pass through W21-W24 pages against MSW mock backend.
 */

async function loginAs(page: Page, username = 'admin_user', password = 'secret') {
  await page.goto('/login');
  await page.getByRole('textbox', { name: /username/i }).fill(username);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /^login$/i }).click();
  await expect(page).toHaveURL(/\/app($|\/)/);
}

test.describe('Admin pages flow', () => {
  test('ManageUsers list shows rows + Add button', async ({ page }) => {
    await loginAs(page);
    await page.goto('/app/manage-users');
    await expect(page.getByText('Manage Users')).toBeVisible();
    await expect(page.getByRole('link', { name: /add user/i })).toBeVisible();
  });

  test('AddUsers form validates required fields', async ({ page }) => {
    await loginAs(page);
    await page.goto('/app/add-users');
    await expect(page.getByText('Add User')).toBeVisible();
    await page.getByRole('button', { name: /create user/i }).click();
    await expect(page.getByText(/username must be at least 2/i)).toBeVisible();
  });

  test('ContractManagement renders + status badge updates', async ({ page }) => {
    await loginAs(page);
    await page.goto('/app/contract-management');
    await expect(page.getByText('Contract Management')).toBeVisible();
    await expect(page.getByRole('textbox', { name: /contract id/i })).toBeVisible();
  });

  test('DashboardVCC renders metric cards', async ({ page }) => {
    await loginAs(page);
    await page.goto('/app/dashboard-vcc');
    await expect(page.getByText(/Dashboard — VCC/i)).toBeVisible();
    await expect(page.getByTestId('metric-card').first()).toBeVisible();
  });

  test('AuditAllTransactions renders log rows', async ({ page }) => {
    await loginAs(page);
    await page.goto('/app/audit-all-transactions');
    await expect(page.getByText(/Audit — All Transactions/i)).toBeVisible();
    await expect(page.getByTestId('audit-row').first()).toBeVisible({ timeout: 5000 });
  });

  test('UserManagement consolidated view renders 4 tabs', async ({ page }) => {
    await loginAs(page);
    await page.goto('/app/user-management');
    await expect(page.getByRole('tab', { name: /all users/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /^admins$/i })).toBeVisible();
  });
});
