import React from 'react';

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

interface ThemeToggleProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="theme-toggle-container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <label htmlFor="theme-selector" className="theme-selector-label">
        Display Theme:
      </label>
      <select
        id="theme-selector"
        className="theme-select"
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value as ThemeMode)}
        aria-label="Select display theme mode"
        data-testid="theme-selector"
      >
        <option value="light">Standard Light</option>
        <option value="dark">Accessible Dark</option>
        <option value="high-contrast">High Contrast Mode (WCAG AAA)</option>
      </select>
    </div>
  );
};

