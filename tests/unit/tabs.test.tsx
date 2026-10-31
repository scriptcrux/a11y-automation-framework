import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { TabsWidget } from '../../src/components/TabsWidget';

describe('Accessibility Unit Test: TabsWidget Component', () => {
  const sampleTabs = [
    { id: 'tab1', label: 'Overview', content: <p>Overview Content</p> },
    { id: 'tab2', label: 'Settings', content: <p>Settings Content</p> },
    { id: 'tab3', label: 'History', content: <p>History Content</p> }
  ];

  it('should have zero WCAG violations on render', async () => {
    const { container } = render(<TabsWidget tabs={sampleTabs} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('sets correct WAI-ARIA tablist, tab, and tabpanel roles', () => {
    render(<TabsWidget tabs={sampleTabs} />);

    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);

    // First tab is selected by default
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('tabindex', '0');

    // Inactive tabs have tabindex -1
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('aria-labelledby', 'tab-tab1');
  });

  it('supports Arrow key navigation between tabs', async () => {
    render(<TabsWidget tabs={sampleTabs} />);
    const tabs = screen.getAllByRole('tab');

    tabs[0].focus();
    expect(document.activeElement).toBe(tabs[0]);

    // Press ArrowRight to move to Tab 2
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(tabs[1]);

    // Press End to jump to last tab
    await userEvent.keyboard('{End}');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(tabs[2]);

    // Press Home to jump to first tab
    await userEvent.keyboard('{Home}');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(tabs[0]);
  });
});

