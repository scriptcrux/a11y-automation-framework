import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { AccessibleForm } from '../../src/components/AccessibleForm';

describe('Accessibility Unit Test: AccessibleForm Component', () => {
  it('should have zero WCAG violations on initial render', async () => {
    const { container } = render(<AccessibleForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('maintains zero WCAG violations after triggering validation errors', async () => {
    const { container } = render(<AccessibleForm />);
    const submitButton = screen.getByRole('button', { name: /Review and Submit Transfer/i });

    // Submit empty form to trigger validation errors
    await userEvent.click(submitButton);

    // Verify error summary exists
    const errorAlert = screen.getByTestId('error-summary');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveAttribute('role', 'alert');

    // Verify axe-core compliance in error state (checking aria-invalid, aria-describedby, etc.)
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('associates error messages and instructions using aria-describedby', async () => {
    render(<AccessibleForm />);
    const submitButton = screen.getByRole('button', { name: /Review and Submit Transfer/i });
    await userEvent.click(submitButton);

    const nameInput = screen.getByLabelText(/Recipient Full Name/i);
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(nameInput).toHaveAttribute('aria-required', 'true');

    const describedBy = nameInput.getAttribute('aria-describedby');
    expect(describedBy).toContain('recipient-name-help');
    expect(describedBy).toContain('recipient-name-error');
  });
});
