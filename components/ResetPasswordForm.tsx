'use client';

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
  resetPasswordAction,
  type ResetPasswordState,
} from '@/server/actions/reset-password';

const initialState: ResetPasswordState = {};

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="token" value={token} />

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
            <label htmlFor="newPassword" style={labelStyle}>
              New password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={12}
              style={inputStyle}
              aria-invalid={state.field === 'newPassword' ? true : undefined}
              aria-describedby={
                state.field === 'newPassword'
                  ? 'newPassword-error'
                  : undefined
              }
            />
            {state.field === 'newPassword' && state.error ? (
              <p id="newPassword-error" role="alert" style={errorTextStyle}>
                {state.error}
              </p>
            ) : null}
          </div>

          <button type="submit" style={submitButtonStyle} disabled={pending}>
            Reset password
          </button>
        </>
      )}

      <div style={linkRowStyle}>
        {state.success ? (
          <a href="/sign-in" style={linkStyle}>
            Sign in
          </a>
        ) : (
          <a href="/forgot-password" style={linkStyle}>
            Forgot password
          </a>
        )}
      </div>
    </form>
  );
}
