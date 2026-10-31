import { test, expect } from '@playwright/test';
import { runAxeAudit, formatAxeViolations } from '../utils/axe-helper';

test.describe('Color Contrast Verification Across Themes (WCAG 1.4.3 Level AA & 1.4.6 AAA)', () => {
  test('Standard Light Theme must satisfy minimum 4.5:1 contrast ratio', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await runAxeAudit(page, {
      rules: { 'color-contrast': { enabled: true } },
      reportName: 'contrast-light-theme'
    });

    const contrastViolations = results.violations.filter((v) => v.id === 'color-contrast');
    if (contrastViolations.length > 0) {
      console.error(formatAxeViolations(contrastViolations));
    }
    expect(contrastViolations).toEqual([]);
  });

  test('Accessible Dark Theme must satisfy minimum 4.5:1 contrast ratio', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('[data-testid="theme-selector"]', 'dark');

    // Wait for theme CSS transition
    await page.waitForTimeout(300);

    const results = await runAxeAudit(page, {
      rules: { 'color-contrast': { enabled: true } },
      reportName: 'contrast-dark-theme'
    });

    const contrastViolations = results.violations.filter((v) => v.id === 'color-contrast');
    if (contrastViolations.length > 0) {
      console.error(formatAxeViolations(contrastViolations));
    }
    expect(contrastViolations).toEqual([]);
  });

  test('High Contrast Mode must satisfy strict high contrast standards', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('[data-testid="theme-selector"]', 'high-contrast');

    await page.waitForTimeout(300);

    const results = await runAxeAudit(page, {
      rules: { 'color-contrast': { enabled: true } },
      reportName: 'contrast-high-contrast-theme'
    });

    const contrastViolations = results.violations.filter((v) => v.id === 'color-contrast');
    if (contrastViolations.length > 0) {
      console.error(formatAxeViolations(contrastViolations));
    }
    expect(contrastViolations).toEqual([]);
  });
});

