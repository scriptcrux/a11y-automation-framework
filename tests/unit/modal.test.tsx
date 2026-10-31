import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { ModalDialog } from '../../src/components/ModalDialog';

describe('Accessibility Unit Test: ModalDialog Component', () => {
  it('should have zero WCAG violations when open', async () => {
    const { container } = render(
      <ModalDialog
        isOpen={true}
        onClose={() => {}}
        title="Test Modal Title"
        description="Test modal description for accessibility testing."
      >
        <div>
          <label htmlFor="test-input">Test Field</label>
          <input id="test-input" type="text" />
          <button type="button">Save Changes</button>
        </div>
      </ModalDialog>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders required WAI-ARIA dialog attributes', () => {
    render(
      <ModalDialog
        isOpen={true}
        onClose={() => {}}
        title="Account Authorization"
        description="Please confirm your wire transaction details."
      >
        <p>Dialog body content</p>
      </ModalDialog>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-heading-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'modal-heading-desc');
    expect(screen.getByText('Account Authorization')).toHaveAttribute('id', 'modal-heading-title');
  });

  it('triggers onClose when Escape key is pressed', async () => {
    const handleClose = vi.fn();
    render(
      <ModalDialog
        isOpen={true}
        onClose={handleClose}
        title="Dismissible Modal"
      >
        <button type="button">Inside Button</button>
      </ModalDialog>
    );

    await userEvent.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

