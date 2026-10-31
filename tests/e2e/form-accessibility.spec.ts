import { test, expect } from '@playwright/test';
import { getFocusedElementInfo } from '../utils/keyboard-helper';

test.describe('Form Accessibility & Error Handling (WCAG 3.3.1, 3.3.2, 3.3.3, 4.1.2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="nav-forms"]');
    await expect(page.locator('[data-testid="accessible-form"]')).toBeVisible();
  });

  test('Submitting invalid form triggers error summary with role="alert" and moves focus', async ({ page }) => {
    const submitBtn = page.locator('[data-testid="submit-transfer-btn"]');
    await submitBtn.click();

    // Error summary banner should be displayed
    const errorSummary = page.locator('[data-testid="error-summary"]');
    await expect(errorSummary).toBeVisible();
    await expect(errorSummary).toHaveAttribute('role', 'alert');

    // Focus should be programmatically moved to the error summary
    const focused = await getFocusedElementInfo(page);
    expect(focused.testId).toBe('error-summary');
  });

  test('Invalid inputs receive aria-invalid="true" and aria-describedby pointing to error IDs', async ({ page }) => {
    const submitBtn = page.locator('[data-testid="submit-transfer-btn"]');
    await submitBtn.click();

    const nameInput = page.locator('[data-testid="input-recipient-name"]');
    const accountInput = page.locator('[data-testid="input-account-number"]');
    const amountInput = page.locator('[data-testid="input-amount"]');
    const agreementCheckbox = page.locator('[data-testid="checkbox-agreement"]');

    // All failed inputs must have aria-invalid="true"
    await expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    await expect(accountInput).toHaveAttribute('aria-invalid', 'true');
    await expect(amountInput).toHaveAttribute('aria-invalid', 'true');
    await expect(agreementCheckbox).toHaveAttribute('aria-invalid', 'true');

    // Error descriptions must be wired via aria-describedby
    const nameDescribedBy = await nameInput.getAttribute('aria-describedby');
    expect(nameDescribedBy).toContain('recipient-name-error');

    const accountDescribedBy = await accountInput.getAttribute('aria-describedby');
    expect(accountDescribedBy).toContain('account-number-error');

    const amountDescribedBy = await amountInput.getAttribute('aria-describedby');
    expect(amountDescribedBy).toContain('transfer-amount-error');
  });

  test('Submitting valid form displays accessible success banner with role="status"', async ({ page }) => {
    // Fill out valid data
    await page.fill('[data-testid="input-recipient-name"]', 'Dr. Evelyn Reed');
    await page.fill('[data-testid="input-account-number"]', '9876543210');
    await page.fill('[data-testid="input-amount"]', '1250.00');
    await page.check('[data-testid="checkbox-agreement"]');

    // Submit form
    await page.click('[data-testid="submit-transfer-btn"]');

    // Error summary should disappear
    await expect(page.locator('[data-testid="error-summary"]')).not.toBeVisible();

    // Success banner should appear with role="status" and aria-live="polite"
    const successBanner = page.locator('[data-testid="success-summary"]');
    await expect(successBanner).toBeVisible();
    await expect(successBanner).toHaveAttribute('role', 'status');
    await expect(successBanner).toHaveAttribute('aria-live', 'polite');
    await expect(successBanner).toContainText('Transfer Request Successfully Submitted');
  });
});

