import React, { useState, useEffect } from 'react';
import { SkipLink } from './components/SkipLink';
import { Navigation, PageId } from './components/Navigation';
import { ThemeMode } from './components/ThemeToggle';
import { ToastNotification, ToastMessage } from './components/ToastNotification';
import { Dashboard } from './pages/Dashboard';
import { FormDemo } from './pages/FormDemo';
import { ComponentsDemo } from './pages/ComponentsDemo';
import { ViolationsGallery } from './pages/ViolationsGallery';
import './styles/app.css';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const addToast = (message: string, type: 'info' | 'alert' = 'info') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      message
    };
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 6000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="app-container">
      {/* WCAG 2.4.1 Bypass Blocks - Skip Link */}
      <SkipLink targetId="main-content" />

      {/* Primary Navigation & Header Landmark */}
      <Navigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        theme={theme}
        onThemeChange={setTheme}
        unreadCount={toasts.length > 0 ? toasts.length : 2}
      />

      {/* Main Content Landmark */}
      <main id="main-content" tabIndex={-1}>
        {currentPage === 'dashboard' && <Dashboard onNotify={addToast} />}
        {currentPage === 'forms' && <FormDemo onNotify={addToast} />}
        {currentPage === 'widgets' && <ComponentsDemo onNotify={addToast} />}
        {currentPage === 'violations' && <ViolationsGallery />}
      </main>

      {/* Toast & Live Region Notifications */}
      <ToastNotification notifications={toasts} onDismiss={dismissToast} />

      {/* Footer Landmark */}
      <footer className="site-footer" role="contentinfo">
        <p>
          © 2026 Apex Financial Services Corp. Built strictly adhering to W3C WAI-ARIA 1.2,
          WCAG 2.1 & 2.2 AA Compliance Guidelines.
        </p>
      </footer>
    </div>
  );
};

export default App;

