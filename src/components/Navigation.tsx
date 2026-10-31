import React from 'react';
import { Landmark, Bell } from 'lucide-react';
import { ThemeToggle, ThemeMode } from './ThemeToggle';

export type PageId = 'dashboard' | 'forms' | 'widgets' | 'violations';

interface NavigationProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  unreadCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onNavigate,
  theme,
  onThemeChange,
  unreadCount = 3
}) => {
  return (
    <header className="site-header" role="banner">
      <div className="brand-section">
        <Landmark size={28} color="var(--primary)" aria-hidden="true" />
        <span>Apex Financial</span>
        <span className="brand-badge">WCAG 2.2 Ready</span>
      </div>

      <nav className="primary-nav" aria-label="Main Application Navigation">
        <ul>
          <li>
            <button
              type="button"
              className="nav-link-btn"
              aria-current={currentPage === 'dashboard' ? 'page' : undefined}
              onClick={() => onNavigate('dashboard')}
              data-testid="nav-dashboard"
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              type="button"
              className="nav-link-btn"
              aria-current={currentPage === 'forms' ? 'page' : undefined}
              onClick={() => onNavigate('forms')}
              data-testid="nav-forms"
            >
              Transfer & Pay
            </button>
          </li>
          <li>
            <button
              type="button"
              className="nav-link-btn"
              aria-current={currentPage === 'widgets' ? 'page' : undefined}
              onClick={() => onNavigate('widgets')}
              data-testid="nav-widgets"
            >
              Interactive Widgets
            </button>
          </li>
          <li>
            <button
              type="button"
              className="nav-link-btn"
              aria-current={currentPage === 'violations' ? 'page' : undefined}
              onClick={() => onNavigate('violations')}
              data-testid="nav-violations"
              style={{ color: currentPage === 'violations' ? undefined : 'var(--error)' }}
            >
              Defects Sandbox
            </button>
          </li>
        </ul>
      </nav>

      <div className="header-actions">
        <ThemeToggle currentTheme={theme} onThemeChange={onThemeChange} />

        <button
          type="button"
          className="btn btn-secondary"
          aria-label={`${unreadCount} unread account alerts`}
          style={{ position: 'relative', padding: '0.5rem' }}
          data-testid="header-notifications-btn"
        >
          <Bell size={20} aria-hidden="true" />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: 'var(--error)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                borderRadius: '9999px',
                padding: '2px 6px'
              }}
              aria-hidden="true"
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

