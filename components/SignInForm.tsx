'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import {
  errorTextStyle,
  inputStyle,
  labelStyle,
  linkRowStyle,
  linkStyle,
  submitButtonStyle,
} from '@/components/form-styles';
import PasswordVisibilityToggle from '@/components/PasswordVisibilityToggle';
import { useFieldValidation } from '@/lib/use-field-validation';
import { fieldMessage } from '@/lib/validation/field-message';
import { signInSchema } from '@/lib/validation/sign-in';
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
  const validation = useFieldValidation({
    email: (value) => fieldMessage(signInSchema.shape.email, value),
    password: (value) => fieldMessage(signInSchema.shape.password, value),
  });
  const showError = (field: 'email' | 'password') =>
    validation.errors[field] ??
    (!validation.touched[field] && state.field === field
      ? state.error
      : undefined);
  const emailError = showError('email');
  const passwordError = showError('password');
  const [showPassword, setShowPassword] = useState(false);

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
          required
          aria-required="true"
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

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="password" style={labelStyle}>
          Password
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            aria-required="true"
            style={{ ...inputStyle, paddingRight: '2.75rem' }}
            onBlur={(event) =>
              validation.handleBlur('password', event.currentTarget.value)
            }
            onChange={(event) =>
              validation.handleChange('password', event.currentTarget.value)
            }
            aria-invalid={passwordError ? true : undefined}
            aria-describedby={passwordError ? 'password-error' : undefined}
          />
          <PasswordVisibilityToggle
            visible={showPassword}
            onToggle={() => setShowPassword((current) => !current)}
          />
        </div>
        {passwordError ? (
          <p id="password-error" role="alert" style={errorTextStyle}>
            {passwordError}
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
