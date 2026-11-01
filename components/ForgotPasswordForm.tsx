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
  forgotPasswordAction,
  type ForgotPasswordState,
} from '@/server/actions/forgot-password';

const initialState: ForgotPasswordState = {};

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    forgotPasswordAction,
    initialState,
  );

  return (
    <form action={formAction} noValidate>
      {state.success ? (
        <p role="status" style={successTextStyle}>
          {state.success}
        </p>
      ) : null}

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="email" style={labelStyle}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          style={inputStyle}
          aria-invalid={state.field === 'email' ? true : undefined}
          aria-describedby={
            state.field === 'email' ? 'email-error' : undefined
          }
        />
        {state.field === 'email' && state.error ? (
          <p id="email-error" role="alert" style={errorTextStyle}>
            {state.error}
          </p>
        ) : null}
      </div>

      <button type="submit" style={submitButtonStyle} disabled={pending}>
        Send reset link
      </button>

      <div style={linkRowStyle}>
        <Link href="/auth?form=signin" style={linkStyle}>
          Sign in
        </Link>
      </div>
    </form>
  );
}
