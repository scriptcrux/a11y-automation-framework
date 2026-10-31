import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Bell, AlertTriangle } from 'lucide-react';
import { TabsWidget, TabItem } from '../components/TabsWidget';
import { ModalDialog } from '../components/ModalDialog';

interface ComponentsDemoProps {
  onNotify: (message: string, type?: 'info' | 'alert') => void;
}

export const ComponentsDemo: React.FC<ComponentsDemoProps> = ({ onNotify }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<Record<string, boolean>>({
    sec1: true,
    sec2: false
  });

  const toggleAccordion = (id: string) => {
    setAccordionOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tabs: TabItem[] = [
    {
      id: 'statement',
      label: 'Monthly Statements',
      content: (
        <div>
          <h3>Monthly Financial Statements</h3>
          <p>Download certified PDF statements archived for the previous 7 fiscal years.</p>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: '2' }}>
            <li><a href="#download-sept" onClick={(e) => e.preventDefault()}>September 2026 Statement (PDF 1.2 MB)</a></li>
            <li><a href="#download-aug" onClick={(e) => e.preventDefault()}>August 2026 Statement (PDF 1.1 MB)</a></li>
            <li><a href="#download-jul" onClick={(e) => e.preventDefault()}>July 2026 Statement (PDF 1.3 MB)</a></li>
          </ul>
        </div>
      )
    },
    {
      id: 'security',
      label: 'Security & 2FA',
      content: (
        <div>
          <h3>Multi-Factor Authentication & Access Control</h3>
          <p>Hardware security key (FIDO2 / WebAuthn) is enabled as your primary MFA method.</p>
          <div style={{ marginTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNotify('Security credentials audit initiated.')}
            >
              Audit Connected Devices
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'preferences',
      label: 'Accessibility Settings',
      content: (
        <div>
          <h3>User Experience Preferences</h3>
          <p>Fine-tune font scaling, motion reduction, and audio cues to suit your assistive setup.</p>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
            <input type="checkbox" defaultChecked />
            <span>Enable screen reader speech summaries for chart changes</span>
          </label>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>Interactive WAI-ARIA Components</h1>
        <p>
          Demonstration of dynamic WAI-ARIA design patterns: Keyboard tabs navigation (arrows, Home/End),
          focus trapping modal dialogs, and disclosure accordions.
        </p>
      </div>

      {/* Tabs Widget Section */}
      <section className="card" aria-labelledby="tabs-demo-heading">
        <h2 id="tabs-demo-heading">WAI-ARIA Tablist Pattern</h2>
        <p>Use Left/Right arrow keys to switch active tabs. Notice focus updates automatically.</p>
        <TabsWidget tabs={tabs} defaultTabId="statement" />
      </section>

      {/* Accordion / Disclosure Pattern */}
      <section className="card" aria-labelledby="accordion-heading">
        <h2 id="accordion-heading">Disclosure (Accordion) Pattern</h2>
        <p>Controls visibility with <code>aria-expanded</code> and <code>aria-controls</code>.</p>

        <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div>
            <button
              type="button"
              id="accordion-btn-1"
              aria-expanded={accordionOpen.sec1}
              aria-controls="accordion-panel-1"
              onClick={() => toggleAccordion('sec1')}
              className="btn btn-secondary"
              style={{
                width: '100%',
                justifyContent: 'space-between',
                borderRadius: 0,
                borderBottom: '1px solid var(--border-color)'
              }}
              data-testid="accordion-btn-1"
            >
              <span>What are the daily ACH wire limits?</span>
              {accordionOpen.sec1 ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
            </button>
            <div
              id="accordion-panel-1"
              role="region"
              aria-labelledby="accordion-btn-1"
              hidden={!accordionOpen.sec1}
              style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)' }}
            >
              <p style={{ margin: 0 }}>
                Standard commercial accounts have a baseline outbound daily ACH limit of $50,000.
                Wire transfers exceeding this require secondary approval via RSA hardware token.
              </p>
            </div>
          </div>

          <div>
            <button
              type="button"
              id="accordion-btn-2"
              aria-expanded={accordionOpen.sec2}
              aria-controls="accordion-panel-2"
              onClick={() => toggleAccordion('sec2')}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'space-between', borderRadius: 0 }}
              data-testid="accordion-btn-2"
            >
              <span>How do I configure delegated administrative roles?</span>
              {accordionOpen.sec2 ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
            </button>
            <div
              id="accordion-panel-2"
              role="region"
              aria-labelledby="accordion-btn-2"
              hidden={!accordionOpen.sec2}
              style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)' }}
            >
              <p style={{ margin: 0 }}>
                Delegated access is managed under Settings &gt; Organization &gt; RBAC Policies.
                Each team member can be assigned read-only auditor, preparer, or approver status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screen Reader Live Region Trigger Tests */}
      <section className="card" aria-labelledby="live-regions-heading">
        <h2 id="live-regions-heading">Screen Reader Live Announcement Testing</h2>
        <p>Trigger polite and assertive <code>aria-live</code> notifications to verify screen reader announcement queue.</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onNotify('Standard background report generated successfully.', 'info')}
            data-testid="trigger-polite-toast"
          >
            <Bell size={18} aria-hidden="true" />
            <span>Trigger Polite Live Notification</span>
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onNotify('Security alert: Unusual login detected from new IP subnet.', 'alert')}
            data-testid="trigger-assertive-toast"
          >
            <AlertTriangle size={18} aria-hidden="true" />
            <span>Trigger Assertive Alert</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            data-testid="open-sample-modal"
          >
            <span>Open Sample Modal Dialog</span>
          </button>
        </div>
      </section>

      {/* Modal Dialog */}
      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Interactive Account Dialog"
        description="Verify that pressing Tab stays trapped inside this dialog, and pressing Escape closes it."
      >
        <div>
          <p>Focus is trapped inside this modal dialog to satisfy WCAG 2.4.3 Focus Order.</p>
          <div className="form-group">
            <label htmlFor="sample-note" className="form-label">Note</label>
            <input id="sample-note" className="form-input" placeholder="Type something..." />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setIsModalOpen(false);
                onNotify('Dialog action confirmed!');
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
};

