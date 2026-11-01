'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { useActionState } from 'react';
import { linkRowStyle, linkStyle } from '@/components/form-styles';
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

      <div
        style={{
          marginBottom: '1.5rem',
          padding: '1.25rem',
          backgroundColor: 'var(--color-surface-container-lowest)',
          border: '1px solid var(--color-outline-variant)',
          borderRadius: '0.75rem',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.875rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: '0.375rem',
                backgroundColor: 'var(--color-primary-container)',
                color: 'var(--color-primary)',
              }}
              aria-hidden="true"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </span>
            <span
              style={{
                fontFamily: 'var(--type-title-medium-font-family)',
                fontSize: 'var(--type-title-medium-size)',
                fontWeight: 'var(--type-title-medium-weight)',
                lineHeight: 'var(--type-title-medium-line-height)',
                letterSpacing: 'var(--type-title-medium-letter-spacing)',
                color: 'var(--color-on-surface)',
              }}
            >
              Terms and conditions
            </span>
          </div>

          <span
            style={{
              display: 'inline-block',
              padding: '0.125rem 0.625rem',
              borderRadius: '1rem',
              backgroundColor: 'var(--color-secondary-container)',
              color: 'var(--color-on-secondary-container)',
              fontFamily: 'var(--type-label-small-font-family)',
              fontSize: 'var(--type-label-small-size)',
              fontWeight: 'var(--type-label-small-weight)',
              lineHeight: 'var(--type-label-small-line-height)',
              letterSpacing: 'var(--type-label-small-letter-spacing)',
            }}
          >
            Please review
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem',
            padding: '0.875rem 1rem',
            backgroundColor: 'var(--color-surface-container-low)',
            borderRadius: '0.5rem',
            marginBottom: '0.875rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.625rem',
            }}
          >
            <span
              style={{
                color: 'var(--color-primary)',
                flexShrink: 0,
                marginTop: '0.125rem',
                display: 'inline-flex',
              }}
              aria-hidden="true"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--type-body-medium-font-family)',
                fontSize: 'var(--type-body-medium-size)',
                fontWeight: 'var(--type-body-medium-weight)',
                lineHeight: 'var(--type-body-medium-line-height)',
                letterSpacing: 'var(--type-body-medium-letter-spacing)',
                color: 'var(--color-on-surface-variant)',
              }}
            >
              <strong
                style={{ color: 'var(--color-on-surface)', fontWeight: 600 }}
              >
                Staff review:
              </strong>{' '}
              VetReply drafts replies from practice-approved documents. Staff
              review and approve every reply before it is sent.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.625rem',
            }}
          >
            <span
              style={{
                color: 'var(--color-primary)',
                flexShrink: 0,
                marginTop: '0.125rem',
                display: 'inline-flex',
              }}
              aria-hidden="true"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--type-body-medium-font-family)',
                fontSize: 'var(--type-body-medium-size)',
                fontWeight: 'var(--type-body-medium-weight)',
                lineHeight: 'var(--type-body-medium-line-height)',
                letterSpacing: 'var(--type-body-medium-letter-spacing)',
                color: 'var(--color-on-surface-variant)',
              }}
            >
              <strong
                style={{ color: 'var(--color-on-surface)', fontWeight: 600 }}
              >
                Emergency care:
              </strong>{' '}
              VetReply is not an emergency service. Online enquiries are not
              monitored for emergencies.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.625rem',
            }}
          >
            <span
              style={{
                color: 'var(--color-primary)',
                flexShrink: 0,
                marginTop: '0.125rem',
                display: 'inline-flex',
              }}
              aria-hidden="true"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--type-body-medium-font-family)',
                fontSize: 'var(--type-body-medium-size)',
                fontWeight: 'var(--type-body-medium-weight)',
                lineHeight: 'var(--type-body-medium-line-height)',
                letterSpacing: 'var(--type-body-medium-letter-spacing)',
                color: 'var(--color-on-surface-variant)',
              }}
            >
              <strong
                style={{ color: 'var(--color-on-surface)', fontWeight: 600 }}
              >
                Eligibility &amp; security:
              </strong>{' '}
              You must be 18 or over, keep your account secure, and use
              VetReply lawfully.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.625rem',
            }}
          >
            <span
              style={{
                color: 'var(--color-primary)',
                flexShrink: 0,
                marginTop: '0.125rem',
                display: 'inline-flex',
              }}
              aria-hidden="true"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--type-body-medium-font-family)',
                fontSize: 'var(--type-body-medium-size)',
                fontWeight: 'var(--type-body-medium-weight)',
                lineHeight: 'var(--type-body-medium-line-height)',
                letterSpacing: 'var(--type-body-medium-letter-spacing)',
                color: 'var(--color-on-surface-variant)',
              }}
            >
              <strong
                style={{ color: 'var(--color-on-surface)', fontWeight: 600 }}
              >
                Transparent pricing:
              </strong>{' '}
              Fees and membership terms are shown before payment, securely
              handled by Stripe.
            </p>
          </div>
        </div>

        <p style={{ margin: '0 0 1rem' }}>
          <a
            href="/terms"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              color: 'var(--color-primary)',
              textDecoration: 'underline',
              fontFamily: 'var(--type-label-large-font-family)',
              fontSize: 'var(--type-label-large-size)',
              fontWeight: 'var(--type-label-large-weight)',
              lineHeight: 'var(--type-label-large-line-height)',
              letterSpacing: 'var(--type-label-large-letter-spacing)',
            }}
          >
            <span>Read full terms and conditions (opens in a new tab)</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </p>

        <div
          style={{
            height: '1px',
            backgroundColor: 'var(--color-outline-variant)',
            margin: '0 0 1rem',
          }}
        />

        <label
          htmlFor="terms"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.625rem',
            cursor: 'pointer',
            fontFamily: 'var(--type-body-large-font-family)',
            fontSize: 'var(--type-body-large-size)',
            fontWeight: 'var(--type-body-large-weight)',
            lineHeight: 'var(--type-body-large-line-height)',
            letterSpacing: 'var(--type-body-large-letter-spacing)',
            color: 'var(--color-on-surface)',
          }}
        >
          <input
            id="terms"
            name="terms"
            type="checkbox"
            style={{
              marginTop: '0.25rem',
              width: '1.125rem',
              height: '1.125rem',
              accentColor: 'var(--color-primary)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            aria-invalid={state.field === 'terms' ? true : undefined}
            aria-describedby={
              state.field === 'terms' ? 'terms-error' : undefined
            }
          />
          <span>I have read and agree to the terms and conditions.</span>
        </label>
        {state.field === 'terms' && state.error ? (
          <p id="terms-error" role="alert" style={errorText}>
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

      <div style={linkRowStyle}>
        <Link href="/auth?form=signin" style={linkStyle}>
          Sign in
        </Link>
      </div>
    </form>
  );
}
