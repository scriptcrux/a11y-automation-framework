import React from 'react';
import { Info, AlertTriangle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'info' | 'alert';
  message: string;
}

interface ToastNotificationProps {
  notifications: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  notifications,
  onDismiss
}) => {
  return (
    <div
      role="region"
      aria-label="Notifications"
      className="toast-container"
    >
      {/* Polite live region for standard info */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {notifications
          .filter((n) => n.type === 'info')
          .map((n) => n.message)
          .join('. ')}
      </div>

      {/* Assertive live region for critical alerts */}
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {notifications
          .filter((n) => n.type === 'alert')
          .map((n) => n.message)
          .join('. ')}
      </div>

      {/* Visual notification toasts with dismiss controls */}
      {notifications.map((n) => (
        <div
          key={n.id}
          role={n.type === 'alert' ? 'alert' : 'status'}
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: `2px solid ${n.type === 'alert' ? 'var(--error)' : 'var(--primary)'}`,
            borderRadius: 'var(--radius)',
            padding: '1rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}
          data-testid={`toast-${n.id}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {n.type === 'alert' ? (
              <AlertTriangle size={20} color="var(--error)" aria-hidden="true" />
            ) : (
              <Info size={20} color="var(--primary)" aria-hidden="true" />
            )}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              {n.message}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(n.id)}
            aria-label={`Dismiss notification: ${n.message}`}
            className="btn btn-secondary"
            style={{ minHeight: '32px', minWidth: '32px', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
};

