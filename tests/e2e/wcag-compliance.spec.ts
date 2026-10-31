import { test, expect } from '@playwright/test';
import { runAxeAudit, formatAxeViolations, STANDARD_WCAG_AA_TAGS } from '../utils/axe-helper';

test.describe('WCAG 2.1 & 2.2 Level AA Compliance Audits', () => {
  test('Dashboard page must satisfy WCAG 2.1 & 2.2 Level AA standards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Run axe audit with HTML & JSON report generation
    const results = await runAxeAudit(page, {
      tags: STANDARD_WCAG_AA_TAGS,
      reportName: 'wcag-audit-dashboard'
    });

    if (results.violations.length > 0) {
      console.error(formatAxeViolations(results.violations));
    }

    expect(
      results.violations,
      `Expected zero WCAG AA violations on Dashboard, found ${results.violations.length}`
    ).toEqual([]);
  });

  test('Transfer & Pay (Forms) page must satisfy WCAG 2.1 & 2.2 Level AA standards', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="nav-forms"]');
    await expect(page.locator('[data-testid="accessible-form"]')).toBeVisible();

    const results = await runAxeAudit(page, {
      tags: STANDARD_WCAG_AA_TAGS,
      reportName: 'wcag-audit-forms'
    });

    if (results.violations.length > 0) {
      console.error(formatAxeViolations(results.violations));
    }

    expect(results.violations).toEqual([]);
  });

  test('Interactive Widgets page must satisfy WCAG 2.1 & 2.2 Level AA standards', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="nav-widgets"]');
    await expect(page.locator('[data-testid="wai-aria-tablist"]')).toBeVisible();

    const results = await runAxeAudit(page, {
      tags: STANDARD_WCAG_AA_TAGS,
      reportName: 'wcag-audit-widgets'
    });

    if (results.violations.length > 0) {
      console.error(formatAxeViolations(results.violations));
    }

    expect(results.violations).toEqual([]);
  });

  test('Quick Transfer Modal Dialog must satisfy WCAG standards when rendered', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="open-quick-transfer-btn"]');
    await expect(page.locator('[data-testid="accessible-modal"]')).toBeVisible();

    // Scope audit specifically to the modal dialog
    const results = await runAxeAudit(page, {
      tags: STANDARD_WCAG_AA_TAGS,
      include: '[data-testid="accessible-modal"]',
      reportName: 'wcag-audit-modal-dialog'
    });

    if (results.violations.length > 0) {
      console.error(formatAxeViolations(results.violations));
    }

    expect(results.violations).toEqual([]);
  });
});

