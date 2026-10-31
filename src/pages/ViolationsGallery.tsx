import React from 'react';
import { Search } from 'lucide-react';

export const ViolationsGallery: React.FC = () => {
  return (
    <div data-testid="violations-sandbox">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>Accessibility Defects Sandbox (Negative Test Benchmark)</h1>
        <p>
          This page intentionally includes common real-world accessibility violations.
          Our testing framework uses this page to run negative tests, verifying that automated
          linters and axe-core correctly detect and report real-world WCAG non-compliance issues.
        </p>
      </div>

      <div className="card">
        <h2>Violation Catalog</h2>

        {/* 1. Missing Form Label Violation */}
        <section style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          <h3>1. Missing Form Input Label (WCAG 1.3.1, 4.1.2)</h3>
          <p>These inputs lack any &lt;label&gt;, aria-label, or aria-labelledby:</p>
          <div data-testid="violation-missing-label" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              data-testid="input-no-label"
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" data-testid="checkbox-no-label" />
              {/* Intentionally missing text inside label */}
            </label>
          </div>
        </section>

        {/* 2. Empty Icon Button Violation */}
        <section style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          <h3>2. Button Without Accessible Name (WCAG 4.1.2)</h3>
          <p>This button contains only an SVG icon with no text content, aria-label, or title:</p>
          <div data-testid="violation-empty-button">
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="btn-no-accessible-name"
            >
              <Search size={18} />
            </button>
          </div>
        </section>

        {/* 3. Inadequate Color Contrast Violation */}
        <section style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          <h3>3. Low Color Contrast (WCAG 1.4.3 Contrast Minimum)</h3>
          <p>The text below has a contrast ratio of ~1.4:1 against white (WCAG requires at least 4.5:1):</p>
          <div data-testid="violation-low-contrast" style={{ backgroundColor: '#ffffff', padding: '1rem' }}>
            <p className="violation-low-contrast" data-testid="text-low-contrast">
              This text is practically invisible for users with low vision or in bright sunlight.
            </p>
          </div>
        </section>

        {/* 4. Div-as-a-button (Non-semantic interactive element) */}
        <section style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          <h3>4. Clickable &lt;div&gt; Lacking Keyboard & Role Support (WCAG 2.1.1, 4.1.2)</h3>
          <p>A clickable div that cannot be focused with Tab and does not respond to Enter/Space:</p>
          <div data-testid="violation-div-button">
            <div
              className="fake-div-button"
              onClick={() => alert('Clicked div!')}
              data-testid="fake-button"
            >
              Fake Non-Semantic Button
            </div>
          </div>
        </section>

        {/* 5. Heading hierarchy violation */}
        <section style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          <h3>5. Broken Heading Level Hierarchy (WCAG 1.3.1)</h3>
          <p>An &lt;h5&gt; placed directly under an &lt;h3&gt;, skipping h4:</p>
          <div data-testid="violation-heading-order">
            <h5>Illegitimate Jump to Heading 5</h5>
          </div>
        </section>

        {/* 6. Image Missing Alt Text */}
        <section style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          <h3>6. Informational Image Missing Alt Attribute (WCAG 1.1.1 Non-text Content)</h3>
          <div data-testid="violation-missing-alt">
            {/* Intentionally omitting alt attribute */}
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='40'%3E%3Crect width='100' height='40' fill='%23000'/%3E%3Ctext x='10' y='25' fill='%23fff'%3ELogo%3C/text%3E%3C/svg%3E"
              data-testid="img-no-alt"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

