import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
  await page.fill('input[formcontrolname="username"]', 'demo');
  await page.fill('input[formcontrolname="password"]', 'demo');
  await expect(page.locator('button[type="submit"]')).toBeEnabled();
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
  const authToken = await page.evaluate(() =>
    localStorage.getItem('authToken')
  );
  expect(authToken).not.toBeNull();
  expect(authToken).not.toBe('');
});

test('navigate to add pet and submit form', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Add Pet');
  await expect(page).toHaveURL(/add-pet/);

  // Fill name by placeholder or label
  await page.getByPlaceholder('Enter name').fill('TestPet');

  // Select category
  await page.getByText('Select a pet type').click();
  await page.getByText('Dogs').click();

  const [request] = await Promise.all([
    page.waitForRequest(
      (request) => request.url().includes('/pet') && request.method() === 'POST'
    ),
    page.click('button[type="submit"]'),
  ]);

  await expect(page).toHaveURL('/');
});

test('pet details page displays pet info', async ({ page }) => {
  await page.goto('/');

  const firstPetCard = page.locator('li a').first();
  await firstPetCard.click();

  await expect(page).toHaveURL(/\/pet\/\d+/);
  await expect(page.locator('h2')).toContainText(/Pet Details/i);
  await expect(
    page.locator('.text-gray-700.text-center.md\\:text-left')
  ).toBeVisible();
});

test('logout functionality', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('button:has-text("Logout")')).toBeVisible();
  await page.click('button:has-text("Logout")');
  await expect(page).toHaveURL('/');
  const authToken = await page.evaluate(() =>
    localStorage.getItem('authToken')
  );
  expect(authToken).toBeNull();
});
