'use client';

import Link from 'next/link';
import ErrorIcon from '@/components/ErrorIcon';
import PasswordVisibilityToggle from '@/components/PasswordVisibilityToggle';
import type { CSSProperties, FormEvent, MouseEvent } from 'react';
import { useActionState, useState } from 'react';
import { linkRowStyle, linkStyle } from '@/components/form-styles';
import { useFieldValidation } from '@/lib/use-field-validation';
import { fieldMessage } from '@/lib/validation/field-message';
import { passwordHint } from '@/lib/validation/password';
import { signUpSchema } from '@/lib/validation/sign-up';
import {
  signUpAction,
  type SignUpField,
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
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.375rem',
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
  const validation = useFieldValidation({
    name: (value) => fieldMessage(signUpSchema.shape.name, value),
    email: (value) => fieldMessage(signUpSchema.shape.email, value),
    password: (value) => fieldMessage(signUpSchema.shape.password, value),
    membershipNumber: (value) =>
      fieldMessage(signUpSchema.shape.membershipNumber, value),
    terms: (value) => fieldMessage(signUpSchema.shape.terms, value === 'on'),
  });
  const [dismissedServerErrorField, setDismissedServerErrorField] =
    useState<SignUpField | null>(null);
  const showError = (field: SignUpField) =>
    validation.errors[field] ??
    (state.field === field && dismissedServerErrorField !== field
      ? state.error
      : undefined);
  const nameError = showError('name');
  const emailError = showError('email');
  const passwordError = showError('password');
  const membershipNumberError = showError('membershipNumber');
  const termsError = showError('terms');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const passwordDescribedBy =
    [
      showPasswordHint ? 'password-hint' : null,
      passwordError ? 'password-error' : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  function handleFormInput(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const result = signUpSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      membershipNumber: formData.get('membershipNumber'),
      terms: formData.get('terms') === 'on',
    });

    setFormValid(result.success);
  }

  function handleButtonClick(event: MouseEvent<HTMLButtonElement>) {
    if (pending) {
      event.preventDefault();
      return;
    }

    const form = event.currentTarget.form;
    if (!form) {
      return;
    }

    const formData = new FormData(form);
    const values = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      membershipNumber: formData.get('membershipNumber'),
      terms: formData.get('terms') === 'on',
    };

    if (!values.terms) {
      event.preventDefault();
      setFormValid(false);
      validation.handleBlur('terms', '');
      form.querySelector<HTMLElement>('#terms')?.focus();
      return;
    }

    const result = signUpSchema.safeParse(values);

    if (result.success) {
      setFormValid(true);
      return;
    }

    event.preventDefault();
    setFormValid(false);
    validation.handleBlur('name', String(values.name ?? ''));
    validation.handleBlur('email', String(values.email ?? ''));
    validation.handleBlur('password', String(values.password ?? ''));
    validation.handleBlur(
      'membershipNumber',
      String(values.membershipNumber ?? ''),
    );
    validation.handleBlur('terms', 'on');

    const firstField = result.error.issues[0]?.path[0];
    const fieldId =
      firstField === 'membershipNumber'
        ? 'membershipNumber'
        : String(firstField ?? 'name');

    form.querySelector<HTMLElement>(`#${fieldId}`)?.focus();
  }

  return (
    <form
      action={formAction}
      noValidate
      onInput={handleFormInput}
      onSubmit={() => setDismissedServerErrorField(null)}
    >
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
          required
          aria-required="true"
          style={input}
          onBlur={(event) =>
            validation.handleBlur('name', event.currentTarget.value)
          }
          onChange={(event) => {
            setDismissedServerErrorField('name');
            validation.handleChange('name', event.currentTarget.value);
          }}
          aria-invalid={nameError ? true : undefined}
          aria-describedby={nameError ? 'name-error' : undefined}
        />
        {nameError ? (
          <p id="name-error" role="alert" style={errorText}>
            <ErrorIcon />
            <span>{nameError}</span>
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
          required
          aria-required="true"
          style={input}
          onBlur={(event) =>
            validation.handleBlur('email', event.currentTarget.value)
          }
          onChange={(event) => {
            setDismissedServerErrorField('email');
            validation.handleChange('email', event.currentTarget.value);
          }}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? 'email-error' : undefined}
        />
        {emailError ? (
          <p id="email-error" role="alert" style={errorText}>
            <ErrorIcon />
            <span>{emailError}</span>
          </p>
        ) : null}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="password" style={label}>
          Password
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            minLength={12}
            required
            aria-required="true"
            style={{ ...input, paddingRight: '2.75rem' }}
            onFocus={() => setShowPasswordHint(true)}
            onBlur={(event) => {
              setShowPasswordHint(false);
              validation.handleBlur('password', event.currentTarget.value);
            }}
            onChange={(event) => {
              setDismissedServerErrorField('password');
              validation.handleChange('password', event.currentTarget.value);
            }}
            aria-invalid={passwordError ? true : undefined}
            aria-describedby={passwordDescribedBy}
          />
          <PasswordVisibilityToggle
            visible={showPassword}
            onToggle={() => setShowPassword((current) => !current)}
          />
        </div>
        {showPasswordHint ? (
          <p
            id="password-hint"
            style={{
              fontFamily: 'var(--type-body-medium-font-family)',
              fontSize: 'var(--type-body-medium-size)',
              fontWeight: 'var(--type-body-medium-weight)',
              lineHeight: 'var(--type-body-medium-line-height)',
              letterSpacing: 'var(--type-body-medium-letter-spacing)',
              color: 'var(--color-on-surface-variant)',
              marginTop: '0.5rem',
            }}
          >
            {passwordHint}
          </p>
        ) : null}
        {passwordError ? (
          <p id="password-error" role="alert" style={errorText}>
            <ErrorIcon />
            <span>{passwordError}</span>
          </p>
        ) : null}
      </div>


      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="membershipNumber" style={label}>
          Membership number
        </label>
        <input
          id="membershipNumber"
          name="membershipNumber"
          type="text"
          required
          aria-required="true"
          style={input}
          onBlur={(event) =>
            validation.handleBlur(
              'membershipNumber',
              event.currentTarget.value,
            )
          }
          onChange={(event) => {
            setDismissedServerErrorField('membershipNumber');
            validation.handleChange(
              'membershipNumber',
              event.currentTarget.value,
            );
          }}
          aria-invalid={membershipNumberError ? true : undefined}
          aria-describedby={
            membershipNumberError ? 'membershipNumber-error' : undefined
          }
        />
        {membershipNumberError ? (
          <p id="membershipNumber-error" role="alert" style={errorText}>
            <ErrorIcon />
            <span>{membershipNumberError}</span>
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
            required
            aria-required="true"
            style={{
              marginTop: '0.25rem',
              width: '1.125rem',
              height: '1.125rem',
              accentColor: 'var(--color-primary)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onChange={(event) => {
              setDismissedServerErrorField('terms');
              validation.handleBlur(
                'terms',
                event.currentTarget.checked ? 'on' : '',
              );
            }}
            onBlur={(event) =>
              validation.handleBlur(
                'terms',
                event.currentTarget.checked ? 'on' : '',
              )
            }
            aria-invalid={termsError ? true : undefined}
            aria-describedby={termsError ? 'terms-error' : undefined}
          />
          <span>I have read and agree to the terms and conditions.</span>
        </label>
        {termsError ? (
          <p id="terms-error" role="alert" style={errorText}>
            <ErrorIcon />
            <span>{termsError}</span>
          </p>
        ) : null}
      </div>

      {state.error && !state.field ? (
        <p role="alert" style={errorText}>
          <ErrorIcon />
          <span>{state.error}</span>
        </p>
      ) : null}

      <button
        type="submit"
        className="primary-focus"
        style={{
          ...submitButton,
          opacity: pending || !formValid ? 0.6 : 1,
          cursor: pending || !formValid ? 'not-allowed' : 'pointer',
        }}
        disabled={pending}
        aria-disabled={pending || !formValid}
        onClick={handleButtonClick}
      >
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
