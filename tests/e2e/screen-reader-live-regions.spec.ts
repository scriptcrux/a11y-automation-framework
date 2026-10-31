import { test, expect } from '@playwright/test';
import {
  waitForPoliteAnnouncement,
  waitForAssertiveAnnouncement
} from '../utils/screen-reader-helper';

test.describe('Screen Reader Live Region Announcements (WCAG 4.1.3 Status Messages)', () => {
  test('Sync Balances action triggers polite aria-live status update', async ({ page }) => {
    await page.goto('/');

    const refreshBtn = page.locator('[data-testid="refresh-btn"]');
    await refreshBtn.click();

    // Verify polite live region receives announcement
    await waitForPoliteAnnouncement(page, 'Account balances updated successfully');
  });

  test('Polite toast notification dynamically updates polite screen reader region', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="nav-widgets"]');

    const triggerBtn = page.locator('[data-testid="trigger-polite-toast"]');
    await triggerBtn.click();

    await waitForPoliteAnnouncement(page, 'Standard background report generated successfully.');
  });

  test('Assertive alert notification dynamically updates assertive screen reader region', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="nav-widgets"]');

    const triggerBtn = page.locator('[data-testid="trigger-assertive-toast"]');
    await triggerBtn.click();

    await waitForAssertiveAnnouncement(page, 'Security alert: Unusual login detected from new IP subnet.');
  });
});

