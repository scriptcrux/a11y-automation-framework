import React, { useState, useRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormValues {
  recipientName: string;
  accountNumber: string;
  transferType: 'standard' | 'express' | 'wire';
  amount: string;
  memo: string;
  confirmAgreement: boolean;
}

interface FormErrors {
  recipientName?: string;
  accountNumber?: string;
  amount?: string;
  confirmAgreement?: string;
}

interface AccessibleFormProps {
  onSuccess?: (values: FormValues) => void;
}

export const AccessibleForm: React.FC<AccessibleFormProps> = ({ onSuccess }) => {
  const [values, setValues] = useState<FormValues>({
    recipientName: '',
    accountNumber: '',
    transferType: 'standard',
    amount: '',
    memo: '',
    confirmAgreement: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!values.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required.';
    } else if (values.recipientName.trim().length < 3) {
      newErrors.recipientName = 'Recipient name must be at least 3 characters.';
    }

    if (!values.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required.';
    } else if (!/^\d{8,12}$/.test(values.accountNumber.trim())) {
      newErrors.accountNumber = 'Account number must be between 8 and 12 digits.';
    }

    const numAmount = parseFloat(values.amount);
    if (!values.amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid transfer amount greater than $0.00.';
    } else if (numAmount > 10000) {
      newErrors.amount = 'Transfer amount cannot exceed daily limit of $10,000.00.';
    }

    if (!values.confirmAgreement) {
      newErrors.confirmAgreement = 'You must acknowledge the transfer authorization terms.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validate();

    if (!isValid) {
      setIsSubmitted(false);
      // Accessibility best practice: focus error summary or first invalid field
      setTimeout(() => {
        if (errorSummaryRef.current) {
          errorSummaryRef.current.focus();
        }
      }, 50);
    } else {
      setIsSubmitted(true);
      if (onSuccess) {
        onSuccess(values);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-labelledby="form-title" data-testid="accessible-form">
      <h2 id="form-title">Direct Funds Transfer Request</h2>
      <p>Please provide the required details to initiate your domestic or international transfer.</p>

      {/* Error Summary Banner */}
      {Object.keys(errors).length > 0 && (
        <div
          ref={errorSummaryRef}
          role="alert"
          tabIndex={-1}
          className="alert-banner alert-error"
          aria-labelledby="error-summary-heading"
          data-testid="error-summary"
        >
          <AlertCircle size={24} aria-hidden="true" />
          <div>
            <h3 id="error-summary-heading">There are {Object.keys(errors).length} errors in your submission</h3>
            <ul>
              {errors.recipientName && (
                <li>
                  <a href="#recipient-name">{errors.recipientName}</a>
                </li>
              )}
              {errors.accountNumber && (
                <li>
                  <a href="#account-number">{errors.accountNumber}</a>
                </li>
              )}
              {errors.amount && (
                <li>
                  <a href="#transfer-amount">{errors.amount}</a>
                </li>
              )}
              {errors.confirmAgreement && (
                <li>
                  <a href="#confirm-agreement">{errors.confirmAgreement}</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {isSubmitted && (
        <div
          role="status"
          aria-live="polite"
          className="alert-banner alert-success"
          data-testid="success-summary"
        >
          <CheckCircle2 size={24} aria-hidden="true" />
          <div>
            <h3>Transfer Request Successfully Submitted</h3>
            <p>Your transfer of ${parseFloat(values.amount).toFixed(2)} to {values.recipientName} has been queued.</p>
          </div>
        </div>
      )}

      <fieldset className="fieldset-custom">
        <legend>Recipient Information</legend>

        {/* Recipient Name Field */}
        <div className="form-group">
          <label htmlFor="recipient-name" className="form-label">
            Recipient Full Name <span className="required-indicator" aria-hidden="true">*</span>
          </label>
          <input
            ref={nameInputRef}
            id="recipient-name"
            type="text"
            className="form-input"
            value={values.recipientName}
            onChange={(e) => setValues({ ...values, recipientName: e.target.value })}
            aria-required="true"
            aria-invalid={!!errors.recipientName}
            aria-describedby={`recipient-name-help ${errors.recipientName ? 'recipient-name-error' : ''}`}
            autoComplete="name"
            data-testid="input-recipient-name"
          />
          <div id="recipient-name-help" className="form-help">
            Enter the legal name as registered on the beneficiary bank account.
          </div>
          {errors.recipientName && (
            <div id="recipient-name-error" className="form-error" role="alert" data-testid="error-recipient-name">
              <AlertCircle size={16} aria-hidden="true" /> {errors.recipientName}
            </div>
          )}
        </div>

        {/* Account Number Field */}
        <div className="form-group">
          <label htmlFor="account-number" className="form-label">
            Account / Routing Number <span className="required-indicator" aria-hidden="true">*</span>
          </label>
          <input
            id="account-number"
            type="text"
            inputMode="numeric"
            className="form-input"
            value={values.accountNumber}
            onChange={(e) => setValues({ ...values, accountNumber: e.target.value })}
            aria-required="true"
            aria-invalid={!!errors.accountNumber}
            aria-describedby={`account-number-help ${errors.accountNumber ? 'account-number-error' : ''}`}
            data-testid="input-account-number"
          />
          <div id="account-number-help" className="form-help">
            Must contain between 8 and 12 digits without spaces or dashes.
          </div>
          {errors.accountNumber && (
            <div id="account-number-error" className="form-error" role="alert" data-testid="error-account-number">
              <AlertCircle size={16} aria-hidden="true" /> {errors.accountNumber}
            </div>
          )}
        </div>
      </fieldset>

      <fieldset className="fieldset-custom">
        <legend>Transfer Delivery Speed</legend>
        <div className="radio-group" role="radiogroup" aria-label="Transfer speed options">
          <label className="radio-label">
            <input
              type="radio"
              name="transferType"
              value="standard"
              checked={values.transferType === 'standard'}
              onChange={() => setValues({ ...values, transferType: 'standard' })}
              data-testid="radio-standard"
            />
            <span>Standard ACH (1-3 Business Days - Free)</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="transferType"
              value="express"
              checked={values.transferType === 'express'}
              onChange={() => setValues({ ...values, transferType: 'express' })}
              data-testid="radio-express"
            />
            <span>Express Transfer (Same Day - $1.50 Fee)</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="transferType"
              value="wire"
              checked={values.transferType === 'wire'}
              onChange={() => setValues({ ...values, transferType: 'wire' })}
              data-testid="radio-wire"
            />
            <span>Domestic Wire (Immediate - $15.00 Fee)</span>
          </label>
        </div>
      </fieldset>

      <fieldset className="fieldset-custom">
        <legend>Transaction Details</legend>

        {/* Amount Field */}
        <div className="form-group">
          <label htmlFor="transfer-amount" className="form-label">
            Amount (USD) <span className="required-indicator" aria-hidden="true">*</span>
          </label>
          <input
            id="transfer-amount"
            type="number"
            step="0.01"
            min="1"
            max="10000"
            className="form-input"
            value={values.amount}
            onChange={(e) => setValues({ ...values, amount: e.target.value })}
            aria-required="true"
            aria-invalid={!!errors.amount}
            aria-describedby={`transfer-amount-help ${errors.amount ? 'transfer-amount-error' : ''}`}
            placeholder="0.00"
            data-testid="input-amount"
          />
          <div id="transfer-amount-help" className="form-help">
            Maximum single domestic transaction limit: $10,000.00.
          </div>
          {errors.amount && (
            <div id="transfer-amount-error" className="form-error" role="alert" data-testid="error-amount">
              <AlertCircle size={16} aria-hidden="true" /> {errors.amount}
            </div>
          )}
        </div>

        {/* Optional Memo Field with live character counter */}
        <div className="form-group">
          <label htmlFor="transfer-memo" className="form-label">
            Transfer Memo / Reference (Optional)
          </label>
          <textarea
            id="transfer-memo"
            className="form-textarea"
            rows={3}
            maxLength={100}
            value={values.memo}
            onChange={(e) => setValues({ ...values, memo: e.target.value })}
            aria-describedby="memo-counter"
            data-testid="input-memo"
          />
          <div id="memo-counter" className="form-help" aria-live="polite">
            {100 - values.memo.length} characters remaining
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="checkbox-group">
          <label className="checkbox-label" htmlFor="confirm-agreement">
            <input
              id="confirm-agreement"
              type="checkbox"
              checked={values.confirmAgreement}
              onChange={(e) => setValues({ ...values, confirmAgreement: e.target.checked })}
              aria-required="true"
              aria-invalid={!!errors.confirmAgreement}
              aria-describedby={errors.confirmAgreement ? 'confirm-agreement-error' : undefined}
              data-testid="checkbox-agreement"
            />
            <span>I confirm that the recipient information is accurate and authorize the debit.</span>
          </label>
          {errors.confirmAgreement && (
            <div id="confirm-agreement-error" className="form-error" role="alert" data-testid="error-agreement">
              <AlertCircle size={16} aria-hidden="true" /> {errors.confirmAgreement}
            </div>
          )}
        </div>
      </fieldset>

      <div>
        <button type="submit" className="btn btn-primary" data-testid="submit-transfer-btn">
          Review and Submit Transfer
        </button>
      </div>
    </form>
  );
};

