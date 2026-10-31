import { Page, expect } from '@playwright/test';

export interface LiveRegionState {
  politeText: string;
  assertiveText: string;
}

export async function getLiveRegionAnnouncements(page: Page): Promise<LiveRegionState> {
  return await page.evaluate(() => {
    const polite = document.querySelector('[aria-live="polite"]');
    const assertive = document.querySelector('[aria-live="assertive"]');

    return {
      politeText: polite?.textContent?.trim() || '',
      assertiveText: assertive?.textContent?.trim() || ''
    };
  });
}

export async function waitForPoliteAnnouncement(page: Page, expectedSubstring: string, timeout: number = 5000) {
  await expect.poll(async () => {
    const live = await getLiveRegionAnnouncements(page);
    return live.politeText;
  }, { timeout }).toContain(expectedSubstring);
}

export async function waitForAssertiveAnnouncement(page: Page, expectedSubstring: string, timeout: number = 5000) {
  await expect.poll(async () => {
    const live = await getLiveRegionAnnouncements(page);
    return live.assertiveText;
  }, { timeout }).toContain(expectedSubstring);
}

