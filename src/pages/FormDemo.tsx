import React from 'react';
import { AccessibleForm } from '../components/AccessibleForm';

interface FormDemoProps {
  onNotify: (message: string, type?: 'info' | 'alert') => void;
}

export const FormDemo: React.FC<FormDemoProps> = ({ onNotify }) => {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>Funds Transfer Center</h1>
        <p>
          This form demonstrates compliance with WCAG 2.1 & 2.2 form requirements:
          explicit labeling, inline error descriptions via <code>aria-describedby</code>,
          logical grouping with <code>fieldset</code> & <code>legend</code>, dynamic live regions,
          and programmatic focus management on error submission.
        </p>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <AccessibleForm
          onSuccess={(values) => {
            onNotify(`Transfer of $${values.amount} to ${values.recipientName} has been processed!`);
          }}
        />
      </div>
    </div>
  );
};

