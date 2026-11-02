'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import {
  errorTextStyle,
  inputStyle,
  labelStyle,
  linkRowStyle,
  linkStyle,
  submitButtonStyle,
  successTextStyle,
} from '@/components/form-styles';
import {
  verifyEmailAction,
  type VerifyEmailState,
} from '@/server/actions/verify-email';

const initialState: VerifyEmailState = {};

export default function VerifyEmailForm() {
  const [state, formAction, pending] = useActionState(
    verifyEmailAction,
    initialState,
  );
  const codeError = state.field === 'code' ? state.error : undefined;

  return (
    <form action={formAction} noValidate>
      {state.success ? (
        <p role="status" style={successTextStyle}>
          {state.success}
        </p>
      ) : null}

      {state.error && !state.field ? (
        <p role="alert" style={errorTextStyle}>
          {state.error}
        </p>
      ) : null}

      {state.success ? null : (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="code" style={labelStyle}>
              Verification code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              aria-required="true"
              style={inputStyle}
              aria-invalid={codeError ? true : undefined}
              aria-describedby={codeError ? 'code-error' : undefined}
            />
            {codeError ? (
              <p id="code-error" role="alert" style={errorTextStyle}>
                {codeError}
              </p>
            ) : null}
          </div>

          <button type="submit" style={submitButtonStyle} disabled={pending}>
            Verify email
          </button>
        </>
      )}

      <div style={linkRowStyle}>
        <Link href="/auth?form=signin" style={linkStyle}>
          Sign in
        </Link>
      </div>
    </form>
  );
}
