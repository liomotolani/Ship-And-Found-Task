import type { CSSProperties } from 'react';

export const labelStyle: CSSProperties = {
  display: 'block',
  fontFamily: 'var(--type-label-large-font-family)',
  fontSize: 'var(--type-label-large-size)',
  fontWeight: 'var(--type-label-large-weight)',
  lineHeight: 'var(--type-label-large-line-height)',
  letterSpacing: 'var(--type-label-large-letter-spacing)',
  color: 'var(--color-on-surface)',
  marginBottom: '0.5rem',
};

export const inputStyle: CSSProperties = {
  width: '100%',
  fontFamily: 'var(--type-body-large-font-family)',
  fontSize: 'var(--type-body-large-size)',
  fontWeight: 'var(--type-body-large-weight)',
  lineHeight: 'var(--type-body-large-line-height)',
  letterSpacing: 'var(--type-body-large-letter-spacing)',
  color: 'var(--color-on-surface)',
  backgroundColor: 'var(--color-surface-container-lowest)',
  border: '1px solid var(--color-outline-variant)',
  borderRadius: '8px',
  padding: '0.75rem',
};

export const errorTextStyle: CSSProperties = {
  fontFamily: 'var(--type-body-medium-font-family)',
  fontSize: 'var(--type-body-medium-size)',
  fontWeight: 'var(--type-body-medium-weight)',
  lineHeight: 'var(--type-body-medium-line-height)',
  letterSpacing: 'var(--type-body-medium-letter-spacing)',
  color: 'var(--color-error)',
  marginTop: '0.5rem',
};

export const successTextStyle: CSSProperties = {
  fontFamily: 'var(--type-body-medium-font-family)',
  fontSize: 'var(--type-body-medium-size)',
  fontWeight: 'var(--type-body-medium-weight)',
  lineHeight: 'var(--type-body-medium-line-height)',
  letterSpacing: 'var(--type-body-medium-letter-spacing)',
  color: 'var(--color-success)',
  marginBottom: '1rem',
};

export const submitButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--type-label-large-font-family)',
  fontSize: 'var(--type-label-large-size)',
  fontWeight: 'var(--type-label-large-weight)',
  lineHeight: 'var(--type-label-large-line-height)',
  letterSpacing: 'var(--type-label-large-letter-spacing)',
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-on-primary)',
  padding: '0.875rem 2rem',
  borderRadius: '0.5rem',
  border: 'none',
  cursor: 'pointer',
  boxShadow: 'var(--shadow-soft)',
};

export const linkStyle: CSSProperties = {
  fontFamily: 'var(--type-label-large-font-family)',
  fontSize: 'var(--type-label-large-size)',
  fontWeight: 'var(--type-label-large-weight)',
  lineHeight: 'var(--type-label-large-line-height)',
  letterSpacing: 'var(--type-label-large-letter-spacing)',
  color: 'var(--color-primary)',
  textDecoration: 'underline',
};

export const linkRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  marginTop: '1rem',
};
