import { test, expect } from '@playwright/test';
import {
  tabThrough,
  shiftTabThrough,
  getFocusedElementInfo,
  assertFocusRingVisible
} from '../utils/keyboard-helper';

test.describe('Keyboard Navigation & Focus Management (WCAG 2.1.1, 2.4.3, 2.4.7)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Skip Link: first Tab key press focuses the skip link and Enter moves focus to #main-content', async ({ page }) => {
    // First Tab press from initial state
    await page.keyboard.press('Tab');

    // Skip link should be focused
    const focused = await getFocusedElementInfo(page);
    expect(focused.testId).toBe('skip-link');

    // Skip link should be visibly positioned when focused
    const skipLink = page.locator('[data-testid="skip-link"]');
    await expect(skipLink).toBeVisible();

    // Pressing Enter activates the skip link
    await page.keyboard.press('Enter');

    // Focus should now be inside #main-content
    const mainFocused = await getFocusedElementInfo(page);
    expect(mainFocused.id).toBe('main-content');
  });

  test('Focus indicators: interactive elements display visible focus ring upon keyboard Tab', async ({ page }) => {
    // Tab to first navigation item
    await tabThrough(page, 2);
    await assertFocusRingVisible(page, '[data-testid="nav-dashboard"]');

    // Tab to next navigation item
    await page.keyboard.press('Tab');
    await assertFocusRingVisible(page, '[data-testid="nav-forms"]');
  });

  test('Modal Dialog Focus Trap: keeps Tab cycle strictly enclosed within open modal', async ({ page }) => {
    // Open Quick Transfer Modal
    const openBtn = page.locator('[data-testid="open-quick-transfer-btn"]');
    await openBtn.click();

    const modal = page.locator('[data-testid="accessible-modal"]');
    await expect(modal).toBeVisible();

    // Wait for first focusable item inside modal to receive focus (Close button)
    const closeBtn = page.locator('[data-testid="modal-close-button"]');
    await expect(closeBtn).toBeFocused();

    const initialFocus = await getFocusedElementInfo(page);
    expect(initialFocus.testId).toBe('modal-close-button');

    // Tab through fields inside modal
    await page.keyboard.press('Tab'); // Recipient select
    await page.keyboard.press('Tab'); // Amount input
    await page.keyboard.press('Tab'); // Cancel button
    await page.keyboard.press('Tab'); // Confirm button (last focusable element)

    const confirmFocus = await getFocusedElementInfo(page);
    expect(confirmFocus.testId).toBe('modal-submit-btn');

    // Pressing Tab on the last element should WRAP around back to the first element (close button)
    await page.keyboard.press('Tab');
    const wrappedFocus = await getFocusedElementInfo(page);
    expect(wrappedFocus.testId).toBe('modal-close-button');

    // Pressing Shift+Tab on first element should WRAP backwards to the last element (confirm button)
    await page.keyboard.press('Shift+Tab');
    const backwardWrappedFocus = await getFocusedElementInfo(page);
    expect(backwardWrappedFocus.testId).toBe('modal-submit-btn');
  });

  test('Modal Dialog Escape Key & Focus Restoration: pressing Escape closes modal and restores focus to trigger button', async ({ page }) => {
    const openBtn = page.locator('[data-testid="open-quick-transfer-btn"]');
    await openBtn.focus();
    await page.keyboard.press('Enter'); // Open via keyboard

    const modal = page.locator('[data-testid="accessible-modal"]');
    await expect(modal).toBeVisible();

    // Press Escape key
    await page.keyboard.press('Escape');

    // Modal should be closed
    await expect(modal).not.toBeVisible();

    // Focus must be restored back to the trigger button
    const restoredFocus = await getFocusedElementInfo(page);
    expect(restoredFocus.testId).toBe('open-quick-transfer-btn');
  });

  test('WAI-ARIA Tabs: Arrow keys cycle active tabs and update aria-selected & tabindex', async ({ page }) => {
    await page.click('[data-testid="nav-widgets"]');

    const tabStatement = page.locator('[data-testid="tab-statement"]');
    const tabSecurity = page.locator('[data-testid="tab-security"]');
    const tabPreferences = page.locator('[data-testid="tab-preferences"]');

    // Focus first tab
    await tabStatement.focus();
    await expect(tabStatement).toHaveAttribute('aria-selected', 'true');
    await expect(tabStatement).toHaveAttribute('tabindex', '0');
    await expect(tabSecurity).toHaveAttribute('aria-selected', 'false');
    await expect(tabSecurity).toHaveAttribute('tabindex', '-1');

    // Press ArrowRight to move to Security tab
    await page.keyboard.press('ArrowRight');
    await expect(tabSecurity).toHaveAttribute('aria-selected', 'true');
    await expect(tabSecurity).toHaveAttribute('tabindex', '0');
    await expect(tabStatement).toHaveAttribute('aria-selected', 'false');

    // Press ArrowRight to move to Preferences tab
    await page.keyboard.press('ArrowRight');
    await expect(tabPreferences).toHaveAttribute('aria-selected', 'true');

    // Press ArrowRight again: wraps around to first tab (Statement)
    await page.keyboard.press('ArrowRight');
    await expect(tabStatement).toHaveAttribute('aria-selected', 'true');

    // Press ArrowLeft: wraps backwards to last tab (Preferences)
    await page.keyboard.press('ArrowLeft');
    await expect(tabPreferences).toHaveAttribute('aria-selected', 'true');

    // Press Home: jumps to first tab
    await page.keyboard.press('Home');
    await expect(tabStatement).toHaveAttribute('aria-selected', 'true');

    // Press End: jumps to last tab
    await page.keyboard.press('End');
    await expect(tabPreferences).toHaveAttribute('aria-selected', 'true');
  });
});

