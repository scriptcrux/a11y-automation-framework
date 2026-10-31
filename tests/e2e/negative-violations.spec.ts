import { test, expect } from '@playwright/test';
import { runAxeAudit, formatAxeViolations } from '../utils/axe-helper';

test.describe('Negative Testing: Automated Accessibility Violation Detection', () => {
  test('Axe-core must correctly catch intentional WCAG violations in Defects Sandbox', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="nav-violations"]');
    await expect(page.locator('[data-testid="violations-sandbox"]')).toBeVisible();

    const results = await runAxeAudit(page, {
      tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
      reportName: 'negative-test-violations-detected'
    });

    console.log(`\nDetected ${results.violations.length} intentional defects as expected.`);
    console.log(formatAxeViolations(results.violations));

    // Verify axe detected violations
    expect(results.violations.length).toBeGreaterThanOrEqual(4);

    const violationIds = results.violations.map((v) => v.id);

    // 1. Missing form label
    expect(violationIds).toContain('label');

    // 2. Button without accessible name
    expect(violationIds).toContain('button-name');

    // 3. Low color contrast
    expect(violationIds).toContain('color-contrast');

    // 4. Missing image alt attribute
    expect(violationIds).toContain('image-alt');
  });
});

