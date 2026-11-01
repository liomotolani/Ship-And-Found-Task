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
} from '@/components/form-styles';
import {
  signInAction,
  type SignInState,
} from '@/server/actions/sign-in';

const initialState: SignInState = {};

export default function SignInForm() {
  const [state, formAction, pending] = useActionState(
    signInAction,
    initialState,
  );

  return (
    <form action={formAction} noValidate>
      {state.error && !state.field ? (
        <p role="alert" style={errorTextStyle}>
          {state.error}
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

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="password" style={labelStyle}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          style={inputStyle}
          aria-invalid={state.field === 'password' ? true : undefined}
          aria-describedby={
            state.field === 'password' ? 'password-error' : undefined
          }
        />
        {state.field === 'password' && state.error ? (
          <p id="password-error" role="alert" style={errorTextStyle}>
            {state.error}
          </p>
        ) : null}
      </div>

      <button type="submit" style={submitButtonStyle} disabled={pending}>
        Sign in
      </button>

      <div style={linkRowStyle}>
        <Link href="/auth?form=forgot" style={linkStyle}>
          Forgot password
        </Link>
        <Link href="/auth?form=signup" style={linkStyle}>
          Sign up
        </Link>
      </div>
    </form>
  );
}
