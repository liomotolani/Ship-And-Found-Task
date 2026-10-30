'use client';

import type { CSSProperties } from 'react';
import { useActionState } from 'react';
import {
  signUpAction,
  type SignUpState,
} from '@/server/actions/sign-up';

const initialState: SignUpState = {};

const label: CSSProperties = {
  display: 'block',
  fontFamily: 'var(--type-label-large-font-family)',
  fontSize: 'var(--type-label-large-size)',
  fontWeight: 'var(--type-label-large-weight)',
  lineHeight: 'var(--type-label-large-line-height)',
  letterSpacing: 'var(--type-label-large-letter-spacing)',
  color: 'var(--color-on-surface)',
  marginBottom: '0.5rem',
};

const input: CSSProperties = {
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

const errorText: CSSProperties = {
  fontFamily: 'var(--type-body-medium-font-family)',
  fontSize: 'var(--type-body-medium-size)',
  fontWeight: 'var(--type-body-medium-weight)',
  lineHeight: 'var(--type-body-medium-line-height)',
  letterSpacing: 'var(--type-body-medium-letter-spacing)',
  color: 'var(--color-error)',
  marginTop: '0.5rem',
};

const successText: CSSProperties = {
  fontFamily: 'var(--type-body-medium-font-family)',
  fontSize: 'var(--type-body-medium-size)',
  fontWeight: 'var(--type-body-medium-weight)',
  lineHeight: 'var(--type-body-medium-line-height)',
  letterSpacing: 'var(--type-body-medium-letter-spacing)',
  color: 'var(--color-success)',
  marginBottom: '1rem',
};

const submitButton: CSSProperties = {
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

export default function SignUpForm() {
  const [state, formAction, pending] = useActionState(
    signUpAction,
    initialState,
  );

  return (
    <form action={formAction} noValidate>
      {state.success ? (
        <p role="status" style={successText}>
          {state.success}
        </p>
      ) : null}

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="name" style={label}>
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={100}
          style={input}
          aria-invalid={state.field === 'name' ? true : undefined}
          aria-describedby={state.field === 'name' ? 'name-error' : undefined}
        />
        {state.field === 'name' && state.error ? (
          <p id="name-error" role="alert" style={errorText}>
            {state.error}
          </p>
        ) : null}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="email" style={label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          style={input}
          aria-invalid={state.field === 'email' ? true : undefined}
          aria-describedby={
            state.field === 'email' ? 'email-error' : undefined
          }
        />
        {state.field === 'email' && state.error ? (
          <p id="email-error" role="alert" style={errorText}>
            {state.error}
          </p>
        ) : null}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="password" style={label}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          style={input}
          aria-invalid={state.field === 'password' ? true : undefined}
          aria-describedby={
            state.field === 'password' ? 'password-error' : undefined
          }
        />
        {state.field === 'password' && state.error ? (
          <p id="password-error" role="alert" style={errorText}>
            {state.error}
          </p>
        ) : null}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="age"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--type-body-large-font-family)',
            fontSize: 'var(--type-body-large-size)',
            fontWeight: 'var(--type-body-large-weight)',
            lineHeight: 'var(--type-body-large-line-height)',
            letterSpacing: 'var(--type-body-large-letter-spacing)',
            color: 'var(--color-on-surface)',
          }}
        >
          <input
            id="age"
            name="age"
            type="checkbox"
            aria-invalid={state.field === 'age' ? true : undefined}
            aria-describedby={state.field === 'age' ? 'age-error' : undefined}
          />
          I am 18 or over
        </label>
        {state.field === 'age' && state.error ? (
          <p id="age-error" role="alert" style={errorText}>
            {state.error}
          </p>
        ) : null}
      </div>

      {state.error && !state.field ? (
        <p role="alert" style={errorText}>
          {state.error}
        </p>
      ) : null}

      <button type="submit" style={submitButton} disabled={pending}>
        Sign up
      </button>
    </form>
  );
}
