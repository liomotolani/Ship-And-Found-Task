'use client';

import type { CSSProperties } from 'react';

const buttonStyle: CSSProperties = {
  position: 'absolute',
  right: '0.5rem',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  padding: 0,
  border: 'none',
  borderRadius: '0.375rem',
  backgroundColor: 'transparent',
  color: 'var(--color-on-surface-variant)',
  cursor: 'pointer',
};

type PasswordVisibilityToggleProps = {
  visible: boolean;
  onToggle: () => void;
};

export default function PasswordVisibilityToggle({
  visible,
  onToggle,
}: PasswordVisibilityToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseDown={(event) => event.preventDefault()}
      aria-label={visible ? 'Hide password' : 'Show password'}
      aria-pressed={visible}
      style={buttonStyle}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {visible ? (
          <>
            <path d="M3 3L21 21" />
            <path d="M10.6 10.6a2 2 0 002.8 2.8" />
            <path d="M9.9 4.2A10.5 10.5 0 0112 4c5.5 0 9.5 5 9.5 8a12.6 12.6 0 01-2.1 3.3" />
            <path d="M6.6 6.6C4.3 8.3 2.5 10.8 2.5 12c0 3 4 8 9.5 8a10.8 10.8 0 004.9-1.2" />
          </>
        ) : (
          <>
            <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12Z" />
            <circle cx="12" cy="12" r="3" />
          </>
        )}
      </svg>
    </button>
  );
}
