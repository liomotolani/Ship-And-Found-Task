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
import { useFieldValidation } from '@/lib/use-field-validation';
import { fieldMessage } from '@/lib/validation/field-message';
import { resetPasswordSchema } from '@/lib/validation/reset-password';
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
  const validation = useFieldValidation({
    newPassword: (value) =>
      fieldMessage(resetPasswordSchema.shape.newPassword, value),
  });
  const newPasswordError =
    validation.errors.newPassword ??
    (!validation.touched.newPassword && state.field === 'newPassword'
      ? state.error
      : undefined);

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
              onBlur={(event) =>
                validation.handleBlur(
                  'newPassword',
                  event.currentTarget.value,
                )
              }
              onChange={(event) =>
                validation.handleChange(
                  'newPassword',
                  event.currentTarget.value,
                )
              }
              aria-invalid={newPasswordError ? true : undefined}
              aria-describedby={
                newPasswordError ? 'newPassword-error' : undefined
              }
            />
            {newPasswordError ? (
              <p id="newPassword-error" role="alert" style={errorTextStyle}>
                {newPasswordError}
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
