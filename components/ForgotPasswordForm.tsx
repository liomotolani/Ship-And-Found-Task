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
import { useFieldValidation } from '@/lib/use-field-validation';
import { fieldMessage } from '@/lib/validation/field-message';
import { forgotPasswordSchema } from '@/lib/validation/forgot-password';
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
  const validation = useFieldValidation({
    email: (value) => fieldMessage(forgotPasswordSchema.shape.email, value),
  });
  const emailError =
    validation.errors.email ??
    (!validation.touched.email && state.field === 'email'
      ? state.error
      : undefined);

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
          onBlur={(event) =>
            validation.handleBlur('email', event.currentTarget.value)
          }
          onChange={(event) =>
            validation.handleChange('email', event.currentTarget.value)
          }
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? 'email-error' : undefined}
        />
        {emailError ? (
          <p id="email-error" role="alert" style={errorTextStyle}>
            {emailError}
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
