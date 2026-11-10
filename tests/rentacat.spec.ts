import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:8080';

// Test fixture
test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
  await page.evaluate(() => {
    document.cookie = '1=false';
    document.cookie = '2=false';
    document.cookie = '3=false';
  });
});

test('TEST-1-RESET', async ({ page }) => {
  await page.evaluate(() => {
    document.cookie = '1=true';
    document.cookie = '2=true';
    document.cookie = '3=true';
  });

  await page.getByRole('link', { name: 'Reset' }).click();

  const listing = page.locator('#listing li');
  await expect(listing.nth(0)).toHaveText('ID 1. Jennyanydots');
  await expect(listing.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(listing.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog' }).click();

  const secondImage = page.locator('ol li').nth(1).locator('img');
  await expect(secondImage).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog' }).click();

  const listing = page.locator('#listing li');
  await expect(listing).toHaveCount(3);
  await expect(listing.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();

  await expect(page.getByRole('button', { name: 'Rent', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Return', exact: true })).toBeVisible();
});

test('TEST-5-RENT', async ({ page }) => {
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
  await page.locator('#rentID').fill('1');
  await page.getByRole('button', { name: 'Rent', exact: true }).click();

  const listing = page.locator('#listing li');
  await expect(listing.nth(0)).toHaveText('Rented out');
  await expect(listing.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(listing.nth(2)).toHaveText('ID 3. Mistoffelees');
  await expect(page.locator('#rentResult')).toHaveText('Success!');
});

test('TEST-6-RETURN', async ({ page }) => {
  await page.evaluate(() => {
    document.cookie = '2=true';
    document.cookie = '3=true';
  });

  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
  await page.locator('#returnID').fill('2');
  await page.getByRole('button', { name: 'Return', exact: true }).click();

  const listing = page.locator('#listing li');
  await expect(listing.nth(0)).toHaveText('ID 1. Jennyanydots');
  await expect(listing.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(listing.nth(2)).toHaveText('Rented out');
  await expect(page.locator('#returnResult')).toHaveText('Success!');
});

test('TEST-7-FEED-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

  await expect(page.getByRole('button', { name: 'Feed', exact: true })).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => {
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
  await page.locator('#catnips').fill('6');
  await page.getByRole('button', { name: 'Feed', exact: true }).click();

  await expect(page.locator('#feedResult')).toHaveText('Nom, nom, nom.', { timeout: 10000 });
});

test('TEST-9-GREET-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Greet-A-Cat' }).click();

  await expect(page.locator('#greeting')).toHaveText('Meow!Meow!Meow!');
});

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
  await page.goto(baseURL + '/greet-a-cat/Jennyanydots');

  await expect(page.locator('#greeting')).toHaveText('Meow! from Jennyanydots.');
});

test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
  await page.evaluate(() => {
    document.cookie = '1=true';
    document.cookie = '2=true';
    document.cookie = '3=true';
  });

  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

  await expect(page.locator('body')).toHaveScreenshot();
});