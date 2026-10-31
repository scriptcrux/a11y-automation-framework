import { Page, expect } from '@playwright/test';

export interface ElementFocusInfo {
  tagName: string;
  id: string;
  role: string | null;
  ariaLabel: string | null;
  innerText: string | null;
  testId: string | null;
}

export async function getFocusedElementInfo(page: Page): Promise<ElementFocusInfo> {
  return await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) {
      return {
        tagName: 'BODY',
        id: '',
        role: null,
        ariaLabel: null,
        innerText: null,
        testId: null
      };
    }
    return {
      tagName: el.tagName,
      id: el.id,
      role: el.getAttribute('role'),
      ariaLabel: el.getAttribute('aria-label'),
      innerText: el.innerText ? el.innerText.trim().slice(0, 50) : null,
      testId: el.getAttribute('data-testid')
    };
  });
}

export async function tabThrough(page: Page, count: number = 1): Promise<void> {
  for (let i = 0; i < count; i++) {
    await page.keyboard.press('Tab');
  }
}

export async function shiftTabThrough(page: Page, count: number = 1): Promise<void> {
  for (let i = 0; i < count; i++) {
    await page.keyboard.press('Shift+Tab');
  }
}

export async function assertActiveElement(page: Page, selector: string) {
  const isMatch = await page.evaluate((sel) => {
    const target = document.querySelector(sel);
    return document.activeElement === target;
  }, selector);

  expect(isMatch, `Expected focus to be on selector "${selector}"`).toBe(true);
}

export async function assertFocusRingVisible(page: Page, selector: string) {
  const outlineInfo = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const style = window.getComputedStyle(el);
    return {
      outlineWidth: style.outlineWidth,
      outlineStyle: style.outlineStyle,
      outlineColor: style.outlineColor,
      boxShadow: style.boxShadow
    };
  }, selector);

  expect(outlineInfo).not.toBeNull();
  const hasOutline = outlineInfo?.outlineStyle !== 'none' && outlineInfo?.outlineWidth !== '0px';
  const hasShadow = outlineInfo?.boxShadow !== 'none' && outlineInfo?.boxShadow !== '';
  expect(hasOutline || hasShadow, `Expected element "${selector}" to have a visible focus indicator`).toBe(true);
}

