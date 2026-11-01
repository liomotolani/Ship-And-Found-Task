'use client';

import { useActionState, useState } from 'react';
import {
  errorTextStyle,
  inputStyle,
  labelStyle,
  linkRowStyle,
  linkStyle,
  submitButtonStyle,
  successTextStyle,
} from '@/components/form-styles';
import PasswordVisibilityToggle from '@/components/PasswordVisibilityToggle';
import { useFieldValidation } from '@/lib/use-field-validation';
import { fieldMessage } from '@/lib/validation/field-message';
import { passwordHint } from '@/lib/validation/password';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const newPasswordDescribedBy =
    [
      showPasswordHint ? 'newPassword-hint' : null,
      newPasswordError ? 'newPassword-error' : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

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
            <div style={{ position: 'relative' }}>
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                minLength={12}
                required
                aria-required="true"
                style={{ ...inputStyle, paddingRight: '2.75rem' }}
                onFocus={() => setShowPasswordHint(true)}
                onBlur={(event) => {
                  setShowPasswordHint(false);
                  validation.handleBlur(
                    'newPassword',
                    event.currentTarget.value,
                  );
                }}
                onChange={(event) =>
                  validation.handleChange(
                    'newPassword',
                    event.currentTarget.value,
                  )
                }
                aria-invalid={newPasswordError ? true : undefined}
                aria-describedby={newPasswordDescribedBy}
              />
              <PasswordVisibilityToggle
                visible={showPassword}
                onToggle={() => setShowPassword((current) => !current)}
              />
            </div>
            {showPasswordHint ? (
              <p
                id="newPassword-hint"
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
